# AI Audit Report

## Tuyên bố

> Tôi sử dụng công cụ AI cho các nhiệm vụ sau.

Công cụ chính: OpenAI Codex. Thời gian thực hiện: từ 2026-09-02 đến 2026-09-03, múi giờ UTC+7 (Asia/Bangkok). Các mốc dưới đây được đối chiếu từ lịch sử phiên, thời gian sửa tệp và Git commit; mốc dạng khoảng được ghi rõ để không tạo độ chính xác giả.

## Nhật ký tương tác

### AI-01 - Chuyển đổi đề bài

- Công cụ: OpenAI Codex.
- Thời gian: 2026-09-02 21:50–22:03 UTC+7 (đối chiếu thời gian sửa bản dịch).
- Prompt: `Dich file .pdf thanh file .md voi tieng viet di`
- Output: Bản dịch `2026.HW06.API Testing_Vi.md`, giữ 17 mục, bảng đánh giá và yêu cầu nộp bài.
- Human review: Đối chiếu đủ 8 trang và sửa ký tự hỏng do PDF extraction.

### AI-02 - Phân tích blocker

- Công cụ: OpenAI Codex.
- Thời gian: 2026-09-02 22:03–22:13 UTC+7 (khoảng trước baseline commit).
- Prompt: Yêu cầu đọc Requirement 6 và Agent Skill, xác định việc sinh viên phải chuẩn bị.
- Output: Xác định MSSV, lựa chọn ba FR, API specification, Git repository, screenshot thật và sơ đồ tự vẽ.
- Human decision: Chọn MSSV `23127502`; FR-03, FR-09, FR-17; Postman/Newman; Skill chạy được.

### AI-03 - Lập kế hoạch

- Công cụ: OpenAI Codex.
- Thời gian: 2026-09-02 22:13–22:27 UTC+7 (đối chiếu hai commit baseline).
- Prompt: Cung cấp blocker đã hoàn tất và yêu cầu lập kế hoạch.
- Output: Kế hoạch 120 ca, Postman/Newman, Excel, CI/CD, bug report và Agent Skill.
- Human review: Chốt cách tính 35 AI + 5 human theo mỗi FR và giữ SUT nguyên trạng.

### AI-04 - Sinh candidate test cases

- Công cụ: OpenAI Codex.
- Thời gian: 2026-09-02 22:27–22:36 UTC+7 (đối chiếu các commit sinh test).
- Prompt: Triển khai kế hoạch cho FR-03, FR-09 và FR-17 theo API spec/SRS.
- Output: 105 ca AI, gồm 35 ca/FR, có domain, boundary, state, security và schema.
- Human review: 81 VALID, 9 INVALID, 15 INCOMPLETE. Mọi ca INVALID/INCOMPLETE được sửa và giữ audit trail.

### AI-05 - Mở rộng test

- Công cụ: OpenAI Codex.
- Thời gian: 2026-09-02 22:36–22:37 UTC+7 (đối chiếu ba commit human-reviewed).
- Prompt: Bổ sung các trường hợp AI bỏ sót, ưu tiên bảo mật và trạng thái.
- Output: 15 ca human-added về brute-force, two-OTP state, concurrency, JWT identity, Unicode và mass assignment.
- Human review: Giữ riêng `source = HUMAN`, loại trùng candidate và ghi lý do riêng cho từng ca về khoảng trống AI đã bỏ sót.

### AI-06 - Tạo và sửa collection

- Công cụ: OpenAI Codex.
- Thời gian: 2026-09-02 22:37–23:01 UTC+7 (đối chiếu thời gian collection và commit).
- Prompt: Tạo Postman collection, environment, data-driven run và Newman reports với student header.
- Output ban đầu: Collection có hai lỗi kỹ thuật: biến `data` bị khai báo lại trong sandbox và ghép URL sai do thiếu ngoặc.
- Human review/correction: Không dùng run lỗi làm bằng chứng; sửa thành `responseJson`, bọc biểu thức base URL, rồi chạy lại từ database sạch.

### AI-07 - Phân tích execution

- Công cụ: OpenAI Codex.
- Thời gian: 2026-09-02 23:01–23:41 UTC+7 (đối chiếu commit execution và rerun).
- Prompt: Đọc Newman JSON, đối chiếu SRS và chỉ nhóm các bug có bằng chứng.
- Output: 68 pass, 52 fail, 93 assertion failures, 12 nhóm bug; hai ca để `REVIEW` do SRS chưa đủ.
- Human review: Không chuyển failure thành pass; không công bố `REVIEW` là bug.

### AI-08 - Agent Skill và workbook

- Công cụ: OpenAI Codex và script Python/JavaScript cục bộ.
- Thời gian: 2026-09-02 23:01–23:54 UTC+7 (đối chiếu commit Skill/workbook và thời gian xuất tệp).
- Prompt: Tạo Skill chạy được và workbook Excel có summary/test cases/bug matrix.
- Output: Skill validation đạt; demo FR-03 xuất đủ 40 ca. Workbook có công thức tổng hợp 120/68/52 và không có formula error.
- Human review: Sơ đồ và video thuộc phần sinh viên tự xác nhận/thực hiện theo yêu cầu môn học.

### AI-09 - CI/CD và bằng chứng hai pipeline runs

- Công cụ: OpenAI Codex, Git/GitHub Actions và trình duyệt.
- Thời gian: 2026-09-02 23:41–23:47 UTC+7 (đối chiếu Git commit và Actions run).
- Prompt: Chạy CI thật, lưu link và ảnh cho một run passing và một run có đúng một failure minh họa.
- Output: Run `main` thành công và run `ci-failure-demo` thất bại đúng một assertion; báo cáo ghi URL, commit SHA và screenshot.
- Human review: Chỉ sử dụng trạng thái và ảnh của GitHub Actions thật.

### AI-10 - Hợp nhất bug report và GitHub Issues

- Công cụ: OpenAI Codex, GitHub Issues, Newman HTML report và trình duyệt.
- Thời gian: 2026-09-03 00:07–01:12 UTC+7 (đối chiếu commit hợp nhất và thời gian tạo/chụp Issue).
- Prompt: Gom 12 bug vào một `bug-report.md`, tạo 12 GitHub Issues, thêm link và chụp evidence thật.
- Output: Một báo cáo hợp nhất với 12 link Issue, 12 ảnh Newman, 12 ảnh trang Issue và ảnh tổng quan Issues.
- Human review: Nội dung Issue được đối chiếu với test-case ID, expected/actual và bằng chứng execution.

### AI-11 - Kiểm định và hoàn thiện bộ nộp

- Công cụ: OpenAI Codex, artifact-tool, trình tạo/kiểm tra PDF, Git và GitHub.
- Thời gian: bắt đầu 2026-09-03 01:20 UTC+7; mốc hoàn tất được lưu trong Git history.
- Prompt: Chấm lại bộ nộp và sửa tất cả phát hiện ngoại trừ mục nguồn gốc sơ đồ.
- Output: Sửa 76 ô SEC, 15 lý do HUMAN, audit timestamp, đường dẫn tài liệu, evidence Issue, PDF, commit log và ZIP cuối.
- Human review: Giữ nguyên nội dung sơ đồ theo chỉ định; chạy lại kiểm tra cấu trúc và tính nhất quán trước khi đóng gói.

## Khai báo giới hạn

- Screenshot evidence được chụp từ các run/trang GitHub thật; không tạo hoặc làm giả kết quả Newman/GitHub Actions.
- Link và ảnh chỉ được cập nhật sau khi có bằng chứng thật.
- Các khoảng thời gian được suy ra từ metadata hiện có; lịch sử phiên không cung cấp timestamp chính xác cho từng tin nhắn.
- Sinh viên cần tự xác nhận nguồn gốc sơ đồ Agent Skill và quyết định có nộp video YouTube hay không.
