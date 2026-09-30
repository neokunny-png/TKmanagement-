import React from 'react';
import { ArrowLeft, Shield, Lock } from 'lucide-react';
import { CompanyInfo } from '../types';
import { DEFAULT_COMPANY_INFO } from '../services/companyService';

interface PrivacyViewProps {
  companyInfo?: CompanyInfo;
  onNavigateHome: () => void;
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({
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
            <span className="text-white">개인정보처리방침</span>
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
            <Lock className="w-4 h-4" />
            <span>PRIVACY POLICY</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight leading-tight mb-4">
            TK MANAGEMENT 개인정보처리방침
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono">
            시행일자: 2026년 9월 30일
          </p>
        </header>

        {/* Privacy Policy Content Body */}
        <div className="bg-[#111319] border border-white/10 p-6 sm:p-10 rounded-lg space-y-10 text-xs sm:text-sm leading-relaxed text-gray-300 shadow-2xl">
          {/* Introduction */}
          <div className="p-4 bg-[#161A26] border-l-2 border-sky-400 text-xs text-gray-300 space-y-2 leading-relaxed">
            <p>
              TK MANAGEMENT(이하 &quot;회사&quot;)는 이용자의 개인정보를 중요하게 보호하며, 「개인정보 보호법」 등 관련 법령을 준수하고 있습니다.
            </p>
            <p>
              회사는 본 개인정보처리방침을 통하여 이용자의 개인정보가 어떠한 목적과 방식으로 처리되는지, 개인정보 보호를 위해 어떠한 조치를 취하고 있는지 안내합니다.
            </p>
          </div>

          {/* 제1조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제1조</span>
              <span>(개인정보의 처리 목적)</span>
            </h2>
            <p>회사는 다음의 목적을 위하여 개인정보를 처리합니다.</p>
            <div className="space-y-3 pl-2">
              <div>
                <strong className="text-white block mb-1">1. 신인배우 오디션 지원</strong>
                <p className="text-gray-300">
                  오디션 지원자의 지원 접수, 지원자 확인, 오디션 심사, 연락 및 결과 안내 등을 위하여 개인정보를 처리합니다.
                </p>
              </div>
              <div>
                <strong className="text-white block mb-1">2. 캐스팅 및 매니지먼트 관련 문의</strong>
                <p className="text-gray-300">
                  배우 캐스팅, 매니지먼트, 협업 및 기타 업무 관련 문의에 대한 확인 및 답변을 위하여 개인정보를 처리합니다.
                </p>
              </div>
              <div>
                <strong className="text-white block mb-1">3. 홈페이지 이용 및 운영</strong>
                <p className="text-gray-300">
                  사이트의 안정적인 운영, 문의 대응, 서비스 개선 및 보안 유지 등을 위하여 필요한 정보를 처리할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제2조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제2조</span>
              <span>(처리하는 개인정보의 항목)</span>
            </h2>
            <p>회사는 서비스의 이용 과정에서 다음과 같은 개인정보를 수집·처리할 수 있습니다.</p>
            <div className="space-y-4 pl-2">
              <div className="bg-[#161A26] border border-white/5 p-4 rounded space-y-2">
                <strong className="text-sky-300 block font-mono text-xs">1. 오디션 지원 시 (수집 항목)</strong>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-300">
                  <li>이름, 생년월일, 성별</li>
                  <li>연락처(휴대전화번호), 이메일 주소</li>
                  <li>신장, 체중 등 신체 관련 정보</li>
                  <li>SNS 계정(인스타그램), 포트폴리오 영상 링크(유튜브 등)</li>
                  <li>특기 및 취미 사항</li>
                  <li>자기소개 및 배우로서의 포부</li>
                  <li>프로필 사진(얼굴/상반신 URL 또는 제출 링크)</li>
                  <li>연기 영상 또는 쇼릴 링크(선택 제출 시)</li>
                </ul>
              </div>

              <div className="bg-[#161A26] border border-white/5 p-4 rounded space-y-2">
                <strong className="text-sky-300 block font-mono text-xs">2. 문의 시 (수집 항목)</strong>
                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-300">
                  <li>이름 또는 담당자명</li>
                  <li>연락처(전화번호)</li>
                  <li>이메일 주소</li>
                  <li>문의 구분(캐스팅 제안, 업무 제휴, 언론/미디어, 일반 문의 등)</li>
                  <li>소속 또는 회사명</li>
                  <li>문의 제목 및 상세 내용</li>
                  <li>관련 소속 배우 선택 정보</li>
                </ul>
              </div>

              <div className="bg-[#161A26] border border-white/5 p-4 rounded space-y-2">
                <strong className="text-sky-300 block font-mono text-xs">3. 자동으로 생성·수집될 수 있는 정보</strong>
                <p className="text-xs text-gray-300">
                  사이트 이용 과정에서 서비스 이용 기록, 접속 일시, 브라우저 및 기기 환경 정보 등이 시스템 보안 및 서비스 품질 유지를 위해 자동으로 생성·수집될 수 있습니다. 단, 회사는 실제 운영에 필요한 최소한의 범위 내에서만 개인정보를 처리합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제3조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제3조</span>
              <span>(개인정보의 처리 및 보유기간)</span>
            </h2>
            <p>
              회사는 개인정보를 수집한 목적이 달성되거나 개인정보가 더 이상 필요하지 않게 된 경우 지체 없이 해당 개인정보를 파기합니다.
            </p>
            <p>다만 다음의 경우에는 관련 법령에 따라 일정 기간 보관할 수 있습니다.</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-gray-300">
              <li>관계 법령에 따라 보존할 필요가 있는 경우</li>
              <li>이용자와의 분쟁 해결을 위하여 필요한 경우</li>
              <li>기타 법령에서 정한 보존기간이 있는 경우</li>
            </ol>
            <p className="text-xs text-gray-400">
              오디션 및 문의 과정에서 제출된 개인정보는 해당 목적에 필요한 범위에서 보관하며, 보유기간이 종료되거나 처리 목적이 달성된 경우 지체 없이 파기합니다.
            </p>
          </section>

          {/* 제4조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제4조</span>
              <span>(개인정보의 제3자 제공)</span>
            </h2>
            <p>회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.</p>
            <p>다만 다음의 경우에는 예외로 합니다.</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-gray-300">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 특별한 규정이 있는 경우</li>
              <li>수사기관 또는 관계 행정기관이 법령에 따른 절차에 따라 요청하는 경우</li>
            </ol>
          </section>

          {/* 제5조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제5조</span>
              <span>(개인정보 처리의 위탁)</span>
            </h2>
            <p>
              회사는 안정적인 서비스 제공 및 시스템 운영을 위하여 다음과 같이 개인정보 처리 업무를 위탁하고 있으며, 관련 법령에 따라 위탁 계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
            </p>
            <div className="bg-[#161A26] border border-white/5 p-4 rounded text-xs space-y-3 font-mono">
              <div>
                <span className="text-white font-bold block">• 클라우드 데이터베이스 인프라 위탁</span>
                <span className="text-gray-300">- 수탁자: Google LLC (Google Cloud / Firebase)</span><br />
                <span className="text-gray-400">- 위탁 업무 내용: 오디션 접수 및 문의 데이터의 안전한 클라우드 저장 및 서버 시스템 운영</span>
              </div>
              <div className="border-t border-white/5 pt-2">
                <span className="text-white font-bold block">• 웹사이트 호스팅 인프라 위탁</span>
                <span className="text-gray-300">- 수탁자: Netlify, Inc.</span><br />
                <span className="text-gray-400">- 위탁 업무 내용: 웹사이트 호스팅 및 글로벌 콘텐츠 전송 네트워크(CDN) 인프라 제공</span>
              </div>
            </div>
          </section>

          {/* 제6조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제6조</span>
              <span>(개인정보의 파기절차 및 방법)</span>
            </h2>
            <p>
              회사는 개인정보의 보유기간이 지나거나 처리 목적이 달성된 개인정보를 지체 없이 파기합니다.
            </p>
            <div className="space-y-2 pl-2">
              <div>
                <strong className="text-white block mb-0.5">1. 파기절차</strong>
                <p className="text-gray-300">
                  개인정보의 처리 목적이 달성되거나 보유기간이 종료된 개인정보를 확인한 후 파기합니다.
                </p>
              </div>
              <div>
                <strong className="text-white block mb-0.5">2. 파기방법</strong>
                <p className="text-gray-300">
                  전자적 파일 형태의 개인정보는 복구 또는 재생할 수 없도록 안전하게 삭제합니다. 종이에 출력된 개인정보가 있는 경우에는 분쇄하거나 소각하는 방법으로 파기합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 제7조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제7조</span>
              <span>(정보주체의 권리 및 행사방법)</span>
            </h2>
            <p>이용자는 회사에 대하여 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-gray-300">
              <li>개인정보 열람 요구</li>
              <li>개인정보 정정 요구</li>
              <li>개인정보 삭제 요구</li>
              <li>개인정보 처리정지 요구</li>
              <li>기타 개인정보 보호 관련 권리의 행사</li>
            </ol>
            <p className="text-xs text-gray-400">
              개인정보에 관한 요청은 제10조에 기재된 개인정보 보호 담당부서를 통하여 접수할 수 있으며, 회사는 관계 법령에서 정한 절차에 따라 신속하게 처리합니다.
            </p>
          </section>

          {/* 제8조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제8조</span>
              <span>(개인정보의 안전성 확보조치)</span>
            </h2>
            <p>회사는 개인정보의 안전성을 확보하기 위하여 다음과 같은 조치를 취하고 있습니다.</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-gray-300">
              <li>개인정보에 대한 접근 권한 관리 및 인가자 통제</li>
              <li>개인정보 취급 인원의 최소화</li>
              <li>개인정보의 안전한 암호화 전송(HTTPS/SSL) 기술 적용</li>
              <li>개인정보 및 관련 시스템에 대한 관리적·기술적 보호조치</li>
              <li>개인정보의 불필요한 보관을 방지하기 위한 지속적인 관리</li>
            </ol>
          </section>

          {/* 제9조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제9조</span>
              <span>(개인정보 자동 수집 장치의 설치·운영)</span>
            </h2>
            <p>
              회사는 사이트 운영을 위하여 쿠키 또는 이와 유사한 기술을 사용할 수 있습니다. 쿠키는 웹사이트 이용자의 브라우저에 저장되는 작은 데이터 파일입니다.
            </p>
            <p>
              이용자는 웹브라우저의 설정을 통하여 쿠키의 저장을 거부하거나 삭제할 수 있습니다. 다만 쿠키 사용을 제한할 경우 사이트의 일부 기능 이용에 불편이 발생할 수 있습니다.
            </p>
            <p className="text-xs text-gray-400">
              ※ 회사는 상업적 타깃 광고나 무단 행동 추적 목적의 외부 분석 도구를 사용하지 않습니다.
            </p>
          </section>

          {/* 제10조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제10조</span>
              <span>(개인정보 보호 관련 문의)</span>
            </h2>
            <p>
              회사는 개인정보 보호와 관련한 이용자의 문의 및 고충 처리를 위하여 다음과 같이 담당부서를 운영합니다.
            </p>
            <div className="bg-[#161A26] border border-white/5 p-4 rounded text-xs space-y-1.5 font-mono text-gray-300">
              <div>• 개인정보 보호 담당부서: TK MANAGEMENT 개인정보 보호 담당</div>
              <div>• 전화번호: {companyInfo.tel || '02-540-8820'}</div>
              <div>• 이메일: {companyInfo.email || 'taz0206@naver.com'}</div>
            </div>
            <p className="text-xs text-gray-400">
              개인정보의 열람·정정·삭제·처리정지 및 기타 개인정보 보호와 관련된 문의사항은 위 담당부서로 연락해 주시기 바랍니다.
            </p>
          </section>

          {/* 제11조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제11조</span>
              <span>(개인정보 보호책임자)</span>
            </h2>
            <p>
              회사는 개인정보 보호와 관련한 업무를 수행하고 개인정보와 관련한 이용자의 고충을 처리하기 위한 책임체계를 운영합니다.
            </p>
            <div className="bg-[#161A26] border border-white/5 p-4 rounded text-xs space-y-1.5 font-mono text-gray-300">
              <div>• 개인정보 보호책임자: 개인정보보호 담당 부서</div>
              <div>• 문의처: {companyInfo.tel || '02-540-8820'} | {companyInfo.email || 'taz0206@naver.com'}</div>
            </div>
            <p className="text-xs text-gray-300">
              개인정보 보호 관련 문의는 제10조에 기재된 개인정보 보호 담당부서를 통하여 접수 및 안내받으실 수 있습니다.
            </p>
          </section>

          {/* 제12조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제12조</span>
              <span>(권익침해 구제방법)</span>
            </h2>
            <p>
              이용자는 개인정보 침해에 대한 신고 또는 상담이 필요한 경우 개인정보 관련 전문기관 및 관계 행정기관(개인정보분쟁조정위원회, 한국인터넷진흥원 개인정보침해신고센터, 대검찰청, 경찰청 등)을 이용할 수 있습니다. 최신 기관명 및 연락처는 해당 기관의 공식 홈페이지를 통하여 확인하실 수 있습니다.
            </p>
          </section>

          {/* 제13조 */}
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
              <span className="text-sky-400 font-mono">제13조</span>
              <span>(개인정보처리방침의 변경)</span>
            </h2>
            <p>
              회사는 법령, 서비스의 변경 또는 개인정보 처리 방식의 변경에 따라 개인정보처리방침을 변경할 수 있습니다. 변경된 개인정보처리방침은 사이트에 게시하여 이용자가 상시 확인할 수 있도록 합니다.
            </p>
          </section>

          {/* 부칙 */}
          <section className="border-t border-white/10 pt-6 space-y-2">
            <h2 className="text-sm font-bold text-white">부칙</h2>
            <p className="text-gray-400 font-mono text-xs">
              이 개인정보처리방침은 2026년 9월 30일부터 시행합니다.
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
