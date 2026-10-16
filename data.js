/* =========================================================
   VƯỜN LEAP · 20.10 — DỮ LIỆU
   Anh chỉ cần sửa file này. Mỗi người là 1 khối { ... }.
   - id: viết liền không dấu, dùng làm link riêng (…/#/thu/<id>)
   - goiTen: tên hiển thị chính, ví dụ "Mrs. Thảo" (có thể đổi sang "Ms. Thảo"). Họ tên đầy đủ (ten) hiện ở dòng phụ.
   - mau: màu hoa — "hong" | "tim" | "dao" | "vang" | "xanh"
   - anhDaiDien: ảnh chân dung hiện trên thẻ bài đăng, ví dụ "anh/thao.jpg". Để "" thì hiện bông hoa.
   - danhHieu / moTaDanhHieu / loiChuc: đang là BẢN NHÁP theo vai trò, anh sửa lại cho đúng người.
   - soLieu: tối đa 3 ô { so, nhan }. Để [] thì phần này tự ẩn.
   - cauChuyen: { anh, nhan, ke }. Ảnh bỏ vào thư mục anh/, ví dụ anh: "anh/thao-1.jpg". Để [] thì tự ẩn.
   - loiChuc: { tu, noiDung }. Để [] thì tự ẩn.
   ========================================================= */

window.LEAP = {
  tieuDe: "Vườn Leap",
  ngay: "20 · 10 · 2026",
  loiMoDau:
    "Mỗi bông hoa trong khu vườn này là một người phụ nữ đã làm Learn to Leap rực rỡ hơn mỗi ngày.",

  // BẢN NHÁP — anh sửa lại theo lời của anh
  thuCEO: {
    nguoiKy: "Lê Văn Trí",
    chucVu: "CEO Learn to Leap",
    noiDung:
      "Gửi những bông hoa của Learn to Leap,\n\nCảm ơn vì đã luôn là người giữ nhịp, giữ lửa và giữ cả sự dịu dàng cho tập thể này. Những hồ sơ kịp giờ, những buổi STEM Day rộn tiếng cười, những lần âm thầm gánh việc — tất cả đều được nhìn thấy và trân trọng.\n\nChúc một ngày 20/10 thật rạng rỡ, và một hành trình phía trước luôn được yêu thương.",
    anhChuKy: "" // ví dụ: "anh/chu-ky-ceo.png"
  },

  chiEm: [
    {
      id: "phan-thi-thao",
      ten: "Phan Thị Thảo",
      goiTen: "Mrs. Thảo",
      vaiTro: "Hành chính Nhân sự – Kế toán",
      mau: "hong",
      anhDaiDien: "",
      danhHieu: "Người giữ nhịp cho cả nhà",
      moTaDanhHieu: "Lo trọn từng con số và từng con người của Leap, chu đáo đến từng chi tiết.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã lặng lẽ giữ cho mọi thứ vận hành trơn tru. Chúc một ngày 20/10 thật nhẹ nhàng và nhiều niềm vui!" }
      ]
    },
    {
      id: "nguyen-thi-thinh",
      ten: "Nguyễn Thị Thịnh",
      goiTen: "Mrs. Thịnh",
      vaiTro: "Giám đốc Marketing",
      mau: "tim",
      anhDaiDien: "",
      danhHieu: "Người kể chuyện của Leap",
      moTaDanhHieu: "Đưa câu chuyện của Learn to Leap đến gần hơn với từng ngôi trường.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã dẫn dắt đội Marketing và làm hình ảnh Leap ngày một đẹp hơn. Chúc luôn rạng rỡ và tràn đầy cảm hứng!" }
      ]
    },
    {
      id: "le-bich-ngoc",
      ten: "Lê Bích Ngọc",
      goiTen: "Mrs. Ngọc",
      vaiTro: "Giám đốc Chuyên môn",
      mau: "dao",
      anhDaiDien: "",
      danhHieu: "Người giữ chất lượng từng bài học",
      moTaDanhHieu: "Mỗi chương trình đến tay học sinh đều mang một dấu ấn chỉn chu.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã giữ vững chuyên môn – nền móng của Leap. Chúc một ngày 20/10 thật an yên và hạnh phúc!" }
      ]
    },
    {
      id: "dinh-hoang-phuong-anh",
      ten: "Đình Hoàng Phương Anh",
      goiTen: "Mrs. Phương Anh",
      vaiTro: "Sự kiện",
      mau: "vang",
      anhDaiDien: "",
      danhHieu: "Phù thuỷ sự kiện",
      moTaDanhHieu: "Biến mỗi sự kiện của Leap thành một kỷ niệm đáng nhớ.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì những sự kiện chạy trơn tru đến từng phút. Chúc luôn tươi tắn và tràn năng lượng!" }
      ]
    },
    {
      id: "ho-thi-an",
      ten: "Hồ Thị An",
      goiTen: "Mrs. An",
      vaiTro: "Sự kiện",
      mau: "xanh",
      anhDaiDien: "",
      danhHieu: "Người thắp sáng sân khấu",
      moTaDanhHieu: "Phía sau mỗi sự kiện trọn vẹn là một sự tận tâm thầm lặng.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã góp sức cho những ngày hội rộn ràng của Leap. Chúc một ngày 20/10 thật nhiều niềm vui và quà xinh!" }
      ]
    },
    {
      id: "pham-thi-hong-nhung",
      ten: "Phạm Thị Hồng Nhung",
      goiTen: "Mrs. Nhung",
      vaiTro: "Marketing",
      mau: "hong",
      anhDaiDien: "",
      danhHieu: "Người lan toả cảm hứng",
      moTaDanhHieu: "Mang hình ảnh Learn to Leap lan toả đến nhiều người hơn mỗi ngày.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì những nội dung chạm đến người xem. Chúc luôn xinh đẹp và sáng tạo không ngừng!" }
      ]
    },
    {
      id: "dieu-nga",
      ten: "Diệu Nga",
      goiTen: "Mrs. Nga",
      vaiTro: "Marketing",
      mau: "tim",
      anhDaiDien: "",
      danhHieu: "Ngọn lửa sáng tạo",
      moTaDanhHieu: "Luôn có ý tưởng mới cho những câu chuyện của Leap.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì những ý tưởng làm Leap thêm tươi mới. Chúc một ngày 20/10 thật rực rỡ!" }
      ]
    },
    {
      id: "dao-thi-xuan",
      ten: "Đào Thị Xuân",
      goiTen: "Mrs. Xuân",
      vaiTro: "Quản lý Giáo viên",
      mau: "dao",
      anhDaiDien: "",
      danhHieu: "Người dẫn dắt đội ngũ giáo viên",
      moTaDanhHieu: "Đồng hành cùng từng thầy cô để mỗi giờ học STEM đều trọn vẹn.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã chăm chút đội ngũ giáo viên như chăm một khu vườn. Chúc một ngày 20/10 thật ấm áp và hạnh phúc!" }
      ]
    }
  ]
};
