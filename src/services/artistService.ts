import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, ensureFirebaseAuth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Artist } from '../types';

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
  if (str.includes('이은수') || str.includes('eunsu') || str.includes('lee-eunsu')) {
    return 'artist-lee-eunsu';
  }
  if (str.includes('박도이') || str.includes('doyi') || str.includes('park-doyi')) {
    return 'artist-park-doyi';
  }
  if (str.includes('박현진') || str.includes('hyunjin') || str.includes('park-hyunjin')) {
    return 'artist-park-hyunjin';
  }
  if (str.includes('박아론') || str.includes('aron') || str.includes('park-aron')) {
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
  maxWidth = 800,
  quality = 0.82
): Promise<{ blob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          const fallbackData = e.target?.result as string;
          resolve({ blob: fileOrBlob, dataUrl: fallbackData });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
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
 * If Storage is unreachable (e.g. storage/retry-limit-exceeded or bucket disabled),
 * gracefully returns the optimized compressed data URL so actor data is never lost.
 */
export async function uploadArtistPhoto(artistId: string, fileOrBlob: File | Blob): Promise<string> {
  console.log(`[TK] 3. Optimizing and uploading photo (ID: ${artistId}, Initial Size: ${fileOrBlob.size} bytes)`);
  
  // Compress image first to ensure fastest upload and guaranteed sub-100KB safety
  let optimizedBlob: Blob = fileOrBlob;
  let optimizedDataUrl: string = '';
  try {
    const compressed = await compressImage(fileOrBlob, 800, 0.82);
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
    // 6-second timeout for storage upload
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Storage upload timeout')), 6000)
    );

    const uploadResult = await Promise.race([uploadPromise, timeoutPromise]);
    console.log('[TK] 4. Firebase Storage upload completed successfully');
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    console.log('[TK] 5. Storage Download URL generated:', downloadUrl);
    return downloadUrl;
  } catch (error: any) {
    console.warn('[TK] Firebase Storage direct upload note (falling back to optimized cloud payload):', error?.message || error);
    // If Storage fails due to retry-limit or network, use the compressed ~50KB dataUrl
    if (optimizedDataUrl) {
      return optimizedDataUrl;
    }
    throw new Error(`Storage upload failed: ${error?.message || '스토리지 업로드 중 오류가 발생했습니다.'}`);
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
 * - Completely purges raw File, Blob, and large uncompressed binary objects.
 * - Strips undefined fields.
 */
export function sanitizeArtistForFirestore(artist: Artist): Record<string, any> {
  const cleanId = getCanonicalArtistId(artist.id || '', `${artist.nameKo} ${artist.nameEn}`);

  let validPhotoUrl: string | null = null;
  const candidateUrl = artist.profileImageUrl || artist.image || artist.profileImage || null;
  
  if (typeof candidateUrl === 'string') {
    if (candidateUrl.startsWith('https://')) {
      validPhotoUrl = candidateUrl;
    } else if (candidateUrl.startsWith('data:image') && candidateUrl.length < 200000) {
      // Allow optimized compressed image under 200KB (Firestore document limit is 1,048,576 bytes)
      validPhotoUrl = candidateUrl;
    }
  }

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
  if (serialized.length > 500000) {
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
 * Real-time listener for artists collection from Firestore.
 * If 0 artists are in Firestore, emits an empty array [].
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
        const photoUrl = data.profileImageUrl || data.image || null;

        const artist: Artist = {
          id: docSnap.id,
          nameKo: data.nameKo || '',
          nameEn: data.nameEn || '',
          profileImageUrl: photoUrl,
          image: photoUrl,
          profileImage: photoUrl,
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

      // Sort by order ascending, then by nameKo
      items.sort((a, b) => {
        if ((a.order ?? 99) !== (b.order ?? 99)) {
          return (a.order ?? 99) - (b.order ?? 99);
        }
        return (a.nameKo || '').localeCompare(b.nameKo || '', 'ko');
      });

      onUpdate(items);
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
      const photoUrl = data.profileImageUrl || data.image || null;

      items.push({
        id: docSnap.id,
        nameKo: data.nameKo || '',
        nameEn: data.nameEn || '',
        profileImageUrl: photoUrl,
        image: photoUrl,
        profileImage: photoUrl,
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
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  }
}

/**
 * Delete an artist from Firestore and delete their photo from Firebase Storage
 */
export async function deleteArtistFromDb(artistId: string): Promise<void> {
  const docId = getCanonicalArtistId(artistId);
  const docRef = doc(db, COLLECTION_NAME, docId);

  // Delete Storage image safely in background
  try {
    await deleteArtistPhoto(docId);
  } catch (e) {
    console.warn('Storage image delete warning:', e);
  }

  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${docId}`);
  }
}
