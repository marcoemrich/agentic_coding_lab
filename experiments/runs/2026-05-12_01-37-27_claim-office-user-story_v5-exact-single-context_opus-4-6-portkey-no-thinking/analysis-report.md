# Analysis Report: 2026-05-12_01-37-27_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-05-13T07:48:38+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-user-story |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | N/As |
| Started | 2026-05-12T01:37:27+00:00 |
| Ended | N/A |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 169
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 482
- **Active tests**: 19
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (19 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-37-27_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-12_01-37-27_claim-office-user-story_v5-exact-single-context_opus-4-6-portkey-no-thinking

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (19 tests) 675ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  07:48:39
   Duration  1.05s (transform 43ms, setup 0ms, collect 38ms, tests 675ms, environment 0ms, prepare 112ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 96% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 43 | ×1 | 43 |
| Invocations | 43 | ×2 | 86 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 5 | ×5 | 25 |
| Assignments | 54 | ×6 | 324 |
| **Total Mass** | | | **506** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 150 |
| Functions | 7 |
| Longest Function | 26 lines |
| Avg LOC/Function | 11.86 |
| Median LOC/Function | 10.00 |
| Imports | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 48631837 |
| Context Utilization | 83% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 19 |
| Avg Cycle Time | 127.74s |
| Avg Red Phase | 38.5s |
| Avg Green Phase | 34.57s |
| Avg Refactor Phase | 54.67s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 36 |
| Predictions Total | 36 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 17 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


