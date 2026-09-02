# AI Audit Report

## Tuyên bố

> Tôi sử dụng công cụ AI cho các nhiệm vụ sau.

Công cụ chính: OpenAI Codex. Ngày thực hiện: 2026-09-02, múi giờ Asia/Bangkok.

## Nhật ký tương tác

### AI-01 - Chuyển đổi đề bài

- Prompt: `Dich file .pdf thanh file .md voi tieng viet di`
- Output: Bản dịch `2026.HW06.API Testing_Vi.md`, giữ 17 mục, bảng đánh giá và yêu cầu nộp bài.
- Human review: Đối chiếu đủ 8 trang và sửa ký tự hỏng do PDF extraction.

### AI-02 - Phân tích blocker

- Prompt: Yêu cầu đọc Requirement 6 và Agent Skill, xác định việc sinh viên phải chuẩn bị.
- Output: Xác định MSSV, lựa chọn ba FR, API specification, Git repository, screenshot thật và sơ đồ tự vẽ.
- Human decision: Chọn MSSV `23127502`; FR-03, FR-09, FR-17; Postman/Newman; Skill chạy được.

### AI-03 - Lập kế hoạch

- Prompt: Cung cấp blocker đã hoàn tất và yêu cầu lập kế hoạch.
- Output: Kế hoạch 120 ca, Postman/Newman, Excel, CI/CD, bug report và Agent Skill.
- Human review: Chốt cách tính 35 AI + 5 human theo mỗi FR và giữ SUT nguyên trạng.

### AI-04 - Sinh candidate test cases

- Prompt: Triển khai kế hoạch cho FR-03, FR-09 và FR-17 theo API spec/SRS.
- Output: 105 ca AI, gồm 35 ca/FR, có domain, boundary, state, security và schema.
- Human review: 81 VALID, 9 INVALID, 15 INCOMPLETE. Mọi ca INVALID/INCOMPLETE được sửa và giữ audit trail.

### AI-05 - Mở rộng test

- Prompt: Bổ sung các trường hợp AI bỏ sót, ưu tiên bảo mật và trạng thái.
- Output: 15 ca human-added về brute-force, two-OTP state, concurrency, JWT identity, Unicode và mass assignment.
- Human review: Giữ riêng `source = HUMAN`; loại trùng candidate.

### AI-06 - Tạo và sửa collection

- Prompt: Tạo Postman collection, environment, data-driven run và Newman reports với student header.
- Output ban đầu: Collection có hai lỗi kỹ thuật: biến `data` bị khai báo lại trong sandbox và ghép URL sai do thiếu ngoặc.
- Human review/correction: Không dùng run lỗi làm bằng chứng; sửa thành `responseJson`, bọc biểu thức base URL, rồi chạy lại từ database sạch.

### AI-07 - Phân tích execution

- Prompt: Đọc Newman JSON, đối chiếu SRS và chỉ nhóm các bug có bằng chứng.
- Output: 68 pass, 52 fail, 93 assertion failures, 12 nhóm bug; hai ca để `REVIEW` do SRS chưa đủ.
- Human review: Không chuyển failure thành pass; không công bố `REVIEW` là bug.

### AI-08 - Agent Skill và workbook

- Prompt: Tạo Skill chạy được và workbook Excel có summary/test cases/bug matrix.
- Output: Skill validation đạt; demo FR-03 xuất đủ 40 ca. Workbook có công thức tổng hợp 120/68/52 và không có formula error.
- Human review: Sơ đồ không được AI tạo; sinh viên tự vẽ và tự quay video nếu nộp.

## Khai báo giới hạn

- Screenshot evidence được chụp từ các run thật; AI không tạo hoặc làm giả kết quả Newman/GitHub Actions.
- Các mục `TODO` chỉ được cập nhật sau khi có bằng chứng thật.
- Nhật ký này cần được sinh viên đối chiếu với lịch sử phiên Codex trước khi nộp.
