/**
 * ============================================================================
 * LilEx5 dashboard — history endpoint
 * UMPSA STEM LAB · See · Think · Explore · Marvel
 * ============================================================================
 *
 * This ADDS to the Apps Script you already have. It does not replace it, and
 * it does not touch the code that writes readings into the sheet.
 *
 * ----------------------------------------------------------------------------
 * HOW TO INSTALL
 * ----------------------------------------------------------------------------
 *
 *  1. Open your Apps Script project (Extensions > Apps Script from the sheet).
 *
 *  2. Paste everything in this file at the BOTTOM of your existing Code.gs,
 *     below whatever is already there.
 *
 *  3. Find your existing  function doGet(e)  and make its FIRST line this:
 *
 *         if (e && e.parameter && e.parameter.action === "history") {
 *           return getHistory(e);
 *         }
 *
 *     Everything already in doGet stays exactly as it is — action=read keeps
 *     working the way it does now.
 *
 *  4. Deploy > Manage deployments > edit the live deployment > Version: New
 *     version > Deploy. The /exec address does not change, so the dashboard
 *     needs no edit.
 *
 *  5. Test it in a browser tab:
 *
 *         <your /exec address>?action=history&limit=5
 *
 *     You should get JSON with a "rows" array, oldest row first.
 *
 * ----------------------------------------------------------------------------
 * WHAT IT RETURNS
 * ----------------------------------------------------------------------------
 *
 *   { "success": true,
 *     "count": 200,          // rows in this reply
 *     "total": 4173,         // rows of data in the sheet altogether
 *     "rows": [ { "timestamp": 1756449600000, "temperature": 28.4, ... }, ... ] }
 *
 * The keys come from the header row of the sheet, so they line up with the
 * names the dashboard already uses. ?callback=name wraps it as JSONP, which
 * is how the dashboard reads it from a file:// page.
 */


// ============================================================================
// SETTINGS
// ============================================================================

// "" uses the first sheet in the spreadsheet. Put the tab's name here if the
// readings live on a different tab, e.g. "Readings".
var HISTORY_SHEET_NAME = "";

// Used when the dashboard asks for history without saying how much.
var DEFAULT_HISTORY_LIMIT = 200;

// A ceiling, so one request can never try to return a whole year at once.
var MAX_HISTORY_LIMIT = 20000;


// ============================================================================
// THE HISTORY ENDPOINT
// ============================================================================

function getHistory(e) {

  var params = (e && e.parameter) || {};
  var payload;

  try {

    var sheet = historySheet_();

    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();

    if (lastRow < 2 || lastColumn < 1) {

      // A header row and nothing else, or a completely empty sheet.
      payload = { success: true, count: 0, total: 0, rows: [] };

    } else {

      var headers = sheet
        .getRange(1, 1, 1, lastColumn)
        .getValues()[0]
        .map(canonicalKey_);

      var totalRows = lastRow - 1;
      var wanted = historyLimit_(params.limit);
      var take = (wanted === 0) ? totalRows : Math.min(wanted, totalRows);
      var startRow = lastRow - take + 1;

      var values = sheet.getRange(startRow, 1, take, lastColumn).getValues();
      var rows = [];

      for (var r = 0; r < values.length; r++) {

        var row = {};
        var hasValue = false;

        for (var c = 0; c < headers.length; c++) {

          var key = headers[c];
          if (!key) continue;

          var value = values[r][c];

          if (key === "timestamp") {
            row[key] = toMillis_(value);
          } else if (value === "" || value === null) {
            row[key] = "";
          } else {
            row[key] = value;
            hasValue = true;
          }
        }

        // Skip a blank row left behind in the middle of the sheet.
        if (hasValue) rows.push(row);
      }

      payload = {
        success: true,
        count: rows.length,
        total: totalRows,
        rows: rows
      };
    }

  } catch (err) {

    payload = {
      success: false,
      error: String((err && err.message) || err)
    };
  }

  return historyReply_(payload, params.callback);
}


// ============================================================================
// THE SHEET THE READINGS ARE ON
// ============================================================================

function historySheet_() {

  var book = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = HISTORY_SHEET_NAME
    ? book.getSheetByName(HISTORY_SHEET_NAME)
    : book.getSheets()[0];

  if (!sheet) {
    throw new Error('No sheet named "' + HISTORY_SHEET_NAME + '"');
  }

  return sheet;
}


// ============================================================================
// HOW MANY ROWS WERE ASKED FOR
// 0 and "all" both mean the whole sheet.
// ============================================================================

function historyLimit_(raw) {

  if (raw === undefined || raw === null || raw === "") {
    return DEFAULT_HISTORY_LIMIT;
  }

  var text = String(raw).toLowerCase();

  if (text === "all" || text === "0") {
    return 0;
  }

  var number = parseInt(text, 10);

  if (!(number > 0)) {
    return DEFAULT_HISTORY_LIMIT;
  }

  return Math.min(number, MAX_HISTORY_LIMIT);
}


// ============================================================================
// HEADER TEXT -> THE KEY THE DASHBOARD USES
//
// "Temp (C)" and "temperature" both become "temperature", so the sheet's
// headers do not have to be typed exactly the way the dashboard spells them.
// Anything not on this list keeps its own header text as the key.
// ============================================================================

var HISTORY_KEYS = {
  timestamp: "timestamp",  time: "timestamp",    datetime: "timestamp",
  date: "timestamp",       millis: "timestamp",

  temperature: "temperature", temp: "temperature", tempc: "temperature",
  humidity: "humidity",       hum: "humidity",     rh: "humidity",
  pressure: "pressure",       press: "pressure",   hpa: "pressure",
  tvoc: "tvoc",               voc: "tvoc",
  proximity: "proximity",     prox: "proximity",

  accelx: "accelX", accely: "accelY", accelz: "accelZ",
  ax: "accelX",     ay: "accelY",     az: "accelZ",

  gyrox: "gyroX", gyroy: "gyroY", gyroz: "gyroZ",
  gx: "gyroX",    gy: "gyroY",    gz: "gyroZ",

  magx: "magX", magy: "magY", magz: "magZ",
  mx: "magX",   my: "magY",   mz: "magZ",

  heading: "heading", compass: "heading", bearing: "heading",

  ch0: "ch0", ch1: "ch1", ch2: "ch2", ch3: "ch3",
  channel0: "ch0", channel1: "ch1", channel2: "ch2", channel3: "ch3",
  a0: "ch0", a1: "ch1", a2: "ch2", a3: "ch3"
};


function canonicalKey_(header) {

  if (header === null || header === undefined) return "";

  var raw = String(header).trim();
  if (!raw) return "";

  var flat = raw.toLowerCase().replace(/[^a-z0-9]/g, "");

  return HISTORY_KEYS[flat] || raw;
}


// ============================================================================
// A TIMESTAMP, WHATEVER SHAPE IT ARRIVED IN, AS MILLISECONDS
// ============================================================================

function toMillis_(value) {

  if (value === "" || value === null || value === undefined) return "";

  if (value instanceof Date) return value.getTime();

  var number = Number(value);

  if (isFinite(number) && number > 0) {
    if (number > 1e11) return number;        // already milliseconds
    if (number > 1e8) return number * 1000;  // seconds
  }

  var parsed = new Date(value).getTime();

  return isNaN(parsed) ? "" : parsed;
}


// ============================================================================
// REPLY — plain JSON, or JSONP when a callback name was asked for
// ============================================================================

function historyReply_(payload, callback) {

  var json = JSON.stringify(payload);

  // Only ever echo a callback name that looks like a function name.
  if (callback && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(callback)) {

    return ContentService
      .createTextOutput(callback + "(" + json + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}
