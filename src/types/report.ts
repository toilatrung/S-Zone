export type RoleOption =
  | 'Employee/Staff'
  | 'Manager/Supervisor'
  | 'Contractor'
  | 'Visitor'
  | 'Other (Please specify in description)'

export type IssueTypeOption =
  | 'Safety Hazard/Accident'
  | 'Equipment/Facility Malfunction'
  | 'IT/System Outage'
  | 'Security Concern (Non-Emergency)'
  | 'Personnel/HR Issue'
  | 'Other'

export type UrgencyOption = '1' | '5'

export interface ReportFormData {
  role: RoleOption
  issueType: IssueTypeOption
  urgency: UrgencyOption
  time?: string
  location?: string
  description?: string
}

export interface ReportFormErrors {
  role?: string
  issueType?: string
  urgency?: string
  description?: string
  submit?: string
}
