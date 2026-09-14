/* robot.js — the module-wide progression system.

   Every activity fits one part to Pip. A part is earned by clearing all of
   that activity's checkpoints: a few questions, a few ticks, the typing box
   and the quiz. Until then the part materialises faintly over the ghost, so a
   single tick anywhere still visibly moves something.

   This file owns the whole progress model. activity.js records gates through
   LILEX.setGate(); everything that draws progress — the robot in the rail, the
   sticky bar, the landing page — reads it back through LILEX.read().

   Storage is one localStorage entry per page, unchanged in key from before:

     lilex5v2:activity-4.html  ->  { g:{build:1,run:0,...}, gt:7, q:{0:1}, route:'a' }

     g   gate id -> 1 when cleared
     gt  how many gates the page has, so other pages can show "3 of 7"
     q   quiz question index -> 1 when answered right
     route  which route tab the student picked (written by activity.js)

   Everything degrades: no localStorage, no rail, a browser that throws on
   JSON — the page still works and the robot simply shows nothing earned. */
(function(){
"use strict";

/* ---------- the fourteen parts ----------
   Cut out of pip-master.png by tools/parts.py, which is the only place the
   geometry lives. x/y/w/h are that part's bounding box as a percentage of the
   master, straight out of docs/img/parts/parts.json.

   This table is a COPY of parts.json, on purpose: the site is opened from
   file:// as often as from GitHub Pages — tools/check.js drives it that way —
   and fetch() of a local JSON file is blocked there, so a fetched table would
   leave Pip in pieces exactly where he is hardest to debug. tools/check.js
   diffs this table against parts.json on every run, so the two cannot drift.
   Re-run tools/parts.py, then paste its parts.json in here. */
var PARTS = [
  {n:0,  key:'legs',        label:'Legs and boots',  verb:'bolted on',          x:25.952,  y:82.944,  w:48.095,  h:17.056},
  {n:1,  key:'chestlamp',   label:'Chest lamp',      verb:'lit',                x:44.524,  y:59.785,  w:11.19,   h:4.488},
  {n:2,  key:'shell',       label:'Body shell',      verb:'clicked together',   x:28.571,  y:56.732,  w:42.857,  h:31.777},
  {n:3,  key:'servoarm',    label:'Servo arm',       verb:'bolted on',          x:0.0,     y:56.732,  w:35.476,  h:20.287},
  {n:4,  key:'buttonarm',   label:'Button arm',      verb:'fitted',             x:64.524,  y:56.732,  w:35.476,  h:20.287},
  {n:5,  key:'head',        label:'Head dome',       verb:'seated',             x:11.905,  y:5.745,   w:76.19,   h:50.987},
  {n:6,  key:'smile',       label:'Smile',           verb:'switched on',        x:41.429,  y:40.215,  w:16.429,  h:9.515},
  {n:7,  key:'eyes',        label:'Eyes',            verb:'lit up',             x:20.238,  y:21.005,  w:59.286,  h:23.878},
  {n:8,  key:'earL',        label:'Left ear pod',    verb:'clipped on',         x:6.667,   y:26.391,  w:18.571,  h:18.851},
  {n:9,  key:'earR',        label:'Right ear pod',   verb:'clipped on',         x:75.0,    y:26.391,  w:18.333,  h:19.21},
  {n:10, key:'aerialL',     label:'Left aerial',     verb:'raised',             x:15.238,  y:5.566,   w:10.0,    h:10.592},
  {n:11, key:'aerialR',     label:'Right aerial',    verb:'raised',             x:74.762,  y:5.745,   w:10.0,    h:10.413},
  {n:12, key:'radiotip',    label:'Radio tip',       verb:'tuned in',           x:9.048,   y:0.0,     w:9.286,   h:7.002},
  {n:13, key:'databeacon',  label:'Data beacon',     verb:'powered up',         x:81.667,  y:0.0,     w:9.286,   h:7.002}
];

/* The phase accent each activity wears, unchanged from the colour-fill days. */
var ACCENT = ['teal','teal','teal','orange','orange','orange','orange',
              'leaf','leaf','leaf','blue','blue','red','red'];

/* What the rest of the site asks for: .part and .verb by activity number. */
var ACTS = PARTS.map(function(p){
  return { n: p.n, key: p.key, part: p.label, verb: p.verb, accent: ACCENT[p.n] };
});

/* ---------- progress ---------- */
function key(n){ return 'lilex5v2:activity-' + n + '.html'; }

function raw(n){
  try { return JSON.parse(localStorage.getItem(key(n))) || {}; }
  catch(e){ return {}; }
}

/* {done, total, complete, started} for one activity. */
function read(n){
  var o = raw(n), g = o.g || {}, done = 0, k;
  for(k in g){ if(g[k]) done++; }
  var total = o.gt || 0;
  return { done: done, total: total,
           complete: total > 0 && done >= total,
           started: done > 0 };
}

function write(n, o){
  try { localStorage.setItem(key(n), JSON.stringify(o)); } catch(e){}
}

/* How many parts are on the robot, out of fourteen. */
function tally(){
  var built = 0, started = 0;
  ACTS.forEach(function(a){
    var s = read(a.n);
    if(s.complete) built++;
    else if(s.started) started++;
  });
  return { built: built, started: started, total: ACTS.length };
}

/* The activity this page is about, or null on the landing and teacher pages. */
function pageAct(){
  var m = /activity-(\d+)\.html$/.exec(location.pathname);
  return m ? parseInt(m[1], 10) : null;
}

/* ---------- drawing ----------
   Pip is a picture, not a drawing this file makes: the mascot from Kamil's
   ESP32 decks, in docs/img/. He is built part by part, one part per activity,
   like a model kit:

     nothing cleared   pip-off.png on its own — solid, eyes dark, asleep
     part way          pip-master.png washed out to a ghost, with each earned
                       part laid over it from its own box in PARTS
     14 of 14          pip-glowing.png — arms out, every light on

   All three poses are 420x557 so swapping between them never moves the page;
   tools/padpose.py pads a new pose onto that canvas. The parts tile the master
   exactly (tools/parts.py asserts it), so a finished ghost and the master are
   the same picture.

   This replaced a vertical colour-fill, which coloured him in from the boots
   up regardless of which activities were done. */
var IMG = 'img/pip-master.png';
var IMG_DONE = 'img/pip-glowing.png';   /* he lights up once all fourteen are in */
var IMG_OFF = 'img/pip-off.png';        /* eyes dark: nothing cleared yet */
var PARTDIR = 'img/parts/';

/* named pose()/poseAlt(), not art()/alt(): repaint() below already has a
   local `art` for the .botart host, and a shadowed helper is how two earlier
   bugs started (see CONTEXT §11). */
function pose(p){ return p >= 100 ? IMG_DONE : (p > 0 ? IMG : IMG_OFF); }
function poseAlt(p){
  return p >= 100 ? 'Pip, finished and lit up'
       : p > 0 ? 'Pip, ' + p + ' per cent built'
       : 'Pip, powered down, no checkpoints cleared yet';
}

/* How far through the whole module: every checkpoint anywhere moves him. */
function moduleFrac(){
  var sum = 0;
  ACTS.forEach(function(a){
    var st = read(a.n);
    sum += st.complete ? 1 : (st.total ? st.done / st.total : 0);
  });
  return sum / ACTS.length;
}

function pct(frac){ return Math.round(Math.max(0, Math.min(1, frac)) * 100); }

/* How solid one part should be.

   Kamil's call, 14 Sep 2026: an activity in progress shows its part faintly
   materialising rather than nothing at all, so a student who clears checkpoint
   3 of 7 can see that it did something. It stays well under half opacity until
   the activity is finished, so a half-done part never reads as a fitted one —
   the jump to 1 is the reward. */
function partAlpha(st){
  if(st.complete) return 1;
  if(!st.total || !st.done) return 0;
  return Math.round((0.10 + 0.34 * (st.done / st.total)) * 1000) / 1000;
}

/* Which parts were fitted at the last repaint, so a newly earned one can land
   with a pop. null until the first paint: nothing pops on page load. */
var fitted = null;

function partHTML(p){
  var st = read(p.n), a = partAlpha(st);
  return '<img class="pippart' + (st.complete ? ' on' : '') + '" data-part="' + p.n + '"'
       + ' src="' + PARTDIR + 'pip-p' + p.n + '.png" alt=""'
       + ' style="left:' + p.x + '%;top:' + p.y + '%;width:' + p.w + '%;opacity:' + a + '">';
}

/* Bring one already-drawn .pipfig's parts up to date. */
function applyParts(el){
  [].slice.call(el.querySelectorAll('.pippart')).forEach(function(im){
    var n = parseInt(im.getAttribute('data-part'), 10);
    var st = read(n), a = partAlpha(st);
    if(im.style.opacity !== String(a)) im.style.opacity = a;
    var was = im.classList.contains('on');
    im.classList.toggle('on', st.complete);
    /* fresh this paint, and not simply redrawn from storage on load */
    if(st.complete && !was && fitted && !fitted[n]){
      im.classList.remove('landing');
      void im.offsetWidth;
      im.classList.add('landing');
    }
  });
}

function pip(frac, cls){
  var p = pct(frac), src = pose(p);
  return '<div class="pipfig ' + (cls || '') + (p >= 100 ? ' done' : (p > 0 ? ' building' : ' off'))
       + '" style="--f:' + p + '%">'
       + '<img class="pipghost" src="' + src + '" alt="" aria-hidden="true">'
       + '<span class="pipparts" aria-hidden="true">'
       + PARTS.map(partHTML).join('')
       + '</span>'
       + '<img class="pipfull" src="' + src + '" alt="' + poseAlt(p) + '"></div>';
}

/* Move an already-drawn Pip to the module's current state. The extra arguments
   are ignored — they are there so activity.js can keep calling it the same
   way it did when Pip was fourteen separate vector parts. */
function setFrac(host){
  if(!host) return;
  var el = (host.classList && host.classList.contains('pipfig')) ? host
         : (host.querySelector ? host.querySelector('.pipfig') : null);
  if(!el) return;
  var p = pct(moduleFrac());
  el.style.setProperty('--f', p + '%');
  el.classList.toggle('off', p === 0);
  el.classList.toggle('building', p > 0 && p < 100);
  el.classList.toggle('done', p >= 100);
  /* the first checkpoint wakes him; the last swaps him for the lit pose */
  var src = pose(p);
  [].slice.call(el.querySelectorAll('img')).forEach(function(im){
    if(im.classList.contains('pippart')) return;
    if(im.getAttribute('src') !== src) im.setAttribute('src', src);
  });
  var img = el.querySelector('.pipfull');
  if(img) img.alt = poseAlt(p);
  applyParts(el);
}

/* kept under their old names so nothing else had to change */
function robotSVG(cls){ return pip(moduleFrac(), cls); }
function soloSVG(n, frac, cls){ return pip(moduleFrac(), cls); }

/* ---------- confetti ---------- */
function burst(host){
  if(!host) return;
  if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var box = document.createElement('div');
  box.className = 'burst';
  box.setAttribute('aria-hidden', 'true');
  var cols = ['#02ADA5', '#F5A21D', '#0D55A7', '#C80000', '#64A026', '#FBA919'];
  for(var i = 0; i < 34; i++){
    var s = document.createElement('i');
    s.style.background = cols[i % cols.length];
    s.style.left = (12 + Math.random() * 76) + '%';
    s.style.setProperty('--dx', (Math.random() * 160 - 80).toFixed(0) + 'px');
    s.style.setProperty('--dy', (-90 - Math.random() * 120).toFixed(0) + 'px');
    s.style.setProperty('--rot', (Math.random() * 720 - 360).toFixed(0) + 'deg');
    s.style.animationDelay = (Math.random() * 0.18).toFixed(2) + 's';
    box.appendChild(s);
  }
  host.appendChild(box);
  setTimeout(function(){ if(box.parentNode) box.parentNode.removeChild(box); }, 1900);
}

/* ---------- the robot in the rail, and on the landing page ---------- */
function paintBays(){
  var t = tally();
  var fresh = {};
  ACTS.forEach(function(a){
    if(read(a.n).complete && fitted && !fitted[a.n]) fresh[a.n] = 1;
  });
  [].slice.call(document.querySelectorAll('.botbay')).forEach(function(bay){
    /* the landing page puts the count and note beside the robot rather than
       under it, so look in the surrounding block too */
    var scope = bay.closest('.robothall') || bay;
    var art = bay.querySelector('.botart');
    if(art){
      art.innerHTML = robotSVG(bay.getAttribute('data-size') === 'big' ? 'big' : '');
      var el = art.querySelector('.pipfig');
      if(el && Object.keys(fresh).length){
        el.classList.remove('justfitted'); void el.offsetWidth;
        el.classList.add('justfitted');
        /* the part was drawn straight into the fresh markup, so it never
           transitions — give it the landing flash by hand */
        Object.keys(fresh).forEach(function(n){
          var im = el.querySelector('.pippart[data-part="' + n + '"]');
          if(im){ im.classList.remove('landing'); void im.offsetWidth;
                  im.classList.add('landing'); }
        });
      }
    }
    bay.classList.toggle('complete', t.built === t.total);
    var cnt = scope.querySelector('.botcount');
    if(cnt){
      cnt.innerHTML = t.built === t.total
        ? '<b>' + t.total + '</b> of ' + t.total + ' \u2014 finished'
        : '<b>' + t.built + '</b> of ' + t.total + ' parts fitted';
    }
    var note = scope.querySelector('.botnote');
    if(note){
      note.textContent = t.built === t.total ? 'Pip is finished. Every light is on.'
        : t.built === 0 ? (t.started ? 'A part is taking shape — finish the activity to fit it.'
                                     : 'Finish an activity to bring Pip to life.')
        : t.started ? (t.built + ' fitted, ' + t.started + ' under way.')
        : (t.total - t.built) + ' to go.';
    }
  });
}

/* ---------- the module rail's own ticks ---------- */
function paintRail(){
  var list = document.querySelector('.raillist');
  var done = 0, started = 0, total = 0;
  if(list){
    [].slice.call(list.querySelectorAll('a[data-act]')).forEach(function(a){
      total++;
      var s = read(a.getAttribute('data-act'));
      a.classList.toggle('done', s.complete);
      a.classList.toggle('going', !s.complete && s.started);
      if(s.complete) done++; else if(s.started) started++;
    });
    var out = document.getElementById('railprog');
    if(out && (done || started)){
      out.textContent = done + ' of ' + total + ' finished';
      out.hidden = false;
    }
  }
  /* the same marks on the landing page's activity cards */
  [].slice.call(document.querySelectorAll('.act[data-act]')).forEach(function(a){
    var s = read(a.getAttribute('data-act'));
    a.classList.toggle('done', s.complete);
    a.classList.toggle('going', !s.complete && s.started);
    var pip = a.querySelector('.actpart');
    if(pip) pip.textContent = s.complete ? 'Part fitted'
           : s.started ? (s.done + ' of ' + s.total) : '';
  });
  var t = tally();
  var fill = document.getElementById('yourfill'), cnt = document.getElementById('yourcount');
  if(fill) fill.style.width = Math.round(t.built / t.total * 100) + '%';
  if(cnt){
    cnt.textContent = t.built ? ('Pip is ' + Math.round(moduleFrac() * 100) + '% built')
                              : 'Pip is still dark — Activity 0 is the door in';
  }
}

/* Remember which parts are on, so the next repaint can tell what is new. Both
   painters above read `fitted`, so this runs once, after both. */
function snapshot(){
  var now = {};
  ACTS.forEach(function(a){ if(read(a.n).complete) now[a.n] = 1; });
  fitted = now;
}

function repaint(){ paintBays(); paintRail(); snapshot(); }

/* ---------- what activity.js talks to ---------- */
window.LILEX = {
  acts: ACTS,
  parts: PARTS,
  read: read,
  raw: raw,
  write: write,
  tally: tally,
  pageAct: pageAct,
  moduleFrac: moduleFrac,
  pip: pip,
  setFrac: setFrac,
  /* the two names activity.js still calls, from when Pip was vector parts */
  soloSVG: soloSVG,
  robotSVG: robotSVG,
  burst: burst,
  repaint: repaint,
  info: function(n){ return ACTS[n]; }
};

repaint();
/* a second tab, or the student clearing progress elsewhere */
window.addEventListener('storage', function(e){
  if(e.key && e.key.indexOf('lilex5v2:') === 0) repaint();
});
})();
