import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        // hero photography served from /public
        pathname: '/hero/**',
      },
    ],
  },
  /**
   * Every public page lives under /ar or /en. The bare root and the legacy
   * unprefixed catalogue paths (shared before localisation) land on Arabic.
   * Permanent, so search engines consolidate on the prefixed URLs.
   */
  async redirects() {
    return [
      { source: '/', destination: '/ar', permanent: true },
      { source: '/:seg(services|quote|search|solutions)', destination: '/ar/:seg', permanent: true },
      { source: '/:seg(c|p|services|solutions)/:rest*', destination: '/ar/:seg/:rest*', permanent: true },
    ]
  },
  /**
   * Baseline security headers.
   *
   * SAMEORIGIN rather than DENY: the Payload admin uses same-origin iframes
   * for some previews, and DENY would break them.
   *
   * No full CSP yet — Next injects inline scripts and styles, so a correct
   * policy needs nonces wired through. Flagged for launch, not attempted here.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
