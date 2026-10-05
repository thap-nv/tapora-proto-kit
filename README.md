# Tapora Proto Kit

Agent skills for building studio-grade, interactive HTML prototypes of websites, web apps and iOS/Android apps, from the first sketch to handover. One prototype can cover a whole system, such as an admin web portal plus a customer app, with shared branding and shared data. The kit also keeps a prototype consistent as it grows, and checks it with a headless-browser regression kit.

Works with **Claude Code**, **Codex**, and other hosts that support [Agent Skills](https://agentskills.io).

> **Language:** the skill instructions and tool output are written in **Vietnamese**, so the kit suits Vietnamese-speaking teams best. The prototypes themselves can be in any language. Font checks include Vietnamese diacritic coverage.

## What's inside

| Skill | Use it when | What it does |
|---|---|---|
| `sketch-to-concept` | You want to settle the concept before anything is built, or show a client options before the requirements are detailed | Reads only the core of the brief, spreads 6 to 8 directions, then builds a concept board from the 3 furthest apart, each with an idea, a style tile and one real key screen. You compare them in the browser, mix layers from different concepts, and pick one at 2 decision gates. The idea of each concept is scored before its screen is built. When none fits, the next round adds concepts to the same board (`rounds`), and a round that changes only colour and type reuses an existing screen. `scripts/check.mjs` checks the drafted concept data in one command before any screen is built, and `scripts/shots.mjs` screenshots the board and each screen at 1440 and 390 and measures them. `scripts/roles.mjs` shows which colour and type roles each screen uses, for rounds that reuse a screen. The skill talks to the user in their language; its agent-facing docs are in English to save tokens. The result is `CONCEPT.md`. |
| `sketch-to-site` | You need a new prototype from scratch: a website, a web app, an iOS/Android app, or a system with several surfaces | Starts from `CONCEPT.md`, and runs `sketch-to-concept` first when there is none. Reads the full requirements, tests the concept on the hardest screens, then locks a design system with you. It builds the full prototype and checks it itself, then installs the QA kit and takes the first baseline. App screens follow iOS or Android conventions, show in a phone frame on a computer and full-screen on a phone, and switch between iOS and Android with `?platform=android`. It sets up themes from `themes.json` (every theme is a `data-theme`) and a living design-system page, `_system.html`, reviewed at gate 3. |
| `evolve-site` | You add, change or remove a feature in an existing prototype | It sizes the change (levels 0–3) and flags risks: permissions, data, logic, requirements, tokens, shared code. The level and flags decide which of the 3 gates to stop at. It reuses the existing design system and data contract, so the new part looks like it shipped on day one. |
| `tweak-site` | The change is small: copy, spacing, one component, no risk flag | No questions and no baseline run. It runs the quick check, then writes one log line. Anything bigger goes to `evolve-site`. |
| `handover-check` | Before you hand over, share a link or commit | Runs every suite on every theme once, and matches every difference to a logged change. Also runs a 12-point UX check on the screens you touched and updates the docs once. After your sign-off, it sets the new baseline. |

**Bundled supporting skills.** One install gives you everything the five skills above use. All are MIT-licensed; see [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

| Group | Skills | Used for |
|---|---|---|
| Design intelligence | `ui-ux-pro-max` | Design-system lookup, font data for the Vietnamese glyph check |
| UX audits | `laws-of-ux`, `laws-of-ux-checklist`, `laws-of-ux-review` | 12-point checklist, full 30-law review |
| Layout and style families | `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste` | Layout rules and deeper reading per style family |
| References and templates | `stitch-design-taste`, `redesign-existing-projects`, `full-output-enforcement` | `DESIGN.md` template, auditing an old site, complete code output |
| Brand and concepts | `huashu-design` (trimmed) | Brand-asset protocol, 60-style library and concept self-review used by `sketch-to-concept`, device frames. Slides, animation, video and audio were removed. |

The five layout and style skills, `stitch-design-taste` and `full-output-enforcement` are **reference-only**. The agent reads them when the main skills need them, but never picks them on its own. This keeps them from competing with `sketch-to-site` for requests like "make a landing page". You can still call one yourself, for example `/tapora-proto-kit:minimalist-ui` in Claude Code or `$minimalist-ui` in Codex.

## How the pieces fit

```
sketch-to-concept ──► concept/ board + CONCEPT.md (gates 1–2)
        │
sketch-to-site ──► prototype/ + _qa/ (QA kit, first baseline; gates 3–4)
                        │
        ┌───────────────┴────────────────┐
    tweak-site                       evolve-site
    small edits                      features, risky changes
        └───── _qa/quick.py after every change ─────┘
                        │
                 handover-check
   full run on every theme, attribute each diff, sign-off, new baseline
```

The expensive checks run **once before handover**, not after every edit. After each edit, `quick.py` only re-runs the suites of pages that load the files you changed. It skips screenshots and compares against a rolling baseline. In a real 4-page project with 87 suites, a one-file edit took about 1 minute, and the full handover run took about 6 minutes.

## Requirements

- Claude Code, Codex, or another Agent Skills host
- Python 3.8+ (standard library only)
- Node.js 20+. Node 20 needs `--experimental-websocket`, and the kit adds it automatically.
- Microsoft Edge, Google Chrome or Chromium. The kit finds it on Windows, macOS and Linux; override with the `QA_BROWSER` environment variable. For Linux servers and containers, see Troubleshooting under [The QA kit](#the-qa-kit).
- Internet access for Google Fonts and the CDNs the prototypes use

## Install

### Claude Code

Choose where the plugin is active:

| Scope | Active for | Recorded in |
|---|---|---|
| All your projects *(default)* | You, in every project | Your user settings |
| One project, just you | You, in that project only | `<project>/.claude/settings.local.json`. This is a personal file: don't commit it. |
| One project, whole team | Everyone who opens that project | `<project>/.claude/settings.json`. Commit this file. |

**All your projects.** In Claude Code:

```text
/plugin marketplace add thap-nv/tapora-proto-kit
/plugin install tapora-proto-kit@tapora-proto-kit
```

**One project, just you.** In a terminal, from the project folder:

```bash
claude plugin marketplace add thap-nv/tapora-proto-kit --scope local
claude plugin install tapora-proto-kit@tapora-proto-kit --scope local
```

`claude plugin list` in another project still shows the plugin, but with the status `disabled`. To remove it from the project, run `claude plugin uninstall tapora-proto-kit@tapora-proto-kit --scope local` in the project folder.

**One project, whole team.** From the project folder, run the two commands above with `--scope project` instead of `--scope local`, then commit `.claude/settings.json`. Everyone who opens the project in Claude Code and trusts the folder is asked to install the plugin. You can also add the block by hand:

```json
{
  "extraKnownMarketplaces": {
    "tapora-proto-kit": {
      "source": { "source": "github", "repo": "thap-nv/tapora-proto-kit" }
    }
  },
  "enabledPlugins": {
    "tapora-proto-kit@tapora-proto-kit": true
  }
}
```

Skills are namespaced, for example `/tapora-proto-kit:sketch-to-site`. You can also just describe the task ("thiết kế website cho …") and the agent picks the skill.

Third-party marketplaces do not auto-update by default. Run `/plugin`, open **Marketplaces**, select **tapora-proto-kit**, and enable auto-update.

If a project already has its own copies of these skills in `.claude/skills/`, don't also enable the plugin there. You would get two versions of each skill, and the agent may pick the wrong one.

### Codex

```bash
codex plugin marketplace add thap-nv/tapora-proto-kit
codex plugin add tapora-proto-kit@tapora-proto-kit
```

To use the kit in one project only, copy the folders from `skills/` into that project's `.agents/skills/` instead (see [Manual install](#manual-install-any-agent-skills-host)).

### Manual install (any Agent Skills host)

Copy or symlink **every** folder in `skills/` into **one** skills directory:

| Host | Project scope | User scope |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex and other Agent Skills hosts | `.agents/skills/` | `~/.agents/skills/` |

Keep the folders side by side. `sketch-to-site` calls `ui-ux-pro-max` and its own scripts by relative path, and `sketch-to-concept` reads the references, templates and `preflight.py` of `sketch-to-site`.

## Quick start

1. Ask for a prototype, for example *"Thiết kế website cho một quán cà phê, dùng sketch-to-site"* or *"Thiết kế hệ thống đặt món: admin web cho quán và app iOS/Android cho khách"*. Answer the 4 gates: 2 on the concept board, then 2 while the prototype is built. To stop at the concept, ask *"Lên concept cho website quán cà phê, dùng sketch-to-concept"*.
2. After you sign off, the prototype folder (default `docs/prototypes/<slug>/`) contains `concept/` (the board), `CONCEPT.md`, `site/`, `DESIGN.md`, `DECISIONS.md` and `_qa/` with the first baseline. With an app, `site/app/index.html` shows every main screen side by side in phone frames, with an iOS/Android switch.
3. Ask for changes in plain words. The agent routes small edits to `tweak-site` and features to `evolve-site`.
4. Before you share or commit, ask for a handover check (*"kiểm tổng trước bàn giao"*).

**Existing prototype without the QA kit.** Put the pages in a subfolder such as `site/`, then run:

```bash
python <skills>/sketch-to-site/templates/qa-kit/qa_init.py <prototype-dir>
cd <prototype-dir>
python _qa/handover.py run
python _qa/handover.py promote _qa/handover/<date-time>
```

`<skills>` is the folder that holds the kit's skills: `.claude/skills`, `~/.agents/skills`, or the plugin install folder.

## The QA kit

`qa_init.py` copies the kit into `<prototype-dir>/_qa/`. Run every command from `<prototype-dir>`.

| Command | When | What it does |
|---|---|---|
| `python _qa/quick.py --note "<what changed>"` | After every change | Runs preflight and the suites of pages that load the changed files, without screenshots. Compares against `_qa/current/`. If the run is clean, it saves the result and appends a line to `ledger.jsonl`. |
| `python _qa/quick.py --note "<what changed>" --shots` | After a change you need to see (`tweak-site` level 1, `evolve-site` B4) | The same check, plus screenshots of the suites it runs. It lists the absolute folder and every file name in screen order, just above the result line. |
| `python _qa/quick.py --dry` | Any time | Shows the changed files and the suites that would run |
| `python _qa/handover.py run` | Before handover | Runs every suite on every theme, with screenshots on every theme. Compares against `_qa/last-green/` and matches each difference to a ledger line. |
| `python _qa/handover.py promote _qa/handover/<date-time>` | After sign-off | Makes that run the new baseline and starts a fresh ledger |
| `python _qa/handover.py thumbs` | Before `run`, when overview screenshots changed | Re-captures the thumbnails listed in `thumbs` |
| `python _qa/handover.py ledger` | Start of `handover-check` | Prints the changes since the last handover, one line each, the pages edited directly or only through shared files, the overview thumbnails to retake, and files changed after the last quick check. No browser. |
| `python _qa/run_all.py <out> [filter]` | Feature checks, `evolve-site` baseline screenshots, debugging | Runs suites without any baseline, then lists the screenshots of the suites it ran |
| `python _qa/compare.py <a> <b>` | Debugging | Compares two runs step by step |

A run is clean when it has 0 console errors, 0 failed steps, 0 silent steps, 0 new horizontal overflows, 0 new clipped items, 0 new contrast issues, 0 new action-intent issues, and preflight passes. A step is silent when it has a `check` but returns no value.

**Measurements on the rendered page**

- Every step measures text contrast on the real background: transparent layers are composited, gradients sampled, sibling layers under the text followed, and placeholders included. It also checks action intent: a destructive label (xoá, huỷ đơn, thu hồi…) painted with the primary colour, or an affirmative label painted with the danger colour.
- `handover.py run` adds a deep pass (`QA_DEEP=1`) on each page's desktop smoke suite, or on the page's first desktop suite when the project has no smoke suites, and prints which suites ran it (`Lượt sâu: n bộ (…)`): hover and focus contrast, Tab reachability, arrow keys in roving widgets, Enter and Space on custom controls, and a real click on every control that declares a state (`aria-pressed`, `aria-expanded`, …). Elements marked `data-demo-state` are drawings of a state and are not clicked.
- New measurements block only new issues against the baseline. When the baseline was recorded by an older kit, existing issues are reported as debt: printed, not blocking, and `handover-check` asks whether to fix them or accept them. A new suite whose issue is already in the baseline of another suite (a shared component) also gets debt, and console errors of the deep pass are compared with the baseline like the other measurements. Debt is printed once per issue, with `×n` when it repeats across steps, sizes and themes.
- `color.js` has one source, `sketch-to-site/templates/color.js`. `qa_init.py` copies it into `_qa/` with `probes.js` and `deep.mjs`; `--update` refreshes them.

**Themes**

`site/assets/themes.json` lists every theme's seed colours. `node <skills>/sketch-to-site/scripts/themes.mjs <prototype-dir>` derives the state and status colours, checks every pair in every theme, and writes `themes.css`. `qa_init.py` turns each theme into a QA theme. The design-system page `site/_system.html` shows and measures the tokens of the active theme.

**One-command checks**

- `node <skills>/sketch-to-site/scripts/system-check.mjs <prototype-dir>` (B2, gate 3): runs `themes.mjs` (stops on a failing pair), `preflight.py` on `site/`, and measures `site/_system.html` at 1440 and 390 in every theme. It saves each screen and the full page at 1440 to `_shots/system/`, prints only what fails, and exits 0 when clean.
- `python <skills>/sketch-to-site/scripts/qa-check.py <prototype-dir>` (`sketch-to-site` B4, `handover-check` B3): installs the kit when `_qa/qa.config.json` is missing, or runs `qa_init.py --update`, then `handover.py run`. It prints the summary, at most 15 lines per list, and the screenshots by suite.

**Configuration: `_qa/qa.config.json`**

| Key | Meaning |
|---|---|
| `site` | Folder with the pages, relative to the prototype folder (default `site`) |
| `pages` | HTML page names without `.html`, relative to `site`. Pages in subfolders keep the folder, for example `admin/orders` or `app/home` |
| `themes` | `{name: "?url-param"}`. The first theme is the default. Other themes are checked by `handover.py`, and by `quick.py` when a `.css` file changes. `qa_init.py` adds `light` and `dark` when the site has a dark theme. For an app built for both platforms, add `"android": "?platform=android"`. When `site/assets/themes.json` exists, `qa_init.py` takes the themes from it. |
| `sizes` | Named viewports `[width, height, mobile]` |
| `suites` | `[name, page, steps-key, size]`. Steps are read from `_qa/steps-<steps-key>.json`. |
| `noisy` | `[suite, step]` pairs whose value changes between runs by design, such as a live clock. They are ignored when comparing. |
| `theme_switch_prefix` | Suites whose name starts with this prefix switch themes themselves, so they run only on the default theme |
| `preflight_kind` | `site` for marketing sites, `app` for web apps |
| `thumbs` | `{dir, items: [[page, steps-key, size]]}` for overview screenshots |
| `browser` | Path to the browser, if auto-detection fails |

**Steps file: `_qa/steps-<key>.json`**

```json
{"query": "?role=admin", "steps": [
  {"name": "open-filter", "js": "document.querySelector('[data-filter]').click()", "wait": 450,
   "check": "document.querySelectorAll('tr').length > 3 ? 'PASS' : 'FAIL: no rows'", "shot": "filter", "jpeg": true}
]}
```

A `check` that returns a string starting with `FAIL` is a failure. For suites whose name starts with `scan`, any non-empty string is a failure. The runner records console errors, page overflow and clipped items for every step automatically.

`qa_init.py` creates one smoke suite per page at 1440, 768 and 390 px. Web pages are shot screen by screen down the whole page (`<page>.jpg`, `<page>-2.jpg`, … up to 8, the `slices` option of a step; `full` shoots the whole page as one image). App screens get 1440 and 390 only, because at 768 they still sit in the phone frame.

- **Clipped items** are overflow that stays inside the page, so the page-level overflow check cannot see it:
  - text that spills out of its own box, such as a squeezed table cell or a narrow button;
  - text or a control partly cut off by an `overflow: hidden` container, such as a table wider than its rounded card.

  Elements that are hidden, fully outside their container, or inside a horizontal scroller are skipped. Mark intentional cases, such as bleeding type, marquees or a peeking slide, with `data-clip-ok="<reason>"` on the container. `preflight.py` warns (P18) when the reason is missing.
- **Light and dark.** The runner sets `prefers-color-scheme` from the run's URL: `theme=dark` means dark, anything else means light. Screenshots never follow the dark mode of the machine that runs the QA. For sites that switch themes with `data-theme`, copy `sketch-to-site/templates/theme.js` into `assets/`. It handles `?theme=light`, `?theme=dark` and `?theme=system`, and remembers the choice made with `theme.toggle()`.
- **Pages that need a URL parameter.** A detail page that reads `?id=` shows only "not found" without one. Declare a sample in `<head>`, for example `<meta name="qa-query" content="?id=1042">`. `qa_init.py` copies it into the smoke suite's `query`, and warns about pages that read parameters without a sample.

For app screens (`<html data-surface="app">`), `qa_init.py` adds a `tap-targets` step to the smoke suite. At 390 px it fails when a control is smaller than 44 px on iOS or 48 px on Android. At 1440 px the screen sits in a scaled-down phone frame, so the step is skipped there.

**Troubleshooting**

- Exit code 2 means the browser started but did not answer. The message ends with the browser's last error line. To pass extra flags to the browser, set `QA_BROWSER_ARGS`, for example `QA_BROWSER_ARGS="--no-sandbox"`.
- Exit code 3 means another browser already holds the debugging port. Close the leftover headless browsers (their profiles are named `cdp-*` in the temp folder) and run again.
- Exit code 4 means no browser was found. Set `QA_BROWSER`.
- `run.mjs` waits for each page to finish loading (up to 20 seconds, at least 2.2 seconds) before it runs the steps, and waits again when a step navigates. Pages with a slow CDN script in `<head>` need this. To wait longer, set `QA_LOAD_TIMEOUT` in milliseconds. A step whose layout cannot be measured is reported as an error instead of stopping the suite.
- **Linux servers and containers** (Docker, Codespaces, VPS):
  - Debian: `apt-get install -y chromium`.
  - Ubuntu: the `chromium` and `chromium-browser` apt packages only install a snap, and snaps do not run in containers. Install Playwright's build instead, then point `QA_BROWSER` at it:

    ```bash
    npx playwright install --with-deps chromium
    export QA_BROWSER="$(find ~/.cache/ms-playwright -type f -name chrome | head -1)"
    ```

  - On Linux the kit always adds `--disable-dev-shm-usage`, because containers often have a 64 MB `/dev/shm`. When it runs as root, it also adds `--no-sandbox`, because Chrome refuses to start as root without it. If a container blocks the sandbox for a non-root user, set `QA_BROWSER_ARGS="--no-sandbox"`.
- `preflight: BỎ QUA` means `preflight.py` was not found, so preflight was skipped. Set `QA_PREFLIGHT` or the `preflight` key in the config.
- `handover.py` prints the path of the `preflight.py` it used, and `quick.py` prints it at the top. The kit prefers the copy in the skill that installed it, which is recorded in `_qa/.kit-source` (git-ignored). This matters when several copies of the kit are installed, for example a repo checkout and an older plugin. `QA_PREFLIGHT` and the `preflight` key still take priority.

## Maintaining this repository

- **Validate** before each release:
  - `claude plugin validate .` must pass.
  - Every `SKILL.md` frontmatter must be strict YAML (Codex parses it strictly). Write long descriptions as `>-` blocks.
  - Every `description` must be at most 1,024 characters, and each `name` must equal its folder name.
  - `python skills/sketch-to-site/scripts/preflight.py --selftest` must pass.
  - `node --test skills/sketch-to-concept/tests/ skills/sketch-to-site/tests/` must pass. It checks `tokens.js`, the concept board in Edge or Chrome, the shared rules in the docs of every skill, the test-first recipe on a sample prototype, and this README. Without a browser, the browser tests are skipped.
- **Rules kept in two places.** Change both copies together:
  - The 12-point UX table: `sketch-to-site/references/qa-gate.md` §3 and `evolve-site/references/regression-qa.md` group F.
  - The stop rules: `sketch-to-site` §1 and `sketch-to-concept` §1. The excuses table between the `luat-dung:co` markers must stay identical; the tests check it.
  - The quality floor and full-output rules: `sketch-to-site` §2–3, `sketch-to-concept` §2 and `evolve-site` §2. `sketch-to-concept` prints `sketch-to-site` §3 and §6 by their heading (a `sed` range), so keep those headings and their numbers; the tests check them.
  - The token variable names: `rules-and-conflicts.md` §D.2, `VARS` in `sketch-to-concept/templates/tokens.js`, and `sketch-to-site/templates/mobile/app.css`.
  - The dependency list: `sketch-to-site/references/phu-thuoc.md` and `DEPS` in `preflight.py`.
  - The shared data store: `sketch-to-site/templates/store.js`, `rules-and-conflicts.md` §D.5, and `evolve-site` §2 law 2.
  - The theme parameter: `?theme=` in `sketch-to-site/templates/theme.js`, the `prefers-color-scheme` rule in `run.mjs`, and the themes that `qa_init.py` generates.
  - The minimum tap sizes (44 on iOS, 48 on Android): `--tap` in `sketch-to-site/templates/mobile/app.css`, `TAP_CHECK` in `qa_init.py`, and `mobile-app.md` §2 and §4.
  - The reference-only list: each skill's `disable-model-invocation` flag and `agents/openai.yaml`, the note at the top of `sketch-to-site`, the note under the `evolve-site` §4 table, and the paragraph under "Bundled supporting skills" in this README.
  - The token contract: `SEEDS`, `OPTIONAL`, `DERIVED` and `PAIRS` in `sketch-to-site/templates/color.js`, `rules-and-conflicts.md` §D.2, and `templates/DESIGN.md` §2. The tests check D.2 against `color.js`.
  - The destructive and affirmative label lists: `DESTRUCTIVE` and `AFFIRM` in `qa-kit/probes.js`, and `qa-gate.md` §2. The tests check the Vietnamese list.
  - The theme hash: `themes.mjs` writes it, `preflight.py` P21 checks it (SHA-1 of `themes.json` with `\n` line endings, first 10 characters).
- The sample data for tests is `skills/sketch-to-concept/templates/concepts.example.js`; `templates/concepts.js` stays an empty skeleton so agents do not copy the sample's choices.
- **Bundled third-party skills are frozen copies.** They do not follow upstream updates. To refresh one, replace its folder, keep its `LICENSE`, and re-apply the changes listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). `huashu-design` is trimmed, so refreshing it also means removing the slide, animation, video and audio parts again.
- **QA kit changes.** Test on a small sample site with `qa_init.py`: run `handover.py run`, `promote`, then edit one file and run `quick.py`. Existing projects upgrade with `qa_init.py <dir> --update`, which replaces the scripts but not the config, steps or baselines.
- **Releases.** Bump `version` in both `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`, then add an entry to [CHANGELOG.md](CHANGELOG.md).

## License

MIT, see [LICENSE](LICENSE). Bundled and adapted third-party material is listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
