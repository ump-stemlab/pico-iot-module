#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Rework every activity page onto the gate spine.

  * strips the old .chk checkboxes (324 of them across fourteen pages)
  * rewrites the sticky bar as a checkpoint map
  * drops a .gate in at the end of the section each checkpoint belongs to
  * wraps the type-it-here box in its own gate
  * gives the quiz a score strip and makes it the last gate
  * adds the robot-part bay after the quiz
  * writes window.ACTIVITY.checks from checks.py

Idempotent: run it twice and nothing changes the second time.
"""
import re, os, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
DOCS = os.path.join(os.path.dirname(HERE), 'docs')
sys.path.insert(0, HERE)
from gates import GATES
from checks import CHECKS

BAR = '''<div class="progress-bar">
  <div class="progress-inner">
    <span class="gbpart" id="gbpart" aria-hidden="true"></span>
    <b id="gcount">0 of 0</b>
    <div class="pips" id="gpips" aria-label="Checkpoints on this page"></div>
    <button id="reset" type="button">Reset</button>
  </div>
</div>'''

PARTSEC = '''<section id="part" class="partsec">
  <div class="partbay" id="partbay"></div>
</section>'''


def tick_gate(gid, label, kicker, sentence):
    return ('<div class="ckpt" data-gate="%s" data-label="%s">\n'
            '  <label class="gtick">\n'
            '    <input type="checkbox">\n'
            '    <span class="gbox" aria-hidden="true"></span>\n'
            '    <span class="gtxt"><b>%s</b>%s</span>\n'
            '  </label>\n'
            '</div>') % (gid, label, kicker, sentence)


def ask_gate(gid, label):
    return '<div class="ckpt ask" data-gate="%s" data-label="%s"></div>' % (gid, label)


def section_end(s, sid):
    """index of the </section> that closes <section id="sid">"""
    m = re.search(r'<section id="%s"[^>]*>' % re.escape(sid), s)
    if not m:
        raise KeyError('no section #%s' % sid)
    e = s.index('\n</section>', m.end())
    return e


def close_div(s, start):
    """index just past the </div> matching the <div ...> beginning at start"""
    i, depth = start, 0
    op = re.compile(r'<div\b', re.I)
    cl = re.compile(r'</div\s*>', re.I)
    while True:
        mo, mc = op.search(s, i), cl.search(s, i)
        if mc is None:
            raise ValueError('unbalanced div')
        if mo and mo.start() < mc.start():
            depth += 1; i = mo.end()
        else:
            depth -= 1; i = mc.end()
            if depth == 0:
                return i


def strip_chks(s):
    out = []
    for line in s.split('\n'):
        if '<label class="chk">' in line and line.strip().endswith('</label>'):
            continue
        out.append(line)
    s = '\n'.join(out)
    # collapse the blank runs a removed block leaves behind
    s = re.sub(r'\n{3,}(\s*</section>)', r'\n\1', s)
    return s


def process(n):
    p = os.path.join(DOCS, 'activity-%d.html' % n)
    s = open(p, encoding='utf-8').read()
    before = s

    s = strip_chks(s)

    # ---- sticky bar ----------------------------------------------------
    m = re.search(r'<div class="progress-bar">[\s\S]*?\n</div>\n', s)
    if m:
        s = s[:m.start()] + BAR + '\n' + s[m.end():]

    # ---- the gates, bottom of the page upwards so offsets hold ---------
    spec = GATES[n]
    ins = []
    for g in spec:
        if g[0] in ('tick', 'ask') and ('data-gate="%s"' % g[2]) in s:
            continue                      # already there — this script reruns safely
        if g[0] == 'tick':
            _, sid, gid, label, kicker, sentence = g
            ins.append((section_end(s, sid), '\n\n' + tick_gate(gid, label, kicker, sentence)))
        elif g[0] == 'ask':
            _, sid, gid, label = g
            ins.append((section_end(s, sid), '\n\n' + ask_gate(gid, label)))
    for at, txt in sorted(ins, reverse=True):
        s = s[:at] + txt + s[at:]

    # ---- the typing box becomes its own gate ---------------------------
    ty = [g for g in spec if g[0] == 'typer']
    if ty and 'class="ckpt typed"' not in s:
        gid, label = ty[0][2], ty[0][3]
        i = s.index('<div class="typer" id="typer">')
        j = close_div(s, i)
        inner = s[i:j]
        s = (s[:i]
             + '<div class="ckpt typed" data-gate="%s" data-label="%s">\n' % (gid, label)
             + '  <p class="askkick"><span>Checkpoint</span> %s</p>\n' % label
             + inner
             + '\n  <button class="typeragain" id="typeragain" type="button">Start the box over</button>\n'
             + '</div>'
             + s[j:])

    # ---- the quiz gets a score strip and becomes the last gate ---------
    if 'quizgate' not in s:
      s = s.replace('<div id="quizbox"></div>',
        '<div class="ckpt quizgate" data-gate="quiz" data-label="Quiz">\n'
        '  <div class="quizhead"><span id="quizscore"></span>'
        '<span class="quizpips" id="quizpips" aria-hidden="true"></span></div>\n'
        '</div>\n<div id="quizbox"></div>', 1)

    # ---- the part bay, straight after the quiz section -----------------
    if 'id="partbay"' not in s:
        e = section_end(s, 'quiz')
        e = s.index('</section>', e) + len('</section>')
        s = s[:e] + '\n\n' + PARTSEC + s[e:]
    if 'href="#part"' not in s:
        s = s.replace('<a href="#quiz">Quiz</a>',
                      '<a href="#quiz">Quiz</a>\n      <a href="#part">Your part</a>', 1)

    # ---- window.ACTIVITY.checks ----------------------------------------
    ch = CHECKS.get(n)
    if ch:
        blob = json.dumps(ch, ensure_ascii=False, indent=4, sort_keys=True)
        blob = '\n'.join(('  ' + ln) if i else ln for i, ln in enumerate(blob.split('\n')))
        s = re.sub(r'\n  checks: \{[\s\S]*?\n  \},', '', s)
        s = s.replace('window.ACTIVITY = {',
                      'window.ACTIVITY = {\n  checks: ' + blob + ',', 1)

    if s != before:
        open(p, 'w', encoding='utf-8', newline='\n').write(s)
    return len(spec)


if __name__ == '__main__':
    total = 0
    for n in range(14):
        k = process(n)
        total += k
        print('activity-%-2d  %d gates' % (n, k))
    print('---------------\n%d gates in all (was 324 checkboxes)' % total)
