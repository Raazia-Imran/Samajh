# Samajh

**A little help. A lot more confidence.**

An accessible, mobile-friendly web learning companion for everyday digital tasks. Built for Build4Better on 31 October 2026. People can be experts in their own lives and professions while unfamiliar with a particular digital task. Samajh welcomes parents, students, and professionals without assumptions about their ability.

## Run locally

No installation or API key is required for the application.

```bash
# Requires Python 3
python3 -m http.server 3000 --directory dist
# Open http://localhost:3000
```

Alternatively, `npm start` runs the same command. Do not open `index.html` directly as a file: the app uses ES modules.

## Implemented

- A skippable illustrated welcome and deliberately gentle motion.
- Searchable goals, topic filters, honest unsupported-query fallback.
- Eight working interactive simulations: microphone/permission, one-window screen sharing, background blur, PDF export and attachment, restricted sharing, form validation, quiet meeting entry, and file versus link understanding.
- Guided practice followed by a changed-view attempt. The microphone attempt additionally changes the underlying cause from mute alone to permission plus mute.
- Contextual feedback and a cause-aware pure state engine.
- A 12-second captioned introduction plus eight silent captioned visual step-guide videos.
- User-triggered English browser speech, visual/text fallbacks, hints, and replayable steps.
- Helper-selected task with reviewed instructional rules and an optional personal note. URL-based learner links include the note; they have no server persistence.
- Session learning history, optional browser-local saving, download summary, and history deletion.
- Keyboard operation, dialog focus containment, reduced-motion support, text enlargement, responsive mobile navigation, and no mandatory account.
- English plus Roman Urdu task titles and selected navigation. Full explanations currently remain English; this is explicitly disclosed.

## What is simulated

Every call, permission, device setting, message, recipient, document, form, and export flow is fictional. The prototype never accesses a camera, microphone, contacts, real files, or banking account. A sample PDF within the simulation is not a real exported document. The optional progress download is a real JSON summary.

Real Zoom, Meet, Canva, operating systems, host restrictions, and device versions vary. Official Zoom and Google Meet support links are provided. Samajh has no live app integration, arbitrary screen capture, remote control, backend, authentication, or live AI inference. The visual step-guide videos are authored illustrations, not footage of real apps.

## Architecture

- `dist/index.html`: semantic application entry.
- `dist/style.css`: responsive design, locally hosted fonts, motion and accessibility preferences.
- `dist/app.js`: navigation, screens, teaching flow, helper links, accessible dialogs, progress and browser speech.
- `dist/engine.js`: task catalog, goal search, pure state transitions, completion conditions.
- `dist/assets/`: original SVG brand, authored videos/posters/captions, local open-license fonts.
- `tests/engine.test.mjs`: meaningful rules and regression tests.
- `tools/`: reproducible original instructional media scripts. Pillow and FFmpeg are only needed to regenerate media, not to run the app.
- `.openai/hosting.json`: private Sites deployment configuration. No secrets.

## Validation

```bash
npm run check
npm test
```

Tests cover cause separation, sharing boundaries, stopping a share, file/link distinctions, confirmation rules, validation with preserved input, quiet entry, and natural-language catalog matching. Browser QA is described in `docs/QA.md`.

## Privacy

No advertising, analytics scripts, or personal-account data collection. Progress is kept in memory unless the learner enables local saving. Clear history removes saved attempts. Browser speech may be processed by the device's browser speech service. Hosting infrastructure may keep technical logs. Fonts and videos are local.

Helper links put the optional first name and note in the URL fragment. Anyone with the link and site access can read that content. Do not put confidential details into notes. All inserted text is escaped and fields are length-limited.

`dist/_headers` supplies suggested security headers for compatible static hosts. Hosting platforms differ; do not assume those headers are applied by every host. No security certification is claimed.

## Team and AI disclosure

Project owner: Raazia-Imran (GitHub repository owner). Team member identities were not supplied to the implementation agent; the submitting team should add its actual registered members before submission. Do not invent team identities.

OpenAI ChatGPT/Codex assisted ideation, original coding, design, media generation scripts, testing, and documentation. The team remains responsible for understanding and explaining the implementation. This app makes no claim of proven efficacy or global novelty. No participant interview findings or user-study metrics are fabricated.

## Third-party credits

- DM Sans and Manrope: Google Fonts, SIL Open Font License; licenses included in `dist/assets/fonts/`.
- Browser APIs: Web Speech API, native video, localStorage, URL and clipboard APIs.
- Python Pillow and FFmpeg: development-only media generation tools.
- Conceptual research precedent: [Synapse](https://arxiv.org/abs/2209.09596). No source code from existing training products was copied.

## Submission version

Identify the final submitted commit with `git rev-parse HEAD` at the actual submission cutoff. The team must record that exact identifier in its submission and stop modifying that submitted version after the deadline. This repository does not claim a submission has already been made.

## Deployment

Deploy the contents of `dist/` on any static host; no build command is needed. The Sites version is owner-private by default. GitHub source synchronization depends on the connected GitHub integration having Contents write access.
