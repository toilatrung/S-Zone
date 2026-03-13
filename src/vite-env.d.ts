/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZALO_GROUP_URL?: string
  readonly VITE_ZALO_SHARE_URL?: string
  readonly VITE_GOOGLE_FORM_ACTION_URL?: string
  readonly VITE_GOOGLE_ENTRY_ROLE?: string
  readonly VITE_GOOGLE_ENTRY_ISSUE_TYPE?: string
  readonly VITE_GOOGLE_ENTRY_URGENCY?: string
  readonly VITE_GOOGLE_ENTRY_TIME?: string
  readonly VITE_GOOGLE_ENTRY_LOCATION?: string
  readonly VITE_GOOGLE_ENTRY_DESCRIPTION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
