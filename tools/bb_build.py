#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Builds the breadboard wiring diagrams and splices them into the pages.

One function per diagram. Each returns the whole `<svg class="dia wide">`
block; `write(page, key)` drops it between the `<!-- bb:start KEY -->` and
`<!-- bb:end KEY -->` markers in `docs/PAGE`. Run with no arguments to write
every diagram it knows about.

The Pico is never drawn here: the `<g class="wk">` group is lifted verbatim out
of the page it is already in, so it stays byte-identical everywhere, which is
what CONTEXT SS7 asks for. tools/bb.py owns the board and the parts.

Layout rules, all of them worked out from Kamil's own Wokwi project
(https://wokwi.com/projects/408599214421455873) on 15 Sep 2026:

  * The unit is LED + vertical resistor + jumper to the - rail, and it spans
    the board top to bottom. A resistor lying flat, or a circuit stacked into
    one corner, is what went wrong the first time.
  * The LED's body always covers its own two columns, so a signal wire can
    never come down onto the strip it feeds. It comes in **sideways, through
    the side margin, into the last column**, where it crosses no tie points at
    all. That is why the unit sits at the right-hand end of the board: it is
    the only place a side entry is clean.
  * Ground goes to the - rail and the rail goes to the Pico once.
  * Nothing is written on the board. Every label is in the caption strip
    underneath it.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bb                                                   # noqa: E402

DOCS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'docs')

BX, BY = 32, 96                  # the board's top-left, the same in every diagram
PICO_TOP = 100                   # the wk- group's own y in its source page, CONTEXT SS7


def pico_group(pins=(), page='activity-8.html'):
    """The wk- Pico, lifted **verbatim** from a page that already carries it, so
    it stays byte-identical everywhere (CONTEXT SS7). The only per-diagram part
    of that group is the orange ring on each pad a wire lands on, so the rings
    are stripped out of the copy and redrawn here for `pins`."""
    s = open(os.path.join(DOCS, page), encoding='utf-8').read()
    i = s.index('<g class="wk">')
    j = s.index('\n  </g>', i) + len('\n  </g>')
    g = s[i:j]
    assert '>40<' in g, 'the wk- group did not come out whole'
    g = re.sub(r'\n *<circle[^>]*class="wk-ring"/>', '', g)
    rings = ''.join('\n  <circle cx="%g" cy="%g" r="10.5" class="wk-ring"/>'
                    % (555 if p <= 20 else 735, pad(p)[1]) for p in pins)
    return g.replace('\n  </g>', rings + '\n  </g>')


def pad(pin):
    return bb.pad(pin, PICO_TOP)


def caption(x, y, head, bullets):
    o = ['  <text x="%g" y="%g" class="dlbl">%s</text>' % (x, y, head)]
    for k, b in enumerate(bullets):
        o.append('  <text x="%g" y="%g" class="dsub">&#8226; %s</text>'
                 % (x, y + 22 + k * 18, b))
    return '\n'.join(o)


def note(x, y, w, h, head, lines):
    o = ['  <rect x="%g" y="%g" width="%g" height="%g" rx="10" class="note"/>' % (x, y, w, h),
         '  <text x="%g" y="%g" class="dlbl">%s</text>' % (x + 16, y + 26, head)]
    for k, l in enumerate(lines):
        o.append('  <text x="%g" y="%g" class="dsub">%s</text>' % (x + 16, y + 48 + k * 18, l))
    return '\n'.join(o)


def activity1():
    """One red LED on GP11, through 330 ohm, back to ground on pin 18.

    Cathode in column 16, anode in column 17 -- the last column, so the red
    wire reaches it through the right-hand margin without passing over a
    single tie point.
    """
    C, A = 16, 17                       # cathode column, anode column
    xc = bb.col_x(BX, C)
    xa = bb.col_x(BX, A)
    _, yE = bb.hole(BX, BY, C, 'E')
    _, yJ = bb.hole(BX, BY, C, 'J')
    _, yN = bb.hole(BX, BY, C, 'n')     # the bottom - rail
    p15, p18 = pad(15), pad(18)

    o = []
    o.append('<svg class="dia wide" viewBox="0 0 780 665" role="img" aria-label="'
             'The Activity 1 circuit built on a breadboard, drawn the way Wokwi draws it. '
             'The red LED stands in two neighbouring strips near the right-hand end of the board. '
             'Its short leg shares a strip with a 330 ohm resistor, which stands upright across the '
             'centre gap; a black jumper takes the resistor down to the minus rail, and one black '
             'wire carries the minus rail to physical pin 18, the nearest ground. A red wire runs '
             'from physical pin 15, which is GP11, into the strip holding the LED&#39;s long leg.">')
    o.append('  <text x="390" y="26" class="dttl" text-anchor="middle">What it looks like in Wokwi</text>')
    o.append('  <text x="390" y="48" class="dsub" text-anchor="middle">The big white numbers on the '
             'Pico are the physical pins &mdash; where a wire goes. The names beside them are what you type.</text>')
    o.append(bb.board(BX, BY))
    o.append(pico_group((15, 18)))
    o.append(bb.wire([p15, (515, p15[1]), (515, yE), (xa, yE)], 'red'))
    o.append(bb.wire([(xc, yJ), (xc, yN)], 'black'))
    o.append(bb.wire([(bb.col_x(BX, 13), yN), (bb.col_x(BX, 13), 555),
                      (490, 555), (490, p18[1]), p18], 'black'))
    o.append(bb.vresistor(BX, BY, C, 'E', 'I'))
    o.append(bb.led(BX, BY, C, A, 'C'))
    o.append(caption(32, 592, 'How it sits on the board', [
        'The short leg (C) shares a strip with the resistor.',
        'The long leg (A) has a strip to itself &mdash; the red wire lands there.',
        'The resistor stands across the gap; a jumper takes it to the &#8722; rail.',
    ]))
    o.append(note(470, 572, 300, 72, 'Use these two pins', [
        '15 is GP11 &mdash; the one you type',
        '18 is the nearest ground',
    ]))
    o.append('</svg>')
    return '\n'.join(o)


def badge(x, y, kind):
    """A small round tick or cross, for the right-way / wrong-way inset."""
    d = ('M%g %g l6 7 l11 -14' % (x - 8, y)) if kind == 'good' else \
        ('M%g %g l16 16 M%g %g l-16 16' % (x - 8, y - 8, x + 8, y - 8))
    return ('  <circle cx="%g" cy="%g" r="17" class="bb-badge %s"/>\n'
            '  <path d="%s" class="bb-tick %s"/>' % (x, y, kind, d, kind))


def activity1_anatomy():
    """The board itself: strips of five, the gap, the rails. Every label is off
    the board, reached by a leader that crosses the right-hand margin only."""
    BX2, BY2 = 140, 70
    right = BX2 + bb.W                               # 566
    o = ['<svg class="dia wide" viewBox="0 0 780 545" role="img" aria-label="'
         'How a breadboard is joined up. The five holes of one column above the centre gap are '
         'joined to each other and to nothing else. The five below the gap are a separate strip. '
         'The long plus and minus rails along the top and bottom run the whole way across the board.">',
         '  <text x="390" y="26" class="dttl" text-anchor="middle">How a breadboard is joined up</text>',
         '  <text x="390" y="46" class="dsub" text-anchor="middle">Nothing is soldered. The board does '
         'the joining, and it always joins the same way.</text>',
         bb.board(BX2, BY2)]
    marks = [('-', '-', 122, 1, 17, ['Each rail runs the whole', 'way across the board.']),
             ('A', 'E', 213, 17, 1, ['Five holes in a column', 'are joined: one strip.']),
             (None, None, 283, 1, 17, ['The gap splits every', 'column in two.']),
             ('F', 'J', 353, 17, 1, ['Below the gap it is a', 'different strip.'])]
    for ra, rb, y, col, cols, text in marks:
        if ra:
            o.append(bb.mark(BX2, BY2, col, ra, rb, cols=cols))
        else:
            x = bb.col_x(BX2, col) - 11
            o.append('  <rect x="%g" y="%g" width="%g" height="22" rx="9" class="bb-mark"/>'
                     % (x, BY2 + bb.CHANNEL - 11, 22 + (cols - 1) * 20))
        o.append(bb.leader(right - 42, y, 580))
        for k, t in enumerate(text):
            o.append('  <text x="588" y="%g" class="%s">%s</text>'
                     % (y - 4 + k * 16, 'dlbl' if k == 0 else 'dsub', t))
    o.append('  <text x="390" y="532" class="dsub" text-anchor="middle">Nothing is joined across the '
             'gap, and nothing is joined from one column to the next.</text>')
    o.append('</svg>')
    return '\n'.join(o)


def activity1_short():
    """Why two legs must never share a strip."""
    o = ['<svg class="dia wide" viewBox="0 0 780 460" role="img" aria-label="'
         'Two ways to put a resistor into a breadboard. On the left both legs are in the same strip, '
         'which joins them together, so the electricity goes straight past the resistor. On the right '
         'the legs are in two different strips either side of the centre gap, so the electricity has '
         'to go through the resistor.">',
         '  <text x="390" y="26" class="dttl" text-anchor="middle">Two legs must never share a strip</text>']
    for bx, kind, col, ra, rb, body, head, lines in (
            (60, 'bad', 3, 'A', 'E', 56, 'Wrong',
             ['Both legs in one strip. The strip',
              'joins them, so the electricity goes',
              'straight past the resistor.']),
            (420, 'good', 3, 'E', 'I', 86, 'Right',
             ['One leg each side of the gap, in two',
              'different strips. Now the electricity',
              'has to go through the resistor.'])):
        o.append(bb.board(bx, 14, cols=6, rails=False))
        o.append(bb.mark(bx, 14, col, ra, rb, cls=('bad' if kind == 'bad' else 'good')))
        o.append(bb.vresistor(bx, 14, col, ra, rb, body=body))
        o.append(badge(bx + 232, 100, kind))
        o.append('  <text x="%g" y="106" class="dlbl">%s</text>' % (bx + 258, head))
        for k, t in enumerate(lines):
            o.append('  <text x="%g" y="%g" class="dsub">%s</text>' % (bx, 405 + k * 18, t))
    o.append('</svg>')
    return '\n'.join(o)


DIAGRAMS = {('activity-1.html', 'act1'): activity1,
            ('activity-1.html', 'act1bb'): activity1_anatomy,
            ('activity-1.html', 'act1short'): activity1_short}


def write(page, key, svg):
    path = os.path.join(DOCS, page)
    s = open(path, encoding='utf-8').read()
    a = '<!-- bb:start %s -->' % key
    b = '<!-- bb:end %s -->' % key
    i, j = s.index(a), s.index(b)
    s = s[:i + len(a)] + '\n' + svg + '\n      ' + s[j:]
    open(path, 'w', encoding='utf-8').write(s)
    print('wrote %s (%s), %d chars of svg' % (page, key, len(svg)))


if __name__ == '__main__':
    for (page, key), fn in DIAGRAMS.items():
        write(page, key, fn())


# ---------------------------------------------------------------- the rest of
# the module's discrete-part circuits. Layout rules beyond Activity 1's:
#
#   * Every ground goes to the `-` rail and ONE wire takes the rail to ONE Pico
#     GND pad. That is what the rails are for, and it is why these circuits now
#     use fewer ground pins than they used to -- see CONTEXT SS7.
#   * A signal wire that cannot reach its column straight from the margin
#     travels along a **lane**: a y midway between two rows, clear of every
#     part, then jogs 10px into its hole. A lane crosses no tie point, so it
#     cannot be mistaken for a connection.
#   * Where several signal wires share the right-hand margin, their vertical
#     runs must not be crossed by each other's horizontals. Check every pair:
#     wire A's horizontal at yA, running left from xA, crosses wire B's
#     vertical (at xB < xA, spanning pad to yB) whenever yA lies between B's
#     pad and yB. The x values below were chosen by working that through, so
#     do not shuffle them without redoing it.

def row_y(r):
    return bb.hole(BX, BY, 1, r)[1]


def cx(c):
    return bb.col_x(BX, c)


def sig(pin, xm, lane, tcol, trow, cls):
    """A signal wire: down the margin at `xm`, along `lane`, into (tcol, trow)."""
    p = pad(pin)
    tx, ty = cx(tcol), row_y(trow)
    pts = [p, (xm, p[1]), (xm, lane), (tx, lane)]
    if lane != ty:
        pts.append((tx, ty))
    return bb.wire(pts, cls)


def jumper(col):
    """Row J of one column straight down to the - rail."""
    return bb.wire([(cx(col), row_y('J')), (cx(col), row_y('n'))], 'black')


def rail_to_pin(col, pin, xm, drop=555):
    """The one wire that takes the whole - rail to a Pico GND pad."""
    p = pad(pin)
    return bb.wire([(cx(col), row_y('n')), (cx(col), drop), (xm, drop), (xm, p[1]), p], 'black')


def head(title, sub=True):
    o = ['  <text x="390" y="26" class="dttl" text-anchor="middle">%s</text>' % title]
    if sub:
        o.append('  <text x="390" y="48" class="dsub" text-anchor="middle">The big white numbers on '
                 'the Pico are the physical pins &mdash; where a wire goes. The names beside them are '
                 'what you type.</text>')
    return '\n'.join(o)


BTN_BULLETS = ['The button straddles the gap: one pair of legs above it, one below.',
               'Press it and the two halves are joined &mdash; that is the whole part.']


def activity4():
    o = ['<svg class="dia wide" viewBox="0 0 780 665" role="img" aria-label="'
         'The Activity 4 circuit built on a breadboard. The pushbutton straddles the centre gap, with '
         'one pair of legs in the top half of the board and the other pair below. A green wire runs '
         'from physical pin 4, which is GP2, into a strip above the gap. A black jumper takes a strip '
         'below the gap down to the minus rail, and one black wire carries the minus rail to physical '
         'pin 8, the nearest ground. There is no resistor anywhere in the circuit.">',
         head('What it looks like in Wokwi'),
         bb.board(BX, BY),
         pico_group((4, 8)),
         sig(4, 495, row_y('D'), 17, 'D', 'green'),
         jumper(13),
         rail_to_pin(9, 8, 520),
         bb.button(BX, BY, 13, 17),
         caption(32, 592, 'How it sits on the board', BTN_BULLETS + [
             'No resistor: <tspan class="dlbl">PULL_UP</tspan> switches one on inside the Pico.']),
         note(470, 572, 300, 72, 'Use these two pins', [
             '4 is GP2 &mdash; the one you type',
             '8 is the nearest ground']),
         '</svg>']
    return '\n'.join(o)


def activity5():
    o = ['<svg class="dia wide" viewBox="0 0 780 665" role="img" aria-label="'
         'Activity 1 and Activity 4 in one circuit, built on a breadboard. The pushbutton straddles '
         'the centre gap on the left; a green wire reaches it from physical pin 4, which is GP2. The '
         'red LED is at the right-hand end with its short leg sharing a strip with a 330 ohm resistor '
         'that stands across the gap; a red wire from physical pin 15, which is GP11, lands in the '
         'strip holding the long leg. Both parts drop to the same minus rail, and one black wire '
         'carries the rail to physical pin 18.">',
         head('Everything from Activity 1 and Activity 4, in one circuit'),
         bb.board(BX, BY),
         pico_group((4, 15, 18)),
         sig(15, 505, row_y('E'), 17, 'E', 'red'),
         sig(4, 520, 249, 13, 'D', 'green'),
         jumper(16), jumper(9),
         rail_to_pin(4, 18, 490),
         bb.vresistor(BX, BY, 16, 'E', 'I'),
         bb.led(BX, BY, 16, 17, 'C'),
         bb.button(BX, BY, 9, 13),
         caption(32, 592, 'Three pins, not four', [
             'The button goes to pin 4; the LED to pin 15.',
             'Both grounds share the &#8722; rail, so only one wire leaves it.',
             'That one wire is the circuit&rsquo;s only ground &mdash; pin 18.']),
         note(470, 572, 300, 72, 'What the rail saved you', [
             'Two ground wires became one.',
             'Every part can still reach it.']),
         '</svg>']
    return '\n'.join(o)


def activity6():
    o = ['<svg class="dia wide" viewBox="0 0 780 665" role="img" aria-label="'
         'Activity 5 with a second button added, built on a breadboard. Two pushbuttons straddle the '
         'centre gap. A green wire runs from physical pin 4, which is GP2, to the right-hand button, '
         'and a second green wire from physical pin 5, which is GP3, to the left-hand one. The red '
         'LED is at the right-hand end with a 330 ohm resistor standing across the gap, fed by a red '
         'wire from physical pin 15, which is GP11. All three parts drop to the same minus rail, and '
         'one black wire carries the rail to physical pin 18.">',
         head('Activity 5&rsquo;s circuit, plus a second button on GP3'),
         bb.board(BX, BY),
         pico_group((4, 5, 15, 18)),
         sig(15, 490, row_y('E'), 17, 'E', 'red'),
         sig(4, 505, 249, 13, 'D', 'green'),
         sig(5, 520, 269, 7, 'D', 'green'),
         jumper(16), jumper(9), jumper(3),
         rail_to_pin(12, 18, 475),
         bb.vresistor(BX, BY, 16, 'E', 'I'),
         bb.led(BX, BY, 16, 17, 'C'),
         bb.button(BX, BY, 9, 13),
         bb.button(BX, BY, 3, 7),
         caption(32, 592, 'Three parts, one rail', [
             'SW1 is the right-hand button, on pin 4. SW2 is on pin 5.',
             'Each button has its own strip above the gap and its own below.',
             'All three grounds meet on the &#8722; rail; one wire takes it to pin 18.']),
         note(470, 572, 300, 72, 'Four pins in all', [
             '4 and 5 are the two buttons',
             '15 is the LED, 18 is the ground']),
         '</svg>']
    return '\n'.join(o)


def activity8ex():
    o = ['<svg class="dia wide" viewBox="0 0 780 700" role="img" aria-label="'
         'The extra wiring for the Activity 8 exercise, built on a breadboard. A red LED stands at the '
         'right-hand end of the board. Its short leg shares a strip with a 330 ohm resistor that stands '
         'across the centre gap and drops to the minus rail; a red wire from physical pin 15, which is '
         'GP11, lands in the strip holding the long leg. One black wire carries the minus rail to '
         'physical pin 18. The sensor and screen wiring from earlier is not shown and does not change.">',
         head('One LED, one resistor, two pins that nothing else is using'),
         bb.board(BX, BY),
         pico_group((15, 18)),
         sig(15, 515, row_y('E'), 17, 'E', 'red'),
         jumper(16),
         rail_to_pin(13, 18, 490),
         bb.vresistor(BX, BY, 16, 'E', 'I'),
         bb.led(BX, BY, 16, 17, 'C'),
         caption(32, 592, 'Same unit as Activity 1', [
             'Short leg (C) and the resistor share one strip.',
             'Long leg (A) has a strip to itself &mdash; the red wire lands there.',
             'The resistor stands across the gap and drops to the &#8722; rail.']),
         note(470, 572, 300, 72, 'Two pins nothing else wants', [
             '15 is GP11 &mdash; the one you type',
             '18 is the nearest free ground']),
         '  <text x="390" y="676" class="dsub" text-anchor="middle">Leave the sensor&rsquo;s four wires '
         'exactly where they are. This is one more part on a board that already works.</text>',
         '</svg>']
    return '\n'.join(o)


def _two_leds(pins, wifi):
    """Activities 9 and 11 draw the same two-LED board; only the Pico differs."""
    page = 'activity-11.html' if wifi else 'activity-8.html'
    return [bb.board(BX, BY),
            pico_group(pins, page=page),
            sig(15, 505, row_y('E'), 17, 'E', 'red'),
            sig(17, 520, 269, 12, 'D', 'green'),
            jumper(16), jumper(11),
            rail_to_pin(6, 18, 480),
            bb.vresistor(BX, BY, 16, 'E', 'I'),
            bb.led(BX, BY, 16, 17, 'C'),
            bb.vresistor(BX, BY, 11, 'E', 'I'),
            bb.led(BX, BY, 11, 12, 'C', fill='url(#wkledg)', rim='wk-led-rim g'),
            caption(32, 592, 'Two units, one rail', [
                'Red: short leg and resistor in one strip, long leg fed from pin 15.',
                'Green: the same unit again, five columns along, fed from pin 17.',
                'Both drop to the &#8722; rail, and one wire takes the rail to pin 18.'])]


TWO_LED_LABEL = ('Two LEDs built on a breadboard, red at the right-hand end and green five columns '
                 'along. Each has its short leg sharing a strip with its own 330 ohm resistor, and '
                 'each resistor stands upright across the centre gap and drops by a black jumper to '
                 'the minus rail. A red wire from physical pin 15, which is GP11, lands in the strip '
                 'holding the red LED&#39;s long leg, and a green wire from physical pin 17, which is '
                 'GP13, lands in the strip holding the green LED&#39;s long leg. One black wire '
                 'carries the minus rail to physical pin 18. No wire crosses another.')


def activity9ex():
    return '\n'.join(
        ['<svg class="dia wide" viewBox="0 0 780 665" role="img" aria-label="%s The soil '
         'sensor&#39;s own wiring is not shown and does not change.">' % TWO_LED_LABEL,
         head('Two LEDs, two resistors &mdash; and the sensor&rsquo;s three wires left alone')]
        + _two_leds((15, 17, 18), False)
        + [note(470, 572, 300, 72, 'Three pins', [
            '15 is GP11, 17 is GP13',
            '18 is the one ground you need']), '</svg>'])


def activity11():
    return '\n'.join(
        ['<svg class="dia wide" viewBox="0 0 780 665" role="img" aria-label="%s A silver metal box '
         'marked Wi-Fi sits on the Pico, which is how you tell a Pico W from a plain Pico.">'
         % TWO_LED_LABEL,
         head('Two LEDs, two resistors &mdash; and a board with a radio in it')]
        + _two_leds((15, 17, 18), True)
        + [note(470, 572, 300, 72, 'Three pins', [
            '15 is GP11, 17 is GP13',
            '18 is the one ground you need']), '</svg>'])


DIAGRAMS.update({('activity-4.html', 'act4'): activity4,
                 ('activity-5.html', 'act5'): activity5,
                 ('activity-6.html', 'act6'): activity6,
                 ('activity-8.html', 'act8ex'): activity8ex,
                 ('activity-9.html', 'act9ex'): activity9ex,
                 ('activity-11.html', 'act11'): activity11})
