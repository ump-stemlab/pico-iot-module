# PROMPT — build Activity 6

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 6 — Words on a Screen** to my existing teaching website.

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
   Section 7 ends with a note on the **Wokwi-look board diagrams**; read it before you
   draw anything. Note **rule 5.4** — no exercise answers on student pages.
2. `docs/activity-5.html` — the freshest pattern. `docs/activity-3.html` too, because
   Activity 6 is the next one that adds a real piece of hardware and a real Wokwi
   circuit, and Activity 3 is the model for how new hardware is introduced.
3. `docs/teacher-5.html` for the teacher-page pattern, and `docs/teacher.html` — the
   teacher landing page, which needs an Activity 6 row adding to it.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 6 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block there guarded by an
   element id, the way the logic simulator is guarded by `#logrun`, so other pages stay
   untouched.

**What to build:**

- `docs/activity-6.html` — the student page.
- `docs/teacher-6.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/teacher.html` — add the Activity 6 row and refresh its pins table.
- Update `docs/index.html` and `README.md`: move Activity 6 from "coming soon" to live.
  Activity 5's badge becomes "Ready" and Activity 6's becomes "New".
- Add the Activity 6 nav + footer link to every existing page — `index.html`,
  `activity-1.html` … `activity-5.html`, `teacher.html`, `teacher-1.html` …
  `teacher-5.html`, `pinout.html`. Two lines each. It is easy to forget and it strands
  the student.
- Update `CONTEXT.md`: add an "Activity 6" block to section 7, and replace this file
  with `PROMPT-activity-7.md`.

**Activity 6 content:**

- **New idea:** the board can **show you words itself** — the OLED screen, and with it
  the first *library that is not built in*. Two things, and they need each other: the
  screen is the reason to add a library, and the library is the only way to use the
  screen. Activity 3's "a pin can be read and a program can print" is the model for
  teaching a pair of ideas as one.
- **New hardware, at last.** The screen is on the I²C bus: **SDA is GP0, SCL is GP1**.
  This is the first activity since Activity 3 that adds a part, and the first ever that
  uses a bus rather than a single pin. It needs the full "new hardware" treatment from
  the anatomy in `CONTEXT.md` §6 — a diagram of the part, the pin table, and a real
  Wokwi circuit.
- **Ask me before you commit to a mission.** My first thought is **your name on the
  screen, then a counter that goes up while a button is held** — it reuses SW1 and the
  `if` from Activity 4 and gives the screen something to do that paper cannot. But a
  plain "hello" first and the counter as the exercise may be the better shape. Ask.
- **The address needs checking before you write a single code sample.** `CONTEXT.md` §2
  lists the OLED at **`0x78`**, which is the 8-bit form of the address MicroPython's
  SSD1306 driver wants (**`0x3C`**). Do not guess. Ask me, and if I am not sure, say so
  on the page rather than writing a number that may not work.
- **Adding a library is its own top-level section**, the way indentation was Activity 2's
  and the inversion was Activity 3's. Where the file goes on the Pico, how Thonny uploads
  it, and what "no module named ssd1306" means. In Wokwi the library situation is
  different from Thonny's — cover both routes honestly, they are not the same.
- The sensor libraries live in `ump-stemlab/stemcube` (linked from `README.md`).
- **Reuse, do not re-teach:** the loop, `sleep`, stopping a forever-loop, `Pin`,
  `.value()`, `print()`, variables, comments, `if`/`else`, `==`, `and`/`or`/`not`, and
  every level of indentation. A one-line reminder and a link is enough.
- **No `elif`, still**, and no `for` loops. Both have been kept out on purpose.
- **Exercise:** something that puts a *changing* value on the screen rather than a fixed
  one — a button counter, or SW1/SW2 shown as words. **Ask me before you commit to it.**
  Progressive clues in `<details>`, and **no answer on the student page**.
- Comments (`#`) in every code sample.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text
   anywhere on the page, including inside explanation tables, `<summary>` lines,
   quiz options and troubleshooting tables. Prove it: select the whole rendered page,
   copy, and confirm nothing runnable comes out.
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program
   structure as bars and labels, the way Activities 2, 4 and 5 do. Single operators
   (`=`, `==`) as big glyphs are fine — whole lines are not.
3. **No exercise answer on the student page** (rule 5.4). Task, expected-result diagram,
   progressive clues that stop short of the solution, and a line saying the teacher has
   the answer. The worked answer goes on `teacher-6.html` only.
4. **No references to any older version of this module.** This site is self-contained.
5. **Wokwi first**, then the real board, as two tabs. Activity 6 wires something, so
   **copy the Wokwi-look Pico group out of `activity-5.html`** rather than drawing a new
   one — `CONTEXT.md` §7 has the geometry and the pin-centre formula. **Make the
   diagrams look the way the circuit looks in Wokwi, and keep the pin numbers visible on
   the Pico** — students get the physical-pin versus GP-number confusion every single
   time. Use the browser in the Claude desktop app if you need to look at Wokwi's own
   rendering of the SSD1306 part before drawing it. *(Carry this paragraph into the next
   prompt too.)*
6. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the
   theme variables in `style.css` — never hard-code a text or background colour (the
   `wk-` board colours are the documented exception, because they are the colours of a
   physical object). This activity wants at least: what a bus is and why two wires serve
   eight devices, the screen's pixel grid and how a line of text sits on it, where the
   library file lives, the wiring diagram, and the expected-result picture for the
   exercise. No crossings, no overlapping labels; render the page and **look at every
   diagram, in both themes**, before you commit.
7. **Teacher notes stay concise** — bullets and tables, one sentence per point, no long
   prose. `teacher-5.html` is the model. *(Carry this into the next prompt too.)*
8. **Render and check both pages before publishing** — see the recipe in `CONTEXT.md`
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
