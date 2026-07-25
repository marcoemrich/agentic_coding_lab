# Analysis Report: 2026-07-25_10-21-35_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking

Generated: 2026-07-25T13:12:18+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b-no-thinking |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 757s |
| Started | 2026-07-25T10:21:35+00:00 |
| Ended | 2026-07-25T10:34:13+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 130
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 175
- **Active tests**: 18
- **Remaining todos**: 19

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_10-21-35_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_10-21-35_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b-no-thinking

 ❯ src/claim-office.spec.ts  (37 tests | 3 failed | 19 skipped) 8ms
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should apply 20% loyalty discount to a long-standing customer (≥ 2 years) on policy base premium -- (loyalty: 20% off base sum)
     → expected 95 to be 93 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should apply 15% discount on each contract after the first -- (follow-up contract: 15% discount)
     → expected 115 to be 100 // Object.is equality
   ❯ src/claim-office.spec.ts > MHPCO Claim Office > should apply first insurance surcharge even for a long-standing customer's new sword -- (each item treated as first insurance)
     → expected 95 to be 80 // Object.is equality

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should apply 20% loyalty discount to a long-standing customer (≥ 2 years) on policy base premium -- (loyalty: 20% off base sum)
AssertionError: expected 95 to be 93 // Object.is equality

- Expected
+ Received

- 93
+ 95

 ❯ src/claim-office.spec.ts:109:9
    107|       customer: { yearsWithMHPCO: 2 }, 
    108|       items: [{ type: "sword" }] 
    109|     })).toBe(93); // 100 - 20 = 80 + 8 + 5 = 93 G
       |         ^
    110|   });
    111|   it("should apply 10% initial assessment surcharge on first insurance…

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should apply 15% discount on each contract after the first -- (follow-up contract: 15% discount)
AssertionError: expected 115 to be 100 // Object.is equality

- Expected
+ Received

- 100
+ 115

 ❯ src/claim-office.spec.ts:131:9
    129|       customer: { yearsWithMHPCO: 1 }, // This would be a follow-up co…
    130|       items: [{ type: "sword" }] 
    131|     })).toBe(100); // 100 + 10 - 15 + 5 = 100 G
       |         ^
    132|   });
    133|   it("should apply first insurance surcharge even for a long-standing …

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/claim-office.spec.ts > MHPCO Claim Office > should apply first insurance surcharge even for a long-standing customer's new sword -- (each item treated as first insurance)
AssertionError: expected 95 to be 80 // Object.is equality

- Expected
+ Received

- 80
+ 95

 ❯ src/claim-office.spec.ts:148:9
    146|       customer: { yearsWithMHPCO: 3 }, 
    147|       items: [{ type: "sword" }] 
    148|     })).toBe(80); // 100 - 20 + 10 - 15 + 5 = 80 G
       |         ^
    149|   });
    150| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯

 Test Files  1 failed (1)
      Tests  3 failed | 15 passed | 19 todo (37)
   Start at  13:12:18
   Duration  378ms (transform 39ms, setup 0ms, collect 36ms, tests 8ms, environment 0ms, prepare 128ms)

 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 49 | ×1 | 49 |
| Invocations | 41 | ×2 | 82 |
| Conditionals | 9 | ×4 | 36 |
| Loops | 6 | ×5 | 30 |
| Assignments | 26 | ×6 | 156 |
| **Total Mass** | | | **353** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 81 |
| Functions | 7 |
| Longest Function | 49 lines |
| Avg LOC/Function | 13.00 |
| Median LOC/Function | 3.00 |
| Imports | 1 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 0 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **11** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 7 | 2.27 | 0 |
| Cognitive (SonarJS) | 5 | 2.50 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 9693824 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 2 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 18 |
| Predictions Total | 20 |
| Accuracy | 90% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 10 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


