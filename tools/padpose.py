#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pad a full-figure Pip pose onto pip-master.png's canvas.

Every full-figure pose that robot.js swaps in — pip-off, pip-glowing, and any
future one — has to be exactly pip-master's 420x557, or the swap resizes the
image and the page jumps under the student's cursor mid-animation. The poses do
not arrive that size: pip-glowing is 420x508, because the arms-out pose is
wider and shorter.

So pad rather than scale. Scaling would make him a different size from the
parts laid over the ghost. The figure is centred left-to-right and stood on the
floor — his feet land on the same row as pip-master's, which is the line the
eye actually tracks — and the spare rows go above his head.

    python3 tools/padpose.py pip-glowing.png [...]

Idempotent: a pose already at 420x557 is left alone.
"""
import os, sys
from PIL import Image

W, H = 420, 557
DOCS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'docs')


def pad(name):
    p = os.path.join(DOCS, 'img', name)
    im = Image.open(p).convert('RGBA')
    if im.size == (W, H):
        print('%-18s already %dx%d' % (name, W, H))
        return
    if im.width > W or im.height > H:
        raise SystemExit('%s is %dx%d, larger than the master %dx%d — '
                         'it needs re-rendering, not padding' % (name, im.width, im.height, W, H))
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    out.alpha_composite(im, ((W - im.width) // 2, H - im.height))
    out.save(p, optimize=True)
    print('%-18s %dx%d -> %dx%d, floor-aligned' % (name, im.width, im.height, W, H))


if __name__ == '__main__':
    names = sys.argv[1:] or ['pip-off.png', 'pip-glowing.png']
    for n in names:
        pad(n)
