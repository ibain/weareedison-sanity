const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

export function validateRecurringDay(value: string | undefined, mode?: string) {
  return mode !== 'recurring' || DAYS.includes(value || '') || 'Pick a day of the week'
}

function minutes(value?: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value?.trim() || '')
  if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return null
  return Number(match[1]) * 60 + Number(match[2])
}

export function validateRecurringTime(value: string | undefined, mode?: string, start?: string) {
  if (mode !== 'recurring') return true
  const time = minutes(value)
  if (time === null) return 'Enter a 24-hour time, such as 18:30'
  const startTime = minutes(start)
  if (startTime !== null && time <= startTime) return 'End time must be after start time on the same day'
  return true
}

export function validateTimeZone(value?: string) {
  if (!value?.trim()) return true // The join app defaults to America/Los_Angeles.
  try {
    Intl.DateTimeFormat('en-US', {timeZone: value.trim()})
    return true
  } catch {
    return 'Enter an IANA timezone, such as America/Los_Angeles'
  }
}

export function validateZoomInviteUrl(value?: string, meetingNumber?: string) {
  if (!value) return true
  try {
    const url = new URL(value)
    const id = (meetingNumber || '').replace(/\D/g, '')
    if (url.protocol === 'https:' && !url.username && !url.password &&
        (url.hostname === 'zoom.us' || url.hostname.endsWith('.zoom.us')) &&
        id && url.pathname === `/j/${id}`) return true
  } catch { /* Return a publish-blocking validation message below. */ }
  return 'Paste an HTTPS Zoom invite link for the meeting number above'
}
