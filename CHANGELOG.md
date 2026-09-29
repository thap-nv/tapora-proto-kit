# Changelog

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
