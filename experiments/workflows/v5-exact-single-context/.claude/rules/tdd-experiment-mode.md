# TDD Experiment Mode (No HITL)

## Override for Automated Experiments

**This file overrides human-in-the-loop requirements for automated experiment runs.**

When running experiments:
- Do NOT wait for human approval between phases
- Complete the full TDD cycle autonomously
- Record all decisions and metrics
- Output a structured summary at the end

## Autonomous Workflow

1. **Test List Phase** → Invoke `/test-list` skill
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill
   - **Green Phase** → Invoke `/green` skill
   - **Refactor Phase** → Invoke `/refactor` skill
3. **Continue** until all tests implemented
4. **Output** structured summary

## Metrics to Record

During each phase, track:
- Phase name
- Duration (start/end if measurable)
- Predictions made and accuracy (Red phase)
- Implementation approach (Green phase)
- Refactorings applied and mass changes (Refactor phase)
- Test results after each phase

## Final Summary Format

After completing all tests, write `experiment-summary.md` with this exact structure:

```markdown
# TDD Experiment Summary

## Configuration
- **Workflow**: v5-exact-single-context
- **Kata**: [kata name]
- **Timestamp**: [YYYY-MM-DD]
- **Start time**: [ISO timestamp with timezone]

## Duration & Timings

### Total Duration
- **Total experiment time**: ~X minutes Y seconds (Z ms)

### Phase Timings

| Phase | Skill | Duration (ms) | Duration (s) |
|-------|-------|---------------|--------------|
| Test List | /test-list | X | X.X |
| Cycle 1 - Red | /red | X | X.X |
| Cycle 1 - Green | /green | X | X.X |
| Cycle 1 - Refactor | /refactor | X | X.X |
| Cycle 2 - Red | /red | X | X.X |
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

| Phase | Cumulative Tokens | Context Remaining | Utilization |
|-------|-------------------|-------------------|-------------|
| Test List | X | X | X% |
| After Cycle 1 | X | X | X% |
| After Cycle 2 | X | X | X% |
| After Cycle 3 | X | X | X% |
| After Cycle 4 | X | X | X% |
| **Final** | X | X | X% |

**Note**: For v2-single-context, tokens accumulate in a single context throughout the experiment.

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

## Key Differences from v1-subagents

| Aspect | v1-subagents | v2-single-context |
|--------|--------------|-------------------|
| Execution | Task tool spawns agents | Skill tool invokes inline |
| Context | Isolated per phase | Shared across all phases |
| Token usage | Split across agents | Single context window |
| State transfer | Via prompt parameters | In-memory (conversation) |
| Overhead | Agent spawning | None |
