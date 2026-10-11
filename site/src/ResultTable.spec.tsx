import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultTable } from "./ResultTable.js";

// Story A of the RQ result table, the parts only a rendered table shows:
// site/docs/rq-result-table-a-table-layout-example-mapping.md
describe("Rendered result table", () => {
  // Rule 22: clicking a header sorts
  it("sorts by a column when its header is clicked -- 4.13, click verification_pct -> 100 % rows first", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, workflow: "96 %", runs: [{ id: "a" }], values: { verification_pct: { value: 0.96 } } },
      { kata, workflow: "100 %", runs: [{ id: "b" }], values: { verification_pct: { value: 1 } } },
    ] }} />);
    const dataRows = () => within(screen.getByRole("table")).getAllByRole("row").slice(1);
    expect(dataRows().map(row => row.textContent)).toEqual(["96 %", "100 %"]);
    fireEvent.click(screen.getByRole("button", { name: "verification_pct" }));
    expect(dataRows().map(row => row.textContent)).toEqual(["100 %", "96 %"]);
  });
  it("reverses the order when the same header is clicked again -- 4.13, click verification_pct twice -> 96 % rows first", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, workflow: "96 %", runs: [{ id: "a" }], values: { verification_pct: { value: 0.96 } } },
      { kata, workflow: "100 %", runs: [{ id: "b" }], values: { verification_pct: { value: 1 } } },
    ] }} />);
    const header = screen.getByRole("button", { name: "verification_pct" });
    const rows = () => within(screen.getByRole("table")).getAllByRole("row").slice(1).map(row => row.textContent);
    fireEvent.click(header);
    expect(rows()).toEqual(["100 %", "96 %"]);
    fireEvent.click(header);
    expect(rows()).toEqual(["96 %", "100 %"]);
  });

  // Rule 21: workflow link
  it("links a workflow label to its entry on the workflow page -- exact-ptdd-v1-cc -> link to the workflow page anchored at exact-ptdd-v1-cc", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: [], cells: [
      { kata, workflow: "exact-ptdd-v1-cc" },
      { kata, workflow: "external-pocock-2026-09-04-cc" },
    ] }} />);
    expect(screen.getByRole("link", { name: "exact-ptdd-v1-cc" }).getAttribute("href"))
      .toBe("/workflows#exact-ptdd-v1-cc");
  });

  // Rule 23: runs section
  it("starts the runs section collapsed -- 4.13 -> run ids hidden until opened", () => {
    const kata = "claim-office-example-mapping";
    const id = "2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking";
    const ids = [id, "run-2", "run-3", "run-4", "run-5"];
    render(<ResultTable input={{ katas: [kata], outcomes: [], cells: [
      { kata, workflow: "exact-ptdd-v1-cc", runs: ids.map(id => ({ id })) },
    ] }} />);
    const summary = screen.getByText("Runs");
    const details = summary.closest("details");
    expect(details?.open).toBe(false);
    fireEvent.click(summary);
    expect(details?.open).toBe(true);
    expect(within(details!).getAllByRole("link")).toHaveLength(5);
    expect(within(details!).getByRole("link", { name: id }).getAttribute("href"))
      .toBe(`https://github.com/marcoemrich/agentic_coding_lab/tree/main/experiments/runs/${id}`);
  });
});
