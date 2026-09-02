# BUG-FR03-03 - API reset-password chấp nhận mật khẩu yếu hoặc null

- **Severity:** High
- **Feature:** FR03-
- **Môi trường:** Node.js + Express + SQLite, `http://127.0.0.1:3000`
- **MSSV header:** `X-Student-Id: 23127502`
- **Test case:** `FR-03-TC-027`, `FR-03-TC-028`, `FR-03-TC-029`, `FR-03-TC-030`, `FR-03-TC-031`, `FR-03-TC-032`

## Bước tái hiện

1. Reset và khởi động backend bằng `node backend/server.js`.
2. Import environment và collection trong thư mục `postman/`.
3. Chạy các test case được liệt kê ở trên bằng Newman/Postman.
4. Quan sát response và assertion failure.

## Kết quả mong đợi

SUT tuân thủ SRS/SEC được truy vết trong từng test case.

## Kết quả thực tế

- **FR-03-TC-027:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { Object (message) } to have property 'error'
- **FR-03-TC-028:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { Object (message) } to have property 'error'
- **FR-03-TC-029:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { Object (message) } to have property 'error'
- **FR-03-TC-030:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { Object (message) } to have property 'error'
- **FR-03-TC-031:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { Object (message) } to have property 'error'
- **FR-03-TC-032:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { Object (message) } to have property 'error'

## Bằng chứng cần sinh viên đính kèm

- [ ] Ảnh Postman Console/Newman có hostname và `X-Student-Id: 23127502`.
- [ ] Ảnh response liên quan đến test case.
- [ ] Link Newman HTML report hoặc GitHub Actions run.

> Đây là issue draft. Chỉ đăng sau khi sinh viên kiểm tra lại bằng chứng thực thi thật.
