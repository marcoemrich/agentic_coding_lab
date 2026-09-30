# Analysis Report: 2026-09-30_00-35-17_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

Generated: 2026-09-30T00:50:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-single-context-v3-no-subagent-cc |
| Model | opus-5-5-no-thinking |
| Model Version(s) | claude-opus-5-5 |
| Thinking | unknown |
| Duration | 899s |
| Started | 2026-09-30T00:35:17+00:00 |
| Ended | 2026-09-30T00:50:19+00:00 |

## Code Metrics

- **Implementation files**: amounts.ts, claim-office.ts, claim.ts, cli.ts, premium.ts
- **Implementation LOC** (total): 201
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 203
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-30_00-35-17_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-30_00-35-17_claim-office-example-mapping_exact-single-context-v3-no-subagent-cc_opus-5-5-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 327ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  00:50:20
   Duration  693ms (transform 102ms, setup 0ms, collect 102ms, tests 327ms, environment 0ms, prepare 103ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 98% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 52 | ×1 | 52 |
| Invocations | 78 | ×2 | 156 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 8 | ×5 | 40 |
| Assignments | 81 | ×6 | 486 |
| **Total Mass** | | | **778** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 138 |
| Functions | 35 |
| Longest Function | 12 lines |
| Avg LOC/Function | 2.71 |
| Median LOC/Function | 2.00 |
| Imports | 7 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 1 |
| Code Quality | 0 |
| **Total** | **1** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 3 | 1.31 | 0 |
| Cognitive (SonarJS) | 2 | 1.18 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 122114276 |
| Context Utilization | 217% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 23.02s |
| Avg Red Phase | 7.55s |
| Avg Green Phase | 4.93s |
| Avg Refactor Phase | 10.54s |

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
| Refactorings Applied | 38 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


