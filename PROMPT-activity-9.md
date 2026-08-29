```markdown
# PROMPT — build Activity 9

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 9 — Soil Moisture** to my existing teaching website.

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

**Check first whether another chat is working in the same clone.** Run `git status`
before you touch anything. Activity 8's build found Activity 11 half-built underneath it
by a parallel session, and had to merge rather than overwrite `activity.js`, `style.css`
and `CONTEXT.md`. If you find work you did not do, say so and merge — never commit your
own copy of a shared file over someone else's.

**Read these first, in this order:**

1. `CONTEXT.md` in the repo root — how the site is built, the board's pin map, the design
   system, the rules that must not be broken, and the checklist in section 10. Read
   **§1.1** before anything else: the site's numbering does not match the Google Classroom
   and there is a renumbering job pending. Read **§2** for the pin map and the I²C address
   trap, and **§5.4** for the no-answers rule.
2. `docs/activity-8.html` — the freshest full build, and the one to copy the page skeleton
   from. Read `docs/activity-11.html` too: it is the newest page of all, it has the Pico W
   board group, and it is where `def` and callbacks were introduced.
3. `docs/activity-7.html` — because Activity 9 is the *other* half of what Activity 7
   started. Activity 7 is where a sensor first answered *how much*, where `round()` arrived,
   and where `>` and a threshold arrived. Activity 9 leans on all three and re-teaches none.
4. `docs/teacher-8.html` for the teacher-page pattern, and `docs/teacher.html` — the teacher
   landing page, which needs an Activity 9 row adding to it.
5. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written. Reuse
   them. Only add to `style.css` if Activity 9 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block there guarded by an
   element id, the way the publishing widget is guarded by `#pubrun`, so other pages stay
   untouched.

**Your source material** is `Module Revamp/PPTX/Activity 12 - Soil Moisture.pptx` in the
STEM LAB folder. It is unusually complete — mission, wiring, the code, the percentage line
taken apart, a troubleshooting table, the exercise, and a full teacher page. Read it before
you design anything. **Do not copy its numbering** (it calls itself Activity 12) and **do
not refer to it on the page** — rule 4, the site is self-contained.

**What to build:**

- `docs/activity-9.html` — the student page.
- `docs/teacher-9.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/teacher.html` — add the Activity 9 row and refresh its pins table.
- Update `docs/index.html` and `README.md`: move Activity 9 from "coming soon" to live.
  Activity 8's badge becomes "Ready" and Activity 9's becomes "New". Leave the note about
  the numbering being brought into line where it is.
- Add the Activity 9 nav + footer link to every existing page — `index.html`,
  `activity-1.html` … `activity-8.html`, `activity-11.html`, `teacher.html`,
  `teacher-1.html` … `teacher-8.html`, `teacher-11.html`, `pinout.html`. Two lines each.
  It is easy to forget and it strands the student.
- Update `CONTEXT.md`: add an "Activity 9" block to section 7, and replace this file with
  `PROMPT-activity-10.md`. (`PROMPT-renumber.md` and `PROMPT-activity-12.md` stay where
  they are — they are separate jobs.)

**Things to settle with me before you build anything:**

- **Where does the sensor actually connect?** This is the trap and it is a bad one.
  `CONTEXT.md` §2 says the four analogue inputs on connector **H3** do *not* reach the Pico
  — they go through a converter chip and come back over I²C. **That is not what this
  activity uses.** The deck wires the probe to **GP26**, which is a real ADC pin on the
  Pico, brought out on the 40-pin header at **pin 18**, where the silkscreen says *GPIO24*.
  Check that against `CONTEXT.md` §2.1's header map yourself before you write a word, and
  tell me what you find. A page that sends a student to H3 will not work and will look
  like a broken sensor.
- **The silkscreen number and the GP number are different, again.** The header says
  *GPIO24*, the code says `Pin(26)`. Activities 1 and 2 already have a rule for this
  situation — say which board each number belongs to, never mix them in one sentence.
  Decide with me how the page words it.
- **Do we own a soil probe, and how many?** The real-board route needs an actual probe,
  three jumper wires and a cup of soil per group. If there are two probes for a class of
  thirty, the Wokwi route is the lesson and the real board is a demonstration, and the page
  should say so. Ask me.
- **Check the Wokwi starter still works before you promise it.**
  `wokwi.com/projects/472418654786566145` — a Pico with a **custom soil-moisture chip**
  that has a wetness slider. Open it, run it, drag the slider, and read the actual numbers
  it gives for dry and wet. **Those numbers go in the page**, and if they differ from the
  deck's 50000 and 25000, the deck is wrong and you are right. Use the browser in the Claude
  desktop app; the cloud container cannot reach wokwi.com.
- **What is the mission, and what is the exercise?** The deck's shape is: mission = read the
  probe, turn it into a percentage, print DRY / JUST RIGHT / WET; exercise = red LED when
  dry, green when wet. That is a good shape but check it with me, and see the note on
  calibration below before you decide.

**The one thing I want taught that the deck buries: calibration.**

The deck has calibration on the *teacher* page only — measure the air, measure wet soil,
choose your two numbers from that. **That is the real lesson of this activity and it
belongs on the student page.** A sensor's raw number means nothing until you have found out
what it reads at both ends, and no worksheet can tell you, because it depends on your probe,
your soil and your cup. Give it its own top-level section, the way adding a library was
Activity 6's and decimals were Activity 7's — a diagram of a number line with the air
reading at one end and the wet reading at the other, and the two chosen numbers marked
inside them. Then have the students actually do it and write their own two numbers down.

Decide with me whether calibration comes *before* the main program (so they type their own
numbers in from the start) or after it (so they run with the deck's numbers, find them
wrong, and fix them). The second is more honest and more memorable; it is also slower.

**Content notes carried forward:**

- **`elif` finally arrives here.** It has been kept out of the whole module on purpose —
  see `CONTEXT.md` §5 — and Activity 9 is where it earns its place, because three zones
  (dry / just right / wet) is the first honest reason for it. Kamil's call. Teach it as this
  activity's *second* new idea, next to analogue, and do not apologise for it. Draw it: two
  roads became three, and only one is ever taken.
- **`//` (whole-number division) is new too** and the percentage line needs it. The deck
  explains it well — 63, not 63.44 — and that explanation is worth keeping.
- **Reuse, do not re-teach:** the loop, `sleep`, stopping a forever-loop, `Pin`, `print()`,
  variables, comments, `if`/`else`, `==`, `>`, `and`/`or`/`not`, indentation, `round()`,
  `str()`, thresholds, and the whole business of getting a library file onto the Pico. A
  one-line reminder and a link is enough for every one of them. **`>` and the idea of a
  threshold are Activity 7's** — point back at `activity-7.html#numbers` rather than
  re-explaining.
- **No `for` loops**, still.
- **This is the first analogue pin in the module.** Activity 7's sensor answered *how much*
  but came over the I²C bus with a library in between. This one is a voltage on a wire,
  read directly. That contrast is the opening of the lesson.
- **Big number means dry**, which is backwards from what everybody expects, and the page has
  to say why: wet soil conducts, so the voltage drops. Expect the question; answer it before
  it is asked.
- Comments (`#`) in every code sample.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text anywhere
   on the page, including inside explanation tables, `<summary>` lines, quiz options and
   troubleshooting tables. Prove it: select the whole rendered page, copy, and confirm
   nothing runnable comes out. The one deliberate exception is a **library file**, which
   students paste — Activity 6 established that and says why.
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program structure as
   bars and labels, the way Activities 2, 4 and 5 do. Single operators (`=`, `==`, `>`,
   `//`) as big glyphs are fine — whole lines are not.
3. **No exercise answer on the student page** (rule 5.4). Task, expected-result diagram,
   progressive clues that stop short of the solution, and a line saying the teacher has the
   answer. The worked answer goes on `teacher-9.html` only. **Every page in the module now
   follows this** — Activities 1–4 were cleaned up during Activity 8's build.
4. **No references to any older version of this module.** This site is self-contained. The
   deck you are working from calls itself Activity 12; the page must never mention it.
5. **Wokwi first**, then the real board, as two tabs. If Activity 9 wires anything, **copy
   the Wokwi-look Pico group out of `activity-8.html` or `activity-11.html`** rather than
   drawing a new one — `CONTEXT.md` §7 has the geometry and the pin-centre formula. Activity
   9 does *not* need the network, so use the plain-Pico group from `activity-7.html`, not
   the Pico W one. **Make the diagrams look the way the circuit looks in Wokwi, and keep the
   pin numbers visible on the Pico** — students get the physical-pin versus GP-number
   confusion every single time, and this activity adds a third number (the LilEx5's own
   silkscreen) on top. Use the browser in the Claude desktop app if you need to look at
   Wokwi's own rendering of a part before drawing it; reading the part's SVG straight out of
   the running simulator is how the OLED, the MPU6050 and the Pico W were drawn. *(Carry
   this paragraph into the next prompt too.)*
6. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the theme
   variables in `style.css` — never hard-code a text or background colour (the `wk-`,
   `wk-oled-`, `wk-imu-` and `wk-bme-` board colours are the documented exception, because
   they are the colours of a physical object). No crossings, no overlapping labels; render
   the page and **look at every diagram, in both themes**, before you commit.
7. **Teacher notes stay concise** — bullets and tables, one sentence per point, no long
   prose. `teacher-8.html` is the model. *(Carry this into the next prompt too.)*
8. **Render and check both pages before publishing** — see the recipe in `CONTEXT.md` §8.1.
   There is a working Playwright script from Activity 8's build you can rewrite from that
   section; it also wraps every `<table>` in `.tablescroll`, without which a three-column
   table overflows at 390 px. Verify: every `.codeimg` becomes a canvas, the progress bar
   counts, the quiz renders, no console errors, no horizontal overflow at 390 px, and both
   pages work in dark mode. Every page currently passes the overflow check — do not be the
   one to break it.

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

**Publishing:** write the finished files into the clone, tell me what changed, and I push
from GitHub Desktop. If git complains it cannot delete `.git/index.lock`, ask me for delete
permission on the STEM LAB folder — the mount blocks deletes until I approve, and git jams
without it. If `git status` shows every file as fully modified, that is Windows line
endings: `git config core.autocrlf true` fixes it.

Ask me anything you need about the board or the class before you begin.
```
