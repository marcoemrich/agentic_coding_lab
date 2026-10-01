# Analysis Report: 2026-10-01_01-25-47_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

Generated: 2026-10-01T01:32:43+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | external-superpowers-2026-09-04-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 412s |
| Started | 2026-10-01T01:25:48+00:00 |
| Ended | 2026-10-01T01:32:42+00:00 |

## Code Metrics

- **Implementation files**: claim.ts, cli.ts, premium.ts, scenario.ts
- **Implementation LOC** (total): 210
- **Test files**: claim.spec.ts, cli.spec.ts, premium.spec.ts, scenario.spec.ts
- **Test LOC** (total): 277
- **Active tests**: 29
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (51 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_01-25-47_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_01-25-47_claim-office-example-mapping_external-superpowers-2026-09-04-cc_opus-5-5-no-thinking

 ✓ src/claim.spec.ts  (20 tests) 7ms
 ✓ src/premium.spec.ts  (23 tests) 8ms
 ✓ src/scenario.spec.ts  (5 tests) 4ms
 ✓ src/cli.spec.ts  (3 tests) 1417ms

 Test Files  4 passed (4)
      Tests  51 passed (51)
   Start at  01:32:44
   Duration  2.66s (transform 115ms, setup 2ms, collect 146ms, tests 1.44s, environment 1ms, prepare 394ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 97% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 9 | ×5 | 45 |
| Assignments | 53 | ×6 | 318 |
| **Total Mass** | | | **629** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 179 |
| Functions | 14 |
| Longest Function | 17 lines |
| Avg LOC/Function | 7.29 |
| Median LOC/Function | 5.50 |
| Imports | 4 |

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
| McCabe (Cyclomatic) | 4 | 1.86 | 0 |
| Cognitive (SonarJS) | 3 | 1.90 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 7539014 |
| Context Utilization | 40% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
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


