import {useEffect, useState} from 'react'
import {type StringInputProps, useFormValue} from 'sanity'
import {Stack, Text, Button, Card, Flex, Box} from '@sanity/ui'
import QRCode from 'qrcode'
import {gardenPlantPublicUrl} from '../lib/site'

type SlugValue = {current?: string} | undefined

export default function PlantQrField(props: StringInputProps) {
  // Custom input replaces the string control; we only need sibling slug via form context.
  void props
  const slugValue = useFormValue(['slug']) as unknown as {current?: string} | null
  const slug = (slugValue as SlugValue)?.current?.trim() || ''
  const url = slug ? gardenPlantPublicUrl(slug) : ''
  const [dataUrl, setDataUrl] = useState<string>('')
  const [copyLabel, setCopyLabel] = useState('Copy link')

  useEffect(() => {
    let cancelled = false
    if (!url) {
      setDataUrl('')
      return
    }
    QRCode.toDataURL(url, {width: 280, margin: 2, errorCorrectionLevel: 'M'})
      .then((png) => {
        if (!cancelled) setDataUrl(png)
      })
      .catch(() => {
        if (!cancelled) setDataUrl('')
      })
    return () => {
      cancelled = true
    }
  }, [url])

  const downloadPng = () => {
    if (!dataUrl || !slug) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `plant-${slug}-qr.png`
    a.click()
  }

  const copyLink = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy link'), 1500)
    } catch {
      setCopyLabel('Copy failed')
      setTimeout(() => setCopyLabel('Copy link'), 1500)
    }
  }

  if (!slug) {
    return (
      <Card padding={3} radius={2} tone="caution" border>
        <Text size={1}>Generate a slug first to create the plant tag QR and public link.</Text>
      </Card>
    )
  }

  return (
    <Stack space={3}>
      <Text size={1} muted>
        Scan or open this link to jump to this plant on the website. Download the QR for physical garden tags.
      </Text>
      {dataUrl ? (
        <Box>
          <img src={dataUrl} alt={`QR code for ${slug}`} width={180} height={180} />
        </Box>
      ) : (
        <Text size={1}>Generating QR…</Text>
      )}
      <Card padding={3} radius={2} border>
        <Text size={1} style={{wordBreak: 'break-all'}}>
          {url}
        </Text>
      </Card>
      <Flex gap={2} wrap="wrap">
        <Button text="Download PNG" mode="default" tone="primary" disabled={!dataUrl} onClick={downloadPng} />
        <Button text={copyLabel} mode="ghost" onClick={copyLink} />
      </Flex>
    </Stack>
  )
}
