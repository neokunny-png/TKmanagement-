import { Artist } from '../types';

export const OFFICIAL_ARTIST_IMAGES: Record<string, string> = {
  'choi-eunseo': '/images/actors/choi-eunseo.jpg',
  'lee-eunsu': '/images/actors/lee-eunsu.jpg',
  'park-minwook': '/images/actors/park-minwook.jpg',
  'park-doyi': '/images/actors/park-doyi.jpg',
  'park-hyunjin': '/images/actors/park-hyunjin.jpg',
  'park-aron': '/images/actors/park-aron.jpg',
};

/**
 * Validates that all artists only reference their official local image paths
 * and flags any illegal external URL or non-standard placeholder.
 */
export function validateArtistImages(artistList: Artist[]): boolean {
  let isValid = true;
  for (const artist of artistList) {
    const expected = OFFICIAL_ARTIST_IMAGES[artist.id];
    if (expected && artist.profileImage && artist.profileImage !== expected && !artist.profileImage.startsWith('data:')) {
      console.error(`[INVALID ARTIST IMAGE] 배우 "${artist.nameKo}"(${artist.id})의 이미지가 공식 경로(${expected})가 아닙니다: ${artist.profileImage}`);
      isValid = false;
    }
    if (artist.profileImage && (artist.profileImage.startsWith('http://') || artist.profileImage.startsWith('https://'))) {
      console.error(`[INVALID ARTIST IMAGE] 배우 "${artist.nameKo}"(${artist.id})에 허용되지 않은 외부 이미지 URL이 등록되어 있습니다: ${artist.profileImage}`);
      isValid = false;
    }
  }
  return isValid;
}

export const ARTISTS: Artist[] = [
  {
    id: 'choi-eunseo',
    nameKo: '최은서',
    nameEn: 'CHOI EUN SEO',
    birth: '2002.04.18',
    height: 168,
    weight: 48,
    specialty: ['현대무용', '피아노', '영어 연기', '승마'],
    education: '한국예술종합학교 연극원 연기과 재학',
    languages: ['한국어 (Native)', '영어 (Fluent)'],
    agency: 'TK MANAGEMENT (㈜TK Company)',
    instagram: '@eunseo_scene',
    gender: 'Female',
    order: 1,
    isActive: true,
    bio: '투명하고 맑은 마스크 속에 서늘한 파도와 같은 감정의 깊이를 품은 배우. 흔들리는 눈빛 하나, 찰나의 숨소리만으로도 인물이 감춘 가장 은밀하고 처연한 내면을 스크린 위에 팽팽하게 펼쳐냅니다.',
    profileImage: '/images/actors/choi-eunseo.jpg',
    showreelUrl: '',
    awards: ['제27회 전주국제영화제 단편경쟁 초청'],
    works: ['웹드라마 [너의 계절이 지나갈 때]', '단편영화 [새벽의 파도]', '연극 [안티고네]'],
    career: [
      '웹드라마 [너의 계절이 지나갈 때] 주연 (한다온 역)',
      '단편영화 [새벽의 파도] 주연 (유진 역)',
      '연극 [안티고네] 이스메네 역',
      '아모레퍼시픽 뷰티 브랜드 필름 메인 모델'
    ],
    filmography: [
      { id: 'f2', year: '2025', title: '웹드라마 [너의 계절이 지나갈 때]', role: '주연 (한다온 역)', category: 'Drama' },
      { id: 'f1', year: '2026', title: '단편영화 [새벽의 파도]', role: '주연 (유진 역)', category: 'Movie', note: '제27회 전주국제영화제 단편경쟁 초청' },
      { id: 'f3', year: '2025', title: '연극 [안티고네]', role: '이스메네 역', category: 'Theater', note: '대학로 예술극장' },
      { id: 'f4', year: '2025', title: '아모레퍼시픽 뷰티 브랜드 필름', role: '메인 모델', category: 'CF' },
      { id: 'f5', year: '2024', title: '인디밴드 뮤직비디오 [푸른 밤]', role: '여주인공', category: 'Music Video' }
    ]
  },
  {
    id: 'lee-eunsu',
    nameKo: '이은수',
    nameEn: 'LEE EUN SU',
    birth: '2000.11.05',
    height: 183,
    weight: 70,
    specialty: ['복싱', '수영', '뮤지컬 보컬', '기타 연주'],
    education: '중앙대학교 예술대학 공연영상창작학부 연극전공',
    languages: ['한국어 (Native)', '일본어 (Conversational)'],
    agency: 'TK MANAGEMENT (㈜TK Company)',
    instagram: '@eunsu_scene',
    gender: 'Male',
    order: 2,
    isActive: true,
    bio: '소년의 위태로운 방황과 차가운 느와르적 긴장감이 공존하는 독보적인 마스크. 묵직한 중저음 보이스와 날카로운 시선으로 침묵 속에서도 서사를 완성하며 관객의 시선을 단숨에 사로잡는 흡인력을 지녔습니다.',
    profileImage: '/images/actors/lee-eunsu.jpg',
    showreelUrl: '',
    awards: [],
    works: ['OTT [체이서]', '독립장편 [우리가 머문 자리]', '뮤지컬 [스프링 어웨이크닝]'],
    career: [
      'OTT 오리지널 시리즈 [체이서] 조연 (민성 역)',
      '독립장편 [우리가 머문 자리] 주연 (태오 역)',
      '뮤지컬 [스프링 어웨이크닝] 모리츠 역',
      '현대자동차 N Line 브랜드 캠페인 메인 모델'
    ],
    filmography: [
      { id: 'f7', year: '2025', title: 'OTT 오리지널 시리즈 [체이서]', role: '조연 (민성 역)', category: 'Drama' },
      { id: 'f6', year: '2026', title: '독립장편 [우리가 머문 자리]', role: '주연 (태오 역)', category: 'Movie' },
      { id: 'f8', year: '2025', title: '뮤지컬 [스프링 어웨이크닝]', role: '모리츠 역', category: 'Theater' },
      { id: 'f9', year: '2024', title: '현대자동차 N Line 브랜드 캠페인', role: '메인 모델', category: 'CF' }
    ]
  },
  {
    id: 'park-minwook',
    nameKo: '박민욱',
    nameEn: 'PARK MIN WOOK',
    birth: '1999.07.22',
    height: 185,
    weight: 72,
    specialty: ['사투리(경상도/전라도)', '승마', '고난도 액션/스턴트', '스노보드'],
    education: '서울예술대학교 공연학부 연기전공',
    languages: ['한국어 (Native)'],
    agency: 'TK MANAGEMENT (㈜TK Company)',
    instagram: '@minwook_park_scene',
    gender: 'Male',
    order: 3,
    isActive: true,
    bio: '선 굵은 피지컬과 단단하고 깊은 눈매에서 뿜어져 나오는 강인한 생명력. 온몸을 던지는 역동적인 액션은 물론, 인물의 현실감 넘치는 고뇌와 진정성을 묵직하고 설득력 있게 풀어내는 배우입니다.',
    profileImage: '/images/actors/park-minwook.jpg',
    showreelUrl: '',
    awards: [],
    works: ['tvN 드라마 [형사의 밤]', '영화 [무법지대]', '연극 [갈매기]'],
    career: [
      'tvN 드라마 [형사의 밤] 에피소드 주인공 (영우 역)',
      '상업영화 [무법지대] 조연 (강철 역)',
      '연극 [갈매기] 뜨레쁠례프 역',
      '스포츠웨어 데상트 글로벌 캠페인 모델'
    ],
    filmography: [
      { id: 'f11', year: '2025', title: 'tvN 드라마 [형사의 밤]', role: '에피소드 주인공 (영우 역)', category: 'Drama' },
      { id: 'f10', year: '2026', title: '상업영화 [무법지대]', role: '조연 (강철 역)', category: 'Movie' },
      { id: 'f13', year: '2024', title: '연극 [갈매기]', role: '뜨레쁠례프 역', category: 'Theater' },
      { id: 'f12', year: '2024', title: '스포츠웨어 데상트 글로벌 캠페인', role: '모델', category: 'CF' }
    ]
  },
  {
    id: 'park-doyi',
    nameKo: '박도이',
    nameEn: 'PARK DO I',
    birth: '2004.09.12',
    height: 165,
    weight: 46,
    specialty: ['바이올린 (10년)', '일본어 회화', '한국무용', '스케이트보드'],
    education: '동국대학교 예술대학 연극학부 재학',
    languages: ['한국어 (Native)', '일본어 (JLPT N1 Fluent)'],
    agency: 'TK MANAGEMENT (㈜TK Company)',
    instagram: '@doi_scene',
    gender: 'Female',
    order: 4,
    isActive: true,
    bio: '렌즈를 응시하는 것만으로도 공간의 무드를 단숨에 장악하는 신비롭고 몽환적인 마스크. 틀에 갇히지 않는 유연한 감각과 당찬 에너지로 Z세대의 새로운 감성을 감각적으로 대변하는 차세대 뮤즈입니다.',
    profileImage: '/images/actors/park-doyi.jpg',
    showreelUrl: '',
    awards: ['한일합작 단편 영화제 본선 진출'],
    works: ['JTBC [청춘기록: 리와인드]', '단편영화 [도쿄에서 온 편지]'],
    career: [
      'JTBC 드라마 [청춘기록: 리와인드] 조연 (서하늘 역)',
      '단편영화 [도쿄에서 온 편지] 주연 (사나 역)',
      '메종 키츠네 코리아 디지털 캠페인 뮤즈',
      '감성 R&B 뮤직비디오 주연'
    ],
    filmography: [
      { id: 'f15', year: '2025', title: 'JTBC 드라마 [청춘기록: 리와인드]', role: '조연 (서하늘 역)', category: 'Drama' },
      { id: 'f14', year: '2026', title: '단편영화 [도쿄에서 온 편지]', role: '주연 (사나 역)', category: 'Movie', note: '한일합작 단편' },
      { id: 'f16', year: '2025', title: '메종 키츠네 코리아 디지털 캠페인', role: '뮤즈', category: 'CF' },
      { id: 'f17', year: '2024', title: '감성 R&B 뮤직비디오', role: '주연', category: 'Music Video' }
    ]
  },
  {
    id: 'park-hyunjin',
    nameKo: '박현진',
    nameEn: 'PARK HYUN JIN',
    birth: '2001.03.30',
    height: 180,
    weight: 68,
    specialty: ['태권도 (공인 4단)', '일렉/어쿠스틱 기타', '농구', '사투리'],
    education: '단국대학교 공연영화학부 연기전공',
    languages: ['한국어 (Native)'],
    agency: 'TK MANAGEMENT (㈜TK Company)',
    instagram: '@hyunjin_scene',
    gender: 'Male',
    order: 5,
    isActive: true,
    bio: '따뜻하고 무해한 청춘의 얼굴 뒤편에 웅크린 날카롭고 집요한 연기적 집중력. 일상의 편안하고 담백한 호흡부터 폭발하는 격정의 순간까지, 캐릭터에 온전히 녹아드는 진정성 있는 배우입니다.',
    profileImage: '/images/actors/park-hyunjin.jpg',
    showreelUrl: '',
    awards: [],
    works: ['KBS 단막극 [그 여름의 행로]', '단편영화 [마지막 쿼터]', '연극 [시련]'],
    career: [
      'KBS 단막극 [그 여름의 행로] 주연 (이도현 역)',
      '단편영화 [마지막 쿼터] 주연 (진수 역)',
      '연극 [시련] 존 프락터 역',
      '삼성 갤럭시 캠퍼스 앰버서더 모델'
    ],
    filmography: [
      { id: 'f19', year: '2025', title: 'KBS 단막극 [그 여름의 행로]', role: '주연 (이도현 역)', category: 'Drama' },
      { id: 'f18', year: '2026', title: '단편영화 [마지막 쿼터]', role: '주연 (진수 역)', category: 'Movie' },
      { id: 'f20', year: '2025', title: '연극 [시련]', role: '존 프락터 역', category: 'Theater' },
      { id: 'f21', year: '2024', title: '삼성 갤럭시 캠퍼스 앰버서더', role: '모델', category: 'CF' }
    ]
  },
  {
    id: 'park-aron',
    nameKo: '박아론',
    nameEn: 'PARK AARON',
    birth: '2003.12.01',
    height: 182,
    weight: 69,
    specialty: ['힙합/코레오 댄스', '영미권 원어민 영어', '디제잉', '작사'],
    education: '세종대학교 융합예술대학원 영화예술전공',
    languages: ['한국어 (Native)', '영어 (Bilingual Native)'],
    agency: 'TK MANAGEMENT (㈜TK Company)',
    instagram: '@aaron_scene',
    gender: 'Male',
    order: 6,
    isActive: true,
    bio: '글로벌 무대를 겨냥한 감각적인 비주얼과 거침없는 에너지. 유려한 언어 감각과 역동적인 리듬감으로 캐릭터에 입체적인 생명력을 불어넣으며 신선한 파동을 일으키는 라이징 엔터테이너입니다.',
    profileImage: '/images/actors/park-aron.jpg',
    showreelUrl: '',
    awards: [],
    works: ['글로벌 OTT [SEOUL CYBER]', '단편영화 [무제]'],
    career: [
      '글로벌 스트리밍 [SEOUL CYBER] 조연 (Leo 역)',
      '단편영화 [무제] 주연 (카이 역)',
      '나이키 코리아 디지털 광고 댄서 & 모델',
      '패션 필름 [METAMORPHOSIS] 단독 모델'
    ],
    filmography: [
      { id: 'f22', year: '2026', title: '글로벌 스트리밍 [SEOUL CYBER]', role: '조연 (Leo 역)', category: 'Drama', note: '영미권 동시 공개' },
      { id: 'f25', year: '2024', title: '단편영화 [무제]', role: '주연 (카이 역)', category: 'Movie' },
      { id: 'f24', year: '2025', title: '나이키 코리아 디지털 광고', role: '댄서 & 모델', category: 'CF' },
      { id: 'f23', year: '2025', title: '패션 필름 [METAMORPHOSIS]', role: '단독 모델', category: 'Other' }
    ]
  }
];

// Run validation immediately on module load in development/build
validateArtistImages(ARTISTS);

