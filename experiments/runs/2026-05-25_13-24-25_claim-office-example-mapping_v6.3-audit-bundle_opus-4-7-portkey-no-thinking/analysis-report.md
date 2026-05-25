# Analysis Report: 2026-05-25_13-24-25_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

Generated: 2026-05-25T13:37:30+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-audit-bundle |
| Model | opus-4-7-portkey-no-thinking |
| Model Version(s) | claude-opus-4-7 |
| Thinking | unknown |
| Duration | 784s |
| Started | 2026-05-25T13:24:25+00:00 |
| Ended | 2026-05-25T13:37:30+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 235
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 350
- **Active tests**: 33
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (33 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-25_13-24-25_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-25_13-24-25_claim-office-example-mapping_v6.3-audit-bundle_opus-4-7-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (33 tests) 6ms

 Test Files  1 passed (1)
      Tests  33 passed (33)
   Start at  13:37:31
   Duration  192ms (transform 45ms, setup 0ms, collect 42ms, tests 6ms, environment 0ms, prepare 53ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 66 | ×1 | 66 |
| Invocations | 82 | ×2 | 164 |
| Conditionals | 22 | ×4 | 88 |
| Loops | 13 | ×5 | 65 |
| Assignments | 94 | ×6 | 564 |
| **Total Mass** | | | **947** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 203 |
| Functions | 14 |
| Longest Function | 29 lines |
| Avg LOC/Function | 11.21 |
| Median LOC/Function | 8.50 |
| Imports | 1 |

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
| McCabe (Cyclomatic) | 7 | 2.57 | 0 |
| Cognitive (SonarJS) | 6 | 2.92 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 15653043 |
| Context Utilization | 15% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 12 |
| Avg Cycle Time | 79.55s |
| Avg Red Phase | 25.84s |
| Avg Green Phase | 16.95s |
| Avg Refactor Phase | 36.76s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 23 |
| Predictions Total | 24 |
| Accuracy | 95% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 4 |


