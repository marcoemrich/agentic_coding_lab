# Analysis Report: 2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-2

Generated: 2026-09-23T13:19:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 1132s |
| Started | 2026-09-23T13:00:05+00:00 |
| Ended | 2026-09-23T13:19:11+00:00 |

## Code Metrics

- **Implementation files**: cli.ts, office.ts
- **Implementation LOC** (total): 132
- **Test files**: claim-office.spec.ts
- **Test LOC** (total): 184
- **Active tests**: 44
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (44 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-09-23_13-00-00_claim-office-example-mapping_exact-ptdd-v1-pi_gpt-6-sol-codex-2

 ✓ src/claim-office.spec.ts  (44 tests) 1248ms

 Test Files  1 passed (1)
      Tests  44 passed (44)
   Start at  13:19:13
   Duration  1.83s (transform 192ms, setup 0ms, collect 180ms, tests 1.25s, environment 0ms, prepare 178ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 90% |
| Branches | 84% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 63 | ×1 | 63 |
| Invocations | 64 | ×2 | 128 |
| Conditionals | 16 | ×4 | 64 |
| Loops | 8 | ×5 | 40 |
| Assignments | 45 | ×6 | 270 |
| **Total Mass** | | | **565** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 119 |
| Functions | 12 |
| Longest Function | 19 lines |
| Avg LOC/Function | 6.25 |
| Median LOC/Function | 4.50 |
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
| McCabe (Cyclomatic) | 4 | 2.24 | 0 |
| Cognitive (SonarJS) | 7 | 2.09 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 3590171 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 23 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 47 |
| Predictions Total | 48 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 23 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


