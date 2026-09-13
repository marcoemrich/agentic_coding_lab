# Analysis Report: 2026-09-13_09-08-49_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

Generated: 2026-09-13T10:53:47+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-hybrid-v2.9-stack-profile-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6295s |
| Started | 2026-09-13T09:08:49+00:00 |
| Ended | 2026-09-13T10:53:47+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 428
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 1537
- **Active tests**: 54
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (52 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-13_09-08-49_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-13_09-08-49_claim-office-example-mapping_exact-hybrid-v2.9-stack-profile-cc_opus-5-no-thinking

 ✓ src/claim-office.spec.ts  (52 tests) 1020ms

 Test Files  1 passed (1)
      Tests  52 passed (52)
   Start at  10:53:49
   Duration  1.36s (transform 93ms, setup 0ms, collect 102ms, tests 1.02s, environment 0ms, prepare 83ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 93% |
| Branches | 95% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 68 | ×1 | 68 |
| Invocations | 86 | ×2 | 172 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 17 | ×5 | 85 |
| Assignments | 104 | ×6 | 624 |
| **Total Mass** | | | **1005** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 242 |
| Functions | 31 |
| Longest Function | 34 lines |
| Avg LOC/Function | 4.61 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

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
| McCabe (Cyclomatic) | 3 | 1.32 | 0 |
| Cognitive (SonarJS) | 2 | 1.15 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 233347518 |
| Context Utilization | 333% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 52 |
| Avg Cycle Time | 203.21s |
| Avg Red Phase | 53.36s |
| Avg Green Phase | 44.49s |
| Avg Refactor Phase | 105.36s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 103 |
| Predictions Total | 104 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 29 |


