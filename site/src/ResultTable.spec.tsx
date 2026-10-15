import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultTable } from "./ResultTable.js";

/** The table's data rows, however many header rows sit above them. */
function bodyRows(): HTMLElement[] {
  return [...screen.getByRole("table").querySelectorAll<HTMLElement>("tbody tr")];
}

// Story A of the RQ result table: the parts only a rendered table shows.
describe("Rendered result table", () => {
  // Rule 22: clicking a header sorts
  it("sorts by a column when its header is clicked -- 4.13, click verification_pct -> 100 % rows first", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, workflow: "96 %", runs: [{ id: "a" }], values: { verification_pct: { value: 0.96 } } },
      { kata, workflow: "100 %", runs: [{ id: "b" }], values: { verification_pct: { value: 1 } } },
    ] }} />);
    const dataRows = () => bodyRows();
    expect(dataRows().map(row => row.querySelector("td a")?.textContent)).toEqual(["96 %", "100 %"]);
    fireEvent.click(screen.getByRole("button", { name: "verification_pct" }));
    expect(dataRows().map(row => row.querySelector("td a")?.textContent)).toEqual(["100 %", "96 %"]);
  });
  it("reverses the order when the same header is clicked again -- 4.13, click verification_pct twice -> 96 % rows first", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, workflow: "96 %", runs: [{ id: "a" }], values: { verification_pct: { value: 0.96 } } },
      { kata, workflow: "100 %", runs: [{ id: "b" }], values: { verification_pct: { value: 1 } } },
    ] }} />);
    const header = screen.getByRole("button", { name: "verification_pct" });
    const rows = () => bodyRows().map(row => row.querySelector("td a")?.textContent);
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
      .toBe("/workflows/#exact-ptdd-v1-cc");
  });

  // Rule 23: runs section; label from story 06 R8
  it("starts the runs section collapsed behind 'Runs behind this table' -- 4.13 -> run ids hidden until opened", () => {
    const kata = "claim-office-example-mapping";
    const id = "2026-10-01_02-02-28_claim-office-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking";
    const ids = [id, "run-2", "run-3", "run-4", "run-5"];
    render(<ResultTable input={{ katas: [kata], outcomes: [], cells: [
      { kata, workflow: "exact-ptdd-v1-cc", runs: ids.map(id => ({ id })) },
    ] }} />);
    const summary = screen.getByText("Runs behind this table");
    const details = summary.closest("details");
    expect(details?.open).toBe(false);
    fireEvent.click(summary);
    expect(details?.open).toBe(true);
    expect(within(details!).getAllByRole("link")).toHaveLength(5);
    expect(within(details!).getByRole("link", { name: id }).getAttribute("href"))
      .toBe(`https://github.com/marcoemrich/agentic_coding_lab/tree/main/experiments/runs/${id}`);
  });
});

// Story 06, R8 — run lists under each kata table (docs/stories/done/2026-10-11_06_rq-page-header.md).
describe("Run list under a kata table", () => {
  it("lists every run, ok or not, and shows a non-ok run's exit reason -- '<run_id> (timeout)'; an ok run shows its id only", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: [], cells: [{ kata, workflow: "exact-ptdd-v1-cc", runs: [
      { id: "run-ok", started_at: "2026-08-10T15:25:37+00:00", exit_reason: "ok" },
      { id: "run-timeout", started_at: "2026-08-10T16:00:00+00:00", exit_reason: "timeout" },
    ] }] }} />);
    const details = screen.getByText("Runs behind this table").closest("details")!;
    expect(within(details).getAllByRole("listitem").map(item => item.textContent)).toEqual(["run-ok", "run-timeout (timeout)"]);
  });
  it("orders the runs of all rows by started_at, ties by run id -- three runs started at 2026-08-10T15:25:37 -> …opus-5-no-thinking, …-2, …-3", () => {
    const kata = "claim-office-example-mapping";
    const base = "2026-08-10_15-25-37_claim-office-example-mapping_v3-basic-tdd_opus-5-no-thinking";
    const run = (id: string, started_at: string) => ({ id, started_at, exit_reason: "ok" });
    render(<ResultTable input={{ katas: [kata], outcomes: [], cells: [
      { kata, workflow: "baseline-inline-tdd-v1-cc", runs: [run(`${base}-3`, "2026-08-10T15:25:37+00:00"), run("late", "2026-08-11T13:03:30+00:00")] },
      { kata, workflow: "exact-hybrid-v2-testlist-fix-cc", runs: [run(base, "2026-08-10T15:25:37+00:00"), run(`${base}-2`, "2026-08-10T15:25:37+00:00"), run("early", "2026-08-09T10:00:00+00:00")] },
    ] }} />);
    const details = screen.getByText("Runs behind this table").closest("details")!;
    expect(within(details).getAllByRole("listitem").map(item => item.textContent))
      .toEqual(["early", base, `${base}-2`, `${base}-3`, "late"]);
  });
  it("gives each kata table its own list -- RQ-stability -> one list under game-of-life-prose, one under game-of-life-example-mapping", () => {
    const run = (id: string) => ({ id, started_at: "2026-05-15T08:00:00+00:00", exit_reason: "ok" });
    render(<ResultTable input={{ katas: ["game-of-life-prose", "game-of-life-example-mapping"], outcomes: [], cells: [
      { kata: "game-of-life-prose", workflow: "baseline-oneshot-v1-cc", runs: [run("prose-run")] },
      { kata: "game-of-life-example-mapping", workflow: "exact-hybrid-v1-cc", runs: [run("example-mapping-run")] },
    ] }} />);
    const lists = screen.getAllByText("Runs behind this table").map(summary => summary.closest("section")!);
    expect(lists.map(section => [section.querySelector("h2")?.textContent,
      within(section.querySelector("details")!).getAllByRole("listitem").map(item => item.textContent)]))
      .toEqual([["game-of-life-prose", ["prose-run"]], ["game-of-life-example-mapping", ["example-mapping-run"]]]);
  });
});

// Result table look: the approved prototype's styles, carried by classes instead of fixed inline colours.
describe("Result table look", () => {
  it("puts a header cell above the row labels, so each metric header sits above its values -- 2 metrics -> 3 header cells, 3 cells per row", () => {
    const kata = "game-of-life-prose";
    render(<ResultTable input={{ katas: [kata], outcomes: ["code_mass", "cost_usd"], cells: [
      { kata, workflow: "exact-ptdd-v1-cc", runs: [{ id: "a" }], values: { code_mass: { value: 155 }, cost_usd: { value: 5 } } },
      { kata, workflow: "baseline-oneshot-v1-cc", runs: [{ id: "b" }], values: { code_mass: { value: 160 }, cost_usd: { value: 4 } } },
    ] }} />);
    const headerRows = [...screen.getByRole("table").querySelectorAll<HTMLElement>("thead tr")];
    const labelHeader = headerRows[0].querySelector<HTMLTableCellElement>("th")!;
    const metricHeaders = [...headerRows.at(-1)!.querySelectorAll("th")].filter(cell => cell !== labelHeader);
    expect(labelHeader.rowSpan).toBe(headerRows.length);
    expect([labelHeader, ...metricHeaders].map(cell => cell.textContent?.split(" ")[0]))
      .toEqual(["workflow", "code_mass", "cost_usd"]);
    expect(bodyRows()[0].children).toHaveLength(3);
  });
});

// Result table labels: row data buildResultTables already provides, rendered the prototype's way.
describe("Result table labels", () => {
  it("labels each row with every varying factor -- model and workflow vary -> 'model: opus-4-8' beside the workflow link", () => {
    const kata = "game-of-life-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: [], cells: [
      { kata, model: "opus-4-8", workflow: "exact-ptdd-v1-cc", runs: [{ id: "a" }] },
      { kata, model: "fable-5", workflow: "baseline-oneshot-v1-cc", runs: [{ id: "b" }] },
    ] }} />);
    const label = screen.getByRole("table").querySelector<HTMLElement>("tbody tr td")!;
    expect(within(label).getByText("model: opus-4-8")).toBeTruthy();
    expect(within(label).getByRole("link").textContent).toBe("exact-ptdd-v1-cc");
  });
  it("shows the run dates after the run count -- 2026-09-30 and 10-01 runs -> 'n = 2, 2026-09-30 → 10-01'", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: [], cells: [
      { kata, workflow: "external-kesseler-2026-09-30-cc", runs: [
        { id: "a", started_at: "2026-09-30T21:00:00+00:00" }, { id: "b", started_at: "2026-10-01T08:00:00+00:00" }] },
    ] }} />);
    const label = screen.getByRole("table").querySelector<HTMLElement>("tbody tr td")!;
    expect(within(label).getByText("n = 2, 2026-09-30 → 10-01")).toBeTruthy();
  });
  it("tags a workflow as 'test list' or 'ad hoc' beside its link", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: [],
      workflowStyles: { "exact-ptdd-v1-cc": "test list", "external-pocock-2026-09-04-cc": "ad hoc" }, cells: [
        { kata, workflow: "exact-ptdd-v1-cc", runs: [{ id: "a" }] },
        { kata, workflow: "external-pocock-2026-09-04-cc", runs: [{ id: "b" }] },
      ] }} />);
    const labels = [...screen.getByRole("table").querySelectorAll<HTMLElement>("tbody tr td:first-child")];
    expect(labels.map(label => within(label).getByText(/^(test list|ad hoc)$/).textContent)).toEqual(["test list", "ad hoc"]);
  });
  it("dims the standard deviation while the value still reads '82% ± 5'", () => {
    const kata = "claim-office";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, runs: [1, 2, 3].map(id => ({ id: String(id) })), values: { verification_pct: { kind: "num", n: 3, value: 0.82, sd: 0.05 } } },
    ] }} />);
    const cell = screen.getByRole("table").querySelectorAll("tbody tr td")[1];
    expect(cell.textContent).toBe("82% ± 5");
    expect(cell.querySelector(".sd")?.textContent).toBe(" ± 5");
  });
  it("spans metric group headers over their columns -- code_mass, smell_total, cost_usd -> Code quality 2, Cost 1", () => {
    const kata = "game-of-life-prose";
    render(<ResultTable input={{ katas: [kata], outcomes: ["code_mass", "smell_total", "cost_usd"], cells: [] }} />);
    const header = screen.getByRole("table").querySelector("thead")!;
    expect([within(header).getByText("Code quality"), within(header).getByText("Cost")]
      .map(cell => (cell as HTMLTableCellElement).colSpan)).toEqual([2, 1]);
  });
});

// Metric tooltips: the header keeps the metric id and explains it in one sentence from the registry.
describe("Metric tooltips", () => {
  it("explains a metric in its header tooltip -- verification_pct -> 'Share of the hidden acceptance scenarios that the finished program passes.'", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["verification_pct"], cells: [] }} />);
    expect(screen.getByRole("button", { name: "verification_pct" }).closest("th")!.getAttribute("title"))
      .toBe("Share of the hidden acceptance scenarios that the finished program passes.");
  });
  it("keeps the test-list warning after the explanation -- tdd_discipline -> explanation, then '⚠ not comparable across the test-list boundary …'", () => {
    render(<ResultTable input={{ katas: ["claim-office"], outcomes: ["tdd_discipline"], cells: [] }} />);
    expect(screen.getByRole("button", { name: "tdd_discipline" }).closest("th")!.getAttribute("title")).toBe(
      "TDD discipline score: verified test-first starts, one failing test at a time and closed cycles, combined so that any one at zero makes it zero.\n"
      + "⚠ not comparable across the test-list boundary: a skipped test is compliance in a test-list workflow and a violation in an ad-hoc workflow");
  });
});

// Sort reset and marking: the RQ's own order can always be restored, and a sorted column says so.
describe("Sort reset and marking", () => {
  function renderTwoWorkflows() {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, workflow: "96 %", runs: [{ id: "a" }], values: { verification_pct: { value: 0.96 }, cost_usd: { value: 2 } } },
      { kata, workflow: "100 %", runs: [{ id: "b" }], values: { verification_pct: { value: 1 }, cost_usd: { value: 1 } } },
    ] }} />);
  }
  const order = () => bodyRows().map(row => row.querySelector("td a")?.textContent);
  const header = (metric: string) => screen.getByRole("button", { name: metric }).closest("th")!;

  it("restores the RQ's order when the label header is clicked -- sort by verification_pct, click 'workflow' -> 96 %, 100 % again", () => {
    renderTwoWorkflows();
    fireEvent.click(screen.getByRole("button", { name: "verification_pct" }));
    expect(order()).toEqual(["100 %", "96 %"]);
    fireEvent.click(screen.getByRole("button", { name: "workflow" }));
    expect(order()).toEqual(["96 %", "100 %"]);
  });
  it("marks the sorted header -- verification_pct clicked once -> aria-sort 'descending' on it, none on cost_usd", () => {
    renderTwoWorkflows();
    fireEvent.click(screen.getByRole("button", { name: "verification_pct" }));
    expect([header("verification_pct").getAttribute("aria-sort"), header("cost_usd").getAttribute("aria-sort")])
      .toEqual(["descending", null]);
  });
  it("marks a lower-is-better column 'ascending' when sorted best first and flips it on the second click -- cost_usd -> ascending, then descending", () => {
    renderTwoWorkflows();
    const sortByCost = () => fireEvent.click(screen.getByRole("button", { name: "cost_usd" }));
    sortByCost();
    expect(header("cost_usd").getAttribute("aria-sort")).toBe("ascending");
    sortByCost();
    expect(header("cost_usd").getAttribute("aria-sort")).toBe("descending");
  });
  it("drops the mark when the RQ's order is restored", () => {
    renderTwoWorkflows();
    fireEvent.click(screen.getByRole("button", { name: "verification_pct" }));
    fireEvent.click(screen.getByRole("button", { name: "workflow" }));
    expect(header("verification_pct").getAttribute("aria-sort")).toBeNull();
  });
});
