# Predictive TDD -- Single Context (basic-sol-tdd, Claude Code)

## Origin

The methodology in this workflow comes from the `predictive-tdd` and
`test-list` skills of the `sol_tdd` project. It differs from the v4/v5/v6
line in three ways:

- **Predictions are prose, not a fixed template.** The discipline is
  "state a falsifiable expectation before every deterministic check", not
  "fill in a compilation/runtime form".
- **Refactoring is guided by the Four Rules of Simple Design only.**
  There is no APP mass calculation and no metric-driven end-refactor pass.
- **Red is defined behaviorally.** A valid Red fails because the active
  behavior is missing, for the predicted reason -- reaching compilation
  scaffold is a means to that end, not a phase of its own.

Two lab adaptations were made to the source skills: the human-in-the-loop
autonomy agreement was removed (the harness runs unattended), and the
mandatory output markers below were added so the phases become measurable.

## Architecture: One Command, One Context

- **`/predictive-tdd`** -- the full Red/Green/Refactor cycle in a single
  document. Invoke it **once** before the first cycle, then follow its
  instructions directly in the main context for every subsequent cycle.
- **`/test-list`** -- the up-front test list. Invoke it once before the
  first phase.
- **`stacks/typescript-vitest.md`** -- the stack profile. Read it before
  changing any code.
- **No per-phase commands.** Red, Green and Refactor are sections of one
  document, not separate invocations. This mirrors the source methodology,
  where the whole cycle is a single skill.
- **No subagents.** Every phase, refactoring included, runs in the main
  context. That is why the `## Refactor` heading is the only measurable
  signal for refactoring in this workflow.

Do NOT skip reading the command files. Do NOT skip the mandatory output markers.

| Phase      | Mechanism                          | How to Execute                                                    |
|------------|------------------------------------|-------------------------------------------------------------------|
| Test List  | **Command document** (main context) | Invoke `/test-list` once, follow its steps                        |
| Red        | **Command document** (main context) | `/predictive-tdd`, section "Reach behavioral Red"                 |
| Green      | **Command document** (main context) | same document, section "Reach Green minimally"                    |
| Refactor   | **Command document** (main context) | same document, section "Inspect and refactor"                     |

## CRITICAL: Mandatory Output Format

Because the whole cycle lives in **one** command, the measurement pipeline
**cannot count command invocations** to track cycles -- you invoke
`/predictive-tdd` once and then run many cycles from it. Instead, it relies on
**text markers** in the assistant output.

### Phase-Completion Markers Are MANDATORY

Every TDD phase MUST produce a specific text marker in your output.
These markers are mechanically parsed to compute `cycle_count`,
`predictions_correct_rate` and `refactorings_applied`. Missing markers
silently zero the corresponding metric, invalidating the data point.

| Phase     | Mandatory Output Marker                   | What the Parser Counts                     |
|-----------|-------------------------------------------|--------------------------------------------|
| Test List | `## Test List` heading + `Test List Created:` line | test-list phase occurrence |
| Red       | `## Red` heading                          | red-phase cycle (`cycle_count`)            |
| Red       | `Red Phase Complete:` + prediction lines  | `predictions_correct`, `predictions_total` |
| Green     | `## Green` heading                        | green-phase occurrence                     |
| Refactor  | `## Refactor` heading                     | `refactorings_applied`                     |

**Format for each Red phase output:**

```
## Red -- Test N: <test description>

<prediction and failure verification steps>

Red Phase Complete:
**Compilation Prediction**: <what you expected> ✅ Correct
**Runtime Prediction**: <what you expected> ✅ Correct

<result summary>
```

The two prediction lines are **parsed mechanically**. You MUST output them
verbatim with `✅ Correct` or `❌ Incorrect` at the end. Do not abbreviate,
summarize, or collapse them into one line.

These two lines are the mechanical form of the skill's core rule "compare
predicted and actual outcomes explicitly": an unexpected result is recorded
as `Incorrect` and then investigated, never rewritten as predicted.

The prose reasoning of the command stays as it is -- these lines are a summary
line per prediction, not a replacement for the prediction itself.

When the activated test already passes, write:

```
## Red -- Test N: <test description>

Test already passes -- no new failure to fix. No production change needed.
```

**Format for Green phase output:**

```
## Green -- <brief summary of what was added>
```

**Format for Refactor phase output:**

```
## Refactor -- <brief summary of what was improved, or "no improvement possible">
```

The `## Refactor` heading is the **only** signal for `refactorings_applied` in
this workflow -- refactoring happens in the main context, so there is no
subagent call to count. Omitting the heading silently zeros the metric. Emit
it also when the Four Rules review concludes that no refactoring improves the
code; in that case say so on the heading line.

**Format for Test List phase output:**

```
## Test List

Test List Created:
<test list details>
```

Both lines are required. The heading and the `Test List Created:` line are read
by different parsers; emitting only one of them loses the phase on the other.

## Workflow Sequence

1. **Preparation** -- Invoke `/predictive-tdd` and `/test-list`, read
   `.claude/skills/predictive-tdd/stacks/typescript-vitest.md`. Read the
   specification (`prompt.md`) completely. Establish the baseline gates.
2. **Test List Phase** -- Follow `/test-list`, produce `## Test List`
3. **For each test:**
   - **Red** -- activate exactly one behavior, predict, verify the behavioral
     failure; produce `## Red` and `Red Phase Complete:` with both prediction lines
   - **Green** -- smallest production change; produce `## Green`
   - **Refactor** -- Four Rules review, at most one refactoring at a time;
     produce `## Refactor`
   - **Close once** -- predict and run the full suite and the applicable gates
4. **Continue** until every test in the list is active and passing

Run all cycles from the single `/predictive-tdd` document -- do not re-invoke
it per cycle.

## Running Tests

Run tests with `pnpm test`. See the stack profile for the other gates.

## Common Failure Modes

- **MISSING OUTPUT MARKERS** -- the most critical failure mode in this
  workflow. Every cycle needs `## Red` and `## Green`; every Red cycle with a
  failing test needs `Red Phase Complete:` with both prediction lines; every
  refactor review needs `## Refactor`.
- Rewriting an unexpected result as predicted instead of recording `Incorrect`
- Multiple active tests at once
- Implementing beyond what the active test demands
- Reaching Red through a compilation error and stopping there, without driving
  it to the behavioral failure
- Refactoring without producing the `## Refactor` heading

## Remember

- **ALWAYS PRODUCE THE MANDATORY MARKERS** -- `## Test List`, `## Red`,
  `Red Phase Complete:`, `## Green`, `## Refactor`
- **`## Refactor` is the only refactor signal** -- there is no subagent in this
  workflow; without the heading `refactorings_applied` stays at zero
- Follow the command content for the actual work; this file defines only the
  architecture and the output contract
- Everything runs in one shared context -- no delegation, no isolated agents
