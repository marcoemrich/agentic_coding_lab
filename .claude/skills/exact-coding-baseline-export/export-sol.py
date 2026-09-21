#!/usr/bin/env python3
"""Export the promoted SOL/Predictive-TDD line to consumer harness trees."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import tempfile
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MATRIX = ROOT / "research/workflow-dev/model-recommendation-matrix.md"
WORKFLOWS = ROOT / "experiments/workflows"
DEFAULT_HARNESSES = ("cc", "pi", "oc", "cursor", "copilot")


def promoted_source() -> str:
    text = MATRIX.read_text()
    match = re.search(
        r"`(exact-ptdd-[^`]+)` is the universal EXACT Coding default on GPT-5\.6 SOL/pi", text
    )
    if not match:
        raise SystemExit("No promoted SOL default found in model-recommendation-matrix.md")
    return match.group(1)


def source_dir(name: str) -> Path:
    paths = json.loads((WORKFLOWS / "PATHS.json").read_text())
    aliases = json.loads((WORKFLOWS / "ALIASES.json").read_text())
    canonical = aliases.get(name, name)
    relative = paths.get(canonical)
    if not relative:
        raise SystemExit(f"Unknown workflow: {name}")
    result = WORKFLOWS / relative
    if not (result / ".pi").is_dir():
        raise SystemExit(f"SOL source has no .pi tree: {result}")
    return result


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if text.count(old) != 1:
        raise SystemExit(f"SOL export anchor {label!r} occurs {text.count(old)} times")
    return text.replace(old, new)


def consumer_predictive(text: str, hitl_path: str) -> str:
    text = replace_once(
        text,
        'Open the phase with the `## Red` marker (see "Mandatory output markers" below), then inspect',
        "Inspect",
        "predictive red marker",
    )
    text = replace_once(
        text,
        "Close the phase with the `Red Phase Complete:` block and both prediction lines.",
        f"After comparing the prediction with reality, consult `{hitl_path}` and apply the Red checkpoint for the active Autonomy Level.",
        "predictive red close",
    )
    text = replace_once(text, "Open the phase with the `## Green` marker. ", "", "green marker")
    text = replace_once(
        text,
        "**In this workflow the refactoring runs in this context.** Open the phase with\nthe `## Refactor` marker (see below) and emit it also when the review concludes\nthat no refactoring improves the code.",
        f"**The invoking EXACT Coding profile selects the Refactor execution context.** Apply the Four Rules and domain-boundary contract through that profile's inline or isolated mechanism. After the review, consult `{hitl_path}` and apply the Refactor checkpoint for the active Autonomy Level, including when no change improves the code.",
        "refactor marker",
    )
    start = text.index("## Mandatory output markers\n")
    end = text.index("## Prediction mismatch\n", start)
    text = text[:start] + text[end:]
    text = replace_once(
        text,
        "2. Stop feature implementation.\n3. Use the smallest deterministic check",
        f"2. Stop feature implementation and consult `{hitl_path}`. Unless the Autonomy Level is `autonomous`, report the discrepancy and wait for the human's decision.\n3. Use the smallest deterministic check",
        "prediction mismatch HITL",
    )
    return text


def consumer_test_list(text: str, hitl_path: str) -> str:
    # v1.6+ has an independent-dimensions cross-check and its summary is Step 6.
    # Preserve that validated product content; replace only the lab continuation.
    if "### Step 7: Continue the Workflow\n" in text:
        start = text.index("### Step 7: Continue the Workflow\n")
        end = text.index("## Important Guidelines\n", start)
        replacement = f'''### Step 7: Verify the Inactive List and Apply the HITL Checkpoint

Predict and run the full suite. Continue only when the inactive list leaves the
suite green; correct the list without implementing behavior if it does not.
Then consult `{hitl_path}`. Apply the Test-List checkpoint for the active
Autonomy Level and wait for explicit approval when required; otherwise continue
to the first Predictive TDD cycle.

'''
        return text[:start] + replacement + text[end:]

    start = text.index("### Step 5: Provide Summary\n")
    end = text.index("## Important Guidelines\n", start)
    replacement = f'''### Step 5: Provide Summary

After creating the test list, provide this summary:

```
Test List Created:
**Feature**: [feature name]
**Test File**: [test file path]
**Tests**: [count]

**Test Cases** (ordered simple -> complex):
1. [first test description]
2. [second test description]
3. [third test description]
...
```

### Step 6: Verify the Inactive List and Apply the HITL Checkpoint

Predict and run the full suite. Continue only when the inactive list leaves the
suite green; correct the list without implementing behavior if it does not.
Then consult `{hitl_path}`. Apply the Test-List checkpoint for the active
Autonomy Level and wait for explicit approval when required; otherwise continue
to the first Predictive TDD cycle.

'''
    return text[:start] + replacement + text[end:]


def refactor_delegation(harness: str) -> str:
    """How the isolated profile tells the main context to delegate the Refactor phase."""
    return {
        "cc": "through the Agent tool with `subagent_type: refactor`",
        "cursor": "through the Task tool with the `refactor` custom agent",
        "copilot": "through the `refactor` custom agent",
        "pi": "through the `subagent` tool with `agent: refactor` and `agentScope: both`",
        "oc": "through the Task tool with the `refactor` custom agent",
    }[harness]


def exact_coding_skill(config: str, hitl_path: str, source: str, domain_boundary: bool,
                       isolated: bool = False, harness: str = "cc") -> str:
    boundary_intro = (
        " Refactoring also applies a domain-responsibility review and a mandatory "
        "concrete boundary trial whenever it finds a credible semantic seam."
        if domain_boundary
        else ""
    )
    boundary_step = (
        "\n   - perform the mandatory domain-boundary trial and retain or narrowly undo it based on semantic and test evidence,"
        if domain_boundary
        else ""
    )
    refactor_step = (
        f"after every Green, delegate the Four Rules review {refactor_delegation(harness)}; "
        "invoke it even when Green changed no production code"
        if isolated
        else "review and refactor inline under the Four Rules"
    )
    subagent_note = (
        "\n\nThe subagent never manages checkpoints or waits for the user. The main "
        "context reads its report, verifies Green, and applies the shared Refactor checkpoint."
        if isolated
        else ""
    )
    name = "exact-coding-isolated-refactor" if isolated else "exact-coding"
    title = (
        "# EXACT Coding — Predictive TDD v1 — Isolated Refactor"
        if isolated
        else "# EXACT Coding — Predictive TDD v1"
    )
    if isolated:
        intro = (
            f"Refactoring uses the Four Rules of Simple Design in an isolated subagent."
            f"{boundary_intro} This profile deliberately has no APP calculation or "
            "metric-driven end pass."
        )
    else:
        intro = (
            f"Refactoring uses the Four Rules of Simple Design inline.{boundary_intro} This\n"
            "line deliberately has no APP calculation, metric-driven end pass, or refactor\n"
            "subagent."
        )
    return f'''---
name: {name}
description: Predictive Test-Driven Development with a complete up-front test list, falsifiable predictions before deterministic checks, one-test Red-Green-Refactor cycles, domain-responsibility review, and configurable human checkpoints. Invoke when the user explicitly asks for TDD or Predictive TDD. Do NOT invoke for ordinary coding tasks where TDD was not requested.
---

{title}

This is the consumer form of the universal EXACT Coding Predictive-TDD line. It runs in
one shared context: Test List once, then one-test Red-Green-Refactor cycles.
{intro}

## Preparation

1. Read `{config}/skills/test-list/SKILL.md`.
2. Read `{config}/skills/predictive-tdd/SKILL.md`.
3. Determine the project's language and test framework. Read the matching file
   under `{config}/skills/predictive-tdd/stacks/` before changing code.
4. Read the complete specification and establish the applicable baseline gates.

Do not assume TypeScript or Vitest from this orchestration file. Concrete
inactive-test syntax, examples, paths, commands, compiler behavior, and quality
tools belong only to the selected stack profile.

## Sequence

1. Create the complete ordered test list with every future behavior inactive,
   then predict and verify that the inactive list leaves the full suite green.
2. Apply the Test-List checkpoint from `{hitl_path}`.
3. For exactly one behavior at a time, follow the Predictive TDD skill:
   - activate one behavior and reach behavioral Red,
   - state falsifiable predictions before deterministic checks and compare them
     explicitly with reality,
   - apply the Red checkpoint,
   - reach Green with the smallest production change,
   - {refactor_step},{boundary_step}
   - apply the Refactor checkpoint.
4. Continue until every listed behavior is executable and all applicable gates
   from the active stack profile pass.

A test already satisfied by an earlier generalization is legitimate evidence.
Confirm it and do not manufacture a failure or production change.

## Method boundary

This is Predictive TDD, not TCR. Do not create phase commits or use a hard reset
as a phase mechanism. Preserve successful work in the working tree. If a
refactoring trial fails a check or does not improve intent, undo only that trial
before continuing.{subagent_note}

## Human-in-the-loop

`{hitl_path}` is the single source of truth for checkpoints. Its default
`full-hitl` level stops after Test List, Red, and Refactor, and whenever a
prediction is wrong. Green has no default stop.

## Provenance

Exported from the promoted `{source}` workflow. The methodology was validated
on GPT-5.6 SOL with pi. Other harness trees are
mechanical ports of the same files, not claims of cross-harness validation.
'''


def optional_skills(harness: str) -> dict[str, str]:
    """Step 2b: the two user-invoked skills that are not phases of the workflow.

    `end-refactor` is a manual extra, never invoked automatically and never
    wired into the orchestration; `example-mapping` is the requirements
    conversation that runs before the loop. cc keeps the AskUserQuestion and
    slash-command wording; every other harness gets the neutral port.
    """
    templates = Path(__file__).parent / "templates/optional-skills"
    mapping = "example-mapping-cc.md" if harness == "cc" else "example-mapping-neutral.md"
    return {
        "skills/end-refactor/SKILL.md": (templates / "end-refactor.md").read_text(),
        "skills/example-mapping/SKILL.md": (templates / mapping).read_text(),
    }


PHASE_SKILLS = ("red", "green", "refactor")


def phase_control_skills(config: str, hitl_path: str, harness: str) -> dict[str, str]:
    """Step 2c: `red`, `green`, `refactor` as single-phase manual controls.

    These carry no method content. Each one names the section of
    `predictive-tdd/SKILL.md` that governs it, states which phase boundary it
    stops at, and adds the one thing a manual invocation needs and the full
    cycle does not: that the invocation itself is the checkpoint, so the phase
    must not run on into the next one regardless of Autonomy Level.
    """
    templates = Path(__file__).parent / "templates/phase-skills"
    execution_context = (
        "Both refactor profiles ship in this tree. If the human named the "
        f"isolated profile, delegate the review {refactor_delegation(harness)} and "
        "verify Green before applying the checkpoint yourself; otherwise refactor "
        "inline in this context."
    )
    out = {}
    for phase in PHASE_SKILLS:
        # `refactor` would collide with the subagent template's name.
        filename = "refactor-phase.md" if phase == "refactor" else f"{phase}.md"
        body = (templates / filename).read_text()
        body = body.replace("{config}", config).replace("{hitl}", hitl_path)
        body = body.replace("{execution_context}", execution_context)
        out[f"skills/{phase}/SKILL.md"] = body
    return out


def hitl(config: str) -> str:
    return '''# Human-in-the-Loop (HITL)

This file is the single source of truth for Predictive TDD checkpoints.

## Autonomy Level

**Current setting:** `full-hitl`

| Level | Stops after |
|---|---|
| `full-hitl` | Test List, Red, Refactor, and prediction mismatch |
| `refactor-only` | Refactor and prediction mismatch |
| `red-only` | Red and prediction mismatch |
| `every-n-tests N` | Every N completed cycles and prediction mismatch |
| `task-end` | End of task; prediction mismatches are reported but do not stop |
| `autonomous` | Never |

Green has no default checkpoint because it is the most mechanical phase.

At a required checkpoint, summarize the evidence and wait for explicit human
approval. After Test List, show the ordered inactive behaviors. After Red, show
the active behavior, prediction, actual result, and why the failure is the
intended behavioral Red. After Refactor, name the Four Rules decision, any
change made, and the passing gates.

When a prediction is wrong, preserve predicted and actual outcomes, stop feature
implementation, and ask whether to investigate or continue. Only `autonomous`
may investigate and resume without waiting.
'''


def readme(source: str, stamp: str, harnesses: tuple[str, ...], domain_boundary: bool) -> str:
    boundary_summary = (
        " It treats domain language as the semantic anchor, tests independently "
        "changing policies with a concrete boundary trial, and keeps or narrowly "
        "undoes the result based on semantic and behavioral evidence."
        if domain_boundary
        else ""
    )
    validation = (
        "Validated on `gpt-5-6-sol-codex` with pi and native Opus 5 with "
        "Claude Code in `RQ-test-list-dimensions-replication` (n=10 per "
        "workflow and platform cell on Claim Office)."
        if source == "exact-ptdd-v1-pi"
        else "Validated on `gpt-5-6-sol-codex` with pi in "
        "`RQ-stack-profile-extraction-sol` (20/20 fresh runs internally and "
        "externally correct)."
    )
    rows = {
        "cc": "| Claude Code | `.claude/` | `/exact-coding` or ask for EXACT Coding |",
        "pi": "| pi | `.pi/` | `/skill:exact-coding` or ask for EXACT Coding |",
        "oc": "| OpenCode | `.opencode/` | `/exact-coding` |",
        "cursor": "| Cursor | `.cursor/` | `/exact-coding` or ask for EXACT Coding |",
        "copilot": "| GitHub Copilot | `.github/` | `/exact-coding` or ask for EXACT Coding |",
    }
    table = "\n".join(rows[h] for h in harnesses)
    return f'''# EXACT Coding — Predictive TDD v1 — {stamp}

Consumer-ready export of `{source}`, the universal maintained EXACT Coding
Predictive-TDD line.

| Harness | Directory | Invocation |
|---|---|---|
{table}

The workflow creates a complete test list, then runs one-test Predictive
Red-Green-Refactor cycles in one shared context. Before every deterministic
check it states a falsifiable prediction and compares it with reality.
Refactoring is inline and follows the Four Rules of Simple Design.{boundary_summary}
The loop itself has no APP mass objective, no metric-driven end pass, and no
refactor subagent.

### Manual extra: `end-refactor` (not part of the workflow)

> **You have to start this yourself. The workflow never runs it.**

Every subtree ships `skills/end-refactor/SKILL.md`: a measured cleanup across
the whole `src/` (ESLint smells, cognitive complexity, McCabe, APP mass, one
change at a time). Ask for it by name when a piece of work is finished and you
want more than the inline per-cycle refactor. It is deliberately outside the
loop — it costs noticeably more time and tokens, and Predictive TDD does not
depend on it.

### Manual phase control: `red`, `green`, `refactor`

Invoking `exact-coding` runs the whole loop, stopping only where the Autonomy
Level says to. When you want to drive the cycle yourself, one phase per turn,
invoke the phases by name instead:

| Skill | Runs | Stops |
|---|---|---|
| `red` | Activate one behavior, predict, reach behavioral Red | Before any production change |
| `green` | Smallest production change that satisfies the active test | Before refactoring |
| `refactor` | Four Rules review, domain-responsibility review, boundary trial | Before the next behavior |

These carry no method of their own. Each one points at its section of
`skills/predictive-tdd/SKILL.md` and at the shared human-in-the-loop file, so
the rules you get are the same rules the full loop applies — predictions,
mismatch handling, and the boundary trial included. The one thing they add is
that your invocation *is* the checkpoint: a phase never runs on into the next
one, even at an Autonomy Level that would not have stopped there. Mix freely with
`exact-coding` — the phases read and leave the ordinary working tree, with no
phase commits.

### Optional: Example Mapping before the loop

Every subtree also ships `skills/example-mapping/SKILL.md`, a conversation that
collects business rules and concrete examples before any test is written. It
feeds the test list; it is not a phase of the cycle and is never invoked
automatically.

Language and tool details live exclusively in the profiles under
`skills/predictive-tdd/stacks/`; orchestration and method files are stack-neutral.
The export currently includes TypeScript/Vitest, Java/JUnit 5/Maven and
Python/pytest profiles.
It removes experiment-specific autonomy,
completion, and measurement content, restores configurable human checkpoints, and gates
the workflow behind explicit invocation.

{validation} Other harness directories are semantic distribution ports and
have not yet been validated as independent cross-harness experiment cells.

## Credits

The Guessing Game and Predictive TDD approach used here is inspired by
[Ted M. Young's Predictive TDD and TDD Game](https://tdd.cards/) and
[Jon Jagger's cyber-dojo](https://cyber-dojo.org/).
'''


def write_harness(target: Path, harness: str, predictive: str, test_list: str, stacks: dict[str, str], stamp: str, source: str, subagent_extension: Path | None = None) -> None:
    names = {"cc": ".claude", "pi": ".pi", "oc": ".opencode", "cursor": ".cursor", "copilot": ".github"}
    config = names[harness]
    root = target / config
    hitl_path = {
        "cc": ".claude/skills/exact-coding-shared/human-in-the-loop.md",
        "pi": ".pi/skills/exact-coding-shared/human-in-the-loop.md",
        "copilot": ".github/skills/exact-coding-shared/human-in-the-loop.md",
        "oc": ".opencode/skills/exact-coding-shared/human-in-the-loop.md",
        "cursor": ".cursor/skills/exact-coding-shared/human-in-the-loop.md",
    }[harness]
    pred = consumer_predictive(predictive, hitl_path)
    tests = consumer_test_list(test_list, hitl_path)
    domain_boundary = (
        "## Mandatory domain-boundary trial" in predictive
        and "#### Domain responsibility review" in predictive
    )
    body = exact_coding_skill(config, hitl_path, source, domain_boundary, harness=harness)
    isolated_body = exact_coding_skill(
        config, hitl_path, source, domain_boundary, isolated=True, harness=harness
    )

    phase_skills = {
        "skills/predictive-tdd/SKILL.md": pred,
        "skills/test-list/SKILL.md": tests,
    }
    manual_phases = phase_control_skills(config, hitl_path, harness)
    for rel, content in {**phase_skills, **optional_skills(harness), **manual_phases}.items():
        path = root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
    for filename, content in stacks.items():
        path = root / "skills/predictive-tdd/stacks" / filename
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)

    # The HITL file is shared by both refactor profiles.
    (root / "skills/exact-coding-shared").mkdir(parents=True, exist_ok=True)
    (root / "skills/exact-coding-shared/human-in-the-loop.md").write_text(hitl(config))

    if harness == "oc":
        # OpenCode exposes both profiles as commands rather than skill dirs.
        strip = lambda s: re.sub(r"\A---\n.*?\n---\n", "", s, count=1, flags=re.S)
        config_json = {
            "$schema": "https://opencode.ai/config.json",
            "command": {
                "exact-coding": {
                    "description": "Run EXACT Coding Predictive TDD with inline refactoring.",
                    "template": strip(body),
                },
                "exact-coding-isolated-refactor": {
                    "description": "Run EXACT Coding Predictive TDD with an isolated refactor agent after every Green.",
                    "template": strip(isolated_body),
                },
            },
        }
        # A skill directory is not an invocation mechanism on OpenCode, so the
        # manual phase controls need command entries of their own.
        phase_descriptions = {
            "red": "Run only the Red phase: activate one behavior and reach a predicted behavioral Red.",
            "green": "Run only the Green phase: the smallest production change that satisfies the active test.",
            "refactor": "Run only the Refactor phase: Four Rules review, domain-responsibility review, boundary trial.",
        }
        for phase in PHASE_SKILLS:
            config_json["command"][phase] = {
                "description": phase_descriptions[phase],
                "template": strip(manual_phases[f"skills/{phase}/SKILL.md"]),
            }
        (root / "opencode.json").write_text(json.dumps(config_json, indent=2) + "\n")
    else:
        for skill_name, content in (
            ("exact-coding", body),
            ("exact-coding-isolated-refactor", isolated_body),
        ):
            (root / "skills" / skill_name).mkdir(parents=True, exist_ok=True)
            (root / "skills" / skill_name / "SKILL.md").write_text(content)

    # The refactor subagent backs the isolated profile on every harness.
    agent_name = "refactor.agent.md" if harness == "copilot" else "refactor.md"
    (root / "agents").mkdir(parents=True, exist_ok=True)
    (root / "agents" / agent_name).write_text(
        (Path(__file__).parent / "templates/refactor-agent.md").read_text()
    )

    # pi has no native subagent mechanism; the isolated profile needs the extension.
    if harness == "pi" and subagent_extension is not None:
        shutil.copytree(subagent_extension, root / "extensions/subagent", dirs_exist_ok=True)

    (root / "VERSION").write_text(stamp + "\n")


def validate(target: Path, harnesses: tuple[str, ...]) -> None:
    leaked = re.compile(
        r"LAB-ONLY|experiment-done|measurement pipeline|predictions_correct|predictions_total|cycle_count|refactorings_applied|What the Parser Counts|parsed mechanically|Run autonomously",
        re.I,
    )
    for path in target.rglob("*"):
        if path.is_file() and path.suffix in {".md", ".mdc", ".json"}:
            match = leaked.search(path.read_text())
            if match:
                raise SystemExit(f"Lab wording {match.group()!r} leaked into {path}")
    # Every profile the distribution promises. The collection step globs
    # *.md, so a new stack is picked up automatically — this tuple is what
    # makes a MISSING one fail the export instead of shipping silently.
    required_stacks = (
        "typescript-vitest.md", "java-junit-maven.md", "python-pytest.md")
    required_optional = ("skills/end-refactor/SKILL.md", "skills/example-mapping/SKILL.md")
    for harness in harnesses:
        config = {"cc": ".claude", "pi": ".pi", "oc": ".opencode", "cursor": ".cursor", "copilot": ".github"}[harness]
        for filename in required_stacks:
            stack = target / config / "skills/predictive-tdd/stacks" / filename
            if not stack.is_file():
                raise SystemExit(f"Missing stack profile: {stack}")
        # Step 2b: both user-invoked skills ship in every subtree.
        for rel in required_optional:
            skill = target / config / rel
            if not skill.is_file():
                raise SystemExit(f"Missing optional skill: {skill}")
        # Step 2c: the three manual phase controls ship, carry no method of their
        # own, and never run on into the next phase.
        for phase in PHASE_SKILLS:
            skill = target / config / "skills" / phase / "SKILL.md"
            if not skill.is_file():
                raise SystemExit(f"Missing manual phase control: {skill}")
            body = skill.read_text()
            if "manual phase control, not a separate method" not in body:
                raise SystemExit(f"Phase control {phase} lost its manual-control framing: {config}")
            if f"{config}/skills/predictive-tdd/SKILL.md" not in body:
                raise SystemExit(f"Phase control {phase} no longer defers to the method file: {config}")
            if "that invocation is the checkpoint" not in body:
                raise SystemExit(f"Phase control {phase} lost its stop-after-one-phase rule: {config}")
            if "{config}" in body or "{hitl}" in body or "{execution_context}" in body:
                raise SystemExit(f"Phase control {phase} has an unfilled placeholder: {config}")
        # end-refactor is a manual extra: no agent file, no orchestration call.
        if (target / config / "agents/end-refactor.md").exists():
            raise SystemExit(f"end-refactor must not ship as an agent: {config}")
        # Both refactor profiles ship, over one shared HITL file, backed by the agent.
        shared = target / config / "skills/exact-coding-shared/human-in-the-loop.md"
        if not shared.is_file():
            raise SystemExit(f"Missing shared human-in-the-loop file: {shared}")
        agent = target / config / (
            "agents/refactor.agent.md" if harness == "copilot" else "agents/refactor.md"
        )
        if not agent.is_file():
            raise SystemExit(f"Missing refactor subagent: {agent}")
        if harness == "oc":
            commands = json.loads((target / config / "opencode.json").read_text())["command"]
            for key in ("exact-coding", "exact-coding-isolated-refactor", *PHASE_SKILLS):
                if key not in commands:
                    raise SystemExit(f"OpenCode is missing the {key} command")
                if "template" not in commands[key]:
                    raise SystemExit(f"OpenCode command {key} has no template")
        else:
            for profile in ("exact-coding", "exact-coding-isolated-refactor"):
                skill = target / config / "skills" / profile / "SKILL.md"
                if not skill.is_file():
                    raise SystemExit(f"Missing refactor profile: {skill}")
            isolated = (target / config / "skills/exact-coding-isolated-refactor/SKILL.md").read_text()
            if "isolated subagent" not in isolated:
                raise SystemExit(f"Isolated profile lost its subagent delegation: {config}")
            default = (target / config / "skills/exact-coding/SKILL.md").read_text()
            if "inline" not in default:
                raise SystemExit(f"Default profile is no longer the inline one: {config}")
        if harness == "pi" and not (target / config / "extensions/subagent/index.ts").is_file():
            raise SystemExit("pi export is missing the subagent extension")
        end_refactor = (target / config / "skills/end-refactor/SKILL.md").read_text()
        if "optional, manually invoked" not in end_refactor:
            raise SystemExit(f"end-refactor lost its manual-extra framing: {config}")
    oc = target / ".opencode/opencode.json"
    if oc.exists():
        data = json.loads(oc.read_text())
        assert "template" in data["command"]["exact-coding"]
        assert "provider" not in data and "permission" not in data and "instructions" not in data


def run_git(repo: Path, *args: str, capture: bool = False) -> str:
    result = subprocess.run(
        ["git", "-C", str(repo), *args],
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
    )
    return result.stdout.strip() if capture else ""


def sync_distribution(snapshot: Path, repo: Path, source: str, stamp: str) -> None:
    if not (repo / ".git").exists():
        raise SystemExit(f"Distribution repo is not a normal git checkout: {repo}")
    if run_git(repo, "status", "--porcelain", capture=True):
        raise SystemExit(f"Distribution repo is dirty: {repo}")
    current_branch = run_git(repo, "branch", "--show-current", capture=True)
    distribution_branches = {
        "main", "harness/pi", "harness/opencode", "harness/cursor", "harness/copilot"
    }
    if current_branch in distribution_branches:
        raise SystemExit("Detach HEAD or check out a non-distribution branch before sync")
    for key in ("user.name", "user.email"):
        if not run_git(repo, "config", "--get", key, capture=True):
            raise SystemExit(f"Distribution repo has no local {key}")

    section = (
        Path(__file__).parent
        / "templates/SOL-DISTRIBUTION-README-SECTION.template.md"
    ).read_text().replace("{{DATE}}", stamp).replace("{{SOURCE_WORKFLOW}}", source)
    variants = {
        "cc": ("main", "origin/main", ".claude"),
        "pi": ("harness/pi", "origin/harness/pi", ".pi"),
        "oc": ("harness/opencode", "origin/harness/opencode", ".opencode"),
        "cursor": ("harness/cursor", "origin/harness/cursor", ".cursor"),
        "copilot": ("harness/copilot", "origin/harness/copilot", ".github"),
    }
    available = {p.name for p in snapshot.iterdir() if p.is_dir()}
    for harness, (branch, initial_base, config) in variants.items():
        if config not in available:
            continue
        local_exists = subprocess.run(
            ["git", "-C", str(repo), "show-ref", "--verify", "--quiet", f"refs/heads/{branch}"]
        ).returncode == 0
        remote_exists = subprocess.run(
            ["git", "-C", str(repo), "show-ref", "--verify", "--quiet", f"refs/remotes/origin/{branch}"]
        ).returncode == 0
        with tempfile.TemporaryDirectory(prefix=f"exact-sol-{harness}-") as raw:
            worktree = Path(raw) / "worktree"
            if local_exists:
                run_git(repo, "worktree", "add", str(worktree), branch)
            else:
                base = f"origin/{branch}" if remote_exists else initial_base
                run_git(repo, "worktree", "add", "-b", branch, str(worktree), base)
            try:
                for old in (".claude", ".pi", ".opencode", ".cursor", ".github"):
                    shutil.rmtree(worktree / old, ignore_errors=True)
                shutil.copytree(snapshot / config, worktree / config)
                readme_path = worktree / "README.md"
                readme = readme_path.read_text()
                marker = "## Agent Configuration\n"
                if marker not in readme:
                    raise SystemExit(f"README marker missing on {branch}")
                readme_path.write_text(readme.split(marker, 1)[0] + section)
                run_git(worktree, "add", "-A")
                changed = subprocess.run(
                    ["git", "-C", str(worktree), "diff", "--cached", "--quiet"]
                )
                if changed.returncode != 0:
                    run_git(worktree, "commit", "-m", "feat(workflow): update SOL Predictive TDD distribution")
            finally:
                run_git(repo, "worktree", "remove", "--force", str(worktree))
    print(f"distribution={repo}")
    print("distribution_push=not-performed")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--source")
    parser.add_argument("--harness", action="append", choices=DEFAULT_HARNESSES)
    parser.add_argument("--target", type=Path)
    parser.add_argument("--force", action="store_true")
    parser.add_argument(
        "--sync-distribution",
        type=Path,
        help="Create or update the parallel sol/* branches in EXACT-Coding-Exercises; never pushes",
    )
    args = parser.parse_args()
    source = args.source or promoted_source()
    src = source_dir(source) / ".pi"
    harnesses = tuple(args.harness or DEFAULT_HARNESSES)
    target = args.target or ROOT / f"research/workflow-dev/export/exact-coding-ptdd-v1-{args.date}"
    if target.exists():
        if not args.force:
            raise SystemExit(f"Target exists: {target}; pass --force to replace")
        shutil.rmtree(target)
    target.mkdir(parents=True)

    predictive = (src / "skills/predictive-tdd/SKILL.md").read_text()
    test_list = (src / "skills/test-list/SKILL.md").read_text()
    stack_candidates = (
        src / "skills/predictive-tdd/stacks",
        src / "skills/exact-coding-ptdd/stacks",
    )
    stacks_dir = next((path for path in stack_candidates if path.is_dir()), None)
    if stacks_dir is None:
        checked = ", ".join(str(path) for path in stack_candidates)
        raise SystemExit(f"SOL source has no stack profile directory; checked: {checked}")
    stacks = {
        path.name: path.read_text() for path in sorted(stacks_dir.glob("*.md"))
    }
    if not stacks:
        raise SystemExit(f"SOL source has no stack profiles: {stacks_dir}")
    # The isolated-refactor profile's pi extension lives in the v1.1 sibling of the
    # promoted source (exact-ptdd-v1-pi -> exact-ptdd-v1.1-refactor-subagent-pi).
    subagent_extension = None
    if "pi" in harnesses:
        sibling = source.replace("-v1-pi", "-v1.1-refactor-subagent-pi")
        try:
            candidate = source_dir(sibling) / ".pi/extensions/subagent"
        except SystemExit:
            candidate = None
        if candidate is not None and candidate.is_dir():
            subagent_extension = candidate
        else:
            raise SystemExit(
                f"pi export needs the subagent extension for the isolated profile; "
                f"not found via {sibling}"
            )

    for harness in harnesses:
        write_harness(target, harness, predictive, test_list, stacks, args.date, source, subagent_extension)
    domain_boundary = (
        "## Mandatory domain-boundary trial" in predictive
        and "#### Domain responsibility review" in predictive
    )
    (target / "README.md").write_text(
        readme(source, args.date, harnesses, domain_boundary)
    )
    (target / "VERSION").write_text(args.date + "\n")
    validate(target, harnesses)
    if args.sync_distribution:
        sync_distribution(target, args.sync_distribution.resolve(), source, args.date)
    print(f"source={source}")
    print(f"target={target}")
    print("harnesses=" + ",".join(harnesses))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
