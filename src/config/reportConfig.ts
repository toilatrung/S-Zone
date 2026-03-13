import type { IssueTypeOption, RoleOption, UrgencyOption } from '../types/report'

type Option<T extends string> = {
  value: T
  label: string
}

const defaultFormActionUrl = 'https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/formResponse'

export const reportConfig = {
  labels: {
    role: 'Bạn là ai?',
    issueType: 'Vấn đề gặp phải',
    urgency: 'Mức độ khẩn cấp',
    time: 'Thời gian (không bắt buộc)',
    location: 'Địa điểm (không bắt buộc)',
    description: 'Mô tả ngắn (không bắt buộc)',
  },
  options: {
    roles: [
      { value: 'Employee/Staff', label: 'Học sinh bị bắt nạt' },
      { value: 'Manager/Supervisor', label: 'Người chứng kiến' },
      { value: 'Contractor', label: 'Phụ huynh' },
      { value: 'Visitor', label: 'Khách/Người ngoài' },
      { value: 'Other (Please specify in description)', label: 'Khác' },
    ] satisfies Option<RoleOption>[],
    issueTypes: [
      { value: 'Safety Hazard/Accident', label: 'Bắt nạt thể xác' },
      { value: 'Equipment/Facility Malfunction', label: 'Bạo lực ngôn từ' },
      { value: 'IT/System Outage', label: 'Bôi nhọ trên mạng' },
      { value: 'Security Concern (Non-Emergency)', label: 'Đe dọa/ép buộc' },
      { value: 'Personnel/HR Issue', label: 'Hành vi tái diễn nhiều lần' },
      { value: 'Other', label: 'Khác' },
    ] satisfies Option<IssueTypeOption>[],
    urgencies: [
      { value: '1', label: 'Bình thường' },
      { value: '5', label: 'Cần can thiệp ngay (có xô xát)' },
    ] satisfies Option<UrgencyOption>[],
  },
  limits: {
    descriptionMaxLength: 500,
  },
  integrations: {
    googleFormActionUrl:
      import.meta.env.VITE_GOOGLE_FORM_ACTION_URL?.trim() || defaultFormActionUrl,
    emailjs: {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || '',
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || '',
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || '',
    },
    hotlinePhone: import.meta.env.VITE_HOTLINE_PHONE?.trim() || '0123456789',
    articleIframeUrl: import.meta.env.VITE_ARTICLE_IFRAME_URL?.trim() || 'https://dantri.com.vn/giao-duc/nhung-vu-bao-luc-hoc-duong-rung-dong-nam-2025-4-hoc-sinh-tu-vong-20251231113657772.htm',
    articleOriginalUrl: import.meta.env.VITE_ARTICLE_ORIGINAL_URL?.trim() || 'https://moh.gov.vn/web/phong-chong-tai-nan-thuong-tich/thong-tin-tuyen-truyen-dao-tao/-/asset_publisher/y1HBDqztr86t/content/bao-luc-hoc-uong-nguyen-nhan-va-bien-phap-phong-tranh',
    entries: {
      role: import.meta.env.VITE_GOOGLE_ENTRY_ROLE?.trim() || 'entry.0000000001',
      issueType: import.meta.env.VITE_GOOGLE_ENTRY_ISSUE_TYPE?.trim() || 'entry.0000000002',
      urgency: import.meta.env.VITE_GOOGLE_ENTRY_URGENCY?.trim() || 'entry.0000000003',
      time: import.meta.env.VITE_GOOGLE_ENTRY_TIME?.trim() || 'entry.0000000004',
      location: import.meta.env.VITE_GOOGLE_ENTRY_LOCATION?.trim() || 'entry.0000000005',
      description:
        import.meta.env.VITE_GOOGLE_ENTRY_DESCRIPTION?.trim() || 'entry.0000000006',
    },
  },
}
