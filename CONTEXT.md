# CONTEXT — LilEx5 Pico IoT Module website

How this site is built and why. Read this before changing anything, and update it
after every activity you add.

**Live:** https://ump-stemlab.github.io/pico-iot-module/
**Repo:** `ump-stemlab/pico-iot-module` (public). Pages serves `/docs` on `main`.
**Owner:** UMPSA STEM LAB.

---

## 1. What this is

A nine-activity MicroPython teaching module for the **LilEx5** board — a Raspberry Pi
Pico with three LEDs, a buzzer, three buttons, a slide switch, an OLED screen, a set of
I²C sensors and a long-range radio, all on one PCB.

This website is a **new, self-contained version of the module**. It is not a port of
any earlier Word/PowerPoint material and must not refer to one. Do not write
"the pin numbers changed", "old worksheets", "in the previous module" or anything
similar. A student arriving here has no history to unlearn.

Audience: secondary-school beginners. Every idea is introduced from scratch, in plain
language, one at a time.

## 2. Board pin map (authoritative)

| Part | GP | | Part | GP |
|---|---|---|---|---|
| LED1 red | 11 | | SDA (I²C data) | 0 |
| LED2 yellow | 12 | | SCL (I²C clock) | 1 |
| LED3 green | 13 | | Radio TX / RX | 16 / 17 |
| Buzzer BZ1 | 14 | | Radio M2 / M1 / M0 | 18 / 19 / 20 |
| Button SW1 / SW2 / SW3 | 2 / 3 / 4 | | Radio AUX | 21 |
| Slide switch SW4 | 15 | | SPI clk / MOSI / MISO / CS | 6 / 7 / 8 / 9 |

Spare: GP5, GP10, GP22, GP26–28. Power switch is **SW5**.

### 2.1 The 40-pin connector H1 (authoritative)

Where each GP number comes out on the black connector along the top edge. Pin **1** is the
left-hand end of the **lower** row; odd pins run along the lower row (nearest the LEDs and
screen), even pins along the upper row (nearest the board edge).

```
odd   1 3V3   3 GP0   5 GP1   7 GP5   9 GND  11 GP2  13 GP3  15 GP4  17 n/c  19 GP7
     21 GP8  23 GP6  25 GND  27 GP10  29 GP11 31 GP12 33 GP13 35 GP14 37 GP15 39 GND
even  2 5V    4 5V    6 GND   8 GP16  10 GP17 12 GP28 14 GND  16 GP27 18 GP26 20 GND
     22 GP22 24 GP9  26 n/c  28 n/c   30 GND  32 GP21 34 GND  36 GP20 38 GP19 40 GP18
```

Source: `lilEx5 GPIO pins Layout.pdf` in the STEM LAB folder.

These are the **LilEx5's own** positions, not the Raspberry Pi Pico's pin numbers, and the
two must never be mixed in one sentence. The Wokwi diagrams in Activities 1 and 2 wire a
bare Pico and correctly say "GP11 is physical pin 15" — on the LilEx5 the same GP11 comes
out at header pin **29**. If a later activity ever puts the two side by side, say which
board each number belongs to.

I²C addresses (as the board's own documentation prints them, i.e. 8-bit): OLED `0x78`
— **which is `0x3C` in the 7-bit form MicroPython wants; see the Activity 6 block in §7** — temp/humidity/pressure `0x76`, accelerometer+gyro `0x68`,
compass `0x7C`, proximity+light `0x60`, air quality `0x1A` (its clock must stay below
15 kHz), ADC `0x48`.

The four analogue inputs on connector **H3** do **not** reach the Pico directly — they
go through a converter chip and come back over I²C. Reading a voltage on this board is
an I²C job, not an `ADC()` job.

Buttons idle high and read **0** when pressed.

## 3. Files

```
docs/index.html        module home, activity list
docs/activity-N.html   one page per activity (students)
docs/teacher-N.html    one page per activity (instructors, unlisted)
docs/teacher.html      index of every teacher page (instructors, unlisted)
docs/pinout.html       searchable pin reference
docs/style.css         the whole design system — every page links it
docs/code.js           renders code as pictures + guards the clipboard
docs/activity.js       progress, tabs, board simulator, blink simulator, button reader,
                       decision simulator, logic simulator, screen widget, typing box, quiz
docs/board.js          the board explorer on pinout.html (see 3.1)
docs/robots.txt        keeps teacher pages out of search engines
docs/img/lilex5-board.png         the board photo, LED1 **off** — the default
docs/img/lilex5-board-red-on.png  the same board with LED1 **lit**
```

In the repo root: `CONTEXT.md` (this file) and **`PROMPT-activity-N.md`** — the
brief for the *next* activity, written at the end of the previous build. There is only
ever one of these. Whoever builds activity N deletes it and leaves `PROMPT-activity-N+1.md`
behind.

`docs/img/` holds the real LilEx5 artwork. Use the **unlit** version everywhere a
student is being asked to make something happen, and the **red-on** version only for
"what you should see" after Activity 1's program runs. Both are 710 × 615 and share
the same geometry, so they can be swapped without moving anything.

### 3.1 The board explorer

`pinout.html` overlays an SVG on `img/lilex5-board.png` so a part can be tapped on the
board and the matching table row lights up, and the other way round. The page supplies:

```html
<script>window.BOARD_SPOTS = { "led1": [["c",367,159,40]], "header": [["r",84,26,532,74]] };</script>
<script src="board.js"></script>
```

Shapes are `["c",cx,cy,r]` or `["r",x,y,w,h]` in **image coordinates (710 × 615)**, and
a part may have several (the sensor bus marks all eight I²C devices at once). Table rows
carry `data-gp`, `data-spot`, `data-part`, `data-note`, `data-s` (search text). Adding a
part means adding a spot and a row — `board.js` needs no change.

It also highlights **the individual header pin**, so a student can see which pad to wire to
and not just which part lights up. Three views stay in step: the table row, the part and pad
on the photo, and the pin on the 40-pin strip (`svg.hdr`) drawn under the photo.

- Table rows carry `data-hpin` (header pin) and `data-row` (`top` / `bottom`), and show the
  pin in its own **Header pin** column. The old inline `<small>(header pin 11)</small>`
  notes are gone — the column replaces them.
- Each pin of the strip is a `<g class="hp k-KIND" data-pin>` with either `data-gp` (it
  reaches the Pico) or `data-title` + `data-note` (power, ground, not connected). Tapping a
  ground pin rings **all eight** at once; that is deliberate.
- Pad centres on the photo are computed, not listed: `x0 102.5, dx 26.526, yTop 51.5,
  yBot 77.5` in the 710 × 615 image, odd pins on the lower row. Measured off the artwork —
  if the photo is ever replaced, re-measure them in `board.js`.
- **The pin-1 ring is no longer painted into the PNG.** Both board images used to carry a
  hand-drawn circle around pin 1, which clashed with the highlight rings; it was removed
  from `lilex5-board.png` and `lilex5-board-red-on.png`, and pin 1 is now a dashed SVG
  marker on `pinout.html` that dims when something is selected. Do not describe pin 1 as
  "circled in red" anywhere.

`gen/pinout.py` in the build scripts generated this page; the committed HTML is the
source of truth.

Pages are hand-written HTML. There is no build step and no framework: open a file,
edit it, commit. Activity 1 was generated by a Python script, but the committed HTML is
the source of truth from here on.

## 4. Design system

Colours (CSS variables in `style.css`): teal `#02ADA5`, teal-dark `#0B4F4B`, blue
`#0D55A7`, red `#C80000`, orange `#F5A21D`. Ink and background flip automatically for
dark mode — **never hard-code a text or background colour**, use `var(--ink)`,
`var(--muted)`, `var(--card)`, `var(--bg)`, `var(--line)`.

Every page opens with the See · Think · Explore · Marvel chevron strip and the same nav.

Reusable classes: `.cal.tip / .warn / .info / .note` (callouts), `.step` (numbered
step), `.chk` (progress checkbox), `.mini` in `.grid2` (small cards), `.gp` (pin badge),
`.act` (activity list row), `.dia` (inline SVG diagram), `.codeimg` (code picture).

## 5. The rules that must not be broken

**5.1 Code is never copy-pasteable.** Students type it or they learn nothing. Code goes
in as a picture:

```html
<span class="codeimg" data-code="BASE64 OF THE CODE"></span>
<span class="codeimg inline" data-code="..."></span>   <!-- small chip, in a table cell -->
```

`code.js` draws it on a `<canvas>`. It also makes inline `<code>` unselectable and
rewrites the clipboard, because select-all otherwise sweeps up code even from
`user-select:none` text. **Watch for tables that repeat the whole program line by line
in the explanation column** — that was a real leak in Activity 1 and is easy to repeat.
UI labels and quiz options stay readable on purpose.

Trade-off: a canvas is invisible to screen readers, so give each one an `aria-label`
saying it is code shown as a picture.

**5.2 Wokwi first.** Every activity that can be simulated teaches the wiring in Wokwi
before the real board, because on the LilEx5 the wiring is inside the PCB and students
would otherwise never see a circuit. Activities 1–7 simulate; WiFi/MQTT and the radio
do not — flag those as real-board-only.

**5.3 Diagrams must be clean.** No wire drawn through a part, no crossings, no label
overlapping a wire. Reroute rather than let a wire double back. Always render and look
at the picture before committing.

Rule 5.1 applies inside diagrams too: SVG `<text>` is selectable, so **a diagram may not
contain a line of code**. Activity 2 needed to draw program structure (which lines are
indented, which repeat) and does it with **bars, not text** — `.codeline` paths at two
different left edges, a teal bar for the loop line, a bracket for the block, and the
words in labels beside it. Single identifiers in prose are fine in `<code>`; whole lines
are not, anywhere.

**5.4 The exercise answer never appears on a student page.** Kamil's call, from Activity 5
on. The student page carries the task, the expected-result diagram and progressive clues
that stop short of the solution, plus a short callout saying the answer is with the
teacher. The worked answer lives on `teacher-N.html` only. Activities 1–4 still carry an
`<details>` answer block from before this rule; leave them unless asked, and do not add
another one.

## 6. Anatomy of an activity page

In order: hero (title, one-line mission, pills, in-page nav) → sticky progress bar →
mission + flow diagram → what you will learn (four `.mini` cards) → route table
(Wokwi / real board) → the new hardware, with a diagram and the pin table → an
interactive try-it widget where one fits → build the circuit (Wokwi / real board tabs,
numbered steps, diagrams) → write the program (code picture, "type it don't copy it",
type-it-here box, line-by-line table) → save and run → what you should see (diagram) →
check yourself → troubleshooting table → **exercise** (task, expected-result diagram,
progressive clues in `<details>`, **and no answer**) → going further → quiz → words to
remember.

Per-page config, before `activity.js`:

```html
<script>
window.ACTIVITY = {
  typer: ["line one", "line two"],
  quiz: [{ q: '...', opts: ['a','b'], right: 0, why: '...' }]
};
</script>
<script src="activity.js"></script>
```

The board simulator, progress bar and route tabs need no config — `activity.js` finds
them in the markup if they are there.

## 7. Teaching decisions already made

- **Activity 1 has no `print()`.** The mission is "a pin makes a light come on"; a
  console message competes with that. `print()` arrives in Activity 3 where reading a
  button gives it a real job. Do not add it back to Activity 1.
- **Comments (`#`) are taught in Activity 1** and used in every code sample after.
- Activity 1's exercise is *light all three LEDs*. The whole point is that one variable
  name can only point at one pin, so each LED needs its own name. Clues build up to
  that; the answer is last.
- Progressive concepts, one new idea per activity — see the table in `README.md`.

### Activity 2 — Make an LED Blink

- **No new hardware.** Same red LED on GP11, same Wokwi circuit. When an activity adds no
  hardware, the "new hardware" slot in the anatomy above becomes **"the new idea"** — here
  loops, `sleep` and indentation — and the *build the circuit* section shrinks to a one-picture
  recap that points back to Activity 1. Do not re-teach wiring that has already been taught.
- **Indentation gets its own top-level section**, before the code, with two diagrams: what the
  four spaces mean, and a side-by-side of `off` inside vs outside the loop. It is the thing the
  class will get wrong, and it is the first time whitespace has changed meaning in this module.
- **`from time import sleep`, not `import time`.** It matches Activity 1's "borrow one tool from
  a toolbox" model, so every activity's import lines look alike. The `time.sleep()` style is shown
  once, in a `<details>`, so nobody is thrown by code they find online. Keep the single-tool form
  in later activities.
- **Still no `print()`.** Same reason as Activity 1; it arrives in Activity 3.
- **Stopping a forever-loop is taught here** (Wokwi's Stop button, Thonny's Stop or Ctrl+C) and is
  assumed from now on. Every activity after this one runs in a loop, so this never needs teaching
  again — but it does need to be in the troubleshooting table.
- Activity 2's exercise is a **traffic light**: all three LEDs, red 4 s → green 4 s → yellow 1 s,
  for ever. It deliberately needs one thing from Activity 1 (each LED gets its own name) and two
  from Activity 2 (the loop, and an unequal delay). Clues build to it; answer last.
- `activity.js` gained a **blink simulator** block, guarded by `#blinkrun`, so it is inert on
  every other page. Markup: `#bblink` bulb, `#onsec` / `#offsec` number inputs, `[data-preset]`
  buttons, `#blinkout`. Its output text deliberately *describes* the loop rather than printing
  code. Every simulator since follows that rule.
- Two long-standing rule 5.1 leaks in `activity-1.html` were closed in Activity 4's build: its
  first flow diagram carried `import Pin` and `led.on()` as SVG `<text>`, and the board simulator's
  labels spelled a whole runnable line around the number input. Both now say the same thing in
  words. **Every page's rendered text now survives a select-all-and-copy with nothing runnable in
  it** — keep it that way, and re-run the check in §8.1 step 5 on every page you touch.
- ~~Known TODO: `activity-1.html`'s unfilled `%WOKWI%` placeholder~~ — **resolved in Activity 4's
  build.** There is no ready-made Wokwi project for Activity 1 and there never was one on this
  site, so the callout was rewritten to point back at the wiring diagram instead. `teacher-1.html`
  still carries a project id; it is not linked from the student page.

### Activity 3 — Digital Input

- **The one idea is two halves**: a pin can be *read*, and a program can *print*. Neither is worth
  teaching alone — a value you cannot see is not worth reading. Do not split them into two activities.
- **The inversion is the lesson**, the way indentation was Activity 2's. A button reads **1 when
  nobody is touching it and 0 when they are**. It gets its own top-level section (`#trap`), with the
  two pull-up state diagrams immediately before it and an expect-versus-get diagram inside it. Every
  later input activity depends on students having *accepted* this rather than "fixed" it.
- **`Pin.PULL_UP` is written everywhere**, on both routes. Kamil's call: the board's buttons already
  idle high, so the line is belt-and-braces on the LilEx5 and essential in Wokwi — and one setup line
  that works on both routes is worth more to a beginner than the distinction. The teacher page
  explains the nuance; the student page does not.
- **No `if`, and none smuggled in.** The mission is deliberately *watch the number change*, not
  *press the button to light the LED* — that needs `if`, which is the whole of Activity 4. Also ruled
  out: `not`, `1 - sw.value()`, `led.value(sw.value())`. Both the student page and the teacher page
  say so out loud, because a keen student will try. The activity has to end with the class *wanting*
  `if`.
- **`sleep` comes back for a completely different reason** — throttling the console, not slowing a
  blink. `sleep(0.2)`, five readings a second. Say it is a callback; do not re-teach `sleep`.
- **The Serial Monitor / Thonny Shell gets its own section.** This is the first activity whose answer
  is on the screen rather than on the board, and a student looking at the wrong panel is the single
  biggest source of "mine isn't working".
- **Wokwi wiring is real here**, unlike Activity 2. The four-leg pushbutton gets two diagrams: what is
  joined to what inside, and which two legs to wire. The page teaches **"two of the four legs are
  permanently joined; pick two that are diagonally opposite"**. That phrasing is deliberate — it is
  true of a real tactile switch and of Wokwi's pushbutton whichever way round the internal pairs sit,
  and it gives students a rule they can apply without knowing the part.
- The wiring diagram is the **full 40-pin Pico**, reusing Activity 1's pad geometry, with pin 4 (GP2)
  and pin 8 (GND) ringed. Kamil asked for this specifically: a cut-down Pico leaves students guessing
  which of the two numbers goes in the code. Do this in every future activity that wires something.
- Exercise: **SW1 and SW2 on one labelled line**. One line, not two — the columns have to line up for
  the comparison to be readable, and that constraint is the point. It introduces `print` with commas,
  which is the only genuinely new syntax in the exercise.
- `activity.js` gained a **button reader** block, guarded by `#btnrun`, inert on every other page.
  Markup: `#bsw` press-and-hold pad, `#bval` readout, `#btnout` console, `[data-bspeed]` presets
  (`0.2` and `0`). Its console prints only `1` and `0`, so unlike the Activity 1 board simulator it
  leaks no code. `style.css` gained `.pushbtn`, `.readout`, `.readlbl` and `.sim-out.tall`.
- `teacher-3.html` wraps its three-column *mistakes* table in `.tablescroll` so it does not overflow
  at 390 px. `teacher-2.html` and `teacher-1.html` were given the same wrapper in Activity 4's build,
  and `.act` in `style.css` gained `min-width:0` to stop the home page's activity rows overflowing by
  2 px at 390. **Every page now passes the `scrollWidth == clientWidth` check at 390, 768 and 1400.**
- Activity 3 has **no ready-made Wokwi project link**, by decision. There is nothing to fill in later.
  `activity-1.html`'s unfilled `%WOKWI%` placeholder is still outstanding.

### Activity 4 — Making Decisions

- **The one idea arrives in two steps, and the order is load-bearing.** `if` first, demonstrated
  until the class sees a light that will not go out; *then* `else` as the fix. The page is written
  that way and the teacher page insists on it. Do not merge them.
- **Two traps, and they are not equal.** The double equals gets the most page space because it is the
  headline confusion, but it is the *safe* one — a single `=` in a condition is a `SyntaxError`, so
  nothing runs. The dangerous trap is `== 1` instead of `== 0`: it runs perfectly and inverts the
  whole thing. That is Activity 3's inversion finally collecting its debt, and section `#zero`
  **points back to `activity-3.html#trap` rather than re-teaching it**. Keep it that way.
- **No `and` / `or` / `not`, and none smuggled in.** One button, one condition, everywhere — the
  exercise is deliberately *two separate `if`/`else` pairs* rather than one combined condition, so
  that Activity 5 has the contrast to build on. Also ruled out: `elif`, which this module never needs.
- **`print()` stays in the main program**, unlike the LED-only alternative. Its job here is
  debugging: words right + light wrong means the wiring is at fault; words wrong too means the
  decision is. That split is stated on the page and is the reason the lines are not optional.
- The loop waits `0.1`, not Activity 3's `0.2` — the number is chosen for driving a light rather than
  for throttling a console, and the page says so.
- Exercise: **SW1 → red LED1 (GP11), SW2 → green LED3 (GP13)**, as two independent blocks in one
  loop. Kamil's call. The four-state diagram (nothing / SW1 / SW2 / both) is the acceptance test, and
  the most instructive wrong answer is the second `if` at eight spaces, which makes SW2 depend on SW1.
- **Indentation gets its own top-level section again**, because this is the first time anything is
  indented twice. The bar diagram has three left edges and two measuring brackets, and the brackets
  must line up with the guide lines — they did not on the first draft.
- `activity.js` gained a **decision simulator**, guarded by `#ifrun`, inert on every other page.
  Markup: `#ifsw` press-and-hold pad, `#ifval` readout, `#ifled` bulb, `#ifout` console,
  `[data-ifcmp]` (`0` / `1`) and `[data-ifelse]`. It reproduces both traps live, with nothing to
  type — the `== 1` preset and the *take the else away* toggle are worth four minutes of class time.
  Its output is written in **words, never code**, so it leaks nothing.
- Activity 4 adds **no new pins** and no new hardware. It is the first activity to use an input and
  an output at the same time, which is the thing to check on each board before the lesson.

### Activity 5 — And, Or, Not

- **The one idea is joining questions**, not a new kind of decision. There is still one `if`, one
  `else` and two roads; only the question got longer. The page says so out loud, because students
  expect a longer question to produce more roads.
- **Open with the contrast.** Activity 4's exercise was deliberately two separate decisions; this
  activity is one decision that asks about two things. That sentence is in the hero, the first
  section and the teacher page.
- **The trap is that each half must be a whole question**, and it has two faces. `and == 0` is a
  `SyntaxError` — the kind one. `if sw1 and sw2:` **runs**, always answers yes, and leaves a light
  that never goes out — the dangerous one, and the one the section `#whole` is built around. It is
  the `==` lesson of Activity 4 arriving one level up.
- **`not` is taught to be read, not written.** It gets its own short section, a truth-table picture
  and one warning: do not reach for it to "fix" the button inversion. That section points back to
  `activity-3.html#trap` and `activity-4.html#zero` rather than re-teaching either. The only places
  `not` is *written* are going-further tasks.
- **Python's `or` is not the café's "or".** Both-is-still-yes has its own callout and is the bottom
  row of the `or` truth-table picture; it is the row the class gets wrong.
- Mission: **two-key safety switch** — LED1 lights only while SW1 *and* SW2 are held. Kamil's call.
  Real machines work this way, and it is the cleanest demonstration that `and` is stricter than
  either half.
- Exercise: **two-of-three keypad** — green LED3 lights when at least two of SW1/SW2/SW3 are held.
  Kamil's call. It needs `and` and `or` in one question, and the real work is listing the three
  pairs on paper before typing. The finished condition is one long line; the page says that is
  normal, because half a class will assume it is a mistake. **The answer is not on the student
  page** (see rule 5.4) — clue 3 stops at a checklist.
- **No `elif`, still**, and no booleans stored in variables — a half is written out in full every
  time, because naming a boolean is a separate idea and this activity has enough.
- `activity.js` gained a **logic simulator**, guarded by `#logrun`, inert on every other page.
  Markup: `#logsw1` / `#logsw2` press-and-hold pads, `#logv1` / `#logv2` readouts, `#logled` bulb,
  `#logout` console, `[data-logop]` (`and` / `or` / `not`). It answers each half separately and then
  joins them, and its output is words only — it leaks no code. The `not` preset ignores the second
  pad on purpose and says so.
- The Wokwi diagram is Activity 4's, **with a second pushbutton on GP3**. The `<g class="wk">` group
  was copied out of `activity-4.html` unchanged; only the rings and the wires differ. Pads used:
  4 (GP2), 8 (GND), 5 (GP3), 13 (GND), 15 (GP11), 18 (GND); viewBox `780 × 690`. The pad-fact box
  that Activities 1, 3 and 4 draw inside the SVG is a **table underneath the diagram** here — with
  six wires there is no clear space left inside the picture for it.
- Ten diagrams: the loop, two questions joined into one, a truth-table picture for each of the three
  words, `and` versus `or` on the same wiring, the whole-question anatomy (bars and single glyphs,
  no code), name-versus-value, the double-negative result, the four expected states, and the
  exercise's four states.

### Activity 6 — Words on a Screen

- **The one idea is two halves again**, the way Activity 3's was: the OLED screen, and the first
  **library that is not built in**. They need each other — the screen is the reason to add a library,
  the library is the only way to use the screen. Do not split them.
- **First new hardware since Activity 3**, and the first part ever that sits on a **bus**. SDA is
  **GP0**, SCL is **GP1**, and both are new pins — the first added since Activity 1.
- **The address is `0x3C`, and no code sample on either page types it.** The driver's default is
  `0x3C`, so `SSD1306_I2C(128, 64, i2c)` is all a student writes. §2 of this file lists the OLED as
  `0x78`; that is the same address with the read/write bit tacked on (`0x3C` shifted left by one), the
  form datasheets print. Kamil's call: write `0x3C` where an address is discussed, and carry a callout
  on the student page explaining that `0x78` in a datasheet is not a different screen. Wokwi's own
  *SSD1306 OLED display* part ships with `i2cAddress: 0x3c` as its default attribute — checked in the
  Wokwi editor during this build.
- **Adding a library is its own top-level section** (`#library`), the way indentation was Activity 2's.
  Where the file goes on the Pico (top level or `lib/`), how it gets there, and what
  `ImportError: no module named 'ssd1306'` actually means (Python looked on the *Pico's* disk, not the
  computer's). The library lives in `ump-stemlab/stemcube`.
- **The two routes genuinely differ here, and the page says so.** Wokwi: the tab-bar `▾` menu →
  **New file…** → `ssd1306.py`, paste the driver in; Wokwi copies every project file onto the simulated
  Pico on each run (there is no MicroPython library manager in Wokwi — checked). Thonny: open the file
  and **File → Save as… → Raspberry Pi Pico**, with *Tools → Manage packages* as a `<details>`
  alternative. This is the only place in the module where the two routes are not the same thing.
- **Pasting is allowed, once, and the page says why.** A library is somebody else's tool and nobody
  retypes one. Rule 5.1 is about the student's *own* program. Stated on the student page and on
  `teacher.html`'s rules card, or the no-copying rule starts to look arbitrary.
- **Write-then-show is the third teaching beat** and is where the class will lose time: a missing
  `oled.show()` produces a perfect run, no error and a black screen. `oled.fill(0)` is in the main
  program even though a freshly made screen is already blank, because the exercise cannot work without
  it and the clues have to be able to point back at it.
- **The main program has no loop.** First one since Activity 1 that ends by itself; the words stay
  because the screen holds what it was last given. This breaks Activity 2's "every activity after this
  runs in a loop" — deliberately. The exercise puts the loop back.
- Mission: **plain hello** — two fixed lines. Kamil's call: the smallest thing that proves the bus and
  the library work, with the changing value saved for the exercise.
- Exercise: **SW1 and SW2 shown as words** — two labelled rows reading `HELD` / `UP`, updating live.
  Kamil's call. It reuses Activity 3's buttons and Activity 4's two independent `if`/`else` pairs, and
  the real new work is the wipe–write–show order. **No answer on the student page** (rule 5.4); clue 3
  stops at a five-point checklist. A counter was considered and rejected for the exercise because it
  needs turning a number into words, which this module has not taught — it is on `teacher-6.html` as a
  going-further answer only.
- **No `elif`, still, and no `for` loops.** Neither is needed.
- `activity.js` gained two things. First, the **route-tab block was generalised** into a `wire()` helper
  called for `tab-a`/`tab-b` and again for `tab-c`/`tab-d`, because Activity 6 is the first page with
  *two* route-tab groups (getting the library on, and building the circuit). All groups share one stored
  `state.route`, so picking Wokwi once picks it everywhere; pages with only one group behave exactly as
  before. Second, a **screen widget** guarded by `#oledrun`, inert elsewhere. Markup: `#oledmem` and
  `#oledscr` boxes of four `<b>` rows, `[data-oled]` buttons (`wipe` / `l1` / `l2`) and `#oledout`. It
  shows the page and the glass side by side so that writing changes one and not the other. Output is
  words only — it leaks no code.
- `style.css` gained a **`wk-oled-` family** (the module's PCB, bezel, glass, seam, ribbon tab, mounting
  holes, pads and silkscreen labels), `.wkwire.blue`, four diagram helpers (`.oledtxt`, `.oledtxt2`,
  `.oledcell`, `.gridline`, `.buswire`) and the `.oledbox` widget. The `wk-oled-` colours and geometry
  were read out of Wokwi's own artwork at
  `https://wokwi.github.io/wokwi-boards/ssd1306/board.svg` — viewBox `27.7 × 22.6` (mm), PCB `#0f4d7c`,
  glass `#262628`, ribbon tab `#ba8239`, four mounting holes r `1.24` at (2.02, 1.87) / (25.6, 1.87) /
  (2.02, 21) / (25.6, 21), and four pads r `.706` at cy `1.71`, cx `10.1` **GND**, `12.6` **VCC**,
  `15.1` **SCL**, `17.7` **SDA**. The diagram draws it inside
  `<g transform="translate(60,200) scale(9)">` so those millimetre numbers are used unchanged. Like the
  `wk-` family these are the colours of a physical object and are fixed in both themes.
- **The wiring diagram has exactly one crossing, and it cannot be removed.** The module's pads run
  GND · VCC · SCL · SDA left to right, while the Pico's pins run GP0 · GP1 · GND top to bottom — the
  reverse order — so any planar routing is impossible and the blue SCL wire has to cross the green SDA
  wire once. It is a clean right angle in open space. GND and VCC wrap round the bottom-left instead of
  competing in the top band, which removes every other crossing. Wire colours: SDA green, SCL blue, GND
  black, VCC red; pads ringed are 1, 2, 3 and **36** (3V3, on the far right — VCC must not go to pin 39
  or 40, which are 5 V). The wire labels are a **legend box** at `x=336 y=238`, not inline labels, because
  the three signal wires are only 20 px apart at the Pico end. viewBox `780 × 660`.
- Ten diagrams besides the wiring one: the mission flow, the 128 × 64 pixel grid, how 8 × 8 letters sit
  on it, one-pair-per-part versus one shared bus, addressing on the bus, where the library file lives,
  the two routes to get it there, wipe–write–show, the expected result beside a wrong-row version, the
  exercise's four states and the exercise loop. Every one was rendered and looked at in both themes.

### The Wokwi-look board diagrams (Activities 1, 3, 4, 5 and 6)

Kamil asked for the wiring diagrams to look the way the circuit actually looks in Wokwi, **with the
physical pin numbers visible on the Pico**. All three wiring diagrams were redrawn together so the
module does not look like two different books.

- Colours and proportions were measured from Wokwi's own rendering by opening a real project in the
  browser and reading the SVG out of the page. They live in `style.css` under
  *Wokwi-look board diagrams* as a `wk-` family: `wk-pcb` `#006837`, `wk-pcb-top` `#33865f`,
  `wk-pad` `#9a916c` with a white hole, `wk-usb` `#ccc`, `wk-chip` `#30312e`, `wk-mount` (the yellow
  rings flanking the USB), `wk-btn-frame` / `wk-btn-face` / `wk-leg`, and `wkwire` in `green` / `red`
  / `black`. These are the colours of a **physical object**, so they are fixed in both themes on
  purpose — the one exception is the black wire, which lightens in dark mode or it would vanish.
  Rule 4 ("never hard-code a colour") still applies to everything that is page furniture.
- **Wokwi itself prints no pin names and no pin numbers on its Pico** (only `1`, `2` and `39` near
  the corners). Both were added here deliberately, in white silkscreen on the board: the number
  beside the pad, the name inside it. Telling the two apart is the thing students get wrong every
  time, and it is why the diagrams carry the line *"the big white numbers are the physical pins."*
- The board is a self-contained `<g class="wk">` and is **identical in every file that uses it**. To
  wire a new activity, copy that group out of `activity-5.html` or `activity-6.html`, change the ring circles and the wire paths,
  and leave everything else alone. The geometry you need:
  board at `x=545`, width `200`, height `440`; **pin *n*'s centre line is
  `by + 34 + (n<=20 ? n-1 : 40-n) * 20`**, pads 1–20 down the left and 40–21 down the right; a wire
  meets a left-hand pad at `x=537` and a right-hand pad at `x=755`; the ring on a used pad is
  `<circle r="10.5" class="wk-ring">` centred on the hole.
- The diagrams' viewBoxes are `780 × 545` (Activity 1), `780 × 560` (Activity 3),
  `780 × 600` (Activity 4, which carries both circuits), `780 × 690` (Activity 5, which adds a
  second button below the first) and `780 × 660` (Activity 6, whose power wires wrap round the board).
- Parts are drawn the way Wokwi draws them: the pushbutton is a dark frame with a pale face, four
  corner screws, a domed cap and two silver legs a side; the LED is a red bullet with a flange and a
  long leg (A, right) and short leg (C, left); the resistor has silver leads, a body that bulges at
  both ends and orange-orange-brown-gold bands for 330 Ω. Rule 5.3 still applies — **render every
  diagram and look at it**, in both themes. Four of Activity 4's ten needed moving after seeing them.

## 8. Publishing

The repo is **cloned on Kamil's machine** at:

```
STEM LAB/Github Repo/pico-iot-module/
```

That is the working copy. Edit files there directly (`device_bash`, or the file tools
via the connected folder), then Kamil commits and pushes in **GitHub Desktop**. This is
much faster and safer than any other route — use it.

Two things that had to be fixed once, and would bite again on a fresh clone:

- `git config core.autocrlf true`. Without it the Windows checkout shows every file as
  fully modified (CRLF vs LF) and any commit becomes an unreadable 2000-line diff.
- Git must be able to **delete** its own `.git/index.lock`. The connected folder blocks
  deletes until permission is granted, and without it every git command jams. If you see
  `unable to unlink ... index.lock`, call `device_request_delete_permission` on the
  `STEM LAB` folder, then `rm -f .git/index.lock`.

Do not write files into the clone with CRLF, and never hand-retype file contents into
it — copy the real file across.

If the clone is ever unavailable, the fallback is GitHub's web uploader driven through
the browser: gzip + base64 the file, send it in **≤4400-character chunks**, verify a
hash per chunk (single characters do get corrupted in transit), decode with
`DecompressionStream('gzip')`, build a `DataTransfer` synchronously and dispatch
`dragenter`/`dragover`/`drop` on the `<file-attachment>` element — setting
`input.files` silently does nothing. It works, but it is slow; prefer the clone.

There is no `gh` CLI and no push token in these sessions, and **Claude must not be given
one** — tokens are credentials and are out of scope. Pushing is Kamil's step.

After a push, GitHub Pages rebuilds in about a minute. The CDN caches hard — check with
`?v=2` on the URL or a hard refresh before believing a change failed.

### 8.1 How to actually check a page before committing it

There is no browser on Kamil's machine that these sessions can drive, but the cloud
container has Chromium and Playwright already installed (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`
— never run `playwright install`). The routine that worked for Activity 2:

1. Build the page in the container, next to copies of `style.css`, `code.js`,
   `activity.js` and `img/`, staged from the clone.
2. Load it from `file://` and assert, in **both** `color_scheme` light and dark:
   every `.codeimg` contains a `<canvas>` and no `.codefallback`; `#pcount` counts the
   checkboxes; `#quizbox .q` has the expected number of questions; zero `pageerror` and
   zero console errors; `document.documentElement.scrollWidth` equals `clientWidth` at
   390, 768 and 1400 px.
3. **Screenshot every `svg.dia` on its own** (`element.screenshot()`) and look at each
   one, in both themes. This is the only way to catch a label sitting on a wire. Two of
   Activity 2's nine needed moving after seeing them.
4. Drive the widgets: click the tabs, the quiz options, a checkbox, and any simulator;
   type into the `#typer` inputs, including a deliberately wrong capital.
5. **Prove rule 5.1.** Select the whole body, dispatch a synthetic `copy` event with a
   `DataTransfer`, and grep the resulting `text/plain` for anything runnable. It should
   come back with none — `code.js` replaces each hit with `[code — type it yourself]`.
6. `md5sum` the container copy against the copy in the clone after committing it, so you
   know the file that will be pushed is the file you looked at.

Then render the changed `index.html` too, and click through to the new activity.

### 8.2 Every activity means touching every page

Adding activity N means adding a nav link and a footer link to **every** page that
already exists — `index.html`, each `activity-*.html`, each `teacher-*.html`, and
`pinout.html`. Two lines each, and easy to forget. A student who finishes activity N−1
has no other way forward.

## 9. Teacher pages

`teacher-N.html`: `noindex`, listed in `robots.txt`, not linked from any student page,
and content sits behind a click-through gate. That stops students browsing or googling
into it. **It is not secure** — the repo is public, so the file is visible in GitHub's
file list and anyone with the URL can read it. If genuine privacy is ever needed the
teacher notes have to leave this repo.

Each teacher page carries: exercise answer, going-further answers, before-the-lesson
checklist, the mistakes students actually make, teaching notes, every link used, and a
cumulative "pins used so far" table. Every one of them opens with a short
**"what is actually being taught"** section — the one idea, as bullets — and links back to
the previous activity's notes and to the hub from the hero.

**Keep them terse.** Kamil asked for this in Activity 5's build and all five pages were
rewritten to match: bullets and tables rather than paragraphs, one sentence per point, and
the tables (mistakes, going-further, pins) carrying most of the content. Nothing was
dropped — the prose around it was. Write new ones the same way.

**`docs/teacher.html` is the hub**, added in Activity 5's build: the same gate and
`noindex`, a row per activity with its one idea and its notes link, the module-wide rules
(Wokwi first, code is never copy-pasteable, no `elif`, answers live only here), a
cumulative pins table and a once-a-term kit check. It is listed in `robots.txt` and, like
the per-activity pages, **is not linked from any student page** — `index.html` mentions
that an index exists and says to ask the STEM Lab for the link.

`robots.txt` already lists `teacher-1.html` through `teacher-9.html`, so a new teacher
page needs no change there.

## 10. Adding the next activity — the checklist

1. Read `PROMPT-activity-N.md`, this file, and the two most recent activity pages.
2. **Ask before you build.** Kamil answers, and the answers change the page — the
   Activity 2 exercise went from a level crossing to a traffic light on one question.
   Worth asking about: the exercise, anything that needs a Wokwi project link, and
   anything about the board you cannot verify from §2.
3. Write `docs/activity-N.html` and `docs/teacher-N.html`. No exercise answer on the
   student page (rule 5.4); the answer goes on the teacher page.
4. Nav + footer links on every existing page (§8.2).
5. `docs/index.html`: the activity row moves from `.act.soon` (a `<div>`) to
   `.act.live` (an `<a href>`), badge "New".
6. `README.md`: the links table near the top, the status table (`🔜` → `✅ live` with a
   link), the repository layout block, and the "pins used so far" table if the activity
   introduced any.
7. `docs/teacher.html`: add the activity's row, and refresh the cumulative pins table.
8. `CONTEXT.md`: an "Activity N" block in §7 for anything a later builder would
   otherwise have to guess or would get wrong.
9. Verify (§8.1). Look at every diagram, in both themes. If the activity wires anything,
   copy the Wokwi-look Pico out of `activity-4.html` rather than drawing a new one — see the
   *Wokwi-look board diagrams* note at the end of §7.
10. Write `PROMPT-activity-N+1.md` and delete `PROMPT-activity-N.md`. Deleting needs
   permission on the mount — ask for it, it also unblocks git's `index.lock`.
11. Report what changed and stop. Kamil pushes.
