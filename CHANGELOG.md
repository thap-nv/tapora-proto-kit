# Changelog

## 1.5.0 (2026-10-04)

- Skills: `sketch-to-site` 4.5.
- Lower token cost for `sketch-to-site`. Baseline on the same brief as the `sketch-to-concept` pilot (gate 2 answered with one concept), two runs per phase: B0–B2 to gate 3 took 59 and 69 turns, about 1.5–1.95M converted tokens; B3–B4 to gate 4 took 59 and 66 turns, about 1.6–2.0M, plus a general-purpose review of 0.73–0.96M. Cost followed turns × context: context grew from 36k to 260–320k tokens, and 75–85 % of turns made a single call. The measured waste and what changed:
  - SKILL.md keeps the stop rule, the shared rules and an entry table: 16.6k characters, down from 32.9k. B0–B2 and gate 3 moved to `references/b0-b2.md`, B3–B4 and gate 4 to `references/b3-b4.md`. Each phase starts in one turn: `Read` of its file and the project files, plus one command that copies the B2 templates and prints only the rule sections the phase uses (`rules-and-conflicts.md` A, B and D.2 for B2; A, B, D.1–D.4 and E for B3). The B3 entry also reads `site/_system.html` and the shared component CSS `site/assets/site.css`, and its command prints the concept's key screen `concept/<id>.html` and the files in `site/`; `b3-b4.md` gives the per-page `preflight.py` command, so nothing needs the scripts' headers (the first 4.5 runs on cloud spent 1–3 extra turns reading these). B4 prints the parts of `qa-gate.md` it uses. The version history is in this file; the dependency table moved to `references/phu-thuoc.md`.
  - New `scripts/system-check.mjs` runs B2's checks in one command: `themes.mjs` (it stops on a failing pair), `preflight.py` on `site/`, and `_system.html` measured at 1440 and 390 in every theme (console, horizontal overflow, clipped text, real-render contrast, action intent, leftover sample components, colour pairs). It saves each screen and the full page at 1440 to `_shots/system/` for gate 3, prints only what fails, and exits 0 when clean. The self-check loop on `_system.html` had cost 0.46–0.65M per run: hand-written step files, Edge shooting only the window, no image library to cut long shots.
  - New `scripts/qa-check.py` runs B4 in one command. It installs the QA kit when `_qa/qa.config.json` is missing, so an `_qa/` folder holding gate 3 screenshots no longer looks installed, or runs `qa_init.py --update`. Then it runs `handover.py run` and prints the summary, at most 15 lines per list (the rest is in `handover.json`), and the screenshots by suite, with the absolute folder and every file name in screen order, so they can be opened in one turn without `ls` (a range like `index-2.jpg … index.jpg`, sorted wrong, had cost both measured B4 runs an extra turn). Reading the code of `run.mjs`, `qa_init.py`, `preflight.py` and `themes.mjs` to learn how to call them had cost 0.25–0.46M per run.
  - `run.mjs`: a step with `"full": true` shoots the whole page; `"slices": n` shoots it screen by screen (`<shot>`, `<shot>-2`, …). Before a full or sliced shot it scrolls through the part it shoots and back, so sections revealed on scroll (`IntersectionObserver` with `opacity`) are in the picture: without it both first 4.5 B4 runs got blank sections while the check said clean. On Node 20 it reruns itself with `--experimental-websocket` instead of failing. Smoke suites made by `qa_init.py` slice web pages and `_system` (up to 8 screens): both measured B4 runs had written their own scroll suites.
  - `qa_init.py` decodes `&amp;` in `<meta name="qa-query">`. The smoke suite used to read `amp;thu` as the parameter name.
  - `templates/system.html`: `box-sizing: border-box`, since the page loads no Tailwind and components 100 % wide overflowed at 390; the page's own `h1`, `h2` and `p` rules are wrapped in `:where()` and apply only to headings and paragraphs directly inside `.sys` or a `<section>`, so component rules win and unclassed text inside a component keeps the component's colour (`.sys p` had overridden component colours and margins; `:where(.sys p)` alone still broke contrast inside a coloured arch in both first 4.5 B2 runs); component CSS lives in `site/assets/site.css`; type samples wrap at narrow widths (a 96px sample overflowed at 390). Both measured B2 runs spent 2–3 fix rounds on these.
  - B1 tests the concept on two hard cases built as real components in `_system.html` at B2, measured and shot by `system-check.mjs`, instead of a throwaway test page (0.29–0.46M per run).
  - Fewer turns: independent reads and commands go in one turn; every image a check lists is opened in one turn (image-only turns had cost 0.23–0.44M per run); files copied from templates are read before they are edited; templates used only as a guide are read in place, not copied.
  - The B4 review runs as a read-only `Explore` subagent, and the build waits for it. One measured run started the review in the background and handed over before it returned, so its 0.84M went unused. The review prompt gets the list of screenshots and reads code with `grep -n` instead of printing whole files.

## 1.4.0 (2026-10-04)

- Skills: `sketch-to-concept` 1.4, `sketch-to-site` 4.4.
- The concept board keeps every round on one page. A list of concept cards grouped by round sits on the left, with each round's feedback. A compact mix matrix (screen and idea, colour, type, buttons and shape) sits above one large preview with a Concept / Mix toggle. Details and the axis table are folded. Contrast shows only failing or near pairs. Warnings appear as labels on the cards.
- Gate 2 adds "Not there yet, new round" (`references/vong-moi.md`). One question finds the layers that miss and the closest concept. A round that changes only colour, type or shape adds data-only concepts that reuse an existing screen (`screen` in `concepts.js`), with no new HTML. A round that changes the idea or layout builds 1 to 3 new screens. New concepts must differ from every concept already on the board.
- Re-entry: when `concept/concepts.js` exists, the skill skips A1 and A2 and reads `references/vong-moi.md`. It covers an open board, a chosen concept, and a built prototype (colour and type go to `themes.json` through `tweak-site`; a new layout is `evolve-site`).
- Fixed concept roles removed. In three measured runs of the same brief, the 9 concepts repeated three roles (editorial serif with grain for A, Swiss with Barlow Condensed and no radius for C) and all used Be Vietnam Pro for body text. Now:
  - slots carry no role; the three sources are a toolbox; A2 spreads 6 to 8 directions and picks the 3 furthest apart; unused directions go to `DECISIONS.md` for the next round;
  - every colour, type, shape and texture choice has a one-line reason from the content (`why`), and the board labels concepts without one;
  - the axis menu is examples only; pairs that share a screen must differ on 2 of the 3 visual axes;
  - `templates/concepts.js` is an empty, annotated skeleton; the Hạt Mây sample moved to `templates/concepts.example.js` for tests;
  - `preflight.py --vi-fonts <kind> "<keywords>"` lists Google fonts with Vietnamese support by kind, filtered by English words in the font name or in tags that split the list (513 fonts in the data; the data has no mood tags). Tags found on 75 % or more of a kind's fonts are skipped: the data gives tags by kind rather than by font, so every sans carries `geometric`, `humanist` and `grotesque`. Each font's line shows only its own tags. Fonts from this list need no second `--font` check. The docs show only a `"<keyword>"` placeholder: in a measured run, the two example keywords the docs used to name became the fonts two of three runs picked.
- `scripts/shots.mjs`: `--round <n>` shoots only that round; data-only concepts are shot on the screen they reuse; the board line reports concepts without reasons and how many concepts over how many rounds.
- Dark mode only when the user asks. Each concept declares one palette, and no `?theme=dark` screenshots are taken by default. Gate 2 asks "second background?" with "No, one background like the concept" recommended. The `sketch-to-site` `themes.json` template has one light theme, and consumer sites no longer default to following the system setting. The concept board's "only has a light/dark background" label now shows only when the board's mode differs from the concept's single palette.
- New rounds cost less. In the measured round 2 (about 0.5M converted tokens, 28 turns), the agent spent turns finding the data-only block format and the method sections, checking fonts twice, opening 16 screenshots, and reshooting every screen in dark mode. `vong-moi.md` now prints exactly the sections to read, writes out the data-only block, shows which colour roles the reused screen uses (CSS variables and Tailwind classes), opens only the 1440 and signature screenshots of each data-only concept, and does not reshoot after moving `recommended`. Measured again on the same board: about 0.46M, 24 turns, 4 screenshots opened instead of 16. Most of what remains is reading the skill and the board data on every turn.
- Board and data fixes from the review:
  - switching light/dark keeps folded rounds and "show all pairs";
  - until the user picks a matrix cell, the Mix tab starts from the concept being viewed (a data-only concept seeds its borrowed screen); once they pick, viewing other concepts keeps their mix;
  - `aria-current` sits on the card's button; radio names read only "<layer> of <concept>"; round fold buttons have `aria-controls`; the matrix corner cell stays fixed when the matrix scrolls;
  - `validate` reports a `rounds` that is not an array (the board used to go blank), rounds below 1, and `recommended` written as a string;
  - `shots.mjs` gives a file to the longest matching id (`a-2.html` belongs to `a-2`, not to `a`), and `--round` stops with exit 2 when `concepts.js` cannot be read.
- Lower token cost, from a breakdown of the measured runs (round 1 about 1.1M converted tokens over 44–48 turns: about 20 % base context reread every turn, 22–30 % skill docs, about 28 % writing):
  - Agent-facing docs are in English: `sketch-to-concept` SKILL.md, `concept-method.md`, `vong-moi.md`, `subagent-prompts.md`, the `concepts.js` comments, and `sketch-to-site/references/style-catalogue.md`. Vietnamese text measured about 1.5 characters per token. The agent asks, reports progress and writes the files the user reads in the user's language. The skill description, the stop-rule block shared with `sketch-to-site`, family names and users' cue words stay in Vietnamese.
  - `sketch-to-concept` SKILL.md keeps only the current version; the history of 1.0–1.3 is in this file.
  - New `scripts/check.mjs`: one command checks the drafted `concepts.js` before any screen is built (data rules, failing colour pairs including derived roles, missing `why`, pairs too close on the axes, fonts without Vietnamese through `preflight.py --font`) and notes two chromatic colours closer than 60° hue and 0.3 lightness. It replaces several turns of `node -e` probes and separate font checks. `--round <n>` checks one round against the whole board.
  - Key screen budget: the first screen plus the signature block, plus at most one section, about 10 KB per file. Measured screens were 12–20 KB with 21–51 % of the page outside anything screenshotted. `shots.mjs` adds *dài: …* to the 1440 line of a screen over budget (more than 25 % outside the first screen and signature block, or over 10 KB); the line stays OK.
  - `style-catalogue.md` has an index command (name, cue words, fit and dial of the 12 families, about 3,000 characters) and an `awk` command that prints only the chosen families.
- `concept-method.md` §5.1 has a one-line `node -e` command that prints oklch lightness, chroma and hue for any colours, to check the 60° or 0.3 rule. `preflight.py --vi-fonts` prints a note when a keyword is one of those generic tags (such as `grotesque` or `hand`), which then matches font names only.
- From the measured runs of 1.4:
  - On Windows, `node` and `python` take paths as `W:/…`, never Git Bash's `/w/…`. This is written at the top of both SKILL.md files and in the subagent prompts. Round 2 lost a turn to it.
  - The data-only block in `vong-moi.md` lists the values of `source.kind` and the command that prints family names and dials from the style catalogue. The agent had searched `check.mjs` and read the catalogue index to find them.
  - Giant type (a display word, one giant number) is sized with `clamp()` in `vw` and checked at 390 before shooting. Round 1 reshot three times because of it.
  - A real benchmark starts from the 20 web styles of `huashu-design`, with an `awk` command that prints only their names and real products. It is verified with at most 2 `WebSearch` calls and no `WebFetch`.
- Fewer turns. Cost follows turns × context, and the last turns carry 150–200k tokens. In the measured round 1 after the fixes above (54 turns), A1–A2 took 28 turns, 8 of them reading code for facts the docs left out, and the self-check took 13, one concept at a time:
  - `check.mjs concept/ --shots` runs the data check, `preflight.py` on the folder and `shots.mjs` in one command, with one total line. A3 step 5 and step 6 of a new round use it.
  - `preflight.py --vi-fonts` can be repeated in one command. A keyword with no match in its kind names the kinds that match. After the 15 fonts with tags, it prints up to 45 more names.
  - SKILL.md asks for independent commands in one turn: two turns for the style index, lookups and fonts; all images of every concept in one turn, then every fix in one turn. `sketch-to-site` §3 and §6 are printed at A3 step 1, where they are used, instead of during A2.
  - The docs now state what agents read code to learn: what "wrong action colour" means, which colour pairs are measured (derived hover, pressed and focus colours included), and that `fontFamily` has only `display`, `body` and `mono`.
  - Measured with two runs per round: round 1 took 19 and 23 turns, about 0.65–0.88M converted tokens with idea scoring (was 54 turns, about 1.1M). Round 2 took 17 and 16 turns. One round 2 run was cheaper (0.37–0.39M, was 0.51–0.52M); the other cost the same, because it printed about 30 KB of files it then had to read again with `Read`.
- From those four runs:
  - The command that prints the 20 web styles of `huashu-design` is in SKILL.md A2, so it runs in the same turn as the style index. It used to sit in `concept-method.md` §3, which had to be read first.
  - `search.py --design-system` is piped through `sed` to keep only the colours and the type pair (25 of 66 lines). The full output got cut off before the colours in both round 1 runs.
  - A1 loads `WebSearch` with `ToolSearch` in the same turn as the tool check when it is a deferred tool.
  - A3 step 5: a screen with a console or data error is fixed and rerun before its images are opened.
  - A new round reads `concepts.js` and `DECISIONS.md` with `Read` from the start, since it edits both.
- Fonts with the Vietnamese subset whose marks read wrong, confirmed on screenshots: Big Shoulders Stencil draws the hook above almost like a grave (*Củi* reads *Cùi*), and Intel One Mono breaks capitals with marks. `preflight.py` keeps them in `VI_FONT_ISSUES`: P07 reports them as errors, `--font` exits 1, `--vi-fonts` leaves them out, and `check.mjs` reports them. Xanh Mono (old-style digits, no ₫) gets a warning. Three of the four runs met one of these fonts and spent turns building test pages. A3 also asks to read the marks of the display type on the 1440 image.
- From the four runs after those fixes (two per round). Round 1 cost 0.55–0.76M plus 0.05–0.08M for scoring, within run-to-run noise of the previous pass. Both round 2 runs cost 0.33–0.36M, the level of the cheaper previous run. What remained was in the seams between steps:
  - `SKILL.md` keeps the stop rule, the two ways in, Gate 2 and the handover: 14k characters, down from 28k. A1 to A3, Gate 1 and the short paths moved to `references/vong-dau.md`. Round one reads that file in the same turn as `concept-method.md` and the tool check. A new round used to read the whole of SKILL.md for the few paragraphs it needs.
  - Re-entry takes one turn: `Read` of `vong-moi.md`, `concepts.js` and `DECISIONS.md`, plus one command. The command refreshes the templates and prints the method sections, the style family index and the role map. Both round 2 runs spent a turn reading `vong-moi.md` before they knew what else to read, and one read `DECISIONS.md` twice.
  - New `scripts/roles.mjs` prints the role map of each screen:
    - which colour role paints what (CSS selector and property, or Tailwind class with its element and text);
    - which weights each type role uses;
    - where radius, shadow and texture sit, and which roles are unused.

    It replaces `grep … | sort | uniq -c`, which only counted uses: both round 2 runs grepped the borrowed screen once or twice more.
  - `check.mjs` reports *đậm giả* (faux bold): a screen, or the screen a concept borrows, sets a type role at 600 or more, but that role's font loads no weight of 600 or more (the font lacks one, or `fontWeights` leaves it out). One round 2 run gave a 400-only handwriting font to a title set at 600. It could not fix that without editing the borrowed screen.
  - Fonts:
    - `preflight.py --vi-fonts <kind>` with no keyword prints every Vietnamese-capable font of the kind, alphabetical, in a few lines; fonts with no weight of 600 or more show their weights. Guessed keywords found nothing in all four runs, at 1–3 extra turns each.
    - A lookup with no match now exits 0. Exit 1 turned a combined command into an error result, which the harness cuts in the middle to about 10k characters: one run lost the `search.py` colours that way and reran it.
    - `--font` can be repeated and prints each font's weights; keyword lines show weights instead of a style count.
  - Round one A3:
    - The draft check prints the scorer's prompt (§2) in the same command.
    - After the scores, one turn fixes the ideas and writes the three screens.
    - The `concepts.js` skeleton says each `content` value is one string, and shows the `fontWeights` format.

    One run took 30 turns and the other 18, mostly because the first wrote the screens in three turns, edited ideas over two, and opened the sample file and the prompt in turns of their own.
- From the four runs after the fourth pass (two per round). Every fix above held in all four runs. Round 1 took 17 and 16 turns and 0.61–0.68M, plus 0.05–0.08M for scoring. Both runs lost the prompt cache on the turn after the three screens: that turn thought and wrote for 6–7 minutes, past the 5-minute cache of a subagent, which added about 0.1M each. Without that loss, round 1 cost 0.50–0.57M. Round 2 took 16 and 12 turns and 0.32–0.43M. What remained:
  - Big Shoulders, not only its Stencil cut, draws the hook above (ả) as a narrow upright stroke that reads as a grave at small sizes. Both round 2 runs picked it: one kept it with "Lò Bánh Cùi" in the header after a test page, the other switched fonts and reshot. It is now in `VI_FONT_ISSUES` (`--vi-fonts` leaves it out, `--font` and P07 report it). Big Shoulders Inline draws a curled hook and stays.
  - The idea scorer uses a read-only agent type when the harness has one (Claude Code: `Explore`). It reads the same files, but starts at 23k tokens of context instead of 37k (0.05–0.06M against 0.08M).
  - A3 step 1 reads `templates/concepts.js`, `templates/key-screen.html` and the `DECISIONS.md` template in the same turn as the `cp` command, and no longer copies the two templates it fills. One run copied them and spent a turn reading the copies.
  - A data-only round goes straight to `check.mjs --round <n> --shots`, which runs the data check first. One run spent a turn on a separate `--round` check.
  - A font listed by `--vi-fonts` without `[ ]` has a weight of 600 or more, so a separate `--font` lookup for weights is not needed. `fontWeights` lists the weights the screen uses, plus 700 for a role set at 600. One run spent a turn on `--font` only to see weights.
- From the four runs after the fifth pass. Every fix above held in all four runs. Round 1 cost 0.52–0.65M without the cache loss, plus 0.04–0.06M for scoring; round 2 cost 0.28–0.39M. Two small leftovers, fixed:
  - `roles.mjs` reads inline `style` (`font-family`, `font-weight`) before classes and CSS rules. One run set a heading as `<h1 class="font-bold" style="font-family:var(--font-body)">`; the `h1` rule gave it the display role, and `check.mjs` reported faux bold on a font the heading did not use. That cost one fix and a reshoot.
  - Vina Sans is in `VI_FONT_ISSUES`. Its i has a top bar, and the grave or acute on it merges with the bar up to about 48px, so *Mì* reads *MI* or *Mī*. Marks on other letters read correctly. Both round 1 runs picked it; one moved its title to another font after the screenshots.

## 1.3.0 (2026-10-03)

- Skills: `sketch-to-concept` 1.3, `sketch-to-site` 4.3.
- `sketch-to-concept` costs less to run. In three measured runs, most of the cost came from repeated rework rounds, parallel subagents and reading whole reference files:
  - The idea layer is scored once on `concepts.js` (idea, metaphor, formFrom, signature) before any screen is built, by a fresh subagent when the session allows one, called in the foreground because the build waits for its scores. A weak idea is fixed in the data along the reviewer's direction, not by rebuilding a screen, and is not re-scored: the check on screenshots catches it. After the build, a concept is reworked at most once. If it still scores 5 or less, it goes to gate 2 with its score and the user decides.
  - One agent builds the three screens in sequence by default. Parallel subagents run only when the user asks, at most 3. A subagent that stopped midway is replaced by a new one that reads the files already written, not resumed.
  - Templates marked "do not edit" are copied with `cp`, not opened. `sketch-to-site` §3 and §6 are printed with a `sed` range instead of reading the whole file. A2 runs the design-system search once, for concept A.
  - `scripts/shots.mjs` screenshots the board at 1440 and each screen at 1440 and 390 through `run.mjs`, plus a close-up of the block marked `data-signature` (the signature interaction, often below the first screen). It prints one line per screenshot: horizontal overflow, clipped text, contrast, action intent, console errors. The board's line also reports data errors, the sample-data banner, axis warnings and failing colour pairs, so nobody has to dump the board's DOM.
  - Handover suggests a new session before `sketch-to-site`.
- Fixed: the `grid` and `dots` textures in `tokens.js` used `var(--border)`, which the template never defines, so they did not show. They now use `--line`.
- Fixed: the input placeholder on the concept board used the browser's default grey and failed contrast on dark tiles. It now uses `--muted`.
- Fixed: `run.mjs` passed viewport coordinates as the screenshot `clip`, but CDP reads document coordinates. A `clip` step on a scrolled page captured the wrong region: blank on top by the scrolled distance, cut at the bottom.
- `qa-gate.md` §2: Edge and Chrome headless lay the page out at about 496px when the window is narrower, so a 390 screenshot taken with `--window-size` is a cropped, wider page. Use Playwright or `run.mjs` for 390.

## 1.2.0 (2026-10-01)

- Skills: `sketch-to-site` 4.2, `sketch-to-concept` 1.2, `evolve-site` 1.8, `tweak-site` 1.2, `handover-check` 1.2.
- Ideas adapted from `plugin87/ux-ui-agent-skills` (see THIRD_PARTY_LICENSES.md), rewritten for the kit's CDP runner. No new dependencies.
- Theme-based design system:
  - `site/assets/themes.json` holds the seed colours of every theme. `scripts/themes.mjs` derives hover, pressed, soft backgrounds, control borders, focus ring, link and status colours, measures 26 required pairs per theme, and writes `themes.css`. It refuses to write when a pair fails, and flags pairs within 0.3 of the threshold.
  - Every theme is a `data-theme` value: light, dark and brand themes are equal. Adding a theme is one entry in `themes.json`. `theme.js` reads the theme list from `themes.css`; `?theme=<name>` forces any theme.
  - `templates/tokens.css`: type scale, four elevation levels, radii, motion, z-index and disabled opacity as tokens.
  - `templates/color.js`: one colour core for the concept board, `themes.mjs`, the design-system page and the QA probes. It reads hex, rgb, hsl, oklch, oklab and `color(srgb …)`.
- Living design-system page: `templates/system.html` becomes `site/_system.html` at B2. It draws the tokens of the active theme, measures every pair, and holds the project's real components in all states. Gate 3 reviews screenshots of it in every theme.
- QA kit:
  - Every step now measures contrast on the real background (transparent layers, gradients, sibling layers, placeholders) and action intent (a destructive label painted with the primary colour, an affirmative label painted with the danger colour). The label lists are Vietnamese and English.
  - `handover.py run` adds a deep pass (`QA_DEEP=1`, `deep.mjs`) on each page's desktop smoke suite, or on the page's first desktop suite when the project has no smoke suites: hover and focus contrast, Tab reachability, arrow keys in roving widgets, Enter and Space on custom controls, and a real click on every control that declares a state.
  - New measurements block only new issues against the baseline. Baselines recorded by an older kit report existing issues as debt: printed, not blocking, and `handover-check` asks whether to fix them or accept them into the baseline. A new suite inherits as debt the issues already in another suite's baseline, and deep-pass console errors are compared with the baseline. Debt is printed grouped, once per issue.
  - `qa_init.py` reads themes from `themes.json`, adds `system-demo` and `system-pairs` checks to the `_system` page, and adds empty-data and long-data suites for pages that load `store.js` (`?data=empty`, `?data=stress`).
  - `preflight.py`: P19 undefined CSS variables, P20 hardcoded colours (`/* color-ok: <reason> */` marks intentional ones), P21 `themes.css` older than `themes.json`.
- Docs: B1 records content-reality assumptions with the cost if wrong; eight component states; UI copy rules (A.5); dashboard rules (D.7); the fresh-eyes review now renders first, needs evidence per finding and ends with a verdict and what it could not judge.

## 1.1.0 (2026-09-29)

- Skills: `sketch-to-concept` 1.1 (new), `sketch-to-site` 4.1, `evolve-site` 1.7, `tweak-site` 1.1, `handover-check` 1.1.
- Working habits adapted from superpowers (see THIRD_PARTY_LICENSES.md):
  - `BUILD-LOG.md`: `sketch-to-site` B3 and `evolve-site` level 3 log each finished page with its check result, and resume from the log after a context reset instead of rebuilding.
  - QA failures: find the root cause first; silencing a check is forbidden (`qa-gate.md` §6). `preflight.py` P18 warns when `data-clip-ok` has no reason.
  - The stop rules in `sketch-to-site` and `sketch-to-concept` list common excuses for skipping a gate, with the answer to each. The tests keep both copies identical.
  - `evolve-site` writes the feature's QA steps before building, watches them fail, then builds until they pass. Negative checks are still proven by breaking them.
  - `sketch-to-concept` can build the three concepts with three parallel subagents that do not see each other, and asks a fresh subagent to score them. `sketch-to-site` B4 adds a fresh-context review before sign-off. Without subagents, both run in sequence.
  - Change requests: every item is checked against the quality floor and locked decisions before it is made (`rules-and-conflicts.md` §F).
  - `qa_init.py` no longer crashes on Windows when the prototype is on another drive than the current folder.
- QA kit, after the review:
  - `run.mjs` waits for the page load event before running steps (up to `QA_LOAD_TIMEOUT`, default 20 s, still at least 2.2 s), and again after a step that navigates. Before, a slow `<head>` script left `document.body` empty after the fixed 2.2 s wait and the whole suite crashed. A layout that cannot be measured is now an error on that step.
  - `preflight.py` P18 catches `data-clip-ok` without a reason also in upper case and in multi-line tags, and stays silent on comments, text and spaced `=`. Font checks ignore comments, so a comment mentioning `font-family:` no longer raises a false P15.
  - `qa_init.py` adds `.tdd/` to `_qa/.gitignore`, also on `--update`.
  - `evolve-site`: feature suites get one name per viewport; negative steps start with `phu-dinh-`; removing a feature also starts from a red check.
- Fixed during a full test run of the QA flow:
  - `BUILD-LOG.md`: the Check column holds the whole last line `preflight.py` prints, as evidence.
  - The header of `_qa/run_all.py` describes the steps file (`query`, `name`, `js`, `wait`, `check`, `shot`, `jpeg`, `clip`, `scale`). `evolve-site` points there, and the kit's README is not copied into the prototype.
- Fixed after an independent review:
  - `run.mjs` keeps downloads (an export button, for example) in the run's temporary browser profile, which is deleted afterwards. Before, every QA run saved them into the user's Downloads folder.
  - `sketch-to-site` B4, `evolve-site`, `tweak-site` and `handover-check` run `qa_init.py <dir> --update` before the first check of a session when the project already has `_qa/`, so projects set up with an older kit get the current scripts. It replaces only the scripts, not the config, steps or baselines.
  - `run.mjs` no longer waits `QA_LOAD_TIMEOUT` on every later step after a same-document navigation (a `#` link, `location.hash`, `pushState`, `tel:`, `mailto:`). Before, each step after such a click waited 20 s, and a short-lived toast was reported as a false FAIL. A resource that never finishes loading now costs one wait, not one per step.
  - `run.mjs`: a `clip` whose element does not exist yet is an error on that step. Before, it crashed the whole run and left a `cdp-*` profile behind, for example while a feature's steps were still red.
  - `BUILD-LOG.md` compares a content fingerprint (first 10 characters of the SHA-1, line endings normalised) instead of the file's modified time, so `git clone`, checkout or copying the folder no longer blocks every finished page. A page whose fingerprint still matches but whose preflight now has errors goes back to `đang` without asking. Blocked pages are asked about once, with a "keep as done" option. Whoever edits a finished page (B4, `evolve-site`) records the new fingerprint in the same turn.
- Concept first:
  - New `sketch-to-concept` skill. It reads only the core of the brief (overview, personas, function names), then builds a concept board in `concept/`: 3 concepts from 3 sources (best-fit style family, a real product used as a benchmark, a studio lens), each with an idea, a style tile and one real key screen with the same content. The board measures contrast, flags pairs of concepts that differ on fewer than 3 axes or share a layout skeleton, and has a mix panel that prints a mix code such as `man:A mau:B chu:A nut:A`. The chosen concept is written to `CONCEPT.md`.
  - `sketch-to-site` 4.0 starts from `CONCEPT.md`, or runs `sketch-to-concept` first. The style gate and the 3-directions step moved there, so the flow has 4 gates instead of 5: brief and concept (in `sketch-to-concept`), design system with scope, and sign-off. A new step reads the full requirements and tests the concept on the hardest screens before the design system is locked.
  - `tokens.js` turns the concept data (colour roles named after the columns of `ui-ux-pro-max/data/colors.csv`) into the kit's CSS variables: `--bg`, `--surface`, `--ink`, `--muted`, `--line`, `--accent`, `--brand-font`, plus `--primary`, `--on-primary` and the other roles. `app.css` reads them directly.
  - `preflight.py` checks the fonts declared in `concepts.js` (P07) and lists `sketch-to-concept` in `--deps`.
  - Tests: `node --test skills/sketch-to-concept/tests/`.
  - `concept-method.md` adapts material from `huashu-design` and taste-skill's `brandkit` (see THIRD_PARTY_LICENSES.md).
- Mobile apps and multi-surface systems:
  - `sketch-to-site` now designs iOS/Android app prototypes, and systems with several surfaces such as an admin web portal plus a customer app. Gate 1 asks for the surfaces and the app platform. The rules live in the new `references/mobile-app.md`, read only when the project has an app.
  - New templates in `sketch-to-site/templates/mobile/`: `app.css` and `app.js` for the phone frame, fake status bar, navigation bar, tab bar, back stack, bottom sheet and toast in iOS and Android styles; `screen.html`, `detail.html` and `overview.html` as starting screens. One file shows a phone frame on a computer and runs full-screen on a phone. `?platform=android` switches the platform.
  - All surfaces share one `DESIGN.md`, one set of tokens and one data store, so an action on one surface shows on the other.
  - `evolve-site` recognises app screens, has integration patterns for them, and treats adding a new surface as level 3. `tweak-site` and `handover-check` cover app screens too.
- QA kit:
  - `qa_init.py` finds pages in subfolders such as `site/admin/` and `site/app/`, and adds a `tap-targets` step to the smoke suite of every app screen.
  - `qa_init.py` creates smoke suites at 1440, 768 and 390 for web pages; app screens stay at 1440 and 390. In a test run, 768 caught a seven-column table squeezed until its text overlapped.
  - New check in every step: text that spills out of its own box, and text or controls partly cut off by an `overflow: hidden` container. The page-level overflow check cannot see either. `handover.py` and `quick.py` treat new ones as errors. Intentional cases take `data-clip-ok`.
  - `handover.py run` takes screenshots on every theme, not only the first.
  - The runner sets `prefers-color-scheme` from the run's URL, so screenshots no longer follow the dark mode of the machine that runs the QA. New `sketch-to-site/templates/theme.js` handles `?theme=light|dark|system` and a remembered toggle. `qa_init.py` adds `light` and `dark` themes when the site has a dark theme, and warns when `data-theme` is used without `theme.js`.
  - Pages that need a URL parameter declare a sample with `<meta name="qa-query">`. `qa_init.py` copies it into the smoke suite and warns about pages that read parameters without one.
  - The kit now uses the `preflight.py` of the skill that installed it, recorded in `_qa/.kit-source`, before any other installed copy. `handover.py` and `quick.py` print the path they used. Before, a stale plugin copy could be picked up without notice.
  - `preflight.py`: new checks P16 and P17 for app screens; eyebrow check P11 skipped on app screens. `--save` and `--compare` now exist, as `evolve-site` already described: compare prints only new findings and ignores line shifts. Fixed a false P15 warning when `font-family` ends an inline `style` attribute.
- QA kit, `run.mjs`:
  - On Linux it adds `--disable-dev-shm-usage`, and `--no-sandbox` when it runs as root, so the kit works in Docker and on VPS hosts.
  - New `QA_BROWSER_ARGS` environment variable for extra browser flags.
  - Exit code 2 now prints the browser's last error line and removes the temporary profile.
- Shared data across pages: new `sketch-to-site/templates/store.js`. Pages load sample data from `assets/data.js` and read and write through one store kept in `localStorage`, so a record created on one page shows on the others. `?reset` restores the sample data. `sketch-to-site` B6 builds it for web apps and multi-page data, and `evolve-site` bumps its key when a record's structure changes.
- Reference-only supporting skills: `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `stitch-design-taste` and `full-output-enforcement` no longer trigger on their own (`disable-model-invocation` for Claude Code, `agents/openai.yaml` for Codex). The main skills read them by path, one section at a time.
- Mobile templates, fixed during a full test run:
  - `app.css` no longer overrides the brand font. Set `--brand-font` in `tokens.css`.
  - Status bar text follows `--status-ink`, for screens with a dark header.
  - `app.go(href, {reset})` navigates from code and keeps the back stack and the slide animation.
  - Toasts sit below an open sheet instead of covering its buttons.
  - The app overview page has hover and focus styles.
  - `mobile-app.md` requires `var(--tap)` for tap sizes, because a hard-coded 44 px fails on Android.
  - `preflight.py` no longer warns P15 for `var()` fallbacks such as `var(--mono, monospace)`.
- `sketch-to-site` 3.1:
  - `style-catalogue.md` has variation axes for app screens: how the root screen is organised, how the main content is laid out, the root screen header, the entry to the main action, and the one accent per screen.
  - `mobile-app.md` warns that `search.py --design-system` returns landing-page patterns, fonts without Vietnamese and `#000000` for app queries. For apps, take only the palette.
  - The project gate stays within 4 questions of up to 4 options. With an app and an unknown product type, the platform question moves to a short second round.
- `huashu-design` no longer triggers on prototype requests. Website, web-app and mobile-app prototypes go to `sketch-to-site`.
- README: Linux server and container setup under Troubleshooting.
- `preflight.py` no longer crashes on Windows when the site and the current folder are on different drives. It prints full paths in that case.

## 1.0.0 (2026-09-28)

First public release.

- Skills: `sketch-to-site` 2.2, `evolve-site` 1.5, `tweak-site` 1.0, `handover-check` 1.0.
- QA kit (`skills/sketch-to-site/templates/qa-kit/`):
  - `qa_init.py` installs the kit into a prototype, generates `qa.config.json` and one smoke suite per page at 1440 and 390.
  - `quick.py` runs only the suites of pages that load changed files, against a rolling baseline, and keeps a change ledger.
  - `handover.py` runs every suite on every theme, attributes each difference to a ledger entry, and promotes the baseline after sign-off.
  - `run.mjs` finds Edge, Chrome or Chromium on Windows, macOS and Linux. It closes the browser through CDP after each suite, and stops with exit code 3 when the debugging port is already taken.
- Skill paths are relative to the skill folder, so the kit works as a Claude Code plugin, a Codex plugin, or a copied skills folder.
- `preflight.py --deps` looks for companion skills in the project, the user folder and installed plugins.
- Bundled supporting skills, so one install is enough (all MIT, see THIRD_PARTY_LICENSES.md):
  - `ui-ux-pro-max`;
  - `laws-of-ux`, `laws-of-ux-checklist`, `laws-of-ux-review`;
  - `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `stitch-design-taste`, `redesign-existing-projects`, `full-output-enforcement`;
  - `huashu-design`, trimmed from 33 MB to about 0.3 MB by removing slides, animation, video and audio.
