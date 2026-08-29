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
  /* The prefix was bumped from 'lilex5:' when the site was renumbered to the
   Google Classroom's numbers. Saved ticks are keyed by filename, and the
   renumber moved every page's filename, so old ticks would have surfaced on
   the wrong activity. Bumping it once gives everybody a clean slate. Kamil's
   call — the site is in alpha and nobody had any progress to lose. */
  var KEY = 'lilex5v2:' + location.pathname.split('/').pop();

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

  /* ---------- route tabs ----------
     One pair per group. Every page up to Activity 6 has exactly one group,
     tab-a / tab-b; Activity 7 has a second, tab-c / tab-d, because the two
     routes differ twice on that page (getting the library on, and wiring). All
     groups share one stored choice, so picking Wokwi once picks it everywhere.
     A page without a group is left alone. */
  var pickers = [];
  var wire = function(aId, bId, panAId, panBId){
    var tabA = document.getElementById(aId), tabB = document.getElementById(bId);
    var panA = document.getElementById(panAId), panB = document.getElementById(panBId);
    if(!(tabA && tabB && panA && panB)) return;
    var show = function(which){
      var a = which === 'a';
      tabA.setAttribute('aria-selected', a ? 'true' : 'false');
      tabB.setAttribute('aria-selected', a ? 'false' : 'true');
      panA.hidden = !a; panB.hidden = a;
    };
    var pick = function(which){
      state.route = which; save(state);
      pickers.forEach(function(f){ f(which); });
    };
    pickers.push(show);
    tabA.addEventListener('click', function(){ pick('a'); });
    tabB.addEventListener('click', function(){ pick('b'); });
  };
  wire('tab-a', 'tab-b', 'pan-a', 'pan-b');
  wire('tab-c', 'tab-d', 'pan-c', 'pan-d');
  if(state.route === 'b') pickers.forEach(function(f){ f('b'); });

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
     Activity 5. Shows the four things that move together: what the pin says,
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

  /* ---------- logic simulator (guarded by #logrun) ----------
     Activity 6. Two pads, two readings, one light, and a joining word that can
     be swapped while it runs. The point is that the two halves are answered
     separately and then joined into a single answer. As with every simulator
     here, the output is written in words and never prints a line of code
     (CONTEXT.md rule 5.1). */
  var logrun = document.getElementById('logrun');
  if(logrun){
    var lsw = [document.getElementById('logsw1'), document.getElementById('logsw2')];
    var lvl = [document.getElementById('logv1'), document.getElementById('logv2')];
    var lled = document.getElementById('logled');
    var lout = document.getElementById('logout');
    var ltimer = null, ldown = [false, false], lop = 'and', lround = 0;

    var lname = { and: 'and', or: 'or', not: 'not' };

    var lset = function(i, down){
      ldown[i] = down;
      lsw[i].classList.toggle('down', down);
      lvl[i].classList.toggle('pressed', down);
      lvl[i].textContent = down ? '0' : '1';
      if(!ltimer) lshow(true);
    };

    var lanswer = function(){
      var a = ldown[0], b = ldown[1];
      if(lop === 'and') return a && b;
      if(lop === 'or')  return a || b;
      return !a;                       /* not — the second pad is ignored */
    };

    var lshow = function(idle){
      var a = ldown[0], b = ldown[1];
      var yes = lanswer();
      var head = idle
        ? 'Not running. Joining word: ' + lname[lop] + '.\nPress Run the loop to start asking the question.'
        : 'Round ' + lround + ' of the loop. Joining word: ' + lname[lop] + '.';
      var body = '\n\nFirst half — is SW1 held down?  ' + (a ? 'yes' : 'no');
      if(lop === 'not'){
        body += '\nThe word not turns that answer round, so the joined answer is '
              + (yes ? 'yes' : 'no') + '.'
              + '\n(SW2 is not part of this question at all.)';
      } else {
        body += '\nSecond half — is SW2 held down?  ' + (b ? 'yes' : 'no')
              + '\nJoined with ' + lname[lop] + ', the answer is ' + (yes ? 'yes' : 'no') + '.';
        if(lop === 'and' && !yes && (a || b)){
          body += '\nOne is not enough — and needs both halves.';
        }
        if(lop === 'or' && yes && a && b){
          body += '\nBoth halves are yes, and both is still "at least one".';
        }
      }
      body += '\nSo the light is ' + (yes ? 'ON' : 'OFF') + '.';
      lout.textContent = idle ? head : head + body;
    };

    [0, 1].forEach(function(i){
      ['mousedown', 'touchstart'].forEach(function(ev){
        lsw[i].addEventListener(ev, function(e){ e.preventDefault(); lset(i, true); });
      });
      ['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(function(ev){
        lsw[i].addEventListener(ev, function(){ lset(i, false); });
      });
      lsw[i].addEventListener('keydown', function(e){
        if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); lset(i, true); }
      });
      lsw[i].addEventListener('keyup', function(e){
        if(e.key === ' ' || e.key === 'Enter'){ lset(i, false); }
      });
      lset(i, false);
    });
    document.addEventListener('mouseup', function(){
      if(ldown[0]) lset(0, false);
      if(ldown[1]) lset(1, false);
    });

    var ltick = function(){
      lround++;
      lled.classList.toggle('on', lanswer());
      lshow(false);
      ltimer = setTimeout(ltick, 200);
    };

    logrun.addEventListener('click', function(){
      if(ltimer){
        clearTimeout(ltimer); ltimer = null;
        lled.classList.remove('on');
        logrun.textContent = '▶ Run the loop';
        lout.textContent = 'Stopped after ' + lround + ' rounds.\n'
          + 'A forever-loop stops the same way on a real Pico — the Stop button, '
          + 'or Ctrl+C in the Shell.';
        return;
      }
      lround = 0;
      logrun.textContent = '■ Stop it';
      ltick();
    });

    [].forEach.call(document.querySelectorAll('[data-logop]'), function(b){
      b.addEventListener('click', function(){
        lop = b.getAttribute('data-logop');
        if(!ltimer) lshow(true);
      });
    });
  }

  /* ---------- screen widget (guarded by #oledrun) ----------
     Activity 7. Two boxes: the page held in memory and the glass itself. The
     whole point is that writing changes the left-hand box and nothing else --
     the right-hand one only catches up when Show it is pressed. As with every
     widget here the output is written in words and never prints a line of code
     (CONTEXT.md rule 5.1). */
  var oledrun = document.getElementById('oledrun');
  if(oledrun){
    var omem = document.getElementById('oledmem');
    var oscr = document.getElementById('oledscr');
    var oout = document.getElementById('oledout');
    var page = ['', '', '', ''];
    var glass = ['', '', '', ''];
    var shown = 0, written = 0;

    var opaint = function(box, rows){
      var kids = box.querySelectorAll('b');
      for(var i = 0; i < kids.length; i++){
        kids[i].textContent = rows[i] ? rows[i] : ' ';
      }
    };
    var orefresh = function(){ opaint(omem, page); opaint(oscr, glass); };

    var osame = function(){
      for(var i = 0; i < 4; i++){ if(page[i] !== glass[i]) return false; }
      return true;
    };

    var osay = function(head){
      var tail = osame()
        ? '\nThe page and the screen match. There is nothing waiting to appear.'
        : '\nThe page and the screen are different, so there is something waiting. '
          + 'Press Show it.';
      oout.textContent = head + tail;
    };

    [].forEach.call(document.querySelectorAll('[data-oled]'), function(b){
      b.addEventListener('click', function(){
        var what = b.getAttribute('data-oled');
        if(what === 'wipe'){
          page = ['', '', '', ''];
          orefresh();
          osay('Wiped the page. Every row of it is blank now — and look at the screen: '
             + 'it has not changed at all.');
          return;
        }
        if(what === 'l1'){ page[0] = 'HELLO'; written++; }
        if(what === 'l2'){ page[2] = 'STEM LAB'; written++; }
        orefresh();
        osay('Written onto the page, at the row you chose. Still nothing on the screen — '
           + 'writing and showing are two different jobs.');
      });
    });

    oledrun.addEventListener('click', function(){
      glass = page.slice();
      shown++;
      orefresh();
      oout.textContent = 'Shown. The whole page went onto the glass in one go, which is why a '
        + 'screen never flickers halfway through a sentence.\nTimes shown: ' + shown
        + '  \u00b7  things written since the start: ' + written
        + '\nThe page and the screen match again.';
    });

    orefresh();
  }

  /* ---------- reading widget (guarded by #numrun) ----------
     Activity 8. Drag the tilt and watch three things at once: the number the
     sensor hands back with its whole tail of digits, the same number after
     round(), and what actually reaches the glass. The screen only catches up
     when Send it is pressed, so Activity 7's write-then-show survives. The
     "as a number" setting reproduces the TypeError in words. As with every
     widget here the output is written in words and never prints a line of code
     (CONTEXT.md rule 5.1). */
  var numrun = document.getElementById('numrun');
  if(numrun){
    var ntilt = document.getElementById('numtilt');
    var nraw  = document.getElementById('numraw');
    var nrnd  = document.getElementById('numrnd');
    var nscr  = document.getElementById('numscr');
    var nout  = document.getElementById('numout');
    var nstr  = document.getElementById('numstr');
    var ndp = 1, asWords = true, sent = 0, refused = 0;

    /* The sensor counts in steps of one sixteen-thousandth of a g, which is
       where the long tail comes from. MicroPython prints seven significant
       digits, so this does the same. */
    var nquant = function(v){ return Math.round(v * 16384) / 16384; };
    var nshow = function(v){
      var t = Number(v.toPrecision(7)).toString();
      if(t.indexOf('.') === -1 && t.indexOf('e') === -1) t += '.0';
      return t;
    };
    var nround = function(v, dp){
      var f = Math.pow(10, dp);
      return Math.round(v * f) / f;
    };

    var nrows = ['Tilt', '', '', ''];
    var npaint = function(){
      var kids = nscr.querySelectorAll('b');
      for(var i = 0; i < kids.length; i++){
        kids[i].textContent = nrows[i] ? nrows[i] : ' ';
      }
    };

    var nvalue = function(){ return nquant(parseInt(ntilt.value, 10) / 100); };

    var nrefresh = function(){
      var v = nvalue();
      nraw.textContent = nshow(v);
      nrnd.textContent = nshow(nround(v, ndp));
    };

    var nsay = function(head){
      nout.textContent = head + '\nSent to the screen: ' + sent
        + '  ·  refused: ' + refused;
    };

    ntilt.addEventListener('input', function(){
      nrefresh();
      nout.textContent = 'The board moved, so the reading moved. Notice that the long '
        + 'number almost never lands on a whole one — and that the screen has not '
        + 'changed, because nothing has been sent to it yet.';
    });

    [].forEach.call(document.querySelectorAll('[data-numdp]'), function(b){
      b.addEventListener('click', function(){
        ndp = parseInt(b.getAttribute('data-numdp'), 10);
        [].forEach.call(document.querySelectorAll('[data-numdp]'), function(o){
          o.classList.toggle('ghost', o !== b);
        });
        nrefresh();
        nsay(ndp === 0
          ? 'Rounding to no decimal places at all. The tilt is now only ever a whole '
            + 'number, which is tidy and throws away most of what the sensor knew.'
          : 'Rounding to ' + ndp + (ndp === 1 ? ' decimal place.' : ' decimal places.')
            + ' The number keeps that many digits after the point and the rest are gone '
            + 'for good — rounding does not hide them, it discards them.');
      });
    });

    if(nstr){
      nstr.addEventListener('click', function(){
        asWords = !asWords;
        nstr.textContent = asWords
          ? '✓ turning it into words'
          : '✗ leaving it as a number';
        nstr.classList.toggle('ghost', !asWords);
        nsay(asWords
          ? 'The number will be turned into words before it goes to the screen. That is '
            + 'the only thing the screen will accept.'
          : 'The number will be handed to the screen as a number. Press Send it and see '
            + 'what happens.');
      });
    }

    numrun.addEventListener('click', function(){
      var v = nround(nvalue(), ndp);
      if(!asWords){
        refused++;
        nsay('The program stopped. The screen was handed a number where it expected '
           + 'words, so it refused it and the whole program came to a halt — the '
           + 'screen is still showing whatever it had before. This is the error you '
           + 'will meet today, and it is the reason for the extra step.');
        return;
      }
      nrows[2] = nshow(v);
      sent++;
      npaint();
      nsay('Sent. The rounded number became words, the words went onto the page, and '
         + 'the page went onto the glass — the same wipe, write, show as Activity 7.');
    });

    nrefresh();
    npaint();
  }

  /* ---------- dashboard switch widget (guarded by #mqrun) ----------
     Activity 11. Three things have to line up before a click on a web page
     moves anything: the switch writes into the feed, the board has to have
     subscribed, and something has to ask whether a message came. The widget
     lets each one fail on its own. Flipping while not subscribed is the
     Activity 11 moment - the switch works perfectly and nothing happens.
     As with every widget here the output is words and never a line of code
     (CONTEXT.md rule 5.1). */
  var mqrun = document.getElementById('mqrun');
  if(mqrun){
    var mtog  = document.getElementById('mqtog');
    var mfeed = document.getElementById('mqfeed');
    var mled  = document.getElementById('mqled');
    var mout  = document.getElementById('mqout');
    var msub  = document.getElementById('mqsub');
    var mauto = document.getElementById('mqauto');
    var subscribed = false, timer = null;
    var rows = [];      /* newest first; each {word, read} */
    var queue = [];     /* what the server still has to deliver */
    var on = false, delivered = 0, missed = 0;

    var mpaint = function(){
      var kids = mfeed.querySelectorAll('b');
      for(var i = 0; i < kids.length; i++){
        var r = rows[i];
        kids[i].textContent = r ? r.word : ' ';
        kids[i].classList.toggle('unread', !!(r && !r.read));
      }
      mled.classList.toggle('on', on);
    };

    var msay = function(head){
      mout.textContent = head + '\n\nDelivered so far: ' + delivered
        + '  ·  written to the feed while nobody was listening: ' + missed;
    };

    var mwrite = function(word){
      rows.unshift({ word: word, read: false });
      if(rows.length > 4) rows.pop();
      if(subscribed){ queue.push(word); }
      else { missed++; }
      mpaint();
    };

    mtog.addEventListener('click', function(){
      var word = mtog.textContent.trim() === 'ON' ? 'OFF' : 'ON';
      mtog.textContent = word;
      mtog.classList.toggle('on', word === 'ON');
      mwrite(word);
      msay(subscribed
        ? 'The switch wrote the word ' + word + ' into the feed, and the server has it '
          + 'waiting for your board. Nothing reaches the light until something asks.'
        : 'The switch worked. A row landed in the feed. Your board has never asked to be '
          + 'told about this feed, so the message was not kept for it and the light did '
          + 'not move — which is exactly what happens in a real classroom.');
    });

    var mcheck = function(byHand){
      if(!subscribed){
        if(byHand) msay('You asked, but you never subscribed. The server has nothing for a '
          + 'board that never asked to be told, so there is nothing to hand over.');
        return;
      }
      if(!queue.length){
        if(byHand) msay('You asked, there was nothing, and the answer came straight back. '
          + 'That is what makes it safe to ask ten times a second.');
        return;
      }
      var word = queue.shift();
      for(var i = 0; i < rows.length; i++){
        if(!rows[i].read && rows[i].word === word){ rows[i].read = true; break; }
      }
      on = (word === 'ON');
      delivered++;
      mpaint();
      msay('A message was waiting, so your job ran — right there, before the loop carried '
        + 'on. It turned what arrived into words, compared it with ON, and '
        + (on ? 'lit the light.' : 'put the light out.')
        + (queue.length ? ' There is still another one waiting.' : ''));
    };

    mqrun.addEventListener('click', function(){ mcheck(true); });

    msub.addEventListener('click', function(){
      subscribed = !subscribed;
      msub.textContent = subscribed ? '✓ subscribed to the feed' : '✗ not subscribed yet';
      msub.classList.toggle('ghost', !subscribed);
      msay(subscribed
        ? 'You have handed your job over and asked the server to tell you about this feed. '
          + 'Nothing has arrived yet — subscribing does not fetch what you already missed.'
        : 'You have stopped listening. The switch will still work and the feed will still '
          + 'fill up; none of it will reach your board.');
      if(!subscribed){ queue = []; }
    });

    mauto.addEventListener('click', function(){
      if(timer){
        clearInterval(timer); timer = null;
        mauto.textContent = '▶️ Keep asking, in a loop';
        mauto.classList.add('ghost');
        msay('The loop has stopped asking. Anything you send now piles up on the server '
          + 'until something asks again.');
      } else {
        timer = setInterval(function(){ mcheck(false); }, 400);
        mauto.textContent = '⏸️ Stop asking';
        mauto.classList.remove('ghost');
        msay('The loop is asking on its own now, several times a second. Flip the switch and '
          + 'the light follows it — which is the whole of today.');
      }
    });

    mpaint();
  }

  /* ---------- publishing widget (guarded by #pubrun) ----------
     Activity 10. Three things decide whether a message draws itself on the far
     end: the unit has to come off the reading, the address has to be built
     correctly, and you have to stay under the free account's limit. All three
     are here. Like every widget on this site the output is written in words and
     never prints a line of code (CONTEXT.md rule 5.1). */
  var pubrun = document.getElementById('pubrun');
  if(pubrun){
    var ptemp  = document.getElementById('pubtemp');
    var praw   = document.getElementById('pubraw');
    var psend  = document.getElementById('pubsend');
    var pdash  = document.getElementById('pubdash');
    var pout   = document.getElementById('pubout');
    var puser  = document.getElementById('pubuser');
    var pstrip = document.getElementById('pubstrip');
    var pclear = document.getElementById('pubclear');
    var stripping = true, ppts = [], psent = 0;
    var PLIMIT = 30, PKEEP = 14;

    var pval  = function(){ return parseInt(ptemp.value, 10) / 100; };
    var ptext = function(){ return pval().toFixed(2) + 'C'; };

    var ptopic = function(){
      var u = (puser.value || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if(!u) u = 'your-username';
      return u + '/feeds/temperature';
    };

    var prefresh = function(){
      praw.textContent = ptext();
      psend.textContent = stripping ? ptext().slice(0, -1) : ptext();
    };

    var pdraw = function(){
      while(pdash.firstChild){ pdash.removeChild(pdash.firstChild); }
      if(!ppts.length){
        var m = document.createElement('span');
        m.className = 'dashmsg';
        m.textContent = 'nothing has arrived yet';
        pdash.appendChild(m);
        return;
      }
      var lo = 999, hi = -999, i;
      for(i = 0; i < ppts.length; i++){
        if(!ppts[i].bad){
          if(ppts[i].v < lo) lo = ppts[i].v;
          if(ppts[i].v > hi) hi = ppts[i].v;
        }
      }
      if(hi < lo){ lo = 0; hi = 1; }
      if(hi - lo < 1){ hi = lo + 1; }
      for(i = 0; i < ppts.length; i++){
        var b = document.createElement('i');
        if(ppts[i].bad){
          b.className = 'flat';
          b.style.height = '3px';
        } else {
          b.style.height = (8 + 74 * (ppts[i].v - lo) / (hi - lo)) + 'px';
        }
        pdash.appendChild(b);
      }
    };

    ptemp.addEventListener('input', function(){
      prefresh();
      pout.textContent = 'The room changed, so the reading changed. Nothing has left the board yet '
        + 'though — a reading only goes anywhere when the program publishes it.';
    });

    if(puser){
      puser.addEventListener('input', function(){
        pout.textContent = 'The address is now ' + ptopic() + '. It is built out of your username and '
          + 'the name of your box, so getting the username wrong sends your reading to somebody '
          + 'else’s address — where it is simply refused.';
      });
    }

    pstrip.addEventListener('click', function(){
      stripping = !stripping;
      pstrip.textContent = stripping ? '✓ taking the unit off' : '✗ leaving the unit on';
      pstrip.classList.toggle('ghost', !stripping);
      prefresh();
      pout.textContent = stripping
        ? 'The unit will be taken off before the message goes out, so what leaves the board is a '
          + 'number and nothing else. That is what the graph wants.'
        : 'The whole reading will go out with its unit still on the end. Press Publish it and watch '
          + 'what the graph does with that.';
    });

    pclear.addEventListener('click', function(){
      ppts = []; psent = 0;
      pdraw();
      pout.textContent = 'Graph cleared, and the minute has started again.';
    });

    pubrun.addEventListener('click', function(){
      if(psent >= PLIMIT){
        pout.textContent = 'Refused. That is ' + PLIMIT + ' messages already, and a free account takes '
          + PLIMIT + ' a minute. In a real program this is where it quietly stops working — and it '
          + 'looks exactly like a broken board, which is why the program waits five seconds between '
          + 'messages. Press Clear the graph to start the minute again.';
        return;
      }
      psent++;
      var bad = !stripping;
      ppts.push({ v: pval(), bad: bad });
      if(ppts.length > PKEEP) ppts.shift();
      pdraw();
      pout.textContent = bad
        ? 'Sent to ' + ptopic() + ' — and the graph could not use it. What arrived still had a '
          + 'letter on the end, so it was words rather than a number, and the point landed at nothing. '
          + 'Sent this minute: ' + psent + ' of ' + PLIMIT + '.'
        : 'Sent ' + ptext().slice(0, -1) + ' to ' + ptopic() + '. It crossed the internet, the broker '
          + 'handed it on, and the graph drew a point. Sent this minute: ' + psent + ' of ' + PLIMIT + '.';
    });

    prefresh();
    pdraw();
  }

  /* ---------- soil widget (guarded by #soilrun) ----------
     Activity 9. Move the water and watch three things at once: the raw number
     the pin hands back, the percentage the sum makes of it, and the word the
     decision picks. Then move the two thresholds and watch the same soil get
     called something different, which is what calibrating is.

     The raw number is modelled on the STEM Lab's Wokwi soil chip exactly, so
     the numbers here are the numbers the simulator gives: the chip puts out
     5 V x (100 - water) / 100 against Wokwi's 5 V reference, the RP2040's ADC
     is 12 bits, and MicroPython's read_u16 spreads those 12 bits over 16 by
     shifting. Water 0 gives 65535, water 15 gives 55693 and water 100 gives 0
     - all three checked against the running simulator during this build.

     Like every widget here the output is written in words and never prints a
     line of code (CONTEXT.md rule 5.1). */
  var soilrun = document.getElementById('soilrun');
  if(soilrun){
    var swater = document.getElementById('soilwater');
    var sdryi  = document.getElementById('soildry');
    var sweti  = document.getElementById('soilwet');
    var sraw   = document.getElementById('soilraw');
    var spc    = document.getElementById('soilpc');
    var ssay   = document.getElementById('soilsay');
    var sout   = document.getElementById('soilout');
    var swetb  = document.getElementById('soilwetbtn');
    var sback  = document.getElementById('soilback');

    var sread = function(){
      var w = parseInt(swater.value, 10);
      if(isNaN(w)) w = 0;
      var raw12 = Math.floor((100 - w) / 100 * 4095);
      return (raw12 << 4) | (raw12 >> 8);
    };
    var snum = function(el, dflt){
      var v = parseInt(el.value, 10);
      return isNaN(v) ? dflt : v;
    };

    var spaint = function(msg){
      var r = sread(), dry = snum(sdryi, 50000), wet = snum(sweti, 25000);
      sraw.textContent = r;

      if(dry === wet){
        spc.textContent = '?';
        ssay.textContent = '—';
        sout.textContent = 'The two numbers are the same, so the sum is asked to divide by nothing '
          + 'and the program stops with an error. Two identical thresholds leave no room for a '
          + 'middle zone at all.';
        return;
      }

      var pc = Math.floor((dry - r) * 100 / (dry - wet));
      var clamped = '';
      if(pc < 0){ pc = 0; clamped = ' The sum came out below nothing and was pulled back to 0.'; }
      else if(pc > 100){ pc = 100; clamped = ' The sum came out past a hundred and was pulled back to 100.'; }
      spc.textContent = pc;

      var say = r > dry ? 'DRY' : (r > wet ? 'JUST RIGHT' : 'WET');
      ssay.textContent = say;

      if(dry < wet){
        sout.textContent = 'Your dry number is smaller than your wet number, which is the wrong way '
          + 'round. Nothing has gone wrong and nothing will: the program runs perfectly and every '
          + 'answer it gives is nonsense. Look at the number line and work out why before you put '
          + 'them back.';
        return;
      }

      sout.textContent = (msg ? msg + '\n' : '')
        + 'The pin reads ' + r + '. Above ' + dry + ' is dry and below ' + wet + ' is wet, so this '
        + 'one is ' + say + ', at ' + pc + ' per cent.' + clamped;
    };

    swater.addEventListener('input', function(){
      spaint('You moved the water, so the reading moved with it — downwards, if you added water.');
    });
    sdryi.addEventListener('input', function(){
      spaint('You moved the dry line. The soil has not changed at all.');
    });
    sweti.addEventListener('input', function(){
      spaint('You moved the wet line. The soil has not changed at all.');
    });

    soilrun.addEventListener('click', function(){
      sdryi.value = sread();
      spaint('Calibrated the dry end: whatever the probe reads right now is the top of your scale. '
           + 'On a real probe you would do this holding it in the air, and then set the number a '
           + 'little inside that rather than exactly on it.');
    });
    swetb.addEventListener('click', function(){
      sweti.value = sread();
      spaint('Calibrated the wet end: whatever the probe reads right now is the bottom of your '
           + 'scale. On a real probe you would do this in soil you have just watered.');
    });
    sback.addEventListener('click', function(){
      sdryi.value = 50000; sweti.value = 25000;
      spaint('Back to the two numbers printed on the page — which belong to somebody '
           + 'else’s probe, in somebody else’s soil.');
    });

    spaint('');
  }

})();
