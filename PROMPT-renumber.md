```markdown
# PROMPT — renumber the site to match the Google Classroom

This is a separate job from building an activity. Do it in its own chat, when no other
chat is working in the clone, and when Kamil is around to push straight afterwards.

---

I want you to renumber my teaching website so its activity numbers match the Google
Classroom the students actually use.

**The site:** https://ump-stemlab.github.io/pico-iot-module/
**The repo:** https://github.com/ump-stemlab/pico-iot-module — cloned on my machine at
`STEM LAB/Github Repo/pico-iot-module/`. Work directly in that folder; I push from GitHub
Desktop.

**Read `CONTEXT.md` §1.1 first.** It has the mapping table and it is the authority. In
short:

| Classroom | Title | Is currently |
|---|---|---|
| 0 | Getting Started | not built |
| 1 | Light Up an LED | `activity-1.html` |
| 2 | Make an LED Blink | `activity-2.html` |
| 3 | Digital Output / Servo | not built |
| 4 | Digital Input | `activity-3.html` |
| 5 | Making Decisions | `activity-4.html` |
| 6 | Advanced Logic (And, Or, Not) | `activity-5.html` |
| 7 | Words on a Screen | `activity-6.html` |
| 8 | Motion Sensing (Sensors and Numbers) | `activity-7.html` |
| 9 | Soil Moisture | `activity-9.html` if built by then |
| 10 | Wi-Fi Connectivity (Internet and Data) | `activity-8.html` |
| 11 | Control From Anywhere | `activity-11.html` — already correct |
| 12 | Radio Communication | not built |

**Check the table against the Classroom PDF and against what is actually in `docs/` before
you move a single file.** If Soil Moisture has been built in the meantime it is already at
9 and does not move; if it has not, slot 9 stays empty.

**What has to change, and none of it can be skipped:**

1. **Rename the files.** `activity-N.html` and `teacher-N.html` together, and rename them
   in an order that does not overwrite anything — go from the highest number down, or rename
   via temporary names. Getting this wrong silently destroys a page.
2. **Every link.** `href="activity-N.html"` and `href="teacher-N.html"` in every page's nav,
   footer, hero buttons, teacher-page cross-links, `teacher.html`'s table, `index.html`'s
   activity list, and `README.md`'s two tables.
3. **Every mention in the prose**, and this is the part that will bite. The pages refer to
   each other constantly — "Activity 6's rule, unchanged", "as in Activity 1", "Activity 3's
   inversion", "you need Activities 1 to 7 first", "Next up — Activity 9". Grep for
   `Activity <digit>` across `docs/` and `CONTEXT.md` and check **every hit by hand**. Some
   are numbers that must change; some are not (a `sleep` of 5 seconds, `0.5`, address `0x76`).
   Do not do this with a blind regex.
4. **Anchors and deep links.** `activity-6.html#bus`, `activity-6.html#library`,
   `activity-7.html#numbers` and friends. The anchor names stay; the filenames move.
5. **`robots.txt`** — it already lists `teacher-1` to `teacher-12`, so it should need no
   change, but check.
6. **Redirects.** Leave a one-line HTML page at every old filename that now means something
   different, pointing at the new one, so links already given to students still land. A
   `<meta http-equiv="refresh">` with a visible sentence and a link is enough. **This is the
   important one:** without it `activity-3.html` silently becomes a *different activity*,
   which is worse than a 404. Kamil chose redirects over a clean break.
7. **Slots 0 and 3** — Getting Started and Digital Output / Servo. They stay "coming soon"
   tiles on `index.html` and rows in `README.md` until those pages exist. Both have decks in
   `Module Revamp/PPTX`.
8. **`index.html`'s note** about the numbering being brought into line comes *out* once the
   numbering is right. So does `README.md`'s "(Internet and Data moves here)" row.
9. **`CONTEXT.md`** — §1.1's table loses its "currently" column and becomes a plain list, and
   §7's per-activity headings renumber with everything else. Every "Activity N" in the prose
   of that file needs the same hand-check as the pages.
10. **The `data-p` progress keys and `localStorage`.** Check how `activity.js` keys a page's
    saved progress. If it is keyed by filename, every student's ticked boxes move with the
    rename and that is fine; if it is keyed by something else, say so before you rename
    anything, because losing a class's progress mid-module is not acceptable.

**Verify afterwards, and be thorough about it:**

- Every internal link resolves. Crawl `docs/` and check every `href` that is not external
  against the files on disk. Zero broken links, including from the redirect stubs.
- Every page still passes the §8.1 checks: `.codeimg` all become canvases, the progress bar
  counts, the quiz renders, no console errors, no horizontal overflow at 390 px, both themes.
- No page says "Activity N" where N is now wrong. Read the hero, the "you need Activities 1
  to N first" callout, the quiz-win line and the teacher pages' link tables on every page.
- `README.md` and `index.html` agree with each other and with `CONTEXT.md` §1.1.

**Do not** renumber halfway and stop. A site where some pages have moved and some have not
is worse than either end state. If you cannot finish, revert.

**Publishing:** write the finished files into the clone, give me a list of what moved where,
and I push from GitHub Desktop.
```
