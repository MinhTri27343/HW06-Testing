import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const required = [
  "test-cases/test-cases.json",
  "test-cases/executed/test-cases-executed.json",
  "postman/HW06.postman_collection.json",
  "postman/HW06.postman_environment.json",
  "reports/Newman_Report/full-results.json",
  "reports/Newman_Report/full-report.html",
  "reports/HW06_API_Testing_Report.md",
  "reports/AI_Audit_Report.md",
  "reports/AI_Critique.md",
  "skills/eshop-api-test-generator/SKILL.md",
  "outputs/01a062a2-0daf-7a21-841e-a6f6eeeca81e/23127502_HW06_Test_Cases.xlsx"
];

const errors = required.filter((relative) => !fs.existsSync(path.join(root, relative))).map((relative) => `Missing ${relative}`);
const cases = JSON.parse(fs.readFileSync(path.join(root, "test-cases", "executed", "test-cases-executed.json"), "utf8"));
const ids = new Set(cases.map((tc) => tc.id));
if (cases.length !== 120) errors.push(`Expected 120 cases, got ${cases.length}`);
if (ids.size !== cases.length) errors.push("Test case IDs are not unique");
for (const fr of ["FR-03", "FR-09", "FR-17"]) {
  const rows = cases.filter((tc) => tc.fr === fr);
  if (rows.filter((tc) => tc.source === "AI").length !== 35) errors.push(`${fr} must have 35 AI cases`);
  if (rows.filter((tc) => tc.source === "HUMAN").length !== 5) errors.push(`${fr} must have 5 human cases`);
}
if (cases.filter((tc) => tc.status === "PASS").length !== 68) errors.push("Expected 68 passed cases");
if (cases.filter((tc) => tc.status === "FAIL").length !== 52) errors.push("Expected 52 failed cases");

const collectionText = fs.readFileSync(path.join(root, "postman", "HW06.postman_collection.json"), "utf8");
if (!collectionText.includes("X-Student-Id") || !collectionText.includes("23127502")) errors.push("Student header policy missing from collection");

const result = { valid: errors.length === 0, checkedFiles: required.length, cases: cases.length, uniqueIds: ids.size, errors };
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
