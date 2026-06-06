1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Code Quality

| Command                | What it does                    |
| ---------------------- | ------------------------------- |
| `npm run typecheck`    | TypeScript type-check (no emit) |
| `npm run lint`         | ESLint across all source files  |
| `npm run lint:fix`     | ESLint with auto-fix            |
| `npm run format`       | Prettier write                  |
| `npm run format:check` | Prettier check (CI-safe)        |

Pre-commit hook (Husky + lint-staged) runs Prettier and ESLint auto-fix on staged files. It never blocks a commit — errors are reported but the commit proceeds.
