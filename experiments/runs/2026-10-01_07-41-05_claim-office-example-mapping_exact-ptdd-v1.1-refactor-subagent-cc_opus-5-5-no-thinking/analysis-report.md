# Analysis Report: 2026-10-01_07-41-05_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-10-01T08:17:24+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 2176s |
| Started | 2026-10-01T07:41:05+00:00 |
| Ended | 2026-10-01T08:17:24+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim-settlement.ts, cli.ts, price-list.ts, quote-pricing.ts
- **Implementation LOC** (total): 231
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 270
- **Active tests**: 45
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (45 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-41-05_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-41-05_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (42 tests) 10ms
 ✓ src/cli.spec.ts  (3 tests) 514ms

 Test Files  2 passed (2)
      Tests  45 passed (45)
   Start at  08:17:25
   Duration  1.06s (transform 99ms, setup 0ms, collect 97ms, tests 524ms, environment 0ms, prepare 144ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 59 | ×1 | 59 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 8 | ×5 | 40 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **593** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 193 |
| Functions | 22 |
| Longest Function | 16 lines |
| Avg LOC/Function | 5.09 |
| Median LOC/Function | 4.50 |
| Imports | 8 |

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
| McCabe (Cyclomatic) | 3 | 1.41 | 0 |
| Cognitive (SonarJS) | 2 | 1.33 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48118690 |
| Context Utilization | 98% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 5 |
| Avg Cycle Time | 30.93s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 30.93s |

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
| Refactorings Applied | 45 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


