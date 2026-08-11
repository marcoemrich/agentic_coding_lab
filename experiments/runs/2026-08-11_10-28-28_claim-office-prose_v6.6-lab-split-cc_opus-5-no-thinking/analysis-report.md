# Analysis Report: 2026-08-11_10-28-28_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T11:28:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3615s |
| Started | 2026-08-11T10:28:28+00:00 |
| Ended | 2026-08-11T11:28:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 366
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 569
- **Active tests**: 32
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (32 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_10-28-28_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_10-28-28_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (32 tests) 6ms

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Start at  11:28:44
   Duration  203ms (transform 47ms, setup 0ms, collect 48ms, tests 6ms, environment 0ms, prepare 49ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 71 | ×1 | 71 |
| Invocations | 74 | ×2 | 148 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 12 | ×5 | 60 |
| Assignments | 99 | ×6 | 594 |
| **Total Mass** | | | **905** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 246 |
| Functions | 28 |
| Longest Function | 11 lines |
| Avg LOC/Function | 3.18 |
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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 1 | 1.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 81054174 |
| Context Utilization | 178% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 32 |
| Avg Cycle Time | 115.70s |
| Avg Red Phase | 23.53s |
| Avg Green Phase | 25.01s |
| Avg Refactor Phase | 67.16s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 63 |
| Predictions Total | 64 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 32 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 11 |


