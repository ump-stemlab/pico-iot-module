/* code.js - renders code blocks as pictures so students cannot copy-paste them.
   Usage: <span class="codeimg" data-code="BASE64 OF THE CODE"></span>
   Add class "inline" for a small chip inside a table cell or a sentence.
   Also sanitises the clipboard, so inline <code> cannot be copied either.
   At the bottom of this file: the staff door, three clicks on "See". */
/* Renders code as a picture on a <canvas>. There is no text node to select,
   so students cannot copy-paste it - they have to type it. */
(function(){
  "use strict";
  var BG='#0F1B22', FG='#E6EDF3', KW='#FF7B72', FN='#D2A8FF',
      ST='#A5D6FF', NU='#79C0FF', CM='#8B949E', LN='#4A5A66';
  var KEYWORDS=/^(from|import|as|if|elif|else|while|for|in|def|return|True|False|None|and|or|not|class|pass|break|continue|try|except|finally|with|global|lambda)$/;

  function tokenize(line){
    var out=[], i=0;
    while(i<line.length){
      var c=line[i];
      if(c==='#'){ out.push([line.slice(i),CM]); break; }
      if(c==='"'||c==="'"){
        var q=c,j=i+1;
        while(j<line.length && line[j]!==q){ if(line[j]==='\\') j++; j++; }
        out.push([line.slice(i,Math.min(j+1,line.length)),ST]); i=j+1; continue;
      }
      if(/[0-9]/.test(c) && !/[A-Za-z_]/.test(line[i-1]||'')){
        var k=i; while(k<line.length && /[0-9.]/.test(line[k])) k++;
        out.push([line.slice(i,k),NU]); i=k; continue;
      }
      if(/[A-Za-z_]/.test(c)){
        var k2=i; while(k2<line.length && /[A-Za-z0-9_]/.test(line[k2])) k2++;
        var w=line.slice(i,k2);
        var colour = KEYWORDS.test(w) ? KW : (line[k2]==='(' ? FN : FG);
        out.push([w,colour]); i=k2; continue;
      }
      out.push([c,FG]); i++;
    }
    return out;
  }

  function decode(b64){
    var bin=atob(b64), u=new Uint8Array(bin.length);
    for(var i=0;i<bin.length;i++) u[i]=bin.charCodeAt(i);
    try { return new TextDecoder().decode(u); }
    catch(e){ return bin; }
  }

  function draw(host){
    var code = decode(host.getAttribute('data-code'));
    var inline = host.classList.contains('inline');
    var lines = code.split('\n');
    var FS = inline ? 13.5 : 14.5;
    var LH = inline ? 20 : 25;
    var PX = inline ? 9 : 18, PY = inline ? 5 : 16;
    var font = FS+'px "SFMono-Regular", Consolas, "Liberation Mono", "DejaVu Sans Mono", monospace';

    var probe = document.createElement('canvas').getContext('2d');
    probe.font = font;
    var cw = probe.measureText('M').width;

    var gutter = inline ? 0 : (String(lines.length).length * cw + 14);
    var widest = 0;
    lines.forEach(function(l){ if(l.length > widest) widest = l.length; });
    var W = Math.ceil(PX*2 + gutter + widest*cw + (inline ? 0 : 6));
    var H = Math.ceil(PY*2 + lines.length*LH);

    var dpr = window.devicePixelRatio || 1;
    var sc = Math.min(Math.max(dpr, 2), 3);
    var cv = document.createElement('canvas');
    cv.width = Math.round(W*sc); cv.height = Math.round(H*sc);
    cv.style.width = W+'px';
    var ctx = cv.getContext('2d');
    ctx.scale(sc, sc);

    ctx.fillStyle = BG;
    var r = 10;
    ctx.beginPath();
    ctx.moveTo(r,0); ctx.lineTo(W-r,0); ctx.quadraticCurveTo(W,0,W,r);
    ctx.lineTo(W,H-r); ctx.quadraticCurveTo(W,H,W-r,H);
    ctx.lineTo(r,H); ctx.quadraticCurveTo(0,H,0,H-r);
    ctx.lineTo(0,r); ctx.quadraticCurveTo(0,0,r,0);
    ctx.closePath(); ctx.fill();

    ctx.font = font;
    ctx.textBaseline = 'middle';
    lines.forEach(function(line, i){
      var y = PY + i*LH + LH/2;
      if(!inline){
        ctx.fillStyle = LN;
        var num = String(i+1);
        ctx.fillText(num, PX + gutter - 14 - num.length*cw, y);
      }
      var x = PX + gutter;
      tokenize(line).forEach(function(t){
        ctx.fillStyle = t[1];
        ctx.fillText(t[0], x, y);
        x += t[0].length * cw;
      });
    });

    host.textContent = '';
    host.appendChild(cv);
  }

  function renderAll(){
    var hosts = document.querySelectorAll('.codeimg[data-code]');
    for(var i=0;i<hosts.length;i++){
      try { draw(hosts[i]); } catch(e){}
    }
  }

  if(document.fonts && document.fonts.ready){
    document.fonts.ready.then(renderAll).catch(renderAll);
  } else {
    renderAll();
  }
  window.addEventListener('load', renderAll);

  /* Select-all still sweeps up inline <code> in some browsers, so sanitise the
     clipboard itself: anything inside a code element is replaced on the way out. */
  var GUARD = 'pre.code, code, .codeimg';
  var NOTE  = '[code — type it yourself]';

  function insideCode(node){
    var el = node && (node.nodeType === 1 ? node : node.parentElement);
    return !!(el && el.closest && el.closest(GUARD));
  }

  function sanitise(e){
    var sel = window.getSelection();
    if(!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    var range = sel.getRangeAt(0);

    if(insideCode(range.commonAncestorContainer)){
      e.clipboardData.setData('text/plain', NOTE);
      e.preventDefault();
      return;
    }

    var box = document.createElement('div');
    box.appendChild(range.cloneContents());
    if(!box.querySelector(GUARD) && !box.querySelector('input, textarea')) return;

    var hits = box.querySelectorAll(GUARD);
    for(var i = 0; i < hits.length; i++){
      hits[i].parentNode.replaceChild(document.createTextNode(NOTE), hits[i]);
    }
    /* the practice boxes carry the lines as placeholders - drop them too */
    var fields = box.querySelectorAll('input, textarea');
    for(var j = 0; j < fields.length; j++){
      fields[j].parentNode.removeChild(fields[j]);
    }
    /* innerText needs layout, so measure it off-screen rather than detached */
    box.style.cssText = 'position:fixed;left:-99999px;top:0;white-space:pre-wrap';
    document.body.appendChild(box);
    var text = box.innerText;
    var html = box.innerHTML;
    document.body.removeChild(box);

    e.clipboardData.setData('text/plain', text);
    e.clipboardData.setData('text/html', html);
    e.preventDefault();
  }

  document.addEventListener('copy', sanitise);
  document.addEventListener('cut', sanitise);
  document.addEventListener('dragstart', function(e){
    if(insideCode(e.target)) e.preventDefault();
  });
})();


/* ---------- the staff door ----------
   Three clicks on the word "See" in the coloured strip at the very top of the
   page opens that page's teacher notes. Kamil's call, so staff can reach the
   answers from the page they are teaching without carrying a second set of
   links around.

   Deliberately quiet: nothing in the markup, no cursor change, no hover state,
   and no feedback on the first two clicks. The three have to land within two
   seconds of each other or the count starts again.

   It is a shortcut, not a lock, and nothing about it makes the teacher pages
   safer or less safe than they already were. They are unlisted and noindexed,
   never protected; the repository is public; and a student who finds the
   gesture still lands on the "please go back and try the exercise first" gate.
   See CONTEXT.md section 9. */
(function(){
  "use strict";
  var see = document.querySelector('.chev span');
  if(!see) return;

  function target(){
    var here = location.pathname.split('/').pop() || 'index.html';
    var m = here.match(/^activity-(\d+)\.html$/);
    if(m) return 'teacher-' + m[1] + '.html';   /* this activity's own notes */
    if(here === 'teacher.html') return null;    /* already there */
    return 'teacher.html';                      /* home, pin reference, a teacher page */
  }

  var hits = 0, last = 0;
  see.addEventListener('click', function(){
    var now = Date.now();
    hits = (now - last > 2000) ? 1 : hits + 1;
    last = now;
    if(hits < 3) return;
    hits = 0;
    var to = target();
    if(to) location.href = to;
  });
})();
