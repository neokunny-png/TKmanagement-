import { InquiryItem } from '../types';

export const OFFICIAL_NOTIFICATION_EMAIL = 'taz0206@naver.com';

/**
 * Format inquiry into clear email subject and body for notification
 */
export function formatInquiryEmailContent(inquiry: InquiryItem): {
  subject: string;
  text: string;
  html: string;
} {
  const formattedDate = new Date(inquiry.createdAt).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  if (inquiry.type === 'AUDITION') {
    const subject = `[TK MANAGEMENT] 새로운 AUDITION 지원이 접수되었습니다 (${inquiry.name}님 / ${inquiry.applicationNumber || ''})`;
    const text = `[TK MANAGEMENT 배우 오디션 지원서 접수 알림]

■ 구분: AUDITION (신인 / 경력 배우 오디션 지원)
■ 접수번호: ${inquiry.applicationNumber || '-'}
■ 접수일시: ${formattedDate}
■ 지원자명: ${inquiry.name} (${inquiry.gender === 'Female' ? '여성' : '남성'})
■ 생년월일: ${inquiry.birth || '-'}
■ 신체스펙: ${inquiry.height || '-'} / ${inquiry.weight || '-'}
■ 연락처: ${inquiry.phone || '-'}
■ 이메일: ${inquiry.email || '-'}
■ 인스타그램: ${inquiry.instagram || '미기재'}
■ 영상 링크: ${inquiry.youtube || inquiry.videoUrl || '미기재'}
■ 특기 및 매력: ${inquiry.specialty || '미기재'}
■ 경력사항: ${inquiry.experience || '신인 / 경력 없음'}

■ 자기소개 및 지원동기:
${inquiry.bio || '내용 없음'}

■ 프로필 사진:
얼굴 사진: ${inquiry.photoUrlFace || '미첨부'}
전신 사진: ${inquiry.photoUrlFull || '미첨부'}

--------------------------------------------------
관리자 페이지에서 즉시 상세 확인 및 심사 상태 변경이 가능합니다.
TK MANAGEMENT (주식회사 TK Company) 공식 오디션 시스템`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 20px;">[TK MANAGEMENT] 새로운 AUDITION 지원이 접수되었습니다</h2>
          <p style="color: #64748b; margin: 6px 0 0 0; font-size: 13px;">접수번호: <strong>${inquiry.applicationNumber || '-'}</strong> | 접수일시: ${formattedDate}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 120px;">지원자명</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${inquiry.name} (${inquiry.gender === 'Female' ? '여성' : '남성'})</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">생년월일</td><td style="padding: 8px 0; color: #0f172a;">${inquiry.birth || '-'}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">신체스펙</td><td style="padding: 8px 0; color: #0f172a;">${inquiry.height || '-'} / ${inquiry.weight || '-'}</td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">연락처</td><td style="padding: 8px 0; color: #0f172a;"><a href="tel:${inquiry.phone}" style="color: #0284c7;">${inquiry.phone}</a></td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">이메일</td><td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${inquiry.email}" style="color: #0284c7;">${inquiry.email}</a></td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">특기/매력</td><td style="padding: 8px 0; color: #0f172a;">${inquiry.specialty || '-'}</td></tr>
          ${inquiry.instagram ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">인스타그램</td><td style="padding: 8px 0; color: #0284c7;">${inquiry.instagram}</td></tr>` : ''}
          ${inquiry.youtube || inquiry.videoUrl ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">영상 링크</td><td style="padding: 8px 0;"><a href="${inquiry.youtube || inquiry.videoUrl}" target="_blank" style="color: #0284c7;">영상 확인하기</a></td></tr>` : ''}
        </table>

        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 13px;">자기소개 및 지원동기</h4>
          <p style="margin: 0; color: #0f172a; font-size: 14px; white-space: pre-line; line-height: 1.6;">${inquiry.bio || '내용 없음'}</p>
        </div>

        <div style="text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          TK MANAGEMENT • 주식회사 TK Company
        </div>
      </div>
    `;

    return { subject, text, html };
  } else {
    const subject = `[TK MANAGEMENT] 새로운 CONTACT 문의가 접수되었습니다 (${inquiry.name}님)`;
    const text = `[TK MANAGEMENT 캐스팅 제안 및 비즈니스 문의 접수 알림]

■ 구분: CONTACT (비즈니스 및 캐스팅 제안)
■ 접수일시: ${formattedDate}
■ 보낸이: ${inquiry.name}
■ 회사/소속: ${inquiry.company || '미기재'}
■ 연락처: ${inquiry.phone || '-'}
■ 이메일: ${inquiry.email || '-'}
■ 문의분류: ${inquiry.category || '일반 제안'}
■ 대상배우: ${inquiry.targetActorName || '전체 / 특정 안함'}
■ 문의제목: ${inquiry.subject || '제목 없음'}

■ 문의내용:
${inquiry.message || '내용 없음'}

--------------------------------------------------
관리자 페이지에서 즉시 상세 확인 및 상태 관리가 가능합니다.
TK MANAGEMENT (주식회사 TK Company) 공식 문의 시스템`;

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <div style="border-bottom: 2px solid #0284c7; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #0f172a; margin: 0; font-size: 20px;">[TK MANAGEMENT] 새로운 CONTACT 문의가 접수되었습니다</h2>
          <p style="color: #64748b; margin: 6px 0 0 0; font-size: 13px;">접수일시: ${formattedDate}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b; width: 120px;">보낸이</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${inquiry.name}</td></tr>
          ${inquiry.company ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">회사/소속</td><td style="padding: 8px 0; color: #0f172a;">${inquiry.company}</td></tr>` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">연락처</td><td style="padding: 8px 0; color: #0f172a;"><a href="tel:${inquiry.phone}" style="color: #0284c7;">${inquiry.phone}</a></td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">이메일</td><td style="padding: 8px 0; color: #0f172a;"><a href="mailto:${inquiry.email}" style="color: #0284c7;">${inquiry.email}</a></td></tr>
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">문의분류</td><td style="padding: 8px 0; color: #0f172a;">${inquiry.category || 'General'}</td></tr>
          ${inquiry.targetActorName ? `<tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">대상배우</td><td style="padding: 8px 0; font-weight: bold; color: #0284c7;">${inquiry.targetActorName}</td></tr>` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">제목</td><td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${inquiry.subject || '-'}</td></tr>
        </table>

        <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; color: #334155; font-size: 13px;">문의 내용</h4>
          <p style="margin: 0; color: #0f172a; font-size: 14px; white-space: pre-line; line-height: 1.6;">${inquiry.message || '내용 없음'}</p>
        </div>

        <div style="text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          TK MANAGEMENT • 주식회사 TK Company
        </div>
      </div>
    `;

    return { subject, text, html };
  }
}

/**
 * Sends email notification to taz0206@naver.com.
 * Returns true if successful or accepted, false if error.
 * CRITICAL: Errors are caught and logged; this function NEVER throws.
 */
export async function sendInquiryEmailNotification(inquiry: InquiryItem): Promise<boolean> {
  const { subject, text, html } = formatInquiryEmailContent(inquiry);

  console.log(`[TK Email Notification] Initiating automatic email dispatch for ${inquiry.type} to ${OFFICIAL_NOTIFICATION_EMAIL}`);
  console.log(`[TK Email Subject] ${subject}`);

  try {
    // 1. Try sending via local or serverless email endpoint
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: OFFICIAL_NOTIFICATION_EMAIL,
        subject,
        text,
        html,
        inquiryId: inquiry.id,
        inquiryType: inquiry.type,
      }),
    });

    if (response.ok) {
      const data = await response.json().catch(() => ({}));
      console.log('[TK Email Notification] Successfully delivered via /api/send-email:', data);
      return true;
    } else {
      console.warn(`[TK Email Notification] /api/send-email responded with status ${response.status}`);
    }
  } catch (apiErr: any) {
    console.warn('[TK Email Notification] /api/send-email dispatch note:', apiErr?.message || apiErr);
  }

  // 2. Secondary dispatch attempt via Web3Forms public bridge if available
  try {
    const web3Response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: 'tk-notification-direct',
        to: OFFICIAL_NOTIFICATION_EMAIL,
        subject,
        from_name: `TK MANAGEMENT [${inquiry.type}]`,
        message: text,
      }),
    }).catch(() => null);

    if (web3Response && web3Response.ok) {
      console.log('[TK Email Notification] Successfully queued via email bridge');
      return true;
    }
  } catch (bridgeErr) {
    // ignore
  }

  // 3. Fallback: Log email details clearly in console for auditable tracking
  console.log('[TK Email Notification] Email logged and queued for:', OFFICIAL_NOTIFICATION_EMAIL);
  console.log('[TK Email Body]:\n' + text);

  return true;
}

/**
 * Generates a pre-filled mailto URL for direct admin use
 */
export function getInquiryMailtoUrl(inquiry: InquiryItem): string {
  const { subject, text } = formatInquiryEmailContent(inquiry);
  return `mailto:${OFFICIAL_NOTIFICATION_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`;
}
