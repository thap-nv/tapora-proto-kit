# Changelog

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
