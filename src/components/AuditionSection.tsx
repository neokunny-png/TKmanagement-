import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Upload, Film, FileCheck, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuditionApplication } from '../types';
import { submitAuditionApplication } from '../services/inquiryService';

interface AuditionSectionProps {
  id?: string;
  isMobileView?: boolean;
  onNavigate?: (sectionId: string) => void;
}

export const AuditionSection: React.FC<AuditionSectionProps> = ({
  id = 'audition',
  isMobileView = false,
  onNavigate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    birth: '',
    gender: 'Female' as 'Female' | 'Male',
    phone: '',
    email: '',
    height: '',
    weight: '',
    instagram: '',
    youtube: '',
    specialty: '',
    bio: '',
    experience: '',
    photoUrlFace: '',
    photoUrlFull: '',
    videoUrl: '',
    agreeTerms: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<AuditionApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('이름을 입력해주세요.');
      return;
    }
    if (!formData.birth.trim()) {
      setErrorMsg('생년월일(예: 2003.05.12)을 입력해주세요.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMsg('연락처를 입력해주세요.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('이메일 주소를 입력해주세요.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMsg('개인정보 수집 및 이용에 동의해야 지원이 가능합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const savedInquiry = await submitAuditionApplication({
        name: formData.name.trim(),
        birth: formData.birth.trim(),
        gender: formData.gender,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        height: formData.height ? `${formData.height}cm` : '',
        weight: formData.weight ? `${formData.weight}kg` : '',
        instagram: formData.instagram.trim(),
        youtube: formData.youtube.trim(),
        specialty: formData.specialty.trim(),
        bio: formData.bio.trim(),
        experience: formData.experience.trim(),
        photoUrlFace: formData.photoUrlFace.trim() || '',
        photoUrlFull: formData.photoUrlFull.trim(),
        videoUrl: formData.videoUrl.trim(),
      });

      const app: AuditionApplication = {
        id: savedInquiry.id,
        applicationNumber: savedInquiry.applicationNumber || `TK-${new Date().getFullYear()}-0000`,
        name: savedInquiry.name,
        birth: savedInquiry.birth || '',
        gender: savedInquiry.gender || 'Female',
        phone: savedInquiry.phone,
        email: savedInquiry.email,
        height: savedInquiry.height || '',
        weight: savedInquiry.weight || '',
        instagram: savedInquiry.instagram,
        youtube: savedInquiry.youtube,
        specialty: savedInquiry.specialty || '',
        bio: savedInquiry.bio || '',
        experience: savedInquiry.experience,
        photoUrlFace: savedInquiry.photoUrlFace,
        photoUrlFull: savedInquiry.photoUrlFull,
        videoUrl: savedInquiry.videoUrl,
        status: 'pending',
        submittedAt: savedInquiry.createdAt
      };

      setSubmittedResult(app);
      setIsSubmitting(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err: any) {
      console.error('[TK Audition] Application submit error:', err);
      setErrorMsg(err?.message || '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedResult(null);
    setFormData({
      name: '',
      birth: '',
      gender: 'Female',
      phone: '',
      email: '',
      height: '',
      weight: '',
      instagram: '',
      youtube: '',
      specialty: '',
      bio: '',
      experience: '',
      photoUrlFace: '',
      photoUrlFull: '',
      videoUrl: '',
      agreeTerms: false
    });
  };

  return (
    <section id={id} className={`relative ${isMobileView ? 'py-14 sm:py-20' : 'py-28'} bg-[#0E1017] border-t border-white/10`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-3">
              AUDITION RECRUITMENT
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black text-white tracking-tighter leading-tight mb-4">
              TK매니지먼트 신인배우 오디션
            </h1>
            <p className="text-xl sm:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-sky-300 mb-4">
              FIND YOUR NEXT SCENE.
            </p>
            <p className="text-base sm:text-lg text-gray-200 font-medium leading-relaxed mb-6">
              TK MANAGEMENT와 함께 배우로서의 첫 장면을 시작하세요. 배우 전문 매니지먼트 TK매니지먼트는 무한한 잠재력과 독창적인 개성을 지닌 신인배우를 상시 모집하고 있습니다.
            </p>

            {/* TK Audition Identity Manifesto */}
            <div className="p-6 bg-[#131620] border-l-2 border-sky-400 space-y-3">
              <p className="text-sm font-semibold text-white">
                당신에게도 첫 번째 장면이 있습니다.
              </p>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                TK MANAGEMENT는 아직 발견되지 않은 배우의 가능성을 찾습니다.
                경력보다 가능성을, 유명함보다 매력을, 완성된 모습보다 함께 성장할 가능성을 봅니다.
                체계적인 인큐베이팅과 매니지먼트 지원을 통해 차세대 주역으로 발돋움할 배우들의 도전을 기다립니다.
              </p>
              <p className="text-xs font-mono tracking-widest text-sky-400 pt-2 uppercase">
                YOUR SCENE STARTS HERE.
              </p>
            </div>
          </div>

          {/* Criteria & Audition Guide Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                01. RECRUITMENT FIELD
              </span>
              <h3 className="text-base font-bold text-white mb-2">모집 분야</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                영화, 드라마, OTT 오리지널 시리즈, 연극, 광고 등 연기 활동 전반. 전문 배우 매니지먼트로서 스크린과 브라운관 전 분야에 걸친 캐스팅과 작품 활동을 지원합니다.
              </p>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                02. QUALIFICATIONS
              </span>
              <h3 className="text-base font-bold text-white mb-2">지원 대상</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">
                연기에 대한 진정성과 열정, 고유한 개성을 지닌 신인배우 및 배우 지망생
              </p>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 성별 및 연령 제한 없음</li>
                <li>• 경력 무관 (신인·지망생 및 기성 배우 모두 가능)</li>
                <li>• 국내외 연기 활동 결격사유 없는 자</li>
              </ul>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                03. APPLICATION
              </span>
              <h3 className="text-base font-bold text-white mb-2">지원 방법</h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                하단의 온라인 오디션 지원서 양식을 통해 상시 접수합니다. 별도의 접수 마감 기한 없이 24시간 언제나 온라인으로 간편하게 신인배우 오디션에 지원하실 수 있습니다.
              </p>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                04. REQUIRED MATERIALS
              </span>
              <h3 className="text-base font-bold text-white mb-2">제출 자료</h3>
              <ul className="text-xs text-gray-300 space-y-1 leading-relaxed">
                <li>• 기본 인적사항 및 연락처 (필수)</li>
                <li>• 프로필 사진 (얼굴 클로즈업 또는 상반신 / 필수)</li>
                <li>• 자기소개 및 배우로서의 포부 서술</li>
                <li>• 자유 연기 영상 또는 쇼릴 링크 (선택 제출 우대)</li>
                <li>• SNS 및 포트폴리오 링크 (선택)</li>
              </ul>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                05. PROCESS
              </span>
              <h3 className="text-base font-bold text-white mb-2">오디션 진행 과정</h3>
              <div className="text-xs text-gray-300 space-y-1 leading-relaxed">
                <p>
                  <strong className="text-white">1단계:</strong> 온라인 서류 및 포트폴리오 심사
                </p>
                <p>
                  <strong className="text-white">2단계:</strong> 실물 카메라 오디션 &amp; 심층 심사
                </p>
                <p>
                  <strong className="text-white">3단계:</strong> 최종 미팅 및 전속 매니지먼트 계약 체결
                </p>
              </div>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                06. EVALUATION &amp; INQUIRY
              </span>
              <h3 className="text-base font-bold text-white mb-2">심사 및 결과 안내 · 문의</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-2">
                접수된 지원서는 전문 캐스팅 팀이 상시 검토하며, 1차 서류 심사 합격자에 한하여 기재된 연락처로 개별 안내드립니다.
              </p>
              <p className="text-xs text-gray-400 leading-relaxed">
                오디션 접수 및 배우 캐스팅 문의는 하단 문의 링크 또는 CONTACT 페이지를 이용해 주시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        {/* Application Form Box or Submission Result Modal */}
        <div className="bg-[#11131A] border border-white/15 p-6 sm:p-10 max-w-4xl mx-auto shadow-2xl">
          {submittedResult ? (
            <div className="text-center py-10 space-y-6 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <span className="text-xs font-mono tracking-widest text-sky-400 uppercase">
                  APPLICATION SUBMITTED SUCCESSFULLY
                </span>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mt-1">
                  오디션 지원서가 성공적으로 접수되었습니다
                </h3>
              </div>

              <div className="bg-[#161A26] p-6 border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">접수 번호</span>
                  <span className="text-sky-300 font-bold">{submittedResult.applicationNumber}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">지원자 성명</span>
                  <span className="text-white">{submittedResult.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-400">연락처</span>
                  <span className="text-white">{submittedResult.phone}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-gray-400">접수 상태</span>
                  <span className="text-emerald-400 font-bold">1차 서류 심사 대기중</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 max-w-lg mx-auto leading-relaxed">
                서류 심사 결과는 기재해주신 연락처 및 이메일로 개별 안내드립니다.
                TK MANAGEMENT와 함께 꿈의 첫 장면을 펼쳐주셔서 감사합니다.
              </p>

              <button
                onClick={handleResetForm}
                className="inline-flex items-center space-x-2 bg-white text-black px-6 py-3 text-xs font-bold tracking-wider uppercase hover:bg-slate-200 transition-colors"
              >
                <span>새로운 지원서 작성하기</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-xl font-display font-bold text-white">
                  ONLINE AUDITION APPLICATION (온라인 지원서)
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  * 표시는 필수 입력 항목입니다.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 1. Basic Info */}
              <div className="space-y-4">
                <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block">
                  01. 기본 인적사항
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      이름 (Name) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="홍길동"
                      required
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      생년월일 (Birth Date) *
                    </label>
                    <input
                      type="text"
                      name="birth"
                      value={formData.birth}
                      onChange={handleChange}
                      placeholder="YYYY.MM.DD (예: 2003.04.15)"
                      required
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      성별 (Gender) *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Female">여성 (Female)</option>
                      <option value="Male">남성 (Male)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      연락처 (Phone) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                      required
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      이메일 (Email) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      키 (Height)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="cm 단위 (예: 172)"
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      몸무게 (Weight)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="kg 단위 (예: 52)"
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. SNS & Media */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block">
                  02. SNS 및 포트폴리오 링크
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      인스타그램 계정 (Instagram)
                    </label>
                    <input
                      type="text"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      placeholder="@username 또는 프로필 URL"
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      유튜브 / 영상 링크 (YouTube / Vimeo)
                    </label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      placeholder="https://youtube.com/..."
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    특기 / 취미 (Specialties &amp; Talents)
                  </label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="예: 현대무용, 사투리 연기, 바이올린, 태권도, 외국어 등"
                    className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Introduction & Photos */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block">
                  03. 자기소개 및 사진/영상 첨부
                </span>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">
                    자기소개 및 배우로서의 포부
                  </label>
                  <textarea
                    rows={4}
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="배우를 꿈꾸게 된 계기, 본인이 생각하는 매력과 강점, 목표하는 장면을 자유롭게 서술해주세요."
                    className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 p-3.5 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      프로필 사진 URL (얼굴 클로즈업 또는 상반신)
                    </label>
                    <input
                      type="url"
                      name="photoUrlFace"
                      value={formData.photoUrlFace}
                      onChange={handleChange}
                      placeholder="이미지 링크 또는 드라이브 링크 (생략시 기본 접수)"
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1.5">
                      연기 영상 또는 쇼릴 링크 (선택)
                    </label>
                    <input
                      type="url"
                      name="videoUrl"
                      value={formData.videoUrl}
                      onChange={handleChange}
                      placeholder="자유 연기 영상 링크 (유튜브/드라이브)"
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Privacy Consent */}
              <div className="pt-4 border-t border-white/10">
                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="mt-0.5 accent-sky-500 rounded"
                  />
                  <span className="text-xs text-gray-400 leading-relaxed">
                    [필수] 개인정보 수집 및 이용에 동의합니다. 수집된 정보(이름, 연락처, 사진 등)는
                    TK MANAGEMENT의 신인 배우 오디션 심사 및 결과 안내 목적으로만 안전하게 보관 및 활용됩니다.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  id="btn-submit-audition"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-slate-200 text-black py-4 font-bold text-xs sm:text-sm tracking-widest uppercase transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-[#182A47]" />
                  <span>{isSubmitting ? '접수 처리중...' : 'TK MANAGEMENT 오디션 지원하기'}</span>
                </button>
              </div>

              {/* Internal Link for Audition Inquiries */}
              <div className="pt-4 text-center">
                <p className="text-xs text-gray-400">
                  오디션 접수 및 캐스팅 관련 개별 문의사항이 있으신가요?{' '}
                  <a
                    href="/contact"
                    onClick={(e) => {
                      if (typeof window !== 'undefined') {
                        e.preventDefault();
                        const el = document.getElementById('contact');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                        window.history.pushState(null, '', '/contact');
                      }
                    }}
                    className="text-sky-400 hover:text-sky-300 underline font-medium ml-1 inline-flex items-center"
                  >
                    CONTACT (문의하기) 바로가기 →
                  </a>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Internal Links for SEO & Seamless Navigation */}
        <div className="mt-16 pt-10 border-t border-white/10 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase block mb-1">
              TK MANAGEMENT NAVIGATION
            </span>
            <h3 className="text-lg sm:text-xl font-display font-bold text-white">
              TK매니지먼트 둘러보기
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/artists"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('artists');
                } else if (typeof window !== 'undefined') {
                  e.preventDefault();
                  const el = document.getElementById('artists');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '/artists');
                }
              }}
              className="p-5 bg-[#131620] border border-white/5 hover:border-sky-500/40 transition-all block group text-left"
            >
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                ARTISTS
              </span>
              <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors mb-2 flex items-center justify-between">
                <span>TK매니지먼트 소속 배우</span>
                <span className="text-gray-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-1">→</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                스크린과 브라운관에서 개성 있는 연기를 펼치는 TK매니지먼트 소속 배우들의 프로필과 주요 작품 정보를 확인하세요.
              </p>
            </a>

            <a
              href="/contact"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('contact');
                } else if (typeof window !== 'undefined') {
                  e.preventDefault();
                  const el = document.getElementById('contact');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '/contact');
                }
              }}
              className="p-5 bg-[#131620] border border-white/5 hover:border-sky-500/40 transition-all block group text-left"
            >
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                CONTACT
              </span>
              <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors mb-2 flex items-center justify-between">
                <span>배우 캐스팅 및 매니지먼트 문의</span>
                <span className="text-gray-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-1">→</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                영화·드라마·광고 캐스팅 제안, 매니지먼트 업무 제휴 및 신인배우 오디션 관련 문의 사항을 접수하실 수 있습니다.
              </p>
            </a>

            <a
              href="/news"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('news');
                } else if (typeof window !== 'undefined') {
                  e.preventDefault();
                  const el = document.getElementById('news');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  window.history.pushState(null, '', '/news');
                }
              }}
              className="p-5 bg-[#131620] border border-white/5 hover:border-sky-500/40 transition-all block group text-left"
            >
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                NEWS
              </span>
              <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors mb-2 flex items-center justify-between">
                <span>TK매니지먼트 NEWS</span>
                <span className="text-gray-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-1">→</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                배우들의 최신 캐스팅 소식, 작품 활동, 화보 및 공식 보도자료를 가장 빠르게 전해드립니다.
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
