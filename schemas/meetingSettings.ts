import {validateRecurringDay, validateRecurringTime, validateTimeZone, validateZoomInviteUrl} from './meetingValidation'

export default {
  name: 'meetingSettings',
  type: 'document',
  title: 'Meeting Settings',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Meeting title',
      description: 'Shown on meet.weareedison.org.',
      initialValue: 'PTA Zoom',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'meetingNumber',
      type: 'string',
      title: 'Zoom meeting number',
      description:
        'Digits only (spaces/dashes OK). Used by meet.weareedison.org. Zoom SDK keys stay in Vercel — only meeting details live here.',
      validation: (Rule: any) =>
        Rule.required().custom((value: string | undefined) => {
          if (!value) return 'Meeting number is required'
          if (!/^\d[\d\s-]*$/.test(value)) {
            return 'Meeting number should contain digits only (spaces/dashes OK).'
          }
          return true
        }),
    },
    {
      name: 'passcode',
      type: 'string',
      title: 'Meeting passcode',
      description:
        'Leave blank if the meeting uses waiting room only. Same passcode people already get in Zoom invite links (public Sanity read).',
    },
    {
      name: 'zoomInviteUrl',
      type: 'url',
      title: 'Zoom invite link (optional)',
      description: 'Paste the original Zoom invite URL, including its encrypted pwd value. Used for the Zoom app alternative; keep the plain Meeting passcode above for browser joining.',
      validation: (Rule: any) => Rule.custom((value: string | undefined, context: any) =>
        validateZoomInviteUrl(value, context.document?.meetingNumber)),
    },
    {
      name: 'enabled',
      type: 'boolean',
      title: 'Browser join enabled',
      description:
        'Extra kill switch. Prefer “Off” under “When is join open?” for day-to-day control. When unchecked, joins stay blocked even if the schedule would otherwise be open.',
      initialValue: true,
    },
    {
      name: 'scheduleMode',
      type: 'string',
      title: 'When is join open?',
      description:
        'Controls when meet.weareedison.org and the Squarespace banner allow joining. “From Events calendar” reads any event with “Open Zoom browser join for this event” checked.',
      options: {
        list: [
          {title: 'Off (closed until you pick another mode)', value: 'off'},
          {title: 'Always (open until you switch modes)', value: 'always'},
          {
            title: 'Monthly recurring (e.g. 2nd Thursday 6:30–8:00 PM)',
            value: 'recurring',
          },
          {title: 'From Events calendar', value: 'events'},
        ],
        layout: 'radio',
      },
      initialValue: 'always',
    },
    {
      name: 'recurringWeekOfMonth',
      type: 'number',
      title: 'Week of month',
      description: '1 = first, 2 = second, 3 = third, 4 = fourth, 5 = last',
      options: {list: [1, 2, 3, 4, 5]},
      hidden: ({document}: {document?: {scheduleMode?: string}}) =>
        document?.scheduleMode !== 'recurring',
      validation: (Rule: any) =>
        Rule.custom((value: number | undefined, context: any) => {
          if (context.document?.scheduleMode !== 'recurring') return true
          if (!Number.isInteger(value) || !value || value < 1 || value > 5) return 'Pick a week from 1 through 5'
          return true
        }),
    },
    {
      name: 'recurringDayOfWeek',
      type: 'string',
      title: 'Day of week',
      validation: (Rule: any) => Rule.custom((value: string | undefined, context: any) =>
        validateRecurringDay(value, context.document?.scheduleMode)),
      options: {
        list: [
          {title: 'Sunday', value: 'sunday'},
          {title: 'Monday', value: 'monday'},
          {title: 'Tuesday', value: 'tuesday'},
          {title: 'Wednesday', value: 'wednesday'},
          {title: 'Thursday', value: 'thursday'},
          {title: 'Friday', value: 'friday'},
          {title: 'Saturday', value: 'saturday'},
        ],
        layout: 'dropdown',
      },
      hidden: ({document}: {document?: {scheduleMode?: string}}) =>
        document?.scheduleMode !== 'recurring',
    },
    {
      name: 'recurringStartTime',
      type: 'string',
      title: 'Meeting start time',
      validation: (Rule: any) => Rule.custom((value: string | undefined, context: any) =>
        validateRecurringTime(value, context.document?.scheduleMode)),
      description: '24-hour local time, e.g. 18:30 for 6:30 PM',
      hidden: ({document}: {document?: {scheduleMode?: string}}) =>
        document?.scheduleMode !== 'recurring',
    },
    {
      name: 'recurringEndTime',
      type: 'string',
      title: 'Meeting end time',
      validation: (Rule: any) => Rule.custom((value: string | undefined, context: any) =>
        validateRecurringTime(value, context.document?.scheduleMode, context.document?.recurringStartTime)),
      description: '24-hour local time, e.g. 20:00 for 8:00 PM',
      hidden: ({document}: {document?: {scheduleMode?: string}}) =>
        document?.scheduleMode !== 'recurring',
    },
    {
      name: 'timezone',
      type: 'string',
      title: 'Timezone',
      validation: (Rule: any) => Rule.custom(validateTimeZone),
      initialValue: 'America/Los_Angeles',
      description: 'Used for recurring schedule math (Pacific for Edison PTA).',
    },
    {
      name: 'joinOpensMinutesBefore',
      type: 'number',
      title: 'Open join this many minutes early',
      initialValue: 30,
      validation: (Rule: any) => Rule.min(0).max(180),
    },
    {
      name: 'joinClosesMinutesAfter',
      type: 'number',
      title: 'Close join this many minutes after meeting ends',
      initialValue: 120,
      validation: (Rule: any) => Rule.min(0).max(360),
    },
    {
      name: 'eventsTitleContains',
      type: 'string',
      title: 'Events title filter (optional)',
      description:
        'Only used in “From Events calendar” mode. Example: PTA Meeting',
      hidden: ({document}: {document?: {scheduleMode?: string}}) =>
        document?.scheduleMode !== 'events',
    },
    {
      name: 'notes',
      type: 'text',
      rows: 3,
      title: 'Internal notes',
      description: 'Not shown on the meet page, but published notes are publicly readable through Sanity. Do not enter private board information.',
    },
  ],
  preview: {
    select: {
      title: 'title',
      meetingNumber: 'meetingNumber',
      enabled: 'enabled',
      scheduleMode: 'scheduleMode',
    },
    prepare({
      title,
      meetingNumber,
      enabled,
      scheduleMode,
    }: {
      title?: string
      meetingNumber?: string
      enabled?: boolean
      scheduleMode?: string
    }) {
      const onOff = enabled === false ? 'OFF' : 'ON'
      const mode =
        scheduleMode === 'off'
          ? 'off'
          : scheduleMode === 'recurring'
            ? 'recurring'
            : scheduleMode === 'events'
              ? 'events'
              : 'always'
      return {
        title: title || 'Meeting Settings',
        subtitle: meetingNumber
          ? `${onOff} · ${mode} · Meeting ${meetingNumber}`
          : `${onOff} · ${mode} · No meeting number set`,
      }
    },
  },
}
