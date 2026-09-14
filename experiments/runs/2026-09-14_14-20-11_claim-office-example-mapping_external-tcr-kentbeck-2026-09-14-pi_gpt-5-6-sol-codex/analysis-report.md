# Analysis Report: 2026-09-14_14-20-11_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:56:40+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcr-kentbeck-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 481s |
| Started | 2026-09-14T14:20:13+00:00 |
| Ended | 2026-09-14T14:28:17+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 196
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 192
- **Active tests**: 18
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (18 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-20-11_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-20-11_claim-office-example-mapping_external-tcr-kentbeck-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (15 tests) 7ms
 ✓ src/cli.spec.ts  (3 tests) 509ms

 Test Files  2 passed (2)
      Tests  18 passed (18)
   Start at  15:56:41
   Duration  895ms (transform 98ms, setup 0ms, collect 114ms, tests 516ms, environment 0ms, prepare 206ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 79% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 80 | ×1 | 80 |
| Invocations | 104 | ×2 | 208 |
| Conditionals | 27 | ×4 | 108 |
| Loops | 11 | ×5 | 55 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **775** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 173 |
| Functions | 16 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.50 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 9 | 2.63 | 0 |
| Cognitive (SonarJS) | 8 | 2.44 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 798381 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


