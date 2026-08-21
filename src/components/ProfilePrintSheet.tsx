import React from 'react';
import { X, Printer, Download, Mail, Phone, Globe } from 'lucide-react';
import { Artist } from '../types';

interface ProfilePrintSheetProps {
  artist: Artist | null;
  onClose: () => void;
}

export const ProfilePrintSheet: React.FC<ProfilePrintSheetProps> = ({ artist, onClose }) => {
  if (!artist) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="profile-print-overlay"
      className="fixed inset-0 z-60 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6"
    >
      <div className="relative w-full max-w-4xl bg-white text-black shadow-2xl p-6 sm:p-10 my-auto rounded-none">
        {/* Top Control Bar (Hidden during actual print) */}
        <div className="print:hidden flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
            <span className="font-bold text-black">TK MANAGEMENT</span>
            <span>/</span>
            <span>CASTING BIO-SHEET PREVIEW</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-black text-white hover:bg-neutral-800 px-4 py-2 text-xs font-bold uppercase tracking-wider"
            >
              <Printer className="w-4 h-4" />
              <span>인쇄 / PDF 저장</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-black hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area (Styled for crisp A4 & Casting Director use) */}
        <div className="space-y-8 print:space-y-6">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-black pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#182A47] text-white flex items-center justify-center font-black text-base">
                TK
              </div>
              <div>
                <h1 className="text-xl font-black tracking-widest leading-none font-display">
                  TK MANAGEMENT
                </h1>
                <span className="text-[10px] tracking-wider text-gray-500 font-mono">
                  ㈜TK Company Actors Division
                </span>
              </div>
            </div>

            <div className="text-right text-[10px] font-mono text-gray-600">
              <div>OFFICIAL ACTOR PROFILE</div>
              <div>CONFIDENTIAL / CASTING PURPOSES ONLY</div>
            </div>
          </div>

          {/* Actor Profile Main Section */}
          <div className="grid grid-cols-12 gap-6">
            {/* Photo Column */}
            <div className="col-span-12 sm:col-span-5">
              <div className="aspect-[3/4] w-full border border-gray-300 overflow-hidden bg-gray-100">
                <img
                  src={artist.profileImage}
                  alt={artist.nameKo}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2 text-center text-[10px] text-gray-500 font-mono">
                {artist.nameKo} ({artist.nameEn})
              </div>
            </div>

            {/* Meta Specifications Column */}
            <div className="col-span-12 sm:col-span-7 space-y-4">
              <div>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                  ACTOR PROFILE
                </span>
                <h2 className="text-3xl font-black tracking-tight font-display">
                  {artist.nameKo}
                </h2>
                <h3 className="text-sm font-mono tracking-widest text-gray-600 uppercase">
                  {artist.nameEn}
                </h3>
              </div>

              {/* Physical Spec Grid */}
              <div className="grid grid-cols-3 gap-2 border-y border-gray-200 py-3 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 block">생년월일</span>
                  <span className="font-bold">{artist.birth}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">신장</span>
                  <span className="font-bold">{artist.height}cm</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">성별</span>
                  <span className="font-bold">{artist.gender === 'Female' ? '여성' : '남성'}</span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-2 text-xs">
                <div className="flex">
                  <span className="w-20 font-bold text-gray-700 shrink-0">학 력</span>
                  <span className="text-gray-900">{artist.education}</span>
                </div>
                {artist.languages && (
                  <div className="flex">
                    <span className="w-20 font-bold text-gray-700 shrink-0">외국어</span>
                    <span className="text-gray-900">{artist.languages.join(', ')}</span>
                  </div>
                )}
                {artist.instagram && (
                  <div className="flex">
                    <span className="w-20 font-bold text-gray-700 shrink-0">SNS</span>
                    <span className="text-gray-900 font-mono">{artist.instagram}</span>
                  </div>
                )}
              </div>

              {artist.bio && (
                <div className="bg-gray-50 p-3 border-l-2 border-black text-xs text-gray-700 leading-relaxed italic">
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
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-mono text-[10px]">
                    <th className="py-1.5 w-16">연도</th>
                    <th className="py-1.5 w-20">구분</th>
                    <th className="py-1.5">작품명</th>
                    <th className="py-1.5 w-32">배역 및 비고</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {artist.filmography.map((item) => (
                    <tr key={item.id}>
                      <td className="py-1.5 font-mono text-gray-600">{item.year}</td>
                      <td className="py-1.5 font-mono font-semibold">{item.category}</td>
                      <td className="py-1.5 font-bold text-gray-900">{item.title}</td>
                      <td className="py-1.5 text-gray-700">{item.role} {item.note ? `(${item.note})` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-xs text-gray-500 py-2">등록된 활동 경력이 없습니다.</p>
            )}
          </div>

          {/* Footer Contact for Casting Directors */}
          <div className="pt-4 border-t-2 border-black flex items-center justify-between text-[10px] text-gray-600 font-mono">
            <div>
              <span className="font-bold text-black">㈜TK Company / TK MANAGEMENT</span>
              <div className="text-gray-500">서울특별시 마포구 마포나루길 442 마포인트 3층</div>
            </div>

            <div className="text-right">
              <div>CASTING &amp; 섭외 : 02-540-8820 / taz0206@naver.com</div>
              <div>OFFICIAL WEB : www.mtkent.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
