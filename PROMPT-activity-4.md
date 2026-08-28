# PROMPT — build Activity 4

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 4 — Making Decisions** to my existing teaching website.

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
   design system, the rules that must not be broken, and the checklist in section 10.
2. `docs/activity-3.html` — the freshest pattern, and the one Activity 4 finishes.
   `docs/activity-2.html` too, for the way a language idea (rather than a piece of
   hardware) gets its own top-level section.
3. `docs/teacher-3.html` — the pattern for the teacher page.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 4 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block there guarded by an
   element id, the way the button reader is guarded by `#btnrun`, so other pages stay
   untouched.

**What to build:**

- `docs/activity-4.html` — the student page.
- `docs/teacher-4.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/index.html` and `README.md`: move Activity 4 from "coming soon" to live.
  Activity 3's badge becomes "Ready" and Activity 4's becomes "New".
- Add the Activity 4 nav + footer link to every existing page — `index.html`,
  `activity-1.html`, `activity-2.html`, `activity-3.html`, `teacher-1.html`,
  `teacher-2.html`, `teacher-3.html`, `pinout.html`. Two lines each. It is easy to
  forget and it strands the student.
- Update `CONTEXT.md`: add an "Activity 4" block to section 7, and replace this file
  with `PROMPT-activity-5.md`.

**Activity 4 content:**

- **New idea:** `if`, and then `else`. One idea, arriving in two steps.
- **Mission:** press the button and the LED lights. This is the payoff Activity 3
  deliberately withheld, and the class will already want it — say so on the page.
- Uses `if sw.value() == 0:` and `else:` inside the `while True:` loop, with
  `Pin(2, Pin.IN, Pin.PULL_UP)` and `Pin(11, Pin.OUT)` from Activities 1 and 3.
- **The trap, and it is this activity's version of the 1-and-0 inversion:** the double
  equals. `=` puts something into a name; `==` asks whether two things are the same.
  They look almost identical and mean completely different things. Give it real space
  with diagrams — and note that `if sw.value() = 0:` is a `SyntaxError`, so unlike
  Activity 2's indentation trap this one at least announces itself.
- **The second trap is the comparison itself**: it is `== 0` for *pressed*, not `== 1`.
  Activity 3 built the ground for this, and this is where a student who "fixed" the
  inversion in their head gets an LED that is on except when they press. Point back to
  Activity 3's section rather than re-teaching it.
- **Indentation gets a second layer.** This is the first time anything is indented
  *twice* — inside the loop, then inside the `if`. That deserves its own bar diagram in
  the Activity 2 style, showing eight spaces as well as four.
- **Reuse, do not re-teach:** the loop, `sleep`, stopping a forever-loop, `Pin.OUT`,
  `Pin.IN`/`PULL_UP`, `.value()`, `print()`, variables, comments. A one-line reminder
  and a link is enough.
- **`print()` still earns its keep here** — printing alongside the LED is how a student
  debugs a comparison that is the wrong way round. Keep it in at least one sample.
- **No `and` / `or` / `not`.** That is Activity 5. One button, one condition.
- **Exercise:** something needing two independent decisions — SW1 lights the red LED and
  SW2 lights the green one, as two separate `if`/`else` pairs in the same loop. **Ask me
  before you commit to it.** Progressive clues in `<details>`, answer last, same shape as
  Activities 1–3.
- Comments (`#`) in every code sample.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text
   anywhere on the page, including inside explanation tables, `<summary>` lines and
   troubleshooting tables. Prove it: select the whole rendered page, copy, and confirm
   nothing runnable comes out.
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program
   structure as bars and labels, the way Activity 2 and Activity 3 do.
3. **No references to any older version of this module.** This site is self-contained.
4. **Wokwi first**, then the real board, as two tabs. The Wokwi circuit is Activity 3's
   button *plus* Activity 1's LED and resistor in one diagram — draw it on the **full
   40-pin Pico**, the way Activity 3's wiring diagram does, with the pins used ringed.
   Students get the physical-pin versus GP-number confusion every single time.
5. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the
   theme variables in `style.css` — never hard-code a text or background colour. This
   activity wants at least: what `if` does as a fork in the road, `=` versus `==`, the
   two levels of indentation, the combined circuit, and a truth-table-ish picture of
   button state against LED state. No crossings, no overlapping labels; render the page
   and **look at every diagram** before you commit.
6. **Render and check both pages before publishing** — see the recipe in `CONTEXT.md`
   §8.1. Verify: every `.codeimg` becomes a canvas, the progress bar counts, the quiz
   renders, no console errors, no horizontal overflow at 390 px, and both pages work in
   dark mode.

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
