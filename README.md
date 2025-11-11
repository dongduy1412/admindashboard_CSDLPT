# QuanLyTro Admin Dashboard

Hệ thống quản lý nhà trọ với Backend API (Node.js/Express) và Frontend Dashboard (React.js)

## Yêu cầu hệ thống

- Node.js v18+ 
- SQL Server 2019+
- npm hoặc yarn

## Cài đặt

### 1. Backend Setup

```bash
cd F:\admin_dashboard
npm install
```

### 2. Cấu hình Database

Tạo file `.env` từ `.env.example`:

```bash
copy .env.example .env
```

Chỉnh sửa file `.env` với thông tin SQL Server của bạn:

```
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=QuanLyTro
DB_USER=sa
DB_PASSWORD=your_password
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true
PORT=5000
```

### 3. Chạy Backend Server

```bash
npm start
```

Hoặc chạy với nodemon (auto-restart khi có thay đổi):

```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

## API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan

### Khu trọ
- `GET /api/khutro` - Lấy danh sách khu trọ
- `GET /api/khutro/:id` - Lấy chi tiết khu trọ
- `POST /api/khutro` - Tạo khu trọ mới
- `PUT /api/khutro/:id` - Cập nhật khu trọ
- `DELETE /api/khutro/:id` - Xóa khu trọ

### Phòng trọ
- `GET /api/phongtro` - Lấy danh sách phòng
- `GET /api/phongtro/:id` - Lấy chi tiết phòng
- `POST /api/phongtro` - Tạo phòng mới
- `PUT /api/phongtro/:id` - Cập nhật phòng
- `DELETE /api/phongtro/:id` - Xóa phòng

### Khách thuê
- `GET /api/khachthue` - Lấy danh sách khách thuê
- `GET /api/khachthue/:id` - Lấy chi tiết khách thuê
- `POST /api/khachthue` - Tạo khách thuê mới
- `PUT /api/khachthue/:id` - Cập nhật khách thuê
- `DELETE /api/khachthue/:id` - Xóa khách thuê

### Hợp đồng
- `GET /api/hopdong` - Lấy danh sách hợp đồng
- `GET /api/hopdong/:id` - Lấy chi tiết hợp đồng
- `GET /api/hopdong/:id/khachthue` - Lấy hợp đồng với danh sách khách
- `POST /api/hopdong` - Tạo hợp đồng mới
- `PUT /api/hopdong/:id` - Cập nhật hợp đồng
- `DELETE /api/hopdong/:id` - Xóa hợp đồng
- `POST /api/hopdong/khachthue` - Thêm khách vào hợp đồng
- `DELETE /api/hopdong/:mahopdong/khachthue/:makhachthue` - Xóa khách khỏi hợp đồng

### Hóa đơn
- `GET /api/hoadon` - Lấy danh sách hóa đơn
- `GET /api/hoadon/:id` - Lấy chi tiết hóa đơn
- `GET /api/hoadon/hopdong/:mahopdong` - Lấy hóa đơn theo hợp đồng
- `POST /api/hoadon` - Tạo hóa đơn mới
- `PUT /api/hoadon/:id` - Cập nhật hóa đơn
- `DELETE /api/hoadon/:id` - Xóa hóa đơn

### Người dùng
- `GET /api/nguoidung` - Lấy danh sách người dùng
- `GET /api/nguoidung/:id` - Lấy chi tiết người dùng
- `POST /api/nguoidung` - Tạo người dùng mới
- `PUT /api/nguoidung/:id` - Cập nhật người dùng
- `DELETE /api/nguoidung/:id` - Xóa người dùng

## Cấu trúc thư mục Backend

```
admin_dashboard/
├── config/
│   └── database.js          # Cấu hình kết nối SQL Server
├── controllers/
│   ├── khutroController.js
│   ├── phongtroController.js
│   ├── khachthueController.js
│   ├── hopdongController.js
│   ├── hoadonController.js
│   ├── nguoidungController.js
│   └── dashboardController.js
├── routes/
│   ├── khutroRoutes.js
│   ├── phongtroRoutes.js
│   ├── khachthueRoutes.js
│   ├── hopdongRoutes.js
│   ├── hoadonRoutes.js
│   ├── nguoidungRoutes.js
│   └── dashboardRoutes.js
├── .env                     # Cấu hình môi trường
├── .env.example             # Mẫu cấu hình
├── server.js                # Entry point
└── package.json
```

## Frontend Setup

### 1. Cài đặt dependencies

```bash
cd F:\admin_dashboard\frontend
npm install
```

### 2. Chạy Frontend Development Server

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

### 3. Build Frontend cho Production

```bash
npm run build
```

## Cấu trúc thư mục Frontend

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx         # Layout chính với sidebar
│   ├── pages/
│   │   ├── Dashboard.jsx      # Trang dashboard tổng quan
│   │   ├── Khutro.jsx         # Quản lý khu trọ
│   │   ├── Phongtro.jsx       # Quản lý phòng trọ
│   │   ├── Khachthue.jsx      # Quản lý khách thuê
│   │   ├── Hopdong.jsx        # Quản lý hợp đồng
│   │   ├── Hoadon.jsx         # Quản lý hóa đơn
│   │   └── Nguoidung.jsx      # Quản lý người dùng
│   ├── services/
│   │   └── api.js             # API service với axios
│   ├── App.jsx                # App component chính
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── vite.config.js
└── package.json
```

## Chạy toàn bộ hệ thống

### Terminal 1 - Backend:
```bash
cd F:\admin_dashboard
npm install
# Tạo file .env và cấu hình database
copy .env.example .env
# Chỉnh sửa .env với thông tin SQL Server
npm start
```

### Terminal 2 - Frontend:
```bash
cd F:\admin_dashboard\frontend
npm install
npm run dev
```

Sau đó truy cập: http://localhost:3000

## Tính năng Admin Dashboard

### 1. Dashboard Tổng quan
- Hiển thị thống kê: tổng khu trọ, phòng trọ, khách thuê
- Biểu đồ phòng theo khu trọ
- Doanh thu tháng hiện tại
- Danh sách hóa đơn gần đây

### 2. Quản lý Khu trọ
- Xem danh sách khu trọ
- Thêm/Sửa/Xóa khu trọ
- Thông tin: Mã, Tên, Địa chỉ

### 3. Quản lý Phòng trọ
- Xem danh sách phòng theo khu trọ
- Thêm/Sửa/Xóa phòng
- Thông tin: Mã phòng, Tên, Giá thuê, Tình trạng (Trống/Đã thuê/Đang sửa chữa)
- Filter và hiển thị status bằng chip màu

### 4. Quản lý Khách thuê
- Xem danh sách khách thuê
- Thêm/Sửa/Xóa khách
- Thông tin: Mã KH, Họ tên, CCCD, SĐT, Tài khoản

### 5. Quản lý Hợp đồng
- Xem danh sách hợp đồng
- Thêm/Sửa/Xóa hợp đồng
- Xem chi tiết hợp đồng với danh sách khách thuê
- Thông tin: Mã HĐ, Phòng, Ngày bắt đầu/kết thúc, Tiền cọc

### 6. Quản lý Hóa đơn
- Xem danh sách hóa đơn
- Thêm/Sửa/Xóa hóa đơn
- Tự động tính tổng tiền
- Thông tin: Tháng/Năm, Tiền phòng/điện/nước/dịch vụ

### 7. Quản lý Người dùng
- Xem danh sách người dùng
- Thêm/Sửa/Xóa người dùng
- Phân quyền: Admin, Nhân viên, Khách thuê
- Gán khu trọ cho nhân viên

## Công nghệ sử dụng

### Backend
- Node.js & Express.js
- mssql - SQL Server driver
- CORS - Cross-Origin Resource Sharing
- dotenv - Environment variables

### Frontend
- React 18
- Vite - Build tool
- Material-UI (MUI) - UI component library
- React Router - Routing
- Axios - HTTP client
- Recharts - Biểu đồ

## Lưu ý

1. Đảm bảo SQL Server đang chạy và database QuanLyTro đã được tạo
2. Cập nhật thông tin kết nối database trong file `.env`
3. Nếu sử dụng SQL Server Authentication, enable "SQL Server and Windows Authentication mode"
4. Backend phải chạy trước khi chạy Frontend
5. Nếu gặp lỗi CORS, kiểm tra lại cấu hình CORS trong server.js
