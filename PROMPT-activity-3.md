```markdown
# PROMPT — build Activity 3

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 3 — Digital Output & Servo** to my existing teaching website.

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
before you touch anything. If you find work you did not do, say so and merge — never
commit your own copy of a shared file over someone else's.

**Read these first, in this order:**

1. `CONTEXT.md` in the repo root — how the site is built, the board's pin map, the
   design system, the rules that must not be broken, and the checklist in §10. Read
   **§1.1** on numbering (the gaps are correct, do not tidy them), **§2.1** on the
   40-pin header (Activity 3's pin trap is documented there — read it before you write
   a word), and **§5.4** for the no-answers rule.
2. `docs/activity-11.html` — the freshest full build; copy the page skeleton from it.
   Read `docs/activity-9.html` too: it had the same three-column pin table (printed on
   the board / where the hole is / what you type) that Activity 3 will need, and it is
   the most recent page that first wired something to the 40-pin header.
3. `docs/activity-2.html` — because Activity 3 is the step immediately after it.
   Activity 3 can reuse exactly what Activity 2 taught and nothing else. Read it to see
   the waterline.
4. `docs/teacher-11.html` for the teacher-page pattern, and `docs/teacher.html` — the
   teacher landing page, which needs an Activity 3 row adding to it.
5. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written.
   Reuse them. Only add to `style.css` if Activity 3 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block guarded by an
   element id, the way the soil widget is guarded by `#soilrun`, so other pages stay
   untouched.

**The source material** is `Module Revamp/PPTX/Activity 3 - Servo Motor.pptx` in the
STEM LAB folder. Read it before you design anything. **Do not copy its numbering and
do not refer to it on the page** — rule 4, the site is self-contained.

**What to build:**

- `docs/activity-3.html` — the student page.
- `docs/teacher-3.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/teacher.html` — add the Activity 3 row and refresh its pins table.
- Update `docs/index.html` and `README.md`: move Activity 3 from "coming soon" to live.
  Activity 9's badge becomes "Ready" and Activity 3's becomes "New".
- Add the Activity 3 nav + footer link to every existing page — `index.html`,
  `activity-1.html`, `activity-2.html`, `activity-4.html` … `activity-11.html`,
  `teacher.html`, `teacher-1.html`, `teacher-2.html`, `teacher-4.html` … `teacher-11.html`,
  `pinout.html`. Two lines each. It is easy to forget and it strands the student.
  `robots.txt` already lists `teacher-3.html` — no change needed there.
- Update `pinout.html`: GP28's row currently says "reserved for the servo activity";
  update it to name the servo motor and Activity 3.
- Update `CONTEXT.md`: add an "Activity 3" block to §7, and replace this file with
  `PROMPT-activity-12.md`. (`PROMPT-activity-12.md` stays where it is — it is a separate
  job for a separate session.)

**Things to settle with me before you build anything:**

- **The pin trap — verify before you write a word.** `CONTEXT.md` §2.1 records GP28 at
  header pin **12** (top row, even), where the LilEx5 silkscreen prints **GPIO18**. The
  deck sends the signal wire to "the GPIO18 header pin" and the code says `Pin(28)`.
  That is three different numbers for one hole, the same trap as Activity 9's GP26 /
  GPIO24 / header pin 18. Confirm against §2.1 yourself, then decide with me how the
  page words it — the three-column table from Activity 9 (printed on the board / where
  the hole is / what you type) is the model.
- **The power wire — 5 V, not 3V3.** The deck correctly says red to VBUS (5 V), not
  3V3, and the note in the deck says one SG90 is fine on USB power but two or more need
  their own supply. In the CONTEXT.md header map, the 5 V pins are at **header pins 2
  and 4**. Pick one that routes cleanly from the servo's V+ to the header, and confirm
  the chosen header pin with me. **Do not send the power wire to pin 1 (3V3) or pins
  19/20/39/40 (5 V on the far side) — pin 1 burns nothing but the servo will not move,
  and a close-looking 5 V pin in a different corner has tripped students before.**
- **Does Wokwi have a servo part?** The deck assumes yes. Open
  `wokwi.com/projects/new?template=micropython` (or any new Pico project) in the Claude
  desktop app's built-in browser, search the parts list for "servo", and confirm the
  part name and its default pin labels (SIG / V+ / GND, or different?). The wiring
  diagram on the student page must match Wokwi's actual labels exactly. If Wokwi has no
  servo, this becomes the second real-board-only activity after Activity 12 and the page
  has to say so in the hero.
- **The exercise — does `for` arrive here?** The deck's sweep exercise uses
  `for step in range(left, right, 100)`. `for` loops have been kept out of the whole
  module on purpose (see CONTEXT.md §5 — Activities 4–11 all say "no `for` loops").
  Activity 3 is the *only* place a sweep makes natural sense, and `range()` with a step
  is a clean first example. But if `for` arrives in Activity 3 and then disappears from
  Activities 4–11, students may wonder where it went. **Kamil's call.** The alternative
  is an exercise that stays within Activity 2's knowledge (variables, assignment, a
  while loop, sleep) — for example: a fourth named position, or a named pattern
  (left → right → middle → left, over and over). Decide with me before you build
  anything.
- **How many servos does the class have?** One SG90 per student, one per pair, or one
  demonstration unit? This decides whether Wokwi is the lesson and the real board is a
  demo, or whether students do both. The page layout changes with that answer.
- **Is there a ready-made Wokwi starter project?** The deck does not give one. If there
  is one in the `ump-stemlab` Wokwi account, link it. If not, the page sends students
  to start from a blank Pico project, the way Activity 4 does.

**The one thing the deck undersells: PWM is not special magic.**

The deck introduces PWM as a new keyword to type, then moves straight to the numbers.
What the page should say first is the physical picture: the pin is still switching
between on and off — the same as Activity 2's blink — but now it switches fifty times
a second instead of once, so the interval is 20 ms and the servo reads the pulse width
rather than the blink rate. That contrast ("the pin does the same thing as blink, just
much faster") is the honest opening of the lesson. The number line from duty=0 to
duty=65535, with 1638, 4915 and 8192 marked, is the diagram the class needs before the
code.

**Content notes carried forward:**

At Activity 3 students know only this:
- Variables, `Pin`, `.on()`, `.off()`, comments — Activity 1
- `while True`, `sleep`, indentation — Activity 2
- `from ... import ...` — Activity 1 onward

Nothing else. `print()`, `if`/`else`, buttons, sensors, `>`, `round()`, `str()`,
I²C, libraries, `def`, `elif`, `for` — none of it. **Do not use any of these,
and do not mention them.** The page must be readable after Activity 2 only.

- **Reuse, do not re-teach**: the loop, `sleep`, stopping a forever-loop, comments,
  variables, and `from ... import ...`. A one-line reminder is enough.
- **No `print()`.** It has not been taught yet — Activity 4 is where it arrives. The
  mission works without it: the servo's position is the feedback. If `for` is agreed
  for the exercise, `print(step)` must not appear in the exercise clues.
- **No `if`/`else`, no `elif`.** Not taught yet.
- **No `for` loops**, unless Kamil says yes in the exercise discussion above.
- Comments (`#`) in every code sample.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text
   anywhere on the page, including inside explanation tables, `<summary>` lines, quiz
   options and troubleshooting tables. Prove it: select the whole rendered page, copy,
   and confirm nothing runnable comes out. The one deliberate exception is a **library
   file**, which students paste — Activity 7 established that and says why. (Activity 3
   uses no external library, so there is no exception here.)
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program
   structure as bars and labels. Single operators or single numbers as big glyphs are
   fine — whole lines are not.
3. **No exercise answer on the student page** (rule 5.4). Task, expected-result diagram,
   progressive clues that stop short of the solution, and a line saying the teacher has
   the answer. The worked answer goes on `teacher-3.html` only.
4. **No references to any older version of this module.** This site is self-contained.
5. **Wokwi first**, then the real board, as two tabs — if Wokwi has a servo part (verify
   above). If it does, **copy the Wokwi-look plain Pico group out of `activity-9.html`**
   — Activity 3 does not touch the network, so use the plain Pico, not the Pico W.
   `CONTEXT.md` §7 has the geometry and the pin-centre formula. **Make the diagrams look
   the way the circuit looks in Wokwi, and keep the physical pin numbers visible on the
   Pico** — three numbers for one hole (silkscreen / header position / GP number) is
   the confusion this activity is built around. Use the built-in browser to check
   Wokwi's own servo rendering before drawing it. *(Carry this paragraph into the next
   prompt too.)*
6. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the
   theme variables in `style.css` — never hard-code a text or background colour (the
   `wk-` board colours are the documented exception, because they are the colours of a
   physical object). No crossings, no overlapping labels; render the page and **look at
   every diagram, in both themes**, before you commit.
7. **Teacher notes stay concise** — bullets and tables, one sentence per point, no long
   prose. `teacher-11.html` is the model. *(Carry this into the next prompt too.)*
8. **Render and check both pages before publishing** — see the recipe in `CONTEXT.md`
   §8.1. A working Playwright script is documented there. Verify: every `.codeimg`
   becomes a canvas, the progress bar counts, the quiz renders, no console errors, no
   horizontal overflow at 390 px, and both pages work in dark mode. Every page currently
   passes the overflow check — do not be the one to break it. If a line-by-line table
   has long code lines, use the `.codetable` class Activity 11 added.

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
for delete permission on the STEM LAB folder — the mount blocks deletes until I
approve, and git jams without it. If `git status` shows every file as fully modified,
that is Windows line endings: `git config core.autocrlf true` fixes it.

Ask me anything you need about the board or the class before you begin.
```
