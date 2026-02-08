# TDD Single Context Workflow

## Overview
This workflow performs ALL TDD phases in a single agent context (no subagents).
The main agent handles Test List, Red, Green, and Refactor phases directly.

## Workflow (No HITL for Experiments)

For automated experiments, run the complete TDD cycle without human checkpoints:

### 1. Test List Phase
Create comprehensive test list using `it.todo()`:
- Focus on base functionality only
- Order tests from simple → complex
- No implementation yet

### 2. Red Phase
For each `it.todo()`:
- Convert to executable test
- Make prediction (compilation error expected)
- Run tests, verify compilation error
- Create empty function stub
- Make prediction (runtime error expected)
- Run tests, verify assertion error
- Record prediction accuracy

### 3. Green Phase
- Implement minimal code to pass the test
- Use simplest possible solution (hardcoded values OK)
- No features for future tests
- Verify all tests pass

### 4. Refactor Phase
- Evaluate naming FIRST
- Calculate APP mass before/after
- Apply Simple Design Rules (priority order):
  1. Tests Pass
  2. Reveals Intent
  3. No Duplication
  4. Fewest Elements
- Document improvements or why none possible
- Ensure tests still pass

### 5. Repeat
Continue with next `it.todo()` until all tests implemented.

## Running Tests

**Use pnpm with npm scripts:**
- `pnpm test:unit:basic` - Run unit tests
- `pnpm test` - Run all tests

**NEVER use:**
- `npm test`
- `npx vitest`
- Direct vitest calls

## Metrics to Record

After each phase, record:
- Phase name
- Duration (timestamp)
- Prediction made / Prediction correct (Red phase)
- Implementation approach (Green phase)
- Refactoring applied / Mass change (Refactor phase)
- Test results

## Output Format

At the end of the TDD cycle, output a summary:

```
## TDD Run Summary

### Test List
- Tests created: [count]
- Tests: [list]

### Cycle Details
| Test | Red Prediction | Green Approach | Refactor | Mass |
|------|----------------|----------------|----------|------|
| ... | ... | ... | ... | ... |

### Final Metrics
- Total tests: [count]
- Final code mass: [number]
- Refactorings applied: [count]
- Prediction accuracy: [%]
```

## Key Differences from Subagent Version

| Aspect | Subagent (v1) | Single Context (v2) |
|--------|---------------|---------------------|
| Context | Isolated per phase | Shared across all phases |
| Token usage | Split across agents | Single context window |
| State transfer | Via prompt params | In-context memory |
| Parallelism | None (sequential) | None (sequential) |
