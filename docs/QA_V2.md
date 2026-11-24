# V2 validation record — 24 November 2026

## Verified in this session

- Fresh clone of the public repository, default `main` at `abb2c2e9050b389f488e477a0a4b1ca6c579a060` before changes. New branch `production-foundation`.
- Node v24.22.3: `npm run check` passed; `npm test` passed **14/14**, including the ten preserved original tests and four new validation tests; `npm run build` succeeded. No failed, skipped, or cancelled test was reported. These are automated unit/syntax/build checks, not browser feature verification.
- Supabase project `xkqsuhpezhxwyqfwijjn` created and returned `ACTIVE_HEALTHY`. Initial `public` schema inspection found no tables. `initial_learning_attempts` migration returned success.
- PostgreSQL query verified `learning_attempts` row count 0; RLS enabled; authenticated SELECT, INSERT, DELETE policies compare `auth.uid()` to `user_id`; authenticated UPDATE not granted; anonymous SELECT not granted. Supabase security advisors returned zero lints at this check. This is configuration evidence, not an independent security certification.
- `git diff --check` passed.

## Not verified

- Browser automation attempted against the local HTTP server but Chromium was stopped by the execution environment's permission restriction before opening a page. No desktop/mobile visual inspection, real rename download or clipboard browser test is claimed.
- Physical-device native share, actual meeting invitations and participant joining, live provider integration, accessibility audit, actual learner study, email delivery, authenticated client import/delete and two-account RLS behavioral checks still require a staging test.
- No public frontend deployment or live release was performed. No production email service or final auth redirect was configured. The original prototype's dated QA remains in `docs/QA.md` and must not be represented as v2 validation.
