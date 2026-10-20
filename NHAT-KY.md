# Nhật ký dự án — Vườn Leap · 20.10

Web "quà trải nghiệm" ngày Phụ nữ Việt Nam 20/10/2026 mà CEO Learn to Leap (Lê Văn Trí) gửi tới các nhân sự nữ của công ty: vinh danh, câu chuyện, lời chúc, thư tay CEO.
File này ghi lại **toàn bộ** quá trình làm, các quyết định đã chốt và các bẫy kỹ thuật đã gặp, để phiên làm việc sau tiếp tục được ngay.

---

## 1. Tóm tắt nhanh (đọc phần này trước)

| Mục | Giá trị |
|---|---|
| Thư mục máy | `C:\Users\HP\vuon-leap-2010` (máy 1) · `D:\Claude G\vuon-leap-2010` (máy 2, clone 20/10 — không có Python) |
| Repo | `github.com/LearntoLeap/vuon-leap-2010` (**công khai**) |
| Web live | https://learntoleap.github.io/vuon-leap-2010/ (GitHub Pages, nhánh `main`, push là tự cập nhật sau ~1 phút) |
| Web live (Vercel) | https://vuon-leap-2010.vercel.app/ — project `vuon-leap-2010`, team "LTL's projects", nối repo GitHub, push `main` là tự deploy production. Bảo vệ đăng nhập Vercel chỉ áp cho bản preview (link production công khai) |
| Công nghệ | HTML + CSS + JavaScript thuần, **không** build, không framework |
| File | `index.html` (toàn bộ giao diện + logic), `data.js` (dữ liệu duy nhất cần sửa), `anh/` (ảnh, tạo khi cần), `video.js` (máy quay video thiệp, chỉ nạp ở `#/quay-video`), `video/` (MP4 + ảnh bìa từng người), `cong-cu/may-chu.mjs` (máy chủ chạy thử + nhận video) |
| Chạy thử | `node cong-cu/may-chu.mjs` → mở `http://127.0.0.1:5210` (máy 1 có thể dùng `python -m http.server 5210`, nhưng muốn quay video ghi thẳng vào `video/` thì phải dùng `may-chu.mjs`). Trong Claude Code: preview `vuon-leap` (máy 2 cấu hình ở `D:\Claude G\.claude\launch.json`, máy 1 ở `C:\Users\HP\.claude\launch.json` — cập nhật sang `node cong-cu/may-chu.mjs`) |
| Trạng thái 20/10/2026 | **10 người** (thêm Thùy Linh), mỗi người một giai điệu riêng + 3 lời chúc + album ảnh trượt + **video thiệp MP4** (tải từng người trên thẻ/trong thư, hoặc "Tải tất cả" thành 1 file ZIP). Danh hiệu / thư CEO vẫn là **bản nháp** |

### Ba màn hình (điều hướng bằng hash)
- `#/` — **Bức tường vinh danh**: tiêu đề "Chúc mừng ngày / PHỤ NỮ VIỆT NAM / 20 · 10 · 2026", lưới thẻ kiểu bài đăng Instagram, mỗi người một thẻ (có số 20/10 to, tim, bình luận…). Bấm thẻ → mở thư.
- `#/thu/<id>` — **Phong thư riêng** của từng người: tim ruy băng "Gửi Mrs. X" + phong thư → bấm mở → lá thư gồm thiệp tên, danh hiệu (tải PNG được), số liệu, khoảnh khắc, lời chúc, thư tay CEO.
- `#/trinh-chieu` — **Trình chiếu màn hình lớn**: slide mở đầu → mỗi người 1 slide (9 giây) → slide tri ân. Phím ←/→, Space (dừng), F (toàn màn hình).
- `#/quay-video` — **Máy quay video thiệp** (trang ẩn, không có link trên web): xem nhanh từng khung, "Quay người này" / "Quay tất cả".

Link riêng hiện tại: `phan-thi-thao`, `nguyen-thi-thinh`, `le-bich-ngoc`, `dinh-hoang-phuong-anh`, `ho-thi-an`, `pham-thi-hong-nhung`, `dieu-nga`, `dao-thi-xuan`, `ngoc-ha`, `thuy-linh`.

---

## 2. Quyết định CEO đã chốt (KHÔNG tự ý đổi lại)

1. **Không cần mọi người đóng góp/tương tác** — chỉ CEO nhập dữ liệu. Đã bỏ tính năng "tưới hoa" và form thu lời chúc.
2. **Phong cách hiện tại theo 3 ảnh inspo CEO gửi** (15/10): nền hồng sáng có hạt nhiễu; hoa cánh mềm tâm sao vàng, cuống hồng xoắn, lá xanh; thẻ bài đăng Instagram với số 20/10; phong thư + tim ruy băng; dải lụa vàng/hồng; trái tim trắng 3D; sao ✦ đen mảnh. (Phong cách tím đêm + template Canva trước đó đã **bỏ hẳn**.)
3. Chữ **"PHỤ NỮ VIỆT NAM" màu tím** gradient (CEO chọn tím, không dùng xanh lá/trắng).
4. **Glow tông hồng/trắng** cho chữ; các phần tử **tự chuyển động liên tục** (không cần rê chuột).
5. **Không xưng hô** ("chị", "anh em", "em"…) ở giao diện lẫn nội dung lời chúc/thư.
6. Tên hiển thị chính dùng **"Mrs. + Tên"** (trường `goiTen`), họ tên đầy đủ hiện ở dòng phụ.
7. Tiêu đề/tên **không được xuống dòng** — tự co cỡ chữ cho vừa một dòng.
8. Hiệu ứng **luôn chạy**, kể cả khi máy bật "giảm chuyển động" (máy CEO đang bật).

---

## 3. Dữ liệu — `data.js`

```js
window.LEAP = {
  tieuDe: "Vườn Leap",            // tên dự án, hiện ở dòng nhỏ đầu trang
  ngay: "20 · 10 · 2026",
  loiMoDau: "...",
  thuCEO: { nguoiKy, chucVu, noiDung /* dùng \n\n tách đoạn */, anhChuKy /* "" hoặc "anh/chu-ky.png" */ },
  chiEm: [ {
    id: "le-bich-ngoc",           // không dấu, làm link #/thu/<id>
    ten: "Lê Bích Ngọc",          // họ tên đầy đủ
    goiTen: "Mrs. Ngọc",          // tên hiển thị chính
    vaiTro: "Giám đốc Chuyên môn",
    mau: "dao",                   // hong | tim | dao | vang | xanh
    anh: ["anh/le-bich-ngoc-1.jpg"], // album ảnh 4:5, trượt trên thẻ / trong thư / trình chiếu; [] → chỉ bông hoa
    nhac: "giao-an",              // giai điệu riêng (khoá trong SONGS của index.html)
    fileNhac: "", tenNhac: "",    // file nhạc thật "nhac/x.mp3" (lỗi/thiếu file → tự dùng giai điệu) + tên bài hiển thị
    danhHieu: "...", moTaDanhHieu: "...",
    soLieu: [ { so: "47", nhan: "..." } ],          // tối đa 3; [] → ẩn mục
    cauChuyen: [ { anh, nhan, ke } ],               // [] → ẩn mục
    loiChuc: [ { tu, noiDung } ]                    // noiDung xuống dòng bằng \n; [] → ẩn mục
  } ]
}
```

- **Bẫy cú pháp:** trong chuỗi `noiDung` phải viết `\n` (hai ký tự), KHÔNG xuống dòng thật — xuống dòng thật làm hỏng cả `data.js` → trang trắng/không có dữ liệu. Kiểm tra nhanh: `node -e "global.window={};require('./data.js');console.log(window.LEAP.chiEm.length)"`.
- `index.html` nạp `data.js?t=<thời gian>` để sửa dữ liệu là thấy ngay (không bị cache).
- Danh sách 8 người (CEO cung cấp 15/10): Phan Thị Thảo (HCNS_KT), Nguyễn Thị Thịnh (Giám đốc MKT), Lê Bích Ngọc (Giám đốc Chuyên môn), Đình Hoàng Phương Anh (Event), Hồ Thị An (Event), Phạm Thị Hồng Nhung (Marketing), Diệu Nga (Marketing), Đào Thị Xuân (Quản lý giáo viên). Thêm 19/10: Ngọc Hà (Hành chính Tổng hợp — CEO chỉ gửi "Ngọc Hà", chưa có họ đầy đủ). Thêm 20/10: Thùy Linh (Chuyên viên Chuyên môn — cũng chỉ có "Thùy Linh"; danh hiệu + lời chúc là nháp). Họ "Đình" giữ đúng như CEO gửi (có thể là "Đinh" — chưa xác nhận).

**Ảnh (19/10):** CEO gửi zip "Ảnh chị em LtL" (18 ảnh, tên file theo người). Gán theo tên file, thứ tự trong album: ảnh không số trước rồi (1), (2). Đã cắt khung 4:5 (canh giữa người), thu về ≤800×1000, xoá EXIF, lưu `anh/<id>-<số>.jpg`. Script xử lý không nằm trong repo — ảnh mới thì cắt 4:5 tương tự.

**Còn thiếu (CEO bổ sung dần):** số liệu, câu chuyện + ảnh, xác nhận lại danh hiệu/lời chúc/thư CEO (đang là nháp theo vai trò), ảnh chữ ký CEO.

---

## 4. Hệ thiết kế (trong `index.html`)

- **Font** (Google Fonts, đều có tiếng Việt): Playfair Display (tiêu đề, tên, danh hiệu, thư), Great Vibes (chỉ chữ trang trí ngắn: "Chúc mừng ngày", "Gửi", "Vinh danh", "Tri ân", chữ ký), Bodoni Moda (chỉ con số 20/10), Be Vietnam Pro (nội dung).
  - **Great Vibes có dấu nặng rất nhỏ** (ị, ọ…) → không dùng cho tên/danh hiệu.
- **Màu** (`:root`): `--ink #3a1230` (chữ chính), `--ink2 #71405f`, `--pink #e8559c`, `--paper #fffaf3`, `--vn` (gradient tím cho "PHỤ NỮ VIỆT NAM"), `--noise` (SVG hạt nhiễu dạng data URI).
- **Định nghĩa SVG dùng chung** được JS chèn vào đầu `<body>`: gradient cánh hoa theo màu `pg-<mau>`/`pt-<mau>`, filter `#fuzz` (cánh mềm có hạt), `#leafg`, `#heart3d`, `#glassg`, `#silk`, `#silk2`, `#rib`.
- **Hoa** `flower(mau, {kind, base, stem})`: `kind` = `tron` (5 cánh) | `tulip` | `sao` (4 cánh); xoay vòng theo thứ tự người (`KINDS[i % 3]`). Nở bằng class `.bloom`.
- **Thẻ** `post(p, i)`: khung bài đăng; nền thẻ là gradient theo màu của người đó. Ảnh (`anh`) thành album trượt kiểu Instagram **chỉ gồm ảnh** (CEO 20/10: không chèn bông hoa; 1 ảnh thì đứng yên, không nút ‹ ›, không chấm), avatar nhỏ = ảnh đầu, chấm trang chạy thật. Người chưa có ảnh → 1 bông hoa + 4 chấm trang trí.
- **Album trượt** `slider(root, {auto, delay})`: dùng chung cho thẻ, mục "Khoảnh khắc rạng rỡ" (polaroid) trong thư và thẻ ở trình chiếu. Cuộn ngang scroll-snap (vuốt trên điện thoại), nút ‹ › (ẩn trên máy cảm ứng), chấm trang; tự chuyển khi đang hiện trên màn hình, dừng 7 giây sau khi người xem tự vuốt/bấm. Nút/chấm nằm trong thẻ có link nên chặn `preventDefault` để không mở thư.
- **Bức tường** 3 cột (10 người: hàng cuối 1 thẻ nằm giữa cột 2); điện thoại 2 cột, thẻ lẻ cuối nằm giữa. Mỗi thẻ có nút "Tải video thiệp" (nút nằm trong thẻ có link → chặn `preventDefault`).
- **Video thiệp** (`video.js`): MP4 1080×1350, 30 khung/giây, H.264 ~1,3 Mbps + AAC 128 kbps, ~35–45 giây, ~6–7 MB/người. Kịch bản: mở đầu (Chúc mừng ngày / PHỤ NỮ VIỆT NAM tím / ngày / lời mở đầu) → polaroid ảnh (Ken Burns, nhiều ảnh thì chuyển lần lượt) + "Gửi Mrs. X" → thẻ danh hiệu → từng lời chúc (văn bản có `\n` canh trái mỗi mục một dòng, văn xuôi canh giữa, ngắt dòng cân đối) → tri ân + chữ ký CEO. Nền, hoa, dải lụa, cánh hoa rơi vẽ bằng canvas theo đúng đường nét hoa trên web; mọi chuyển động tính theo thời gian + hạt giống theo `id` (quay lại ra y hệt). Nhạc = giai điệu riêng dựng offline (cùng bộ phát với web), chuẩn hoá đỉnh −1 dB, vào/ra nhỏ dần. Mã hoá WebCodecs + `mp4-muxer@5.2.2` (jsDelivr), moov đặt đầu file (phát được ngay khi đang tải).
- **Tải video**: trong thư có mục "Video thiệp 20.10" (trình phát + nút tải; iPhone hiện hướng dẫn Tệp → Chia sẻ → Lưu video); xem video thì nhạc nền tạm tắt. Trang chủ có "Tải tất cả video thiệp": tải lần lượt 10 MP4 rồi đóng ZIP ngay trên trình duyệt (kiểu store, tự viết, không thư viện) → `Vuon-Leap-20-10-tat-ca-video.zip`. Tên file từng video: `Vuon-Leap-20-10-<id>.mp4`.
- **Lớp trang trí cố định** `#decor`: hoa to mờ, hoa kính, tim 3D, vòng elip, sao ✦; trôi nhẹ theo con trỏ (parallax). Class `side` ẩn khi trình chiếu, `home-only` ẩn ở trang thư — ẩn bằng `filter:opacity(0)`.
- **Canvas `#sky`**: cánh hoa rơi + lấp lánh + nổ tim/lấp lánh (`sky.burst(x, y, n, 'heart'|'glint')`).
- **Nhạc nền** (tự sinh bằng Web Audio, không cần file): nút ♪ góc phải + nhãn tên bài đang phát (`#np`); bật khi mở thư/trình chiếu.
  - `SONGS`: 9 giai điệu — `vuon-leap` (bài chung: trang chủ, slide mở đầu/tri ân) + 8 bài riêng đặt tên theo nghề: `bang-can-doi` (Thảo, valse), `chien-dich` (Thịnh, pop), `giao-an` (Ngọc, chậm rãi), `khai-mac` (Phương Anh, kèn hiệu), `den-san-khau` (An, 6/8 chuông), `xu-huong` (Nhung, nảy nhịp), `y-tuong` (Nga, lydian), `khuc-xuan` (Xuân, ngũ cung + luyến đàn tranh), `dong-dau` (Ngọc Hà, "Đóng dấu yêu thương", kalimba), `hoc-lieu` (Linh, "Trang học liệu mới", đàn hạc, Mi giáng trưởng).
  - Cú pháp bài: `hop` vòng hợp âm (mỗi hợp âm 1 ô nhịp), `dem` tiếng đệm mỗi ô nhịp (`b` bè trầm, `0-3` nốt hợp âm, `4-7` cao 1 quãng tám, `.` nghỉ, `+` chơi cùng lúc), `giai` giai điệu (mỗi ký hiệu 1 bước), `sp` giây/bước, `tim` âm sắc trong `TIMBRE`.
  - `music.use(p)` đổi bài theo người (null → bài chung); mỗi bài phát qua một `GainNode` riêng (`bus`) để chuyển bài mờ dần, không lẫn nốt bài cũ.
  - Trong thư có dòng "♪ Giai điệu riêng: …" (bấm để bật nhạc).
- **Co chữ một dòng**: thuộc tính `data-fit="<cỡ tối thiểu>"` + hàm `fit()` / `fitAll()`; chạy sau khi font tải xong, khi đổi slide, khi mở thư, khi đổi kích thước cửa sổ.
- **Huy hiệu PNG** 1080×1350 vẽ bằng canvas (`downloadBadge`), phong cách poster hồng.

---

## 5. Diễn biến theo thời gian (15–19/10/2026)

1. **Ý tưởng** "Vườn Leap": mỗi người là một bông hoa; vinh danh + câu chuyện + lời chúc + thư CEO; màn hình lớn tại văn phòng; gợi ý robot UBTECH trao thư (chưa làm).
2. **Demo đầu** (theme đêm tím mộng mơ): vườn hoa SVG, phong thư, lá thư, trình chiếu, nhạc Web Audio, "tưới hoa" lưu localStorage.
3. CEO: không cần mọi người góp → **bỏ tưới hoa**. Áp theo template Canva "Purple Aesthetic Dreamy" (CEO tải PDF): tách ảnh trang trí từ PDF bằng PyMuPDF.
4. Nạp **8 người thật** + danh hiệu/lời chúc nháp; lưới vườn 4×2.
5. Đổi font, sửa tương phản, thêm hiệu ứng động, làm mượt chuyển trang (mờ dần), mở thư (crossfade), slide (crossfade).
6. CEO gửi **3 inspo** → **thiết kế lại toàn bộ** theo nền hồng hạt nhiễu (bỏ theme tím + xoá ảnh Canva).
7. Thêm glow chữ hồng/trắng + chuyển động tự chạy; phát hiện máy bật "giảm chuyển động" làm tắt hết hiệu ứng → bỏ cơ chế tự tắt.
8. "PHỤ NỮ VIỆT NAM" chuyển **tím**.
9. Sửa **lỗi mở thư** (tờ thư trồi lên đè tim + tên); **chống xuống dòng**; **bỏ xưng hô**, đổi link theo họ tên.
10. **"Mrs. + Tên"**; tên trong thư đặt trên **thiệp giấy kem** (không lẫn vào nền); **tối ưu hiệu năng** (chỉ animate transform/opacity).
11. 16/10: đưa lên GitHub (`LearntoLeap/vuon-leap-2010`) + viết nhật ký này và `CLAUDE.md`. CEO chọn chuyển repo **công khai** và bật **GitHub Pages** → link riêng dạng `https://learntoleap.github.io/vuon-leap-2010/#/thu/<id>`. Lưu ý: repo công khai nên ai cũng xem được `data.js` (tên, vai trò) — không đưa thông tin nhạy cảm vào.
12. 19/10: kiểm tra chạy lại cả 3 màn hình (không lỗi). **Mỗi người một giai điệu riêng** (8 bài tự sinh, tên theo công việc; trình chiếu tự đổi bài theo slide; có thể thay bằng file mp3 qua `fileNhac`). **Viết lại lời chúc**: mỗi người 3 lời — 1 lời "đúng định dạng nghề" (phiếu chi, brief chiến dịch, giáo án, kịch bản chương trình, checklist hậu cần, bài đăng, biên bản brainstorm, sổ đầu bài), 1 lời dí dỏm, 1 lời tri ân từ Learn to Leap. Lời chúc hỗ trợ xuống dòng `\n`; lưới lời chúc 2 cột, lời lẻ cuối nằm giữa. Sửa góc gấp thư CEO che chữ trên điện thoại. Push lên GitHub + tạo project **Vercel** `vuon-leap-2010` nối repo (team mặc định khoá mọi bản deploy bằng đăng nhập Vercel → chuyển project về chỉ khoá bản preview để link production mở công khai).
13. 19/10 (chiều): thêm **Ngọc Hà – Hành chính Tổng hợp** (bài "Đóng dấu yêu thương", 3 lời chúc kiểu công văn/con dấu). Nạp **ảnh cho cả 9 người** (18 ảnh, không trùng, đúng theo tên file CEO đặt) thành **album trượt**: thẻ trên bức tường + trình chiếu (kiểu Instagram), mục "Khoảnh khắc rạng rỡ" dạng polaroid trong thư. Trường `anhDaiDien` thay bằng mảng `anh` (code vẫn đọc `anhDaiDien` cũ).
14. 19/10: theo CEO, đảo thứ tự ảnh Hồ An — ảnh tốt nghiệp ("Hồ An 2") lên làm ảnh chính, ảnh "Hồ An 1" ra sau.
15. 20/10: clone repo sang máy 2 (`D:\Claude G\vuon-leap-2010`). Theo CEO, Phương Anh **chỉ dùng 1 ảnh mới** (selfie hoa sứ) → xoá `-1`, `-2`, lưu ảnh mới tên `dinh-hoang-phuong-anh-3.jpg` (đặt tên mới để người đã mở link không bị dính ảnh cũ trong cache). Cắt 4:5 bằng System.Drawing của PowerShell (máy 2 không có Python), xoá EXIF.
16. 20/10: theo CEO, album trượt trên thẻ (bức tường + trình chiếu) **chỉ chạy ảnh** — bỏ slide bông hoa ở cuối; 1 ảnh chạy 1 ảnh, 2 ảnh chạy 2 ảnh… Máy 2: preview mở bằng `http://127.0.0.1:5210` (`localhost` trỏ IPv6, http-server chỉ nghe IPv4).
17. 20/10: thêm **Thùy Linh – Chuyên viên Chuyên môn** (ảnh Hội An, bài "Trang học liệu mới", 3 lời chúc: rubric đánh giá / bản thảo học liệu / tri ân). Thêm **video thiệp MP4 cho từng người** + nút tải trên thẻ, trong thư và "Tải tất cả" (ZIP). Máy quay ở `#/quay-video`; máy chủ `cong-cu/may-chu.mjs` thay cho http-server.
18. 20/10: thêm ảnh thứ 3 cho Mrs. Xuân (đứng trước pano "Ngày Hội Khoa học và Công nghệ", cắt 4:5 hẹp quanh người, giữ trọn tiêu đề) → `dao-thi-xuan-3.jpg`, cuối album; quay lại video của Mrs. Xuân (cảnh ảnh 10,2 giây cho 3 ảnh, video 45,6 giây).

---

## 6. Bẫy kỹ thuật đã gặp (đừng lặp lại)

- **Trùng tên class**: lá thư dùng `.show`, container trình chiếu từng cũng là `.show` (position fixed) → lá thư bị ghim, không cuộn. Container trình chiếu giờ là `.screen`.
- **`[hidden]` bị `display:flex` đè** → luôn có `[hidden]{display:none!important}`.
- **Animation `fill-mode: both` giữ cứng opacity/transform** → transition ẩn/hiện sau đó không chạy. Các phần cần mờ đi khi mở thư (tim, gợi ý, phong thư) dùng `backwards`.
- **Ẩn phần tử đang có animation bằng `opacity`** không ăn (animation ghi đè) → dùng `filter:opacity(0)`.
- **`prefers-reduced-motion`**: máy CEO bật → từng làm tắt hết animation. Đã gỡ; đừng thêm lại.
- **Hiệu năng**: không animate `text-shadow`/`box-shadow`, không `filter: blur` trên khung lớn, không đặt filter trên từng chữ; phần tử chuyển động liên tục có `will-change: transform`.
- **Chữ gradient + `background-clip:text`**: nét chữ/dấu vượt ra ngoài hộp sẽ bị mất → các `.ch`/`.script` có padding bù; glow dùng `filter: drop-shadow` (không dùng `text-shadow`).
- **Ô xem trước của Claude bị ẩn** thì `requestAnimationFrame` không chạy và ảnh chụp bị trễ → kiểm tra logic bằng JS/DOM; với chuyển cảnh dùng `void el.offsetWidth` thay vì rAF.
- **Commit author**: repo LtL đặt `git config user.name "LearntoLeap"` + `user.email "phonix.team2023@gmail.com"` cấp local.
- **Máy quay video**: trạng thái canvas (`textAlign`, `letterSpacing`) quay về giá trị cũ sau `restore()` → đặt lại ngay trước khi vẽ chữ. Cánh hoa rơi phải vẽ **trước** nội dung (vẽ sau thì che mặt người trong ảnh và che chữ). Không dùng `requestAnimationFrame`/`setTimeout` khi quay (ô xem trước bị ẩn sẽ bị chậm) — vòng quay nhường luồng bằng `MessageChannel`. Máy 2: `localhost` trỏ IPv6 → mở bằng `127.0.0.1`.

---

## 7. Việc tiếp theo gợi ý

- [ ] CEO duyệt/sửa danh hiệu, mô tả, thư CEO và 24 lời chúc mới (19/10) trong `data.js`.
- [x] Push bản 19/10 lên `main` + deploy Vercel (https://vuon-leap-2010.vercel.app/).
- [ ] CEO xác nhận họ tên đầy đủ, danh hiệu, lời chúc của Ngọc Hà và Thùy Linh (đang là nháp).
- [ ] **Mỗi lần sửa `data.js` → quay lại video** ở `#/quay-video` (chạy bằng `node cong-cu/may-chu.mjs`), rồi commit cả thư mục `video/`.
- [ ] (Tuỳ chọn) Thay giai điệu bằng bài hát thật: bỏ file vào `nhac/`, điền `fileNhac` — repo công khai nên chỉ dùng nhạc được phép chia sẻ.
- [x] Ảnh cho 9 người (19/10). - [ ] (Tuỳ chọn) số liệu, câu chuyện + ảnh.
- [x] Deploy GitHub Pages (16/10). Gửi link riêng `…/#/thu/<id>` cho từng người sáng 20/10.
- [ ] (Tuỳ chọn) In QR từng link lên thiệp kèm hoa; kịch bản robot trao thư; chạy thử trên TV văn phòng ngày 19/10.
