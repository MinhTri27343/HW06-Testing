# Báo cáo CI/CD

## Pipeline

Workflow: `.github/workflows/api-tests.yml`

1. Checkout repository.
2. Cài Node.js 20.
3. Chạy `npm ci` và `npm ci --prefix backend`.
4. Khởi động backend tại `127.0.0.1:3000`.
5. Poll `/api/products` tối đa 30 giây.
6. Chạy Newman suite được chọn.
7. Upload thư mục `reports/Newman_Report/` kể cả khi job thất bại.

Push lên `main` và `ci-failure-demo` chạy smoke mặc định. Manual dispatch có thể chọn `smoke`, `full` hoặc `data`.

## Local baseline

- Smoke: 3 requests, 6 assertions, 0 failures.
- Full: 120 business test cases, 68 passed, 52 failed.
- Data-driven: 8 iterations, 2 boundary assertion failures.

## Run A - all passing

- Branch: `main`
- Commit SHA: [`43952135631f0f832682e5ee494377033331c624`](https://github.com/MinhTri27343/HW06-Testing/commit/43952135631f0f832682e5ee494377033331c624)
- Actions run: [HW06 API Tests #1 — Success](https://github.com/MinhTri27343/HW06-Testing/actions/runs/33656494043)
- Kết quả: 3 requests, 6 assertions, 0 failures; tổng thời gian pipeline 24 giây.

![GitHub Actions run passing](ci/screenshots/main-passing.png)

## Run B - exactly one demonstration failure

- Branch: `ci-failure-demo`
- Commit SHA: [`e833f6e5ec6e5f0eccee1e7aa3b17fa6f2d07a07`](https://github.com/MinhTri27343/HW06-Testing/commit/e833f6e5ec6e5f0eccee1e7aa3b17fa6f2d07a07)
- Actions run: [HW06 API Tests #2 — Failure](https://github.com/MinhTri27343/HW06-Testing/actions/runs/33656705278)
- Assertion thay đổi duy nhất: status mong đợi của request FR-03 smoke từ `200` thành `201`, có nhãn `[CI FAILURE DEMO]`.
- Kết quả log: 3 requests, 6 assertions, đúng 1 assertion failure; artifact Newman vẫn được upload; tổng thời gian pipeline 24 giây.

![GitHub Actions run failing demo](ci/screenshots/ci-failure-demo.png)

Sau run B, `main` vẫn giữ phiên bản smoke passing. Run B là minh họa pipeline phát hiện test thất bại, không phải bug của SUT.
