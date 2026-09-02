# BUG-FR17-02 - API tạo coupon thiếu validation các trường bắt buộc

- **Severity:** High
- **Feature:** FR17-
- **Môi trường:** Node.js + Express + SQLite, `http://127.0.0.1:3000`
- **MSSV header:** `X-Student-Id: 23127502`
- **Test case:** `FR-17-TC-011`, `FR-17-TC-012`, `FR-17-TC-013`, `FR-17-TC-015`, `FR-17-TC-016`, `FR-17-TC-017`, `FR-17-TC-018`, `FR-17-TC-019`, `FR-17-TC-020`, `FR-17-TC-022`, `FR-17-TC-023`, `FR-17-TC-024`, `FR-17-TC-026`, `FR-17-TC-027`

## Bước tái hiện

1. Reset và khởi động backend bằng `node backend/server.js`.
2. Import environment và collection trong thư mục `postman/`.
3. Chạy các test case được liệt kê ở trên bằng Newman/Postman.
4. Quan sát response và assertion failure.

## Kết quả mong đợi

SUT tuân thủ SRS/SEC được truy vết trong từng test case.

## Kết quả thực tế

- **FR-17-TC-011:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 8 } to have property 'error'
- **FR-17-TC-012:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 9 } to have property 'error'
- **FR-17-TC-013:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 10 } to have property 'error'
- **FR-17-TC-015:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 12 } to have property 'error'
- **FR-17-TC-016:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 13 } to have property 'error'
- **FR-17-TC-017:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 14 } to have property 'error'
- **FR-17-TC-018:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 15 } to have property 'error'
- **FR-17-TC-019:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 16 } to have property 'error'
- **FR-17-TC-020:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 17 } to have property 'error'
- **FR-17-TC-022:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 19 } to have property 'error'
- **FR-17-TC-023:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 20 } to have property 'error'
- **FR-17-TC-024:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 21 } to have property 'error'
- **FR-17-TC-026:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 23 } to have property 'error'
- **FR-17-TC-027:** HTTP 200; 2 assertion lỗi: expected response to have status code 400 but got 200 | expected { message: 'Coupon created', id: 24 } to have property 'error'

## Bằng chứng cần sinh viên đính kèm

- [ ] Ảnh Postman Console/Newman có hostname và `X-Student-Id: 23127502`.
- [ ] Ảnh response liên quan đến test case.
- [ ] Link Newman HTML report hoặc GitHub Actions run.

> Đây là issue draft. Chỉ đăng sau khi sinh viên kiểm tra lại bằng chứng thực thi thật.
