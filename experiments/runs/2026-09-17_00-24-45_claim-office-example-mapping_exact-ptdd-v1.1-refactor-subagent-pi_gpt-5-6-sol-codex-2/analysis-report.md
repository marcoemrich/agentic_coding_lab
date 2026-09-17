# Analysis Report: 2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-2

Generated: 2026-09-17T01:46:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 4906s |
| Started | 2026-09-17T00:24:49+00:00 |
| Ended | 2026-09-17T01:46:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts, node-shims.d.ts
- **Implementation LOC** (total): 264
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 208
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-17_00-24-45_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-pi_gpt-5-6-sol-codex-2

 ✓ src/claim-office.spec.ts  (37 tests) 626ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  01:46:45
   Duration  934ms (transform 84ms, setup 0ms, collect 80ms, tests 626ms, environment 0ms, prepare 77ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 121 | ×2 | 242 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 7 | ×5 | 35 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **667** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 221 |
| Functions | 39 |
| Longest Function | 12 lines |
| Avg LOC/Function | 3.62 |
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
| McCabe (Cyclomatic) | 3 | 1.26 | 0 |
| Cognitive (SonarJS) | 2 | 1.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17131643 |
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
| Predictions Correct | 74 |
| Predictions Total | 74 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 37 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


