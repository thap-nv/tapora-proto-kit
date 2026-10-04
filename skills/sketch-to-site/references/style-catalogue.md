# Style families — used by `sketch-to-concept` (A2, A3, Gate 2)

> This catalogue is **scaffolding**, not a required menu. With a brand, a concept or real data, the design grows from those; the catalogue only helps name options and offer them to the user.
> Family names and cue words stay in Vietnamese: they are what users say, and the family name goes into `concepts.js` and onto the board.
> **Dial** is written **V/M/D**: `DESIGN_VARIANCE` (1 symmetric → 10 breaks the grid) · `MOTION_INTENSITY` (1 still → 10 cinematic) · `VISUAL_DENSITY` (1 gallery → 10 cockpit). Full definitions: `design-taste-frontend` §7.
> **Fonts** listed here all have the `vietnamese` subset on Google Fonts, except where marked ⚠️. Recheck with `scripts/preflight.py --font "<name>"`.
> **Mobile app:** a family decides **tokens** only (colour, type, radius, mood, imagery). Its layout rules (hero, sections, bento, marquee) do not apply to app screens; see `mobile-app.md` §5.
> **Read only what you use:** the index (name, cue words, fit, dial of every family) is `grep -E '^### |^- \*\*(Cue words|Suits|Dial):' <skills>/sketch-to-site/references/style-catalogue.md`; then print the chosen families, e.g. 2, 8 and 11: `awk '/^### (2|8|11)\./{f=1;print;next} /^#/{f=0} f' <skills>/sketch-to-site/references/style-catalogue.md`.

---

## Choosing families for the concepts

1. Take the **product type** (Gate 1) → the *Suits* line.
2. Take the **mood words** of the user and the references → the *Cue words* line.
3. The best-fit family is one of the three sources of a concept (`sketch-to-concept/references/concept-method.md` §3: the sources are a toolbox, not slots). Within a round, concepts belong to different families. The recommended concept goes first, marked as recommended, and the reason must be **facts of the project**, not taste.
4. At Gate 2, the `preview` of each option has 5 lines: **Ý** · **Màu** · **Chữ** · **Màn then chốt** · **Giống kiểu** (in the user's language).

---

## 12 style families

### 1. Hiện đại tối giản *(modern minimal)*
- **Cue words:** hiện đại, tối giản, sạch, gọn, Notion, Linear, Vercel
- **Suits:** SaaS, tools, professional services, small-business sites
- **Dial:** 5/3/3
- **Colour:** white or off-white background; charcoal text `#111`–`#2F3437`; **one** accent; pale pastels for tags
- **Type:** Geist / Be Vietnam Pro / Inter Tight + Geist Mono for numbers
- **Layout:** flat bento grid, 1px `#EAEAEA` borders, 8–12px radius, generous white space, `kbd` for shortcuts
- **Motion:** fade in on scroll 600ms, `scale(.98)` on press
- **Bans:** heavy shadows, gradients, large colour fields, `rounded-full` cards
- **Read more:** `minimalist-ui` (all)

### 2. Editorial · Tạp chí *(editorial, magazine)*
- **Cue words:** tạp chí, biên tập, kể chuyện, blog, báo, văn hoá, sang trọng kín đáo
- **Suits:** blogs, media, real estate, travel, culture
- **Dial:** 6/4/3
- **Colour:** warm paper and ink; avoid *cream + brass + espresso brown* unless the brand says so (`design-taste-frontend` §4.2)
- **Type:** display serif Newsreader / Playfair Display / Cormorant Garamond + sans Be Vietnam Pro. ⚠️ **Instrument Serif has no Vietnamese**
- **Layout:** asymmetric grid, text column ≤ 65ch, full-bleed images, captions under images
- **Motion:** little, only to pace the reading
- **Read more:** `minimalist-ui` §3 · `high-end-visual-design` §3.A *Editorial Luxury*

### 3. SaaS · Công nghệ cao cấp *(premium tech)*
- **Cue words:** công nghệ, AI, startup, Linear-tier, Apple-like, cao cấp, kính mờ
- **Suits:** digital product landings, platforms, APIs
- **Dial:** 7/6/4
- **Colour:** two routes: *OLED black `#050505` + a very faint glow* or *silver white + diffused shadows*. **Not** the lazy *`#0D1117` navy + blue/purple neon*
- **Type:** Geist / Plus Jakarta Sans / Space Grotesk, negative tracking on headings
- **Layout:** asymmetric bento, **double-bezel** shells, pill buttons with an icon in a circle, floating island menu
- **Motion:** `cubic-bezier(0.32,0.72,0,1)`, rise with blur, staggered menu
- **Read more:** `high-end-visual-design` §3–§5 · `design-taste-frontend` §5

### 4. E-commerce hàng hiệu · Luxury
- **Cue words:** hàng hiệu, cao cấp, thời trang, mỹ phẩm, trang sức, boutique, xa xỉ
- **Suits:** fashion, beauty, furniture, wine, watches, hotels
- **Dial:** 7/5/3
- **Colour:** **rotate**, do not default to cream + brass: *cold luxe* (silver, chrome, smoke) · *forest* (deep green, bone, amber) · *black and tan leather* · *cobalt and cream* · *monochrome + one vivid point*
- **Type:** sharp Bodoni-like serif ⚠️ (*Bodoni Moda has no Vietnamese → use Playfair Display / Noto Serif Display*) + thin sans Be Vietnam Pro
- **Layout:** the product photo is the hero, very wide white space, sparse product grid, specs grouped in clusters, **no** rule on every row
- **Motion:** slow and heavy; image zoom on hover inside an `overflow-hidden` frame
- **Bans:** loud red *"Giảm 50%"* badges, fake countdowns, labels over photos
- **Read more:** `design-taste-frontend` §4.2 (default palette bans), §4.9 (spec tables)

### 5. E-commerce đại chúng · Tối ưu chuyển đổi *(mass-market, conversion)*
- **Cue words:** bán hàng, khuyến mãi, chuyển đổi, Shopee/Tiki-like, nhiều sản phẩm, giá tốt
- **Suits:** retail with many SKUs, F&B, booking services
- **Dial:** 5/4/6
- **Colour:** one strong brand colour + neutrals; clear semantic colours for price, stock, discount
- **Type:** Be Vietnam Pro / Plus Jakarta Sans, prices in `tabular-nums`
- **Layout:** prominent search, facet filters, uniform product cards, **CTA buttons aligned at the card bottom**, real social proof
- **Motion:** add-to-cart feedback, skeletons while loading
- **Read more:** `ui-ux-pro-max` styles *Conversion-Optimized*, *Social Proof-Focused* · `laws-of-ux` Hick, Fitts

### 6. Awwwards · Trải nghiệm điện ảnh *(cinematic)*
- **Cue words:** ấn tượng, wow, agency, ra mắt, Awwwards, cuộn kể chuyện, điện ảnh
- **Suits:** launch pages, agencies, events, story-led brands
- **Dial:** 9/9/3
- **Colour:** free, following the idea, but **one** accent and **one** background for the whole page
- **Type:** Unbounded / Bricolage Grotesque / Anybody, large, H1 ≤ 2–3 lines (wide container)
- **Layout:** AIDA (attention → interest → desire → action), sections as film chapters `py-32+`, gap-free bento (`grid-flow-dense`)
- **Motion:** GSAP ScrollTrigger: pinning, stacked cards, horizontal scroll, text revealed on scroll. A static version for `reduced-motion` is **required**
- **Bans:** *"SECTION 01"* labels, *"Cuộn để khám phá"* hints
- **Read more:** `gpt-taste` (all) · `design-taste-frontend` §5.A–C

### 7. Cyberpunk · Neon tương lai *(neon future)*
- **Cue words:** cyberpunk, neon, tương lai, game, hacker, sci-fi, HUD
- **Suits:** games, esports, crypto products, tech events, electronic music
- **Dial:** 8/7/6
- **Readings to ask about:** rainy night neon · military HUD · Y2K glitch
- **Colour:** a deliberate dark background (not `#0D1117` + lazy neon); an Ash Thorp **orange/warm teal** pair or **one** neon on charcoal; alarm red `#FF2A2A`
- **Type:** Chakra Petch / Saira / Exo 2 for headings + JetBrains Mono / Space Mono / VT323 for data. ⚠️ **Orbitron and Rajdhani have no Vietnamese**
- **Layout:** technical grid, ASCII bracket frames `[ … ]`, square corners, dense mono data, CRT scanlines **only on a fixed layer**
- **Motion:** signal flicker, typing, **restrained** RGB shift; all off under `reduced-motion`
- **Read more:** `industrial-brutalist-ui` §2.2 *Tactical Telemetry* · `ui-ux-pro-max` styles *Cyberpunk UI*, *HUD / Sci-Fi FUI*

### 8. Brutalist · Swiss công nghiệp *(industrial Swiss)*
- **Cue words:** brutalist, thô, Swiss, bản vẽ kỹ thuật, poster, công nghiệp
- **Suits:** design studios, architecture, streetwear, bold portfolios
- **Dial:** 8/3/6
- **Colour:** matte paper `#F4F4F0` + charcoal ink + **one** aviation red `#E61919`
- **Type:** heavy sans at giant sizes, uppercase, negative tracking, leading 0.85–0.95 (*Archivo Black ⚠️ has no Vietnamese → use Anybody / Epilogue ExtraBold / Montserrat Black*)
- **Layout:** exposed grid lines `gap:1px`, **no radius**, giant numbers bleeding out of frames, two-extreme density
- **Motion:** almost none
- **Read more:** `industrial-brutalist-ui` §2.1, §3, §5 · `ui-ux-pro-max` style *Neubrutalism*

### 9. Mềm mại · Thân thiện *(soft, friendly)*
- **Cue words:** thân thiện, vui, gần gũi, trẻ em, giáo dục, sức khoẻ, cộng đồng
- **Suits:** education, health, family, community, consumer apps
- **Dial:** 6/5/4
- **Colour:** light background, one warm main colour, secondary pastels, very soft diffused shadows
- **Type:** Be Vietnam Pro / Lexend (readable) / Plus Jakarta Sans, body ≥ 16px
- **Layout:** cards with 16–24px radius, **real** illustrations or photos of real people, big clear CTAs
- **Motion:** light spring bounce, playful feedback on completion
- **Read more:** `high-end-visual-design` §3.A *Soft Structuralism* · `ui-ux-pro-max` style *Claymorphism*

### 10. Tin cậy · Dịch vụ công · Tài chính–Y tế *(trust, public service, finance–health)*
- **Cue words:** tin cậy, chính phủ, ngân hàng, bảo hiểm, bệnh viện, pháp lý, người lớn tuổi
- **Suits:** public services, finance, health, legal
- **Dial:** 3/2/5
- **Colour:** cool neutrals + one muted brand colour; standard semantic colours; **AAA** for body text if users are older
- **Type:** Inter / Public Sans / Be Vietnam Pro. This family **may** use Inter
- **Layout:** aligned, predictable, form labels above, errors below, never breaks the grid
- **Motion:** feedback only
- **Read more:** `design-taste-frontend` §1.A *trust-first* line, §2.A (GOV.UK, USWDS, Carbon)

### 11. Công cụ vận hành · Dashboard dày dữ liệu *(operations tool, dense dashboard)*
- **Cue words:** quản lý, vận hành, admin, dashboard, nội bộ, nhân viên, bảng biểu
- **Suits:** internal web apps, CRM, calendars, inventory, dispatch. Product type = **Web app** (`sketch-to-site` SKILL.md §5)
- **Dial:** 4/3/8
- **Colour:** neutral background, **colours reserved for status** (on time, late, error, waiting), nothing decorative
- **Type:** Be Vietnam Pro / Inter / IBM Plex Sans + mono for **every number**, `tabular-nums`
- **Layout:** 12-column grid, tables with filter/sort/export, `/` or `Ctrl+K` command bar, 1px rules instead of cards, complete empty/error/loading states
- **Motion:** ≤ 200ms, feedback only
- **Icons:** Lucide **allowed** (clear, familiar strokes); Phosphor Regular fits too
- **Read more:** `ui-ux-pro-max` styles *Data-Dense Dashboard*, *Real-Time Monitoring* · `laws-of-ux` Hick, Fitts, Doherty, Tesler

### 12. Portfolio sáng tạo *(creative portfolio)*
- **Cue words:** portfolio, hồ sơ năng lực, studio, cá nhân, nhiếp ảnh, kiến trúc sư
- **Suits:** individuals, small studios, freelancers
- **Dial:** 8/7/3
- **Colour:** near monochrome, **let the work bring the colour**
- **Type:** characterful display sans (Bricolage Grotesque / Epilogue); **avoid** defaulting to a serif just because it is "creative" (`design-taste-frontend` §4.1)
- **Layout:** the work takes the space, masonry or horizontal scroll, project pages tell the process
- **Bans:** *"THƯƠNG HIỆU. CHUYỂN ĐỘNG. KHÔNG GIAN."* strips at the end of the first screen, time/city/weather strips
- **Read more:** `design-taste-frontend` §1.B, §9.F

---

## Variation engine — making concepts differ

Used in two places:
- **Between concepts** (A2): each pair differs on **≥ 3 axes**, and **layout skeleton is required** among them (the first-screen and section axes below; web apps and apps use their own axes). Record in `axes` of `concepts.js`; the board counts and warns.
- **A layout round** (Gate 2, when the user is torn between two): versions of one concept keep colour and type and differ on **layout** axes: first-screen architecture, first-screen size, section system (web app, app: their own axes below).

| Axis | Options *(pick 1)* |
|---|---|
| **Background** | Clean light · Deep dark · Solid colour block · Muted neutral |
| **Texture** | Technical grid/dots · Plain with soft gradient depth · Cinematic full-bleed photo · Paper/material |
| **First-screen architecture** | Minimal centred · Offset split · Giant type with inline images · Editorial offset · Image-led, restrained type |
| **First-screen size** | Giant · Medium · Minimal mini |
| **Section system** | Modular bento rhythm · Alternating editorial blocks · Poster storytelling · Gallery rhythm · Swiss grid |
| **Type personality** | Clean grotesk · Refined grotesk · Characterful display · Compressed block · Editorial serif + sans · Swiss sans with strong hierarchy |
| **Idea axis** | Precious artefact · Journey · Precision instrument · Living system · Stage · Archive file |
| **Second-read moment** *(exactly 1)* | Deliberate bleed · One giant number or mark as structure · One change of material · Margin notes · Close crop in brand colour |

**How far each concept pushes** follows the direction chosen (`concept-method.md` §2.5), not its position: true to the family, one odd point, or pushed to the edge while still on brief are all fine, as long as it grows from the content.

**Web app / operations tool:** replace the first-screen / section / second-read axes with **Navigation** (sidebar · top bar · command bar) · **Density** (airy · medium · dense) · **Main-screen organising axis** (by time · by person · by task · by place).

**Mobile app:** web layout rules do not apply to app screens (`mobile-app.md` §5). Replace the first-screen / first-screen size / section / second-read axes with the axes below; concepts differ on ≥ 3 of them:

| Axis | Options *(pick 1)* |
|---|---|
| **Root-screen organisation** | By category · By habit (usual items, recent first) · By time · By status · By place |
| **Main content display** | Row list, small images · 2-column grid, large images · Large single-column cards · Text first, images secondary |
| **Root-screen header** | Large platform title · Solid brand colour block · Search-led · Summary card (running order, balance) |
| **Entry to the main action** | Fixed bottom button · Platform create button (`+` in the iOS bar, FAB on Android) · One tap from the top card · In-place sheet |
| **Focal point** *(exactly 1 per screen)* | Product photo · Key number · Status card · Styled price or label |

- **Not variation axes:** tab bar, back button, touch targets, sheets. Every concept follows platform conventions (`mobile-app.md` §2).
- **Multi-surface system:** each concept picks axes per surface (admin on the web-app axes, app on the axes above). The comparison table has one row per surface, plus one for the role that uses both (e.g. an owner checking the counter on a phone).
