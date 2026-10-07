import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  Unsubscribe,
  DocumentData
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Configure Storage retry timeouts so unprovisioned bucket fails fast and falls back cleanly
try {
  storage.maxUploadRetryTime = 2500;
  storage.maxOperationRetryTime = 2500;
} catch {
  // Ignore
}

let anonymousAuthUnavailable = false;

// Automatically ensure Firebase Auth is initialized to support Storage/Firestore rules
export async function ensureFirebaseAuth(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (auth.currentUser || anonymousAuthUnavailable) return;
  try {
    await signInAnonymously(auth);
  } catch (err: any) {
    if (
      err?.code === 'auth/admin-restricted-operation' ||
      err?.code === 'auth/operation-not-allowed' ||
      err?.code === 'auth/configuration-not-found'
    ) {
      anonymousAuthUnavailable = true;
      return;
    }
    console.warn('Anonymous auth note:', err);
  }
}

// Auto-run in background
ensureFirebaseAuth();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Initial connection test
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline or connecting.');
    }
    return false;
  }
}
