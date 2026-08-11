# Analysis Report: 2026-08-11_11-46-02_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

Generated: 2026-08-11T12:44:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v6.6-lab-split-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 3531s |
| Started | 2026-08-11T11:46:02+00:00 |
| Ended | 2026-08-11T12:44:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 457
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 743
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-11_11-46-02_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-11_11-46-02_claim-office-prose_v6.6-lab-split-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 6ms
 ✓ src/cli.spec.ts  (1 test) 2ms

 Test Files  2 passed (2)
      Tests  34 passed (34)
   Start at  12:44:56
   Duration  339ms (transform 59ms, setup 0ms, collect 65ms, tests 8ms, environment 0ms, prepare 100ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 98% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 74 | ×1 | 74 |
| Invocations | 67 | ×2 | 134 |
| Conditionals | 8 | ×4 | 32 |
| Loops | 11 | ×5 | 55 |
| Assignments | 86 | ×6 | 516 |
| **Total Mass** | | | **811** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 347 |
| Functions | 32 |
| Longest Function | 15 lines |
| Avg LOC/Function | 2.91 |
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
| McCabe (Cyclomatic) | 3 | 1.38 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 80592530 |
| Context Utilization | 171% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 118.81s |
| Avg Red Phase | 22.95s |
| Avg Green Phase | 29.59s |
| Avg Refactor Phase | 66.27s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 69 |
| Predictions Total | 70 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


