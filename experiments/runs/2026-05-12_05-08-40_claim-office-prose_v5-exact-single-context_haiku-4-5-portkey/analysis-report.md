# Analysis Report: 2026-05-12_05-08-40_claim-office-prose_v5-exact-single-context_haiku-4-5-portkey

Generated: 2026-05-12T05:20:55+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-prose |
| Workflow | v5-exact-single-context |
| Model | haiku-4-5-portkey |
| Model Version(s) | claude-haiku-4-5-20251001 |
| Thinking | true |
| Duration | 734s |
| Started | 2026-05-12T05:08:40+00:00 |
| Ended | 2026-05-12T05:20:55+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts
- **Implementation LOC** (total): 56
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 89
- **Active tests**: 10
- **Remaining todos**: 6

## Test Results

**Status**: ✅ All tests passing (10 passed)

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-12_05-08-40_claim-office-prose_v5-exact-single-context_haiku-4-5-portkey
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-12_05-08-40_claim-office-prose_v5-exact-single-context_haiku-4-5-portkey

 ✓ src/claim-office.spec.ts  (16 tests | 6 skipped) 2ms

 Test Files  1 passed (1)
      Tests  10 passed | 6 todo (16)
   Start at  05:20:56
   Duration  153ms (transform 23ms, setup 0ms, collect 22ms, tests 2ms, environment 0ms, prepare 42ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 91% |
| Branches | 90% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 21 | ×1 | 21 |
| Invocations | 9 | ×2 | 18 |
| Conditionals | 6 | ×4 | 24 |
| Loops | 3 | ×5 | 15 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **138** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 42 |
| Functions | 2 |
| Longest Function | 2 lines |
| Avg LOC/Function | 2.00 |
| Median LOC/Function | 2.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **3** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 3.50 | 0 |
| Cognitive (SonarJS) | 4 | 4.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 28470170 |
| Context Utilization | 69% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 77.88s |
| Avg Red Phase | 27.85s |
| Avg Green Phase | 14.97s |
| Avg Refactor Phase | 35.06s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 18 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 9 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


