# Analysis Report: 2026-05-18_22-48-20_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-3

Generated: 2026-05-18T23:51:01+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 3758s |
| Started | 2026-05-18T22:48:20+00:00 |
| Ended | 2026-05-18T23:51:01+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 192
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 552
- **Active tests**: 34
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (34 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_22-48-20_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-3
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_22-48-20_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-3

 ✓ src/claim-office.spec.ts  (34 tests) 414ms

 Test Files  1 passed (1)
      Tests  34 passed (34)
   Start at  23:51:02
   Duration  613ms (transform 47ms, setup 0ms, collect 62ms, tests 414ms, environment 0ms, prepare 45ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 93% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 55 | ×2 | 110 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **577** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 159 |
| Functions | 19 |
| Longest Function | 18 lines |
| Avg LOC/Function | 4.32 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 9 |
| Code Quality | 0 |
| **Total** | **10** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 8 | 1.71 | 0 |
| Cognitive (SonarJS) | 11 | 2.40 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 44805911 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 34 |
| Avg Cycle Time | 169.32s |
| Avg Red Phase | 27.65s |
| Avg Green Phase | 35.11s |
| Avg Refactor Phase | 106.56s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 68 |
| Predictions Total | 68 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 19 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 15 |


