# Analysis Report: 2026-10-01_01-38-10_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:49:25+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-kesseler-2026-09-30-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 671s |
| Started | 2026-10-01T01:38:10+00:00 |
| Ended | 2026-10-01T01:49:25+00:00 |

## Code Metrics

- **Implementation files**: catalog.ts, claimOffice.ts, cli.ts, policy.ts, premium.ts
- **Implementation LOC** (total): 218
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 515
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-38-10_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-38-10_claim-office-example-mapping_external-kesseler-2026-09-30-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (50 tests) 11ms
 ✓ src/cli.spec.ts  (2 tests) 325ms

 Test Files  2 passed (2)
      Tests  52 passed (52)
   Start at  01:49:26
   Duration  818ms (transform 97ms, setup 0ms, collect 104ms, tests 336ms, environment 0ms, prepare 124ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 6 | ×5 | 30 |
| Assignments | 47 | ×6 | 282 |
| **Total Mass** | | | **566** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 187 |
| Functions | 11 |
| Longest Function | 13 lines |
| Avg LOC/Function | 7.18 |
| Median LOC/Function | 7.00 |
| Imports | 7 |

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
| McCabe (Cyclomatic) | 4 | 1.76 | 0 |
| Cognitive (SonarJS) | 3 | 1.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 17899649 |
| Context Utilization | 56% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 86 |
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


