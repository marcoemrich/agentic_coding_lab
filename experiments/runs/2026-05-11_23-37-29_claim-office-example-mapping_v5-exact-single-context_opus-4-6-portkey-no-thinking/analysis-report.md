# Analysis Report: 2026-05-11_23-37-29_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

Generated: 2026-06-02T07:55:12+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v5-exact-single-context |
| Model | opus-4-6-portkey-no-thinking |
| Model Version(s) | claude-opus-4-6 |
| Thinking | unknown |
| Duration | 1964s |
| Started | 2026-05-11T23:37:29+00:00 |
| Ended | 2026-05-12T00:10:15+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, cli.ts
- **Implementation LOC** (total): 128
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 838
- **Active tests**: 41
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (41 passed)

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-37-29_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking
> vitest run


 RUN  v1.6.1 /home/memrich/sync/workspace/agentic_coding_lab_project/main/experiments/runs/2026-05-11_23-37-29_claim-office-example-mapping_v5-exact-single-context_opus-4-6-portkey-no-thinking

npm warn Unknown env config "verify-deps-before-run". This will stop working in the next major version of npm.
npm warn Unknown env config "npm-globalconfig". This will stop working in the next major version of npm.
npm warn Unknown env config "_jsr-registry". This will stop working in the next major version of npm.
 ✓ src/claim-office.spec.ts  (41 tests) 611ms

 Test Files  1 passed (1)
      Tests  41 passed (41)
   Start at  07:55:14
   Duration  998ms (transform 42ms, setup 0ms, collect 47ms, tests 611ms, environment 0ms, prepare 69ms)
```

## Coverage

| Metric | Coverage |
|--------|----------|
| Statements | 92% |
| Branches | 92% |

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 58 | ×1 | 58 |
| Invocations | 44 | ×2 | 88 |
| Conditionals | 13 | ×4 | 52 |
| Loops | 8 | ×5 | 40 |
| Assignments | 46 | ×6 | 276 |
| **Total Mass** | | | **514** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 122 |
| Functions | 3 |
| Longest Function | 40 lines |
| Avg LOC/Function | 32.00 |
| Median LOC/Function | 39.00 |
| Imports | 2 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 0 |
| Magic Numbers | 11 |
| Code Quality | 0 |
| **Total** | **15** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 6.00 | 2 |
| Cognitive (SonarJS) | 19 | 12.67 | 2 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 49320363 |
| Context Utilization | 84% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 33 |
| Avg Cycle Time | 97.95s |
| Avg Red Phase | 27.37s |
| Avg Green Phase | 31.8s |
| Avg Refactor Phase | 38.78s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 66 |
| Predictions Total | 66 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 8 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 12 |


