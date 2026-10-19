/* =========================================================
   VƯỜN LEAP · 20.10 — DỮ LIỆU
   Anh chỉ cần sửa file này. Mỗi người là 1 khối { ... }.
   - id: viết liền không dấu, dùng làm link riêng (…/#/thu/<id>)
   - goiTen: tên hiển thị chính, ví dụ "Mrs. Thảo" (có thể đổi sang "Ms. Thảo"). Họ tên đầy đủ (ten) hiện ở dòng phụ.
   - mau: màu hoa — "hong" | "tim" | "dao" | "vang" | "xanh"
   - anh: danh sách ảnh (khung 4:5), trượt để xem trên thẻ, trong thư và khi trình chiếu, theo đúng thứ tự viết.
     Ví dụ ["anh/phan-thi-thao-1.jpg", "anh/phan-thi-thao-2.jpg"]. Để [] thì chỉ hiện bông hoa.
   - danhHieu / moTaDanhHieu: đang là BẢN NHÁP theo vai trò, anh sửa lại cho đúng người.
   - nhac: giai điệu riêng, tự phát khi mở thư / tới slide của người đó (không cần file nhạc). Chọn 1 trong:
       "bang-can-doi"  Bảng cân đối dịu dàng   (valse, đàn hạc)
       "chien-dich"    Chiến dịch rực rỡ       (pop sôi nổi, marimba)
       "giao-an"       Giáo án du dương        (chậm rãi, hộp nhạc)
       "khai-mac"      Đếm ngược khai mạc      (kèn hiệu rộn ràng)
       "den-san-khau"  Ánh đèn sân khấu        (6/8 mơ màng, chuông)
       "xu-huong"      Lên xu hướng            (nảy nhịp, marimba)
       "y-tuong"       Ý tưởng lấp lánh        (tinh nghịch, hộp nhạc)
       "khuc-xuan"     Khúc xuân lớp học       (ngũ cung, đàn tranh)
       "dong-dau"      Đóng dấu yêu thương     (nhịp văn phòng, kalimba)
   - fileNhac: muốn dùng bài hát thật thì bỏ file vào thư mục nhac/ rồi điền, ví dụ "nhac/thao.mp3".
     Để "" thì dùng giai điệu ở trên. Lưu ý: repo công khai — chỉ dùng nhạc được phép chia sẻ.
   - tenNhac: tên bài hiển thị. Để "" thì dùng tên giai điệu.
   - soLieu: tối đa 3 ô { so, nhan }. Để [] thì phần này tự ẩn.
   - cauChuyen: { anh, nhan, ke }. Ảnh bỏ vào thư mục anh/, ví dụ anh: "anh/thao-1.jpg". Để [] thì tự ẩn.
   - loiChuc: { tu, noiDung }. Muốn xuống dòng trong lời chúc thì viết \n (không bấm Enter). Để [] thì tự ẩn.
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
      anh: ["anh/phan-thi-thao-1.jpg", "anh/phan-thi-thao-2.jpg"],
      nhac: "bang-can-doi", fileNhac: "", tenNhac: "",
      danhHieu: "Người giữ nhịp cho cả nhà",
      moTaDanhHieu: "Lo trọn từng con số và từng con người của Leap, chu đáo đến từng chi tiết.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Phiếu chi đặc biệt số 20/10", noiDung: "Nội dung chi: một ngày thật vui.\nSố tiền: không giới hạn nụ cười.\nNgười duyệt: cả nhà Leap.\nTrạng thái: đã duyệt, không cần chứng từ!" },
        { tu: "Những con số biết ơn", noiDung: "Sổ sách cuối tháng có thể khoá, nhưng sự chu đáo thì chưa bao giờ khoá sổ. Chúc tài khoản niềm vui luôn dư có, bảng cân đối luôn khớp ngay lần đầu, và mọi nỗi lo đều được xoá sổ." },
        { tu: "Learn to Leap", noiDung: "Từ hồ sơ nhân sự đến từng bảng lương, mỗi việc đều được lo trọn vẹn và lặng lẽ. Cảm ơn vì đã giữ cho ngôi nhà Leap luôn ngăn nắp và ấm áp." }
      ]
    },
    {
      id: "nguyen-thi-thinh",
      ten: "Nguyễn Thị Thịnh",
      goiTen: "Mrs. Thịnh",
      vaiTro: "Giám đốc Marketing",
      mau: "tim",
      anh: ["anh/nguyen-thi-thinh-1.jpg", "anh/nguyen-thi-thinh-2.jpg", "anh/nguyen-thi-thinh-3.jpg"],
      nhac: "chien-dich", fileNhac: "", tenNhac: "",
      danhHieu: "Người kể chuyện của Leap",
      moTaDanhHieu: "Đưa câu chuyện của Learn to Leap đến gần hơn với từng ngôi trường.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Bản brief chiến dịch 20/10", noiDung: "Mục tiêu: hạnh phúc tăng trưởng 200%.\nKênh triển khai: mọi ngày trong năm.\nNgân sách: không giới hạn.\nKPI duy nhất: nụ cười luôn đạt 100%." },
        { tu: "Báo cáo hiệu quả", noiDung: "Chúc 20/10 có độ phủ rộng khắp, tương tác nồng nhiệt và toàn bình luận yêu thương. Một chiến dịch như vậy, chỉ người kể chuyện giỏi nhất của Leap mới xứng đáng." },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã dẫn dắt đội Marketing và đưa câu chuyện STEM của Leap đến gần hơn với thầy cô, phụ huynh và học sinh. Chúc luôn rạng rỡ và tràn đầy cảm hứng!" }
      ]
    },
    {
      id: "le-bich-ngoc",
      ten: "Lê Bích Ngọc",
      goiTen: "Mrs. Ngọc",
      vaiTro: "Giám đốc Chuyên môn",
      mau: "dao",
      anh: ["anh/le-bich-ngoc-1.jpg"],
      nhac: "giao-an", fileNhac: "", tenNhac: "",
      danhHieu: "Người giữ chất lượng từng bài học",
      moTaDanhHieu: "Mỗi chương trình đến tay học sinh đều mang một dấu ấn chỉn chu.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Giáo án đặc biệt ngày 20/10", noiDung: "Mục tiêu: hạnh phúc trọn vẹn.\nKhởi động: một bó hoa thật đẹp.\nHình thành kiến thức: được cả nhà Leap trân trọng.\nVận dụng: cười thật nhiều.\nĐánh giá: Hoàn thành xuất sắc!" },
        { tu: "Cây bút đỏ duyệt bài", noiDung: "Hôm nay bút đỏ xin nghỉ phép: không sửa giáo án, không góp ý học liệu. Chỉ còn một nhận xét duy nhất cho người giữ chất lượng từng bài học: Đạt chuẩn, vượt mong đợi!" },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã giữ vững chuyên môn – nền móng của Leap. Chúc một ngày 20/10 thật an yên và hạnh phúc!" }
      ]
    },
    {
      id: "dinh-hoang-phuong-anh",
      ten: "Đình Hoàng Phương Anh",
      goiTen: "Mrs. Phương Anh",
      vaiTro: "Sự kiện",
      mau: "vang",
      anh: ["anh/dinh-hoang-phuong-anh-1.jpg", "anh/dinh-hoang-phuong-anh-2.jpg"],
      nhac: "khai-mac", fileNhac: "", tenNhac: "",
      danhHieu: "Phù thuỷ sự kiện",
      moTaDanhHieu: "Biến mỗi sự kiện của Leap thành một kỷ niệm đáng nhớ.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Kịch bản chương trình 20/10", noiDung: "08:00 – Mở màn bằng hoa và lời chúc.\n10:00 – Tiết mục chính: cười thật tươi.\n12:00 – Giải lao không giới hạn.\n17:00 – Bế mạc: một ngày trọn vẹn, không phát sinh sự cố!" },
        { tu: "Bộ đàm hậu trường", noiDung: "Alo alo, tổng đạo diễn nghe rõ trả lời! Hôm nay không cần chạy sân khấu, không cần check-in khách mời. Nhiệm vụ duy nhất: đứng yên để nhận hoa. Hết!" },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì những sự kiện chạy trơn tru đến từng phút. Chúc luôn tươi tắn và tràn năng lượng!" }
      ]
    },
    {
      id: "ho-thi-an",
      ten: "Hồ Thị An",
      goiTen: "Mrs. An",
      vaiTro: "Sự kiện",
      mau: "xanh",
      anh: ["anh/ho-thi-an-2.jpg", "anh/ho-thi-an-1.jpg"],
      nhac: "den-san-khau", fileNhac: "", tenNhac: "",
      danhHieu: "Người thắp sáng sân khấu",
      moTaDanhHieu: "Phía sau mỗi sự kiện trọn vẹn là một sự tận tâm thầm lặng.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Checklist hậu cần 20/10", noiDung: "✓ Hoa tươi: đã có.\n✓ Ánh đèn: chiếu đúng người.\n✓ Âm thanh: toàn lời khen.\n✓ Khán giả: cả nhà Leap.\n✓ Việc phải lo hôm nay: không có!" },
        { tu: "Ánh đèn sân khấu", noiDung: "Bao nhiêu lần đứng sau cánh gà để mọi thứ diễn ra suôn sẻ. Hôm nay đèn xin đổi hướng, chiếu thẳng vào nhân vật chính của ngày 20/10." },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã góp sức cho những ngày hội rộn ràng của Leap. Chúc một ngày 20/10 thật nhiều niềm vui và quà xinh!" }
      ]
    },
    {
      id: "pham-thi-hong-nhung",
      ten: "Phạm Thị Hồng Nhung",
      goiTen: "Mrs. Nhung",
      vaiTro: "Marketing",
      mau: "hong",
      anh: ["anh/pham-thi-hong-nhung-1.jpg", "anh/pham-thi-hong-nhung-2.jpg"],
      nhac: "xu-huong", fileNhac: "", tenNhac: "",
      danhHieu: "Người lan toả cảm hứng",
      moTaDanhHieu: "Mang hình ảnh Learn to Leap lan toả đến nhiều người hơn mỗi ngày.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Bài đăng ngày 20/10", noiDung: "Caption: Ngày của những bông hoa đẹp nhất Leap ✿\nHashtag: #XinhĐẹp #SángTạo #20Tháng10\nLượt thích: không đếm xuể.\nBình luận nổi bật: «Bài này phải lên xu hướng!»" },
        { tu: "Thuật toán mạng xã hội", noiDung: "Đã phân tích dữ liệu và kết luận: nội dung chạm đến người xem nhất hôm nay chính là nụ cười của người làm nội dung. Đề xuất: đẩy lên xu hướng cả ngày!" },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì những nội dung chạm đến người xem. Chúc luôn xinh đẹp và sáng tạo không ngừng!" }
      ]
    },
    {
      id: "dieu-nga",
      ten: "Diệu Nga",
      goiTen: "Mrs. Nga",
      vaiTro: "Marketing",
      mau: "tim",
      anh: ["anh/dieu-nga-1.jpg", "anh/dieu-nga-2.jpg"],
      nhac: "y-tuong", fileNhac: "", tenNhac: "",
      danhHieu: "Ngọn lửa sáng tạo",
      moTaDanhHieu: "Luôn có ý tưởng mới cho những câu chuyện của Leap.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Biên bản brainstorm 20/10", noiDung: "Ý tưởng 1: tặng hoa – duyệt.\nÝ tưởng 2: tặng thêm một ngày thật vui – duyệt.\nÝ tưởng 3: để người có nhiều ý tưởng hay nhất được nghỉ ngơi – duyệt ngay, không cần họp lại!" },
        { tu: "Bóng đèn ý tưởng", noiDung: "Mỗi lần có ý tưởng mới, bóng đèn này lại bật sáng. Hôm nay đèn xin sáng cả ngày để chúc mừng người nghĩ ra những ý tưởng ấy: luôn tươi mới, luôn rực rỡ!" },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì những ý tưởng làm Leap thêm tươi mới. Chúc một ngày 20/10 thật rực rỡ!" }
      ]
    },
    {
      id: "dao-thi-xuan",
      ten: "Đào Thị Xuân",
      goiTen: "Mrs. Xuân",
      vaiTro: "Quản lý Giáo viên",
      mau: "dao",
      anh: ["anh/dao-thi-xuan-1.jpg", "anh/dao-thi-xuan-2.jpg"],
      nhac: "khuc-xuan", fileNhac: "", tenNhac: "",
      danhHieu: "Người dẫn dắt đội ngũ giáo viên",
      moTaDanhHieu: "Đồng hành cùng từng thầy cô để mỗi giờ học STEM đều trọn vẹn.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Sổ đầu bài ngày 20/10", noiDung: "Tiết 1: Nhận hoa – cả lớp hăng hái.\nTiết 2: Nghe lời chúc – cả lớp đồng thanh.\nTiết 3: Học cách nghỉ ngơi.\nBài tập về nhà: cười thật nhiều.\nXếp loại tiết học: Tốt!" },
        { tu: "Thời khoá biểu", noiDung: "Đã xếp lại toàn bộ lịch dạy: hôm nay không có tiết trống nào phải lo, không có lớp nào cần dạy thay. Chỉ còn đúng một tiết: tiết vinh danh người quản lý tận tâm nhất." },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã chăm chút đội ngũ giáo viên như chăm một khu vườn. Chúc một ngày 20/10 thật ấm áp và hạnh phúc!" }
      ]
    },
    {
      id: "ngoc-ha",
      ten: "Ngọc Hà",
      goiTen: "Mrs. Ngọc Hà",
      vaiTro: "Hành chính Tổng hợp",
      mau: "vang",
      anh: ["anh/ngoc-ha-1.jpg", "anh/ngoc-ha-2.jpg"],
      nhac: "dong-dau", fileNhac: "", tenNhac: "",
      danhHieu: "Người giữ nếp cho văn phòng",
      moTaDanhHieu: "Từ giấy tờ, lịch họp đến từng góc văn phòng, mọi việc đều được sắp xếp chu toàn.",
      soLieu: [],
      cauChuyen: [],
      loiChuc: [
        { tu: "Công văn số 20/10/HCTH", noiDung: "Kính gửi: người giữ nếp cả văn phòng.\nV/v: nghỉ ngơi và nhận hoa.\nNội dung: hôm nay mọi giấy tờ xin tự xếp hàng ngay ngắn.\nNơi nhận: cả nhà Leap (để cùng vui)." },
        { tu: "Con dấu văn phòng", noiDung: "Mỗi ngày đóng không biết bao nhiêu dấu để giấy tờ chạy đúng hạn. Hôm nay con dấu xin đóng một dấu thật đặc biệt: ĐÃ DUYỆT – một ngày 20/10 thật vui!" },
        { tu: "Learn to Leap", noiDung: "Cảm ơn vì đã giữ cho văn phòng Leap luôn ngăn nắp, trơn tru và ấm áp. Chúc một ngày 20/10 thật nhẹ nhàng và rạng rỡ!" }
      ]
    }
  ]
};
