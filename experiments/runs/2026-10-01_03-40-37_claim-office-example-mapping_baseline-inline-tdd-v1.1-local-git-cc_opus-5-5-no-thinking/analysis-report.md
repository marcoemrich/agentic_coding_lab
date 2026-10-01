# Analysis Report: 2026-10-01_03-40-37_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

Generated: 2026-10-01T03:43:13+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | baseline-inline-tdd-v1.1-local-git-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 153s |
| Started | 2026-10-01T03:40:37+00:00 |
| Ended | 2026-10-01T03:43:13+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, cli.ts, policy.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 231
- **Test files**: cli.spec.ts, policy.spec.ts, premium.spec.ts
- **Test LOC** (total): 290
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (46 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_03-40-37_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_03-40-37_claim-office-example-mapping_baseline-inline-tdd-v1.1-local-git-cc_opus-5-5-no-thinking

 ✓ src/policy.spec.ts  (19 tests) 10ms
 ✓ src/premium.spec.ts  (18 tests) 10ms
 ✓ src/cli.spec.ts  (9 tests) 1422ms

 Test Files  3 passed (3)
      Tests  46 passed (46)
   Start at  03:43:14
   Duration  2.37s (transform 126ms, setup 0ms, collect 160ms, tests 1.44s, environment 0ms, prepare 279ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 67% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 84 | ×2 | 168 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 9 | ×5 | 45 |
| Assignments | 52 | ×6 | 312 |
| **Total Mass** | | | **661** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 11 |
| Longest Function | 27 lines |
| Avg LOC/Function | 8.18 |
| Median LOC/Function | 6.00 |
| Imports | 6 |

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
| McCabe (Cyclomatic) | 7 | 2.36 | 0 |
| Cognitive (SonarJS) | 4 | 2.08 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1747704 |
| Context Utilization | 29% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 10 |
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
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


