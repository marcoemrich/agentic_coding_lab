import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultTable } from "./ResultTable.js";
import { buildResultTables } from "./result-table.js";
import { trophyWinners } from "./trophy.js";

function winners(metric: string, entries: { value: number; sd?: number }[]) {
  const kata = "claim-office";
  const rows = buildResultTables({ katas: [kata], outcomes: [metric], cells: entries.map((value, index) => ({
    kata, runs: [{ id: `run-${index}` }, { id: `repeat-${index}` }], values: { [metric]: value },
  })) })[0].rows;
  return rows.map(row => trophyWinners(rows, metric).has(row));
}

// Story D of the RQ result table: trophies and comparability.
describe("Trophies and comparability", () => {
  it("sorts a ↓ cost column with the lower mean first, consistent with its header", () => {
    const kata = "claim-office";
    const rows = buildResultTables({ katas: [kata], outcomes: ["cost_usd"], sort: { metric: "cost_usd", clicks: 1 }, cells: [
      { kata, workflow: "expensive", values: { cost_usd: { value: 10 } } },
      { kata, workflow: "cheap", values: { cost_usd: { value: 1 } } },
    ] })[0].rows;
    expect(rows.map(row => row.labels.workflow)).toEqual(["cheap", "expensive"]);
  });

  it("shows the direction legend and ↑ on verification_pct, ↓ on cognitive_max, ○ on refactor_events", () => {
    render(<ResultTable input={{ katas: ["game-of-life"], cells: [],
      outcomes: ["verification_pct", "cognitive_max", "refactor_events"] }} />);
    expect(screen.getByText(/↑ higher is better/)).toBeTruthy();
    expect(screen.getByText(/↓ lower is better/)).toBeTruthy();
    expect(screen.getByText(/○ informative/)).toBeTruthy();
    for (const [metric, direction] of [["verification_pct", "↑"], ["cognitive_max", "↓"], ["refactor_events", "○"]]) {
      expect(screen.getByRole("columnheader", { name: new RegExp(metric) }).textContent).toContain(direction);
    }
  });
  it("awards both cells a highlighted 🏆 when best 100% ± 0 and other 96% ± 5 are within max(sd) = 5", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, workflow: "best", runs: [{ id: "a" }, { id: "b" }], values: { verification_pct: { value: 1, sd: 0 } } },
      { kata, workflow: "near", runs: [{ id: "c" }, { id: "d" }], values: { verification_pct: { value: 0.96, sd: 0.05 } } },
    ] }} />);
    const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
    for (const row of rows) {
      const cell = within(row).getAllByRole("cell")[1];
      expect(cell.textContent).toContain("🏆");
      expect(cell.style.backgroundColor).not.toBe("");
    }
  });
  it("awards only the best highlighted 🏆 when best 100% ± 0 and other 90% ± 5 differ by 10", () => {
    expect(winners("verification_pct", [{ value: 1, sd: 0 }, { value: 0.90, sd: 0.05 }])).toEqual([true, false]);
  });
  it("treats missing sd as 0 when comparing a cell to the best mean", () => {
    expect(winners("verification_pct", [{ value: 1 }, { value: 0.96, sd: 0.05 }, { value: 0.94 }])).toEqual([true, true, false]);
  });
  it("awards no trophy when every cell has the same tests_passing value of 100%", () => {
    expect(winners("tests_passing", [{ value: 1 }, { value: 1 }, { value: 1 }])).toEqual([false, false, false]);
  });
  it("awards no trophy to informative refactor_events", () => {
    expect(winners("refactor_events", [{ value: 2 }, { value: 9 }])).toEqual([false, false]);
  });
  it("gates the lowest cognitive_max at 85% correctness, explains why, and awards the best eligible cell at ≥ 90%", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct", "cognitive_max"], cells: [
      { kata, workflow: "incorrect", runs: [{ id: "a" }], values: { verification_pct: { value: 0.85 }, cognitive_max: { value: 1 } } },
      { kata, workflow: "correct", runs: [{ id: "b" }], values: { verification_pct: { value: 0.90 }, cognitive_max: { value: 5 } } },
    ] }} />);
    const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
    const gated = within(rows[0]).getAllByRole("cell")[2];
    expect(gated.textContent).toContain("1.00");
    expect(gated.textContent).not.toContain("🏆");
    expect(gated.getAttribute("title")).toBe("below 90 % external correctness");
    expect(within(rows[1]).getAllByRole("cell")[2].textContent).toContain("🏆");
  });
  it("does not gate code-quality winners for a game-of-life RQ without verification_pct", () => {
    const kata = "game-of-life";
    render(<ResultTable input={{ katas: [kata], outcomes: ["cognitive_max"], cells: [
      { kata, workflow: "low", runs: [{ id: "a" }], values: { cognitive_max: { value: 2 } } },
      { kata, workflow: "high", runs: [{ id: "b" }], values: { cognitive_max: { value: 9 } } },
    ] }} />);
    const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
    expect(within(rows[0]).getAllByRole("cell")[1].textContent).toContain("🏆");
    expect(within(rows[0]).getAllByRole("cell")[1].getAttribute("title")).toBeNull();
  });
  it("excludes a cost cell without a measured external correctness value when verification_pct is declared", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct", "cost_usd"], cells: [
      { kata, runs: [{ id: "a" }], values: { verification_pct: null, cost_usd: { value: 1 } } },
      { kata, runs: [{ id: "b" }], values: { verification_pct: { value: 0.95 }, cost_usd: { value: 10 } } },
    ] }} />);
    const cells = within(screen.getByRole("table")).getAllByRole("row").slice(1).map(row => within(row).getAllByRole("cell")[2]);
    expect(cells[0].textContent).not.toContain("🏆");
    expect(cells[0].getAttribute("title")).toBe("external correctness not collected");
    expect(cells[1].textContent).toContain("🏆");
  });

  it("gates cost winners below 90% external correctness as well as code-quality winners", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct", "cost_usd"], cells: [
      { kata, runs: [{ id: "a" }], values: { verification_pct: { value: 0.85 }, cost_usd: { value: 1 } } },
      { kata, runs: [{ id: "b" }], values: { verification_pct: { value: 0.95 }, cost_usd: { value: 10 } } },
    ] }} />);
    const cells = within(screen.getByRole("table")).getAllByRole("row").slice(1).map(row => within(row).getAllByRole("cell")[2]);
    expect(cells[0].textContent).not.toContain("🏆");
    expect(cells[0].getAttribute("title")).toBe("below 90 % external correctness");
    expect(cells[1].textContent).toContain("🏆");
  });
  it("shows ⚠ and its explanation on every registry-flagged test-list-boundary metric", () => {
    const flagged = ["tdd_discipline", "tdd_discipline_test_first", "tdd_discipline_closure", "test_first_rate", "skip_events", "cycles_total", "chain_deviations"];
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: flagged, cells: [] }} />);
    for (const metric of flagged) {
      const header = screen.getByRole("button", { name: metric }).closest("th")!;
      expect(header.textContent).toContain("⚠");
      expect(header.getAttribute("title")).toMatch(/not comparable across the test-list boundary/i);
    }
  });
  it("shows a banner for mixed test-list and ad-hoc workflows and awards no trophy to tdd_discipline", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["tdd_discipline"],
      workflowStyles: { list: "test list", adhoc: "ad hoc" }, cells: [
        { kata, workflow: "list", runs: [{ id: "a" }], values: { tdd_discipline: { value: 0.9 } } },
        { kata, workflow: "adhoc", runs: [{ id: "b" }], values: { tdd_discipline: { value: 0.5 } } },
      ] }} />);
    expect(screen.getByText(/spans the test-list boundary/i)).toBeTruthy();
    const rows = within(screen.getByRole("table")).getAllByRole("row").slice(1);
    for (const row of rows) expect(within(row).getAllByRole("cell")[1].textContent).not.toContain("🏆");
  });
  it("does not show a mixed-style banner when workflows share a style", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["tdd_discipline"],
      workflowStyles: { first: "test list", second: "test list" }, cells: [
        { kata, workflow: "first", runs: [{ id: "a" }], values: { tdd_discipline: { value: 0.9 } } },
        { kata, workflow: "second", runs: [{ id: "b" }], values: { tdd_discipline: { value: 0.5 } } },
      ] }} />);
    expect(screen.queryByText(/spans the test-list boundary/i)).toBeNull();
    expect(within(screen.getAllByRole("row")[1]).getAllByRole("cell")[1].textContent).toContain("🏆");
  });
  it("leaves predictions_correct_rate unflagged and awards its winner even across the boundary -- list 0.9, adhoc 0.5 -> list 🏆, no ⚠", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["predictions_correct_rate"],
      workflowStyles: { list: "test list", adhoc: "ad hoc" }, cells: [
        { kata, workflow: "list", runs: [{ id: "a" }], values: { predictions_correct_rate: { value: 0.9 } } },
        { kata, workflow: "adhoc", runs: [{ id: "b" }], values: { predictions_correct_rate: { value: 0.5 } } },
      ] }} />);
    const header = screen.getByRole("button", { name: "predictions_correct_rate" }).closest("th")!;
    expect(header.textContent).not.toContain("⚠");
    expect(header.getAttribute("title")).toBeNull();
    expect(within(screen.getAllByRole("row")[1]).getAllByRole("cell")[1].textContent).toContain("🏆");
  });
  it("awards no trophy to an informative TDD component -- red_batch_max 1 vs 3 -> no 🏆", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["red_batch_max"], cells: [
      { kata, workflow: "one", runs: [{ id: "a" }], values: { red_batch_max: { value: 1 } } },
      { kata, workflow: "many", runs: [{ id: "b" }], values: { red_batch_max: { value: 3 } } },
    ] }} />);
    expect(screen.queryByText(/🏆/)).toBeNull();
  });
});
