# Analysis Report: 2026-09-24_04-58-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

Generated: 2026-09-24T05:10:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 755s |
| Started | 2026-09-24T04:58:09+00:00 |
| Ended | 2026-09-24T05:10:47+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 118
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 124
- **Active tests**: 46
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-24_04-58-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-24_04-58-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-sol-codex

 ✓ src/claim-office.spec.ts  (46 tests) 8967ms

 Test Files  1 passed (1)
      Tests  46 passed (46)
   Start at  05:10:48
   Duration  9.22s (transform 46ms, setup 0ms, collect 47ms, tests 8.97s, environment 0ms, prepare 65ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 53 | ×2 | 106 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 48 | ×6 | 288 |
| **Total Mass** | | | **543** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 108 |
| Functions | 8 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.25 |
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
| McCabe (Cyclomatic) | 4 | 1.94 | 0 |
| Cognitive (SonarJS) | 5 | 2.57 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1290369 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 3 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


