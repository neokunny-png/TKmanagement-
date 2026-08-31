import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  Unsubscribe
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { NewsArticle } from '../types';

const COLLECTION_NAME = 'news';

export function subscribeNews(
  onUpdate: (newsList: NewsArticle[]) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const items: NewsArticle[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          title: data.title || '',
          category: data.category || 'Notice',
          date: data.date || new Date().toISOString().substring(0, 10).replace(/-/g, '.'),
          summary: data.summary || '',
          content: data.content || '',
          coverImage: data.coverImage || '',
          isPinned: !!data.isPinned,
          author: data.author || 'TK MANAGEMENT',
          createdAt: data.createdAt || Date.now(),
        });
      });

      // Sort pinned first, then by createdAt / date descending
      items.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });

      onUpdate(items);
    },
    (error) => {
      console.error('Error listening to news:', error);
      if (onError) {
        onError(error);
      } else {
        handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      }
    }
  );
}

export async function getNewsOnce(): Promise<NewsArticle[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);
    const items: NewsArticle[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        title: data.title || '',
        category: data.category || 'Notice',
        date: data.date || '',
        summary: data.summary || '',
        content: data.content || '',
        coverImage: data.coverImage || '',
        isPinned: !!data.isPinned,
        author: data.author || 'TK MANAGEMENT',
        createdAt: data.createdAt || Date.now(),
      });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
  }
}

export async function saveNewsToDb(article: NewsArticle): Promise<void> {
  const docId = article.id || `news-${Date.now()}`;
  const docRef = doc(db, COLLECTION_NAME, docId);

  const cleanPayload = {
    id: docId,
    title: (article.title || '').trim(),
    category: article.category || 'Notice',
    date: article.date || new Date().toISOString().substring(0, 10).replace(/-/g, '.'),
    summary: (article.summary || '').trim(),
    content: (article.content || '').trim(),
    coverImage: article.coverImage || '',
    isPinned: !!article.isPinned,
    author: article.author || 'TK MANAGEMENT',
    createdAt: article.createdAt || Date.now(),
  };

  try {
    await setDoc(docRef, cleanPayload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${docId}`);
  }
}

export async function deleteNewsFromDb(articleId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, articleId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${articleId}`);
  }
}
