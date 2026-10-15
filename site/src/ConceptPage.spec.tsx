import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConceptPage } from "./ConceptPage.js";

// The heading of the section with this id.
function sectionHeading(id: string): string | null {
  const { container } = render(<ConceptPage />);
  const section = container.querySelector(`section#${id}`);
  expect(section).not.toBeNull();
  return within(section as HTMLElement).getByRole("heading", { level: 2 }).textContent;
}

// Workflow page (docs/stories/open/2026-10-11_09_workflow-page.md), rule 7: the concept page.
describe("Concept page", () => {
  it("has a section 'Predictive TDD' with id predictive-tdd", () => {
    expect(sectionHeading("predictive-tdd")).toBe("Predictive TDD");
  });
  it("has a section 'EXACT Coding' with id exact-coding", () => {
    expect(sectionHeading("exact-coding")).toBe("EXACT Coding");
  });
});
