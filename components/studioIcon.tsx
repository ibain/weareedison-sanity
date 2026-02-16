import {STUDIO_ICON_DATA_URL} from './studioIconDataUrl'

export default function StudioIcon() {
  return (
    <img
      src={STUDIO_ICON_DATA_URL}
      alt="We Are Edison"
      width={28}
      height={28}
      style={{ display: 'block', borderRadius: 6 }}
    />
  )
}
  