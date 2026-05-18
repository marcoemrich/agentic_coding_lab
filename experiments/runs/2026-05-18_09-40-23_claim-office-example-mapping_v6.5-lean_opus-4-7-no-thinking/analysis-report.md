# Analysis Report: 2026-05-18_09-40-23_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking

Generated: 2026-05-18T10:52:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5-lean |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4348s |
| Started | 2026-05-18T09:40:23+00:00 |
| Ended | 2026-05-18T10:52:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 207
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 711
- **Active tests**: 42
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (42 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_09-40-23_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_09-40-23_claim-office-example-mapping_v6.5-lean_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 346ms

 Test Files  1 passed (1)
      Tests  42 passed (42)
   Start at  10:52:52
   Duration  537ms (transform 43ms, setup 0ms, collect 52ms, tests 346ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 54 | ×1 | 54 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 9 | ×5 | 45 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **817** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 163 |
| Functions | 34 |
| Longest Function | 8 lines |
| Avg LOC/Function | 3.21 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 0 |
| Code Quality | 0 |
| **Total** | **0** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 4 | 1.28 | 0 |
| Cognitive (SonarJS) | 2 | 1.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 57170845 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 42 |
| Avg Cycle Time | 102.62s |
| Avg Red Phase | 26.8s |
| Avg Green Phase | 18.92s |
| Avg Refactor Phase | 56.9s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 84 |
| Predictions Total | 84 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 42 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 1 |


