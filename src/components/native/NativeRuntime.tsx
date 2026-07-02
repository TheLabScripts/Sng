"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { isNativeApp } from "@/lib/native";

export function NativeRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const native = isNativeApp();
    document.documentElement.classList.toggle("native-app", native);

    if (!native && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      void navigator.serviceWorker.register("/sw.js");
    }

    if (native && (pathname === "/" || pathname === "")) {
      window.location.replace("/app/");
    }
  }, [pathname]);

  return null;
}
