"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "./ThemeProvider";
import ModelProvider from "./ModelProvider";
import SWRegistrar from "./SWRegistrar";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ModelProvider>
        <SWRegistrar />
        {children}
      </ModelProvider>
    </ThemeProvider>
  );
}
