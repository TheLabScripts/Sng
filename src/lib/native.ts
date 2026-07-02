type CapacitorWindow = Window & {
  Capacitor?: {
    isNativePlatform?: () => boolean;
    getPlatform?: () => string;
  };
};

export function isNativeApp() {
  if (typeof window === "undefined") return false;
  const nativeWindow = window as CapacitorWindow;

  return Boolean(nativeWindow.Capacitor?.isNativePlatform?.()) || window.location.protocol === "capacitor:";
}
