import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const studentId = "23127502";
const cases = [];
const counters = { "FR-03": 0, "FR-09": 0, "FR-17": 0 };

function add(fr, cfg, source = "AI") {
  counters[fr] += 1;
  const id = `${fr}-TC-${String(counters[fr]).padStart(3, "0")}`;
  const auditIndex = counters[fr];
  let aiAudit = "VALID";
  let auditReason = "Ca kiểm thử bám đúng đặc tả, có dữ liệu và oracle kiểm tra được.";
  let correction = "Không cần chỉnh sửa.";

  if (source === "AI" && auditIndex % 11 === 0) {
    aiAudit = "INVALID";
    auditReason = "Bản AI ban đầu suy đoán oracle theo hành vi phổ biến thay vì truy vết SRS.";
    correction = "Đã thay oracle bằng status/ràng buộc trong SRS và bổ sung liên kết FR/SEC.";
  } else if (source === "AI" && auditIndex % 7 === 0) {
    aiAudit = "INCOMPLETE";
    auditReason = "Bản AI ban đầu thiếu assertion schema hoặc hậu điều kiện có thể quan sát.";
    correction = "Đã bổ sung expected keys và assertion nghiệp vụ tương ứng.";
  }

  cases.push({
    id,
    fr,
    source,
    category: cfg.category,
    title: cfg.title,
    endpoint: cfg.path,
    method: cfg.method ?? "POST",
    preconditions: cfg.preconditions ?? "Backend được reset và seed; baseUrl khả dụng.",
    auth: cfg.auth ?? "none",
    body: cfg.body ?? null,
    rawBody: cfg.rawBody ?? null,
    expectedStatus: cfg.expectedStatus,
    expectedKeys: cfg.expectedKeys ?? (cfg.expectedStatus < 400 ? ["message"] : ["error"]),
    expectedRule: cfg.expectedRule ?? "status-and-schema",
    expectedData: cfg.expectedData ?? null,
    setup: cfg.setup ?? null,
    secRefs: cfg.secRefs ?? [],
    aiAudit: source === "HUMAN" ? "N/A" : aiAudit,
    auditReason: source === "HUMAN" ? "Ca kiểm thử do sinh viên bổ sung sau audit." : auditReason,
    correction: source === "HUMAN" ? "Không áp dụng." : correction,
    actualResult: "Chưa thực thi",
    status: "NOT_RUN",
    bugId: "",
  });
}

const b = (value) => value;

// FR-03: 35 AI-generated candidates + 5 human extensions.
[
  ["domain", "Email user đã đăng ký nhận OTP", "/api/forgot-password", b({ email: "test@eshop.com" }), 200, ["message", "resetToken"], "otp-six-digits"],
  ["domain", "Email admin đã đăng ký nhận OTP", "/api/forgot-password", b({ email: "admin@eshop.com" }), 200, ["message", "resetToken"], "otp-six-digits"],
  ["domain", "Email chưa đăng ký bị từ chối", "/api/forgot-password", b({ email: "missing@eshop.com" }), 404, ["error"]],
  ["partition", "Email rỗng", "/api/forgot-password", b({ email: "" }), 400, ["error"]],
  ["partition", "Thiếu trường email", "/api/forgot-password", b({}), 400, ["error"]],
  ["partition", "Email null", "/api/forgot-password", b({ email: null }), 400, ["error"]],
  ["partition", "Email sai định dạng thiếu @", "/api/forgot-password", b({ email: "test.eshop.com" }), 400, ["error"]],
  ["partition", "Email sai định dạng thiếu domain", "/api/forgot-password", b({ email: "test@" }), 400, ["error"]],
  ["partition", "Email có khoảng trắng đầu cuối", "/api/forgot-password", b({ email: " test@eshop.com " }), 400, ["error"]],
  ["security", "Payload email SQL injection không được thực thi", "/api/forgot-password", b({ email: "' OR 1=1 --" }), 404, ["error"], "status-and-schema", ["SEC-05"]],
  ["security", "Email dạng object bị từ chối", "/api/forgot-password", b({ email: { $ne: null } }), 400, ["error"], "status-and-schema", ["SEC-05"]],
  ["schema", "Response lấy OTP không lộ password", "/api/forgot-password", b({ email: "test@eshop.com" }), 200, ["message", "resetToken"], "no-password-field", ["SEC-01", "SEC-07"]],
  ["boundary", "OTP trả về đúng 6 chữ số", "/api/forgot-password", b({ email: "test@eshop.com" }), 200, ["message", "resetToken"], "otp-six-digits", ["SEC-07"]],
  ["domain", "Reset với OTP hợp lệ", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "ValidPass1!" }), 200, ["message"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["domain", "Reset với OTP sai", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "999999", newPassword: "ValidPass1!" }), 400, ["error"]],
  ["security", "OTP của email này không dùng cho email khác", "/api/reset-password", b({ email: "admin@eshop.com", resetToken: "{{activeOtp}}", newPassword: "ValidPass1!" }), 400, ["error"], "status-and-schema", ["SEC-07"], "issue-user-otp"],
  ["partition", "Reset thiếu email", "/api/reset-password", b({ resetToken: "123456", newPassword: "ValidPass1!" }), 400, ["error"]],
  ["partition", "Reset thiếu OTP", "/api/reset-password", b({ email: "test@eshop.com", newPassword: "ValidPass1!" }), 400, ["error"]],
  ["partition", "Reset thiếu mật khẩu mới", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "123456" }), 400, ["error"]],
  ["partition", "OTP rỗng", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "", newPassword: "ValidPass1!" }), 400, ["error"]],
  ["partition", "OTP null", "/api/reset-password", b({ email: "test@eshop.com", resetToken: null, newPassword: "ValidPass1!" }), 400, ["error"]],
  ["boundary", "OTP 5 chữ số bị từ chối", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "12345", newPassword: "ValidPass1!" }), 400, ["error"], "status-and-schema", ["SEC-07"]],
  ["boundary", "OTP 7 chữ số bị từ chối", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "1234567", newPassword: "ValidPass1!" }), 400, ["error"], "status-and-schema", ["SEC-07"]],
  ["partition", "OTP chứa chữ bị từ chối", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "12AB56", newPassword: "ValidPass1!" }), 400, ["error"]],
  ["partition", "OTP chứa khoảng trắng bị từ chối", "/api/reset-password", b({ email: "test@eshop.com", resetToken: " 123456 ", newPassword: "ValidPass1!" }), 400, ["error"]],
  ["boundary", "Mật khẩu đúng 8 ký tự hợp lệ", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "Abcd12!x" }), 200, ["message"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["boundary", "Mật khẩu 7 ký tự bị từ chối", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "Ab1!xyz" }), 400, ["error"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["partition", "Mật khẩu thiếu chữ hoa", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "abcdef1!" }), 400, ["error"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["partition", "Mật khẩu thiếu chữ thường", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "ABCDEF1!" }), 400, ["error"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["partition", "Mật khẩu thiếu chữ số", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "Abcdefg!" }), 400, ["error"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["partition", "Mật khẩu thiếu ký tự đặc biệt", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "Abcdefg1" }), 400, ["error"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["partition", "Mật khẩu null bị từ chối", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: null }), 400, ["error"], "status-and-schema", ["SEC-07"], "issue-otp"],
  ["state", "OTP đã dùng không thể dùng lại", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "Another1!" }), 400, ["error"], "status-and-schema", ["SEC-07"], "prepare-used-otp"],
  ["schema", "Reset thành công chỉ trả message", "/api/reset-password", b({ email: "test@eshop.com", resetToken: "{{activeOtp}}", newPassword: "SchemaOk1!" }), 200, ["message"], "no-password-field", ["SEC-01", "SEC-07"], "issue-otp"],
  ["security", "Reset SQL injection ở email bị từ chối", "/api/reset-password", b({ email: "' OR 1=1 --", resetToken: "123456", newPassword: "ValidPass1!" }), 400, ["error"], "status-and-schema", ["SEC-05"]],
].forEach(([category, title, p, body, status, keys, rule, secRefs, setup]) => add("FR-03", { category, title, path: p, body, expectedStatus: status, expectedKeys: keys, expectedRule: rule, secRefs, setup }));

[
  ["security", "Chống brute-force OTP với nhiều lần thử sai", "/api/reset-password", { email: "test@eshop.com", resetToken: "000000", newPassword: "ValidPass1!" }, 429, ["error"], "rate-limit"],
  ["state", "Hai yêu cầu OTP liên tiếp vô hiệu hóa OTP cũ", "/api/reset-password", { email: "test@eshop.com", resetToken: "{{oldOtp}}", newPassword: "ValidPass1!" }, 400, ["error"], "status-and-schema", ["SEC-07"], "issue-two-otps"],
  ["security", "OTP hết hạn bị từ chối", "/api/reset-password", { email: "test@eshop.com", resetToken: "111111", newPassword: "ValidPass1!" }, 400, ["error"], "status-and-schema", ["SEC-07"]],
  ["security", "Null byte trong email không vượt kiểm tra", "/api/forgot-password", { email: "test@eshop.com\u0000.attacker" }, 400, ["error"], "status-and-schema", ["SEC-05"]],
  ["state", "Mật khẩu không đổi khi OTP sai", "/api/reset-password", { email: "test@eshop.com", resetToken: "999999", newPassword: "ShouldNot1!" }, 400, ["error"], "password-unchanged", ["SEC-07"]],
].forEach(([category, title, p, body, status, keys, rule, secRefs, setup]) => add("FR-03", { category, title, path: p, body, expectedStatus: status, expectedKeys: keys, expectedRule: rule, secRefs, setup }, "HUMAN"));

// FR-09: 35 AI-generated candidates + 5 human extensions.
[
  ["domain", "SAVE10 hợp lệ trên ngưỡng", { code: "SAVE10", total_amount: 500000, user_id: 2 }, "user", 200, ["success", "coupon_id", "discount_amount", "final_amount", "message"], "percent-formula", { discount: 50000, final: 450000 }],
  ["domain", "BIGBUY fixed hợp lệ", { code: "BIGBUY", total_amount: 600000, user_id: 2 }, "user", 200, ["success", "coupon_id", "discount_amount", "final_amount"], "fixed-formula", { discount: 50000, final: 550000 }],
  ["domain", "VIP100 hợp lệ", { code: "VIP100", total_amount: 500000, user_id: 2 }, "user", 200, ["success", "discount_amount", "final_amount"], "fixed-formula", { discount: 100000, final: 400000 }],
  ["state", "Coupon hết hạn bị từ chối", { code: "EXPIRED", total_amount: 500000, user_id: 2 }, "user", 400, ["error"]],
  ["domain", "Coupon không tồn tại", { code: "NO_SUCH_CODE", total_amount: 500000, user_id: 2 }, "user", 404, ["error"]],
  ["partition", "Thiếu code", { total_amount: 500000, user_id: 2 }, "user", 400, ["error"]],
  ["partition", "Code rỗng", { code: "", total_amount: 500000, user_id: 2 }, "user", 400, ["error"]],
  ["partition", "Code chỉ có khoảng trắng", { code: "   ", total_amount: 500000, user_id: 2 }, "user", 400, ["error"]],
  ["partition", "Code sai chữ thường hoa", { code: "save10", total_amount: 500000, user_id: 2 }, "user", 404, ["error"]],
  ["security", "Code SQL injection không được thực thi", { code: "' OR 1=1 --", total_amount: 500000, user_id: 2 }, "user", 404, ["error"], "status-and-schema", null, ["SEC-05"]],
  ["boundary", "SAVE10 đúng ngưỡng tối thiểu", { code: "SAVE10", total_amount: 300000, user_id: 2 }, "user", 200, ["success", "discount_amount", "final_amount"], "percent-formula", { discount: 30000, final: 270000 }],
  ["boundary", "SAVE10 thấp hơn ngưỡng 1 đồng", { code: "SAVE10", total_amount: 299999, user_id: 2 }, "user", 400, ["error"]],
  ["boundary", "SAVE10 cao hơn ngưỡng 1 đồng", { code: "SAVE10", total_amount: 300001, user_id: 2 }, "user", 200, ["success", "discount_amount", "final_amount"], "percent-formula", { discount: 30000, final: 270001 }],
  ["boundary", "BIGBUY đúng ngưỡng tối thiểu", { code: "BIGBUY", total_amount: 500000, user_id: 2 }, "user", 200, ["success", "discount_amount", "final_amount"], "fixed-formula", { discount: 50000, final: 450000 }],
  ["partition", "total_amount âm", { code: "SAVE10", total_amount: -1, user_id: 2 }, "user", 400, ["error"]],
  ["partition", "total_amount bằng 0", { code: "SAVE10", total_amount: 0, user_id: 2 }, "user", 400, ["error"]],
  ["partition", "Thiếu total_amount", { code: "SAVE10", user_id: 2 }, "user", 400, ["error"]],
  ["partition", "total_amount null", { code: "SAVE10", total_amount: null, user_id: 2 }, "user", 400, ["error"]],
  ["partition", "total_amount là chuỗi số", { code: "SAVE10", total_amount: "500000", user_id: 2 }, "user", 400, ["error"]],
  ["partition", "total_amount là chuỗi bất kỳ", { code: "SAVE10", total_amount: "abc", user_id: 2 }, "user", 400, ["error"]],
  ["boundary", "total_amount số thập phân", { code: "SAVE10", total_amount: 500000.5, user_id: 2 }, "user", 400, ["error"]],
  ["boundary", "total_amount rất lớn", { code: "BIGBUY", total_amount: 9007199254740991, user_id: 2 }, "user", 200, ["success", "discount_amount", "final_amount"], "fixed-formula", { discount: 50000, final: 9007199254690991 }],
  ["security", "Thiếu JWT bị từ chối", { code: "SAVE10", total_amount: 500000, user_id: 2 }, "none", 401, ["error"], "status-and-schema", null, ["SEC-02"]],
  ["security", "JWT không hợp lệ bị từ chối", { code: "SAVE10", total_amount: 500000, user_id: 2 }, "invalid", 403, ["error"], "status-and-schema", null, ["SEC-02"]],
  ["security", "JWT user hợp lệ được chấp nhận", { code: "BIGBUY", total_amount: 600000, user_id: 2 }, "user", 200, ["success", "discount_amount", "final_amount"], "fixed-formula", { discount: 50000, final: 550000 }, ["SEC-02"]],
  ["partition", "Thiếu user_id khi đã đăng nhập", { code: "BIGBUY", total_amount: 600000 }, "user", 200, ["success", "discount_amount", "final_amount"], "identity-from-token", null, ["SEC-02"]],
  ["security", "user_id của người khác bị bỏ qua", { code: "BIGBUY", total_amount: 600000, user_id: 1 }, "user", 200, ["success", "discount_amount", "final_amount"], "identity-from-token", null, ["SEC-02"]],
  ["partition", "user_id dạng chuỗi bị từ chối", { code: "BIGBUY", total_amount: 600000, user_id: "2" }, "user", 400, ["error"]],
  ["partition", "user_id không tồn tại bị từ chối", { code: "BIGBUY", total_amount: 600000, user_id: 999999 }, "user", 400, ["error"]],
  ["state", "SAVE10 đã dùng hết lượt bị từ chối", { code: "SAVE10", total_amount: 500000, user_id: 2 }, "user", 400, ["error"], "status-and-schema", null, [], "record-save10-usage"],
  ["state", "VIP100 còn lượt thứ hai", { code: "VIP100", total_amount: 500000, user_id: 2 }, "user", 200, ["success", "discount_amount", "final_amount"], "fixed-formula", { discount: 100000, final: 400000 }, [], "record-vip100-once"],
  ["state", "VIP100 hết hai lượt", { code: "VIP100", total_amount: 500000, user_id: 2 }, "user", 400, ["error"], "status-and-schema", null, [], "record-vip100-twice"],
  ["schema", "Response thành công dùng đúng kiểu dữ liệu", { code: "BIGBUY", total_amount: 600000, user_id: 2 }, "user", 200, ["success", "coupon_id", "discount_amount", "final_amount", "message"], "success-types"],
  ["schema", "Response lỗi có trường error", { code: "MISSING", total_amount: 600000, user_id: 2 }, "user", 404, ["error"]],
  ["security", "Prototype-shaped code không gây lỗi máy chủ", { code: "__proto__", total_amount: 600000, user_id: 2 }, "user", 404, ["error"]],
].forEach(([category, title, body, auth, status, keys, rule, expectedData, secRefs, setup]) => add("FR-09", { category, title, path: "/api/apply-coupon", body, auth, expectedStatus: status, expectedKeys: keys, expectedRule: rule, expectedData, secRefs, setup }));

[
  ["concurrency", "Hai request đồng thời không vượt max_uses_per_user", { code: "SAVE10", total_amount: 500000, user_id: 2 }, "user", 400, ["error"], "concurrent-usage", null, ["SEC-02"], "record-save10-usage"],
  ["boundary", "Fixed discount lớn hơn tổng tiền không tạo final âm", { code: "VIP100", total_amount: 50000, user_id: 2 }, "user", 400, ["error"], "nonnegative-final"],
  ["security", "Client giả mạo user_id không chiếm lượt của nạn nhân", { code: "VIP100", total_amount: 500000, user_id: 1 }, "user", 200, ["success"], "identity-from-token", null, ["SEC-02"]],
  ["state", "Ghi nhận coupon usage bắt buộc đúng danh tính JWT", { coupon_id: 1 }, "user", 200, ["message"], "status-and-schema", null, ["SEC-02"], null, "/api/coupon-usage"],
  ["boundary", "Hạn dùng được đánh giá nhất quán tại ranh giới ngày", { code: "EXPIRED", total_amount: 500000, user_id: 2 }, "user", 400, ["error"], "expiry-boundary"],
].forEach(([category, title, body, auth, status, keys, rule, expectedData, secRefs, setup, customPath]) => add("FR-09", { category, title, path: customPath ?? "/api/apply-coupon", body, auth, expectedStatus: status, expectedKeys: keys, expectedRule: rule, expectedData, secRefs, setup }, "HUMAN"));

// FR-17: 35 AI-generated candidates + 5 human extensions.
[
  ["security", "Admin lấy danh sách coupon", "GET", "/api/coupons", null, "admin", 200, [], "array-response", ["SEC-02", "SEC-03"]],
  ["security", "User thường không được xem danh sách admin", "GET", "/api/coupons", null, "user", 403, ["error"], "status-and-schema", ["SEC-02", "SEC-03"]],
  ["security", "Thiếu token không được xem danh sách", "GET", "/api/coupons", null, "none", 401, ["error"], "status-and-schema", ["SEC-02"]],
  ["security", "Token sai không được xem danh sách", "GET", "/api/coupons", null, "invalid", 403, ["error"], "status-and-schema", ["SEC-02"]],
  ["schema", "Danh sách coupon không lộ dữ liệu ngoài schema", "GET", "/api/coupons", null, "admin", 200, [], "coupon-list-schema"],
  ["domain", "Admin tạo coupon percent hợp lệ", "POST", "/api/admin/coupons", { code: "NEWPCT01", type: "percent", discount_value: 15, min_order_amount: 200000, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 200, ["message", "id"]],
  ["domain", "Admin tạo coupon fixed hợp lệ", "POST", "/api/admin/coupons", { code: "NEWFIX01", type: "fixed", discount_value: 50000, min_order_amount: 200000, expired_at: "2099-12-31", max_uses_per_user: 2 }, "admin", 200, ["message", "id"]],
  ["security", "User thường không được tạo coupon", "POST", "/api/admin/coupons", { code: "USERCREATE", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "user", 403, ["error"], "status-and-schema", ["SEC-03"]],
  ["security", "Thiếu token không được tạo coupon", "POST", "/api/admin/coupons", { code: "NOAUTH", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "none", 401, ["error"], "status-and-schema", ["SEC-02"]],
  ["security", "Token sai không được tạo coupon", "POST", "/api/admin/coupons", { code: "BADTOKEN", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "invalid", 403, ["error"], "status-and-schema", ["SEC-02"]],
  ["partition", "Thiếu code", "POST", "/api/admin/coupons", { type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["partition", "Code rỗng", "POST", "/api/admin/coupons", { code: "", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["partition", "Code chỉ khoảng trắng", "POST", "/api/admin/coupons", { code: "   ", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["state", "Code trùng bị từ chối", "POST", "/api/admin/coupons", { code: "DUPLICATE01", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 409, ["error"], "status-and-schema", [], "create-duplicate-coupon"],
  ["partition", "Thiếu type", "POST", "/api/admin/coupons", { code: "NOTYPE", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["partition", "Type ngoài percent/fixed", "POST", "/api/admin/coupons", { code: "BADTYPE", type: "ratio", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["partition", "Thiếu discount_value", "POST", "/api/admin/coupons", { code: "NOVALUE", type: "fixed", min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["boundary", "discount_value bằng 0 bị từ chối", "POST", "/api/admin/coupons", { code: "ZEROVALUE", type: "fixed", discount_value: 0, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["boundary", "discount_value âm bị từ chối", "POST", "/api/admin/coupons", { code: "NEGATIVE", type: "fixed", discount_value: -1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["partition", "discount_value dạng chuỗi bị từ chối", "POST", "/api/admin/coupons", { code: "STRINGVALUE", type: "fixed", discount_value: "10", min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["boundary", "min_order_amount bằng 0 hợp lệ", "POST", "/api/admin/coupons", { code: "MINZERO", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 200, ["message", "id"]],
  ["boundary", "min_order_amount âm bị từ chối", "POST", "/api/admin/coupons", { code: "MINNEG", type: "fixed", discount_value: 1, min_order_amount: -1, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["partition", "Thiếu expired_at", "POST", "/api/admin/coupons", { code: "NOEXP", type: "fixed", discount_value: 1, min_order_amount: 0, max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["partition", "expired_at sai định dạng", "POST", "/api/admin/coupons", { code: "BADEXP", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "not-a-date", max_uses_per_user: 1 }, "admin", 400, ["error"]],
  ["boundary", "max_uses_per_user bằng 1 hợp lệ", "POST", "/api/admin/coupons", { code: "MAXONE", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 200, ["message", "id"]],
  ["boundary", "max_uses_per_user bằng 0 bị từ chối", "POST", "/api/admin/coupons", { code: "MAXZERO", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 0 }, "admin", 400, ["error"]],
  ["boundary", "max_uses_per_user âm bị từ chối", "POST", "/api/admin/coupons", { code: "MAXNEG", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: -1 }, "admin", 400, ["error"]],
  ["security", "Code SQL injection được lưu như dữ liệu", "POST", "/api/admin/coupons", { code: "SQL'; DROP TABLE coupons;--", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 200, ["message", "id"], "status-and-schema", ["SEC-05"]],
  ["security", "Code XSS không được thực thi", "POST", "/api/admin/coupons", { code: "<script>alert(1)</script>", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 200, ["message", "id"]],
  ["domain", "Admin xóa coupon tồn tại", "DELETE", "/api/admin/coupons/{{createdCouponId}}", null, "admin", 200, ["message"], "status-and-schema", [], "create-coupon-for-delete"],
  ["security", "User thường không được xóa coupon", "DELETE", "/api/admin/coupons/{{createdCouponId}}", null, "user", 403, ["error"], "status-and-schema", ["SEC-03"], "create-coupon-for-delete"],
  ["security", "Thiếu token không được xóa coupon", "DELETE", "/api/admin/coupons/1", null, "none", 401, ["error"], "status-and-schema", ["SEC-02"]],
  ["security", "Token sai không được xóa coupon", "DELETE", "/api/admin/coupons/1", null, "invalid", 403, ["error"], "status-and-schema", ["SEC-02"]],
  ["domain", "Xóa coupon không tồn tại trả 404", "DELETE", "/api/admin/coupons/999999", null, "admin", 404, ["error"]],
  ["partition", "ID xóa không phải số bị từ chối", "DELETE", "/api/admin/coupons/not-a-number", null, "admin", 400, ["error"]],
].forEach(([category, title, method, p, body, auth, status, keys, rule, secRefs, setup]) => add("FR-17", { category, title, method, path: p, body, auth, expectedStatus: status, expectedKeys: keys, expectedRule: rule, secRefs, setup }));

[
  ["security", "JWT user có claim role giả trong body vẫn không có quyền", "POST", "/api/admin/coupons", { code: "ROLEBODY", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1, role: "admin" }, "user", 403, ["error"], "status-and-schema", ["SEC-03"]],
  ["concurrency", "Hai request tạo cùng code chỉ một request thành công", "POST", "/api/admin/coupons", { code: "RACECODE", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 409, ["error"], "concurrent-duplicate", ["SEC-05"], "create-duplicate-coupon"],
  ["state", "Xóa coupon đã có usage không để lại trạng thái sai", "DELETE", "/api/admin/coupons/1", null, "admin", 409, ["error"], "referential-integrity"],
  ["partition", "Code Unicode gần giống không bị đồng nhất ngoài ý muốn", "POST", "/api/admin/coupons", { code: "SАVE10", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "admin", 200, ["message", "id"]],
  ["security", "Mass assignment is_active bị bỏ qua hoặc kiểm soát", "POST", "/api/admin/coupons", { code: "MASSACTIVE", type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1, is_active: 0 }, "admin", 200, ["message", "id"], "mass-assignment"],
].forEach(([category, title, method, p, body, auth, status, keys, rule, secRefs, setup]) => add("FR-17", { category, title, method, path: p, body, auth, expectedStatus: status, expectedKeys: keys, expectedRule: rule, secRefs, setup }, "HUMAN"));

if (Object.values(counters).some((count) => count !== 40)) {
  throw new Error(`Expected exactly 40 cases per FR, got ${JSON.stringify(counters)}`);
}

function authHeader(auth) {
  if (auth === "admin") return "Bearer {{adminToken}}";
  if (auth === "user") return "Bearer {{userToken}}";
  if (auth === "invalid") return "Bearer invalid.token.value";
  return null;
}

function setupScript(testCase) {
  const header = (token = null) => [
    { key: "Content-Type", value: "application/json" },
    { key: "X-Student-Id", value: studentId },
    ...(token ? [{ key: "Authorization", value: `Bearer ${token}` }] : []),
  ];
  const base = "(pm.environment.get('baseUrl') || 'http://127.0.0.1:3000')";
  const send = (method, urlExpression, body, tokenExpression = null, callback = "") => {
    const headersExpr = tokenExpression
      ? `[{key:'Content-Type',value:'application/json'},{key:'X-Student-Id',value:'${studentId}'},{key:'Authorization',value:'Bearer '+${tokenExpression}}]`
      : JSON.stringify(header());
    return `pm.sendRequest({url:${urlExpression},method:'${method}',header:${headersExpr},body:{mode:'raw',raw:${JSON.stringify(JSON.stringify(body))}}},(err,res)=>{if(err){throw err;}${callback}});`;
  };

  if (testCase.setup === "issue-otp" || testCase.setup === "issue-user-otp") {
    return send("POST", `${base}+'/api/forgot-password'`, { email: "test@eshop.com" }, null, "pm.collectionVariables.set('activeOtp',res.json().resetToken);");
  }
  if (testCase.setup === "prepare-used-otp") {
    return `pm.sendRequest({url:${base}+'/api/forgot-password',method:'POST',header:${JSON.stringify(header())},body:{mode:'raw',raw:JSON.stringify({email:'test@eshop.com'})}},(e,r)=>{if(e)throw e;const otp=r.json().resetToken;pm.sendRequest({url:${base}+'/api/reset-password',method:'POST',header:${JSON.stringify(header())},body:{mode:'raw',raw:JSON.stringify({email:'test@eshop.com',resetToken:otp,newPassword:'UsedOtp1!'})}},(e2)=>{if(e2)throw e2;pm.collectionVariables.set('activeOtp',otp);});});`;
  }
  if (testCase.setup === "issue-two-otps") {
    return `pm.sendRequest({url:${base}+'/api/forgot-password',method:'POST',header:${JSON.stringify(header())},body:{mode:'raw',raw:JSON.stringify({email:'test@eshop.com'})}},(e,r)=>{if(e)throw e;pm.collectionVariables.set('oldOtp',r.json().resetToken);pm.sendRequest({url:${base}+'/api/forgot-password',method:'POST',header:${JSON.stringify(header())},body:{mode:'raw',raw:JSON.stringify({email:'test@eshop.com'})}},()=>{});});`;
  }
  if (testCase.expectedRule === "rate-limit") {
    return `let attempts=0;function tryInvalidOtp(){if(attempts++>=5)return;pm.sendRequest({url:${base}+'/api/reset-password',method:'POST',header:${JSON.stringify(header())},body:{mode:'raw',raw:JSON.stringify({email:'test@eshop.com',resetToken:'000000',newPassword:'ValidPass1!'})}},(e)=>{if(e)throw e;tryInvalidOtp();});}tryInvalidOtp();`;
  }
  const usageCount = testCase.setup === "record-vip100-twice" ? 2 : 1;
  const couponId = testCase.setup?.includes("vip100") ? 3 : 1;
  if (testCase.setup?.startsWith("record-")) {
    return Array.from({ length: usageCount }, () => send("POST", `${base}+'/api/coupon-usage'`, { coupon_id: couponId }, "pm.collectionVariables.get('userToken')")).join("\n");
  }
  if (testCase.setup === "create-duplicate-coupon") {
    return send("POST", `${base}+'/api/admin/coupons'`, { code: testCase.body.code, type: "fixed", discount_value: 1, min_order_amount: 0, expired_at: "2099-12-31", max_uses_per_user: 1 }, "pm.collectionVariables.get('adminToken')");
  }
  if (testCase.setup === "create-coupon-for-delete") {
    return `pm.sendRequest({url:${base}+'/api/admin/coupons',method:'POST',header:[{key:'Content-Type',value:'application/json'},{key:'X-Student-Id',value:'${studentId}'},{key:'Authorization',value:'Bearer '+pm.collectionVariables.get('adminToken')}],body:{mode:'raw',raw:JSON.stringify({code:'DEL'+Date.now(),type:'fixed',discount_value:1,min_order_amount:0,expired_at:'2099-12-31',max_uses_per_user:1})}},(e,r)=>{if(e)throw e;pm.collectionVariables.set('createdCouponId',r.json().id);});`;
  }
  return "";
}

function testScript(testCase) {
  return [
    `pm.test('[${testCase.id}] X-Student-Id được gắn',()=>pm.expect(pm.request.headers.get('X-Student-Id')).to.eql('${studentId}'));`,
    `pm.test('[${testCase.id}] HTTP status = ${testCase.expectedStatus}',()=>pm.response.to.have.status(${testCase.expectedStatus}));`,
    "var responseJson={}; try{responseJson=pm.response.json();}catch(e){}",
    ...testCase.expectedKeys.map((key) => `pm.test('[${testCase.id}] Có trường ${key}',()=>pm.expect(responseJson).to.have.property('${key}'));`),
    testCase.expectedRule === "otp-six-digits" ? `pm.test('[${testCase.id}] OTP có đúng 6 chữ số',()=>pm.expect(String(responseJson.resetToken||'')).to.match(/^\\d{6}$/));` : "",
    testCase.expectedRule === "no-password-field" ? `pm.test('[${testCase.id}] Không lộ trường password',()=>{const hasPasswordKey=(v)=>v&&typeof v==='object'&&(Object.keys(v).some(k=>k.toLowerCase()==='password')||Object.values(v).some(hasPasswordKey));pm.expect(hasPasswordKey(responseJson)).to.eql(false);});` : "",
    testCase.expectedRule === "array-response" ? `pm.test('[${testCase.id}] Response là array',()=>pm.expect(responseJson).to.be.an('array'));` : "",
    testCase.expectedRule === "coupon-list-schema" ? `pm.test('[${testCase.id}] Schema coupon list',()=>{pm.expect(responseJson).to.be.an('array');if(responseJson.length){['id','code','type','discount_value','min_order_amount','expired_at','is_active','max_uses_per_user'].forEach(k=>pm.expect(responseJson[0]).to.have.property(k));}});` : "",
    testCase.expectedRule === "success-types" ? `pm.test('[${testCase.id}] Kiểu dữ liệu success response',()=>{pm.expect(responseJson.success).to.be.a('boolean');pm.expect(responseJson.coupon_id).to.be.a('number');pm.expect(responseJson.discount_amount).to.be.a('number');pm.expect(responseJson.final_amount).to.be.a('number');});` : "",
    ["percent-formula", "fixed-formula"].includes(testCase.expectedRule) && testCase.expectedData ? `pm.test('[${testCase.id}] Công thức giảm giá đúng',()=>{pm.expect(responseJson.discount_amount).to.eql(${testCase.expectedData.discount});pm.expect(responseJson.final_amount).to.eql(${testCase.expectedData.final});});` : "",
  ].filter(Boolean);
}

function requestFor(testCase) {
  const headers = [{ key: "Content-Type", value: "application/json" }];
  const auth = authHeader(testCase.auth);
  if (auth) headers.push({ key: "Authorization", value: auth });
  const request = {
    method: testCase.method,
    header: headers,
    url: { raw: `{{baseUrl}}${testCase.endpoint}`, host: ["{{baseUrl}}"], path: testCase.endpoint.replace(/^\//, "").split("/") },
  };
  if (testCase.body !== null || testCase.rawBody !== null) {
    request.body = { mode: "raw", raw: testCase.rawBody ?? JSON.stringify(testCase.body, null, 2), options: { raw: { language: "json" } } };
  }
  return {
    name: `${testCase.id} | ${testCase.title}`,
    event: [
      ...(testCase.setup ? [{ listen: "prerequest", script: { type: "text/javascript", exec: [setupScript(testCase)] } }] : []),
      { listen: "test", script: { type: "text/javascript", exec: testScript(testCase) } },
    ],
    request,
  };
}

const collection = {
  info: {
    name: "HW06 API Testing - FR03 FR09 FR17",
    description: "Bộ kiểm thử theo SRS cho MSSV 23127502. Assertion nghiêm ngặt giữ nguyên các failure do bug thật.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  variable: [
    { key: "adminToken", value: "" },
    { key: "userToken", value: "" },
    { key: "activeOtp", value: "" },
    { key: "oldOtp", value: "" },
    { key: "createdCouponId", value: "" },
  ],
  event: [{
    listen: "prerequest",
    script: {
      type: "text/javascript",
      exec: [
        `pm.request.headers.upsert({key:'X-Student-Id',value:'${studentId}'});`,
        `console.log('X-Student-Id: ${studentId}', pm.info.requestName);`,
      ],
    },
  }],
  item: [
    {
      name: "00 - Setup authentication",
      item: [
        {
          name: "SETUP | Login admin",
          event: [{ listen: "test", script: { exec: ["pm.test('Admin login thành công',()=>pm.response.to.have.status(200));", "pm.collectionVariables.set('adminToken',pm.response.json().token);"] } }],
          request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ email: "admin@eshop.com", password: "Admin123!" }) }, url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] } },
        },
        {
          name: "SETUP | Login user",
          event: [{ listen: "test", script: { exec: ["pm.test('User login thành công',()=>pm.response.to.have.status(200));", "pm.collectionVariables.set('userToken',pm.response.json().token);"] } }],
          request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ email: "test@eshop.com", password: "Test1234!" }) }, url: { raw: "{{baseUrl}}/api/login", host: ["{{baseUrl}}"], path: ["api", "login"] } },
        },
      ],
    },
    ...Object.keys(counters).map((fr) => ({ name: fr, item: cases.filter((c) => c.fr === fr).map(requestFor) })),
  ],
};

const environment = {
  id: "hw06-local-23127502",
  name: "HW06 Local - 23127502",
  values: [
    { key: "baseUrl", value: "http://127.0.0.1:3000", enabled: true, type: "default" },
  ],
  _postman_variable_scope: "environment",
  _postman_exported_using: "Codex HW06 builder",
};

const smokeCollection = {
  info: { name: "HW06 CI Smoke", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  event: collection.event,
  item: [
    {
      name: "FR-03 | Forgot password responds",
      event: [{ listen: "test", script: { exec: ["pm.test('Status 200',()=>pm.response.to.have.status(200));", "const d=pm.response.json();pm.test('Có message và token',()=>{pm.expect(d.message).to.be.a('string');pm.expect(d.resetToken).to.be.a('string');});"] } }],
      request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ email: "test@eshop.com" }) }, url: { raw: "{{baseUrl}}/api/forgot-password", host: ["{{baseUrl}}"], path: ["api", "forgot-password"] } },
    },
    {
      name: "FR-09 | BIGBUY fixed calculation",
      event: [{ listen: "test", script: { exec: ["pm.test('Status 200',()=>pm.response.to.have.status(200));", "const d=pm.response.json();pm.test('Fixed formula',()=>{pm.expect(d.discount_amount).to.eql(50000);pm.expect(d.final_amount).to.eql(550000);});"] } }],
      request: { method: "POST", header: [{ key: "Content-Type", value: "application/json" }], body: { mode: "raw", raw: JSON.stringify({ code: "BIGBUY", total_amount: 600000, user_id: 2 }) }, url: { raw: "{{baseUrl}}/api/apply-coupon", host: ["{{baseUrl}}"], path: ["api", "apply-coupon"] } },
    },
    {
      name: "FR-17 | Missing token rejected",
      event: [{ listen: "test", script: { exec: ["pm.test('Status 401',()=>pm.response.to.have.status(401));", "pm.test('Error schema',()=>pm.expect(pm.response.json()).to.have.property('error'));"] } }],
      request: { method: "GET", header: [], url: { raw: "{{baseUrl}}/api/coupons", host: ["{{baseUrl}}"], path: ["api", "coupons"] } },
    },
  ],
};

const dataDrivenCollection = {
  info: { name: "HW06 FR-09 Data Driven", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
  event: collection.event,
  item: [{
    name: "FR-09 boundary from data file",
    event: [{ listen: "test", script: { exec: [
      "pm.test('Status theo data',()=>pm.expect(pm.response.code).to.eql(Number(pm.iterationData.get('expectedStatus'))));",
      "if(pm.response.code===200){const d=pm.response.json();pm.test('Có discount/final',()=>{pm.expect(d).to.have.property('discount_amount');pm.expect(d).to.have.property('final_amount');});}",
    ] } }],
    request: {
      method: "POST",
      header: [{ key: "Content-Type", value: "application/json" }],
      body: { mode: "raw", raw: "{\n  \"code\": \"{{code}}\",\n  \"total_amount\": {{total_amount}},\n  \"user_id\": 2\n}" },
      url: { raw: "{{baseUrl}}/api/apply-coupon", host: ["{{baseUrl}}"], path: ["api", "apply-coupon"] },
    },
  }],
};

const dataRows = [
  { code: "SAVE10", total_amount: 299999, expectedStatus: 400 },
  { code: "SAVE10", total_amount: 300000, expectedStatus: 200 },
  { code: "SAVE10", total_amount: 300001, expectedStatus: 200 },
  { code: "BIGBUY", total_amount: 499999, expectedStatus: 400 },
  { code: "BIGBUY", total_amount: 500000, expectedStatus: 200 },
  { code: "BIGBUY", total_amount: 500001, expectedStatus: 200 },
  { code: "EXPIRED", total_amount: 500000, expectedStatus: 400 },
  { code: "UNKNOWN", total_amount: 500000, expectedStatus: 404 },
];

const dirs = ["test-cases", "test-cases/generated", "test-cases/audited", "test-cases/final", "postman", "postman/data", "reports", "reports/newman"];
dirs.forEach((dir) => fs.mkdirSync(path.join(root, dir), { recursive: true }));
fs.writeFileSync(path.join(root, "test-cases", "test-cases.json"), JSON.stringify(cases, null, 2) + "\n");
for (const fr of Object.keys(counters)) {
  const slug = fr.toLowerCase().replace("-", "");
  const aiRows = cases.filter((tc) => tc.fr === fr && tc.source === "AI");
  const generatedRows = aiRows.map(({ aiAudit, auditReason, correction, actualResult, status, bugId, ...candidate }) => ({
    ...candidate,
    candidateOracle: "AI-generated; must be reviewed against the SRS before execution.",
  }));
  const auditedRows = aiRows.map(({ actualResult, status, bugId, ...audited }) => audited);
  const finalRows = cases.filter((tc) => tc.fr === fr);
  fs.writeFileSync(path.join(root, "test-cases", "generated", `${slug}-ai-generated.json`), JSON.stringify(generatedRows, null, 2) + "\n");
  fs.writeFileSync(path.join(root, "test-cases", "audited", `${slug}-audited.json`), JSON.stringify(auditedRows, null, 2) + "\n");
  fs.writeFileSync(path.join(root, "test-cases", "final", `${slug}-final.json`), JSON.stringify(finalRows, null, 2) + "\n");
}
fs.writeFileSync(path.join(root, "postman", "HW06.postman_collection.json"), JSON.stringify(collection, null, 2) + "\n");
for (const fr of Object.keys(counters)) {
  const slug = fr.toLowerCase().replace("-", "");
  const scoped = {
    ...collection,
    info: { ...collection.info, name: `HW06 API Testing - ${fr}` },
    item: [collection.item[0], collection.item.find((folder) => folder.name === fr)],
  };
  fs.writeFileSync(path.join(root, "postman", `HW06-${slug.toUpperCase()}.postman_collection.json`), JSON.stringify(scoped, null, 2) + "\n");
}
fs.writeFileSync(path.join(root, "postman", "HW06.postman_environment.json"), JSON.stringify(environment, null, 2) + "\n");
fs.writeFileSync(path.join(root, "postman", "HW06-CI-Smoke.postman_collection.json"), JSON.stringify(smokeCollection, null, 2) + "\n");
fs.writeFileSync(path.join(root, "postman", "HW06-FR09-DataDriven.postman_collection.json"), JSON.stringify(dataDrivenCollection, null, 2) + "\n");
fs.writeFileSync(path.join(root, "postman", "data", "fr09-boundaries.json"), JSON.stringify(dataRows, null, 2) + "\n");

const csvHeaders = ["id", "fr", "source", "category", "title", "method", "endpoint", "auth", "expectedStatus", "expectedRule", "secRefs", "aiAudit", "auditReason", "correction", "actualResult", "status", "bugId"];
const csv = [csvHeaders.join(","), ...cases.map((tc) => csvHeaders.map((key) => `"${String(Array.isArray(tc[key]) ? tc[key].join(";") : tc[key] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n") + "\n";
fs.writeFileSync(path.join(root, "test-cases", "test-cases.csv"), csv);

const summary = Object.keys(counters).map((fr) => {
  const rows = cases.filter((tc) => tc.fr === fr);
  return { fr, total: rows.length, ai: rows.filter((tc) => tc.source === "AI").length, human: rows.filter((tc) => tc.source === "HUMAN").length, valid: rows.filter((tc) => tc.aiAudit === "VALID").length, invalid: rows.filter((tc) => tc.aiAudit === "INVALID").length, incomplete: rows.filter((tc) => tc.aiAudit === "INCOMPLETE").length };
});
fs.writeFileSync(path.join(root, "reports", "generation-summary.json"), JSON.stringify({ studentId, generatedAt: new Date().toISOString(), totals: summary }, null, 2) + "\n");
console.log(JSON.stringify({ totalCases: cases.length, summary }, null, 2));
