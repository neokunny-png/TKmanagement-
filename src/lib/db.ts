import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Artist, AuditionApplication, NewsArticle, InquiryMessage, AuditionStatus } from '../types';
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

export async function getArtists(): Promise<Artist[]> {
  try {
    const q = query(collection(db, ARTISTS_COLLECTION), orderBy('order', 'asc'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('No artists found in Firestore, seeding initial artists...');
      await seedDefaultArtists();
      return INITIAL_ARTISTS;
    }
    
    const artists: Artist[] = [];
    snapshot.forEach((docSnap) => {
      artists.push({ id: docSnap.id, ...docSnap.data() } as Artist);
    });

    localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(artists));
    return artists;
  } catch (error) {
    console.warn('Firestore fetch failed, using local/initial cache:', error);
    const cached = localStorage.getItem(LOCAL_STORAGE_ARTISTS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ARTISTS;
  }
}

export function subscribeToArtists(callback: (artists: Artist[]) => void) {
  try {
    const q = query(collection(db, ARTISTS_COLLECTION), orderBy('order', 'asc'));
    return onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        callback(INITIAL_ARTISTS);
        return;
      }
      const artists: Artist[] = [];
      snapshot.forEach((docSnap) => {
        artists.push({ id: docSnap.id, ...docSnap.data() } as Artist);
      });
      localStorage.setItem(LOCAL_STORAGE_ARTISTS_KEY, JSON.stringify(artists));
      callback(artists);
    }, (err) => {
      console.warn('Snapshot listener error on artists:', err);
      callback(INITIAL_ARTISTS);
    });
  } catch (err) {
    console.warn('Subscribe failed:', err);
    callback(INITIAL_ARTISTS);
    return () => {};
  }
}

export async function seedDefaultArtists(): Promise<void> {
  try {
    for (const artist of INITIAL_ARTISTS) {
      const docRef = doc(db, ARTISTS_COLLECTION, artist.id);
      await setDoc(docRef, {
        ...artist,
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

// NEWS
export async function getNewsArticles(): Promise<NewsArticle[]> {
  try {
    const q = query(collection(db, NEWS_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      await seedDefaultNews();
      return INITIAL_NEWS;
    }

    const list: NewsArticle[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as NewsArticle);
    });
    localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(list));
    return list;
  } catch (error) {
    console.warn('Firestore getNews error:', error);
    const cached = localStorage.getItem(LOCAL_STORAGE_NEWS_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return INITIAL_NEWS;
  }
}

export async function seedDefaultNews(): Promise<void> {
  try {
    for (const item of INITIAL_NEWS) {
      const docRef = doc(db, NEWS_COLLECTION, item.id);
      await setDoc(docRef, item);
    }
    localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(INITIAL_NEWS));
  } catch (error) {
    console.error('Error seeding news:', error);
  }
}

export async function saveNewsArticle(article: NewsArticle): Promise<void> {
  const newsId = article.id || `news-${Date.now()}`;
  const newsData = {
    ...article,
    id: newsId,
    createdAt: article.createdAt || Date.now()
  };

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
}

export async function deleteNewsArticle(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, NEWS_COLLECTION, id));
  } catch (error) {
    console.warn('Firestore deleteNews error:', error);
  }

  const cached = localStorage.getItem(LOCAL_STORAGE_NEWS_KEY);
  if (cached) {
    const list: NewsArticle[] = JSON.parse(cached);
    const updated = list.filter((n) => n.id !== id);
    localStorage.setItem(LOCAL_STORAGE_NEWS_KEY, JSON.stringify(updated));
  }
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
