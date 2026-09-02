# Danh sách tính năng Postman/Newman đã sử dụng

| Tính năng | Cách sử dụng | Bằng chứng |
|---|---|---|
| Collection & folders | Collection tổng và folder FR-03/09/17 | `postman/HW06.postman_collection.json` |
| Environment | `baseUrl` cho local/CI | `postman/HW06.postman_environment.json` |
| Collection variables | `adminToken`, `userToken`, OTP và coupon ID động | Collection setup/tests |
| Pre-request script | Gắn và log `X-Student-Id: 23127502` | Mọi request |
| Test scripts | Status, schema, type, formula, security assertions | 418 assertions trong full run |
| Data-driven | 8 rows kiểm tra biên FR-09 | `postman/data/fr09-boundaries.json` |
| Dynamic setup | `pm.sendRequest` cấp OTP, ghi usage, tạo coupon | Các ca stateful |
| Newman CLI | Full, per-FR, smoke và data suites | `package.json` scripts |
| Reporters | CLI, JSON, HTML Extra | `reports/Newman_Report/` |
| CI/CD | GitHub Actions runner và artifact upload | `.github/workflows/api-tests.yml` |

Workspace, monitor và mock server chưa có execution evidence nên không được khai báo là đã sử dụng.
