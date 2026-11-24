# Samajh v2 — Production readiness (24 November 2026)

The source-controlled transition adds real-world tools and a hosted learning database. The base commit is `abb2c2e9050b389f488e477a0a4b1ca6c579a060`. The `production-foundation` branch preserves the prototype and avoids an accidental production deployment from main.

| Original exercise or requested operation | Current real path | Remaining limitation |
|---|---|---|
| Microphone permissions, unmute | Official Zoom/Meet guidance | Controls and permission prompts belong to provider; no capture in Samajh. |
| Share one window | Official provider guidance | No embedded screen capture or meeting share integration. |
| Background blur | Official provider guidance | No actual background segmentation or meeting SDK. |
| Send PDF | User-selected local PDF and native device share if supported | Confirm recipient and delivery in chosen app; no auto-email or messaging. |
| Share with right person | Copy HTTPS link and official Drive instructions | Does not change permissions; provider OAuth/API and consent required. |
| Fix / submit form | Official service help | Cannot submit arbitrary external forms or validate receipt. |
| Join video meeting | Recognised HTTPS Zoom/Meet invite handed off to service | Opening is not joining. Meeting SDK/host policies required for embedding. |
| File vs link | Actual file choice/share or link copy | Does not verify external access. |
| Rename file | Download renamed real copy | Original is unchanged; browser and device tests needed. |
| Learning history | Optional device saving plus explicit import to actual PostgreSQL | Email, redirects, two-account isolation and lifecycle tests outstanding. |

Safe exercises remain separately available. A generic website cannot directly control other applications. Do not describe simulated outcomes as actual results or build unconsented screen, audio or file capture. Product integrations need explicit authorization, supported provider APIs and testing.

## Database

Project `Samajh`, ref `xkqsuhpezhxwyqfwijjn`, organization `raaziaimran`, region `ap-south-1`. Creation quote $0/month. Schema `db/initial_learning_attempts.sql`. No service-role key or DB password in the repo. Client-submitted observations are not trusted certificates.

Before external signup: configure exact redirect URLs, production SMTP, verified sender domain, appropriate rate limiting/CAPTCHA, privacy notice with retention/deletion, account deletion request handling, backups and incident response. Test magic-link sign-in. The default Supabase email sender is not suitable for a public user base. [SMTP setup](https://supabase.com/docs/guides/auth/auth-smtp) and [passwordless sign-in](https://supabase.com/docs/guides/auth/auth-email-passwordless).

## Release gate

1. Run `npm ci`, `npm run check`, `npm test`, `npm run build`; record commit and output.
2. On staging HTTPS, test practice, real-tool navigation, file download byte equality using synthetic files, native share/cancel, link copy, invalid invitation rejection and real invite handoff with consenting participants. Confirm no Samajh file upload.
3. Configure mail and redirects; use two consenting test accounts. Verify sign-in/out, import, repeat import, refresh, deletion, neither account can access the other's records, and guest cannot read. Test network failures. Verify account lifecycle and retention separately.
4. Review provider integration scope, permissions, licenses and privacy. If pursuing Zoom SDK or Google Drive, register the app and use supported authorized interfaces. Do not claim full integration until tested.
5. Test desktop, actual iOS/Android device, keyboard/screen-reader and 200% zoom. Review translation. Conduct a consented learner pilot; record factual results.
6. Configure HTTPS hosting and headers, monitored free-plan limits, backup/rollback and support. Verify staging and production URLs before inviting public users.

Official references: [Zoom invite links](https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0065180), [Meet help](https://support.google.com/meet/), [Drive sharing](https://support.google.com/drive/answer/2494822). Browser native sharing and clipboard support varies. No verified meeting, sent message, external form receipt or permissions changed by Samajh.
