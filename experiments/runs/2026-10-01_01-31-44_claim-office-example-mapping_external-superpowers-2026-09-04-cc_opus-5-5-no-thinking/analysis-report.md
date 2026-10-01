# Analysis Report: 2026-10-01_01-31-44_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:37:42+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-superpowers-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 354s |
| Started | 2026-10-01T01:31:44+00:00 |
| Ended | 2026-10-01T01:37:42+00:00 |

## Code Metrics

- **Implementation files**: claimOffice.ts, cli.ts
- **Implementation LOC** (total): 183
- **Test files**: claimOffice.spec.ts, cli.spec.ts
- **Test LOC** (total): 253
- **Active tests**: 26
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (43 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-31-44_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-31-44_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/claimOffice.spec.ts  (41 tests) 9ms
 ✓ src/cli.spec.ts  (2 tests) 1096ms

 Test Files  2 passed (2)
      Tests  43 passed (43)
   Start at  01:37:43
   Duration  1.81s (transform 134ms, setup 0ms, collect 146ms, tests 1.10s, environment 0ms, prepare 208ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 68 | ×2 | 136 |
| Conditionals | 17 | ×4 | 68 |
| Loops | 7 | ×5 | 35 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **615** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 152 |
| Functions | 12 |
| Longest Function | 15 lines |
| Avg LOC/Function | 6.92 |
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
| McCabe (Cyclomatic) | 5 | 2.18 | 0 |
| Cognitive (SonarJS) | 6 | 2.67 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7506953 |
| Context Utilization | 46% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 45 |
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


