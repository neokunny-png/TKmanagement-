import React from 'react';
import { ArrowLeft, Shield, FileText } from 'lucide-react';
import { CompanyInfo } from '../types';
import { DEFAULT_COMPANY_INFO } from '../services/companyService';

interface TermsViewProps {
  companyInfo?: CompanyInfo;
  onNavigateHome: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({
  companyInfo = DEFAULT_COMPANY_INFO,
  onNavigateHome,
}) => {
  return (
    <article className="pt-28 pb-20 bg-[#0B0C10] text-[#E5E7EB] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center justify-between text-xs font-mono text-gray-400">
          <div className="flex items-center space-x-2">
            <button
              onClick={onNavigateHome}
              className="text-sky-400 hover:text-white transition-colors cursor-pointer"
            >
              홈
            </button>
            <span>&gt;</span>
            <span className="text-white">이용약관</span>
          </div>
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center space-x-1.5 text-sky-400 hover:text-sky-300 transition-colors text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>메인으로 돌아가기</span>
          </button>
        </nav>

        {/* Page Header */}
        <header className="border-b border-white/10 pb-8 mb-10">
          <div className="flex items-center space-x-2 text-sky-400 font-mono text-xs uppercase tracking-widest mb-3">
            <FileText className="w-4 h-4" />
            <span>TERMS OF SERVICE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight mb-4">
            TK MANAGEMENT 이용약관
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono">
            시행일자: 2026년 9월 30일
          </p>
        </header>

        {/* Legal Content Body */}
        <div className="bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg space-y-10 text-xs sm:text-sm leading-relaxed text-gray-300 shadow-2xl">
          {/* 제1조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제1조</span>
              <span>(목적)</span>
            </h2>
            <p>
              이 약관은 TK MANAGEMENT(이하 &quot;회사&quot;)가 운영하는 인터넷 홈페이지(이하 &quot;사이트&quot;)에서 제공하는 정보 및 관련 서비스의 이용에 관한 회사와 이용자의 권리, 의무 및 책임사항을 정하는 것을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제2조</span>
              <span>(정의)</span>
            </h2>
            <p>이 약관에서 사용하는 용어의 뜻은 다음과 같습니다.</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>
                <strong className="text-white">&quot;사이트&quot;</strong>란 회사가 운영하는 TK MANAGEMENT 공식 홈페이지(https://www.tkm.kr/)를 말합니다.
              </li>
              <li>
                <strong className="text-white">&quot;이용자&quot;</strong>란 사이트에 접속하여 회사가 제공하는 정보를 이용하는 모든 방문자를 말합니다.
              </li>
              <li>
                <strong className="text-white">&quot;오디션 지원자&quot;</strong>란 사이트를 통하여 신인배우 오디션 등에 지원하는 사람을 말합니다.
              </li>
              <li>
                <strong className="text-white">&quot;문의자&quot;</strong>란 사이트의 문의 기능을 이용하여 회사에 캐스팅, 매니지먼트, 오디션 및 기타 업무 관련 문의를 제출하는 사람을 말합니다.
              </li>
            </ol>
          </section>

          {/* 제3조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제3조</span>
              <span>(회사의 기본정보)</span>
            </h2>
            <p>회사는 다음과 같이 대중문화예술기획업을 영위하고 있습니다.</p>
            <div className="bg-[#161A26] border border-white/5 p-4 rounded text-xs space-y-1.5 font-mono text-gray-300">
              <div>• 상호: ㈜TK Company (티케이컴퍼니)</div>
              <div>• 사업자등록번호: {companyInfo.businessNumber || '291-88-03353'}</div>
              <div>• 대중문화예술기획업 등록: {companyInfo.entertainmentRegistration || '제2025-서울강남-0418호(등록대기중)'}</div>
              <div>• 홈페이지: https://www.tkm.kr/</div>
            </div>
            <p className="text-[11px] text-gray-400">
              ※ 대중문화예술기획업 등록번호와 사업자등록번호는 실제 발급받은 정보를 정확하게 기재합니다.
            </p>
          </section>

          {/* 제4조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제4조</span>
              <span>(약관의 효력 및 변경)</span>
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>이 약관은 사이트에 게시함으로써 효력이 발생합니다.</li>
              <li>회사는 관련 법령을 위반하지 않는 범위에서 필요한 경우 약관을 변경할 수 있습니다.</li>
              <li>변경된 약관은 사이트에 게시하거나 기타 합리적인 방법으로 이용자에게 안내합니다.</li>
              <li>이용자는 변경된 약관에 동의하지 않을 경우 사이트 이용을 중단할 수 있습니다.</li>
            </ol>
          </section>

          {/* 제5조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제5조</span>
              <span>(사이트의 제공 서비스)</span>
            </h2>
            <p>회사는 사이트를 통하여 다음과 같은 정보를 제공할 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
              <li>회사 및 매니지먼트 사업에 관한 정보</li>
              <li>소속 배우 및 아티스트에 관한 정보</li>
              <li>신인배우 오디션 및 모집에 관한 정보</li>
              <li>배우 캐스팅 및 매니지먼트 관련 문의</li>
              <li>회사의 뉴스 및 활동에 관한 정보</li>
              <li>기타 회사가 필요하다고 판단하는 정보</li>
            </ul>
          </section>

          {/* 제6조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제6조</span>
              <span>(오디션 및 문의 서비스)</span>
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>사이트에서 제공하는 오디션 및 문의 기능은 회사와 이용자 간의 상담 및 정보 전달을 위한 목적으로 운영됩니다.</li>
              <li>오디션 지원 또는 문의를 제출했다고 하여 회사와 이용자 사이에 전속계약, 매니지먼트계약 또는 기타 계약이 자동으로 체결되는 것은 아닙니다.</li>
              <li>오디션의 심사 및 선발 여부는 회사의 내부 기준과 절차에 따라 결정됩니다.</li>
              <li>회사는 제출된 자료의 확인 및 필요한 경우 추가 자료를 요청할 수 있습니다.</li>
              <li>허위 또는 타인의 정보를 이용하여 지원하거나 문의하는 경우 해당 신청은 취소될 수 있습니다.</li>
            </ol>
          </section>

          {/* 제7조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제7조</span>
              <span>(이용자의 의무)</span>
            </h2>
            <p>이용자는 사이트를 이용함에 있어 다음 행위를 하여서는 안 됩니다.</p>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>타인의 개인정보 또는 권리를 침해하는 행위</li>
              <li>허위 또는 부정확한 정보를 제출하는 행위</li>
              <li>회사 또는 제3자의 명예를 훼손하는 행위</li>
              <li>사이트의 정상적인 운영을 방해하는 행위</li>
              <li>회사의 사전 동의 없이 사이트의 콘텐츠를 무단 복제, 배포 또는 상업적으로 이용하는 행위</li>
              <li>자동화된 수단 등을 이용하여 사이트의 정보를 과도하게 수집하는 행위</li>
              <li>기타 관련 법령 및 사회질서에 반하는 행위</li>
            </ol>
          </section>

          {/* 제8조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제8조</span>
              <span>(게시물 및 제출자료)</span>
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>이용자가 사이트를 통하여 제출하는 프로필, 사진, 영상, 경력사항 및 기타 자료는 오디션 심사 또는 문의 처리를 위한 목적으로 이용될 수 있습니다.</li>
              <li>이용자는 제출하는 자료가 본인의 것이거나 적법하게 이용할 권한이 있는 자료임을 확인하여야 합니다.</li>
              <li>타인의 저작권, 초상권, 개인정보 및 기타 권리를 침해하는 자료를 제출하여 발생하는 책임은 해당 이용자에게 있습니다.</li>
              <li>회사는 오디션 및 문의 처리에 필요한 범위를 벗어나 제출자료를 임의로 공개하거나 이용하지 않습니다.</li>
            </ol>
          </section>

          {/* 제9조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제9조</span>
              <span>(저작권 및 콘텐츠의 이용)</span>
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>사이트에 게시된 회사의 로고, 이미지, 텍스트, 디자인, 영상, 게시물 및 기타 콘텐츠에 대한 저작권 및 기타 지식재산권은 회사 또는 정당한 권리자에게 있습니다.</li>
              <li>이용자는 회사의 사전 동의 없이 사이트의 콘텐츠를 복제, 전송, 배포, 수정, 판매 또는 상업적으로 이용할 수 없습니다.</li>
              <li>법령에 따라 허용되는 범위의 이용은 예외로 합니다.</li>
            </ol>
          </section>

          {/* 제10조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제10조</span>
              <span>(서비스의 변경 및 중단)</span>
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>회사는 운영상 또는 기술상의 필요에 따라 사이트의 일부 또는 전부를 변경하거나 일시적으로 중단할 수 있습니다.</li>
              <li>천재지변, 서버 장애, 통신 장애 및 기타 회사가 합리적으로 통제하기 어려운 사유로 발생한 서비스 중단에 대해서는 회사가 법령상 책임을 부담하는 경우를 제외하고 책임을 지지 않습니다.</li>
            </ol>
          </section>

          {/* 제11조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제11조</span>
              <span>(개인정보 보호)</span>
            </h2>
            <p>
              회사는 이용자의 개인정보를 중요하게 보호하며, 개인정보의 처리에 관한 사항은 별도로 공개하는 「개인정보처리방침」에 따릅니다.
            </p>
          </section>

          {/* 제12조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제12조</span>
              <span>(면책)</span>
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>회사는 사이트에서 제공하는 정보의 정확성 및 최신성을 유지하기 위하여 노력합니다.</li>
              <li>다만 회사의 고의 또는 중대한 과실이 없는 경우 사이트에 게시된 정보의 이용으로 발생한 손해에 대하여 법령이 허용하는 범위에서 책임을 부담하지 않습니다.</li>
              <li>오디션 및 캐스팅 관련 결과는 회사의 내부 심사 및 업무 상황 등에 따라 결정되며, 사이트 이용만으로 특정 결과가 보장되는 것은 아닙니다.</li>
            </ol>
          </section>

          {/* 제13조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제13조</span>
              <span>(분쟁의 해결)</span>
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-300">
              <li>회사와 이용자 사이에 분쟁이 발생한 경우 상호 협의를 통하여 해결하도록 노력합니다.</li>
              <li>협의로 해결되지 않는 분쟁에 대해서는 관련 법령에 따른 절차에 따릅니다.</li>
            </ol>
          </section>

          {/* 제14조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제14조</span>
              <span>(준거법)</span>
            </h2>
            <p>
              이 약관의 해석 및 회사와 이용자 사이의 분쟁에 대해서는 대한민국 법령을 적용합니다.
            </p>
          </section>

          {/* 부칙 */}
          <section className="border-t border-white/10 pt-6 space-y-2">
            <h2 className="text-sm font-bold text-white">부칙</h2>
            <p className="text-gray-400 font-mono text-xs">
              이 약관은 2026년 9월 30일부터 시행합니다.
            </p>
          </section>
        </div>

        {/* Bottom Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black hover:bg-slate-200 text-xs font-bold tracking-widest uppercase transition-all shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>메인으로 이동</span>
          </button>
        </div>
      </div>
    </article>
  );
};
