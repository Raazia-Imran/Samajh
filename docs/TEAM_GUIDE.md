# Team guide

## Demo in under two minutes

1. Open Home, show the short welcome, then choose a real goal in search.
2. Search "share my screen". Select the task. Try Entire screen to show meaningful feedback, then select One window, the sample presentation, Share, and Stop.
3. Open microphone practice. Complete guided unmute, then try the changed view. Unmuting alone does not fix denied permission. Enable simulated microphone access and verify voice is on.
4. Show the result honestly: hints or demonstration requests are recorded. No mastery claim.
5. Show helper preview: add a kind note and launch the same supported task. It changes the learner experience without changing verified rules.
6. Close with accessibility, optional local saving, and the boundary that this is fictional practice, not live app control.

## Development roadmap

- Validate learning transfer with consenting adults, including a parent or grandparent. No study has yet been performed.
- Add fully reviewed Roman Urdu and Urdu-script explanations and recorded audio.
- Add verified app/device variants with last-reviewed versions.
- Add secure identity and durable storage only after an actual cross-device need is validated.
- Research workflow capture, redaction, author review, and generation of meaningful practice. These are not implemented.
- Pilot with an adult-learning organisation; willingness to pay remains untested.

## GitHub upload when integration write access is blocked

Download and extract the source ZIP. The ZIP excludes the managed `.git` directory and hosting identity. From the extracted folder:

```bash
git init -b main
git add .
git commit -m "Add Samajh accessible learning companion"
git remote add origin https://github.com/Raazia-Imran/Samajh.git
git push -u origin main
```

Use these only if the target repository remains empty. If someone has pushed meanwhile, clone and integrate instead of force-pushing. Do not fabricate earlier commit timestamps; the actual development history is retained in the private source repository, and the project bundle includes a development log.
