# Analysis Report: 2026-09-20_07-18-54_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-20T08:42:58+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 246s |
| Started | 2026-09-20T07:18:54+00:00 |
| Ended | 2026-09-20T07:23:02+00:00 |

## Code Metrics

- **Implementation files**: ClaimOfficeCli.java, ClaimOfficeException.java, ClaimResult.java, ComponentBlocks.java, Customer.java, Damage.java, Incident.java, Item.java, MhpcoRounding.java, Policy.java, PremiumCalculator.java, PriceList.java, ScenarioRunner.java
- **Implementation LOC** (total): 482
- **Test files**: ClaimOfficeCliTest.java, ComponentBlockTest.java, MhpcoRoundingTest.java, PolicyClaimTest.java, PremiumCalculatorTest.java, PriceListTest.java
- **Test LOC** (total): 483
- **Active tests**: 59
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
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-18-54_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking/src/main/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-18-54_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking/src/test/resources
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
[[1;34mINFO[m] [1;32mTests run: [0;1;32m10[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.224 s -- in [1mClaimOfficeCliTest[m
[[1;34mINFO[m] Running [1mPolicyClaimTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m18[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.032 s -- in [1mPolicyClaimTest[m
[[1;34mINFO[m] Running [1mComponentBlockTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m7[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.008 s -- in [1mComponentBlockTest[m
[[1;34mINFO[m] Running [1mMhpcoRoundingTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m6[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.005 s -- in [1mMhpcoRoundingTest[m
[[1;34mINFO[m] Running [1mPremiumCalculatorTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m11[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.009 s -- in [1mPremiumCalculatorTest[m
[[1;34mINFO[m] Running [1mPriceListTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m7[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.008 s -- in [1mPriceListTest[m
[[1;34mINFO[m]
[[1;34mINFO[m] Results:
[[1;34mINFO[m]
[[1;34mINFO[m] [1;32mTests run: 59, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m]
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  1.509 s
[[1;34mINFO[m] Finished at: 2026-09-20T08:43:01Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 85 | ×1 | 85 |
| Invocations | 281 | ×2 | 562 |
| Conditionals | 20 | ×4 | 80 |
| Loops | 10 | ×5 | 50 |
| Assignments | 70 | ×6 | 420 |
| **Total Mass** | | | **1197** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 397 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 29 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 1937687 |
| Context Utilization | 31% |

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
