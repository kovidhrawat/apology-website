# I'm Sorry 🥺

A small, cute, single-page apology site. Plain HTML/CSS/JS — no build step.

## What's interactive

- **Typewriter intro** under the heading (edit `typeLines`).
- **Flip cards** — tap each to reveal a message, with a tiny confetti puff.
- **"What I'll do better"** — tap any promise (or the emoji reaction bar) to
  send a burst of floating hearts/reactions; a little counter keeps score.
- **Forgiveness meter** — a slider that shifts the mood emoji, the page's
  background hue, and the caption; hits 100% → confetti + toast.
- **"Not yet" button** dodges your cursor on desktop, hops (staying on screen)
  on mobile.
- **"I forgive you"** → confetti + a little chime.
- **Tap the hero emoji** to send a burst of hearts.
- **Secret message** — tap the small 💛 in the footer `secretAfterTaps` times.
- **Shake your phone** → apology hearts + toast (asks motion permission on iOS).
- **Music toggle** (top-right) — a soft generated melody, no audio files, off by default.
- **Photo gallery** — hidden until she taps "I forgive you", then it appears,
  cycles the photos one by one (auto + prev/next + dots), with **Save this one**
  and **Save them all** download buttons.

## The goodbye message (Easter egg)

The hero button **Open the message** fades the page into a dark, quiet screen
with the closure letter (in [index.html](index.html), the `#closure` section)
and starts the song.

To add the song, put the file at `music/song.mp3`. It fades in, loops, and has a
small pause/play button top-right. If the file is missing, the button just
hides itself.

### Letter privacy (number lock)

The letter is **encrypted** in `letter.enc.json`; only the allowed mobile
numbers can open it. The readable letter and the numbers live in `private/`,
which is git-ignored and never pushed.

- Edit the letter: `private/letter.html`
- Allowed numbers (one per line): `private/numbers.txt`
- After changing either, run `node tools/encrypt-letter.mjs` and commit
  `letter.enc.json`.

Keep a backup of `private/` somewhere safe — it is not in the repo.

## Photos

Your images live in [photos/](photos/) as `photo-1.jpeg` … `photo-6.jpeg`.
To change them, drop in new files and update the `photos` array in
[script.js](script.js) `CONFIG` (`src` + `caption` for each). Downloads use the
`download` attribute and work once the site is served over http(s), e.g. on
GitHub Pages.

## Make it yours

Open [script.js](script.js) and edit the `CONFIG` object at the top:

- `name` — her name (shows in the big heading and the tab title)
- `typeLines` — the self-typing lines under the heading
- `reasons` — `{ icon, text }` for each flip card
- `forgivenMessage` — shown when she taps "I forgive you"
- `notYetMessages` — playful lines cycled when she taps "Not yet"
- `secretMessage` / `secretAfterTaps` — the hidden footer easter egg

You can also tweak the letter text directly in [index.html](index.html)
(the `#letter` section) and colors in [style.css](style.css) (`:root` at the top).

## Preview locally

Just open `index.html` in a browser. Or serve it:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repo on GitHub (e.g. `apology-website`) and push these files:
   ```bash
   git init
   git add .
   git commit -m "sorry"
   git branch -M main
   git remote add origin https://github.com/<you>/apology-website.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment**.
3. Set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. After a minute your site is live at
   `https://<you>.github.io/apology-website/`.

## Notes

- Fully responsive (mobile-first, buttons go full-width on small screens).
- Respects `prefers-reduced-motion` — animations turn off for users who ask.
- No external JS libraries; Google Fonts is the only external request.
