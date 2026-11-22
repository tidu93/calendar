# 📅 MyCalendar - Ứng Dụng Lịch Cá Nhân (Personal Calendar Web App)

Một ứng dụng web lịch cá nhân hiện đại, trực quan được xây dựng hoàn toàn bằng **HTML5, CSS3 và JavaScript thuần (Vanilla JS)**.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Tính Năng Chính

- **Lịch Tháng Động (Dynamic Month Calendar):** 
  - Tính toán chính xác ngày trong tháng theo chuẩn thứ Hai đến Chủ Nhật.
  - Điều hướng tháng trước, tháng sau, quay về ngày hôm nay một cách nhanh chóng.
  - Làm nổi bật ngày hôm nay và ngày đang được chọn.
- **Đồng Hồ Số Thời Gian Thực (Live Clock):**
  - Hiển thị giờ:phút:giây và ngày tháng cập nhật mỗi giây chuẩn tiếng Việt.
- **Quản Lý Sự Kiện / Lịch Trình Đầy Đủ (Event Management):**
  - Thêm, sửa, xóa sự kiện với đầy đủ thông tin: Tiêu đề, Giờ bắt đầu, Giờ kết thúc, Danh mục, Ghi chú.
  - Đánh dấu hoàn thành nhiệm vụ với hiệu ứng trực quan.
  - Phân loại danh mục theo 4 màu sắc:
    - 💼 **Công việc** (Xanh dương)
    - 📚 **Học tập** (Xanh lá)
    - ☕ **Cá nhân** (Tím)
    - ⭐ **Quan trọng** (Đỏ)
- **Lưu Trữ Bền Vững (LocalStorage):**
  - Tự động lưu mọi sự kiện và trạng thái giao diện vào bộ nhớ trình duyệt, không lo mất dữ liệu khi tải lại trang.
- **Chế Độ Sáng / Tối (Dark / Light Mode):**
  - Chuyển đổi giao diện Sáng / Tối mượt mà chỉ với một cú nhấp chuột.
- **Bộ Lọc Tiện Lợi (Category Filter):**
  - Lọc nhanh các sự kiện theo từng danh mục mong muốn.
- **Thiết Kế Tương Thích (Responsive Design):**
  - Hiển thị đẹp mắt trên cả máy tính, máy tính bảng và điện thoại.

---

## 🚀 Cách Cài Đặt Và Sử Dụng

1. Clone repository về máy:
   ```bash
   git clone https://github.com/tidu93/calendar.git
   ```
2. Mở thư mục dự án và nhấp đúp vào file `index.html` để chạy trực tiếp trên bất kỳ trình duyệt nào (Chrome, Edge, Firefox, Safari...).

---

## 📂 Cấu Trúc Dự Án

```
├── index.html       # Cấu trúc giao diện HTML
├── style.css        # Thiết kế giao diện và hiệu ứng CSS
├── script.js       # Logic xử lý lịch, đồng hồ và sự kiện bằng JavaScript
├── .gitignore       # Bỏ qua các file tạm, file thực thi
└── README.md        # Tài liệu hướng dẫn dự án
```

