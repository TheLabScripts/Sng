import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Snagd",
    short_name: "Snagd",
    description: "Reseller command center for local flips worth chasing.",
    start_url: "/app/",
    scope: "/",
    display: "standalone",
    background_color: "#1a1b26",
    theme_color: "#1a1b26",
    categories: ["business", "productivity"],
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
