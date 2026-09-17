# Analysis Report: 2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-5

Generated: 2026-09-17T01:38:52+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4434s |
| Started | 2026-09-17T00:24:50+00:00 |
| Ended | 2026-09-17T01:38:52+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 254
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 244
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (35 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-5
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-5

 ✓ src/claim-office.spec.ts  (35 tests) 515ms

 Test Files  1 passed (1)
      Tests  35 passed (35)
   Start at  01:38:53
   Duration  827ms (transform 78ms, setup 0ms, collect 65ms, tests 515ms, environment 0ms, prepare 92ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 57 | ×1 | 57 |
| Invocations | 124 | ×2 | 248 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 12 | ×5 | 60 |
| Assignments | 49 | ×6 | 294 |
| **Total Mass** | | | **723** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 211 |
| Functions | 35 |
| Longest Function | 17 lines |
| Avg LOC/Function | 4.37 |
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
| McCabe (Cyclomatic) | 4 | 1.35 | 0 |
| Cognitive (SonarJS) | 4 | 1.75 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15086596 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


