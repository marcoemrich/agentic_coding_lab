import { describe, expect, it } from "vitest";
import { CONCEPTS_HREF, INDEX_HREF, WORKFLOWS_HREF, conceptHref, rqPageHref, workflowEntryHref } from "./site-links.js";

// Story Deploy (docs/stories/done/2026-10-15_01_deploy.md), rule 5: one base path everywhere.
describe("Site links under the base path", () => {
  it("links the index at /agentic_coding_lab/", () => {
    expect(INDEX_HREF).toBe("/agentic_coding_lab/");
  });
  it("links RQ-stability at /agentic_coding_lab/rq/RQ-stability/", () => {
    expect(rqPageHref("RQ-stability")).toBe("/agentic_coding_lab/rq/RQ-stability/");
  });
  it("links a workflow anchor at /agentic_coding_lab/workflows/#exact-hybrid-v1-cc", () => {
    expect(workflowEntryHref("exact-hybrid-v1-cc")).toBe("/agentic_coding_lab/workflows/#exact-hybrid-v1-cc");
  });
});

// Workflow page (docs/stories/open/2026-10-11_09_workflow-page.md), rules 6-8.
describe("Workflow and concept page links", () => {
  it("links the workflow page at /agentic_coding_lab/workflows/", () => {
    expect(WORKFLOWS_HREF).toBe("/agentic_coding_lab/workflows/");
  });
  it("links the concept page at /agentic_coding_lab/concepts/", () => {
    expect(CONCEPTS_HREF).toBe("/agentic_coding_lab/concepts/");
  });
  it("links the EXACT Coding concept at /agentic_coding_lab/concepts/#exact-coding", () => {
    expect(conceptHref("exact-coding")).toBe("/agentic_coding_lab/concepts/#exact-coding");
  });
});
