import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Brands } from './collections/Brands'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Services } from './collections/Services'
import { Quotes } from './collections/Quotes'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// DATABASE_URI is ours; DATABASE_URL is what the Vercel ⇄ Neon integration
// injects (the suffix is fixed by Vercel). Accept both so no secret has to be
// copied between variables by hand.
const DATABASE_URI = process.env.DATABASE_URI || process.env.DATABASE_URL || 'file:./effat.db'

/**
 * Local development uses a SQLite file; a hosted deployment uses Postgres.
 * The adapter is chosen from the connection string, so the same code runs in
 * both places with no build flags — set DATABASE_URI to a postgres:// URL and
 * it switches.
 */
const isPostgres = /^postgres(ql)?:\/\//.test(DATABASE_URI)

/**
 * Serverless hosts (Vercel, Netlify) have an ephemeral filesystem: anything
 * Payload writes to ./media is gone on the next deploy. When a blob token is
 * present, uploads go to Vercel Blob instead. Without the token this is a
 * no-op and uploads stay on local disk, which is correct for development.
 */
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

const storagePlugins = blobToken
  ? [
      vercelBlobStorage({
        enabled: true,
        collections: { media: true },
        token: blobToken,
      }),
    ]
  : []

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '— Effat Group',
    },
  },
  collections: [Users, Media, Brands, Categories, Products, Services, Quotes],
  editor: lexicalEditor(),
  // Explicit rather than relying on the default — the playground exposes the
  // full schema and must never be reachable in production.
  graphQL: {
    disablePlaygroundInProduction: true,
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: isPostgres
    ? postgresAdapter({ pool: { connectionString: DATABASE_URI } })
    : sqliteAdapter({ client: { url: DATABASE_URI } }),
  plugins: storagePlugins,
  sharp,
  // Arabic is the primary market language. English is for multinationals,
  // consultants and Gulf export enquiries.
  localization: {
    locales: [
      { code: 'ar', label: 'العربية' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'ar',
    fallback: true,
  },
})
