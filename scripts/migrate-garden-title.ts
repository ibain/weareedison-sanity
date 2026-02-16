/**
 * One-time migration: set the Garden document's "Page name" (title) to "Garden"
 * if it's missing or empty. Run with:
 *   npx sanity exec scripts/migrate-garden-title.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli'

const client = getCliClient()

async function main() {
  const doc = await client.getDocument('garden')
  if (!doc) {
    console.log('Garden document not found (id: garden). It will be created when you first open Garden in the Studio.')
    return
  }
  const current = (doc as { title?: string }).title
  if (current && String(current).trim()) {
    console.log('Garden document already has a title:', current)
    return
  }
  await client.patch('garden').set({ title: 'Garden' }).commit()
  console.log('Garden document title set to "Garden".')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
