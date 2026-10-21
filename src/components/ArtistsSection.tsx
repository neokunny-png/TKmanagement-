import React, { useState, useEffect } from 'react';
import { ArrowRight, UserCheck, Users } from 'lucide-react';
import { Artist } from '../types';
import { getArtistSlug, OFFICIAL_ACTOR_IMAGES } from '../lib/seo';
import { STATIC_OFFICIAL_ARTISTS } from '../data/artists';

import { isValidArtistImageUrl } from '../utils/artistImageResolver';

interface ArtistsSectionProps {
  artists: Artist[];
  onSelectArtist: (artist: Artist) => void;
  isStandalone?: boolean;
}

/**
 * Maps an artist to their official static profile image.
 * Strictly returns the specific official actor's static asset (최은서, 이은수, 박민욱, 박현진),
 * or null for any newly added actors. NEVER defaults to choi-eunseo.
 */
export function getActorStaticImage(artist: Artist): string | null {
  const name = (artist.nameKo || '').trim();
  const rawSlug = getArtistSlug(artist) || (artist.id ? artist.id.replace(/^artist-/, '') : '').toLowerCase().trim();

  if (name.includes('최은서') || rawSlug.includes('choi') || rawSlug.includes('eunseo')) {
    return OFFICIAL_ACTOR_IMAGES['choi-eunseo'];
  }
  if (name.includes('이은수') || rawSlug.includes('lee') || rawSlug.includes('eunsoo') || rawSlug.includes('eunsu')) {
    return OFFICIAL_ACTOR_IMAGES['lee-eunsoo'];
  }
  if (name.includes('박민욱') || rawSlug.includes('minwook')) {
    return OFFICIAL_ACTOR_IMAGES['park-minwook'];
  }
  if (name.includes('박현진') || rawSlug.includes('hyunjin')) {
    return OFFICIAL_ACTOR_IMAGES['park-hyunjin'];
  }
  if (rawSlug in OFFICIAL_ACTOR_IMAGES) {
    return OFFICIAL_ACTOR_IMAGES[rawSlug];
  }
  return null;
}

interface ArtistCardImageProps {
  artist: Artist;
  staticImage: string | null;
}

/**
 * Robust artist card image renderer:
 * 1. If artist has an uploaded / valid profileImageUrl (HTTPS or optimized compressed data URL), displays that actor's own image.
 * 2. If no custom image exists but actor is one of the 4 official actors, displays their own static asset.
 * 3. If no image exists, displays a neutral placeholder box (NEVER another actor's photo).
 */
const ArtistCardImage: React.FC<ArtistCardImageProps> = ({ artist, staticImage }) => {
  const rawPhoto = artist.profileImageUrl || artist.image || artist.profileImage || null;
  const validRemotePhoto = isValidArtistImageUrl(rawPhoto) ? (rawPhoto as string) : null;
  const initialPhoto = validRemotePhoto || staticImage || null;

  const [currentSrc, setCurrentSrc] = useState<string | null>(initialPhoto);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    const candidate = artist.profileImageUrl || artist.image || artist.profileImage || null;
    if (isValidArtistImageUrl(candidate)) {
      setCurrentSrc(candidate as string);
    } else if (staticImage) {
      setCurrentSrc(staticImage);
    } else {
      setCurrentSrc(null);
    }
  }, [artist.id, artist.profileImageUrl, artist.image, artist.profileImage, staticImage]);

  if (!currentSrc || hasError) {
    if (staticImage && !hasError) {
      return (
        <img
          src={staticImage}
          alt={`TK매니지먼트 소속 배우 ${artist.nameKo} 프로필`}
          onError={() => setHasError(true)}
          className="relative z-[1] w-full h-full object-cover object-center filter grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
          loading="eager"
          decoding="async"
        />
      );
    }
    return (
      <div className="relative z-[1] w-full h-full flex flex-col items-center justify-center bg-[#111319] text-gray-500 p-6 text-center select-none border border-white/5">
        <Users className="w-10 h-10 mb-3 text-gray-600 opacity-60 stroke-[1.5]" />
        <span className="text-xs font-mono font-bold tracking-wider text-gray-300 uppercase">
          {artist.nameKo || 'NEW ARTIST'}
        </span>
        <span className="text-[10px] text-gray-500 font-mono tracking-widest mt-1 uppercase">
          프로필 사진 등록 대기
        </span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={`TK매니지먼트 소속 배우 ${artist.nameKo} 프로필`}
      onError={() => {
        if (staticImage && currentSrc !== staticImage) {
          setCurrentSrc(staticImage);
        } else {
          setHasError(true);
        }
      }}
      className="relative z-[1] w-full h-full object-cover object-center filter grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
      loading="eager"
      decoding="async"
    />
  );
};

export const ArtistsSection: React.FC<ArtistsSectionProps> = ({
  artists,
  onSelectArtist,
  isStandalone = false,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'FEMALE' | 'MALE'>('ALL');
  const HeadingTag = isStandalone ? 'h1' : 'h2';

  // Ground truth fallback: If artists is empty or null due to Firestore offline/quota error, strictly use STATIC_OFFICIAL_ARTISTS
  const effectiveArtists = (Array.isArray(artists) && artists.length > 0) ? artists : STATIC_OFFICIAL_ARTISTS;
  const activeArtists = effectiveArtists.filter((a) => a.isActive !== false);

  const filteredArtists = activeArtists.filter((artist) => {
    if (filter === 'FEMALE') return artist.gender === 'Female';
    if (filter === 'MALE') return artist.gender === 'Male';
    return true;
  });

  return (
    <section id="artists" className="relative py-20 sm:py-28 bg-[#0B0C10] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-white/10 pb-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase mb-2 block">
              ARTISTS
            </span>
            <HeadingTag className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tighter">
              TK매니지먼트 소속 배우
            </HeadingTag>
            <p className="text-xs sm:text-sm font-mono tracking-widest text-gray-400 uppercase mt-1">
              TK MANAGEMENT ARTISTS
            </p>
          </div>

          {/* Filter Navigation - Only show if artists exist */}
          {activeArtists.length > 0 && (
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
                ALL ({activeArtists.length})
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
                ACTRESS ({activeArtists.filter(a => a.gender === 'Female').length})
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
                ACTOR ({activeArtists.filter(a => a.gender === 'Male').length})
              </button>
            </div>
          )}
        </div>

        {/* 0 Artists State */}
        {activeArtists.length === 0 ? (
          <div
            id="empty-artists-state"
            className="py-24 px-6 text-center border border-dashed border-white/15 bg-white/[0.02] max-w-3xl mx-auto my-8"
          >
            <div className="w-16 h-16 mx-auto rounded-full border border-white/20 bg-white/5 flex items-center justify-center mb-5 text-gray-400">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              현재 등록된 배우가 없습니다.
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-mono tracking-wider mb-6">
              NO REGISTERED ARTISTS
            </p>
            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              관리자 모드(ADMIN)에서 배우 정보 및 공식 프로필 사진을 등록하면 실시간으로 홈페이지에 반영됩니다.
            </p>
          </div>
        ) : filteredArtists.length === 0 ? (
          /* Filtered to 0 state */
          <div className="py-20 text-center border border-white/10 bg-white/[0.02] max-w-xl mx-auto my-6">
            <p className="text-base text-gray-300 mb-1">해당 카테고리에 등록된 배우가 없습니다.</p>
            <button
              onClick={() => setFilter('ALL')}
              className="mt-3 text-xs text-sky-400 hover:underline font-mono"
            >
              전체 배우 보기
            </button>
          </div>
        ) : (
          /* Responsive Grid (1 col on mobile, 2 on tablet, 3 on desktop) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArtists.map((artist) => {
              const engUpper = (artist.nameEn || '').toUpperCase();
              const slug = getArtistSlug(artist) || artist.id;
              const staticImage = getActorStaticImage(artist);

              return (
                <a
                  key={artist.id}
                  id={`artist-card-${artist.id}`}
                  href={`/artists/${slug}`}
                  onClick={(e) => {
                    if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
                      e.preventDefault();
                      onSelectArtist(artist);
                    }
                  }}
                  className="group block relative cursor-pointer overflow-hidden bg-[#111319] border border-white/10 hover:border-white/40 transition-all duration-500 no-underline"
                >
                  {/* Ratio aspect container for crisp editorial portraits (3:4 ratio) */}
                  <div className="aspect-[3/4] w-full overflow-hidden relative bg-neutral-900">
                    <ArtistCardImage
                      artist={artist}
                      staticImage={staticImage}
                    />

                    {/* Dramatic multi-stop gradient for text readability - layered with z-[2] and pointer-events-none */}
                    <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/30 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />

                    {/* Bottom Text Details - layered with z-[3] and pointer-events-none */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-[3] pointer-events-none flex flex-col justify-end">
                      {/* Actor Korean Name & Birth */}
                      <div className="flex items-baseline justify-between mb-1.5">
                        <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight group-hover:text-sky-200 transition-colors">
                          {artist.nameKo}
                        </h3>
                        {artist.birth && (
                          <span className="text-xs font-mono tracking-wider text-gray-400">
                            {artist.birth.substring(0, 4)}
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-mono tracking-widest text-gray-300 uppercase mb-4">
                        {engUpper}
                      </p>

                      {/* Physical Specs & Quick Link */}
                      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-gray-300">
                          <span>{artist.gender === 'Female' ? '여성' : '남성'}</span>
                          {artist.height ? (
                            <>
                              <span className="text-gray-600">•</span>
                              <span>{artist.height}cm</span>
                            </>
                          ) : null}
                        </div>

                        <div className="flex items-center space-x-1 text-white text-xs font-semibold tracking-wider group-hover:text-sky-400 transition-colors">
                          <span>VIEW PROFILE</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* Casting Inquiry Direct Callout */}
        <div className="mt-16 p-8 bg-gradient-to-r from-[#121622] to-[#0E1017] border border-[#182A47]/60 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-[#182A47] border border-sky-400/30 flex items-center justify-center text-sky-400 shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-display">
                캐스팅 및 섭외 담당자 안내
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                소속 배우의 프로필 PDF 다운로드 및 필모그래피 확인이 가능합니다.
              </p>
            </div>
          </div>
          <div className="text-xs text-sky-300 font-mono tracking-wider whitespace-nowrap">
            CASTING INQUIRY: <a href="mailto:taz0206@naver.com" className="hover:underline font-bold text-white">taz0206@naver.com</a>
          </div>
        </div>
      </div>
    </section>
  );
};
