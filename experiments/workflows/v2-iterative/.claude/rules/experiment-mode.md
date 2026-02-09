# Iterative Prompting Experiment Mode (No TDD)

## Instructions

Complete the coding exercise **without using TDD** but with a structured iterative approach using a plan and checklist.

- Read the kata requirements and Example Mapping
- Create a plan with a checklist of implementation steps
- Implement incrementally, checking off items as you complete them
- Add tests after implementation based on the Example Mapping
- Do NOT follow the Red-Green-Refactor cycle
- Do NOT wait for human approval

## Approach

1. **Read the requirements** from the kata prompt and Example Mapping
2. **Create a plan** - Break down the implementation into a checklist of discrete steps
3. **Implement iteratively** - Work through the checklist one item at a time
   - Mark each item as complete when done
   - Verify each step works before moving to the next
4. **Add tests after implementation** - Create test cases based on the Example Mapping
5. **Run tests** to confirm correctness: `pnpm test`
6. **Fix any issues** if tests fail

## Philosophy

This is structured coding without TDD discipline:
- No test-first approach (implementation comes before tests)
- Incremental implementation via checklist (not one-shot)
- Plan-driven development with explicit task tracking
- Tests are written **after** to verify correctness (not to drive design)
- Uses iterative prompting pattern for complex tasks

## Checklist Format

Create your implementation checklist like this:

```markdown
## Implementation Checklist

- [ ] Step 1: [Description]
- [ ] Step 2: [Description]
- [ ] Step 3: [Description]
...
```

Update to `[x]` as you complete each step. This provides visibility into progress and ensures systematic coverage.

## IMPORTANT: Test Coverage

**You MUST add comprehensive tests after implementation** to enable fair comparison with TDD workflows.

- Base your tests on the Example Mapping (rules + examples)
- Cover the same scenarios that TDD workflows would test
- This ensures we can compare code mass, test count, and other metrics fairly

## Running Tests

Use `pnpm test` to run tests after implementation.

## Final Summary Format

After completing the implementation, write `experiment-summary.md` with this structure:

```markdown
# Iterative Prompting Experiment Summary

## Configuration
- **Workflow**: v2-iterative
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
| Planning & Checklist | X | X.X |
| Implementation (iterative) | X | X.X |
| Test Writing | X | X.X |
| Verification & Fixes | X | X.X |
| **Total** | **X** | **X.X** |

### Token Usage

| Phase | Tokens Used |
|-------|-------------|
| Requirements Analysis | X |
| Planning & Checklist | X |
| Implementation | X |
| Test Writing | X |
| Verification & Fixes | X |
| **Total** | **X** |

### Context Utilization

**Context window size**: 200,000 tokens (Opus 4.6)

| Phase | Cumulative Tokens | Context Remaining | Utilization |
|-------|-------------------|-------------------|-------------|
| After Requirements | X | X | X% |
| After Planning | X | X | X% |
| After Implementation | X | X | X% |
| After Test Writing | X | X | X% |
| After Verification | X | X | X% |
| **Final** | X | X | X% |

## Implementation Plan

### Checklist (as completed)
- [x] Step 1: [Description]
- [x] Step 2: [Description]
...

### Key Decisions
1. **[Decision 1]** - [Rationale]
2. **[Decision 2]** - [Rationale]
...

## Iteration Details

| Step | Description | Outcome |
|------|-------------|---------|
| 1 | [What was implemented] | [Success/Issues] |
| 2 | [What was implemented] | [Success/Issues] |
...

## Final Metrics
- **Checklist items**: X
- **Total tests**: X
- **All passing**: Y/N
- **Iterative approach**: Y

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
