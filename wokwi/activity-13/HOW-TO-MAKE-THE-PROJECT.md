# Activity 13 in Wokwi — how to build the starter project

UMPSA STEM LAB · See · Think · Explore · Marvel

This folder holds the two files that turn Activity 10's Wokwi project into
Activity 13's. **Kamil makes the project**; these are the files to paste in.
Fifteen minutes, once.

---

## Why a fork and not a new project

Activity 13's Wokwi route needs a **Pico W** (WiFi) and a **weather sensor**.
Wokwi has no BME280 of its own — the STEM Lab's **custom chip** supplies it, and
that chip is already sitting inside Activity 10's project along with
`bme280.py`, an SSD1306 and the wiring on GP0/GP1. Forking it means none of
that has to be rebuilt, and the sensor a student meets is the same one they met
in Activity 10.

**Activity 10's project:** https://wokwi.com/projects/473934007182443521

---

## The steps

1. Open the Activity 10 project and press **Save a copy** (you need to be
   signed in to Wokwi). Rename it **`LilEx5 Activity 13 — Your Own Live
   Dashboard`**.

2. **Delete `umqtt_simple.py`** from the file tabs. Activity 13 does not use
   MQTT at all, and leaving it there invites the wrong question.

3. **Add a new file called `urequests.py`** and paste in the whole of
   `urequests.py` from this folder.

4. **Replace `main.py`** with `main.py` from this folder.

5. Leave `diagram.json` and `bme280.py` exactly as they are. The OLED can stay
   wired up — Activity 13 does not drive it, and a spare part on the canvas
   costs nothing.

6. **Put your own `/exec` address into `APPS_SCRIPT_URL`, press play, and watch
   the Shell.** See *Checks before a class uses this* below — do not hand the
   link out until it has actually run.

7. Put the new project's URL into **two** places:
   - `docs/activity-13.html` — the Wokwi tab in *Part 2* and in *Part 3*, and
     the Route A row of the route table. Search the file for
     `WOKWI-PROJECT-URL` and replace all of them.
   - `claude/corrected-activity-links.md` in the project notes — add a row.

---

## Checks before a class uses this

**None of this has been run.** The container these files were written in cannot
reach wokwi.com, so the program has been read and syntax-checked but never
executed. Activity 11's Wokwi route carried the same caveat and it is written
down in `CONTEXT.md` for the same reason. Work through this list once, in a
Chrome window left in front (Wokwi's simulator freezes the moment its tab is
not the visible one):

- [ ] The board in `diagram.json` is `board-pi-pico-w`, not the plain Pico.
      Without the W there is no WiFi and the first import fails.
- [ ] The Shell prints an **IP address** within about twenty seconds.
- [ ] The Shell then prints `Sent 3 readings - 200 OK` every five seconds.
      **A `302` is also a success** — see the note below — but `200` is what you
      should get, because `urequests.py` follows the redirect.
- [ ] A row appears in the Google Sheet for every one of those lines, and the
      header row says `temperature`, `pressure`, `humidity`.
- [ ] Click the green sensor block **while the simulation is running** and move
      the temperature slider. The number in the sheet follows it. (The sliders
      are as undiscoverable here as they were in Activity 10.)
- [ ] The dashboard file, pointed at the same `/exec` address, shows those
      three cards filling and leaves the other nine empty.

### If it does not work

**`Sent 3 readings - 302 Moved Temporarily`** — fine. Apps Script runs
`doPost` first and *then* redirects to a page holding the result. The row is
already written. `urequests.py` follows the redirect so you should see `200`,
but if memory is tight the redirect may fail while the row still lands.

**`MemoryError` or a failure on the second or third send** — a TLS handshake to
Google needs a few tens of kilobytes and a Pico W does not have much. The
`gc.collect()` before the request is there for this. If it still happens, try
`allow_redirects=False`:

```python
reply = urequests.post(APPS_SCRIPT_URL, json=readings, allow_redirects=False)
```

That skips the second handshake entirely and reports `302`, which is a success.

**`OSError: -202` or `ECONNABORTED`** — a name could not be looked up or the
connection dropped. Almost always the `/exec` address has a typo, a trailing
space, or a line break in it.

**`ImportError: no module named 'ssl'`** — the plain Pico is selected instead of
the Pico W, or the firmware is very old. Wokwi's Pico W runs
`micropython-20260406-v1.28.0`, which has `ssl`.

**Nothing at all, and no error** — check the Apps Script deployment is *Execute
as: Me* and *Who has access: Anyone*, and that you have opened the `/exec`
address once in your own browser to clear Google's "unverified app" warning.

---

## What the Wokwi route does and does not cover

| | Real LilEx5 | Wokwi |
|---|---|---|
| Deploy the Apps Script (Part 1) | yes | **yes, identical** |
| The four settings (Part 2) | in `config.py` | at the top of `main.py` |
| Run it and watch the Shell (Part 3) | yes | **yes** |
| The dashboard and history (Parts 4–5) | yes | **yes, identical** |
| How many readings | twelve | three |
| The OLED still working | yes | not used |

The three readings are the point of difference and it is worth saying out loud
in class rather than hiding: **the names in the message decide the columns in
the sheet**, so a Wokwi student's sheet has three columns and a board student's
has twelve. Same system, different message. That is the Activity 13 idea,
demonstrated for free.

---

## The one thing to check against the real file pack

`main.py` posts a **flat JSON object of name → value**:

```
{"temperature": 21.64, "pressure": 1010.39, "humidity": 55.04}
```

That is what `apps-script-history.gs` in the repo root implies the sheet holds —
it maps header names like `temperature`, `accelX` and `ch0` straight onto
columns. **But `LilEx5_AppsScript.js` itself is in the teacher file pack and is
not in this repository**, so the shape above is inferred, not read. If the real
`doPost` expects something else (a wrapper object, a `values` array, an API key
field), `main.py` needs one line changing to match — and it would be worth
putting a copy of `LilEx5_AppsScript.js` into the repo root next to
`apps-script-history.gs` so this never has to be guessed again.
