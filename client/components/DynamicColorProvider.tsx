"use client";

import { useEffect } from "react";

export default function DynamicColorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // This function will be called from Android via evaluateJavascript
    (window as any).updateDynamicColors = (colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      surface: string;
      text: string;
    }) => {
      const root = document.documentElement;

      const hexToRgb = (hex: string) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
          ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
          : null;
      };

      if (colors.primary) root.style.setProperty("--primary-rgb", hexToRgb(colors.primary) || "37, 99, 235");
      if (colors.secondary) root.style.setProperty("--secondary-rgb", hexToRgb(colors.secondary) || "124, 58, 237");
      if (colors.accent) root.style.setProperty("--accent-rgb", hexToRgb(colors.accent) || "6, 182, 212");
      if (colors.background) root.style.setProperty("--background-rgb", hexToRgb(colors.background) || "5, 8, 22");
      if (colors.surface) root.style.setProperty("--cards-rgb", hexToRgb(colors.surface) || "17, 24, 39");
      if (colors.text) root.style.setProperty("--text-rgb", hexToRgb(colors.text) || "255, 255, 255");
    };
  }, []);

  return <>{children}</>;
}
