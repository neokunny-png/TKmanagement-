import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Artist, AuditionApplication, NewsArticle, InquiryMessage, AuditionStatus, sortFilmographyByYear } from '../types';
import { INITIAL_ARTISTS, INITIAL_NEWS } from '../data/initialData';

const ARTISTS_COLLECTION = 'artists';
const AUDITIONS_COLLECTION = 'auditions';
const NEWS_COLLECTION = 'news';
const INQUIRIES_COLLECTION = 'inquiries';

// Fallback in-memory / localStorage cache for ultra-fast UI response & offline resilience
const LOCAL_STORAGE_ARTISTS_KEY = 'tk_cached_artists';
const LOCAL_STORAGE_AUDITIONS_KEY = 'tk_cached_auditions';
const LOCAL_STORAGE_NEWS_KEY = 'tk_cached_news';
const LOCAL_STORAGE_INQUIRIES_KEY = 'tk_cached_inquiries';

const DEFAULT_ACTOR_IMAGES: Record<string, { profile: string; gallery: string[] }> = {
  'artist-choi-eunseo': {
    profile: '/images/actors/choi-eunseo.jpg',
    gallery: [
      '/images/actors/choi-eunseo.jpg',
      '/images/actors/choi-eunseo-1.jpg',
      '/images/actors/choi-eunseo-2.jpg',
      '/images/actors/choi-eunseo-3.jpg'
    ]
  },
  'artist-lee-eunsoo': {
    profile: '/images/actors/lee-eunsoo.jpg',
    gallery: [
      '/images/actors/lee-eunsoo.jpg',
      '/images/actors/lee-eunsoo-1.jpg',
      '/images/actors/lee-eunsoo-2.jpg',
      '/images/actors/lee-eunsoo-3.jpg'
    ]
  },
  'artist-park-minjun': {
    profile: '/images/actors/park-minjun.jpg',
    gallery: [
      '/images/actors/park-minjun.jpg',
      '/images/actors/park-minjun-1.jpg',
      '/images/actors/park-minjun-2.jpg'
    ]
  },
  'artist-park-doi': {
    profile: '/images/actors/park-doi.jpg',
    gallery: [
      '/images/actors/park-doi.jpg',
      '/images/actors/park-doi-1.jpg',
      '/images/actors/park-doi-2.jpg'
    ]
  },
  'artist-park-hyunjin': {
    profile: '/images/actors/park-hyunjin.jpg',
    gallery: [
      '/images/actors/park-hyunjin.jpg',
      '/images/actors/park-hyunjin-1.jpg',
      '/images/actors/park-hyunjin-2.jpg'
    ]
  },
  'artist-park-aaron': {
    profile: '/images/actors/park-aaron.jpg',
    gallery: [
      '/images/actors/park-aaron.jpg',
      '/images/actors/park-aaron-1.jpg',
      '/images/actors/park-aaron-2.jpg'
    ]
  }
};

export function sanitizeArtistImages(artist: Artist): Artist {
  const fallback = DEFAULT_ACTOR_IMAGES[artist.id];
  let profileImage = artist.profileImage;
  let galleryImages = artist.galleryImages || [];

  if (!profileImage || profileImage.includes('unsplash.com')) {
    profileImage = fallback ? fallback.profile : '/images/actors/choi-eunseo.jpg';
  }

  if (galleryImages.length === 0) {
    galleryImages = fallback ? fallback.gallery : [profileImage];
  } else {
    galleryImages = galleryImages.map((img, idx) => {
      if (img && img.includes('unsplash.com')) {
        return fallback?.gallery[idx] || fallback?.profile || profileImage;
      }
      return img;
    });
  }

  return {
    ...artist,
    profileImage,
    galleryImages
  };
}

export function sanitizeNewsImages(news: NewsArticle): NewsArticle {
  let coverImage = news.coverImage;
  if (!coverImage || coverImage.includes('unsplash.com')) {
    if (news.id === 'news-1') coverImage = '/images/news/news-1.jpg';
    else if (news.id === 'news-2') coverImage = '/images/news/news-2.jpg';
    else if (news.id === 'news-3') coverImage = '/images/news/news-3.jpg';
    else coverImage = '/images/news/news-1.jpg';
  }
  return {
    ...news,
    coverImage
  };
}

export async function getArtists(): Promise<Artist[]> {
  try {
    const q = query(collection(db, ARTISTS_COLLECTION), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('No artists found in Firestore, seeding initial artists...');
      await seedDefaultArtists();
      return INITIAL_ARTISTS.map(sanitizeArtistImages);
    }
    
    const artists: Artist[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const showreel = data.showreelUrl && !data.showreelUrl.includes('dQw4w9WgXcQ') ? data.showreelUrl : '';
      artists.push(sanitizeArtistImages({
        id: docSnap.id,
        ...data,
        showreelUrl: showreel,
        filmography: sortFilmographyByYear(data.filmography)
      } as Artist));
    });

    localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(artists));
    return artists;
  } catch (error) {
    console.warn('Firestore fetch failed, using local/initial cache:', error);
    const cached = localStorage.getItem(LOCAL_STORAGE_ARTISTS_KEY);
    if (cached) {
      try {
        const parsed: Artist[] = JSON.parse(cached);
        return parsed.map(sanitizeArtistImages);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ARTISTS.map(sanitizeArtistImages);
  }
}

export function subscribeToArtists(callback: (artists: Artist[]) => void) {
  try {
    const q = query(collection(db, ARTISTS_COLLECTION), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_ARTISTS.map(sanitizeArtistImages));
        return;
      }
      const artists: Artist[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const showreel = data.showreelUrl && !data.showreelUrl.includes('dQw4w9WgXcQ') ? data.showreelUrl : '';
        artists.push(sanitizeArtistImages({
          id: docSnap.id,
          ...data,
          showreelUrl: showreel,
          filmography: sortFilmographyByYear(data.filmography)
        } as Artist));
      });
      localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(artists));
      callback(artists);
    }, (err) => {
      console.warn('Snapshot listener error on artists:', err);
      const cached = localStorage.getItem(LOCAL_STORAGE_ARTISTS_KEY);
      if (cached) {
        try {
          const parsed: Artist[] = JSON.parse(cached);
          callback(parsed.map(sanitizeArtistImages));
          return;
        } catch (e) {}
      }
      callback(INITIAL_ARTISTS.map(sanitizeArtistImages));
    });
  } catch (err) {
    console.warn('Subscribe failed:', err);
    callback(INITIAL_ARTISTS.map(sanitizeArtistImages));
    return () => {};
  }
}

export async function seedDefaultArtists(): Promise<void> {
  try {
    for (const artist of INITIAL_ARTISTS) {
      const docRef = doc(db, ARTISTS_COLLECTION, artist.id);
      await setDoc(docRef, {
        ...artist,
        filmography: sortFilmographyByYear(artist.filmography),
        updatedAt: Date.now()
      });
    }
    localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(INITIAL_ARTISTS));
  } catch (error) {
    console.error('Error seeding artists:', error);
  }
}

export async function saveArtist(artist: Artist): Promise<void> {
  const artistId = artist.id || `artist-${Date.now()}`;
  const artistData = {
    ...artist,
    id: artistId,
    filmography: sortFilmographyByYear(artist.filmography),
    updatedAt: Date.now()
  };

  try {
    const docRef = doc(db, ARTISTS_COLLECTION, artistId);
    await setDoc(docRef, artistData, { merge: true });
  } catch (error) {
    console.warn('Firestore saveArtist error:', error);
  }

  // Update local cache
  const cached = localStorage.getItem(LOCAL_STORAGE_ARTISTS_KEY);
  let artistsList: Artist[] = cached ? JSON.parse(cached) : [...INITIAL_ARTISTS];
  const idx = artistsList.findIndex((a) => a.id === artistId);
  if (idx >= 0) {
    artistsList[idx] = artistData;
  } else {
    artistsList.push(artistData);
  }
  localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(artistsList));
}

export async function deleteArtist(artistId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, ARTISTS_COLLECTION, artistId));
  } catch (error) {
    console.warn('Firestore deleteArtist error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_ARTISTS_KEY);
  if (cached) {
    const list: Artist[] = JSON.parse(cached);
    const updated = list.filter((a) => a.id !== artistId);
    localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(updated));
  }
}

export async function updateArtistsOrder(orderedArtists: Artist[]): Promise<void> {
  const updatedList: Artist[] = orderedArtists.map((artist, idx) => ({
    ...artist,
    order: idx + 1,
    updatedAt: Date.now()
  }));

  try {
    const batch = writeBatch(db);
    for (const a of updatedList) {
      const docRef = doc(db, ARTISTS_COLLECTION, a.id);
      batch.update(docRef, { order: a.order, updatedAt: a.updatedAt });
    }
    await batch.commit();
  } catch (error) {
    console.warn('Firestore updateArtistsOrder batch update error:', error);
    for (const a of updatedList) {
      try {
        const docRef = doc(db, ARTISTS_COLLECTION, a.id);
        await setDoc(docRef, { order: a.order, updatedAt: a.updatedAt }, { merge: true });
      } catch (e) {
        // fallback ignored
      }
    }
  }

  localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(updatedList));
}

// AUDITIONS
export async function submitAuditionApplication(
  data: Omit<AuditionApplication, 'id' | 'applicationNumber' | 'status' | 'submittedAt'>
): Promise<AuditionApplication> {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const applicationNumber = `TK-${new Date().getFullYear()}-${randomSuffix}`;
  
  const newApp: AuditionApplication = {
    ...data,
    id: `audition-${timestamp}`,
    applicationNumber,
    status: 'pending',
    submittedAt: timestamp
  };

  try {
    const docRef = doc(db, AUDITIONS_COLLECTION, newApp.id);
    await setDoc(docRef, newApp);
  } catch (error) {
    console.warn('Firestore audition submit error:', error);
  }

  // Local storage backup
  const cached = localStorage.getItem(LOCAL_STORAGE_AUDITIONS_KEY);
  const list: AuditionApplication[] = cached ? JSON.parse(cached) : [];
  list.unshift(newApp);
  localStorage.setItem(LOCAL_STORAGE_AUDITIONS_KEY, JSON.stringify(list));

  return newApp;
}

export async function getAuditionApplications(): Promise<AuditionApplication[]> {
  try {
    const q = query(collection(db, AUDITIONS_COLLECTION), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    const list: AuditionApplication[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as AuditionApplication);
    });

    if (list.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_AUDITIONS_KEY, JSON.stringify(list));
      return list;
    }
  } catch (error) {
    console.warn('Firestore getAuditions error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_AUDITIONS_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  return [];
}

export async function updateAuditionStatus(
  id: string,
  status: AuditionStatus,
  adminNotes?: string,
  rating?: number
): Promise<void> {
  const updatePayload: Partial<AuditionApplication> = { status };
  if (adminNotes !== undefined) updatePayload.adminNotes = adminNotes;
  if (rating !== undefined) updatePayload.rating = rating;

  try {
    const docRef = doc(db, AUDITIONS_COLLECTION, id);
    await updateDoc(docRef, updatePayload);
  } catch (error) {
    console.warn('Firestore updateAuditionStatus error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_AUDITIONS_KEY);
  if (cached) {
    const list: AuditionApplication[] = JSON.parse(cached);
    const idx = list.findIndex((a) => a.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updatePayload };
      localStorage.setItem(LOCAL_STORAGE_AUDITIONS_KEY, JSON.stringify(list));
    }
  }
}

export async function deleteAuditionApplication(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, AUDITIONS_COLLECTION, id));
  } catch (error) {
    console.warn('Firestore deleteAudition error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_AUDITIONS_KEY);
  if (cached) {
    const list: AuditionApplication[] = JSON.parse(cached);
    const updated = list.filter((a) => a.id !== id);
    localStorage.setItem(LOCAL_STORAGE_AUDITIONS_KEY, JSON.stringify(updated));
  }
}

const LOCAL_STORAGE_DELETED_NEWS_KEY = 'tk_cached_deleted_news_ids';

function getDeletedNewsIds(): string[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_NEWS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function addDeletedNewsId(id: string) {
  try {
    const ids = getDeletedNewsIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(LOCAL_STORAGE_DELETED_NEWS_KEY, JSON.stringify(ids));
    }
  } catch (e) {}
}

// NEWS
export async function getNewsArticles(): Promise<NewsArticle[]> {
  const deletedIds = getDeletedNewsIds();
  try {
    const q = query(collection(db, NEWS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Check if user has already explicitly initialized or deleted items
      const isInitialized = localStorage.getItem('tk_news_initialized');
      if (!isInitialized) {
        localStorage.setItem('tk_news_initialized', 'true');
        await seedDefaultNews();
        return INITIAL_NEWS.filter((n) => !deletedIds.includes(n.id));
      }
      return [];
    }

    const list: NewsArticle[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (!deletedIds.includes(docSnap.id) && !deletedIds.includes(data.id)) {
        list.push(sanitizeNewsImages({ id: docSnap.id, ...data } as NewsArticle));
      }
    });

    localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(list));
    localStorage.setItem('tk_news_initialized', 'true');
    return list;
  } catch (error) {
    console.warn('Firestore getNews error, using local cache:', error);
    const cached = localStorage.getItem(LOCAL_STORAGE_NEWS_KEY);
    if (cached) {
      try {
        const parsed: NewsArticle[] = JSON.parse(cached);
        return parsed.map(sanitizeNewsImages).filter((n) => !deletedIds.includes(n.id));
      } catch (e) {}
    }
    return INITIAL_NEWS.map(sanitizeNewsImages).filter((n) => !deletedIds.includes(n.id));
  }
}

export function subscribeToNews(callback: (newsList: NewsArticle[]) => void) {
  try {
    const q = query(collection(db, NEWS_COLLECTION), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snapshot) => {
        const deletedIds = getDeletedNewsIds();
        if (snapshot.empty) {
          const isInit = localStorage.getItem('tk_news_initialized');
          if (!isInit) {
            callback(INITIAL_NEWS.map(sanitizeNewsImages).filter((n) => !deletedIds.includes(n.id)));
          } else {
            callback([]);
          }
          return;
        }

        const list: NewsArticle[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (!deletedIds.includes(docSnap.id) && !deletedIds.includes(data.id)) {
            list.push(sanitizeNewsImages({ id: docSnap.id, ...data } as NewsArticle));
          }
        });

        localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(list));
        localStorage.setItem('tk_news_initialized', 'true');
        callback(list);
      },
      (err) => {
        console.warn('Snapshot listener error on news:', err);
        const deletedIds = getDeletedNewsIds();
        const cached = localStorage.getItem(LOCAL_STORAGE_NEWS_KEY);
        if (cached) {
          try {
            const parsed: NewsArticle[] = JSON.parse(cached);
            callback(parsed.map(sanitizeNewsImages).filter((n) => !deletedIds.includes(n.id)));
            return;
          } catch (e) {}
        }
        callback(INITIAL_NEWS.map(sanitizeNewsImages).filter((n) => !deletedIds.includes(n.id)));
      }
    );
  } catch (err) {
    console.warn('Subscribe to news failed:', err);
    return () => {};
  }
}

export async function seedDefaultNews(): Promise<void> {
  try {
    const deletedIds = getDeletedNewsIds();
    for (const item of INITIAL_NEWS) {
      if (!deletedIds.includes(item.id)) {
        const docRef = doc(db, NEWS_COLLECTION, item.id);
        await setDoc(docRef, item);
      }
    }
    const filteredInitial = INITIAL_NEWS.filter((n) => !deletedIds.includes(n.id));
    localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(filteredInitial));
    localStorage.setItem('tk_news_initialized', 'true');
  } catch (error) {
    console.error('Error seeding news:', error);
  }
}

export async function saveNewsArticle(article: NewsArticle): Promise<void> {
  const newsId = article.id || `news-${Date.now()}`;
  const newsData: NewsArticle = {
    ...article,
    id: newsId,
    createdAt: article.createdAt || Date.now()
  };

  // Remove from deleted list if re-saved
  try {
    const deletedIds = getDeletedNewsIds().filter((id) => id !== newsId);
    localStorage.setItem(LOCAL_STORAGE_DELETED_NEWS_KEY, JSON.stringify(deletedIds));
  } catch (e) {}

  try {
    const docRef = doc(db, NEWS_COLLECTION, newsId);
    await setDoc(docRef, newsData, { merge: true });
  } catch (error) {
    console.warn('Firestore saveNews error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_NEWS_KEY);
  let list: NewsArticle[] = cached ? JSON.parse(cached) : [...INITIAL_NEWS];
  const idx = list.findIndex((n) => n.id === newsId);
  if (idx >= 0) {
    list[idx] = newsData;
  } else {
    list.unshift(newsData);
  }
  localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(list));
  localStorage.setItem('tk_news_initialized', 'true');
}

export async function deleteNewsArticle(id: string): Promise<void> {
  // 1. Record ID in deleted IDs tracking
  addDeletedNewsId(id);

  // 2. Delete from Firestore
  try {
    const docRef = doc(db, NEWS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Firestore deleteNews error:', error);
  }

  // 3. Update localStorage cache immediately
  const cached = localStorage.getItem(LOCAL_STORAGE_NEWS_KEY);
  let list: NewsArticle[] = cached ? JSON.parse(cached) : [...INITIAL_NEWS];
  const updated = list.filter((n) => n.id !== id);
  localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(updated));
  localStorage.setItem('tk_news_initialized', 'true');
}

// INQUIRIES
export async function submitInquiry(
  data: Omit<InquiryMessage, 'id' | 'status' | 'createdAt'>
): Promise<InquiryMessage> {
  const timestamp = Date.now();
  const newInquiry: InquiryMessage = {
    ...data,
    id: `inquiry-${timestamp}`,
    status: 'unread',
    createdAt: timestamp
  };

  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, newInquiry.id);
    await setDoc(docRef, newInquiry);
  } catch (error) {
    console.warn('Firestore submitInquiry error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
  const list: InquiryMessage[] = cached ? JSON.parse(cached) : [];
  list.unshift(newInquiry);
  localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(list));

  return newInquiry;
}

export async function getInquiries(): Promise<InquiryMessage[]> {
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const list: InquiryMessage[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as InquiryMessage);
    });
    if (list.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(list));
      return list;
    }
  } catch (error) {
    console.warn('Firestore getInquiries error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  return [];
}

export async function updateInquiryStatus(
  id: string,
  status: 'unread' | 'in_progress' | 'completed'
): Promise<void> {
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.warn('Firestore updateInquiryStatus error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
  if (cached) {
    const list: InquiryMessage[] = JSON.parse(cached);
    const idx = list.findIndex((i) => i.id === id);
    if (idx >= 0) {
      list[idx].status = status;
      localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(list));
    }
  }
}
