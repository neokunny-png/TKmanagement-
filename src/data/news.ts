import { NewsArticle } from '../types';

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'TK MANAGEMENT 공식 웹사이트 런칭 안내',
    category: 'Notice',
    date: '2026.08.20',
    summary: '㈜TK Company의 액터스 레이블 TK MANAGEMENT 공식 웹사이트가 정식 런칭되었습니다.',
    content: `안녕하세요, TK MANAGEMENT입니다.

배우의 가능성을 발견하고 새로운 장면을 만들어가는 프리미엄 액터스 매니지먼트 TK MANAGEMENT의 공식 웹사이트가 정식 런칭되었습니다.

TK MANAGEMENT는 체계적인 신인 발굴(Discovery), 트레이닝(Development), 전문적인 매니지먼트(Management)를 통해 배우들이 스크린과 무대에서 최고의 역량을 펼칠 수 있도록 전폭적인 지원을 아끼지 않을 것입니다.

캐스팅 및 비즈니스 문의는 웹사이트 내 CONTACT 페이지 또는 캐스팅 및 섭외 담당자 공식 메일(taz0206@naver.com)을 통해 상시 접수하고 있습니다.

많은 관심과 성원을 부탁드립니다.

감사합니다.
㈜TK Company / TK MANAGEMENT 배상`,
    isPinned: true,
    author: 'TK MANAGEMENT 홍보팀',
    createdAt: Date.now() - 1000 * 60 * 60 * 24
  },
  {
    id: 'news-2',
    title: '2026년 하반기 TK MANAGEMENT 신인 배우 상시 오디션 안내 [YOUR NEXT SCENE]',
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
    isPinned: true,
    author: 'TK MANAGEMENT 캐스팅팀',
    createdAt: Date.now() - 1000 * 60 * 60 * 48
  }
];
