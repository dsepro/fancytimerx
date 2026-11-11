"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { mountDaylight, type DaylightHandle } from "@/lib/daylight-world";

// Same five tokens drive the whole 20-colour pixel palette, so the switch
// always sits inside the app's own colour world.
const LIGHT_TOKENS = {
  "--ld-bg": "#eff6f1",
  "--ld-surface": "#6fae95",
  "--ld-fg": "#122c40",
  "--ld-muted": "#8fb7d8",
  "--ld-accent": "#2fb6e8",
} as React.CSSProperties;

const DARK_TOKENS = {
  "--ld-bg": "#0a1222",
  "--ld-surface": "#12697c",
  "--ld-fg": "#e8f1f7",
  "--ld-muted": "#7c8cd6",
  "--ld-accent": "#22d3ee",
} as React.CSSProperties;

interface DaylightSwitchProps {
  /** Freeze the animation while the countdown runs. */
  paused?: boolean;
  language?: string;
}

export function DaylightSwitch({ paused = false, language = "zh-hk" }: DaylightSwitchProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<DaylightHandle | null>(null);
  const { resolvedTheme, setTheme } = useTheme();
  const isNight = resolvedTheme === "dark";

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handle = mountDaylight(root);
    handleRef.current = handle;

    // The switch owns the drag; the app owns the theme.
    const onDaylightChange = (event: Event) => {
      const night = Boolean((event as CustomEvent<{ night: boolean }>).detail?.night);
      setTheme(night ? "dark" : "light");
    };
    root.addEventListener("daylight:change", onDaylightChange);

    return () => {
      root.removeEventListener("daylight:change", onDaylightChange);
      handle.destroy();
      handleRef.current = null;
    };
  }, [setTheme]);

  useEffect(() => {
    handleRef.current?.setPaused(paused);
  }, [paused]);

  useEffect(() => {
    const handle = handleRef.current;
    if (!handle) return;
    // Re-read the tokens first: React has already applied the new inline
    // custom properties by the time this effect runs.
    handle.refreshPalette();
    handle.setNight(isNight);
  }, [isNight]);

  return (
    <div
      ref={rootRef}
      data-ld-part="toggle-daylight"
      lang={language === "zh-hk" ? "zh-HK" : "en"}
      style={isNight ? DARK_TOKENS : LIGHT_TOKENS}
    >
      <canvas className="scene" aria-hidden="true" />
      <button
        className="hit"
        type="button"
        role="switch"
        aria-checked={isNight}
        aria-label={
          language === "zh-hk"
            ? isNight
              ? "切換到白天"
              : "切換到夜晚"
            : isNight
              ? "Switch to day"
              : "Switch to night"
        }
      />
      <span className="vh" role="status" aria-live="polite" data-status="" />
      <span className="probe" aria-hidden="true" />
    </div>
  );
}
