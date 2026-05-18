# Analysis Report: 2026-05-18_12-13-12_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking

Generated: 2026-05-18T13:04:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5.2-bullets-cut |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3104s |
| Started | 2026-05-18T12:13:12+00:00 |
| Ended | 2026-05-18T13:04:58+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 242
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 453
- **Active tests**: 25
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (25 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_12-13-12_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_12-13-12_claim-office-example-mapping_v6.5.2-bullets-cut_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (25 tests) 9ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  13:04:59
   Duration  232ms (transform 49ms, setup 0ms, collect 49ms, tests 9ms, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 62 | ×2 | 124 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 4 | ×5 | 20 |
| Assignments | 93 | ×6 | 558 |
| **Total Mass** | | | **804** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 202 |
| Functions | 27 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.93 |
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
| McCabe (Cyclomatic) | 3 | 1.49 | 0 |
| Cognitive (SonarJS) | 3 | 1.29 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38474513 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 25 |
| Avg Cycle Time | 129.45s |
| Avg Red Phase | 28.07s |
| Avg Green Phase | 34.98s |
| Avg Refactor Phase | 66.4s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 49 |
| Predictions Total | 50 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 25 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


