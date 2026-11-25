# Practice Studio and community launch

The studio includes eight curated practices, four color-coded packs, and a private browser-local practice builder. Personal drafts and guided practices work without an account. “Checked by you” is a learner confirmation. A browser-recorded tool signal means the specific local action happened, such as requesting a download, not that an external task succeeded.

## Publish and maintain submissions

1. Apply the checked-in `practice_studio` Supabase migration on the Samajh project. Existing cloud learning records are separate.
2. Configure a production email sender in Supabase Auth. Set the Site URL to the actual Samajh HTTPS origin and add the exact `/studio.html` redirect. Keep preview URLs separate and narrowly scoped. Test an external mailbox and the PKCE callback with a real authorized account. The Studio session is scoped to the current tab; complete sign-in in that same tab.
3. After the intended reviewer has a confirmed Supabase Auth account, add that **verified account UUID** to `public.practice_reviewers` through the authorized Supabase SQL Editor. Never grant reviewer access based on a display name or an email typed into the site. Refresh the Studio after assigning or removing membership.
4. Sign in with two different contributor accounts. Verify that an author can submit and see their own pending row, other users cannot read it, and only a reviewer can publish. In Review Queue, read the whole practice before publishing. Check accuracy, clarity, safety, duplicate content, and personal details. Decline submissions that fail review. Public cards show approved text, optional credit, and review date.
5. Check Reported Practices regularly. Archive unsafe or badly outdated practices. Dismiss reviewed reports that do not need action. A browser report requires sign-in and an account can submit one outstanding report per practice.

## Security and privacy

- Supabase row-level security controls read and write access. Private submissions and public cards are separate tables; public cards contain no owner ID or email. Column grants prevent an author from setting owner or review status. A reviewer decision is transactional and runs with the caller's privileges.
- Submissions are limited to three pending and five per day per account. Plain text, field limits, and no raw web links or HTML are enforced at the database and application layers. Review remains necessary for text with unsafe instructions or personal details. No contributor HTML or scripts are rendered.
- Do not attempt to block DevTools. Server rules are the source of truth. The public Supabase key identifies the project and is not a privileged credential. Never add a service-role or SMTP key to frontend code.
- The site uses strict same-origin scripts and styles, HTTPS enforcement, framing prevention, and no-referrer navigation. The browser still asks permission for mic and display tools. The app intentionally adds no analytics or advertising cookies. Privacy settings explain and clear selected browser storage.
- Before broad launch, confirm email delivery, the production callback, reviewer ownership and capacity, a private support/contact channel, and the retention/deletion process for cloud accounts and submissions. Check current logs and provider limits. Do a physical-device review of mic, screen preview and sharing.

References: [Supabase Auth SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Data API security](https://supabase.com/docs/guides/api/securing-your-api), [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP).
