import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Download, Play, Mail, Instagram, ChevronRight, ChevronLeft, Film, GraduationCap, ZoomIn, ZoomOut } from 'lucide-react';
import { Artist, getGroupedFilmography } from '../types';
import { getArtistSlug, OFFICIAL_ACTORS } from '../lib/seo';
import { resolveArtistRepresentativeImage, isValidArtistImageUrl } from '../utils/artistImageResolver';
import { getActorStaticImage } from './ArtistsSection';

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
  onGoHome?: () => void;
  onCastingInquiry: (artist: Artist) => void;
  onOpenPrintSheet: (artist: Artist) => void;
  onNavigate?: (sectionId: string) => void;
}

export const ArtistModal: React.FC<ArtistModalProps> = ({
  artist,
  onClose,
  onCastingInquiry,
  onOpenPrintSheet,
  onNavigate,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [isPhotoHovered, setIsPhotoHovered] = useState(false);
  const [isTouchControlsVisible, setIsTouchControlsVisible] = useState(false);

  // Touch swipe tracking for mobile
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchHideTimerRef = useRef<number | null>(null);

  const slug = artist ? getArtistSlug(artist) : '';
  const official = slug ? OFFICIAL_ACTORS[slug] : undefined;
  const staticOfficialImage = artist ? getActorStaticImage(artist) : '';
  const profilePhoto = artist ? (resolveArtistRepresentativeImage(artist) || staticOfficialImage) : '';

  // Build full photo list: main profile photo + any additional gallery photos (preserving admin order)
  const allPhotos: Array<{ id: string; url: string }> = [];
  if (artist) {
    if (profilePhoto) {
      allPhotos.push({ id: 'main-profile', url: profilePhoto });
    } else if (staticOfficialImage) {
      allPhotos.push({ id: 'main-profile', url: staticOfficialImage });
    }
    if (Array.isArray(artist.galleryImages)) {
      const sortedGallery = [...artist.galleryImages].sort((a, b) => {
        const orderA = typeof a?.order === 'number' ? a.order : 0;
        const orderB = typeof b?.order === 'number' ? b.order : 0;
        return orderA - orderB;
      });
      sortedGallery.forEach((img, idx) => {
        if (img && img.url && isValidArtistImageUrl(img.url)) {
          allPhotos.push({
            id: img.id || `gallery-${idx}`,
            url: img.url,
          });
        }
      });
    }
  }

  const totalPhotos = allPhotos.length;
  const safePhotoIdx = activePhotoIdx >= 0 && activePhotoIdx < totalPhotos ? activePhotoIdx : 0;
  const currentPhotoObj = allPhotos[safePhotoIdx] || allPhotos[0];
  const currentPhoto = currentPhotoObj?.url || profilePhoto || null;

  useEffect(() => {
    setActivePhotoIdx(0);
    setImgError(false);
    setIsPhotoZoomed(false);
    setIsPhotoHovered(false);
    setIsTouchControlsVisible(false);
    setShowVideoPlayer(false);
  }, [artist?.id, profilePhoto]);

  useEffect(() => {
    return () => {
      if (touchHideTimerRef.current) {
        window.clearTimeout(touchHideTimerRef.current);
      }
    };
  }, []);

  const revealTouchControlsBriefly = useCallback(() => {
    setIsTouchControlsVisible(true);
    if (touchHideTimerRef.current) {
      window.clearTimeout(touchHideTimerRef.current);
    }
    touchHideTimerRef.current = window.setTimeout(() => {
      setIsTouchControlsVisible(false);
    }, 1600);
  }, []);

  const goToPrevPhoto = useCallback(() => {
    if (totalPhotos <= 1) return;
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : totalPhotos - 1));
    setImgError(false);
    setIsPhotoZoomed(false);
  }, [totalPhotos]);

  const goToNextPhoto = useCallback(() => {
    if (totalPhotos <= 1) return;
    setActivePhotoIdx((prev) => (prev < totalPhotos - 1 ? prev + 1 : 0));
    setImgError(false);
    setIsPhotoZoomed(false);
  }, [totalPhotos]);

  // Keyboard navigation: ESC (closes video -> resets zoom -> closes modal) and Left/Right arrows
  useEffect(() => {
    if (!artist) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (showVideoPlayer) {
          setShowVideoPlayer(false);
        } else if (isPhotoZoomed) {
          setIsPhotoZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft' && !showVideoPlayer && totalPhotos > 1) {
        e.preventDefault();
        goToPrevPhoto();
      } else if (e.key === 'ArrowRight' && !showVideoPlayer && totalPhotos > 1) {
        e.preventDefault();
        goToNextPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [artist, showVideoPlayer, isPhotoZoomed, totalPhotos, goToPrevPhoto, goToNextPhoto, onClose]);

  if (!artist) return null;

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToPrevPhoto();
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    goToNextPhoto();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalPhotos > 1) {
      revealTouchControlsBriefly();
    }
    if (isPhotoZoomed || e.touches.length !== 1) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (
      isPhotoZoomed ||
      totalPhotos <= 1 ||
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      e.changedTouches.length === 0
    ) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // Trigger horizontal photo change only if horizontal swipe dominates vertical scroll
    if (Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      if (deltaX < 0) {
        goToNextPhoto();
      } else {
        goToPrevPhoto();
      }
    }
  };

  // Safely parse and convert showreel URLs, removing any legacy sample video
  const getEmbedUrl = (rawUrl?: string): string | null => {
    if (!rawUrl || !rawUrl.trim()) return null;
    const trimmed = rawUrl.trim();
    if (trimmed.includes('dQw4w9WgXcQ')) return null;

    try {
      if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
        let videoId = '';
        if (trimmed.includes('youtu.be/')) {
          videoId = trimmed.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
        } else if (trimmed.includes('youtube.com/embed/')) {
          videoId = trimmed.split('youtube.com/embed/')[1]?.split(/[?&#]/)[0] || '';
        } else if (trimmed.includes('youtube-nocookie.com/embed/')) {
          videoId = trimmed.split('youtube-nocookie.com/embed/')[1]?.split(/[?&#]/)[0] || '';
        } else if (trimmed.includes('v=')) {
          const urlParams = new URLSearchParams(trimmed.split('?')[1] || '');
          videoId = urlParams.get('v') || '';
        }
        if (videoId && videoId !== 'dQw4w9WgXcQ') {
          return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        }
      }

      if (trimmed.includes('vimeo.com')) {
        const match = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        if (match && match[1]) {
          return `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
        }
      }

      if (trimmed.startsWith('http')) {
        return trimmed;
      }
    } catch {
      // ignore
    }
    return null;
  };

  const validEmbedUrl = getEmbedUrl(artist.showreelUrl);
  const displayBio = artist.bio || official?.description || '';
  const showArrows = isPhotoHovered || isTouchControlsVisible;

  return (
    <div
      id="artist-modal-overlay"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col overflow-hidden overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="artist-modal-container"
        className="relative w-full h-[100dvh] flex flex-col overflow-hidden"
      >
        {/* Minimal Floating Top-Right Controls (Zoom & Close X only) */}
        <div className="fixed top-[calc(0.75rem+env(safe-area-inset-top,0px))] right-3 sm:top-4 sm:right-5 z-30 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPhotoZoomed((prev) => !prev);
            }}
            className="p-2 text-white/60 hover:text-white bg-black/30 hover:bg-black/60 transition-colors cursor-pointer flex items-center justify-center"
            aria-label={isPhotoZoomed ? '사진 축소' : '사진 확대'}
            title={isPhotoZoomed ? '축소' : '확대'}
          >
            {isPhotoZoomed ? (
              <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>

          <button
            id="btn-close-artist-modal"
            type="button"
            onClick={onClose}
            className="p-2 text-white/75 hover:text-white bg-black/30 hover:bg-black/60 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Close modal"
            title="닫기 (ESC)"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Single Unified Scroll Area: Large Photo Lightbox Stage at Top + Profile Details Below */}
        <div
          id="artist-modal-scroll-body"
          className="overflow-y-auto flex-1 overscroll-contain touch-scroll min-h-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* 1. Primary Full-Screen Photo Lightbox Stage (85~88% viewport height on PC, object-contain, zero cropping) */}
          <div
            id="artist-photo-lightbox"
            className={`relative w-full min-h-[82dvh] sm:min-h-[88dvh] flex items-center justify-center px-2 sm:px-10 py-2 sm:py-4 select-none bg-black ${
              isPhotoZoomed ? 'overflow-auto' : 'overflow-hidden'
            }`}
            onMouseEnter={() => setIsPhotoHovered(true)}
            onMouseLeave={() => setIsPhotoHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                if (isPhotoZoomed) {
                  setIsPhotoZoomed(false);
                } else {
                  onClose();
                }
              }
            }}
          >
            <div className="relative flex items-center justify-center max-w-full max-h-full">
              {/* Minimal Left Arrow (<) - opacity 0 by default, opacity 1 on hover */}
              {totalPhotos > 1 && (
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  style={{ opacity: showArrows ? 1 : 0 }}
                  className="fixed sm:static left-1 sm:left-auto sm:mr-4 md:mr-6 top-1/2 sm:top-auto -translate-y-1/2 sm:translate-y-0 p-2 sm:p-3 text-white/75 hover:text-white bg-transparent hover:bg-white/5 transition-opacity duration-300 cursor-pointer z-20 shrink-0 focus:opacity-100"
                  aria-label="이전 사진"
                >
                  <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
                </button>
              )}

              {/* Large Uncropped Actor Photo (object-contain) */}
              <img
                key={currentPhoto || staticOfficialImage}
                src={imgError ? staticOfficialImage : (currentPhoto || staticOfficialImage)}
                alt={`TK매니지먼트 소속 배우 ${artist.nameKo}`}
                onError={() => {
                  if (!imgError) {
                    setImgError(true);
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPhotoZoomed((prev) => !prev);
                }}
                className={`transition-transform duration-300 select-none ${
                  isPhotoZoomed
                    ? 'max-h-none max-w-none w-auto h-[120dvh] sm:h-[135dvh] object-contain cursor-zoom-out'
                    : 'max-h-[80dvh] sm:max-h-[86dvh] max-w-[94vw] sm:max-w-[84vw] w-auto h-auto object-contain cursor-zoom-in'
                }`}
                loading="eager"
                decoding="async"
              />

              {/* Minimal Right Arrow (>) - opacity 0 by default, opacity 1 on hover */}
              {totalPhotos > 1 && (
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  style={{ opacity: showArrows ? 1 : 0 }}
                  className="fixed sm:static right-1 sm:right-auto sm:ml-4 md:ml-6 top-1/2 sm:top-auto -translate-y-1/2 sm:translate-y-0 p-2 sm:p-3 text-white/75 hover:text-white bg-transparent hover:bg-white/5 transition-opacity duration-300 cursor-pointer z-20 shrink-0 focus:opacity-100"
                  aria-label="다음 사진"
                >
                  <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Actor Profile Information Below the Large Photo (Only renders real existing data) */}
          <div
            className="w-full max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-12 bg-[#0B0C10] border-t border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Name & English Name & Instagram */}
              <div className="pb-6 border-b border-white/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                      {artist.nameKo}
                    </h1>
                    {artist.nameEn && (
                      <p className="text-xs sm:text-sm font-mono tracking-widest text-gray-300 uppercase mt-1">
                        {artist.nameEn}
                      </p>
                    )}
                  </div>

                  {artist.instagram && (
                    <a
                      href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-sky-400 transition-colors border border-white/10 px-3 py-1.5 bg-white/5 shrink-0"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>{artist.instagram}</span>
                    </a>
                  )}
                </div>

                {/* Introduction / Bio (if present) */}
                {displayBio && (
                  <div className="mt-5">
                    <p className="text-xs sm:text-sm text-gray-200 font-light leading-relaxed bg-[#141824]/60 p-4 border-l-2 border-sky-400 whitespace-pre-line">
                      {displayBio}
                    </p>
                  </div>
                )}
              </div>

              {/* Basic Specifications (Only fields that exist in artist data) */}
              {(artist.birth || artist.height || artist.gender || artist.education) && (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-semibold block">
                    PROFILE
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {artist.birth && (
                      <div className="bg-[#131620] p-3 border border-white/5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                          Birth / 생년월일
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                          {artist.birth}
                        </span>
                      </div>
                    )}
                    {artist.height ? (
                      <div className="bg-[#131620] p-3 border border-white/5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                          Height / 키
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                          {artist.height} cm
                        </span>
                      </div>
                    ) : null}
                    {artist.gender && (
                      <div className="bg-[#131620] p-3 border border-white/5">
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                          Gender / 성별
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-white font-mono">
                          {artist.gender === 'Female' ? '여성 (Female)' : '남성 (Male)'}
                        </span>
                      </div>
                    )}
                  </div>

                  {artist.education && (
                    <div className="bg-[#131620] p-3.5 sm:p-4 border border-white/5 flex items-start space-x-3">
                      <GraduationCap className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                      <div>
                        <span className="text-[10px] font-mono text-gray-500 uppercase block mb-0.5">
                          Education / 학력
                        </span>
                        <span className="text-xs sm:text-sm text-gray-200 font-medium">
                          {artist.education}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Filmography (Only if filmography items exist) */}
              {artist.filmography && artist.filmography.length > 0 && (
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-sky-500/30">
                    <div className="flex items-center space-x-2.5">
                      <Film className="w-4 h-4 text-sky-400" />
                      <h3 className="text-sm sm:text-base font-display font-bold text-white tracking-wider">
                        FILMOGRAPHY
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-gray-400">
                      주요 출연 작품
                    </span>
                  </div>

                  <div className="space-y-4">
                    {getGroupedFilmography(artist.filmography).map((group) => (
                      <div key={group.categoryKey} className="space-y-1.5">
                        <div className="flex items-center justify-between pb-1 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-3 bg-sky-400"></span>
                            <h4 className="text-xs font-mono font-bold tracking-wider text-sky-300 uppercase">
                              {group.categoryLabelEn}{' '}
                              <span className="text-gray-400 font-normal">({group.categoryLabelKo})</span>
                            </h4>
                          </div>
                        </div>

                        <div className="divide-y divide-white/5 bg-[#131620] border border-white/5">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-3 sm:p-3.5 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
                            >
                              <div className="flex items-baseline space-x-3">
                                <span className="font-mono text-xs text-sky-400 font-bold shrink-0 min-w-[38px]">
                                  {item.year}
                                </span>
                                <span className="text-xs sm:text-sm font-semibold text-white">
                                  {item.title}
                                </span>
                              </div>
                              <div className="text-xs text-gray-300 font-mono sm:text-right pl-12 sm:pl-0">
                                <span className="text-gray-200">{item.role}</span>
                                {item.note && <span className="text-gray-400 ml-1">({item.note})</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Showreel / Video Feature (if available) */}
              {validEmbedUrl && (
                <div className="pt-4 border-t border-white/10">
                  <div className="bg-[#141824] p-4 sm:p-5 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded bg-sky-950/80 border border-sky-800 flex items-center justify-center shrink-0">
                        <Play className="w-4 h-4 fill-sky-400 text-sky-400" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {artist.nameKo} 공식 쇼릴 (SHOWREEL)
                        </h4>
                        <p className="text-[11px] text-gray-400">
                          오디션 및 캐스팅용 주요 연기 클립 영상
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowVideoPlayer(true)}
                      className="inline-flex items-center justify-center space-x-1.5 bg-sky-500 hover:bg-sky-400 text-black px-4 py-2 font-bold text-xs tracking-wider uppercase transition-all shrink-0 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-black" />
                      <span>쇼릴 재생</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Internal Links: Actor Page -> ARTISTS, NEWS, CONTACT */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-gray-400">
              <span className="text-gray-500">바로가기:</span>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/artists"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    if (onNavigate) onNavigate('artists');
                  }}
                  className="text-sky-400 hover:underline"
                >
                  소속 배우 목록
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="/news"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    if (onNavigate) onNavigate('news');
                  }}
                  className="text-sky-400 hover:underline"
                >
                  TK매니지먼트 NEWS
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    onCastingInquiry(artist);
                  }}
                  className="text-sky-400 hover:underline"
                >
                  캐스팅 및 매니지먼트 문의
                </a>
              </div>
            </div>

            {/* Bottom Action Controls */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
              <button
                id="btn-download-artist-profile"
                onClick={() => onOpenPrintSheet(artist)}
                className="inline-flex items-center space-x-2 bg-[#182A47] hover:bg-sky-900 text-white border border-sky-400/40 px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-300" />
                <span>DOWNLOAD PROFILE (프로필 인쇄 / PDF)</span>
              </button>

              <button
                id="btn-casting-inquiry-modal"
                onClick={() => {
                  onClose();
                  onCastingInquiry(artist);
                }}
                className="inline-flex items-center space-x-2 bg-white text-black hover:bg-slate-200 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-bold tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>이 배우 캐스팅 문의하기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Player Modal Overlay */}
        {showVideoPlayer && validEmbedUrl && (
          <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-black border border-white/20 aspect-video">
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="absolute -top-10 right-0 text-white hover:text-sky-400 text-xs font-mono tracking-widest flex items-center space-x-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
                <span>CLOSE VIDEO</span>
              </button>
              <iframe
                src={validEmbedUrl}
                title={`${artist.nameKo} Showreel`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
