# Analysis Report: 2026-05-15_07-08-48_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

Generated: 2026-05-15T07:19:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 652s |
| Started | 2026-05-15T07:08:48+00:00 |
| Ended | 2026-05-15T07:19:42+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 203
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 650
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-15_07-08-48_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-15_07-08-48_claim-office-example-mapping_v5-exact-single-context_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 6ms
 ✓ src/cli.spec.ts  (2 tests) 668ms

 Test Files  2 passed (2)
      Tests  46 passed (46)
   Start at  07:19:43
   Duration  963ms (transform 45ms, setup 0ms, collect 50ms, tests 674ms, environment 0ms, prepare 80ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 9 | ×5 | 45 |
| Assignments | 83 | ×6 | 498 |
| **Total Mass** | | | **865** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 176 |
| Functions | 16 |
| Longest Function | 24 lines |
| Avg LOC/Function | 5.88 |
| Median LOC/Function | 2.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.36 | 0 |
| Cognitive (SonarJS) | 9 | 3.82 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7282501 |
| Context Utilization | 9% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 600.58s |
| Avg Red Phase | 44.34s |
| Avg Green Phase | 18.63s |
| Avg Refactor Phase | 537.61s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


