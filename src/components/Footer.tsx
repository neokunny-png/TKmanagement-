import React from 'react';
import { Shield, ArrowUp } from 'lucide-react';
import { TKLogo } from './TKLogo';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#07080B] text-gray-400 text-xs border-t border-white/10 pt-16 pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Footer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Logo & Corporate Manifesto */}
          <div className="md:col-span-5 space-y-4">
            <TKLogo
              className="h-8 w-9"
              variant="dark"
              showText={true}
            />

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-light">
              YOUR NEXT SCENE. STARTS HERE. <br />
              새로운 얼굴을 발견하고, 배우의 다음 장면을 만들어가는 프리미엄 액터스 매니지먼트.
            </p>

            <div className="text-[11px] font-mono text-gray-400 pt-2">
              CASTING &amp; 섭외 담당 : taz0206@naver.com
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-mono text-white uppercase tracking-widest font-bold mb-3">
              MENU
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  ABOUT TK
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('artists')}
                  className="hover:text-white transition-colors"
                >
                  ARTISTS (소속 배우)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('news')}
                  className="hover:text-white transition-colors"
                >
                  NEWS (보도자료)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('audition')}
                  className="hover:text-white transition-colors"
                >
                  AUDITION (신인 오디션)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  CONTACT (캐스팅 문의)
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate Legal Info */}
          <div className="md:col-span-4 space-y-1.5 text-[11px] text-gray-400">
            <h4 className="text-xs font-mono text-white uppercase tracking-widest font-bold mb-3">
              COMPANY INFORMATION
            </h4>
            <div>상호명 : ㈜TK Company (티케이컴퍼니)</div>
            <div>브랜드 : TK MANAGEMENT (티케이 매니지먼트)</div>
            <div>대표이사 : 조태경 | 개인정보보호책임자 : 조태경</div>
            <div>사업자등록번호 : 211-88-92410</div>
            <div>대중문화예술기획업 등록번호 : 제2025-서울강남-0418호</div>
            <div>주소 : 서울특별시 마포구 마포나루길 442 마포인트 3층</div>
            <div>대표전화 : 02-540-8820 | 팩스 : 02-540-8821</div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
          <div>
            &copy; 2026 TK Company Co., Ltd. All Rights Reserved.
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1.5 text-gray-400 hover:text-sky-400 transition-colors"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>관리자 시스템 (Admin Portal)</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center space-x-1 hover:text-white transition-colors"
            >
              <span>TOP</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
