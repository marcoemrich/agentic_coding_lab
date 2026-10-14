import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ResultTable } from "./ResultTable.js";

// Story A of the RQ result table: the parts only a rendered table shows.
describe("Rendered result table", () => {
  // Rule 22: clicking a header sorts
  it("sorts by a column when its header is clicked -- 4.13, click verification_pct -> 100 % rows first", () => {
    const kata = "claim-office-example-mapping";
    render(<ResultTable input={{ katas: [kata], outcomes: ["verification_pct"], cells: [
      { kata, workflow: "96 %", runs: [{ id: "a" }], values: { verification_pct: { value: 0.96 } } },
      { kata, workflow: "100 %", runs: [{ id: "b" }], values: { verification_pct: { value: 1 } } },
    ] }} />);
    const dataRows = () => within(screen.getByRole("table")).getAllByRole("row").slice(1);
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
    const rows = () => within(screen.getByRole("table")).getAllByRole("row").slice(1).map(row => row.querySelector("td a")?.textContent);
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

// Story 06, R8 — run lists under each kata table (docs/stories/open/2026-10-11_06_rq-page-header.md).
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
