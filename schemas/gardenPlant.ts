import PlantQrField from '../components/PlantQrField'

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
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: (R: any) => R.required(),
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Used in the public plant URL and QR code (e.g. /garden-plants#tomato).',
      options: {source: 'title', maxLength: 96},
      validation: (R: any) => R.required(),
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description',
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
    select: {title: 'title', media: 'image', enabled: 'enabled'},
    prepare({title, media, enabled}: {title?: string; media?: unknown; enabled?: boolean}) {
      return {
        title: title || '(untitled)',
        subtitle: enabled === false ? 'Hidden' : 'A–Z index',
        media,
      }
    },
  },
}
