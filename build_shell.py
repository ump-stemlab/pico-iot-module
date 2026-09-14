#!/usr/bin/env python3
"""Rebuild the shared page shell on every page of the LilEx5 module site.

Replaces: the head's font/favicon links, the brand ribbon + top bar, the
body's accent attribute, the wrapping of the main content in .shell with the
module rail, and the footer. Everything between stays exactly as it was.
"""
import re, sys, os, glob

DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'docs')

ACTS = [
    (0,  "Getting Started",           "teal"),
    (1,  "Light Up an LED",           "teal"),
    (2,  "Make an LED Blink",         "teal"),
    (3,  "Digital Output &amp; Servo","orange"),
    (4,  "Digital Input",             "orange"),
    (5,  "Making Decisions",          "orange"),
    (6,  "And, Or, Not",              "orange"),
    (7,  "Words on a Screen",         "leaf"),
    (8,  "Sensors and Numbers",       "leaf"),
    (9,  "Soil Moisture",             "leaf"),
    (10, "Internet and Data",         "blue"),
    (11, "Control from Anywhere",     "blue"),
    (12, "Sending Messages by Radio", "red"),
    (13, "Your Own Live Dashboard",   "red"),
]
PHASE = {"teal":"Start here","orange":"Make things happen","leaf":"Sense the world",
         "blue":"Get online","red":"Go further"}

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">\n'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Poppins:wght@600;700;800&display=swap">')

FAVICON = '<link rel="icon" type="image/svg+xml" href="img/favicon.svg">'

CHEV = ('<div class="chev"><span>See</span><span>Think</span><span>Explore</span>'
        '<span>Marvel</span></div>')


def navmenu(prefix, current):
    rows = []
    for n, name, _ in ACTS:
        href = "%s-%d.html" % (prefix, n)
        cur = ' aria-current="page"' if href == current else ''
        rows.append('      <a href="%s"%s><b>Activity %d</b>: %s</a>' % (href, cur, n, name))
    return "\n".join(rows)


def summary_label(fname):
    m = re.match(r'^(activity|teacher)-(\d+)\.html$', fname)
    if m:
        n = int(m.group(2))
        name = dict((a[0], a[1]) for a in ACTS)[n]
        return "Activity %d: %s" % (n, name)
    if fname == 'index.html':   return 'Activities'
    if fname == 'teacher.html': return 'Teacher notes'
    return 'Activities'


def sitehead(fname):
    prefix = 'teacher' if fname.startswith('teacher-') else 'activity'
    cur = fname if re.match(r'^(activity|teacher)-\d+\.html$', fname) else ''
    home_cur = ' aria-current="page"' if fname == 'index.html' else ''
    pin_cur = ' aria-current="page"' if fname == 'pinout.html' else ''
    return """<header class="sitehead">
  <div class="sitehead-in">
    <a class="brand" href="index.html">
      <img class="brandmark" src="img/stemlab-mark.svg" alt="" width="32" height="33" aria-hidden="true">
      <span class="brandtxt"><b>LilEx5</b><small>UMPSA STEM LAB</small></span>
    </a>
    <nav class="topnav" aria-label="Site">
      <a class="nl" href="index.html"%s>Home</a>
      <details class="navsel">
        <summary>%s</summary>
        <div class="navmenu" role="menu">
%s
        </div>
      </details>
      <a class="nl" href="pinout.html"%s>Pin reference</a>
    </nav>
  </div>
</header>""" % (home_cur, summary_label(fname), navmenu(prefix, cur), pin_cur)


def rail(fname):
    prefix = 'teacher' if fname.startswith('teacher-') else 'activity'
    rows = []
    last_phase = None
    for n, name, ph in ACTS:
        if ph != last_phase:
            rows.append('      <li class="railphase"><span>%s</span></li>' % PHASE[ph])
            last_phase = ph
        href = "%s-%d.html" % (prefix, n)
        cur = ' aria-current="page"' if href == fname else ''
        rows.append('      <li><a href="%s" data-act="%d"%s><i><b>%d</b></i><span>%s</span></a></li>'
                    % (href, n, cur, n, name))
    return """<aside class="rail" aria-label="Module map">
  <div class="railbox">
    <p class="railttl">Module map</p>
    <ol class="raillist">
%s
    </ol>
    <p class="railprog" id="railprog" hidden></p>
    <a class="railpin" href="pinout.html">&#128204; Pin reference</a>
  </div>
</aside>""" % ("\n".join(rows))


FOOTER = """<footer>
  <div class="wrap">
    <div class="footgrid">
      <div class="footlogo">
        <img src="img/stemlab-logo-light.svg" alt="UMPSA STEM LAB &mdash; See, Think, Explore, Marvel" width="200" height="62" loading="lazy">
      </div>
      <div>
        <p class="motto">Pico IoT Module</p>
        <p>A MicroPython teaching module for the LilEx5 board.<br>
        Built and maintained by <strong>UMPSA STEM LAB</strong>.</p>
      </div>
    </div>
    <p class="footlinks"><a href="index.html">Home</a> &middot;
       %s &middot;
       <a href="pinout.html">Pin reference</a> &middot;
       <a href="https://github.com/ump-stemlab/pico-iot-module">Source on GitHub</a></p>
  </div>
</footer>""" % (" &middot;\n       ".join(
        '<a href="activity-%d.html">Activity %d</a>' % (n, n) for n, _, _ in ACTS))


def accent_for(fname):
    m = re.match(r'^(activity|teacher)-(\d+)\.html$', fname)
    if m:
        return dict((a[0], a[2]) for a in ACTS)[int(m.group(2))]
    return 'teal'


def match_close(s, start, tag):
    """index just past the </tag> matching the <tag ...> that begins at start"""
    open_re = re.compile(r'<%s\b' % tag, re.I)
    close_re = re.compile(r'</%s\s*>' % tag, re.I)
    i = start
    depth = 0
    while i < len(s):
        mo = open_re.search(s, i)
        mc = close_re.search(s, i)
        if mc is None:
            raise ValueError('unbalanced %s' % tag)
        if mo and mo.start() < mc.start():
            depth += 1
            i = mo.end()
        else:
            depth -= 1
            i = mc.end()
            if depth == 0:
                return mc.start(), mc.end()
    raise ValueError('unbalanced %s' % tag)


def process(path):
    fname = os.path.basename(path)
    s = open(path, encoding='utf-8').read()
    orig = s

    # ---- head: fonts + favicon -------------------------------------------
    s = re.sub(r'<link rel="icon"[^>]*>', FAVICON, s, count=1)
    if 'fonts.googleapis.com' not in s:
        s = s.replace('<link rel="stylesheet" href="style.css">',
                      FONTS + '\n<link rel="stylesheet" href="style.css">', 1)

    # ---- body accent -----------------------------------------------------
    s = re.sub(r'<body[^>]*>', '<body data-accent="%s">' % accent_for(fname), s, count=1)

    # ---- brand ribbon + top bar (idempotent) ----------------------------
    i = s.index('<div class="chev">')
    if '<nav class="sitenav">' in s:
        j = s.index('<nav class="sitenav">')
        _, navend = match_close(s, j, 'nav')
    else:
        j = s.index('<header class="sitehead">')
        _, navend = match_close(s, j, 'header')
    if '<a class="skip"' in s:
        i = min(i, s.index('<a class="skip"'))
    skip = '<a class="skip" href="#main">Skip to the activity</a>\n'
    s = s[:i] + skip + CHEV + '\n' + sitehead(fname) + s[navend:]

    # ---- wrap the main content in the shell (idempotent) -----------------
    m = re.search(r'^<div class="shell">$', s, re.M)
    if m:                                   # already wrapped: refresh the rail
        shell_cs, shell_ce = match_close(s, m.start(), 'div')
        mm = re.search(r'<main class="wrap" id="main">', s[m.start():shell_ce])
        ms = m.start() + mm.start()
        cs, ce = match_close(s, ms, 'main')
        inner = s[ms + mm.end() - mm.start():cs]
        start, end = m.start(), shell_ce
    else:
        m = re.search(r'^<(div|main) class="wrap">$', s, re.M)
        if not m:
            raise ValueError('no top-level content wrap in %s' % fname)
        cs, ce = match_close(s, m.start(), m.group(1))
        inner = s[m.end():cs]
        start, end = m.start(), ce
    s = (s[:start]
         + '<div class="shell">\n' + rail(fname) + '\n<main class="wrap" id="main">'
         + inner + '</main>\n</div>'
         + s[end:])

    # ---- footer ----------------------------------------------------------
    f = s.index('<footer>')
    _, fe = match_close(s, f, 'footer')
    s = s[:f] + FOOTER + s[fe:]

    if s != orig:
        open(path, 'w', encoding='utf-8', newline='\n').write(s)
    return True


if __name__ == '__main__':
    files = sorted(glob.glob(os.path.join(DOCS, '*.html')))
    for p in files:
        try:
            process(p)
            print('ok  ', os.path.basename(p))
        except Exception as e:
            print('FAIL', os.path.basename(p), e)
