# Analysis Report: 2026-05-21_08-35-47_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

Generated: 2026-05-21T09:48:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.1-testlist-scope-fix |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4333s |
| Started | 2026-05-21T08:35:47+00:00 |
| Ended | 2026-05-21T09:48:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 256
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 507
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-21_08-35-47_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-21_08-35-47_claim-office-example-mapping_v4.1-testlist-scope-fix_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (46 tests) 3409ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  09:48:03
   Duration  3.63s (transform 63ms, setup 0ms, collect 66ms, tests 3.41s, environment 0ms, prepare 51ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 85% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 99 | ×2 | 198 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 11 | ×5 | 55 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **703** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 220 |
| Functions | 24 |
| Longest Function | 17 lines |
| Avg LOC/Function | 5.04 |
| Median LOC/Function | 4.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 5 | 1.79 | 0 |
| Cognitive (SonarJS) | 5 | 2.07 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 12883258 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 46 |
| Avg Cycle Time | 117.83s |
| Avg Red Phase | 39.4s |
| Avg Green Phase | 27.79s |
| Avg Refactor Phase | 50.64s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 61 |
| Predictions Total | 64 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 21 |


