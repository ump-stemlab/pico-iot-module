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

