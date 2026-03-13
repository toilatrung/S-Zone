import { reportConfig } from '../config/reportConfig'
import type { ReportFormData } from '../types/report'

const REQUEST_TIMEOUT_MS = 10000

function appendDateTimeParts(body: URLSearchParams, entryId: string, rawDateTime: string): void {
  const parsed = new Date(rawDateTime)

  if (Number.isNaN(parsed.getTime())) {
    body.set(entryId, rawDateTime)
    return
  }

  body.set(`${entryId}_year`, String(parsed.getFullYear()))
  body.set(`${entryId}_month`, String(parsed.getMonth() + 1))
  body.set(`${entryId}_day`, String(parsed.getDate()))
  body.set(`${entryId}_hour`, String(parsed.getHours()))
  body.set(`${entryId}_minute`, String(parsed.getMinutes()))
}

function toFormBody(data: ReportFormData): URLSearchParams {
  const body = new URLSearchParams()
  const { entries } = reportConfig.integrations

  body.set(entries.role, data.role)
  body.set(entries.issueType, data.issueType)
  body.set(entries.urgency, data.urgency)

  if (data.time) {
    appendDateTimeParts(body, entries.time, data.time)
  }

  if (data.location) {
    body.set(entries.location, data.location)
  }

  if (data.description) {
    body.set(entries.description, data.description)
  }

  return body
}

export async function submitReport(data: ReportFormData): Promise<void> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    await fetch(reportConfig.integrations.googleFormActionUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: toFormBody(data).toString(),
      signal: controller.signal,
    })
  } catch {
    throw new Error('Không thể gửi phản ánh. Vui lòng thử lại.')
  } finally {
    window.clearTimeout(timeout)
  }
}
