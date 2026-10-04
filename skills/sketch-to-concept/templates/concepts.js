// Concept board data. Skeleton from sketch-to-concept/templates/concepts.js: copy to concept/concepts.js and fill in.
// - Loaded with <script>, not fetch: a page opened from file:// cannot fetch local files.
// - Colour roles follow the columns of ui-ux-pro-max/data/colors.csv, in kebab-case. Colours in hex or oklch(); the board also measures derived colours (hover, soft background, control border, focus ring) as themes.mjs will generate them.
//   tokens.js emits CSS variables with the kit's shared names: background → --bg, card → --surface, foreground → --ink,
//   muted-foreground → --muted, border → --line, muted → --muted-bg; other roles keep their names (--primary, --on-primary…).
//   Each concept declares ONE palette: "light" when the concept's background is light, "dark" when it is dark. Never add a second
//   palette for dark (or light) mode on your own: declare both only when the user asked (in the brief, or Gate 2 question 2).
// - id: lowercase a-z, digits, hyphen (used in the mix code, screen file names like a.html, selectors). The board reports a bad id.
//   Letters are only creation order: a, b, c in round 1, then d, e… in later rounds. They carry no safe or bold role.
// - Declare fonts in fontFamily: { … } so preflight.py and scripts/check.mjs check Vietnamese support (P07). fontWeights lists the weights the font really has.
//   body: 'system-ui' = body text in the platform font (app: SF Pro, Roboto via --app-font); no --brand-font is emitted then.
// - shape.texture: none · grid · dots · grain.
// - axes: 6 axes to compare (concept-method.md §4). Each pair differs on >= 3 axes, layout skeleton included;
//   a pair sharing one screen differs on >= 2 of the 3 axes nen, chatNen, chu.
// - why: one sentence of reason from the content for each form choice: mau, chu, hinh (radius and shadow), chatNen. Missing ones get a label on the board.
// - round: the concept's round (default 1). rounds: one line per round; note = the user's verbatim feedback that opened it.
// - screen: a concept that changes only the form layer gives the id of the concept whose screen it reuses, and has no screen file.
// - recommended: true on exactly one concept, after building and checking.
// - Text the user reads on the board (name, idea, axes values, why, content) is in the user's language.
// - content: content SHARED by every key screen, so the user compares concepts, not content.
window.CONCEPTS = {
  project: '',
  brief: [
    // { label: 'Sản phẩm', text: '', source: '' },   // source: người dùng nói · tài liệu, mục/dòng · đoán
  ],
  content: {
    // every value is one string of real content: badge, headline, body, cta, secondary, inputLabel, inputPlaceholder,
    // numbers (the real figures on one line, joined by ' · '), cardTitle, cardText
  },
  rounds: [{ n: 1, note: '' }],
  concepts: [
    // {
    //   id: 'a', name: '', round: 1,
    //   source: { kind: '', ref: '' },   // kind (in the user's language): hợp nhất · chuẩn thật · lăng kính studio (concept-method.md §3)
    //   family: '', dial: '',
    //   idea: '', metaphor: '', formFrom: '', signature: '',
    //   axes: { nen: '', chatNen: '', chu: '', yTuong: '', khoanhKhac: '', khung: '' },
    //   colors: { light: { background: '', foreground: '', card: '', 'card-foreground': '', muted: '', 'muted-foreground': '',
    //                      border: '', primary: '', 'on-primary': '', accent: '', 'on-accent': '', destructive: '', 'on-destructive': '', ring: '' } },
    //   fontFamily: { display: '', body: '', mono: '' },
    //   fontWeights: { display: '', body: '', mono: '' },   // weights joined by ';', e.g. '400;700': only weights the font has (preflight prints them)
    //   shape: { radius: { sm: '', md: '', lg: '' }, shadow: '', borderWidth: '', texture: '' },
    //   why: { mau: '', chu: '', hinh: '', chatNen: '' },
    // },
  ],
};
