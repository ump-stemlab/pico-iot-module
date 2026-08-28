# PROMPT — build Activity 2

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 2 — Make an LED Blink** to my existing teaching website.

**The site:** https://ump-stemlab.github.io/pico-iot-module/
**The repo:** https://github.com/ump-stemlab/pico-iot-module (public, my account is
`ump-stemlab`). GitHub Pages serves the `/docs` folder on `main`.

**The repo is already cloned on my machine** in my connected STEM LAB folder:

```
STEM LAB/Github Repo/pico-iot-module/
```

**Work directly in that folder.** Edit the files there; I commit and push in GitHub
Desktop afterwards. Don't use the GitHub website uploader — it is slow and corrupts
characters. Don't ask me for an access token; you shouldn't be handling one.

**Read these first, in this order:**

1. `CONTEXT.md` in the repo root — how the site is built, the board's pin map, the
   design system, and three rules that must not be broken.
2. `docs/activity-1.html` — the pattern to follow. Activity 2 should feel like the same
   person wrote it on the same afternoon.
3. `docs/teacher-1.html` — the pattern for the teacher page.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 2 genuinely needs a new component.

**What to build:**

- `docs/activity-2.html` — the student page.
- `docs/teacher-2.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/index.html` and `README.md`: move Activity 2 from "coming soon" to live.
- Update `CONTEXT.md` if you make a decision worth carrying forward.

**Activity 2 content:**

- **New idea:** loops, indentation, and `sleep`. One new idea only.
- **Mission:** make the red LED blink on and off by itself, forever.
- Uses `while True:`, `time.sleep()`, and `led.off()`. This is the first time students
  meet **indentation as meaning** — give it real space, it is the thing they will get
  wrong.
- Builds directly on Activity 1: same red LED on **GP11**, same wiring, no new parts.
  Do not re-teach the wiring from scratch — point back to Activity 1 and move on.
- **Exercise:** something that needs a second LED and a different delay — for example a
  red/green pair alternating like a level crossing. Give progressive clues in
  `<details>`, answer last. Follow the Activity 1 exercise shape.
- Keep `print()` out of it. It is introduced in Activity 3.
- Comments (`#`) in every code sample, as in Activity 1.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text
   anywhere on the page, including inside explanation tables.
2. **No references to any older version of this module.** This site is self-contained.
   Never write "the pin numbers changed", "old worksheets" or similar.
3. **Wokwi first**, then the real board, as two tabs.
4. **Diagrams:** more rather than fewer, especially for anything visual or timing-based.
   Inline SVG using the `.dia` classes and the theme variables in `style.css` — never
   hard-code text or background colours. A blink activity wants a **timing diagram**
   showing on/off against `sleep` values. No crossings, no overlapping labels; render
   the page and look at every diagram before you commit.
5. Render and check both pages before publishing. Verify: every `.codeimg` becomes a
   canvas, the progress bar counts, the quiz renders, no console errors, and the page
   works in dark mode.

**Per-page config** goes just before `activity.js`:

```html
<script>
window.ACTIVITY = {
  typer: ["...the lines students practise typing..."],
  quiz: [{ q: '...', opts: ['a','b','c','d'], right: 0, why: '...' }]
};
</script>
<script src="activity.js"></script>
```

**Publishing:** write the finished files into the clone, tell me what changed, and I
push from GitHub Desktop. If git complains it cannot delete `.git/index.lock`, ask me
for delete permission on the STEM LAB folder — the mount blocks deletes until I approve,
and git jams without it. If `git status` shows every file as fully modified, that is
Windows line endings: `git config core.autocrlf true` fixes it.

Ask me anything you need about the board or the class before you begin.
