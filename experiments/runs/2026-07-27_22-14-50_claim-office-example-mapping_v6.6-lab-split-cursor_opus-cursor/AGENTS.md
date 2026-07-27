# Test-Driven Development (TDD) Rules -- Hybrid (v6.6, cursor)

<!-- LAB-ONLY:START -->
> **Lab-only content is fenced at the end of this file.** Everything
> between the `LAB-ONLY:START` / `LAB-ONLY:END` markers is measurement
> infrastructure for the agentic-coding-lab harness -- autonomous
> execution, the done-marker contract, and the phase-continuation fix.
> **To export this workflow for real-world use, delete that block.**
> Nothing above it is lab-specific.
<!-- LAB-ONLY:END -->

## CRITICAL: Mandatory Output Format

This workflow runs on **cursor-agent**. The `test-list`, `red` and `green`
phases are auto-loaded skill documents, not tool calls — read each SKILL.md
once and then follow its instructions directly. Because those phases produce no
tool call of their own, they are tracked by **text markers** in the assistant
output. Refactor and end-refactor are different: they run as **isolated
subagents** via the Task tool, so they are tracked by the tool call itself.

### Phase-Completion Markers Are MANDATORY

Every TDD phase MUST produce its marker. The skill phases emit a text heading;
the refactor phases are recognised by their subagent call. Missing markers
silently zero the corresponding metric, invalidating the data point.

| Phase     | Mandatory Marker                          | What the Parser Counts               |
|-----------|-------------------------------------------|--------------------------------------|
| Test List | `Test List Created` (or `Test List Phase Complete`) | test-list phase occurrence |
| Red       | `## Red` heading                          | red-phase cycle (`cycle_count`)      |
| Red       | `Red Phase Complete:` + prediction lines  | `predictions_correct`, `predictions_total` |
| Green     | `## Green` heading                        | green-phase occurrence               |
| Refactor  | Task call to the `refactor` subagent      | per-cycle refactoring                |
| End-Refactor | Task call to the `end-refactor` subagent | the final whole-src pass            |

**IMPORTANT**: emit every text marker as **assistant output text**, not only
inside private reasoning. Markers that appear only in a thinking/reasoning block
are not counted. State the `## Red` / `## Green` headings in your visible
response.

**Format for each Red phase output:**

```
## Red -- Test N: <test description>

<prediction and failure verification steps>

Red Phase Complete:
**Compilation Prediction**: <what you expect> Correct
**Runtime Prediction**: <what you expect> Correct

<Result summary>
```

The two prediction lines (`Compilation Prediction: ... Correct` / `Runtime Prediction: ... Correct`)
are **parsed mechanically**. You MUST output them verbatim with `Correct` or `Incorrect` at the end.
Do not abbreviate, summarize, or collapse them. Do not skip them when a test already passes --
in that case, write:

```
## Red -- Test N: <test description>

Test already passes -- no new failure to fix. Skipping green/refactor.
```

**Format for Green phase output:**

```
## Green -- <brief summary of what was added>
```

**Refactor phase output** is produced by the `refactor` subagent, not by you.
After it returns, read its report and continue with the next Red phase.

**Format for Test List phase output:**

```
Test List Created:

<test list details>
```

## Overview

This project follows strict Test-Driven Development practices using the Red-Green-Refactor cycle.
v6 keeps red and green in a shared context so the predictions, error messages, and minimal
implementations stay coherent -- then evaluates the resulting code in a dedicated refactor pass.

## Architecture: Auto-loaded Skills + Isolated Subagents

This workflow is a **hybrid**, exactly like the cc and pi variants:

- **`test-list`, `red`, `green`** -- Their SKILL.md files are auto-loaded as context.
  Read each SKILL.md **before the first use** of that phase, then follow its instructions
  directly in the main context. These three share state, so the test list, last error,
  and current implementation stay in working memory.
- **`refactor` and `end-refactor`** -- Run as **Task subagents with isolated context**.
  They live in `.cursor/agents/` and see only the current source and tests, not the
  red/green history. Hypothesis: refactoring benefits most from a fresh perspective
  free of implementation bias.

**Delegate the refactor phases — do not perform them yourself.** If you refactor
in the main context instead of calling the subagent, the workflow loses the
architectural separation that makes the hybrid work, and the refactor phase is
not counted.

Do NOT skip reading the skill files. Do NOT skip the mandatory markers.

### Which Mechanism to Use:

| Phase         | Mechanism                              | How to Execute                                              |
|---------------|----------------------------------------|-------------------------------------------------------------|
| Test List     | **Skill document** (main context)      | Read `.cursor/skills/test-list/SKILL.md`, follow its steps  |
| Red Phase     | **Skill document** (main context)      | Read `.cursor/skills/red/SKILL.md`, follow its steps        |
| Green Phase   | **Skill document** (main context)      | Read `.cursor/skills/green/SKILL.md`, follow its steps      |
| Refactor Phase| **Task subagent** (isolated context)   | Launch the `refactor` agent from `.cursor/agents/`           |
| End-Refactor  | **Task subagent** (isolated context)   | Launch the `end-refactor` agent from `.cursor/agents/`       |

## TDD Workflow

### 1. Test List Phase
**READ SKILL**: `.cursor/skills/test-list/SKILL.md`

Provide: feature, test file path, implementation file path, requirements.

The skill creates a comprehensive test list using `it.todo()` covering every rule and example from the specification.

**DO NOT** write the test list yourself. Follow the skill instructions and produce the `Test List Created:` marker.

<!-- LAB-ONLY:START -->
**DO NOT** end your turn after the test list. The moment the `Test List Created:`
marker is complete, continue in the same turn into the Red Phase for test 1
(read `red/SKILL.md`, produce `## Red`). See "Phase Continuation" in the
LAB-ONLY block at the end of this file -- the Test-List -> Red boundary is
where runs most often stall.
<!-- LAB-ONLY:END -->

### 2. Red Phase
**READ SKILL**: `.cursor/skills/red/SKILL.md`

Provide: test file path, which `it.todo()` to activate, current passing-test count, implementation file path.

The skill activates exactly ONE test, makes explicit predictions, and verifies failure.

**DO NOT** write test code yourself. Follow the skill instructions and produce the `## Red` and `Red Phase Complete:` markers with prediction lines.

### 3. Green Phase
**READ SKILL**: `.cursor/skills/green/SKILL.md`

Provide: test file path, failing test name, current error, implementation file path.

The skill implements minimal code to make the test pass -- hardcoded returns are fine for early tests.

**DO NOT** write implementation code yourself. Follow the skill instructions and produce the `## Green` marker.

### 4. Refactor Phase
**LAUNCH SUBAGENT**: the `refactor` agent from `.cursor/agents/refactor.md`

The subagent runs in an isolated context and has **no memory of red/green** —
everything it needs must be in the prompt you pass it:

```
Test file: src/<feature>.spec.ts
Implementation file: src/<feature>.ts
Passing tests: <count>
Recent Green phase: <one-line summary of what was just added>

Refactor the implementation while keeping all tests green.
```

The agent improves the implementation while keeping all tests green:
- MUST attempt at least one refactoring (or document why none is possible)
- Evaluate naming FIRST
- Apply the Four Rules of Simple Design (priority order)
- Calculate APP (Absolute Priority Premise) mass before/after

**DO NOT** refactor code yourself -- let the agent do it. After it returns,
read its report and proceed directly to the next Red phase.

### 5. Repeat
Return to step 2 (Red phase) for the next test.

### 6. End-Refactor (once, after the last green cycle)
**LAUNCH SUBAGENT**: the `end-refactor` agent from `.cursor/agents/end-refactor.md`

After the last per-cycle refactor returns and all tests pass, launch the
`end-refactor` agent exactly once. It covers the **whole production tree**
(`src/`, excluding `*.spec.ts`) using deterministic pre/post measurements:
ESLint smells + SonarJS cognitive complexity, plus APP mass and McCabe
cyclomatic complexity. It iterates one change at a time until no metric
improves further.

```
Implementation files: src/<all non-spec *.ts>
Test files: src/<*.spec.ts>
Passing tests: <count>

Run the final metric-driven refactoring pass over the whole src/.
Iterate ONE change at a time with pre/post measurement (ESLint, cognitive,
APP, McCabe). Stop when no metric improves further.
```

**DO NOT** refactor the whole `src/` yourself — delegate to the end-refactor
subagent. After it returns, read its report.

## Core TDD Principles

### TDD Mindset
TDD practices will feel counterintuitive:
- **Hardcoded returns feel "too simple"** -- This is correct!
- **The urge to implement ahead is strong** -- Resist this
- **Minimal steps feel inefficient** -- They actually accelerate development
- **Predictions feel unnecessary** -- They build crucial understanding

### Common TDD Failure Modes
- **MISSING OUTPUT MARKERS** -- The most critical failure mode.
  Every cycle MUST have `## Red` and `## Green` headings in visible output.
  Every Red cycle with a failing test MUST have `Red Phase Complete:` with prediction lines.
- **NOT DELEGATING THE REFACTOR PHASES** -- equally critical. Refactoring in the
  main context loses the isolated-context architecture and is not counted.
- Multiple active tests at once
- Implementing beyond what tests demand
- Skipping predictions
- Avoiding refactoring

## Technical Setup: TypeScript and Vitest

### TypeScript Conventions
- Use proper type annotations
- Leverage TypeScript's type checking during development
- Name files after their content
- Import with explicit `.js` extensions for local modules

### Test File Conventions
- Use `.spec.ts` extension for test files
- Place tests near implementation files
- Import test functions: `import { describe, it, expect } from "vitest"`

### Running Tests

Run tests with `pnpm test`.

### Example Test Template

The test list comes from the kata's specification -- do not add generic "validate input types" or "edge cases" tests unless the spec calls for them.

```typescript
// some-feature.spec.ts
import { describe, it, expect } from "vitest";
import { someFeature } from "./some-feature.js";

describe("Some Feature", () => {
  it.todo("[first behaviour from the spec]");
  it.todo("[second behaviour from the spec]");
});
```

## Workflow Sequence

1. **Test List Phase** -- Read skill, produce `Test List Created:` marker
2. **For each test:**
   - **Red Phase** -- Read skill, produce `## Red` and `Red Phase Complete:` with predictions
   - **Green Phase** -- Read skill, produce `## Green` marker
   - **Refactor Phase** -- Launch the `refactor` subagent, read its report
3. **Continue** until all tests are implemented and passing
4. **End-Refactor** -- Launch the `end-refactor` subagent once, over the whole `src/`

## Remember

- **ALWAYS PRODUCE THE MANDATORY MARKERS** -- `Test List Created:`, `## Red`, `Red Phase Complete:`, `## Green` -- in visible assistant output, not only in reasoning. Refactor and end-refactor are counted by their subagent call, not by a heading.
- **ALWAYS DELEGATE THE REFACTOR PHASES** -- launch the `refactor` / `end-refactor` agents from `.cursor/agents/`; never refactor in the main context.
- **The refactor subagents have no memory of red/green** -- pass them everything they need in the prompt.
- Follow skill content (test-list/red/green/refactor SKILL.md) for the actual work
- Trust the process -- discomfort is a signal you're doing it right

<!-- LAB-ONLY:START -->

## Lab-Only Execution Rules

> **This block is lab infrastructure, not TDD methodology.** Everything
> between `LAB-ONLY:START` and `LAB-ONLY:END` exists to make a run
> *measurable* and *unattended* inside the agentic-coding-lab harness.
>
> **To export this workflow for real-world use: delete this whole block.**
> Nothing outside it is lab-specific. Removing it drops the
> autonomous-execution mandate, the done-marker contract, and the
> phase-continuation fix — which is exactly what an interactive or
> human-in-the-loop setup wants.

### Autonomous Execution

The TDD cycle runs autonomously -- no human-approval gates between phases.
The measurement pipeline parses the output text for phase markers; user
prompts inserted between phases would split that sequence and produce
unattributable cycles.

When executing:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle without interruption

### Done Marker

When all tests are implemented and passing AND the end-refactor pass has
completed, write a file
`experiment-done.txt` with the single word `DONE` as its only content. Do
not write any other summary or report file.

This is **parser marker C7** -- see `experiments/workflows/MARKERS.md`.
Without it the run-driver cannot detect clean termination and the container
hits its timeout, flagging the run `exit_reason: timeout`.

### Phase Continuation

> **Origin:** on document-skill harnesses, some models (qwen, kimi, minimax) read a prose phase
> announcement ("Proceeding to Red phase") as a turn terminus and settle at
> the Test-List -> Red boundary. The run dies mid-flight with no error.
> This section is the fix. It is a workaround for a harness-specific
> parsing quirk, not a workflow advance -- it carries real prose cost (see
> RQ-lean / RQ-rules on added-instruction overhead), so it lives here in
> the droppable block rather than in the workflow proper.

This entire workflow -- Test List, then Red/Green/Refactor for every test,
through to writing `experiment-done.txt` -- is **one single autonomous
turn**. There are no human-approval gates and no natural stopping points
between phases.

A phase-completion line (e.g. "Test List Phase Complete", "Red Phase
Complete"), or a returning refactor subagent, is a **checkpoint, not a
terminus**. After it you MUST immediately continue with the next
phase's action in the same turn:

- After the **Test List** -> read `red/SKILL.md` and produce `## Red` for test 1.
- After **Red** -> read `green/SKILL.md` and produce `## Green`.
- After **Green** -> launch the `refactor` subagent.
- After the **refactor subagent returns** -> produce `## Red` for the next test.
- After the **last cycle** -> launch the `end-refactor` subagent once.

A returning subagent is the most tempting place to end a turn — its report
looks like a conclusion. It is not. Read it and start the next phase
immediately.

The only place your turn may end is **after** you have written
`experiment-done.txt` containing `DONE`. Ending the turn on a "Proceeding
to..." / "Next Step..." announcement -- without actually taking that step
-- is the single most common failure mode on this harness and invalidates
the run. Announcing an action is not doing it; always do it in the same turn.

**NEVER STOP AT A PHASE BOUNDARY** -- Test List -> Red -> Green -> refactor
subagent -> next Red all happen in one turn. The only turn-end is after
`experiment-done.txt` says `DONE`.

<!-- LAB-ONLY:END -->
