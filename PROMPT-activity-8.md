```markdown
# PROMPT — build Activity 8

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 8 — Internet and Data** to my existing teaching website.

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
   Note **rule 5.4** — no exercise answers on student pages. Section 2's address list
   was corrected during Activity 7's build; read that correction before you trust any
   address anywhere.
2. `docs/activity-7.html` — the freshest pattern, and the one Activity 8 continues:
   it is where a *measurement* first appeared, and Activity 8's whole job is to send
   one somewhere. Read `docs/activity-6.html` too, because the library-file routine and
   the screen both come back.
3. `docs/teacher-7.html` for the teacher-page pattern, and `docs/teacher.html` — the
   teacher landing page, which needs an Activity 8 row adding to it.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 8 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block there guarded by an
   element id, the way the reading widget is guarded by `#numrun`, so other pages stay
   untouched.

**What to build:**

- `docs/activity-8.html` — the student page.
- `docs/teacher-8.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/teacher.html` — add the Activity 8 row and refresh its pins table.
- Update `docs/index.html` and `README.md`: move Activity 8 from "coming soon" to live.
  Activity 7's badge becomes "Ready" and Activity 8's becomes "New".
- Add the Activity 8 nav + footer link to every existing page — `index.html`,
  `activity-1.html` … `activity-7.html`, `teacher.html`, `teacher-1.html` …
  `teacher-7.html`, `pinout.html`. Two lines each. It is easy to forget and it strands
  the student.
- Update `CONTEXT.md`: add an "Activity 8" block to section 7, and replace this file
  with `PROMPT-activity-9.md`.

**Things to settle with me before you build anything:**

- **Is this board's Pico a Pico W?** This matters more than anything else on the page.
  A plain Pico has no WiFi at all, and `CONTEXT.md` §1 just says "a Raspberry Pi Pico".
  If it is not a W, Activity 8 cannot be a WiFi activity on the real board and we need
  to talk about what it becomes. **Ask me, and do not assume.** If I am not sure, the
  answer is on the silkscreen or in `lilEx5 GPIO pins Layout.pdf` in the STEM LAB folder.
- **Check whether Wokwi can actually simulate this.** `CONTEXT.md` §5.2 currently claims
  WiFi and MQTT are real-board-only, but that line was written early and Wokwi has had a
  simulated WiFi network and a Pico W for some time. **Verify it yourself before you
  promise or deny a route** — Activity 7's build found the Wokwi docs to be wrong about
  the MPU6050's sliders, so the docs are not the last word. Use the browser in the Claude
  desktop app; the cloud container cannot reach wokwi.com.
- **What goes over the wire, and to where?** A free public MQTT broker (`test.mosquitto.org`,
  `broker.hivemq.com`) needs no account and is the obvious classroom choice, but it is
  public — anything a class publishes is readable by anybody. Decide with me whether that
  is acceptable, and if it is, the page must say so plainly rather than quietly.
- **What is the mission, and what is the exercise?** The obvious shape is: send Activity 7's
  tilt reading out, and watch it arrive somewhere else. Ask me before committing to either.
- **Is there a school network the class can actually reach?** School WiFi with a captive
  portal will defeat this lesson entirely. Ask; the answer may change the whole activity.

**Content notes carried forward:**

- **Reuse, do not re-teach:** the loop, `sleep`, stopping a forever-loop, `Pin`, `print()`,
  variables, comments, `if`/`else`, `==`, `and`/`or`/`not`, indentation, the I²C bus,
  `SSD1306_I2C`, `fill`/`text`/`show`, the sensor and `imu.accel.x`, `round()`, `str()`,
  and the whole business of getting a library file onto the Pico. A one-line reminder and
  a link is enough for every one of them.
- **No `elif`, still**, and no `for` loops. Both have been kept out on purpose.
- **`>` has still not been taught in a main program** — it appears only in Activity 7's
  going-further. If Activity 8 wants a threshold ("publish only when it moves"), that is
  where `>` finally arrives, and it deserves saying out loud that a measurement is almost
  never exactly anything.
- **Round last.** Activity 7 taught that rounding discards; if Activity 8 sends a number
  somewhere, it should send the full one and round only for display. That is the payoff.
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
   (`=`, `==`, `>`) as big glyphs are fine — whole lines are not.
3. **No exercise answer on the student page** (rule 5.4). Task, expected-result diagram,
   progressive clues that stop short of the solution, and a line saying the teacher has
   the answer. The worked answer goes on `teacher-8.html` only.
4. **No references to any older version of this module.** This site is self-contained.
5. **Wokwi first**, then the real board, as two tabs — where Wokwi can do it at all.
   If Activity 8 wires anything, **copy the Wokwi-look Pico group out of
   `activity-7.html`** rather than drawing a new one — `CONTEXT.md` §7 has the geometry
   and the pin-centre formula, and the OLED and MPU6050 modules' own geometry is recorded
   there too, each with the scale its stroke widths were authored for.
   **Make the diagrams look the way the circuit looks in Wokwi, and keep the pin numbers
   visible on the Pico** — students get the physical-pin versus GP-number confusion every
   single time. Use the browser in the Claude desktop app if you need to look at Wokwi's
   own rendering of a part before drawing it; reading the part's SVG straight out of the
   running simulator is how the OLED and MPU6050 modules were drawn. *(Carry this
   paragraph into the next prompt too.)*
6. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the
   theme variables in `style.css` — never hard-code a text or background colour (the
   `wk-`, `wk-oled-` and `wk-imu-` board colours are the documented exception, because
   they are the colours of a physical object). No crossings, no overlapping labels;
   render the page and **look at every diagram, in both themes**, before you commit.
7. **Teacher notes stay concise** — bullets and tables, one sentence per point, no long
   prose. `teacher-7.html` is the model. *(Carry this into the next prompt too.)*
8. **Render and check both pages before publishing** — see the recipe in `CONTEXT.md`
   §8.1, and there is a working Playwright script from Activity 7's build you can rewrite
   from that section. Verify: every `.codeimg` becomes a canvas, the progress bar counts,
   the quiz renders, no console errors, no horizontal overflow at 390 px, and both pages
   work in dark mode. Every page currently passes the overflow check — do not be the one
   to break it.

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
