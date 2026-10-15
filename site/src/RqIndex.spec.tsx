import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RqIndex } from "./RqIndex.js";
import type { IndexRq } from "./rq-index.js";
import { rqsWithPages } from "./rq-pages.js";

type Run = { id: string; started_at: string; exit_reason: string };

function runs(count: number, startedAt: string, exitReason = "ok"): Run[] {
  return Array.from({ length: count }, (_, index) => ({ id: `run-${startedAt}-${index}`, started_at: startedAt, exit_reason: exitReason }));
}

function rq(overrides: Partial<IndexRq> = {}): IndexRq {
  return { id: "RQ-stability", path: "research/questions-claude/5.1-workflow-stability",
    question: "How stable are code quality and TDD discipline per workflow across replicates?",
    min_replicates: 10, cells: [{ runs: runs(10, "2026-05-15T08:00:00+00:00") }], ...overrides };
}

function headings(): string[] {
  return screen.getAllByRole("heading", { level: 2 }).map(heading => heading.textContent ?? "");
}

function chapters(labels: string[]): IndexRq[] {
  return labels.map(label => rq({ id: `RQ-${label}`, path: `research/questions-claude/${label}-sample` }));
}

function ids(): string[] {
  return screen.getAllByText(/^RQ-/).map(id => id.textContent ?? "");
}

// Story 07, RQ index (docs/stories/open/2026-10-11_07_rq-index.md).
describe("RQ index", () => {
  it("titles the index 'What the lab measured, one research question at a time' and introduces it without a findings sentence", () => {
    render(<RqIndex rqs={[rq()]} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("What the lab measured, one research question at a time");
    expect(screen.getByText(/^Each question fixes/).textContent).toBe(
      "Each question fixes some factors, varies others, and runs coding agents against a kata until every cell has enough replicates. The tables are computed from the runs.");
  });

  // R3 — an entry
  it("links the question to its RQ page and shows the id beneath it -- RQ-stability -> /rq/RQ-stability/", () => {
    render(<RqIndex rqs={[rq()]} />);
    const question = screen.getByRole("link", { name: rq().question });
    expect(question.getAttribute("href")).toBe("/rq/RQ-stability/");
    const id = screen.getByText("RQ-stability");
    expect(question.compareDocumentPosition(id) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("shows coverage, ok runs and span on one line -- 10 of 12 cells at 5 replicates, 58 ok runs -> '10/12 cells, 58 runs, 2026-08-03 → 2026-08-17'", () => {
    const cells = [
      { runs: [...runs(1, "2026-08-03T09:00:00+00:00"), ...runs(4, "2026-08-10T09:00:00+00:00")] },
      ...Array.from({ length: 8 }, () => ({ runs: runs(5, "2026-08-10T09:00:00+00:00") })),
      { runs: [...runs(4, "2026-08-10T09:00:00+00:00"), ...runs(1, "2026-08-17T20:00:00+00:00")] },
      ...Array.from({ length: 2 }, () => ({ runs: runs(4, "2026-08-10T09:00:00+00:00") })),
    ];
    render(<RqIndex rqs={[rq({ min_replicates: 5, cells })]} />);
    expect(screen.getByText("10/12 cells, 58 runs, 2026-08-03 → 2026-08-17")).toBeTruthy();
  });
  it("has no singular and repeats a single day -- one ok run on 2026-08-03 -> '0/1 cells, 1 runs, 2026-08-03 → 2026-08-03'", () => {
    render(<RqIndex rqs={[rq({ min_replicates: 5, cells: [{ runs: runs(1, "2026-08-03T09:00:00+00:00") }] })]} />);
    expect(screen.getByText("0/1 cells, 1 runs, 2026-08-03 → 2026-08-03")).toBeTruthy();
  });
  it("counts and spans only ok runs -- a timeout on 2026-09-10 neither counts nor extends the span", () => {
    const cells = [{ runs: [...runs(2, "2026-08-03T09:00:00+00:00"), ...runs(1, "2026-09-10T00:51:00+00:00", "timeout")] }];
    render(<RqIndex rqs={[rq({ min_replicates: 3, cells })]} />);
    expect(screen.getByText("0/1 cells, 2 runs, 2026-08-03 → 2026-08-03")).toBeTruthy();
  });
  it("takes the UTC date of started_at -- 2026-08-11T01:00:00+02:00 -> 2026-08-10", () => {
    render(<RqIndex rqs={[rq({ cells: [{ runs: runs(2, "2026-08-11T01:00:00+02:00") }] })]} />);
    expect(screen.getByText("0/1 cells, 2 runs, 2026-08-10 → 2026-08-10")).toBeTruthy();
  });

  // R4, R5 — no data, no ok run
  it("shows 'no data yet' for an RQ without runs, its question unlinked and its id beneath it", () => {
    render(<RqIndex rqs={[rq({ cells: [{ runs: [] }, { runs: [] }] })]} />);
    expect(screen.getByText("no data yet")).toBeTruthy();
    expect(screen.queryByRole("link")).toBeNull();
    const question = screen.getByText(rq().question);
    expect(question.compareDocumentPosition(screen.getByText("RQ-stability")) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("shows 'no ok runs yet' for an RQ whose only runs are 3 timeouts, its question linked", () => {
    render(<RqIndex rqs={[rq({ cells: [{ runs: runs(3, "2026-09-10T00:51:00+00:00", "timeout") }] })]} />);
    expect(screen.getByText("no ok runs yet")).toBeTruthy();
    expect(screen.getByRole("link", { name: rq().question }).getAttribute("href")).toBe("/rq/RQ-stability/");
  });

  // R1 — groups
  it("groups by harness subtree -- research/questions-cross/1.10-exact-coding-typescript -> 'Across harnesses'", () => {
    render(<RqIndex rqs={[rq({ id: "RQ-exact-coding-typescript", path: "research/questions-cross/1.10-exact-coding-typescript" })]} />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.textContent).toBe("Across harnesses");
    expect(within(heading.closest("section")!).getByText("RQ-exact-coding-typescript")).toBeTruthy();
  });
  it("orders the groups Claude Code, pi, OpenCode, Cursor CLI, Across harnesses", () => {
    const subtrees = ["questions-cross", "questions-cursor-cli", "questions-opencode", "questions-pi", "questions-claude"];
    render(<RqIndex rqs={subtrees.map(subtree => rq({ id: `RQ-${subtree}`, path: `research/${subtree}/1.1-sample` }))} />);
    expect(headings()).toEqual(["Claude Code", "pi", "OpenCode", "Cursor CLI", "Across harnesses"]);
  });
  it("leaves out a group without RQs -- no questions-cursor-cli RQ -> no 'Cursor CLI' heading", () => {
    const subtrees = ["questions-claude", "questions-pi", "questions-opencode", "questions-cross"];
    render(<RqIndex rqs={subtrees.map(subtree => rq({ id: `RQ-${subtree}`, path: `research/${subtree}/1.1-sample` }))} />);
    expect(headings()).toEqual(["Claude Code", "pi", "OpenCode", "Across harnesses"]);
  });

  // R2 — order by chapter label
  it("orders by chapter label part by part -- 4.2, 4.10, 4.9 -> 4.2, 4.9, 4.10", () => {
    render(<RqIndex rqs={chapters(["4.2", "4.10", "4.9"])} />);
    expect(ids()).toEqual(["RQ-4.2", "RQ-4.9", "RQ-4.10"]);
  });
  it("orders by chapter label part by part -- 1.10, 1.2 -> 1.2, 1.10", () => {
    render(<RqIndex rqs={chapters(["1.10", "1.2"])} />);
    expect(ids()).toEqual(["RQ-1.2", "RQ-1.10"]);
  });
  it("shows no chapter label -- '4.10' appears nowhere in the index", () => {
    const { container } = render(<RqIndex rqs={[rq({ id: "RQ-test-list-dimensions-opus-native",
      path: "research/questions-claude/4.10-test-list-dimensions-opus-native" })]} />);
    expect(container.textContent).not.toContain("4.10");
  });
});

describe("RQ pages", () => {
  // R4, R5
  it("builds a page for an RQ with runs, ok or not, and none for an RQ without runs", () => {
    const rqs = [rq({ id: "RQ-ok" }), rq({ id: "RQ-timeouts", cells: [{ runs: runs(3, "2026-09-10T00:51:00+00:00", "timeout") }] }),
      rq({ id: "RQ-empty", cells: [{ runs: [] }, { runs: [] }] })];
    expect(rqsWithPages(rqs).map(page => page.id)).toEqual(["RQ-ok", "RQ-timeouts"]);
  });
});
