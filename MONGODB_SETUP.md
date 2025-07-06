# Cấu hình MongoDB Cloud

## Bước 1: Tạo MongoDB Atlas Cluster

1. Truy cập [MongoDB Atlas](https://cloud.mongodb.com/)
2. Đăng ký tài khoản hoặc đăng nhập
3. Tạo một cluster mới (có thể dùng free tier)
4. Chọn cloud provider và region phù hợp

## Bước 2: Cấu hình Network Access

1. Vào "Network Access" trong sidebar
2. Click "Add IP Address"
3. Chọn "Allow Access from Anywhere" (0.0.0.0/0) cho development
4. Hoặc thêm IP cụ thể của bạn

## Bước 3: Tạo Database User

1. Vào "Database Access" trong sidebar
2. Click "Add New Database User"
3. Tạo username và password
4. Chọn "Read and write to any database"

## Bước 4: Lấy Connection String

1. Vào "Database" trong sidebar
2. Click "Connect"
3. Chọn "Connect your application"
4. Copy connection string

## Bước 5: Cấu hình Environment Variables

Tạo file `.env.local` trong thư mục gốc của dự án:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-management?retryWrites=true&w=majority
```

**Lưu ý:**

- Thay `username` và `password` bằng thông tin đăng nhập database user
- Thay `cluster.mongodb.net` bằng hostname thực của cluster
- Thay `user-management` bằng tên database mong muốn

## Bước 6: Test Connection

Sau khi cấu hình xong, khởi động lại development server:

```bash
npm run dev
```

API signup sẽ tự động tạo database và collection khi có user đầu tiên đăng ký.

## Cấu trúc Database

- **Database:** `user-management`
- **Collection:** `users`
- **Schema:**
  ```json
  {
    "_id": "ObjectId",
    "email": "string",
    "username": "string",
    "password": "string",
    "createdAt": "string (ISO date)",
    "status": "pending|approved|rejected"
  }
  ```
