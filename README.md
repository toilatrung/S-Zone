# Cấu trúc hệ thống - Website S-Zone --- Phản Ánh Bạo Lực Học Đường

## Tổng quan (Overview)
Đây là một ứng dụng Web tĩnh (Client-side) được xây dựng bằng React và Vite. 
Mục tiêu của hệ thống là cung cấp một kênh ẩn danh, an toàn và nhanh chóng để học sinh, phụ huynh hoặc người chứng kiến có thể báo cáo các sự cố về bạo lực học đường.

Hệ thống hoạt động theo tiêu chí **"Zero-Backend"** (không có backend riêng). Toàn bộ dữ liệu được thu thập từ Frontend và gửi trực tiếp đến các dịch vụ của bên thứ 3 (Google Forms và EmailJS) để lưu trữ và thông báo.

---

## Kiến trúc kỹ thuật (Technical Architecture)

### 1. Frontend (Giao diện người dùng)
- **Framework**: React 18+ với TypeScript.
- **Build Tool**: Vite (giúp build nhanh và tối ưu).
- **Styling**: Native CSS (`App.css`, `index.css`) kết hợp với CSS Variables để quản lý theme.
- **Routing**: Hiện tại là Single Page Application (SPA), mọi tương tác chính đều nằm trên một trang duy nhất (`LandingPage.tsx`).

### 2. Xử lý Dữ liệu (Data Flow & Integrations)

Khi người dùng nhấn gửi báo cáo (`submit`), quá trình xử lý diễn ra theo trình tự sau:

1. **Validation (Xác thực dữ liệu Client-side)**: 
   - Kiểm tra các trường bắt buộc (Vai trò, Loại vấn đề, Mức độ khẩn cấp).
   - Kiểm tra độ dài tối đa của mô tả (500 ký tự).
   - *Code logic*: `validateForm` trong `ReportForm.tsx`.

2. **Gửi dữ liệu lưu trữ (Google Forms)**:
   - Dữ liệu hợp lệ sẽ được chuyển đổi (map) sang ID các câu hỏi (entries) của Google Form.
   - Gửi request `POST` dạng `no-cors` trực tiếp đến endpoint `formResponse` của Google Forms. Hệ thống sử dụng cách này như một Database miễn phí.
   - *Code logic*: `submitReport.ts`.

3. **Gửi thông báo (EmailJS)**:
   - Sau khi gửi cho Google Forms thành công, hệ thống tiếp tục dùng EmailJS để gửi email thông báo realtime (thời gian thực) đến ban giám hiệu hoặc người quản lý hệ thống.
   - *Code logic*: Tích hợp thư viện `@emailjs/browser` ngay bên trong hàm `handleSubmit` của `ReportForm.tsx`.

### 3. Cấu trúc thư mục (Directory Structure)

Dự án tuân theo cấu trúc tiêu chuẩn của một dự án React:
```text
src/
├── assets/         # Chứa hình ảnh, icons tĩnh
├── components/     # Các UI Component tái sử dụng (VD: ReportForm.tsx)
├── config/         # File cấu hình tập trung
│   └── reportConfig.ts  # Chứa các list dropdown, URL Integrations, Mapping Google Form
├── pages/          # Các trang React (VD: LandingPage.tsx)
├── services/       # Thao tác liên quan đến API/Network
│   └── submitReport.ts  # Logic gọi API sang Google Forms
├── types/          # Định nghĩa TypeScript Interfaces/Types
│   └── report.ts        # Type cho dữ liệu form
├── App.tsx         # Root component khởi tạo App
├── main.tsx        # Entry point mount React vào HTML DOM
├── index.css       # Global styles variables
└── App.css         # Component specific styles
```

---

## Các thành phần chính (Core Components)

### `ReportForm.tsx` (Thành phần trung tâm)
- Là trái tim của ứng dụng, quản lý trạng thái form (React `useState`).
- Chặn hành vi submit liên tục (cờ `isSubmitting`).
- Gọi service `submitReport` (Google Form) rồi gọi `emailjs.send` (thông báo email).
- Hiển thị màn hình thành công khi hoàn tất quy trình.

### `LandingPage.tsx`
- Layout chính, chứa các tính năng bên ngoài lề của form:
  - Mã QR động (tạo tự động qua API qrserver để trỏ về URL hiện tại).
  - Nút "Liên hệ khẩn cấp" hiển thị Modal điều hướng sang Zalo Chat hoặc Gọi điện thoại số Hotline.
  - Tích hợp Iframe Video Youtube và Bài báo tuyên truyền.

### `config/reportConfig.ts`
- Toàn bộ nội dung tĩnh, cấu hình môi trường được tách ra file này để Developer dễ thay đổi mà không cần đụng vào logic UI.
- Quản lý các Biến môi trường (`import.meta.env.*`) để nạp URL, ID cấu hình cho EmailJS, Google Form và Hotline.

---

## Yêu cầu môi trường (Environment Variables)

Hệ thống cần các biến môi trường sau trong file `.env` để hoạt động đầy đủ tính năng:

- **Google Forms**: 
  - `VITE_GOOGLE_FORM_ACTION_URL`
  - Các biến `VITE_GOOGLE_ENTRY_*` (để map đúng ID câu hỏi)
- **EmailJS**:
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_TEMPLATE_ID`
  - `VITE_EMAILJS_PUBLIC_KEY`
- **Tích hợp khác**:
  - `VITE_HOTLINE_PHONE` (Số điện thoại đường dây nóng)

## Hướng phát triển trong tương lai
- **Backend Thực sự**: Nếu quy mô lớn, có thể xây dựng Node.js/Python backend thay thế Google Forms để quản lý dữ liệu an toàn và linh hoạt hơn.
- **Tích hợp Zalo OA**: Sử dụng Zalo ZNS hoặc Bot để gửi tin nhắn thông báo (thay thế EmailJS) giúp người quản lý nhận thông tin nhanh hơn trên điện thoại.
