import { assertEquals } from "@std/assert";
import { comparable } from "../scripts/compare_shacl_receipts.ts";
import type { ShaclCaseReceipt } from "../scripts/shacl_conformance.ts";

const warning = {
  severity: "Warning" as const,
  focusNode: "https://example.test/spec",
  resultPath: "https://example.test/mode",
  constraintComponent: "MinCountConstraintComponent",
  messageKey: "mode",
};

const violation = {
  severity: "Violation" as const,
  focusNode: "https://example.test/file",
  resultPath: null,
  constraintComponent: "SPARQLConstraintComponent",
  messageKey: "same-file",
};

function receipt(
  caseId: string,
  results: ShaclCaseReceipt["results"],
): ShaclCaseReceipt {
  return {
    caseId,
    rawConforms: false,
    conforms: false,
    maxSeverity: "Violation",
    results,
  };
}

Deno.test("receipt comparison ignores case, result, and object-key ordering", () => {
  const baseline = [
    receipt("case-b", [warning, violation]),
    receipt("case-a", [violation]),
  ];
  const reordered = [
    receipt("case-a", [{
      messageKey: violation.messageKey,
      constraintComponent: violation.constraintComponent,
      resultPath: violation.resultPath,
      focusNode: violation.focusNode,
      severity: violation.severity,
    }]),
    receipt("case-b", [
      violation,
      {
        focusNode: warning.focusNode,
        severity: warning.severity,
        messageKey: warning.messageKey,
        resultPath: warning.resultPath,
        constraintComponent: warning.constraintComponent,
      },
    ]),
  ];

  assertEquals(comparable(baseline), comparable(reordered));
});
