# Analysis Report: 2026-09-20_07-22-29_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-20T08:43:11+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 310s |
| Started | 2026-09-20T07:22:29+00:00 |
| Ended | 2026-09-20T07:27:41+00:00 |

## Code Metrics

- **Implementation files**: ClaimOfficeCli.java, ClaimOfficeException.java, Claims.java, Customer.java, Damage.java, Item.java, Policy.java, Premium.java, PriceList.java, Scenario.java
- **Implementation LOC** (total): 371
- **Test files**: BasePremiumTest.java, ClaimOfficeCliTest.java, ComponentBlockTest.java, ItemModifierTest.java, PayoutTest.java, PolicyTest.java, QuotePremiumTest.java, ScenarioTest.java, SpecExamplesTest.java
- **Test LOC** (total): 640
- **Active tests**: 76
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
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-22-29_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking/src/main/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-22-29_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking/src/test/resources
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
[[1;34mINFO[m] [1;32mTests run: [0;1;32m5[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.195 s -- in [1mClaimOfficeCliTest[m
[[1;34mINFO[m] Running [1mBasePremiumTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m11[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.012 s -- in [1mBasePremiumTest[m
[[1;34mINFO[m] Running [1mPolicyTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m11[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.017 s -- in [1mPolicyTest[m
[[1;34mINFO[m] Running [1mComponentBlockTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m8[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.007 s -- in [1mComponentBlockTest[m
[[1;34mINFO[m] Running [1mSpecExamplesTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m8[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.005 s -- in [1mSpecExamplesTest[m
[[1;34mINFO[m] Running [1mQuotePremiumTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m10[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.006 s -- in [1mQuotePremiumTest[m
[[1;34mINFO[m] Running [1mItemModifierTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m7[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.004 s -- in [1mItemModifierTest[m
[[1;34mINFO[m] Running [1mScenarioTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m8[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.008 s -- in [1mScenarioTest[m
[[1;34mINFO[m] Running [1mPayoutTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m8[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.004 s -- in [1mPayoutTest[m
[[1;34mINFO[m]
[[1;34mINFO[m] Results:
[[1;34mINFO[m]
[[1;34mINFO[m] [1;32mTests run: 76, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m]
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  1.342 s
[[1;34mINFO[m] Finished at: 2026-09-20T08:43:13Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 75 | ×1 | 75 |
| Invocations | 227 | ×2 | 454 |
| Conditionals | 14 | ×4 | 56 |
| Loops | 14 | ×5 | 70 |
| Assignments | 67 | ×6 | 402 |
| **Total Mass** | | | **1057** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 307 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 27 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2915158 |
| Context Utilization | 33% |

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
