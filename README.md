<div align="center">

# Pico IoT Module — LilEx5

### Interactive MicroPython tutorials for the LilEx5 Raspberry Pi Pico IoT board

**See · Think · Explore · Marvel** — UMPSA STEM LAB

### 👉 [**Open the tutorial website**](https://ump-stemlab.github.io/pico-iot-module/)

</div>

---

This repository holds the source for the module website. **The tutorials are meant to be
read on the website, not here** — the pages are interactive: a board simulator, a
type-the-code checker, progress tracking and a quiz.

| | |
|---|---|
| 🏠 **Home** | https://ump-stemlab.github.io/pico-iot-module/ |
| 💡 **Activity 1 — Light Up an LED** | https://ump-stemlab.github.io/pico-iot-module/activity-1.html |
| 🔁 **Activity 2 — Make an LED Blink** | https://ump-stemlab.github.io/pico-iot-module/activity-2.html |
| 🔘 **Activity 3 — Digital Input** | https://ump-stemlab.github.io/pico-iot-module/activity-3.html |
| 🔀 **Activity 4 — Making Decisions** | https://ump-stemlab.github.io/pico-iot-module/activity-4.html |
| 🔗 **Activity 5 — And, Or, Not** | https://ump-stemlab.github.io/pico-iot-module/activity-5.html |
| 🖥️ **Activity 6 — Words on a Screen** | https://ump-stemlab.github.io/pico-iot-module/activity-6.html |
| 📐 **Activity 7 — Sensors and Numbers** | https://ump-stemlab.github.io/pico-iot-module/activity-7.html |
| 📌 **LilEx5 pin reference** | https://ump-stemlab.github.io/pico-iot-module/pinout.html |

## What the module covers

Nine activities, from switching on one LED to sending data over the internet. Every
idea is introduced from scratch, and every activity works two ways: in the free
[Wokwi](https://wokwi.com) simulator (no hardware needed) or on the real LilEx5 board
with [Thonny](https://thonny.org).

| # | Activity | New idea | Status |
|---|---|---|---|
| 1 | [Light Up an LED](https://ump-stemlab.github.io/pico-iot-module/activity-1.html) | variables, comments, GPIO pins | ✅ live |
| 2 | [Make an LED Blink](https://ump-stemlab.github.io/pico-iot-module/activity-2.html) | loops, indentation, `sleep` | ✅ live |
| 3 | [Digital Input](https://ump-stemlab.github.io/pico-iot-module/activity-3.html) | reading buttons, `print()` | ✅ live |
| 4 | [Making Decisions](https://ump-stemlab.github.io/pico-iot-module/activity-4.html) | `if` / `else`, comparing with `==` | ✅ live |
| 5 | [And, Or, Not](https://ump-stemlab.github.io/pico-iot-module/activity-5.html) | `and` / `or` / `not`, joining two questions | ✅ live |
| 6 | [Words on a Screen](https://ump-stemlab.github.io/pico-iot-module/activity-6.html) | the OLED screen, the I²C bus, adding a library | ✅ live |
| 7 | [Sensors and Numbers](https://ump-stemlab.github.io/pico-iot-module/activity-7.html) | a sensor on the same bus, decimals, `round()` | ✅ live |
| 8 | Internet and Data | WiFi, MQTT, live dashboards | 🔜 |
| 9 | Radio Communication | board-to-board messaging | 🔜 |

## Pins used so far

| Part | Pin |
|---|---|
| SDA — I²C data | **GP0** |
| SCL — I²C clock | **GP1** |
| Button SW1 | **GP2** |
| Button SW2 | **GP3** |
| Button SW3 | **GP4** |
| LED1 red | **GP11** |
| LED2 yellow | **GP12** |
| LED3 green | **GP13** |
| Buzzer BZ1 | **GP14** |
| Slide switch SW4 | **GP15** |

Activity 6 adds **GP0 and GP1** — the first new pins since Activity 1, and the first
that are a **bus** rather than a part. Every I²C device on the board (the OLED screen and
all the sensors) shares those two, so they never need adding again, and nothing else may
be wired to them. Activity 6 also needs **GP2** and **GP3** for its exercise, and GP11 and
GP15 in going-further only. SW5 is the power switch and is not on a GP pin at all.

**Activity 7 adds no pins at all.** Its accelerometer joins GP0 and GP1 alongside the
screen — which is the whole point of having built a bus.

Full map: [pin reference](https://ump-stemlab.github.io/pico-iot-module/pinout.html).

## Repository layout

```
docs/
  index.html        module home
  activity-1.html   Activity 1 — Light Up an LED
  teacher-1.html    Activity 1 teacher notes (unlisted — see below)
  activity-2.html   Activity 2 — Make an LED Blink
  teacher-2.html    Activity 2 teacher notes (unlisted — see below)
  activity-3.html   Activity 3 — Digital Input
  teacher-3.html    Activity 3 teacher notes (unlisted — see below)
  activity-4.html   Activity 4 — Making Decisions
  teacher-4.html    Activity 4 teacher notes (unlisted — see below)
  activity-5.html   Activity 5 — And, Or, Not
  teacher-5.html    Activity 5 teacher notes (unlisted — see below)
  activity-6.html   Activity 6 — Words on a Screen
  teacher-6.html    Activity 6 teacher notes (unlisted — see below)
  activity-7.html   Activity 7 — Sensors and Numbers
  teacher-7.html    Activity 7 teacher notes (unlisted — see below)
  teacher.html      index of every teacher notes page (unlisted — see below)
  pinout.html       LilEx5 pin reference, searchable
  style.css         shared stylesheet
  code.js           renders code blocks as pictures (non-copyable)
  activity.js       progress, tabs, board simulator, blink simulator, button reader,
                    decision simulator, logic simulator, screen widget, typing box, quiz
  board.js          the board explorer on pinout.html
  robots.txt        keeps teacher pages out of search engines
  img/              LilEx5 board photos
CONTEXT.md          how this site is built — read before changing it
PROMPT-activity-8.md  hand this to a fresh chat to build the next activity
```

GitHub Pages serves the site from the `docs/` folder on `main`. Edit a file, commit,
and the live site updates in about a minute.

## Teacher notes

Each activity has a separate teacher page (`teacher-N.html`), and `teacher.html` is an
index linking all of them. None of them is **linked** from any student page, and all
carry `noindex`, so students will not find them by browsing or by searching. It is not a secret, though — this repository is public, so the file is
visible in the file list above and anyone given the URL can read it. Share the link
with staff, not in the student handout.

## Related

[`ump-stemlab/stemcube`](https://github.com/ump-stemlab/stemcube) — the MicroPython sensor
libraries the later activities use. Activity 6 needs `ssd1306.py`; Activity 7 needs
`imu.py` and `vector3d.py` — the first depends on the second, so both have to go on
the Pico.

---

<div align="center"><strong>See · Think · Explore · Marvel</strong></div>
