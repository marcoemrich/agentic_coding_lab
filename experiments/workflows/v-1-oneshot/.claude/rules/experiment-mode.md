# One-Shot Experiment Mode (No TDD)

## Instructions

Complete the coding exercise **without using TDD** - just implement the solution directly.

- Read the kata requirements
- Write the implementation code first
- Add tests after implementation (if you want)
- Do NOT follow the Red-Green-Refactor cycle
- Do NOT wait for human approval
- "Vibe code" the solution based on the requirements

## Approach

1. **Read the requirements** from the kata prompt
2. **Implement the solution** directly in one go
3. **Optionally add tests** after implementation to verify it works
4. **Run tests** to confirm correctness: `pnpm test`

## Philosophy

This is "regular coding" without TDD discipline:
- No test-first approach
- No incremental steps
- Just read requirements and write code
- Tests are verification, not drivers

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
| Testing (if added) | X | X.X |
| **Total** | **X** | **X.X** |

### Token Usage

| Phase | Tokens Used |
|-------|-------------|
| Requirements Analysis | X |
| Implementation | X |
| Testing | X |
| **Total** | **X** |

### Context Utilization

**Context window size**: 200,000 tokens (Opus 4.6)

| Phase | Cumulative Tokens | Context Remaining | Utilization |
|-------|-------------------|-------------------|-------------|
| After Requirements | X | X | X% |
| After Implementation | X | X | X% |
| After Testing | X | X | X% |
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
