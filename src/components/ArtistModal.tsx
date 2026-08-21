import React, { useState } from 'react';
import { X, Download, Play, Mail, Instagram, ChevronRight, Award, Film, GraduationCap, Sparkles, FileText } from 'lucide-react';
import { Artist } from '../types';

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

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'PHOTO' | 'VIDEO' | 'WORKS'>('PROFILE');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  const gallery = artist.galleryImages && artist.galleryImages.length > 0
    ? artist.galleryImages
    : [artist.profileImage];

  return (
    <div
      id="artist-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div
        id="artist-modal-container"
        className="relative w-full max-w-5xl bg-[#0F1117] border border-white/15 shadow-2xl overflow-hidden my-auto"
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B0C10]">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded bg-[#182A47] flex items-center justify-center text-white text-[11px] font-black">
              TK
            </div>
            <span className="text-xs font-mono tracking-widest text-gray-400">
              ARTIST DOSSIER / CASTING PROFILE
            </span>
          </div>

          <button
            id="btn-close-artist-modal"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          {/* Left Column: Visual Showcase */}
          <div className="lg:col-span-5 relative bg-black/60 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10">
            {/* Active Image */}
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-white/10 bg-neutral-900 shadow-inner group">
              <img
                src={gallery[selectedPhotoIndex] || artist.profileImage}
                alt={artist.nameKo}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              
              {/* Showreel quick overlay badge */}
              {artist.showreelUrl && (
                <button
                  onClick={() => setShowVideoPlayer(true)}
                  className="absolute bottom-4 left-4 right-4 bg-[#182A47]/90 hover:bg-[#182A47] text-white border border-sky-400/40 py-2.5 px-4 flex items-center justify-center space-x-2 text-xs font-semibold tracking-wider transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                  <span>PLAY SHOWREEL (쇼릴 재생)</span>
                </button>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {gallery.length > 1 && (
              <div className="mt-4 flex items-center space-x-2 overflow-x-auto pb-1">
                {gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`w-14 h-18 shrink-0 overflow-hidden border transition-all ${
                      selectedPhotoIndex === idx
                        ? 'border-sky-400 ring-1 ring-sky-400'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumb ${idx}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
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
                  onClick={() => setActiveTab('PHOTO')}
                  className={`pb-2 transition-all relative ${
                    activeTab === 'PHOTO'
                      ? 'text-sky-400 font-bold border-b-2 border-sky-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  PHOTO GALLERY
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
                      <span className="text-[10px] font-mono text-gray-500 uppercase block mb-1">
                        Language / 언어
                      </span>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                        {artist.languages.join(' • ')}
                      </div>
                    </div>
                  )}

                  {/* Agency Note */}
                  <div className="text-[11px] text-gray-400 pt-2 font-mono flex items-center justify-between">
                    <span>AGENCY: ㈜TK Company (TK MANAGEMENT)</span>
                    <span className="text-sky-400">EXCLUSIVE ARTIST</span>
                  </div>
                </div>
              )}

              {/* Tab 2: Filmography */}
              {activeTab === 'WORKS' && (
                <div className="space-y-3 animate-in fade-in duration-200">
                  {artist.filmography && artist.filmography.length > 0 ? (
                    artist.filmography.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 bg-[#131620] border border-white/5 hover:border-white/20 transition-colors flex items-start justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-mono bg-sky-950 text-sky-300 px-2 py-0.5 border border-sky-800">
                              {item.category}
                            </span>
                            <span className="text-[11px] font-mono text-gray-400">
                              {item.year}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-300">
                            {item.role} {item.note && <span className="text-gray-400">({item.note})</span>}
                          </p>
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

              {/* Tab 3: Photo Gallery */}
              {activeTab === 'PHOTO' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                  {gallery.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`aspect-[3/4] cursor-pointer overflow-hidden border relative group ${
                        selectedPhotoIndex === idx ? 'border-sky-400' : 'border-white/10'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`${artist.nameKo} ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs text-white font-mono">
                        VIEW
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Video / Reel */}
              {activeTab === 'VIDEO' && (
                <div className="space-y-4 animate-in fade-in duration-200">
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
                </div>
              )}
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#0B0C10] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6">
              {/* PDF Profile Download Button (User Spec Requirement #6) */}
              <button
                id="btn-download-artist-profile"
                onClick={() => onOpenPrintSheet(artist)}
                className="inline-flex items-center space-x-2 bg-[#182A47] hover:bg-sky-900 text-white border border-sky-400/40 px-5 py-3 text-xs font-semibold tracking-wider transition-all"
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
                className="inline-flex items-center space-x-2 bg-white text-black hover:bg-slate-200 px-6 py-3 text-xs font-bold tracking-wider transition-all shadow-md"
              >
                <Mail className="w-4 h-4" />
                <span>이 배우 캐스팅 문의하기</span>
              </button>
            </div>
          </div>
        </div>

        {/* Video Player Modal Overlay */}
        {showVideoPlayer && (
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
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
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
