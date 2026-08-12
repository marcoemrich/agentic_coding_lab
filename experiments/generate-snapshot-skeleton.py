#!/usr/bin/env python3
"""Generate a skeleton for a research-overview snapshot.

Reads research/{questions,workflow-dev}/*/README.md (frontmatter) and findings.md, counts runs in
experiments/runs/ per RQ, and emits a Markdown skeleton with all data-driven
sections pre-filled. Synthesis sections (RQ paragraphs, cross-RQ synthesis,
limitations narrative) are left as <!-- TODO Claude: ... --> markers for the
/build-overview skill to fill in.

Output: /tmp/snapshot-skeleton-YYYY-MM-DD.md (override with --out PATH).

Usage:
  experiments/generate-snapshot-skeleton.py
  experiments/generate-snapshot-skeleton.py --out /tmp/foo.md
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
RESEARCH_DIR = REPO_ROOT / "research"

# Reuse parse_frontmatter, expand_cells, kata_for_cell, RUNS_DIR from
# aggregate-by-query.py (hyphenated filename → importlib spec).
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)  # type: ignore[union-attr]

# Reuse count_runs_per_cell from batch-plan-from-rq.py.
_BPL = Path(__file__).resolve().parent / "batch-plan-from-rq.py"
_spec2 = importlib.util.spec_from_file_location("batch_plan_from_rq", _BPL)
bpl = importlib.util.module_from_spec(_spec2)
_spec2.loader.exec_module(bpl)  # type: ignore[union-attr]


# -----------------------------------------------------------------------
# Findings parsing
# -----------------------------------------------------------------------

# Finding ids are F-<namespace>.<minor>, where the namespace itself may carry
# dots. The namespace mirrors the RQ id — a slug since the id→slug migration
# (F-regression.6), the legacy numeric form (F-19.6, F-3b.1), or the chapter
# number of the RQ directory (F-4.4.1 in 4.4-external-tdd-pocock-vs-v62,
# F-1.12.5 in 1.12-end-refactor-effect-v62). Everything up to the LAST dot is
# the namespace, so any number of dotted segments matches.
# Do not tighten this to a single dot: chapter-numbered ids were silently
# dropped that way, which reads downstream as "no findings documented" for an
# RQ that in fact has a full findings.md.
FINDING_HEADER_RE = re.compile(
    r"^##\s+(F-[A-Za-z0-9][A-Za-z0-9.-]*\.\d+)\s+—\s+(.+?)\s*$"
)


def parse_findings(findings_md: Path) -> list[dict]:
    """Return list of {id, title} sorted by ID."""
    if not findings_md.is_file():
        return []
    findings = []
    for line in findings_md.read_text().splitlines():
        m = FINDING_HEADER_RE.match(line)
        if not m:
            # A line that looks like a finding header but does not parse is a
            # silent data loss: the RQ shows up as "no findings documented" in
            # the snapshot while its findings.md is full. Shout instead.
            if line.startswith("## F-"):
                print(f"  WARNING: unparsable finding header in {findings_md}:\n"
                      f"           {line}", file=sys.stderr)
            continue
        fid = m.group(1)
        rest = m.group(2)

        # Defensive: strip trailing status suffix `· …` if any old file still has it.
        if "·" in rest:
            title_part = rest.rsplit("·", 1)[0].strip()
        else:
            title_part = rest.strip()

        findings.append({"id": fid, "title": title_part})

    # Within one findings.md the namespace is constant (one RQ), so the minor
    # number orders the findings. The major segment is now a slug, not an int.
    def _minor(fid: str) -> int:
        tail = fid.rsplit(".", 1)[-1]
        return int(tail) if tail.isdigit() else 0

    findings.sort(key=lambda f: _minor(f["id"]))
    return findings


# -----------------------------------------------------------------------
# RQ collection
# -----------------------------------------------------------------------

# Subtrees that hold RQ directories, in display order. The chapter number in
# each dir name (e.g. "2.6-lean-validation") is an ordering label, NOT an id —
# the stable identity is the frontmatter `id:`. Renumbering is a pure rename.
RQ_TREES = [
    ("questions-claude", "Research Questions (Claude Code)"),
    ("questions-opencode", "Research Questions (OpenCode)"),
    ("questions-pi", "Research Questions (pi)"),
    ("questions-cursor-cli", "Research Questions (Cursor CLI)"),
    ("questions-cross", "Research Questions (cross-harness)"),
    ("workflow-dev", "Workflow Development"),
]


def chapter_key(name: str) -> tuple[int, ...]:
    """Sort key from the chapter prefix: '2.10-foo' -> (2, 10).

    Numeric per segment so '1.2' sorts before '1.10' (lexicographic would not).
    Non-numeric prefixes sort last.
    """
    head = name.split("-", 1)[0]
    try:
        return tuple(int(p) for p in head.split("."))
    except ValueError:
        return (9_999,)


def collect_rqs() -> list[dict]:
    """Walk all RQ subtrees (see RQ_TREES), parse frontmatter, findings,
    count runs. Dirs are returned tree by tree, chapter-sorted."""
    rqs = []
    for tree_name, tree_label in RQ_TREES:
        tree_dir = RESEARCH_DIR / tree_name
        if not tree_dir.is_dir():
            continue
        sub = sorted(
            (d for d in tree_dir.iterdir()
             if d.is_dir() and not d.name.startswith("_")),
            key=lambda d: chapter_key(d.name),
        )
        for rq_dir in sub:
            readme = rq_dir / "README.md"
            if not readme.is_file():
                continue
            fm = agg.parse_frontmatter(readme)
            cells = agg.expand_cells(fm)
            counts = bpl.count_runs_per_cell(cells)
            n_total = sum(counts.values())
            n_cells = len(cells)
            min_rep = int(fm.get("min_replicates", 1))
            n_full = sum(1 for v in counts.values() if v >= min_rep)
            coverage_pct = round(100 * n_full / n_cells) if n_cells else 0

            findings = parse_findings(rq_dir / "findings.md")

            rqs.append({
                "dir": rq_dir,
                "tree": tree_name,
                "tree_label": tree_label,
                "chapter": rq_dir.name.split("-", 1)[0],
                "id": fm.get("id", rq_dir.name),
                "question": fm.get("question", ""),
                "status": fm.get("status", ""),
                "min_replicates": min_rep,
                "n_cells": n_cells,
                "n_full": n_full,
                "n_runs": n_total,
                "coverage_pct": coverage_pct,
                "findings": findings,
                "fm": fm,
            })
    return rqs


def total_runs() -> int:
    n = 0
    for run_dir in agg.RUNS_DIR.iterdir():
        if (run_dir / "metrics.json").is_file():
            n += 1
    return n


# -----------------------------------------------------------------------
# Skeleton emission
# -----------------------------------------------------------------------

def emit_skeleton(rqs: list[dict], total: int, today: str) -> str:
    L: list[str] = []
    p = L.append

    p(f"# Experiment Overview: TDD Workflows × Models × Prompt Styles")
    p("")
    p(f"As of: {today}. Data basis: `experiments/runs/` ({total} runs total).")
    p("")
    p("**Author:** [Marco Emrich](https://www.linkedin.com/in/marco-emrich) "
      "(codecentric AG) — co-initiator of "
      "[EXACT Coding](https://leanpub.com/exact-coding) together with "
      "Ferdinand Ade.")
    p("")
    p("**Repository:** [github.com/marcoemrich/agentic_coding_lab]"
      "(https://github.com/marcoemrich/agentic_coding_lab) — all scripts, "
      "workflow definitions, run artifacts and the stylesheet are publicly "
      "versioned there.")
    p("")
    p("## About the Study")
    p("")
    p("<!-- TODO Claude: Two flowing paragraphs under this H2, written in ENGLISH. "
      "(Paragraph 1) The lab is the empirical validation platform for **EXACT Coding** "
      "(EXample-guided AI-Collaborative Test-driven Coding); link the book at "
      "<https://leanpub.com/exact-coding> (never a local manuscript path); "
      "workflow variants as a spectrum vibe coding (v1/v2) → EXACT (v4/v6) → delayed refactor (v8). "
      "(Paragraph 2) Snapshot status: date, run count, RQ count, current research front "
      "in descriptive form (never use workflow version names like v6.1 here — workflows are "
      "not yet introduced at this point; use a mechanism description instead, e.g. "
      "\"hybrid workflow with skill-based red/green in shared context + isolated "
      "refactor subagent\"), note any omitted workflow-dev RQs if data collection is ongoing. "
      "Style reference: research/reports/experiment-overview-v2-2026-05-04.md. -->")
    p("")
    p("### Scope")
    p("")
    p("<!-- TODO Claude: One paragraph under this H3, written in ENGLISH. Name the three-axis scope "
      "explicitly: (1) Harness — the agent CLIs actually used, with versions pinned from "
      "experiments/docker/Dockerfile, headless without HITL; (2) Models — the model families "
      "actually covered (Anthropic with/without thinking plus any third-party models routed "
      "via the gateway); (3) Target language — exclusively **TypeScript** with a fixed "
      "pnpm/tsx/Vitest/ESLint+SonarJS stack per run. "
      "Findings hold **for** this stack; transfer to other target languages "
      "(Python, Go, Java) or to interactive HITL setups is open and outside this scope. -->")
    p("")
    p("### AI Disclosure")
    p("")
    p("This snapshot was produced with the `/build-overview` skill in "
      "**Claude Code**. Data-driven sections — "
      "the RQ overview table, coverage values, per-RQ finding lists, reproducibility "
      "and files tables — are generated deterministically from "
      "`research/{questions-*,workflow-dev}/*/{README,findings}.md` via "
      "`experiments/generate-snapshot-skeleton.py`. Synthesis sections "
      "(intro, per-RQ paragraphs, cross-RQ synthesis, limitations) are LLM-drafted "
      "and human-curated. The generation is therefore fully "
      "traceable.")
    p("")
    p("## Key Findings")
    p("")
    p("<!-- TODO Claude: 3–5 numbered findings with the greatest practical value across "
      "the RQs, written in ENGLISH. Mandatory form per finding: **Title as a bold sentence.** then "
      "1–3 sentences with concrete numbers (verification_pct, cognitive_max, tokens) + "
      "a practical consequence. Cross-reference via §4/§5 rather than URLs. IMPORTANT: workflow version "
      "names (v6.1-hybrid etc.) are not yet introduced at this early point — "
      "describe the mechanism instead (e.g. \"hybrid workflow with skill-"
      "based red/green in shared context + isolated refactor subagent\" "
      "rather than \"v6.1-hybrid\"). The findings should give practitioners a one-minute answer "
      "to \"what do I take away from this study?\". -->")
    p("")
    p("---")
    p("")

    # 1. Research questions overview
    p("## 1. Research Questions Overview")
    p("")
    for tree_name, tree_label in RQ_TREES:
        tree_rqs = [r for r in rqs if r["tree"] == tree_name]
        if not tree_rqs:
            continue
        p(f"### {tree_label}")
        p("")
        p("| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |")
        p("|---|---|---|---|---:|---:|---:|")
        for rq in tree_rqs:
            p(f"| {rq['chapter']} "
              f"| [{rq['id']}]({rq['dir'].relative_to(REPO_ROOT)}/) "
              f"| {rq['question']} "
              f"| {rq['status']} "
              f"| {rq['n_cells']} "
              f"| {rq['n_full']}/{rq['n_cells']} ({rq['coverage_pct']} %) "
              f"| {rq['n_runs']} |")
        p("")
    p("---")
    p("")

    # 2. Experiment design
    p("## 2. Experiment Design")
    p("")
    p("### 2.1 Variables")
    p("")
    p("**Workflow** — six generations (details: `research/workflow-dev/workflow-construction.md` — inventory):")
    p("")
    p("| Workflow | Structure | TDD strictness |")
    p("|---|---|---|")
    p("| v1-oneshot                              | \"Implement X.\" | none |")
    p("| v2-iterative                            | \"Plan step by step, then implement.\" | none |")
    p("| v3-basic-tdd                            | Inline TDD, no skill/subagent (self-reporting) | minimal |")
    p("| v4-exact-subagents                      | Dedicated subagent per phase (predictor + red/green/refactor), fresh context | strict, multi-context |")
    p("| v4.1-testlist-scope-fix                 | v4 with test-list scope patch | strict, multi-context |")
    p("| v5-exact-single-context                 | All phases in one conversation, same phase script | strict, single-context |")
    p("| v5.1-testlist-scope-fix                 | v5 with test-list scope patch (aligned with v4.1) | strict, single-context |")
    p("| v6-hybrid                               | Hybrid: inline TDD + only refactor as subagent | strict, hybrid |")
    p("| v6.1-hybrid-testlist-scope-fix          | v6-hybrid with test-list scope patch (current default base) | strict, hybrid |")
    p("| v6.1-no-pep                             | v6.1 without pep talks (RQ-pep replication) | strict, hybrid |")
    p("| v7-hybrid-green-refactor                | Like v6, but green *and* refactor as subagent | strict, more isolation |")
    p("| v7.1-hybrid-green-refactor-testlist-scope-fix | v7 with test-list scope patch | strict, more isolation |")
    p("| v8a-delayed-refactor-agent              | Oneshot → tests added afterwards → single end-refactor agent (`refactor.md` from v6.5.4) | delayed-refactor |")
    p("| v8b-delayed-refactor-native             | Like v8a, but native inline refactor in v3 style, no agent | delayed-refactor |")
    p("")
    p("Configuration: `experiments/workflows/<variant>/.claude/agents/` and `.claude/rules/`. "
      "Archived variants (v5.1-minimized, v6.2–v6.6, v6.5.x audits) live under `experiments/workflows/_archive/`.")
    p("")
    p("**Workflow mechanics in detail.** The six generations are not merely a scale of "
      "\"more/less TDD\", but a systematic variation of the EXACT Coding building blocks "
      "(test list, red, green, refactor) and their context architecture:")
    p("")
    p("- **v1-oneshot / v2-iterative — vibe-coding baselines (no TDD).** A single agent reads "
      "the requirements and writes code in one step (v1) or with an explicit plan/checklist (v2); "
      "tests are only added afterwards based on the example mapping. Serves as the yardstick "
      "for the value of TDD itself (see `experiments/workflows/v1-oneshot/.claude/rules/experiment-mode.md`).")
    p("- **v3-basic-tdd — minimal TDD without structure.** A single agent with the minimal instruction "
      "\"use TDD\" — no phase prompts, no subagents. Claude decides on its own how to structure the "
      "TDD process. Measures how far a bare request carries "
      "(`v3-basic-tdd/.claude/rules/experiment-mode.md`).")
    p("- **v4-exact-subagents / v4.1-testlist-scope-fix — strict TDD, multi-context.** Every TDD phase "
      "runs as a specialized subagent in an **isolated context** (`Task(subagent_type: \"red\")` etc.): "
      "`test-list` → `red` → `green` → `refactor`. Hypothesis: isolated contexts enforce discipline, "
      "but can lose state between phases. v4.1 adds to the `test-list` subagent the obligation "
      "\"Cover every spec example\" — closing the dominant failure mode on novel katas "
      "(incomplete test list) on Opus 4.7.")
    p("- **v5-exact-single-context / v5.1-testlist-scope-fix — strict TDD, single-context.** Identical "
      "phase script to v4, but all phases run in the **same context** as skill calls "
      "(`Skill(skill: \"red\")` etc.) instead of subagents. Hypothesis: shared context preserves state, "
      "but can lead to loss of discipline. v5.1 mirrors v4.1 with the identical test-list scope patch.")
    p("- **v6-hybrid / v6.1-hybrid-testlist-scope-fix — hybrid with isolated refactor.** Red and green "
      "run inline as skills in the shared context (like v5), refactor runs as an isolated subagent (like v4). "
      "Hypothesis: combines the spec coherence of the single context with the discipline sharpening of "
      "subagent isolation at the most critical point (refactor). v6.1 is the current default base and "
      "champion across several RQs. `v6.1-no-pep` tests removing psychological rationales in red/green.")
    p("- **v7-hybrid-green-refactor / v7.1-…-testlist-scope-fix — hybrid with isolated green + refactor.** "
      "In addition to the refactor isolation from v6, green also runs as an isolated subagent. Test list and red "
      "remain in the shared context. Tests whether more isolation is automatically better (Pareto-dominated by v6 on "
      "game-of-life: saves tokens, loses quality and correctness).")
    p("- **v8a-delayed-refactor-agent / v8b-delayed-refactor-native — delayed-refactor control.** "
      "Three sequential phases without TDD cycles: (1) oneshot implementation, (2) tests added afterwards against "
      "`prompt.md` with a coverage obligation, (3) a single end refactor. v8a uses the `refactor.md` subagent "
      "from v6.5.4 (APP + naming + mandatory attempt), v8b a native inline refactor in v3 style without an agent. "
      "Serves as the control axis for the hypothesis \"periodic TDD refactor beats end refactor after "
      "vibe coding\".")
    p("")
    p("Deeper mechanics discussion, the inventory of the active v6.1 reduction line and the load-bearing RQ findings "
      "are in `research/workflow-dev/workflow-construction.md`. Which markers drive the parsing of the "
      "TDD metrics is documented in `experiments/workflows/MARKERS.md`. The archived "
      "v6.5.x line lives in `experiments/workflows/_archive/`.")
    p("")
    p("**Model × thinking** (lab variant IDs from `MODEL_CONFIGS` in `experiments/docker/run-batch.sh`):")
    p("")
    p("| Lab variant ID | API ID | Thinking | Routing |")
    p("|---|---|---|---|")
    p("| `opus-4-7`                       | `claude-opus-4-7`                              | Adaptive | Direct |")
    p("| `opus-4-7-no-thinking`           | `claude-opus-4-7`                              | off      | Direct |")
    p("| `sonnet-4-6`                     | `claude-sonnet-4-6`                            | Extended | Direct |")
    p("| `sonnet-4-6-no-thinking`         | `claude-sonnet-4-6`                            | off      | Direct |")
    p("| `haiku-4-5`                      | `claude-haiku-4-5-20251001`                    | Extended | Direct |")
    p("| `haiku-4-5-no-thinking`          | `claude-haiku-4-5-20251001`                    | off      | Direct |")
    p("| `opus-4-7-portkey`               | `@vertex-eu-global/anthropic.claude-opus-4-7`  | Adaptive | Portkey |")
    p("| `opus-4-7-portkey-no-thinking`   | `@vertex-eu-global/anthropic.claude-opus-4-7`  | off      | Portkey |")
    p("| `opus-4-6-portkey`               | `@vertex-ai/anthropic.claude-opus-4-6`         | Adaptive | Portkey |")
    p("| `opus-4-6-portkey-no-thinking`   | `@vertex-ai/anthropic.claude-opus-4-6`         | off      | Portkey |")
    p("| `sonnet-4-6-portkey`             | `@vertex-ai/anthropic.claude-sonnet-4-6`       | Extended | Portkey |")
    p("| `sonnet-4-6-portkey-no-thinking` | `@vertex-ai/anthropic.claude-sonnet-4-6`       | off      | Portkey |")
    p("| `haiku-4-5-portkey`              | `@vertex-ai/anthropic.claude-haiku-4-5@20251001` | Extended | Portkey |")
    p("| `haiku-4-5-portkey-no-thinking`  | `@vertex-ai/anthropic.claude-haiku-4-5@20251001` | off      | Portkey |")
    p("")
    p("Direct and Portkey routings of the same model are separate variants and only count as a shared cell "
      "via an explicit `controls.model: {any: [...]}` clause per RQ.")
    p("")
    p("**Kata × prompt style** (active katas in `experiments/katas/`):")
    p("")
    p("| Kata base | Prompt styles | Verification suite | Note |")
    p("|---|---|---|---|")
    p("| game-of-life      | prose, example-mapping, user-story | no   | Code quality, large (~40 LoC), vitest-based |")
    p("| game-of-life-cli  | prose, example-mapping, user-story | yes  | CLI variant with external acceptance suite |")
    p("| mars-rover        | prose, example-mapping, user-story | no   | medium (~30 LoC), vitest-based |")
    p("| claim-office      | prose, example-mapping, user-story | yes  | Correctness, novel insurance domain (HPSMV/MHPCO), 15 scenarios |")
    p("| claim-office-lite | prose, example-mapping, user-story | yes  | Reduced claim-office variant (10 scenarios) for code-quality research |")
    p("")
    p("Prompt styles:")
    p("- **prose**: description of the rules in prose, no test examples.")
    p("- **example-mapping**: rule + 1–3 concrete input/output examples per rule.")
    p("- **user-story**: \"As X I want Y so that Z\" — description without examples.")
    p("")
    p("### 2.2 Workflow → prompt mapping")
    p("")
    p("For methodological symmetry (see top-level `README.md`, section 'Methodology constraints'):")
    p("")
    p("| Workflow | Allowed prompt styles | Rationale |")
    p("|---|---|---|")
    p("| v1, v2 | prose only | Test examples in example-mapping would be a hidden test gift for non-TDD workflows → unfair towards the TDD workflows. |")
    p("| v3, v4(.1), v5(.1), v6(.1), v7(.1), v8a/b | all three | Examples serve as natural test cases — for TDD/refactor workflows that is the ideal form of the task. |")
    p("")
    p("---")
    p("")

    # 3. Methodology
    p("## 3. Methodology")
    p("")
    p("<!-- TODO Claude: check whether this is still current against experiments/docker/Dockerfile, "
      "experiments/analyze-run.sh, experiments/aggregate-by-query.py. If the "
      "pipeline is unchanged since the v2 snapshot, this block can be carried over "
      "verbatim. Write in ENGLISH. -->")
    p("")
    p("### 3.1 Run pipeline")
    p("")
    p("1. Container image `docker-batch` (Node 22 slim, claude-code 2.1.170 / opencode 1.15.10 / pi 0.81.1 / cursor-agent pinned) is started.")
    p("2. Run dir `runs/<timestamp>_<kata>_<workflow>_<model>/` is created; workflow config (`.claude/agents/`, `.claude/rules/`) and kata prompt (`prompt.md`) are copied into it.")
    p("3. pnpm workspace set up with TypeScript, Vitest, ESLint+SonarJS.")
    p("4. `claude --print \"$(< prompt.md)\"` runs headless, without HITL.")
    p("5. `analyze-run.sh` writes `metrics.json` and `analysis-report.md`.")
    p("6. `aggregate-by-query.py <RQ>/` builds `runs.csv` and `summary.md` per RQ.")
    p("")
    p("### 3.2 Collected metrics")
    p("")
    p("Binding terms (column \"Term\") are defined in the top-level `README.md` — "
      "alternative synonyms are forbidden because they collide or are ambiguous. "
      "Full metric table including external references (Stryker, SonarJS, McCabe paper "
      "etc.) in the README section \"Metrics\".")
    p("")
    p("**Correctness**")
    p("")
    p("| Metric | Term | What it measures | Direction |")
    p("|---|---|---|---|")
    p("| `tests_passing` | Correctness (internal) | Boolean: do the Vitest tests written by the agent pass at the end of the run? | `true` = better |")
    p("| `verification_pct` | Correctness (external) | Share of passed verification scenarios from an external acceptance suite the agent never gets to see (0.0–1.0). Only for CLI katas with a `<basename>-verification/` directory. | higher = better |")
    p("")
    p("**Efficiency**")
    p("")
    p("| Metric | Term | What it measures | Direction |")
    p("|---|---|---|---|")
    p("| `duration_seconds` | — | Wallclock seconds of the `claude --print` run including all subagent spawns | lower = better |")
    p("| `total_tokens` | — | Sum of all tokens (input + output + cache) across all subagent spawns | lower = better |")
    p("| `context_utilization_pct` | — | Final context-window utilization in the main context, in percent | informative |")
    p("")
    p("**Code Mass & size**")
    p("")
    p("| Metric | Term | What it measures | Direction |")
    p("|---|---|---|---|")
    p("| `code_mass` | Code Mass (APP) | Weighted sum of production-code constructs (constants, invocations, conditionals, loops, assignments — graded weights by complexity) per the *Absolute Priority Premise* (Micah Martin). Compares implementations more objectively than raw LoC. | lower = better |")
    p("| `cc_loc` | Production LoC | Production LoC excluding tests, from the clean-code reporter | lower = better (at equal correctness) |")
    p("| `test_lines` | Test LoC | Number of lines of test code (Vitest) | informative |")
    p("| `tests_total` | — | Number of tests written by the agent | informative |")
    p("")
    p("**Code quality (ESLint + SonarJS)**")
    p("")
    p("| Metric | Term | What it measures | Direction |")
    p("|---|---|---|---|")
    p("| `cc_longest_function` | Complexity Peak | Longest function in lines — proxy for the worst spot in the code | lower = better |")
    p("| `cc_avg_loc_per_function` | — | Mean function size in lines | lower = better |")
    p("| `cc_median_loc_per_function` | — | Median function size (robust against single long outliers) | lower = better |")
    p("| `cc_functions` | — | Number of functions | informative |")
    p("| `mccabe_max` / `mccabe_avg` / `mccabe_high_count` | — | McCabe cyclomatic complexity per function: maximum, mean, count above threshold. Classic branching metric. | lower = better |")
    p("| `cognitive_max` / `cognitive_avg` / `cognitive_high_count` | — | SonarSource cognitive complexity per function: weights nesting and control-flow breaks more heavily than McCabe, closer to humanly perceived complexity. The diagnostically load-bearing main metric of this study. | lower = better |")
    p("| `smell_total` | Smell Total | Aggregated number of ESLint+SonarJS violations across all rules | lower = better |")
    p("| `smell_complexity` | — | Subset of `smell_total`: cognitive-complexity, max-depth, max-lines-per-function, max-params, no-nested-switch | lower = better |")
    p("| `smell_magic_numbers` | — | Subset: ESLint `no-magic-numbers` violations | lower = better |")
    p("| `smell_duplication` | — | Subset: SonarJS `no-duplicate-string` and related duplication rules | lower = better |")
    p("| `smell_code_quality` | — | Subset: SonarJS `no-collapsible-if`, `no-redundant-jump` etc., plus ESLint `no-unreachable` | lower = better |")
    p("| `coverage_statements_pct` | — | Statement coverage of the tests written by the agent (in %) | higher = better |")
    p("| `coverage_branches_pct` | — | Branch coverage of the tests written by the agent (in %) | higher = better |")
    p("")
    p("**Test strength**")
    p("")
    p("| Metric | Term | What it measures | Direction |")
    p("|---|---|---|---|")
    p("| `mutation_score` | Mutation Score | Share of Stryker mutants killed by the agent's test suite (0.0–1.0): `(Killed + Timeout) / (Killed + Survived + Timeout + NoCoverage)`. Hidden metric — appears in no workflow prompt and is therefore Goodhart-resistant. Opt-in per RQ, only for `tests_passing = true`. | higher = better |")
    p("")
    p("**TDD discipline** (from `transcript.jsonl` + `transcript-subagents/`; driven by four "
      "markers in `experiments/workflows/MARKERS.md` — if a marker is missing, the corresponding "
      "metric silently drops to zero)")
    p("")
    p("| Metric | Term | What it measures | Direction |")
    p("|---|---|---|---|")
    p("| `cycle_count` | — | Number of red-green-refactor cycles per run | informative (higher = more finely decomposed) |")
    p("| `refactorings_applied` | — | Number of explicitly applied refactoring steps | higher = better (for TDD workflows) |")
    p("| `predictions_correct` / `predictions_total` | — | Red-phase predictions about compile/runtime failure: correct vs. total. Depth of the agent's code understanding. 1–2 predictions per cycle depending on workflow. | ratio higher = better |")
    p("| `tests_passed_immediately` | — | Number of tests already green in the red phase — indicator of over-implementation in previous green phases | lower = better |")
    p("| `avg_red_seconds` / `avg_green_seconds` / `avg_refactor_seconds` | — | Mean phase duration per cycle | informative |")
    p("")
    p("### 3.3 Evaluation principles")
    p("")
    p("- **Correctness first**: a run with `tests_passing=false` does not count as an equivalent solution.")
    p("- **Aggregate per kata**: workflow×model tables are formed exclusively per kata.")
    p("- **Effect threshold**: at n=1 per cell, only differences with a factor ≥ 2 or clearly separated σ bands are considered robust.")
    p("")
    p("---")
    p("")

    # 4. Results — per RQ, grouped by tree + chapter
    p("## 4. Results")
    p("")
    current_tree = None
    for rq in rqs:
        if rq["tree"] != current_tree:
            current_tree = rq["tree"]
            p(f"### {rq['tree_label']}")
            p("")
        rel = rq["dir"].relative_to(REPO_ROOT)
        p(f"#### {rq['chapter']} {rq['id']} — {rq['question']}")
        p("")
        p(f"_Data basis: {rq['n_runs']} runs · "
          f"Coverage: {rq['n_full']}/{rq['n_cells']} cells "
          f"({rq['coverage_pct']} %) at min_replicates={rq['min_replicates']}._")
        p("")

        p("**Findings**:")
        p("")
        for f in rq["findings"]:
            p(f"- **{f['id']}** — {f['title']}")
        if not rq["findings"]:
            p("- _No findings documented._")
        p("")
        p(f"<!-- TODO Claude: 60–100 words synthesizing this RQ's findings, written in ENGLISH. "
          f"Top finding in detail + optionally 1 caveat from the finding itself "
          f"(e.g. narrow data basis, only one kata) + reference to "
          f"`{rel}/findings.md`. Do NOT duplicate tables from findings.md. -->")
        p("")

    p("---")
    p("")

    # 5. Cross-RQ synthesis
    p("## 5. Cross-RQ Synthesis")
    p("")
    p("<!-- TODO Claude: 3–5 numbered points, written in ENGLISH, that emerge from several RQs "
      "together and appear in no single findings.md. Examples from the "
      "v2 snapshot: \"workflow choice matters more than model choice on large "
      "katas\", \"v5 is the practical sweet spot\", \"magic numbers dominate "
      "the smell signal\". The points should establish cross-RQ connections, "
      "not paraphrase individual findings. -->")
    p("")
    p("---")
    p("")

    # 6. Limitations
    p("## 6. Limitations")
    p("")
    p("<!-- TODO Claude: 5–8 bullet points, written in ENGLISH. Mandatory items: Anthropic models only, "
      "synthetic katas only, TypeScript only, headless without HITL, n ≤ 3 per "
      "cell. Optional: concrete coverage gaps from the RQ coverage values "
      "above (e.g. \"RQ-X at N % coverage\"). -->")
    p("")
    p("---")
    p("")

    # 7. Reproducibility
    p("## 7. Reproducibility")
    p("")
    p("All data and analysis scripts live in the repo:")
    p("")
    p("- `research/questions-{claude,opencode,cross}/*/README.md` and `research/workflow-dev/*/README.md` — RQ definitions (frontmatter with factors/controls/outcomes)")
    p("- `research/{questions-claude,questions-opencode,questions-cross,workflow-dev}/*/findings.md` — persistent finding lists")
    p("- `experiments/runs/*/metrics.json` — raw data per run")
    p("- `experiments/aggregate-by-query.py` — RQ-specific aggregation")
    p("- `experiments/batch-plan-from-rq.py` — batch-plan generation from RQ frontmatter")
    p("- `experiments/docker/Dockerfile` + `run-batch.sh` + `batch.sh` — container pipeline")
    p("- `experiments/analyze-run.sh` + `analyze_transcript.py` — run analysis")
    p("")
    p("Container pins: `claude-code@2.1.170`, `opencode-ai@1.15.10`, `@earendil-works/pi-coding-agent@0.81.1`, `pnpm@9.15.9` (see `experiments/docker/Dockerfile`).")
    p("")
    p("---")
    p("")

    # 8. Files
    p("## 8. Files")
    p("")
    p("| Path | Content |")
    p("|---|---|")
    for rq in rqs:
        rel = rq["dir"].relative_to(REPO_ROOT)
        p(f"| `{rel}/findings.md` | {rq['id']} — {rq['question']} |")
        runs_csv = rq["dir"] / "runs.csv"
        if runs_csv.is_file():
            p(f"| `{rel}/runs.csv` | {rq['id']} aggregated run metrics |")
    p("| `experiments/runs/` | All run directories with source, transcript, metrics |")
    p("")

    return "\n".join(L) + "\n"


# -----------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------

def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--out", type=Path, default=None,
        help="output path (default: /tmp/snapshot-skeleton-YYYY-MM-DD.md)",
    )
    args = parser.parse_args(argv)

    today = date.today().isoformat()
    out = args.out or Path(f"/tmp/snapshot-skeleton-{today}.md")

    rqs = collect_rqs()
    total = total_runs()

    skeleton = emit_skeleton(rqs, total, today)
    out.write_text(skeleton)

    print(f"Wrote {out}", file=sys.stderr)
    print(f"  RQs: {len(rqs)}", file=sys.stderr)
    print(f"  Runs total: {total}", file=sys.stderr)
    for rq in rqs:
        n_findings = len(rq["findings"])
        print(f"  {rq['id']}: {rq['n_runs']} runs, "
              f"{rq['n_full']}/{rq['n_cells']} cells, "
              f"{n_findings} findings",
              file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
