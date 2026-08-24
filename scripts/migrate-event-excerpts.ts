import fs from 'node:fs'
import path from 'node:path'
import { getCliClient } from 'sanity/cli'

type EventDoc = {
  _id: string
  title?: string
  excerpt?: string | PortableTextBlock[]
}

type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: 'normal'
  markDefs: []
  children: Array<{
    _type: 'span'
    _key: string
    text: string
    marks: []
  }>
}

const client = getCliClient({ apiVersion: '2024-01-01' })

function randomKey() {
  return Math.random().toString(36).slice(2, 14)
}

function plainTextToBlocks(text: string): PortableTextBlock[] {
  const paragraphs = text
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)

  const chunks = paragraphs.length ? paragraphs : [text.trim()].filter(Boolean)

  return chunks.map((paragraph) => ({
    _type: 'block',
    _key: randomKey(),
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: randomKey(),
        text: paragraph,
        marks: [],
      },
    ],
  }))
}

function isPlainTextExcerpt(excerpt: EventDoc['excerpt']): excerpt is string {
  return typeof excerpt === 'string' && excerpt.trim().length > 0
}

function writeBackup(docs: EventDoc[]) {
  const backupDir = path.join(process.cwd(), 'scripts', 'backups')
  fs.mkdirSync(backupDir, { recursive: true })

  const stamp = new Date().toISOString().slice(0, 10)
  const backupPath = path.join(backupDir, `event-excerpts-${stamp}.json`)

  fs.writeFileSync(
    backupPath,
    JSON.stringify(
      {
        migratedAt: new Date().toISOString(),
        count: docs.length,
        events: docs.map((doc) => ({
          _id: doc._id,
          title: doc.title,
          excerpt: doc.excerpt,
        })),
      },
      null,
      2,
    ),
  )

  console.log(`Backup written to ${backupPath}`)
}

async function migrate() {
  const dryRun = process.argv.includes('--dry-run')

  const docs = await client.fetch<EventDoc[]>(
    `*[_type == "events" && defined(excerpt)]{_id, title, excerpt}`,
  )

  const toMigrate = docs.filter((doc) => isPlainTextExcerpt(doc.excerpt))

  if (!toMigrate.length) {
    console.log('No plain-text excerpts found. Nothing to migrate.')
    return
  }

  console.log(`${dryRun ? 'Dry run' : 'Migrating'} ${toMigrate.length} event(s)...`)

  if (!dryRun) {
    writeBackup(toMigrate)
  }

  for (const doc of toMigrate) {
    const legacy = doc.excerpt
    const blocks = plainTextToBlocks(legacy)

    console.log(`\n- ${doc.title ?? doc._id}`)
    console.log(`  paragraphs: ${blocks.length}`)
    console.log(`  preview: ${legacy.slice(0, 90)}${legacy.length > 90 ? '...' : ''}`)

    if (!dryRun) {
      await client
        .patch(doc._id)
        .set({
          excerptLegacy: legacy,
          excerpt: blocks,
        })
        .commit()

      console.log('  saved')
    }
  }

  if (dryRun) {
    console.log('\nDry run only. Run without --dry-run to apply.')
  } else {
    console.log('\nMigration complete.')
  }
}

migrate().catch((error) => {
  console.error(error)
  process.exit(1)
})
