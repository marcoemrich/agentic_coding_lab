# Analysis Report: 2026-05-11_20-29-07_game-of-life-example-mapping_v4.2-conservative_opus-4-7

Generated: 2026-05-11T20:41:38+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | game-of-life-example-mapping |
| Workflow | v4.2-conservative |
| Model | opus-4-7 |
| Model Version(s) | claude-opus-4-7 |
| Thinking | true |
| Duration | 750s |
| Started | 2026-05-11T20:29:07+00:00 |
| Ended | 2026-05-11T20:41:38+00:00 |

## Code Metrics

- **Implementation files**: game-of-life.ts
- **Implementation LOC** (total): 34
- **Test file**: game-of-life.spec.ts
- **Test file LOC**: 82
- **Active tests**: 8
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
| Constants | 12 | ×1 | 12 |
| Invocations | 20 | ×2 | 40 |
| Conditionals | 3 | ×4 | 12 |
| Loops | 6 | ×5 | 30 |
| Assignments | 10 | ×6 | 60 |
| **Total Mass** | | | **154** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 28 |
| Functions | 3 |
| Longest Function | 23 lines |
| Avg LOC/Function | 10.00 |
| Median LOC/Function | 4.00 |
| Imports | 0 |

## Code Smells

| Category | Count |
|----------|-------|
| Complexity | 2 |
| Duplication | 0 |
| Magic Numbers | 3 |
| Code Quality | 0 |
| **Total** | **5** |

## Complexity Scores

| Metric | Max | Avg | High (>10) |
|--------|-----|-----|---------------------------|
| McCabe (Cyclomatic) | 11 | 3.50 | 1 |
| Cognitive (SonarJS) | 18 | 18.00 | 1 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2707466 |
| Context Utilization | 8% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 8 |
| Avg Cycle Time | 104.64s |
| Avg Red Phase | 46.23s |
| Avg Green Phase | 28.81s |
| Avg Refactor Phase | 29.6s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 16 |
| Predictions Total | 18 |
| Accuracy | 88% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 4 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 5 |


