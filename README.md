# Tapora Proto Kit

Agent skills for building studio-grade, interactive HTML prototypes, from the first sketch to handover. The kit also keeps a prototype consistent as it grows, and checks it with a headless-browser regression kit.

Works with **Claude Code**, **Codex**, and other hosts that support [Agent Skills](https://agentskills.io).

> **Language:** the skill instructions and tool output are written in **Vietnamese**, so the kit suits Vietnamese-speaking teams best. The prototypes themselves can be in any language. Font checks include Vietnamese diacritic coverage.

## What's inside

| Skill | Use it when | What it does |
|---|---|---|
| `sketch-to-site` | You need a new website or web app prototype, from scratch | A 7-step flow with 5 decision gates. The agent builds 3 directions, then locks a design system with you. It builds the full prototype and checks it itself, then installs the QA kit and takes the first baseline. |
| `evolve-site` | You add, change or remove a feature in an existing prototype | It sizes the change (levels 0–3) and flags risks: permissions, data, logic, requirements, tokens, shared code. The level and flags decide which of the 3 gates to stop at. It reuses the existing design system and data contract, so the new part looks like it shipped on day one. |
| `tweak-site` | The change is small: copy, spacing, one component, no risk flag | No questions and no baseline run. It runs the quick check, then writes one log line. Anything bigger goes to `evolve-site`. |
| `handover-check` | Before you hand over, share a link or commit | Runs every suite on every theme once, and matches every difference to a logged change. Also runs a 12-point UX check on the screens you touched and updates the docs once. After your sign-off, it sets the new baseline. |

**Bundled supporting skills.** One install gives you everything the four skills above use. All are MIT-licensed; see [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).

| Group | Skills | Used for |
|---|---|---|
| Design intelligence | `ui-ux-pro-max` | Design-system lookup, font data for the Vietnamese glyph check |
| UX audits | `laws-of-ux`, `laws-of-ux-checklist`, `laws-of-ux-review` | 12-point checklist, full 30-law review |
| Layout and style families | `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste` | Layout rules and deeper reading per style family |
| References and templates | `stitch-design-taste`, `redesign-existing-projects`, `full-output-enforcement` | `DESIGN.md` template, auditing an old site, complete code output |
| Brand and directions | `huashu-design` (trimmed) | Brand-asset protocol, three-directions workflow, 60-style library, device frames. Slides, animation, video and audio were removed. |

## How the pieces fit

```
sketch-to-site ──► prototype/ + _qa/ (QA kit, first baseline)
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
- Microsoft Edge, Google Chrome or Chromium. The kit finds it on Windows, macOS and Linux; override with the `QA_BROWSER` environment variable.
- Internet access for Google Fonts and the CDNs the prototypes use

## Install

### Claude Code

```text
/plugin marketplace add thapMadison/tapora-proto-kit
/plugin install tapora-proto-kit@tapora-proto-kit
```

Skills are namespaced, for example `/tapora-proto-kit:sketch-to-site`. You can also just describe the task ("thiết kế website cho …") and the agent picks the skill.

Third-party marketplaces do not auto-update by default. Run `/plugin`, open **Marketplaces**, select **tapora-proto-kit**, and enable auto-update.

### Codex

```bash
codex plugin marketplace add thapMadison/tapora-proto-kit
codex plugin add tapora-proto-kit@tapora-proto-kit
```

### Manual install (any Agent Skills host)

Copy or symlink **every** folder in `skills/` into **one** skills directory:

| Host | Project scope | User scope |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex and other Agent Skills hosts | `.agents/skills/` | `~/.agents/skills/` |

Keep the folders side by side. `sketch-to-site` calls `ui-ux-pro-max` and its own scripts by relative path.

## Quick start

1. Ask for a prototype, for example *"Thiết kế website cho một quán cà phê, dùng sketch-to-site"*. Answer the 5 gates.
2. After you sign off, the prototype folder (default `docs/prototypes/<slug>/`) contains `site/`, `DESIGN.md`, `DECISIONS.md` and `_qa/` with the first baseline.
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
| `python _qa/quick.py --dry` | Any time | Shows the changed files and the suites that would run |
| `python _qa/handover.py run` | Before handover | Runs every suite on every theme, with screenshots on the first theme. Compares against `_qa/last-green/` and matches each difference to a ledger line. |
| `python _qa/handover.py promote _qa/handover/<date-time>` | After sign-off | Makes that run the new baseline and starts a fresh ledger |
| `python _qa/handover.py thumbs` | Before `run`, when overview screenshots changed | Re-captures the thumbnails listed in `thumbs` |
| `python _qa/run_all.py <out> [filter]` | Debugging | Runs suites without any baseline |
| `python _qa/compare.py <a> <b>` | Debugging | Compares two runs step by step |

A run is clean when it has 0 console errors, 0 failed steps, 0 silent steps and 0 new horizontal overflows, and preflight passes. A step is silent when it has a `check` but returns no value.

**Configuration: `_qa/qa.config.json`**

| Key | Meaning |
|---|---|
| `site` | Folder with the pages, relative to the prototype folder (default `site`) |
| `pages` | HTML page names without `.html` |
| `themes` | `{name: "?url-param"}`. The first theme is the default. Other themes are checked by `handover.py`, and by `quick.py` when a `.css` file changes. |
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

A `check` that returns a string starting with `FAIL` is a failure. For suites whose name starts with `scan`, any non-empty string is a failure. The runner records console errors and page overflow for every step automatically.

**Troubleshooting**

- Exit code 3 means another browser already holds the debugging port. Close the leftover headless browsers (their profiles are named `cdp-*` in the temp folder) and run again.
- Exit code 4 means no browser was found. Set `QA_BROWSER`.
- `preflight: BỎ QUA` means `preflight.py` was not found, so preflight was skipped. Set `QA_PREFLIGHT` or the `preflight` key in the config.

## Maintaining this repository

- **Validate** before each release:
  - `claude plugin validate .` must pass.
  - Every `SKILL.md` frontmatter must be strict YAML (Codex parses it strictly). Write long descriptions as `>-` blocks.
  - Every `description` must be at most 1,024 characters, and each `name` must equal its folder name.
  - `python skills/sketch-to-site/scripts/preflight.py --selftest` must pass.
- **Rules kept in two places.** Change both copies together:
  - The 12-point UX table: `sketch-to-site/references/qa-gate.md` §3 and `evolve-site/references/regression-qa.md` group F.
  - The quality floor and full-output rules: `sketch-to-site` §2–3 and `evolve-site` §2.
  - The dependency list: `sketch-to-site` §9 and `DEPS` in `preflight.py`.
- **Bundled third-party skills are frozen copies.** They do not follow upstream updates. To refresh one, replace its folder, keep its `LICENSE`, and re-apply the changes listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md). `huashu-design` is trimmed, so refreshing it also means removing the slide, animation, video and audio parts again.
- **QA kit changes.** Test on a small sample site with `qa_init.py`: run `handover.py run`, `promote`, then edit one file and run `quick.py`. Existing projects upgrade with `qa_init.py <dir> --update`, which replaces the scripts but not the config, steps or baselines.
- **Releases.** Bump `version` in both `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json`, then add an entry to [CHANGELOG.md](CHANGELOG.md).

## License

MIT, see [LICENSE](LICENSE). Bundled and adapted third-party material is listed in [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
