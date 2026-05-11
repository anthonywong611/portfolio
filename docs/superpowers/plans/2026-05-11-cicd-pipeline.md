# CI/CD Pipeline — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a CI pipeline (lint, typecheck, test, build) that runs on PRs via GitHub Actions, with Vitest for testing and Vercel Git Integration for automatic deployments.

**Architecture:** GitHub Actions runs CI checks on pull requests to `main`. Vercel's Git Integration handles CD — preview deployments on PR branches, production deployments on merge to `main`. Vitest provides the test runner.

**Tech Stack:** GitHub Actions, Vitest, pnpm, Vercel Git Integration

**Spec:** `docs/superpowers/specs/2026-05-11-cicd-pipeline-design.md`

---

## File Map

| File | Responsibility |
| --- | --- |
| `package.json` | Add `packageManager` field and `test` script |
| `vitest.config.ts` | Vitest configuration with `@/*` path alias |
| `src/__tests__/smoke.test.ts` | Placeholder smoke test |
| `.github/workflows/ci.yml` | CI workflow: lint, typecheck, test, build |

---

### Task 1: Install Vitest and add test script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Vitest**

Run:
```bash
pnpm add -D vitest
```

- [ ] **Step 2: Add `packageManager` field to `package.json`**

The `pnpm/action-setup` GitHub Action reads this field to determine which pnpm version to install. Add it at the top level of `package.json`, after the `"private"` field:

```json
"packageManager": "pnpm@11.0.9",
```

- [ ] **Step 3: Add `test` script to `package.json`**

Add the `test` script to the `"scripts"` section:

```json
"test": "vitest run"
```

The final `"scripts"` section should look like:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
},
```

- [ ] **Step 4: Verify `pnpm test` runs (it will fail — no tests yet)**

Run:
```bash
pnpm test
```

Expected: Vitest runs but reports no tests found (exit code 0 or 1 depending on config). This confirms Vitest is installed correctly.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install vitest and add test script"
```

---

### Task 2: Configure Vitest with path aliases

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

Create the file at the project root with the `@/*` path alias matching `tsconfig.json`:

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 2: Verify Vitest picks up the config**

Run:
```bash
pnpm test
```

Expected: Vitest runs with the config loaded. Still no tests found, but no config errors.

- [ ] **Step 3: Commit**

```bash
git add vitest.config.ts
git commit -m "chore: add vitest config with path aliases"
```

---

### Task 3: Add placeholder smoke test

**Files:**
- Create: `src/__tests__/smoke.test.ts`

- [ ] **Step 1: Create the test directory and smoke test**

Create `src/__tests__/smoke.test.ts`:

```typescript
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("passes", () => {
    expect(true).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test**

Run:
```bash
pnpm test
```

Expected output (1 test passing):
```
 ✓ src/__tests__/smoke.test.ts (1 test)

 Tests  1 passed (1)
```

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/smoke.test.ts
git commit -m "test: add placeholder smoke test"
```

---

### Task 4: Create GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflow directory**

Run:
```bash
mkdir -p .github/workflows
```

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint, Type Check, Test, Build
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version-file: ".nvmrc"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Type check
        run: pnpm tsc --noEmit

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

Notes for the engineer:
- `pnpm/action-setup@v4` reads the `packageManager` field from `package.json` to determine the pnpm version. No `version` input is needed.
- `actions/setup-node@v4` reads `.nvmrc` for the Node.js version (24) and uses pnpm's cache.
- `--frozen-lockfile` ensures CI fails if `pnpm-lock.yaml` is out of sync with `package.json`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions workflow for lint, typecheck, test, build"
```

---

### Task 5: Verify the full CI pipeline locally

**Files:**
- None (verification only)

- [ ] **Step 1: Run all CI steps locally in sequence**

Run each command that the CI workflow will execute, in order:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm tsc --noEmit
pnpm test
pnpm build
```

All five commands must exit with code 0.

- [ ] **Step 2: Push to remote**

```bash
git push
```

This pushes all commits to the `feature/website` branch on GitHub. The CI workflow will not run yet (it only triggers on PRs to `main`), but the code is now on GitHub for when a PR is opened.

---

### Post-Implementation: Manual GitHub Settings

These steps are done in the GitHub UI after the code is merged, not in code:

1. **Branch protection on `main`:**
   - Go to Settings → Branches → Add branch protection rule
   - Branch name pattern: `main`
   - Enable "Require a pull request before merging"
   - Enable "Require status checks to pass before merging"
   - Search for and select the `ci` status check (it will appear after the first PR run)
   - Enable "Require branches to be up to date before merging"

2. **Vercel Git Integration:**
   - The project is already linked to Vercel via `vercel link`. Vercel's Git Integration auto-deploys:
     - PR branches → Preview deployment
     - Merge to `main` → Production deployment
   - No additional configuration needed.
