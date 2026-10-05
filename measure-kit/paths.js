// Đường dẫn của máy chạy đo, dùng chung cho các script. Mặc định là máy Windows của các mốc đo 04/10.
// Máy khác (cloud): đặt SKILLS = thư mục skills của repo, RUNS = thư mục cha của các <DIR> (tên bắt đầu bằng r).
const SKILLS = (process.env.SKILLS || 'W:/Dummy/[Tool] Working/tapora-proto-kit/skills').replace(/\\/g, '/').replace(/\/+$/, '');
const RUNS = (process.env.RUNS || '').replace(/\\/g, '/').replace(/\/+$/, '');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const DIR_RE = RUNS ? new RegExp(`${esc(RUNS)}\\/r\\w+`, 'g') : /C:\/Users\/thapnv\/AppData\/Local\/Temp\/claude\/[^ "']*?scratchpad\/r\w+/g;
const SKILLS_RE = new RegExp(esc(SKILLS), 'g');
// Đo bản cũ và bản mới song song (prompt-edit-cu-moi.md): hai worktree <scratchpad>/cu/tapora-proto-kit và <scratchpad>/moi/tapora-proto-kit
const ARM_RE = /[A-Za-z]:\/[^ "']*?\/(cu|moi)\/tapora-proto-kit\/skills/g;
// Rút gọn đường dẫn trong lệnh: thư mục lần chạy thành <DIR>, thư mục skills thành <skills> (worktree: <skills:cu>, <skills:moi>)
const short = s => s.replace(DIR_RE, '<DIR>').replace(ARM_RE, '<skills:$1>').replace(SKILLS_RE, '<skills>');
// File nằm trong skills/ của repo: dưới SKILLS, hoặc …/tapora-proto-kit/skills/ như ở các mốc đo
const inSkills = p => p.startsWith(SKILLS + '/') || /tapora-proto-kit\/skills\//.test(p);
module.exports = { SKILLS, short, inSkills };
