# Analysis Report: 2026-07-25_09-45-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b

Generated: 2026-07-25T20:38:43+02:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-example-mapping |
| Workflow | v6.2.1-phase-continuation-pi |
| Model | qwen3-235b |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2158s |
| Started | 2026-07-25T09:45:21+00:00 |
| Ended | 2026-07-25T10:21:20+00:00 |

## Code Metrics

- **Implementation files**: claim-office.ts, claimOfficeExampleMapping.ts, cli.ts
- **Implementation LOC** (total): 331
- **Test file**: claim-office.spec.ts
- **Test file LOC**: 72
- **Active tests**: 1
- **Remaining todos**: 40

## Test Results

**Status**: ❌ Tests failed or not runnable

```

> tdd-experiment-run@ test /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_09-45-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b
> vitest run

node:internal/modules/package_json_reader:316
  throw new ERR_MODULE_NOT_FOUND(packageName, fileURLToPath(base), null);
        ^

Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@vitest/utils' imported from /home/memrich/sync/workspace/agentic_coding_lab/experiments/runs/2026-07-25_09-45-21_claim-office-example-mapping_v6.2.1-phase-continuation-pi_qwen3-235b/node_modules/.bin/dist/cli.js
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:316:9)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:858:18)
    at defaultResolve (node:internal/modules/esm/resolve:990:11)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:755:20)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:732:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:317:38)
    at #link (node:internal/modules/esm/module_job:208:49) {
  code: 'ERR_MODULE_NOT_FOUND'
}

Node.js v24.9.0
 ELIFECYCLE  Test failed. See above for more details.
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 101 | ×1 | 101 |
| Invocations | 70 | ×2 | 140 |
| Conditionals | 23 | ×4 | 92 |
| Loops | 25 | ×5 | 125 |
| Assignments | 60 | ×6 | 360 |
| **Total Mass** | | | **818** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 215 |
| Functions | 6 |
| Longest Function | 78 lines |
| Avg LOC/Function | 34.00 |
| Median LOC/Function | 24.00 |
| Imports | 1 |

## Code Smells

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 0 | 0 | 0 |
| Cognitive (SonarJS) | 0 | 0 | 0 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 26757422 |
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
| Predictions Correct | 35 |
| Predictions Total | 36 |
| Accuracy | 97% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 16 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


