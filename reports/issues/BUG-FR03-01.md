# BUG-FR03-01 - OTP đặt lại mật khẩu chỉ có 4 chữ số thay vì tối thiểu 6

- **Severity:** High
- **Feature:** FR03-
- **Môi trường:** Node.js + Express + SQLite, `http://127.0.0.1:3000`
- **MSSV header:** `X-Student-Id: 23127502`
- **Test case:** `FR-03-TC-001`, `FR-03-TC-002`, `FR-03-TC-013`

## Bước tái hiện

1. Reset và khởi động backend bằng `node backend/server.js`.
2. Import environment và collection trong thư mục `postman/`.
3. Chạy các test case được liệt kê ở trên bằng Newman/Postman.
4. Quan sát response và assertion failure.

## Kết quả mong đợi

SUT tuân thủ SRS/SEC được truy vết trong từng test case.

## Kết quả thực tế

- **FR-03-TC-001:** HTTP 200; 1 assertion lỗi: expected '1264' to match /^\d{6}$/
- **FR-03-TC-002:** HTTP 200; 1 assertion lỗi: expected '1915' to match /^\d{6}$/
- **FR-03-TC-013:** HTTP 200; 1 assertion lỗi: expected '3508' to match /^\d{6}$/

## Bằng chứng cần sinh viên đính kèm

- [ ] Ảnh Postman Console/Newman có hostname và `X-Student-Id: 23127502`.
- [ ] Ảnh response liên quan đến test case.
- [ ] Link Newman HTML report hoặc GitHub Actions run.

> Đây là issue draft. Chỉ đăng sau khi sinh viên kiểm tra lại bằng chứng thực thi thật.
