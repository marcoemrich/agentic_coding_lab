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

## Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.
