# Analysis Report: 2026-08-16_21-45-42_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T22:22:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2223s |
| Started | 2026-08-16T21:45:42+00:00 |
| Ended | 2026-08-16T22:22:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 168
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 194
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-45-42_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-45-42_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (34 tests) 121ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  22:22:48
   Duration  328ms (transform 52ms, setup 0ms, collect 52ms, tests 121ms, environment 0ms, prepare 55ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 62 | ×1 | 62 |
| Invocations | 69 | ×2 | 138 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 9 | ×5 | 45 |
| Assignments | 50 | ×6 | 300 |
| **Total Mass** | | | **597** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 150 |
| Functions | 13 |
| Longest Function | 18 lines |
| Avg LOC/Function | 6.77 |
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
| McCabe (Cyclomatic) | 7 | 2.50 | 0 |
| Cognitive (SonarJS) | 8 | 3.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2402341 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 25 |
| Predictions Total | 26 |
| Accuracy | 96% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 34 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


