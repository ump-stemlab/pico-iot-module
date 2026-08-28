/* board.js — the LilEx5 board explorer on the pin reference page.
   The page supplies window.BOARD_SPOTS: { key: [ ['c',cx,cy,r] | ['r',x,y,w,h], ... ] }
   in the coordinates of docs/img/lilex5-board.png (710 x 615).
   Table rows carry data-gp / data-hpin / data-row / data-spot / data-part / data-note.
   The 40-pin strip (svg.hdr) carries one <g class="hp"> per pin, with data-pin and
   either data-gp (it reaches the Pico) or data-title + data-note (power, ground, unused).
   Selecting anything selects all three views: table row, part on the photo, pin on both
   the photo's connector and the strip. */
(function () {
  "use strict";
  var NS = 'http://www.w3.org/2000/svg';
  var SPOTS = window.BOARD_SPOTS || {};
  var layer = document.querySelector('.boardlayer');
  var table = document.getElementById('pintable');
  if (!layer || !table) return;

  var hotG = document.getElementById('hotspots');
  var markG = document.getElementById('marker');
  var cap = document.getElementById('boardcap');
  var strip = document.querySelector('svg.hdr');
  var pads = strip ? [].slice.call(strip.querySelectorAll('.hp')) : [];
  var rows = [].slice.call(table.querySelectorAll('tbody tr'));

  /* where each header pad sits on the photo, in image coordinates.
     Pin 1 is the lower-left pad; odd pins run along the lower row. */
  var PAD = { x0: 102.5, dx: 26.526, yTop: 51.5, yBot: 77.5, r: 11 };
  function padCentre(pin) {
    var i = Math.floor((pin - 1) / 2);
    return { x: PAD.x0 + i * PAD.dx, y: (pin % 2) ? PAD.yBot : PAD.yTop };
  }

  function make(shape, cls) {
    var el;
    if (shape[0] === 'c') {
      el = document.createElementNS(NS, 'circle');
      el.setAttribute('cx', shape[1]);
      el.setAttribute('cy', shape[2]);
      el.setAttribute('r', shape[3]);
    } else {
      el = document.createElementNS(NS, 'rect');
      el.setAttribute('x', shape[1]);
      el.setAttribute('y', shape[2]);
      el.setAttribute('width', shape[3]);
      el.setAttribute('height', shape[4]);
      el.setAttribute('rx', 12);
    }
    el.setAttribute('class', cls);
    return el;
  }

  /* one clickable area per part, so the board can be tapped directly */
  var firstRowFor = {};
  rows.forEach(function (tr) {
    var k = tr.getAttribute('data-spot');
    if (k && !firstRowFor[k]) firstRowFor[k] = tr;
  });

  Object.keys(firstRowFor).forEach(function (key) {
    if (key === 'header') return;               // the connector is tapped pin by pin
    (SPOTS[key] || []).forEach(function (shape) {
      var el = make(shape, 'hot');
      el.addEventListener('click', function () { select(firstRowFor[key], true); });
      hotG.appendChild(el);
    });
  });

  /* and one clickable area per pin of the connector, on the photo */
  var padFor = {};
  pads.forEach(function (g) { padFor[g.getAttribute('data-pin')] = g; });
  Object.keys(padFor).forEach(function (pin) {
    var c = padCentre(+pin);
    var el = make(['c', c.x, c.y, 12], 'hot hotpad');
    el.addEventListener('click', function () { pickPad(padFor[pin], true); });
    hotG.appendChild(el);
  });

  function clearMarks() {
    while (markG.firstChild) markG.removeChild(markG.firstChild);
    rows.forEach(function (r) { r.classList.remove('sel'); });
    pads.forEach(function (g) { g.classList.remove('on'); });
  }

  function markPad(pin) {
    var c = padCentre(pin);
    markG.appendChild(make(['c', c.x, c.y, PAD.r], 'mkpad'));
    if (padFor[pin]) padFor[pin].classList.add('on');
  }

  function settle(el, fromBoard) {
    if (!fromBoard || !el) return;
    var box = el.getBoundingClientRect();
    if (box.top < 90 || box.bottom > window.innerHeight) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  /* selecting a table row: the part, its pin, and the row all light up */
  function select(tr, fromBoard) {
    if (!tr) return;
    clearMarks();
    tr.classList.add('sel');
    layer.classList.add('picked');
    if (strip) strip.classList.add('picked');

    var key = tr.getAttribute('data-spot');
    if (key && key !== 'header') {
      (SPOTS[key] || []).forEach(function (shape) { markG.appendChild(make(shape, 'mk')); });
    }

    var pin = tr.getAttribute('data-hpin');
    if (pin) markPad(+pin);

    var gp = tr.getAttribute('data-gp');
    var part = tr.getAttribute('data-part');
    var note = tr.getAttribute('data-note');
    var where = pin ? ('Header pin ' + pin + ', ' + tr.getAttribute('data-row') + ' row. ') : '';
    cap.innerHTML = '<b>GP' + gp + '</b> &rarr; ' + part
                  + '<span class="capnote">' + where + (note || '') + '</span>';

    settle(tr, fromBoard);
    if (pin && padFor[pin]) keepInView(padFor[pin]);
  }

  /* selecting a pin of the connector */
  function pickPad(g, fromBoard) {
    if (!g) return;
    var gp = g.getAttribute('data-gp');
    if (gp !== null) {
      var tr = rows.filter(function (r) { return r.getAttribute('data-gp') === gp; })[0];
      if (tr) { select(tr, true); return; }
    }
    clearMarks();
    layer.classList.add('picked');
    if (strip) strip.classList.add('picked');

    var kind = g.getAttribute('data-kind');
    var same = pads.filter(function (p) { return p.getAttribute('data-kind') === kind; });
    same.forEach(function (p) { markPad(+p.getAttribute('data-pin')); });

    var pin = g.getAttribute('data-pin');
    var extra = same.length > 1
      ? ' All ' + same.length + ' of them are ringed &mdash; any one will do.' : '';
    cap.innerHTML = '<b>Pin ' + pin + '</b> &rarr; ' + g.getAttribute('data-title')
                  + '<span class="capnote">' + g.getAttribute('data-note') + extra + '</span>';
    if (!fromBoard) keepInView(g);
  }

  /* the strip scrolls sideways on a phone — bring the chosen pin into view */
  function keepInView(g) {
    var box = g.closest('.hdrscroll');
    if (!box || box.scrollWidth <= box.clientWidth) return;
    var r = g.getBoundingClientRect(), b = box.getBoundingClientRect();
    if (r.left < b.left + 8 || r.right > b.right - 8) {
      box.scrollLeft += (r.left + r.width / 2) - (b.left + b.width / 2);
    }
  }

  rows.forEach(function (tr) {
    tr.addEventListener('click', function () { select(tr); });
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(tr); }
    });
  });

  pads.forEach(function (g) {
    g.addEventListener('click', function () { pickPad(g); });
    g.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pickPad(g); }
    });
  });

  /* the sideways-scroll hint only belongs there when it actually scrolls */
  var hint = document.querySelector('.hdrhint');
  var scroller = document.querySelector('.hdrscroll');
  function sizeHint() {
    if (!hint || !scroller) return;
    hint.hidden = scroller.scrollWidth <= scroller.clientWidth + 2;
  }
  sizeHint();
  window.addEventListener('resize', sizeHint);

  /* search box */
  var q = document.getElementById('q');
  var cnt = document.getElementById('cnt');
  if (q) {
    q.addEventListener('input', function () {
      var v = q.value.toLowerCase().trim();
      var n = 0;
      rows.forEach(function (r) {
        var hay = (r.getAttribute('data-s') + ' ' + r.textContent).toLowerCase();
        var hit = !v || hay.indexOf(v) !== -1;
        r.classList.toggle('hide', !hit);
        if (hit) n++;
      });
      cnt.textContent = v ? (n + ' of ' + rows.length + ' pins') : '';
    });
  }
})();
