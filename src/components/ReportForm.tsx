import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import { reportConfig } from '../config/reportConfig'
import { submitReport } from '../services/submitReport'
import type {
  IssueTypeOption,
  ReportFormData,
  ReportFormErrors,
  RoleOption,
  UrgencyOption,
} from '../types/report'

type FormState = {
  role: RoleOption | ''
  issueType: IssueTypeOption | ''
  urgency: UrgencyOption | ''
  time: string
  location: string
  description: string
}

const initialState: FormState = {
  role: '',
  issueType: '',
  urgency: '',
  time: '',
  location: '',
  description: '',
}

function getOptionLabel<T extends string>(
  options: Array<{ value: T; label: string }>,
  value: T,
): string {
  return options.find((option) => option.value === value)?.label ?? value
}

function toDisplayDate(rawDateTime?: string): string {
  if (!rawDateTime) {
    return 'Không cung cấp'
  }

  const parsed = new Date(rawDateTime)

  if (Number.isNaN(parsed.getTime())) {
    return rawDateTime
  }

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parsed)
}



function validateForm(values: FormState): ReportFormErrors {
  const errors: ReportFormErrors = {}

  if (!values.role) {
    errors.role = 'Vui lòng chọn vai trò của bạn.'
  }

  if (!values.issueType) {
    errors.issueType = 'Vui lòng chọn vấn đề gặp phải.'
  }

  if (!values.urgency) {
    errors.urgency = 'Vui lòng chọn mức độ khẩn cấp.'
  }

  if (values.description.length > reportConfig.limits.descriptionMaxLength) {
    errors.description = `Mô tả tối đa ${reportConfig.limits.descriptionMaxLength} ký tự.`
  }

  return errors
}

function toPayload(values: FormState): ReportFormData {
  return {
    role: values.role as RoleOption,
    issueType: values.issueType as IssueTypeOption,
    urgency: values.urgency as UrgencyOption,
    time: values.time.trim() || undefined,
    location: values.location.trim() || undefined,
    description: values.description.trim() || undefined,
  }
}

export function ReportForm() {
  const [values, setValues] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<ReportFormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const remainingChars = useMemo(
    () => reportConfig.limits.descriptionMaxLength - values.description.length,
    [values.description.length],
  )

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))

    if (errors[name as keyof ReportFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const nextErrors = validateForm(values)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const payload = toPayload(values)
      
      // 1. Submit to Google Forms first
      await submitReport(payload)

      // 2. Submit to EmailJS
      const templateParams = {
        role: getOptionLabel(reportConfig.options.roles, payload.role),
        issueType: getOptionLabel(reportConfig.options.issueTypes, payload.issueType),
        urgency: getOptionLabel(reportConfig.options.urgencies, payload.urgency),
        time: toDisplayDate(payload.time),
        location: payload.location || 'Không cung cấp',
        description: payload.description || 'Không cung cấp',
      }
      
      const { serviceId, templateId, publicKey } = reportConfig.integrations.emailjs
      if (serviceId && templateId && publicKey) {
        await emailjs.send(serviceId, templateId, templateParams, publicKey)
      }

      setIsSuccess(true)
    } catch (error) {
      const fallback = 'Không thể gửi phản ánh. Vui lòng thử lại.'
      const message = error instanceof Error ? error.message : fallback
      setErrors((prev) => ({ ...prev, submit: message }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setValues(initialState)
    setErrors({})
    setIsSuccess(false)
  }

  if (isSuccess) {
    return (
      <div className="success-message">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
        <h2>Gửi phản ánh thành công!</h2>
        <p>Cảm ơn bạn đã dũng cảm lên tiếng. Thông tin của bạn đã được ghi nhận và sẽ được xử lý sớm nhất có thể.</p>
        <button type="button" onClick={handleReset} className="reset-button">
          Gửi thêm phản ánh khác
        </button>
      </div>
    )
  }

  return (
    <form id="report-form" className="report-form" onSubmit={handleSubmit} noValidate>
      <h2>Form phản ánh</h2>

      <label htmlFor="role">{reportConfig.labels.role}</label>
      <select id="role" name="role" value={values.role} onChange={handleInputChange}>
        <option value="">Chọn một mục</option>
        {reportConfig.options.roles.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.role && <p className="error-text">{errors.role}</p>}

      <label htmlFor="issueType">{reportConfig.labels.issueType}</label>
      <select id="issueType" name="issueType" value={values.issueType} onChange={handleInputChange}>
        <option value="">Chọn một mục</option>
        {reportConfig.options.issueTypes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.issueType && <p className="error-text">{errors.issueType}</p>}

      <label htmlFor="urgency">{reportConfig.labels.urgency}</label>
      <select id="urgency" name="urgency" value={values.urgency} onChange={handleInputChange}>
        <option value="">Chọn một mục</option>
        {reportConfig.options.urgencies.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.urgency && <p className="error-text">{errors.urgency}</p>}

      <label htmlFor="time">{reportConfig.labels.time}</label>
      <input
        id="time"
        name="time"
        type="datetime-local"
        value={values.time}
        onChange={handleInputChange}
      />

      <label htmlFor="location">{reportConfig.labels.location}</label>
      <input
        id="location"
        name="location"
        type="text"
        value={values.location}
        onChange={handleInputChange}
      />

      <label htmlFor="description">{reportConfig.labels.description}</label>
      <textarea
        id="description"
        name="description"
        value={values.description}
        onChange={handleInputChange}
        rows={4}
        maxLength={reportConfig.limits.descriptionMaxLength}
      />
      <p className="helper-text">Còn lại {remainingChars} ký tự.</p>
      {errors.description && <p className="error-text">{errors.description}</p>}

      {errors.submit && <p className="error-text">{errors.submit}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Đang gửi...' : 'Gửi phản ánh'}
      </button>
    </form>
  )
}
