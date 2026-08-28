/* activity.js — shared behaviour for every activity page.
   The page declares its own content first:

     <script>window.ACTIVITY = { typer: [...lines...], quiz: [{q,opts,right,why}] };</script>
     <script src="activity.js"></script>

   Everything else (progress checkboxes, route tabs, the board simulator) is
   picked up from the markup if it is there, and skipped if it is not. */
(function(){
  "use strict";
  var CFG = window.ACTIVITY || {};
  var KEY = 'lilex5:' + location.pathname.split('/').pop();

  function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ return {}; } }
  function save(o){ try { localStorage.setItem(KEY, JSON.stringify(o)); } catch(e){} }
  var state = load();

  /* ---------- progress checkboxes ---------- */
  var boxes = [].slice.call(document.querySelectorAll('.chk input[type=checkbox]'));
  var fill  = document.getElementById('pfill');
  var count = document.getElementById('pcount');

  function paint(){
    var done = 0;
    boxes.forEach(function(b){
      if(b.checked){ done++; b.parentElement.classList.add('done'); }
      else { b.parentElement.classList.remove('done'); }
    });
    if(fill)  fill.style.width = (boxes.length ? Math.round(done / boxes.length * 100) : 0) + '%';
    if(count) count.textContent = done + ' / ' + boxes.length + ' done';
  }

  boxes.forEach(function(b){
    var k = b.getAttribute('data-p');
    if(state[k]) b.checked = true;
    b.addEventListener('change', function(){ state[k] = b.checked; save(state); paint(); });
  });
  paint();

  var reset = document.getElementById('reset');
  if(reset){
    reset.addEventListener('click', function(){
      boxes.forEach(function(b){ b.checked = false; state[b.getAttribute('data-p')] = false; });
      save(state); paint();
    });
  }

  /* ---------- route tabs ---------- */
  var tabA = document.getElementById('tab-a'), tabB = document.getElementById('tab-b');
  var panA = document.getElementById('pan-a'), panB = document.getElementById('pan-b');
  if(tabA && tabB && panA && panB){
    var pick = function(which){
      var a = which === 'a';
      tabA.setAttribute('aria-selected', a ? 'true' : 'false');
      tabB.setAttribute('aria-selected', a ? 'false' : 'true');
      panA.hidden = !a; panB.hidden = a;
      state.route = which; save(state);
    };
    tabA.addEventListener('click', function(){ pick('a'); });
    tabB.addEventListener('click', function(){ pick('b'); });
    if(state.route === 'b') pick('b');
  }

  /* ---------- board simulator ---------- */
  var simrun = document.getElementById('simrun');
  if(simrun){
    var MAP = {
      11: { id:'b11', name:'LED1 — red',    kind:'led' },
      12: { id:'b12', name:'LED2 — yellow', kind:'led' },
      13: { id:'b13', name:'LED3 — green',  kind:'led' },
      14: { id:'b14', name:'BZ1 — buzzer',  kind:'buzzer' }
    };
    var out = document.getElementById('simout');
    var clearBoard = function(){
      ['b11','b12','b13','b14'].forEach(function(id){
        var el = document.getElementById(id);
        if(el) el.classList.remove('on');
      });
    };
    var simoff = document.getElementById('simoff');
    if(simoff){
      simoff.addEventListener('click', function(){
        clearBoard();
        out.textContent = 'Board reset. Everything is off.';
      });
    }
    simrun.addEventListener('click', function(){
      var n = parseInt(document.getElementById('pinin').value, 10);
      clearBoard();
      if(isNaN(n)){ out.textContent = 'Type a pin number first.'; return; }
      var hit = MAP[n];
      if(!hit){
        out.textContent = '>>> led = Pin(' + n + ', Pin.OUT)\n>>> led.on()\n\n'
          + 'No error — but nothing lights up.\nGP' + n + ' is not wired to an LED on the LilEx5.\n'
          + 'The LEDs are on GP11, GP12 and GP13.';
        return;
      }
      document.getElementById(hit.id).classList.add('on');
      out.textContent = '>>> led = Pin(' + n + ', Pin.OUT)\n>>> led.on()\n\n'
        + (hit.kind === 'buzzer'
            ? '🔔 BEEEEEP — that is the buzzer, not a light!\nGP14 goes to BZ1. The red LED is GP11.'
            : '💡 ' + hit.name + ' is now on, and it stays on.');
    });
  }

  /* ---------- type-it-here box ---------- */
  var inputs = [].slice.call(document.querySelectorAll('#typer input'));
  var msg = document.getElementById('typermsg');
  if(inputs.length && CFG.typer){
    var norm = function(s){ return s.replace(/\s+/g, ' ').trim(); };
    var check = function(){
      var ok = 0, note = '';
      inputs.forEach(function(inp, i){
        var mark = inp.parentElement.querySelector('.mark');
        inp.classList.remove('ok', 'bad');
        mark.textContent = '';
        if(!inp.value) return;
        var target = CFG.typer[i] || '';
        if(norm(inp.value) === norm(target)){
          inp.classList.add('ok'); mark.textContent = '✓'; ok++;
        } else {
          inp.classList.add('bad'); mark.textContent = '✗';
          if(norm(inp.value).toLowerCase() === norm(target).toLowerCase()){
            note = 'Line ' + (i + 1) + ': the letters are right but the capitals are not. '
                 + 'Python cares — Pin is not pin.';
          }
        }
      });
      if(ok === inputs.length){
        msg.textContent = '✅ Every line exactly right. Now type them into Wokwi or Thonny.';
      } else if(note){ msg.textContent = note; }
      else { msg.textContent = ok + ' of ' + inputs.length + ' lines correct.'; }
    };
    inputs.forEach(function(inp){ inp.addEventListener('input', check); });
  }

  /* ---------- quiz ---------- */
  var box = document.getElementById('quizbox');
  if(box && CFG.quiz && CFG.quiz.length){
    var scored = CFG.quiz.map(function(){ return false; });
    var win = document.getElementById('quizwin');
    CFG.quiz.forEach(function(item, qi){
      var d = document.createElement('div');
      d.className = 'q';
      var p = document.createElement('p');
      p.className = 'qt';
      p.innerHTML = (qi + 1) + '. ' + item.q;
      d.appendChild(p);
      var fb = document.createElement('div');
      fb.className = 'fb';
      item.opts.forEach(function(text, oi){
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'opt'; b.textContent = text;
        b.addEventListener('click', function(){
          [].forEach.call(d.querySelectorAll('.opt'), function(x){
            x.classList.remove('right', 'wrong');
          });
          if(oi === item.right){
            b.classList.add('right');
            fb.textContent = '✅ ' + item.why;
            fb.style.color = '#1F9D55';
            scored[qi] = true;
          } else {
            b.classList.add('wrong');
            fb.textContent = '❌ Not quite — have another go.';
            fb.style.color = '#C80000';
            scored[qi] = false;
          }
          if(win){
            win.hidden = !scored.every(function(x){ return x === true; });
          }
        });
        d.appendChild(b);
      });
      d.appendChild(fb);
      box.appendChild(d);
    });
  }
})();
