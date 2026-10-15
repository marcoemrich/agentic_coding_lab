import { describe, expect, it } from "vitest";
import { workflowCatalog, type WorkflowProfile } from "./workflow-catalog.js";

// A workflow as workflows.json carries it; the catalog reads only its tree fields.
function profile(overrides: Partial<WorkflowProfile> = {}): WorkflowProfile {
  return { description: "A workflow.", arm: "hybrid", harness: "cc", status: "trunk",
    category: "exact-coding/opus", version: "1", parent: null, style: "test list", ...overrides };
}

// Each entry of the first section as "<indent>:<name>".
function tree(workflows: Record<string, WorkflowProfile>): string[] {
  return workflowCatalog(workflows)[0].entries.map(entry => `${entry.indent}:${entry.name}`);
}

function titles(workflows: Record<string, WorkflowProfile>): string[] {
  return workflowCatalog(workflows).map(section => section.title);
}

// Workflow page (docs/stories/open/2026-10-11_09_workflow-page.md), rules 3-5: sections and tree.
describe("Workflow catalog", () => {
  // Rule 4 — categories
  it("orders the sections Baselines, External skills, EXACT Coding — Opus line, EXACT Coding — SOL line", () => {
    // In LINEAGE.yaml's order: opus, sol, baselines, external.
    expect(titles({
      "exact-hybrid-v1-cc": profile({ category: "exact-coding/opus" }),
      "exact-sol-v1-pi": profile({ category: "exact-coding/sol" }),
      "baseline-oneshot-v1-cc": profile({ category: "baselines" }),
      "external-pocock-2026-09-04-cc": profile({ category: "external", version: null }),
    })).toEqual(["Baselines", "External skills", "EXACT Coding — Opus line", "EXACT Coding — SOL line"]);
  });
  it("leaves out a category without a referenced workflow -- only baselines -> one section", () => {
    expect(titles({ "baseline-oneshot-v1-cc": profile({ category: "baselines" }) })).toEqual(["Baselines"]);
  });

  // Rule 5 — roots
  it("keeps roots in LINEAGE order -- Opus line: subagents-v1, single-context-v1, single-context-v3, hybrid-v1, hybrid-v4-cleaned-cc, hybrid-v6, green-refactor-v2", () => {
    expect(tree({
      "exact-subagents-v1-cc": profile({ arm: "subagents" }),
      "exact-single-context-v1-cc": profile({ arm: "single-context" }),
      "exact-single-context-v3-no-subagent-cc": profile({ arm: "single-context", version: "3", parent: "exact-hybrid-v8-no-end-refactor-cc" }),
      "exact-hybrid-v1-cc": profile(),
      "exact-hybrid-v4-cleaned-cc": profile({ version: "4", parent: "exact-hybrid-v3-with-why-cc" }),
      "exact-hybrid-v6-lab-split-cc": profile({ version: "6", parent: "exact-hybrid-v5-end-refactor-cc" }),
      "exact-green-refactor-v2-testlist-fix-cc": profile({ arm: "green-refactor", version: "2", parent: "exact-green-refactor-v1-cc" }),
    })).toEqual(["0:exact-subagents-v1-cc", "0:exact-single-context-v1-cc", "0:exact-single-context-v3-no-subagent-cc",
      "0:exact-hybrid-v1-cc", "0:exact-hybrid-v4-cleaned-cc", "0:exact-hybrid-v6-lab-split-cc", "0:exact-green-refactor-v2-testlist-fix-cc"]);
  });
  it("orders external roots by name -- kesseler, pocock, superpowers, tcr-kentbeck, tcrdd-bsene, tcrdd-git-gamble", () => {
    const external = (overrides: Partial<WorkflowProfile> = {}) => profile({ category: "external", status: "vendored", version: null, ...overrides });
    expect(tree({
      "external-pocock-2026-09-04-cc": external(),
      "external-superpowers-2026-09-04-cc": external(),
      "external-tcr-kentbeck-2026-09-14-cc": external(),
      "external-tcrdd-git-gamble-2026-09-14-cc": external(),
      "external-tcrdd-bsene-2026-09-14-cc": external(),
      "external-kesseler-2026-09-30-cc": external(),
    })).toEqual(["0:external-kesseler-2026-09-30-cc", "0:external-pocock-2026-09-04-cc", "0:external-superpowers-2026-09-04-cc",
      "0:external-tcr-kentbeck-2026-09-14-cc", "0:external-tcrdd-bsene-2026-09-14-cc", "0:external-tcrdd-git-gamble-2026-09-14-cc"]);
  });

  // Rule 3 — a parent off the page makes a root
  it("makes a workflow whose parent is not on the page a root -- exact-hybrid-v4-cleaned-cc (parent exact-hybrid-v3-with-why-cc) at depth 0", () => {
    expect(tree({
      "exact-hybrid-v2-testlist-fix-cc": profile({ version: "2" }),
      "exact-hybrid-v4-cleaned-cc": profile({ version: "4", parent: "exact-hybrid-v3-with-why-cc" }),
    })).toEqual(["0:exact-hybrid-v2-testlist-fix-cc", "0:exact-hybrid-v4-cleaned-cc"]);
  });

  // Rule 5 — children and siblings
  it("places children beneath their parent -- Baselines: oneshot (agent, native), iterative, inline-tdd-v1-cc (v1-pi, v1.1-local-git-cc (v1.1-local-git-pi))", () => {
    const baseline = (overrides: Partial<WorkflowProfile> = {}) => profile({ category: "baselines", status: "branch", ...overrides });
    expect(tree({
      "baseline-oneshot-v1-cc": baseline({ arm: "oneshot" }),
      "baseline-iterative-v1-cc": baseline({ arm: "iterative" }),
      "baseline-inline-tdd-v1-cc": baseline({ arm: "inline-tdd" }),
      "baseline-inline-tdd-v1-pi": baseline({ arm: "inline-tdd", harness: "pi", parent: "baseline-inline-tdd-v1-cc" }),
      "baseline-inline-tdd-v1.1-local-git-cc": baseline({ arm: "inline-tdd", version: "1.1", parent: "baseline-inline-tdd-v1-cc" }),
      "baseline-inline-tdd-v1.1-local-git-pi": baseline({ arm: "inline-tdd", version: "1.1", harness: "pi", parent: "baseline-inline-tdd-v1.1-local-git-cc" }),
      "baseline-end-refactor-only-v1-agent-cc": baseline({ arm: "end-refactor-only", parent: "baseline-oneshot-v1-cc" }),
      "baseline-end-refactor-only-v1-native-cc": baseline({ arm: "end-refactor-only", parent: "baseline-oneshot-v1-cc" }),
    })).toEqual([
      "0:baseline-oneshot-v1-cc", "1:baseline-end-refactor-only-v1-agent-cc", "1:baseline-end-refactor-only-v1-native-cc",
      "0:baseline-iterative-v1-cc",
      "0:baseline-inline-tdd-v1-cc", "1:baseline-inline-tdd-v1-pi", "1:baseline-inline-tdd-v1.1-local-git-cc", "2:baseline-inline-tdd-v1.1-local-git-pi"]);
  });
  it("orders siblings by version across arms -- beneath exact-sol-v1.6-test-list-dimensions-pi: exact-ptdd-v1-pi (v1) before exact-sol-v1.6-test-list-dimensions-cc (v1.6)", () => {
    const sol = (overrides: Partial<WorkflowProfile> = {}) => profile({ category: "exact-coding/sol", ...overrides });
    expect(tree({
      "exact-sol-v1.6-test-list-dimensions-pi": sol({ arm: "sol", version: "1.6", harness: "pi" }),
      "exact-sol-v1.6-test-list-dimensions-cc": sol({ arm: "sol", version: "1.6", parent: "exact-sol-v1.6-test-list-dimensions-pi" }),
      "exact-ptdd-v1-pi": sol({ arm: "ptdd", version: "1", harness: "pi", parent: "exact-sol-v1.6-test-list-dimensions-pi" }),
    })).toEqual(["0:exact-sol-v1.6-test-list-dimensions-pi", "1:exact-ptdd-v1-pi", "1:exact-sol-v1.6-test-list-dimensions-cc"]);
  });
  it("compares versions numerically -- v2.9 before v2.10", () => {
    expect(tree({
      "exact-hybrid-v2-testlist-fix-cc": profile({ version: "2" }),
      "exact-hybrid-v2.10-sample-cc": profile({ version: "2.10", parent: "exact-hybrid-v2-testlist-fix-cc" }),
      "exact-hybrid-v2.9-stack-profile-cc": profile({ version: "2.9", parent: "exact-hybrid-v2-testlist-fix-cc" }),
    })).toEqual(["0:exact-hybrid-v2-testlist-fix-cc", "1:exact-hybrid-v2.9-stack-profile-cc", "1:exact-hybrid-v2.10-sample-cc"]);
  });
  it("orders siblings of one version by harness cc, pi, oc, cursor -- beneath exact-hybrid-v4-cleaned-cc: -pi before -oc", () => {
    const port = (harness: string) => profile({ version: "4", harness, parent: "exact-hybrid-v4-cleaned-cc" });
    expect(tree({
      "exact-hybrid-v4-cleaned-cc": profile({ version: "4" }),
      "exact-hybrid-v4-cleaned-cursor": port("cursor"),
      "exact-hybrid-v4-cleaned-oc": port("oc"),
      "exact-hybrid-v4-cleaned-pi": port("pi"),
    })).toEqual(["0:exact-hybrid-v4-cleaned-cc", "1:exact-hybrid-v4-cleaned-pi", "1:exact-hybrid-v4-cleaned-oc", "1:exact-hybrid-v4-cleaned-cursor"]);
  });
  it("keeps siblings of one version and harness in LINEAGE order, not by name -- listed native, agent -> native, agent", () => {
    const baseline = (overrides: Partial<WorkflowProfile> = {}) => profile({ category: "baselines", ...overrides });
    expect(tree({
      "baseline-oneshot-v1-cc": baseline(),
      "baseline-end-refactor-only-v1-native-cc": baseline({ parent: "baseline-oneshot-v1-cc" }),
      "baseline-end-refactor-only-v1-agent-cc": baseline({ parent: "baseline-oneshot-v1-cc" }),
    })).toEqual(["0:baseline-oneshot-v1-cc", "1:baseline-end-refactor-only-v1-native-cc", "1:baseline-end-refactor-only-v1-agent-cc"]);
  });

  // Rule 5 — indentation
  it("indents at most three steps -- exact-ptdd-v1.1-refactor-subagent-cc at level 5 -> indent 3", () => {
    const sol = (version: string, harness: string, parent: string | null) => profile({ category: "exact-coding/sol", version, harness, parent });
    expect(tree({
      "exact-sol-v1.5-tcr-parity-domain-trial-pi": sol("1.5", "pi", "exact-tcr-v1.3-domain-boundary-trial-pi"),
      "exact-sol-v1.6-test-list-dimensions-pi": sol("1.6", "pi", "exact-sol-v1.5-tcr-parity-domain-trial-pi"),
      "exact-ptdd-v1-pi": sol("1", "pi", "exact-sol-v1.6-test-list-dimensions-pi"),
      "exact-ptdd-v1.1-refactor-subagent-pi": sol("1.1", "pi", "exact-ptdd-v1-pi"),
      "exact-ptdd-v1.1-refactor-subagent-cc": sol("1.1", "cc", "exact-ptdd-v1.1-refactor-subagent-pi"),
    })).toEqual(["0:exact-sol-v1.5-tcr-parity-domain-trial-pi", "1:exact-sol-v1.6-test-list-dimensions-pi", "2:exact-ptdd-v1-pi",
      "3:exact-ptdd-v1.1-refactor-subagent-pi", "3:exact-ptdd-v1.1-refactor-subagent-cc"]);
  });
});
