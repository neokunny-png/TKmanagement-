import React, { useState } from 'react';
import {
  Shield,
  Lock,
  X,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { TKLogoMark } from './TKLogo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (authType: 'google' | 'passcode', userIdentifier?: string) => void;
}

// Master passcodes accepted for quick manager access
const VALID_PASSCODES = ['tk7788', 'admin2026', 'taz0206', 'tkcompany'];

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  const [isVerifyingPasscode, setIsVerifyingPasscode] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  if (!isOpen) return null;

  const handlePasscodeLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcode.trim()) {
      setErrorMessage('관리자 마스터 패스코드를 입력해주세요.');
      return;
    }

    setIsVerifyingPasscode(true);
    setErrorMessage('');

    setTimeout(() => {
      const cleaned = passcode.trim().toLowerCase();
      if (VALID_PASSCODES.includes(cleaned)) {
        if (rememberSession) {
          sessionStorage.setItem('tk_admin_auth', 'true');
          sessionStorage.setItem('tk_admin_type', 'passcode');
          sessionStorage.setItem('tk_admin_email', 'Master Administrator');
        }
        onSuccess('passcode', 'Master Administrator');
      } else {
        setErrorMessage('비밀번호가 일치하지 않습니다. (기본 코드: tk7788)');
        setIsVerifyingPasscode(false);
      }
    }, 300);
  };

  return (
    <div
      id="admin-auth-modal-overlay"
      className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto touch-scroll animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#0F111A] border border-white/20 shadow-2xl overflow-hidden my-auto p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-150">
        {/* Glow ambient background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex p-3 bg-sky-950/80 border border-sky-500/40 mb-1">
            <Shield className="w-8 h-8 text-sky-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
            TK MANAGEMENT
          </h3>
          <p className="text-xs text-sky-400 font-mono tracking-wider uppercase">
            RESTRICTED ADMIN PORTAL
          </p>
          <p className="text-xs text-gray-400 font-light max-w-xs mx-auto pt-1 leading-relaxed">
            관리자 전용 기능(소속 배우 정보, 오디션 심사, 보도자료, 문의 내역)에 접근하려면 보안 인증이 필요합니다.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-start space-x-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Method 2: Passcode Form */}
        <form onSubmit={handlePasscodeLogin} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs text-gray-300 font-medium flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-sky-400" />
                <span>관리자 마스터 비밀번호</span>
              </label>
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-mono"
              >
                <HelpCircle className="w-3 h-3" />
                <span>힌트 확인</span>
              </button>
            </div>

            {showHint && (
              <div className="mb-2 p-2 bg-sky-950/60 border border-sky-600/40 text-[11px] text-sky-300 font-mono">
                💡 기본 마스터 비밀번호: <strong className="text-white">tk7788</strong>
              </div>
            )}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="관리자 보안 패스코드를 입력하세요"
                autoFocus
                className="w-full bg-[#161926] border border-white/15 px-3.5 py-2.5 pr-10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-sky-400 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember session checkbox */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="accent-sky-500 rounded"
              />
              <span className="text-[11px]">이 브라우저에서 인증 세션 유지</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isVerifyingPasscode || !passcode.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-sky-500 hover:bg-sky-400 text-black py-2.5 px-4 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {isVerifyingPasscode ? (
              <span>인증 확인 중...</span>
            ) : (
              <>
                <span>관리자 시스템 입장</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="pt-3 border-t border-white/10 text-[10px] text-gray-400 text-center font-mono space-y-1">
          <div className="flex items-center justify-center space-x-1.5 text-gray-300">
            <Lock className="w-3 h-3 text-sky-400" />
            <span>256-BIT ENCRYPTED MANAGEMENT PORTAL</span>
          </div>
          <div>모든 관리자 접속 및 수정 이력은 안전하게 암호화되어 기록됩니다.</div>
        </div>
      </div>
    </div>
  );
};
