import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { FindingsContext } from "./findings-links.js";
import { FindingsSection } from "./FindingsSection.js";
import { openFindingsFor } from "./open-findings.js";

const context: FindingsContext = {
  path: "research/questions-claude/5.1-workflow-stability",
  pages: { "research/questions-claude/5.1-workflow-stability": "RQ-stability" },
};
const findings = "# RQ-stability Findings\n\n## F-stability.1 — Replicates at n=10\n\nIt replicates.\n";

// Findings section (docs/stories/open/2026-10-11_08_findings-section.md).
describe("Findings section", () => {
  // R1 — position and form
  it("shows the banner 'AI-generated, not human-validated.' above a collapsed section titled 'Findings'", () => {
    const { container } = render(<FindingsSection findings={findings} context={context} />);
    const banner = screen.getByText("AI-generated, not human-validated.");
    const section = container.querySelector("details")!;
    expect(section.open).toBe(false);
    expect(section.querySelector("summary")?.textContent).toBe("Findings");
    expect(banner.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
  it("shows neither banner nor section without findings", () => {
    const { container } = render(<FindingsSection context={context} />);
    expect(container.textContent).toBe("");
  });

  // R5 — following an anchor opens the section
  it("opens the section when the address points at a finding inside it -- #f-stability1--replicates-at-n10", () => {
    const { container } = render(<FindingsSection findings={findings} context={context} />);
    openFindingsFor("#f-stability1--replicates-at-n10", document);
    expect(container.querySelector("details")!.open).toBe(true);
  });
  it("opens the section for #findings", () => {
    const { container } = render(<FindingsSection findings={findings} context={context} />);
    openFindingsFor("#findings", document);
    expect(container.querySelector("details")!.open).toBe(true);
  });
  it("opens nothing for an anchor outside it -- a run list's <details> stays closed", () => {
    const { container } = render(<>
      <details className="runs"><summary>Runs behind this table</summary><a id="run-1">run-1</a></details>
      <FindingsSection findings={findings} context={context} />
    </>);
    openFindingsFor("#run-1", document);
    expect([...container.querySelectorAll("details")].map(section => section.open)).toEqual([false, false]);
  });
});
