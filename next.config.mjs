/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export writes a deployable /out folder for Cloudflare Pages.
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;