# TDD Experiment Mode (No HITL)

## Override for Automated Experiments

**This file overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously
- Record all decisions and metrics
- Output a structured summary at the end

## Autonomous Workflow

1. **Test List Phase** → Launch `test-list` agent
2. **For each test:**
   - **Red Phase** → Launch `red` agent
   - **Green Phase** → Launch `green` agent
   - **Refactor Phase** → Launch `refactor` agent
3. **Continue** until all tests implemented
4. **Output** structured summary

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

## Metrics Collection

Each agent should report:
- Phase name
- Duration (start/end timestamps if possible)
- Predictions made (Red phase)
- Implementation approach (Green phase)
- Refactorings applied + mass change (Refactor phase)
- Test results

## Final Summary Format

After completing all tests, output:

```markdown
## TDD Experiment Summary

### Configuration
- Workflow: v1-subagents
- Kata: [name]
- Timestamp: [ISO date]

### Test List
[list of tests created]

### Cycle Details
| # | Test | Red Prediction | Green Approach | Refactor | Mass |
|---|------|----------------|----------------|----------|------|
| 1 | ... | ✅/❌ | ... | ... | ... |

### Final Metrics
- Total tests: [count]
- All passing: ✅/❌
- Final code mass: [number]
- Refactorings applied: [count]
- Prediction accuracy: [X/Y = %]

### Code
[Final implementation]

### Observations
[Any notable observations about the run]
```
