# Analysis Report: 2026-05-22_08-52-17_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

Generated: 2026-05-22T10:14:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v4.2-shared-context |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 4926s |
| Started | 2026-05-22T08:52:17+00:00 |
| Ended | 2026-05-22T10:14:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 219
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 273
- **Active tests**: 40
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (40 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-22_08-52-17_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-22_08-52-17_claim-office-example-mapping_v4.2-shared-context_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (40 tests) 2587ms

 Test Files  1 passed (1)
      Tests  40 passed (40)
   Start at  10:14:25
   Duration  2.76s (transform 38ms, setup 0ms, collect 38ms, tests 2.59s, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 57% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 16 | ×5 | 80 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **684** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 182 |
| Functions | 16 |
| Longest Function | 16 lines |
| Avg LOC/Function | 7.31 |
| Median LOC/Function | 7.50 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 5 | 2.17 | 0 |
| Cognitive (SonarJS) | 5 | 2.58 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17446414 |
| Context Utilization | 16% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 40 |
| Avg Cycle Time | 128.44s |
| Avg Red Phase | 46.18s |
| Avg Green Phase | 36.36s |
| Avg Refactor Phase | 45.9s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 42 |
| Predictions Total | 42 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 30 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 10 |


