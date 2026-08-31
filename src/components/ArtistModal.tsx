import React, { useState } from 'react';
import { X, Download, Play, Mail, Instagram, ChevronRight, Award, Film, GraduationCap, Sparkles, FileText } from 'lucide-react';
import { Artist, sortFilmographyByYear, getGroupedFilmography } from '../types';
import { TKLogoMark } from './TKLogo';

interface ArtistModalProps {
  artist: Artist | null;
  onClose: () => void;
  onCastingInquiry: (artist: Artist) => void;
  onOpenPrintSheet: (artist: Artist) => void;
}

export const ArtistModal: React.FC<ArtistModalProps> = ({
  artist,
  onClose,
  onCastingInquiry,
  onOpenPrintSheet,
}) => {
  if (!artist) return null;

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'VIDEO' | 'WORKS'>('PROFILE');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [imgError, setImgError] = useState(false);

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

  return (
    <div
      id="artist-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto touch-scroll bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div
        id="artist-modal-container"
        className="relative w-full max-w-5xl bg-[#0F1117] border border-white/15 shadow-2xl overflow-hidden my-auto max-h-[92vh] max-h-[92dvh] flex flex-col"
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-[#0B0C10] shrink-0">
          <div className="flex items-center space-x-3">
            <TKLogoMark className="w-7 h-5 shrink-0" tColor="#FFFFFF" kColor="#38BDF8" />
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-display tracking-widest text-white whitespace-nowrap">
                TK MANAGEMENT
              </span>
              <span className="text-gray-600 text-xs font-mono">/</span>
              <span className="text-[11px] sm:text-xs font-mono tracking-widest text-gray-400 whitespace-nowrap">
                ARTIST DOSSIER
              </span>
            </div>
          </div>

          <button
            id="btn-close-artist-modal"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div className="overflow-y-auto touch-scroll flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
            {/* Left Column: Visual Showcase */}
            <div className="lg:col-span-5 relative bg-black/60 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
              {/* Official Single Profile Image */}
              <div className="relative aspect-[3/4] w-full overflow-hidden border border-white/10 bg-neutral-900 shadow-inner group">
                {imgError || !artist.profileImage ? (
                  <div className="w-full h-full bg-[#161922] flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mb-3 text-gray-500 font-mono text-xs">
                      TK
                    </div>
                    <span className="text-xs font-mono tracking-widest text-gray-400 uppercase">
                      IMAGE NOT UPLOADED
                    </span>
                    <span className="text-[10px] text-gray-600 font-mono mt-1">
                      OFFICIAL PROFILE IMAGE
                    </span>
                  </div>
                ) : (
                  <img
                    src={artist.profileImage}
                    alt={artist.nameKo}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-center"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                
                {/* Showreel quick overlay badge */}
                {validEmbedUrl && (
                  <button
                    onClick={() => setShowVideoPlayer(true)}
                    className="absolute bottom-4 left-4 right-4 bg-[#182A47]/90 hover:bg-[#182A47] text-white border border-sky-400/40 py-2.5 px-4 flex items-center justify-center space-x-2 text-xs font-semibold tracking-wider transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                    <span>PLAY SHOWREEL (쇼릴 재생)</span>
                  </button>
                )}
              </div>

              <div className="mt-4 text-center">
                <span className="text-[11px] font-mono tracking-widest text-gray-400 uppercase">
                  OFFICIAL PROFILE IMAGE
                </span>
              </div>
            </div>

          {/* Right Column: Detailed Actor Bio & Specs */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[750px]">
            <div>
              {/* Name & Titles */}
              <div className="mb-6 pb-6 border-b border-white/10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white tracking-tight">
                      {artist.nameKo}
                    </h2>
                    <p className="text-sm font-mono tracking-widest text-gray-300 uppercase mt-1">
                      {artist.nameEn}
                    </p>
                  </div>

                  {artist.instagram && (
                    <a
                      href={`https://instagram.com/${artist.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1.5 text-xs text-gray-400 hover:text-sky-400 transition-colors border border-white/10 px-3 py-1.5 bg-white/5"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>{artist.instagram}</span>
                    </a>
                  )}
                </div>

                {artist.bio && (
                  <p className="text-xs sm:text-sm text-gray-300 font-light mt-4 leading-relaxed bg-[#141824]/60 p-3.5 border-l-2 border-sky-400">
                    "{artist.bio}"
                  </p>
                )}
              </div>

              {/* Navigation Tabs inside Modal */}
              <div className="flex space-x-6 border-b border-white/10 mb-6 text-xs font-mono tracking-widest">
                <button
                  onClick={() => setActiveTab('PROFILE')}
                  className={`pb-2 transition-all relative ${
                    activeTab === 'PROFILE'
                      ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  PROFILE
                </button>
                <button
                  onClick={() => setActiveTab('WORKS')}
                  className={`pb-2 transition-all relative ${
                    activeTab === 'WORKS'
                      ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  FILMOGRAPHY ({artist.filmography?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab('VIDEO')}
                  className={`pb-2 transition-all relative ${
                    activeTab === 'VIDEO'
                      ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  VIDEO / REEL
                </button>
              </div>

              {/* Tab 1: Profile Specifications */}
              {activeTab === 'PROFILE' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="bg-[#131620] p-3.5 border border-white/5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                        Birth / 생년월일
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        {artist.birth}
                      </span>
                    </div>
                    <div className="bg-[#131620] p-3.5 border border-white/5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                        Height / 키
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        {artist.height} cm
                      </span>
                    </div>
                    <div className="bg-[#131620] p-3.5 border border-white/5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                        Gender / 성별
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        {artist.gender === 'Female' ? '여성 (Female)' : '남성 (Male)'}
                      </span>
                    </div>
                  </div>

                  {/* Education */}
                  <div className="bg-[#131620] p-4 border border-white/5 flex items-start space-x-3">
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

                  {/* Languages */}
                  {artist.languages && artist.languages.length > 0 && (
                    <div className="bg-[#131620] p-4 border border-white/5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1.5">
                        Language / 언어
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                        {artist.languages.map((lang, idx) => (
                          <span key={idx} className="bg-white/5 border border-white/10 px-2.5 py-1 font-mono text-[11px] text-gray-300">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specialty / 특기 & 특화분야 */}
                  {artist.specialty && artist.specialty.length > 0 && (
                    <div className="bg-[#131620] p-4 border border-white/5">
                      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1.5">
                        Specialty / 특기 • 특화분야
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                        {artist.specialty.map((spec, idx) => (
                          <span key={idx} className="bg-sky-950/50 border border-sky-800/50 text-sky-300 px-2.5 py-1 text-[11px] font-medium">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Filmography - Grouped by Category */}
              {activeTab === 'WORKS' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  {artist.filmography && artist.filmography.length > 0 ? (
                    getGroupedFilmography(artist.filmography).map((group) => (
                      <div key={group.categoryKey} className="space-y-2">
                        {/* Category Group Header */}
                        <div className="flex items-center justify-between pb-1.5 border-b border-sky-500/30">
                          <div className="flex items-center space-x-2">
                            <span className="w-1.5 h-3.5 bg-sky-400"></span>
                            <h4 className="text-xs font-mono font-bold tracking-wider text-sky-300 uppercase">
                              {group.categoryLabelEn} <span className="text-gray-400 font-normal">({group.categoryLabelKo})</span>
                            </h4>
                          </div>
                          <span className="text-[11px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 border border-white/10">
                            {group.items.length}편
                          </span>
                        </div>

                        {/* Category Items List */}
                        <div className="divide-y divide-white/5 bg-[#131620] border border-white/5">
                          {group.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-3.5 hover:bg-white/5 transition-colors flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5"
                            >
                              <div className="flex items-baseline space-x-3">
                                <span className="font-mono text-xs text-sky-400 font-bold shrink-0 min-w-[38px]">
                                  {item.year}
                                </span>
                                <span className="text-sm font-semibold text-white">
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
                    ))
                  ) : (
                    <div className="text-center py-10 text-xs text-gray-500 font-mono">
                      현재 등록된 필모그래피가 없습니다.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Video / Reel */}
              {activeTab === 'VIDEO' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {validEmbedUrl ? (
                    <div className="bg-[#131620] p-6 border border-white/10 text-center">
                      <Film className="w-10 h-10 text-sky-400 mx-auto mb-3" />
                      <h4 className="text-base font-bold text-white mb-1">
                        {artist.nameKo} 배우 공식 연기 쇼릴
                      </h4>
                      <p className="text-xs text-gray-400 mb-6 max-w-md mx-auto">
                        대사 연기, 액션, 감정선 클립이 포함된 최신 오디션용 쇼릴 영상입니다.
                      </p>
                      <button
                        onClick={() => setShowVideoPlayer(true)}
                        className="inline-flex items-center space-x-2 bg-sky-500 hover:bg-sky-400 text-black px-6 py-3 font-bold text-xs tracking-wider uppercase transition-all"
                      >
                        <Play className="w-4 h-4 fill-black" />
                        <span>쇼릴 영상 전체화면 재생</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#131620] p-8 border border-white/10 text-center space-y-3">
                      <Film className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                      <h4 className="text-base font-bold text-white">
                        등록된 공식 쇼릴 영상이 없습니다
                      </h4>
                      <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                        현재 해당 배우의 공개용 쇼릴 영상이 준비 중입니다.<br />
                        추가 연기 영상 및 포트폴리오는 캐스팅 문의를 통해 확인하실 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#0B0C10] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
              {/* PDF Profile Download Button (User Spec Requirement #6) */}
              <button
                id="btn-download-artist-profile"
                onClick={() => onOpenPrintSheet(artist)}
                className="inline-flex items-center space-x-2 bg-[#182A47] hover:bg-sky-900 text-white border border-sky-400/40 px-5 py-3 text-xs font-semibold tracking-wider transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-sky-300" />
                <span>DOWNLOAD PROFILE (프로필 인쇄 / PDF)</span>
              </button>

              {/* Casting Direct Proposal Button */}
              <button
                id="btn-casting-inquiry-modal"
                onClick={() => {
                  onClose();
                  onCastingInquiry(artist);
                }}
                className="inline-flex items-center space-x-2 bg-white text-black hover:bg-slate-200 px-6 py-3 text-xs font-bold tracking-wider transition-all shadow-md cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>이 배우 캐스팅 문의하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Video Player Modal Overlay */}
        {showVideoPlayer && validEmbedUrl && (
          <div className="fixed inset-0 z-60 bg-black/95 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-black border border-white/20 aspect-video">
              <button
                onClick={() => setShowVideoPlayer(false)}
                className="absolute -top-10 right-0 text-white hover:text-sky-400 text-xs font-mono tracking-widest flex items-center space-x-1"
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
