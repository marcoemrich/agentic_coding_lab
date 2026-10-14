import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultTable } from "./ResultTable.js";

/** The table's data rows, however many header rows sit above them. */
function bodyRows(): HTMLElement[] {
  return [...screen.getByRole("table").querySelectorAll<HTMLElement>("tbody tr")];
}

// Story C of the RQ result table: gaps and coverage.
// Aggregated values carry their own n; runs provide the cell denominator and exit reasons.
describe("RQ result table gaps and coverage", () => {
  // Rule 11
  it("marks 4.7 kesseler with 0 runs as a greyed row, '0 runs' and 'Not run' in every value column", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["verification_pct"], cells: [
      { kata: "claim-office", workflow: "external-kesseler-2026-09-30-cc", runs: [] },
    ] }} />);
    const row = bodyRows()[0];
    expect(row.className).toContain("not-run");
    expect(row.style.opacity).toBe("0.5");
    expect(within(row).getByText("0 runs")).toBeTruthy();
    expect(within(row).getAllByText("Not run")).toHaveLength(2);
  });
  // Rule 12
  it("shows italic n/c with a 'not collected — not measured at the time' tooltip for 4.7 superpowers predictions_correct_rate", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["predictions_correct_rate"], cells: [
      { kata: "claim-office", workflow: "superpowers", runs: [{ id: "run-1" }], values: { predictions_correct_rate: null } },
    ] }} />);
    const cell = bodyRows()[0].querySelectorAll("td")[1];
    const missing = within(cell).getByText("n/c");
    expect(missing.tagName).toBe("I");
    expect(missing.getAttribute("title")).toBe("not collected — not measured at the time");
  });
  it("shows italic n/c with the same tooltip for 4.7 pocock predictions_correct_rate independently", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["predictions_correct_rate"], cells: [
      { kata: "claim-office", workflow: "pocock", runs: [{ id: "run-2" }], values: { predictions_correct_rate: null } },
    ] }} />);
    const metricCell = bodyRows()[0].querySelectorAll("td")[1];
    const missing = within(metricCell).getByText("n/c");
    expect(missing.tagName).toBe("I");
    expect(missing.getAttribute("title")).toBe("not collected — not measured at the time");
  });
  // Rule 13
  it("shows 82% ± 5 with n=3/5 beneath when only 3 of 5 runs carry a numeric metric", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["verification_pct"], cells: [
      { kata: "claim-office", runs: [1, 2, 3, 4, 5].map(id => ({ id: String(id) })),
        values: { verification_pct: { kind: "num", n: 3, value: 0.82, sd: 0.05 } } },
    ] }} />);
    const metricCell = bodyRows()[0].querySelectorAll("td")[1];
    expect(metricCell.textContent).toContain("82% ± 5");
    expect(within(metricCell).getByText("n=3/5")).toBeTruthy();
  });
  it("does not show a partial-coverage note when all runs carry the metric", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["verification_pct"], cells: [
      { kata: "claim-office", runs: [1, 2, 3, 4, 5].map(id => ({ id: String(id) })),
        values: { verification_pct: { kind: "num", n: 5, value: 0.82, sd: 0.05 } } },
    ] }} />);
    const metricCell = bodyRows()[0].querySelectorAll("td")[1];
    expect(metricCell.textContent).toContain("82% ± 5");
    expect(within(metricCell).queryByText("n=5/5")).toBeNull();
  });
  // Rule 14
  it("highlights a cell label 'n = 3 of 5' when min_replicates is 5 without hiding its value", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["verification_pct"], min_replicates: 5, cells: [
      { kata: "claim-office", runs: [1, 2, 3].map(id => ({ id: String(id) })),
        values: { verification_pct: { kind: "num", n: 3, value: 0.82, sd: 0.05 } } },
    ] }} />);
    const row = bodyRows()[0];
    const label = row.querySelectorAll("td")[0];
    expect(label.className).toContain("under-replicated");
    expect(label.style.backgroundColor).toBe("");
    expect(within(label).getByText("n = 3 of 5")).toBeTruthy();
    expect(row.textContent).toContain("82% ± 5");
  });
  it("does not highlight a cell label with n = 5 when min_replicates is 5", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: [], min_replicates: 5, cells: [
      { kata: "claim-office", runs: [1, 2, 3, 4, 5].map(id => ({ id: String(id) })) },
    ] }} />);
    const label = bodyRows()[0].querySelector("td")!;
    expect(within(label).getByText("n = 5")).toBeTruthy();
    expect(label.className).not.toContain("under-replicated");
  });
  // Rule 15
  it("counts one timeout among five runs and labels the row 'n = 5 (1 timeout)' while retaining its value", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["verification_pct"], cells: [
      { kata: "claim-office", runs: [
        { id: "1", exit_reason: "timeout" }, { id: "2", exit_reason: "ok" },
        { id: "3", exit_reason: "ok" }, { id: "4", exit_reason: "ok" }, { id: "5", exit_reason: "ok" },
      ], values: { verification_pct: { kind: "num", n: 5, value: 0.82, sd: 0.05 } } },
    ] }} />);
    const row = bodyRows()[0];
    expect(within(row.querySelector("td")!).getByText("n = 5 (1 timeout)")).toBeTruthy();
    expect(row.textContent).toContain("82% ± 5");
  });
  it("counts a timeout and a rate-limited run and labels the row 'n = 5 (1 timeout, 1 rate-limited)'", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: [], cells: [
      { kata: "claim-office", runs: [
        { id: "1", exit_reason: "rate-limited" }, { id: "2", exit_reason: "timeout" },
        { id: "3", exit_reason: "ok" }, { id: "4", exit_reason: "ok" }, { id: "5", exit_reason: "ok" },
      ] },
    ] }} />);
    const label = bodyRows()[0].querySelector("td")!;
    expect(within(label).getByText("n = 5 (1 timeout, 1 rate-limited)")).toBeTruthy();
  });
  it("names transient-api-error, quota-exhausted and pi-retries-exhausted with their counts without excluding those runs", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["verification_pct"], cells: [
      { kata: "claim-office", runs: [
        { id: "1", exit_reason: "transient-api-error" }, { id: "2", exit_reason: "transient-api-error" },
        { id: "3", exit_reason: "quota-exhausted" }, { id: "4", exit_reason: "pi-retries-exhausted" },
        { id: "5", exit_reason: "ok" },
      ], values: { verification_pct: { kind: "num", n: 5, value: 0.82, sd: 0.05 } } },
    ] }} />);
    const row = bodyRows()[0];
    expect(within(row.querySelector("td")!).getByText("n = 5 (2 transient-api-error, 1 quota-exhausted, 1 pi-retries-exhausted)")).toBeTruthy();
    expect(row.textContent).toContain("82% ± 5");
  });
});
