import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.snagd.mobile",
  appName: "Snagd",
  webDir: "out",
  ios: {
    contentInset: "automatic",
    preferredContentMode: "mobile",
    scheme: "Snagd",
  },
};

export default config;
