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
      name: 'enabled',
      type: 'boolean',
      title: 'Browser join enabled',
      description:
        'Master switch. When unchecked, meet.weareedison.org blocks joins even during the scheduled window.',
      initialValue: true,
    },
    {
      name: 'scheduleMode',
      type: 'string',
      title: 'When is join open?',
      description:
        'Controls when meet.weareedison.org and the Squarespace banner allow joining.',
      options: {
        list: [
          {title: 'Always (manual on/off only)', value: 'always'},
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
          if (!value) return 'Pick which week of the month'
          return true
        }),
    },
    {
      name: 'recurringDayOfWeek',
      type: 'string',
      title: 'Day of week',
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
      description: '24-hour local time, e.g. 18:30 for 6:30 PM',
      hidden: ({document}: {document?: {scheduleMode?: string}}) =>
        document?.scheduleMode !== 'recurring',
    },
    {
      name: 'recurringEndTime',
      type: 'string',
      title: 'Meeting end time',
      description: '24-hour local time, e.g. 20:00 for 8:00 PM',
      hidden: ({document}: {document?: {scheduleMode?: string}}) =>
        document?.scheduleMode !== 'recurring',
    },
    {
      name: 'timezone',
      type: 'string',
      title: 'Timezone',
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
      description: 'For PTA board only — not shown on the public meet page.',
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
        scheduleMode === 'recurring'
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
