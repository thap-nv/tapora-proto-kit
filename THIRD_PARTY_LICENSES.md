# Third-party licenses

Tapora Proto Kit is MIT-licensed (see [LICENSE](LICENSE)). It bundles copies of, and adapts material from, the MIT-licensed projects below. Each project's copyright notice and the MIT permission notice apply to the parts that come from it.

## Bundled copies

These skills are included in `skills/` so the kit works out of the box. Each folder keeps its own `LICENSE` file.

| Skill folder | Upstream | Copyright | Changes in this repository |
|---|---|---|---|
| `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | © 2024 Next Level Builder | Script paths in `SKILL.md` changed from `.claude/skills/ui-ux-pro-max/` to `<this-skill-dir>/`, with a note explaining the placeholder, so the skill works when installed as a plugin |
| `laws-of-ux`, `laws-of-ux-checklist`, `laws-of-ux-review` | [keysjoao/laws-of-ux-skills](https://github.com/keysjoao/laws-of-ux-skills) | © 2026 keysjoao | None |
| `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (`skills/taste-skill`) | © 2026 Leonxlnx | Reference-only: `disable-model-invocation: true` added to the frontmatter, and `agents/openai.yaml` added with `allow_implicit_invocation: false` |
| `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `gpt-taste`, `stitch-design-taste`, `redesign-existing-projects`, `full-output-enforcement` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill). Upstream folders: `soft-skill`, `minimalist-skill`, `brutalist-skill`, `gpt-tasteskill`, `stitch-skill`, `redesign-skill`, `output-skill` | © 2026 Leonxlnx | Folders renamed to match each skill's `name` field. All except `redesign-existing-projects` are reference-only, with the same two additions as `design-taste-frontend`. Content otherwise unchanged |
| `huashu-design` | [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) | © 2026 alchaincyf (花叔 · 花生) | Trimmed to the prototyping parts. See the list below |

**`huashu-design` changes:**
- Removed:
  - background music and sound effects;
  - showcase screenshots and director-notes samples;
  - animation, video, voice-over, and slide/PPTX/PDF export: their references, scripts, starter components and `package.json`;
  - demos, README files, `SECURITY.md`, `test-prompts.json` and the TTS `.env.example`.
- `SKILL.md`:
  - The description, routing table, workflow, starter-component table and reference table no longer point at removed files.
  - The description drops the prototype triggers (做原型, App原型, 做个HTML页面, UI mockup, 做个好看的) and sends website, web-app and iOS/Android app prototypes to `sketch-to-site` and `evolve-site`.
  - The self-update check against upstream is removed.
  - A note at the top says the copy is trimmed.
- `references/design-styles.md` and `references/verification.md` no longer mention removed assets and scripts, and the `verify.py` path is relative.

The bundled copies are frozen and do not follow upstream updates. To refresh one, replace the folder, keep its `LICENSE`, and re-apply the changes above.

## Adapted material

`sketch-to-site`, `evolve-site`, `tweak-site` and `handover-check` are original work. Some of their rules, checklists and summaries are adapted from:

| Source | Copyright | What was adapted |
|---|---|---|
| [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | © 2026 Leonxlnx | Layout rules, anti-pattern lists, style-family notes and the full-output rules (from `taste-skill`, `soft-skill`, `minimalist-skill`, `brutalist-skill`, `gpt-tasteskill`, `stitch-skill`, `redesign-skill`, `output-skill`, `image-to-code-skill`) |
| [alchaincyf/huashu-design](https://github.com/alchaincyf/huashu-design) | © 2026 alchaincyf (花叔 · 花生) | The three-directions workflow and references to its brand-asset protocol and style library |
| [keysjoao/laws-of-ux-skills](https://github.com/keysjoao/laws-of-ux-skills) | © 2026 keysjoao | The 12-point UX checklist, copied into `sketch-to-site/references/qa-gate.md` and `evolve-site/references/regression-qa.md` |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | © 2024 Next Level Builder | Design-system lookup commands. `preflight.py` reads its Google Fonts data to check Vietnamese glyph coverage |

## MIT License text

The following notice applies to each copyright holder listed above:

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
