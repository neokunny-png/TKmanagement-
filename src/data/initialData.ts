import { Artist, NewsArticle } from '../types';

export const INITIAL_ARTISTS: Artist[] = [
  {
    id: 'artist-choi-eunseo',
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
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=85'
    ],
    showreelUrl: '',
    filmography: [
      { id: 'f2', year: '2025', title: '웹드라마 [너의 계절이 지나갈 때]', role: '주연 (한다온 역)', category: 'Drama' },
      { id: 'f1', year: '2026', title: '단편영화 [새벽의 파도]', role: '주연 (유진 역)', category: 'Movie', note: '제27회 전주국제영화제 단편경쟁 초청' },
      { id: 'f3', year: '2025', title: '연극 [안티고네]', role: '이스메네 역', category: 'Theater', note: '대학로 예술극장' },
      { id: 'f4', year: '2025', title: '아모레퍼시픽 뷰티 브랜드 필름', role: '메인 모델', category: 'CF(광고)' },
      { id: 'f5', year: '2024', title: '인디밴드 뮤직비디오 [푸른 밤]', role: '여주인공', category: 'Music Video' }
    ]
  },
  {
    id: 'artist-lee-eunsu',
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
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=85'
    ],
    showreelUrl: '',
    filmography: [
      { id: 'f7', year: '2025', title: 'OTT 오리지널 시리즈 [체이서]', role: '조연 (민성 역)', category: 'Drama' },
      { id: 'f6', year: '2026', title: '독립장편 [우리가 머문 자리]', role: '주연 (태오 역)', category: 'Movie' },
      { id: 'f8', year: '2025', title: '뮤지컬 [스프링 어웨이크닝]', role: '모리츠 역', category: 'Theater' },
      { id: 'f9', year: '2024', title: '현대자동차 N Line 브랜드 캠페인', role: '메인 모델', category: 'CF(광고)' }
    ]
  },
  {
    id: 'artist-park-minjun',
    nameKo: '박민준',
    nameEn: 'PARK MIN JUN',
    birth: '1999.07.22',
    height: 185,
    weight: 72,
    specialty: ['사투리(경상도/전라도)', '승마', '고난도 액션/스턴트', '스노보드'],
    education: '서울예술대학교 공연학부 연기전공',
    languages: ['한국어 (Native)'],
    agency: 'TK MANAGEMENT (㈜TK Company)',
    instagram: '@minjun_park_scene',
    gender: 'Male',
    order: 3,
    isActive: true,
    bio: '선 굵은 피지컬과 단단하고 깊은 눈매에서 뿜어져 나오는 강인한 생명력. 온몸을 던지는 역동적인 액션은 물론, 인물의 현실감 넘치는 고뇌와 진정성을 묵직하고 설득력 있게 풀어내는 배우입니다.',
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85'
    ],
    showreelUrl: '',
    filmography: [
      { id: 'f11', year: '2025', title: 'tvN 드라마 [형사의 밤]', role: '에피소드 주인공 (영우 역)', category: 'Drama' },
      { id: 'f10', year: '2026', title: '상업영화 [무법지대]', role: '조연 (강철 역)', category: 'Movie' },
      { id: 'f13', year: '2024', title: '연극 [갈매기]', role: '뜨레쁠례프 역', category: 'Theater' },
      { id: 'f12', year: '2024', title: '스포츠웨어 데상트 글로벌 캠페인', role: '모델', category: 'CF(광고)' }
    ]
  },
  {
    id: 'artist-park-doi',
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
    profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=85'
    ],
    showreelUrl: '',
    filmography: [
      { id: 'f15', year: '2025', title: 'JTBC 드라마 [청춘기록: 리와인드]', role: '조연 (서하늘 역)', category: 'Drama' },
      { id: 'f14', year: '2026', title: '단편영화 [도쿄에서 온 편지]', role: '주연 (사나 역)', category: 'Movie', note: '한일합작 단편' },
      { id: 'f16', year: '2025', title: '메종 키츠네 코리아 디지털 캠페인', role: '뮤즈', category: 'CF(광고)' },
      { id: 'f17', year: '2024', title: '감성 R&B 뮤직비디오', role: '주연', category: 'Music Video' }
    ]
  },
  {
    id: 'artist-park-hyunjin',
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
    profileImage: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=85'
    ],
    showreelUrl: '',
    filmography: [
      { id: 'f19', year: '2025', title: 'KBS 단막극 [그 여름의 행로]', role: '주연 (이도현 역)', category: 'Drama' },
      { id: 'f18', year: '2026', title: '단편영화 [마지막 쿼터]', role: '주연 (진수 역)', category: 'Movie' },
      { id: 'f20', year: '2025', title: '연극 [시련]', role: '존 프락터 역', category: 'Theater' },
      { id: 'f21', year: '2024', title: '삼성 갤럭시 캠퍼스 앰버서더', role: '모델', category: 'CF(광고)' }
    ]
  },
  {
    id: 'artist-park-aaron',
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
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&w=1200&q=85'
    ],
    showreelUrl: '',
    filmography: [
      { id: 'f22', year: '2026', title: '글로벌 스트리밍 [SEOUL CYBER]', role: '조연 (Leo 역)', category: 'Drama', note: '영미권 동시 공개' },
      { id: 'f25', year: '2024', title: '단편영화 [무제]', role: '주연 (카이 역)', category: 'Movie' },
      { id: 'f24', year: '2025', title: '나이키 코리아 디지털 광고', role: '댄서 & 모델', category: 'CF(광고)' },
      { id: 'f23', year: '2025', title: '패션 필름 [METAMORPHOSIS]', role: '단독 모델', category: 'Other' }
    ]
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'TK MANAGEMENT 공식 웹사이트 OPEN 및 신예 아티스트 6인 라인업 공개',
    category: 'Notice',
    date: '2026.08.20',
    summary: '㈜TK Company의 액터스 레이블 TK MANAGEMENT가 공식 웹사이트를 개설하고 차세대 스크린을 이끌어갈 신예 배우 6인의 공식 프로필을 공개했습니다.',
    content: `안녕하세요, TK MANAGEMENT입니다.

배우의 가능성을 발견하고 새로운 장면을 만들어가는 프리미엄 액터스 매니지먼트 TK MANAGEMENT의 공식 웹사이트가 정식 런칭되었습니다.

이번 런칭과 함께 최은서, 이은수, 박민준, 박도이, 박현진, 박아론 등 6인의 독보적인 신예 아티스트들의 공식 프로필, 필모그래피 및 최신 쇼릴이 공개되었습니다.

TK MANAGEMENT는 체계적인 신인 발굴(Discovery), 트레이닝(Development), 전문적인 매니지먼트(Management)를 통해 배우들이 스크린과 무대에서 최고의 역량을 펼칠 수 있도록 전폭적인 지원을 아끼지 않을 것입니다.

캐스팅 및 비즈니스 문의는 웹사이트 내 CONTACT 페이지 또는 캐스팅 및 섭외 담당자 공식 메일(taz0206@naver.com)을 통해 상시 접수하고 있습니다.

많은 관심과 성원을 부탁드립니다.

감사합니다.
㈜TK Company / TK MANAGEMENT 배상`,
    coverImage: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85',
    isPinned: true,
    author: 'TK MANAGEMENT 홍보팀',
    createdAt: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: 'news-2',
    title: '2026년 하반기 TK MANAGEMENT 신인 배우 공개 오디션 [YOUR NEXT SCENE]',
    category: 'Casting',
    date: '2026.08.15',
    summary: 'TK MANAGEMENT에서 스크린과 브라운관을 빛낼 새로운 얼굴을 찾습니다. 연령·성별·경력의 제한 없이 배우로서의 열정과 가능성을 지닌 모든 분들의 지원을 환영합니다.',
    content: `[ 2026 하반기 신인 배우 상시 공개 오디션 ]

"당신에게도 첫 번째 장면이 있습니다."
TK MANAGEMENT는 아직 발견되지 않은 배우의 숨겨진 가능성을 찾습니다.

1. 모집 분야: 신인 배우 (남/녀)
2. 지원 자격:
 - 성별 제한 없음
 - 연령 제한 없음
 - 경력 제한 없음 (신인, 지망생, 연극/뮤지컬 경력자 모두 가능)
3. 접수 방법: TK MANAGEMENT 공식 웹사이트 > AUDITION 메뉴를 통한 온라인 지원서 접수
4. 제출 서류:
 - 기본 인적사항 및 신체 스펙
 - 프로필 사진 (얼굴 클로즈업, 상반신, 전신)
 - 자유 연기 영상 링크 (유튜브/비메오 등)

접수된 모든 지원서는 전문 캐스팅 디렉터 팀의 심사를 거치며, 1차 서류 합격자에 한해 개별 오디션 일정이 안내됩니다.

여러분의 다음 장면을 TK MANAGEMENT와 함께 시작하세요.`,
    coverImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85',
    isPinned: true,
    author: 'TK MANAGEMENT 캐스팅팀',
    createdAt: Date.now() - 1000 * 60 * 60 * 48
  },
  {
    id: 'news-3',
    title: '배우 최은서, 독립 단편영화 [새벽의 파도] 제27회 전주국제영화제 초청',
    category: 'Media',
    date: '2026.08.10',
    summary: 'TK MANAGEMENT 소속 배우 최은서가 주연을 맡은 단편영화 [새벽의 파도]가 제27회 전주국제영화제 한국단편경쟁 부문에 공식 초청되었습니다.',
    content: `배우 최은서가 주연으로 열연한 단편영화 [새벽의 파도](감독 김태환)가 제27회 전주국제영화제 한국단편경쟁 부문 본선 진출작으로 선정되었습니다.

극 중 최은서는 내면의 깊은 상처를 안고 바닷가 마을을 찾아온 주인공 '유진' 역을 맡아, 특유의 섬세한 감정선과 밀도 높은 눈빛 연기로 호평을 이끌어냈습니다.

최은서 배우의 차기작 및 영화제 상영 일정은 추후 공식 채널을 통해 공지될 예정입니다.`,
    coverImage: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=85',
    isPinned: false,
    author: 'TK MANAGEMENT 홍보팀',
    createdAt: Date.now() - 1000 * 60 * 60 * 96
  }
];
