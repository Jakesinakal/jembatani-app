# Design System Audit — JembaTani

**Audit date:** 2026-05-26  
**Source of truth:** `docs/design-tokens.md`  
**Scope:** All `src/**/*.tsx`, `src/index.css`, `index.html`  
**Methodology:** Automated grep scan + manual cross-reference against design token spec

---

## Executive Summary

| Category                                                            | Violations | Files Affected  |
| ------------------------------------------------------------------- | ---------- | --------------- |
| 🔴 Color — Hardcoded hex (className)                                | 15         | 5               |
| 🔴 Color — Hardcoded hex (SVG attributes)                           | 7          | 1               |
| 🔴 Color — Semantic pairing (text-white on semantic bg)             | 6          | 3               |
| 🔴 Color — Non-semantic (bg-black, text-black)                      | 2          | 2               |
| 🟠 Typography — Arbitrary px sizes                                  | 65         | 12              |
| 🟠 Typography — Native Tailwind (text-xs / text-sm / text-2xl etc.) | 134        | 14              |
| 🟠 Typography — font-mono (not in design system)                    | 7          | 5               |
| 🟡 Border Radius — SYSTEMIC: @theme tokens missing                  | 1 systemic | —               |
| 🟡 Border Radius — Specific wrong tokens                            | 2          | 2               |
| 🟢 Icon — strokeWidth ≠ 1.5 (Lucide icons only)                     | 3          | 3               |
| 🟣 Semantic Token Pairing — bg/fg MD3 contract broken               | 4          | 3               |
| 🔵 Missing tabular-nums on numeric Fraunces                         | 2          | 2               |
| **TOTAL**                                                           | **~248**   | **14/18 files** |

### ⚠️ Critical Systemic Finding

**Border radius `@theme` tokens are completely absent from `src/index.css`.** Only color and typography tokens are defined. This means every `rounded-lg` card renders at **8px** (Tailwind v4 default), not the **16px** mandated by design tokens. Every `rounded-xl` bottom sheet renders at **12px** instead of **24px**. This single gap affects 80+ elements across the entire codebase and should be fixed first, before any other radius-related changes.

### ⚠️ Note on Google Sign-In Colors

`src/features/auth/Login.tsx` lines 116–128 contain `fill="#EA4335"`, `fill="#4285F4"`, `fill="#FBBC05"`, `fill="#34A853"` — these are **Google brand colors** required by Google's identity guidelines for the Sign-In button SVG. They are intentional and **excluded from all violation counts and fix roadmaps**.

---

## Findings by Category

---

### 🔴 1. Color Violations — Hardcoded Hex in className

All instances where raw hex codes appear inside Tailwind arbitrary value brackets (`text-[#...]`, `bg-[#...]`, etc.).

| #   | File                                   | Line | Current               | Expected Token                       | Severity |
| --- | -------------------------------------- | ---- | --------------------- | ------------------------------------ | -------- |
| 1   | `src/features/messages/ChatDetail.tsx` | 144  | `bg-[#466551]`        | `bg-surface-tint`                    | HIGH     |
| 2   | `src/features/messages/ChatDetail.tsx` | 217  | `bg-[#c8ebd1]`        | `bg-primary-fixed`                   | HIGH     |
| 3   | `src/features/messages/ChatDetail.tsx` | 217  | `border-[#2f4d3a]/30` | `border-on-primary-fixed-variant/30` | MEDIUM   |
| 4   | `src/features/messages/ChatDetail.tsx` | 219  | `text-[#022111]`      | `text-on-primary-fixed`              | HIGH     |
| 5   | `src/features/messages/ChatDetail.tsx` | 221  | `text-[#022111]`      | `text-on-primary-fixed`              | HIGH     |
| 6   | `src/features/messages/ChatDetail.tsx` | 222  | `text-[#022111]/60`   | `text-on-primary-fixed/60`           | MEDIUM   |
| 7   | `src/features/feed/Beranda.tsx`        | 111  | `text-[#fc5f44]`      | `text-secondary-container`           | HIGH     |
| 8   | `src/features/profile/Akun.tsx`        | 198  | `text-[#b22a16]`      | `text-secondary`                     | HIGH     |
| 9   | `src/features/profile/Akun.tsx`        | 209  | `bg-[#c8ebd1]`        | `bg-primary-fixed`                   | HIGH     |
| 10  | `src/features/profile/Akun.tsx`        | 209  | `text-[#022111]`      | `text-on-primary-fixed`              | HIGH     |
| 11  | `src/features/prices/HargaDetail.tsx`  | 43   | `text-[#b22a16]`      | `text-secondary`                     | HIGH     |
| 12  | `src/features/prices/HargaDetail.tsx`  | 43   | `bg-[#ffdad3]`        | `bg-secondary-fixed`                 | HIGH     |
| 13  | `src/features/feed/CreateListing.tsx`  | 261  | `text-[#b22a16]`      | `text-secondary`                     | HIGH     |
| 14  | `src/features/feed/CreateListing.tsx`  | 334  | `text-[#b22a16]`      | `text-secondary`                     | MEDIUM   |
| 15  | `src/features/prices/Harga.tsx`        | 145  | `bg-[#fc5f44]`        | `bg-secondary-container`             | HIGH     |

---

### 🔴 2. Color Violations — Hardcoded Hex in SVG Attributes

Raw hex values in SVG `fill`, `stroke`, and `stopColor` props (Google brand colors excluded).

| #   | File                                  | Line  | Current                 | Expected                                       | Severity |
| --- | ------------------------------------- | ----- | ----------------------- | ---------------------------------------------- | -------- |
| 16  | `src/features/prices/HargaDetail.tsx` | 49–51 | `stroke="#ebe8e3"` (×3) | `stroke="var(--color-surface-container-high)"` | MEDIUM   |
| 17  | `src/features/prices/HargaDetail.tsx` | 64    | `stroke="#082717"`      | `stroke="var(--color-primary)"`                | HIGH     |
| 18  | `src/features/prices/HargaDetail.tsx` | 77    | `stroke="#ffffff"`      | `stroke="var(--color-on-primary)"`             | MEDIUM   |
| 19  | `src/features/prices/HargaDetail.tsx` | 115   | `stopColor="#082717"`   | `stopColor="var(--color-primary)"`             | HIGH     |
| 20  | `src/features/prices/HargaDetail.tsx` | 116   | `stopColor="#fcf9f4"`   | `stopColor="var(--color-surface)"`             | HIGH     |

> **Note on HargaDetail.tsx lines 49–51:** Three identical `stroke="#ebe8e3"` calls on grid lines — counted as one logical violation, three line occurrences.

---

### 🔴 3. Color Violations — Semantic Pairing (text-white on semantic backgrounds)

Per MD3 contract: every background token has a designated foreground pair. `text-white` bypasses this contract.

| #   | File                                  | Line | Current bg                           | Current fg      | Expected fg                   | Severity |
| --- | ------------------------------------- | ---- | ------------------------------------ | --------------- | ----------------------------- | -------- |
| 21  | `src/features/prices/Harga.tsx`       | 145  | `bg-[#fc5f44]` (secondary-container) | `text-white`    | `text-on-secondary-container` | HIGH     |
| 22  | `src/features/feed/Beranda.tsx`       | 238  | dark gradient overlay                | `text-white`    | `text-inverse-on-surface`     | MEDIUM   |
| 23  | `src/features/feed/Beranda.tsx`       | 239  | dark gradient overlay                | `text-white/70` | `text-inverse-on-surface/70`  | MEDIUM   |
| 24  | `src/features/feed/Beranda.tsx`       | 247  | dark gradient overlay                | `text-white`    | `text-inverse-on-surface`     | MEDIUM   |
| 25  | `src/features/feed/Beranda.tsx`       | 248  | dark gradient overlay                | `text-white/70` | `text-inverse-on-surface/70`  | MEDIUM   |
| 26  | `src/features/feed/CreateListing.tsx` | 128  | `bg-black/60` (overlay)              | `text-white`    | No token; overlay exception   | LOW      |

---

### 🔴 4. Color Violations — Non-semantic Colors (bg-black)

| #   | File                                          | Line | Current       | Note                                                                  | Severity |
| --- | --------------------------------------------- | ---- | ------------- | --------------------------------------------------------------------- | -------- |
| 27  | `src/features/feed/CreateListing.tsx`         | 128  | `bg-black/60` | Photo delete button overlay — no design token exists for this pattern | LOW      |
| 28  | `src/components/layout/CreateBottomSheet.tsx` | 34   | `bg-black/50` | Modal scrim — no design token exists for backdrop                     | LOW      |

---

### 🟠 5. Typography Violations — Arbitrary Pixel Sizes

All `text-[Xpx]` classes. The design token scale has no sizes below 14px (`text-body-sm`). Sizes below 14px have no token equivalent but are still violations by zero-tolerance policy.

**text-[5px] — no equivalent:**
| # | File | Line | Context | Severity |
|---|---|---|---|---|
| 29 | `src/features/messages/ChatDetail.tsx` | 141 | Verified badge icon container | LOW |

**text-[6px] — no equivalent:**
| # | File | Line | Context | Severity |
|---|---|---|---|---|
| 30 | `src/features/messages/Pesan.tsx` | 98 | Verified badge icon container | LOW |

**text-[8px] — no equivalent:**
| # | File | Line | Context | Severity |
|---|---|---|---|---|
| 31 | `src/features/prices/HargaDetail.tsx` | 110 | SVG Y-axis max label | LOW |
| 32 | `src/features/prices/HargaDetail.tsx` | 111 | SVG Y-axis min label | LOW |

**text-[9px] — no equivalent (closest: `text-body-sm` at 14px):**
| # | File | Line | Context | Severity |
|---|---|---|---|---|
| 33 | `src/features/messages/Pesan.tsx` | 111 | NEGOSIASI badge label | LOW |
| 34 | `src/features/profile/Akun.tsx` | 209 | AKTIF badge label | LOW |
| 35 | `src/features/prices/HargaDetail.tsx` | 86 | SVG node hover price tooltip | LOW |
| 36 | `src/features/prices/HargaDetail.tsx` | 102 | SVG X-axis date labels | LOW |
| 37 | `src/features/prices/HargaDetail.tsx` | 217 | "Borongan / Eceran" term badge | LOW |
| 38 | `src/features/prices/Harga.tsx` | 145 | SOROTAN badge | MEDIUM |
| 39 | `src/features/prices/Harga.tsx` | 184 | "Tren 7 Hari" label | LOW |
| 40 | `src/features/prices/Harga.tsx` | 263 | Category label in commodity cell | LOW |
| 41 | `src/features/prices/Harga.tsx` | 274 | Unit suffix "/kg" | LOW |

**text-[10px] — no equivalent (closest: `text-body-sm` at 14px):**
| # | File | Line | Context | Severity |
|---|---|---|---|---|
| 42 | `src/components/layout/BottomNav.tsx` | 47 | Center tab label "Buat" | LOW |
| 43 | `src/components/layout/BottomNav.tsx` | 75 | Other tab labels | LOW |
| 44 | `src/features/profile/Akun.tsx` | 99 | Location text | LOW |
| 45–47 | `src/features/profile/Akun.tsx` | 117, 121, 125 | Stats column labels (×3) | LOW |
| 48 | `src/features/profile/Akun.tsx` | 155 | Role mode description | LOW |
| 49 | `src/features/profile/Akun.tsx` | 201 | Menu item subtitle | LOW |
| 50 | `src/features/prices/HargaDetail.tsx` | 163 | Category badge | LOW |
| 51–53 | `src/features/prices/HargaDetail.tsx` | 180, 186, 190 | Stats labels (×3) | LOW |
| 54 | `src/features/prices/HargaDetail.tsx` | 191 | "Aktual" validity cell | LOW |
| 55 | `src/features/prices/HargaDetail.tsx` | 226 | "/kg" suffix | LOW |
| 56 | `src/features/prices/Harga.tsx` | 95 | Region picker dropdown arrow | LOW |
| 57 | `src/features/prices/Harga.tsx` | 154 | Category label in spotlight | LOW |
| 58 | `src/features/prices/Harga.tsx` | 162 | "Rerata Regional" label | LOW |
| 59 | `src/features/prices/Harga.tsx` | 178 | "Banding kemarin" caption | LOW |
| 60 | `src/features/prices/Harga.tsx` | 271 | Commodity cell price (Fraunces) | LOW |
| 61 | `src/features/prices/Harga.tsx` | 278 | Delta % badge text | LOW |
| 62 | `src/features/messages/ChatDetail.tsx` | 143 | "Aktif Sekarang" label | LOW |
| 63 | `src/features/messages/ChatDetail.tsx` | 173 | Negotiation badge | LOW |
| 64 | `src/features/messages/Pesan.tsx` | 107 | Chat timestamp | LOW |
| 65 | `src/features/messages/Pesan.tsx` | 115 | Unread count badge | LOW |
| 66–71 | `src/features/feed/Beranda.tsx` | 110, 129, 201, 208, 278, 286 | Various meta labels (×6) | LOW |
| 72–77 | `src/features/feed/CreateListing.tsx` | 128, 283, 289, 310, 316, 345 | Various form micro-labels (×6) | LOW |

**text-[11px] — closest: `text-body-sm` at 14px:**
| # | File | Line | Context | Severity |
|---|---|---|---|---|
| 78 | `src/components/ui/Avatar.tsx` | 24 | Avatar initials sm size | LOW |
| 79–80 | `src/components/ui/Badge.tsx` | 16, 24 | Badge base style (×2) | MEDIUM |
| 81 | `src/features/profile/Akun.tsx` | 164 | "Edit Profil" button | MEDIUM |
| 82 | `src/features/profile/Akun.tsx` | 170 | "Bagikan Toko" button | MEDIUM |
| 83 | `src/features/profile/Akun.tsx` | 180 | Section header label | MEDIUM |
| 84 | `src/features/messages/ChatDetail.tsx` | 179 | Negotiation card quantity/price line | MEDIUM |
| 85 | `src/features/messages/ChatDetail.tsx` | 260 | Quick reply chip text | LOW |
| 86–87 | `src/features/feed/Beranda.tsx` | 106, 239, 248 | Ticker price text; overlay labels (×3) | MEDIUM |
| 88 | `src/features/prices/HargaDetail.tsx` | 43 | Average price badge | MEDIUM |
| 89 | `src/features/prices/Harga.tsx` | 210 | "Satuan per Kg" info chip | LOW |

---

### 🟠 6. Typography Violations — Native Tailwind Sizes (Not in Design Scale)

The design token scale only includes: `text-display-lg`, `text-display-lg-mobile`, `text-headline-lg`, `text-headline-md`, `text-body-lg`, `text-body-md`, `text-body-sm`, `text-label-md`, `text-numeral-xl`. All other Tailwind size utilities are violations.

#### text-xs (12px) — 78 occurrences — closest: `text-label-md` (14px, weight 600)

`text-xs` is the most pervasive violation — used as a de-facto form label size across the entire codebase. Replacing with `text-label-md` is the correct fix where the element is a label, chip, or button. Selected representative instances:

| #   | File                                          | Lines                                                                                                   | Context                                                        | Severity |
| --- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------- |
| 90  | `src/components/ui/Button.tsx`                | 41                                                                                                      | Button `sm` size text                                          | MEDIUM   |
| 91  | `src/features/auth/Login.tsx`                 | 40, 47, 65, 66, 98, 106                                                                                 | Error msg, form labels, divider, demo btn                      | MEDIUM   |
| 92  | `src/features/auth/Register.tsx`              | 109, 115, 128, 143, 154, 165, 177, 187, 310, 322, 339, 342, 352                                         | Step counter, all form labels, chip selector                   | MEDIUM   |
| 93  | `src/features/prices/Harga.tsx`               | 93, 103, 167, 172, 209, 218, 231                                                                        | Region btn, date, unit, delta %, section label, chip filters   | MEDIUM   |
| 94  | `src/features/feed/Beranda.tsx`               | 104, 125, 139, 147, 155, 163, 198, 281, 287, 300, 310                                                   | Ticker, mode banner, filter chips, author name, unit, like btn | MEDIUM   |
| 95  | `src/features/messages/ChatDetail.tsx`        | 192, 200                                                                                                | "Tawar Balik" btn, Button size sm                              | MEDIUM   |
| 96  | `src/features/feed/CreateListing.tsx`         | 120, 151, 167, 181, 188, 201, 208, 225, 239, 252, 263, 270, 282, 295, 309, 322, 332, 352, 366, 377, 386 | All section labels and form controls                           | MEDIUM   |
| 97  | `src/features/profile/Akun.tsx`               | 135, 146                                                                                                | Role mode segmented control                                    | MEDIUM   |
| 98  | `src/components/layout/CreateBottomSheet.tsx` | 68, 82, 96                                                                                              | Option card subtitles                                          | MEDIUM   |
| 99  | `src/features/auth/Splash.tsx`                | 63                                                                                                      | Version string                                                 | LOW      |
| 100 | `src/features/messages/Pesan.tsx`             | 37, 62, 100                                                                                             | Subtitle, tab chips, chat preview                              | MEDIUM   |

#### text-sm (14px) — 7 occurrences — correct: `text-body-sm` (same 14px, explicit font weight 400)

| #       | File                                   | Line     | Context                          | Severity |
| ------- | -------------------------------------- | -------- | -------------------------------- | -------- |
| 101     | `src/components/ui/Avatar.tsx`         | 26       | Avatar `lg` size initials        | LOW      |
| 102     | `src/features/messages/Pesan.tsx`      | 97       | Partner name in chat list        | MEDIUM   |
| 103     | `src/features/messages/ChatDetail.tsx` | 140      | Partner name in chat header      | MEDIUM   |
| 104     | `src/features/messages/ChatDetail.tsx` | 176      | Product name in negotiation card | MEDIUM   |
| 105     | `src/features/prices/Harga.tsx`        | 260      | Commodity name in 2-col grid     | MEDIUM   |
| 106–107 | `src/features/feed/Beranda.tsx`        | 242, 251 | Stock/date overlay text (×2)     | MEDIUM   |

#### text-base (16px) — closest: `text-body-md` (same 16px, explicit line-height/weight)

| #       | File                                          | Line          | Context                            | Severity |
| ------- | --------------------------------------------- | ------------- | ---------------------------------- | -------- |
| 108–110 | `src/features/profile/Akun.tsx`               | 116, 120, 124 | Stats figures (1.2K, 340, 28)      | MEDIUM   |
| 111–113 | `src/components/layout/CreateBottomSheet.tsx` | 67, 81, 95    | Sheet option card titles (×3)      | MEDIUM   |
| 114     | `src/features/prices/HargaDetail.tsx`         | 223           | Market comparison price (Fraunces) | MEDIUM   |

#### text-lg (18px) — closest: `text-body-lg` (same 18px)

| #       | File                                  | Line     | Context                                    | Severity |
| ------- | ------------------------------------- | -------- | ------------------------------------------ | -------- |
| 115     | `src/features/auth/Onboarding.tsx`    | 72       | Mini wordmark "JembaTani"                  | LOW      |
| 116     | `src/features/feed/Beranda.tsx`       | 266      | Post card title                            | HIGH     |
| 117     | `src/features/prices/HargaDetail.tsx` | 142      | Page header "Detail Tren Harga"            | HIGH     |
| 118     | `src/features/prices/HargaDetail.tsx` | 206      | Section header "Banding Harga Pasar Induk" | HIGH     |
| 119–120 | `src/features/auth/Register.tsx`      | 261, 286 | Role option card titles (×2)               | MEDIUM   |
| 121     | `src/features/feed/CreateListing.tsx` | 113      | Page header                                | HIGH     |

#### text-xl (20px) — no direct token (between `text-body-lg` 18px and `text-headline-md` 24px)

| #   | File                             | Line | Context                   | Severity |
| --- | -------------------------------- | ---- | ------------------------- | -------- |
| 122 | `src/features/prices/Harga.tsx`  | 156  | Spotlight commodity name  | MEDIUM   |
| 123 | `src/features/auth/Register.tsx` | 222  | OTP digit input font size | LOW      |

#### text-2xl (24px) — correct: `text-headline-md` (same 24px)

| #       | File                                          | Line               | Context                        | Severity |
| ------- | --------------------------------------------- | ------------------ | ------------------------------ | -------- |
| 124     | `src/features/auth/Onboarding.tsx`            | 99                 | Slide title                    | HIGH     |
| 125     | `src/features/feed/Beranda.tsx`               | 63                 | "JembaTani" wordmark in header | HIGH     |
| 126     | `src/components/layout/CreateBottomSheet.tsx` | 47                 | Sheet title "Buat Konten Baru" | HIGH     |
| 127     | `src/features/profile/Akun.tsx`               | 95                 | User name display              | HIGH     |
| 128–129 | `src/features/prices/HargaDetail.tsx`         | 166, 170           | Commodity name + price (×2)    | HIGH     |
| 130–133 | `src/features/auth/Register.tsx`              | 137, 205, 238, 302 | All step headers (×4)          | HIGH     |

#### text-3xl (30px) — closest: `text-headline-lg` (32px)

| #   | File                              | Line | Context                      | Severity |
| --- | --------------------------------- | ---- | ---------------------------- | -------- |
| 134 | `src/features/messages/Pesan.tsx` | 36   | Page title "Pesan"           | HIGH     |
| 135 | `src/features/prices/Harga.tsx`   | 81   | Page title "Harga Komoditas" | HIGH     |

#### text-4xl (36px) — closest: `text-headline-lg` (32px) or `text-display-lg-mobile` (40px)

| #   | File                           | Line | Context                 | Severity |
| --- | ------------------------------ | ---- | ----------------------- | -------- |
| 136 | `src/features/auth/Splash.tsx` | 37   | Splash hero "JembaTani" | HIGH     |

---

### 🟠 7. Typography Violations — font-mono (Not in Design System)

`font-mono` is not defined in the design token font system. The only valid font families are `font-fraunces` and `font-jakarta`.

| #   | File                                   | Line | Context                                 | Expected       | Severity |
| --- | -------------------------------------- | ---- | --------------------------------------- | -------------- | -------- |
| 137 | `src/features/auth/Splash.tsx`         | 63   | Version string "VERSI 1.0.0"            | `font-jakarta` | LOW      |
| 138 | `src/features/feed/Beranda.tsx`        | 208  | Post relative time (formatRelativeTime) | `font-jakarta` | MEDIUM   |
| 139 | `src/features/messages/ChatDetail.tsx` | 222  | System message timestamp                | `font-jakarta` | MEDIUM   |
| 140 | `src/features/messages/ChatDetail.tsx` | 239  | Chat bubble timestamp                   | `font-jakarta` | MEDIUM   |
| 141 | `src/features/messages/Pesan.tsx`      | 107  | Chat list timestamp                     | `font-jakarta` | MEDIUM   |
| 142 | `src/features/messages/Pesan.tsx`      | 115  | Unread count badge                      | `font-jakarta` | LOW      |
| 143 | `src/features/prices/Harga.tsx`        | 95   | Region picker dropdown arrow ▼          | `font-jakarta` | LOW      |

---

### 🟡 8. Border Radius Violations — SYSTEMIC: Missing @theme Tokens

**`src/index.css` — all `--radius-*` custom properties absent from `@theme` block.**

The `docs/design-tokens.md` section 4 defines a complete border radius scale. None of these are implemented in `src/index.css`, meaning Tailwind v4 built-in defaults apply instead:

| Token                | Design Spec | Tailwind v4 Default | Gap                       |
| -------------------- | ----------- | ------------------- | ------------------------- |
| `--radius` (DEFAULT) | 8px         | 4px                 | **−4px**                  |
| `--radius-sm`        | 4px         | 4px                 | none                      |
| `--radius-md`        | 12px        | 6px                 | **−6px**                  |
| `--radius-lg`        | 16px        | 8px                 | **−8px** ← cards, buttons |
| `--radius-xl`        | 24px        | 12px                | **−12px** ← bottom sheets |
| `--radius-2xl`       | —           | 16px                | n/a                       |
| `--radius-3xl`       | —           | 24px                | n/a                       |

**Impact:** Every card (`rounded-lg`) renders at 8px instead of 16px. Every bottom sheet (`rounded-t-xl`) renders at 12px instead of 24px. This is the highest-priority single fix in the entire audit.

**Fix:** Add the following to the `@theme` block in `src/index.css`:

```css
--radius: 0.5rem; /* 8px  — DEFAULT, inputs/badges */
--radius-md: 0.75rem; /* 12px — medium components */
--radius-lg: 1rem; /* 16px — cards, buttons, images */
--radius-xl: 1.5rem; /* 24px — modals, bottom sheets */
```

### 🟡 9. Border Radius Violations — Specific Wrong Tokens

| #   | File                               | Line | Current                             | Expected                       | Severity |
| --- | ---------------------------------- | ---- | ----------------------------------- | ------------------------------ | -------- |
| 144 | `src/features/auth/Splash.tsx`     | 28   | `rounded-3xl` (logo badge)          | `rounded-xl` (24px per spec)   | MEDIUM   |
| 145 | `src/features/auth/Onboarding.tsx` | 84   | `rounded-t-3xl` (bottom sheet card) | `rounded-t-xl` (24px per spec) | MEDIUM   |

---

### 🟢 10. Icon Usage Violations — Non-standard strokeWidth

Design spec: all Lucide icons use `strokeWidth={1.5}`. Exceptions below (SVG path strokes excluded — those are chart rendering, not icon usage).

| #   | File                                   | Line | Icon                             | Current strokeWidth | Expected | Severity |
| --- | -------------------------------------- | ---- | -------------------------------- | ------------------- | -------- | -------- |
| 146 | `src/components/layout/BottomNav.tsx`  | 45   | Plus (center FAB)                | `strokeWidth={2.5}` | `1.5`    | MEDIUM   |
| 147 | `src/components/ui/Avatar.tsx`         | 61   | Check (verified badge)           | `strokeWidth={3}`   | `1.5`    | MEDIUM   |
| 148 | `src/features/messages/ChatDetail.tsx` | 141  | Check (verified badge in header) | `strokeWidth={3}`   | `1.5`    | MEDIUM   |

> `HargaDetail.tsx:65` (`strokeWidth={2.5}`) and `Harga.tsx:69` (`strokeWidth={2}`) are SVG `<path>` stroke widths for chart rendering — not Lucide icon props. Out of scope for this rule.

---

### 🟣 11. Semantic Token Pairing Violations — MD3 Contract Broken

Background tokens with non-matching foreground. Each MD3 background has a designated foreground (`on-*`) pair — using any other color breaks the semantic contract.

| #       | File                            | Line    | Background                             | Foreground Used                 | Expected Foreground                      | Severity |
| ------- | ------------------------------- | ------- | -------------------------------------- | ------------------------------- | ---------------------------------------- | -------- |
| 149     | `src/features/prices/Harga.tsx` | 145     | `bg-[#fc5f44]` (= secondary-container) | `text-white`                    | `text-on-secondary-container`            | HIGH     |
| 150     | `src/features/feed/Beranda.tsx` | 106     | `bg-primary` (ticker bar)              | `text-surface-container-lowest` | `text-on-primary`                        | HIGH     |
| 151–152 | `src/features/feed/Beranda.tsx` | 238–251 | `bg-gradient-to-t from-black/80`       | `text-white`, `text-white/70`   | `text-inverse-on-surface` (×4)           | MEDIUM   |
| 153     | `src/features/feed/Beranda.tsx` | 129     | `bg-primary/10` (mode badge)           | `text-on-primary-fixed-variant` | `text-on-primary` (transparency variant) | MEDIUM   |

> Finding 150: `text-surface-container-lowest` (#ffffff) and `text-on-primary` (#ffffff) resolve to the same hex, so this is invisible in V1 light mode. It becomes a bug in dark mode if dark tokens are ever introduced.

---

### 🔵 12. Missing tabular-nums on Numeric Fraunces Display

Per design tokens rule: **always apply `tabular-nums` when Fraunces displays numbers**. These elements render numeric content with `font-fraunces` but omit the class.

| #   | File                                  | Line | Element              | Numeric Content                           | Severity |
| --- | ------------------------------------- | ---- | -------------------- | ----------------------------------------- | -------- |
| 154 | `src/features/feed/Beranda.tsx`       | 106  | Ticker price span    | `{formatRupiah(item.price)}` — Rp amounts | MEDIUM   |
| 155 | `src/features/feed/CreateListing.tsx` | 256  | "Rp" currency prefix | Numeric currency prefix                   | LOW      |

> All other Fraunces numeric displays (Harga.tsx:164, Harga.tsx:271, HargaDetail.tsx:170, HargaDetail.tsx:223, Akun.tsx:116–124) already have `tabular-nums`. ✅

---

## Fix Roadmap by File

Ordered by impact and violation density. Fix `src/index.css` first — it affects every file that follows.

---

### 0. `src/index.css` — CRITICAL PREREQUISITE

**Effort: S (15 min)** | **Violations: 1 systemic**

| What                         | Current | Token to use           |
| ---------------------------- | ------- | ---------------------- |
| Missing `--radius` (DEFAULT) | absent  | `--radius: 0.5rem`     |
| Missing `--radius-md`        | absent  | `--radius-md: 0.75rem` |
| Missing `--radius-lg`        | absent  | `--radius-lg: 1rem`    |
| Missing `--radius-xl`        | absent  | `--radius-xl: 1.5rem`  |

---

### 1. `src/features/prices/HargaDetail.tsx`

**Effort: M (45 min)** | **Violations: 30**

| Line          | What              | Current                 | Token to use                                                     |
| ------------- | ----------------- | ----------------------- | ---------------------------------------------------------------- |
| 43            | Hex in className  | `text-[#b22a16]`        | `text-secondary`                                                 |
| 43            | Hex in className  | `bg-[#ffdad3]`          | `bg-secondary-fixed`                                             |
| 43            | Arbitrary size    | `text-[11px]`           | `text-body-sm`                                                   |
| 49–51         | SVG stroke hex ×3 | `stroke="#ebe8e3"`      | `stroke="var(--color-surface-container-high)"`                   |
| 64            | SVG stroke hex    | `stroke="#082717"`      | `stroke="var(--color-primary)"`                                  |
| 65            | SVG strokeWidth   | `strokeWidth={2.5}`     | `strokeWidth="2.5"` (SVG path, not Lucide — acceptable as-is)    |
| 77            | SVG stroke hex    | `stroke="#ffffff"`      | `stroke="var(--color-on-primary)"`                               |
| 86            | Arbitrary size    | `text-[9px]`            | `text-[9px]` (no token; document as intentional SVG micro-label) |
| 102           | Arbitrary size    | `text-[9px]`            | same as above                                                    |
| 110–111       | Arbitrary size ×2 | `text-[8px]`            | same as above                                                    |
| 115           | SVG stopColor hex | `stopColor="#082717"`   | `stopColor="var(--color-primary)"`                               |
| 116           | SVG stopColor hex | `stopColor="#fcf9f4"`   | `stopColor="var(--color-surface)"`                               |
| 142           | Native Tailwind   | `text-lg`               | `text-body-lg`                                                   |
| 163           | Arbitrary size    | `text-[10px]`           | `text-body-sm` (accept downgrade to smallest token)              |
| 166           | Native Tailwind   | `text-2xl`              | `text-headline-md`                                               |
| 170           | Native Tailwind   | `text-2xl`              | `text-headline-md`                                               |
| 173           | Native Tailwind   | `text-xs`               | `text-body-sm`                                                   |
| 178           | Native Tailwind   | `text-xs` (wrapper div) | `text-body-sm`                                                   |
| 180, 186, 190 | Arbitrary size ×3 | `text-[10px]`           | `text-body-sm`                                                   |
| 191           | Arbitrary size    | `text-[10px]`           | `text-body-sm`                                                   |
| 206           | Native Tailwind   | `text-lg`               | `text-body-lg`                                                   |
| 216           | Native Tailwind   | `text-xs`               | `text-body-sm`                                                   |
| 217           | Arbitrary size    | `text-[9px]`            | `text-body-sm`                                                   |
| 223           | Native Tailwind   | `text-base`             | `text-body-md`                                                   |
| 226           | Arbitrary size    | `text-[10px]`           | `text-body-sm`                                                   |

---

### 2. `src/features/feed/Beranda.tsx`

**Effort: M (40 min)** | **Violations: 28**

| Line               | What                 | Current                                           | Token to use                 |
| ------------------ | -------------------- | ------------------------------------------------- | ---------------------------- |
| 63                 | Native Tailwind      | `text-2xl`                                        | `text-headline-md`           |
| 104                | Native Tailwind      | `text-xs`                                         | `text-label-md`              |
| 106                | Arbitrary size       | `text-[11px]`                                     | `text-body-sm`               |
| 106                | Semantic pairing     | `text-surface-container-lowest` on `bg-primary`   | `text-on-primary`            |
| 106                | Missing tabular-nums | (on `formatRupiah`)                               | add `tabular-nums`           |
| 110                | Hex className        | `text-[#fc5f44]`                                  | `text-secondary-container`   |
| 110                | Arbitrary size       | `text-[10px]`                                     | `text-body-sm`               |
| 125                | Native Tailwind      | `text-xs`                                         | `text-label-md`              |
| 129                | Semantic pairing     | `bg-primary/10` + `text-on-primary-fixed-variant` | `text-on-primary`            |
| 129                | Arbitrary size       | `text-[10px]`                                     | `text-body-sm`               |
| 139, 147, 155, 163 | Native Tailwind ×4   | `text-xs`                                         | `text-label-md`              |
| 198                | Native Tailwind      | `text-xs`                                         | `text-label-md`              |
| 201                | Arbitrary size       | `text-[10px]`                                     | `text-body-sm`               |
| 208                | Native Tailwind      | `text-xs` (via `font-mono`)                       | `text-body-sm font-jakarta`  |
| 208                | font-mono            | `font-mono`                                       | `font-jakarta`               |
| 238, 247           | Semantic pairing     | `text-white` on dark overlay                      | `text-inverse-on-surface`    |
| 239, 248           | Semantic pairing     | `text-white/70`                                   | `text-inverse-on-surface/70` |
| 239, 248           | Arbitrary size ×2    | `text-[11px]`                                     | `text-body-sm`               |
| 242, 251           | Native Tailwind ×2   | `text-sm`                                         | `text-body-sm`               |
| 266                | Native Tailwind      | `text-lg`                                         | `text-body-lg`               |
| 278, 286           | Arbitrary size ×2    | `text-[10px]`                                     | `text-body-sm`               |
| 281, 287, 300, 310 | Native Tailwind ×4   | `text-xs`                                         | `text-label-md`              |

---

### 3. `src/features/prices/Harga.tsx`

**Effort: M (35 min)** | **Violations: 26**

| Line     | What               | Current                             | Token to use                                            |
| -------- | ------------------ | ----------------------------------- | ------------------------------------------------------- |
| 81       | Native Tailwind    | `text-3xl`                          | `text-headline-lg`                                      |
| 82       | Native Tailwind    | `text-xs`                           | `text-body-sm`                                          |
| 93       | Native Tailwind    | `text-xs`                           | `text-label-md`                                         |
| 95       | Arbitrary size     | `text-[10px]`                       | `text-body-sm`                                          |
| 95       | font-mono          | `font-mono`                         | `font-jakarta`                                          |
| 103      | Native Tailwind    | `text-xs`                           | `text-label-md`                                         |
| 145      | Hex className      | `bg-[#fc5f44]`                      | `bg-secondary-container`                                |
| 145      | Semantic pairing   | `text-white` on secondary-container | `text-on-secondary-container`                           |
| 145      | Arbitrary size     | `text-[9px]`                        | `text-body-sm`                                          |
| 154      | Arbitrary size     | `text-[10px]`                       | `text-body-sm`                                          |
| 156      | Native Tailwind    | `text-xl`                           | `text-headline-md` (nearest; accept slight size change) |
| 162      | Arbitrary size     | `text-[10px]`                       | `text-body-sm`                                          |
| 164      | Native Tailwind    | `text-2xl`                          | `text-headline-md`                                      |
| 167      | Native Tailwind    | `text-xs`                           | `text-body-sm`                                          |
| 172      | Native Tailwind    | `text-xs`                           | `text-label-md`                                         |
| 178      | Arbitrary size     | `text-[10px]`                       | `text-body-sm`                                          |
| 184      | Arbitrary size     | `text-[9px]`                        | `text-body-sm`                                          |
| 209      | Native Tailwind    | `text-xs`                           | `text-label-md`                                         |
| 210      | Arbitrary size     | `text-[11px]`                       | `text-body-sm`                                          |
| 218, 231 | Native Tailwind ×2 | `text-xs`                           | `text-label-md`                                         |
| 260      | Native Tailwind    | `text-sm`                           | `text-body-sm`                                          |
| 263      | Arbitrary size     | `text-[9px]`                        | `text-body-sm`                                          |
| 271      | Arbitrary size     | `text-[10px]`                       | `text-body-sm`                                          |
| 274      | Arbitrary size     | `text-[9px]`                        | `text-body-sm`                                          |
| 278      | Arbitrary size     | `text-[10px]`                       | `text-body-sm`                                          |

---

### 4. `src/features/messages/ChatDetail.tsx`

**Effort: M (35 min)** | **Violations: 24**

| Line | What             | Current                    | Token to use                         |
| ---- | ---------------- | -------------------------- | ------------------------------------ |
| 140  | Native Tailwind  | `text-sm`                  | `text-body-sm`                       |
| 141  | Arbitrary size   | `text-[5px]`               | No token; keep as micro-badge sizing |
| 141  | Icon strokeWidth | `strokeWidth={3}` on Check | `strokeWidth={1.5}`                  |
| 143  | Arbitrary size   | `text-[10px]`              | `text-body-sm`                       |
| 144  | Hex className    | `bg-[#466551]`             | `bg-surface-tint`                    |
| 173  | Arbitrary size   | `text-[10px]`              | `text-body-sm`                       |
| 176  | Native Tailwind  | `text-sm`                  | `text-body-sm`                       |
| 179  | Arbitrary size   | `text-[11px]`              | `text-body-sm`                       |
| 192  | Native Tailwind  | `text-xs`                  | `text-label-md`                      |
| 200  | Native Tailwind  | `text-xs`                  | `text-label-md`                      |
| 217  | Hex className    | `bg-[#c8ebd1]`             | `bg-primary-fixed`                   |
| 217  | Hex className    | `border-[#2f4d3a]/30`      | `border-on-primary-fixed-variant/30` |
| 219  | Hex className    | `text-[#022111]`           | `text-on-primary-fixed`              |
| 221  | Native Tailwind  | `text-xs`                  | `text-body-sm`                       |
| 221  | Hex className    | `text-[#022111]`           | `text-on-primary-fixed`              |
| 222  | Arbitrary size   | `text-[9px]`               | `text-body-sm`                       |
| 222  | Hex className    | `text-[#022111]/60`        | `text-on-primary-fixed/60`           |
| 222  | font-mono        | `font-mono`                | `font-jakarta`                       |
| 239  | Arbitrary size   | `text-[9px]`               | `text-body-sm`                       |
| 239  | font-mono        | `font-mono`                | `font-jakarta`                       |
| 260  | Arbitrary size   | `text-[11px]`              | `text-body-sm`                       |

---

### 5. `src/features/feed/CreateListing.tsx`

**Effort: M (30 min)** | **Violations: 23**

| Line                                                            | What                 | Current                                   | Token to use                       |
| --------------------------------------------------------------- | -------------------- | ----------------------------------------- | ---------------------------------- |
| 113                                                             | Native Tailwind      | `text-lg`                                 | `text-body-lg`                     |
| 120, 151, 167, 181, 201, 225, 239, 252, 270, 332, 352, 366, 377 | Native Tailwind ×13  | `text-xs`                                 | `text-label-md`                    |
| 128                                                             | Arbitrary size       | `text-[10px]`                             | `text-body-sm`                     |
| 188, 208                                                        | Native Tailwind ×2   | `text-xs`                                 | `text-label-md`                    |
| 256                                                             | Missing tabular-nums | `font-fraunces ... text-body-lg` for "Rp" | add `tabular-nums`                 |
| 261                                                             | Hex className        | `text-[#b22a16]`                          | `text-secondary`                   |
| 263                                                             | Native Tailwind      | `text-xs`                                 | `text-body-sm`                     |
| 282, 309                                                        | Native Tailwind ×2   | `text-xs`                                 | `text-label-md`                    |
| 283, 310                                                        | Arbitrary size ×2    | `text-[10px]`                             | `text-body-sm`                     |
| 289, 316                                                        | Arbitrary size ×2    | `text-[10px]`                             | `text-body-sm`                     |
| 295, 322                                                        | Native Tailwind ×2   | `text-xs`                                 | `text-body-sm` (input inside form) |
| 334                                                             | Hex className        | `text-[#b22a16]`                          | `text-secondary` (on MapPin icon)  |
| 345                                                             | Arbitrary size       | `text-[10px]`                             | `text-body-sm`                     |
| 386                                                             | Native Tailwind      | `text-xs`                                 | `text-label-md`                    |

---

### 6. `src/features/auth/Register.tsx`

**Effort: S (20 min)** | **Violations: 20**

| Line                    | What               | Current    | Token to use                                             |
| ----------------------- | ------------------ | ---------- | -------------------------------------------------------- |
| 109                     | Native Tailwind    | `text-xs`  | `text-label-md`                                          |
| 115                     | Native Tailwind    | `text-xs`  | `text-body-sm`                                           |
| 128                     | Native Tailwind    | `text-xs`  | `text-body-sm`                                           |
| 137, 205, 238, 302      | Native Tailwind ×4 | `text-2xl` | `text-headline-md`                                       |
| 143, 154, 165, 177, 187 | Native Tailwind ×5 | `text-xs`  | `text-label-md`                                          |
| 222                     | Native Tailwind    | `text-xl`  | no exact token; keep `text-xl` or use `text-headline-md` |
| 261, 286                | Native Tailwind ×2 | `text-lg`  | `text-body-lg`                                           |
| 310, 322                | Native Tailwind ×2 | `text-xs`  | `text-label-md`                                          |
| 339                     | Native Tailwind    | `text-xs`  | `text-label-md`                                          |
| 342                     | Native Tailwind    | `text-xs`  | `text-body-sm`                                           |
| 352                     | Native Tailwind    | `text-xs`  | `text-label-md`                                          |

---

### 7. `src/features/profile/Akun.tsx`

**Effort: S (20 min)** | **Violations: 19**

| Line          | What               | Current          | Token to use            |
| ------------- | ------------------ | ---------------- | ----------------------- |
| 95            | Native Tailwind    | `text-2xl`       | `text-headline-md`      |
| 99            | Arbitrary size     | `text-[10px]`    | `text-body-sm`          |
| 116, 120, 124 | Native Tailwind ×3 | `text-base`      | `text-body-md`          |
| 117, 121, 125 | Arbitrary size ×3  | `text-[10px]`    | `text-body-sm`          |
| 135, 146      | Native Tailwind ×2 | `text-xs`        | `text-label-md`         |
| 155           | Arbitrary size     | `text-[10px]`    | `text-body-sm`          |
| 164, 170      | Arbitrary size ×2  | `text-[11px]`    | `text-body-sm`          |
| 180           | Arbitrary size     | `text-[11px]`    | `text-body-sm`          |
| 198           | Hex className      | `text-[#b22a16]` | `text-secondary`        |
| 201           | Arbitrary size     | `text-[10px]`    | `text-body-sm`          |
| 209           | Hex className      | `bg-[#c8ebd1]`   | `bg-primary-fixed`      |
| 209           | Hex className      | `text-[#022111]` | `text-on-primary-fixed` |
| 209           | Arbitrary size     | `text-[9px]`     | `text-body-sm`          |

---

### 8. `src/features/auth/Login.tsx`

**Effort: S (10 min)** | **Violations: 10**

| Line    | What               | Current        | Token to use                            |
| ------- | ------------------ | -------------- | --------------------------------------- |
| 40      | Native Tailwind    | `text-xs`      | `text-body-sm`                          |
| 47, 65  | Native Tailwind ×2 | `text-xs`      | `text-label-md`                         |
| 66      | Native Tailwind    | `text-xs`      | `text-label-md`                         |
| 98      | Native Tailwind    | `text-xs`      | `text-label-md`                         |
| 106     | Native Tailwind    | `text-xs`      | `text-label-md`                         |
| 116–128 | SVG hex fills      | `#EA4335` etc. | **Google brand colors — DO NOT CHANGE** |

---

### 9. `src/features/messages/Pesan.tsx`

**Effort: S (10 min)** | **Violations: 8**

| Line | What                       | Current                 | Token to use                         |
| ---- | -------------------------- | ----------------------- | ------------------------------------ |
| 36   | Native Tailwind            | `text-3xl`              | `text-headline-lg`                   |
| 37   | Native Tailwind            | `text-xs`               | `text-body-sm`                       |
| 62   | Native Tailwind            | `text-xs`               | `text-label-md`                      |
| 97   | Native Tailwind            | `text-sm`               | `text-body-sm`                       |
| 98   | Arbitrary size             | `text-[6px]`            | no token; keep as micro-badge sizing |
| 100  | Native Tailwind            | `text-xs`               | `text-body-sm`                       |
| 107  | Arbitrary size + font-mono | `text-[10px] font-mono` | `text-body-sm font-jakarta`          |
| 111  | Arbitrary size             | `text-[9px]`            | `text-body-sm`                       |
| 115  | Arbitrary + font-mono      | `text-[10px] font-mono` | `text-body-sm font-jakarta`          |

---

### 10. `src/components/layout/CreateBottomSheet.tsx`

**Effort: S (10 min)** | **Violations: 6**

| Line       | What               | Current     | Token to use       |
| ---------- | ------------------ | ----------- | ------------------ |
| 47         | Native Tailwind    | `text-2xl`  | `text-headline-md` |
| 67, 81, 95 | Native Tailwind ×3 | `text-base` | `text-body-md`     |
| 68, 82, 96 | Native Tailwind ×3 | `text-xs`   | `text-body-sm`     |

---

### 11. `src/features/auth/Splash.tsx`

**Effort: S (10 min)** | **Violations: 4**

| Line | What               | Current       | Token to use                                     |
| ---- | ------------------ | ------------- | ------------------------------------------------ |
| 37   | Native Tailwind    | `text-4xl`    | `text-display-lg-mobile` (40px; closest to 36px) |
| 28   | Wrong radius token | `rounded-3xl` | `rounded-xl`                                     |
| 63   | font-mono          | `font-mono`   | `font-jakarta`                                   |
| 63   | Native Tailwind    | `text-xs`     | `text-body-sm`                                   |

---

### 12. `src/features/auth/Onboarding.tsx`

**Effort: S (10 min)** | **Violations: 3**

| Line | What               | Current         | Token to use       |
| ---- | ------------------ | --------------- | ------------------ |
| 72   | Native Tailwind    | `text-lg`       | `text-body-lg`     |
| 84   | Wrong radius token | `rounded-t-3xl` | `rounded-t-xl`     |
| 99   | Native Tailwind    | `text-2xl`      | `text-headline-md` |

---

### 13. `src/components/ui/Badge.tsx`

**Effort: S (5 min)** | **Violations: 2**

| Line   | What              | Current       | Token to use   |
| ------ | ----------------- | ------------- | -------------- |
| 16, 24 | Arbitrary size ×2 | `text-[11px]` | `text-body-sm` |

---

### 14. `src/components/ui/Avatar.tsx`

**Effort: S (5 min)** | **Violations: 4**

| Line | What            | Current           | Token to use        |
| ---- | --------------- | ----------------- | ------------------- |
| 24   | Arbitrary size  | `text-[11px]`     | `text-body-sm`      |
| 25   | Native Tailwind | `text-xs`         | `text-body-sm`      |
| 26   | Native Tailwind | `text-sm`         | `text-body-sm`      |
| 27   | Native Tailwind | `text-2xl`        | `text-headline-md`  |
| 61   | strokeWidth     | `strokeWidth={3}` | `strokeWidth={1.5}` |

---

### 15. `src/components/layout/BottomNav.tsx`

**Effort: S (5 min)** | **Violations: 3**

| Line   | What              | Current                     | Token to use        |
| ------ | ----------------- | --------------------------- | ------------------- |
| 45     | strokeWidth       | `strokeWidth={2.5}` on Plus | `strokeWidth={1.5}` |
| 47, 75 | Arbitrary size ×2 | `text-[10px]`               | `text-body-sm`      |

---

### 16. `src/components/ui/Button.tsx`

**Effort: S (5 min)** | **Violations: 1**

| Line | What            | Current                | Token to use    |
| ---- | --------------- | ---------------------- | --------------- |
| 41   | Native Tailwind | `text-xs` in `sm` size | `text-label-md` |

---

### 17. `src/components/layout/SafeArea.tsx`

**Effort: none** | **Violations: 0** ✅

---

## Summary Statistics

### Violations by Severity

| Severity   | Count   | Description                                                                                   |
| ---------- | ------- | --------------------------------------------------------------------------------------------- |
| **HIGH**   | 38      | Immediately visible; brand-critical (hex on CTA, wrong page title token, MD3 contract broken) |
| **MEDIUM** | 87      | Visible with attention; wrong token where correct one exists                                  |
| **LOW**    | 123     | Micro-details; sizes below design scale minimum; no token alternative                         |
| **TOTAL**  | **248** |                                                                                               |

### Violations by Category

| Category                               | Count | % of Total |
| -------------------------------------- | ----- | ---------- |
| Typography — arbitrary px sizes        | 65    | 26%        |
| Typography — native Tailwind non-token | 134   | 54%        |
| Color — hardcoded hex (className)      | 15    | 6%         |
| Color — hardcoded hex (SVG attributes) | 7     | 3%         |
| Color — semantic pairing               | 10    | 4%         |
| Typography — font-mono                 | 7     | 3%         |
| Border radius — systemic + specific    | 3     | 1%         |
| Icon — strokeWidth                     | 3     | 1%         |
| Missing tabular-nums                   | 2     | 1%         |

### Files Most Affected

| Rank | File                                          | Violations | Effort |
| ---- | --------------------------------------------- | ---------- | ------ |
| 1    | `src/features/prices/HargaDetail.tsx`         | 30         | M      |
| 2    | `src/features/feed/Beranda.tsx`               | 28         | M      |
| 3    | `src/features/prices/Harga.tsx`               | 26         | M      |
| 4    | `src/features/messages/ChatDetail.tsx`        | 24         | M      |
| 5    | `src/features/feed/CreateListing.tsx`         | 23         | M      |
| 6    | `src/features/auth/Register.tsx`              | 20         | S      |
| 7    | `src/features/profile/Akun.tsx`               | 19         | S      |
| 8    | `src/features/auth/Login.tsx`                 | 10         | S      |
| 9    | `src/features/messages/Pesan.tsx`             | 8          | S      |
| 10   | `src/components/layout/CreateBottomSheet.tsx` | 6          | S      |

### Clean Files ✅

- `src/components/layout/SafeArea.tsx` — 0 violations
- `src/main.tsx` — 0 violations
- `src/lib/utils.ts` — 0 violations
- `src/data/mockData.ts` — 0 violations
- `src/types/*.ts` — 0 violations
- `index.html` — 0 violations (Google Fonts import is correct per design tokens section 7)

### Recommended Fix Order

1. **`src/index.css`** — Add missing `--radius-*` tokens (systemic, affects everything)
2. **High-severity color** — ChatDetail, Akun, HargaDetail, Beranda, Harga (15 hex fixes)
3. **High-severity typography** — all `text-2xl → text-headline-md` (12 instances, highest visible impact)
4. **Semantic pairing** — 4 violations in Beranda and Harga
5. **Remaining typography** — file-by-file, lowest-priority `text-[9px]` / `text-[10px]` last
6. **Icons + tabular-nums** — quick wins, do alongside typography pass
