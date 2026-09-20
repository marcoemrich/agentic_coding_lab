# Analysis Report: 2026-09-20_07-33-00_claim-office-java-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-20T08:44:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | exact-ptdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 1214s |
| Started | 2026-09-20T07:33:00+00:00 |
| Ended | 2026-09-20T07:53:15+00:00 |

## Code Metrics

- **Implementation files**: ClaimOffice.java, ClaimOfficeCli.java, ComponentBlocks.java, Customer.java, CustomerModifiers.java, Damage.java, DamagedItem.java, Item.java, MhpcoFavour.java, Policy.java, PriceList.java, Reimbursement.java, RiskSurcharges.java, Settlement.java
- **Implementation LOC** (total): 457
- **Test files**: ClaimOfficeTest.java
- **Test LOC** (total): 516
- **Active tests**: 52
- **Remaining todos**: 1

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
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-33-00_claim-office-java-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking/src/main/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-33-00_claim-office-java-example-mapping_exact-ptdd-v1-cc_opus-5-no-thinking/src/test/resources
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
[[1;34mINFO[m] Running [1mClaimOfficeTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m52[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.294 s -- in [1mClaimOfficeTest[m
[[1;34mINFO[m]
[[1;34mINFO[m] Results:
[[1;34mINFO[m]
[[1;34mINFO[m] [1;32mTests run: 52, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m]
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  1.510 s
[[1;34mINFO[m] Finished at: 2026-09-20T08:44:14Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 90 | ×1 | 90 |
| Invocations | 225 | ×2 | 450 |
| Conditionals | 15 | ×4 | 60 |
| Loops | 14 | ×5 | 70 |
| Assignments | 69 | ×6 | 414 |
| **Total Mass** | | | **1084** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 372 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 19 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 20172361 |
| Context Utilization | 76% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 82 |
| Avg Cycle Time | 0.00s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 0s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 104 |
| Predictions Total | 104 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 52 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 30 |
