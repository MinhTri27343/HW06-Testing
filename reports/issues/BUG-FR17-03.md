# BUG-FR17-03 - Tạo coupon trùng trả 500 thay vì lỗi xung đột được kiểm soát

- **Severity:** Medium
- **Feature:** FR17-
- **Môi trường:** Node.js + Express + SQLite, `http://127.0.0.1:3000`
- **MSSV header:** `X-Student-Id: 23127502`
- **Test case:** `FR-17-TC-014`, `FR-17-TC-037`

## Bước tái hiện

1. Reset và khởi động backend bằng `node backend/server.js`.
2. Import environment và collection trong thư mục `postman/`.
3. Chạy các test case được liệt kê ở trên bằng Newman/Postman.
4. Quan sát response và assertion failure.

## Kết quả mong đợi

SUT tuân thủ SRS/SEC được truy vết trong từng test case.

## Kết quả thực tế

- **FR-17-TC-014:** HTTP 500; 1 assertion lỗi: expected response to have status code 409 but got 500
- **FR-17-TC-037:** HTTP 500; 1 assertion lỗi: expected response to have status code 409 but got 500

## Bằng chứng cần sinh viên đính kèm

- [ ] Ảnh Postman Console/Newman có hostname và `X-Student-Id: 23127502`.
- [ ] Ảnh response liên quan đến test case.
- [ ] Link Newman HTML report hoặc GitHub Actions run.

> Đây là issue draft. Chỉ đăng sau khi sinh viên kiểm tra lại bằng chứng thực thi thật.
