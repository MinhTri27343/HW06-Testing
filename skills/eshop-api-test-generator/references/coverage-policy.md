# Coverage policy

For each selected feature:

1. Cover valid, invalid, missing, null, empty, wrong-type, lower-bound, exact-bound, upper-bound, and unusually large inputs where applicable.
2. Include at least one success and one error schema assertion for every endpoint.
3. Trace protected endpoints to authentication and authorization requirements. Distinguish missing token (`401`) from invalid token or wrong role (`403`) when the SRS does.
4. Test stateful rules through observable sequences: OTP issue/use/reuse, coupon usage limits, create/list/delete, or equivalent feature transitions.
5. Include parameterized-query payloads without destructive side effects. Do not exploit systems outside the user-provided local SUT.
6. Ensure the required categories include `domain` or `partition`, `boundary`, `security`, and `schema`. Add `state` when the feature changes persistent state.
7. Human extensions must explain why the AI missed the case: prompt omission, cross-request state, concurrency, identity binding, time boundary, or model assumption.
