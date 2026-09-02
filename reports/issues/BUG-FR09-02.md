# BUG-FR09-02 - Coupon bị từ chối khi tổng tiền đúng bằng ngưỡng tối thiểu

- **Severity:** High
- **Feature:** FR09-
- **Môi trường:** Node.js + Express + SQLite, `http://127.0.0.1:3000`
- **MSSV header:** `X-Student-Id: 23127502`
- **Test case:** `FR-09-TC-011`, `FR-09-TC-014`

## Bước tái hiện

1. Reset và khởi động backend bằng `node backend/server.js`.
2. Import environment và collection trong thư mục `postman/`.
3. Chạy các test case được liệt kê ở trên bằng Newman/Postman.
4. Quan sát response và assertion failure.

## Kết quả mong đợi

SUT tuân thủ SRS/SEC được truy vết trong từng test case.

## Kết quả thực tế

- **FR-09-TC-011:** HTTP 400; 5 assertion lỗi: expected response to have status code 200 but got 400 | expected { Object (error) } to have property 'success' | expected { Object (error) } to have property 'discount_amount' | expected { Object (error) } to have property 'final_amount' | expected undefined to deeply equal 30000
- **FR-09-TC-014:** HTTP 400; 5 assertion lỗi: expected response to have status code 200 but got 400 | expected { Object (error) } to have property 'success' | expected { Object (error) } to have property 'discount_amount' | expected { Object (error) } to have property 'final_amount' | expected undefined to deeply equal 50000

## Bằng chứng cần sinh viên đính kèm

- [ ] Ảnh Postman Console/Newman có hostname và `X-Student-Id: 23127502`.
- [ ] Ảnh response liên quan đến test case.
- [ ] Link Newman HTML report hoặc GitHub Actions run.

> Đây là issue draft. Chỉ đăng sau khi sinh viên kiểm tra lại bằng chứng thực thi thật.
