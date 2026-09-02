#!/usr/bin/env python3
import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

REQUIRED = {
    "id", "fr", "source", "category", "title", "method", "endpoint",
    "preconditions", "auth", "expectedStatus", "expectedKeys",
    "expectedRule", "secRefs", "aiAudit", "auditReason", "correction",
}
REQUIRED_CATEGORIES = {"boundary", "security", "schema"}


def load_cases(path):
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    return payload if isinstance(payload, list) else payload.get("cases", [])


def main():
    parser = argparse.ArgumentParser(description="Validate an EShop API test-case dataset")
    parser.add_argument("input")
    parser.add_argument("--features", required=True, help="Comma-separated FR IDs")
    parser.add_argument("--min-ai", type=int, default=35)
    parser.add_argument("--min-human", type=int, default=5)
    args = parser.parse_args()

    cases = load_cases(args.input)
    features = [item.strip() for item in args.features.split(",") if item.strip()]
    errors = []
    ids = [case.get("id") for case in cases]
    duplicates = [item for item, count in Counter(ids).items() if count > 1]
    if duplicates:
        errors.append(f"Duplicate IDs: {duplicates}")

    by_feature = defaultdict(list)
    for index, case in enumerate(cases, 1):
        missing = sorted(REQUIRED - set(case))
        if missing:
            errors.append(f"Row {index} missing fields: {missing}")
        if case.get("source") not in {"AI", "HUMAN"}:
            errors.append(f"{case.get('id')}: source must be AI or HUMAN")
        if case.get("source") == "AI" and case.get("aiAudit") not in {"VALID", "INVALID", "INCOMPLETE"}:
            errors.append(f"{case.get('id')}: invalid AI audit label")
        by_feature[case.get("fr")].append(case)

    for feature in features:
        rows = by_feature.get(feature, [])
        ai_count = sum(row.get("source") == "AI" for row in rows)
        human_count = sum(row.get("source") == "HUMAN" for row in rows)
        categories = {str(row.get("category", "")).lower() for row in rows}
        if ai_count < args.min_ai:
            errors.append(f"{feature}: AI count {ai_count} < {args.min_ai}")
        if human_count < args.min_human:
            errors.append(f"{feature}: HUMAN count {human_count} < {args.min_human}")
        if not ({"domain", "partition"} & categories):
            errors.append(f"{feature}: missing domain/partition coverage")
        for category in sorted(REQUIRED_CATEGORIES - categories):
            errors.append(f"{feature}: missing {category} coverage")

    result = {
        "valid": not errors,
        "total": len(cases),
        "features": {
            feature: {
                "total": len(by_feature.get(feature, [])),
                "ai": sum(row.get("source") == "AI" for row in by_feature.get(feature, [])),
                "human": sum(row.get("source") == "HUMAN" for row in by_feature.get(feature, [])),
            }
            for feature in features
        },
        "errors": errors,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if not errors else 1


if __name__ == "__main__":
    sys.exit(main())
