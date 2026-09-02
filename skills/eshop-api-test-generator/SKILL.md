---
name: eshop-api-test-generator
description: Generate, audit, validate, and export API test cases from the EShop API specification and SRS. Use for FR-based EShop API test design that requires domain partitions, boundaries, security, schema checks, and Postman-ready data; do not fabricate execution evidence or modify the SUT.
---

# EShop API Test Generator

Generate an auditable test-case dataset from the supplied specification, then use the bundled scripts to validate and export it.

## Inputs

Require the API specification, SRS/security requirements, selected FR IDs, student ID, and output directory. If the SRS is not local, use only the authoritative URL supplied by the user.

## Workflow

1. Read the relevant endpoint definitions and FR/SEC requirements. Prefer the SRS for business rules and the API specification for wire format. Record conflicts instead of silently resolving them.
2. Read [case-schema.md](references/case-schema.md). Produce candidate cases with explicit inputs and observable oracles.
3. For each selected FR, generate at least the requested AI count. Cover every parameter with valid/invalid partitions and boundaries, then add security, state, and response-schema cases according to [coverage-policy.md](references/coverage-policy.md).
4. Audit each AI case as `VALID`, `INVALID`, or `INCOMPLETE`. Preserve the label and reason; correct invalid/incomplete cases in the final oracle instead of deleting them.
5. Add the requested human-review extensions separately with `source: HUMAN`. These must target omissions discovered during audit, not duplicates with renamed titles.
6. Run `scripts/validate_cases.py` against the JSON dataset. Fix structural, count, uniqueness, or coverage errors before export.
7. Run `scripts/export_cases.py` to create CSV, a coverage summary, and Postman-compatible iteration data.

## Constraints

- Add `X-Student-Id` to every executable request using the supplied student ID.
- Keep expected results based on the specification even when the SUT is known to be buggy.
- Do not change SUT code, weaken assertions to make tests pass, invent Newman/GitHub evidence, or generate the student's self-drawn architecture diagram.
- Mark cases that cannot be verified through the public API as review/manual cases and explain the required evidence.
