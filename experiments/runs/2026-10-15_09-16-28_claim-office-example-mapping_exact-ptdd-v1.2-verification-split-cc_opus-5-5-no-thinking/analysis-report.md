# Analysis Report: 2026-10-15_09-16-28_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking

Generated: 2026-10-15T09:33:44+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.2-verification-split-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 1032s |
| Started | 2026-10-15T09:16:29+00:00 |
| Ended | 2026-10-15T09:33:44+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim.ts, cli.ts, items.ts, percent.ts, premium.ts
- **Implementation LOC** (total): 225
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 287
- **Active tests**: 52
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-15_09-16-28_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-15_09-16-28_claim-office-example-mapping_exact-ptdd-v1.2-verification-split-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (52 tests) 1951ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  09:33:45
   Duration  2.27s (transform 84ms, setup 0ms, collect 83ms, tests 1.95s, environment 0ms, prepare 75ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 60 | ×1 | 60 |
| Invocations | 80 | ×2 | 160 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 7 | ×5 | 35 |
| Assignments | 59 | ×6 | 354 |
| **Total Mass** | | | **669** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 185 |
| Functions | 24 |
| Longest Function | 13 lines |
| Avg LOC/Function | 4.46 |
| Median LOC/Function | 4.50 |
| Imports | 9 |

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
| McCabe (Cyclomatic) | 3 | 1.39 | 0 |
| Cognitive (SonarJS) | 2 | 1.27 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 25084578 |
| Context Utilization | 72% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 16.03s |
| Avg Red Phase | 11.53s |
| Avg Green Phase | 4.5s |
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


