# TDD Experiment Mode (No HITL)

## Override for Automated Experiments

**This file overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously

## Autonomous Workflow

1. **Test List Phase** → Invoke `/test-list` skill
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill
   - **Green Phase** → Invoke `/green` skill
   - **Refactor Phase** → Invoke `/refactor` skill
3. **Continue** until all tests implemented

## Done Marker

When all tests are implemented and passing, write a file `experiment-done.txt` with the single word `DONE` as its only content. Do not write any other summary or report file.
