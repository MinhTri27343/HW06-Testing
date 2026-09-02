# BUG-FR09-04 - API apply-coupon không validation kiểu total_amount và user_id

- **Severity:** High
- **Feature:** FR09-
- **Môi trường:** Node.js + Express + SQLite, `http://127.0.0.1:3000`
- **MSSV header:** `X-Student-Id: 23127502`
- **Test case:** `FR-09-TC-019`, `FR-09-TC-021`, `FR-09-TC-028`, `FR-09-TC-029`

## Bước tái hiện

1. Reset và khởi động backend bằng `node backend/server.js`.
2. Import environment và collection trong thư mục `postman/`.
3. Chạy các test case được liệt kê ở trên bằng Newman/Postman.
4. Quan sát response và assertion failure.

## Kết quả mong đợi

SUT tuân thủ SRS/SEC được truy vết trong từng test case.

## Kết quả thực tế

- **FR-09-TC-019:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { success: true, coupon_id: 1, …(3) } to have property 'error'
- **FR-09-TC-021:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { success: true, coupon_id: 1, …(3) } to have property 'error'
- **FR-09-TC-028:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { success: true, coupon_id: 2, …(3) } to have property 'error'
- **FR-09-TC-029:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { success: true, coupon_id: 2, …(3) } to have property 'error'

## Bằng chứng cần sinh viên đính kèm

- [ ] Ảnh Postman Console/Newman có hostname và `X-Student-Id: 23127502`.
- [ ] Ảnh response liên quan đến test case.
- [ ] Link Newman HTML report hoặc GitHub Actions run.

> Đây là issue draft. Chỉ đăng sau khi sinh viên kiểm tra lại bằng chứng thực thi thật.
