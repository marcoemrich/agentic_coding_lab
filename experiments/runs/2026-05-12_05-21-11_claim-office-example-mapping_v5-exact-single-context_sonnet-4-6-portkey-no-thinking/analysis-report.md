# Analysis Report: 2026-05-12_05-21-11_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

Generated: 2026-05-12T06:07:16+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | sonnet-4-6-portkey-no-thinking |
| Model Version(s) | claude-sonnet-4-6 |
| Thinking | unknown |
| Duration | 2764s |
| Started | 2026-05-12T05:21:11+00:00 |
| Ended | 2026-05-12T06:07:16+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 126
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 258
- **Active tests**: 31
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (31 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_05-21-11_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_05-21-11_claim-office-example-mapping_v5-exact-single-context_sonnet-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (31 tests) 5ms

 Test Files  1 passed (1)
      Tests  31 passed (31)
   Start at  06:07:16
   Duration  166ms (transform 34ms, setup 0ms, collect 32ms, tests 5ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 62% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 56 | ×1 | 56 |
| Invocations | 45 | ×2 | 90 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 10 | ×5 | 50 |
| Assignments | 63 | ×6 | 378 |
| **Total Mass** | | | **630** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 117 |
| Functions | 4 |
| Longest Function | 27 lines |
| Avg LOC/Function | 12.25 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 3 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **4** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 5.67 | 2 |
| Cognitive (SonarJS) | 16 | 9.00 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 59521612 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 31 |
| Avg Cycle Time | 97.05s |
| Avg Red Phase | 24.89s |
| Avg Green Phase | 26.15s |
| Avg Refactor Phase | 46.01s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 61 |
| Predictions Total | 62 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 29 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 9 |


