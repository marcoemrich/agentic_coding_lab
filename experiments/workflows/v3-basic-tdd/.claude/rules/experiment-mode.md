# TDD Experiment Mode

## Instructions

Complete the TDD exercise **autonomously** using Test-Driven Development.

- Do NOT wait for human approval between phases
- Run the full TDD cycle until all tests pass
- Record timings and decisions throughout

## Running Tests

Use `pnpm test` to run tests.

## Final Summary Format

After completing all tests, write `experiment-summary.md` with this structure:

```markdown
# TDD Experiment Summary

## Configuration
- **Workflow**: v0-baseline
- **Kata**: [kata name]
- **Timestamp**: [YYYY-MM-DD]
- **Start time**: [ISO timestamp with timezone]

## Duration & Timings

### Total Duration
- **Total experiment time**: ~X minutes Y seconds (Z ms)

### Phase Timings

| Phase | Duration (ms) | Duration (s) |
|-------|---------------|--------------|
| Test List | X | X.X |
| Cycle 1 - Red | X | X.X |
| Cycle 1 - Green | X | X.X |
| Cycle 1 - Refactor | X | X.X |
| ... | ... | ... |
| **Total** | **X** | **X.X** |

### Token Usage

| Phase | Tokens Used |
|-------|-------------|
| Test List | X |
| Cycle 1 (R/G/R) | X |
| Cycle 2 (R/G/R) | X |
| ... | ... |
| **Total** | **X** |

### Context Utilization

**Context window size**: 200,000 tokens (Opus 4.6)

| Phase | Cumulative Tokens | Context Remaining | Utilization |
|-------|-------------------|-------------------|-------------|
| After Test List | X | X | X% |
| After Cycle 1 | X | X | X% |
| After Cycle 2 | X | X | X% |
| ... | ... | ... | ... |
| **Final** | X | X | X% |

## Test List
1. [test description 1]
2. [test description 2]
...

## Cycle Details

| # | Test | Red Result | Green Approach | Refactor |
|---|------|------------|----------------|----------|
| 1 | [test name] | [error observed] | [approach] | [changes or "none"] |
| 2 | [test name] | [error observed] | [approach] | [changes or "none"] |
...

## Final Metrics
- **Total tests**: X
- **All passing**: ✅/❌
- **Refactorings applied**: X

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

1. **[Observation]** - [Description]
2. **[Observation]** - [Description]
```

**Note**: APP mass calculations will be performed post-hoc during analysis.
