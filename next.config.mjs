/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export writes a deployable /out folder for Cloudflare Pages.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  webpack(config, { dev }) {
    if (!dev) config.cache = false;
    return config;
  },
};

export default nextConfig;
