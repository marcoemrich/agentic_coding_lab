# Analysis Report: 2026-05-18_18-16-54_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking

Generated: 2026-05-18T18:53:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2178s |
| Started | 2026-05-18T18:16:54+00:00 |
| Ended | 2026-05-18T18:53:14+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 218
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 338
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_18-16-54_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_18-16-54_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (35 tests) 20ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  18:53:15
   Duration  186ms (transform 39ms, setup 0ms, collect 42ms, tests 20ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 88% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 81 | ×2 | 162 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 9 | ×5 | 45 |
| Assignments | 101 | ×6 | 606 |
| **Total Mass** | | | **940** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 184 |
| Functions | 30 |
| Longest Function | 17 lines |
| Avg LOC/Function | 3.90 |
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
| McCabe (Cyclomatic) | 4 | 1.40 | 0 |
| Cognitive (SonarJS) | 4 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 35367266 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 105.15s |
| Avg Red Phase | 22.85s |
| Avg Green Phase | 34.56s |
| Avg Refactor Phase | 47.74s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 47 |
| Predictions Total | 49 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


