# Analysis Report: 2026-09-20_06-41-29_claim-office-java-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex

Generated: 2026-09-20T08:39:41+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | exact-ptdd-v1-pi |
| Model | gpt-5-6-sol-codex |
| Model Version(s) | N/A |
| Thinking | unknown |
| Duration | 2217s |
| Started | 2026-09-20T06:41:32+00:00 |
| Ended | 2026-09-20T07:18:32+00:00 |

## Code Metrics

- **Implementation files**: ClaimOfficeCli.java
- **Implementation LOC** (total): 192
- **Test files**: ClaimOfficeCliTest.java
- **Test LOC** (total): 186
- **Active tests**: 35
- **Remaining todos**: 0

## Test Results

**Status**: ✅ All tests passing (Maven)

```
[[1;34mINFO[m] Scanning for projects...
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--------------------------< [0;36mexample:example[0;1m >---------------------------[m
[[1;34mINFO[m] [1mBuilding example 1.0-SNAPSHOT[m
[[1;34mINFO[m] [1m--------------------------------[ jar ]---------------------------------[m
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:resources[m [1m(default-resources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_06-41-29_claim-office-java-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex/src/main/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_06-41-29_claim-office-java-example-mapping_exact-ptdd-v1-pi_gpt-5-6-sol-codex/src/test/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:testCompile[m [1m(default-testCompile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-surefire-plugin:3.5.2:test[m [1m(default-test)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using auto detected provider org.apache.maven.surefire.junitplatform.JUnitPlatformProvider
[[1;34mINFO[m]
[[1;34mINFO[m] -------------------------------------------------------
[[1;34mINFO[m]  T E S T S
[[1;34mINFO[m] -------------------------------------------------------
[[1;34mINFO[m] Running [1mClaimOfficeCliTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m35[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 1.122 s -- in [1mClaimOfficeCliTest[m
[[1;34mINFO[m]
[[1;34mINFO[m] Results:
[[1;34mINFO[m]
[[1;34mINFO[m] [1;32mTests run: 35, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m]
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  2.112 s
[[1;34mINFO[m] Finished at: 2026-09-20T08:39:44Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 90 | ×1 | 90 |
| Invocations | 126 | ×2 | 252 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 8 | ×5 | 40 |
| Assignments | 39 | ×6 | 234 |
| **Total Mass** | | | **672** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 172 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 8 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 10771798 |
| Context Utilization | 0% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 35 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 70 |
| Predictions Total | 70 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 35 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |
