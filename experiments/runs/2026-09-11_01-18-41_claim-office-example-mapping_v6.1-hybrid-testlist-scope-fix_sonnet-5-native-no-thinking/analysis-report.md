# Analysis Report: 2026-09-11_01-18-41_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

Generated: 2026-09-11T01:54:02+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-hybrid-testlist-scope-fix |
| Model | sonnet-5-native-no-thinking |
| Model Version(s) | claude-sonnet-5 |
| Thinking | unknown |
| Duration | 2119s |
| Started | 2026-09-11T01:18:41+00:00 |
| Ended | 2026-09-11T01:54:02+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 245
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 313
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-11_01-18-41_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-11_01-18-41_claim-office-example-mapping_v6.1-hybrid-testlist-scope-fix_sonnet-5-native-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 1466ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  01:54:03
   Duration  1.74s (transform 60ms, setup 0ms, collect 59ms, tests 1.47s, environment 0ms, prepare 68ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 80% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 68 | ×6 | 408 |
| **Total Mass** | | | **734** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 200 |
| Functions | 22 |
| Longest Function | 9 lines |
| Avg LOC/Function | 4.68 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 4 | 1.67 | 0 |
| Cognitive (SonarJS) | 4 | 1.54 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 78416778 |
| Context Utilization | 185% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 36 |
| Avg Cycle Time | 83.39s |
| Avg Red Phase | 17.55s |
| Avg Green Phase | 18.05s |
| Avg Refactor Phase | 47.79s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 7 |
| Predictions Total | 7 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 24 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 22 |


