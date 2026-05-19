# Analysis Report: 2026-05-19_15-55-35_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking

Generated: 2026-05-19T15:58:28+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.3-no-pep |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 172s |
| Started | 2026-05-19T15:55:35+00:00 |
| Ended | 2026-05-19T15:58:28+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 13
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 65
- **Active tests**: 1
- **Remaining todos**: 30

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-55-35_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-55-35_claim-office-example-mapping_v6.3-no-pep_opus-4-6-portkey-no-thinking

 ❯ src/claim-office.spec.ts  (31 tests | 1 failed | 30 skipped) 6ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Quote - base premiums > returns 5G processing fee for empty item list
     → expected undefined to deeply equal { results: [ { premium: 5 } ] }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Quote - base premiums > returns 5G processing fee for empty item list
AssertionError: expected undefined to deeply equal { results: [ { premium: 5 } ] }

- Expected: 
Object {
  "results": Array [
    Object {
      "premium": 5,
    },
  ],
}

+ Received: 
undefined

 ❯ src/claim-office.spec.ts:11:22
      9|         steps: [{ op: "quote" as const, items: [] }],
     10|       });
     11|       expect(result).toEqual({ results: [{ premium: 5 }] });
       |                      ^
     12|     });
     13|     it.todo("calculates premium for a single sword");

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 30 todo (31)
   Start at  15:58:28
   Duration  161ms (transform 22ms, setup 0ms, collect 20ms, tests 6ms, environment 0ms, prepare 51ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 6 | ×1 | 6 |
| Invocations | 8 | ×2 | 16 |
| Conditionals | 0 | ×4 | 0 |
| Loops | 0 | ×5 | 0 |
| Assignments | 5 | ×6 | 30 |
| **Total Mass** | | | **52** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 12 |
| Functions | 1 |
| Longest Function | 3 lines |
| Avg LOC/Function | 3.00 |
| Median LOC/Function | 3.00 |
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
| McCabe (Cyclomatic) | 1 | 1.00 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 463924 |
| Context Utilization | 18% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 0 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 0 |
| Predictions Total | 0 |
| Accuracy | N/A |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 0 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


