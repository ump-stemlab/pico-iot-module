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
| 📌 **LilEx5 pin reference** | https://ump-stemlab.github.io/pico-iot-module/pinout.html |

## What the module covers

Nine activities, from switching on one LED to sending data over the internet. Every
idea is introduced from scratch, and every activity works two ways: in the free
[Wokwi](https://wokwi.com) simulator (no hardware needed) or on the real LilEx5 board
with [Thonny](https://thonny.org).

| # | Activity | New idea | Status |
|---|---|---|---|
| 1 | [Light Up an LED](https://ump-stemlab.github.io/pico-iot-module/activity-1.html) | variables, comments, GPIO pins | ✅ live |
| 2 | Make an LED Blink | loops, indentation, `sleep` | 🔜 |
| 3 | Digital Input | reading buttons, `print()` | 🔜 |
| 4 | Making Decisions | `if` / `else` | 🔜 |
| 5 | And, Or, Not | boolean logic | 🔜 |
| 6 | Words on a Screen | OLED screen, adding a library | 🔜 |
| 7 | Sensors and Numbers | motion sensor, decimals, `round()` | 🔜 |
| 8 | Internet and Data | WiFi, MQTT, live dashboards | 🔜 |
| 9 | Radio Communication | board-to-board messaging | 🔜 |

## Pins used so far

| Part | Pin |
|---|---|
| LED1 red | **GP11** |
| LED2 yellow | **GP12** |
| LED3 green | **GP13** |
| Buzzer BZ1 | **GP14** |

Full map: [pin reference](https://ump-stemlab.github.io/pico-iot-module/pinout.html).

## Repository layout

```
docs/
  index.html        module home
  activity-1.html   Activity 1 — Light Up an LED
  teacher-1.html    Activity 1 teacher notes (unlisted — see below)
  pinout.html       LilEx5 pin reference, searchable
  style.css         shared stylesheet
  code.js           renders code blocks as pictures (non-copyable)
  activity.js       progress, tabs, board simulator, typing box, quiz
CONTEXT.md          how this site is built — read before changing it
PROMPT-activity-2.md  hand this to a fresh chat to build the next activity
```

GitHub Pages serves the site from the `docs/` folder on `main`. Edit a file, commit,
and the live site updates in about a minute.

## Teacher notes

Each activity has a separate teacher page (`teacher-N.html`). It is **not linked** from
any student page and carries `noindex`, so students will not find it by browsing or by
searching. It is not a secret, though — this repository is public, so the file is
visible in the file list above and anyone given the URL can read it. Share the link
with staff, not in the student handout.

## Related

[`ump-stemlab/stemcube`](https://github.com/ump-stemlab/stemcube) — the MicroPython sensor
libraries (BME280, IMU/MPU6050, GPS, ADC, SSD1306) the later activities use.

---

<div align="center"><strong>See · Think · Explore · Marvel</strong></div>
