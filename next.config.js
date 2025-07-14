/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    optimizeCss: true,
    gzipSize: true,
  },
  
  // Enhanced caching and performance headers
  headers: async () => {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Proxy API requests to backend
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  },
  
  // Enable external access
  output: 'standalone',
  
  // Enhanced image optimization
  images: {
    domains: ['localhost', 'cdn.dietint.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.dietint.com',
      },
    ],
  },
  
  // Bundle analyzer and optimization
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@mui/styled-engine': '@mui/styled-engine-sc',
      };
    }
    
    // Enable tree shaking for lodash
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/lodash/,
      use: {
        loader: 'babel-loader',
        options: {
          plugins: ['lodash'],
        },
      },
    });

    return config;
  },
  
  // Compress responses
  compress: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // Optimize for production
  poweredByHeader: false,
  generateEtags: true,
  
  // Optimize CSS
  optimizeFonts: true,
  
  // Enable concurrent features
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },
  
  // Environment variables for build optimization
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
};

module.exports = nextConfig;