import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WorkflowPage } from "./WorkflowPage.js";
import type { WorkflowProfile } from "./workflow-catalog.js";

function profile(overrides: Partial<WorkflowProfile>): WorkflowProfile {
  return { description: "A workflow.", arm: "hybrid", harness: "cc", status: "trunk",
    category: "exact-coding/opus", version: "4", parent: null, style: "test list", ...overrides };
}

// Real workflows of the page, in LINEAGE.yaml's order.
const WORKFLOWS: Record<string, WorkflowProfile> = {
  "exact-hybrid-v1-cc": profile({ version: "1", status: "superseded" }),
  "exact-hybrid-v4-cleaned-cc": profile({ parent: "exact-hybrid-v3-with-why-cc",
    description: "An EXACT Coding workflow for Claude Code (arm: hybrid)." }),
  "exact-hybrid-v4-cleaned-oc": profile({ harness: "oc", parent: "exact-hybrid-v4-cleaned-cc" }),
  "exact-hybrid-v4-cleaned-pi": profile({ harness: "pi", parent: "exact-hybrid-v4-cleaned-cc" }),
  "exact-hybrid-v4.2-phase-continuation-cursor": profile({ version: "4.2", harness: "cursor", status: "branch", parent: "exact-hybrid-v4-cleaned-cc" }),
  "exact-ptdd-v1-cc": profile({ category: "exact-coding/sol", arm: "ptdd", version: "1", parent: "exact-ptdd-v1-pi" }),
  "baseline-oneshot-v1-cc": profile({ category: "baselines", arm: "oneshot", version: "1", status: "branch", style: "ad hoc" }),
  "baseline-inline-tdd-v1-cc": profile({ category: "baselines", arm: "inline-tdd", version: "1", status: "branch", style: "ad hoc" }),
  "external-superpowers-2026-09-04-cc": profile({ category: "external", arm: "superpowers", version: null, status: "vendored", style: "ad hoc" }),
};

function entry(name: string): HTMLElement {
  const element = document.getElementById(name);
  if (!element) throw new Error(`no profile ${name}`);
  return element;
}

// The trait tags of a profile, in order; the parent and the concept tag come after them.
function traits(name: string): (string | null)[] {
  return [...entry(name).querySelectorAll(".tag.trait")].map(tag => tag.textContent);
}

function renderPage() {
  return render(<WorkflowPage workflows={WORKFLOWS} />);
}

// Workflow page (docs/stories/open/2026-10-11_09_workflow-page.md), rules 1-3, 5 and 6.
describe("Workflow page", () => {
  // Rule 1 — one page, one anchor per workflow
  it("is headed 'Workflows' and has no intro text", () => {
    const { container } = renderPage();
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toBe("Workflows");
    expect(heading.nextElementSibling?.tagName).toBe("SECTION");
    expect(container.querySelectorAll(".wfs > p")).toHaveLength(0);
  });
  it("gives each profile the workflow name as its id -- exact-ptdd-v1-cc -> id exact-ptdd-v1-cc", () => {
    const { container } = renderPage();
    expect(container.querySelector("#exact-ptdd-v1-cc")).not.toBeNull();
    expect([...container.querySelectorAll(".wf")].map(entry => entry.id).sort()).toEqual(Object.keys(WORKFLOWS).sort());
  });
  it("heads each profile with the workflow name and shows its description", () => {
    renderPage();
    const profileEntry = within(entry("exact-hybrid-v4-cleaned-cc"));
    expect(profileEntry.getByRole("heading", { level: 3 }).firstChild?.textContent).toBe("exact-hybrid-v4-cleaned-cc");
    expect(profileEntry.getByText("An EXACT Coding workflow for Claude Code (arm: hybrid).").tagName).toBe("P");
  });
  it("heads each section with its category title", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 2 }).map(heading => heading.textContent)).toEqual([
      "Baselines", "External skills", "EXACT Coding — Opus line", "EXACT Coding — SOL line"]);
  });

  // Rule 2 — traits
  it("shows arm, harness, test list style and status as tags -- exact-hybrid-v4-cleaned-pi -> hybrid, pi, test list, trunk", () => {
    renderPage();
    expect(traits("exact-hybrid-v4-cleaned-pi")).toEqual(["hybrid", "pi", "test list", "trunk"]);
  });
  it("spells out the harness -- cc Claude Code, oc OpenCode, pi pi, cursor Cursor", () => {
    renderPage();
    expect(["exact-hybrid-v4-cleaned-cc", "exact-hybrid-v4-cleaned-oc", "exact-hybrid-v4-cleaned-pi", "exact-hybrid-v4.2-phase-continuation-cursor"]
      .map(name => traits(name)[1])).toEqual(["Claude Code", "OpenCode", "pi", "Cursor"]);
  });
  it("explains the status in a tooltip -- trunk, branch, superseded, vendored", () => {
    renderPage();
    const statusTip = (name: string) => [...entry(name).querySelectorAll(".tag.trait")][3].getAttribute("title");
    expect(["exact-hybrid-v4-cleaned-cc", "exact-hybrid-v4.2-phase-continuation-cursor", "exact-hybrid-v1-cc", "external-superpowers-2026-09-04-cc"]
      .map(statusTip)).toEqual([
      "base that was built upon",
      "answers an RQ, was not built upon",
      "replaced by a trunk successor, stays reproducible",
      "third-party code, no own development line"]);
  });
  it("shows 'ad hoc' for an ad-hoc workflow -- external-superpowers-2026-09-04-cc -> superpowers, Claude Code, ad hoc, vendored", () => {
    renderPage();
    expect(traits("external-superpowers-2026-09-04-cc")).toEqual(["superpowers", "Claude Code", "ad hoc", "vendored"]);
  });

  // Rule 3 — parent
  it("links a parent on the page to its anchor -- exact-hybrid-v4-cleaned-pi -> 'parent: exact-hybrid-v4-cleaned-cc', linked to #exact-hybrid-v4-cleaned-cc", () => {
    renderPage();
    const parent = within(entry("exact-hybrid-v4-cleaned-pi")).getByRole("link", { name: "exact-hybrid-v4-cleaned-cc" });
    expect(parent.getAttribute("href")).toBe("/agentic_coding_lab/workflows/#exact-hybrid-v4-cleaned-cc");
    expect(parent.parentElement?.textContent).toBe("parent: exact-hybrid-v4-cleaned-cc");
  });
  it("names a parent not on the page as plain text -- exact-hybrid-v4-cleaned-cc -> 'parent: exact-hybrid-v3-with-why-cc'", () => {
    renderPage();
    const parent = within(entry("exact-hybrid-v4-cleaned-cc")).getByText(/^parent:/);
    expect(parent.textContent).toBe("parent: exact-hybrid-v3-with-why-cc");
    expect(within(parent).queryByRole("link")).toBeNull();
  });
  it("shows no parent for a workflow without one -- baseline-oneshot-v1-cc", () => {
    renderPage();
    expect(within(entry("baseline-oneshot-v1-cc")).queryByText(/^parent:/)).toBeNull();
  });

  // Rule 5 — indentation
  it("indents a profile by its place in the tree -- root exact-hybrid-v4-cleaned-cc 0, its port -oc 1", () => {
    renderPage();
    expect(["exact-hybrid-v4-cleaned-cc", "exact-hybrid-v4-cleaned-oc"].map(name => entry(name).getAttribute("data-indent"))).toEqual(["0", "1"]);
  });

  // Rule 6 — concept tag
  it("tags an EXACT Coding profile of either line 'EXACT Coding', linked to /agentic_coding_lab/concepts/#exact-coding", () => {
    renderPage();
    for (const name of ["exact-hybrid-v4-cleaned-cc", "exact-ptdd-v1-cc"]) {
      const concept = within(entry(name)).getByRole("link", { name: "EXACT Coding" });
      expect([concept.className, concept.getAttribute("href")]).toEqual(["tag", "/agentic_coding_lab/concepts/#exact-coding"]);
    }
  });
  it("gives a baseline or external profile no concept tag -- baseline-inline-tdd-v1-cc, external-superpowers-2026-09-04-cc", () => {
    renderPage();
    for (const name of ["baseline-inline-tdd-v1-cc", "external-superpowers-2026-09-04-cc"])
      expect(within(entry(name)).queryByRole("link", { name: "EXACT Coding" })).toBeNull();
  });
});
