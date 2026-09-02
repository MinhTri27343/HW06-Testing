# Canonical test-case schema

The dataset may be a JSON array or an object with a `cases` array. Each case must contain:

| Field | Meaning |
|---|---|
| `id` | Unique ID such as `FR-03-TC-001` |
| `fr` | Selected feature ID |
| `source` | `AI` or `HUMAN` |
| `category` | Domain, partition, boundary, security, state, schema, or concurrency |
| `title` | One observable test intent |
| `method`, `endpoint` | HTTP interface under test |
| `preconditions` | Required data/auth state |
| `auth` | `none`, `user`, `admin`, or `invalid` |
| `body` | JSON-compatible request body, or null |
| `expectedStatus` | Expected HTTP status from the specification |
| `expectedKeys` | Required response keys |
| `expectedRule` | Named semantic oracle |
| `secRefs` | Related SEC IDs |
| `aiAudit` | `VALID`, `INVALID`, `INCOMPLETE`, or `N/A` for human cases |
| `auditReason` | Concrete audit rationale |
| `correction` | Correction applied, or why none is needed |

Execution fields (`actualResult`, `status`, `bugId`) may remain empty until a real run.

Do not encode multiple unrelated behaviors in one case. Inputs and expected results must be serializable and reviewable without opening the generator.
