
import type {NextConfig} from 'next';
import withPWAInit from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

const withPWA = withPWAInit({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // For development, you might want to disable PWA features.
  // disable: process.env.NODE_ENV === 'development',
  // fallbacks: {
    // document: '/offline', // example for a custom offline fallback page
  // }
});

export default withPWA(nextConfig);
