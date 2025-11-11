# HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY PROJECT

## Bước 1: Cài đặt Backend

### 1.1. Mở terminal/CMD tại thư mục project
```bash
cd F:\admin_dashboard
```

### 1.2. Cài đặt Node.js packages
```bash
npm install
```

Lệnh này sẽ cài đặt:
- express
- mssql
- cors
- dotenv
- nodemon (dev dependency)

### 1.3. Tạo file .env
```bash
copy .env.example .env
```

### 1.4. Chỉnh sửa file .env
Mở file `.env` và cập nhật thông tin SQL Server của bạn:

```
DB_SERVER=localhost
DB_PORT=1433
DB_DATABASE=QuanLyTro
DB_USER=sa
DB_PASSWORD=your_password_here
DB_ENCRYPT=true
DB_TRUST_CERTIFICATE=true
PORT=5000
```

**Lưu ý:** 
- Thay `your_password_here` bằng mật khẩu SQL Server của bạn
- Nếu dùng Windows Authentication, cần cấu hình khác

### 1.5. Chạy Backend Server
```bash
npm start
```

Hoặc chạy với nodemon (tự động restart khi có thay đổi):
```bash
npm run dev
```

Nếu thành công, bạn sẽ thấy:
```
Server is running on port 5000
Connected to SQL Server successfully
```

## Bước 2: Cài đặt Frontend

### 2.1. Mở terminal mới, đi vào thư mục frontend
```bash
cd F:\admin_dashboard\frontend
```

### 2.2. Cài đặt Node.js packages
```bash
npm install
```

Lệnh này sẽ cài đặt:
- react, react-dom
- react-router-dom
- @mui/material, @mui/icons-material
- axios
- recharts
- vite và @vitejs/plugin-react

### 2.3. Chạy Frontend Development Server
```bash
npm run dev
```

Nếu thành công, bạn sẽ thấy:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 2.4. Mở trình duyệt
Truy cập: http://localhost:3000

## Kiểm tra kết nối

### Test Backend API
Mở trình duyệt hoặc dùng curl/Postman:

```
http://localhost:5000/
```

Nếu thành công, sẽ trả về:
```json
{
  "message": "QuanLyTro API is running"
}
```

### Test một API endpoint cụ thể
```
http://localhost:5000/api/khutro
```

Sẽ trả về danh sách khu trọ từ database.

## Xử lý lỗi thường gặp

### Lỗi 1: "npm: The term 'npm' is not recognized"
**Nguyên nhân:** Node.js chưa được cài hoặc chưa được thêm vào PATH

**Giải pháp:**
1. Cài đặt Node.js từ https://nodejs.org/
2. Restart terminal sau khi cài
3. Chạy lại `node --version` để kiểm tra

### Lỗi 2: "Database connection failed"
**Nguyên nhân:** Thông tin kết nối SQL Server sai hoặc SQL Server chưa chạy

**Giải pháp:**
1. Kiểm tra SQL Server đang chạy (SQL Server Configuration Manager)
2. Kiểm tra thông tin trong file `.env`
3. Kiểm tra SQL Server Authentication mode
4. Thử kết nối bằng SSMS với cùng thông tin

### Lỗi 3: "CORS error" trên Frontend
**Nguyên nhân:** Backend chưa chạy hoặc cấu hình CORS sai

**Giải pháp:**
1. Đảm bảo Backend đang chạy tại port 5000
2. Kiểm tra file `server.js` có dòng `app.use(cors())`
3. Restart lại Backend server

### Lỗi 4: "Port 5000 already in use"
**Nguyên nhân:** Port 5000 đã được sử dụng bởi chương trình khác

**Giải pháp:**
1. Thay đổi PORT trong file `.env` (ví dụ: PORT=5001)
2. Cập nhật lại API_BASE_URL trong `frontend/src/services/api.js`

### Lỗi 5: "Cannot find module 'xxx'"
**Nguyên nhân:** Chưa cài đặt dependencies

**Giải pháp:**
```bash
# Trong thư mục backend
cd F:\admin_dashboard
npm install

# Trong thư mục frontend
cd F:\admin_dashboard\frontend
npm install
```

## Cấu trúc chạy đầy đủ

Bạn cần 2 terminal:

**Terminal 1 - Backend:**
```bash
cd F:\admin_dashboard
npm start
```

**Terminal 2 - Frontend:**
```bash
cd F:\admin_dashboard\frontend
npm run dev
```

## Build cho Production

### Backend
Không cần build, chỉ cần chạy `npm start`

### Frontend
```bash
cd F:\admin_dashboard\frontend
npm run build
```

Kết quả sẽ được tạo trong thư mục `frontend/dist/`

Để preview production build:
```bash
npm run preview
```

## Liên hệ và hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Node.js version (khuyến nghị v18 trở lên)
2. SQL Server đang chạy và database đã được tạo
3. File .env đã được cấu hình đúng
4. Cả Backend và Frontend đều đang chạy
