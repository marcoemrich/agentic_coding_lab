# Analysis Report: 2026-05-24_01-02-25_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

Generated: 2026-05-24T01:44:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.1-with-why |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2518s |
| Started | 2026-05-24T01:02:25+00:00 |
| Ended | 2026-05-24T01:44:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 229
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 709
- **Active tests**: 39
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (39 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-24_01-02-25_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-24_01-02-25_claim-office-example-mapping_v6.1-with-why_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (39 tests) 2514ms

 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  01:44:25
   Duration  2.68s (transform 42ms, setup 0ms, collect 43ms, tests 2.51s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 66% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 12 | ×5 | 60 |
| Assignments | 95 | ×6 | 570 |
| **Total Mass** | | | **901** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 195 |
| Functions | 24 |
| Longest Function | 14 lines |
| Avg LOC/Function | 5.29 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 4 | 1.84 | 0 |
| Cognitive (SonarJS) | 4 | 1.93 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 45895035 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 102.21s |
| Avg Red Phase | 22.74s |
| Avg Green Phase | 24.38s |
| Avg Refactor Phase | 55.09s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 78 |
| Predictions Total | 78 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


