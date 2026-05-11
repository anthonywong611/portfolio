# CI/CD Pipeline Design

**Date:** 2026-05-11
**Project:** Portfolio Website
**Status:** Approved

---

## Overview

Add a CI/CD pipeline to the portfolio website using GitHub Actions for continuous integration and Vercel's Git Integration for continuous deployment. CI runs on every pull request; CD is handled automatically by Vercel.

---

## CI — GitHub Actions

### Workflow File

`.github/workflows/ci.yml`

### Trigger

- `pull_request` targeting `main` (opened, synchronized, reopened)

### Job: `ci`

Runs on `ubuntu-latest`. Single job with sequential steps:

1. **Checkout** — `actions/checkout@v4`
2. **Setup pnpm** — `pnpm/action-setup@v4` (version inferred from `packageManager` field in `package.json`; this field must be added: `"packageManager": "pnpm@11.0.9"`)
3. **Setup Node.js** — `actions/setup-node@v4` with `node-version-file: '.nvmrc'` and pnpm cache enabled
4. **Install dependencies** — `pnpm install --frozen-lockfile`
5. **Lint** — `pnpm lint`
6. **Type check** — `pnpm tsc --noEmit`
7. **Test** — `pnpm test`
8. **Build** — `pnpm build`

### Required Status Check

The `ci` job should be configured as a required status check on the `main` branch via GitHub branch protection rules. PRs cannot merge until CI passes. This is a manual repo setting, not part of the workflow file.

---

## CD — Vercel Git Integration

Vercel's built-in Git Integration handles all deployments. No GitHub Actions workflow is needed for CD.

### Preview Deployments

- **Trigger:** Any push to a non-`main` branch, or a pull request
- **Behavior:** Vercel auto-builds and deploys a preview. A comment with the preview URL is posted on the PR by the Vercel bot.
- **Environment:** Vercel "Preview" environment variables apply

### Production Deployments

- **Trigger:** Merge (push) to `main`
- **Behavior:** Vercel auto-builds and deploys to production
- **Environment:** Vercel "Production" environment variables apply

### Environment Variables

Single Vercel project with environment-scoped variables:

| Variable | Preview | Production |
| --- | --- | --- |
| `RESEND_API_KEY` | (optional, can be omitted) | Set to production Resend key |
| `NEXT_PUBLIC_SITE_URL` | Auto-set by Vercel (`VERCEL_URL`) | Set to custom domain (e.g., `https://anthonywong.dev`) |

---

## Test Setup — Vitest

### Dependencies

Install as dev dependencies:
- `vitest`

### Configuration

Create `vitest.config.ts` at the project root:
- Use `resolve.alias` to mirror the `@/*` path alias from `tsconfig.json`
- No special plugins needed for non-component unit tests

### Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

### Placeholder Test

Create `src/__tests__/smoke.test.ts` with a single passing test so CI doesn't fail on an empty test suite:

```typescript
import { describe, it, expect } from "vitest";

describe("smoke", () => {
  it("passes", () => {
    expect(true).toBe(true);
  });
});
```

---

## GitHub Repository Settings (Manual)

These are configured in the GitHub UI, not in code:

1. **Branch protection on `main`:**
   - Require pull request reviews before merging
   - Require status checks to pass: select the `ci` job
   - Require branches to be up to date before merging

2. **GitHub Environments (DEV, QA, PROD):**
   - These are unused by this pipeline. Vercel manages its own Preview/Production environments. The GitHub environments can be deleted or left as-is.

---

## What This Does NOT Include

- E2E tests (Playwright) — can be added later as a separate CI step
- Staging/QA environment — Vercel preview deployments serve this purpose
- Manual deployment approval gates — PR review is the approval gate
- Multiple Vercel projects — single project with environment-scoped config
