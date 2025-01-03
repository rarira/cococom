/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/intro',
        destination: '/intro/first',
        permanent: true,
      },
      {
        source: '/statements',
        destination: '/statements/terms',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
