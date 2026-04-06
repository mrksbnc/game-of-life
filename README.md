# Game of Life

Canvas-based implementation of Conway's Game of Life written in TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/) (optional but recommended)
  - Install with `npm install -g pnpm` or with `corepack enable pnpm`

## Setup

The project uses `TypeScript` to make development simpler and more reliable, and also uses `esbuild` for bundling.

To install dependencies, run the following command:

```bash
pnpm install
```

## Development

As the project does not use a Hot Module Reload (HMR) server, run the `dev` script to build and open the app:

```bash
pnpm dev
```

This script runs `pnpm build` and then opens `dist/index.html`.

## Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `pnpm build`      | Typecheck and bundle to `dist/`  |
| `pnpm dev`        | Build and open `dist/index.html` |
| `pnpm typecheck`  | Run TypeScript type checking     |
| `pnpm lint`       | Run oxlint                       |
| `pnpm lint:spell` | Run spell check with cspell      |
| `pnpm fmt:check`  | Check formatting with oxfmt      |

## License

MIT