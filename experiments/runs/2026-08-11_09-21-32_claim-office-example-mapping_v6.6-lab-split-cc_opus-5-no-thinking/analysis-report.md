# Analysis Report: 2026-08-11_09-21-32_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T10:50:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5331s |
| Started | 2026-08-11T09:21:32+00:00 |
| Ended | 2026-08-11T10:50:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 438
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 811
- **Active tests**: 50
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (50 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_09-21-32_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_09-21-32_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (50 tests) 932ms

 Test Files  1 passed (1)
      Tests  50 passed (50)
   Start at  10:50:24
   Duration  1.15s (transform 69ms, setup 0ms, collect 81ms, tests 932ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 16 | ×5 | 80 |
| Assignments | 104 | ×6 | 624 |
| **Total Mass** | | | **968** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 261 |
| Functions | 36 |
| Longest Function | 10 lines |
| Avg LOC/Function | 3.06 |
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
| McCabe (Cyclomatic) | 2 | 1.23 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 129875420 |
| Context Utilization | 231% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 50 |
| Avg Cycle Time | 116.30s |
| Avg Red Phase | 22.88s |
| Avg Green Phase | 28.05s |
| Avg Refactor Phase | 65.37s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 100 |
| Predictions Total | 100 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 50 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 27 |


