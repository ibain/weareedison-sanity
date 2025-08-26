// theme/edisonTheme.ts
import {buildLegacyTheme} from 'sanity'

// TODO: swap these placeholders for your real brand hex codes
const props = {
  '--edison-white': '#ffffff',
  '--edison-black': '#111111',
  '--edison-primary': '#1e73be', // header / brand
  '--edison-red': '#e53935',
  '--edison-yellow': '#f4b400',
  '--edison-green': '#0f9d58',
}

export const edisonTheme = buildLegacyTheme({
  /* Base */
  '--black': props['--edison-black'],
  '--white': props['--edison-white'],
  '--component-bg': props['--edison-white'],
  '--component-text-color': props['--edison-black'],

  /* Brand */
  '--brand-primary': props['--edison-primary'],

  /* States & buttons */
  '--default-button-color': '#666',
  '--default-button-primary-color': props['--edison-primary'],
  '--default-button-success-color': props['--edison-green'],
  '--default-button-warning-color': props['--edison-yellow'],
  '--default-button-danger-color': props['--edison-red'],

  /* Navbar */
  '--main-navigation-color': props['--edison-primary'],
  '--main-navigation-color--inverted': props['--edison-white'],

  '--focus-color': props['--edison-primary'],
})
