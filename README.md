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
| 🔘 **Activity 4 — Digital Input** | https://ump-stemlab.github.io/pico-iot-module/activity-4.html |
| 🔀 **Activity 5 — Making Decisions** | https://ump-stemlab.github.io/pico-iot-module/activity-5.html |
| 🔗 **Activity 6 — And, Or, Not** | https://ump-stemlab.github.io/pico-iot-module/activity-6.html |
| 🖥️ **Activity 7 — Words on a Screen** | https://ump-stemlab.github.io/pico-iot-module/activity-7.html |
| 📐 **Activity 8 — Sensors and Numbers** | https://ump-stemlab.github.io/pico-iot-module/activity-8.html |
| 📡 **Activity 10 — Internet and Data** | https://ump-stemlab.github.io/pico-iot-module/activity-10.html |
| 🎛️ **Activity 11 — Control from Anywhere** | https://ump-stemlab.github.io/pico-iot-module/activity-11.html |
| 📌 **LilEx5 pin reference** | https://ump-stemlab.github.io/pico-iot-module/pinout.html |

## What the module covers

Thirteen activities, numbered 0 to 12, from switching on one LED to controlling a board
from the other side of the world. Every
idea is introduced from scratch, and every activity works two ways: in the free
[Wokwi](https://wokwi.com) simulator (no hardware needed) or on the real LilEx5 board
with [Thonny](https://thonny.org).

The numbers match the **`2026 Agrovator Raspberry Pi IOT` Google Classroom**, which is the
authority on numbering.

| # | Activity | New idea | Status |
|---|---|---|---|
| 0 | Getting Started | the board, the simulator, and the program that talks to it | 🔜 |
| 1 | [Light Up an LED](https://ump-stemlab.github.io/pico-iot-module/activity-1.html) | variables, comments, GPIO pins | ✅ live |
| 2 | [Make an LED Blink](https://ump-stemlab.github.io/pico-iot-module/activity-2.html) | loops, indentation, `sleep` | ✅ live |
| 3 | Digital Output / Servo | pulses, and telling a motor exactly where to point | 🔜 |
| 4 | [Digital Input](https://ump-stemlab.github.io/pico-iot-module/activity-4.html) | reading buttons, `print()` | ✅ live |
| 5 | [Making Decisions](https://ump-stemlab.github.io/pico-iot-module/activity-5.html) | `if` / `else`, comparing with `==` | ✅ live |
| 6 | [And, Or, Not](https://ump-stemlab.github.io/pico-iot-module/activity-6.html) | `and` / `or` / `not`, joining two questions | ✅ live |
| 7 | [Words on a Screen](https://ump-stemlab.github.io/pico-iot-module/activity-7.html) | the OLED screen, the I²C bus, adding a library | ✅ live |
| 8 | [Sensors and Numbers](https://ump-stemlab.github.io/pico-iot-module/activity-8.html) | a sensor on the same bus, decimals, `round()` | ✅ live |
| 9 | Soil Moisture | an analogue pin, choosing your own numbers, and calibration | 🔜 |
| 10 | [Internet and Data](https://ump-stemlab.github.io/pico-iot-module/activity-10.html) | joining WiFi, MQTT, a live graph on the internet | ✅ live |
| 11 | [Control from Anywhere](https://ump-stemlab.github.io/pico-iot-module/activity-11.html) | subscribing, `def`, callbacks, a switch on the web | ✅ live |
| 12 | Sending Messages by Radio | board to board, with no internet at all | 🔜 |

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

Activity 7 adds **GP0 and GP1** — the first new pins since Activity 1, and the first
that are a **bus** rather than a part. Every I²C device on the board (the OLED screen and
all the sensors) shares those two, so they never need adding again, and nothing else may
be wired to them. Activity 7 also needs **GP2** and **GP3** for its exercise, and GP11 and
GP15 in going-further only. SW5 is the power switch and is not on a GP pin at all.

**Activities 8, 10 and 11 add no pins at all.** Activity 8's accelerometer and Activity
10's weather sensor both join GP0 and GP1 alongside the screen — which is the whole point
of having built a bus. Activity 11 reuses the red LED1 on **GP11** and, for its exercise,
the green LED3 on **GP13**. Activities 10 and 11 need the Pico **W**: its WiFi radio is
inside the chip, not on a pin.

Full map: [pin reference](https://ump-stemlab.github.io/pico-iot-module/pinout.html).

## Repository layout

```
docs/
  index.html        module home
  activity-1.html   Activity 1 — Light Up an LED
  teacher-1.html    Activity 1 teacher notes (unlisted — see below)
  activity-2.html   Activity 2 — Make an LED Blink
  teacher-2.html    Activity 2 teacher notes (unlisted — see below)
  activity-3.html   redirect — the old Activity 3 is now Activity 4
  teacher-3.html    redirect — the old Activity 3 notes are now Activity 4's
  activity-4.html   Activity 4 — Digital Input
  teacher-4.html    Activity 4 teacher notes (unlisted — see below)
  activity-5.html   Activity 5 — Making Decisions
  teacher-5.html    Activity 5 teacher notes (unlisted — see below)
  activity-6.html   Activity 6 — And, Or, Not
  teacher-6.html    Activity 6 teacher notes (unlisted — see below)
  activity-7.html   Activity 7 — Words on a Screen
  teacher-7.html    Activity 7 teacher notes (unlisted — see below)
  activity-8.html   Activity 8 — Sensors and Numbers
  teacher-8.html    Activity 8 teacher notes (unlisted — see below)
  activity-10.html  Activity 10 — Internet and Data
  teacher-10.html   Activity 10 teacher notes (unlisted — see below)
  activity-11.html  Activity 11 — Control from Anywhere
  teacher-11.html   Activity 11 teacher notes (unlisted — see below)
  teacher.html      index of every teacher notes page (unlisted — see below)
  pinout.html       LilEx5 pin reference, searchable
  style.css         shared stylesheet
  code.js           renders code blocks as pictures (non-copyable)
  activity.js       progress, tabs, board simulator, blink simulator, button reader,
                    decision simulator, logic simulator, screen widget, reading widget,
                    dashboard switch widget, typing box, quiz
  board.js          the board explorer on pinout.html
  robots.txt        keeps teacher pages out of search engines
  img/              LilEx5 board photos
CONTEXT.md          how this site is built — read before changing it
PROMPT-activity-9.md  hand this to a fresh chat to build the next activity
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
libraries the later activities use. Activity 7 needs `ssd1306.py`; Activity 8 needs
`imu.py` and `vector3d.py` — the first depends on the second, so both have to go on
the Pico. Activity 10 needs `bme280.py`, plus `umqtt.simple`, which Thonny installs by
name from the MicroPython package index. Activity 11 needs `umqtt.simple` too — as a flat
`umqtt_simple.py` project file on the Wokwi route, because Wokwi has no folders.

---

<div align="center"><strong>See · Think · Explore · Marvel</strong></div>
