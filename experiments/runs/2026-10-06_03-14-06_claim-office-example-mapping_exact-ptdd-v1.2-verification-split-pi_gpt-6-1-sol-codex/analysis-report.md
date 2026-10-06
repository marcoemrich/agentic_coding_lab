# Analysis Report: 2026-10-06_03-14-06_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex

Generated: 2026-10-06T03:34:09+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1200s |
| Started | 2026-10-06T03:14:07+00:00 |
| Ended | 2026-10-06T03:34:09+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 132
- **Test files**: office.spec.ts
- **Test LOC** (total): 253
- **Active tests**: 57
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (57 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-06_03-14-06_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-06_03-14-06_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-pi_gpt-6-1-sol-codex

 ✓ src/office.spec.ts  (57 tests) 618ms

 Test Files  1 passed (1)
      Tests  57 passed (57)
   Start at  03:34:09
   Duration  783ms (transform 41ms, setup 0ms, collect 36ms, tests 618ms, environment 0ms, prepare 43ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 63 | ×2 | 126 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 5 | ×5 | 25 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **476** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 131 |
| Functions | 18 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.56 |
| Median LOC/Function | 3.50 |
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
| McCabe (Cyclomatic) | 4 | 1.58 | 0 |
| Cognitive (SonarJS) | 3 | 1.40 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10336786 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 57 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 113 |
| Predictions Total | 114 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 57 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


