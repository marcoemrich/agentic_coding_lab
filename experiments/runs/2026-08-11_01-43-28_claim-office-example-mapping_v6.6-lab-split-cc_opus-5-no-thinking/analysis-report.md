# Analysis Report: 2026-08-11_01-43-28_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T03:04:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 4856s |
| Started | 2026-08-11T01:43:28+00:00 |
| Ended | 2026-08-11T03:04:25+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 516
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 794
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_01-43-28_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_01-43-28_claim-office-example-mapping_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (44 tests) 572ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  03:04:25
   Duration  774ms (transform 60ms, setup 0ms, collect 57ms, tests 572ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 70 | ×1 | 70 |
| Invocations | 96 | ×2 | 192 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 16 | ×5 | 80 |
| Assignments | 102 | ×6 | 612 |
| **Total Mass** | | | **998** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 405 |
| Functions | 42 |
| Longest Function | 13 lines |
| Avg LOC/Function | 3.48 |
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
| McCabe (Cyclomatic) | 3 | 1.35 | 0 |
| Cognitive (SonarJS) | 3 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 127506140 |
| Context Utilization | 239% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 130.34s |
| Avg Red Phase | 27.42s |
| Avg Green Phase | 33.74s |
| Avg Refactor Phase | 69.18s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 87 |
| Predictions Total | 88 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 19 |


