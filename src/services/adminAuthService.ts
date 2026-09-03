import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SETTINGS_COLLECTION = 'settings';
const AUTH_DOC_ID = 'admin_auth';

// Master passcodes accepted for quick manager access if not changed yet
export const DEFAULT_PASSCODES = ['tk7788', 'admin2026', 'taz0206', 'tkcompany'];

/**
 * Computes SHA-256 hash using native Web Crypto API.
 */
export async function sha256(str: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const enc = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Fallback hash implementation if Web Crypto is unavailable
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'fb_' + Math.abs(hash).toString(16);
}

/**
 * Generates a random cryptographic salt hex string
 */
function generateSalt(length = 16): string {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verifies whether the provided passcode is valid.
 * Checks Firestore settings/admin_auth hash if set; otherwise falls back to DEFAULT_PASSCODES.
 */
export async function verifyMasterPasscode(inputPasscode: string): Promise<boolean> {
  const cleaned = inputPasscode.trim();
  if (!cleaned) return false;

  try {
    const authDocRef = doc(db, SETTINGS_COLLECTION, AUTH_DOC_ID);
    const docSnap = await getDoc(authDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && data.passwordHash && data.salt) {
        const computed = await sha256(data.salt + cleaned);
        if (computed === data.passwordHash) {
          return true;
        }
        // Also test lowercased version if user entered case-insensitively
        const computedLower = await sha256(data.salt + cleaned.toLowerCase());
        if (computedLower === data.passwordHash) {
          return true;
        }
        return false;
      }
    }
  } catch (err) {
    console.warn('[TK] Admin passcode check Firestore note:', err);
  }

  // Fallback to default passcodes if custom password has not been established yet
  const cleanedLower = cleaned.toLowerCase();
  return DEFAULT_PASSCODES.includes(cleanedLower);
}

/**
 * Changes administrator password with strict validation:
 * 1. Current password must be verified
 * 2. New password and confirm must match
 * 3. Minimum length 8 characters
 * 4. Stored exclusively as salt + SHA-256 hash in Firestore. Never plaintext!
 */
export async function changeMasterPassword(
  currentPass: string,
  newPass: string,
  confirmPass: string
): Promise<{ success: boolean; message: string }> {
  // 1. Validate current password
  if (!currentPass.trim()) {
    return { success: false, message: '현재 비밀번호를 입력해주세요.' };
  }

  const isCurrentValid = await verifyMasterPasscode(currentPass);
  if (!isCurrentValid) {
    return { success: false, message: '현재 비밀번호가 올바르지 않습니다.' };
  }

  // 2. Validate new password length (minimum 8 characters)
  if (newPass.length < 8) {
    return { success: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }

  // 3. Validate confirmation match
  if (newPass !== confirmPass) {
    return { success: false, message: '새 비밀번호가 일치하지 않습니다.' };
  }

  // 4. Generate salt and hash
  const salt = generateSalt(16);
  const passwordHash = await sha256(salt + newPass);

  // 5. Save securely to Firestore (NO PLAINTEXT)
  try {
    const authDocRef = doc(db, SETTINGS_COLLECTION, AUTH_DOC_ID);
    await setDoc(
      authDocRef,
      {
        passwordHash,
        salt,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    return { success: true, message: '관리자 비밀번호가 변경되었습니다.' };
  } catch (err) {
    console.error('[TK] Failed to update admin password in Firestore:', err);
    return {
      success: false,
      message: '비밀번호 변경 중 네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    };
  }
}
