# Analysis Report: 2026-07-25_03-48-17_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

Generated: 2026-07-25T20:35:46+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | glm-5-2 |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2701s |
| Started | 2026-07-25T03:48:17+00:00 |
| Ended | 2026-07-25T04:33:19+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 210
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 584
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-48-17_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_03-48-17_claim-office-example-mapping_v6.2-with-why-cleaned-pi_glm-5-2

unknown item type: broomstick
damage references item not covered by policy: amulet
damage references item not covered by policy: broomstick
damage amount must not be negative: -200
damage references item not covered by policy: sword
 ✓ src/claim-office.spec.ts  (38 tests) 1205ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  20:35:52
   Duration  1.73s (transform 57ms, setup 0ms, collect 45ms, tests 1.21s, environment 0ms, prepare 177ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 87% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 79 | ×2 | 158 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 10 | ×5 | 50 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **757** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 162 |
| Functions | 16 |
| Longest Function | 20 lines |
| Avg LOC/Function | 6.25 |
| Median LOC/Function | 4.00 |
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
| McCabe (Cyclomatic) | 6 | 2.37 | 0 |
| Cognitive (SonarJS) | 8 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 16229304 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 60 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 30 |
| Predictions Total | 30 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


