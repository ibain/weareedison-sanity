/** Public site origin + path for garden plant deep links / QR tags. */
export const SITE_ORIGIN = 'https://www.weareedison.org'
export const GARDEN_PLANTS_PATH = '/garden-plants'

export function gardenPlantPublicUrl(slug: string): string {
  return `${SITE_ORIGIN}${GARDEN_PLANTS_PATH}#${slug}`
}
