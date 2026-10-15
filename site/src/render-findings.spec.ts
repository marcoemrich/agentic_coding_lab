import { describe, expect, it } from "vitest";
import type { FindingsContext } from "./findings-links.js";
import { renderFindings } from "./render-findings.js";

const stability: FindingsContext = {
  path: "research/questions-claude/5.1-workflow-stability",
  pages: {
    "research/questions-claude/5.1-workflow-stability": "RQ-stability",
    "research/questions-claude/4.12-old-vs-new-exact-line-opus55": "RQ-old-vs-new-exact-line-opus55",
    "research/questions-claude/4.13-tdd-workflow-comparison-opus55": "RQ-tdd-workflow-comparison-opus55",
  },
};

const comparison: FindingsContext = { ...stability, path: "research/questions-claude/4.13-tdd-workflow-comparison-opus55" };

function html(markdown: string, context = stability): string {
  return renderFindings(markdown, context);
}

function hrefOf(link: string, context = stability): string | undefined {
  return html(`[x](${link})`, context).match(/href="([^"]*)"/)?.[1];
}

// Findings section (docs/stories/open/2026-10-11_08_findings-section.md).
describe("Rendering findings.md", () => {
  // R2 — content as is
  it("renders a table with its bold cells and code spans, values untouched", () => {
    const table = "| Workflow | `code_mass` | n |\n|---|---:|---:|\n| exact-hybrid-v1-cc (EM) | **152.60** | 10 |\n";
    expect(html(table)).toContain("<td>exact-hybrid-v1-cc (EM)</td>");
    expect(html(table)).toContain('<th align="right"><code>code_mass</code></th>');
    expect(html(table)).toContain('<td align="right"><strong>152.60</strong></td>');
  });

  // R3 — headings two levels down, capped at h6
  it("renders '# RQ-stability Findings' as h3 and '## F-stability.1 — …' as h4", () => {
    const rendered = html("# RQ-stability Findings\n\n## F-stability.1 — Replicates at n=10\n");
    expect(rendered).toMatch(/<h3[^>]*>RQ-stability Findings<\/h3>/);
    expect(rendered).toMatch(/<h4[^>]*>F-stability.1 — Replicates at n=10<\/h4>/);
  });
  it("renders '####' as h6 and caps '#####' and '######' at h6", () => {
    const rendered = html("#### four\n\n##### five\n\n###### six\n");
    expect(rendered.match(/<h6[^>]*>(four|five|six)<\/h6>/g)).toHaveLength(3);
  });

  // R5 — anchors on findings
  it("gives a heading its GitHub-style id -- '## F-1.10.3 — The second structural step is worth more on SOL than on Opus' -> f-1103--the-second-structural-step-is-worth-more-on-sol-than-on-opus", () => {
    expect(html("## F-1.10.3 — The second structural step is worth more on SOL than on Opus\n"))
      .toContain('<h4 id="f-1103--the-second-structural-step-is-worth-more-on-sol-than-on-opus">');
  });
  it("keeps a link to an anchor in the same findings -- '#f-1103--…' stays", () => {
    expect(html("see [F-1.10.3](#f-1103--the-second-structural-step)")).toContain('href="#f-1103--the-second-structural-step"');
  });

  // R4 — links
  it("links another RQ's findings.md to its page's findings -- in 4.13: ../4.12-old-vs-new-exact-line-opus55/findings.md -> /agentic_coding_lab/rq/RQ-old-vs-new-exact-line-opus55/#findings", () => {
    expect(hrefOf("../4.12-old-vs-new-exact-line-opus55/findings.md", comparison))
      .toBe("/agentic_coding_lab/rq/RQ-old-vs-new-exact-line-opus55/#findings");
  });
  it("resolves a link across subtrees -- ../../questions-claude/4.12-old-vs-new-exact-line-opus55/findings.md -> the same page", () => {
    expect(hrefOf("../../questions-claude/4.12-old-vs-new-exact-line-opus55/findings.md",
      { ...stability, path: "research/questions-cross/1.9-exact-coding-python" }))
      .toBe("/agentic_coding_lab/rq/RQ-old-vs-new-exact-line-opus55/#findings");
  });
  it("keeps a finding's anchor -- ../4.12-…/findings.md#f-41201-x -> /agentic_coding_lab/rq/RQ-old-vs-new-exact-line-opus55/#f-41201-x", () => {
    expect(hrefOf("../4.12-old-vs-new-exact-line-opus55/findings.md#f-41201-x", comparison))
      .toBe("/agentic_coding_lab/rq/RQ-old-vs-new-exact-line-opus55/#f-41201-x");
  });
  it("links README.md to the RQ's own page", () => {
    expect(hrefOf("README.md")).toBe("/agentic_coding_lab/rq/RQ-stability/");
  });
  it("drops a README anchor -- README.md#mutation-score-coverage -> the page without anchor", () => {
    expect(hrefOf("README.md#mutation-score-coverage")).toBe("/agentic_coding_lab/rq/RQ-stability/");
  });
  it("links any other file to GitHub -- subsample-analysis.py in 5.1 -> https://github.com/marcoemrich/agentic_coding_lab/blob/main/research/questions-claude/5.1-workflow-stability/subsample-analysis.py", () => {
    expect(hrefOf("subsample-analysis.py"))
      .toBe("https://github.com/marcoemrich/agentic_coding_lab/blob/main/research/questions-claude/5.1-workflow-stability/subsample-analysis.py");
  });
  it("links an RQ without a page to GitHub", () => {
    expect(hrefOf("../../questions-cross/1.12-ptdd-verification-split/findings.md"))
      .toBe("https://github.com/marcoemrich/agentic_coding_lab/blob/main/research/questions-cross/1.12-ptdd-verification-split/findings.md");
  });
  it("links into research/workflow-dev to GitHub", () => {
    expect(hrefOf("../../workflow-dev/workflow-construction.md"))
      .toBe("https://github.com/marcoemrich/agentic_coding_lab/blob/main/research/workflow-dev/workflow-construction.md");
  });
  it("leaves an https link as it is -- https://www.scbench.ai", () => {
    expect(hrefOf("https://www.scbench.ai")).toBe("https://www.scbench.ai");
  });
});
