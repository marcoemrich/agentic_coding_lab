# TDD Experiment Mode (No HITL)

## Override for Automated Experiments

**This file overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously

## Autonomous Workflow

1. **Test List Phase** → Launch `test-list` agent
2. **For each test:**
   - **Red Phase** → Launch `red` agent
   - **Green Phase** → Launch `green` agent
   - **Refactor Phase** → Launch `refactor` agent
3. **Continue** until all tests implemented

## Shared Context Files

Subagents have no memory across calls. Two files persist context between
them and live in the run root:

- `example-mapping/<feature>.md` — created by `test-list`, read by `red`/`green`
- `tdd-journal.md` — created lazily by the first `red`/`green` call, appended
  by both. ONE line per phase (`N R | ...` for Red, `N G | ...` for Green)
  — kept terse on purpose so later reads stay cheap.

The `refactor` agent reads only the test files and the current
implementation source — refactoring depends on behavior contract (tests)
and current code, nothing else. Red/Green read the current `src/` files
to know which helpers already exist.

The orchestrator does NOT need to mention these files in the subagent launch
prompts — each agent's own definition mandates reading and writing the
relevant files. The launch prompts below stay minimal on purpose.

## Required Prompt Context for Each Agent

### test-list agent:
```
Feature: [feature name]
Test file: [path]
Implementation file: [path]
Requirements: [from Example Mapping]

EXPERIMENT MODE: Run autonomously, no HITL checkpoints.
```

### red agent:
```
Test file: [path]
Activate test: [test name]
Current state: [X tests passing]
Implementation file: [path]

EXPERIMENT MODE: Run autonomously, proceed to Green after completion.
You MUST output the full Step 7 block verbatim (both Compilation
Prediction and Runtime Prediction lines, each with Correct or
Incorrect). Do not abbreviate. Do not collapse the two prediction
lines into one.
```

### green agent:
```
Test file: [path]
Failing test: [test name]
Expected behavior: [description]
Current error: [error message]
Implementation file: [path]

EXPERIMENT MODE: Run autonomously, proceed to Refactor after completion.
```

### refactor agent:
```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [description]

EXPERIMENT MODE: Run autonomously, proceed to next test after completion.
```

## Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.
