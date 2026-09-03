import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Upload, Film, FileCheck, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuditionApplication } from '../types';

interface AuditionSectionProps {
  id?: string;
  isMobileView?: boolean;
}

export const AuditionSection: React.FC<AuditionSectionProps> = ({ id = 'audition', isMobileView = false }) => {
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
      const timestamp = Date.now();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const applicationNumber = `TK-${new Date().getFullYear()}-${randomSuffix}`;

      const app: AuditionApplication = {
        id: `audition-${timestamp}`,
        applicationNumber,
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
        status: 'pending',
        submittedAt: timestamp
      };

      setSubmittedResult(app);
      setIsSubmitting(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error(err);
      setErrorMsg('오디션 지원서 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          <div className="lg:col-span-6">
            <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-3">
              AUDITION RECRUITMENT
            </span>
            <h2 className="text-4xl sm:text-6xl font-display font-black text-white tracking-tighter leading-tight mb-6">
              FIND YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-sky-300">
                NEXT SCENE.
              </span>
            </h2>
            <p className="text-base sm:text-lg text-gray-200 font-medium leading-relaxed mb-6">
              TK MANAGEMENT와 함께 배우로서의 첫 장면을 시작하세요.
            </p>

            {/* TK Audition Identity Manifesto */}
            <div className="p-6 bg-[#131620] border-l-2 border-sky-400 space-y-3">
              <p className="text-sm font-semibold text-white">
                당신에게도 첫 번째 장면이 있습니다.
              </p>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                TK MANAGEMENT는 아직 발견되지 않은 배우의 가능성을 찾습니다.
                경력보다 가능성을, 유명함보다 매력을, 완성된 모습보다 성장할 가능성을 봅니다.
              </p>
              <p className="text-xs font-mono tracking-widest text-sky-400 pt-2 uppercase">
                YOUR SCENE STARTS HERE.
              </p>
            </div>
          </div>

          {/* Criteria Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                01. CATEGORY
              </span>
              <h4 className="text-base font-bold text-white mb-2">신인 배우 상시 모집</h4>
              <p className="text-xs text-gray-400">
                드라마, 영화, OTT, 광고 등 전 분야 액팅 탤런트
              </p>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                02. QUALIFICATIONS
              </span>
              <h4 className="text-base font-bold text-white mb-2">지원 자격</h4>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>• 성별 제한 없음</li>
                <li>• 연령 제한 없음</li>
                <li>• 경력 제한 없음 (신인·지망생 환영)</li>
              </ul>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                03. PROCESS
              </span>
              <h4 className="text-base font-bold text-white mb-2">선발 전형</h4>
              <p className="text-xs text-gray-400">
                1차 온라인 서류 심사 → 2차 실물 카메라 오디션 &amp; 심층 면접 → 전속 계약 체결
              </p>
            </div>

            <div className="bg-[#131620] p-6 border border-white/5">
              <span className="text-[10px] font-mono text-sky-400 uppercase block mb-1">
                04. BENEFITS
              </span>
              <h4 className="text-base font-bold text-white mb-2">소속 혜택</h4>
              <p className="text-xs text-gray-400">
                전문 트레이닝, 프로필 화보 촬영, 캐스팅 디렉팅 및 작품 매니지먼트 전폭 지원
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
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
