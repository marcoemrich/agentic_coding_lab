# Analysis Report: 2026-09-05_12-49-01_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

Generated: 2026-09-05T14:08:22+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | basic-sol-tdd-subagent-pi |
| Model | gpt-6-astra-codex-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4759s |
| Started | 2026-09-05T12:49:01+00:00 |
| Ended | 2026-09-05T14:08:22+00:00 |

## Code Metrics

- **Implementation files**: cli.ts
- **Implementation LOC** (total): 64
- **Test files**: office.spec.ts
- **Test LOC** (total): 157
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-05_12-49-01_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-05_12-49-01_claim-office-example-mapping_basic-sol-tdd-subagent-pi_gpt-6-astra-codex-no-thinking

 ✓ src/office.spec.ts  (44 tests) 7024ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  14:08:23
   Duration  7.28s (transform 51ms, setup 0ms, collect 45ms, tests 7.02s, environment 0ms, prepare 74ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 0% |
| Branches | 0% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 35 | ×2 | 70 |
| Conditionals | 10 | ×4 | 40 |
| Loops | 5 | ×5 | 25 |
| Assignments | 35 | ×6 | 210 |
| **Total Mass** | | | **403** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 63 |
| Functions | 5 |
| Longest Function | 7 lines |
| Avg LOC/Function | 4.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 5 | 2.30 | 0 |
| Cognitive (SonarJS) | 4 | 2.60 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 13728064 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 44 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 51 |
| Predictions Total | 52 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 44 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


