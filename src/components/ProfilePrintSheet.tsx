import React from 'react';
import { X, Printer } from 'lucide-react';
import { Artist, CompanyInfo, getGroupedFilmography } from '../types';
import { DEFAULT_COMPANY_INFO } from '../services/companyService';
import { TKLogoMark } from './TKLogo';

interface ProfilePrintSheetProps {
  artist: Artist | null;
  onClose: () => void;
  onGoHome?: () => void;
  companyInfo?: CompanyInfo;
}

export const ProfilePrintSheet: React.FC<ProfilePrintSheetProps> = ({
  artist,
  onClose,
  onGoHome,
  companyInfo = DEFAULT_COMPANY_INFO
}) => {
  if (!artist) return null;

  const photoUrl = artist.profileImageUrl || artist.image || artist.profileImage || null;
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [photoUrl, artist.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleLogoClick = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      onClose();
    }
  };

  return (
    <div
      id="profile-print-overlay"
      className="fixed inset-0 z-60 overflow-y-auto bg-black/90 backdrop-blur-md flex flex-col items-center justify-start min-h-screen p-2 sm:p-6 touch-scroll"
    >
      <div
        id="profile-print-sheet"
        className="relative w-full max-w-4xl bg-white text-black shadow-2xl p-4 sm:p-8 md:p-10 my-2 sm:my-auto rounded-none"
      >
        {/* Top Control Bar (Hidden during actual print) */}
        <div className="print:hidden flex items-center justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-gray-200 gap-2">
          <button
            type="button"
            onClick={handleLogoClick}
            className="flex items-center space-x-1.5 sm:space-x-2 text-xs font-mono text-gray-500 hover:text-black transition-colors cursor-pointer group focus:outline-none min-w-0"
            title="홈으로 이동"
          >
            <span className="font-bold text-black group-hover:text-blue-900 transition-colors truncate">TK MANAGEMENT</span>
            <span className="hidden sm:inline text-gray-400">/</span>
            <span className="hidden sm:inline text-gray-500 text-[11px] truncate">CASTING BIO-SHEET</span>
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-black text-white hover:bg-neutral-800 active:scale-95 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[38px]"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Styled for crisp A4 & Casting Director use) */}
        <div className="space-y-6 sm:space-y-8 print:space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-black pb-3 sm:pb-4 gap-2 print:flex-row print:items-center">
            <button
              type="button"
              onClick={handleLogoClick}
              className="flex items-center space-x-2.5 sm:space-x-3 text-left focus:outline-none cursor-pointer group"
              title="홈으로 이동"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <TKLogoMark className="w-7 h-7 sm:w-9 sm:h-9" tColor="#000000" kColor="#1E3A8A" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black tracking-widest leading-none font-display text-black group-hover:text-blue-950 transition-colors whitespace-nowrap">
                  TK MANAGEMENT
                </h1>
                <span className="text-[9px] sm:text-[10px] tracking-wider text-gray-500 font-mono block mt-0.5">
                  ㈜TK Company Actors Division
                </span>
              </div>
            </button>

            <div className="text-left sm:text-right text-[9px] sm:text-[10px] font-mono text-gray-600 border-t sm:border-t-0 pt-1.5 sm:pt-0 border-gray-100 print:text-right print:border-t-0 print:pt-0">
              <div className="font-semibold text-gray-800">OFFICIAL ACTOR PROFILE</div>
              <div className="text-gray-500">CONFIDENTIAL / CASTING PURPOSES ONLY</div>
            </div>
          </div>

          {/* Actor Profile Main Section */}
          <div className="grid grid-cols-12 gap-5 sm:gap-6">
            {/* Photo Column */}
            <div className="col-span-12 sm:col-span-5 print:col-span-5">
              <div className="aspect-[3/4] w-full max-w-[280px] sm:max-w-none mx-auto sm:mx-0 border border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center print:max-w-none">
                {!photoUrl ? (
                  <div className="text-center p-4">
                    <div className="font-mono text-xs font-bold text-gray-500 uppercase">
                      OFFICIAL PROFILE IMAGE
                    </div>
                    <div className="font-mono text-[9px] text-gray-400 mt-1 uppercase">
                      NOT UPLOADED
                    </div>
                  </div>
                ) : imgError ? (
                  <div className="text-center p-4">
                    <div className="font-mono text-xs font-bold text-gray-500 uppercase">
                      OFFICIAL PROFILE IMAGE
                    </div>
                    <div className="font-mono text-[9px] text-gray-400 mt-1 uppercase">
                      NOT AVAILABLE
                    </div>
                  </div>
                ) : (
                  <img
                    src={photoUrl}
                    alt={artist.nameKo}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
              <div className="mt-1.5 sm:mt-2 text-center text-[10px] text-gray-500 font-mono">
                {artist.nameKo} ({artist.nameEn})
              </div>
            </div>

            {/* Meta Specifications Column */}
            <div className="col-span-12 sm:col-span-7 print:col-span-7 space-y-3 sm:space-y-4">
              <div>
                <span className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase tracking-widest block">
                  ACTOR PROFILE
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight font-display text-black">
                  {artist.nameKo}
                </h2>
                <h3 className="text-xs sm:text-sm font-mono tracking-widest text-gray-600 uppercase">
                  {artist.nameEn}
                </h3>
              </div>

              {/* Physical Spec Grid */}
              <div className="grid grid-cols-3 gap-2 border-y border-gray-200 py-2 sm:py-3 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 block">생년월일</span>
                  <span className="font-bold text-xs sm:text-sm">{artist.birth}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">신장</span>
                  <span className="font-bold text-xs sm:text-sm">{artist.height}cm</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">성별</span>
                  <span className="font-bold text-xs sm:text-sm">{artist.gender === 'Female' ? '여성' : '남성'}</span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-1.5 sm:space-y-2 text-xs">
                <div className="flex items-baseline">
                  <span className="w-16 sm:w-20 font-bold text-gray-700 shrink-0">학 력</span>
                  <span className="text-gray-900 break-words flex-1">{artist.education}</span>
                </div>
                {artist.instagram && (
                  <div className="flex items-baseline">
                    <span className="w-16 sm:w-20 font-bold text-gray-700 shrink-0">SNS</span>
                    <span className="text-gray-900 font-mono break-all flex-1">{artist.instagram}</span>
                  </div>
                )}
              </div>

              {artist.bio && (
                <div className="bg-gray-50 p-2.5 sm:p-3 border-l-2 border-black text-xs text-gray-700 leading-relaxed italic break-keep">
                  "{artist.bio}"
                </div>
              )}
            </div>
          </div>

          {/* Filmography Section */}
          <div className="pt-2 border-t border-gray-200">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black mb-3 border-b border-black pb-1 inline-block">
              FILMOGRAPHY / 주요 활동 경력
            </h4>

            {artist.filmography && artist.filmography.length > 0 ? (
              <div className="space-y-3">
                {getGroupedFilmography(artist.filmography).map((group) => (
                  <div key={group.categoryKey} className="space-y-1">
                    <div className="text-[11px] font-bold text-gray-900 font-mono border-b border-gray-300 pb-0.5 flex justify-between">
                      <span>{group.categoryLabelEn} ({group.categoryLabelKo})</span>
                    </div>
                    <table className="w-full text-xs text-left">
                      <tbody className="divide-y divide-gray-100">
                        {group.items.map((item) => (
                          <tr key={item.id} className="align-top">
                            <td className="py-1 w-12 sm:w-14 font-mono text-gray-600 text-[10px] sm:text-[11px] shrink-0 whitespace-nowrap">{item.year}</td>
                            <td className="py-1 px-1 sm:px-2 font-bold text-gray-900 text-xs sm:text-[13px] break-words">{item.title}</td>
                            <td className="py-1 text-right text-gray-700 text-[10px] sm:text-[11px] whitespace-normal max-w-[45%] sm:max-w-none sm:w-48 break-words print:w-48 shrink-0">
                              {item.role} {item.note ? `(${item.note})` : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-2">등록된 활동 경력이 없습니다.</p>
            )}
          </div>

          {/* Footer Contact for Casting Directors */}
          <div className="pt-3 sm:pt-4 border-t-2 border-black flex flex-col sm:flex-row sm:items-center justify-between text-[9px] sm:text-[10px] text-gray-600 font-mono gap-2 print:flex-row print:items-center">
            <div>
              <span className="font-bold text-black block sm:inline">㈜TK Company / TK MANAGEMENT</span>
              <div className="text-gray-500 break-words">{companyInfo?.address || '서울특별시 마포구 마포나루길 442 마포인트 3층'}</div>
            </div>

            <div className="text-left sm:text-right print:text-right">
              <div>CASTING &amp; 섭외 : {companyInfo?.tel || '02-540-8820'} / {companyInfo?.email || 'taz0206@naver.com'}</div>
              <div>OFFICIAL WEB : www.mtkent.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
