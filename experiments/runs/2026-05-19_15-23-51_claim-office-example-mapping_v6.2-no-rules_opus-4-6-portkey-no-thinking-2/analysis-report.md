# Analysis Report: 2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-2

Generated: 2026-05-19T15:55:19+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2-no-rules |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1886s |
| Started | 2026-05-19T15:23:51+00:00 |
| Ended | 2026-05-19T15:55:19+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 69
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 338
- **Active tests**: 23
- **Remaining todos**: 15

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-2
> vitest run


 RUN  v1.6.1 /home/experimenter/experiments/runs/2026-05-19_15-23-51_claim-office-example-mapping_v6.2-no-rules_opus-4-6-portkey-no-thinking-2

 ❯ src/claim-office.spec.ts  (38 tests | 1 failed | 15 skipped) 9ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > Quote - integration > newcomer with cursed sword: 165 G
     → expected { results: [ { premium: 170 } ] } to deeply equal { results: [ { premium: 165 } ] }

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > Quote - integration > newcomer with cursed sword: 165 G
AssertionError: expected { results: [ { premium: 170 } ] } to deeply equal { results: [ { premium: 165 } ] }

- Expected
+ Received

  Object {
    "results": Array [
      Object {
-       "premium": 165,
+       "premium": 170,
      },
    ],
  }

 ❯ src/claim-office.spec.ts:311:22
    309|         ],
    310|       });
    311|       expect(result).toEqual({ results: [{ premium: 165 }] });
       |                      ^
    312|     });
    313|     it.todo("long-standing customer second contract with cursed high-e…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

 Test Files  1 failed (1)
      Tests  1 failed | 22 passed | 15 todo (38)
   Start at  15:55:20
   Duration  167ms (transform 34ms, setup 0ms, collect 33ms, tests 9ms, environment 0ms, prepare 41ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 39 | ×1 | 39 |
| Invocations | 23 | ×2 | 46 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 4 | ×5 | 20 |
| Assignments | 32 | ×6 | 192 |
| **Total Mass** | | | **325** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 63 |
| Functions | 4 |
| Longest Function | 15 lines |
| Avg LOC/Function | 10.25 |
| Median LOC/Function | 10.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 6 |
| Code Quality | 0 |
| **Total** | **6** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 6 | 2.38 | 0 |
| Cognitive (SonarJS) | 7 | 3.00 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 323988 |
| Context Utilization | 17% |

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


