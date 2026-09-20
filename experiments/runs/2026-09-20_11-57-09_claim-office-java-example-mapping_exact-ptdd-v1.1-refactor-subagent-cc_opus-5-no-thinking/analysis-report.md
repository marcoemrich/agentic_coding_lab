# Analysis Report: 2026-09-20_11-57-09_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-20T13:40:31+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 6200s |
| Started | 2026-09-20T11:57:09+00:00 |
| Ended | 2026-09-20T13:40:31+00:00 |

## Code Metrics

- **Implementation files**: AlikeItems.java, ClaimOffice.java, ClaimOfficeCli.java, ClaimOfficeException.java, ClaimResult.java, ClaimStep.java, ComponentBlockOffer.java, Customer.java, Damage.java, Incident.java, Item.java, ItemRiskSurcharge.java, OfficesFavour.java, PayoutCalculator.java, PoliciesOnFile.java, Policy.java, PolicyBasePremium.java, PolicyCover.java, PolicyModifiers.java, PolicyRiskSurcharges.java, PolicyWideModifier.java, PremiumCalculator.java, PriceList.java, QuoteAssessment.java, QuoteResult.java, QuoteStep.java, RecognisedRisk.java, ReimbursementClauses.java, Scenario.java, ScenarioJson.java, Step.java, StepResult.java, UnclaimedCover.java
- **Implementation LOC** (total): 890
- **Test files**: ClaimOfficeTest.java
- **Test LOC** (total): 670
- **Active tests**: 53
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
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_11-57-09_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking/src/main/resources
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_11-57-09_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking/src/test/resources
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
[[1;34mINFO[m] [1;32mTests run: [0;1;32m53[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.273 s -- in [1mClaimOfficeTest[m
[[1;34mINFO[m] 
[[1;34mINFO[m] Results:
[[1;34mINFO[m] 
[[1;34mINFO[m] [1;32mTests run: 53, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  1.615 s
[[1;34mINFO[m] Finished at: 2026-09-20T13:40:34Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 82 | ×1 | 82 |
| Invocations | 305 | ×2 | 610 |
| Conditionals | 11 | ×4 | 44 |
| Loops | 41 | ×5 | 205 |
| Assignments | 91 | ×6 | 546 |
| **Total Mass** | | | **1487** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 728 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 33 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 50891655 |
| Context Utilization | 141% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 53 |
| Avg Cycle Time | 88.63s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 88.63s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 108 |
| Predictions Total | 109 |
| Accuracy | 99% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 52 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


