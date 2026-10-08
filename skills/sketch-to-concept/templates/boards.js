// Several concept boards, one per portal. Skeleton from sketch-to-concept/templates/boards.js: copy to concept/boards.js and fill in.
// - Each board is a whole board in concept/<dir>/ (index.html, concepts.js, tokens.js, color.js, theme.js, its screens), built as for one board.
// - concept/index.html is then the hub (templates/concept-hub.html): one tab per board, read from this file. Loaded with <script>, not fetch.
// - dir: the board's folder name, lowercase a-z, digits, hyphen. label: the tab name, in the user's language.
// - Concept ids never repeat across boards (a, b, c on the first board, d, e, f on the next): Gate 2 answers name concepts by id.
window.BOARDS = {
  project: '',
  boards: [
    // { dir: '', label: '' },
  ],
};
