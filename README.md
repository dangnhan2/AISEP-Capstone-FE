AI-powered Startup Ecosystem Platform (Frontend)

## Getting Started

1. Giới thiệu

AI-powered Startup Ecosystem Platform (AISEP) là nền tảng web hỗ trợ kết nối Startup – Investor – Advisor, ứng dụng AI để đánh giá tiềm năng startup và Blockchain để xác thực tài liệu sở hữu trí tuệ.

📌 Repository này chỉ chứa Frontend, được xây dựng bằng Next.js.
Backend, AI Service và Blockchain Service được triển khai riêng biệt bằng ngôn ngữ khác.

2. Công nghệ sử dụng

Framework: Next.js (App Router)

Ngôn ngữ: TypeScript

UI: Tailwind CSS

State Management: Context 

HTTP Client: Axios

Auth & RBAC: Frontend-based Role Guard

Architecture: Feature-based + Role-based Routing

3. Các vai trò người dùng (Roles)

STARTUP

INVESTOR

ADVISOR

OPERATION STAFF

ADMIN

Mỗi role có dashboard và quyền truy cập riêng.

4. Phân quyền & bảo mật (RBAC)

Kiểm tra role bằng middleware

Ẩn / hiện UI theo permission

Redirect khi truy cập sai role

Ví dụ:

/startup/* → chỉ role STARTUP

/admin/* → chỉ role ADMIN

5. Phạm vi của Frontend

✔ Giao diện người dùng
✔ Gọi API backend
✔ Quản lý state & routing
✔ Hiển thị báo cáo AI
✔ Hiển thị trạng thái xác thực blockchain

❌ Không xử lý:

AI model

Smart contract

Business rule backend

Database

6. Tác giả & học phần

Project: AI-powered Startup Ecosystem Platform 

Topic: AI-powered Startup Ecosystem Platform

Semester: Spring 2026
