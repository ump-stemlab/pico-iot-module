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

## ⚠️ Pin numbers differ from the older Pico module

On the LilEx5 the red LED is **GP11**, not GP14 — and **GP14 is the buzzer**. Old
worksheets will make the board beep instead of lighting up.

| | Old module | LilEx5 |
|---|---|---|
| Red LED1 | 14 | **11** |
| Yellow LED2 | 13 | **12** |
| Green LED3 | 12 | **13** |
| Buzzer BZ1 | — | **14** |

Full map: [pin reference](https://ump-stemlab.github.io/pico-iot-module/pinout.html).

## Repository layout

```
docs/
  index.html       module home
  activity-1.html  Activity 1 — Light Up an LED (+ teacher section)
  pinout.html      LilEx5 pin reference, searchable
  style.css        shared stylesheet
```

GitHub Pages serves the site from the `docs/` folder on `main`. Edit a file, commit,
and the live site updates in about a minute.

## Related

[`ump-stemlab/stemcube`](https://github.com/ump-stemlab/stemcube) — the MicroPython sensor
libraries (BME280, IMU/MPU6050, GPS, ADC, SSD1306) the later activities use.

---

<div align="center"><strong>See · Think · Explore · Marvel</strong></div>
