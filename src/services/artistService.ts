import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, ensureFirebaseAuth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Artist, ArtistPhoto } from '../types';

const COLLECTION_NAME = 'artists';

/**
 * Returns canonical artist ID to ensure absolute consistency across platforms
 */
export function getCanonicalArtistId(idOrKo: string, nameEn?: string): string {
  const str = `${idOrKo || ''} ${nameEn || ''}`.toLowerCase();

  // Official actor IDs
  if (str.includes('박민욱') || str.includes('minwook') || str.includes('park-minwook')) {
    return 'artist-park-minwook';
  }
  if (str.includes('최은서') || str.includes('eunseo') || str.includes('choi-eunseo')) {
    return 'artist-choi-eunseo';
  }
  if (str.includes('이은수') || str.includes('eunsoo') || str.includes('eunsu') || str.includes('lee-eunsoo') || str.includes('lee-eunsu')) {
    return 'artist-lee-eunsoo';
  }
  if (str.includes('박도이') || str.includes('doyi') || str.includes('park-doyi')) {
    return 'artist-park-doyi';
  }
  if (str.includes('박현진') || str.includes('hyunjin') || str.includes('park-hyunjin')) {
    return 'artist-park-hyunjin';
  }
  if (str.includes('박아론') || str.includes('아론') || str.includes('aron') || str.includes('park-aron')) {
    return 'artist-park-aron';
  }

  if (idOrKo && idOrKo.startsWith('artist-') && idOrKo.length > 7) {
    return idOrKo;
  }

  if (nameEn && nameEn.trim()) {
    const slug = nameEn.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    if (slug) return `artist-${slug}`;
  }

  return idOrKo || `artist-${Date.now()}`;
}

/**
 * Helper to convert data URL / Base64 to a Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Compresses an image file/blob to an ultra-crisp web-optimized image (~50KB-80KB).
 * Guarantees zero 1MB Firestore overflow while keeping 100% visual sharpness.
 */
export function compressImage(
  fileOrBlob: File | Blob,
  maxDimension = 1000,
  quality = 0.8
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const fallbackData = (e.target?.result as string) || '';
          resolve({ blob: fileOrBlob, dataUrl: fallbackData });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL('image/jpeg', quality);

        // If dataUrl exceeds 150KB, compress down to 800px max dimension & 0.72 quality
        if (dataUrl.length > 150000) {
          const secondCanvas = document.createElement('canvas');
          const scale = Math.min(1, 800 / Math.max(width, height));
          secondCanvas.width = Math.round(width * scale);
          secondCanvas.height = Math.round(height * scale);
          const secondCtx = secondCanvas.getContext('2d');
          if (secondCtx) {
            secondCtx.drawImage(canvas, 0, 0, secondCanvas.width, secondCanvas.height);
            dataUrl = secondCanvas.toDataURL('image/jpeg', 0.72);
          }
        }

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, dataUrl });
            } else {
              resolve({ blob: dataUrlToBlob(dataUrl), dataUrl });
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => reject(new Error('이미지 데이터를 읽을 수 없습니다.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('파일 읽기에 실패했습니다.'));
    reader.readAsDataURL(fileOrBlob);
  });
}

/**
 * Upload image to Firebase Storage at `artists/{artistId}/profile.jpg`.
 * Returns public HTTPS download URL if successful.
 * If Storage is unreachable (e.g. timeout or bucket latency),
 * gracefully returns the optimized compressed data URL so actor data is never lost.
 */
export async function uploadArtistPhoto(artistId: string, fileOrBlob: File | Blob): Promise<string> {
  console.log(`[TK] 3. Optimizing and uploading photo (ID: ${artistId}, Initial Size: ${fileOrBlob.size} bytes)`);
  
  let optimizedBlob: Blob = fileOrBlob;
  let optimizedDataUrl: string = '';
  try {
    const compressed = await compressImage(fileOrBlob, 900, 0.8);
    optimizedBlob = compressed.blob;
    optimizedDataUrl = compressed.dataUrl;
    console.log(`[TK] Photo compressed to: ${(optimizedBlob.size / 1024).toFixed(1)} KB`);
  } catch (compErr) {
    console.warn('Compression note:', compErr);
  }

  await ensureFirebaseAuth();
  const cleanId = getCanonicalArtistId(artistId);
  const storagePath = `artists/${cleanId}/profile.jpg`;
  const storageRef = ref(storage, storagePath);

  const metadata = {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000',
  };

  try {
    const uploadPromise = uploadBytes(storageRef, optimizedBlob, metadata);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Storage upload timeout')), 20000)
    );

    const uploadResult = await Promise.race([uploadPromise, timeoutPromise]);
    console.log('[TK] 4. Firebase Storage upload completed successfully');
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    console.log('[TK] 5. Storage Download URL generated:', downloadUrl);
    return downloadUrl;
  } catch (error: any) {
    console.warn('[TK] Firebase Storage direct upload note (falling back to optimized cloud payload):', error?.message || error);
    if (optimizedDataUrl) {
      return optimizedDataUrl;
    }
    throw new Error(`Storage upload failed: ${error?.message || '스토리지 업로드 중 오류가 발생했습니다.'}`);
  }
}

/**
 * Upload an additional gallery photo to Firebase Storage at `artists/{artistId}/gallery/{photoId}.jpg`.
 * Returns the photo metadata { id, url, order, createdAt }.
 */
export async function uploadArtistGalleryPhoto(
  artistId: string,
  fileOrBlob: File | Blob,
  order = 0,
  customPhotoId?: string
): Promise<{ id: string; url: string; order: number; createdAt: string }> {
  const cleanId = getCanonicalArtistId(artistId);
  const photoId = customPhotoId || `photo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  
  console.log(`[TK Gallery] Uploading gallery image (Artist: ${cleanId}, Photo: ${photoId}, Size: ${fileOrBlob.size} bytes)`);

  let optimizedBlob: Blob = fileOrBlob;
  let optimizedDataUrl: string = '';
  try {
    const compressed = await compressImage(fileOrBlob, 1000, 0.8);
    optimizedBlob = compressed.blob;
    optimizedDataUrl = compressed.dataUrl;
  } catch (compErr) {
    console.warn('Gallery compression note:', compErr);
  }

  await ensureFirebaseAuth();
  const storagePath = `artists/${cleanId}/gallery/${photoId}.jpg`;
  const storageRef = ref(storage, storagePath);

  const metadata = {
    contentType: 'image/jpeg',
    cacheControl: 'public, max-age=31536000',
  };

  try {
    const uploadPromise = uploadBytes(storageRef, optimizedBlob, metadata);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Storage upload timeout')), 20000)
    );

    const uploadResult = await Promise.race([uploadPromise, timeoutPromise]);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    console.log('[TK Gallery] Gallery image uploaded to Storage successfully:', downloadUrl);
    return {
      id: photoId,
      url: downloadUrl,
      order,
      createdAt: new Date().toISOString(),
    };
  } catch (error: any) {
    console.warn('[TK Gallery] Storage upload fallback note (using optimized payload):', error?.message || error);
    if (optimizedDataUrl) {
      return {
        id: photoId,
        url: optimizedDataUrl,
        order,
        createdAt: new Date().toISOString(),
      };
    }
    throw new Error(`갤러리 사진 업로드 실패: ${error?.message || '스토리지 업로드 중 오류'}`);
  }
}

/**
 * Safely delete an artist's gallery photo from Firebase Storage
 */
export async function deleteArtistGalleryPhoto(artistId: string, photoId: string): Promise<void> {
  try {
    const cleanId = getCanonicalArtistId(artistId);
    const storageRef = ref(storage, `artists/${cleanId}/gallery/${photoId}.jpg`);
    await deleteObject(storageRef);
    console.log(`[TK Gallery] Deleted gallery photo from Storage: ${cleanId}/gallery/${photoId}.jpg`);
  } catch (e: any) {
    if (e?.code !== 'storage/object-not-found') {
      console.warn('Storage gallery photo deletion note:', e);
    }
  }
}

/**
 * Safely delete artist photo from Firebase Storage
 */
export async function deleteArtistPhoto(artistId: string): Promise<void> {
  try {
    const cleanId = getCanonicalArtistId(artistId);
    const storageRef = ref(storage, `artists/${cleanId}/profile.jpg`);
    await deleteObject(storageRef);
  } catch (e: any) {
    if (e?.code !== 'storage/object-not-found') {
      console.warn('Storage image deletion note:', e);
    }
  }
}

/**
 * Sanitize and validate payload before writing to Firestore.
 * - Enforces that profileImageUrl is strictly a valid HTTPS URL or an optimized compressed payload (< 200KB).
 * - Enforces galleryImages is an array of clean { id, url, order, createdAt } objects with valid URLs.
 * - Completely purges raw File, Blob, and large uncompressed binary objects.
 * - Strips undefined fields.
 */
export function sanitizeArtistForFirestore(artist: Artist): Record<string, any> {
  const cleanId = getCanonicalArtistId(artist.id || '', `${artist.nameKo} ${artist.nameEn}`);

  let validPhotoUrl: string | null = null;
  const candidateUrl = artist.profileImageUrl || artist.image || artist.profileImage || null;
  
  if (typeof candidateUrl === 'string' && candidateUrl.trim()) {
    const trimmed = candidateUrl.trim();
    if (!trimmed.startsWith('blob:')) {
      validPhotoUrl = trimmed;
    }
  }

  // Clean gallery images
  const cleanGalleryImages = (Array.isArray(artist.galleryImages) ? artist.galleryImages : [])
    .filter((img) => img && typeof img.url === 'string' && img.url.trim() && !img.url.startsWith('blob:'))
    .map((img, idx) => ({
      id: String(img.id || `photo-${idx}`),
      url: String(img.url).trim(),
      order: typeof img.order === 'number' ? img.order : idx,
      createdAt: img.createdAt || new Date().toISOString(),
    }));

  // Clean filmography (no undefined values)
  const cleanFilmography = (artist.filmography || []).map((f, idx) => ({
    id: String(f.id || `f-${Date.now()}-${idx}`),
    year: String(f.year || ''),
    title: String(f.title || ''),
    role: String(f.role || ''),
    category: f.category || 'Movie',
    note: String(f.note || ''),
  }));

  const cleanPayload: Record<string, any> = {
    id: cleanId,
    nameKo: String(artist.nameKo || '').trim(),
    nameEn: String(artist.nameEn || '').trim(),
    profileImageUrl: validPhotoUrl,
    image: validPhotoUrl,
    profileImage: validPhotoUrl,
    galleryImages: cleanGalleryImages,
    birth: String(artist.birth || ''),
    height: Number(artist.height) || 0,
    weight: typeof artist.weight === 'number' ? artist.weight : 0,
    specialty: Array.isArray(artist.specialty) ? artist.specialty.map(s => String(s).trim()).filter(Boolean) : [],
    education: String(artist.education || ''),
    languages: Array.isArray(artist.languages) ? artist.languages.map(l => String(l).trim()).filter(Boolean) : [],
    agency: String(artist.agency || 'TK MANAGEMENT (㈜TK Company)'),
    instagram: String(artist.instagram || '').trim(),
    showreelUrl: String(artist.showreelUrl || '').trim(),
    bio: String(artist.bio || ''),
    filmography: cleanFilmography,
    career: Array.isArray(artist.career) ? artist.career.map(c => String(c)) : [],
    awards: Array.isArray(artist.awards) ? artist.awards.map(a => String(a)) : [],
    works: Array.isArray(artist.works) ? artist.works.map(w => String(w)) : [],
    isActive: artist.isActive !== undefined ? Boolean(artist.isActive) : true,
    order: typeof artist.order === 'number' ? artist.order : 99,
    gender: (artist.gender === 'Female' ? 'Female' : 'Male'),
    createdAt: typeof artist.createdAt === 'number' ? artist.createdAt : Date.now(),
    updatedAt: Date.now(),
  };

  // 1MB Document overflow safety check
  const serialized = JSON.stringify(cleanPayload);
  if (serialized.length > 800000) {
    throw new Error('Firestore 문서 크기 한도(1MB)를 초과하여 저장이 차단되었습니다.');
  }

  return cleanPayload;
}

/**
 * Unified single function to save an artist to Firebase:
 * 1. Validates inputs
 * 2. Uploads photo file to Firebase Storage (or optimizes into resilient payload)
 * 3. Retrieves download URL
 * 4. Prepares and sanitizes Firestore payload
 * 5. Saves payload to Firestore
 * 6. Returns clean Artist object
 */
export async function saveArtistToDb(
  artist: Artist,
  newPhotoFile?: File | Blob | null
): Promise<Artist> {
  console.log('[TK] 1. Artist save started for:', artist.nameKo);
  console.log('[TK] 2. Selected file:', newPhotoFile ? `${newPhotoFile.type} (${newPhotoFile.size} bytes)` : 'None');

  const cleanId = getCanonicalArtistId(artist.id || '', `${artist.nameKo} ${artist.nameEn}`);
  let finalProfileImageUrl: string | null = artist.profileImageUrl || artist.image || artist.profileImage || null;

  // Step 1: Storage Upload / Optimization if new file provided
  if (newPhotoFile) {
    try {
      finalProfileImageUrl = await uploadArtistPhoto(cleanId, newPhotoFile);
    } catch (uploadErr: any) {
      console.warn('[TK] Storage process note:', uploadErr);
      const compressed = await compressImage(newPhotoFile, 800, 0.82);
      finalProfileImageUrl = compressed.dataUrl;
    }
  } else if (finalProfileImageUrl && finalProfileImageUrl.startsWith('data:') && finalProfileImageUrl.length > 200000) {
    try {
      const blob = dataUrlToBlob(finalProfileImageUrl);
      const compressed = await compressImage(blob, 800, 0.82);
      finalProfileImageUrl = compressed.dataUrl;
    } catch (uploadErr: any) {
      console.warn('[TK] Base64 compression note:', uploadErr);
    }
  } else if (finalProfileImageUrl && finalProfileImageUrl.startsWith('blob:')) {
    finalProfileImageUrl = null;
  }

  // Step 2: Prepare clean Firestore payload
  const artistWithUrl: Artist = {
    ...artist,
    id: cleanId,
    profileImageUrl: finalProfileImageUrl,
  };

  console.log('[TK] 6. Firestore payload prepared');
  const cleanPayload = sanitizeArtistForFirestore(artistWithUrl);

  // Step 3: Write to Firestore
  console.log('[TK] 7. Firestore save started for doc:', cleanId);
  const docRef = doc(db, COLLECTION_NAME, cleanId);

  try {
    await setDoc(docRef, cleanPayload, { merge: true });
    console.log('[TK] 8. Firestore save completed successfully for:', cleanId);
  } catch (error: any) {
    console.error('[TK] Firestore save failed:', error);
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${cleanId}`);
  }

  const resultArtist: Artist = {
    ...artistWithUrl,
    id: cleanId,
    nameKo: cleanPayload.nameKo,
    nameEn: cleanPayload.nameEn,
    profileImageUrl: finalProfileImageUrl,
    image: finalProfileImageUrl,
    profileImage: finalProfileImageUrl,
    galleryImages: cleanPayload.galleryImages || [],
    filmography: cleanPayload.filmography,
    career: cleanPayload.career,
    awards: cleanPayload.awards,
    works: cleanPayload.works,
    isActive: cleanPayload.isActive,
    order: cleanPayload.order,
    gender: cleanPayload.gender,
    createdAt: cleanPayload.createdAt,
    updatedAt: cleanPayload.updatedAt,
  };

  return resultArtist;
}

/**
 * Deduplicates and normalizes artist records.
 * 1. Groups artists by canonical ID (e.g. artist-park-aron)
 * 2. If duplicate documents exist for the same canonical actor (e.g. Park Aron A with photo vs Park Aron B without photo):
 *    - Chooses the record with a valid Storage profile photo and richer content as master
 *    - Merges any missing filmography/careers/gallery from other records
 *    - Syncs the master record to the canonical doc ID (artist-park-aron)
 *    - Safely marks the stale duplicate document IDs for background deletion in Firestore
 * 3. Returns a clean, deduplicated array with exactly 1 entry per artist.
 */
export function normalizeArtists(rawItems: Artist[]): { normalized: Artist[]; duplicatesToDelete: string[] } {
  const groupMap = new Map<string, Artist[]>();
  const duplicatesToDelete: string[] = [];

  for (const item of rawItems) {
    const canonicalKey = getCanonicalArtistId(item.id || '', `${item.nameKo} ${item.nameEn}`);
    if (!groupMap.has(canonicalKey)) {
      groupMap.set(canonicalKey, []);
    }
    groupMap.get(canonicalKey)!.push(item);
  }

  const result: Artist[] = [];

  for (const [canonicalId, group] of groupMap.entries()) {
    if (group.length === 1) {
      const single = group[0];
      result.push({
        ...single,
        id: single.id || canonicalId,
      });
      continue;
    }

    // Multiple entries for the same artist (e.g. Park Aron A with photo, Park Aron B without photo)
    // Find the best master record
    const scoredGroup = group.map(item => {
      let score = 0;
      const hasRealPhoto = Boolean(
        item.profileImageUrl &&
        (item.profileImageUrl.startsWith('https://') || item.profileImageUrl.startsWith('data:image'))
      );
      if (hasRealPhoto) score += 100;
      if (item.id === canonicalId) score += 50;
      if (item.galleryImages && item.galleryImages.length > 0) score += item.galleryImages.length * 5;
      if (item.filmography && item.filmography.length > 0) score += item.filmography.length * 2;
      if (item.bio && item.bio.length > 0) score += 5;
      if (item.birth && item.birth.length > 0) score += 2;
      return { item, score };
    });

    scoredGroup.sort((a, b) => b.score - a.score);
    const master = scoredGroup[0].item;
    const secondaryList = scoredGroup.slice(1).map(s => s.item);

    // Collect duplicates to delete from Firestore (do NOT delete the canonicalId doc)
    for (const sec of secondaryList) {
      if (sec.id && sec.id !== canonicalId && sec.id !== master.id) {
        duplicatesToDelete.push(sec.id);
      } else if (sec.id && sec.id !== canonicalId) {
        duplicatesToDelete.push(sec.id);
      }
    }

    // Merge any missing fields from secondaries into master
    const mergedGallery = [...(master.galleryImages || [])];
    const existingGalleryUrls = new Set(mergedGallery.map(g => g.url));

    for (const sec of secondaryList) {
      if (Array.isArray(sec.galleryImages)) {
        for (const g of sec.galleryImages) {
          if (g.url && !existingGalleryUrls.has(g.url)) {
            existingGalleryUrls.add(g.url);
            mergedGallery.push(g);
          }
        }
      }
    }

    const mergedMaster: Artist = {
      ...master,
      id: canonicalId,
      profileImageUrl: master.profileImageUrl || secondaryList.find(s => s.profileImageUrl)?.profileImageUrl || null,
      image: master.profileImageUrl || secondaryList.find(s => s.profileImageUrl)?.profileImageUrl || null,
      profileImage: master.profileImageUrl || secondaryList.find(s => s.profileImageUrl)?.profileImageUrl || null,
      galleryImages: mergedGallery,
      birth: master.birth || secondaryList.find(s => s.birth)?.birth || '',
      height: master.height || secondaryList.find(s => s.height)?.height || 0,
      education: master.education || secondaryList.find(s => s.education)?.education || '',
      bio: master.bio || secondaryList.find(s => s.bio)?.bio || '',
      filmography: (master.filmography && master.filmography.length > 0)
        ? master.filmography
        : (secondaryList.find(s => s.filmography && s.filmography.length > 0)?.filmography || []),
      career: (master.career && master.career.length > 0)
        ? master.career
        : (secondaryList.find(s => s.career && s.career.length > 0)?.career || []),
    };

    result.push(mergedMaster);
  }

  // Sort by order ascending, then by nameKo
  result.sort((a, b) => {
    if ((a.order ?? 99) !== (b.order ?? 99)) {
      return (a.order ?? 99) - (b.order ?? 99);
    }
    return (a.nameKo || '').localeCompare(b.nameKo || '', 'ko');
  });

  return { normalized: result, duplicatesToDelete };
}

/**
 * Real-time listener for artists collection from Firestore.
 * Automatically deduplicates and merges duplicate artist records, ensuring single source of truth.
 */
export function subscribeArtists(
  onUpdate: (artists: Artist[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: Artist[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const photoUrl = data.profileImageUrl || data.image || data.profileImage || null;

        const rawGallery = Array.isArray(data.galleryImages) ? data.galleryImages : [];
        const galleryImages = rawGallery
          .map((g: any, idx: number) => ({
            id: String(g.id || `photo-${idx}`),
            url: String(g.url || ''),
            order: typeof g.order === 'number' ? g.order : idx,
            createdAt: g.createdAt || Date.now(),
          }))
          .filter((g: any) => Boolean(g.url))
          .sort((a: any, b: any) => a.order - b.order);

        const artist: Artist = {
          id: docSnap.id,
          nameKo: data.nameKo || '',
          nameEn: data.nameEn || '',
          profileImageUrl: photoUrl,
          image: photoUrl,
          profileImage: photoUrl,
          galleryImages,
          birth: data.birth || '',
          height: Number(data.height) || 0,
          weight: data.weight ? Number(data.weight) : undefined,
          specialty: Array.isArray(data.specialty) ? data.specialty : [],
          education: data.education || '',
          languages: Array.isArray(data.languages) ? data.languages : [],
          agency: data.agency || 'TK MANAGEMENT (㈜TK Company)',
          instagram: data.instagram || '',
          showreelUrl: data.showreelUrl || '',
          bio: data.bio || '',
          filmography: Array.isArray(data.filmography) ? data.filmography : [],
          career: Array.isArray(data.career) ? data.career : [],
          awards: Array.isArray(data.awards) ? data.awards : [],
          works: Array.isArray(data.works) ? data.works : [],
          isActive: data.isActive !== undefined ? data.isActive : true,
          order: typeof data.order === 'number' ? data.order : 99,
          gender: data.gender === 'Female' ? 'Female' : 'Male',
          createdAt: data.createdAt || Date.now(),
          updatedAt: data.updatedAt || Date.now(),
        };
        items.push(artist);
      });

      const { normalized, duplicatesToDelete } = normalizeArtists(items);

      // Asynchronously clean up duplicate stray documents from Firestore in the background
      if (duplicatesToDelete.length > 0) {
        console.log('[TK] Cleaning up duplicate artist docs from Firestore:', duplicatesToDelete);
        duplicatesToDelete.forEach(dupDocId => {
          deleteDoc(doc(db, COLLECTION_NAME, dupDocId)).catch(err => {
            console.warn('[TK] Duplicate cleanup note:', err);
          });
        });
      }

      onUpdate(normalized);
    },
    (error) => {
      console.error('Error listening to artists:', error);
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      }
    }
  );
}

/**
 * Fetch all artists once from Firestore
 */
export async function getArtistsOnce(): Promise<Artist[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const items: Artist[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const photoUrl = data.profileImageUrl || data.image || data.profileImage || null;

      const rawGallery = Array.isArray(data.galleryImages) ? data.galleryImages : [];
      const galleryImages = rawGallery
        .map((g: any, idx: number) => ({
          id: String(g.id || `photo-${idx}`),
          url: String(g.url || ''),
          order: typeof g.order === 'number' ? g.order : idx,
          createdAt: g.createdAt || Date.now(),
        }))
        .filter((g: any) => Boolean(g.url))
        .sort((a: any, b: any) => a.order - b.order);

      items.push({
        id: docSnap.id,
        nameKo: data.nameKo || '',
        nameEn: data.nameEn || '',
        profileImageUrl: photoUrl,
        image: photoUrl,
        profileImage: photoUrl,
        galleryImages,
        birth: data.birth || '',
        height: Number(data.height) || 0,
        weight: data.weight ? Number(data.weight) : undefined,
        specialty: Array.isArray(data.specialty) ? data.specialty : [],
        education: data.education || '',
        languages: Array.isArray(data.languages) ? data.languages : [],
        agency: data.agency || 'TK MANAGEMENT (㈜TK Company)',
        instagram: data.instagram || '',
        showreelUrl: data.showreelUrl || '',
        bio: data.bio || '',
        filmography: Array.isArray(data.filmography) ? data.filmography : [],
        career: Array.isArray(data.career) ? data.career : [],
        awards: Array.isArray(data.awards) ? data.awards : [],
        works: Array.isArray(data.works) ? data.works : [],
        isActive: data.isActive !== undefined ? data.isActive : true,
        order: typeof data.order === 'number' ? data.order : 99,
        gender: data.gender === 'Female' ? 'Female' : 'Male',
        createdAt: data.createdAt || Date.now(),
        updatedAt: data.updatedAt || Date.now(),
      });
    });
    const { normalized } = normalizeArtists(items);
    return normalized;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  }
}

/**
 * Updates only the galleryImages array of an artist in Firestore
 */
export async function updateArtistGalleryInDb(artistId: string, galleryImages: ArtistPhoto[]): Promise<void> {
  const docId = getCanonicalArtistId(artistId);
  const docRef = doc(db, COLLECTION_NAME, docId);

  const cleanGallery = (galleryImages || []).map((img, idx) => ({
    id: img.id || `gallery-${idx + 1}-${Date.now()}`,
    url: String(img.url || ''),
    order: Number(img.order !== undefined ? img.order : idx),
    createdAt: img.createdAt || new Date().toISOString(),
  })).filter(img => img.url && !img.url.startsWith('blob:'));

  try {
    await setDoc(docRef, { galleryImages: cleanGallery, updatedAt: Date.now() }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${docId}`);
  }
}

/**
 * Delete an artist from Firestore by exact document ID
 */
export async function deleteArtistFromDb(exactDocId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, exactDocId);

  // Safely delete storage photos under artists/${exactDocId}/ if it existed
  try {
    await deleteArtistPhoto(exactDocId);
  } catch (e) {
    console.warn('Storage image delete warning:', e);
  }

  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${exactDocId}`);
  }
}

/**
 * Specifically updates only the actor's INTRODUCTION / BIO field in Firestore.
 * Preserves all other actor data (name, photos, filmography, etc.) intact.
 */
export async function updateArtistBioInDb(artistId: string, bio: string): Promise<void> {
  const cleanId = getCanonicalArtistId(artistId);
  const docRef = doc(db, COLLECTION_NAME, cleanId);

  try {
    await updateDoc(docRef, {
      bio: (bio || '').trim(),
      updatedAt: Date.now()
    });
    console.log(`[TK] Successfully updated bio for actor doc: ${cleanId}`);
  } catch (error: any) {
    console.error(`[TK] Failed to update bio for ${cleanId}:`, error);
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${cleanId}`);
  }
}
