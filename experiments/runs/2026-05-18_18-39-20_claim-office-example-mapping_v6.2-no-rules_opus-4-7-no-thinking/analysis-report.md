# Analysis Report: 2026-05-18_18-39-20_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking

Generated: 2026-05-18T19:13:32+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-7-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 2051s |
| Started | 2026-05-18T18:39:20+00:00 |
| Ended | 2026-05-18T19:13:32+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 198
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 644
- **Active tests**: 38
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (38 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-18_18-39-20_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-18_18-39-20_claim-office-example-mapping_v6.2-no-rules_opus-4-7-no-thinking

 ✓ src/claim-office.spec.ts  (38 tests) 6ms

 Test Files  1 passed (1)
      Tests  38 passed (38)
   Start at  19:13:33
   Duration  179ms (transform 47ms, setup 0ms, collect 48ms, tests 6ms, environment 0ms, prepare 41ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 96% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 10 | ×5 | 50 |
| Assignments | 88 | ×6 | 528 |
| **Total Mass** | | | **819** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 172 |
| Functions | 17 |
| Longest Function | 16 lines |
| Avg LOC/Function | 6.71 |
| Median LOC/Function | 7.00 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 4 | 1.64 | 0 |
| Cognitive (SonarJS) | 4 | 2.36 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 38766981 |
| Context Utilization | 17% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 38 |
| Avg Cycle Time | 112.14s |
| Avg Red Phase | 22.28s |
| Avg Green Phase | 31.6s |
| Avg Refactor Phase | 58.26s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 56 |
| Predictions Total | 56 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 20 |


