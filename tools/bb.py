#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""The breadboard, and the parts that sit on it, for the Wokwi-look diagrams.

Kamil's call, 14 Sep 2026: the circuits should be built on a breadboard, the
way Wokwi draws them, with the power rails, and with the resistors mounted
vertically.

**Every number below was measured**, 15 Sep 2026, off Wokwi's own
`wokwi-breadboard-half` -- the SVG was read out of the live page of Kamil's
reference project, https://wokwi.com/projects/408599214421455873. Wokwi draws
that board 87mm x 55mm on a 2.54mm (9.6px) pitch; ours is on a 20px pitch, so
every measurement here is Wokwi's own multiplied by 20/9.6 = 2.0833. Do not
"tidy" these to round numbers -- they are what makes the board read as Wokwi's.

The topology is Wokwi's too, from the same project's `diagram.json`:

    led1:A -> 3t.c    led1:C -> 2t.c     LED upright, legs one column apart
    r1:1   -> 2t.e    r1:2   -> 2b.i     resistor VERTICAL, in the cathode's
                                          column, bridging the centre channel
    2b.j   -> bn.1                        short jumper down to the - rail
    bn.2   -> pico:GND.5                  the rail reaches the Pico once
    pico:GP14 -> 3t.e                     signal lands in the anode's column

That is the unit. Repeat it on a **four-column stride**, which is Wokwi's.
The point of the vertical resistor is that the unit then spans the board from
top to bottom instead of stacking in one corner -- that was what was wrong
with the first attempt at this.

**If a diagram draws the rails, its circuit has to use them**, or they are
decoration a student will copy without understanding. In practice the ground
side of a circuit goes to the - rail and one jumper takes the rail to a Pico
GND pad. The + rail goes unused in most of this module, because everything is
driven straight from a GP pin -- true of plenty of real builds, and worth
saying out loud rather than hiding.

**No label may sit on the board.** Wokwi puts none there and neither do we;
the board carries only its own moulded numbers and letters. Part names, values
and notes go in a caption strip below the board. There is no `.bb-lbl` any
more -- the haloed labels it existed for were exactly what made the first
attempt read as clutter.

Seventeen columns, not Wokwi's thirty: the module's 780-wide viewBox already
spends 200 on the Pico, and at the scale the Pico is drawn thirty columns
would be 722px. Seventeen is a real board length (a 170-point mini is
seventeen) and is enough for every circuit in the module. The consequence is
that our board is squarer than Wokwi's; everything local to it -- pitch, hole
size, rail hairlines, channel, the moulded groups of five -- is exact.

Geometry, all relative to the board's top-left (bx, by):

    hole(col, row)   col 1..17 left to right
                     row 'A'..'J' for the main block
                     '+'/'-' for the top rails, 'p'/'n' for the bottom pair

Import it, or run it to print one board.
"""

P = 20                      # pitch, matching the Pico's pads
COLS = 17
ROWS = 'ABCDEFGHIJ'
PAD_X = 53                  # Wokwi's 25.5px left margin x 2.0833

# Vertical geometry, px from the board's top edge. Wokwi's own, scaled.
LINE_T_POS = 10             # the red hairline above the top + row
RAIL_T_POS = 32
RAIL_T_NEG = 52
LINE_T_NEG = 63             # the blue hairline below the top - row
MAIN_TOP   = 103            # row A
GAP        = 40             # the EXTRA gap at the channel: row E to row F is 3 pitches
CHANNEL    = 213            # centre of the gutter
LINE_B_POS = 367
RAIL_B_POS = 395
RAIL_B_NEG = 415
LINE_B_NEG = 423
W = PAD_X * 2 + (COLS - 1) * P      # 426
H = 433

HOLE = 7.6                  # Wokwi's 1mm tie point, scaled
_RAILS = {'+': RAIL_T_POS, '-': RAIL_T_NEG, 'p': RAIL_B_POS, 'n': RAIL_B_NEG}


def hole(bx, by, col, row):
    """Centre of one tie point. '+'/'-' are the top rails, 'p'/'n' the bottom."""
    if row in _RAILS:
        y = by + _RAILS[row]
    else:
        i = ROWS.index(row.upper())
        y = by + MAIN_TOP + i * P + (GAP if i >= 5 else 0)
    return bx + PAD_X + (col - 1) * P, y


def col_x(bx, col):
    return bx + PAD_X + (col - 1) * P


def _tie(x, y):
    return '  <rect x="%g" y="%g" width="%g" height="%g" rx="1" class="bb-hole"/>' % (
        x - HOLE / 2, y - HOLE / 2, HOLE, HOLE)


NO_RAIL_TOP = MAIN_TOP - 40          # body edge when the rails are left off
NO_RAIL_H = 40 + (9 * P + GAP) + 40


def board(bx, by, cols=None, rails=True):
    """The board: body, the four rails with their hairlines and signs, the
    channel, and every tie point. Rail holes come in moulded groups of five.

    `cols` draws a shorter board, and `rails=False` a fragment of the main
    block with no power rails -- both only for the close-up insets that teach
    the board itself, never for a circuit. A circuit is always drawn on the
    whole board, because that is the board the student has."""
    cols = cols or COLS
    w = PAD_X * 2 + (cols - 1) * P
    o = []
    a = o.append
    a('  <g class="bb">')
    if rails:
        a('  <rect x="%g" y="%g" width="%g" height="%g" rx="6" class="bb-body"/>' % (bx, by, w, H))
    else:
        a('  <rect x="%g" y="%g" width="%g" height="%g" rx="6" class="bb-body"/>'
          % (bx, by + NO_RAIL_TOP, w, NO_RAIL_H))
    a('  <rect x="%g" y="%g" width="%g" height="15" class="bb-chan"/>' % (bx + 12, by + CHANNEL - 7.5, w - 24))

    # the four rails: a hairline, a + or - at each end, and the holes
    for row, cls, line_y in ((('+', 'pos', LINE_T_POS), ('-', 'neg', LINE_T_NEG),
                              ('p', 'pos', LINE_B_POS), ('n', 'neg', LINE_B_NEG))
                             if rails else ()):
        ly = by + line_y
        a('  <path d="M%g %g H%g" class="bb-rail %s"/>' % (bx + 30, ly, bx + w - 30, cls))
        for sx in (bx + 16, bx + w - 16):
            if cls == 'pos':
                a('  <path d="M%g %g h11 M%g %g v11" class="bb-sign pos"/>'
                  % (sx - 5.5, ly, sx, ly - 5.5))
            else:
                a('  <path d="M%g %g h11" class="bb-sign neg"/>' % (sx - 5.5, ly))
        _, y = hole(bx, by, 1, row)
        for c in range(1, cols + 1):
            if (c - 1) % 6 == 5:          # the moulded gap between groups
                continue
            a(_tie(col_x(bx, c), y))

    # the main block
    for c in range(1, cols + 1):
        for r in ROWS:
            x, y = hole(bx, by, c, r)
            a(_tie(x, y))

    # Row letters down the LEFT side only, column numbers along the BOTTOM only.
    # Wokwi prints both of each on both sides; we print one of each, because the
    # second copy of every label is where wires and parts collide with text
    # (rule 5.3) and because halving the board's text is half of what stops it
    # reading as clutter. The numbers are Wokwi's own sequence: 1, then every
    # five.
    for r in ROWS:
        _, y = hole(bx, by, 1, r)
        a('  <text x="%g" y="%g" class="bb-num" text-anchor="middle">%s</text>'
          % (bx + 15, y + 4, r.lower()))
    for c in [1] + list(range(5, cols + 1, 5)):
        _, yj = hole(bx, by, c, 'J')
        a('  <text x="%g" y="%g" class="bb-num" text-anchor="middle">%d</text>'
          % (col_x(bx, c), yj + 24, c))
    a('  </g>')
    return '\n'.join(o)


def led(bx, by, col_c, col_a, row, fill='url(#wkled)', rim='wk-led-rim'):
    """A through-hole LED plugged into two holes in the same row: cathode (the
    short leg) in col_c, anode (the long leg) in col_a.

    **Both visible legs are the same length, and that is correct.** Once an
    LED is in the board both legs reach the same depth, so the drawing cannot
    show which is which -- CONTEXT SS7's unequal-legs rule is about LEDs drawn
    free-standing, and Activity 1 still teaches A and C on that diagram. On
    the board the story is told by the strips: the short leg shares a strip
    with the resistor, the long leg has the signal wire to itself.
    """
    xc, y = hole(bx, by, col_c, row)
    xa, _ = hole(bx, by, col_a, row)
    cx = (xa + xc) / 2
    rim_b = y - 30                      # the legs stand 30px out of the board
    body_t = rim_b - 49
    o = []
    a = o.append
    a('  <g class="bb-part">')
    for x in (xc, xa):
        a('  <rect x="%g" y="%g" width="7" height="32" rx="2" class="wk-leg"/>' % (x - 3.5, rim_b - 2))
    a('  <path d="M%g %g L%g %g A19 19 0 0 1 %g %g L%g %g Z" fill="%s"/>'
      % (cx - 19, rim_b - 5, cx - 19, body_t + 19, cx + 19, body_t + 19, cx + 19, rim_b - 5, fill))
    a('  <rect x="%g" y="%g" width="46" height="8" rx="3" class="%s"/>' % (cx - 23, rim_b - 8, rim))
    a('  <path d="M%g %g q6 -8 12 -3" class="wk-led-gloss"/>' % (cx - 12, body_t + 12))
    a('  </g>')
    return '\n'.join(o)


def vresistor(bx, by, col, row_top, row_bot, body=86):
    """A resistor standing up in one column, bridging the centre channel --
    Wokwi's `rotate: 90` resistor, whose legs go into `Nt.e` and `Nb.i`.

    This is the part that makes the unit span the board instead of stacking in
    a corner. Bands are orange-orange-brown-gold for 330 ohm, reading down.
    """
    x, y1 = hole(bx, by, col, row_top)
    _, y2 = hole(bx, by, col, row_bot)
    mid = (y1 + y2) / 2
    t = mid - body / 2
    o = []
    a = o.append
    a('  <g class="bb-part">')
    a('  <rect x="%g" y="%g" width="7" height="%g" rx="2" class="wk-leg"/>' % (x - 3.5, y1, y2 - y1))
    cid = 'rv%d' % int(x + y1)
    a('  <defs><clipPath id="%s"><path d="M%g %g v%g a12 12 0 0 0 24 0 v%g a12 12 0 0 0 -24 0 z"/></clipPath></defs>'
      % (cid, x - 12, t + 12, body - 24, -(body - 24)))
    a('  <g clip-path="url(#%s)">' % cid)
    a('    <rect x="%g" y="%g" width="24" height="%g" fill="url(#wkresv)"/>' % (x - 12, t, body))
    bh = max(6, round(body / 9.5, 1))     # band height and spacing scale with the body,
    for f, cls in ((.14, 'wk-b-or'), (.28, 'wk-b-or'),   # so a short one keeps its order
                   (.42, 'wk-b-br'), (.78, 'wk-b-gd')):
        a('    <rect x="%g" y="%g" width="24" height="%g" class="%s"/>' % (x - 12, t + body * f, bh, cls))
    a('  </g>')
    a('  <path d="M%g %g v%g a12 12 0 0 0 24 0 v%g a12 12 0 0 0 -24 0 z" class="wk-res-edge"/>'
      % (x - 12, t + 12, body - 24, -(body - 24)))
    a('  </g>')
    return '\n'.join(o)


def _round_path(pts, r=9):
    """Manhattan path with quarter-circle corners, which is how Wokwi draws a
    jumper (its own radius is 4 on a 9.6px pitch; ours is the same, scaled)."""
    d = ['M%g %g' % tuple(pts[0])]
    for i in range(1, len(pts) - 1):
        (px, py), (cx, cy), (nx, ny) = pts[i - 1], pts[i], pts[i + 1]
        rr = min(r, abs(cx - px) / 2 or r, abs(cy - py) / 2 or r,
                 abs(nx - cx) / 2 or r, abs(ny - cy) / 2 or r)
        ux, uy = (cx - px), (cy - py)
        vx, vy = (nx - cx), (ny - cy)
        ul = abs(ux) + abs(uy) or 1
        vl = abs(vx) + abs(vy) or 1
        ax, ay = cx - ux / ul * rr, cy - uy / ul * rr
        bx_, by_ = cx + vx / vl * rr, cy + vy / vl * rr
        sweep = 1 if (ux * vy - uy * vx) > 0 else 0
        d.append('L%g %g' % (ax, ay))
        d.append('A%g %g 0 0 %d %g %g' % (rr, rr, sweep, bx_, by_))
    d.append('L%g %g' % tuple(pts[-1]))
    return ' '.join(d)


def button(bx, by, col_l, col_r, row_t='E', row_b='F'):
    """A tactile pushbutton **straddling the centre channel**, which is the only
    way one goes into a breadboard.

    Wokwi's `wokwi-pushbutton` has two bars: the two legs on the top side are
    one terminal, the two on the bottom side are the other, and pressing joins
    them. So the part goes in with its top bar in the top half of the board and
    its bottom bar in the bottom half, and the channel is what keeps the two
    apart until a finger arrives. `col_l` and `col_r` are three columns apart,
    which is a 6mm switch's leg span at this pitch.

    The consequence worth teaching: on a breadboard "two diagonally opposite
    legs" simply becomes **one strip above the gap and one below it**.
    """
    xl, yt = hole(bx, by, col_l, row_t)
    xr, _ = hole(bx, by, col_r, row_t)
    _, yb = hole(bx, by, col_l, row_b)
    mid = (xl + xr) / 2
    bw, bh = 56, 40
    t = (yt + yb) / 2 - bh / 2
    o = ['  <g class="bb-part">']
    a = o.append
    for x, y, sx, sy in ((xl, yt, mid - 28, t + 9), (xr, yt, mid + 28, t + 9),
                         (xl, yb, mid - 28, t + bh - 9), (xr, yb, mid + 28, t + bh - 9)):
        a('  <path d="M%g %g L%g %g L%g %g" class="wk-leg-w"/>' % (x, y, sx, y, sx, sy))
    a('  <rect x="%g" y="%g" width="%g" height="%g" rx="3" class="wk-btn-frame"/>' % (mid - bw / 2, t, bw, bh))
    a('  <rect x="%g" y="%g" width="%g" height="%g" rx="2" class="wk-btn-face"/>'
      % (mid - bw / 2 + 4, t + 4, bw - 8, bh - 8))
    for cx in (mid - 20, mid + 20):
        for cy in (t + 7, t + bh - 7):
            a('  <circle cx="%g" cy="%g" r="2.2" class="wk-btn-screw"/>' % (cx, cy))
    a('  <circle cx="%g" cy="%g" r="13" fill="url(#wkcap)"/>' % (mid, t + bh / 2))
    a('  </g>')
    return '\n'.join(o)


def wire(pts, cls, r=9):
    """A jumper. Wokwi draws each one twice -- a dark outline, then the colour
    on top -- with rounded corners; `.wkwire-o` is the outline."""
    d = _round_path(pts, r)
    return ('  <path d="%s" class="wkwire-o"/>\n  <path d="%s" class="wkwire bbw %s"/>'
            % (d, d, cls))


def pad(pin, by_board=70):
    """Where a wire meets physical pin `pin` on the wk- Pico (CONTEXT SS7)."""
    x = 537 if pin <= 20 else 755
    y = by_board + 34 + ((pin - 1) if pin <= 20 else (40 - pin)) * P
    return x, y


if __name__ == '__main__':
    print(board(32, 96))


def mark(bx, by, col, row_a, row_b, pad=11, cols=1, cls=''):
    """A translucent ring round part of the board, for the diagrams that teach
    the board itself. It is an annotation, not something on the board."""
    x, y1 = hole(bx, by, col, row_a)
    _, y2 = hole(bx, by, col, row_b)
    return ('  <rect x="%g" y="%g" width="%g" height="%g" rx="9" class="bb-mark %s"/>'
            % (x - pad, y1 - pad, pad * 2 + (cols - 1) * P, y2 - y1 + pad * 2, cls))


def leader(x1, y, x2):
    return '  <path d="M%g %g H%g" class="bb-lead"/>' % (x1, y, x2)
