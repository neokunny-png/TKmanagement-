import React from 'react';
import { Compass, Sparkles, Film, Award } from 'lucide-react';

interface AboutSectionProps {
  artistCount: number;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ artistCount }) => {
  const pillars = [
    {
      num: '01',
      title: 'DISCOVERY',
      titleKo: '발견',
      desc: '아직 세상에 알려지지 않은 원석 같은 새로운 얼굴과 독창적인 마스크를 발굴합니다.',
      icon: Compass
    },
    {
      num: '02',
      title: 'DEVELOPMENT',
      titleKo: '성장과 훈련',
      desc: '배우 각자가 지닌 고유한 개성과 매력, 연기적 장점을 파악하여 탄탄하게 성장시킵니다.',
      icon: Sparkles
    },
    {
      num: '03',
      title: 'MANAGEMENT',
      titleKo: '전문 매니지먼트',
      desc: '오디션 준비부터 캐스팅 전략, 작품 활동 및 미디어 관리까지 체계적인 시스템으로 함께합니다.',
      icon: Film
    },
    {
      num: '04',
      title: 'OPPORTUNITY',
      titleKo: '기회 연결',
      desc: '영화, 드라마, OTT 시리즈, 광고 등 배우가 더 많은 최적의 장면과 만날 수 있도록 연결합니다.',
      icon: Award
    }
  ];

  return (
    <section id="about" className="relative py-28 bg-[#0B0C10] border-t border-white/10 overflow-hidden">
      {/* Background Graphic Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#182A47]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 border-b border-white/10 pb-10">
          <div>
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-3">
              ABOUT TK MANAGEMENT
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight leading-tight">
              WE CREATE <br />
              <span className="text-slate-400 font-light">YOUR NEXT SCENE.</span>
            </h2>
          </div>
          <div className="mt-6 md:mt-0 max-w-md">
            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
              TK MANAGEMENT는 배우의 가능성을 발견하고 각자의 개성과 매력을 가장 잘 보여줄 수 있는
              새로운 장면을 만들어가는 프리미엄 배우 매니지먼트입니다.
            </p>
          </div>
        </div>

        {/* 3 Large Typographic Stat Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          <div className="p-8 bg-[#111319] border border-white/10 hover:border-white/25 transition-all group">
            <div className="text-5xl sm:text-6xl font-display font-black text-white group-hover:text-sky-400 transition-colors mb-2">
              {artistCount > 0 ? String(artistCount).padStart(2, '0') : '06'}
            </div>
            <div className="text-xs tracking-widest font-mono text-gray-400 uppercase mb-1">
              ARTISTS
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              독보적인 잠재력과 캐릭터를 지닌 신예 아티스트
            </p>
          </div>

          <div className="p-8 bg-[#111319] border border-white/10 hover:border-white/25 transition-all group">
            <div className="text-5xl sm:text-6xl font-display font-black text-white group-hover:text-sky-400 transition-colors mb-2">
              01
            </div>
            <div className="text-xs tracking-widest font-mono text-gray-400 uppercase mb-1">
              DEDICATED MANAGEMENT
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              배우 개별 맞춤형 집중 케어 &amp; 캐스팅 지원
            </p>
          </div>

          <div className="p-8 bg-[#111319] border border-white/10 hover:border-white/25 transition-all group">
            <div className="text-5xl sm:text-6xl font-display font-black text-white group-hover:text-sky-400 transition-colors mb-2">
              ∞
            </div>
            <div className="text-xs tracking-widest font-mono text-gray-400 uppercase mb-1">
              POSSIBILITIES
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              경계를 넘나드는 무한한 스크린과 무대의 가능성
            </p>
          </div>
        </div>

        {/* 4 Pillars: WE BELIEVE IN POTENTIAL */}
        <div>
          <div className="mb-12">
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-2">
              OUR SYSTEM &amp; PHILOSOPHY
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              WE BELIEVE IN POTENTIAL.
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              신인 배우의 첫 시작부터 주연으로 성장하기까지, TK만의 4단계 전문 프로세스
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.num}
                  className="p-6 bg-[#0E1017] border border-white/5 hover:border-[#182A47] hover:bg-[#121622] transition-all group relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono font-bold tracking-widest text-sky-400">
                        {p.num}
                      </span>
                      <Icon className="w-5 h-5 text-gray-500 group-hover:text-sky-400 transition-colors" />
                    </div>
                    <h4 className="text-base font-display font-bold text-white tracking-wider mb-1">
                      {p.title}
                    </h4>
                    <span className="text-[11px] text-gray-400 font-medium block mb-4">
                      {p.titleKo}
                    </span>
                    <p className="text-xs text-gray-300 font-light leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                    <span>TK PROCESS</span>
                    <span className="group-hover:translate-x-1 transition-transform text-sky-400">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
