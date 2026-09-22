import { Artist } from '../types';
import { OFFICIAL_ACTOR_IMAGES } from '../lib/seo';

/**
 * TK MANAGEMENT — OFFICIAL VERIFIED STATIC ARTISTS ROSTER
 * Provides complete, canonical static records for all 4 official actors.
 * Eliminates all reliance on network/Firestore for initial paint, preventing any FOUC or blank state.
 */
export const STATIC_OFFICIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-choi-eunseo',
    nameKo: '최은서',
    nameEn: 'CHOI EUN SEO',
    gender: 'Female',
    birth: '1996.03.21',
    height: 166,
    order: 1,
    bio: '맑고 투명한 마스크 뒤에 서늘하고 깊은 눈빛을 지닌 배우. 섬세한 감정선과 밀도 높은 호흡으로 관객을 화면 안으로 이끕니다.',
    profileImageUrl: OFFICIAL_ACTOR_IMAGES['choi-eunseo'],
    image: OFFICIAL_ACTOR_IMAGES['choi-eunseo'],
    profileImage: OFFICIAL_ACTOR_IMAGES['choi-eunseo'],
    isActive: true,
    galleryImages: [],
    filmography: [
      { id: 'film-1787542419782', title: '독립영화 호출', role: '정문', year: '2024', category: 'Movie', note: '' },
      { id: 'film-1787542401839', title: '독립영화 기시감', role: '시연', year: '2020', category: 'Movie', note: '' },
      { id: 'film-1787542372966', title: '나가자 클럽', role: '준희', year: '2026 11월 공연 예정', category: 'Theater', note: '' },
      { id: 'film-1787542346319', title: '1945', role: '선녀', year: '2025', category: 'Theater', note: '' },
      { id: 'film-1787542327767', title: '연극 의자는 잘못없다', role: '송지애', year: '2019', category: 'Theater', note: '' },
      { id: 'film-1787542308541', title: '방황하는 별들', role: '유인자', year: '2018', category: 'Theater', note: '' },
      { id: 'film-1787538558914', title: 'SMDV x EVOTO 2026 서울패션위크', role: '모델', year: '2026', category: 'CF(광고)', note: '' },
      { id: 'film-1787538533586', title: '모로칸 오일 염색약', role: '모델', year: '2025', category: 'CF(광고)', note: '' },
      { id: 'film-1787538491859', title: 'N2U 립 앤 치크', role: '모델', year: '2025', category: 'CF(광고)', note: '' },
      { id: 'film-1787538440266', title: '시코르 쌍커풀 테이프 무쌍', role: '모델', year: '2024', category: 'CF(광고)', note: '' },
      { id: 'film-1787538402979', title: '부케가르니 나드 헤어픽서', role: '모델', year: '2022', category: 'CF(광고)', note: '' },
      { id: 'film-1787538387515', title: '올반 만두', role: '모델', year: '2022', category: 'CF(광고)', note: '' },
      { id: 'film-1787538656698', title: 'Jus2 – FOCUS ON ME', role: '출연', year: '2020', category: 'Music Video', note: '' },
    ],
  },
  {
    id: 'artist-lee-eunsoo',
    nameKo: '이은수',
    nameEn: 'LEE EUN SU',
    gender: 'Female',
    birth: '1998.01.26',
    height: 166,
    order: 2,
    bio: '선과 악이 공존하는 마스크와 묵직한 중저음 보이스. 날카로운 카리스마와 독보적인 아우라를 지녔습니다.',
    profileImageUrl: OFFICIAL_ACTOR_IMAGES['lee-eunsoo'],
    image: OFFICIAL_ACTOR_IMAGES['lee-eunsoo'],
    profileImage: OFFICIAL_ACTOR_IMAGES['lee-eunsoo'],
    isActive: true,
    galleryImages: [],
    filmography: [
      { id: 'film-1787544605376', title: '의정부음악극축제 로고송 <우리들의 축제>공연', role: '보컬', year: '밴드', category: 'Other', note: '' },
      { id: 'film-1787544561656', title: '의정부음악극축제 폐막공연', role: '보컬', year: '밴드', category: 'Other', note: '' },
      { id: 'film-1787544549454', title: '신나는예술여행 군부대 및 학교 공연', role: '보컬', year: '밴드', category: 'Other', note: '' },
      { id: 'film-1787544535735', title: '방방곡곡문화공감 사업 <같은 공간 다른 시간>공연', role: '보컬', year: '밴드', category: 'Other', note: '' },
      { id: 'film-1787544505927', title: '경기도 찾아가는문화활동 공연', role: '보컬', year: '밴드', category: 'Other', note: '' },
      { id: 'film-1787544460583', title: '경기아트센터 찾아가는 문화복지 공연', role: '보컬', year: '밴드', category: 'Other', note: '' },
    ],
  },
  {
    id: 'artist-park-minwook',
    nameKo: '박민욱',
    nameEn: 'PARK MINWOOK',
    gender: 'Male',
    birth: '1996.09.29',
    height: 180,
    order: 3,
    bio: '차분한 분위기 속에 자신만의 깊이를 가진 배우. 섬세한 감정 표현과 안정적인 몰입력을 바탕으로 인물의 감정을 자연스럽게 전달하며, 장르와 캐릭터에 따라 다양한 모습을 보여줄 수 있는 배우로 성장하고 있습니다.',
    profileImageUrl: OFFICIAL_ACTOR_IMAGES['park-minwook'],
    image: OFFICIAL_ACTOR_IMAGES['park-minwook'],
    profileImage: OFFICIAL_ACTOR_IMAGES['park-minwook'],
    isActive: true,
    galleryImages: [],
    filmography: [
      { id: 'film-1788400816188', title: '웹드라마 하이파이브', role: '모세', year: '2018', category: 'Drama', note: '' },
      { id: 'film-1788400785010', title: '웹드라마 썸데이', role: '백서준', year: '2018', category: 'Drama', note: '' },
      { id: 'film-1788400768227', title: '웹드라마 썸데이', role: '박민호', year: '2018', category: 'Drama', note: '' },
      { id: 'film-1788401124656', title: '상쾌환 환 TVC', role: '모델', year: '2022', category: 'CF(광고)', note: '' },
      { id: 'film-1788401105184', title: '컨디션 환 TVC', role: '모델', year: '2021', category: 'CF(광고)', note: '' },
      { id: 'film-1788401087128', title: '영남대학교 Y형 인재 홍보영상', role: '모델', year: '2019', category: 'CF(광고)', note: '' },
      { id: 'film-1788401022633', title: '맥도날드 TV광고', role: '모델', year: '2019', category: 'CF(광고)', note: '' },
      { id: 'film-1788400991433', title: '헤지스 - 립 밤 / 컨실러 밥로스 / 헤어라이너 미용실', role: '모델', year: '2019', category: 'CF(광고)', note: '' },
      { id: 'film-1788400911665', title: '도우도우 수면제품', role: '메인모델', year: '2019', category: 'CF(광고)', note: '' },
      { id: 'film-1788400884514', title: 'PRETTY BROWN [아니였나봐]', role: '주연', year: '2021', category: 'Music Video', note: '' },
      { id: 'film-1788400861082', title: '롯데백화점 뮤비', role: '출연', year: '2020', category: 'Music Video', note: '' },
      { id: 'film-1788400841378', title: '은희영 [걷다]', role: '주연', year: '2019', category: 'Music Video', note: '' },
    ],
  },
  {
    id: 'artist-park-hyunjin',
    nameKo: '박현진',
    nameEn: 'PARK HYUN JIN',
    gender: 'Female',
    birth: '1990.11.23',
    height: 173,
    order: 5,
    bio: '따뜻한 미소 속 날카로운 집중력. 자연스러운 일상 연기부터 거친 감정 신까지 폭넓은 스펙트럼을 증명하는 실력파 신예.',
    profileImageUrl: OFFICIAL_ACTOR_IMAGES['park-hyunjin'],
    image: OFFICIAL_ACTOR_IMAGES['park-hyunjin'],
    profileImage: OFFICIAL_ACTOR_IMAGES['park-hyunjin'],
    isActive: true,
    galleryImages: [],
    filmography: [
      { id: 'film-1787805148599', title: 'TVN 세컨드 카운트', role: '비서', year: '2026', category: 'Drama', note: '' },
      { id: 'film-1787805176881', title: 'JTBC 공작도시', role: '출연', year: '2022', category: 'Drama', note: '' },
      { id: 'film-1787805556077', title: 'JTBC 모범형사2', role: '마약녀', year: '2021', category: 'Drama', note: '' },
      { id: 'film-1787805584973', title: '2020 웹드라마 일 좀 합시다 일!', role: '주연 박음주', year: '2020', category: 'Drama', note: '' },
      { id: 'film-1787805619597', title: '청어', role: '동사무소 직원', year: '2025', category: 'Movie', note: '' },
      { id: 'film-1787805661668', title: '2023 범죄도시4', role: '카지노 대박 딜러', year: '2023', category: 'Movie', note: '' },
      { id: 'film-1787805737764', title: '아이월송', role: '조연 미정', year: '2021', category: 'Movie', note: '' },
      { id: 'film-1787805807197', title: '약 서른개의 거짓말', role: '박화', year: '2019', category: 'Theater', note: '' },
      { id: 'film-1787805925659', title: '스케쳐스', role: '모델', year: '2025', category: 'CF(광고)', note: '' },
      { id: 'film-1787805895683', title: '헤라', role: '모델', year: '2025', category: 'CF(광고)', note: '' },
      { id: 'film-1787805947635', title: '미래에세증권', role: '모델', year: '2022', category: 'CF(광고)', note: '' },
      { id: 'film-1787805982034', title: '웰리스', role: '모델', year: '2021', category: 'CF(광고)', note: '' },
      { id: 'film-1787806001771', title: 'SK매직건조기', role: '모델', year: '2019', category: 'CF(광고)', note: '' },
      { id: 'film-1787805838611', title: '2019 박다예 – 봄 나만의 크리스마스', role: '출연', year: '2019', category: 'Music Video', note: '' },
      { id: 'film-1787806026612', title: '서울액션스쿨 26기', role: '수료', year: '2022', category: 'Other', note: '' },
      { id: 'film-1787806098804', title: '2015 미스코리아', role: '대전/충남 진 우정상', year: '2015', category: 'Other', note: '' },
    ],
  },
];

export const ARTISTS: Artist[] = STATIC_OFFICIAL_ARTISTS;

/**
 * Helper to retrieve official actor image.
 * Uses strict slug mapping, never external or stock fallback.
 */
export function getOfficialActorImage(artist?: Artist | null): string | null {
  if (!artist) return null;
  const rawUrl = artist.profileImageUrl || artist.image || artist.profileImage;
  if (rawUrl && !rawUrl.startsWith('data:') && !rawUrl.includes('placeholder')) {
    return rawUrl;
  }
  return null;
}
