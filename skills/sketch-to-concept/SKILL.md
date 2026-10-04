---
name: sketch-to-concept
description: >-
  Dùng khi cần chốt concept thiết kế (ý tưởng, phong cách, một màn then chốt) TRƯỚC khi dựng prototype website, web app, app mobile iOS/Android hay hệ thống nhiều bề mặt: người dùng nói "lên concept", "định hướng thiết kế", "style tile", "moodboard", "concept để trình khách", "chọn phong cách trước", kể cả khi chưa có tài liệu yêu cầu chi tiết; hoặc khi sketch-to-site bắt đầu một dự án chưa có CONCEPT.md; hoặc khi đã có bảng concept mà người dùng nói concept chưa hợp, muốn làm vòng mới, đổi concept, kể cả khi prototype đã dựng (vòng mới thêm lên cùng bảng). KHÔNG dùng để sửa bố cục prototype đã có (evolve-site), sửa nhỏ (tweak-site), chấm UX trang có sẵn (laws-of-ux-review).
---

# Sketch to Concept · Settle the concept before building the prototype

> **v1.4 (04/10/2026)** · Change history: `CHANGELOG.md` at the repo root.
> **Language:** talk to the user in the language they write in: gate questions and options, progress notes, reports. Files the user reads (`DECISIONS.md`, `CONCEPT.md`, the board, names, ideas, axes and `why` in `concepts.js`) are in that language too; the templates are in Vietnamese. Screen content follows the language of the brief.
> **Paths:** `<skills>` is the parent of the folder holding this SKILL.md. Read referenced skills by path, never through the Skill tool (convention at the top of `sketch-to-site`). On Windows, give `node` and `python` paths with the drive letter and forward slashes (`W:/…`), never Git Bash's `/w/…`: they cannot read it.
> The job: bring the user to a concept that is **theirs**. Non-designers struggle to describe a concept but react well to options they can see, so the skill builds 3 real concepts, then **stops** for the user to choose.

---

## 0. Three layers of a concept

| Layer | What | Answers |
|---|---|---|
| **Ý** (idea) | One idea sentence + a metaphor, tied to the product's **difference** | original |
| **Hình** (form) | Colour by role, a Vietnamese-capable type pair, radius, shadow, texture, background, rhythm | good-looking |
| **Dụng** (use) | **One key screen** built with real content, with **one signature interaction** you can click | usable |

Method for each layer: `references/concept-method.md`.

---

## 1. Stop rule *(same rule as `sketch-to-site` §1: change both)*

A **gate (🛑)** is a decision only a human makes. At a gate:
1. **Show** something visible: the board, screenshots. Do not ask open questions like *"which style do you like?"*.
2. **Ask** with `AskUserQuestion`: at most 4 questions per turn, 2–4 options each; the recommended option goes **first**, marked recommended (*"(Khuyến nghị)"* in Vietnamese); aesthetic options carry a `preview`.
3. **Stop.** Without an ask tool, write the questions and **end the turn**. **Never choose for the user**, even in auto mode or an unattended session.
4. **Record** the answers **verbatim** in `DECISIONS.md` (template `<skills>/sketch-to-site/templates/DECISIONS.md`).

**Pass a gate without asking only when:** the user says clearly **in this session** to skip that gate (record verbatim) · the answer **is already in the input** (record the source).

<!-- luat-dung:co:bat-dau -->
**Cớ hay gặp để bỏ cổng, và sự thật** *(rút từ `superpowers` writing-skills và brainstorming; khối này giống hệt ở `sketch-to-site` và `sketch-to-concept`, test giữ hai bản khớp nhau)*:

| Cớ | Sự thật |
|---|---|
| "Đang chạy tự động, không ai trực, cứ chọn khuyến nghị cho nhanh" | Cổng là quyết định chỉ người dùng làm được. Dừng ở cổng không bị coi là tắc việc |
| "Phương án khuyến nghị rõ ràng tốt nhất, hỏi chỉ tốn một lượt" | Khuyến nghị đứng đầu và ghi *(Khuyến nghị)*. Chọn vẫn là việc của người dùng |
| "Người dùng giục: nhanh lên, gấp lắm" | Câu giục không phải lời bỏ cổng. Hỏi gọn hơn, gộp câu trong cùng cổng, không bỏ hỏi |
| "Người dùng đã duyệt ý tưởng, coi như duyệt luôn bản dựng" | Một lần duyệt chỉ áp cho **đúng thứ đã trình**. Thứ người dùng chưa xem thì chưa được duyệt |
| "Hỏi trước cho đỡ mất lượt, dựng sau" | Không hỏi khi chưa có gì để xem. Dựng bảng hay bản dựng trước, hỏi sau |
| "Chỉ là sửa nhỏ sau nghiệm thu, đổi luôn token hay concept" | Đổi thứ đã khoá ở cổng nào là mở lại cổng đó |
| "Người dùng chưa trả lời, chắc là đồng ý" | Im lặng không phải đồng ý. Nhắc lại câu hỏi |

Người dùng trả lời *Tuỳ bạn* cho một câu hỏi ở cổng: đó là lời giao quyết định cho câu đó. Chọn lựa chọn khuyến nghị; câu không có khuyến nghị thì chọn lựa chọn đầu, nêu lý do một dòng. Ghi nguyên văn vào `DECISIONS.md`, không hỏi lại câu đó.

**Dấu hiệu phải dừng lại:** thấy mình nghĩ *"để mình chọn luôn"*, *"chắc họ sẽ chọn A"*, *"hỏi thì mất công"*, *"trả lời sau cũng được"*, hay định viết *"tôi đã chọn … cho bạn"* khi người dùng chưa giao câu đó. Gặp một trong số đó: trình bày, hỏi, rồi kết thúc lượt.
<!-- luat-dung:co:ket-thuc -->

---

## 2. Floor and priority

- **Non-negotiable floor**, for the board and the key screens: WCAG AA contrast · keyboard and focus · `prefers-reduced-motion` · no horizontal overflow · fonts with **Vietnamese** diacritics · animate only `transform`/`opacity`.
- Anti-AI-slop, real data in the product's language, honest placeholders, images: per `sketch-to-site` §3 and §6. Print only those two sections, at A3 step 1 (`references/vong-dau.md`, command there).
- Rules of source skills (`huashu-design`, `brandkit`, style families) lose to kit rules (`sketch-to-site` §2).

---

## 3. Process · 2 gates

```
A1 Read the core ─► 🛑1 Concept brief ─► A2 References + lookups ─► A3 Build concepts ─► 🛑2 Choose ─► Handover
                                                                          └─ Not there yet ─► new round (references/vong-moi.md) ─► 🛑2
```

Gates are numbered **continuously** with `sketch-to-site` (Gates 3 and 4 are there), all recorded in one `DECISIONS.md`.

**Turns cost more than text.** Every turn rereads the whole context, and the last turns carry 150–200k tokens, so put independent commands in one turn: several tool calls in one message, or one Bash command. Read a template or doc section in the turn that uses it, not earlier.

### Start *(no board yet)*

The prototype folder has no `concept/concepts.js`. In the next turn, read `references/vong-dau.md` (A1 to A3, Gate 1, short paths) and `references/concept-method.md` with `Read`, and check the tools in the same turn: `AskUserQuestion` · headless Edge/Chrome for screenshots · `WebSearch` (needed for the real-benchmark source; when it is a deferred tool, load it with `ToolSearch` in this same turn) · image generation. Then follow `vong-dau.md`: A1 → 🛑 Gate 1 → A2 → A3 → 🛑 Gate 2 below.

### Re-entry *(a board exists)*

The prototype folder already has `concept/concepts.js`: **skip** A1 and A2. Suggest a **new session** first: `concepts.js` and `DECISIONS.md` are enough to resume. In the next turn, read `references/vong-moi.md`, `concept/concepts.js` and `DECISIONS.md` with `Read` (a new round edits both: do not `cat` them), and in the same turn run this one command in the prototype folder:

```bash
S="<skills>"; cp "$S/sketch-to-concept/templates/concept-board.html" concept/index.html && cp "$S/sketch-to-concept/templates/tokens.js" "$S/sketch-to-site/templates/color.js" concept/; sed -n '/^### 2\.5/,/^## 3\./p;/^## 4\./,/^### 5\.3/p;/^### 5\.4/,/^## 6\./p' "$S/sketch-to-concept/references/concept-method.md"; grep -E '^### |^- \*\*(Cue words|Dial):' "$S/sketch-to-site/references/style-catalogue.md"; node "$S/sketch-to-concept/scripts/roles.mjs" concept/
```

It refreshes the board templates (a board from before 1.4 does not know rounds or borrowed screens), and prints the method sections a round uses (spread, axes, colour, type, form reasons), the style family index (name, cue words, dial) and the role map of every screen: which colour role paints what, which weights each type role uses, where radius, shadow and texture sit. Then follow `vong-moi.md`; nothing else needs reading.

### 🛑 Gate 2 · Choose a concept

Present the link to `concept/index.html` and the screenshots, then ask **in one turn** (options in the user's language):
1. **Concept:** four fixed options, however many concepts the board has: `<recommended concept>` (recommended) · `<second concept>` · *Mix (paste the code from the board)* · **Not there yet, new round**. Other concepts: the user types them in *Other*. The `preview` of the two concept options has 5 lines: **Ý** · **Màu** · **Chữ** · **Màn then chốt** · **Giống kiểu**. Give the reason for the recommendation with facts from the brief.
2. **Second background** (dark mode following the device setting; light mode if the concept is dark): No, one background like the concept (recommended) · Yes, add a second background. Skip it when the user already said so in the brief. *Yes*: do not rebuild the board; `sketch-to-site` B2 adds the second theme and measures every pair.
3. **Rhythm:** Like the concept · Calmer · Livelier. In words, no dial numbers.

- **Mix:** ask for the **mix code** from the *Trộn* panel of the board (e.g. `man:A mau:B chu:A nut:A`), or ask which layer comes from which concept.
- **Not there yet, new round:** follow `references/vong-moi.md`. A user **torn between two** concepts is also a new round: the layer that misses is *Layout*, the closest concept is the one they lean to.
- Once chosen: record `DECISIONS.md`, write `CONCEPT.md` in the prototype folder from `templates/CONCEPT.md`. The CSS block for its §3, run in the prototype folder (replace `<id>` and `<mix code>`; an empty string when not mixed): `node -e "global.window = global; require('./concept/concepts.js'); const T = require('./concept/tokens.js'); console.log(T.cssText(T.resolve(CONCEPTS, '<id>', T.parseMix('<mix code>'))))"`

### Handover
- Markdown links to `concept/index.html` and `CONCEPT.md`.
- Called from `sketch-to-site`: continue with its **B0**. Called alone: ask whether to build the prototype now (→ `sketch-to-site`).
- Moving on to `sketch-to-site`: suggest a **new session**. `CONCEPT.md` and `DECISIONS.md` are enough to resume, while this session carries the docs, screens and images of every concept: staying means every turn rereads that context. If the user wants to stay, go on.
- For a client presentation: suggest publishing `concept/` as an Artifact (`sketch-to-site` §8).

---

## 4. Output folder

Default `docs/prototypes/<slug>/`; follow the project's convention if it has one.

```
<slug>/
├── DECISIONS.md        # Gates 1–2 here; sketch-to-site adds Gates 3–4
├── REFERENCE-READ.md   # if there are references
├── CONCEPT.md          # the chosen concept: token source until Gate 3
└── concept/            # index.html, concepts.js (every round), color.js, tokens.js, theme.js, each concept's screens, shots/
```

---

## 5. Common mistakes

| Mistake | Fix |
|---|---|
| All concepts share one skeleton, only colour and type change | A different skeleton is required. `check.mjs` and the board's *So trục* report it |
| A best-fit concept takes the `colors.csv` palette as is | Only a starting point. Run the full 3-step protocol, and replace `#000000` (P05) |
| Reading the whole spec before there is a concept | A1 reads only the core. The spec is for `sketch-to-site` B1 |
| `example: true` or the sample *Hạt Mây* text left over | Replace all of `concepts.js`. The board shows a banner while sample data remains |
| Asking *"which style do you like?"* before the board exists | Ask about style only at Gate 2, on a built board |
| A real-benchmark concept copies the product's UI | Borrow the solution only. *"Where the form comes from"* must point to this project's content |
| A font without Vietnamese, or with marks that read wrong (Big Shoulders, Big Shoulders Stencil: ả looks like à; Vina Sans: ì looks like I) | Take fonts from `--vi-fonts`, check others with `preflight.py --font`; declare them in `fontFamily` so `check.mjs` and P07 catch them. Read the marks on the 1440 image |
| A hero key screen for a product made mostly of tables | Choose the key screen by the screen types counted in A1 |
| Scoring the idea after building, then reworking round after round | Score on `concepts.js` before building (A3 step 3). After building, rework at most once |
| Long key screens: footers, extra sections nobody screenshots | Keep to the budget in A3 step 4; `shots.mjs` flags *dài: …* |
| Habits measured in 1.3 (three runs of one brief, 9 concepts): editorial serif + grain + cream for the safe direction; Swiss + Barlow Condensed + radius 0 for the bold one; Be Vietnam Pro as body text in all 9 | Not banned, but reusing one needs a `why` pointing to the content. Add new habits here |
| Habits measured again in 1.4 (three runs, 9 concepts): the *Brutalist · Swiss công nghiệp* family in all 3 runs; Fira Sans Extra Condensed with Fira Sans in 2; square-serif fonts (Alfa Slab One, Aleo, Rokkitt) in 2. The two font pairs match exactly the two keywords the docs once gave as examples | Derive the `--vi-fonts` keyword from the letterform the concept needs, never from an example. A family already used by another concept needs a `why` pointing to the content |
| Making a second palette for dark mode, shooting `?theme=dark` when the user never asked | One palette per concept. Dark mode only when the user asks (in the brief, or Gate 2 question 2) |

---

## 6. Dependencies

| Level | Skill | Used in | If missing |
|---|---|---|---|
| 🔴 **Required** | `sketch-to-site` | Templates `DECISIONS.md`, `theme.js`, `color.js`, `sketch-to-site/templates/mobile/` · `reference-intake.md`, `style-catalogue.md`, `mobile-app.md` · `preflight.py` · `qa-kit/run.mjs` for `scripts/shots.mjs` and the tests | **Broken**: no font checks, no style catalogue |
| 🔴 | `ui-ux-pro-max` | A2 colour and type lookups · font data for `preflight.py` and `check.mjs` | **Broken**: no lookups, P07 becomes P15 |
| 🟠 **Recommended** | `huashu-design` | Real benchmarks (`design-styles.md`) · real brands (`brand-asset-protocol.md`) · self-critique (`critique-guide.md`) | Light: the core is distilled into `references/concept-method.md` |

**Not skills but needed:** Python 3 · Node 20+ and Edge/Chrome for screenshots and tests (`node --test <skills>/sketch-to-concept/tests/`) · network (Google Fonts, Tailwind CDN) · `WebSearch` for real benchmarks · a subagent tool (optional: scoring the idea layer in A3 step 3; parallel builds only when the user asks).
