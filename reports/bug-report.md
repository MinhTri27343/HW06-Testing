# Báo cáo lỗi HW06

Có 12 nhóm lỗi được ánh xạ từ execution evidence. Các assertion không thuộc nhóm dưới đây được giữ ở trạng thái `REVIEW`.

| ID | Feature | Severity | Tiêu đề | Test case | GitHub Issue |
|---|---|---|---|---|---|
| BUG-FR03-01 | FR03- | High | OTP đặt lại mật khẩu chỉ có 4 chữ số thay vì tối thiểu 6 | FR-03-TC-001, FR-03-TC-002, FR-03-TC-013 | TODO |
| BUG-FR03-02 | FR03- | Medium | API forgot-password không validation định dạng email | FR-03-TC-004, FR-03-TC-005, FR-03-TC-006, FR-03-TC-007, FR-03-TC-008, FR-03-TC-009, FR-03-TC-011, FR-03-TC-039 | TODO |
| BUG-FR03-03 | FR03- | High | API reset-password chấp nhận mật khẩu yếu hoặc null | FR-03-TC-027, FR-03-TC-028, FR-03-TC-029, FR-03-TC-030, FR-03-TC-031, FR-03-TC-032 | TODO |
| BUG-FR03-04 | FR03- | High | Không giới hạn số lần thử OTP sai | FR-03-TC-036 | TODO |
| BUG-FR09-01 | FR09- | Critical | Công thức giảm giá phần trăm tính sai | FR-09-TC-001, FR-09-TC-013 | TODO |
| BUG-FR09-02 | FR09- | High | Coupon bị từ chối khi tổng tiền đúng bằng ngưỡng tối thiểu | FR-09-TC-011, FR-09-TC-014 | TODO |
| BUG-FR09-03 | FR09- | Critical | API apply-coupon không yêu cầu JWT hợp lệ | FR-09-TC-023, FR-09-TC-024 | TODO |
| BUG-FR09-04 | FR09- | High | API apply-coupon không validation kiểu total_amount và user_id | FR-09-TC-019, FR-09-TC-021, FR-09-TC-028, FR-09-TC-029 | TODO |
| BUG-FR17-01 | FR17- | Critical | API quản lý coupon không kiểm tra role Admin | FR-17-TC-002, FR-17-TC-008, FR-17-TC-031, FR-17-TC-036 | TODO |
| BUG-FR17-02 | FR17- | High | API tạo coupon thiếu validation các trường bắt buộc | FR-17-TC-011, FR-17-TC-012, FR-17-TC-013, FR-17-TC-015, FR-17-TC-016, FR-17-TC-017, FR-17-TC-018, FR-17-TC-019, FR-17-TC-020, FR-17-TC-022, FR-17-TC-023, FR-17-TC-024, FR-17-TC-026, FR-17-TC-027 | TODO |
| BUG-FR17-03 | FR17- | Medium | Tạo coupon trùng trả 500 thay vì lỗi xung đột được kiểm soát | FR-17-TC-014, FR-17-TC-037 | TODO |
| BUG-FR17-04 | FR17- | Medium | Xóa coupon với ID không tồn tại hoặc sai định dạng vẫn báo thành công | FR-17-TC-034, FR-17-TC-035 | TODO |

## Quy tắc công bố

Chỉ tạo GitHub Issue sau khi sinh viên xác nhận nội dung và đính kèm ảnh thật. Không xem các giả định chưa được SRS hỗ trợ là bug.
