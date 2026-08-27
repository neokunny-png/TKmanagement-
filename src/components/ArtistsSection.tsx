import React, { useState } from 'react';
import { ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Artist } from '../types';

interface ArtistsSectionProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
}

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  artists,
  onSelectArtist,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'FEMALE' | 'MALE'>('ALL');

  const filteredArtists = artists.filter((artist) => {
    if (!artist.isActive) return false;
    if (filter === 'FEMALE') return artist.gender === 'Female';
    if (filter === 'MALE') return artist.gender === 'Male';
    return true;
  });

  return (
    <section id="artists" className="relative py-28 bg-[#0B0C10] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-white/10 pb-8">
          <div>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tighter">
              MEET OUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                ARTISTS.
              </span>
            </h2>
          </div>

          {/* Filter Navigation */}
          <div className="mt-6 md:mt-0 flex items-center space-x-1.5 sm:space-x-2 bg-[#111319] p-1.5 border border-white/10 overflow-x-auto scrollbar-none touch-scroll max-w-full">
            <button
              id="filter-artists-all"
              onClick={() => setFilter('ALL')}
              className={`px-3.5 sm:px-4 py-2 text-xs font-semibold tracking-wider transition-colors whitespace-nowrap cursor-pointer min-h-[38px] ${
                filter === 'ALL'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ALL ({artists.filter(a => a.isActive).length})
            </button>
            <button
              id="filter-artists-female"
              onClick={() => setFilter('FEMALE')}
              className={`px-3.5 sm:px-4 py-2 text-xs font-semibold tracking-wider transition-colors whitespace-nowrap cursor-pointer min-h-[38px] ${
                filter === 'FEMALE'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ACTRESS ({artists.filter(a => a.isActive && a.gender === 'Female').length})
            </button>
            <button
              id="filter-artists-male"
              onClick={() => setFilter('MALE')}
              className={`px-3.5 sm:px-4 py-2 text-xs font-semibold tracking-wider transition-colors whitespace-nowrap cursor-pointer min-h-[38px] ${
                filter === 'MALE'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ACTOR ({artists.filter(a => a.isActive && a.gender === 'Male').length})
            </button>
          </div>
        </div>

        {/* 3-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArtists.map((artist, index) => {
            const engUpper = artist.nameEn;

            return (
              <motion.div
                key={artist.id}
                id={`artist-card-${artist.id}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                onClick={() => onSelectArtist(artist)}
                className="group relative cursor-pointer overflow-hidden bg-[#111319] border border-white/10 hover:border-white/40 transition-all duration-500"
              >
                {/* Ratio aspect container for crisp editorial portraits (3:4 or 4:5 ratio) */}
                <div className="aspect-[3/4] w-full overflow-hidden relative bg-neutral-900">
                  <img
                    src={artist.profileImage}
                    alt={`${artist.nameKo} (${artist.nameEn})`}
                    className="w-full h-full object-cover object-center filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Dramatic multi-stop gradient for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                  {/* Bottom Text Details */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end">
                    {/* Actor Korean Name & English Name */}
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight group-hover:text-sky-200 transition-colors">
                        {artist.nameKo}
                      </h3>
                      <span className="text-xs font-mono tracking-wider text-gray-400">
                        {artist.birth.substring(0, 4)}
                      </span>
                    </div>

                    <p className="text-xs font-mono tracking-widest text-gray-300 uppercase mb-4">
                      {engUpper}
                    </p>

                    {/* Physical Specs & Quick Bio Snippet */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-300">
                        <span>{artist.gender === 'Female' ? '여성' : '남성'}</span>
                        <span className="text-gray-600">•</span>
                        <span>{artist.height}cm</span>
                      </div>

                      <div className="flex items-center space-x-1 text-white text-xs font-semibold tracking-wider group-hover:text-sky-400 transition-colors">
                        <span>VIEW PROFILE</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Casting Inquiry Direct Callout */}
        <div className="mt-16 p-8 bg-gradient-to-r from-[#121622] to-[#0E1017] border border-[#182A47]/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#182A47] border border-sky-400/30 flex items-center justify-center text-sky-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-display">
                캐스팅 및 섭외 담당자 안내
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                모든 소속 배우의 프로필 PDF 다운로드 및 쇼릴 영상 확인이 가능합니다.
              </p>
            </div>
          </div>
          <div className="text-xs text-sky-300 font-mono tracking-wider">
            CASTING INQUIRY: <a href="mailto:taz0206@naver.com" className="hover:underline font-bold text-white">taz0206@naver.com</a>
          </div>
        </div>
      </div>
    </section>
  );
};
