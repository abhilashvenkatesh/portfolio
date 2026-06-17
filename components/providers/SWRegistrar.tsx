"use client";

import { useEffect } from "react";

export default function SWRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW registration failure is non-fatal — cache warming is best-effort.
      });
    };

    if ("requestIdleCallback" in window) {
      (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(register);
    } else {
      setTimeout(register, 2000);
    }
  }, []);

  return null;
}
