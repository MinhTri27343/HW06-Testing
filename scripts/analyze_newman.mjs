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
  { id: "BUG-FR03-01", title: "OTP đặt lại mật khẩu chỉ có 4 chữ số thay vì tối thiểu 6", severity: "High", refs: ["FR-03-TC-001", "FR-03-TC-002", "FR-03-TC-013"] },
  { id: "BUG-FR03-02", title: "API forgot-password không validation định dạng email", severity: "Medium", refs: ["FR-03-TC-004", "FR-03-TC-005", "FR-03-TC-006", "FR-03-TC-007", "FR-03-TC-008", "FR-03-TC-009", "FR-03-TC-011", "FR-03-TC-039"] },
  { id: "BUG-FR03-03", title: "API reset-password chấp nhận mật khẩu yếu hoặc null", severity: "High", refs: ["FR-03-TC-027", "FR-03-TC-028", "FR-03-TC-029", "FR-03-TC-030", "FR-03-TC-031", "FR-03-TC-032"] },
  { id: "BUG-FR03-04", title: "Không giới hạn số lần thử OTP sai", severity: "High", refs: ["FR-03-TC-036"] },
  { id: "BUG-FR09-01", title: "Công thức giảm giá phần trăm tính sai", severity: "Critical", refs: ["FR-09-TC-001", "FR-09-TC-013"] },
  { id: "BUG-FR09-02", title: "Coupon bị từ chối khi tổng tiền đúng bằng ngưỡng tối thiểu", severity: "High", refs: ["FR-09-TC-011", "FR-09-TC-014"] },
  { id: "BUG-FR09-03", title: "API apply-coupon không yêu cầu JWT hợp lệ", severity: "Critical", refs: ["FR-09-TC-023", "FR-09-TC-024"] },
  { id: "BUG-FR09-04", title: "API apply-coupon không validation kiểu total_amount và user_id", severity: "High", refs: ["FR-09-TC-019", "FR-09-TC-021", "FR-09-TC-028", "FR-09-TC-029"] },
  { id: "BUG-FR17-01", title: "API quản lý coupon không kiểm tra role Admin", severity: "Critical", refs: ["FR-17-TC-002", "FR-17-TC-008", "FR-17-TC-031", "FR-17-TC-036"] },
  { id: "BUG-FR17-02", title: "API tạo coupon thiếu validation các trường bắt buộc", severity: "High", refs: ["FR-17-TC-011", "FR-17-TC-012", "FR-17-TC-013", "FR-17-TC-015", "FR-17-TC-016", "FR-17-TC-017", "FR-17-TC-018", "FR-17-TC-019", "FR-17-TC-020", "FR-17-TC-022", "FR-17-TC-023", "FR-17-TC-024", "FR-17-TC-026", "FR-17-TC-027"] },
  { id: "BUG-FR17-03", title: "Tạo coupon trùng trả 500 thay vì lỗi xung đột được kiểm soát", severity: "Medium", refs: ["FR-17-TC-014", "FR-17-TC-037"] },
  { id: "BUG-FR17-04", title: "Xóa coupon với ID không tồn tại hoặc sai định dạng vẫn báo thành công", severity: "Medium", refs: ["FR-17-TC-034", "FR-17-TC-035"] },
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
fs.mkdirSync(path.join(root, "reports", "issues"), { recursive: true });
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

for (const bug of bugGroups) {
  const evidence = executed.filter((tc) => bug.refs.includes(tc.id) && tc.status === "FAIL");
  const body = `# ${bug.id} - ${bug.title}\n\n- **Severity:** ${bug.severity}\n- **Feature:** ${bug.id.slice(4, 9)}\n- **Môi trường:** Node.js + Express + SQLite, \`http://127.0.0.1:3000\`\n- **MSSV header:** \`X-Student-Id: 23127502\`\n- **Test case:** ${bug.refs.map((id) => `\`${id}\``).join(", ")}\n\n## Bước tái hiện\n\n1. Reset và khởi động backend bằng \`node backend/server.js\`.\n2. Import environment và collection trong thư mục \`postman/\`.\n3. Chạy các test case được liệt kê ở trên bằng Newman/Postman.\n4. Quan sát response và assertion failure.\n\n## Kết quả mong đợi\n\nSUT tuân thủ SRS/SEC được truy vết trong từng test case.\n\n## Kết quả thực tế\n\n${evidence.map((tc) => `- **${tc.id}:** ${tc.actualResult}`).join("\n")}\n\n## Bằng chứng cần sinh viên đính kèm\n\n- [ ] Ảnh Postman Console/Newman có hostname và \`X-Student-Id: 23127502\`.\n- [ ] Ảnh response liên quan đến test case.\n- [ ] Link Newman HTML report hoặc GitHub Actions run.\n\n> Đây là issue draft. Chỉ đăng sau khi sinh viên kiểm tra lại bằng chứng thực thi thật.\n`;
  fs.writeFileSync(path.join(root, "reports", "issues", `${bug.id}.md`), body);
}

const bugReport = `# Báo cáo lỗi HW06\n\nCó ${bugGroups.length} nhóm lỗi được ánh xạ từ execution evidence. Các assertion không thuộc nhóm dưới đây được giữ ở trạng thái \`REVIEW\`.\n\n| ID | Feature | Severity | Tiêu đề | Test case | GitHub Issue |\n|---|---|---|---|---|---|\n${bugGroups.map((bug) => `| ${bug.id} | ${bug.id.slice(4, 9)} | ${bug.severity} | ${bug.title} | ${bug.refs.join(", ")} | TODO |`).join("\n")}\n\n## Quy tắc công bố\n\nChỉ tạo GitHub Issue sau khi sinh viên xác nhận nội dung và đính kèm ảnh thật. Không xem các giả định chưa được SRS hỗ trợ là bug.\n`;
fs.writeFileSync(path.join(root, "reports", "bug-report.md"), bugReport);

console.log(JSON.stringify(executionSummary, null, 2));
