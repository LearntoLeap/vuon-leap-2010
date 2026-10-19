# Vườn Leap · 20.10

Web quà 20/10/2026 của CEO Learn to Leap gửi nhân sự nữ. HTML/CSS/JS thuần, không build.
**Đọc `NHAT-KY.md` trước khi làm** — có toàn bộ bối cảnh, quyết định đã chốt, cấu trúc dữ liệu và các bẫy đã gặp.

- `index.html`: toàn bộ giao diện + logic (kể cả giai điệu `SONGS`). `data.js`: dữ liệu duy nhất CEO sửa (mỗi người chọn bài qua `nhac`). Ảnh để trong `anh/`, nhạc thật (nếu có) trong `nhac/`.
- Live: https://learntoleap.github.io/vuon-leap-2010/ (repo công khai, Pages từ `main` — push là cập nhật; đừng đưa dữ liệu nhạy cảm vào).
- Chạy thử: `python -m http.server 5210` → `http://localhost:5210` (routes `#/`, `#/thu/<id>`, `#/trinh-chieu`).
- Sau khi sửa `data.js`, kiểm tra cú pháp: `node -e "global.window={};require('./data.js');console.log(window.LEAP.chiEm.length)"`.

## Quy tắc đã chốt — không tự ý đổi
- Giao tiếp tiếng Việt, ngắn gọn. CEO là người nhập dữ liệu; không thêm tính năng cho người khác đóng góp.
- Phong cách theo 3 inspo: nền hồng hạt nhiễu, hoa cánh mềm tâm sao vàng, thẻ Instagram 20/10, phong thư + tim ruy băng. "PHỤ NỮ VIỆT NAM" màu tím.
- Không xưng hô ("chị", "anh em"…). Tên chính = `goiTen` ("Mrs. + Tên"), họ tên đầy đủ ở dòng phụ.
- Tiêu đề/tên không xuống dòng (dùng `data-fit`). Hiệu ứng luôn chạy, không tắt theo `prefers-reduced-motion`.
- Chỉ animate `transform`/`opacity`; không animate shadow, không blur khung lớn.
- Great Vibes chỉ cho chữ trang trí ngắn (dấu nặng rất nhỏ) — không dùng cho tên/danh hiệu.
- Repo thuộc tài khoản GitHub `LearntoLeap`; commit với `user.name "LearntoLeap"`, `user.email "phonix.team2023@gmail.com"`.
- Khi xong một đợt thay đổi, cập nhật mục "Diễn biến" và "Việc tiếp theo" trong `NHAT-KY.md`.
