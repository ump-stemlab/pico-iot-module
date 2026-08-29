# PROMPT — build Activity 12

Paste everything below into a fresh chat when you are ready to build the next activity.
Attach nothing else; the repo has what it needs.

---

I want you to add **Activity 12 — Sending Messages by Radio** to my existing teaching website.

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

**The source material** is `Activity 12 - Sending Messages by Radio.pptx` in
`STEM LAB/Module Revamp/PPTX/`. Read it before you plan anything. **Check its pin numbers
against `CONTEXT.md` §2 before you use any of them** — the Activity 11 deck had the LED
pins shifted by one, which would have made students drive the buzzer instead of the red
LED. Assume the same until you have checked.

**Read these first, in this order:**

1. `CONTEXT.md` in the repo root — how the site is built, the board's pin map, the design
   system, the rules that must not be broken, and the checklist in §10. Note **rule 5.4**
   — no exercise answers on student pages. Read §3 on the **numbering**, which is not
   contiguous and is not meant to be, and §5.2, which was corrected during Activity 11's
   build.
2. `docs/activity-11.html` — the freshest pattern, and the one Activity 12 answers:
   Activity 11 sent an order across the whole internet through a server. Activity 12 sends
   one across a car park with **no server at all**. That contrast is the hook, and the page
   should open on it.
3. `docs/teacher-11.html` for the teacher-page pattern, and `docs/teacher.html` — the
   teacher landing page, which needs an Activity 12 row.
4. `docs/style.css`, `docs/code.js`, `docs/activity.js` — shared, already written. Reuse
   them. Only add to `style.css` if Activity 12 genuinely needs a new component.
   `activity.js` picks up widgets from the markup — add a new block guarded by an element
   id, the way the dashboard switch widget is guarded by `#mqrun`, so other pages stay
   untouched.

**What to build:**

- `docs/activity-12.html` — the student page.
- `docs/teacher-12.html` — the teacher page (`noindex`, gated, not linked from anywhere).
- Update `docs/teacher.html` — add the Activity 12 row and refresh its pins table.
- Update `docs/index.html` and `README.md`: move Activity 12 from "coming soon" to live,
  badge "New"; Activity 11's badge becomes "Ready".
- Add the Activity 12 nav + footer link to **every** existing page — `index.html`,
  `activity-1.html` … `activity-8.html`, `activity-11.html`, `teacher.html`,
  `teacher-1.html` … `teacher-8.html`, `teacher-11.html`, `pinout.html`. Two lines each.
  It is easy to forget and it strands the student. `robots.txt` already covers
  `teacher-12.html`.
- Update `CONTEXT.md`: add an "Activity 12" block to §7, and replace this file with the
  brief for whatever comes next.

**Things to settle with me before you build anything:**

- **How many boards does a pair of students get?** A radio activity needs two. If the class
  has one board each and thirty boards, that is fifteen links on the same frequency in one
  room, and that is a design question, not a detail. **Ask me, and do not assume.**
- **Which radio module is actually fitted, and at what settings?** `CONTEXT.md` §2 has the
  pins — TX/RX on GP16/GP17, the three mode pins M2/M1/M0 on GP18/GP19/GP20, and AUX on
  GP21 — but not the part number, the default baud rate, the channel or the address.
  I need the module's own documentation, or a board to read the silkscreen off. **The three
  mode pins are the thing to get right**: on these modules they select transparent mode
  versus configuration mode, and every "it does nothing" story starts there.
- **Can Wokwi simulate this at all?** Almost certainly not — these are UART modules with no
  Wokwi part — but **verify it rather than assuming**, the way Activity 11's build did for
  WiFi. If it cannot, this becomes the first real-board-only activity in the module and the
  page has to say so in the hero, not in a footnote. Decide with me what the Wokwi-less
  students do.
- **What is the mission, and what is the exercise?** The obvious shape is one board sending
  a word when a button is pressed and the other lighting an LED — Activity 11's mission with
  the server removed. Ask me before committing to either.
- **Does anything need a licence or a channel plan?** Long-range radio is regulated. Find
  out what band the module uses and whether the school needs to care, and put the honest
  answer on the teacher page.

**Content notes carried forward:**

- **Reuse, do not re-teach:** the loop, `sleep`, stopping a forever-loop, `Pin`, `print()`,
  variables, comments, `if`/`else`, `==`, `and`/`or`/`not`, indentation, the I²C bus,
  `SSD1306_I2C`, `fill`/`text`/`show`, the sensor and `imu.accel.x`, `round()`, `str()`,
  `def` and callbacks, `.decode()`, and the whole business of getting a library file onto
  the Pico. A one-line reminder and a link is enough for every one of them.
- **No `elif`, still**, and no `for` loops. Both have been kept out on purpose.
- **`def` and callbacks are now taught** (Activity 11) and can be used freely. So can
  `while` with a real question, and `not` written rather than only read.
- **`>` still has not been taught in a main program.** It appears in Activity 8's
  going-further only.
- **UART is new, and it is the honest new idea**: two wires, one talking and one listening,
  and no address and no server anywhere. Say what it costs as well as what it saves — no
  acknowledgement, no ordering, no idea whether anyone heard.
- Comments (`#`) in every code sample.

**Non-negotiables (they are in `CONTEXT.md`, repeating the important ones):**

1. **Code must not be copy-pasteable.** Use `<span class="codeimg" data-code="BASE64">`;
   `code.js` draws it as a picture. Check that no code line appears as plain text anywhere
   on the page, including inside explanation tables, `<summary>` lines, quiz options and
   troubleshooting tables. Prove it: select the whole rendered page, copy, and confirm
   nothing runnable comes out. The one deliberate exception is a **library file**, which
   students paste — Activity 7 established that and says why.
2. **No code inside diagrams either.** SVG `<text>` is selectable. Draw program structure as
   bars and labels, the way Activities 2, 5, 6 and 11 do. Single operators (`=`, `==`, `>`)
   as big glyphs are fine — whole lines are not.
3. **No exercise answer on the student page** (rule 5.4). Task, expected-result diagram,
   progressive clues that stop short of the solution, and a line saying the teacher has the
   answer. The worked answer goes on `teacher-12.html` only.
4. **No references to any older version of this module.** This site is self-contained.
5. **Wokwi first**, then the real board, as two tabs — *where Wokwi can do it at all*. If
   Activity 12 wires anything, **copy the Wokwi-look Pico group out of an existing page**
   rather than drawing a new one — `activity-11.html` if the network is involved, since
   that one is the Pico W. `CONTEXT.md` §7 has the geometry and the pin-centre formula, and
   the OLED, MPU6050 and Pico W module geometry is recorded there too, each with the scale
   its stroke widths were authored for. **Make the diagrams look the way the circuit looks
   in Wokwi, and keep the pin numbers visible on the Pico** — students get the physical-pin
   versus GP-number confusion every single time. Use the browser in the Claude desktop app
   if you need to look at Wokwi's own rendering of a part before drawing it; reading the
   part's SVG straight out of `wokwi.github.io/wokwi-boards/` is how the OLED, MPU6050 and
   Pico W were drawn. *(Carry this paragraph into the next prompt too.)*
6. **Diagrams:** more rather than fewer. Inline SVG using the `.dia` classes and the theme
   variables in `style.css` — never hard-code a text or background colour (the `wk-`,
   `wk-oled-`, `wk-imu-` and `wk-wifi` board colours are the documented exception, because
   they are the colours of a physical object). No crossings, no overlapping labels; render
   the page and **look at every diagram, in both themes**, before you commit.
7. **Teacher notes stay concise** — bullets and tables, one sentence per point, no long
   prose. `teacher-11.html` is the model. *(Carry this into the next prompt too.)*
8. **Render and check both pages before publishing** — see the recipe in `CONTEXT.md` §8.1.
   Activity 11's build left a working Playwright script you can rewrite from that section.
   Verify: every `.codeimg` becomes a canvas, the progress bar counts, the quiz renders, no
   console errors, no horizontal overflow at 390 px, and both pages work in dark mode.
   Every page currently passes the overflow check — do not be the one to break it. If a
   line-by-line table has long code lines in it, use the `.codetable` class Activity 11
   added, or the pictures shrink to an unreadable size.

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

**Two loose ends you have inherited, neither of them yours to fix silently:**

- **Activity 10 does not exist**, but every page links to `activity-10.html` and the home page
  has a live row for it. That was a half-finished build, and I decided to leave the links in
  place. `PROMPT-activity-8.md` in the repo root is still its brief. Do not delete it.
- **Nobody has yet run Activity 11's program end to end in Wokwi** — the simulator freezes
  when its tab is not the one on screen. See the Activity 11 block in `CONTEXT.md` §7 for
  what was and was not checked. If you have a Chrome window in front of you, it is a
  five-minute job and worth doing.

Ask me anything you need about the board or the class before you begin.
