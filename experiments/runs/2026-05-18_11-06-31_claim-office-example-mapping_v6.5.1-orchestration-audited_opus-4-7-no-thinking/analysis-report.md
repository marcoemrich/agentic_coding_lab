# Analysis Report: 2026-05-18_11-06-31_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking

Generated: 2026-05-18T11:57:36+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.5.1-orchestration-audited |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 3064s |
| Started | 2026-05-18T11:06:31+00:00 |
| Ended | 2026-05-18T11:57:36+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 281
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 447
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (26 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_11-06-31_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_11-06-31_claim-office-example-mapping_v6.5.1-orchestration-audited_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (26 tests) 6ms

 Test Files  1 passed (1)
      Tests  26 passed (26)
   Start at  11:57:37
   Duration  198ms (transform 48ms, setup 0ms, collect 49ms, tests 6ms, environment 0ms, prepare 48ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 55 | ×1 | 55 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **928** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 234 |
| Functions | 35 |
| Longest Function | 28 lines |
| Avg LOC/Function | 4.11 |
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
| McCabe (Cyclomatic) | 7 | 1.42 | 0 |
| Cognitive (SonarJS) | 4 | 1.46 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 41411724 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 26 |
| Avg Cycle Time | 115.61s |
| Avg Red Phase | 26.75s |
| Avg Green Phase | 26.87s |
| Avg Refactor Phase | 61.99s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 51 |
| Predictions Total | 52 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 26 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


