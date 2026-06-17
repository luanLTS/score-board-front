import { describe, expect, it } from "vitest";

import { createLocalStorageAdapter } from "./localStorageAdapter";

type StoredScore = {
  player: string;
  score: number;
};

class MemoryStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

class ThrowingStorage {
  getItem(): string | null {
    throw new Error("Storage unavailable");
  }

  setItem(): void {
    throw new Error("Storage unavailable");
  }

  removeItem(): void {
    throw new Error("Storage unavailable");
  }
}

describe("createLocalStorageAdapter", () => {
  it("loads null when no value was saved", () => {
    const adapter = createLocalStorageAdapter<StoredScore>(
      "scoreboard:test",
      new MemoryStorage(),
    );

    expect(adapter.load()).toBeNull();
  });

  it("saves and loads JSON values from the provided storage", () => {
    const adapter = createLocalStorageAdapter<StoredScore>(
      "scoreboard:test",
      new MemoryStorage(),
    );

    adapter.save({ player: "Ana", score: 7 });

    expect(adapter.load()).toEqual({ player: "Ana", score: 7 });
  });

  it("clears saved values from the provided storage", () => {
    const adapter = createLocalStorageAdapter<StoredScore>(
      "scoreboard:test",
      new MemoryStorage(),
    );

    adapter.save({ player: "Ana", score: 7 });
    adapter.clear();

    expect(adapter.load()).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    const storage = new MemoryStorage();
    storage.setItem("scoreboard:test", "{invalid");
    const adapter = createLocalStorageAdapter<StoredScore>(
      "scoreboard:test",
      storage,
    );

    expect(adapter.load()).toBeNull();
  });

  it("does not throw when storage operations fail", () => {
    const adapter = createLocalStorageAdapter<StoredScore>(
      "scoreboard:test",
      new ThrowingStorage(),
    );

    expect(adapter.load()).toBeNull();
    expect(() => adapter.save({ player: "Ana", score: 7 })).not.toThrow();
    expect(() => adapter.clear()).not.toThrow();
  });

  it("falls back safely when storage is unavailable", () => {
    const adapter = createLocalStorageAdapter<StoredScore>("scoreboard:test");

    expect(adapter.load()).toBeNull();
    expect(() => adapter.save({ player: "Ana", score: 7 })).not.toThrow();
    expect(() => adapter.clear()).not.toThrow();
  });
});
