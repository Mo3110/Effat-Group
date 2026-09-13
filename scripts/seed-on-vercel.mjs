/**
 * Runs the catalogue seed during a Vercel build.
 *
 * Why here and not from a laptop: the Neon and Blob credentials are marked
 * Sensitive in Vercel, which makes them write-only — `vercel env pull` returns
 * "[SENSITIVE]". The build is the one place the real values exist.
 *
 * Both seeds are idempotent (upsert by slug), so this is safe on every deploy.
 * Locally (no VERCEL env) it is a no-op — `npm run seed` covers dev.
 */
import { execSync } from 'node:child_process'

if (!process.env.VERCEL) {
  console.log('seed-on-vercel: not on Vercel, skipping')
  process.exit(0)
}
if (!process.env.DATABASE_URL && !process.env.DATABASE_URI) {
  console.log('seed-on-vercel: no database configured, skipping')
  process.exit(0)
}

const env = { ...process.env, PAYLOAD_DB_PUSH: 'true', NODE_OPTIONS: '--no-deprecation --import=tsx/esm' }
const run = (label, file) => {
  console.log(`\n▶ seed-on-vercel: ${label}`)
  execSync(`npx tsx ${file}`, { stdio: 'inherit', env })
}

run('categories + services', 'src/seed/run.ts')
run('products + images', 'src/seed/products.ts')
console.log('\n✔ seed-on-vercel: done')
