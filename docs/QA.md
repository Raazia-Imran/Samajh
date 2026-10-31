# Validation record

Checked on 31 October 2026. No real learner study has been performed.

## Automated

`npm run check` passes JavaScript syntax checks. `npm test` passes 10 pure-state/search tests, covering all eight task types and the safety-relevant branching rules. No test simply snapshots the design.

## Browser checks performed in the managed Chrome preview

- Welcome opens, has language choices, closes through Start, and leaves the main interface usable.
- Home and task catalog render with navigation, categories, and task search.
- Natural request "share my screen" returns the relevant supported task first.
- Microphone guided attempt completes. The changed-view attempt starts with denied permission; unmute alone does not fix it. Changing simulated permission resolves it. Both attempts appear in learning history.
- Screen sharing distinguishes Entire screen from One window, shows privacy feedback, requires selecting the presentation, and resolves after stopping the active share.
- The form displays precise validation errors, accepts corrected sample fields, and displays an explicit confirmation.
- Helper name/note preview updates. Launching the guide displays the personal note. Copy link produces a URL with the supported task and escaped note content.
- Optional local saving is off by default. After enabling it, learning history survives a reload. The interface clearly distinguishes session-only and saved history.
- Motion toggle and settings update; dialogs have close controls, focus handling, and background interaction disabled.
- Task video loads with duration 9 seconds and readyState 4; native controls and caption track are present.
- Mobile layout was inspected in a narrow iframe (375 CSS px usable viewport) with no horizontal document overflow. Mobile welcome, task cards, and bottom navigation remain visible. This is responsive-layout QA, not testing on a physical phone.
- Media validation confirms the introduction is 12 seconds; eight task guides, posters, and caption files are bundled.

## Limits

Speech synthesis depends on browser/OS voice availability; English text remains the fallback. Roman Urdu currently covers titles and selected navigation, not full lessons. Accessibility has been reviewed through keyboard/focus implementation and visual/DOM inspection, not a formal audit or screen-reader certification. Header deployment behaviour depends on the hosting provider. No real Zoom/Meet integration, arbitrary screen understanding, backend, or cross-device learner account is implemented.
