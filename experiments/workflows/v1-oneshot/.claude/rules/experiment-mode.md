# One-Shot Experiment Mode (No TDD)

## Instructions

Complete the coding exercise **without using TDD** - just implement the solution directly.

- Read the kata requirements and Example Mapping
- Write the implementation code first (based on your understanding)
- **THEN add tests after implementation** based on the Example Mapping
- Do NOT follow the Red-Green-Refactor cycle
- Do NOT wait for human approval
- "Vibe code" the solution based on the requirements

## Approach

1. **Read the requirements** from the kata prompt and Example Mapping
2. **Implement the solution** directly in one go (code-first, not test-first)
3. **Add tests after implementation** - create test cases based on the Example Mapping rules and examples
4. **Run tests** to confirm correctness: `pnpm test`
5. **Fix any issues** if tests fail (iterate until passing)

## Philosophy

This is "regular coding" without TDD discipline:
- No test-first approach (implementation comes before tests)
- No incremental steps (write full solution at once)
- Just read requirements and write code based on understanding
- Tests are written **after** to verify correctness (not to drive design)
- Tests should cover the Example Mapping cases for fair comparison with TDD workflows

## IMPORTANT: Test Coverage

**You MUST add comprehensive tests after implementation** to enable fair comparison with TDD workflows.

- Base your tests on the Example Mapping (rules + examples)
- Cover the same scenarios that TDD workflows would test
- This ensures we can compare code mass, test count, and other metrics fairly
- Without tests, we cannot measure whether the implementation is correct

## Running Tests

Use `pnpm test` to run tests after implementation.

## Final Summary Format

After completing the implementation, write `experiment-summary.md` with this structure:

```markdown
# One-Shot Experiment Summary

## Configuration
- **Workflow**: v-1-oneshot
- **Kata**: [kata name]
- **Timestamp**: [YYYY-MM-DD]
- **Start time**: [ISO timestamp with timezone]

## Duration & Timings

### Total Duration
- **Total experiment time**: ~X minutes Y seconds (Z ms)

### Phase Timings

| Phase | Duration (ms) | Duration (s) |
|-------|---------------|--------------|
| Requirements Analysis | X | X.X |
| Implementation | X | X.X |
| Test Writing | X | X.X |
| Verification & Fixes | X | X.X |
| **Total** | **X** | **X.X** |

### Token Usage

| Phase | Tokens Used |
|-------|-------------|
| Requirements Analysis | X |
| Implementation | X |
| Test Writing | X |
| Verification & Fixes | X |
| **Total** | **X** |

### Context Utilization

**Context window size**: 200,000 tokens (Opus 4.6)

| Phase | Cumulative Tokens | Context Remaining | Utilization |
|-------|-------------------|-------------------|-------------|
| After Requirements | X | X | X% |
| After Implementation | X | X | X% |
| After Test Writing | X | X | X% |
| After Verification | X | X | X% |
| **Final** | X | X | X% |

## Implementation Approach

### Strategy
[Describe how you approached the problem - what you thought about, what patterns you used]

### Key Decisions
1. **[Decision 1]** - [Rationale]
2. **[Decision 2]** - [Rationale]
...

## Final Metrics
- **Total tests**: X
- **All passing**: ✅/❌
- **Implementation-first approach**: ✅

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
