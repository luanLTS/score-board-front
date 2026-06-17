import type { StorageAdapter, StorageLike } from "./types";

const resolveStorage = (storage?: StorageLike): StorageLike | null => {
  if (storage) return storage;
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const createLocalStorageAdapter = <T>(
  key: string,
  storage?: StorageLike,
): StorageAdapter<T> => ({
  load: () => {
    const resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) return null;

    try {
      const savedValue = resolvedStorage.getItem(key);
      return savedValue ? (JSON.parse(savedValue) as T) : null;
    } catch {
      return null;
    }
  },
  save: (value: T) => {
    const resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) return;

    try {
      resolvedStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  },
  clear: () => {
    const resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) return;

    try {
      resolvedStorage.removeItem(key);
    } catch {
      return;
    }
  },
});
