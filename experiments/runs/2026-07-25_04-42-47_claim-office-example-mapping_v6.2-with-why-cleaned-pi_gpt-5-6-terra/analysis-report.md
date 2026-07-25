# Analysis Report: 2026-07-25_04-42-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

Generated: 2026-07-25T20:37:40+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-with-why-cleaned-pi |
| Model | gpt-5-6-terra |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 126s |
| Started | 2026-07-25T04:42:47+00:00 |
| Ended | 2026-07-25T04:44:54+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 73
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 46
- **Active tests**: 3
- **Remaining todos**: 17

## Test Results

**Status**: ✅ All tests passing (3 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_04-42-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_04-42-47_claim-office-example-mapping_v6.2-with-why-cleaned-pi_gpt-5-6-terra

 ✓ src/claim-office.spec.ts  (20 tests | 17 skipped) 132ms

 Test Files  1 passed (1)
      Tests  3 passed | 17 todo (20)
   Start at  20:37:40
   Duration  470ms (transform 30ms, setup 0ms, collect 22ms, tests 132ms, environment 0ms, prepare 94ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 57% |
| Branches | 36% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 65 | ×1 | 65 |
| Invocations | 50 | ×2 | 100 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 6 | ×5 | 30 |
| Assignments | 40 | ×6 | 240 |
| **Total Mass** | | | **483** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 70 |
| Functions | 6 |
| Longest Function | 21 lines |
| Avg LOC/Function | 7.17 |
| Median LOC/Function | 2.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 1 |
| Duplication | 0 |
| Magic Numbers | 25 |
| Code Quality | 0 |
| **Total** | **26** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 12 | 3.18 | 1 |
| Cognitive (SonarJS) | 17 | 6.20 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 228031 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 1 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
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
| Refactorings Applied | 1 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


