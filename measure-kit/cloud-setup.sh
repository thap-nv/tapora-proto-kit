#!/usr/bin/env bash
# Chuẩn bị máy cho một lần đo, trong một lệnh. Chạy từ gốc repo (nhánh measure), trên cloud Linux hoặc Git Bash trên Windows.
#   bash measure-kit/cloud-setup.sh <moi> [<cu>] [--tests]
#   <moi>, <cu>: tên nhánh trên origin (ví dụ feat/sketch-to-map) hoặc hash commit. <cu> chỉ khi đo bản cũ so với bản mới.
#   --tests: chạy node --test của mọi skills/*/tests trong từng worktree (khoảng 4 phút mỗi bản).
# Làm:
#   1. Ghi nhánh hiện tại (kết quả đo push lên measure), git status, node, python.
#   2. Trình duyệt: QA_BROWSER, rồi google-chrome, chromium, chromium-browser trong PATH. Linux chưa có thì cài Chromium của
#      Playwright và tạo symlink tên chromium trong /usr/local/bin, để subagent cũng thấy. Windows: run.mjs tự dò Edge.
#   3. Mạng tới Google Fonts, gstatic, Tailwind CDN, unpkg.
#   4. Mỗi bản: fetch từ origin, worktree tách rời ở <tmp>/wt/<moi|cu>/tapora-proto-kit (paths.js đọc dạng này thành
#      <skills:moi>, <skills:cu>), rồi preflight.py --deps của bản đó. Worktree cũ cùng chỗ thì gỡ trước.
#   5. Tạo thư mục chạy RUNS (<tmp>/measure).
# In: mỗi mục một dòng, rồi dòng biến môi trường phải đặt trong từng lệnh chạy script đo (biến không giữ qua các lệnh Bash),
#   dòng cuối "Sẵn sàng" hoặc "CHƯA SẴN SÀNG: …". Thoát 0 khi sẵn sàng, 1 khi có mục hỏng, 2 khi gọi sai.
set -u
export PYTHONIOENCODING=utf-8

REFS=(); TESTS=0
for a in "$@"; do
  case "$a" in
    --tests) TESTS=1 ;;
    -*) echo "Không hiểu cờ: $a"; exit 2 ;;
    *) REFS+=("$a") ;;
  esac
done
if [ ${#REFS[@]} -lt 1 ] || [ ${#REFS[@]} -gt 2 ]; then
  echo "Cách gọi: bash measure-kit/cloud-setup.sh <moi> [<cu>] [--tests]"; exit 2
fi

BAD=()
ok()  { if [ -n "$1" ]; then printf '  %s: %s\n' "$1" "$2"; else printf '    %s\n' "$2"; fi; }
bad() { printf '  %s: HỎNG: %s\n' "$1" "$2"; BAD+=("$1"); }

REPO=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "Không ở trong repo git."; exit 2; }
cd "$REPO" || exit 2
WIN=0; case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) WIN=1 ;; esac
if [ $WIN = 1 ]; then TMPB=$(cygpath -m "${TMPDIR:-/tmp}"); else TMPB=/tmp; fi
RUNS="$TMPB/measure"; WTB="$TMPB/wt"

echo "Máy đo"
br=$(git branch --show-current)
if [ "$br" = measure ]; then ok "nhánh" "measure"; else ok "nhánh" "$br (kết quả đo phải push lên measure)"; fi
dirty=$(git status --porcelain | wc -l | tr -d ' ')
ok "git" "$( [ "$dirty" = 0 ] && echo sạch || echo "$dirty file đổi chưa commit" )"
if command -v node >/dev/null; then ok "node" "$(node -v)"; else bad "node" "không có node"; fi
PY=python3; command -v $PY >/dev/null || PY=python
if command -v $PY >/dev/null; then ok "python" "$($PY --version 2>&1)"; else bad "python" "không có python3"; fi

# Trình duyệt
find_browser() {
  if [ -n "${QA_BROWSER:-}" ] && [ -x "${QA_BROWSER}" ]; then echo "$QA_BROWSER"; return 0; fi
  for b in google-chrome chromium chromium-browser; do command -v "$b" 2>/dev/null && return 0; done
  return 1
}
if [ $WIN = 1 ]; then
  ok "trình duyệt" "Windows: run.mjs tự dò Edge/Chrome"
else
  B=$(find_browser)
  if [ -z "$B" ]; then
    npx -y playwright install chromium >"$TMPB/pw-install.log" 2>&1 \
      || npx -y playwright install --with-deps chromium >>"$TMPB/pw-install.log" 2>&1
    exe=$(ls -d "$HOME"/.cache/ms-playwright/chromium-*/chrome-linux*/chrome 2>/dev/null | sort | tail -1)
    if [ -n "$exe" ]; then
      ln -sf "$exe" /usr/local/bin/chromium 2>/dev/null || sudo ln -sf "$exe" /usr/local/bin/chromium 2>/dev/null
      B=$(find_browser)
    fi
  fi
  if [ -n "$B" ]; then ok "trình duyệt" "$B · $("$B" --version 2>/dev/null | head -1)"
  else bad "trình duyệt" "không cài được Chromium (log: $TMPB/pw-install.log)"; fi
fi

# Mạng: 2xx, 3xx, 404, 405 là tới được; 000 (không nối được) và 403 (proxy chặn) là bị chặn
for u in "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro" https://fonts.gstatic.com https://cdn.tailwindcss.com https://unpkg.com; do
  c=$(curl -s -o /dev/null -I --max-time 15 -w '%{http_code}' "$u")
  host=${u#https://}; host=${host%%/*}
  if [[ "$c" =~ ^(2|3) || "$c" = 404 || "$c" = 405 ]]; then ok "mạng" "$host $c"; else bad "mạng" "$host bị chặn ($c): đổi mức mạng của môi trường"; fi
done

# Worktree cho từng bản
ARMS=(moi cu); MOI=""
for i in "${!REFS[@]}"; do
  arm=${ARMS[$i]}; ref=${REFS[$i]}; dir="$WTB/$arm/tapora-proto-kit"
  if git fetch -q origin "+refs/heads/$ref:refs/remotes/origin/$ref" 2>/dev/null; then
    c=$(git rev-parse "refs/remotes/origin/$ref^{commit}")
  elif git fetch -q origin "$ref" 2>/dev/null || git cat-file -e "$ref^{commit}" 2>/dev/null; then
    c=$(git rev-parse "$ref^{commit}" 2>/dev/null)
  else
    c=""
  fi
  if [ -z "$c" ]; then bad "$arm" "không lấy được $ref từ origin (nhánh đã push chưa?)"; continue; fi
  if [ -e "$dir" ]; then git worktree remove --force "$dir" 2>/dev/null || rm -rf "$dir"; fi
  git worktree prune
  mkdir -p "$(dirname "$dir")"
  if ! git worktree add -q --detach "$dir" "$c" 2>"$TMPB/wt-$arm.log"; then bad "$arm" "git worktree add hỏng (log: $TMPB/wt-$arm.log)"; continue; fi
  ok "$arm" "$ref = $(git log -1 --format='%h %s' "$c" | cut -c1-90)"
  ok "" "$dir"
  if [ ! -f "$dir/skills/sketch-to-site/scripts/preflight.py" ]; then bad "$arm" "commit không có skills/sketch-to-site"; continue; fi
  deps=$($PY "$dir/skills/sketch-to-site/scripts/preflight.py" --deps 2>&1); de=$?
  if [ $de = 0 ]; then ok "" "skill phụ thuộc: $(echo "$deps" | tail -1)"; else bad "$arm" "thiếu skill phụ thuộc: $(echo "$deps" | grep -E '✗|thiếu' | head -3 | tr '\n' ' ')"; fi
  if [ $TESTS = 1 ]; then
    out=$(cd "$dir" && node --test $(ls -d skills/*/tests 2>/dev/null) 2>&1)
    p=$(echo "$out" | sed -n 's/^# pass //p' | tail -1); f=$(echo "$out" | sed -n 's/^# fail //p' | tail -1)
    if [ "${f:-1}" = 0 ]; then ok "" "test: $p qua"; else bad "$arm" "test: ${p:-?} qua, ${f:-?} hỏng (chạy riêng test hỏng trước khi kết luận)"; fi
  fi
  [ "$arm" = moi ] && MOI="$dir"
done

mkdir -p "$RUNS"
echo
if [ -n "$MOI" ]; then
  echo "Đặt trong từng lệnh chạy script đo: SKILLS=\"$MOI/skills\" RUNS=\"$RUNS\" node measure-kit/<script>.js …"
  echo "Thư mục chạy: \"$RUNS/r<tên>\" (tên bắt đầu bằng r)."
fi
if [ ${#BAD[@]} = 0 ]; then echo "Sẵn sàng"; exit 0; fi
echo "CHƯA SẴN SÀNG: ${BAD[*]}"; exit 1
