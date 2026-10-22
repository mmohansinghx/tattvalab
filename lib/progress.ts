export const PROGRESS_KEY = "tattvalab.progress.v1";

export type ExperimentProgress = {
  preTestScore: number | null;
  postTestScore: number | null;
  completedAt: string | null;
  updatedAt: string;
};

export type ProgressMap = Record<string, ExperimentProgress>;

export function parseProgress(value: string | null): ProgressMap {
  if (!value) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const clean: ProgressMap = {};
    for (const [slug, item] of Object.entries(parsed)) {
      if (!item || typeof item !== "object") continue;
      const entry = item as Partial<ExperimentProgress>;
      clean[slug] = {
        preTestScore: typeof entry.preTestScore === "number" && Number.isFinite(entry.preTestScore) ? entry.preTestScore : null,
        postTestScore: typeof entry.postTestScore === "number" && Number.isFinite(entry.postTestScore) ? entry.postTestScore : null,
        completedAt: typeof entry.completedAt === "string" ? entry.completedAt : null,
        updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : new Date(0).toISOString(),
      };
    }
    return clean;
  } catch {
    return {};
  }
}

export function safeWriteProgress(storage: Pick<Storage, "setItem">, progress: ProgressMap) {
  try {
    storage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

const EMPTY_PROGRESS: ProgressMap = {};
let snapshot: ProgressMap | null = null;
const listeners = new Set<() => void>();
const CHANGE_EVENT = "tattvalab-progress-changed";

export function getProgressSnapshot(): ProgressMap {
  if (typeof window === "undefined") return EMPTY_PROGRESS;
  if (snapshot === null) {
    try { snapshot = parseProgress(window.localStorage.getItem(PROGRESS_KEY)); }
    catch { snapshot = EMPTY_PROGRESS; }
  }
  return snapshot;
}

export function getServerProgressSnapshot() { return EMPTY_PROGRESS; }

export function subscribeProgress(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => {
    snapshot = null;
    listener();
  };
  const onChange = () => listener();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function updateProgress(progress: ProgressMap) {
  let saved = false;
  try { saved = safeWriteProgress(window.localStorage, progress); }
  catch { saved = false; }
  snapshot = progress;
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return saved;
}
