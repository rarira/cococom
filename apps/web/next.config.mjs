/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    console.log("will return headers");
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
