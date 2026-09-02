#!/usr/bin/env python3
import argparse
import csv
import json
from collections import Counter, defaultdict
from pathlib import Path


def load_cases(path):
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    return payload if isinstance(payload, list) else payload.get("cases", [])


def main():
    parser = argparse.ArgumentParser(description="Export EShop test cases")
    parser.add_argument("input")
    parser.add_argument("output_dir")
    parser.add_argument("--student-id", required=True)
    args = parser.parse_args()

    cases = load_cases(args.input)
    output = Path(args.output_dir)
    output.mkdir(parents=True, exist_ok=True)
    fields = [
        "id", "fr", "source", "category", "title", "method", "endpoint",
        "auth", "expectedStatus", "expectedRule", "secRefs", "aiAudit",
        "auditReason", "correction",
    ]

    with (output / "test-cases.csv").open("w", newline="", encoding="utf-8-sig") as stream:
        writer = csv.DictWriter(stream, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        for case in cases:
            row = dict(case)
            row["secRefs"] = ";".join(case.get("secRefs", []))
            writer.writerow(row)

    iteration_data = [
        {
            "id": case["id"],
            "method": case["method"],
            "endpoint": case["endpoint"],
            "body": json.dumps(case.get("body"), ensure_ascii=False),
            "expectedStatus": case["expectedStatus"],
            "studentId": args.student_id,
        }
        for case in cases
    ]
    (output / "postman-data.json").write_text(json.dumps(iteration_data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    grouped = defaultdict(list)
    for case in cases:
        grouped[case["fr"]].append(case)
    lines = ["# Coverage summary", "", f"Student ID: `{args.student_id}`", "", "| FR | Total | AI | Human | Categories |", "|---|---:|---:|---:|---|"]
    for feature, rows in sorted(grouped.items()):
        counts = Counter(row["source"] for row in rows)
        categories = ", ".join(sorted({row["category"] for row in rows}))
        lines.append(f"| {feature} | {len(rows)} | {counts['AI']} | {counts['HUMAN']} | {categories} |")
    (output / "coverage-summary.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"output": str(output), "cases": len(cases)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
