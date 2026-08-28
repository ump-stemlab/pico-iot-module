# PROMPT — build Activity 3

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 3 — Digital Input** to my existing teaching website.

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
2. `docs/activity-2.html` — the freshest pattern. Activity 3 should feel like the same
   person wrote it on the same afternoon. `docs/activity-1.html` too, for the way a
   brand-new piece of hardware gets introduced.
3. `docs/teacher-2.html` — the pattern for the teacher page.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 3 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block there guarded by an
   element id, the way the blink simulator is guarded by `#blinkrun`, so other pages
   stay untouched.

**What to build:**

- `docs/activity-3.html` — the student page.
- `docs/teacher-3.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/index.html` and `README.md`: move Activity 3 from "coming soon" to live.
- Add the Activity 3 nav + footer link to every existing page — `index.html`,
  `activity-1.html`, `activity-2.html`, `teacher-1.html`, `teacher-2.html`,
  `pinout.html`. Two lines each. It is easy to forget and it strands the student.
- Update `CONTEXT.md`: add an "Activity 3" block to section 7, and replace this file
  with `PROMPT-activity-4.md`.

**Activity 3 content:**

- **New idea:** reading a pin as an **input**, and `print()`. Two halves that need each
  other — a value you cannot see is not worth reading.
- **Mission:** make the board tell you when a button is pressed. The number on screen
  changes as your finger goes down and comes up.
- Uses `Pin(2, Pin.IN, Pin.PULL_UP)`, `.value()` and `print()`, inside the
  `while True:` loop from Activity 2.
- **The trap, and it is this activity's version of indentation:** a button reads **1
  when you are not pressing it** and **0 when you are**. That is backwards from what
  every student expects. Give it real space, with diagrams — it is the thing they will
  get wrong, and it will bite them again in Activity 4.
- **No `if` yet.** That is Activity 4, and it is the whole of Activity 4. This is why
  the mission is *watch the number change*, not *press the button to light the LED* —
  the second one is impossible without `if`. Do not sneak it in, and do not smuggle it
  in disguised as `not`, `1 - sw.value()`, or `led.value(sw.value())`. The activity has
  to end with the student wanting `if`, not having used one.
- **Buttons:** SW1 / SW2 / SW3 are **GP2 / GP3 / GP4**. The slide switch SW4 is GP15 —
  leave it for going-further. Check the pin map in `CONTEXT.md` §2, and check with me
  whether `Pin.PULL_UP` is needed on the real LilEx5 or only in Wokwi (the board's
  buttons already idle high — I can tell you why).
- **The loop needs a small `sleep` now.** Printing in a tight loop floods the console
  with thousands of lines a second. About a fifth of a second is right. This is a nice
  callback to Activity 2 — same tool, completely different reason for using it.
- **The Serial Monitor / Thonny Shell is new.** Students have never had to look at it
  before. It needs its own short section and a diagram of where the output appears in
  both tools — this is the first activity where the answer is on the screen rather than
  on the board.
- **Wokwi wiring is real this time**, unlike Activity 2. A pushbutton has four legs and
  they are **joined in diagonal pairs** — the classic beginner trap, and it deserves its
  own diagram. Do not re-teach the LED; point back to Activity 1.
- **Exercise:** something that needs a second button — reading SW1 and SW2 and telling
  them apart on screen. **Ask me before you commit to it.** Progressive clues in
  `<details>`, answer last, same shape as Activities 1 and 2.
- Comments (`#`) in every code sample.

**Reuse, do not re-teach:** the loop, indentation, `sleep`, how to stop a program that
never ends, `Pin(..., Pin.OUT)`, variables, comments. All of that is established. A
one-line reminder and a link is enough.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text
   anywhere on the page, including inside explanation tables, `<summary>` lines and
   troubleshooting tables. Prove it: select the whole rendered page, copy, and confirm
   nothing runnable comes out.
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program
   structure as bars and labels, the way Activity 2's indentation diagrams do.
3. **No references to any older version of this module.** This site is self-contained.
   Never write "the pin numbers changed", "old worksheets" or similar.
4. **Wokwi first**, then the real board, as two tabs.
5. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the
   theme variables in `style.css` — never hard-code a text or background colour. This
   activity wants at least: the four-leg pushbutton, the wiring, what a pull-up actually
   does, the 1-becomes-0 inversion, and where the output appears. No crossings, no
   overlapping labels; render the page and **look at every diagram** before you commit.
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
