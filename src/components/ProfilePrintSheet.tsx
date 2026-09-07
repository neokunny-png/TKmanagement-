import React, { useState, useEffect } from 'react';
import { X, Printer, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [imgError, setImgError] = useState(false);
  const [base64Photo, setBase64Photo] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | null>(null);

  // Pre-fetch or convert photo to Base64 to guarantee zero CORS/taint issues in html2canvas
  useEffect(() => {
    setImgError(false);
    setBase64Photo(null);

    if (!photoUrl) return;

    if (photoUrl.startsWith('data:')) {
      setBase64Photo(photoUrl);
      return;
    }

    let isMounted = true;
    // Attempt to pre-fetch photo as Base64 for bulletproof PDF generation
    const fetchBase64 = async () => {
      try {
        const res = await fetch(photoUrl, { mode: 'cors' });
        if (!res.ok) throw new Error('Fetch failed');
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          if (isMounted && reader.result) {
            setBase64Photo(reader.result as string);
          }
        };
        reader.readAsDataURL(blob);
      } catch {
        // Fallback: draw image to an offscreen canvas
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (ctx && isMounted) {
              ctx.drawImage(img, 0, 0);
              setBase64Photo(canvas.toDataURL('image/jpeg', 0.92));
            }
          } catch {
            // Tainted or CORS-blocked, html2canvas will fallback to original img
          }
        };
        img.src = photoUrl;
      }
    };

    fetchBase64();

    return () => {
      isMounted = false;
    };
  }, [photoUrl, artist.id]);

  // PRINT Handler
  const handlePrint = () => {
    setFeedbackMessage(null);
    setFeedbackType(null);

    try {
      // Temporarily release body scroll locks if active
      const prevOverflow = document.body.style.overflow;
      const prevPosition = document.body.style.position;
      const prevTop = document.body.style.top;
      const prevWidth = document.body.style.width;

      document.body.style.overflow = 'visible';
      document.body.style.position = 'static';
      document.body.style.top = '0';
      document.body.style.width = 'auto';

      if (typeof window !== 'undefined') {
        window.focus();
      }

      // Allow browser reflow before invoking print dialog
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            window.print();
          } catch (err: any) {
            console.error('[TK] window.print() failed:', err);
            setFeedbackMessage(
              '브라우저 인쇄 창을 열지 못했습니다. 보안 설정(iframe 등)으로 제한된 경우, 상단의 [DOWNLOAD PDF] 버튼을 이용해 PDF를 다운로드한 후 인쇄해 주세요.'
            );
            setFeedbackType('error');
          } finally {
            // Restore body layout styles after print invocation
            setTimeout(() => {
              document.body.style.overflow = prevOverflow;
              document.body.style.position = prevPosition;
              document.body.style.top = prevTop;
              document.body.style.width = prevWidth;
            }, 500);
          }
        }, 100);
      });
    } catch (err: any) {
      console.error('[TK] Print setup error:', err);
      setFeedbackMessage('인쇄 기능을 호출하는 중 오류가 발생했습니다. [DOWNLOAD PDF] 버튼을 이용해 주세요.');
      setFeedbackType('error');
    }
  };

  // DOWNLOAD PDF Handler
  const handleDownloadPdf = async () => {
    if (isGeneratingPdf || !artist) return;

    setIsGeneratingPdf(true);
    setFeedbackMessage(null);
    setFeedbackType(null);

    try {
      const element = document.getElementById('profile-printable-content');
      if (!element) {
        throw new Error('인쇄용 콘텐츠 요소를 찾을 수 없습니다.');
      }

      // Generate crisp 2x Retina canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: 1024,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('profile-printable-content');
          if (clonedElement) {
            clonedElement.style.width = '800px';
            clonedElement.style.maxWidth = '800px';
            clonedElement.style.margin = '0 auto';
            clonedElement.style.padding = '32px';
            clonedElement.style.background = '#ffffff';
            clonedElement.style.color = '#000000';
          }
          // Inject preloaded base64 photo into clone if available
          if (base64Photo) {
            const clonedImg = clonedDoc.getElementById('profile-actor-photo') as HTMLImageElement;
            if (clonedImg) {
              clonedImg.src = base64Photo;
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const marginX = 10;
      const marginTop = 12;
      const marginBottom = 12;
      const maxContentWidth = pageWidth - marginX * 2; // 190mm
      const maxContentHeight = pageHeight - marginTop - marginBottom; // 273mm

      const canvasRatio = canvas.height / canvas.width;
      let finalWidth = maxContentWidth;
      let finalHeight = finalWidth * canvasRatio;

      // Fit single page if height is within reasonable bounds (up to 1.25x max height)
      if (finalHeight > maxContentHeight && finalHeight <= maxContentHeight * 1.25) {
        const scale = maxContentHeight / finalHeight;
        finalWidth = finalWidth * scale;
        finalHeight = maxContentHeight;
        const offsetX = (pageWidth - finalWidth) / 2;
        pdf.addImage(imgData, 'JPEG', offsetX, marginTop, finalWidth, finalHeight, undefined, 'FAST');
      } else if (finalHeight <= maxContentHeight) {
        const offsetX = (pageWidth - finalWidth) / 2;
        pdf.addImage(imgData, 'JPEG', offsetX, marginTop, finalWidth, finalHeight, undefined, 'FAST');
      } else {
        // Multi-page clean pagination for actors with extensive works
        let heightLeft = finalHeight;
        let position = marginTop;

        pdf.addImage(imgData, 'JPEG', marginX, position, finalWidth, finalHeight, undefined, 'FAST');
        heightLeft -= maxContentHeight;

        while (heightLeft > 0) {
          position = marginTop - (finalHeight - heightLeft);
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', marginX, position, finalWidth, finalHeight, undefined, 'FAST');
          heightLeft -= maxContentHeight;
        }
      }

      // Construct standard file name with actor's name
      const rawName = artist.nameKo || artist.nameEn || 'ACTOR';
      const safeName = rawName.trim().replace(/[\/\\:*?"<>|]/g, '').replace(/\s+/g, '_');
      const fileName = `TK_MANAGEMENT_${safeName}_PROFILE.pdf`;

      // Save PDF
      try {
        pdf.save(fileName);
      } catch {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 1000);
      }

      setFeedbackMessage(`${fileName} 다운로드가 완료되었습니다.`);
      setFeedbackType('success');
    } catch (err: any) {
      console.error('[TK] PDF generation failed:', err);
      setFeedbackMessage('PDF 생성에 실패했습니다. 잠시 후 다시 시도해주시거나 [PRINT] 기능을 이용해주세요.');
      setFeedbackType('error');
    } finally {
      setIsGeneratingPdf(false);
    }
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
        <div className="print:hidden flex items-center justify-between pb-4 sm:pb-6 mb-4 sm:mb-6 border-b border-gray-200 gap-2 flex-wrap sm:flex-nowrap">
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
            {/* PRINT Button */}
            <button
              id="btn-print-profile-action"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 bg-white text-black border border-black hover:bg-neutral-100 active:scale-95 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap min-h-[38px] transition-colors shadow-sm"
              title="브라우저 인쇄 대화상자 열기"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>PRINT (인쇄)</span>
            </button>

            {/* DOWNLOAD PDF Button */}
            <button
              id="btn-download-pdf-action"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className={`inline-flex items-center space-x-1.5 bg-black text-white hover:bg-neutral-800 active:scale-95 px-3 sm:px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap min-h-[38px] transition-colors shadow-sm ${
                isGeneratingPdf ? 'opacity-75 cursor-wait' : 'cursor-pointer'
              }`}
              title="공식 프로필 PDF 다운로드"
            >
              <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
              <span>{isGeneratingPdf ? 'GENERATING...' : 'DOWNLOAD PDF'}</span>
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-gray-400 hover:text-black hover:bg-gray-100 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center transition-colors"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Feedback Message Banner (Hidden during print) */}
        {feedbackMessage && (
          <div
            className={`print:hidden mb-4 p-3 text-xs flex items-center justify-between gap-2 border ${
              feedbackType === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            <div className="flex items-center space-x-2 min-w-0">
              {feedbackType === 'error' ? (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span className="break-keep">{feedbackMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMessage(null)}
              className="text-gray-400 hover:text-gray-700 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Printable Paper Area (Styled for crisp A4 & Casting Director use) */}
        <div id="profile-printable-content" className="space-y-6 sm:space-y-8 print:space-y-6 bg-white text-black">
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
                    id="profile-actor-photo"
                    src={base64Photo || photoUrl}
                    alt={artist.nameKo}
                    onError={() => setImgError(true)}
                    crossOrigin="anonymous"
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
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 border-y border-gray-200 py-2 sm:py-3 text-center text-xs font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 block">생년월일</span>
                  <span className="font-bold text-xs sm:text-sm">{artist.birth || '-'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 block">신장</span>
                  <span className="font-bold text-xs sm:text-sm">{artist.height ? `${artist.height}cm` : '-'}</span>
                </div>
                {artist.weight ? (
                  <div>
                    <span className="text-[10px] text-gray-500 block">체중</span>
                    <span className="font-bold text-xs sm:text-sm">{artist.weight}kg</span>
                  </div>
                ) : null}
                <div>
                  <span className="text-[10px] text-gray-500 block">성별</span>
                  <span className="font-bold text-xs sm:text-sm">{artist.gender === 'Female' ? '여성' : '남성'}</span>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-1.5 sm:space-y-2 text-xs">
                <div className="flex items-baseline">
                  <span className="w-16 sm:w-20 font-bold text-gray-700 shrink-0">학 력</span>
                  <span className="text-gray-900 break-words flex-1">{artist.education || '-'}</span>
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
