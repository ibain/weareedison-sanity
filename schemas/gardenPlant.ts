import PlantQrField from '../components/PlantQrField'

const lightOptions = [
  {title: 'Full sun', value: 'full-sun'},
  {title: 'Full sun to part shade', value: 'full-sun-part-shade'},
  {title: 'Part shade', value: 'part-shade'},
  {title: 'Part shade to full shade', value: 'part-shade-full-shade'},
  {title: 'Full shade', value: 'full-shade'},
]

const waterOptions = [
  {title: 'Low', value: 'low'},
  {title: 'Moderate', value: 'moderate'},
  {title: 'High', value: 'high'},
]

export default {
  name: 'gardenPlant',
  type: 'document',
  title: 'Garden Plant',
  orderings: [
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [{field: 'title', direction: 'asc'}],
    },
    {
      title: 'Title Z-A',
      name: 'titleDesc',
      by: [{field: 'title', direction: 'desc'}],
    },
  ],
  fieldsets: [
    {
      name: 'spanish',
      title: 'Spanish (optional)',
      description:
        'Stored now for a future browser language toggle. English still drives the public page.',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Name',
      description: 'Common name (English), e.g. Rosemary.',
      validation: (R: any) => R.required(),
    },
    {
      name: 'titleEs',
      type: 'string',
      title: 'Name (Spanish)',
      description: 'e.g. Romero.',
      fieldset: 'spanish',
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Used in the public plant URL and QR code (e.g. /garden-plants#rosemary).',
      options: {source: 'title', maxLength: 96},
      validation: (R: any) => R.required(),
    },
    {
      name: 'scientificName',
      type: 'string',
      title: 'Scientific name',
      description: 'Latin binomial, e.g. Salvia rosmarinus.',
    },
    {
      name: 'light',
      type: 'string',
      title: 'Light',
      options: {
        list: lightOptions,
        layout: 'dropdown',
      },
    },
    {
      name: 'spacing',
      type: 'string',
      title: 'Spacing',
      description: 'Free text for now (catalogs vary), e.g. 2-3 ft or 6-12 in.',
    },
    {
      name: 'water',
      type: 'string',
      title: 'Water',
      options: {
        list: waterOptions,
        layout: 'dropdown',
      },
    },
    {
      name: 'cycle',
      type: 'string',
      title: 'Cycle',
      description: 'Growth habit, e.g. Perennial evergreen shrub.',
    },
    {
      name: 'cycleEs',
      type: 'string',
      title: 'Cycle (Spanish)',
      fieldset: 'spanish',
    },
    {
      name: 'goodWith',
      type: 'string',
      title: 'Good with',
      description: 'Companion plants, e.g. Sage, beans, carrots.',
    },
    {
      name: 'goodWithEs',
      type: 'string',
      title: 'Good with (Spanish)',
      fieldset: 'spanish',
    },
    {
      name: 'description',
      type: 'text',
      title: 'About',
      description: 'Short plant blurb shown on the website.',
      rows: 4,
    },
    {
      name: 'descriptionEs',
      type: 'text',
      title: 'About (Spanish)',
      fieldset: 'spanish',
      rows: 4,
    },
    {
      name: 'harvest',
      type: 'text',
      title: 'Harvest',
      description: 'One tip per line — rendered as bullets on the website.',
      rows: 4,
    },
    {
      name: 'harvestEs',
      type: 'text',
      title: 'Harvest (Spanish)',
      description: 'One tip per line.',
      fieldset: 'spanish',
      rows: 4,
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      description: 'Plant photo. Set hotspot on the main subject. JPG/PNG recommended.',
      options: {hotspot: true, accept: 'image/*'},
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Accessibility image description',
          validation: (Rule: any) => Rule.required(),
        },
      ],
    },
    {
      name: 'enabled',
      type: 'boolean',
      title: 'Enabled',
      description: 'When unchecked, this plant is hidden from the website.',
      initialValue: true,
    },
    {
      name: 'qrTag',
      type: 'string',
      title: 'Plant tag QR',
      description: 'Download a QR code or copy the public link for physical garden tags.',
      readOnly: true,
      components: {input: PlantQrField},
    },
  ],
  preview: {
    select: {title: 'title', media: 'image', enabled: 'enabled', scientificName: 'scientificName'},
    prepare({
      title,
      media,
      enabled,
      scientificName,
    }: {
      title?: string
      media?: unknown
      enabled?: boolean
      scientificName?: string
    }) {
      const bits = [
        scientificName || null,
        enabled === false ? 'Hidden' : null,
      ].filter(Boolean)
      return {
        title: title || '(untitled)',
        subtitle: bits.length ? bits.join(' · ') : 'A–Z index',
        media,
      }
    },
  },
}
