# ===========================================================================
# Activity 13 -- Your Own Live Dashboard, in the Wokwi simulator
# UMPSA STEM LAB  *  See . Think . Explore . Marvel
#
# Reads the weather sensor, labels every reading with its name, and posts the
# lot to the web address you deployed in Part 1. It is the same journey the
# real LilEx5 makes -- with three readings instead of twelve.
# ===========================================================================


# ---------------------------------------------------------------------------
# THE FOUR SETTINGS.  These are the only lines you change.
#
# On the real board these four live in config.py. In Wokwi there is no
# config.py, so they sit here at the top instead. Same four settings, same
# four jobs.
# ---------------------------------------------------------------------------

WIFI_SSID          = "Wokwi-GUEST"   # Wokwi's own network. Leave this alone.
WIFI_PASS          = ""              # It has no password. Leave this too.

APPS_SCRIPT_URL    = "PASTE YOUR /exec ADDRESS BETWEEN THESE QUOTES"

REPORT_INTERVAL_MS = 5000            # send a reading every 5 seconds


# ---------------------------------------------------------------------------

import gc
import time
from machine import I2C, Pin
from network import WLAN, STA_IF

import bme280         # already in the project -- the weather sensor's driver
import urequests      # already in the project -- how a program visits a URL


# ---- the sensor, on the same two wires as Activities 7, 8 and 10 ----------

i2c = I2C(0, sda=Pin(0), scl=Pin(1))
sensor = bme280.BME280(i2c=i2c)


# ---- join the network, and wait until it has actually happened -----------

wlan = WLAN(STA_IF)
wlan.active(True)
wlan.connect(WIFI_SSID, WIFI_PASS)

print("[WiFi] Connecting to '" + WIFI_SSID + "'...")

while not wlan.isconnected():
    time.sleep(0.5)

print("[WiFi] Connected - IP:", wlan.ifconfig()[0])


# ---- round and round: read, label, send ----------------------------------

while True:

    temperature, pressure, humidity = sensor.values

    readings = {
        "temperature": float(temperature[:-1]),   # "21.64C"     -> 21.64
        "pressure":    float(pressure[:-3]),      # "1010.39hPa" -> 1010.39
        "humidity":    float(humidity[:-1]),      # "55.04%"     -> 55.04
    }

    gc.collect()          # tidy up before asking for memory to talk securely

    try:
        reply = urequests.post(APPS_SCRIPT_URL, json=readings)
        print("[LilEx5] Sent 3 readings -", reply.status_code, reply.reason)
        reply.close()
    except Exception as problem:
        print("[LilEx5] Send failed:", problem)

    time.sleep(REPORT_INTERVAL_MS / 1000)
