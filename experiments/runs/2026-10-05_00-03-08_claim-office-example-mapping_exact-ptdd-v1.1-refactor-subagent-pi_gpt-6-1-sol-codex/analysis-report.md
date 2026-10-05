# Analysis Report: 2026-10-05_00-03-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex

Generated: 2026-10-05T01:14:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-6-1-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4259s |
| Started | 2026-10-05T00:03:09+00:00 |
| Ended | 2026-10-05T01:14:11+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 163
- **Test files**: office.spec.ts
- **Test LOC** (total): 179
- **Active tests**: 43
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-05_00-03-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-05_00-03-08_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-6-1-sol-codex

 ✓ src/office.spec.ts  (43 tests) 782ms

 Test Files  1 passed (1)
      Tests  43 passed (43)
   Start at  01:14:12
   Duration  1.09s (transform 81ms, setup 0ms, collect 71ms, tests 782ms, environment 0ms, prepare 76ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 91% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 64 | ×1 | 64 |
| Invocations | 87 | ×2 | 174 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 9 | ×5 | 45 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **571** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 137 |
| Functions | 25 |
| Longest Function | 12 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.40 | 0 |
| Cognitive (SonarJS) | 2 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15064726 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 43 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 85 |
| Predictions Total | 86 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 43 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


