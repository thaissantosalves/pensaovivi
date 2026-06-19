"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type FontSize = "normal" | "large" | "xlarge";

type ThemeSettings = {
  darkMode: boolean;
  fontSize: FontSize;
  highContrast: boolean;
  reducedMotion: boolean;
};

type ThemeContextValue = ThemeSettings & {
  toggleDarkMode: () => void;
  setFontSize: (size: FontSize) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
};

const STORAGE_KEY = "pensaovivi-theme";

const defaultSettings: ThemeSettings = {
  darkMode: false,
  fontSize: "normal",
  highContrast: false,
  reducedMotion: false,
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function loadSettings(): ThemeSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

function applySettings(settings: ThemeSettings) {
  const root = document.documentElement;
  root.dataset.theme = settings.darkMode ? "dark" : "light";
  root.dataset.fontSize = settings.fontSize;
  root.dataset.contrast = settings.highContrast ? "high" : "normal";
  root.dataset.motion = settings.reducedMotion ? "reduce" : "normal";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    applySettings(loaded);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applySettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, ready]);

  const update = useCallback((patch: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo(
    () => ({
      ...settings,
      toggleDarkMode: () => update({ darkMode: !settings.darkMode }),
      setFontSize: (fontSize: FontSize) => update({ fontSize }),
      toggleHighContrast: () =>
        update({ highContrast: !settings.highContrast }),
      toggleReducedMotion: () =>
        update({ reducedMotion: !settings.reducedMotion }),
    }),
    [settings, update]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
}
