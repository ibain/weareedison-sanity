export default {
    name: 'slides',
    type: 'document',
    title: 'Evergreen Slides',
    fields: [
      { name: 'title',   type: 'string', validation: (R:any)=>R.required() },
      { name: 'meta',    type: 'string' },
      { name: 'excerpt', type: 'text', rows: 2, title: 'Excerpt (optional)', description: 'Optional description text to display below the title' },
      { name: 'href',    type: 'url', title: 'Link (optional)' },
      { 
        name: 'image',   
        type: 'image', 
        title: 'Slide Image',
        description: 'Upload any image. IMPORTANT: After upload, use the crop tool to select a 16:9 area (width should be 1.78x the height). This ensures proper display in the slider.',
        options: { 
          hotspot: true,
          crop: true,
          accept: 'image/*'
        },
        validation: (Rule: any) => Rule.required().custom((value: any) => {
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
      { name: 'enabled', type: 'boolean', initialValue: true },
      { name: 'order',   type: 'number',  initialValue: 0 }
    ],
    orderings: [{ title:'Order', name:'orderAsc', by:[{ field:'order', direction:'asc' }] }]
  }