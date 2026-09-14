#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Recover transparency from the checkerboard-flattened JPEGs.

The renders came back as JPEG, so the alpha channel was baked into a visible
20-pixel checkerboard of white and #CECECE. This puts it back:

  1. mark every pixel that looks like checker — near-grey (R, G and B within a
     few points of each other) and light;
  2. flood that mask inward from the border, so only background connected to
     the edge is removed. Pip's own white shell and his grey metal joints are
     surrounded by him, so they survive;
  3. feather the resulting edge by a pixel and bleed his colour outward, so no
     checker grey survives as a rim on a coloured page.
"""
import io, os, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = '/root/.claude/uploads/3afd6e71-e66a-5d85-85ef-c3ee4f1dd91e/'
OUT = os.path.dirname(os.path.abspath(__file__))

POSES = [
    ('696575ef-image.jpg', 'master',    'A-pose, arms out, hands open'),
    ('60bf35e5-image.jpg', 'stand',     'standing, arms down'),
    ('7e0fa7e3-image.jpg', 'wave',      'waving'),
    ('bc93a16e-image.jpg', 'cheer',     'both arms up'),
    ('60702ef8-image.jpg', 'lit',       'arms wide, everything glowing'),
    ('d6fd1dc0-image.jpg', 'thumbsup',  'thumbs up'),
    ('5faca0a1-image.jpg', 'thinking',  'finger to chin'),
    ('d1879a05-image.jpg', 'magnifier', 'peering through a magnifier'),
    ('c112c7da-image.jpg', 'led',       'holding a lit red LED'),
    ('806a8c25-image.jpg', 'servo',     'holding a servo motor'),
    ('d92c8065-image.jpg', 'sitting',   'sitting, legs out'),
]


CHECK_LIGHT = 255.0      # the checkerboard's two tones, measured
CHECK_DARK = 206.0

def bg_mask(grey, sat):
    """Find the checkerboard without caring where its squares fall.

    Over any window wider than one square, the checkerboard always has the
    same signature: a mean halfway between its two tones and a large, very
    specific spread. Pip's shell is smooth, so its spread is near zero, and
    his edges have the spread but not the mean. Matching the signature rather
    than a drawn model means the squares' phase never has to be worked out —
    an earlier attempt did draw the model, and its phase drifted across the
    frame and left checker behind.
    """
    W = 25
    m = ndimage.uniform_filter(grey, W)
    m2 = ndimage.uniform_filter(grey * grey, W)
    sd = np.sqrt(np.maximum(m2 - m * m, 0))
    mid = (CHECK_LIGHT + CHECK_DARK) / 2.0
    spread = (CHECK_LIGHT - CHECK_DARK) / 2.0
    return ((np.abs(m - mid) < 9) & (np.abs(sd - spread) < 9)
            & (ndimage.uniform_filter(sat, 9) < 14))


def cut(path):
    im = Image.open(path).convert('RGB')
    a = np.asarray(im).astype(np.float32)
    grey = a.mean(2)
    sat = a.max(2) - a.min(2)

    bg = bg_mask(grey, sat)

    # keep only background that reaches the frame edge
    lab, n = ndimage.label(bg)
    edge = set(lab[0, :]) | set(lab[-1, :]) | set(lab[:, 0]) | set(lab[:, -1])
    edge.discard(0)
    bg = np.isin(lab, list(edge))

    # Pip is the one big thing that is left; everything else at this stage is
    # JPEG speckle in the background, and dilating it would spray blobs across
    # the frame
    fg = ndimage.binary_fill_holes(~bg)
    lab, n = ndimage.label(fg)
    if n:
        sizes = ndimage.sum(fg, lab, range(1, n + 1))
        fg = lab == (int(np.argmax(sizes)) + 1)
    fg = ndimage.binary_fill_holes(fg)

    # The window test pulls the outline in by about half a window, so refine
    # the boundary one pixel at a time: grow Pip out from a safe core, through
    # anything that is not checker-coloured, but no further than the coarse
    # silhouette plus a margin.
    core = ndimage.binary_erosion(fg, np.ones((3, 3)), iterations=5)
    reach = ndimage.binary_dilation(fg, np.ones((3, 3)), iterations=20)
    checker = ((sat < 16) &
               ((np.abs(grey - CHECK_LIGHT) < 13) | (np.abs(grey - CHECK_DARK) < 13)))
    solid = ndimage.binary_propagation(core, mask=(reach & ~checker))

    # A ragged band of checker still clings to his outline, where JPEG ringing
    # knocked those pixels off the two exact tones. Catch it at fine scale —
    # checker keeps its big local spread even in a 9-pixel window, while Pip's
    # shell is smooth — and never cut into the core.
    m9 = ndimage.uniform_filter(grey, 9)
    s9 = np.sqrt(np.maximum(ndimage.uniform_filter(grey * grey, 9) - m9 * m9, 0))
    fringe = (sat < 18) & (s9 > 13) & (m9 > 196) & (m9 < 252)
    solid = solid & ~(fringe & ~core)

    # a morphological opening drops the last dotted squares, which hang off him
    # by a pixel or two; the aerial stalks are thicker than that and survive
    solid = ndimage.binary_opening(solid, np.ones((5, 5)))
    solid = ndimage.binary_closing(solid, np.ones((3, 3)))
    lab, n = ndimage.label(solid)
    if n:
        sizes = ndimage.sum(solid, lab, range(1, n + 1))
        solid = lab == (int(np.argmax(sizes)) + 1)
    solid = ndimage.binary_fill_holes(solid)

    solid = ndimage.binary_erosion(solid, np.ones((3, 3)))
    # ---- un-composite the soft edge -------------------------------------
    # Pip's rim light and glow were blended with the checkerboard before the
    # JPEG flattened it, so those pixels are a mix and no mask can separate
    # them. But the mix is measurable: where a pixel is (1-a) checker, the
    # checker's 49-point light/dark swing survives at (1-a) strength. Read the
    # local swing and the transparency falls out of it.
    lo = ndimage.minimum_filter(grey, 21)
    hi = ndimage.maximum_filter(grey, 21)
    swing = np.clip(hi - lo, 0, CHECK_LIGHT - CHECK_DARK)
    a_cont = np.clip(1.0 - swing / (CHECK_LIGHT - CHECK_DARK), 0, 1)

    core = ndimage.binary_erosion(solid, np.ones((3, 3)), iterations=3)
    band = ndimage.binary_dilation(solid, np.ones((3, 3)), iterations=14) & ~core

    alpha = np.where(core, 1.0, 0.0)
    alpha = np.where(band, a_cont, alpha) * 255.0

    # and take the checkerboard back out of the colour that is left
    mid = (CHECK_LIGHT + CHECK_DARK) / 2.0
    m21 = ndimage.uniform_filter(a, 21)
    aa = np.clip(alpha[..., None] / 255.0, 0.12, 1.0)
    unmixed = np.clip((m21 - (1.0 - aa) * mid) / aa, 0, 255)
    a = np.where(band[..., None] & (alpha[..., None] < 250), unmixed, a)

    am = Image.fromarray(alpha.astype('uint8'), 'L').filter(ImageFilter.GaussianBlur(0.7))
    alpha = np.asarray(am).astype(np.float32)
    alpha[alpha < 14] = 0

    # bleed Pip's colour into the soft edge so no checker grey survives as a rim
    inside = alpha > 215
    idx = ndimage.distance_transform_edt(~inside, return_distances=False,
                                         return_indices=True)
    bled = a[tuple(idx)]
    rgb = a.copy()
    soft = (alpha > 0) & (alpha <= 215)
    rgb[soft] = bled[soft]

    img = Image.fromarray(np.dstack([rgb, alpha]).astype('uint8'), 'RGBA')
    return img.crop(img.split()[3].getbbox())


if __name__ == '__main__':
    made = []
    for src, name, note in POSES:
        p = os.path.join(SRC, src)
        if not os.path.exists(p):
            print('missing', src); continue
        im = cut(p)
        w = 560
        im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        dst = os.path.join(OUT, 'pip-%s.png' % name)
        im.save(dst, optimize=True)
        made.append((name, im.size, os.path.getsize(dst) // 1024, note))
        print('%-10s %-12s %4d KB  %s' % (name, str(im.size),
                                          os.path.getsize(dst) // 1024, note))

    # proof sheet on teal — a surviving checker rim would be obvious
    cols, cw, ch = 6, 200, 240
    rows = (len(made) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * cw, rows * ch), (2, 110, 106))
    for i, (name, size, kb, note) in enumerate(made):
        t = Image.open(os.path.join(OUT, 'pip-%s.png' % name))
        t.thumbnail((cw - 16, ch - 16))
        x = (i % cols) * cw + (cw - t.width) // 2
        y = (i // cols) * ch + (ch - t.height) // 2
        sheet.paste(t, (x, y), t)
    sheet.save(os.path.join(OUT, 'cutout-check.png'))
    print('proof sheet written')
