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

- Commit SHA: **TODO sau khi push**
- Actions URL: **TODO sau khi push**
- Screenshot: **TODO - sinh viên chụp ảnh thật**

## Run B - exactly one demonstration failure

- Branch: `ci-failure-demo`
- Commit SHA: **TODO sau checkpoint**
- Actions URL: **TODO sau checkpoint**
- Assertion thay đổi: **TODO - chỉ thay một expected value trong smoke collection**
- Screenshot: **TODO - sinh viên chụp ảnh thật**

Sau run B, `main` vẫn giữ phiên bản smoke passing. Run B phải được mô tả rõ là minh họa pipeline, không phải bug của SUT.
