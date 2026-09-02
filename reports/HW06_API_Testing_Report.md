# Báo cáo HW06 - API Testing

## 1. Thông tin

- MSSV: `23127502`
- SUT: EShop tại `http://127.0.0.1:3000`
- Feature: FR-03, FR-09, FR-17
- Ngày thực thi: 2026-09-02
- Nguồn chuẩn: `api_specification.md`, [SRS chính thức EShop](https://github.com/ttbhanh/eshop-sut) và đề HW06.

Không sửa mã nguồn SUT. Expected result luôn dựa vào đặc tả; failure do sai khác của SUT được giữ nguyên.

## 2. Phạm vi endpoint

| Feature | Endpoint chính | Mục tiêu |
|---|---|---|
| FR-03 | `POST /api/forgot-password`, `POST /api/reset-password` | OTP 6 số, email binding, expiry, single-use, password policy |
| FR-09 | `POST /api/apply-coupon`, `POST /api/coupon-usage` | C1-C5, boundary, công thức giảm, usage và identity |
| FR-17 | `GET /api/coupons`, `POST /api/admin/coupons`, `DELETE /api/admin/coupons/:id` | Admin authorization và validation coupon |

Các yêu cầu bảo mật chính: SEC-01, SEC-02, SEC-03, SEC-05 và SEC-07.

## 3. Quy trình AI và kiểm toán

AI sinh 35 candidate cho mỗi FR. Người kiểm thử rà soát từng candidate theo SRS, gắn nhãn và giữ audit trail trước khi bổ sung 5 ca riêng.

| FR | AI | VALID | INVALID | INCOMPLETE | Human-added | Final |
|---|---:|---:|---:|---:|---:|---:|
| FR-03 | 35 | 27 | 3 | 5 | 5 | 40 |
| FR-09 | 35 | 27 | 3 | 5 | 5 | 40 |
| FR-17 | 35 | 27 | 3 | 5 | 5 | 40 |
| **Tổng** | **105** | **81** | **9** | **15** | **15** | **120** |

`INVALID` và `INCOMPLETE` không bị xóa. Trường `auditReason` giải thích sai sót; trường `correction` ghi oracle đã sửa. Các ca human-added tập trung vào brute-force/concurrency, danh tính JWT, time boundary, Unicode confusable, mass assignment và referential integrity.

## 4. Thiết kế kiểm thử

### 4.1 FR-03

- Phân hoạch email: hợp lệ, chưa đăng ký, rỗng, null, thiếu trường, sai định dạng, whitespace và object.
- OTP: đúng/sai, độ dài 5/6/7, chữ, whitespace, email khác, dùng lại, hai OTP liên tiếp và brute-force.
- Mật khẩu: biên 7/8 ký tự, thiếu chữ hoa/thường/số/ký tự đặc biệt, null.
- Schema/security: không lộ trường password, parameterized query, SEC-01 và SEC-07.

### 4.2 FR-09

- C1-C5: code tồn tại/active, expiry, ngưỡng đơn, JWT và usage limit.
- Boundary: dưới/bằng/trên `min_order_amount` cho SAVE10 và BIGBUY.
- Công thức: percent và fixed; final amount không âm.
- Security: thiếu/sai JWT, giả mạo `user_id`, SQL injection và concurrent usage.
- Schema: kiểu `success`, `coupon_id`, `discount_amount`, `final_amount`, `message`.

### 4.3 FR-17

- GET/POST/DELETE với admin, user, thiếu token và token sai.
- `code`: bắt buộc, rỗng, whitespace, unique, SQL/XSS và Unicode confusable.
- `type`, `discount_value`, `min_order_amount`, `expired_at`, `max_uses_per_user`: valid/invalid/type/boundary.
- Xóa coupon: tồn tại, không tồn tại, ID sai định dạng, user thường và coupon có usage.

## 5. Postman và Newman

Collection-level pre-request script thực hiện:

```javascript
pm.request.headers.upsert({ key: "X-Student-Id", value: "23127502" });
console.log("X-Student-Id: 23127502", pm.info.requestName);
```

Collection có setup login lấy admin/user JWT vào collection variables; các ca stateful dùng `pm.sendRequest` để cấp OTP, dùng lại OTP, ghi usage hoặc tạo coupon trước khi xóa. Environment giữ `baseUrl`; data file FR-09 chạy 8 boundary rows.

Các tính năng đã dùng: collection, folder, environment, collection variables, pre-request script, test script, data-driven run, dynamic setup, Newman CLI, JSON reporter, HTML Extra reporter và GitHub Actions. Không khai báo monitor/mock server vì chưa có bằng chứng sử dụng thật.

## 6. Kết quả thực thi

| FR | Test cases | Passed | Failed | Pass rate | Nhóm bug |
|---|---:|---:|---:|---:|---:|
| FR-03 | 40 | 22 | 18 | 55.0% | 4 |
| FR-09 | 40 | 29 | 11 | 72.5% | 4 |
| FR-17 | 40 | 17 | 23 | 42.5% | 4 |
| **Tổng** | **120** | **68** | **52** | **56.7%** | **12** |

Full run thực hiện 418 assertions, trong đó 93 assertion failed. Các suite riêng tạo kết quả tương ứng: FR-03 có 24 assertion failures, FR-09 có 25 và FR-17 có 44. Smoke suite có 3 requests và 6/6 assertions pass. Data-driven suite phát hiện hai lỗi tại ranh giới `total_amount == min_order_amount`.

Hai ca đang mang `bugId = REVIEW` không được tính là bug vì SRS chưa quy định rõ cách chuẩn hóa whitespace code và hành vi xóa coupon đã có usage.

## 7. Bug đã xác nhận

| ID | Severity | Mô tả |
|---|---|---|
| BUG-FR03-01 | High | OTP chỉ có 4 chữ số thay vì tối thiểu 6 |
| BUG-FR03-02 | Medium | Forgot-password không validation định dạng email |
| BUG-FR03-03 | High | Reset-password chấp nhận mật khẩu yếu/null |
| BUG-FR03-04 | High | Không rate-limit thử OTP sai |
| BUG-FR09-01 | Critical | Công thức percent sai |
| BUG-FR09-02 | High | Biên `total == min` bị từ chối |
| BUG-FR09-03 | Critical | Apply-coupon không yêu cầu JWT |
| BUG-FR09-04 | High | Không validation kiểu `total_amount`/`user_id` |
| BUG-FR17-01 | Critical | API quản lý coupon không kiểm tra role Admin |
| BUG-FR17-02 | High | Thiếu validation trường coupon |
| BUG-FR17-03 | Medium | Duplicate code trả 500 thay vì lỗi kiểm soát |
| BUG-FR17-04 | Medium | Xóa ID sai/không tồn tại vẫn báo thành công |

Issue drafts nằm trong `reports/issues/`. Trạng thái hiện tại là draft; chưa có issue URL và screenshot nên không trình bày như đã đăng.

## 8. CI/CD

Workflow `.github/workflows/api-tests.yml` cài dependencies, khởi động SUT, chờ readiness, chạy suite được chọn và upload Newman evidence. Push lên `main` mặc định chạy smoke suite. `workflow_dispatch` cho phép chọn `smoke`, `full` hoặc `data`.

Hai evidence run cần hoàn thành tại checkpoint GitHub:

- Passing commit/run: **TODO**.
- Branch/commit `ci-failure-demo` với đúng một assertion minh họa bị fail: **TODO**.

Không tạo link hoặc ảnh giả trong báo cáo.

## 9. Agent Skill

Skill `eshop-api-test-generator` nhận API spec, SRS/SEC, FR, MSSV và output directory. Agent tạo/audit ca kiểm thử; `validate_cases.py` kiểm tra schema, unique ID, counts và coverage; `export_cases.py` xuất CSV, Postman data và summary.

Kết quả demo FR-03: 40 cases, 35 AI, 5 human, validation không có lỗi. Pseudocode có trong Skill. Sơ đồ PNG phải do sinh viên tự vẽ và chưa được tạo trong repository.

## 10. Kết luận

Bộ test đã đạt chỉ tiêu số lượng, có audit trail, chạy được bằng Newman và phát hiện 12 nhóm bug dựa trên SRS. Phần local artifact đã hoàn thành. Phần còn lại phụ thuộc bằng chứng do sinh viên thực hiện: screenshots, GitHub Issues, hai Actions runs, sơ đồ tự vẽ và video tùy chọn.

