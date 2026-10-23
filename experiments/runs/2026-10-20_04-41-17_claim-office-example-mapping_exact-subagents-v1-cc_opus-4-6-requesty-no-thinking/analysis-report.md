# Analysis Report: 2026-10-20_04-41-17_claim-office-example-mapping_exact-subagents-v1-cc_opus-4-6-requesty-no-thinking

Generated: 2026-10-20T04:47:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-subagents-v1-cc |
| Model | opus-4-6-requesty-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 379s |
| Started | 2026-10-20T04:41:17+00:00 |
| Ended | 2026-10-20T04:47:38+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 236
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 468
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-10-20_04-41-17_claim-office-example-mapping_exact-subagents-v1-cc_opus-4-6-requesty-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-10-20_04-41-17_claim-office-example-mapping_exact-subagents-v1-cc_opus-4-6-requesty-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  04:47:39
   Duration  174ms (transform 46ms, setup 0ms, collect 40ms, tests 6ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 77 | ×2 | 154 |
| Conditionals | 19 | ×4 | 76 |
| Loops | 12 | ×5 | 60 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **727** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 194 |
| Functions | 4 |
| Longest Function | 71 lines |
| Avg LOC/Function | 38.50 |
| Median LOC/Function | 39.50 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 7 |
| Duplication | 0 |
| Magic Numbers | 10 |
| Code Quality | 0 |
| **Total** | **17** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 22 | 7.33 | 2 |
| Cognitive (SonarJS) | 23 | 11.00 | 3 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 5992170 |
| Context Utilization | 40% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 67.28s |
| Avg Red Phase | 42.29s |
| Avg Green Phase | 24.99s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 2 |
| Predictions Total | 2 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


