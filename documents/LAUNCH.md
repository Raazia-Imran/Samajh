# Samajh launch guide

## Services

| Service | Link and role |
| --- | --- |
| Public frontend | [Samajh on Vercel](https://samajh-eta.vercel.app/) |
| Tools page | [Tools for everyday tech](https://samajh-eta.vercel.app/live.html) |
| Deployment dashboard | [Vercel project](https://vercel.com/raazias-projects-142c0b42/samajh) |
| Database and authentication | [Supabase project](https://supabase.com/dashboard/project/xkqsuhpezhxwyqfwijjn) |
| Backend API origin | `https://xkqsuhpezhxwyqfwijjn.supabase.co` |
| Source and documents | [GitHub main](https://github.com/Raazia-Imran/Samajh/tree/main) |

The public frontend runs its tools in the browser. Supabase is the deployed managed backend and PostgreSQL database for the separate cloud-learning module. There is no separate Express or Django service to deploy. Database access is governed by row ownership policies in `db/initial_learning_attempts.sql`. No credentials belong in the handoff.

## Public tool scope

- Microphone check requests browser permission, then displays a live, local signal meter. Stop and page exit release the device. Clips are never recorded or uploaded.
- Screen/window preview uses the browser's picker and shows the selected source locally. Stop, the browser's stop control, and page exit release capture. Availability depends on the browser and device.
- Meeting links open the actual Zoom or Google Meet page. Participants join, mute and change effects using the provider's own controls.
- Rename downloads a copy of the selected file using the original bytes and extension. The source remains in its original location.
- PDF share hands a user-selected file to the device's native sharing interface when supported. The chosen app handles sending.
- HTTPS link copy uses the browser clipboard, with a manual fallback. Change recipient permissions in the original service.

Simulated lessons from the prototype are absent from launch navigation and entry pages. The old revision remains in Git history. The optional account module is outside the public onboarding path while its authentication is being verified. In-app meetings, background effects in those meetings, Drive permission changes and automatic external form submission require additional provider integration.

## Build and deploy

```bash
git clone https://github.com/Raazia-Imran/Samajh.git
cd Samajh
npm ci
npm run check
npm test
npm run build
```

Use Node.js 20 or newer. Run `py -m http.server 3000 --directory dist` on Windows or `npm start` on Linux/macOS. Open `http://localhost:3000/`. Deploy the `dist` output via Vercel using `npm run build` and the repository `vercel.json`. Preserve the HTTPS capture and content security headers.

## Before inviting users

Test Chrome/Edge desktop and real Android/iOS devices. Verify microphone denial and stop, display-share cancellation and stop, synthetic file rename and byte equality, PDF sharing and cancellation, clipboard fallback, and the handoff to a legitimate Zoom or Meet test invitation. Test keyboard controls, reduced motion and narrow layout. A user should control each browser permission prompt.

For cloud accounts, configure production SMTP and the exact Vercel account callback URL in Supabase. Then test email delivery, sign-in, import, deletion, and isolation between two authorized accounts before including the module in public onboarding. Real device previews and file tools can be used without cloud sign-in.
