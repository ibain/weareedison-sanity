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
      initialValue: 'Edison PTA Meeting',
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
        'When unchecked, meet.weareedison.org shows a closed message and blocks joins.',
      initialValue: true,
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
    select: {title: 'title', meetingNumber: 'meetingNumber', enabled: 'enabled'},
    prepare({
      title,
      meetingNumber,
      enabled,
    }: {
      title?: string
      meetingNumber?: string
      enabled?: boolean
    }) {
      const onOff = enabled === false ? 'OFF' : 'ON'
      return {
        title: title || 'Meeting Settings',
        subtitle: meetingNumber
          ? `${onOff} · Meeting ${meetingNumber}`
          : `${onOff} · No meeting number set`,
      }
    },
  },
}
