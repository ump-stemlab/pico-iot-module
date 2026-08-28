```markdown
# PROMPT — build Activity 5

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 5 — And, Or, Not** to my existing teaching website.

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
   Section 7 now ends with a note on the **Wokwi-look board diagrams**; read it before
   you draw anything.
2. `docs/activity-4.html` — the freshest pattern, and the one Activity 5 extends.
   `docs/activity-2.html` too, for the way a language idea (rather than a piece of
   hardware) gets its own top-level section.
3. `docs/teacher-4.html` — the pattern for the teacher page.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 5 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block there guarded by an
   element id, the way the decision simulator is guarded by `#ifrun`, so other pages
   stay untouched.

**What to build:**

- `docs/activity-5.html` — the student page.
- `docs/teacher-5.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/index.html` and `README.md`: move Activity 5 from "coming soon" to live.
  Activity 4's badge becomes "Ready" and Activity 5's becomes "New".
- Add the Activity 5 nav + footer link to every existing page — `index.html`,
  `activity-1.html` … `activity-4.html`, `teacher-1.html` … `teacher-4.html`,
  `pinout.html`. Two lines each. It is easy to forget and it strands the student.
- Update `CONTEXT.md`: add an "Activity 5" block to section 7, and replace this file
  with `PROMPT-activity-6.md`.

**Activity 5 content:**

- **New idea:** `and`, `or`, and `not` — joining two questions into one.
- **Mission:** something that genuinely needs two conditions at once. My first thought
  is a **two-key safety switch**: the LED only lights when SW1 *and* SW2 are both held
  down. It is the cleanest possible demonstration that `and` is stricter than either
  question alone, and it is a real thing that exists in real machines. **Ask me before
  you commit to it.**
- Uses `if sw1.value() == 0 and sw2.value() == 0:` inside the `while True:` loop, with
  the pins from Activities 1, 3 and 4. No new hardware.
- **The trap:** `and` and `or` in English are not `and` and `or` in Python. People say
  "if SW1 and SW2 are pressed" and write something that reads right and means nothing;
  people also say "or" when they mean "one but not both". Give it real space with
  diagrams — a truth-table picture for each of the three words is the obvious shape, and
  Activity 4's `#zero` section is the model for how a comparison table should look.
- **The second trap is that each half has to be a whole question.** You cannot write
  `if sw1.value() == 0 and == 0:`, and you cannot write `if sw1 and sw2:` and expect it
  to mean what it looks like. Each side of an `and` is a complete comparison, standing on
  its own. This is the `==` lesson from Activity 4 arriving one level up.
- **`not` is the third word and the fiddliest**, because the board's numbers are already
  backwards. `not (sw.value() == 0)` is *not pressed*, and a student who reaches for
  `not` to "fix" the inversion will tie themselves in knots. Point back to
  `activity-3.html#trap` and `activity-4.html#zero` rather than re-teaching either.
- **Reuse, do not re-teach:** the loop, `sleep`, stopping a forever-loop, `Pin.OUT`,
  `Pin.IN`/`PULL_UP`, `.value()`, `print()`, variables, comments, `if`, `else`, the
  double equals, and both levels of indentation. A one-line reminder and a link is enough.
  Activity 4's exercise deliberately used **two separate `if`/`else` pairs** so that this
  activity has something to contrast with — open with that contrast: "last lesson you
  wrote two decisions; today you write one decision that asks about two things."
- **No `elif`.** It has been kept out of the module on purpose so the two-road picture
  stays intact.
- **Exercise:** something needing a mixture — my suggestion is a **door alarm**: the
  buzzer sounds when the slide switch SW4 is armed *and* the button is pressed, and the
  green LED shows "safe" the rest of the time. It uses `and`, and it uses the latching
  switch from Activity 3's going-further, which nobody has had a real reason to use yet.
  **Ask me before you commit to it.** Progressive clues in `<details>`, answer last, same
  shape as Activities 1–4.
- Comments (`#`) in every code sample.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text
   anywhere on the page, including inside explanation tables, `<summary>` lines,
   quiz options and troubleshooting tables. Prove it: select the whole rendered page,
   copy, and confirm nothing runnable comes out.
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program
   structure as bars and labels, the way Activities 2 and 4 do. Single operators
   (`=`, `==`) as big glyphs are fine — whole lines are not.
3. **No references to any older version of this module.** This site is self-contained.
4. **Wokwi first**, then the real board, as two tabs. If Activity 5 wires anything,
   **copy the Wokwi-look Pico group out of `activity-4.html`** rather than drawing a new
   one — `CONTEXT.md` §7 has the geometry and the pin-centre formula. The pin numbers
   must stay visible on the board; students get the physical-pin versus GP-number
   confusion every single time.
5. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the
   theme variables in `style.css` — never hard-code a text or background colour (the
   `wk-` board colours are the documented exception, because they are the colours of a
   physical object). This activity wants at least: a truth-table picture for `and`, one
   for `or`, one for `not`, a picture of two questions being joined into one, and the
   expected-result diagram for the exercise. No crossings, no overlapping labels; render
   the page and **look at every diagram, in both themes**, before you commit.
6. **Render and check both pages before publishing** — see the recipe in `CONTEXT.md`
   §8.1. Verify: every `.codeimg` becomes a canvas, the progress bar counts, the quiz
   renders, no console errors, no horizontal overflow at 390 px, and both pages work in
   dark mode. Every page currently passes the overflow check — do not be the one to
   break it.

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

```

Additional prompt. Make the diagrams looks like it would on wokwi. Use browser in claude desktop if you need to. However make the pin numbers visible on the pi pico.

Transfer this additional prompt to the next prompt too
