import React from 'react';
import { ArrowLeft, ArrowRight, Compass, Users, Award, Film, CheckCircle2, Sparkles, Mail, ShieldCheck } from 'lucide-react';
import { Artist, CompanyInfo } from '../types';
import { DEFAULT_COMPANY_INFO } from '../services/companyService';
import { getArtistSlug } from '../lib/seo';

export type SeoGuidePageType = 'management' | 'actor-agency' | 'actor-management-company';

interface SeoGuideViewProps {
  pageType: SeoGuidePageType;
  artists: Artist[];
  companyInfo?: CompanyInfo;
  onNavigate: (sectionId: string) => void;
  onSelectArtist: (artist: Artist) => void;
}

export const SeoGuideView: React.FC<SeoGuideViewProps> = ({
  pageType,
  artists,
  companyInfo = DEFAULT_COMPANY_INFO,
  onNavigate,
  onSelectArtist,
}) => {
  const activeArtists = artists.filter((a) => a.isActive !== false);

  const renderBreadcrumb = (currentLabel: string) => (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-between text-xs font-mono text-gray-400">
      <div className="flex items-center space-x-2">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('hero');
          }}
          className="text-sky-400 hover:text-white transition-colors cursor-pointer"
        >
          홈
        </a>
        <span>&gt;</span>
        <span className="text-white">{currentLabel}</span>
      </div>
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('hero');
        }}
        className="inline-flex items-center space-x-1.5 text-sky-400 hover:text-sky-300 transition-colors text-xs font-mono cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>메인으로 돌아가기</span>
      </a>
    </nav>
  );

  const renderOfficialActorsCard = () => (
    <section className="space-y-4 pt-6 border-t border-white/10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase block mb-1">
            OFFICIAL ROSTER
          </span>
          <h2 className="text-lg sm:text-xl font-display font-bold text-white">
            TK매니지먼트 공식 소속 배우
          </h2>
        </div>
        <a
          href="/artists"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('artists');
          }}
          className="text-xs font-mono text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
        >
          <span>소속 배우 전체 프로필 보기</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
        현재 TK매니지먼트에는 고유한 개성과 연기 스펙트럼을 지닌 4명의 공식 소속 배우가 활동하고 있습니다. 각 배우의 상세 프로필과 출연 작품(필모그래피)을 확인하실 수 있습니다.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {activeArtists.map((artist) => {
          const slug = getArtistSlug(artist);
          return (
            <a
              key={artist.id}
              href={`/artists/${slug}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectArtist(artist);
              }}
              className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block text-left"
            >
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                TK ACTOR
              </span>
              <div className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                {artist.nameKo} 배우
              </div>
              <div className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                {artist.nameEn}
              </div>
              <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between pt-2 border-t border-white/5">
                <span>프로필 보기</span>
                <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform">→</span>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );

  if (pageType === 'management') {
    return (
      <article className="pt-28 pb-20 bg-[#0B0C10] text-[#E5E7EB] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderBreadcrumb('배우 매니지먼트')}

          <header className="border-b border-white/10 pb-8 mb-10">
            <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase tracking-widest mb-3">
              <Compass className="w-4 h-4" />
              <span>ACTOR MANAGEMENT SYSTEM</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight mb-4">
              배우 매니지먼트
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
              TK매니지먼트(TK MANAGEMENT)는 연기자가 가진 고유한 가능성을 발견하고, 체계적인 프로필 관리와 작품 활동 지원을 통해 함께 성장해 나가는 파트너입니다.
            </p>
          </header>

          <div className="bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg space-y-10 text-xs sm:text-sm leading-relaxed text-gray-300 shadow-2xl">
            {/* 1. 배우 매니지먼트란? */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">01</span>
                <span>배우 매니지먼트란?</span>
              </h2>
              <p>
                연기자가 하나의 작품을 만나 관객과 시청자에게 설득력 있는 인물로 다가가기까지는 연기 준비 외에도 수많은 실무 과정이 동반됩니다. 매니지먼트는 배우가 오직 대본 분석과 캐릭터 구축, 그리고 현장 연기에만 집중할 수 있도록 활동 전반의 기반을 마련하고 함께 호흡하는 전문 파트너십입니다.
              </p>
              <p>
                단순히 일정을 전달하는 역할을 넘어, 연기자 개개인이 지닌 분위기와 목소리, 연기적 장점을 객관적으로 살피고 앞으로 나아갈 커리어의 방향을 함께 설계하는 과정이 핵심입니다.
              </p>
            </section>

            {/* 2. 배우 매니지먼트 회사의 역할 */}
            <section className="space-y-3 pt-6 border-t border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">02</span>
                <span>배우 매니지먼트 회사의 역할</span>
              </h2>
              <p>
                회사는 배우와 제작 현장을 잇는 공식 소통 창구로서 기능합니다. 제작사, 연출진, 캐스팅 디렉터와의 미팅 및 섭외 협의를 진행하며, 출연 계약 조건 검토와 촬영 스케줄 조율 등 배우 개인이 혼자 감당하기 어려운 실무 절차를 책임감 있게 수행합니다.
              </p>
              <p>
                또한 업계의 흐름과 제작 현황을 파악하여 소속 연기자가 자신의 스펙트럼을 넓힐 수 있는 적절한 시기와 작품을 만날 수 있도록 가교 역할을 담당합니다.
              </p>
            </section>

            {/* 3~6. 핵심 지원 체계 그리드 (소속 배우 활동 지원 / 배우 프로필 및 활동 관리 / 작품 및 캐스팅 관련 지원 / 신인배우 성장 지원) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-white/10">
              {/* 3. 소속 배우 활동 지원 */}
              <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                  <Award className="w-4 h-4" />
                  <span>03. ACTIVITY SUPPORT</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  소속 배우 활동 지원
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  작품 합류 전 대본 리딩과 의상·콘셉트 준비부터 촬영 현장 및 공연 무대 진행, 그리고 작품 공개 시점의 공식 소식 안내까지 전 과정이 안정적으로 이루어지도록 세심하게 뒷받침합니다.
                </p>
              </section>

              {/* 4. 배우 프로필 및 활동 관리 */}
              <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                  <Users className="w-4 h-4" />
                  <span>04. PROFILE &amp; ARCHIVE</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  배우 프로필 및 활동 관리
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  공식 웹사이트(<a href="/artists" onClick={(e) => { e.preventDefault(); onNavigate('artists'); }} className="text-sky-400 hover:underline">/artists</a>)와 인쇄용 PDF 바이오 시트를 통해 배우의 최신 프로필 화보, 신체 스펙, 분야별 출연작(드라마·영화·연극·광고·MV) 이력을 상시 최신화하여 캐스팅 담당자가 즉시 열람할 수 있도록 관리합니다.
                </p>
              </section>

              {/* 5. 작품 및 캐스팅 관련 지원 */}
              <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                  <Film className="w-4 h-4" />
                  <span>05. CASTING COORDINATION</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  작품 및 캐스팅 관련 지원
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  드라마, 웹드라마, 상업·독립영화, OTT 시리즈, 연극, CF(광고), 뮤직비디오 등 다양한 매체의 제작진에게 배역 이미지에 부합하는 소속 배우의 포트폴리오를 제안하고 오디션 및 출연 협의를 진행합니다.
                </p>
              </section>

              {/* 6. 신인배우 성장 지원 */}
              <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>06. NEW ACTOR DEVELOPMENT</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  신인배우 성장 지원
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  잠재력을 지닌 신인 연기자가 자신만의 개성과 연기 호흡을 정립할 수 있도록 방향성을 함께 고민하며, 카메라 테스트와 실전 오디션 경험을 통해 현장 적응력과 필모그래피를 차근차근 쌓아갈 수 있도록 돕습니다.
                </p>
              </section>
            </div>

            {/* 7. TK매니지먼트의 매니지먼트 방향 */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">07</span>
                <span>TK매니지먼트의 매니지먼트 방향</span>
              </h2>
              <p>
                TK매니지먼트(㈜TK Company)는 <strong className="text-white">발견(Discovery) → 성장과 훈련(Development) → 체계적 관리(Management) → 기회 연결(Opportunity)</strong>의 4단계 원칙을 바탕으로 운영됩니다. 단기적인 화제성이나 무리한 활동보다, 연기자가 작품 속에서 진정성 있는 호흡을 보여주고 현장에서 신뢰받는 파트너로 자리매김하는 것을 가장 중요하게 생각합니다.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="p-3 bg-[#141824] border border-white/5">
                  <span className="text-[10px] font-mono text-sky-400 block">STEP 01</span>
                  <strong className="text-xs sm:text-sm text-white block mt-0.5">발견 (Discovery)</strong>
                  <span className="text-[11px] text-gray-400 block mt-1">고유한 마스크와 연기 잠재력 발굴</span>
                </div>
                <div className="p-3 bg-[#141824] border border-white/5">
                  <span className="text-[10px] font-mono text-sky-400 block">STEP 02</span>
                  <strong className="text-xs sm:text-sm text-white block mt-0.5">성장 (Development)</strong>
                  <span className="text-[11px] text-gray-400 block mt-1">기초 역량 점검 및 이미지 브랜딩</span>
                </div>
                <div className="p-3 bg-[#141824] border border-white/5">
                  <span className="text-[10px] font-mono text-sky-400 block">STEP 03</span>
                  <strong className="text-xs sm:text-sm text-white block mt-0.5">관리 (Management)</strong>
                  <span className="text-[11px] text-gray-400 block mt-1">공식 프로필·필모그래피·일정 운영</span>
                </div>
                <div className="p-3 bg-[#141824] border border-white/5">
                  <span className="text-[10px] font-mono text-sky-400 block">STEP 04</span>
                  <strong className="text-xs sm:text-sm text-white block mt-0.5">기회 (Opportunity)</strong>
                  <span className="text-[11px] text-gray-400 block mt-1">다양한 매체 캐스팅 및 작품 활동</span>
                </div>
              </div>
            </section>

            {/* 8. 현재 소속 배우 */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <span className="text-sky-400 font-mono text-sm">08</span>
                  <span>현재 소속 배우</span>
                </h2>
                <a
                  href="/artists"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('artists');
                  }}
                  className="text-xs font-mono text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
                >
                  <span>소속 배우 전체 프로필 보기 (/artists)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                현재 TK매니지먼트에는 각기 다른 매력과 연기 색깔을 지닌 4명의 공식 소속 배우가 활발히 활동하고 있습니다. 이름을 선택하시면 각 배우의 상세 프로필과 출연 작품을 확인하실 수 있습니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activeArtists.map((artist) => {
                  const slug = getArtistSlug(artist);
                  const summaryBySlug: Record<string, string> = {
                    'choi-eunseo': '영화, 드라마, 광고, 뮤직비디오 등 다양한 매체에서 폭넓은 캐릭터를 소화하는 배우',
                    'lee-eunsoo': '연극 무대와 공연 현장을 통해 탄탄한 연기 호흡과 깊이 있는 표현력을 보여주는 배우',
                    'park-minwook': '개성 있는 마스크와 안정적인 존재감으로 다양한 작품과 캐스팅 기회를 넓혀가는 배우',
                    'park-hyunjin': '맑고 다채로운 이미지와 신선한 에너지로 작품 활동 영역을 확장해 나가고 있는 배우',
                  };
                  return (
                    <a
                      key={artist.id}
                      href={`/artists/${slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectArtist(artist);
                      }}
                      className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block text-left"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-sky-400 uppercase">
                          TK MANAGEMENT ACTOR
                        </span>
                        <span className="text-[11px] font-mono text-gray-400 group-hover:text-sky-400 transition-colors">
                          /artists/{slug} →
                        </span>
                      </div>
                      <div className="flex items-baseline space-x-2">
                        <strong className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                          {artist.nameKo} 배우
                        </strong>
                        <span className="text-xs font-mono text-gray-400 uppercase">
                          {artist.nameEn}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                        {summaryBySlug[slug] || 'TK매니지먼트 공식 소속 배우 프로필 및 작품 활동 정보'}
                      </p>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* 9. 신인배우 오디션 & 10. 문의 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-white/10">
              {/* 9. 신인배우 오디션 */}
              <section className="bg-[#161A26] p-5 sm:p-6 border border-white/10 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="text-xs font-mono text-sky-400 font-bold block">09. AUDITION</span>
                  <h2 className="text-lg font-bold text-white">신인배우 오디션</h2>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    연기에 대한 진정성과 열정을 지닌 신인 및 배우 지망생을 상시 모집합니다. 1차 온라인 서류 심사 후 2차 대면 카메라 오디션과 심층 미팅을 거쳐 전속 계약을 논의하며, 모든 오디션 과정에서는 어떠한 명목의 비용도 요구하지 않습니다.
                  </p>
                </div>
                <div>
                  <a
                    href="/audition"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('audition');
                    }}
                    className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>신인배우 오디션 지원 안내 바로가기 (/audition)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </section>

              {/* 10. 문의 */}
              <section className="bg-[#161A26] p-5 sm:p-6 border border-white/10 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <span className="text-xs font-mono text-sky-400 font-bold block">10. CONTACT</span>
                  <h2 className="text-lg font-bold text-white">문의</h2>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    소속 배우의 드라마·영화·광고·공연 캐스팅 섭외 제안 및 비즈니스 협업 문의는 공식 문의 페이지 또는 공식 이메일({companyInfo.email || 'taz0206@naver.com'})을 통해 신속하게 안내받으실 수 있습니다.
                  </p>
                </div>
                <div>
                  <a
                    href="/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('contact');
                    }}
                    className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <span>캐스팅 및 비즈니스 문의 바로가기 (/contact)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </section>
            </div>

            {/* 하단 관련 내부 링크 요약 */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 font-mono">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-gray-500">주요 바로가기:</span>
                <a href="/artists" onClick={(e) => { e.preventDefault(); onNavigate('artists'); }} className="text-sky-400 hover:underline">/artists</a>
                <span>·</span>
                <a href="/artists/choi-eunseo" onClick={(e) => { e.preventDefault(); const a = activeArtists.find(x => getArtistSlug(x) === 'choi-eunseo'); if (a) onSelectArtist(a); }} className="text-sky-400 hover:underline">최은서</a>
                <span>·</span>
                <a href="/artists/lee-eunsoo" onClick={(e) => { e.preventDefault(); const a = activeArtists.find(x => getArtistSlug(x) === 'lee-eunsoo'); if (a) onSelectArtist(a); }} className="text-sky-400 hover:underline">이은수</a>
                <span>·</span>
                <a href="/artists/park-minwook" onClick={(e) => { e.preventDefault(); const a = activeArtists.find(x => getArtistSlug(x) === 'park-minwook'); if (a) onSelectArtist(a); }} className="text-sky-400 hover:underline">박민욱</a>
                <span>·</span>
                <a href="/artists/park-hyunjin" onClick={(e) => { e.preventDefault(); const a = activeArtists.find(x => getArtistSlug(x) === 'park-hyunjin'); if (a) onSelectArtist(a); }} className="text-sky-400 hover:underline">박현진</a>
                <span>·</span>
                <a href="/audition" onClick={(e) => { e.preventDefault(); onNavigate('audition'); }} className="text-sky-400 hover:underline">오디션</a>
                <span>·</span>
                <a href="/contact" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="text-sky-400 hover:underline">문의</a>
              </div>
              <div className="flex items-center gap-3">
                <a href="/actor-agency" onClick={(e) => { e.preventDefault(); onNavigate('actor-agency'); }} className="text-gray-400 hover:text-sky-400 transition-colors">배우 소속사 안내</a>
                <span>|</span>
                <a href="/actor-management-company" onClick={(e) => { e.preventDefault(); onNavigate('actor-management-company'); }} className="text-gray-400 hover:text-sky-400 transition-colors">배우 기획사 안내</a>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (pageType === 'actor-agency') {
    return (
      <article className="pt-28 pb-20 bg-[#0B0C10] text-[#E5E7EB] min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderBreadcrumb('배우 소속사')}

          <header className="border-b border-white/10 pb-8 mb-10">
            <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase tracking-widest mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>ACTOR AGENCY GUIDE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight mb-4">
              배우 소속사 TK매니지먼트
            </h1>
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
              연기자의 활동을 뒷받침하는 소속사의 실질적인 역할과 파트너십, 그리고 신인 연기자가 소속사를 찾고 프로필·오디션을 준비할 때 알아두어야 할 기준을 안내합니다.
            </p>
          </header>

          <div className="bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg space-y-10 text-xs sm:text-sm leading-relaxed text-gray-300 shadow-2xl">
            {/* 1. 배우 소속사의 역할 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">01</span>
                <span>배우 소속사의 역할</span>
              </h2>
              <p>
                소속사는 연기자의 대외적인 공식 창구이자, 작품 활동의 전 과정을 함께 계획하고 조율하는 실무 조직입니다. 개인이 홀로 접근하기 어려운 드라마·영화·공연·광고 제작진과의 네트워크를 연결하고, 오디션 일정 조율부터 출연 협의, 촬영 현장 지원까지 체계적으로 뒷받침합니다.
              </p>
              <p>
                또한 연기자의 공식 프로필과 필모그래피를 아카이빙하여 캐스팅 담당자에게 신뢰도 높은 정보를 제공하고, 작품 외적인 행정 업무에 대한 부담을 덜어 연기자가 본업인 연기에만 몰입할 수 있는 환경을 만듭니다.
              </p>
            </section>

            {/* 2. 배우와 매니지먼트사의 관계 */}
            <section className="space-y-3 pt-6 border-t border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">02</span>
                <span>배우와 매니지먼트사의 관계</span>
              </h2>
              <p>
                연기자와 회사는 일방적인 관리 대상이 아니라 상호 신뢰를 바탕으로 한 동반자 관계입니다. 연기자가 현장에서 진정성 있는 연기와 성실한 태도를 보여줄 때 회사의 대외 신뢰도가 높아지고, 회사가 체계적인{' '}
                <a
                  href="/management"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('management');
                  }}
                  className="text-sky-400 hover:underline"
                >
                  매니지먼트 시스템(/management)
                </a>
                으로 뒷받침할 때 연기자의 활동 폭이 넓어집니다.
              </p>
              <p>
                따라서 눈앞의 단기적인 성과에 급급하기보다, 배우 고유한 이미지와 장단점을 솔직하게 공유하고 중장기적인 캐릭터 방향을 함께 조율해 나가는 소통 과정이 무엇보다 중요합니다.
              </p>
            </section>

            {/* 3. 신인배우가 소속사를 선택할 때 확인할 사항 */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">03</span>
                <span>신인배우가 소속사를 선택할 때 확인할 사항</span>
              </h2>
              <p>
                처음 회사를 알아보는 신인 연기자나 지망생이라면 아래의 기본 사항을 꼼꼼하게 점검하는 것이 안전합니다.
              </p>
              <div className="space-y-3 pt-1">
                <div className="bg-[#161A26] p-4 border border-white/5 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">법인 및 대중문화예술기획업 관련 정보의 투명성</h3>
                    <p className="text-xs text-gray-300">
                      정식 상호와 사업자등록번호, 대중문화예술기획업 등록(또는 등록 진행 현황), 사업장 소재지 및 공식 연락처가 웹사이트에 명확히 공개되어 있는지 확인해야 합니다.
                    </p>
                  </div>
                </div>

                <div className="bg-[#161A26] p-4 border border-white/5 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">오디션 및 심사 과정에서의 비용 요구 여부</h3>
                    <p className="text-xs text-gray-300">
                      정상적인 오디션과 전속 논의 과정에서는 참가비, 프로필 촬영비, 교육비 등의 명목으로 지원자에게 금전을 요구하지 않습니다.
                    </p>
                  </div>
                </div>

                <div className="bg-[#161A26] p-4 border border-white/5 flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">현재 소속 연기자의 프로필 및 활동 관리 상태</h3>
                    <p className="text-xs text-gray-300">
                      실제 소속되어 활동 중인 배우들의 공식 프로필과 출연 이력이 성실하게 업데이트되고 있는지, 외부 캐스팅 담당자가 열람할 수 있는 공식 창구가 운영되는지 살펴보는 것이 좋습니다.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. 배우 프로필 준비 & 5. 오디션 준비 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-white/10">
              {/* 4. 배우 프로필 준비 */}
              <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                  <Users className="w-4 h-4" />
                  <span>04. PROFILE PREPARATION</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  배우 프로필 준비
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  프로필 사진은 과도한 색감 보정이나 리터칭을 피하고, 본연의 이목구비와 전체적인 분위기를 자연스럽게 확인할 수 있는 <strong className="text-white">정면 클로즈업, 상반신, 전신 사진</strong>으로 구성하는 것이 좋습니다. 기존에 출연한 단편영화, 연극, 워크숍, 광고 등 실제 확인 가능한 경력이 있다면 연도와 배역을 정확하게 정리해 두어야 합니다.
                </p>
              </section>

              {/* 5. 오디션 준비 */}
              <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>05. AUDITION PREPARATION</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  오디션 준비
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  서류 지원 시 사진과 함께 본인의 발성, 딕션, 시선 처리를 보여줄 수 있는 <strong className="text-white">1~2분 내외의 독백 또는 자유 연기 영상</strong>을 준비하면 심사에 큰 도움이 됩니다. 대면 카메라 오디션에서는 화려한 기교보다 대사의 상황을 정확히 이해하고 본인의 호흡으로 자연스럽게 전달하는 것이 중요합니다.
                </p>
              </section>
            </div>

            {/* 6. 배우 캐스팅과 매니지먼트의 관계 */}
            <section className="space-y-3 pt-6 border-t border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">06</span>
                <span>배우 캐스팅과 매니지먼트의 관계</span>
              </h2>
              <p>
                작품 캐스팅은 단순히 프로필을 배포하는 것만으로 이루어지지 않습니다. 배역의 연령대와 성격, 작품의 톤앤매너에 어울리는 연기자를 선별하여 제작진에게 제안하고, 오디션 기회를 조율한 뒤 최종 합류까지 신뢰 있게 소통하는 일련의 과정이 유기적으로 맞물려야 합니다.
              </p>
              <p>
                평소 체계적인{' '}
                <a
                  href="/management"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('management');
                  }}
                  className="text-sky-400 hover:underline"
                >
                  배우 매니지먼트
                </a>
                를 통해 프로필 사진, 출연 기록, 연기 영상이 잘 정돈되어 있을수록 제작사 및 캐스팅 디렉터와의 협업이 한층 빠르고 정확하게 진행됩니다.
              </p>
            </section>

            {/* 7. TK매니지먼트 소개 */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">07</span>
                <span>TK매니지먼트 소개</span>
              </h2>
              <p>
                TK매니지먼트(TK MANAGEMENT, 법인명: ㈜TK Company)는 배우의 잠재력을 발굴하고 드라마, 영화, 연극, 광고 등 다양한 매체에서의 작품 활동을 지원하는 아티스트 매니지먼트사입니다. 투명한 정보 공개와 성실한 현장 지원을 바탕으로 연기자와 함께 성장해 나가고 있습니다.
              </p>
              <div className="bg-[#161A26] border border-white/5 p-5 rounded text-xs space-y-2 font-mono text-gray-300">
                <div>• 상호: {companyInfo.companyName || '㈜TK Company (티케이컴퍼니)'}</div>
                <div>• 브랜드명: TK매니지먼트 (TK MANAGEMENT / 티케이매니지먼트)</div>
                <div>• 사업자등록번호: {companyInfo.businessNumber || '291-88-03353'}</div>
                <div>• 대중문화예술기획업 등록: {companyInfo.entertainmentRegistration || '제2025-서울강남-0418호(등록대기중)'}</div>
                <div>• 주소: {companyInfo.address || '서울특별시 마포구 마포나루길 442, 마포인트 3층'}</div>
                <div>• 이메일: {companyInfo.email || 'taz0206@naver.com'}</div>
              </div>
            </section>

            {/* 8. 현재 소속 배우 */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                  <span className="text-sky-400 font-mono text-sm">08</span>
                  <span>현재 소속 배우</span>
                </h2>
                <a
                  href="/artists"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('artists');
                  }}
                  className="text-xs font-mono text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
                >
                  <span>소속 배우 전체 프로필 보기 (/artists)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                현재 TK매니지먼트에는 고유한 개성과 연기 스펙트럼을 지닌 4명의 공식 소속 배우가 활동하고 있습니다.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {activeArtists.map((artist) => {
                  const slug = getArtistSlug(artist);
                  return (
                    <a
                      key={artist.id}
                      href={`/artists/${slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        onSelectArtist(artist);
                      }}
                      className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block text-left"
                    >
                      <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                        TK ACTOR
                      </span>
                      <div className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                        {artist.nameKo} 배우
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                        {artist.nameEn}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between pt-2 border-t border-white/5">
                        <span>프로필 보기</span>
                        <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform">→</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>

            {/* 9. 오디션 및 문의 */}
            <section className="pt-6 border-t border-white/10 space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">09</span>
                <span>오디션 및 문의</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                TK매니지먼트와 함께 새로운 가능성을 펼쳐갈 신인배우 오디션 지원과 드라마·영화·광고·공연 캐스팅 문의는 아래 공식 페이지를 통해 상시 접수하실 수 있습니다.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                <a
                  href="/management"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('management');
                  }}
                  className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block"
                >
                  <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">MANAGEMENT</span>
                  <div className="text-sm font-bold text-white group-hover:text-sky-300 mb-1">배우 매니지먼트 안내 →</div>
                  <p className="text-xs text-gray-400">활동 지원 및 매니지먼트 운영 체계 확인</p>
                </a>

                <a
                  href="/artists"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('artists');
                  }}
                  className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block"
                >
                  <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">ARTISTS</span>
                  <div className="text-sm font-bold text-white group-hover:text-sky-300 mb-1">현재 소속 배우 확인 →</div>
                  <p className="text-xs text-gray-400">최은서·이은수·박민욱·박현진 프로필</p>
                </a>

                <a
                  href="/audition"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('audition');
                  }}
                  className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block"
                >
                  <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">AUDITION</span>
                  <div className="text-sm font-bold text-white group-hover:text-sky-300 mb-1">신인배우 오디션 지원 →</div>
                  <p className="text-xs text-gray-400">온라인 오디션 지원서 작성 및 제출 안내</p>
                </a>

                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                  className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block"
                >
                  <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">CONTACT</span>
                  <div className="text-sm font-bold text-white group-hover:text-sky-300 mb-1">캐스팅 및 비즈니스 문의 →</div>
                  <p className="text-xs text-gray-400">소속 배우 섭외 및 공식 문의 접수</p>
                </a>
              </div>
            </section>
          </div>
        </div>
      </article>
    );
  }

  // pageType === 'actor-management-company'
  return (
    <article className="pt-28 pb-20 bg-[#0B0C10] text-[#E5E7EB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderBreadcrumb('배우 기획사')}

        <header className="border-b border-white/10 pb-8 mb-10">
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase tracking-widest mb-3">
            <Award className="w-4 h-4" />
            <span>ACTOR MANAGEMENT COMPANY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight mb-4">
            배우 기획사 TK매니지먼트
          </h1>
          <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl">
            연기자의 고유한 색깔을 정의하는 아티스트 기획부터 실무 매니지먼트, 작품 캐스팅 협업에 이르기까지 TK매니지먼트의 운영 기준을 소개합니다.
          </p>
        </header>

        <div className="bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg space-y-10 text-xs sm:text-sm leading-relaxed text-gray-300 shadow-2xl">
          {/* 1. 배우 기획사의 역할 */}
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono text-sm">01</span>
              <span>배우 기획사의 역할</span>
            </h2>
            <p>
              배우 기획사는 연기자가 지닌 외적인 분위기와 내면의 연기 에너지를 면밀히 살피고, 대중과 제작진에게 어떤 배우로 각인될지 중장기적인 로드맵을 수립하는 조직입니다. 단순히 주어진 배역을 소화하는 데 그치지 않고, 배우가 가진 강점이 가장 잘 드러날 수 있는 장르와 캐릭터 영역을 단계별로 확장해 나가는 기획(Planning) 기능을 수행합니다.
            </p>
            <p>
              특히 변화가 빠른 미디어 환경 속에서 연기자의 고유한 아이덴티티를 선명하게 구축하여, 캐스팅 관계자가 특정 배역을 떠올렸을 때 가장 먼저 연상되는 배우로 자리매김하도록 돕습니다.
            </p>
          </section>

          {/* 2. 배우 매니지먼트와 기획 업무 */}
          <section className="space-y-3 pt-6 border-t border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono text-sm">02</span>
              <span>배우 매니지먼트와 기획 업무</span>
            </h2>
            <p>
              엔터테인먼트 현장에서 기획과 실무 관리는 하나의 흐름으로 맞물려 돌아갑니다. 아티스트의 이미지 방향성과 포트폴리오 구성을 설계하는 것이 기획 업무라면, 수립된 방향에 맞추어 실제 제작사 미팅과 현장 일정을 조율하는 과정은{' '}
              <a
                href="/management"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('management');
                }}
                className="text-sky-400 hover:underline"
              >
                배우 매니지먼트(/management)
              </a>{' '}
              영역에 해당합니다. 또한 연기자가 안정적인 울타리 안에서 권익을 보호받으며 활동할 수 있도록 대외적인 기반을 제공하는 것은{' '}
              <a
                href="/actor-agency"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('actor-agency');
                }}
                className="text-sky-400 hover:underline"
              >
                배우 소속사(/actor-agency)
              </a>
              로서의 핵심 기능입니다.
            </p>
            <p>
              TK매니지먼트는 이러한 기획과 현장 지원이 분리되지 않고 유기적으로 연결되도록 운영하여, 배우 개개인의 방향성이 실제 작품 활동으로 자연스럽게 이어지도록 지원합니다.
            </p>
          </section>

          {/* 3~6. 핵심 운영 체계 (배우 활동 지원 / 작품 및 캐스팅 / 신인배우 성장 / 배우 프로필 관리) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-white/10">
            {/* 3. 배우 활동 지원 */}
            <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
              <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                <Compass className="w-4 h-4" />
                <span>03. ACTIVITY MANAGEMENT</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                배우 활동 지원
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                시나리오 및 대본 검토 단계부터 캐릭터 분석, 촬영장 및 공연 무대 일정 조율, 작품 공개 시점의 보도자료 및 소식 안내까지 연기 활동의 전 주기를 일관된 기준으로 지원합니다.
              </p>
            </section>

            {/* 4. 작품 및 캐스팅 */}
            <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
              <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                <Film className="w-4 h-4" />
                <span>04. PRODUCTION &amp; CASTING</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                작품 및 캐스팅
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                드라마, 상업·독립영화, OTT 시리즈, 연극, CF(광고), 뮤직비디오 등 각 제작 현장의 캐스팅 디렉터 및 연출진과 소통하며 배역 설정에 부합하는 아티스트를 제안하고 출연 협의를 진행합니다.
              </p>
            </section>

            {/* 5. 신인배우 성장 */}
            <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
              <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>05. NEW TALENT INCUBATION</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                신인배우 성장
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                가능성을 지닌 신인 연기자가 본인의 마스크와 보이스에 어울리는 주력 캐릭터를 정립할 수 있도록 돕고, 실전 오디션과 현장 경험을 통해 단계적으로 필모그래피를 확장해 나가도록 뒷받침합니다.
              </p>
            </section>

            {/* 6. 배우 프로필 관리 */}
            <section className="bg-[#161A26] p-5 border border-white/5 space-y-2.5">
              <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs font-bold">
                <Users className="w-4 h-4" />
                <span>06. PROFILE CURATION</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                배우 프로필 관리
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                캐스팅 관계자가 배우의 현재 이미지와 연기 이력을 즉시 검토할 수 있도록 공식 웹사이트(<a href="/artists" onClick={(e) => { e.preventDefault(); onNavigate('artists'); }} className="text-sky-400 hover:underline">/artists</a>)의 디지털 프로필과 인쇄용 공식 바이오 시트(PDF)를 체계적으로 큐레이션하고 관리합니다.
              </p>
            </section>
          </div>

          {/* 7. TK매니지먼트 소개 */}
          <section className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono text-sm">07</span>
              <span>TK매니지먼트 소개</span>
            </h2>
            <p>
              TK매니지먼트(TK MANAGEMENT)는 법인 ㈜TK Company가 운영하는 아티스트 기획·매니지먼트 브랜드입니다. 연기자의 개성을 존중하는 기획력과 성실한 현장 커뮤니케이션을 바탕으로 제작 현장과 대중에게 신뢰받는 파트너를 지향합니다.
            </p>
            <div className="bg-[#161A26] border border-white/5 p-5 rounded text-xs space-y-2 font-mono text-gray-300">
              <div>• 법인 상호: {companyInfo.companyName || '㈜TK Company (티케이컴퍼니)'}</div>
              <div>• 브랜드명: TK매니지먼트 (TK MANAGEMENT / 티케이매니지먼트)</div>
              <div>• 사업자등록번호: {companyInfo.businessNumber || '291-88-03353'}</div>
              <div>• 대중문화예술기획업 등록: {companyInfo.entertainmentRegistration || '제2025-서울강남-0418호(등록대기중)'}</div>
              <div>• 소재지: {companyInfo.address || '서울특별시 마포구 마포나루길 442, 마포인트 3층'}</div>
              <div>• 공식 이메일: {companyInfo.email || 'taz0206@naver.com'}</div>
            </div>
          </section>

          {/* 8. 소속 배우 */}
          <section className="space-y-4 pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
                <span className="text-sky-400 font-mono text-sm">08</span>
                <span>소속 배우</span>
              </h2>
              <a
                href="/artists"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('artists');
                }}
                className="text-xs font-mono text-sky-400 hover:text-sky-300 inline-flex items-center space-x-1"
              >
                <span>소속 배우 전체 프로필 보기 (/artists)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              현재 TK매니지먼트에 소속된 4명의 공식 아티스트(최은서, 이은수, 박민욱, 박현진) 프로필과 분야별 출연 작품 정보를 확인하실 수 있습니다.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {activeArtists.map((artist) => {
                const slug = getArtistSlug(artist);
                return (
                  <a
                    key={artist.id}
                    href={`/artists/${slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArtist(artist);
                    }}
                    className="p-4 bg-[#161A26] border border-white/10 hover:border-sky-400/50 transition-all group block text-left"
                  >
                    <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                      TK ACTOR
                    </span>
                    <div className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                      {artist.nameKo} 배우
                    </div>
                    <div className="text-[11px] font-mono text-gray-400 uppercase mt-0.5">
                      {artist.nameEn}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-2 flex items-center justify-between pt-2 border-t border-white/5">
                      <span>프로필 보기</span>
                      <span className="text-sky-400 group-hover:translate-x-0.5 transition-transform">→</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          {/* 9. 오디션 & 10. 문의 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-white/10">
            {/* 9. 오디션 */}
            <section className="bg-[#161A26] p-5 sm:p-6 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-xs font-mono text-sky-400 font-bold block">09. AUDITION</span>
                <h2 className="text-lg font-bold text-white">오디션</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  TK매니지먼트와 함께 배우로서의 커리어를 설계해 나갈 신인 및 배우 지망생을 상시 모집합니다. 온라인 지원서를 통해 프로필 사진과 자기소개, 연기 영상을 접수하실 수 있습니다.
                </p>
              </div>
              <div>
                <a
                  href="/audition"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('audition');
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>신인배우 오디션 안내 바로가기 (/audition)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>

            {/* 10. 문의 */}
            <section className="bg-[#161A26] p-5 sm:p-6 border border-white/10 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <span className="text-xs font-mono text-sky-400 font-bold block">10. CONTACT</span>
                <h2 className="text-lg font-bold text-white">문의</h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  드라마, 영화, 연극, 광고 등 작품 캐스팅 섭외 제안 및 아티스트 협업 관련 비즈니스 문의는 공식 문의 페이지를 통해 접수해 주시면 담당 부서에서 신속히 회신드립니다.
                </p>
              </div>
              <div>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('contact');
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>캐스팅 및 비즈니스 문의 바로가기 (/contact)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>
          </div>

          {/* Internal Links: /management, /actor-agency, /artists, /audition, /contact */}
          <section className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400 font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-gray-500">관련 페이지 바로가기:</span>
              <a
                href="/management"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('management');
                }}
                className="text-sky-400 hover:underline"
              >
                배우 매니지먼트 (/management)
              </a>
              <span>·</span>
              <a
                href="/actor-agency"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('actor-agency');
                }}
                className="text-sky-400 hover:underline"
              >
                배우 소속사 (/actor-agency)
              </a>
              <span>·</span>
              <a
                href="/artists"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('artists');
                }}
                className="text-sky-400 hover:underline"
              >
                소속 배우 (/artists)
              </a>
              <span>·</span>
              <a
                href="/audition"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('audition');
                }}
                className="text-sky-400 hover:underline"
              >
                오디션 (/audition)
              </a>
              <span>·</span>
              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('contact');
                }}
                className="text-sky-400 hover:underline"
              >
                문의 (/contact)
              </a>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
};
