import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Building, User } from 'lucide-react';
import { submitInquiry } from '../lib/db';
import { Artist } from '../types';

interface ContactSectionProps {
  artists: Artist[];
  preselectedActor: Artist | null;
  onClearPreselectedActor: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  artists,
  preselectedActor,
  onClearPreselectedActor
}) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    category: 'Casting' as 'Casting' | 'Business' | 'Media' | 'General',
    targetActorId: '',
    targetActorName: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update target actor when preselectedActor changes
  useEffect(() => {
    if (preselectedActor) {
      setFormData(prev => ({
        ...prev,
        category: 'Casting',
        targetActorId: preselectedActor.id,
        targetActorName: `${preselectedActor.nameKo} (${preselectedActor.nameEn})`,
        subject: `[캐스팅 제안] ${preselectedActor.nameKo} 배우 작품/광고 출연 문의`
      }));
    }
  }, [preselectedActor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'targetActorId') {
      const selected = artists.find(a => a.id === value);
      setFormData(prev => ({
        ...prev,
        targetActorId: value,
        targetActorName: selected ? `${selected.nameKo} (${selected.nameEn})` : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('성함, 이메일, 문의 내용을 반드시 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await submitInquiry({
        name: formData.name.trim(),
        company: formData.company.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        category: formData.category,
        targetActorId: formData.targetActorId,
        targetActorName: formData.targetActorName,
        subject: formData.subject.trim() || `${formData.name}님의 ${formData.category} 문의`,
        message: formData.message.trim()
      });

      setIsSuccess(true);
      setIsSubmitting(false);
    } catch (err) {
      console.error(err);
      setErrorMsg('문의 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    onClearPreselectedActor();
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      category: 'Casting',
      targetActorId: '',
      targetActorName: '',
      subject: '',
      message: ''
    });
  };

  return (
    <section id="contact" className="relative py-28 bg-[#0B0C10] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-16 border-b border-white/10 pb-8">
          <span className="text-xs font-mono tracking-widest text-sky-400 uppercase block mb-3">
            BUSINESS &amp; CASTING INQUIRY
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black text-white tracking-tighter">
            CONTACT.
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            TK MANAGEMENT • ㈜TK Company
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Info & Address */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <h3 className="text-xl font-bold font-display text-white mb-2">
                TK MANAGEMENT
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                배우 캐스팅, 광고/화보 제안, 비즈니스 협업 및 제휴 문의를 상시 접수하고 있습니다.
                보내주신 제안서는 담당 매니지먼트 팀에서 신속히 검토 후 연락드립니다.
              </p>
            </div>

            <div className="space-y-6 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded bg-[#131620] border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">
                    E-MAIL / 캐스팅 및 일반 문의
                  </span>
                  <a
                    href="mailto:hello@tkmanagement.co.kr"
                    className="text-sm font-bold text-white hover:text-sky-300 transition-colors font-mono"
                  >
                    hello@tkmanagement.co.kr
                  </a>
                  <span className="block text-gray-400 text-[11px] mt-0.5">
                    casting@tkcompany.kr
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded bg-[#131620] border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">
                    TEL / 대표 전화
                  </span>
                  <span className="text-sm font-bold text-white font-mono">
                    02-540-8820
                  </span>
                  <span className="block text-gray-400 text-[11px] mt-0.5">
                    FAX : 02-540-8821 (평일 10:00 - 18:00)
                  </span>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded bg-[#131620] border border-white/10 flex items-center justify-center text-sky-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">
                    HEADQUARTERS / 본사 위치
                  </span>
                  <span className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed block">
                    서울특별시 강남구 논현로 642 TK빌딩 4층 (주)TK Company
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono block mt-1">
                    4F TK Bldg, 642 Nonhyeon-ro, Gangnam-gu, Seoul, Korea
                  </span>
                </div>
              </div>
            </div>

            {/* Corporate Summary Box */}
            <div className="p-5 bg-[#121622] border border-[#182A47] text-[11px] text-gray-400 space-y-1 font-mono">
              <div className="text-white font-bold mb-1">㈜TK Company</div>
              <div>사업자등록번호: 211-88-92410</div>
              <div>대중문화예술기획업 등록: 제2025-서울강남-0418호</div>
              <div>대표이사: 강태경</div>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[#111319] border border-white/15 p-6 sm:p-8">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-sky-500/20 border border-sky-400 flex items-center justify-center text-sky-300 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white">
                  문의가 성공적으로 전달되었습니다
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                  보내주신 소중한 제안은 담당 매니지먼트 팀에서 면밀히 검토 후 기재해주신 이메일 및 연락처로 회신드리겠습니다.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-6 bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-slate-200"
                >
                  추가 문의 작성하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="text-sm font-bold text-white font-mono tracking-wider uppercase">
                    INQUIRY FORM
                  </h4>
                  {preselectedActor && (
                    <span className="text-xs text-sky-400 font-mono bg-sky-950 px-2 py-0.5 border border-sky-800">
                      배우: {preselectedActor.nameKo}
                    </span>
                  )}
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      성함 (NAME) *
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
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      소속 / 회사명 (COMPANY)
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="제작사, 방송사, 에이전시 등"
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      이메일 (E-MAIL) *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="contact@company.com"
                      required
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      연락처 (PHONE)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="010-0000-0000"
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      문의 분류 (CATEGORY) *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Casting">배우 캐스팅 제안</option>
                      <option value="Business">광고 / 화보 / 협찬 제안</option>
                      <option value="Media">언론 / 인터뷰 취재</option>
                      <option value="General">기타 비즈니스 문의</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      대상 배우 선택 (TARGET ACTOR)
                    </label>
                    <select
                      name="targetActorId"
                      value={formData.targetActorId}
                      onChange={handleChange}
                      className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="">-- 특정 배우 선택 (선택사항) --</option>
                      {artists.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.nameKo} ({a.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    제목 (SUBJECT)
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="문의 제목을 입력해주세요."
                    className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    문의 내용 (INQUIRY / MESSAGE) *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="작품 개요, 배역 설명, 촬영 일정, 예산 또는 협력 제안 내용을 상세히 적어주시면 빠른 회신에 도움이 됩니다."
                    required
                    className="w-full bg-[#161922] border border-white/10 focus:border-sky-400 p-3.5 text-xs text-white placeholder-gray-600 focus:outline-none resize-none"
                  />
                </div>

                <button
                  id="btn-submit-contact"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-white hover:bg-slate-200 text-black py-3.5 font-bold text-xs tracking-widest uppercase transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? '전송중...' : 'SEND MESSAGE (문의 보내기)'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
