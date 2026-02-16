export default {
  name: 'garden',
  type: 'document',
  title: 'Garden',
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
      description: 'List of paragraphs for the What\'s Going On section (displayed in order).',
      of: [
        {
          type: 'object',
          name: 'paragraphItem',
          title: 'Paragraph',
          fields: [
            {
              name: 'paragraph',
              type: 'text',
              title: 'Paragraph',
              rows: 3,
            },
          ],
          preview: {
            select: { paragraph: 'paragraph' },
            prepare({ paragraph }: { paragraph?: string }) {
              const text = paragraph || '(empty)'
              return { title: text.slice(0, 60) + (text.length > 60 ? '…' : '') }
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
    select: {},
    prepare() {
      return { title: 'Garden', subtitle: 'Intro, What\'s Going On & FAQ' }
    },
  },
}
