# Concept method — used in A2, A3 and Gate 2

> Condensed and rewritten from `huashu-design` (direction design, `huashu-design/references/design-styles.md`, `huashu-design/references/critique-guide.md`, `huashu-design/references/tweaks-system.md`) and the taste-skill `brandkit` (Core principle, Brand strategy first, Tagline style, Color discipline, Logo concept methods). Sources and licences: `THIRD_PARTY_LICENSES.md`.
> Where this clashes with a kit rule, the kit rule wins (`sketch-to-site` §2).
> Layer names stay Vietnamese because the board and the mix code use them: **Ý** (idea), **Hình** (form), **Dụng** (use).

---

## 1. Three layers of a concept

| Layer | What | Test question |
|---|---|---|
| **Ý** | One idea sentence + one metaphor, tied to the product's difference | Rename the product: does the concept still stand? If it does, it is a template, not an idea |
| **Hình** | Colour by role, a Vietnamese-capable type pair, radius, shadow, texture, background, rhythm | Can you say one sentence *"why this colour"* with facts of the project? |
| **Dụng** | One real key screen, one clickable signature interaction | Does the interaction make the main job faster or clearer, or is it only pretty? |

A missing layer breaks the concept there: Hình without Ý is *"pretty but generic"*; Ý without Dụng is *"clever but unusable"*.

---

## 2. Finding the idea (Ý)

### 2.1 Five core questions *(after `brandkit`, Core principle)*
1. What does this product exist to do, and for whom?
2. What is the core metaphor?
3. Where does the metaphor show on the key screen and in the signature interaction?
4. How does it stretch to hard screens: dense tables, long forms, empty and error states?
5. Why does it belong to this product only?

### 2.2 From industry to metaphor *(after `brandkit`, Brand strategy first; last 3 rows are the kit's)*
Do not pick a random symbol. Start from the industry's core idea, then filter by the brief's **Difference** line.

| Industry | Core idea | Symbol logic |
|---|---|---|
| Developer tools | build, speed, precision, control | cursor, frame, scaffold, grid |
| AI assistant | delegate, understand, clarity | ray, orbit, signal, path, network node |
| Security | protect, watch, boundary | shield, eye, seal, shielded core |
| Games, rewarded play | chance, reward, tension | dice, gem, card, trophy |
| Voice | sound, rhythm, command | waveform, mic, orb, speech line |
| Compliance, legal | trust, order, law | seal, badge, document, shield |
| Drones, robots | flight, control, vision | wing, crosshair, flight path, zone |
| Luxury, editorial | taste, material, ritual, restraint | monogram, mark, paper, emboss |
| Productivity | focus, momentum, clarity | path, check mark, block, calendar |
| Food, ordering | taste, season, craft, the shop's rhythm | ingredient, seasonal calendar, order slip, kitchen |
| Education | progress, curiosity, patience | stairs, map, notebook, badge |
| Health, finance | safety, transparency, on time | chart, slip, confirmation mark, timeline |

### 2.3 Five form questions *(after `huashu-design`, process step 3)*
Answer for the key screen of **each** concept, before building:
1. **Role:** what does this screen do in the flow (opening, working, transition, closing)?
2. **Viewing distance:** handheld phone, laptop, a counter screen seen from afar? Decides type size and density.
3. **Visual temperature:** calm, excited, cold, authoritative, gentle? Decides colour and rhythm.
4. **Capacity:** sketch 3 quick layouts; does the real content fit?
5. **Visual motif:** what does only this content have? A component, a structure or a metaphor no other subject has. That is the seed of the form.

**Before building**, turn question 5 into one sentence **"where the form comes from in the content"** in `formFrom` of `concepts.js`: the idea layer is scored on it (§7). If you cannot write it, you are using a template: go back to question 5. After building, check the screen carries that motif.

### 2.4 The idea sentence *(after `brandkit`, Tagline style)*
Short, concrete, sayable in plain words. *"Mỗi lô hạt là một trang sổ tay của người rang"* works. *"Nâng tầm trải nghiệm cà phê"* does not: a cliché that fits any product.

### 2.5 Spread wide, then choose
Before choosing concepts to build, write **6–8 directions**, one line each: metaphor · values on the 6 axes (§4) · shape (radius, shadow). Directions grow from the **Difference** line and the 5 form questions, not from a ready list.
- Choose the 3 **furthest apart** on the axes while still true to the content; do not choose by safe versus bold.
- Do not ask the user here: this is the agent's draft, a few thousand tokens of text.
- Write unused directions to `DECISIONS.md`, section *Hướng chưa dùng*. The next round draws from it first (`references/vong-moi.md`).

---

## 3. Three sources: a toolbox, not slots *(after `huashu-design`, direction design · Phase 4)*

The three sources keep concepts from converging. Which source a concept uses follows the direction chosen in §2.5, **not** its position: the letters a, b, c are only creation order. Each concept records its source in `source`; within a round no two concepts share a style family. The recommendation is chosen **after building**, with facts of the brief. The kit does **not** use `huashu-design`'s fourth source, a random draw by the clock (`rules-and-conflicts.md` row 13).

| Source | From | How |
|---|---|---|
| **Best-fit** *(hợp nhất)* | A family in `sketch-to-site/references/style-catalogue.md` + `ui-ux-pro-max` data | Follow the family's rules, but still have an idea of your own |
| **Real benchmark** *(chuẩn thật)* | A **real**, excellently designed product in the same field | Start from the 20 web styles of `huashu-design`, each with real products, printed by the command in `vong-dau.md` A2 step 2 (40 lines). Pick a product whose solution fits this content, or one in the same field you know. Verify it with at most 2 `WebSearch` calls, no `WebFetch`: search results show that it exists and how it looks, a fetched page costs far more. Borrow the **solution** (how data is laid out, reading rhythm, the path to action), **not** its UI, logo, images or copy (`reference-intake.md` 2.4) |
| **Studio lens** *(lăng kính studio)* | *"Unlimited budget: which studio or designer fits this product best?"* | Record the name and the reason. Borrow their **way of thinking** (e.g. one visual idea pushed all the way), do not imitate a specific work |

If the user named a style, the concepts are **different readings** of that style, still from the three sources. One word has many readings:
- *Cyberpunk* → rainy night neon (Blade Runner) · military HUD (gauges, grids, alarm red) · Y2K glitch (RGB shift, pixels)
- *Luxury* → minimal luxe (white space, thin serif) · fashion magazine (full-bleed photos, big type) · cold metal (silver, smoke, sharp)
- *Modern* → Linear/Vercel (sharp type, plain backgrounds) · Apple (product as the hero, wide white) · Notion (warm, flat, document-like)

---

## 4. Concepts must really differ

Compare on 6 axes, recorded in `axes` of `concepts.js`. The board counts and warns when a pair falls short; `scripts/check.mjs` reports the same before any screen is built.

| Axis *(key in `axes`)* | Examples *(not a list to pick from)* |
|---|---|
| Background *(`nen`)* | Clean light · Deep dark · Solid colour block · Muted neutral |
| Texture *(`chatNen`)* | Technical grid or dots · Plain with depth · Full-bleed photo · Paper, material |
| Type personality *(`chu`)* | Clean grotesk · Refined grotesk · Characterful display · Compressed block · Editorial serif + sans · Swiss sans, strong hierarchy |
| Idea axis *(`yTuong`)* | Precious artefact · Journey · Precision instrument · Living system · Stage · Archive file |
| Second-read moment *(`khoanhKhac`)* | Deliberate bleed · One giant number as structure · One change of material · Margin notes · Close crop in brand colour |
| Layout skeleton *(`khung`)* | Intro web: first-screen architecture + section system · Web app: navigation + main-screen organising axis · App: root-screen organisation + main content display |

Write axis values in the concept's own words, grown from the content and in the user's language (the board shows them). The example column only explains what an axis means: concepts that all pick from it are choosing from a menu.

**Rule:** each pair differs on **≥ 3 axes**, and **layout skeleton is required** among them. `huashu-design` blind tests: three versions sharing a skeleton, changing only colour and type, are spotted at once as a "re-skin". **A pair sharing one screen** (a data-only concept with `screen` and the concept it borrows from, or two concepts borrowing the same screen) differs on at least 2 of the 3 axes background, texture, type personality.

Do not let all concepts land on *"off-white + white space + one accent"*: the most common failure.

---

## 5. Form (Hình)

### 5.1 Three-step colour protocol *(after `huashu-design/references/design-styles.md`)*

| Step | Do |
|---|---|
| **1. Sample** | Main colours come from 3 sources, not invented: an existing brand (logo, set colours) · real photos of the content · cultural memory of the subject (leaf, flower, fruit of the coffee plant; the ink of a notebook…) |
| **2. Reduce** | 2–3 chromatic colours + a neutral range. Two chromatic colours differ by ≥ 60° hue or ≥ 0.3 lightness (oklch) |
| **3. State the reason** | One sentence *"why this colour"*, in `why.mau`. If you cannot write it, you are copying a formula |

**Measure oklch** (run in the prototype folder, one command for all colours): `node -e "const C=require('./concept/color.js');for(const h of process.argv.slice(1)){const [L,c,H]=C.toOklch(h);console.log(h,'L',L.toFixed(2),'C',c.toFixed(2),'H',Math.round(H))}" '#…' '#…'` prints lightness L, chroma C and hue H of each colour. Once the palette is in `concepts.js`, `scripts/check.mjs` checks the 60° / 0.3 rule itself.

**Chroma by area** (oklch C): large backgrounds 0.01–0.04 · main colour 0.08–0.15 · small accents (buttons, links) 0.15–0.22. Above 0.25 over a whole area only fits a deliberately "electronic" style.

**Colour discipline** (after `brandkit`): one dominant palette; the accent repeats wherever action is needed; one accent can carry the whole system; no rainbows; no AI purple-blue haze.

**`ui-ux-pro-max/data/colors.csv`** (192 product types, one role palette per row) is only a starting point for a best-fit concept:
- It is the **industry default** (SaaS = trust blue + orange), exactly what step 3 must justify.
- Some rows have `#000000` for text on the accent: change it to an off-black, or preflight reports P05.
- Its column names are the role names in `concepts.js`, in kebab-case. `tokens.js` maps 5 roles to the kit's shared variable names (background → `--bg`, card → `--surface`, foreground → `--ink`, muted-foreground → `--muted`, border → `--line`; muted → `--muted-bg`), so `sketch-to-site` and the app templates read them directly.

**Write every colour in hex**, so the board can measure contrast. Every text/background pair must be **≥ AA**. The board and `check.mjs` measure, at 4.5:1: `foreground` and `muted-foreground` on background, `card-foreground` on card, `on-primary`, `on-secondary`, `on-accent`, `on-destructive` on their colour. They also measure roles derived from your colours as `themes.mjs` derives them: each button colour's hover and pressed shade, link, selected and soft backgrounds (4.5:1), control border and focus ring (3:1). Text that barely passes on a button colour fails on its hover shade.

### 5.2 Type
- Type pairs: `python <skills>/ui-ux-pro-max/scripts/search.py "<mood>" --domain typography -n 5`.
- A wide pool of Vietnamese-capable fonts: 513 Google fonts (219 sans, 86 serif, 88 display, 98 handwriting, 22 mono). Start with `python <skills>/sketch-to-site/scripts/preflight.py --vi-fonts <kind>` (`sans`, `serif`, `display`, `handwriting`, `mono`) with no keyword: it prints every font of that kind, alphabetical, in a few lines; repeat `--vi-fonts <kind>` in one command for every kind the concepts need. Choose by name and the letterform the concept needs. Measured in 1.4: guessed keywords (a letterform word, a craft word) found nothing in all four runs and cost 1–3 turns each. A font without a weight of 600 or more shows its weights in brackets (no bold weight): do not give it a role the screen sets bold. A font listed without `[ ]` has a weight of 600 or more: no `--font` call to learn its weights. List in `fontWeights` the weights the screen uses, plus 700 for a role set at 600 (the browser draws 600 with 700 when the font has no 600). Fonts in that list already support Vietnamese.
- To narrow a kind, add `"<từ khoá>"`: an English word in the font name or in a tag that splits the list, not a mood. Tags on 75 % or more of a kind's fonts (`geometric`, `humanist` are on every sans) are skipped: such a keyword matches font names only and prints a *Lưu ý*. With a keyword the list is sorted by popularity: 15 fonts with their weights and own tags, then up to 45 more names; the top is the usual fonts (Roboto, Inter, Open Sans…). No match prints 0 fonts and names the other kinds that match (it still exits 0). Do **not** take a habitual font for the body: choose for the concept and give the reason in `why.chu`.
- **Check Vietnamese** for fonts from outside the `--vi-fonts` list (`search.py`, references, `huashu-design`): `python <skills>/sketch-to-site/scripts/preflight.py --font "<name>"` (several names after one flag, or repeat `--font`). It prints the weights the font has: `fontWeights` lists only those. Declare fonts in `fontFamily: { … }` of `concepts.js` so preflight catches P07 and `scripts/check.mjs` checks them.
- Some fonts have the Vietnamese subset but marks that read wrong, seen only when rendered: Big Shoulders and Big Shoulders Stencil draw the hook above (ả) as a narrow upright stroke that reads as a grave (à) at small sizes, so *Củi* reads *Cùi*; Vina Sans draws i with a top bar that swallows the grave or acute up to about 48px, so *Mì* reads *MI*; Intel One Mono breaks capitals with marks. `--vi-fonts` leaves them out, `--font` and `check.mjs` report them; Xanh Mono gets a note (old-style digits, no ₫). Fonts not on that list: read the marks on the 1440 image.
- `fontFamily` has three roles: `display`, `body`, `mono`. There is no fourth: a handwritten or stencil accent font has to be the display font.
- Fonts in `huashu-design` are Latin and Chinese fonts: check as above before use.
- A plain display font (Inter, Roboto) makes the board say nothing. Exceptions: the *Tin cậy* and *Công cụ vận hành* families.

### 5.3 App: list to lock *(after `imagegen-frontend-mobile`, App design bible)*
**App fonts** per `sketch-to-site/references/rules-and-conflicts.md` row 16: a brand font is used on every surface; without one, the platform font. A concept with body text in the platform font declares `body: 'system-ui'` (display can still use its own font); `tokens.js` then emits no `--brand-font`, and `app.css` uses `--app-font` (SF Pro, Roboto).

Platform · device frame · palette logic · type personality · type scale · spacing system · radius logic · icon style · image use · texture strength · navigation model · card and list display · button style · shadow style. Record in `CONCEPT.md` §3 so the 3rd and 4th screens do not drift into another app.

### 5.4 A reason for every form choice
Like step 3 of the colour protocol, every form choice has one sentence of reason from the content, in `why` of `concepts.js` (in the user's language: the board shows it):

| Key | Choice | Example reason |
|---|---|---|
| `why.mau` | palette | *"Xanh rêu của mực sổ tay, đỏ son của bút chấm điểm khi nếm."* |
| `why.chu` | display, body, mono fonts | *"Serif biên tập cho chữ in của sổ tay, mono cho số liệu ghi lề."* |
| `why.hinh` | radius, border, shadow | *"Góc gần vuông như mép trang giấy, không bóng: sổ tay nằm phẳng."* |
| `why.chatNen` | texture | *"Hạt giấy mịn của trang sổ."* |

Radius follows from the metaphor (a wooden stamp has square edges, dough is soft), not from boldness. If you cannot write the reason, you are following habit (SKILL.md §5). The board labels concepts without reasons *thiếu lý do Hình*.

---

## 6. Use (Dụng)

| Product type | Key screen |
|---|---|
| Intro site · e-commerce · portfolio | First screen + 1 signature section |
| Web app · operations tool | The main working screen: the most common type when counting function names, usually a filtered table |
| Mobile app | Root screen of the main tab, on the `sketch-to-site/templates/mobile/` template |
| Multi-surface | The key screen of **each** surface (e.g. admin dashboard + app home) |

**Signature interaction:** one clickable action that serves the **main job** in the brief and carries the concept's metaphor. For a roastery: drag a time bar along the roast curve (*Sổ tay rang*), tap a parameter to see the flavour change (*Phiếu thông số*). Not counted: hover effects, decorative motion.

**Budget:** the key screen is the first screen plus the signature block, plus at most one section when the idea needs it (e.g. a timeline that runs down the page); about 10 KB per file including script. Real content, fewer parts. Measured in 1.4: screens of 12–20 KB had 21–51 % of the page outside both the first screen and the signature block, never screenshotted, while 2 of 3 screens are dropped at Gate 2 and `sketch-to-site` rebuilds the chosen one.

---

## 7. Scoring the idea layer: on the data before building, on the images after *(after `huashu-design/references/critique-guide.md` §0)*

| Score | Level |
|---|---|
| 9–10 | An idea grown from the user's content, an irreplaceable motif |
| 7–8 | A clear idea; the motif relates to the content, but a similar subject could borrow it |
| 5–6 | Style only, no idea: pretty but says nothing |
| 3–4 | A generic template re-skinned |
| 1–2 | Wrong style altogether, stacked decoration |

**On the data** (the concept's block in `concepts.js`: `idea`, `metaphor`, `formFrom`, `signature`), ask in turn:
- Can the idea be said in one sentence?
- Rename the product: does the concept still stand? If so, at most **5**.
- Does `formFrom` point to a motif unique to the content (§2.3, question 5)?
- Does the signature interaction serve the main job and carry the metaphor?

**On the images** (after building):
- Cover all text and logos: is the subject still recognisable?
- Does the screen carry the motif written in `formFrom`?

**Rework:** on the data, a concept ≤ 5 gets its idea fixed in `concepts.js` along the reviewer's direction (editing text is cheaper than rebuilding a screen), then built; do not re-score on the data, the image check will catch it. On the images, a screen that lost the idea is reworked **at most once**. Still ≤ 5: stop reworking, present it at Gate 2 with the score and the reason; the user decides to keep or drop it. Craft does not save a concept without an idea, and neither do more rounds.

---

## 8. Monogram for a fictional brand *(after `brandkit`, Logo concept methods)*

No logo yet and the key screen needs a mark: build a monogram (`sketch-to-site` §6 allows it), combining at most 2 methods:
- **Initial + meaning:** cut, fold or leave negative space in the initial to carry the metaphor.
- **The product's action:** roasting as a heat curve, delivery as a path, protection as a boundary.
- **Metaphor merge:** two ideas fused into one compact, readable mark.
- **Negative space:** hidden arrow, shielded core, cut-out letter.
- **Constructed geometry:** circle, diagonal, grid, modular blocks, orbit lines.

Avoid: generic lightning bolts, random animals, fake luxury crests, copies of famous marks, cluttered symbols.
