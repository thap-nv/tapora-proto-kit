# Round one: A1 to A3

> Read when: the prototype folder has no `concept/concepts.js` (SKILL.md §3 *Start*). The stop rule, Gate 2 and the handover are in SKILL.md; language and paths as there.
> **Turns cost more than text** (SKILL.md §3): put independent commands in one turn.

### A1 · Read the core *(no questions)*

- **Read:** the user's words · the requirements doc, **only** its table of contents, overview or goals, personas and the **names** of functions · brand references (logo, colours, `DESIGN.md`).
- **Do not read** per-function specs, data fields or business rules: that is `sketch-to-site` B1, after the concept is chosen.
- **Count screen types** from function names: table, form, detail, intro… The most common type decides the key screen (A3).
- **Tools:** checked in the first turn (SKILL.md §3 *Start*).
- Write the **concept brief**, each line with its source (*người dùng nói · tài liệu, mục/dòng · đoán*):
  1. **Product:** type · platform · surfaces
  2. **Who:** main users · device · context of use
  3. **Main jobs:** 1–3 jobs · most common screen type (counted)
  4. **Difference:** what sets the product apart from competitors
  5. **Direction:** 3 words · likes · dislikes or bans
  6. **Constraints:** brand, required colours or fonts, references and how closely to follow them

### 🛑 Gate 1 · Concept brief

Echo the brief back, then ask **only the lines that are empty or guessed**, in one turn:

| Question | Suggested options |
|---|---|
| **Product type?** | Intro site / landing · E-commerce · Web app / operations tool · Portfolio · **Mobile app** · **Multi-surface system** (name each surface) |
| **App platform?** (only with an app) | iOS · Android · Both |
| **Main users and device?** | Visitors on phones · Shoppers on desktop · Staff on computers all day · Mixed |
| **References and how closely?** | Follow 100 % · A base to vary · Inspiration only · None (`<skills>/sketch-to-site/references/reference-intake.md` §1) |
| **Difference?** · **Direction?** | Offer 3 options derived from the brief; the user picks one or types in *Other*. **Never** make the user write the concept |

- At most 4 questions per turn. With an app and no platform yet, ask the platform in a short follow-up turn, still Gate 1.
- **Do not** ask scope (how many pages): that is Gate 3 of `sketch-to-site`, with the sitemap.
- With an app: read `<skills>/sketch-to-site/references/mobile-app.md` right after this gate.

### A2 · References and lookups

1. **References** (if any): follow `<skills>/sketch-to-site/references/reference-intake.md` → `REFERENCE-READ.md`. A **real brand**: verify with `WebSearch` and take assets from official sources (`<skills>/huashu-design/references/brand-asset-protocol.md`).
2. **Style families:** read the index of `style-catalogue.md` (name, cue words, fit, dial of the 12 families), then print only the families you use. Both commands are at the top of `<skills>/sketch-to-site/references/style-catalogue.md`: `grep -E '^### |^- \*\*(Cue words|Suits|Dial):' <skills>/sketch-to-site/references/style-catalogue.md`, then `awk '/^### (2|8|11)\./{f=1;print;next} /^#/{f=0} f' <skills>/sketch-to-site/references/style-catalogue.md` with your family numbers.
   **Two turns for steps 2–3:** one turn prints the index and the 20 web styles of `huashu-design` with their real products (`concept-method.md` §3): `awk '/^## .*\(20/{n++} n==1 && /^\*\*/{print; getline; print}' <skills>/huashu-design/references/design-styles.md`. Once the directions are drafted (step 4), one turn prints the chosen families and runs `search.py`, any `WebSearch` and the font list of every kind the directions need: repeat `--vi-fonts <kind>` in one command.
3. **Look up** (once, for the concept from the best-fit source):
   ```bash
   python <skills>/ui-ux-pro-max/scripts/search.py "<industry> <product type> <mood words>" --design-system --variance <V> --density <D> --motion <M> | sed -n '/COLORS/,/KEY EFFECTS/p'
   ```
   V/M/D come from the **Dial** line of the best-fit family. The `sed` keeps only the colours and the type pair: the full output also has pattern, motion and checklist sections the concept does not use, and gets cut off in the middle. The command returns the industry palette, which barely changes with the dial. An off-industry result is ignored; do not search again. Do not run it for the other concepts: their colours come from their own source (`concept-method.md` §5.1). For more type ideas, run `--domain typography -n 5` once.
   **Fonts:** `python <skills>/sketch-to-site/scripts/preflight.py --vi-fonts <kind>` with no keyword prints every Vietnamese-capable Google font of that kind, alphabetical, in a few lines (219 sans in about 3,600 characters; the other kinds 1,500 or less). A font without a weight of 600 or more shows the weights it has in brackets: it cannot carry bold text. Choose by name and letterform for the concept (`concept-method.md` §5.2), never a habitual or default body font; fonts from this list need no `--font` check. To narrow a kind by a tag, add `"<từ khoá>"`: an English word in the font name or in a tag that splits the list (tags on 75 % or more of a kind's fonts are skipped); mood words do not filter. A font from elsewhere (`search.py`, references, `huashu-design`) goes through `python <skills>/sketch-to-site/scripts/preflight.py --font "<name>"` before `concepts.js` (several names after one flag, or repeat `--font`); it prints the font's weights too. Satoshi, Cabinet Grotesk, Clash (Fontshare) and Outfit, Instrument Serif, Syne, DM Sans, Sora, Orbitron, Bodoni Moda, Archivo Black, Rajdhani (Google) have **no Vietnamese**. With an app: `--design-system` is written for landing pages; take only the palette as a hint (`mobile-app.md` §8).
4. **Choose the concepts** per `references/concept-method.md`:
   - spread **6–8 directions**, then pick the 3 furthest apart (§2.5); unused directions go to `DECISIONS.md`;
   - the three sources (best-fit, real benchmark, studio lens) are a toolbox, not slots (§3). No random draws. A real benchmark starts from the 20 styles of `huashu-design` and is verified with at most 2 `WebSearch` calls, no `WebFetch` (§3);
   - the idea grows from the **Difference** line and answers the 5 form questions (§2);
   - each pair differs on **≥ 3 axes** and **must differ in layout skeleton** (§4);
   - colour by the 3-step protocol (§5.1); every form choice has a reason (§5.4);
   - following a reference **100 %**: build only **one** concept from it (*Short paths* below).

### A3 · Build 3 concepts

1. **Copy the templates** into `<prototype>/concept/`. Templates marked *do not edit* are copied with `cp` and not opened: the CSS variable names are in the `<head>` of `key-screen.html`. In `theme.js`, change only the `KEY` line. In the same turn, print `sketch-to-site` §3 and §6 (anti-AI-slop, real data, images; SKILL.md §2): `sed -n '/^## 3\./,/^## 4\./p;/^## 6\./,/^## 7\./p' <skills>/sketch-to-site/SKILL.md`, and `Read` the templates you fill: `templates/concepts.js`, `templates/key-screen.html` and, when the prototype has no `DECISIONS.md` yet, the `DECISIONS.md` template (`<skills>/sketch-to-site/templates/DECISIONS.md`). These are not copied: steps 2 and 4 `Write` new files from them, and writing a new file needs no earlier `Read`. Copying them first costs a turn to read the copies.

   | Template | Becomes |
   |---|---|
   | `templates/concept-board.html` | `concept/index.html` (do not edit) |
   | `templates/concepts.js` | `concept/concepts.js` (empty skeleton, every field annotated): not copied; `Read` it, then `Write` the filled file |
   | `templates/tokens.js` | `concept/tokens.js` (do not edit) |
   | `<skills>/sketch-to-site/templates/color.js` | `concept/color.js` (do not edit; tokens.js needs it) |
   | `templates/key-screen.html` | `concept/a.html`, `b.html`, `c.html` (change `data-concept`): not copied; one `Write` per screen |
   | `<skills>/sketch-to-site/templates/theme.js` | `concept/theme.js`: change `KEY` to `<slug>-concept`, so the light/dark choice on this board does not leak into another project's board opened from `file://` |
   | `<skills>/sketch-to-site/templates/mobile/app.css`, `app.js` (only with an app) | `concept/app.css`, `concept/app.js`. App screens follow `mobile/screen.html` with the token `<head>` of `key-screen.html`; `tokens.js` emits the variable names `app.css` reads (`--bg`, `--ink`, `--accent`, `--brand-font`…) |

2. **Write `concept/concepts.js`:** fill the skeleton (brief, shared content, `rounds`, concepts); first-round concepts have `round: 1`. Each concept has the full idea layer: `idea`, `metaphor`, `formFrom` (form question 5, `concept-method.md` §2.3), `signature`, `axes`, and form reasons in `why` (§5.4). On the subagent path (step 4) write only the brief and shared content now, with `concepts: []`: each subagent writes its concept to its own file and the main agent merges them. `id`: lowercase a-z, digits, hyphen. Colours in hex, **one** palette per concept; fonts in `fontFamily: { display, body, mono }`, the only three roles. An app with body text in the platform font (SF Pro, Roboto): `body: 'system-ui'`.
   **Check the draft and print the scorer's prompt in one command:** `node <skills>/sketch-to-concept/scripts/check.mjs concept/; sed -n '/^## 2\./,$p' <skills>/sketch-to-concept/references/subagent-prompts.md`. It reports data errors, failing colour pairs (derived roles included), missing `why`, pairs too close on the axes, fonts without Vietnamese, and notes two chromatic colours closer than 60° hue and 0.3 lightness; the prompt is for step 3. Fix until `0 lỗi`. Do not probe colours with `node -e` or check fonts one by one.
3. **Score the idea layer on the data**, before building screens: score each concept per `concept-method.md` §7, using only its block in `concepts.js`. If the session can create subagents, give this to a subagent that **did not write** the data, prompt in `references/subagent-prompts.md` §2 (printed in step 2): it reads only `concepts.js` and §7, so it is cheap. Use a read-only agent type when the harness has one (Claude Code: `Explore`): it starts with a smaller context than a general-purpose agent (measured: 23k against 37k tokens). Call it in the foreground and wait for the result, not in the background: step 4 needs the scores, and waiting on a background agent means reloading the whole context when it returns. Otherwise score yourself. A concept ≤ 5/10 gets its idea fixed in `concepts.js` along the reviewer's direction: editing text is far cheaper than rebuilding a screen. After fixing, do not re-score on the data: the image check in step 5 will catch it. Subagent path: each subagent scores its own block before building (prompt §1). Record scores and who scored in `DECISIONS.md` (Gate 2).
   In the next turn after the scores, fix the ideas and write the three screens of step 4 together: one message.
4. **Build the key screens** (`concept-method.md` §6):
   - **who builds:** by default one agent writes **the three screens in one turn**: one message with the `Edit` calls that fix ideas after scoring and one `Write` per screen. Each screen follows only the brief and its own block in `concepts.js`, with the skeleton in its `axes.khung`, never the layout of the screen written before it. Subagents build only when the user asks for parallel builds in this session: at most 3 subagents, one concept each, prompt in `references/subagent-prompts.md` §1. Each subagent gets only the brief, the shared content and its own assignment (source, style family, axes chosen in A2). The main agent merges the blocks into `concepts.js`, then deletes the `{id}.concept.js` files and their script lines in `{id}.html` (prompt §1). This path costs much more: every subagent reloads the base context and the docs, and parallel subagents easily hit the plan's session limit;
   - **same screen, same content** (`CONCEPTS.content`): the user compares concepts, not content;
   - **different layout skeleton**, exactly as declared in `axes.khung`;
   - the signature interaction **is clickable**, with `data-signature` on its block (as in the template);
   - **budget:** the first screen plus the signature block, plus at most one section when the idea needs it; no footer, no repeated sections; about **10 KB** per file including script. Content stays real. Everything else is never screenshotted, 2 of 3 screens are dropped at Gate 2, and `sketch-to-site` rebuilds the chosen one. `shots.mjs` adds *dài: …* to the 1440 line of a screen over budget;
   - **giant type** (a display word, one giant number): size it with `clamp()` in `vw`, never a fixed size, and check it at 390 in your head before shooting: a word of n characters fits when its size there is at most 350 / (0.6 × n) px (350 = 390 minus side padding; 0.7 instead of 0.6 for wide or heavy faces). Measured in 1.4: fixed giant sizes cost round 1 three reshoots;
   - **bold text** (`font-semibold` or heavier, or a CSS weight of 600 or more) only on a type role whose font has such a weight and lists it in `fontWeights`; otherwise the browser fakes the bold, and `check.mjs` reports *đậm giả*;
   - replace the template's `<body>` with the real screen, content written straight into the HTML, `<head>` unchanged. Write each screen with **one** `Write`; fix it afterwards with `Edit`, never rewrite the whole file;
   - app: build on `<skills>/sketch-to-site/templates/mobile/screen.html`; multi-surface: each concept builds the key screen of **every** surface.
5. **Self-check**, all of it before Gate 2:
   - one command: `node <skills>/sketch-to-concept/scripts/check.mjs concept/ --shots`. It reruns the data check (now against the built screens too: *đậm giả*), then `preflight.py` on the folder (0 errors needed), then `shots.mjs`: the board at 1440, each screen at 1440 and 390, plus a close-up of each screen's `data-signature` block, into `concept/shots/`. Each image prints one line of measurements: horizontal overflow, clipped text, contrast, wrong action colour (a destructive label such as delete, remove or cancel an order painted in `--primary`, or an affirmative one such as save, send or order painted in `--destructive`), console errors. The `index.html` line also reports the board's state (data errors, sample-data banner, axis warnings, failing pairs, concepts without form reasons, concepts over rounds), so there is no need to open the board's DOM. Fix until the last line is `→ 0 lỗi`. No dark-mode shots: `QA_QUERY="?theme=dark"` only when the user has asked for dark mode, and only for screens of concepts with both palettes (`shots.mjs concept/` with the files listed after the folder);
   - a screen whose line has `lỗi console` or `lỗi dữ liệu`: fix it and rerun before opening its images, since a broken script leaves the screen half drawn. Then **open all images of every concept in one turn**, exactly the files the lines list (do not shoot whole pages); then make **every fix in one turn** (several `Edit` calls in one message) and rerun the command once;
   - **check the idea layer on the images:** with text and logos covered, is the subject still recognisable; does the screen carry the motif written in `formFrom`? Also read the Vietnamese marks of the display type on the 1440 image: a hook above (ả) must not look like a grave (à), and marks on capitals (Ủ, Ỗ) must sit clear of the letter. `check.mjs` knows only the fonts already listed in `preflight.py`. A screen that lost the idea (≤ 5) is reworked **at most once**, with `Edit`. Still ≤ 5: stop reworking; present it at Gate 2 with the score and the reason, and the user decides.

Then 🛑 Gate 2 (SKILL.md).

### Short paths
- **Follow a reference 100 %:** build **one** concept from the reference. Gate 2 asks *Approve · Change (say what)*.
- **The user already has a clear concept:** build it + 1–2 contrasting concepts.
- **The user says to skip the concept step** (clearly, in this session): build the recommended concept, record the permission verbatim in `DECISIONS.md`, go on.
