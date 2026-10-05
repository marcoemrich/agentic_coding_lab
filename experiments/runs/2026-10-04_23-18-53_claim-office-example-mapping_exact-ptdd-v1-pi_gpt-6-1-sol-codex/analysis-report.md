# Analysis Report: 2026-10-04_23-18-53_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex

Generated: 2026-10-04T23:51:23+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1945s |
| Started | 2026-10-04T23:18:54+00:00 |
| Ended | 2026-10-04T23:51:23+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 131
- **Test files**: office.spec.ts
- **Test LOC** (total): 181
- **Active tests**: 48
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (48 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-04_23-18-53_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-04_23-18-53_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-1-sol-codex

 ✓ src/office.spec.ts  (48 tests) 1049ms

 Test Files  1 passed (1)
      Tests  48 passed (48)
   Start at  23:51:24
   Duration  1.34s (transform 79ms, setup 0ms, collect 92ms, tests 1.05s, environment 0ms, prepare 70ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 73 | ×2 | 146 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 6 | ×5 | 30 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **552** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 130 |
| Functions | 18 |
| Longest Function | 11 lines |
| Avg LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 3 | 1.54 | 0 |
| Cognitive (SonarJS) | 2 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9042888 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 48 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 95 |
| Predictions Total | 96 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 48 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


