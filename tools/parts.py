#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Cut pip-master.png into the fourteen parts, one per activity.

Every pixel belongs to exactly one part. The regions below are tried in
order and the first one that contains a pixel wins, so small details
(eyes, mouth, chest lamp) are listed before the big shapes that surround
them, and the body shell is the catch-all at the end. That ordering means
the parts always tile: no seam can leave a hole.

Cuts land on real joints, measured off the artwork rather than guessed: the
neck at its narrowest row (316), the hips at the last row before the one body
run starts splitting into two legs (462), and the arms as whatever falls outside the torso
ellipses. That is why a half-built Pip looks like a model kit rather than a
torn photograph. tools/parts.py prints the run structure if the artwork is
ever replaced and the joints move.
"""
import os, json
import numpy as np
from PIL import Image
from scipy import ndimage

W, H = 420, 557
DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')

def ell(cx, cy, rx, ry):
    return lambda x, y: ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1
def box(x0, y0, x1, y1):
    return lambda x, y: (x >= x0) & (x < x1) & (y >= y0) & (y < y1)
def rod(x0, y0, x1, y1, r):
    """A capsule along a segment — the aerial stalks are thin and diagonal, and
    a bounding box round one takes a wedge of the head dome with it."""
    dx, dy = x1 - x0, y1 - y0
    L = float(dx * dx + dy * dy)
    def f(x, y):
        t = np.clip(((x - x0) * dx + (y - y0) * dy) / L, 0, 1)
        return (x - (x0 + t * dx)) ** 2 + (y - (y0 + t * dy)) ** 2 <= r * r
    return f
def both(*fs):
    return lambda x, y: np.logical_and.reduce([f(x, y) for f in fs])
def either(*fs):
    return lambda x, y: np.logical_or.reduce([f(x, y) for f in fs])
def outside(f):
    return lambda x, y: ~f(x, y)
def mask(m):
    return lambda x, y: m[y, x]

# The head dome, used as a boundary rather than as a part, so the ear pods are
# cut along Pip's own curve instead of a straight line. It traces the crease
# where the pods meet the head, which is a few pixels either side of this
# ellipse all the way down the pods.
DOME = ell(210, 188, 124, 118)


def pod_band(alpha):
    """The rows the ear pods actually occupy, read off the artwork.

    DOME is only a good boundary where there is a pod to bound. Above and below
    the pods it narrows faster than the head does, so `outside(DOME)` is true of
    plain head shell — and because the ear ellipses are 140 rows tall and the
    pods are not, each ear came away with a broad crescent of dome attached.
    Kamil spotted it on the part sheet.

    The pods are the only thing that makes the head's silhouette bulge, so find
    the bulge: fit an ellipse to the silhouette's half-width per row, drop the
    rows that sit outside the fit, refit, and repeat. What is left is the head's
    own profile, and the rows that had to be dropped are the pods. Nothing here
    is a number to re-measure if the artwork changes.
    """
    H, W = alpha.shape
    def half(y):
        row = alpha[y] > 40
        if not row.any():
            return None
        lab, cnt = ndimage.label(row)
        sizes = [(lab == c).sum() for c in range(1, cnt + 1)]
        xs = np.where(lab == int(np.argmax(sizes)) + 1)[0]
        return float(max(210 - xs.min(), xs.max() - 210))

    # 92 is below the aerials, which are their own runs higher up; 300 is above
    # the neck, where the head stops being an ellipse and flares into the collar
    allrows = [y for y in range(92, 301) if half(y)]
    rows = [y for y in allrows if y <= 141 or y >= 250]
    from scipy import optimize
    fit = None
    for _ in range(6):
        ys = np.array(rows, float)
        hs = np.array([half(y) for y in rows], float)
        def resid(q):
            rx, cy, ry = q
            t = 1 - ((ys - cy) / ry) ** 2
            return rx * np.sqrt(np.clip(t, 0, None)) - hs
        fit = optimize.least_squares(resid, [150., 190., 140.],
                                     bounds=([100, 150, 100], [220, 240, 240])).x
        rx, cy, ry = fit
        new = []
        for y in allrows:
            t = 1 - ((y - cy) / ry) ** 2
            if half(y) - rx * np.sqrt(max(t, 0)) < 6:
                new.append(y)
        if new == rows:
            break
        rows = new
    band = [y for y in allrows if y not in rows]
    assert band, 'no ear-pod bulge found in the silhouette'
    return min(band), max(band) + 1


def legs_mask(alpha):
    """The two legs, cut where the body actually splits.

    The hip cut used to be a straight `box(0, 462, 420, 557)`, on the reasoning
    that 462 is the last row before the outline splits in two. It is — which
    means row 462 itself is still solid belly, and the box took it, along with
    the tongue of belly that hangs between the legs for a couple of rows below
    the split. That showed up as a bar of body shell bridging the two boots.

    So find the split instead of assuming it, and keep only what hangs from it:
    label everything below the first row that comes apart, and keep the pieces
    that reach the floor. The belly tongue does not, so it falls through to the
    shell where it belongs.
    """
    H, W = alpha.shape
    body = alpha > 40
    mid = slice(120, 300)          # the torso columns: the arms are outside them
    split = None
    for y in range(430, H):
        lab, cnt = ndimage.label(body[y, mid])
        if cnt >= 2:
            split = y
            break
    assert split, 'the legs never separate'
    m = np.zeros_like(body)
    m[split:] = body[split:]
    lab, cnt = ndimage.label(m, np.ones((3, 3)))
    keep = np.zeros_like(body)
    for c in range(1, cnt + 1):
        comp = lab == c
        if comp[H - 8:].any():     # it reaches the floor, so it is a leg
            keep |= comp
    return keep, split


def torso_mask(alpha):
    """The torso's true outline, read off the artwork.

    Guessed ellipses kept leaving a crescent of belly on the arms, because the
    belly is wider at the hips than any ellipse that also fits the chest. So
    trace it instead: in most rows the arms are their own runs of opaque pixels
    and the torso is simply the run containing the centre line. Between roughly
    y=328 and y=362 the hands overlap the chest and the whole row is one wide run —
    there the edges are interpolated across the gap from the clean rows either
    side. If the artwork is ever replaced this needs no numbers changed.
    """
    lo, hi = 316, 462
    left = {}
    right = {}
    for y in range(lo, hi):
        row = alpha[y] > 40
        if not row[210]:
            continue
        x0 = 210
        while x0 > 0 and row[x0 - 1]:
            x0 -= 1
        x1 = 210
        while x1 < W - 1 and row[x1 + 1]:
            x1 += 1
        if 60 < x1 - x0 < 180:     # a clean row: the arms are separate runs
            left[y], right[y] = x0, x1

    known = sorted(left)
    for y in range(lo, hi):
        if y in left:
            continue
        before = [k for k in known if k < y]
        after = [k for k in known if k > y]
        if not before or not after:          # outside the traced span
            left[y] = left[known[0]] if not before else left[known[-1]]
            right[y] = right[known[0]] if not before else right[known[-1]]
            continue
        a, b = before[-1], after[0]
        t = (y - a) / float(b - a)
        left[y] = left[a] + t * (left[b] - left[a])
        right[y] = right[a] + t * (right[b] - right[a])

    m = np.zeros((H, W), bool)
    yy, xx = np.mgrid[0:H, 0:W]
    for y in range(lo, hi):
        m[y] = (xx[y] >= left[y] - 1) & (xx[y] <= right[y] + 1)
    return m


# n, key, label, verb, region  (first match wins)
def parts_list(TORSO, LEGS, PODLO, PODHI):
  return [
    (12, 'radiotip',  'Radio tip',     'tuned in',         ell(56, 17, 22, 22)),
    (13, 'databeacon','Data beacon',   'powered up',       ell(362, 17, 22, 22)),
    (10, 'aerialL',   'Left aerial',   'raised',           rod(70, 34, 97, 81, 8)),
    (11, 'aerialR',   'Right aerial',  'raised',           rod(348, 34, 322, 81, 8)),
    ( 7, 'eyes',      'Eyes',          'lit up',           either(ell(141, 183, 56, 66), ell(277, 183, 56, 66))),
    ( 6, 'smile',     'Smile',         'switched on',      ell(208, 250, 34, 26)),
    ( 8, 'earL',      'Left ear pod',  'clipped on',       both(ell(86, 192, 62, 70), outside(DOME),
                                                             box(0, PODLO, 210, PODHI))),
    ( 9, 'earR',      'Right ear pod', 'clipped on',       both(ell(336, 192, 62, 70), outside(DOME),
                                                             box(210, PODLO, 420, PODHI))),
    ( 1, 'chestlamp', 'Chest lamp',    'lit',              ell(210, 345, 23, 12)),
    ( 5, 'head',      'Head dome',     'seated',           box(0, 0, 420, 316)),
    ( 3, 'servoarm',  'Servo arm',     'bolted on',        both(box(0, 316, 212, 462), mask(~TORSO))),
    ( 4, 'buttonarm', 'Button arm',    'fitted',           both(box(212, 316, 420, 462), mask(~TORSO))),
    ( 0, 'legs',      'Legs and boots','bolted on',        mask(LEGS)),
    ( 2, 'shell',     'Body shell',    'clicked together', lambda x, y: np.ones(x.shape, bool)),
]

def cut():
    im = Image.open(os.path.join(DOCS, 'img', 'pip-master.png')).convert('RGBA')
    assert im.size == (W, H), im.size
    a = np.asarray(im)
    alpha = a[..., 3]
    yy, xx = np.mgrid[0:H, 0:W]
    TORSO = torso_mask(alpha)
    LEGS, split = legs_mask(alpha)
    PODLO, PODHI = pod_band(alpha)
    print('measured: hips split at row %d, ear pods span rows %d-%d'
          % (split, PODLO, PODHI - 1))

    taken = np.zeros((H, W), bool)
    out = {}
    for n, key, label, verb, region in parts_list(TORSO, LEGS, PODLO, PODHI):
        m = region(xx, yy) & ~taken
        taken |= m
        m = m & (alpha > 0)
        out[n] = [key, label, verb, m]

    # A cut through a curve shaves fragments off a neighbour and leaves them
    # floating in the wrong part's picture. Hand every fragment to whichever
    # part surrounds it, so each part is one solid piece and the fourteen still
    # tile the original exactly.
    #
    # The threshold is a proportion of the part's own body, not the flat 30 px
    # it was until 14 Sep 2026. The flat number was tuned on two-pixel specks
    # and let the real offender through: each arm came away carrying two
    # crescents of belly, 38-70 px, from the rows where torso_mask interpolates
    # across the hands. They are invisible on a finished Pip and obvious on a
    # part bay showing the arm on its own. 2% of the main body catches them;
    # the eyes, which are genuinely two halves of one part at 50% each, are
    # nowhere near it. The 30 px floor stays for parts small enough that 2%
    # would round away to nothing.
    for n in out:
        key, label, verb, m = out[n]
        lab, cnt = ndimage.label(m, np.ones((3, 3)))
        if cnt < 2:
            continue
        sizes = ndimage.sum(m, lab, range(1, cnt + 1))
        limit = max(30, 0.02 * sizes.max())
        for c in range(1, cnt + 1):
            if sizes[c - 1] >= limit:
                continue
            crumb = lab == c
            # Grow the ring until it reaches another part: a fragment can sit a
            # pixel or two clear of everything around it, and a fragment whose
            # only neighbour is its own part (an antialiased speck that simply
            # is not 8-connected to the body) is already where it belongs and
            # is left alone.
            best, score = None, 0
            for r in (7, 11, 15):
                ring = ndimage.binary_dilation(crumb, np.ones((r, r))) & ~crumb
                for k in out:
                    if k == n:
                        continue
                    v = int((out[k][3] & ring).sum())
                    if v > score:
                        best, score = k, v
                if best is not None:
                    break
            if best is None:
                continue
            print('   moved %d px from %s to %s' % (sizes[c - 1], key, out[best][0]))
            out[n][3][crumb] = False
            out[best][3][crumb] = True
    return im, out

if __name__ == '__main__':
    im, parts = cut()
    d = os.path.join(DOCS, 'img', 'parts')
    os.makedirs(d, exist_ok=True)
    a = np.asarray(im)
    meta = {}
    for n in sorted(parts):
        key, label, verb, m = parts[n]
        b = a.copy()
        b[..., 3] = np.where(m, b[..., 3], 0)
        t = Image.fromarray(b, 'RGBA')
        bb = t.split()[3].getbbox()
        t = t.crop(bb)
        p = os.path.join(d, 'pip-p%d.png' % n)
        t.save(p, optimize=True)
        meta[n] = dict(key=key, label=label, verb=verb,
                       x=round(bb[0] / W * 100, 3), y=round(bb[1] / H * 100, 3),
                       w=round((bb[2] - bb[0]) / W * 100, 3),
                       h=round((bb[3] - bb[1]) / H * 100, 3))
        print('%2d %-14s %-16s %4d KB  box %s' % (n, key, label,
              os.path.getsize(p) // 1024, bb))
    json.dump(meta, open(os.path.join(d, 'parts.json'), 'w'), indent=1)

    # The whole point is that the fourteen add back up to Pip. Stack them and
    # compare against the original: any drift here would show on the site as a
    # seam or a hole, so it is an error, not a warning.
    comp = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    for n in sorted(meta, key=int):
        m = meta[n]
        comp.alpha_composite(Image.open(os.path.join(d, 'pip-p%s.png' % n)),
                             (round(m['x'] / 100.0 * W), round(m['y'] / 100.0 * H)))
    ref = Image.open(os.path.join(DOCS, 'img', 'pip-master.png')).convert('RGBA')
    A = np.asarray(comp).astype(int)
    B = np.asarray(ref).astype(int)
    # RGB under a fully transparent pixel is meaningless and differs harmlessly,
    # so compare the alpha everywhere and the colour only where there is any
    seen = B[..., 3] > 0
    drift = max(int(np.abs(A[..., 3] - B[..., 3]).max()),
                int(np.abs(A[..., :3] - B[..., :3])[seen].max()))
    assert drift == 0, 'the parts no longer reassemble into pip-master (drift %d)' % drift
    print('the fourteen parts reassemble into pip-master exactly')
    print('total %d KB' % (sum(os.path.getsize(os.path.join(d, f))
                              for f in os.listdir(d) if f.endswith('.png')) // 1024))
