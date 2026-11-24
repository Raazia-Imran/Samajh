# SAMAJH | Project Continuity & Production Handoff

**Prepared:** 24 November 2026 (PKT)  
**Status:** Production foundation implemented; public launch and full third-party integrations are not complete.  
**Repository:** https://github.com/Raazia-Imran/Samajh  
**Start branch:** https://github.com/Raazia-Imran/Samajh/tree/production-foundation

## 1. Project identity and goal

- **VERIFIED FROM REPOSITORY:** Samajh (tagline: “A little help. A lot more confidence.”) began as a mobile-friendly web learning companion built for Build4Better on 31 October 2026. Its audience is adults unfamiliar with specific digital tasks, including parents, students and professionals. Avoid assuming that age means low ability.
- **USER-PROVIDED NOTE:** The next objective is to make Samajh genuinely useful to real people, not a demonstration that pretends to perform real calls, file operations, or external-service actions. The user wants richer UI, a real database, complete setup and developer documentation, and a handoff that another AI can continue.
- **VERIFIED FROM REPOSITORY:** Its original learning mechanism is goal selection, a reviewed template, contextual feedback, a guided practice attempt, a different-layout attempt, and honest learning observations. A trusted helper can select a supported task and leave a note.
- **INFERENCE / DECISION:** Retain the eight fictional exercises solely as an optional, clearly separated safe practice area. Real tools are now separately promoted. The user requested removal of simulated outcomes from real workflows; final product decision on retiring practice entirely remains open.
- **Success criteria:** Actual supported workflows behave truthfully, remain accessible for nontechnical users, never pretend an outside service action succeeded, keep privacy and permission boundaries, support durable owner-only account data, pass real-device and staging tests, and can be safely launched.
- **UNRESOLVED:** Formal product requirements, launch date, public deployment origin/domain, hosting choice, registered hackathon team identities, and success metrics for a real learner pilot are not confirmed. No claim of previous submission, approval, participant count, novelty or learning efficacy.

## 2. Source of truth and materials

- **VERIFIED FROM REPOSITORY:** `Raazia-Imran/Samajh` is public, accessible and writable via the authorized GitHub connection. Default branch `main` retains the prototype commit `abb2c2e9050b389f488e477a0a4b1ca6c579a060` (“Add complete Samajh app, instructional videos, tests, and original development archive”).
- **VERIFIED FROM REPOSITORY:** New branch `production-foundation` is updated. Remote commit: `27b98f3326adac601dac4fa7037d844de8ba0bcc`. Its tree `b50a6c490fad389a1155c580f49f53e0a06c5690` exactly matches the locally tested commit tree. Use that branch to resume, not `main`. Main was deliberately left unchanged to avoid an accidental release. No merge or deploy occurred.
- **VERIFIED FROM REPOSITORY:** `README.md` on the new branch is rewritten with architecture, clone/build steps, database and truthful feature scope. `docs/PRODUCTION_READINESS.md` is the prioritized release gate; `docs/QA_V2.md` is current verification; `docs/QA.md` and `docs/TEAM_GUIDE.md` are historical prototype evidence. `docs/development-history.bundle` is the original development archive. Do not rewrite original commit timestamps.
- **VERIFIED FROM CURRENT FILE:** Earlier 31 October handoff `Samajh_Complete_Handoff.md` described eight fictional interfaces, 10 unit tests, no backend/account/API keys, and prior managed-browser QA. The earlier team brief `Samajh_Final_Team_Brief.pdf` (9 pages) and `Samajh_Complete_Project_Plan.pdf` (9 pages) describe a safe learning MVP. These are historical design and event context, not proof of implementation or submission. Older proposed React/TypeScript/Vite architecture is superseded by actual vanilla-JS source.
- **VERIFIED FROM CURRENT FILE:** The user's connected Windows PC has older `D:\PROJECTS DATA\Samajh_Complete_Handoff.md` and `Samajh_Complete_Handoff.pdf`. This new `D:\PROJECTS DATA\Samajh\Summary` folder is the intended continuity location. The originals must be preserved.
- **Historical source references:** `Samajh_Complete_Handoff.md` (31 Oct); `Samajh_Final_Team_Brief.pdf`; `Samajh_Complete_Project_Plan.pdf`; Build4Better participant rulebook referenced by the earlier brief. The historical event rules include an under-two-minute demo and four-slide deck as described in the earlier brief; its timing notes conflict (seven vs eight hours). Treat event information as historical; confirm authoritative organizer records before relying on it. No current submission deadline or event receipt was found.
- **Scope:** No project-specific attachments were present in this chat's source list. A fresh clone, repository files, historical documents, and project-specific database access were inspected. Underlying prior full chat logs, external provider accounts, human approval records, and live frontend deployment were not verified. No other user's or project’s data was merged into this handoff.

## 3. Feature readiness and true workflow boundaries

**VERIFIED FROM REPOSITORY:** New real-tools page `dist/live.html` with `live.js`, `live-utils.js` and `live.css` and entry links from Home and Explore Tasks. It is a real-world workspace with explicit confirmation/limitations, not a simulation; automated browser testing could not run in this environment, so the code is implemented but not device-verified.

- **Join video meeting:** accepts common HTTPS Zoom/Meet invitation URLs, validates recognized hosts/path and opens the real provider. Does not itself join, create a meeting, check host admission, or manage actual camera/mute. Actual meeting embedding requires an authorized Zoom/Meet-compatible integration and provider-specific review.
- **Microphone/unmute and permissions:** optional practice plus official service instructions. No actual device permission/capture in Samajh. User checks real pre-join controls inside provider.
- **Share one window:** official provider guidance; actual window selection and sharing happen in meeting app. No embedded capture or streaming integration implemented.
- **Background blur:** official provider guidance. No live segmentation, camera capture, or real provider blur operation in Samajh.
- **Send PDF:** user chooses an actual PDF and invokes the native device share menu if supported. Samajh does not upload it or send automatically. Recipient and delivery are confirmed in the chosen messaging app. Fallback is manual attachment.
- **Rename real file:** user selects a real file, enters a new base name, and requests download of a copy with its original extension/content preserved. Original file is not changed in place. Browser/device download behavior still needs testing. Filename rules reject unsafe or invalid names.
- **Sharing permissions and recipient:** actual HTTPS link copy with instructions to choose the right access inside Drive. No external permission changes or access verification; any managed integration requires provider API authorization.
- **Fix/submit forms:** real website or provider help only. The existing fictional form is optional practice. No arbitrary form submission, fake confirmation numbers for real services, or external form receipt claims.
- **File vs link:** actual PDF chooser/native sharing and link copying demonstrate the difference; no access revocation, delivery or recipient-access verification by Samajh.
- **Learning history:** optional per-browser practice records remain. Cloud account UI adds email sign-in, explicit import from saved device records, cloud history refresh, duplicate suppression and account-specific history deletion. Hosted schema is real. Client end-to-end/auth email verification remains pending.
- **Helper workflow:** still template-and-note based. Link contains optional first name/note in the fragment, readable by anyone with the link; do not add secrets. Secure cloud-shared helper links, role-based helper dashboard, and invitations are not implemented.
- **Not implemented:** embedded meeting SDK, arbitrary third-party application control, phone automation, automatic workflow screen analysis, real external document conversion/export, full Urdu/RTL, arbitrary live AI tutoring, real-user data collection study, and public production release. Do not present any of these as finished.

## 4. Architecture and data location

**VERIFIED FROM REPOSITORY:** HTML/CSS, vanilla JavaScript ES modules and local assets. `dist/` is currently source for the original static UI. `src/` holds the account module bundled by esbuild. Node 20+ is required; npm dependencies are pinned in the lockfile (`@supabase/supabase-js` 2.119.2, `esbuild` 0.28.2). Python 3 serves locally. There is no Next.js, React, Django, or Express server in this repository.

**Actual data flow:** learner → safe practice engine → memory or consented localStorage → explicit import through authenticated browser client → Supabase PostgreSQL. Real tools operate through the learner's browser/OS or official provider page; no Samajh upload or recording pipeline. IDs and timestamps in cloud observations are client-reported learning data, not trustworthy certification.

**VERIFIED FROM CURRENT CONFIGURATION:** The dedicated hosted Supabase project was created with the user's approval on 24 Nov 2026. Organization: `raaziaimran`; name: `Samajh`; project reference: `xkqsuhpezhxwyqfwijjn`; region `ap-south-1`; creation quote $0/month; project creation returned ACTIVE_HEALTHY. Free-plan limits, pausing and availability should be monitored. No existing unrelated Supabase database was reused.

- Dashboard: https://supabase.com/dashboard/project/xkqsuhpezhxwyqfwijjn
- API URL: https://xkqsuhpezhxwyqfwijjn.supabase.co
- Source of schema: `db/initial_learning_attempts.sql` (migration `initial_learning_attempts` applied successfully). New table: `public.learning_attempts`.
- Fields: `id` UUID PK, `user_id` UUID owner referencing `auth.users` (cascade on user deletion), `task_id` constrained to eight known exercises, `transfer` boolean, `hints` bounded integer, `completed_at` timestamp, `created_at` timestamp. Unique composite constraint avoids duplicate imports.
- **VERIFIED FROM CURRENT DATABASE:** table row count 0 at inspection. RLS enabled with authenticated SELECT/INSERT/DELETE predicates matching `auth.uid()` and owner column. Anonymous SELECT denied; authenticated UPDATE not granted. Initial security advisor returned zero findings at check time; not a security audit or behavioral isolation proof.
- **VERIFIED FROM REPOSITORY:** `src/public-config.js` includes only project URL and publishable browser key. Never put service-role key, DB password, SMTP password, OAuth client secret, access tokens or user data in repo, PDF or handoff. No files, helper notes, call links, contact lists, camera/mic streams or passwords are stored in the learning table.
- **UNRESOLVED:** Email sign-in must be configured and tested: exact localhost and final origin callback URLs, verified sender/SMTP, email delivery, CAPTCHA/rate limits as appropriate, account deletion/retention, backups, support process. The default hosted mail service is not a public-launch solution. Authenticate two consenting test accounts to verify RLS through the actual browser client. Do not claim account flows are proven yet.

## 5. Developer map and cloning guide

**Files to inspect before editing:**

- `README.md`, `docs/PRODUCTION_READINESS.md`, `docs/QA_V2.md`, `package.json`, `package-lock.json`, `.gitignore` and `dist/_headers`.
- `dist/index.html`, `dist/app.js`, `dist/engine.js`, `dist/style.css`: original UI, navigation, teaching logic, state rules, progress. Preserve the established accessible style and reviewed rules.
- `dist/live.html`, `live.js`, `live-utils.js`, `live.css`: real tools page, file/link actions, URL and filename validation, new design.
- `dist/account.html`, `src/account.js`, `src/cloud-records.js`, `src/public-config.js`: cloud auth, opt-in import, history and config. `dist/account.bundle.js` is generated, ignored by Git, must be rebuilt.
- `db/initial_learning_attempts.sql`: source migration. Verify live schema before modification; never rerun against unrelated or existing production tables blindly.
- `tests/engine.test.mjs`, `tests/live.test.mjs`, `tests/cloud-records.test.mjs`: deterministic regression checks. `dist/assets/` contains local fonts, SVG, videos, captions; `tools/` media scripts are for regeneration, not needed for ordinary use.
- `docs/QA.md`, `docs/TEAM_GUIDE.md`, `docs/development-history.bundle` and prior handoffs explain prototype history. Use dated evidence accurately.

**Windows setup (fresh clone):** Install Git, Node.js 20 or newer, npm and Python 3. Open Command Prompt in desired development directory. Run each command separately:

```bat
git clone https://github.com/Raazia-Imran/Samajh.git
cd Samajh
git switch production-foundation
git log -1 --oneline
npm ci
npm run build
py -m http.server 3000 --directory dist
```

Open `http://localhost:3000`. Home contains Real Tools and Cloud Learning links. Direct real tools: `http://localhost:3000/live.html`. Cloud learning: `http://localhost:3000/account.html`. If `py` is unavailable, use `python -m http.server 3000 --directory dist`. On Linux/macOS use `npm start` (includes build via prestart). Stop with Ctrl+C. Use a different port only after updating the auth callback allowlist for account sign-in.

**Existing clone:** Run `git status` to protect edits, then `git fetch origin`, `git switch production-foundation`, `git pull --ff-only`, `npm ci`, `npm run build`. Do not force-push or reset the user's working tree. To work independently create a new branch from the verified v2 revision. To clone the base prototype, `git switch main`; do not confuse it with the production foundation.

**Local testing:** run `npm run check`, `npm test`, `npm run build`. The shared hosted database is connected through the public browser configuration. Use only your own consenting test account and synthetic file data. If isolated dev DB is needed, create a separate project, apply migration once, configure its public URL/key and rebuild; never use a service-role key in browser. Do not write test data to a live user account.

**Hosting:** build command `npm ci && npm run build`; output directory `dist`; HTTPS required for modern browser APIs and sign-in. `_headers` is host-dependent; replicate its restrictions on the actual host and verify them. Set Supabase Auth Site URL and exact `https://<staging-or-live-domain>/account.html` callback plus approved localhost URL. Do not launch publicly until sign-in, RLS, devices and provider actions are verified.

## 6. Work completed, checks and evidence

- **VERIFIED FROM REPOSITORY:** v2 remote branch commit `27b98f3326adac601dac4fa7037d844de8ba0bcc`, parent original prototype; same tested tree `b50a6c490fad389a1155c580f49f53e0a06c5690`. 20 files changed in the transition commit, 1,032 insertions and 65 deletions in local commit. The generated bundle is built locally, not checked in. README, production readiness and QA docs are in the remote branch.
- **VERIFIED FROM CURRENT TEST OUTPUT:** Node v24.22.3, checks passed; tests 14/14 (10 preserved engine/search tests plus four new real-tool/cloud data tests), zero failures/skips/cancellations. esbuild generated `dist/account.bundle.js` (approximately 230.3 kB). `git diff --check` passed. This is syntax, unit and build evidence, not end-user verification.
- **VERIFIED FROM CURRENT DATABASE:** dedicated project, migration success, RLS and grants verified, no existing rows, zero initial security lints. Not a real login or account isolation test.
- **UNRESOLVED / BLOCKER:** Chromium browser automation failed before opening a page because the execution environment disallowed the required socket. No browser download, native share, clipboard, responsive layout or account flow test was completed. A real browser/device test is essential.
- **UNRESOLVED:** No public frontend deployment; old private Sites version (mentioned historically) is separate from GitHub and current state is unverified. No live Zoom SDK, embedded meeting, OAuth integration, external forms, real messages, or provider credentials configured.
- **USER-PROVIDED NOTE:** User asked for substantial production conversion and richer UI, repository and handoff. This turn created foundation and routing, not the entire product. Do not market it as 100% ready.

## 7. Decisions, people, risks and launch sequence

- **VERIFIED FROM REPOSITORY:** Preserve the initial accessible, friendly learning design, English instructions and partial Roman Urdu labels, original media, and reviewed deterministic practice state engine. Use clear English and straightforward labels. Full Urdu-script/RTL and localization are future work. No formal accessibility audit or actual learner test has been completed.
- **INFERENCE / DECISION:** Prioritize actual user-consented browser tools and provider handoffs over pretending a generic website can control arbitrary installed apps. Third-party OAuth and SDK paths require official provider APIs, app registration, scopes, verification, licensing and consent. No invasive capture, background monitoring or silent external action.
- **USER-PROVIDED NOTE:** Free Supabase only; user approved the `raaziaimran` organization and folder-specific remote access. Project owner controls the GitHub repository; provider accounts and release decisions belong to the user. Actual team names/responsibilities and supervisor/instructor sign-off remain unverified. A future developer can maintain frontend, database/auth, provider integrations and QA; never assume these tasks were assigned to a particular person.
- **Key risks:** auth email service and redirects; Supabase plan limits; no tested two-user separation in client; pre-existing helper link privacy; native share/browser fragmentation; misleading external action status; no real participant evidence; independent review of privacy/accessibility; host headers; lack of production account deletion/support process. Test cancellation/failure and avoid real personal data in test records.
- **Priority 1 (release blocker):** establish staging HTTPS hosting, configure Supabase auth redirects and production email sender, verify sign-in with two consenting test accounts. Test import/re-import/refresh/delete and cross-account denial plus guest denial. Record exact commit, browser, device, outputs, no secrets.
- **Priority 2:** test real tools and old practice on desktop and physical Android/iOS, 200% zoom and keyboard/screen reader; verify file download content/filename with a synthetic file, supported native share and cancellation, link copy, and valid meeting handoff with consent. Confirm no secret/link/file is accidentally stored or transmitted.
- **Priority 3:** decide which 3rd-party integrations are genuinely needed for public users. Register or authorize official Zoom/Meet/Drive/messaging applications if needed. Implement supported API features only, restricted scopes, safe consent, proper server-side secret handling, truthful error states. Distinguish meeting handoff from actual attendance.
- **Priority 4:** complete product privacy policy/retention/deletion/support, user onboarding, real learner pilot, UI/accessibility refinement, localization, hosting security headers, monitoring/rollback. Then approve reviewed staging commit for public launch. Do not promise a launch date or performance metrics without evidence.

## 8. Resume here — AI continuation prompt

You are continuing Samajh for its owner, Raazia-Imran. The current source of truth is the `production-foundation` branch at remote commit `27b98f3326adac601dac4fa7037d844de8ba0bcc` (inspect latest branch before edits). Main is the preserved old practice-only version. Read README, production readiness, QA_V2, source files, migration and this handoff. The dedicated Supabase project exists and has an empty, RLS-protected learning_attempts table; do not create another or use unrelated databases without authorization. Never expose secrets. Distinguish source implementation, unit tests, actual browser validation and real service outcomes. Do not make simulated actions look real.

**Single best next action:** prepare a staging release with a verified browser and Supabase account flow. Confirm hosting and the exact redirect URL with the owner, configure a real production-capable email sender with user approval, then use two consenting test accounts. Expected output is a release-readiness QA report tied to the verified staging commit: PASS/FAIL/NOT TESTED per account/data isolation, real file/link/meeting handoff, native share, responsive different devices, accessibility and error cases. Fix any failures before proposing launch. Only after this evidence exists should you merge or publish a launch build.

Do not silently deploy, push unrelated changes, buy services, contact people or submit anything. If a provider registration or credential is needed, ask only for the required authorization/config; do not request secrets in plaintext chat. Preserve existing work and record every change with evidence. User expects clear English and natural student-level clarity, with complete practical steps.

**Change log**

- 31 Oct 2026 — **VERIFIED FROM REPOSITORY / CURRENT HISTORICAL FILE:** original Build4Better interactive prototype and 10-test baseline; full handoff and earlier plans produced. Submission status not established.
- 24 Nov 2026 — **USER-PROVIDED NOTE:** requested real-user product, repository cleanup and complete handoff; approved free-only database and scoped remote folder access.
- 24 Nov 2026 — **VERIFIED FROM REPOSITORY:** production-foundation branch published with real tools, new optional account UI, current docs and 14-test suite; main remains preserved.
- 24 Nov 2026 — **VERIFIED FROM CURRENT DATABASE:** dedicated Supabase project provisioned at $0/month creation quote, initial migration applied, RLS/grants and empty table verified.
- 24 Nov 2026 — **UNRESOLVED:** staging UI and auth email/cross-account tests blocked or not yet performed; no live launch. This record must be updated after verification.

**Official technical references (verify latest before implementation):**

- Supabase passwordless auth: https://supabase.com/docs/guides/auth/auth-email-passwordless
- Supabase production SMTP: https://supabase.com/docs/guides/auth/auth-smtp
- Supabase row-level security: https://supabase.com/docs/guides/database/postgres/row-level-security
- Zoom meeting invite links: https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0065180
- Google Meet support: https://support.google.com/meet/
- Google Drive sharing: https://support.google.com/drive/answer/2494822

**End of handoff — do not treat this as a certificate of production readiness.**
