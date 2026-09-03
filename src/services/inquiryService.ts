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
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { InquiryItem, UnifiedInquiryStatus } from '../types';
import { sendInquiryEmailNotification } from './notificationService';

const INQUIRIES_COLLECTION = 'inquiries';
const AUDITIONS_COLLECTION = 'auditions';

/**
 * Validate and submit a CONTACT inquiry:
 * 1. Validates required fields
 * 2. Persists to Firestore collection 'inquiries'
 * 3. Confirms Firestore save success
 * 4. Dispatches email notification to taz0206@naver.com
 * 5. If Firestore save fails, throws Error without showing success
 */
export async function submitContactInquiry(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  category?: string;
  targetActorId?: string;
  targetActorName?: string;
  subject?: string;
  message: string;
}): Promise<InquiryItem> {
  // 1. Validation
  const trimmedName = (data.name || '').trim();
  const trimmedEmail = (data.email || '').trim();
  const trimmedMessage = (data.message || '').trim();

  if (!trimmedName) {
    throw new Error('성함을 입력해주세요.');
  }
  if (!trimmedEmail) {
    throw new Error('이메일 주소를 입력해주세요.');
  }
  if (!trimmedMessage) {
    throw new Error('문의 내용을 입력해주세요.');
  }

  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const inquiryId = `contact-${timestamp}-${randomSuffix}`;

  const inquiryItem: InquiryItem = {
    id: inquiryId,
    type: 'CONTACT',
    status: 'NEW',
    createdAt: timestamp,
    name: trimmedName,
    email: trimmedEmail,
    phone: (data.phone || '').trim(),
    company: (data.company || '').trim(),
    category: (data.category || 'Casting').trim(),
    targetActorId: (data.targetActorId || '').trim(),
    targetActorName: (data.targetActorName || '').trim(),
    subject: (data.subject || '').trim() || `[문의] ${trimmedName}님의 제안`,
    message: trimmedMessage,
    emailStatus: 'PENDING',
    updatedAt: timestamp,
  };

  // 2. Firestore Save
  console.log('[TK Inquiry] Attempting Firestore save for CONTACT:', inquiryId);
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await setDoc(docRef, inquiryItem);
    console.log('[TK Inquiry] Firestore save SUCCESS for CONTACT:', inquiryId);
  } catch (firestoreErr: any) {
    console.error('[TK Inquiry] Firestore save FAILED for CONTACT:', firestoreErr);
    handleFirestoreError(firestoreErr, OperationType.CREATE, `${INQUIRIES_COLLECTION}/${inquiryId}`);
    throw new Error('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }

  // 3. Email Notification dispatch after Firestore success
  try {
    const emailSent = await sendInquiryEmailNotification(inquiryItem);
    const finalEmailStatus = emailSent ? 'SENT' : 'FAILED';
    inquiryItem.emailStatus = finalEmailStatus;

    // Update emailStatus in Firestore in background without blocking
    updateDoc(doc(db, INQUIRIES_COLLECTION, inquiryId), {
      emailStatus: finalEmailStatus,
    }).catch(err => {
      console.warn('[TK Inquiry] Failed to update emailStatus in Firestore:', err);
    });
  } catch (emailErr) {
    console.error('[TK Inquiry] Email notification dispatch failed:', emailErr);
    inquiryItem.emailStatus = 'FAILED';
  }

  return inquiryItem;
}

/**
 * Validate and submit an AUDITION application:
 * 1. Validates required fields
 * 2. Persists to Firestore collection 'inquiries' (with type='AUDITION') and 'auditions' for backward compatibility
 * 3. Confirms Firestore save success
 * 4. Dispatches email notification to taz0206@naver.com
 * 5. If Firestore save fails, throws Error without showing success
 */
export async function submitAuditionApplication(data: {
  name: string;
  birth: string;
  gender: 'Female' | 'Male';
  phone: string;
  email: string;
  height?: string;
  weight?: string;
  instagram?: string;
  youtube?: string;
  specialty?: string;
  bio?: string;
  experience?: string;
  photoUrlFace?: string;
  photoUrlFull?: string;
  videoUrl?: string;
}): Promise<InquiryItem> {
  // 1. Validation
  const trimmedName = (data.name || '').trim();
  const trimmedBirth = (data.birth || '').trim();
  const trimmedPhone = (data.phone || '').trim();
  const trimmedEmail = (data.email || '').trim();

  if (!trimmedName) {
    throw new Error('이름을 입력해주세요.');
  }
  if (!trimmedBirth) {
    throw new Error('생년월일을 입력해주세요.');
  }
  if (!trimmedPhone) {
    throw new Error('연락처를 입력해주세요.');
  }
  if (!trimmedEmail) {
    throw new Error('이메일 주소를 입력해주세요.');
  }

  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const applicationNumber = `TK-${new Date().getFullYear()}-${randomSuffix}`;
  const auditionId = `audition-${timestamp}-${randomSuffix}`;

  const inquiryItem: InquiryItem = {
    id: auditionId,
    type: 'AUDITION',
    status: 'NEW',
    createdAt: timestamp,
    applicationNumber,
    name: trimmedName,
    birth: trimmedBirth,
    gender: data.gender || 'Female',
    phone: trimmedPhone,
    email: trimmedEmail,
    height: (data.height || '').trim(),
    weight: (data.weight || '').trim(),
    instagram: (data.instagram || '').trim(),
    youtube: (data.youtube || '').trim(),
    specialty: (data.specialty || '').trim(),
    bio: (data.bio || '').trim(),
    experience: (data.experience || '').trim(),
    photoUrlFace: (data.photoUrlFace || '').trim(),
    photoUrlFull: (data.photoUrlFull || '').trim(),
    videoUrl: (data.videoUrl || '').trim(),
    emailStatus: 'PENDING',
    updatedAt: timestamp,
  };

  // 2. Firestore Save
  console.log('[TK Audition] Attempting Firestore save for AUDITION:', auditionId);
  try {
    // Save to unified 'inquiries' collection
    const docRef = doc(db, INQUIRIES_COLLECTION, auditionId);
    await setDoc(docRef, inquiryItem);
    console.log('[TK Audition] Firestore save SUCCESS for AUDITION in inquiries:', auditionId);

    // Also mirror to legacy 'auditions' collection for complete backward safety
    try {
      const legacyRef = doc(db, AUDITIONS_COLLECTION, auditionId);
      await setDoc(legacyRef, {
        ...inquiryItem,
        status: 'pending',
        submittedAt: timestamp,
      }, { merge: true });
    } catch (legacyErr) {
      console.warn('[TK Audition] Legacy mirror note:', legacyErr);
    }
  } catch (firestoreErr: any) {
    console.error('[TK Audition] Firestore save FAILED for AUDITION:', firestoreErr);
    handleFirestoreError(firestoreErr, OperationType.CREATE, `${INQUIRIES_COLLECTION}/${auditionId}`);
    throw new Error('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }

  // 3. Email Notification dispatch after Firestore success
  try {
    const emailSent = await sendInquiryEmailNotification(inquiryItem);
    const finalEmailStatus = emailSent ? 'SENT' : 'FAILED';
    inquiryItem.emailStatus = finalEmailStatus;

    // Update emailStatus in Firestore
    updateDoc(doc(db, INQUIRIES_COLLECTION, auditionId), {
      emailStatus: finalEmailStatus,
    }).catch(err => {
      console.warn('[TK Audition] Failed to update emailStatus in Firestore:', err);
    });
  } catch (emailErr) {
    console.error('[TK Audition] Email notification dispatch failed:', emailErr);
    inquiryItem.emailStatus = 'FAILED';
  }

  return inquiryItem;
}

/**
 * Normalizes a raw Firestore inquiry document into a clean InquiryItem
 */
function normalizeInquiryDoc(data: any, docId: string): InquiryItem {
  const isAudition = data.type === 'AUDITION' || Boolean(data.applicationNumber) || Boolean(data.specialty && data.birth);
  const type = isAudition ? 'AUDITION' : 'CONTACT';

  // Map legacy status strings if present
  let status: UnifiedInquiryStatus = 'NEW';
  const rawStatus = (data.status || '').toUpperCase();
  if (rawStatus === 'READ') status = 'READ';
  else if (rawStatus === 'CONTACTED' || rawStatus === 'INTERVIEW') status = 'CONTACTED';
  else if (rawStatus === 'COMPLETED' || rawStatus === 'REVIEWED' || rawStatus === 'PASSED' || rawStatus === 'REJECTED') status = 'COMPLETED';
  else if (rawStatus === 'NEW' || rawStatus === 'PENDING' || rawStatus === 'UNREAD') status = 'NEW';

  return {
    id: data.id || docId,
    type,
    status,
    createdAt: typeof data.createdAt === 'number' ? data.createdAt : (typeof data.submittedAt === 'number' ? data.submittedAt : Date.now()),
    emailStatus: data.emailStatus || 'SENT',
    name: data.name || '',
    phone: data.phone || '',
    email: data.email || '',
    company: data.company || '',
    category: data.category || '',
    targetActorId: data.targetActorId || '',
    targetActorName: data.targetActorName || '',
    subject: data.subject || '',
    message: data.message || '',
    applicationNumber: data.applicationNumber || '',
    birth: data.birth || '',
    gender: data.gender === 'Female' ? 'Female' : 'Male',
    height: data.height || '',
    weight: data.weight || '',
    instagram: data.instagram || '',
    youtube: data.youtube || '',
    specialty: data.specialty || '',
    bio: data.bio || '',
    experience: data.experience || '',
    photoUrlFace: data.photoUrlFace || '',
    photoUrlFull: data.photoUrlFull || '',
    videoUrl: data.videoUrl || '',
    adminNotes: data.adminNotes || '',
    rating: typeof data.rating === 'number' ? data.rating : 5,
    updatedAt: data.updatedAt || data.createdAt || Date.now(),
  };
}

/**
 * Subscribes to real-time updates for all inquiries (both AUDITION and CONTACT)
 * Returns unsubscribe function.
 */
export function subscribeToInquiries(
  callback: (inquiries: InquiryItem[]) => void
): Unsubscribe {
  console.log('[TK Inquiry] Subscribing to real-time inquiries');

  const inquiriesMap = new Map<string, InquiryItem>();

  const notify = () => {
    const list = Array.from(inquiriesMap.values());
    list.sort((a, b) => b.createdAt - a.createdAt);
    callback(list);
  };

  // 1. Listen to 'inquiries' collection
  const unsubInquiries = onSnapshot(
    collection(db, INQUIRIES_COLLECTION),
    (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const docId = change.doc.id;
        if (change.type === 'removed') {
          inquiriesMap.delete(docId);
        } else {
          const item = normalizeInquiryDoc(change.doc.data(), docId);
          inquiriesMap.set(docId, item);
        }
      });
      notify();
    },
    (error) => {
      console.error('[TK Inquiry] Error listening to inquiries collection:', error);
      handleFirestoreError(error, OperationType.LIST, INQUIRIES_COLLECTION);
    }
  );

  // 2. Also listen to legacy 'auditions' collection to ensure no existing auditions are missed
  let unsubAuditions: Unsubscribe = () => {};
  try {
    unsubAuditions = onSnapshot(
      collection(db, AUDITIONS_COLLECTION),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const docId = change.doc.id;
          if (change.type === 'removed') {
            // Only delete if it's not present in inquiries
            if (!inquiriesMap.get(docId)?.id) {
              inquiriesMap.delete(docId);
            }
          } else {
            // If not already in inquiriesMap or if auditions has newer data
            if (!inquiriesMap.has(docId)) {
              const item = normalizeInquiryDoc({ ...change.doc.data(), type: 'AUDITION' }, docId);
              inquiriesMap.set(docId, item);
            }
          }
        });
        notify();
      },
      (error) => {
        console.warn('[TK Audition] Auditions collection listen note:', error);
      }
    );
  } catch (e) {
    // Ignore legacy error
  }

  return () => {
    unsubInquiries();
    unsubAuditions();
  };
}

/**
 * Updates status of an inquiry in Firestore (e.g. NEW -> READ -> CONTACTED -> COMPLETED)
 */
export async function updateInquiryStatusInDb(
  id: string,
  status: UnifiedInquiryStatus,
  adminNotes?: string
): Promise<void> {
  const updates: Record<string, any> = {
    status,
    updatedAt: Date.now()
  };
  if (adminNotes !== undefined) {
    updates.adminNotes = adminNotes;
  }

  try {
    await updateDoc(doc(db, INQUIRIES_COLLECTION, id), updates);
    console.log(`[TK Inquiry] Status updated to ${status} for inquiry: ${id}`);
  } catch (err: any) {
    console.warn('[TK Inquiry] Inquiries update note:', err);
    // Also try auditions collection in case document originated there
    try {
      await updateDoc(doc(db, AUDITIONS_COLLECTION, id), updates);
    } catch (audErr) {
      handleFirestoreError(err, OperationType.UPDATE, `${INQUIRIES_COLLECTION}/${id}`);
    }
  }
}

/**
 * Deletes an inquiry document from Firestore
 */
export async function deleteInquiryFromDb(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, INQUIRIES_COLLECTION, id));
    console.log(`[TK Inquiry] Deleted inquiry: ${id}`);
  } catch (err: any) {
    console.warn('[TK Inquiry] Inquiries delete note:', err);
  }

  // Also attempt delete from legacy auditions collection
  try {
    await deleteDoc(doc(db, AUDITIONS_COLLECTION, id));
  } catch (audErr) {
    // ignore
  }
}

/**
 * Updates admin notes and optional rating for an inquiry in Firestore
 */
export async function updateInquiryAdminNotesInDb(
  id: string,
  adminNotes: string,
  rating?: number
): Promise<void> {
  const updates: Record<string, any> = {
    adminNotes,
    updatedAt: Date.now()
  };
  if (rating !== undefined) {
    updates.rating = rating;
  }

  try {
    await updateDoc(doc(db, INQUIRIES_COLLECTION, id), updates);
    console.log(`[TK Inquiry] Notes updated for inquiry: ${id}`);
  } catch (err: any) {
    console.warn('[TK Inquiry] Inquiries notes update note:', err);
    try {
      await updateDoc(doc(db, AUDITIONS_COLLECTION, id), updates);
    } catch (audErr) {
      handleFirestoreError(err, OperationType.UPDATE, `${INQUIRIES_COLLECTION}/${id}`);
    }
  }
}
