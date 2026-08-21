import React from 'react';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onExploreArtists: () => void;
  onApplyAudition: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreArtists, onApplyAudition }) => {
  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0B0C10]"
    >
      {/* Background Editorial Visual with cinematic layers */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=2000&q=85"
          alt="TK Management Hero Actor"
          className="w-full h-full object-cover object-center filter grayscale-[35%] brightness-[0.45] scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/60 to-[#0B0C10]/80" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0B0C10]/40 to-[#0B0C10]/95" />
      </div>

      {/* Decorative subtle T K typographic watermark */}
      <div className="absolute right-6 top-1/3 -translate-y-1/2 select-none pointer-events-none opacity-[0.04] text-[280px] lg:text-[420px] font-display font-black leading-none text-white z-0">
        TK
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full flex flex-col justify-between min-h-screen">
        <div className="flex-1 flex flex-col justify-center max-w-3xl">
          {/* Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full w-fit mb-6 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-gray-300 uppercase">
              Actors Management &amp; Casting
            </span>
          </motion.div>

          {/* Slogan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="space-y-2 mb-6"
          >
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05]">
              YOUR NEXT SCENE.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-sky-300">
                STARTS HERE.
              </span>
            </h1>
          </motion.div>

          {/* Korean & English Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="space-y-2 mb-10 max-w-xl"
          >
            <p className="text-base sm:text-lg text-gray-300 font-normal leading-relaxed">
              새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어갑니다.
            </p>
            <p className="text-xs sm:text-sm text-gray-400 tracking-wide font-light">
              We discover potential, develop talent, and create the next opportunity.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              id="hero-btn-artists"
              onClick={onExploreArtists}
              className="group inline-flex items-center space-x-3 bg-white text-black hover:bg-slate-200 px-7 py-3.5 rounded-none font-semibold text-xs tracking-widest uppercase transition-all duration-200 shadow-lg shadow-white/5 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>ARTISTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-btn-audition"
              onClick={onApplyAudition}
              className="inline-flex items-center space-x-2 bg-[#182A47]/80 hover:bg-[#182A47] text-white border border-sky-400/30 px-6 py-3.5 rounded-none font-medium text-xs tracking-widest uppercase transition-all duration-200 hover:border-sky-400"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>신인 오디션 지원하기</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom Bar: Stats snippet + Scroll indicator */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs tracking-wider text-gray-400">
          <div className="flex items-center space-x-6">
            <div>
              <span className="text-white font-bold">TK MANAGEMENT</span>
              <span className="mx-2 text-white/20">|</span>
              <span className="text-gray-400">SEOUL, KOREA</span>
            </div>
            <div className="hidden sm:block text-gray-400">
              BOUTIQUE ACTORS AGENCY
            </div>
          </div>

          <button
            onClick={onExploreArtists}
            className="flex items-center space-x-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span className="text-[11px] font-mono tracking-widest">SCROLL</span>
            <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-sky-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
