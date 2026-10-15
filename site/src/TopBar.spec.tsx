import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopBar, type TopBarProps } from "./TopBar.js";

const builtAt = new Date("2026-10-15T14:02:00Z");
const commit = "d53bae31198c53be53f9ac965d9558076e804be1";

function bar(overrides: Partial<TopBarProps> = {}): TopBarProps {
  return { builtAt, commit, rqs: [], ...overrides };
}

function stampText(): string {
  return screen.getByText(/^Data as of/).textContent ?? "";
}

function runs(prefix: string, count: number, exitReason = "ok") {
  return Array.from({ length: count }, (_, index) => ({ id: `${prefix}-${index}`, started_at: "2026-08-10T09:00:00+00:00", exit_reason: exitReason }));
}

// Story 07, RQ index (docs/stories/done/2026-10-11_07_rq-index.md), rule 6: the page frame.
describe("Top bar", () => {
  it("links 'Agentic Coding Lab' to the index at /agentic_coding_lab/", () => {
    render(<TopBar {...bar()} />);
    expect(screen.getByRole("link", { name: "Agentic Coding Lab" }).getAttribute("href")).toBe("/agentic_coding_lab/");
  });
  it("links 'Questions' to the index and marks it as the current page on the index", () => {
    render(<TopBar {...bar({ current: "questions" })} />);
    const questions = within(screen.getByRole("navigation")).getByRole("link", { name: "Questions" });
    expect(questions.getAttribute("href")).toBe("/agentic_coding_lab/");
    expect(questions.getAttribute("aria-current")).toBe("page");
  });
  it("does not mark 'Questions' as current on an RQ page", () => {
    render(<TopBar {...bar()} />);
    expect(screen.getByRole("link", { name: "Questions" }).getAttribute("aria-current")).toBeNull();
  });
  it("stamps the build time and the ok runs -- built 2026-10-15T14:02Z, 2431 ok runs -> 'Data as of 2026-10-15 14:02 UTC, 2,431 runs, commit d53bae3'", () => {
    const rqs = [{ cells: [{ runs: runs("a", 2000) }, { runs: runs("b", 400) }] }, { cells: [{ runs: runs("c", 31) }] }];
    render(<TopBar {...bar({ rqs })} />);
    expect(stampText()).toBe("Data as of 2026-10-15 14:02 UTC, 2,431 runs, commit d53bae3");
  });
  // Story Deploy (docs/stories/done/2026-10-15_01_deploy.md), rule 6
  it("names the HEAD commit in the stamp -- d53bae31198c… -> 'Data as of 2026-10-15 14:02 UTC, 1,273 runs, commit d53bae3'", () => {
    render(<TopBar {...bar({ rqs: [{ cells: [{ runs: runs("a", 1273) }] }] })} />);
    expect(stampText()).toBe("Data as of 2026-10-15 14:02 UTC, 1,273 runs, commit d53bae3");
  });
  it("links the commit to https://github.com/marcoemrich/agentic_coding_lab/commit/<sha>", () => {
    render(<TopBar {...bar()} />);
    expect(screen.getByRole("link", { name: "d53bae3" }).getAttribute("href"))
      .toBe("https://github.com/marcoemrich/agentic_coding_lab/commit/d53bae31198c53be53f9ac965d9558076e804be1");
  });
  it("counts a run of two RQs once and leaves timeouts out", () => {
    const shared = runs("shared", 2);
    const rqs = [{ cells: [{ runs: shared }] }, { cells: [{ runs: [...shared, ...runs("late", 1, "timeout")] }] }];
    render(<TopBar {...bar({ rqs })} />);
    expect(stampText()).toBe("Data as of 2026-10-15 14:02 UTC, 2 runs, commit d53bae3");
  });
});
