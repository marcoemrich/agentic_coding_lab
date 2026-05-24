# Analysis Report: 2026-05-24_09-25-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T10:20:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3285s |
| Started | 2026-05-24T09:25:28+00:00 |
| Ended | 2026-05-24T10:20:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 242
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 408
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_09-25-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_09-25-28_claim-office-example-mapping_v6.2-with-why-cleaned_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 6ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  10:20:14
   Duration  171ms (transform 40ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 50 | ×1 | 50 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 7 | ×5 | 35 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **837** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 30 |
| Longest Function | 15 lines |
| Avg LOC/Function | 3.80 |
| Median LOC/Function | 2.00 |
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
| McCabe (Cyclomatic) | 5 | 1.45 | 0 |
| Cognitive (SonarJS) | 5 | 1.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 49093278 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 97.97s |
| Avg Red Phase | 22.81s |
| Avg Green Phase | 24.39s |
| Avg Refactor Phase | 50.77s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 74 |
| Predictions Total | 76 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


