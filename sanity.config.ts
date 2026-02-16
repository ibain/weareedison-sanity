import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {structure} from './deskStructure' // your file below
import StudioIcon from './components/studioIcon'
import {edisonTheme} from './theme/edisonTheme'

export default defineConfig({
  name: 'default',
  title: 'We Are Edison',
  projectId: 'u8cybb7l',
  dataset: 'production',
  icon: StudioIcon,
  theme: edisonTheme,
  plugins: [
    structureTool({structure}),
    visionTool(),               // optional
  ],
  schema: {types: schemaTypes},
})