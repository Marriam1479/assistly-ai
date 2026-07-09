import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ToolType = "email" | "meeting" | "task";

export interface DocItem {
  id: string;
  type: ToolType;
  title: string;
  content: string;
  createdAt: number;
  favorite: boolean;
  saved: boolean;
  deleted: boolean;
}

export interface Settings {
  theme: "light" | "dark";
  language: string;
  responseLength: "short" | "medium" | "long";
  defaultTone: string;
  notifications: boolean;
  privacyStoreHistory: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  language: "English",
  responseLength: "medium",
  defaultTone: "Professional",
  notifications: true,
  privacyStoreHistory: true,
};

const DOCS_KEY = "awpa.docs";
const SETTINGS_KEY = "awpa.settings";

interface Ctx {
  hydrated: boolean;
  docs: DocItem[];
  settings: Settings;
  addDoc: (d: Omit<DocItem, "id" | "createdAt" | "favorite" | "saved" | "deleted"> & Partial<DocItem>) => DocItem;
  updateDoc: (id: string, patch: Partial<DocItem>) => void;
  removeDoc: (id: string) => void;
  restoreDoc: (id: string) => void;
  setSettings: (patch: Partial<Settings>) => void;
}

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [settings, setSettingsState] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    try {
      const rawDocs = localStorage.getItem(DOCS_KEY);
      if (rawDocs) setDocs(JSON.parse(rawDocs));
      const rawSettings = localStorage.getItem(SETTINGS_KEY);
      if (rawSettings) setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(rawSettings) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
  }, [docs, hydrated]);

  useEffect(() => {
    if (hydrated) localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  const addDoc: Ctx["addDoc"] = useCallback((d) => {
    const doc: DocItem = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      favorite: false,
      saved: false,
      deleted: false,
      ...d,
    } as DocItem;
    setDocs((prev) => [doc, ...prev]);
    return doc;
  }, []);

  const updateDoc = useCallback((id: string, patch: Partial<DocItem>) => {
    setDocs((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const removeDoc = useCallback((id: string) => {
    setDocs((prev) => prev.map((x) => (x.id === id ? { ...x, deleted: true } : x)));
  }, []);

  const restoreDoc = useCallback((id: string) => {
    setDocs((prev) => prev.map((x) => (x.id === id ? { ...x, deleted: false } : x)));
  }, []);

  const setSettings = useCallback((patch: Partial<Settings>) => {
    setSettingsState((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({ hydrated, docs, settings, addDoc, updateDoc, removeDoc, restoreDoc, setSettings }),
    [hydrated, docs, settings, addDoc, updateDoc, removeDoc, restoreDoc, setSettings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export const TOOL_META: Record<ToolType, { label: string; short: string }> = {
  email: { label: "Smart Email", short: "Email" },
  meeting: { label: "Meeting Summary", short: "Meeting" },
  task: { label: "Task Plan", short: "Plan" },
};