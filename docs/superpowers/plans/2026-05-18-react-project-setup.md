# React Project Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configure the project with React, TypeScript, Vite, and TailwindCSS, with a minimal first app screen.

**Architecture:** Use a small Vite app structure. Keep React composition in `src/app`, global styles in `src/styles`, and avoid future feature folders until real code needs them.

**Tech Stack:** React, TypeScript, Vite, TailwindCSS via `@tailwindcss/vite`.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`

- [ ] **Step 1: Create npm metadata and scripts**

Create `package.json` with `dev`, `build`, `preview`, and `typecheck` scripts, plus React, Vite, TypeScript, TailwindCSS, and the official Vite plugins.

- [ ] **Step 2: Create Vite entry files**

Create `index.html` and `vite.config.ts`. The Vite config must include `react()` and `tailwindcss()`.

- [ ] **Step 3: Create TypeScript configs**

Create strict TypeScript configs for app and Vite config compilation.

### Task 2: React App Bootstrap

**Files:**
- Create: `src/main.tsx`
- Create: `src/app/App.tsx`
- Create: `src/styles/index.css`

- [ ] **Step 1: Create React entrypoint**

Mount `<App />` into the `root` element from `index.html`.

- [ ] **Step 2: Create initial app shell**

Render a mobile-first scoreboard preview with two participant panels and a reset action placeholder. Keep behavior minimal in this setup task.

- [ ] **Step 3: Create Tailwind stylesheet**

Import TailwindCSS and define only basic page-level styling.

### Task 3: Install And Verify

**Files:**
- Create: `package-lock.json`

- [ ] **Step 1: Install dependencies**

Run: `npm install`

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 2: Build**

Run: `npm run build`

Expected: TypeScript build and Vite bundle complete with exit code 0.

- [ ] **Step 3: Optional local server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a local URL for browser testing.

## Self-Review

- The plan covers the approved setup only.
- No future empty folders are introduced.
- Verification is explicit through `npm run build`.
- Git commit steps are omitted because the workspace is not currently a Git repository.
