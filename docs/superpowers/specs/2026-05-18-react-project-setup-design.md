# React Project Setup Design

## Goal

Configure the Score Board project with React, TypeScript, Vite, and TailwindCSS so the first scoreboard feature can be built on a simple, mobile-first foundation.

## Approved Approach

Use Vite with the React TypeScript template shape, then integrate TailwindCSS through the official Vite plugin. This matches `instructions.md` and `PROJECT.md`, keeps the initial setup small, and avoids heavier framework choices before the product needs routing, backend integration, or server rendering.

## Architecture

The initial app will expose a single React entrypoint at `src/main.tsx`, compose the app from `src/app/App.tsx`, and keep global styles in `src/styles/index.css`. The first screen will be a minimal scoreboard shell that validates Tailwind styling, mobile-first layout, and React rendering without implementing the full scoreboard feature yet.

## Files

- `package.json`: npm scripts and dependencies.
- `index.html`: Vite HTML entrypoint.
- `vite.config.ts`: React and Tailwind Vite plugins.
- `tsconfig*.json`: TypeScript configuration.
- `src/main.tsx`: React bootstrap.
- `src/app/App.tsx`: initial app composition.
- `src/styles/index.css`: Tailwind import and base page styling.

## Testing And Verification

Verification for this setup is `npm run build`. If dependencies are installed successfully, the build must compile TypeScript and generate the Vite production bundle.

## Constraints

- Do not add persistence, routing, backend, tournaments, or advanced game rules.
- Do not create empty future folders.
- Keep the first UI small and aligned with the planned scoreboard direction.
- The workspace is not currently a Git repository, so the spec cannot be committed until Git is initialized.
