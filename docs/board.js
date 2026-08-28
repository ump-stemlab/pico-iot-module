/* board.js — the LilEx5 board explorer on the pin reference page.
   The page supplies window.BOARD_SPOTS: { key: [ ['c',cx,cy,r] | ['r',x,y,w,h], ... ] }
   in the coordinates of docs/img/lilex5-board.png (710 x 615).
   Table rows carry data-gp / data-spot / data-part / data-note. */
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
  var rows = [].slice.call(table.querySelectorAll('tbody tr'));

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
    if (key === 'header') return;               // the connector is not a part to tap
    (SPOTS[key] || []).forEach(function (shape) {
      var el = make(shape, 'hot');
      el.addEventListener('click', function () { select(firstRowFor[key], true); });
      hotG.appendChild(el);
    });
  });

  function select(tr, fromBoard) {
    if (!tr) return;
    rows.forEach(function (r) { r.classList.remove('sel'); });
    tr.classList.add('sel');

    while (markG.firstChild) markG.removeChild(markG.firstChild);
    var key = tr.getAttribute('data-spot');
    (SPOTS[key] || []).forEach(function (shape) { markG.appendChild(make(shape, 'mk')); });

    var gp = tr.getAttribute('data-gp');
    var part = tr.getAttribute('data-part');
    var note = tr.getAttribute('data-note');
    cap.innerHTML = '<b>GP' + gp + '</b> &rarr; ' + part
                  + (note ? ' <span class="capnote">' + note + '</span>' : '');

    if (fromBoard) {
      var box = tr.getBoundingClientRect();
      if (box.top < 90 || box.bottom > window.innerHeight) {
        tr.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }

  rows.forEach(function (tr) {
    tr.addEventListener('click', function () { select(tr); });
    tr.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(tr); }
    });
  });

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
