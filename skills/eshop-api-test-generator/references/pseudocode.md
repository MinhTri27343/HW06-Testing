# Pseudocode - AI-driven API test generator

```text
INPUT api_spec, srs, selected_features, student_id, output_dir

requirements = PARSE(api_spec, srs)
FOR EACH feature IN selected_features
    endpoints = MAP_ENDPOINTS(requirements, feature)
    rules = EXTRACT_DOMAIN_STATE_SECURITY_SCHEMA(requirements, feature)

    candidates = AI_GENERATE(
        endpoints,
        rules,
        minimum_ai_cases,
        required_coverage_categories
    )

    FOR EACH candidate IN candidates
        audit = HUMAN_REVIEW(candidate, requirements)
        IF audit IS INVALID OR INCOMPLETE
            candidate = CORRECT(candidate, requirements, audit.reason)
        END IF
        SAVE_AUDIT_TRAIL(candidate, audit)
    END FOR

    extensions = HUMAN_ADD_MISSED_CASES(candidates, minimum_human_cases)
    final_cases += candidates + extensions
END FOR

VALIDATE_SCHEMA_COUNTS_IDS_COVERAGE(final_cases)
INJECT_STUDENT_HEADER_POLICY(final_cases, student_id)
EXPORT_JSON_CSV_POSTMAN_DATA_SUMMARY(final_cases, output_dir)
RETURN final_cases, coverage_summary, validation_result
```

The student must convert this logic into a self-drawn diagram and make the final layout decisions. Do not submit an AI-generated Mermaid diagram as the required diagram.
