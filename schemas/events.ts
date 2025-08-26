export default {
    name: 'events',
    type: 'document',
    title: 'Events',
    orderings: [
      {
        title: '📅 Event Start Date (Oldest First)',
        name: 'startDateAsc',
        by: [
          {field: 'startDate', direction: 'asc'}
        ]
      },
      {
        title: '📅 Event Start Date (Newest First)',
        name: 'startDateDesc',
        by: [
          {field: 'startDate', direction: 'desc'}
        ]
      },
      {
        title: '📝 Title A-Z',
        name: 'titleAsc',
        by: [
          {field: 'title', direction: 'asc'}
        ]
      },
    ],
    fields: [
      { name: 'title', type: 'string', validation: (R:any)=>R.required() },
      { name: 'slug',  type: 'slug', options: { source: 'title', maxLength: 96 } },
      { name: 'startDate', type: 'datetime', validation: (R:any)=>R.required(), description: 'The start date and time of the event.' },
      { name: 'endDate',   type: 'datetime', description: 'The end date and time of the event. If left blank, the event will be shown as a single day event.' },
      { name: 'displayTime', type: 'boolean', title: 'Display Time', description: 'When checked, the event time will be shown on the website. When unchecked, only the date will be displayed.', initialValue: true },
      { name: 'location',  type: 'string', title: 'Location' },
      { name: 'locationLink', type: 'url', title: 'Location Link (optional)', description: 'Add a Google Maps or directions link - will show as "(map)" after location' },
      { name: 'excerpt',   type: 'text',   rows: 2 },
      { name: 'featured',  type: 'boolean', title: 'Show on home slider', initialValue: false, description: 'When checked, the event will be shown on the home slider.' },
      { name: 'sourceUrl', type: 'url',    title: 'Zoom / External link (optional)' },
      { name: 'linkButtonTitle', type: 'string', title: 'Link Button Title (optional)', description: 'Text for the external link button (defaults to "Would you like to know more?" if blank). Zoom link button is automatically applied.', initialValue: 'Would you like to know more?' },
      { 
        name: 'image',     
        type: 'image',  
        title: 'Event Image',
        description: 'Use a wide 16:9 image. Recommended: 1600×900 (min), 1920×1080 (preferred), 2400×1350 (hi-res), or 1200×675 (small). JPG/PNG ≤2 MB. After upload: Edit → Crop → 16:9 and set Hotspot on the subject.',
                options: { 
          hotspot: true,
          crop: true,
          accept: 'image/*'
        }, 
        validation: (Rule: any) => Rule.custom((value: any) => {
          if (value && value.crop) {
            const { width, height } = value.crop;
            const ratio = width / height;
            const targetRatio = 16/9;
            const tolerance = 0.1; // Allow small variance
            
            if (Math.abs(ratio - targetRatio) > tolerance) {
              return `Image must be cropped to 16:9 ratio (current: ${ratio.toFixed(2)}:1, target: ${targetRatio.toFixed(2)}:1). Please use the crop tool.`;
            }
          }
          return true;
        }),
        fields:[
          { name:'alt', type:'string', title:'Accessibility image description', validation: (Rule: any) => Rule.required() }
        ]
      },
    ],
    preview: {
      select: {title: 'title', startDate: 'startDate', media: 'image'},
      prepare({title, startDate, media}) {
        const d = startDate ? new Date(startDate) : null
        const subtitle = d
          ? d.toLocaleString(undefined, {year:'numeric', month:'short', day:'numeric'})
          : 'No date'
        return {title, subtitle, media}
      },
    }
  }
  