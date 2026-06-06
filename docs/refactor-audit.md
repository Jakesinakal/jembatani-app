# JembaTani Refactor Audit

**Audit date:** 2026-05-26  
**Auditor:** Claude Code (full line-by-line read, 26 files)  
**Scope:** `src/` — no code was changed in this session.

---

## Executive Summary

| Severity  | Count  |
| --------- | ------ |
| HIGH      | 12     |
| MEDIUM    | 17     |
| LOW       | 7      |
| **Total** | **36** |

| Category                            | Findings |
| ----------------------------------- | -------- |
| 1. Type duplication & scattering    | 4        |
| 2. Utility function duplication     | 6        |
| 3. Mock data location               | 7        |
| 4. Reusable component consolidation | 9        |
| 5. Feature folder organization      | 5        |
| 6. Import path consistency          | 1        |
| 7. App-level state & routing        | 4        |

---

## 1. Type Duplication & Scattering

Canonical types are well-defined in `src/types/` but partially ignored — raw union literals appear in feature files instead of importing the exported type alias.

| File                                                         | Line(s)                           | Issue                                                                                                                                                        | Severity | Effort | Portfolio Red Flag | Proposed Fix                                                                        |
| ------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------ | ------------------ | ----------------------------------------------------------------------------------- |
| `src/features/feed/Beranda.tsx`                              | 26                                | `currentRoleMode: 'PETANI' \| 'PEMBELI'` written as inline union instead of importing `UserRole` from `@/types/user`                                         | HIGH     | Small  | YES                | Replace with `currentRoleMode: UserRole` and add import                             |
| `src/features/auth/Register.tsx`                             | 22                                | `mainRole: 'PETANI' \| 'PEMBELI' \| null` inlined instead of `UserRole \| null`                                                                              | HIGH     | Small  | YES                | Replace with `UserRole \| null`; import already available                           |
| `src/features/feed/CreateListing.tsx`                        | 19–21                             | `as 'PENAWARAN' \| 'PERMINTAAN'` type assertion written inline instead of casting to `PostType`                                                              | MEDIUM   | Small  | YES                | Import `PostType` from `@/types/post` and use it                                    |
| `src/types/chat.ts` / `src/features/messages/ChatDetail.tsx` | `chat.ts:12`, `ChatDetail.tsx:35` | `'PENDING' \| 'ACCEPTED' \| 'REJECTED'` declared in two places — once as a field type in `NegotiationDetails`, once as standalone state type in `ChatDetail` | MEDIUM   | Small  | —                  | Extract a `NegotiationStatus` type alias in `chat.ts` and import it in `ChatDetail` |

---

## 2. Utility Function Duplication

`src/lib/utils.ts` exports three helpers but two are not consistently used — one is silently re-implemented, two inline patterns are repeated without extraction.

| File                                          | Line(s)   | Issue                                                                                                                                                                                                                                       | Severity | Effort | Portfolio Red Flag | Proposed Fix                                                                                          |
| --------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------------------ | ----------------------------------------------------------------------------------------------------- |
| `src/components/ui/Avatar.tsx`                | 32–37     | `initials` computed inline via `name.split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase()` — a near-duplicate of `getInitials` from `utils.ts`. Diverges: Avatar falls back to `'JT'`; `getInitials` returns `''` for no name.         | HIGH     | Small  | YES                | Import `getInitials` from `@/lib/utils`; reconcile the `'JT'` fallback there                          |
| `src/features/messages/ChatDetail.tsx`        | 57, 84–85 | `new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })` written twice inline                                                                                                                                       | MEDIUM   | Small  | —                  | Extract `formatTimestamp(): string` to `src/lib/utils.ts`                                             |
| `src/features/feed/Beranda.tsx`               | 402–407   | `@keyframes marquee` defined inside a `<style>` JSX block. `motion` is already installed.                                                                                                                                                   | MEDIUM   | Small  | YES                | Move to `src/index.css` (inside `@layer utilities`) or replace marquee `<div>` with `<motion.div>`    |
| `src/components/layout/CreateBottomSheet.tsx` | 117–121   | `@keyframes slideUp` defined inside a `<style>` JSX block. Same issue as above.                                                                                                                                                             | MEDIUM   | Small  | YES                | Move to `src/index.css` or use `motion`'s `AnimatePresence` which is already used in `Onboarding.tsx` |
| `src/features/feed/Beranda.tsx`               | 167–207   | Filter chip buttons repeat the same ternary class-switching block 4× with only the label/value changing. The conditional class pattern `activeFilter === X ? 'bg-primary text-on-primary' : 'bg-surface-container-low ...'` is copy-pasted. | LOW      | Medium | —                  | Extract a `<FilterChip active={bool} label={string} onClick={fn} />` component                        |
| `src/features/auth/Register.tsx`              | 94–99     | `handleToggleCrop` is a toggle-in-array pattern identical in structure to `handleToggleCert` in `CreateListing.tsx:45–50`. Not a utility but a local copy-paste of the same idiom.                                                          | LOW      | Small  | —                  | Both can be replaced with a shared `toggleItem<T>(arr, item): T[]` utility in `utils.ts`              |

---

## 3. Mock Data Location

`src/data/mockData.ts` is comprehensive and centralized, but several components still contain inline data objects or hardcoded constants that belong there (or in a constants file).

| File                                   | Line(s) | Issue                                                                                                                                                                      | Severity | Effort | Portfolio Red Flag | Proposed Fix                                                                                |
| -------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------------------ | ------------------------------------------------------------------------------------------- |
| `src/features/feed/Beranda.tsx`        | 39–46   | `tickerItems` array (6 items: name, price, percent, isUp) hardcoded inside the component. Duplicates a subset of `mockCommodities` with redundant price values.            | HIGH     | Medium | YES                | Derive from `mockCommodities.slice(0, 6)` or move the static ticker config to `mockData.ts` |
| `src/features/feed/CreateListing.tsx`  | 68–73   | `author` object inside `handlePublish` hardcodes `name: 'Siti Nurhaliza'`, `avatar`, `location`, `isVerified` as literals. `mockCurrentUser` already has all these fields. | HIGH     | Small  | YES                | Replace the literal object with `mockCurrentUser` (already exported from `@/data/mockData`) |
| `src/features/profile/Akun.tsx`        | 98–100  | `src` and `name` props on `Avatar` hardcoded as string literals instead of using `mockCurrentUser.avatar` and `mockCurrentUser.name`                                       | HIGH     | Small  | YES                | Import `mockCurrentUser` and destructure                                                    |
| `src/features/messages/ChatDetail.tsx` | 39–44   | `quickReplies` is a module-level constant inside the component — should be a named export in `src/data/` or `src/lib/constants.ts`                                         | MEDIUM   | Small  | —                  | Move to `src/lib/constants.ts` as `QUICK_REPLIES`                                           |
| `src/features/feed/CreateListing.tsx`  | 43      | `certificateOptions = ['ORGANIK', 'GAP CERTIFIED', 'BEBAS PESTISIDA', 'SNI']` hardcoded in component body. Same strings appear scattered in `mockPosts` certifications.    | MEDIUM   | Small  | —                  | Move to `src/lib/constants.ts` as `CERTIFICATE_OPTIONS`                                     |
| `src/features/auth/Register.tsx`       | 28–37   | `cropsList` of 8 commodity names partially overlaps with `mockCommodities` names (Cabai Merah, Kentang, Tomat, etc.). Two sources of truth for commodity names.            | MEDIUM   | Medium | YES                | Derive from `mockCommodities.map(c => c.name)` or move to `CROPS_LIST` constant             |
| `src/features/prices/HargaDetail.tsx`  | 167–172 | `marketComparisons` (4 pasar with price offsets) hardcoded inline. Market names are magic strings; offsets are magic numbers.                                              | LOW      | Small  | —                  | Move market names/offsets to `src/lib/constants.ts` as `MARKET_BENCHMARKS`                  |

---

## 4. Reusable Component Consolidation

Existing `ui/` components are used correctly in most places, but three patterns appear inline in multiple files and two entirely new components should be extracted.

| File                                                                                                                   | Line(s)                                                                          | Issue                                                                                                                                                                                                                                                                                                                                     | Severity | Effort | Portfolio Red Flag | Proposed Fix                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------------------ | ---------------------------------------------------------------------------------------------- |
| `src/features/messages/Pesan.tsx`                                                                                      | 107–110                                                                          | Inline verified checkmark badge next to partner name: `<span className="bg-primary text-on-primary rounded-full p-0.5 text-[6px]"><Check className="w-2 h-2" /></span>`. Same pattern in `ChatDetail.tsx:160–163` (uses `text-[5px]`, `w-1.5 h-1.5`). Two files, two slightly different sizes.                                            | HIGH     | Small  | YES                | Extract `<VerifiedBadge size="sm\|xs" />` sub-component into `src/components/ui/`              |
| `src/features/feed/Beranda.tsx`                                                                                        | 240–244                                                                          | Third instance of the inline verified checkmark alongside the author name: `<CheckCircle className="w-3.5 h-3.5 text-primary fill-primary-fixed" />`. Uses a different icon (`CheckCircle` vs `Check`) than the other two occurrences.                                                                                                    | HIGH     | Small  | YES                | Same fix — `<VerifiedBadge />` with consistent icon across all three                           |
| `src/features/prices/HargaDetail.tsx`                                                                                  | 205                                                                              | Inline badge span `bg-primary-fixed text-on-primary-fixed-variant rounded-full px-2.5 py-0.5 font-bold uppercase` — equivalent to `<Badge variant="permintaan" />` without using the component.                                                                                                                                           | MEDIUM   | Small  | YES                | Replace with `<Badge variant="permintaan">Kategori {item.category}</Badge>`                    |
| `src/features/messages/Pesan.tsx` / `ChatDetail.tsx`                                                                   | `Pesan.tsx:126`, `ChatDetail.tsx` (Pesan list card)                              | `NEGOSIASI` label rendered as custom inline span in two places with near-identical styling (`bg-tertiary-fixed text-on-tertiary-fixed-variant uppercase tracking-wider`). This is `<Badge variant="penawaran" />` content.                                                                                                                | MEDIUM   | Small  | —                  | Replace with `<Badge variant="penawaran">NEGOSIASI</Badge>`                                    |
| `src/features/messages/ChatDetail.tsx`                                                                                 | 216–219                                                                          | `Tawar Balik` button: custom inline `<button className="px-3.5 py-1.5 border border-outline text-primary font-bold text-label-md bg-surface-container-lowest hover:bg-surface-container rounded-lg...">`. `Button` component has an `outline` variant for exactly this.                                                                   | MEDIUM   | Small  | YES                | Replace with `<Button variant="outline" size="sm">Tawar Balik</Button>`                        |
| `src/features/feed/Beranda.tsx` / `src/features/messages/Pesan.tsx`                                                    | `Beranda.tsx:211–217`, `Pesan.tsx:80–86`                                         | Empty state pattern repeated twice: identical outer `div` (`bg-surface-container-low rounded-lg border border-outline-variant/40 text-center py-12 p-6`), icon (`w-10 h-10 mx-auto text-on-surface-variant/40 mb-3`), and text (`text-body-md text-on-surface-variant font-medium`). Different icons.                                     | HIGH     | Medium | YES                | Extract `<EmptyState icon={Icon} message={string} />` into `src/components/ui/`                |
| `src/features/prices/HargaDetail.tsx` / `src/features/feed/CreateListing.tsx` / `src/features/messages/ChatDetail.tsx` | `HargaDetail.tsx:177–191`, `CreateListing.tsx:117–129`, `ChatDetail.tsx:139–185` | Sticky page header with back chevron + center title + optional right action repeated in 3 files. All use: `sticky top-0 backdrop-blur-md z-30 border-b border-outline-variant/50`, `ChevronLeft` + navigate, centered title in `font-fraunces`.                                                                                           | HIGH     | Medium | YES                | Extract `<PageHeader title onBack rightAction? />` into `src/components/layout/`               |
| `src/features/auth/Login.tsx` / `src/features/auth/Register.tsx` / `src/features/feed/CreateListing.tsx`               | Multiple sections                                                                | Label + input field pattern (`<div className="space-y-1.5"><label className="text-label-md font-bold...uppercase...font-jakarta"><input className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary..."/></div>`) repeated 10+ times across three files with identical outer styling. | HIGH     | Medium | YES                | Extract `<FormField label={string} children />` or `<Input label />` into `src/components/ui/` |
| `src/features/prices/HargaDetail.tsx`                                                                                  | 20–165                                                                           | `renderLineChart()` is a 145-line inline function that returns SVG JSX. It is defined inside the component but would be cleaner as a standalone `<LineChart history={[]} />` component.                                                                                                                                                   | MEDIUM   | Large  | —                  | Extract to `src/features/prices/LineChart.tsx` or `src/components/ui/LineChart.tsx`            |

---

## 5. Feature Folder Organization

| File                                  | Line(s)    | Issue                                                                                                                                                                                                      | Severity | Effort | Portfolio Red Flag | Proposed Fix                                                                                                                                      |
| ------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/feed/CreateListing.tsx` | 1–477      | 477 lines — largest file in the codebase. Contains 7 named form sections (photo grid, commodity, grade/condition, pricing, B2B toggles, location, certifications). Each section is independently stateful. | HIGH     | Large  | YES                | Split each section into a sub-component (e.g., `PhotoUploadSection`, `PricingSection`) in `src/features/feed/create/`. Keeps parent at ~80 lines. |
| `src/features/feed/Beranda.tsx`       | 218–398    | 410 total lines. The per-post card (lines 222–395) is ~170 lines of inline JSX inside a `.map()`. Any change to post display requires navigating a 400-line file.                                          | HIGH     | Medium | YES                | Extract `<PostCard post={Post} onLike={fn} onContact={fn} />` to `src/features/feed/PostCard.tsx`                                                 |
| `src/features/auth/Register.tsx`      | 136–429    | 446 total lines. 4-step wizard with each step as a large JSX block (`{step === 1 && (...)}`). Steps 1–4 are 60–120 lines each.                                                                             | MEDIUM   | Large  | —                  | Extract `Step1Account`, `Step2Otp`, `Step3Role`, `Step4Location` as sub-components in `src/features/auth/register/`                               |
| `src/features/prices/HargaDetail.tsx` | 20–165     | `renderLineChart` is 145 lines of SVG logic embedded as a local function called once via `{renderLineChart(item.history30Days)}`. This is effectively a hidden component.                                  | MEDIUM   | Medium | YES                | Extract to its own file (see Category 4 `LineChart` entry above)                                                                                  |
| `src/features/auth/Splash.tsx`        | whole file | `Splash` lives in `auth/` but has no authentication logic — it's an app-level loading screen. Causes confusion when reading the auth folder.                                                               | LOW      | Small  | —                  | Move to `src/features/app/Splash.tsx` or `src/features/splash/Splash.tsx`; update App.tsx import                                                  |

---

## 6. Import Path Consistency

| File                   | Line(s) | Issue                                                                                                                                                                                                                                                                                | Severity | Effort | Portfolio Red Flag | Proposed Fix                                                                           |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- | ------ | ------------------ | -------------------------------------------------------------------------------------- |
| `src/data/mockData.ts` | 6–9     | All 4 imports use relative paths (`'../types/user'`, `'../types/commodity'`, `'../types/post'`, `'../types/chat'`). Every other file in the project uses the `@/` alias. `tsconfig.json` has `@/*` configured. This is the only file that doesn't follow the established convention. | MEDIUM   | Small  | YES                | Replace all 4 with `@/types/user`, `@/types/commodity`, `@/types/post`, `@/types/chat` |

---

## 7. App-Level State & Routing

| File                            | Line(s)                                                                                                               | Issue                                                                                                                                                                                                                        | Severity | Effort | Portfolio Red Flag | Proposed Fix                                                                                                                                                   |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/App.tsx`                   | 53–71                                                                                                                 | `handleAddPost` and `handleLikePost` are business logic functions living inside `AppShell`, a layout component. Specifically, `handleLikePost` contains toggle logic (12 lines). Shell components should be structural only. | HIGH     | Medium | YES                | Extract to a `useFeedPosts()` custom hook in `src/features/feed/useFeedPosts.ts`; import in `AppShell`                                                         |
| `src/features/feed/Beranda.tsx` | 367, 389                                                                                                              | `navigate('/pesan/chat_1')` hardcoded twice — both the "comment" button and the CTA button navigate to the same fixed chat ID `chat_1`. This is a hardcoded foreign key in UI code.                                          | HIGH     | Small  | YES                | At minimum, thread the actual post's `authorId` through to derive the chat ID; or store the post→chat mapping in mockData                                      |
| Multiple files                  | `CreateListing.tsx:98`, `Akun.tsx:85`, `Login.tsx:25`, `Register.tsx:69`, `ChatDetail.tsx:142`, `HargaDetail.tsx:179` | Route strings (`'/beranda'`, `'/pesan'`, `'/harga'`, `'/login'`) are magic strings repeated across 6+ files. A typo in one creates a silent navigation bug with no TypeScript error.                                         | MEDIUM   | Small  | YES                | Create `src/lib/routes.ts` exporting `export const ROUTES = { BERANDA: '/beranda', ... }` and use it everywhere                                                |
| `src/App.tsx`                   | 48–95                                                                                                                 | `isPlusSheetOpen` state lives in `AppShell` but conceptually belongs to `BottomNav`/`CreateBottomSheet`. The sheet and its trigger are tightly coupled, but the open state is hoisted unnecessarily.                         | LOW      | Medium | —                  | Colocate `isPlusSheetOpen` + `setIsPlusSheetOpen` inside `BottomNav` and pass `onClose` down to `CreateBottomSheet`, eliminating one state prop from the shell |

---

## Execution Order for Prompt #2B

Execute in batches. Each batch must complete before the next to avoid merge conflicts and broken imports.

### Batch 1 — Types & import paths _(~30 min, zero risk)_

Fix the 5 type violations and the 1 import path file. Pure find-replace, no structural change.

- Category 1: all 4 findings
- Category 6: all 1 finding

**Dependency:** None. Must come first because Batches 3–7 all add new imports.

---

### Batch 2 — Constants extraction _(~30 min, low risk)_

Create `src/lib/constants.ts`. Move `quickReplies`, `certificateOptions`, `cropsList`, and market benchmark data out of components. Also move `tickerItems` out of Beranda.

- Category 3: findings rows 1, 4, 5, 6, 7

**Dependency:** Batch 1 must be done first; `cropsList` and `certificateOptions` may reference types.

---

### Batch 3 — Utility functions _(~30 min, low risk)_

Add `formatTimestamp()` to `utils.ts`, fix `Avatar.tsx` to use `getInitials`, move keyframe CSS to `index.css`.

- Category 2: all 6 findings

**Dependency:** Batch 1 (type imports may be needed for new utils).

---

### Batch 4 — New UI components _(~2 hrs, medium risk)_

Extract `<VerifiedBadge />`, `<EmptyState />`, `<PageHeader />`, and `<FormField />`/`<Input />`. Replace every inline instance with the new component.

- Category 4: findings rows 1–8

**Dependency:** Batches 1–3 must be done first so extracted components start with clean imports and types.

---

### Batch 5 — Mock data centralization _(~45 min, low risk)_

Replace hardcoded author object in `CreateListing`, hardcoded user data in `Akun`, and derive `tickerItems` from `mockCommodities`.

- Category 3: findings rows 1, 2, 3

**Dependency:** Independent of Batches 4, but easier after Batch 2 clears constants noise.

---

### Batch 6 — App state & routing _(~1 hr, medium risk)_

Extract `useFeedPosts` hook, create `ROUTES` constants, fix hardcoded `chat_1` navigation, optionally colocate `isPlusSheetOpen`.

- Category 7: all 4 findings

**Dependency:** Batch 1 (needs clean types). Should be done before Batch 7 to avoid conflicts when splitting large files.

---

### Batch 7 — File splitting _(~3 hrs, highest risk)_

Split `CreateListing.tsx` into section components, extract `<PostCard />` from `Beranda.tsx`, split `Register.tsx` steps, extract `<LineChart />`, optionally move `Splash`.

- Category 5: all 5 findings

**Dependency:** Must come LAST. Depends on:

- Batch 4 (FormField/Input components used in new sub-components)
- Batch 2 (constants used in new sub-components)
- Batch 6 (ROUTES used in new sub-components that navigate)

---

_End of audit. Total estimated execution: 8–10 hours across 7 batches._
