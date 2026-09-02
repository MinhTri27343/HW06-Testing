# HW06 - API Testing

**Sinh viên:** MSSV `23127502`  
**SUT:** EShop  
**Phạm vi:** FR-03, FR-09, FR-17  
**Công cụ:** Codex, Postman, Newman, Newman HTML Extra, GitHub Actions

## Self-assessment

| No. | Tiêu chí | Điểm tối đa | Tự đánh giá |
|---:|---|---:|---:|
| 1 | FR-03 - generate, audit, extend, execute, bugs | 30 | 27 |
| 2 | FR-09 - generate, audit, extend, execute, bugs | 30 | 27 |
| 3 | FR-17 - generate, audit, extend, execute, bugs | 30 | 27 |
| 4 | Agent Skill - API test generator | 10 | 9 |
| | **Tổng** | **100** | **90** |

Điểm tự đánh giá hiện là tạm thời. Chỉ nâng điểm sau khi bổ sung ảnh thật, GitHub Issue links, hai GitHub Actions runs và sơ đồ tự vẽ.

## Test summary

| Metric | FR-03 | FR-09 | FR-17 | Tổng |
|---|---:|---:|---:|---:|
| AI-generated | 35 | 35 | 35 | 105 |
| Human-added | 5 | 5 | 5 | 15 |
| Executed | 40 | 40 | 40 | 120 |
| Passed | 22 | 29 | 17 | 68 |
| Failed | 18 | 11 | 23 | 52 |
| Confirmed bug groups | 4 | 4 | 4 | 12 |

## Chạy kiểm thử

```powershell
npm ci
npm ci --prefix backend
npm run generate
powershell -ExecutionPolicy Bypass -File scripts/run_local_tests.ps1 -Suite smoke
powershell -ExecutionPolicy Bypass -File scripts/run_local_tests.ps1 -Suite full
```

Các suite riêng: `fr03`, `fr09`, `fr17`, `data`.

## Deliverables

- Báo cáo chính: `reports/HW06_API_Testing_Report.md`
- Test cases: `test-cases/` và workbook trong `outputs/01a062a2-0daf-7a21-841e-a6f6eeeca81e/`
- Postman/Newman: `postman/`, `reports/Newman_Report/`
- Bug drafts: `reports/issues/`
- Agent Skill: `skills/eshop-api-test-generator/`
- CI/CD: `.github/workflows/api-tests.yml`
- AI Audit và Critique: `reports/AI_Audit_Report.md`, `reports/AI_Critique.md`

## Evidence còn do sinh viên thực hiện

- [ ] Ảnh Postman Console/Newman hiển thị hostname và `X-Student-Id: 23127502`.
- [ ] Ảnh thật cho từng GitHub Issue.
- [ ] GitHub Actions run passing và failing-demo cùng link/commit SHA.
- [ ] Sơ đồ Agent Skill do sinh viên tự vẽ.
- [ ] Video demo YouTube nếu chọn nộp.
