import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RqHeader, type RqHeaderInput } from "./RqHeader.js";

const stabilityQuestion = "How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count?";

const stabilityPairs = [
  { workflow: "baseline-oneshot-v1-cc", prompt: "prose" },
  { workflow: "baseline-iterative-v1-cc", prompt: "prose" },
  { workflow: "baseline-inline-tdd-v1-cc", prompt: "example-mapping" },
  { workflow: "exact-subagents-v1-cc", prompt: "example-mapping" },
  { workflow: "exact-single-context-v1-cc", prompt: "example-mapping" },
  { workflow: "exact-hybrid-v1-cc", prompt: "example-mapping" },
];

type Run = { id: string; started_at: string; exit_reason: string };

function runs(count: number, startedAt: string, exitReason = "ok"): Run[] {
  return Array.from({ length: count }, (_, index) => ({ id: `run-${startedAt}-${index}`, started_at: startedAt, exit_reason: exitReason }));
}

// RQ-stability as exported on 2026-10-14: 59 ok runs, 5 of 6 cells at 10 replicates.
const stabilityCells = [
  { runs: [...runs(1, "2026-05-14T19:06:13+00:00"), ...runs(9, "2026-05-15T08:00:00+00:00")] },
  ...Array.from({ length: 4 }, () => ({ runs: runs(10, "2026-05-15T08:00:00+00:00") })),
  { runs: [...runs(8, "2026-05-15T08:00:00+00:00"), ...runs(1, "2026-05-15T16:02:01+00:00")] },
];

function stability(overrides: Partial<RqHeaderInput> = {}): RqHeaderInput {
  return { id: "RQ-stability", question: stabilityQuestion, path: "research/questions-claude/5.1-workflow-stability",
    factors: { workflow_x_prompt: stabilityPairs },
    controls: { model: "opus-4-7-no-thinking", kata_base: "game-of-life" },
    min_replicates: 10, cells: stabilityCells, ...overrides };
}

const architectureAxisFactors: RqHeaderInput["factors"] = {
  workflow_x_prompt: [
    { workflow: "baseline-inline-tdd-v1-cc", prompt: "example-mapping" },
    { workflow: "exact-single-context-v2-testlist-fix-cc", prompt: "example-mapping" },
    { workflow: "exact-hybrid-v2-testlist-fix-cc", prompt: "example-mapping" },
    { workflow: "exact-hybrid-v6-lab-split-cc", prompt: "example-mapping" },
  ],
  kata_base: ["claim-office", "game-of-life"],
  model: ["opus-5-no-thinking", { any: ["opus-4-7-no-thinking", "opus-4-7-portkey-no-thinking"] }],
};

function architectureAxis(overrides: Partial<RqHeaderInput> = {}): RqHeaderInput {
  return stability({ id: "RQ-architecture-axis-opus5", factors: architectureAxisFactors, controls: undefined, ...overrides });
}

function metaValue(label: string): HTMLElement {
  const term = screen.getByText(label, { selector: "dt" });
  return term.nextElementSibling as HTMLElement;
}

function workflowLinks(): HTMLElement[] {
  return screen.getAllByRole("link").filter(link => link.getAttribute("href")?.startsWith("/workflows/"));
}

function lines(element: HTMLElement): string[] {
  return within(element).getAllByRole("listitem").map(item => item.textContent ?? "");
}

// Story 06, RQ page header (docs/stories/done/2026-10-11_06_rq-page-header.md).
// The browser <title> is Astro wiring and is checked in the built page, not here.
describe("RQ page header", () => {
  // R1 — title
  it("titles the page 'Research Question: RQ-stability' as h1 and shows the question below it", () => {
    render(<RqHeader rq={stability()} />);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title.textContent).toBe("Research Question: RQ-stability");
    const question = screen.getByText(stabilityQuestion);
    expect(title.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("shows no chapter label -- RQ-stability at 5.1-workflow-stability -> '5.1' appears nowhere in the header text", () => {
    const { container } = render(<RqHeader rq={stability()} />);
    expect(container.textContent).not.toContain("5.1");
  });

  // R2 — closed banner
  it("shows 'Closed. gap accepted — one game-of-life cell holds 9 of 10 runs' between the question and the meta list", () => {
    const { container } = render(<RqHeader rq={stability({ closed: "gap accepted — one game-of-life cell holds 9 of 10 runs" })} />);
    const banner = screen.getByText("gap accepted — one game-of-life cell holds 9 of 10 runs", { exact: false });
    expect(banner.textContent).toBe("Closed. gap accepted — one game-of-life cell holds 9 of 10 runs");
    const question = screen.getByText(stabilityQuestion);
    const metaList = container.querySelector("dl")!;
    expect(question.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(banner.compareDocumentPosition(metaList) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("shows no banner when closed is not set -- RQ-architecture-axis-opus5", () => {
    const { container } = render(<RqHeader rq={architectureAxis()} />);
    expect(container.textContent).not.toContain("Closed.");
  });

  it("names the factors row 'Factor(s)' with the tooltip 'Factors are what this RQ varies to compare its cells.'", () => {
    render(<RqHeader rq={stability()} />);
    expect(screen.getByText("Factor(s)", { selector: "dt" }).title).toBe("Factors are what this RQ varies to compare its cells.");
  });
  it("names the controls row 'Control(s)' with the tooltip 'Controls are what stays fixed in every run.'", () => {
    render(<RqHeader rq={stability()} />);
    expect(screen.getByText("Control(s)", { selector: "dt" }).title).toBe("Controls are what stays fixed in every run.");
  });
  // R3 — Factor(s)
  it("lists a paired factor under 'Factor(s)' as heading 'workflow × prompt' and one line per pair -- RQ-stability -> 'baseline-oneshot-v1-cc · prose' … 'exact-hybrid-v1-cc · example-mapping'", () => {
    render(<RqHeader rq={stability()} />);
    const varies = metaValue("Factor(s)");
    expect(within(varies).getByText("workflow × prompt")).toBeTruthy();
    expect(lines(varies)).toEqual([
      "baseline-oneshot-v1-cc · prose",
      "baseline-iterative-v1-cc · prose",
      "baseline-inline-tdd-v1-cc · example-mapping",
      "exact-subagents-v1-cc · example-mapping",
      "exact-single-context-v1-cc · example-mapping",
      "exact-hybrid-v1-cc · example-mapping",
    ]);
  });
  it("joins any: alternatives inside a pair with ' / ' -- 'gpt-5-6-sol-codex · exact-ptdd-v1-pi / exact-sol-v1.6-test-list-dimensions-pi'", () => {
    render(<RqHeader rq={stability({ factors: { model_x_workflow: [
      { model: "gpt-5-6-sol-codex", workflow: { any: ["exact-ptdd-v1-pi", "exact-sol-v1.6-test-list-dimensions-pi"] } },
    ] } })} />);
    expect(lines(metaValue("Factor(s)"))).toEqual([
      "gpt-5-6-sol-codex · exact-ptdd-v1-pi / exact-sol-v1.6-test-list-dimensions-pi"]);
  });
  it("shows a plain factor on one line -- 'kata_base: claim-office, game-of-life'", () => {
    render(<RqHeader rq={stability({ factors: { kata_base: ["claim-office", "game-of-life"] } })} />);
    expect(within(metaValue("Factor(s)")).getByText("kata_base: claim-office, game-of-life")).toBeTruthy();
  });
  it("joins any: alternatives in a plain factor with ' / ' -- 'model: opus-5-no-thinking, opus-4-7-no-thinking / opus-4-7-portkey-no-thinking'", () => {
    render(<RqHeader rq={stability({ factors: { model: [
      "opus-5-no-thinking", { any: ["opus-4-7-no-thinking", "opus-4-7-portkey-no-thinking"] }] } })} />);
    expect(within(metaValue("Factor(s)"))
      .getByText("model: opus-5-no-thinking, opus-4-7-no-thinking / opus-4-7-portkey-no-thinking")).toBeTruthy();
  });
  it("keeps the factors in frontmatter order -- RQ-architecture-axis-opus5 -> workflow × prompt, kata_base, model", () => {
    render(<RqHeader rq={architectureAxis()} />);
    const factorTexts = Array.from(metaValue("Factor(s)").children).map(factor => factor.textContent ?? "");
    expect(factorTexts.map((text, index) => text.startsWith(["workflow × prompt", "kata_base:", "model:"][index])))
      .toEqual([true, true, true]);
  });

  // R4 — Control(s)
  it("lists the controls under 'Control(s)' as raw key: value lines -- 'model: opus-4-7-no-thinking', 'kata_base: game-of-life'", () => {
    render(<RqHeader rq={stability()} />);
    expect(lines(metaValue("Control(s)"))).toEqual(["model: opus-4-7-no-thinking", "kata_base: game-of-life"]);
  });
  it("joins any: alternatives in a control with ' / ' -- 'model: opus-4-7-no-thinking / opus-4-7-no-thinking-portkey'", () => {
    render(<RqHeader rq={stability({ controls: { model: { any: ["opus-4-7-no-thinking", "opus-4-7-no-thinking-portkey"] } } })} />);
    expect(lines(metaValue("Control(s)"))).toEqual(["model: opus-4-7-no-thinking / opus-4-7-no-thinking-portkey"]);
  });
  it("drops the 'Control(s)' row without controls -- RQ-architecture-axis-opus5", () => {
    render(<RqHeader rq={architectureAxis()} />);
    expect(screen.queryByText("Control(s)")).toBeNull();
  });

  // R5 — workflow links
  it("links a workflow in a pair to its workflow page entry -- baseline-oneshot-v1-cc -> /workflows/#baseline-oneshot-v1-cc", () => {
    render(<RqHeader rq={stability()} />);
    expect(screen.getByRole("link", { name: "baseline-oneshot-v1-cc" }).getAttribute("href"))
      .toBe("/workflows/#baseline-oneshot-v1-cc");
  });
  it("links every any: alternative separately -- exact-ptdd-v1-pi and exact-sol-v1.6-test-list-dimensions-pi each get a link", () => {
    render(<RqHeader rq={stability({ factors: { model_x_workflow: [
      { model: "gpt-5-6-sol-codex", workflow: { any: ["exact-ptdd-v1-pi", "exact-sol-v1.6-test-list-dimensions-pi"] } },
    ] } })} />);
    expect(workflowLinks().map(link => link.getAttribute("href"))).toEqual([
      "/workflows/#exact-ptdd-v1-pi", "/workflows/#exact-sol-v1.6-test-list-dimensions-pi"]);
  });
  it("links workflows of a plain workflow factor and of a workflow control", () => {
    render(<RqHeader rq={stability({ factors: { workflow: ["exact-ptdd-v1-cc", "baseline-inline-tdd-v1-cc"] },
      controls: { workflow: "exact-hybrid-v1-cc" } })} />);
    expect(workflowLinks().map(link => link.textContent)).toEqual([
      "exact-ptdd-v1-cc", "baseline-inline-tdd-v1-cc", "exact-hybrid-v1-cc"]);
    expect(within(metaValue("Factor(s)")).getByText("exact-ptdd-v1-cc", { exact: false }).closest("div")?.textContent)
      .toBe("workflow: exact-ptdd-v1-cc, baseline-inline-tdd-v1-cc");
  });
  it("does not link values that are not workflows -- prose, opus-4-7-no-thinking, game-of-life stay plain text", () => {
    render(<RqHeader rq={stability()} />);
    const linked = workflowLinks().map(link => link.textContent);
    expect(linked).not.toContain("prose");
    expect(linked).not.toContain("opus-4-7-no-thinking");
    expect(linked).not.toContain("game-of-life");
    expect(linked).toHaveLength(6);
  });

  // R6 — Runs line
  it("shows ok runs, span and coverage under 'Runs' -- RQ-stability -> '59 runs, 2026-05-14 → 2026-05-15; 5 of 6 cells at 10 replicates'", () => {
    render(<RqHeader rq={stability()} />);
    expect(metaValue("Runs").textContent).toBe("59 runs, 2026-05-14 → 2026-05-15; 5 of 6 cells at 10 replicates");
  });
  it("counts and spans only ok runs -- a timeout on 2026-09-10 neither counts nor extends the span", () => {
    const cells = [...stabilityCells, { runs: runs(1, "2026-09-10T00:51:00+00:00", "timeout") }];
    render(<RqHeader rq={stability({ cells })} />);
    expect(metaValue("Runs").textContent).toBe("59 runs, 2026-05-14 → 2026-05-15; 5 of 7 cells at 10 replicates");
  });
  it("judges coverage by ok runs only -- a cell of 9 ok runs and 1 timeout is not at 10 replicates", () => {
    const [lastCell] = stabilityCells.slice(-1);
    const cells = [...stabilityCells.slice(0, -1),
      { runs: [...lastCell.runs, ...runs(1, "2026-05-15T09:00:00+00:00", "timeout")] }];
    render(<RqHeader rq={stability({ cells })} />);
    expect(metaValue("Runs").textContent).toBe("59 runs, 2026-05-14 → 2026-05-15; 5 of 6 cells at 10 replicates");
  });
  it("takes the UTC date of started_at -- 2026-08-11T01:00:00+02:00 -> 2026-08-10", () => {
    render(<RqHeader rq={stability({ cells: [{ runs: runs(2, "2026-08-11T01:00:00+02:00") }] })} />);
    expect(metaValue("Runs").textContent).toBe("2 runs, 2026-08-10 → 2026-08-10; 0 of 1 cells at 10 replicates");
  });
  it("says 'no runs yet' for an RQ without runs -- 'no runs yet; 0 of 6 cells at 10 replicates'", () => {
    render(<RqHeader rq={stability({ cells: Array.from({ length: 6 }, () => ({ runs: [] })) })} />);
    expect(metaValue("Runs").textContent).toBe("no runs yet; 0 of 6 cells at 10 replicates");
  });
  it("says 'no ok runs yet' when no run is ok -- 'no ok runs yet; 0 of 6 cells at 10 replicates'", () => {
    const cells = [{ runs: runs(2, "2026-08-10T15:25:37+00:00", "timeout") }, ...Array.from({ length: 5 }, () => ({ runs: [] }))];
    render(<RqHeader rq={stability({ cells })} />);
    expect(metaValue("Runs").textContent).toBe("no ok runs yet; 0 of 6 cells at 10 replicates");
  });

  // Story 07, rule 7 — the header follows the index's span format and singular
  it("repeats a single day in the span -- '10 runs, 2026-08-10 → 2026-08-10; 1 of 1 cells at 10 replicates'", () => {
    render(<RqHeader rq={stability({ cells: [{ runs: runs(10, "2026-08-10T15:25:37+00:00") }] })} />);
    expect(metaValue("Runs").textContent).toBe("10 runs, 2026-08-10 → 2026-08-10; 1 of 1 cells at 10 replicates");
  });
  it("has no singular -- '1 runs, 2026-08-10 → 2026-08-10; 0 of 6 cells at 10 replicates'", () => {
    const cells = [{ runs: runs(1, "2026-08-10T15:25:37+00:00") }, ...Array.from({ length: 5 }, () => ({ runs: [] }))];
    render(<RqHeader rq={stability({ cells })} />);
    expect(metaValue("Runs").textContent).toBe("1 runs, 2026-08-10 → 2026-08-10; 0 of 6 cells at 10 replicates");
  });

  // R7 — Source
  it("links 'View on GitHub' under 'Source' to the RQ directory on main -- https://github.com/marcoemrich/agentic_coding_lab/tree/main/research/questions-claude/5.1-workflow-stability", () => {
    render(<RqHeader rq={stability()} />);
    const source = within(metaValue("Source")).getByRole("link", { name: "View on GitHub" });
    expect(source.getAttribute("href"))
      .toBe("https://github.com/marcoemrich/agentic_coding_lab/tree/main/research/questions-claude/5.1-workflow-stability");
  });
});
