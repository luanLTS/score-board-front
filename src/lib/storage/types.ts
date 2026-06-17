export type StorageAdapter<T> = {
  load: () => T | null;
  save: (value: T) => void;
  clear: () => void;
};

export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
