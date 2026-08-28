```markdown
# PROMPT — build Activity 7

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 7 — Sensors and Numbers** to my existing teaching website.

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
2. `docs/activity-6.html` — the freshest pattern, and the one that matters most here:
   Activity 7's sensor sits on the **same I²C bus** Activity 6 built, and uses the
   **same library-file routine**. Read `docs/activity-3.html` too, because it is still
   the model for how a new piece of hardware is introduced.
3. `docs/teacher-6.html` for the teacher-page pattern, and `docs/teacher.html` — the
   teacher landing page, which needs an Activity 7 row adding to it.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 7 genuinely needs a new component;
   the `wk-oled-` family and the `.oledtxt` / `.oledbox` helpers are already there and
   the screen will almost certainly appear again. `activity.js` picks up widgets from
   the markup — add a new block there guarded by an element id, the way the screen
   widget is guarded by `#oledrun`, so other pages stay untouched.

**What to build:**

- `docs/activity-7.html` — the student page.
- `docs/teacher-7.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/teacher.html` — add the Activity 7 row and refresh its pins table.
- Update `docs/index.html` and `README.md`: move Activity 7 from "coming soon" to live.
  Activity 6's badge becomes "Ready" and Activity 7's becomes "New".
- Add the Activity 7 nav + footer link to every existing page — `index.html`,
  `activity-1.html` … `activity-6.html`, `teacher.html`, `teacher-1.html` …
  `teacher-6.html`, `pinout.html`. Two lines each. It is easy to forget and it strands
  the student.
- Update `CONTEXT.md`: add an "Activity 7" block to section 7, and replace this file
  with `PROMPT-activity-8.md`.

**Activity 7 content:**

- **New idea:** the board can **measure the world**, and what comes back is not a 0 or a
  1 — it is a **number with a decimal point**. Two things again, and they belong
  together: the sensor is the reason decimals appear, and `round()` is the only way to
  make a decimal fit on a screen. Activity 6's screen-and-library pairing is the model.
- **New hardware, but no new pins.** Whichever sensor we use is on the **same I²C bus**
  Activity 6 built — SDA GP0, SCL GP1. That is the payoff of Activity 6 and the page
  should say so out loud: a second part, no extra wires, one more address. The `#bus`
  section of `activity-6.html` is the thing to point back at rather than re-teach.
- **Ask me which sensor before you build anything.** `README.md` and `index.html`
  currently say *motion sensor, decimals, `round()`*. The board also carries a
  temperature/humidity/pressure sensor at `0x76`, which may be the better first one —
  a temperature you can change by breathing on it is more convincing to a class than
  an accelerometer's three numbers. Ask.
- **Check the address and the library before you write a single code sample**, exactly
  as Activity 6 did. `CONTEXT.md` §2 lists the I²C addresses in the **8-bit** form the
  board's documentation uses; MicroPython wants the 7-bit form (halve it). Do not guess.
  Ask me, and if I am not sure, say so on the page rather than writing a number that may
  not work. The sensor libraries live in `ump-stemlab/stemcube` (linked from
  `README.md`).
- **Wokwi may not have this part.** Check before you promise a route. If the sensor does
  not exist in Wokwi, say so honestly on the page and offer the nearest Wokwi part as a
  stand-in, or flag the activity as real-board-only for the sensor section while keeping
  the screen work simulatable. Do not invent a Wokwi part that is not there.
- **Reuse, do not re-teach:** the loop, `sleep`, stopping a forever-loop, `Pin`,
  `.value()`, `print()`, variables, comments, `if`/`else`, `==`, `and`/`or`/`not`, every
  level of indentation, the I²C bus, `SSD1306_I2C`, `fill` / `text` / `show`, and the
  whole business of getting a library file onto the Pico. A one-line reminder and a link
  is enough for every one of them.
- **No `elif`, still**, and no `for` loops. Both have been kept out on purpose.
- **Decimals and `round()` need their own top-level section**, the way adding a library
  was Activity 6's. Why a measurement has a fractional part at all, why fourteen digits
  come back, what `round(x, 1)` does, and — the one that bites — that a number has to be
  turned into words before `oled.text` will take it. That last point is genuinely new
  syntax and it is the only new syntax in the activity.
- **Exercise:** something that puts a *measured, changing* number on the screen and does
  something with it — a thermometer with a warning light above a threshold is the
  obvious shape, and it would reuse `if`/`else` and a comparison that is finally
  `>` rather than `==`. **Ask me before you commit to it.** Progressive clues in
  `<details>`, and **no answer on the student page**.
- Comments (`#`) in every code sample.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text
   anywhere on the page, including inside explanation tables, `<summary>` lines,
   quiz options and troubleshooting tables. Prove it: select the whole rendered page,
   copy, and confirm nothing runnable comes out. The one deliberate exception is a
   **library file**, which students paste — Activity 6 established that and says why.
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program
   structure as bars and labels, the way Activities 2, 4 and 5 do. Single operators
   (`=`, `==`) as big glyphs are fine — whole lines are not.
3. **No exercise answer on the student page** (rule 5.4). Task, expected-result diagram,
   progressive clues that stop short of the solution, and a line saying the teacher has
   the answer. The worked answer goes on `teacher-7.html` only.
4. **No references to any older version of this module.** This site is self-contained.
5. **Wokwi first**, then the real board, as two tabs — where Wokwi can do it at all.
   If Activity 7 wires anything, **copy the Wokwi-look Pico group out of
   `activity-6.html`** rather than drawing a new one — `CONTEXT.md` §7 has the geometry
   and the pin-centre formula, and the OLED module's own geometry is recorded there too.
   **Make the diagrams look the way the circuit looks in Wokwi, and keep the pin numbers
   visible on the Pico** — students get the physical-pin versus GP-number confusion every
   single time. Use the browser in the Claude desktop app if you need to look at Wokwi's
   own rendering of a part before drawing it; reading the part's SVG straight out of the
   page (or from `https://wokwi.github.io/wokwi-boards/<part>/board.svg`) is how the
   Activity 6 module was drawn. *(Carry this paragraph into the next prompt too.)*
6. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the
   theme variables in `style.css` — never hard-code a text or background colour (the
   `wk-` and `wk-oled-` board colours are the documented exception, because they are the
   colours of a physical object). This activity wants at least: what a sensor actually
   is, a second part joining the bus it already has, where the decimal point comes from,
   what rounding does to a number, number-versus-words, and the expected-result picture
   for the exercise. No crossings, no overlapping labels; render the page and **look at
   every diagram, in both themes**, before you commit.
7. **Teacher notes stay concise** — bullets and tables, one sentence per point, no long
   prose. `teacher-6.html` is the model. *(Carry this into the next prompt too.)*
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
```
