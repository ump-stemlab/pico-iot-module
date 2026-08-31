# CONTEXT — LilEx5 Pico IoT Module website

How this site is built and why. Read this before changing anything, and update it
after every activity you add.

**Live:** https://ump-stemlab.github.io/pico-iot-module/
**Repo:** `ump-stemlab/pico-iot-module` (public). Pages serves `/docs` on `main`.
**Owner:** UMPSA STEM LAB.

---

## 1. What this is

A MicroPython teaching module for the **LilEx5** board — a Raspberry Pi
Pico **W** with three LEDs, a buzzer, three buttons, a slide switch, an OLED screen, a set
of I²C sensors and a long-range radio, all on one PCB.

**It is a Pico W.** Confirmed by Kamil during Activity 11's build, and it matters: the W is
the version with a WiFi radio, and every internet activity is impossible without it. This
file used to say only "a Raspberry Pi Pico", which cost a round of questions. It does not
say that any more.

This website is a **new, self-contained version of the module**. It is not a port of
any earlier Word/PowerPoint material and must not refer to one. Do not write
"the pin numbers changed", "old worksheets", "in the previous module" or anything
similar. A student arriving here has no history to unlearn.

Audience: secondary-school beginners. Every idea is introduced from scratch, in plain
language, one at a time.

### 1.1 The activity list

The **Google Classroom** (`2026 Agrovator Raspberry Pi IOT`) is the authority on numbering,
and **the site now matches it exactly**. Kamil confirmed the Classroom is authoritative
during Activity 10's build, and the whole site was renumbered to it at the end of that build.

| # | Activity | State |
|---|---|---|
| 0 | Getting Started | not built |
| 1 | Light Up an LED | live |
| 2 | Make an LED Blink | live |
| 3 | Digital Output / Servo | not built |
| 4 | Digital Input | live |
| 5 | Making Decisions | live |
| 6 | Advanced Logic (And, Or, Not) | live |
| 7 | Words on a Screen | live |
| 8 | Motion Sensing (Sensors and Numbers) | live |
| 9 | Soil Moisture | live |
| 10 | Wi-Fi Connectivity (Internet and Data) | live |
| 11 | Control From Anywhere | live |
| 12 | Radio Communication | not built |

There is no Activity 0 or 3 on the site because it never had them; both have decks in
`Module Revamp/PPTX`. The numbers **jump from 8 to 10** and that is correct, not a mistake —
do not "tidy" it.

**What the renumber moved**, for anyone reading an old link or an old chat: 3→4, 4→5, 5→6,
6→7, 7→8, 8→10. Activities 1, 2 and 11 did not move.

**Redirects were not possible and this is worth knowing.** After the move `activity-4.html`
*exists* — it is Digital Input — so an old bookmark to `activity-4.html` (which used to be
Making Decisions) now lands on a real page showing a different activity, and there is nowhere
to put a redirect. The only filenames that freed up were `activity-3.html` and
`activity-9.html`. The mitigation is that every page's `<h1>` names the activity, so a
student who lands wrong can see it immediately.

**Progress ticks are keyed by filename** — `activity.js` uses
`'lilex5v2:' + location.pathname.split('/').pop()`. The renumber moved every filename, so old
ticks would have surfaced on the wrong activity (most `data-p` keys differ between activities,
but `w1` and `r1`–`r6` overlap). **The prefix was bumped from `lilex5:` to `lilex5v2:` at the
same time**, which wipes every saved tick and gives everybody a clean slate — Kamil's call,
the site being in alpha with no real progress to lose. If a future change ever moves filenames
again, bump it again.

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

I²C addresses, **as the board's own documentation prints them — and the list is not all in
one form**, which is the trap. OLED `0x78`; temp/humidity/pressure `0x76`;
accelerometer+gyro `0x68`; compass `0x7C`; proximity+light `0x60`; air quality `0x1A` (its
clock must stay below 15 kHz); ADC `0x48`.

**Only the OLED's is the 8-bit (shifted) form.** `0x78` is `0x3C` shifted left by one, and
MicroPython wants `0x3C` — see the Activity 7 block in §7. The sensor entries are already
in the 7-bit form MicroPython wants and **must not be halved**: checked against the drivers
in `ump-stemlab/stemcube` during Activity 8's build, where `bme280.py` sets
`BME280_I2CADDR = 0x76` and `imu.py` looks for `0x68`/`0x69`, both used directly. Halving
`0x68` gives `0x34`, which is nothing. Do not apply the OLED's rule to the whole list; when
a new part is added, read its driver or scan the bus.

The four analogue inputs on connector **H3** do **not** reach the Pico directly — they
go through a converter chip (the ADS1115 at `0x48`) and come back over I²C. Reading *those
four* is an I²C job, not an `ADC()` job.

**That is about H3 only, and it is not the whole story — read this before writing another
analogue activity.** The Pico's own three ADC pins, **GP26, GP27 and GP28**, are brought
out on the 40-pin header H1 and are read with `ADC()` in the ordinary way. This is what
Activity 9 uses. Confirmed against §2.1's header map and against
`lilEx5 GPIO pins Layout.docx` during Activity 9's build:

| GP | printed on the LilEx5 | header pin | state |
|---|---|---|---|
| GP26 | `GPIO24` | 18, top row | Activity 9 — the soil probe |
| GP27 | `GPIO23` | 16, top row | free |
| GP28 | `GPIO18` | 12, top row | reserved for the servo activity |

**3V3 is header pin 1 and nothing else.** Pin 17 is *not connected*; pins 2 and 4 are 5 V
and sit in the same corner as pin 1. The Activity 12 deck in `Module Revamp/PPTX` says
"+3V3 (pin 17)" and is **wrong** — that was caught during Activity 9's build and the page
says pin 1.

Buttons idle high and read **0** when pressed.

## 3. Files

```
docs/index.html        module home, activity list
docs/activity-N.html   one page per activity (students)
docs/teacher-N.html    one page per activity (instructors, unlisted)
docs/teacher.html      index of every teacher page (instructors, unlisted)
docs/pinout.html       searchable pin reference
docs/style.css         the whole design system — every page links it
docs/code.js           renders code as pictures, guards the clipboard, and carries the
                       staff door (see §9). Every page loads it, index.html included.
docs/activity.js       progress, tabs, board simulator, blink simulator, button reader,
                       decision simulator, logic simulator, screen widget, reading widget,
                       publishing widget, dashboard switch widget, soil widget, typing
                       box, quiz
docs/board.js          the board explorer on pinout.html (see 3.1)
docs/robots.txt        keeps teacher pages out of search engines
                       (now lists teacher-1 … teacher-12)
docs/img/lilex5-board.png         the board photo, LED1 **off** — the default
docs/img/lilex5-board-red-on.png  the same board with LED1 **lit**
docs/img/aio-*.png                real Adafruit IO screenshots (Activity 10)
docs/img/thonny-packages.png      Thonny's package manager (Activity 10)
```

In the repo root: `CONTEXT.md` (this file) and **`PROMPT-activity-N.md`** — the
brief for the *next* activity, written at the end of the previous build. Normally there is
only one of these: whoever builds activity N deletes it and leaves `PROMPT-activity-N+1.md`
behind.

**There can be more than one at a time, on purpose.** A brief is only deleted when the
activity it describes has been built. `PROMPT-activity-12.md` is the brief for *Radio
Communication*, which is still unbuilt, so it stays where it is whoever is working.

**The numbering is not contiguous, also on purpose.** Activities 1, 2, 4–11 exist; 0, 3 and
12 do not. The numbers are the Google Classroom's — see §1.1 — and the gaps are activities
that have not been written yet. Do not renumber the existing pages; the URLs are published,
and do not "tidy" the jump from 2 to 4 or from 11 to nothing.

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
would otherwise never see a circuit.

~~WiFi/MQTT and the radio do not simulate~~ — **wrong, corrected during Activity 11's
build.** Wokwi has a real `board-pi-pico-w` part and a simulated network called
**Wokwi-GUEST** (no password) that reaches the actual internet, so a simulated Pico W can
talk to a real MQTT broker. Activity 11 teaches both routes. Only the long-range radio is
genuinely real-board-only. See the Activity 11 block in §7 for exactly what was checked.

**5.3 Diagrams must be clean.** No wire drawn through a part, no crossings, no label
overlapping a wire. Reroute rather than let a wire double back. Always render and look
at the picture before committing.

Rule 5.1 applies inside diagrams too: SVG `<text>` is selectable, so **a diagram may not
contain a line of code**. Activity 2 needed to draw program structure (which lines are
indented, which repeat) and does it with **bars, not text** — `.codeline` paths at two
different left edges, a teal bar for the loop line, a bracket for the block, and the
words in labels beside it. Single identifiers in prose are fine in `<code>`; whole lines
are not, anywhere.

**5.4 The exercise answer never appears on a student page.** Kamil's call, from Activity 6
on. The student page carries the task, the expected-result diagram and progressive clues
that stop short of the solution, plus a short callout saying the answer is with the
teacher. The worked answer lives on `teacher-N.html` only.

**This now applies to every activity.** Activities 1, 2, 4 and 5 used to carry an `<details>` answer
block from before the rule. They were removed during Activity 10's build (Kamil asked) and
replaced with the same *No answer on this page* callout the later pages use. The answers
were already on `teacher-1..4.html`, so nothing was lost. Where a removed block carried
information that was **setting up rather than solving** — Activity 4's second pushbutton,
Activity 5's second button and LED, Activity 2's indentation warning — that paragraph was
moved into the last clue rather than deleted.

A consequence worth remembering: **nothing new may be introduced only in an exercise.** If
an activity's exercise needs a piece of syntax, the body has to teach it first. That is why
`>` had to move into Activity 8's body before its exercise could use it — see the Activity 8
block in §7.

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
  console message competes with that. `print()` arrives in Activity 3, paired with the servo's movement so
  students see it doing something useful immediately (Kamil's call; originally planned for
  Activity 4). Activity 4 reuses `print()` rather than introducing it. Do not add it back
  to Activity 1 or 2.
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
- **Still no `print()`.** It arrives in Activity 3, where the servo's output in the Shell gives it an immediate physical context. Activity 2's mission is loops and indentation; a console message competes with that.
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
- Two long-standing rule 5.1 leaks in `activity-1.html` were closed in Activity 5's build: its
  first flow diagram carried `import Pin` and `led.on()` as SVG `<text>`, and the board simulator's
  labels spelled a whole runnable line around the number input. Both now say the same thing in
  words. **Every page's rendered text now survives a select-all-and-copy with nothing runnable in
  it** — keep it that way, and re-run the check in §8.1 step 5 on every page you touch.
- ~~Known TODO: `activity-1.html`'s unfilled `%WOKWI%` placeholder~~ — **resolved in Activity 5's
  build.** There is no ready-made Wokwi project for Activity 1 and there never was one on this
  site, so the callout was rewritten to point back at the wiring diagram instead. `teacher-1.html`
  still carries a project id; it is not linked from the student page.

### Activity 3 — Digital Output & Servo

- **The one new idea is PWM repurposed for position.** Activity 2 used PWM to dim an LED;
  here the same mechanism — a rapidly flickering pin — moves a servo arm to a named angle.
  The new concept is that the *length* of the pulse decides a physical position, not a
  brightness level. Three duty values (1638, 4915, 8192) encode left / middle / right.
- **`print()` is introduced here** (Kamil's call; originally planned for Activity 4). The servo
  moves visibly and the Shell simultaneously prints the position name — two outputs at once makes
  `print()` immediately useful rather than abstract. Every activity from here on can use it without
  re-introduction.
- **The pin trap is the hardest part.** GP28 = silkscreen GPIO18 = H1 pin 12. Three names,
  one hole, and the code needs the *Pico* number (28), not the *header* number (12) or the *board*
  label (18). Check every group's wiring before power-on.
- **Two boards, two sets of pin numbers, and this was got wrong once.** Wokwi wires a **bare Pico**,
  so there the servo goes to the Pico's own physical pins **40 (VBUS), 38 (GND), 34 (GP28)** — the
  right-hand column. The LilEx5 numbers (H1 pins 2, 6, 12) are a *different* numbering for the same
  three connections and must never be drawn onto the Wokwi Pico. The original build did exactly that
  (wires ran to Pico pins 2/6/12 = GP1/GP4/GP9, labelled VBUS/GND/GP28); **fixed 31 Aug 2026.**
- **H1 runs along the TOP edge**, not the right-hand edge, and pin 1 is the left-hand end of the
  *bottom* row (the corner nearest CN2). Even pins run along the top row, so all three servo wires
  (2, 6, 12) are in the **top row** — 1st, 3rd and 6th pads from the left end. The earlier text
  said "right-hand edge, count down the left side", which is the Wokwi Pico's geometry, not the board's.
- **VBUS (H1 pin 2), not 3V3 (H1 pin 1).** The SG90 is a 5 V part. At 3.3 V it twitches once and
  stalls. Pin 1 sits *below* pin 2, so the classic failure is one **row** out, not one pad out.
- **No `for` loops in the exercise.** Only `while True:`, `sleep()`, `duty_u16()`, and
  `print()`. Students who reach for a `for` loop are asked to rewrite it. This is the
  module-wide rule; Activity 3 follows it.
- **One servo per pair** on the real board; each person simulates their own in Wokwi. The program
  is identical either way. Groups disconnect the servo before swapping who runs the code.
- The exercise asks students to visit **four custom stops** with at least one different hold time,
  using only the constructs above. The answer is on `teacher-3.html`.
- `activity-3.html` uses the same wk-group SVG as Activity 9's wiring diagram (extracted). Since
  the fix the Pico group carries `transform="translate(-490,0)"` and the servo group
  `transform="translate(430,0)"`, so the Pico sits left and the servo right; servo pads moved to
  x=50 (its left edge) and the three wires run right-to-left into Pico pins 40/38/34 with
  different x-waypoints to avoid crossings.
- **The "Real board" tab has its own diagram** (added 31 Aug 2026, modelled on slide 7 of
  `Module Revamp/PPTX/Activity 3 - Servo Motor.pptx`): the board photo `img/lilex5-board.png` with
  H1 outlined, a close-up of H1 drawn as two rows of pads (even 2–40 top, odd 1–39 bottom), rings on
  pins 2/6/12 and three wires down to an SG90. Pad geometry in the close-up: 20 columns,
  x = 369.9 + 19.8·i, top row cy=210, bottom cy=248. It is the only diagram on the site that embeds
  the board photo inside an SVG — the photo is otherwise only on `pinout.html`.
- The deck's exercise is a *smooth sweep with a `for` loop*; the site's is **four custom stops with
  no `for` loop**, because `for` has not been taught yet. Deliberate divergence, do not "fix".

### Activity 4 — Digital Input

- **The one idea is the digital input.** A pin can be *read*, and the reading printed. `print()` was
  introduced in Activity 3; here it gets a new job — watching a pin change. Neither the reading nor
  the printing is new; putting them together in a loop is. Do not split them into two activities.
- **The inversion is the lesson**, the way indentation was Activity 2's. A button reads **1 when
  nobody is touching it and 0 when they are**. It gets its own top-level section (`#trap`), with the
  two pull-up state diagrams immediately before it and an expect-versus-get diagram inside it. Every
  later input activity depends on students having *accepted* this rather than "fixed" it.
- **`Pin.PULL_UP` is written everywhere**, on both routes. Kamil's call: the board's buttons already
  idle high, so the line is belt-and-braces on the LilEx5 and essential in Wokwi — and one setup line
  that works on both routes is worth more to a beginner than the distinction. The teacher page
  explains the nuance; the student page does not.
- **No `if`, and none smuggled in.** The mission is deliberately *watch the number change*, not
  *press the button to light the LED* — that needs `if`, which is the whole of Activity 5. Also ruled
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
- `teacher-4.html` wraps its three-column *mistakes* table in `.tablescroll` so it does not overflow
  at 390 px. `teacher-2.html` and `teacher-1.html` were given the same wrapper in Activity 5's build,
  and `.act` in `style.css` gained `min-width:0` to stop the home page's activity rows overflowing by
  2 px at 390. **Every page now passes the `scrollWidth == clientWidth` check at 390, 768 and 1400.**
- Activity 4 has **no ready-made Wokwi project link**, by decision. There is nothing to fill in later.
  `activity-1.html`'s unfilled `%WOKWI%` placeholder is still outstanding.

### Activity 5 — Making Decisions

- **The one idea arrives in two steps, and the order is load-bearing.** `if` first, demonstrated
  until the class sees a light that will not go out; *then* `else` as the fix. The page is written
  that way and the teacher page insists on it. Do not merge them.
- **Two traps, and they are not equal.** The double equals gets the most page space because it is the
  headline confusion, but it is the *safe* one — a single `=` in a condition is a `SyntaxError`, so
  nothing runs. The dangerous trap is `== 1` instead of `== 0`: it runs perfectly and inverts the
  whole thing. That is Activity 4's inversion finally collecting its debt, and section `#zero`
  **points back to `activity-4.html#trap` rather than re-teaching it**. Keep it that way.
- **No `and` / `or` / `not`, and none smuggled in.** One button, one condition, everywhere — the
  exercise is deliberately *two separate `if`/`else` pairs* rather than one combined condition, so
  that Activity 6 has the contrast to build on. Also ruled out: `elif` — see the note below.

  **`elif` is kept out of Activities 1–8, and arrived in Activity 9.** Kamil's call, made
  during Activity 10's build and carried out in Activity 9's. Up to Activity 8 nothing needs
  it and the two-road picture of a decision is worth more than the shortcut. Activity 9 (soil
  moisture) has three genuine zones — dry, just right, wet — which is the first honest reason
  for it in the whole module, so that is where it is taught, as that activity's second new
  idea. Do not smuggle it into 1–8. It is fair game from 9 on, but Activities 10 and 11 still
  do not use it, and their teacher pages say so.
- **`print()` stays in the main program**, unlike the LED-only alternative. Its job here is
  debugging: words right + light wrong means the wiring is at fault; words wrong too means the
  decision is. That split is stated on the page and is the reason the lines are not optional.
- The loop waits `0.1`, not Activity 4's `0.2` — the number is chosen for driving a light rather than
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
- Activity 5 adds **no new pins** and no new hardware. It is the first activity to use an input and
  an output at the same time, which is the thing to check on each board before the lesson.

### Activity 6 — And, Or, Not

- **The one idea is joining questions**, not a new kind of decision. There is still one `if`, one
  `else` and two roads; only the question got longer. The page says so out loud, because students
  expect a longer question to produce more roads.
- **Open with the contrast.** Activity 5's exercise was deliberately two separate decisions; this
  activity is one decision that asks about two things. That sentence is in the hero, the first
  section and the teacher page.
- **The trap is that each half must be a whole question**, and it has two faces. `and == 0` is a
  `SyntaxError` — the kind one. `if sw1 and sw2:` **runs**, always answers yes, and leaves a light
  that never goes out — the dangerous one, and the one the section `#whole` is built around. It is
  the `==` lesson of Activity 5 arriving one level up.
- **`not` is taught to be read, not written.** It gets its own short section, a truth-table picture
  and one warning: do not reach for it to "fix" the button inversion. That section points back to
  `activity-4.html#trap` and `activity-5.html#zero` rather than re-teaching either. The only places
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
- The Wokwi diagram is Activity 5's, **with a second pushbutton on GP3**. The `<g class="wk">` group
  was copied out of `activity-5.html` unchanged; only the rings and the wires differ. Pads used:
  4 (GP2), 8 (GND), 5 (GP3), 13 (GND), 15 (GP11), 18 (GND); viewBox `780 × 690`. The pad-fact box
  that Activities 1, 4 and 5 draw inside the SVG is a **table underneath the diagram** here — with
  six wires there is no clear space left inside the picture for it.
- Ten diagrams: the loop, two questions joined into one, a truth-table picture for each of the three
  words, `and` versus `or` on the same wiring, the whole-question anatomy (bars and single glyphs,
  no code), name-versus-value, the double-negative result, the four expected states, and the
  exercise's four states.

### Activity 7 — Words on a Screen

- **The one idea is two halves again**, the way Activity 4's was: the OLED screen, and the first
  **library that is not built in**. They need each other — the screen is the reason to add a library,
  the library is the only way to use the screen. Do not split them.
- **First new hardware since Activity 4**, and the first part ever that sits on a **bus**. SDA is
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
  Kamil's call. It reuses Activity 4's buttons and Activity 5's two independent `if`/`else` pairs, and
  the real new work is the wipe–write–show order. **No answer on the student page** (rule 5.4); clue 3
  stops at a five-point checklist. A counter was considered and rejected for the exercise because it
  needs turning a number into words, which this module has not taught — it is on `teacher-7.html` as a
  going-further answer only.
- **No `elif`, still, and no `for` loops.** Neither is needed.
- `activity.js` gained two things. First, the **route-tab block was generalised** into a `wire()` helper
  called for `tab-a`/`tab-b` and again for `tab-c`/`tab-d`, because Activity 7 is the first page with
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

### Activity 8 — Sensors and Numbers

- **The one idea is two halves again**: a sensor *measures*, so what comes back is a decimal; and
  `round()` plus `str()` are the only way to make a decimal fit on a screen. The sensor is the reason
  decimals appear. Do not split them.
- **The sensor is the MPU6050 accelerometer at `0x68`.** Kamil's call, over the BME280. The deciding
  facts, all checked in the Wokwi editor during this build: Wokwi **has** `wokwi-mpu6050` as a built-in
  part at the same address, so both routes are the same circuit for the first time since Activity 6 —
  whereas Wokwi has **no BME280** at all (its nearest cousin is `board-bmp180` at `0x77`, which would
  have meant a different library on the Wokwi route).
- **Wokwi's docs are wrong about the sliders.** They say the MPU6050 is driven only from Automation
  Scenarios. It is not: **clicking the part while the simulation is running** opens a panel with live
  sliders for acceleration x/y/z, rotation x/y/z and temperature. That panel is what makes the whole
  activity work without a board, and it is not discoverable — both the student page and `teacher-8.html`
  say so explicitly.
- **New hardware, and no new pins at all.** That is the headline, not a footnote: the sensor joins the
  bus Activity 7 built. The page points back to `activity-7.html#bus` rather than re-teaching it.
- **The library is `imu.py` *and* `vector3d.py`.** Kamil's call over the one-file `mpu6050.py`, whose
  reader returns a nested dict (`data['accel']['x']`) — two levels of bracket lookup, versus
  `imu.accel.x`, which reads like `oled.fill()` and `sw.value()` and needs no new syntax. The cost is a
  second file, and **a library depending on another library is the one new thing in the library step**.
  `ImportError: no module named 'vector3d'` is the message that means only one was copied.
- **`str()` is the only genuinely new syntax**, and it is taught in the main program, not the exercise —
  rule 5.4 means the exercise carries no answer, so nothing new may be introduced only there. `round()`
  is new too but self-explanatory; the surprise is that a screen refuses a number.
- **Decimals get their own top-level section** (`#numbers`), the way adding a library was Activity 7's.
  Three beats: where the fractional part comes from (the sensor reports whole steps of 1/16384 g, so the
  answer is an untidy fraction), what `round(x, 1)` keeps and discards, and number-versus-words.
- **Say "seven digits", not "fourteen".** MicroPython prints about seven significant figures for a float
  this size — `1.149963`, not CPython's longer tail. Verified in the simulator.
- **Round last, never at the moment of reading.** Stated on both pages; it is the habit that Activity 10
  will need.
- Mission: **one tilt number, printed raw in the Shell and shown rounded on the screen.** Kamil's call.
  The `print()` is load-bearing — it is the only place the class ever sees the untouched reading, and
  without it the decimals lesson is theory. `sleep(0.5)`, not 0.1: a number changing ten times a second
  cannot be read.
- Exercise: **X and Y on two labelled rows**, rounded, live. Kamil's call. Reuses Activity 7's
  label-at-0, number-further-across layout; the real new work is remembering to round *both*. **No answer
  on the student page** (rule 5.4); clue 3 stops at a five-point checklist. Negative readings are called
  out on the page because the minus sign costs a whole letter of width.
- **`>` was originally kept out of Activity 8 and has since been brought in.** Kamil's call during
  Activity 10's build. It is now taught in the body — a `#numbers` sub-beat, *Asking whether a measurement
  is big enough*, with a two-part number-line diagram (a single point the reading never lands on, versus a
  whole side of a line) and a three-line Shell sample comparing `== 1.0` with `> 0.5`. `<` is named in a
  callout but not exercised.
- **The exercise changed at the same time and for the same reason.** It was *X and Y on two labelled
  rows*; it is now **an LED that lights when the board is tilted past 0.5**. Kamil's call. The old exercise
  survives as going-further task 2 and `teacher-8.html` still carries its answer, so nothing was lost.
  Rule 5.4 is why `>` had to move into the body first: nothing new may be introduced only in an exercise
  that carries no answer.
- **The exercise is the first thing since Activity 6 to use an LED**, on `GP11` — an *old* pin, not a new
  one. On the real LilEx5 there is nothing to wire; on the Wokwi route it needs an LED and a 330 Ω
  resistor, and the student page carries the wiring diagram, built by copying Activity 1's LED, resistor
  and note-box group and shifting every y by **+30** (Activity 1's board sits at `by = 70`, Activity 8's at
  `by = 100`). The `wkled` and `wkres` gradients had to be added to Activity 8's `<defs>`; they live in
  Activity 1's.
- **The best trap in the module, and it is free:** tilt the board the *other* way and the light stays dark,
  because −0.9 is not more than 0.5. It looks like a bug, it is not, and fixing it is going-further task 1
  — which is where `or` from Activity 6 finally earns its keep.
- The quiz gained a sixth question, on which comparison to ask of a measurement.
- **No `elif`, still, and no `for` loops.**
- `activity.js` gained a **reading widget** guarded by `#numrun`, inert on every other page. Markup:
  `#numtilt` range slider, `#numraw` / `#numrnd` readouts, `#numscr` `.oledbox`, `[data-numdp]` buttons
  (`0`/`1`/`2`), `#numstr` toggle and `#numout`. It shows the long number, the rounded number and the
  glass at once, only updates the glass when Send is pressed (Activity 7's write-then-show survives), and
  reproduces the `TypeError` **in words** when the words step is switched off. It leaks no code.
- `style.css` gained a **`wk-imu-` family** (PCB `#16619d`, chip, smd, cap, silk, hole, pad and the
  silkscreen label, with `.dim` for the four unused pads), three `.dnum` helpers for drawing numbers
  inside a diagram, `.sim-ctl input[type=range]`, and `.readout.num`. The `wk-imu-` colours and geometry
  were read out of Wokwi's own `wokwi-mpu6050` artwork in the running simulator — viewBox `81.6 × 61.2`
  (21.6 × 16.2 mm), PCB `#16619d`, silkscreen white 3.6px **rotated 90°**, two mounting holes r `6.88` at
  (10, 51.78) and (71.6, 51.78), and **eight** pads r `2.81` at cy `5.81`, cx `7.26` stepping by `9.58`:
  left to right **INT · AD0 · XCL · XDA · SDA · SCL · GND · VCC**. The diagram draws it inside
  `<g transform="translate(48,183.2) scale(2.9)">`, so the `wk-imu-` stroke widths in `style.css` are
  authored for a scale of 2.9 (the `wk-oled-` ones are authored for 9 — check the scale before reusing
  either family).
- **The wiring diagram has no crossings at all**, unlike Activity 7's, and the reason is worth keeping:
  the module's SDA · SCL · GND run left to right in the *same* order as the Pico's pins 1 · 2 · 3 run top
  to bottom, so the three signal wires nest instead of swapping. VCC is the far-right pad and wraps under
  the board (out at y 194, down at x 505, along y 600, up at x 772) to pin **36**, 3V3. viewBox
  `780 × 690`. Pads ringed: 1, 2, 3 and 36 — the *same four* the screen already uses, and the page says
  two wires on one pad is what a bus looks like.
- **Only the sensor is drawn in the Wokwi diagram**, not the screen as well. Eight wires in one picture
  could not be routed cleanly, and it matches what students actually do: keep the Activity 7 project and
  add one part. The sharing is shown separately, as a schematic, in `#join`.
- Eleven diagrams: the mission flow, button-versus-sensor, gravity flat versus on edge, the two parts on
  one bus, the magnified number line where the reading lands on a step, what rounding keeps and discards
  at three settings, number-versus-words, the Wokwi wiring, the expected result beside an unrounded one,
  the exercise's three states, and the exercise loop. Every one was rendered and looked at in both themes.
- **The whole thing was run in Wokwi before the page was written** — `imu.py`, `vector3d.py` and
  `ssd1306.py` pasted in as project files, `wokwi-mpu6050` and `board-ssd1306` on one bus. `i2c.scan()`
  answered `['0x3c', '0x68']`; register `0x75` answered `104`, so `imu.py`'s chip-ID check passes;
  dragging X to 1.15 g printed `1.149963` and put `1.1` on the glass. If a later builder changes the
  program, run it again — the cloud container **cannot reach wokwi.com**, so this needs the browser in
  the Claude desktop app.


### Activity 9 — Soil Moisture

- **The one idea is the analogue pin**, and the second is `elif`. Do not let the second one take over:
  every decision the module has made so far had two ways out, and three zones is the reason this one
  needs three. `//` is a third new thing but it is one sentence of work.
- **This is the first analogue pin in the module, and the first wire to the 40-pin header.** Everything
  before it was either soldered onto the LilEx5 already or drawn in Wokwi. Activity 8's sensor also
  answered *how much*, but over the bus with a library in between; that contrast is the opening of the
  lesson and it is what earns Activity 9 its own page.
- **GP26, not H3.** `CONTEXT.md` §2's H3 warning is about the ADS1115 inputs and is correct, and it is
  *not* about this. GP26 is a real Pico ADC pin and comes out at **header pin 18**, where the LilEx5
  prints **GPIO24**. See the table added to §2. A page that sends a student to H3 will look like a broken
  sensor.
- **The deck is wrong about 3V3 and the page is right.** `Module Revamp/PPTX/Activity 12 - Soil
  Moisture.pptx` (slides 5 and 7) sends the power wire to "+3V3 (pin 17)". **Pin 17 is not connected.**
  The only 3V3 on the header is **pin 1**, bottom row, far left — and pins 2 and 4 are 5 V and sit in the
  same corner. Ground is **pin 20**, next door to 18, chosen over the deck's pin 6 because it draws
  better. Checked against §2.1 and `lilEx5 GPIO pins Layout.docx`.
- **Three numbers for one hole, and Kamil chose how to say it**: a three-column table (printed on the
  board / where the hole is / what you type) plus a diagram of one pad with all three labels pointing at
  it. Activities 1 and 2's rule holds — never two of the three in one sentence.
- **Calibration is on the *student* page, as its own top-level section (`#calibrate`), and it comes
  AFTER the program runs.** Kamil's call. They type the deck's 50000 / 25000, run it, find it wrong for
  their own cup, and only then measure the air and soaked soil and replace both numbers. Slower than
  handing the numbers out and much more memorable — the deck had this on the teacher page only, which is
  what this build set out to change. Do not move it before the program.
- **The Wokwi starter was opened, run and measured during this build** —
  `wokwi.com/projects/472418654786566145`, a plain `wokwi-pi-pico` (not a W) plus the STEM Lab's custom
  `chip-soil-moisture`, gold to GP26, red to 3V3, black to GND, and `main.py` empty on purpose. Measured:
  water **0 % → 65535**, **15 % (the default) → 55693**, **61 % → 25558**, **100 % → 0**. The chip puts
  out `5 V × (100 − water) / 100` against Wokwi's 5 V reference; the RP2040's ADC is 12 bits and
  `read_u16()` spreads them by shifting, so the exact model is
  `raw12 = floor((100−water)/100 × 4095)`, `u16 = (raw12 << 4) | (raw12 >> 8)`. The deck's 50000 / 25000
  land at about 24 % and 62 % water and work. **The cloud container cannot reach wokwi.com** — this needs
  the browser in the Claude desktop app.
- **Calibrating in Wokwi gives 65535 and 0**, because the simulated sensor uses the whole scale, and then
  the printed percentage equals the slider position *exactly* — verified for all 101 positions. That is a
  free end-to-end check of the arithmetic and it is a callout on the student page. Keep it.
- **Mission**: read the probe → percentage → print `DRY` / `JUST RIGHT` / `WET`, three lines a second at
  `sleep(1)`. The raw `print()` is load-bearing: it is the number they calibrate with, and without it the
  calibration section has nothing to read.
- **Exercise**: red LED when dry, green when wet, **neither** when just right. Kamil's call.
  **GP11 and GP13 on both routes** — the deck used GP14/GP12 in Wokwi, which breaks the page's promise
  that the program is identical, and GP14 is the buzzer on the real board. The real LilEx5 needs no wiring
  for it. **No answer on the student page** (rule 5.4); clue 3 stops at a five-point checklist.
- **`<` arrives quietly**, in the two clamp lines, as the mirror of Activity 8's `>`. One sentence in the
  line-by-line table and one row in *Words to remember*; it is not given a section.
- **Reuse, do not re-teach**: the loop, `sleep`, `print()`, `if`/`else`, variables, comments, indentation,
  and `>` plus thresholds, which point back at `activity-8.html#numbers`. No `for` loops.
- **Fifteen diagrams**, and two of them exist because Kamil asked for signal graphs: digital versus
  analogue drawn as voltage against time, and the ADC's conversion line (volts in, number out) with a
  second graph showing one reading being taken per trip round the loop. Then the mission flow, the two
  cups, the three zones, the `elif` cascade, the percentage sum, one slash versus two, the Wokwi wiring,
  one pad three names, the Shell, the calibration number line, the exercise's three states and the
  exercise wiring. Every one rendered and looked at in both themes; six needed moving or resizing after
  seeing them.
- `style.css` gained a short **Activity 9** block at the foot: `.dia .trace` (+`.ink`), `.dia .axis` and
  `.dia .grid` for the graphs; **`.dia .warnbox`**, the red sibling of `.pinbox` and `.namebox`, for the
  third of three zones; and **`.dia .wkwire.gold`** (`#B8860B`, lightened to `#E8B92E` in dark mode) for
  the signal wire, which is the colour Wokwi draws it.
- `activity.js` gained a **soil widget** guarded by `#soilrun`, inert on every other page. Markup:
  `#soilwater` range 0–100, `#soildry` / `#soilwet` number inputs, `#soilraw` / `#soilpc` / `#soilsay`
  readouts, `#soilrun` ("Call this DRY"), `#soilwetbtn` ("Call this WET") and `#soilback`. The two
  Call-this buttons *are* the calibration procedure, which is why the guard is on one of them. It
  reproduces the Wokwi chip's numbers exactly, says in words what happens when the two numbers are equal
  (a division by nothing) or the wrong way round, and leaks no code.
- **The line-by-line table uses `.codetable`** (Activity 11's class). Without it the percentage line's
  chip is drawn too small to read.
- **The Wokwi wiring diagram uses the plain-Pico `wk` group from `activity-8.html`**, not the Pico W —
  Activity 9 does not touch the network, and the starter project is a `wokwi-pi-pico`. Rings on physical
  pins **31 (GP26), 33 (GND) and 36 (3V3)**, all on the right-hand side, so all three wires wrap round:
  the red one over the top at `y=62`, the black underneath at `y=634`, the gold underneath at `y=586`, in
  three separate lanes at `x=776 / 768 / 760` on the right and `x=14 / 26` on the left. viewBox
  `780 × 690`. The sensor is drawn with Activity 10's **`wk-bme-`** family, which is exactly the generic
  green block Wokwi draws a custom chip as (`#087f45`) — no new part family was needed. Its pads are
  where Wokwi puts them: **VCC top-left, GND bottom-left, AOUT bottom-right**, read out of the running
  simulator (the part's own SVG is 30 × 7.08 mm, holes at 1.27/2.27, 1.27/4.81 and 28.73/4.81 mm).
- **The exercise wiring diagram is Activity 11's, verbatim**, with the plain `wk` group swapped in for
  the Pico W: two LEDs and two resistors on physical pins 15 (GP11) and 17 (GP13), grounds on 13 and 18,
  viewBox `780 × 720`. It needs the `wkled`, `wkledg` and `wkres` gradients in `<defs>`.
- **`teacher.html` changed as well as gaining a row**: the "No `elif`, ever" card is now "No `elif`
  before Activity 9", and the `for`-loop card no longer hangs off it. `teacher-5`, `-6`, `-7`, `-8`,
  `-10` and `-11` had their "not needed anywhere in this module" wording corrected to point at Activity 9.
  `activity-8.html`'s closing "Next up" now points at Activity 9 rather than Activity 10.
- **`pinout.html`'s GP26 row** no longer says "free for your own parts"; it names the soil probe, the
  `GPIO24` silkscreen and Activity 9. `robots.txt` needed no change — it already listed `teacher-9.html`.
- **Probe care is a real teaching-time risk and is on the teacher page**: resistive probes corrode while
  powered and wet, a corroded one is indistinguishable from a wiring fault, and a set left standing in
  cups over a weekend will be visibly worse. Test every probe before the lesson.

### Activity 10 — Internet and Data

- **The one idea is two halves again**: the board **joins a network**, and it hands its message to a
  **broker** that passes messages on. Neither is any use alone. Do not split them.
- **First activity that needs the Pico W**, and the first that can fail for reasons entirely outside the
  program — wrong band, captive portal, blocked domain, rate limit. Budget lesson time for the network,
  not for the code.
- **The sensor is the BME280 weather sensor at `0x76`** — Kamil's call, and what the original material
  used. It is the *third* part on the Activity 7 bus, so still no new pins. Note this is the part Activity
  8 rejected, for a reason that no longer applies: Wokwi has no built-in BME280, but the STEM Lab has a
  **custom Wokwi chip** for it, and it is in the starter project.
- **The destination is Adafruit IO**, one free account each, made in the lesson — Kamil's call. Feeds are
  private to an account by default, so the page does not need the "this is a public noticeboard" warning a
  `test.mosquitto.org` version would have needed. It carries a "the key is a password" warning instead.
- **The rate limit is a teaching point.** 30 messages a minute on a free account, hence `sleep(5)`. Going
  over it looks exactly like a broken board — no error, just silence.
- **The reading arrives as words with its unit stuck on**: `bme.values` hands back
  `('23.45C', '1010.39hPa', '55.04%')`. `reading[:-1]` — *all of it except the last character* — is the
  only genuinely new syntax, and it is the sibling of Activity 8's `str()`/`round()`: that one reshaped a
  reading for a person, this one reshapes it for a machine. **The pressure's unit is three characters**,
  which is what makes going-further task 2 worth setting.
- **`while not wlan.isconnected():` is the quiet win.** First loop in the module that stops by itself, and
  it gives Activity 6's `not` a job that finally matters. The page draws it beside Activity 2's forever-loop.
- **Setting up goes outside the loop**, and the page says why: rejoining the WiFi every five seconds
  half-works, which is worse than failing.
- **`float()` is deliberately avoided.** MQTT carries text anyway and Adafruit IO parses `23.45` from a
  string, so nothing has to be converted. It appears only in a going-further answer on `teacher-10.html`.
- Mission: **the temperature to a live graph.** Exercise: **the same reading on the OLED as well** —
  Kamil's call. The exercise introduces **no new syntax at all**; every line is Activity 7 or 7. The page
  shows the screen's wiring anyway (Kamil asked), lifted verbatim from Activity 7's verified diagram and
  retitled. **No answer on the student page** (rule 5.4); clue 3 stops at a six-point checklist.
- **No `elif`, still, and no `for` loops.**
- **The Wokwi starter project is given ready-made** and linked from the page, because Kamil asked for it.
  It began as `wokwi.com/projects/472388087907794945` ("Pico-Activity 10", from the original material) and
  was rewired during this build: the custom BME280 moved from **GP2/GP3 to GP0/GP1** to match Activities 7
  and 8, SCL's wire changed from yellow to **blue** to match the module's diagrams, an **SSD1306 was added**
  pre-wired on the same bus so the exercise runs in the simulator, and **`ssd1306.py` was added** as a
  project file. `main.py` is deliberately empty apart from a comment block pointing at the website.
- **The custom chip has sliders** for temperature, pressure and humidity — click the green block *while the
  simulation is running*. As undiscoverable as the MPU6050's, and called out on both pages.
- **Verified end to end in the browser before the page was written.** On the rewired project
  `i2c.scan()` answered `[60, 118]`, `bme.values` answered `('21.64C', '1010.39hPa', '55.04%')`, the board
  joined `Wokwi-GUEST` and got `10.10.0.1`, and a connection to the real `io.adafruit.com` came back
  `MQTTException(5,)` with a deliberately fake key. No credentials were used; the rejection was the proof.
- `activity.js` gained a **publishing widget** guarded by `#pubrun`, inert on every other page. Markup:
  `#pubtemp` range, `#pubuser` text input, `#pubraw` / `#pubsend` readouts, `#pubdash` bar chart,
  `#pubstrip` toggle, `#pubclear` and `#pubout`. It builds the topic address live from the username,
  refuses a 31st message in a minute, and draws a red flat bar when the unit was left on. Words only.
- `style.css` gained a **`wk-bme-` family** (PCB `#087f45`, sampled from the running simulator; gold title,
  white subtitle, pads) and the `.dashbox` widget plus `input[type=text]` in `.sim-ctl`. Wokwi draws a
  custom chip as a plain green block with its own name on it, so that is what the diagram shows — there is
  no module artwork to copy, unlike the OLED and the MPU6050.
- **The board drawn is the Pico W**, copied from `activity-11.html`, because this is a network activity.
- **Fourteen diagrams**, all rendered and looked at in both themes: the mission flow, three parts on one
  bus, the three answers with their units, taking the last character off, the four states of joining,
  forever-loop versus a loop that lets go, the broker fanning out to three listeners, how the address is
  built, two kinds of library, the Wokwi wiring, what you should see, the screen's wiring for the exercise,
  the same reading in two places, and one round of the loop.
- **Ten real screenshots**, and this is the first page in the module to carry any. Kamil asked for them.
  They came out of `Module Revamp/PPTX/Activity 9 - Internet and Data.pptx` (which the deck itself now
  numbers 10) — nine of Adafruit IO, one of Thonny's package manager. Rules that were applied and should
  be applied again:
  - **Crop the browser's top strip off.** It carries the account holder's real name, and it is clutter.
    It is 51 px tall on a 1530-wide capture, 60 px on a 1449-wide one.
  - **Quantise to 256 colours.** Flat UI screenshots lose nothing visible and shrink by about 60% —
    1.5 MB became 660 KB for the ten.
  - **Never a screenshot of code.** The deck has several; they were all left out. Code on this site is a
    `.codeimg`, and a second rendering of the same program would drift out of step with the first.
  - **The key stays blacked out.** Adafruit's own panel redacts it in the source image; the caption points
    at that redaction and uses it to make the security point, which lands better than the sentence did.
  - The page carries a callout saying the pictures are real and that websites get redesigned, so go by the
    words on a button rather than by where it sits.
  - They live in `docs/img/` as `aio-*.png` and `thonny-packages.png`, and `style.css` gained a
    `figure.shot` rule — a bordered picture with a centred caption, so a white screenshot does not bleed
    into a light card or glare out of a dark one.

### Activity 11 — Control from Anywhere

Built from `Activity 11 - Control from Anywhere.pptx` in the STEM LAB PPTX folder.
**Note the gap** — Activities 0, 3 and 9 do not exist yet; 9 (*Soil Moisture*) is next.
This page was the first to use the Google Classroom's numbering, and during Activity 10's
build the whole site was renumbered to match it. See §1.1.

- **The Adafruit IO walkthrough is real screenshots, not drawings** (added 31 Aug 2026).
  Sixteen `figure.shot` pictures cut from slides 7&ndash;22 of the deck, saved as
  `docs/img/aio11-*.png` (1000&nbsp;px wide, 256-colour, ~40&ndash;95&nbsp;KB each). They sit in the
  six steps of the *feed, key and switch* section and in *Click it &mdash; and watch nothing happen*:
  feeds list, new feed, feed made, MQTT address, key, new/named/listed dashboard, empty dashboard,
  block gallery, connect feed, block settings, create block, toggle OFF, toggle ON, feed rows.
  They are **separate files from Activity 10's `aio-*.png`** &mdash; different crops, different feed
  (`led`, not `temperature`). The key screenshot has the Active Key blacked out in the deck already;
  keep it that way. The SVG diagrams beside them were kept &mdash; the screenshots show *where to
  click*, the diagrams show *what is happening*.
- **The one idea is that the arrow turns round.** Every activity before this one had the
  board doing the talking. Today it *listens* — it subscribes, and something else decides.
  A thing that publishes can be watched; a thing that subscribes can be **controlled**.
  That sentence is in the hero, the first section and the teacher page.
- **Three parts, and they only work together**: `subscribe` (ask to be told), `def` (write
  a job down), and `check_msg()` (give it a chance to run). Remove any one and the program
  runs perfectly and does nothing. All three failures are silent, which is why the page
  spends so long on them and why the try-it widget lets each one fail on its own.
- **Written self-contained, deliberately.** Activity 10 (*Internet and Data*) did not exist
  when this page was written, so Activity 11 teaches WiFi joining, MQTT, the Adafruit IO
  account/feed/key/dashboard and the `umqtt.simple` library from scratch. It is the longest
  page in the module.

  **Activity 10 exists now**, built in parallel by another session, so that first third is a
  known duplication — including a second set of Adafruit IO screenshots if both pages carry
  them. `#wifi`, `#account` and `#library` are the sections to collapse into links to
  `activity-10.html`, and nothing else on the page changes. Worth half an hour before the
  module is taught, so a class is not walked through the same account setup twice.
- **First `def` in the module, and first callback.** Two new things at once and they need
  each other: code that does not run when you write it, and a name handed to somebody else
  so that *they* run it. The phone-number picture (`#callback`, second diagram) is the one
  students quote back.
- **`mqtt.set_callback(name)` with brackets is the most dangerous mistake on the page**, and
  the page, the troubleshooting table and the teacher page all say so. It runs the function
  once, hands the server the return value (nothing), and the program then behaves perfectly
  and never responds to a message. No error, no clue. Check it before anything else.
- **First `while` with a real question.** Every loop until now was `while True`. The WiFi
  wait, `while not wlan.isconnected():`, is the first loop in this module that ends by
  itself, and the first place `not` is *written* rather than only read — Activity 6's "learn
  to read it, don't reach for it" rule finally relaxing, and the page says so.
- **Three levels of indentation, for the first time** (function, then the `if` inside it).
- **`from network import WLAN, STA_IF`, not `import network`.** Same "borrow one tool from a
  toolbox" shape as every other import in the module. The `import network` form is shown
  once, in a `<details>`, so nobody is thrown by code they find online — exactly what
  Activity 2 did for `import time`.
- **Write the client with keyword arguments**: `MQTTClient(MY_NAME, SERVER, user=…,
  password=…)`. The deck describes it as *MQTTClient(name, server, user, password)*; typed
  positionally the username lands in umqtt's `port` argument and the failure is unreadable.
- **The deck's pin numbers are wrong for this board and were corrected.** Slides 25 and 31
  say red LED1 = `Pin(14)`, yellow 13, green 12. On the LilEx5 (§2, and `lilEx5 GPIO pins
  Layout.pdf`) red LED1 is **GP11**, yellow **GP12**, green **GP13**, and **GP14 is the
  buzzer** — `Pin(14)` makes a noise, not a light. Both the student and teacher pages use
  GP11/GP13. The teacher page names the discrepancy so nobody teaching from the slides
  reintroduces it.
- Mission: **an Adafruit IO Toggle block turns the red LED1 on and off.** Kamil's call, and
  the deck's.
- Exercise: **green LED3 lights whenever the order is OFF**, so exactly one of the two is
  always lit — dark then means crashed rather than off. Kamil's call, and the deck's. It
  needs no new syntax (it is Activity 5's two-branch `if` with one more line per branch) and
  it teaches something real: a device that can only say one word cannot tell you it is
  alive. **No answer on the student page** (rule 5.4); clue 3 stops at a five-point
  checklist. The commonest wrong answer is adding the two switch-*on* lines and forgetting
  the switch-*off* ones, which lights both.
- **The account question is a teaching decision, not an implementation detail.** Kamil's
  call: **each student makes their own free Adafruit IO account**. The key is a password
  that controls every feed on the account, and the page says so plainly rather than quietly.
  A shared class account would mean one student's switch controlling thirty boards.
- **The network question is unsettled and the page is written for that.** School WiFi with a
  captive portal defeats the real-board route entirely, and a Pico W cannot join 5 GHz at
  all. Both are callouts on the student page, a phone hotspot on 2.4 GHz is presented as a
  first-class route rather than a workaround, and `teacher-11.html` makes testing the
  network in the room a before-the-lesson item.
- **No `elif`, still, and no `for` loops.**
- `activity.js` gained a **dashboard switch widget** guarded by `#mqrun`, inert on every
  other page. Markup: `#mqtog` toggle, `#mqfeed` (a `.feedbox` of four `<b>` rows), `#mqled`
  bulb, `#mqsub`, `#mqrun`, `#mqauto` and `#mqout`. Flipping the switch while not subscribed
  is the whole point of it — the switch works perfectly and nothing happens, which is the
  Activity 11 moment. Output is words only; it leaks no code.
- `style.css` gained the `wk-pcb.w` / `wk-wifi` / `wk-wifi-lbl` / `wk-brand.w` family for
  the Pico W, `.mqsw` and `.feedbox` for the widget, and `.codetable` (see below).
- **`.codetable`** — the line-by-line table's code chips are long here (the longest is 67
  characters) and `max-width:100%` was shrinking the pictures to an unreadable size in a
  narrow cell. The table is wrapped in `.tablescroll` and given `min-width:830px` with a
  `min-width:486px` first column, so the chips draw at full size and the table scrolls on a
  phone instead. `.wrap` is 880px, so it does not overflow on desktop. **Reuse this on any
  future line-by-line table with long lines.**

#### The Wokwi route, and what was and was not verified

**Verified, by reading Wokwi's own data in the browser:**

- Wokwi's Pico W is the part **`board-pi-pico-w`**, distinct from the plain Pico, running
  MicroPython `micropython-20260406-v1.28.0`. Picking the plain Pico fails at the first
  import, silently as far as a student is concerned.
- Wokwi has **no MicroPython package manager**, so `umqtt.simple` arrives as a flat project
  file called `umqtt_simple.py` — hence the import line differing by one character between
  routes. Same shape as Activity 7's `ssd1306.py`.
- Wokwi's simulated network is **`Wokwi-GUEST`** with an empty password, and Kamil's own
  Activity 9 Wokwi project is built on it talking to Adafruit IO.
- The `umqtt.simple` in circulation raises `MQTTException(5)` on a refused login and asserts
  `"Subscribe callback is not set"` if `subscribe` runs before `set_callback`. Both are in
  the student page's troubleshooting table, worded from the real messages.
- Wokwi's Pico W board art, read from `wokwi.github.io/wokwi-boards/pi-pico-w/board.svg`
  (viewBox `826.78 × 2086.6`): PCB **`#005a00`** — a darker green than the plain Pico's
  `#006837`, and visibly different — with a silver WiFi can `#b3b3b3` and a **`Wi-Fi`**
  label in `#4d4d4d` printed on it. In the module's own geometry the can is scaled to
  `x=614 y=386 w=62 h=80`; the true proportion is wider, but the module draws pin names
  inside the board (Wokwi does not) and a full-width can sits on top of them.

**Not verified: the program has not been run end to end.** Wokwi's simulator stops the
moment its tab is not the visible one, so neither the browser pane in the desktop app nor a
background Chrome tab will run it — the clock freezes at `00:00.033`. To finish this check,
open the project in a Chrome window and **leave it in front**, then load the code and read
the serial output. Until somebody does that, the page's claim that Wokwi-GUEST reaches a
real broker rests on Wokwi's design and on Kamil's Activity 9 project, not on an observed
run. **Do this before the first class that uses the Wokwi route.**

Twelve diagrams: the mission flow, publish versus subscribe, everything going through the
middle, the two loop shapes, feed versus dashboard, the three-part address, `def` being
walked past, handing the name over, the `check_msg` timeline, the Wokwi wiring, the expected
result, and the exercise's three states. Every one was rendered and looked at in both
themes; four needed moving or resizing after seeing them.

### The Wokwi-look board diagrams (Activities 1, 4, 5, 6, 7, 8, 9, 10 and 11)

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
  wire a new activity, copy that group out of `activity-7.html`, `activity-8.html` or `activity-11.html`, change the ring
  circles and the wire paths, and leave everything else alone. **Activity 11's copy is the Pico W** —
  same geometry, but `class="wk-pcb w"` for the darker green, plus the WiFi can and its label; use that
  one for any future activity that needs the network. The geometry you need:
  board at `x=545`, width `200`, height `440`; **pin *n*'s centre line is
  `by + 34 + (n<=20 ? n-1 : 40-n) * 20`**, pads 1–20 down the left and 40–21 down the right; a wire
  meets a left-hand pad at `x=537` and a right-hand pad at `x=755`; the ring on a used pad is
  `<circle r="10.5" class="wk-ring">` centred on the hole.
- The diagrams' viewBoxes are `780 × 545` (Activity 1), `780 × 560` (Activity 4),
  `780 × 600` (Activity 5, which carries both circuits), `780 × 690` (Activity 6, which adds a
  second button below the first), `780 × 660` (Activity 7, whose power wires wrap round the board) and
  `780 × 690` (Activity 8, whose sensor module sits high on the left), `780 × 600` (Activity 8's
  exercise, one LED and one resistor), `780 × 690` (Activity 9, whose three wires all wrap round to the
  right-hand pads, one over the top and two underneath), `780 × 720` (Activity 9's exercise, which is
  Activity 11's diagram with the plain Pico swapped in), `780 × 690` (Activity 10, whose custom chip sits
  high on the left with its legend beneath it) and `780 × 720` (Activity 11, which carries two
  LED-and-resistor chains, one routed over the top of the board and one under it).
- Parts are drawn the way Wokwi draws them: the pushbutton is a dark frame with a pale face, four
  corner screws, a domed cap and two silver legs a side; the LED is a red bullet with a flange and a
  long leg (A, right) and short leg (C, left); the resistor has silver leads, a body that bulges at
  both ends and orange-orange-brown-gold bands for 330 Ω. Rule 5.3 still applies — **render every
  diagram and look at it**, in both themes. Four of Activity 5's ten needed moving after seeing them.

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

**Keep them terse.** Kamil asked for this in Activity 6's build and all five pages were
rewritten to match: bullets and tables rather than paragraphs, one sentence per point, and
the tables (mistakes, going-further, pins) carrying most of the content. Nothing was
dropped — the prose around it was. Write new ones the same way.

### 9.1 The staff door — three clicks on "See"

Added in Activity 10's build, at Kamil's request. **Clicking the word "See" in the coloured
strip at the top of any page three times, within about two seconds, opens the teacher
notes.** From `activity-N.html` it opens that activity's own `teacher-N.html`; from
anywhere else it opens `teacher.html`. On `teacher.html` it does nothing.

- It lives at the bottom of `docs/code.js`, which is the one script every page loads —
  `index.html` had to have `<script src="code.js">` added for this, and now has it.
- **Deliberately quiet.** Nothing in the markup, no cursor change, no hover state, and no
  feedback on the first two clicks. `.chev` also gained `user-select:none` so a triple-click
  does not highlight the strip and give the gesture away.
- The gesture is written down on `teacher.html` itself and nowhere else, since that is the
  one page students are not pointed at.
- **It is a shortcut, not a lock, and it does not change the paragraph above.** The teacher
  pages were never protected; a student who finds the gesture still lands on the
  click-through gate, and the repository is public regardless. If genuine privacy is ever
  needed, the answer is still that the notes have to leave this repo — not that the door
  should be made harder.
- Verified across every page type during that build: activity pages land on their own notes,
  `index.html` and `pinout.html` land on the hub, a teacher page lands on the hub,
  `teacher.html` stays put, two clicks with a pause do nothing, and clicking any of the other
  three words does nothing.

**`docs/teacher.html` is the hub**, added in Activity 6's build: the same gate and
`noindex`, a row per activity with its one idea and its notes link, the module-wide rules
(Wokwi first, code is never copy-pasteable, no `elif`, answers live only here), a
cumulative pins table and a once-a-term kit check. It is listed in `robots.txt` and, like
the per-activity pages, **is not linked from any student page** — `index.html` mentions
that an index exists and says to ask the STEM Lab for the link.

`robots.txt` lists `teacher.html` and `teacher-1.html` through `teacher-12.html`, so a new
teacher page below 13 needs no change there. Activity 11's build extended it from 9.

## 10. Adding the next activity — the checklist

1. Read `PROMPT-activity-N.md`, this file, and the two most recent activity pages.
   Note that the numbering skips: see §3. Build the number the prompt asks for, and do not
   assume it is one more than the highest page on disk.
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
   copy the Wokwi-look Pico out of an existing page rather than drawing a new one — from
   `activity-10.html` or `activity-11.html` if it needs the network, since those copies are the
   Pico **W**. See the *Wokwi-look board diagrams* note at the end of §7. Activity 10's build
   used a Playwright script that also **wraps every `<table>` in `.tablescroll`** — without
   that a three-column table overflows the page at 390 px, and every page is supposed to pass
   the overflow check.
10. Write the brief for the next activity and delete the one you worked from. Deleting needs
   permission on the mount — ask for it, it also unblocks git's `index.lock`. Do **not**
   delete a brief for an activity that is still unbuilt (see §3).
11. Report what changed and stop. Kamil pushes.
