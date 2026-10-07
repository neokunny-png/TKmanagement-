import { doc, onSnapshot, setDoc, getDoc, Unsubscribe } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CompanyInfo } from '../types';

export const DEFAULT_COMPANY_INFO: CompanyInfo = {
  companyName: '㈜TK Company (티케이컴퍼니)',
  brandName: 'TK MANAGEMENT (티케이 매니지먼트)',
  ceo: '',
  privacyOfficer: '개인정보보호 담당 부서',
  businessNumber: '291-88-03353',
  entertainmentRegistration: '제2025-서울강남-0418호(등록대기중)',
  address: '서울특별시 마포구 마포나루길 442 마포인트 3층',
  addressEn: '3F Mapoint, 442 Maponaru-gil, Mapo-gu, Seoul, Korea',
  email: 'taz0206@naver.com',
  description: '새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어가는 프리미엄 액터스 매니지먼트. 우리는 가능성을 발견하고 인재를 개발하며 새로운 기회를 창출합니다.',
  sloganKo: '새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어가는 프리미엄 액터스 매니지먼트.',
  sloganEn: 'YOUR NEXT SCENE. STARTS HERE.',
  copyright: '© TK MANAGEMENT. All rights reserved.',
};

const SETTINGS_COLLECTION = 'settings';
const COMPANY_DOC_ID = 'company';

/**
 * Subscribes to real-time company info updates from Firestore settings/company.
 * Merges with DEFAULT_COMPANY_INFO so no field is ever undefined.
 */
export function subscribeCompanyInfo(
  onUpdate: (info: CompanyInfo) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const companyDocRef = doc(db, SETTINGS_COLLECTION, COMPANY_DOC_ID);

  return onSnapshot(
    companyDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onUpdate({
          companyName: data.companyName || DEFAULT_COMPANY_INFO.companyName,
          brandName: data.brandName || DEFAULT_COMPANY_INFO.brandName,
          ceo: '',
          privacyOfficer: data.privacyOfficer && data.privacyOfficer.includes('부서') ? data.privacyOfficer : DEFAULT_COMPANY_INFO.privacyOfficer,
          businessNumber: data.businessNumber || DEFAULT_COMPANY_INFO.businessNumber,
          entertainmentRegistration: data.entertainmentRegistration || DEFAULT_COMPANY_INFO.entertainmentRegistration,
          address: data.address || DEFAULT_COMPANY_INFO.address,
          addressEn: data.addressEn || DEFAULT_COMPANY_INFO.addressEn,
          email: data.email || DEFAULT_COMPANY_INFO.email,
          description: data.description || DEFAULT_COMPANY_INFO.description,
          sloganKo: data.sloganKo || DEFAULT_COMPANY_INFO.sloganKo,
          sloganEn: data.sloganEn || DEFAULT_COMPANY_INFO.sloganEn,
          copyright: data.copyright || DEFAULT_COMPANY_INFO.copyright,
          updatedAt: data.updatedAt || Date.now(),
        });
      } else {
        // Document does not exist yet; deliver default values
        onUpdate(DEFAULT_COMPANY_INFO);
      }
    },
    (error) => {
      console.warn('Company info Firestore listener note:', error);
      if (onError) onError(error);
      // Still supply default so UI never breaks
      onUpdate(DEFAULT_COMPANY_INFO);
    }
  );
}

/**
 * Saves or updates company information in Firestore settings/company
 */
export async function saveCompanyInfo(info: Partial<CompanyInfo>): Promise<void> {
  const companyDocRef = doc(db, SETTINGS_COLLECTION, COMPANY_DOC_ID);
  await setDoc(
    companyDocRef,
    {
      ...info,
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}

/**
 * Fetches company info once from Firestore
 */
export async function getCompanyInfoOnce(): Promise<CompanyInfo> {
  try {
    const companyDocRef = doc(db, SETTINGS_COLLECTION, COMPANY_DOC_ID);
    const snapshot = await getDoc(companyDocRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        companyName: data.companyName || DEFAULT_COMPANY_INFO.companyName,
        brandName: data.brandName || DEFAULT_COMPANY_INFO.brandName,
        ceo: data.ceo || DEFAULT_COMPANY_INFO.ceo,
        privacyOfficer: data.privacyOfficer || DEFAULT_COMPANY_INFO.privacyOfficer,
        businessNumber: data.businessNumber || DEFAULT_COMPANY_INFO.businessNumber,
        entertainmentRegistration: data.entertainmentRegistration || DEFAULT_COMPANY_INFO.entertainmentRegistration,
        address: data.address || DEFAULT_COMPANY_INFO.address,
        addressEn: data.addressEn || DEFAULT_COMPANY_INFO.addressEn,
        email: data.email || DEFAULT_COMPANY_INFO.email,
        description: data.description || DEFAULT_COMPANY_INFO.description,
        sloganKo: data.sloganKo || DEFAULT_COMPANY_INFO.sloganKo,
        sloganEn: data.sloganEn || DEFAULT_COMPANY_INFO.sloganEn,
        copyright: data.copyright || DEFAULT_COMPANY_INFO.copyright,
        updatedAt: data.updatedAt || Date.now(),
      };
    }
  } catch (err) {
    console.warn('Error fetching company info once:', err);
  }
  return DEFAULT_COMPANY_INFO;
}
