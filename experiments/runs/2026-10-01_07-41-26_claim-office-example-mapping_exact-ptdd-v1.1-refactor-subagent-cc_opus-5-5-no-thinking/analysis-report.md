# Analysis Report: 2026-10-01_07-41-26_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

Generated: 2026-10-01T08:23:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 2492s |
| Started | 2026-10-01T07:41:26+00:00 |
| Ended | 2026-10-01T08:23:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claim-settlement.ts, cli.ts, item-catalog.ts, premium.ts
- **Implementation LOC** (total): 370
- **Test files**: claim-office.spec.ts, cli.spec.ts
- **Test LOC** (total): 276
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-01_07-41-26_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-01_07-41-26_claim-office-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 9ms
 ✓ src/cli.spec.ts  (6 tests) 986ms

 Test Files  2 passed (2)
      Tests  44 passed (44)
   Start at  08:23:03
   Duration  1.53s (transform 91ms, setup 0ms, collect 95ms, tests 995ms, environment 0ms, prepare 160ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 95% |
| Branches | 94% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 117 | ×2 | 234 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 8 | ×5 | 40 |
| Assignments | 41 | ×6 | 246 |
| **Total Mass** | | | **621** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 307 |
| Functions | 36 |
| Longest Function | 16 lines |
| Avg LOC/Function | 4.44 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 3 | 1.33 | 0 |
| Cognitive (SonarJS) | 2 | 1.15 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 50114810 |
| Context Utilization | 97% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 21 |
| Avg Cycle Time | 36.18s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 36.18s |

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
| Refactorings Applied | 44 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


