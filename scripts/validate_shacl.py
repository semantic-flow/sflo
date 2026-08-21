import argparse
import json
import subprocess
from pathlib import Path
from typing import Any

import pyshacl
from pyshacl import validate
from rdflib import Graph, Namespace, URIRef


ROOT = Path(__file__).resolve().parents[1]
SHAPES_PATH = ROOT / "semantic-flow-core-shacl.ttl"
ONTOLOGY_PATH = ROOT / "semantic-flow-core-ontology.ttl"
CASES_ROOT = ROOT / "tests" / "shacl" / "content-digest"
MANIFEST_PATH = CASES_ROOT / "cases.json"
SH = Namespace("http://www.w3.org/ns/shacl#")
SEVERITY_RANK = {"Info": 1, "Warning": 2, "Violation": 3}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path)
    return parser.parse_args()


def local_name(value: URIRef) -> str:
    iri = str(value)
    return iri.rsplit("#", 1)[-1].rsplit("/", 1)[-1]


def load_manifest() -> dict[str, Any]:
    manifest = json.loads(MANIFEST_PATH.read_text())
    if manifest["schema"] != "sflo.shacl-content-digest-cases.v1":
        raise RuntimeError(f"Unsupported case schema: {manifest['schema']}")
    return manifest


def message_key(manifest: dict[str, Any], messages: list[str]) -> str:
    matches = [
        entry["key"]
        for entry in manifest["messageKeys"]
        if any(entry["contains"] in message for message in messages)
    ]
    if len(matches) != 1:
        raise RuntimeError(
            f"Expected one message-key match, found {len(matches)}: {messages!r}"
        )
    return matches[0]


def normalized_results(
    report: Graph,
    manifest: dict[str, Any],
) -> list[dict[str, Any]]:
    results: dict[str, dict[str, Any]] = {}
    for report_node in report.subjects(SH.result, None):
        for result in report.objects(report_node, SH.result):
            focus = report.value(result, SH.focusNode)
            if focus is None or not str(focus).startswith(manifest["focusNamespace"]):
                continue
            severity = report.value(result, SH.resultSeverity)
            component = report.value(result, SH.sourceConstraintComponent)
            if not isinstance(severity, URIRef) or not isinstance(component, URIRef):
                raise RuntimeError(f"Incomplete SHACL result: {result}")
            path = report.value(result, SH.resultPath)
            messages = [str(value) for value in report.objects(result, SH.resultMessage)]
            normalized = {
                "severity": local_name(severity),
                "focusNode": str(focus),
                "resultPath": str(path) if isinstance(path, URIRef) else None,
                "constraintComponent": local_name(component),
                "messageKey": message_key(manifest, messages),
            }
            results[json.dumps(normalized, sort_keys=True)] = normalized
    return sorted(results.values(), key=lambda value: json.dumps(value, sort_keys=True))


def max_severity(results: list[dict[str, Any]]) -> str | None:
    if not results:
        return None
    return max(
        (result["severity"] for result in results),
        key=lambda severity: SEVERITY_RANK[severity],
    )


def assert_expected(receipt: dict[str, Any], fixture: dict[str, Any]) -> None:
    expected_results = sorted(
        fixture["expectedResults"],
        key=lambda value: json.dumps(value, sort_keys=True),
    )
    if receipt["rawConforms"] != fixture["expectedConforms"]:
        raise RuntimeError(
            f"{fixture['id']}: expected raw conforms={fixture['expectedConforms']}, "
            f"got {receipt['rawConforms']}"
        )
    if receipt["conforms"] != fixture["expectedConforms"]:
        raise RuntimeError(
            f"{fixture['id']}: expected normalized conforms="
            f"{fixture['expectedConforms']}, got {receipt['conforms']}"
        )
    if receipt["maxSeverity"] != fixture["expectedMaxSeverity"]:
        raise RuntimeError(
            f"{fixture['id']}: expected max severity "
            f"{fixture['expectedMaxSeverity']}, got {receipt['maxSeverity']}"
        )
    if receipt["results"] != expected_results:
        raise RuntimeError(
            f"{fixture['id']}: normalized results differ\n"
            f"expected={json.dumps(expected_results, indent=2)}\n"
            f"actual={json.dumps(receipt['results'], indent=2)}"
        )


def git_commit() -> str:
    return subprocess.run(
        ["git", "rev-parse", "HEAD"],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    ).stdout.strip()


def main() -> None:
    args = parse_args()
    manifest = load_manifest()
    shapes = Graph().parse(SHAPES_PATH, format="turtle")
    ontology = Graph().parse(ONTOLOGY_PATH, format="turtle")
    receipts: list[dict[str, Any]] = []

    for fixture in manifest["cases"]:
        data = Graph()
        data += ontology
        data.parse(CASES_ROOT / fixture["dataFile"], format="turtle")
        conforms, report, _ = validate(
            data_graph=data,
            shacl_graph=shapes,
            inference="none",
            advanced=True,
            allow_infos=False,
            allow_warnings=False,
            do_owl_imports=False,
        )
        results = normalized_results(report, manifest)
        receipt = {
            "caseId": fixture["id"],
            "rawConforms": bool(conforms),
            "conforms": len(results) == 0,
            "maxSeverity": max_severity(results),
            "results": results,
        }
        assert_expected(receipt, fixture)
        receipts.append(receipt)

    bundle = {
        "schema": "sflo.shacl-conformance-receipts.v1",
        "engine": {
            "name": "PySHACL",
            "version": pyshacl.__version__,
            "adapter": "SFLO rdflib graph union with PySHACL advanced features",
        },
        "sfloCommit": git_commit(),
        "command": "deno task test:shacl",
        "graphProfile": {
            "data": "ontology-union-case",
            "shapes": "semantic-flow-core-shacl.ttl",
            "inference": "none",
            "warnings": "reported",
            "network": "disabled",
        },
        "cases": receipts,
    }
    if args.output is not None:
        args.output.write_text(json.dumps(bundle, indent=2) + "\n")
        print(f"Wrote {len(receipts)} PySHACL receipts to {args.output}.")
    else:
        print(
            f"Executed {len(receipts)} SHACL fixtures with "
            f"PySHACL {pyshacl.__version__}."
        )


if __name__ == "__main__":
    main()
