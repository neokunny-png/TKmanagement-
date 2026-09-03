import React from 'react';
import {
  Mail,
  Send,
  Trash2,
  ArrowUpRight,
  Search,
  CheckCircle2,
  MessageSquare,
  RefreshCw,
  User,
  Phone,
  Calendar,
  Building,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { InquiryItem, UnifiedInquiryStatus } from '../types';
import {
  sendInquiryEmailNotification,
  getInquiryMailtoUrl,
  OFFICIAL_NOTIFICATION_EMAIL
} from '../services/notificationService';

interface AdminInquiriesTabProps {
  unifiedInquiries: InquiryItem[];
  inquiryTypeFilter: 'ALL' | 'AUDITION' | 'CONTACT';
  setInquiryTypeFilter: (val: 'ALL' | 'AUDITION' | 'CONTACT') => void;
  inquiryStatusFilter: 'ALL' | UnifiedInquiryStatus;
  setInquiryStatusFilter: (val: 'ALL' | UnifiedInquiryStatus) => void;
  inquirySearchQuery: string;
  setInquirySearchQuery: (val: string) => void;
  selectedInquiryItem: InquiryItem | null;
  setSelectedInquiryItem: (val: InquiryItem | null) => void;
  inquiryAdminNotes: string;
  setInquiryAdminNotes: (val: string) => void;
  inquiryRating: number;
  setInquiryRating: (val: number) => void;
  isUpdatingInquiry: boolean;
  handleUpdateInquiryStatus: (id: string, status: UnifiedInquiryStatus) => Promise<void>;
  handleSaveInquiryNotes: (id: string) => Promise<void>;
  handleRequestDeleteInquiry: (item: InquiryItem) => void;
  showToast: (msg: string) => void;
}

export const AdminInquiriesTab: React.FC<AdminInquiriesTabProps> = ({
  unifiedInquiries,
  inquiryTypeFilter,
  setInquiryTypeFilter,
  inquiryStatusFilter,
  setInquiryStatusFilter,
  inquirySearchQuery,
  setInquirySearchQuery,
  selectedInquiryItem,
  setSelectedInquiryItem,
  inquiryAdminNotes,
  setInquiryAdminNotes,
  inquiryRating,
  setInquiryRating,
  isUpdatingInquiry,
  handleUpdateInquiryStatus,
  handleSaveInquiryNotes,
  handleRequestDeleteInquiry,
  showToast,
}) => {
  const filteredInquiries = unifiedInquiries.filter((item) => {
    const matchesType = inquiryTypeFilter === 'ALL' || item.type === inquiryTypeFilter;
    const matchesStatus = inquiryStatusFilter === 'ALL' || item.status === inquiryStatusFilter;
    const query = inquirySearchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      item.name.toLowerCase().includes(query) ||
      item.phone.toLowerCase().includes(query) ||
      item.email.toLowerCase().includes(query) ||
      (item.company && item.company.toLowerCase().includes(query)) ||
      (item.subject && item.subject.toLowerCase().includes(query)) ||
      (item.targetActorName && item.targetActorName.toLowerCase().includes(query)) ||
      (item.message && item.message.toLowerCase().includes(query)) ||
      (item.bio && item.bio.toLowerCase().includes(query)) ||
      (item.specialty && item.specialty.toLowerCase().includes(query));

    return matchesType && matchesStatus && matchesSearch;
  });

  const totalCount = unifiedInquiries.length;
  const auditionCount = unifiedInquiries.filter((i) => i.type === 'AUDITION').length;
  const contactCount = unifiedInquiries.filter((i) => i.type === 'CONTACT').length;
  const newCount = unifiedInquiries.filter((i) => i.status === 'NEW').length;

  const formatInquiryDate = (ts: number) => {
    try {
      const d = new Date(ts);
      const pad = (n: number) => String(n).padStart(2, '0');
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return '';
    }
  };

  const getStatusBadge = (status: UnifiedInquiryStatus) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold bg-red-950/80 text-red-400 border border-red-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse mr-1.5" />
            NEW (미확인)
          </span>
        );
      case 'READ':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-sky-950/80 text-sky-400 border border-sky-800">
            READ (열람)
          </span>
        );
      case 'CONTACTED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-indigo-950/80 text-indigo-400 border border-indigo-800">
            CONTACTED (연락완료)
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-800">
            COMPLETED (완료)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-gray-800 text-gray-400 border border-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Information Card */}
      <div className="bg-[#141724] p-5 border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white tracking-wide">
                INQUIRIES & AUDITIONS 접수 관리
              </h3>
              <span className="text-xs font-mono bg-sky-950 text-sky-400 border border-sky-800 px-2 py-0.5">
                총 {totalCount}건
              </span>
              {newCount > 0 && (
                <span className="text-xs font-mono bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 font-bold animate-pulse">
                  NEW {newCount}건 미확인
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-1">
              온라인 오디션 지원서 및 캐스팅/협찬 문의가 실시간으로 수신되며, 접수 즉시{' '}
              <span className="text-sky-300 font-mono font-bold">{OFFICIAL_NOTIFICATION_EMAIL}</span>으로 자동 알림 발송됩니다.
            </p>
          </div>

          {/* Email recipient alert banner */}
          <div className="flex items-center space-x-2 bg-black/40 border border-sky-500/30 px-3.5 py-2.5 text-xs text-gray-300">
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <div>
              <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                Notification Email (자동 알림 수신처)
              </div>
              <div className="font-mono text-sky-300 text-xs font-bold">
                {OFFICIAL_NOTIFICATION_EMAIL}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar: Type + Status + Search */}
        <div className="pt-3 border-t border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Type Filter Buttons */}
            <div className="flex items-center border border-white/10 p-0.5 bg-black/30 text-xs font-mono">
              <button
                type="button"
                onClick={() => setInquiryTypeFilter('ALL')}
                className={`px-3 py-1.5 transition-all ${
                  inquiryTypeFilter === 'ALL'
                    ? 'bg-white text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ALL ({totalCount})
              </button>
              <button
                type="button"
                onClick={() => setInquiryTypeFilter('AUDITION')}
                className={`px-3 py-1.5 transition-all ${
                  inquiryTypeFilter === 'AUDITION'
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                AUDITION ({auditionCount})
              </button>
              <button
                type="button"
                onClick={() => setInquiryTypeFilter('CONTACT')}
                className={`px-3 py-1.5 transition-all ${
                  inquiryTypeFilter === 'CONTACT'
                    ? 'bg-sky-500 text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                CONTACT ({contactCount})
              </button>
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center border border-white/10 p-0.5 bg-black/30 text-xs font-mono">
              {(['ALL', 'NEW', 'READ', 'CONTACTED', 'COMPLETED'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setInquiryStatusFilter(st)}
                  className={`px-2.5 py-1.5 transition-all text-xs ${
                    inquiryStatusFilter === st
                      ? 'bg-sky-400 text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? '전체상태' : st}
                  {st === 'NEW' && newCount > 0 && (
                    <span className="ml-1 text-[10px] text-red-300 font-bold">({newCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full lg:w-72">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="이름, 연락처, 이메일, 회사명 검색..."
              value={inquirySearchQuery}
              onChange={(e) => setInquirySearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400 font-mono"
            />
            {inquirySearchQuery && (
              <button
                type="button"
                onClick={() => setInquirySearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Master-Detail Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inquiries List */}
        <div className="lg:col-span-6 space-y-3 max-h-[650px] overflow-y-auto pr-1">
          {filteredInquiries.length === 0 ? (
            <div className="bg-[#141724] border border-white/10 p-12 text-center text-gray-500 space-y-2">
              <Mail className="w-8 h-8 text-gray-600 mx-auto" />
              <p className="text-xs font-mono">조건에 해당하는 접수 내역이 없습니다.</p>
              {inquirySearchQuery && (
                <button
                  type="button"
                  onClick={() => setInquirySearchQuery('')}
                  className="text-xs text-sky-400 hover:underline font-mono"
                >
                  검색어 초기화
                </button>
              )}
            </div>
          ) : (
            filteredInquiries.map((item) => {
              const isSelected = selectedInquiryItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedInquiryItem(item);
                    setInquiryAdminNotes(item.adminNotes || '');
                    setInquiryRating(item.rating || 5);
                    if (item.status === 'NEW') {
                      handleUpdateInquiryStatus(item.id, 'READ');
                    }
                  }}
                  className={`p-4 border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-[#181D2E] border-sky-400 shadow-lg shadow-sky-950/40'
                      : 'bg-[#141724] border-white/10 hover:border-white/30 hover:bg-[#161928]'
                  }`}
                >
                  {/* Top row: Type + Status + Date */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase border ${
                          item.type === 'AUDITION'
                            ? 'bg-purple-950 text-purple-300 border-purple-800'
                            : 'bg-sky-950 text-sky-300 border-sky-800'
                        }`}
                      >
                        {item.type === 'AUDITION' ? '오디션' : '문의'}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>

                    <span className="text-[11px] text-gray-400 font-mono">
                      {formatInquiryDate(item.createdAt)}
                    </span>
                  </div>

                  {/* Middle row: Name & Sub-details */}
                  <div className="mb-2">
                    <div className="flex items-baseline space-x-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                        {item.name}
                      </h4>
                      {item.company && (
                        <span className="text-xs text-gray-400 font-mono">
                          • {item.company}
                        </span>
                      )}
                      {item.targetActorName && (
                        <span className="text-[11px] text-sky-400 bg-sky-950/60 border border-sky-800 px-1.5 py-0.2">
                          배우: {item.targetActorName}
                        </span>
                      )}
                    </div>

                    {item.subject && (
                      <p className="text-xs text-gray-300 font-medium mt-0.5 line-clamp-1">
                        {item.subject}
                      </p>
                    )}
                    {item.specialty && item.type === 'AUDITION' && (
                      <p className="text-[11px] text-gray-400 font-mono mt-0.5 line-clamp-1">
                        특기: {item.specialty}
                      </p>
                    )}
                    {item.message && (
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {item.message}
                      </p>
                    )}
                  </div>

                  {/* Bottom row: Contact info & actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-gray-400">
                    <div className="flex items-center space-x-3 truncate">
                      <span>{item.phone}</span>
                      <span>•</span>
                      <span className="truncate">{item.email}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequestDeleteInquiry(item);
                        }}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        title="문의 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Inquiry Detail Inspector */}
        <div className="lg:col-span-6 bg-[#141724] border border-white/10 p-5 space-y-5 max-h-[650px] overflow-y-auto">
          {selectedInquiryItem ? (
            <div className="space-y-5">
              {/* Detail Header */}
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`px-2 py-0.5 text-xs font-mono font-bold uppercase border ${
                        selectedInquiryItem.type === 'AUDITION'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-sky-950 text-sky-300 border-sky-800'
                      }`}
                    >
                      {selectedInquiryItem.type === 'AUDITION' ? '오디션 지원서' : '비즈니스 / 캐스팅 문의'}
                    </span>
                    {getStatusBadge(selectedInquiryItem.status)}
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {selectedInquiryItem.name}
                    {selectedInquiryItem.company ? ` (${selectedInquiryItem.company})` : ''}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    접수 시각: {formatInquiryDate(selectedInquiryItem.createdAt)}
                    {selectedInquiryItem.applicationNumber && ` • 접수번호: ${selectedInquiryItem.applicationNumber}`}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRequestDeleteInquiry(selectedInquiryItem)}
                  className="p-1.5 text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/40 rounded transition-colors text-xs flex items-center space-x-1"
                  title="이 문의 영구 삭제"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="font-mono">삭제</span>
                </button>
              </div>

              {/* Status Changer Bar */}
              <div className="bg-black/40 border border-white/10 p-3 space-y-2">
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                  문의 처리 상태 변경 (STATUS):
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {(['NEW', 'READ', 'CONTACTED', 'COMPLETED'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={isUpdatingInquiry}
                      onClick={() => handleUpdateInquiryStatus(selectedInquiryItem.id, st)}
                      className={`py-1.5 px-2 text-xs font-mono font-bold border transition-all ${
                        selectedInquiryItem.status === st
                          ? 'bg-white text-black border-white shadow'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Dispatch Notice & Action Buttons */}
              <div className="bg-sky-950/40 border border-sky-800/60 p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sky-300 font-mono font-bold">
                    <Mail className="w-4 h-4" />
                    <span>알림 수신처: {OFFICIAL_NOTIFICATION_EMAIL}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-sky-900 text-sky-200 px-1.5 py-0.2 rounded">
                    자동 통보 연동
                  </span>
                </div>
                <p className="text-[11px] text-gray-300">
                  해당 문의가 접수되었을 때 담당자 이메일(<span className="font-mono text-sky-300">{OFFICIAL_NOTIFICATION_EMAIL}</span>)로 자동 통보 처리되었습니다.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href={getInquiryMailtoUrl(selectedInquiryItem)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 bg-sky-400 hover:bg-sky-300 text-black px-3 py-1 text-xs font-mono font-bold transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>{OFFICIAL_NOTIFICATION_EMAIL} 메일 클라이언트 열기</span>
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      const ok = await sendInquiryEmailNotification(selectedInquiryItem);
                      if (ok) {
                        showToast(`${OFFICIAL_NOTIFICATION_EMAIL}으로 알림이 재발송되었습니다.`);
                      } else {
                        showToast('알림 발송 요청이 전달되었습니다.');
                      }
                    }}
                    className="inline-flex items-center space-x-1 text-gray-300 hover:text-white bg-white/5 border border-white/15 px-2.5 py-1 text-xs font-mono transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>알림 재전송</span>
                  </button>
                </div>
              </div>

              {/* Full Detail Fields */}
              {selectedInquiryItem.type === 'AUDITION' ? (
                <div className="space-y-4 text-xs">
                  {/* Personal Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/30 p-3 border border-white/10 font-mono">
                    <div>
                      <span className="text-gray-500 block text-[10px]">성별</span>
                      <span className="text-white font-bold">{selectedInquiryItem.gender || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">생년월일</span>
                      <span className="text-white font-bold">{selectedInquiryItem.birth || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">신장 / 체중</span>
                      <span className="text-white font-bold">
                        {selectedInquiryItem.height ? `${selectedInquiryItem.height}cm` : '-'} / {selectedInquiryItem.weight ? `${selectedInquiryItem.weight}kg` : '-'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">인스타그램</span>
                      <span className="text-sky-400 font-bold truncate block">
                        {selectedInquiryItem.instagram || '-'}
                      </span>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/30 p-3 border border-white/10 font-mono">
                    <div>
                      <span className="text-gray-500 block text-[10px]">연락처 (전화번호)</span>
                      <a href={`tel:${selectedInquiryItem.phone}`} className="text-white hover:text-sky-400 font-bold">
                        {selectedInquiryItem.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">이메일 주소</span>
                      <a href={`mailto:${selectedInquiryItem.email}`} className="text-white hover:text-sky-400 font-bold">
                        {selectedInquiryItem.email}
                      </a>
                    </div>
                  </div>

                  {/* Video / YouTube Link */}
                  {selectedInquiryItem.videoUrl && (
                    <div className="bg-black/30 p-3 border border-white/10">
                      <span className="text-gray-500 block text-[10px] font-mono mb-1">연기 영상 / 포트폴리오 링크</span>
                      <a
                        href={selectedInquiryItem.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-400 hover:underline font-mono break-all inline-flex items-center space-x-1"
                      >
                        <span>{selectedInquiryItem.videoUrl}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </div>
                  )}

                  {/* Specialty */}
                  {selectedInquiryItem.specialty && (
                    <div className="bg-black/30 p-3 border border-white/10">
                      <span className="text-gray-500 block text-[10px] font-mono mb-1">특기 및 매력 포인트</span>
                      <p className="text-gray-200 whitespace-pre-line leading-relaxed">
                        {selectedInquiryItem.specialty}
                      </p>
                    </div>
                  )}

                  {/* Bio / Self-Introduction */}
                  {selectedInquiryItem.bio && (
                    <div className="bg-black/30 p-3 border border-white/10">
                      <span className="text-gray-500 block text-[10px] font-mono mb-1">자기소개 및 지원 동기</span>
                      <p className="text-gray-200 whitespace-pre-line leading-relaxed font-sans">
                        {selectedInquiryItem.bio}
                      </p>
                    </div>
                  )}

                  {/* Experience / Filmography */}
                  {selectedInquiryItem.experience && (
                    <div className="bg-black/30 p-3 border border-white/10">
                      <span className="text-gray-500 block text-[10px] font-mono mb-1">출연 및 활동 경력</span>
                      <p className="text-gray-200 whitespace-pre-line leading-relaxed font-sans">
                        {selectedInquiryItem.experience}
                      </p>
                    </div>
                  )}

                  {/* Attached Photos */}
                  {(selectedInquiryItem.photoUrlFace || selectedInquiryItem.photoUrlFull) && (
                    <div className="space-y-2">
                      <span className="text-gray-400 font-mono text-[11px] block">제출된 프로필 사진</span>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedInquiryItem.photoUrlFace && (
                          <div className="border border-white/10 bg-black/40 p-2 space-y-1 text-center">
                            <span className="text-[10px] text-gray-400 font-mono block">얼굴 정면 사진</span>
                            <a href={selectedInquiryItem.photoUrlFace} target="_blank" rel="noreferrer" className="block">
                              <img
                                src={selectedInquiryItem.photoUrlFace}
                                alt="얼굴 사진"
                                className="w-full h-40 object-cover border border-white/10 hover:opacity-90 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                        {selectedInquiryItem.photoUrlFull && (
                          <div className="border border-white/10 bg-black/40 p-2 space-y-1 text-center">
                            <span className="text-[10px] text-gray-400 font-mono block">전신 사진</span>
                            <a href={selectedInquiryItem.photoUrlFull} target="_blank" rel="noreferrer" className="block">
                              <img
                                src={selectedInquiryItem.photoUrlFull}
                                alt="전신 사진"
                                className="w-full h-40 object-cover border border-white/10 hover:opacity-90 transition-opacity"
                              />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Casting Director Notes & Rating */}
                  <div className="bg-black/40 border border-white/10 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-mono text-gray-300 font-bold uppercase">
                        캐스팅 심사평 및 내부 메모
                      </label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setInquiryRating(star)}
                            className={`text-sm ${star <= inquiryRating ? 'text-amber-400' : 'text-gray-600'}`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={inquiryAdminNotes}
                      onChange={(e) => setInquiryAdminNotes(e.target.value)}
                      placeholder="지원자에 대한 심사 평가, 미팅 일정, 전달 사항 등을 기록하세요."
                      className="w-full bg-[#11131A] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveInquiryNotes(selectedInquiryItem.id)}
                      className="bg-white text-black hover:bg-gray-200 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors"
                    >
                      심사평 저장
                    </button>
                  </div>
                </div>
              ) : (
                /* CONTACT Details */
                <div className="space-y-4 text-xs">
                  {/* Contact info grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/30 p-3 border border-white/10 font-mono">
                    <div>
                      <span className="text-gray-500 block text-[10px]">연락처 (전화번호)</span>
                      <a href={`tel:${selectedInquiryItem.phone}`} className="text-white hover:text-sky-400 font-bold">
                        {selectedInquiryItem.phone}
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">이메일 주소</span>
                      <a href={`mailto:${selectedInquiryItem.email}`} className="text-white hover:text-sky-400 font-bold">
                        {selectedInquiryItem.email}
                      </a>
                    </div>
                  </div>

                  {/* Category & Target Actor */}
                  <div className="grid grid-cols-2 gap-3 bg-black/30 p-3 border border-white/10 font-mono">
                    <div>
                      <span className="text-gray-500 block text-[10px]">문의 유형</span>
                      <span className="text-white font-bold">{selectedInquiryItem.category || '일반 문의'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">대상 배우</span>
                      <span className="text-sky-300 font-bold">
                        {selectedInquiryItem.targetActorName || '전체 / 회사 대표'}
                      </span>
                    </div>
                  </div>

                  {/* Subject */}
                  {selectedInquiryItem.subject && (
                    <div className="bg-black/30 p-3 border border-white/10">
                      <span className="text-gray-500 block text-[10px] font-mono mb-1">문의 제목</span>
                      <p className="text-white font-bold text-sm">
                        {selectedInquiryItem.subject}
                      </p>
                    </div>
                  )}

                  {/* Message */}
                  <div className="bg-black/30 p-3.5 border border-white/10 space-y-1">
                    <span className="text-gray-500 block text-[10px] font-mono">상세 문의 내용</span>
                    <p className="text-gray-200 whitespace-pre-line leading-relaxed font-sans pt-1">
                      {selectedInquiryItem.message}
                    </p>
                  </div>

                  {/* Admin Notes */}
                  <div className="bg-black/40 border border-white/10 p-3.5 space-y-2.5">
                    <label className="block text-[11px] font-mono text-gray-300 font-bold uppercase">
                      관리자 처리 메모
                    </label>
                    <textarea
                      rows={3}
                      value={inquiryAdminNotes}
                      onChange={(e) => setInquiryAdminNotes(e.target.value)}
                      placeholder="회신 내용, 통화 기록, 진행 상황 등을 기록하세요."
                      className="w-full bg-[#11131A] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-sky-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveInquiryNotes(selectedInquiryItem.id)}
                      className="bg-white text-black hover:bg-gray-200 px-3 py-1.5 text-xs font-mono font-bold uppercase transition-colors"
                    >
                      처리 메모 저장
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-32 text-gray-500 text-xs font-mono space-y-2">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto" />
              <p>왼쪽 목록에서 확인하실 문의 또는 지원서를 선택해주세요.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
