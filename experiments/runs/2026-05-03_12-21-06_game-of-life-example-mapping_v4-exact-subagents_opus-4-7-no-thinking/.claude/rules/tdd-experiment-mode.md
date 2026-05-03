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
