# Analysis Report: 2026-08-16_21-42-23_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

Generated: 2026-08-16T22:36:54+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 3269s |
| Started | 2026-08-16T21:42:23+00:00 |
| Ended | 2026-08-16T22:36:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 291
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 295
- **Active tests**: 36
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (36 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-08-16_21-42-23_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-08-16_21-42-23_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-5-6-sol-codex

 ✓ src/claim-office.spec.ts  (36 tests) 1934ms

 Test Files  1 passed (1)
      Tests  36 passed (36)
   Start at  22:36:55
   Duration  2.11s (transform 47ms, setup 0ms, collect 46ms, tests 1.93s, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 95 | ×1 | 95 |
| Invocations | 105 | ×2 | 210 |
| Conditionals | 26 | ×4 | 104 |
| Loops | 4 | ×5 | 20 |
| Assignments | 73 | ×6 | 438 |
| **Total Mass** | | | **867** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 268 |
| Functions | 20 |
| Longest Function | 21 lines |
| Avg LOC/Function | 8.05 |
| Median LOC/Function | 5.50 |
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
| McCabe (Cyclomatic) | 7 | 2.68 | 0 |
| Cognitive (SonarJS) | 6 | 2.80 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 4929268 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 37 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 58 |
| Predictions Total | 58 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 40 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


