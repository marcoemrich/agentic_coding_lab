# Analysis Report: 2026-09-20_07-28-11_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking

Generated: 2026-09-20T08:43:59+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | baseline-inline-tdd-v1-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 268s |
| Started | 2026-09-20T07:28:11+00:00 |
| Ended | 2026-09-20T07:32:40+00:00 |

## Code Metrics

- **Implementation files**: ClaimOfficeCli.java, ClaimOfficeException.java, Customer.java, Damage.java, InsurancePolicy.java, Item.java, Policy.java, PriceList.java, Quote.java
- **Implementation LOC** (total): 384
- **Test files**: ClaimTest.java, PremiumTest.java, QuoteTest.java, ScenarioTest.java
- **Test LOC** (total): 340
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
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-28-11_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking/src/main/resources
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m]
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_07-28-11_claim-office-java-example-mapping_baseline-inline-tdd-v1-cc_opus-5-no-thinking/src/test/resources
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
[[1;34mINFO[m] Running [1mClaimTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m15[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.053 s -- in [1mClaimTest[m
[[1;34mINFO[m] Running [1mQuoteTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m8[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.021 s -- in [1mQuoteTest[m
[[1;34mINFO[m] Running [1mPremiumTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m5[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.016 s -- in [1mPremiumTest[m
[[1;34mINFO[m] Running [1mScenarioTest[m
[[1;34mINFO[m] [1;32mTests run: [0;1;32m7[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.150 s -- in [1mScenarioTest[m
[[1;34mINFO[m]
[[1;34mINFO[m] Results:
[[1;34mINFO[m]
[[1;34mINFO[m] [1;32mTests run: 35, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m]
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  1.267 s
[[1;34mINFO[m] Finished at: 2026-09-20T08:44:01Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 77 | ×1 | 77 |
| Invocations | 233 | ×2 | 466 |
| Conditionals | 18 | ×4 | 72 |
| Loops | 12 | ×5 | 60 |
| Assignments | 72 | ×6 | 432 |
| **Total Mass** | | | **1107** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 311 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 27 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 2386280 |
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
