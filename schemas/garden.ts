export default {
  name: 'garden',
  type: 'document',
  title: 'Garden',
  // Hide the big document heading; the doc is always "Garden" in the Studio
  __experimental_formPreviewTitle: false,
  fields: [
    {
      name: 'intro',
      type: 'text',
      title: 'Intro',
      description: 'Intro section shown at the top of the Garden page.',
      rows: 4,
    },
    {
      name: 'whatsGoingOn',
      type: 'array',
      title: "What's Going On",
      description: 'Cards with a title/icon and text. Renders in a grid (columns set in Squarespace).',
      of: [
        {
          type: 'object',
          name: 'whatsGoingOnItem',
          title: 'Item',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title or icon',
              description: 'Short label or symbol (e.g. ★) shown above the text.',
              rows: 1,
            },
            {
              name: 'image',
              type: 'image',
              title: 'Image (optional)',
              description: 'Optional image for this card. Cropped to a consistent size on the site.',
              options: { hotspot: true, accept: 'image/*' },
            },
            {
              name: 'paragraph',
              type: 'text',
              title: 'Text',
              rows: 3,
            },
          ],
          preview: {
            select: { title: 'title', paragraph: 'paragraph', media: 'image' },
            prepare({ title, paragraph, media }: { title?: string; paragraph?: string; media?: unknown }) {
              const t = title && String(title).trim() ? title : '(no title)'
              const p = paragraph || ''
              return { title: t, subtitle: p.slice(0, 50) + (p.length > 50 ? '…' : ''), media }
            },
          },
        },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      title: 'FAQ',
      description: 'Frequently asked questions: title and answer for each.',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          title: 'FAQ Item',
          fields: [
            { name: 'title', type: 'string', title: 'Question / Title', validation: (R: any) => R.required() },
            { name: 'content', type: 'text', title: 'Answer', rows: 4 },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }: { title?: string }) {
              return { title: title || '(untitled)' }
            },
          },
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return { title: 'Garden', subtitle: 'Intro, What\'s Going On & FAQ' }
    },
  },
}
