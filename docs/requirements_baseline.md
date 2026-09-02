# Cơ sở yêu cầu dùng cho HW06

## Nguồn

- Đặc tả API cục bộ: `api_specification.md`.
- SRS chính thức: <https://github.com/ttbhanh/eshop-sut> (phiên bản 2.0, cập nhật 2026-05-14).
- Đề bài: `2026.HW06.API Testing_En.pdf` và bản dịch `2026.HW06.API Testing_Vi.md`.

## Phạm vi

| Feature | Endpoint chính | Endpoint hỗ trợ | Yêu cầu trọng tâm |
|---|---|---|---|
| FR-03 | `POST /api/forgot-password`, `POST /api/reset-password` | `POST /api/login` | OTP 6 chữ số, gắn với email, có hạn, dùng một lần; mật khẩu mới đạt chính sách |
| FR-09 | `POST /api/apply-coupon`, `POST /api/coupon-usage` | `POST /api/login` | C1-C5, biên ngưỡng đơn, công thức percent/fixed, danh tính người dùng |
| FR-17 | `GET /api/coupons`, `POST /api/admin/coupons`, `DELETE /api/admin/coupons/:id` | `POST /api/login` | Chỉ Admin; code duy nhất; ràng buộc type, value, expiry, minimum và usage limit |

## Yêu cầu bảo mật áp dụng

- SEC-01: Không lưu mật khẩu plaintext.
- SEC-02: API bảo mật yêu cầu JWT hợp lệ.
- SEC-03: API Admin phải kiểm tra `role = admin`, không chỉ kiểm tra sự tồn tại của token.
- SEC-05: Truy vấn CSDL phải dùng parameterized query.
- SEC-07: OTP có ít nhất 6 chữ số, có thời hạn và vô hiệu hóa sau khi dùng.

SEC-04 và SEC-06 được giữ trong ma trận tổng thể nhưng không phải trọng tâm trực tiếp của ba feature đã chọn.

## Quy ước kết quả mong đợi

- Dùng SRS làm chuẩn nghiệp vụ khi SRS chi tiết hơn API specification.
- Dùng `400` cho dữ liệu sai miền/thiếu trường, `401` cho thiếu token, `403` cho token không hợp lệ hoặc sai vai trò, `404` cho tài nguyên không tồn tại.
- Endpoint tạo coupon hiện được đặc tả không nêu rõ `201`; bộ test giữ `200` để tránh tạo lỗi chỉ từ quy ước REST không được yêu cầu.
- Mọi sai khác giữa SUT và chuẩn trên chỉ được kết luận là bug sau khi có execution evidence.

