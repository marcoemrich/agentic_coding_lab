# TDD Experiment Mode (No HITL) — Hybrid (v6)

## Override for Automated Experiments

**This file overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously

## Autonomous Workflow

1. **Test List Phase** → Invoke `/test-list` skill (main context)
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill (main context)
   - **Green Phase** → Invoke `/green` skill (main context)
   - **Refactor Phase** → Launch `refactor` Task subagent (isolated context)
3. **Continue** until all tests are implemented

## Required Prompt Context for the Refactor Subagent

The refactor subagent has no memory of the red/green phases. Pass everything it needs:

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]

EXPERIMENT MODE: Run autonomously, return after completion.
```

After the subagent returns, read its summary and proceed directly to the next Red phase.

## Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.
