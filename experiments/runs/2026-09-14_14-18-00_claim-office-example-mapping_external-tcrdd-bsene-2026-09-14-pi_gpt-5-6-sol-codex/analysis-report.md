# Analysis Report: 2026-09-14_14-18-00_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

Generated: 2026-09-14T15:56:20+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-tcrdd-bsene-2026-09-14-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 764s |
| Started | 2026-09-14T14:18:01+00:00 |
| Ended | 2026-09-14T14:30:49+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 117
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 214
- **Active tests**: 16
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (16 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-14_14-18-00_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-14_14-18-00_claim-office-example-mapping_external-tcrdd-bsene-2026-09-14-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (13 tests) 8ms
 ✓ src/cli.spec.ts  (3 tests) 460ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  15:56:21
   Duration  854ms (transform 108ms, setup 0ms, collect 122ms, tests 468ms, environment 0ms, prepare 241ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 89% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 46 | ×2 | 92 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 7 | ×5 | 35 |
| Assignments | 29 | ×6 | 174 |
| **Total Mass** | | | **424** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 102 |
| Functions | 9 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.78 |
| Median LOC/Function | 5.00 |
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
| McCabe (Cyclomatic) | 6 | 2.00 | 0 |
| Cognitive (SonarJS) | 4 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2223911 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 17 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


