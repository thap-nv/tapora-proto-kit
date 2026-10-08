# New round on the same concept board

> Read when: at Gate 2 the user picks *Not there yet, new round* · or the prototype folder already has `concept/concepts.js` or `concept/boards.js` (re-entry, SKILL.md §3).
> A new round **adds** concepts to the same board. Screens, images and data of earlier rounds stay; no new folder.
> The reading is done in one turn by SKILL.md §3 *Re-entry*: this file, `concept/concepts.js` and `DECISIONS.md` with `Read` (steps 2–3 edit both, and `Edit` needs the file read; do not `cat` them, or you read them twice), plus one command that refreshes the templates and prints the `concept-method.md` sections a round uses, the style family index and the role map of every screen. Arriving here from Gate 2 in the same session, you already have the files and the method: run only the role map, `node <skills>/sketch-to-concept/scripts/roles.mjs concept/`. Do not reread the requirements, do not rerun `search.py`, do not open templates or the sample file: the block to write is in step 3.
> Talk to the user in their language; write `DECISIONS.md` and the note in `rounds` verbatim.
> **Several boards** (`concept/boards.js`, one per portal): a round runs per board, so `concept/` below means `concept/<dir>/`, except `check.mjs concept/`, which checks every board. New ids never repeat an id of another board.

## 1. Where you are

| Where | Do |
|---|---|
| Board exists, Gate 2 not closed | Do §2 |
| Concept chosen, `CONCEPT.md` exists, no prototype yet | Reopen Gate 2 (stop rule: changing what a gate locked reopens that gate), then do §2. A different concept chosen: rewrite `CONCEPT.md`; the old concept moves to its §6 *Concept không chọn* |
| A `sketch-to-site` prototype exists | Do §2 as above. A new concept that changes only the form layer: copy colours and type into `themes.json` per `CONCEPT.md` §3, with `tweak-site`. Changing the screen or the idea means rebuilding layouts, the job of `evolve-site`: ask the user first |

## 2. Steps

**The templates are refreshed** by the *Re-entry* command (projects built before 1.4 have an old board and `tokens.js` that do not know rounds or borrowed screens): `cp`, without opening, `<skills>/sketch-to-concept/templates/concept-board.html` → `concept/index.html`; `<skills>/sketch-to-concept/templates/tokens.js` and `<skills>/sketch-to-site/templates/color.js` → `concept/`. Do not touch `concepts.js`, `theme.js` (its `KEY` is already changed), screens or images.

1. **Ask once, two questions** with `AskUserQuestion` (skip any the user already answered, and record the source):
   - *Which layers miss?* multi-select: Idea · Layout · Colour · Type and shape.
   - *Which concept is closest?* up to 3 concepts that have their own screen, plus *None*.
2. **Record** the feedback verbatim in `DECISIONS.md` (Gate 2, the *Vòng n* line) and add `{ n, note }` to `CONCEPTS.rounds`.
3. **Plan the round.** Take directions from *Hướng chưa dùng* in `DECISIONS.md` first, then think of more (`concept-method.md` §2.5):
   - only Colour, Type and shape miss → 2–3 **data-only** concepts: new blocks in `concepts.js`, with `screen` pointing to the closest concept (none: the recommended one). Copy `axes.khung`, `axes.yTuong`, `axes.khoanhKhac` from it; write your own `nen`, `chatNen`, `chu`, `why`. Idea, metaphor, form and signature interaction belong to the borrowed screen: leave them out, the board shows that concept's. No HTML. The block:
     ```js
     { id: '<id>', name: '', round: <n>, screen: '<borrowed screen id>',
       source: { kind: '', ref: '' },   // kind, one of: hợp nhất · chuẩn thật · lăng kính studio (in the user's language); ref: the family, product or studio
       family: '', dial: '',            // from `grep -E '^### |^- \*\*(Cue words|Dial):' <skills>/sketch-to-site/references/style-catalogue.md`: family name without the number and the italic English part; dial as V/M/D
       axes: { khung: '<copy>', yTuong: '<copy>', khoanhKhac: '<copy>', nen: '', chatNen: '', chu: '' },
       colors: { light: { /* every role the borrowed concept has */ } },   // ONE palette; a dark concept declares dark
       fontFamily: { display: '', body: '', mono: '' }, fontWeights: { display: '', body: '', mono: '' },
       shape: { radius: { sm: '', md: '', lg: '' }, shadow: '', borderWidth: '', texture: '' },
       why: { mau: '', chu: '', hinh: '', chatNen: '' } },
     ```
     Which colour role the borrowed screen paints where, which weights its type roles use, where radius, shadow and texture sit: the role map printed at re-entry (one screen: `node <skills>/sketch-to-concept/scripts/roles.mjs concept/ <borrowed screen id>`). Choose colours for what each role paints there. A font for a type role must have the weights the map lists for that role: a role the screen sets at 600 or more needs a font with such a weight, listed in `fontWeights`, or the browser fakes the bold (`check.mjs` reports *đậm giả*; the borrowed screen cannot be changed).
     New fonts: one command for every kind you change: repeat `--vi-fonts <kind>` with no keyword, which prints every Vietnamese-capable font of that kind, alphabetical, with the weights of fonts that have no bold; choose by name and letterform (`concept-method.md` §5.2). Fonts from that list support Vietnamese, no `--font` check; fonts from elsewhere are checked by `check.mjs` below. A font listed without `[ ]` has a weight of 600 or more: no `--font` call to learn its weights. In `fontWeights`, list the weights the role map shows, and add 700 to a role set at 600: the browser draws 600 with 700 when the font has no 600. A weight the font lacks is skipped, and `check.mjs` reports *đậm giả* when no loaded weight reaches 600.
   - the Idea or Layout misses → 1–3 concepts with new screens, per `vong-dau.md` A3 steps 3–5 (score the idea on the data, build, shoot, check).
   - ids continue in order: round 1 was a, b, c, so round 2 starts at d. Every concept has `round: <n>`.
   Then check the round's draft (data, contrast, `why`, axes against every concept on the board, the 60° / 0.3 colour rule, fonts, faux bold on the borrowed screen). Data-only round: go straight to the command of step 6, `node <skills>/sketch-to-concept/scripts/check.mjs concept/ --round <n> --shots`, which runs this check first; a separate check costs a turn. A round with new screens checks the draft before building: `node <skills>/sketch-to-concept/scripts/check.mjs concept/ --round <n>`. Fix until `0 lỗi`; do not probe colours with `node -e`.
4. **Differ from every concept already on the board**, earlier rounds included: *So trục* and `check.mjs` compare every pair. A pair sharing one screen differs on at least 2 of the 3 axes background, texture, type personality (`concept-method.md` §4).
5. **Do not touch** screens, images or data blocks of earlier rounds. If the recommendation changes, only move `recommended` to the new concept, so exactly one concept has it. Moving `recommended` changes no screen: done after the shots of step 6, no reshoot.
6. **Self-check** as in A3 step 5, one command: `node <skills>/sketch-to-concept/scripts/check.mjs concept/ --round <n> --shots`. It reruns the data check, then `preflight.py` on the folder (0 errors; a font without Vietnamese is P07), then `shots.mjs --round <n>` for the new round only. Fix until the last line is `→ 0 lỗi`. No dark-mode shots unless the user asked.
   - Data-only concepts: the borrowed screen was checked in its own round, so open only the 1440 image and the signature image (`-1440-sig`) of each new concept, plus the board image, all in one turn. Open a 390 image only when its line reports a problem. Make every fix in one turn, rerun the command once, and reopen only the images of the concepts you changed.
   - Concepts with new screens: open all images as in A3 step 5.
7. **Reopen Gate 2** (SKILL.md). The recommended and second options come from every round, not only the new one.
