# Subagent prompts — used in A3

> §1 (build): only when the user asks for parallel builds in this session. By default one agent writes the three screens in one turn (`vong-dau.md` A3 step 4).
> §2 (score the idea layer on the data): when the session can create subagents. Otherwise score yourself per `concept-method.md` §7.
> Fill every `{…}` before sending; on Windows, paths as `W:/…`, never `/w/…` (`node` and `python` cannot read it). **Do not** paste the other concepts into a build prompt: the point is that the versions do not see each other and converge.
> From `superpowers` (dispatching-parallel-agents, requesting-code-review) and `huashu-design` (independent versions). Sources: `THIRD_PARTY_LICENSES.md`.

## 1. Build one concept

Send at most three prompts at once, one per concept.

```text
You build ONE concept for the concept board of {project name}. Other concepts are built by others; you do not read or guess them.

Read first, only these:
- {prototype folder}/concept/concepts.js: brief and content, no concepts yet. Your screen uses exactly this content.
- {skills}/sketch-to-concept/references/concept-method.md: §2 (idea), §5 (form, including 5.4 reasons), §6 (use, including the budget), §7 (scoring the idea layer).
- §3 and §6 of {skills}/sketch-to-site/SKILL.md (anti-AI-slop, real data, images), printed alone, not the whole file:
  sed -n '/^## 3\./,/^## 4\./p;/^## 6\./,/^## 7\./p' "{skills}/sketch-to-site/SKILL.md"
- {skills}/sketch-to-concept/templates/key-screen.html: keep its <head>, change only data-concept. The usable CSS variable names are in that <head>.
Do not open tokens.js, color.js, index.html, theme.js: not needed to build a screen.

Your assignment:
- id: {a | b | c} · source: {best-fit | real benchmark: product name verified with WebSearch | studio lens: name and reason}
- style family: {name in style-catalogue.md} · dial: {V/M/D}
- axes: background {…} · texture {…} · type personality {…} · idea axis {…} · second-read moment {…} · layout skeleton {…}
- key screen: {screen} · clickable signature interaction: {…}

With an app: build the screen on {skills}/sketch-to-site/templates/mobile/screen.html, keeping the token <head> of key-screen.html; app.css and app.js are already in concept/. Multi-surface: build the key screen of every surface.

Do:
1. Write the concept's data block to {prototype folder}/concept/{id}.concept.js as CONCEPTS.concepts.push({ … }); per the concepts.js skeleton: id, name, round, source, family, dial, idea, metaphor, formFrom, signature, axes, colors, fontFamily, fontWeights, shape, why. why gives one sentence of reason from the content for mau, chu, hinh, chatNen. Keys not in quotes (fontFamily: { display: '…' }) so preflight can check fonts. Colours in hex, ONE palette. Fonts from preflight.py --vi-fonts already support Vietnamese; check any other font with python {skills}/sketch-to-site/scripts/preflight.py --font "<name>". Text the user will read (name, idea, axes values, why) is in the language of the brief.
2. Score the idea layer of the block per concept-method.md §7, "On the data". At 5 or below, fix the idea in {id}.concept.js before building.
3. Write {prototype folder}/concept/{id}.html from key-screen.html, with the assigned layout skeleton, in one Write; fix later with Edit. Keep to the budget in concept-method.md §6: first screen + signature block, about 10 KB. Put data-signature on the signature interaction's block. Giant type (a display word, a giant number): size with clamp() in vw, and before shooting check that the longest word fits at 390 (size there ≤ 350 / (0.6 × its characters) px). In <head>, add <script src="{id}.concept.js"></script> after concepts.js, before tokens.js.
4. Run: python {skills}/sketch-to-site/scripts/preflight.py {prototype folder}/concept/{id}.html. It must report 0 errors.
5. Shoot and measure: node {skills}/sketch-to-concept/scripts/shots.mjs {prototype folder}/concept {id}.html. Fix until both lines are OK, then open the images.
6. Do not edit concepts.js, index.html, tokens.js, theme.js, and do not touch other concepts' files.

Return exactly these parts, in order:
1. Paths of {id}.concept.js and {id}.html written.
2. The sentence "where the form comes from in the content" and your idea-layer score.
3. The last line of preflight and the two lines of shots.mjs.
4. Anything you are unsure about.
```

The main agent gets the versions back: merge the blocks into `concept/concepts.js`, then delete the {id}.concept.js files and their script lines in {id}.html (left in place, the board reports duplicate ids). Run `scripts/check.mjs concept/` and open `concept/index.html` to look at *So trục*. Two concepts sharing a skeleton or differing on fewer than 3 axes: resend the prompt for **one** concept, with the axes it must change.

A subagent that stopped midway (API error, session limit): create a new subagent with this prompt plus one line "files already written: …, continue from step …". Do not wake the old subagent with a message: it reloads its whole context, which costs more than starting fresh.

## 2. Review the concepts with fresh eyes, on the data

Send to a subagent that **did not write** `concepts.js`, at A3 step 3, before any screen is built. Use a read-only agent type when the harness has one (Claude Code: `Explore`): the scorer only reads, and that type starts with a smaller context than a general-purpose agent.

```text
You score the idea layer of the concepts of {project name}. You did not write these concepts. Read only; do not edit any file.

Read, only these:
- {prototype folder}/concept/concepts.js: brief, content and concepts.
- {skills}/sketch-to-concept/references/concept-method.md: §4 (concepts must really differ) and §7 (scoring the idea layer, "On the data").
No screens are built yet: do not open images or HTML files.

Answer briefly, at most 6 lines per concept. For each concept:
1. Idea-layer score 1-10 on the §7 scale, with one sentence of reason. Answer directly: "rename the product, does the concept still stand?"
2. At most 3 concrete problems, each pointing to a field of concepts.js (idea, metaphor, formFrom, signature, axes): cliché, form not from the content, signature interaction not serving the main job, axes not matching the idea.
3. One sentence of direction to fix any concept at 5 or below.
4. Which concept it resembles too much, if any (same skeleton, only colour changes).

Finally: what you considered but skipped as out of scope, one line each with the reason.
```

Main agent: a concept ≤ 5/10 gets its idea fixed in `concepts.js` along the direction given, then built. Do not re-score on the data: the image check in A3 step 5 will catch it. Problems not fixed are explained at Gate 2.
