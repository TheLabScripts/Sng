/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export → drops a fully static site into /out for Cloudflare Pages.
  output: "export",
  // Cloudflare Pages serves static files; Next's image optimizer needs a server, so disable it.
  images: { unoptimized: true },
  // Cleaner static URLs (/pricing/ instead of /pricing.html).
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
