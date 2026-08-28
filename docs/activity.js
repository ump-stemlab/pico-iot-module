/* activity.js — shared behaviour for every activity page.
   The page declares its own content first:

     <script>window.ACTIVITY = { typer: [...lines...], quiz: [{q,opts,right,why}] };</script>
     <script src="activity.js"></script>

   Everything else (progress checkboxes, route tabs, the board simulator, the
   blink simulator) is picked up from the markup if it is there, and skipped if
   it is not. */
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
      var head = 'Naming GP' + n + ' as an output, then switching it on…\n\n';
      if(!hit){
        out.textContent = head
          + 'No error — but nothing lights up.\nGP' + n + ' is not wired to an LED on the LilEx5.\n'
          + 'The LEDs are on GP11, GP12 and GP13.';
        return;
      }
      document.getElementById(hit.id).classList.add('on');
      out.textContent = head
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
                 + 'Python cares — Pin is not pin, and True is not true.';
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

  /* ---------- blink simulator ---------- */
  var blinkrun = document.getElementById('blinkrun');
  if(blinkrun){
    var bbulb = document.getElementById('bblink');
    var bout  = document.getElementById('blinkout');
    var onIn  = document.getElementById('onsec');
    var offIn = document.getElementById('offsec');
    var timer = null, lit = false, blinks = 0;

    var clamp = function(v){
      v = parseFloat(v);
      if(isNaN(v)) v = 0.5;
      return Math.min(Math.max(v, 0.02), 5);
    };
    var pretty = function(v){ return (Math.round(v * 100) / 100) + ' s'; };

    var say = function(){
      var on = clamp(onIn.value), off = clamp(offIn.value);
      var t = 'Running. On for ' + pretty(on) + ', off for ' + pretty(off)
            + '.\nBlinks so far: ' + blinks + ' — and nothing will stop it on its own.';
      if(on + off < 0.14){
        t += '\n\n⚡ Far too fast for your eye. It is still blinking — it just looks dim.';
      } else if(on + off > 3){
        t += '\n\nSlow enough to count out loud.';
      }
      bout.textContent = t;
    };

    var tick = function(){
      lit = !lit;
      if(lit){ bbulb.classList.add('on'); blinks++; }
      else { bbulb.classList.remove('on'); }
      say();
      timer = setTimeout(tick, clamp(lit ? onIn.value : offIn.value) * 1000);
    };

    var stop = function(msg){
      if(timer){ clearTimeout(timer); timer = null; }
      lit = false;
      bbulb.classList.remove('on');
      blinkrun.textContent = '▶ Run the loop';
      bout.textContent = msg;
    };

    blinkrun.addEventListener('click', function(){
      if(timer){
        stop('Stopped after ' + blinks + ' blinks.\nOn a real Pico you stop a forever-loop the same way — '
           + 'the Stop button, or Ctrl+C in the Shell.');
        return;
      }
      blinks = 0; lit = false;
      blinkrun.textContent = '■ Stop it';
      tick();
    });

    [].forEach.call(document.querySelectorAll('[data-preset]'), function(b){
      b.addEventListener('click', function(){
        var v = b.getAttribute('data-preset').split(',');
        onIn.value = v[0]; offIn.value = v[1];
        if(timer) say();
      });
    });

    [onIn, offIn].forEach(function(inp){
      inp.addEventListener('input', function(){ if(timer) say(); });
    });
  }

  /* ---------- button reader (guarded by #btnrun) ---------- */
  var btnrun = document.getElementById('btnrun');
  if(btnrun){
    var bsw  = document.getElementById('bsw');
    var bval = document.getElementById('bval');
    var bout = document.getElementById('btnout');
    var btimer = null, bwait = 0.2, blines = [], bdown = false, bcount = 0;

    var bset = function(down){
      bdown = down;
      bsw.classList.toggle('down', down);
      bval.classList.toggle('pressed', down);
      bval.textContent = down ? '0' : '1';
    };
    bset(false);

    ['mousedown', 'touchstart'].forEach(function(ev){
      bsw.addEventListener(ev, function(e){ e.preventDefault(); bset(true); });
    });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function(ev){
      bsw.addEventListener(ev, function(){ bset(false); });
    });
    bsw.addEventListener('keydown', function(e){
      if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); bset(true); }
    });
    bsw.addEventListener('keyup', function(e){
      if(e.key === ' ' || e.key === 'Enter'){ bset(false); }
    });
    document.addEventListener('mouseup', function(){ if(bdown) bset(false); });

    var bshow = function(){
      var head = bwait
        ? 'Reading the pin ' + Math.round(1 / bwait) + ' times a second. Hold the button down.'
        : 'No wait at all — hundreds of lines a second. Good luck reading it.';
      bout.textContent = head + '\n' + blines.join('\n');
    };

    var bpush = function(){
      blines.push(bdown ? '0' : '1');
      bcount++;
      if(blines.length > 6) blines = blines.slice(-6);
    };

    var btick = function(){
      if(bwait){ bpush(); }
      else { for(var i = 0; i < 8; i++) bpush(); }
      bshow();
      btimer = setTimeout(btick, bwait ? bwait * 1000 : 60);
    };

    btnrun.addEventListener('click', function(){
      if(btimer){
        clearTimeout(btimer); btimer = null;
        btnrun.textContent = '▶ Run the loop';
        bout.textContent = 'Stopped after ' + bcount + ' readings.\n'
          + 'A forever-loop stops the same way on a real Pico — the Stop button, '
          + 'or Ctrl+C in the Shell.';
        return;
      }
      blines = []; bcount = 0;
      btnrun.textContent = '■ Stop it';
      btick();
    });

    [].forEach.call(document.querySelectorAll('[data-bspeed]'), function(b){
      b.addEventListener('click', function(){
        bwait = parseFloat(b.getAttribute('data-bspeed')) || 0;
        if(btimer) bshow();
      });
    });
  }

  /* ---------- decision simulator (guarded by #ifrun) ----------
     Activity 4. Shows the four things that move together: what the pin says,
     what the question answers, which road is taken, and the light. The two
     presets reproduce the activity's two traps — comparing with the wrong
     number, and leaving the else out. The output is written in words on
     purpose: it must never print a line of code (see CONTEXT.md rule 5.1). */
  var ifrun = document.getElementById('ifrun');
  if(ifrun){
    var isw  = document.getElementById('ifsw');
    var ival = document.getElementById('ifval');
    var iled = document.getElementById('ifled');
    var iout = document.getElementById('ifout');
    var itimer = null, idown = false, icmp = 0, ihasElse = true, ilit = false, iround = 0;

    var iset = function(down){
      idown = down;
      isw.classList.toggle('down', down);
      ival.classList.toggle('pressed', down);
      ival.textContent = down ? '0' : '1';
      if(!itimer) ishow(true);
    };

    var ishow = function(idle){
      var reading = idown ? 0 : 1;
      var yes = (reading === icmp);
      var head = idle
        ? 'Not running. The pin says ' + reading + '.\nPress Run the loop to start asking the question.'
        : 'Round ' + iround + ' of the loop.';
      var body = '\n\nThe pin says ' + reading + '.'
        + '\nIs that the same as ' + icmp + '?  ' + (yes ? 'yes' : 'no')
        + '\nSo the Pico takes the ' + (yes ? 'first' : 'second') + ' road';
      if(!ihasElse && !yes){
        body += ' — and that road is empty, so nothing happens.'
              + '\nThe light stays exactly as it was.';
      } else {
        body += ', and the light goes ' + (yes ? 'ON' : 'OFF') + '.';
      }
      if(idle){ iout.textContent = head; return; }
      iout.textContent = head + body;
    };

    var itick = function(){
      iround++;
      var yes = ((idown ? 0 : 1) === icmp);
      if(yes){ ilit = true; }
      else if(ihasElse){ ilit = false; }
      iled.classList.toggle('on', ilit);
      ishow(false);
      itimer = setTimeout(itick, 200);
    };

    ['mousedown', 'touchstart'].forEach(function(ev){
      isw.addEventListener(ev, function(e){ e.preventDefault(); iset(true); });
    });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function(ev){
      isw.addEventListener(ev, function(){ iset(false); });
    });
    isw.addEventListener('keydown', function(e){
      if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); iset(true); }
    });
    isw.addEventListener('keyup', function(e){
      if(e.key === ' ' || e.key === 'Enter'){ iset(false); }
    });
    document.addEventListener('mouseup', function(){ if(idown) iset(false); });
    iset(false);

    ifrun.addEventListener('click', function(){
      if(itimer){
        clearTimeout(itimer); itimer = null;
        ifrun.textContent = '▶ Run the loop';
        iout.textContent = 'Stopped after ' + iround + ' rounds.\n'
          + 'A forever-loop stops the same way on a real Pico — the Stop button, '
          + 'or Ctrl+C in the Shell.';
        return;
      }
      iround = 0; ilit = false; iled.classList.remove('on');
      ifrun.textContent = '■ Stop it';
      itick();
    });

    [].forEach.call(document.querySelectorAll('[data-ifcmp]'), function(b){
      b.addEventListener('click', function(){
        icmp = parseInt(b.getAttribute('data-ifcmp'), 10);
        if(!itimer) ishow(true);
      });
    });

    var ielse = document.querySelector('[data-ifelse]');
    if(ielse){
      ielse.addEventListener('click', function(){
        ihasElse = !ihasElse;
        ielse.textContent = ihasElse ? 'Take the else away' : 'Put the else back';
        if(!itimer) ishow(true);
      });
    }
  }

})();
