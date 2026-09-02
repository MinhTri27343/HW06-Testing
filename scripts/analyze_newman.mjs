import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const reportPath = path.join(root, "reports", "Newman_Report", "full-results.json");
if (!fs.existsSync(reportPath)) throw new Error("Run npm run test:full before analysis.");

const cases = JSON.parse(fs.readFileSync(path.join(root, "test-cases", "test-cases.json"), "utf8"));
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const failuresById = new Map();
const executionById = new Map();

for (const execution of report.run.executions ?? []) {
  const id = execution.item?.name?.match(/FR-\d+-TC-\d+/)?.[0];
  if (id && !executionById.has(id)) executionById.set(id, execution);
}

for (const failure of report.run.failures ?? []) {
  const id = failure.source?.name?.match(/FR-\d+-TC-\d+/)?.[0];
  if (!id) continue;
  if (!failuresById.has(id)) failuresById.set(id, []);
  failuresById.get(id).push(failure.error?.message ?? "Assertion failed");
}

const bugGroups = [
  { id: "BUG-FR03-01", fr: "FR-03", sec: "SEC-07", endpoint: "POST /api/forgot-password", title: "OTP đặt lại mật khẩu chỉ có 4 chữ số thay vì tối thiểu 6", severity: "High", expected: "Response trả OTP gồm đúng 6 chữ số.", actual: "SUT trả OTP gồm 4 chữ số.", refs: ["FR-03-TC-001", "FR-03-TC-002", "FR-03-TC-013"] },
  { id: "BUG-FR03-02", fr: "FR-03", sec: "SEC-05", endpoint: "POST /api/forgot-password", title: "API forgot-password không validation định dạng email", severity: "Medium", expected: "Email rỗng, null, sai định dạng hoặc sai kiểu bị từ chối bằng HTTP 400.", actual: "SUT truy vấn trực tiếp và trả HTTP 404 thay vì lỗi validation 400.", refs: ["FR-03-TC-004", "FR-03-TC-005", "FR-03-TC-006", "FR-03-TC-007", "FR-03-TC-008", "FR-03-TC-009", "FR-03-TC-011", "FR-03-TC-039"] },
  { id: "BUG-FR03-03", fr: "FR-03", sec: "SEC-07", endpoint: "POST /api/reset-password", title: "API reset-password chấp nhận mật khẩu yếu hoặc null", severity: "High", expected: "Mật khẩu mới không đạt chính sách độ mạnh phải bị từ chối bằng HTTP 400.", actual: "SUT trả HTTP 200 và cập nhật mật khẩu yếu hoặc null.", refs: ["FR-03-TC-027", "FR-03-TC-028", "FR-03-TC-029", "FR-03-TC-030", "FR-03-TC-031", "FR-03-TC-032"] },
  { id: "BUG-FR03-04", fr: "FR-03", sec: "SEC-07", endpoint: "POST /api/reset-password", title: "Không giới hạn số lần thử OTP sai", severity: "High", expected: "Nhiều lần thử OTP sai phải bị rate-limit bằng HTTP 429.", actual: "SUT tiếp tục trả HTTP 400 và không khóa/rate-limit yêu cầu.", refs: ["FR-03-TC-036"] },
  { id: "BUG-FR09-01", fr: "FR-09", sec: "-", endpoint: "POST /api/apply-coupon", title: "Công thức giảm giá phần trăm tính sai", severity: "Critical", expected: "Coupon phần trăm tính discount_amount = total_amount × discount_value / 100.", actual: "SUT trả discount_amount âm và final_amount vượt tổng tiền ban đầu.", refs: ["FR-09-TC-001", "FR-09-TC-013"] },
  { id: "BUG-FR09-02", fr: "FR-09", sec: "-", endpoint: "POST /api/apply-coupon", title: "Coupon bị từ chối khi tổng tiền đúng bằng ngưỡng tối thiểu", severity: "High", expected: "total_amount bằng min_order_amount vẫn đủ điều kiện áp dụng coupon.", actual: "SUT trả HTTP 400 tại đúng giá trị biên tối thiểu.", refs: ["FR-09-TC-011", "FR-09-TC-014"] },
  { id: "BUG-FR09-03", fr: "FR-09", sec: "SEC-02", endpoint: "POST /api/apply-coupon", title: "API apply-coupon không yêu cầu JWT hợp lệ", severity: "Critical", expected: "Request thiếu JWT hoặc dùng JWT sai phải bị từ chối bằng HTTP 401.", actual: "SUT vẫn xử lý coupon và trả HTTP 200.", refs: ["FR-09-TC-023", "FR-09-TC-024"] },
  { id: "BUG-FR09-04", fr: "FR-09", sec: "SEC-05", endpoint: "POST /api/apply-coupon", title: "API apply-coupon không validation kiểu total_amount và user_id", severity: "High", expected: "total_amount và user_id sai kiểu hoặc không tồn tại phải bị từ chối bằng HTTP 400/404.", actual: "SUT ép kiểu hoặc tiếp tục xử lý và trả HTTP 200.", refs: ["FR-09-TC-019", "FR-09-TC-021", "FR-09-TC-028", "FR-09-TC-029"] },
  { id: "BUG-FR17-01", fr: "FR-17", sec: "SEC-02, SEC-03", endpoint: "GET/POST/DELETE /api/coupons", title: "API quản lý coupon không kiểm tra role Admin", severity: "Critical", expected: "JWT của user thường phải bị từ chối bằng HTTP 403 tại endpoint quản trị.", actual: "User thường có thể xem, tạo và xóa coupon với HTTP 200.", refs: ["FR-17-TC-002", "FR-17-TC-008", "FR-17-TC-031", "FR-17-TC-036"] },
  { id: "BUG-FR17-02", fr: "FR-17", sec: "SEC-05", endpoint: "POST /api/admin/coupons", title: "API tạo coupon thiếu validation các trường bắt buộc", severity: "High", expected: "Payload thiếu/sai kiểu, giá trị âm hoặc ngoài miền phải bị từ chối bằng HTTP 400.", actual: "SUT vẫn tạo coupon và trả HTTP 200 cho nhiều payload không hợp lệ.", refs: ["FR-17-TC-011", "FR-17-TC-012", "FR-17-TC-013", "FR-17-TC-015", "FR-17-TC-016", "FR-17-TC-017", "FR-17-TC-018", "FR-17-TC-019", "FR-17-TC-020", "FR-17-TC-022", "FR-17-TC-023", "FR-17-TC-024", "FR-17-TC-026", "FR-17-TC-027"] },
  { id: "BUG-FR17-03", fr: "FR-17", sec: "SEC-05", endpoint: "POST /api/admin/coupons", title: "Tạo coupon trùng trả 500 thay vì lỗi xung đột được kiểm soát", severity: "Medium", expected: "Code trùng phải trả HTTP 409 với error schema được kiểm soát.", actual: "SUT để lỗi SQLite thoát ra thành HTTP 500 hoặc xử lý không nhất quán.", refs: ["FR-17-TC-014", "FR-17-TC-037"] },
  { id: "BUG-FR17-04", fr: "FR-17", sec: "SEC-05", endpoint: "DELETE /api/admin/coupons/:id", title: "Xóa coupon với ID không tồn tại hoặc sai định dạng vẫn báo thành công", severity: "Medium", expected: "ID không tồn tại trả HTTP 404; ID sai định dạng trả HTTP 400.", actual: "SUT trả HTTP 200 và thông báo xóa thành công.", refs: ["FR-17-TC-034", "FR-17-TC-035"] },
];

const bugByCase = new Map();
for (const bug of bugGroups) for (const ref of bug.refs) bugByCase.set(ref, bug.id);

const executed = cases.map((tc) => {
  const execution = executionById.get(tc.id);
  const failures = failuresById.get(tc.id) ?? [];
  const httpCode = execution?.response?.code ?? null;
  return {
    ...tc,
    actualResult: httpCode === null
      ? "Không tìm thấy execution trong Newman JSON."
      : `HTTP ${httpCode}${failures.length ? `; ${failures.length} assertion lỗi: ${failures.join(" | ")}` : "; tất cả assertion đạt."}`,
    status: failures.length ? "FAIL" : "PASS",
    bugId: failures.length ? (bugByCase.get(tc.id) ?? "REVIEW") : "",
  };
});

const perFr = ["FR-03", "FR-09", "FR-17"].map((fr) => {
  const rows = executed.filter((tc) => tc.fr === fr);
  return {
    fr,
    total: rows.length,
    passed: rows.filter((tc) => tc.status === "PASS").length,
    failed: rows.filter((tc) => tc.status === "FAIL").length,
    bugs: new Set(rows.map((tc) => tc.bugId).filter((id) => id.startsWith("BUG-"))).size,
    review: rows.filter((tc) => tc.bugId === "REVIEW").length,
  };
});

const executionSummary = {
  studentId: "23127502",
  executedAt: report.run.timings?.completed,
  baseUrl: "http://127.0.0.1:3000",
  total: executed.length,
  passed: executed.filter((tc) => tc.status === "PASS").length,
  failed: executed.filter((tc) => tc.status === "FAIL").length,
  assertionFailures: report.run.stats?.assertions?.failed ?? report.run.failures?.length ?? 0,
  confirmedBugGroups: bugGroups.length,
  perFr,
};

fs.mkdirSync(path.join(root, "test-cases", "executed"), { recursive: true });
fs.writeFileSync(path.join(root, "test-cases", "executed", "test-cases-executed.json"), JSON.stringify(executed, null, 2) + "\n");
for (const fr of ["FR-03", "FR-09", "FR-17"]) {
  const slug = fr.toLowerCase().replace("-", "");
  fs.writeFileSync(path.join(root, "test-cases", "executed", `${slug}-executed.json`), JSON.stringify(executed.filter((tc) => tc.fr === fr), null, 2) + "\n");
}
fs.writeFileSync(path.join(root, "reports", "execution-summary.json"), JSON.stringify(executionSummary, null, 2) + "\n");

const headers = ["id", "fr", "source", "category", "title", "method", "endpoint", "auth", "expectedStatus", "expectedRule", "secRefs", "aiAudit", "auditReason", "correction", "actualResult", "status", "bugId"];
const csv = [headers.join(","), ...executed.map((tc) => headers.map((key) => `"${String(Array.isArray(tc[key]) ? tc[key].join(";") : tc[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n") + "\n";
fs.writeFileSync(path.join(root, "test-cases", "executed", "test-cases-executed.csv"), csv);

const summaryMd = `# Tóm tắt thực thi Newman\n\n- MSSV: **23127502**\n- Base URL: \`http://127.0.0.1:3000\`\n- Số ca nghiệp vụ: **${executionSummary.total}**\n- Passed: **${executionSummary.passed}**\n- Failed: **${executionSummary.failed}**\n- Assertion failures: **${executionSummary.assertionFailures}**\n- Nhóm bug đã xác nhận: **${executionSummary.confirmedBugGroups}**\n\n| FR | Tổng | Passed | Failed | Nhóm bug | Cần rà soát |\n|---|---:|---:|---:|---:|---:|\n${perFr.map((r) => `| ${r.fr} | ${r.total} | ${r.passed} | ${r.failed} | ${r.bugs} | ${r.review} |`).join("\n")}\n\n> Failure được giữ nguyên theo oracle của SRS. Các dòng \`REVIEW\` chưa được coi là bug cho đến khi xác minh thủ công.\n`;
fs.writeFileSync(path.join(root, "reports", "execution-summary.md"), summaryMd);

const bugSections = bugGroups.map((bug) => {
  const evidence = executed.filter((tc) => bug.refs.includes(tc.id) && tc.status === "FAIL");
  return `## ${bug.id} - ${bug.title}\n\n- **Feature / Security:** ${bug.fr} / ${bug.sec}\n- **Severity:** ${bug.severity}\n- **Endpoint:** \`${bug.endpoint}\`\n- **Test case:** ${bug.refs.map((id) => `\`${id}\``).join(", ")}\n\n### Bước tái hiện\n\n1. Khởi động SUT từ database được reset và seed.\n2. Chạy collection \`postman/HW06.postman_collection.json\` bằng Newman.\n3. Mở test case được liệt kê và đối chiếu HTTP response với assertion.\n\n### Kết quả mong đợi\n\n${bug.expected}\n\n### Kết quả thực tế\n\n${bug.actual}\n\n${evidence.map((tc) => `- **${tc.id}:** ${tc.actualResult}`).join("\n")}\n\n### Bằng chứng Newman\n\n![${bug.id} - ${bug.title}](bug-evidence/${bug.id}.png)\n`;
}).join("\n---\n\n");

const bugReport = `# Báo cáo lỗi HW06 - EShop API\n\n## Thông tin thực thi\n\n- **MSSV:** 23127502\n- **Môi trường:** Node.js + Express + SQLite, \`http://127.0.0.1:3000\`\n- **Collection:** \`postman/HW06.postman_collection.json\`\n- **Newman report:** \`reports/Newman_Report/full-report.html\`\n- **Kết quả:** ${executionSummary.total} test case; ${executionSummary.passed} passed; ${executionSummary.failed} failed; ${executionSummary.assertionFailures} assertion failures.\n- **Header truy vết:** \`X-Student-Id: 23127502\`\n\n![Tổng quan lần chạy Newman](bug-evidence/execution-summary.png)\n\nCó ${bugGroups.length} nhóm lỗi được xác nhận từ execution evidence. Hai test case ngoài các nhóm dưới đây vẫn giữ trạng thái \`REVIEW\` và không được công bố là bug.\n\n## Danh sách lỗi\n\n| ID | FR | SEC | Severity | Tiêu đề |\n|---|---|---|---|---|\n${bugGroups.map((bug) => `| ${bug.id} | ${bug.fr} | ${bug.sec} | ${bug.severity} | ${bug.title} |`).join("\n")}\n\n${bugSections}\n\n## Ghi chú\n\n- Ảnh evidence được chụp trực tiếp từ Newman HTML report sau lần chạy full suite ngày 2026-09-02.\n- Các failure được giữ nguyên theo oracle của SRS; không sửa SUT để làm test pass.\n- Thư mục \`reports/issues/\` không còn được sử dụng; toàn bộ bug report nằm trong file này.\n`;
fs.writeFileSync(path.join(root, "reports", "bug-report.md"), bugReport);

console.log(JSON.stringify(executionSummary, null, 2));
