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

After completing all tests, output:

```markdown
## TDD Experiment Summary

### Configuration
- Workflow: v2-single-context
- Kata: [kata name]
- Timestamp: [ISO date]

### Test List
1. [test 1 description]
2. [test 2 description]
...

### Cycle Details
| # | Test | Red Prediction | Green Approach | Refactor | Mass |
|---|------|----------------|----------------|----------|------|
| 1 | ... | ✅/❌ [details] | [approach] | [changes] | [N] |
| 2 | ... | ✅/❌ [details] | [approach] | [changes] | [N] |
...

### Final Metrics
- Total tests: [count]
- All passing: ✅/❌
- Final code mass: [number]
- Refactorings applied: [count]
- Prediction accuracy: [X/Y = %]

### Code

**Implementation** (`src/[name].ts`):
```typescript
[final implementation code]
```

**Tests** (`src/[name].spec.ts`):
```typescript
[final test code]
```

### Observations
- [Notable observation 1]
- [Notable observation 2]
```

## Key Differences from v1-subagents

| Aspect | v1-subagents | v2-single-context |
|--------|--------------|-------------------|
| Execution | Task tool spawns agents | Skill tool invokes inline |
| Context | Isolated per phase | Shared across all phases |
| Token usage | Split across agents | Single context window |
| State transfer | Via prompt parameters | In-memory (conversation) |
| Overhead | Agent spawning | None |
