# Analysis Report: 2026-05-11_20-29-07_game-of-life-example-mapping_v4.2-conservative_opus-4-7-2

Generated: 2026-05-11T20:41:14+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.2-conservative |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 726s |
| Started | 2026-05-11T20:29:07+00:00 |
| Ended | 2026-05-11T20:41:14+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 42
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 91
- **Active tests**: 9
- **Remaining todos**: 0

## Test Results

**Status**: ❌ Tests failed or not runnable

```
Lockfile is up to date, resolution step is skipped
Already up to date

[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: esbuild@0.21.5, esbuild@0.27.7

Run "pnpm approve-builds" to pick which dependencies should be allowed to run scripts.
[ERROR] Command failed with exit code 1: /usr/local/bin/node /home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/bin/pnpm.mjs install

pnpm: Command failed with exit code 1: /usr/local/bin/node /home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/bin/pnpm.mjs install
    at getFinalError (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:28547:14)
    at makeError (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:30854:21)
    at getSyncResult (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:32698:10)
    at spawnSubprocessSync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:32658:14)
    at execaCoreSync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:32588:23)
    at callBoundExeca (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:35116:23)
    at boundExeca (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:35093:49)
    at sync (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:35252:10)
    at runPnpmCli (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:210243:5)
    at runDepsStatusCheck (file:///home/experimenter/.cache/node/corepack/v1/pnpm/11.0.9/dist/pnpm.mjs:211947:7)
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 11 | ×1 | 11 |
| Invocations | 19 | ×2 | 38 |
| Conditionals | 4 | ×4 | 16 |
| Loops | 5 | ×5 | 25 |
| Assignments | 12 | ×6 | 72 |
| **Total Mass** | | | **162** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 37 |
| Functions | 2 |
| Longest Function | 36 lines |
| Avg LOC/Function | 19.50 |
| Median LOC/Function | 19.50 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 4 |
| Duplication | 1 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **8** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 14 | 7.50 | 1 |
| Cognitive (SonarJS) | 24 | 24.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2875582 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 9 |
| Avg Cycle Time | 105.85s |
| Avg Red Phase | 42.03s |
| Avg Green Phase | 29.94s |
| Avg Refactor Phase | 33.88s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 11 |
| Predictions Total | 12 |
| Accuracy | 91% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 2 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 6 |


