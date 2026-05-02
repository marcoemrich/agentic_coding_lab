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

After completing all tests, write `experiment-summary.md` with this exact structure:

```markdown
# TDD Experiment Summary

## Configuration
- **Workflow**: v4-exact-subagents
- **Kata**: [kata name]
- **Timestamp**: [YYYY-MM-DD]
- **Start time**: [ISO timestamp with timezone]

## Duration & Timings

### Total Duration
- **Total experiment time**: ~X minutes Y seconds (Z ms)

### Phase Timings

| Phase | Agent | Duration (ms) | Duration (s) |
|-------|-------|---------------|--------------|
| Test List | test-list | X | X.X |
| Cycle 1 - Red | red | X | X.X |
| Cycle 1 - Green | green | X | X.X |
| Cycle 1 - Refactor | refactor | X | X.X |
| Cycle 2 - Red | red | X | X.X |
| ... | ... | ... | ... |
| **Total** | | **X** | **X.X** |

### Token Usage by Phase

| Phase | Tokens Used |
|-------|-------------|
| Test List | X |
| Cycle 1 (R/G/R) | X + X + X = X |
| Cycle 2 (R/G/R) | X + X + X = X |
| ... | ... |
| **Total** | **X** |

### Context Utilization

**Context window size**: 200,000 tokens (Opus 4.6)

| Phase | Tokens Used | Context Remaining | Utilization |
|-------|-------------|-------------------|-------------|
| Test List | X | X | X% |
| Cycle 1 - Red | X | X | X% |
| Cycle 1 - Green | X | X | X% |
| Cycle 1 - Refactor | X | X | X% |
| ... | ... | ... | ... |
| **Main Context (end)** | X | X | X% |

**Note**: For v1-subagents, each agent starts with fresh context. Main context accumulates orchestration overhead only.

### Average Cycle Time
- **Average per TDD cycle**: ~X seconds (Red + Green + Refactor)
- **Average Red phase**: X seconds
- **Average Green phase**: X seconds
- **Average Refactor phase**: X seconds

## Test List
1. [test description 1]
2. [test description 2]
3. [test description 3]
4. [test description 4]

## Cycle Details

| # | Test | Red Prediction | Green Approach | Refactor | Mass |
|---|------|----------------|----------------|----------|------|
| 1 | [test name] | Expected X, Received Y (✅/❌) | [approach] | [changes or "No changes needed"] | X |
| 2 | [test name] | Expected X, Received Y (✅/❌) | [approach] | [changes or "No changes needed"] | X |
| ... | ... | ... | ... | ... | ... |

## Final Metrics
- **Total tests**: X
- **All passing**: ✅/❌
- **Final code mass**: X
- **Refactorings applied**: X (or "none — no opportunity identified")
- **Prediction accuracy**: X/X (correct / total predictions)

## Code

### Implementation (`src/[filename].ts`)
```typescript
[final implementation code]
```

### Tests (`src/[filename].spec.ts`)
```typescript
[final test code]
```

## Observations

1. **[Observation title]** - [Description of notable behavior or insight]

2. **[Observation title]** - [Description]

3. **[Observation title]** - [Description]
```
