# Analysis Report: 2026-05-12_07-48-00_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T08:06:36+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 2867s |
| Started | 2026-05-12T07:48:00+00:00 |
| Ended | 2026-05-12T08:35:48+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 129
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 751
- **Active tests**: 37
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (37 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-48-00_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_07-48-00_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

 ✓ src/claim-office.spec.ts  (37 tests) 926ms

 Test Files  1 passed (1)
      Tests  37 passed (37)
   Start at  08:06:38
   Duration  1.28s (transform 36ms, setup 0ms, collect 36ms, tests 926ms, environment 0ms, prepare 57ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 94% |
| Branches | 87% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 67 | ×1 | 67 |
| Invocations | 47 | ×2 | 94 |
| Conditionals | 12 | ×4 | 48 |
| Loops | 12 | ×5 | 60 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **575** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 117 |
| Functions | 5 |
| Longest Function | 24 lines |
| Avg LOC/Function | 16.60 |
| Median LOC/Function | 17.00 |
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
| McCabe (Cyclomatic) | 9 | 3.00 | 0 |
| Cognitive (SonarJS) | 10 | 2.90 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 56812750 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 129.11s |
| Avg Red Phase | 35.98s |
| Avg Green Phase | 29.96s |
| Avg Refactor Phase | 63.17s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 72 |
| Predictions Total | 72 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 15 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 16 |


