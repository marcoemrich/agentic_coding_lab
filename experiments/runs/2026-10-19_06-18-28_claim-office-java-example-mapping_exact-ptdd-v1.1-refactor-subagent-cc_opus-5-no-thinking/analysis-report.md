# Analysis Report: 2026-10-19_06-18-28_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-10-19T08:13:08+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6877s |
| Started | 2026-10-19T06:18:28+00:00 |
| Ended | 2026-10-19T08:13:08+00:00 |

## Code Metrics

- **Implementation files**: ClaimOffice.java, ClaimOfficeCli.java, ClaimPolicy.java, Coverage.java, Customer.java, Damage.java, InOfficesFavor.java, InsuredItem.java, PayoutCap.java, Policy.java, PremiumPolicy.java, PriceList.java, RejectedScenario.java, ScenarioProtocol.java
- **Implementation LOC** (total): 881
- **Test files**: ClaimOfficeTest.java
- **Test LOC** (total): 678
- **Active tests**: 51
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
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-10-19_06-18-28_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking/src/main/resources
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] Copying 1 resource
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
[[1;34mINFO[m] [1;32mTests run: [0;1;32m51[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.609 s -- in [1mClaimOfficeTest[m
[[1;34mINFO[m] 
[[1;34mINFO[m] Results:
[[1;34mINFO[m] 
[[1;34mINFO[m] [1;32mTests run: 51, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  1.472 s
[[1;34mINFO[m] Finished at: 2026-10-19T08:13:10Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 87 | ×1 | 87 |
| Invocations | 280 | ×2 | 560 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 30 | ×5 | 150 |
| Assignments | 62 | ×6 | 372 |
| **Total Mass** | | | **1213** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 736 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 33 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 108866643 |
| Context Utilization | 155% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 51 |
| Avg Cycle Time | 103.91s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 103.91s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 100 |
| Predictions Total | 102 |
| Accuracy | 98% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 51 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


