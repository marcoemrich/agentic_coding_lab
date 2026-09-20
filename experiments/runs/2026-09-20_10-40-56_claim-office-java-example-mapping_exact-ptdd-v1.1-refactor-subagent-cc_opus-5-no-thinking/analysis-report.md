# Analysis Report: 2026-09-20_10-40-56_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking

Generated: 2026-09-20T12:07:51+00:00

## Configuration

| Property | Value |
|----------|-------|
| Kata | claim-office-java-example-mapping |
| Workflow | exact-ptdd-v1.1-refactor-subagent-cc |
| Model | opus-5-no-thinking |
| Model Version(s) | claude-opus-5 |
| Thinking | unknown |
| Duration | 5214s |
| Started | 2026-09-20T10:40:56+00:00 |
| Ended | 2026-09-20T12:07:51+00:00 |

## Code Metrics

- **Implementation files**: BuildingBlock.java, ClaimOfficeCli.java, ClaimResult.java, ClaimStep.java, Customer.java, CustomerStanding.java, Damage.java, DamageClause.java, DamagedItem.java, Incident.java, InsurableRisk.java, InsuranceSum.java, Item.java, PayoutCap.java, Percentage.java, Policy.java, PolicyBasePremium.java, PolicyModifiers.java, PremiumCalculator.java, PriceList.java, QuoteResult.java, QuoteStep.java, Reimbursement.java, RejectedScenario.java, ResultsWriter.java, RiskSurcharges.java, Scenario.java, ScenarioLedger.java, ScenarioReader.java, Step.java, StepResult.java, WholeG.java
- **Implementation LOC** (total): 985
- **Test files**: ClaimOfficeTest.java
- **Test LOC** (total): 860
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
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_10-40-56_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking/src/main/resources
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m--- [0;32mmaven-compiler-plugin:3.13.0:compile[m [1m(default-compile)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Nothing to compile - all classes are up to date.
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m--- [0;32mmaven-resources-plugin:2.6:testResources[m [1m(default-testResources)[m @ [36mexample[0;1m ---[m
[[1;34mINFO[m] Using 'UTF-8' encoding to copy filtered resources.
[[1;34mINFO[m] skip non existing resourceDirectory /home/experimenter/experiments/runs/2026-09-20_10-40-56_claim-office-java-example-mapping_exact-ptdd-v1.1-refactor-subagent-cc_opus-5-no-thinking/src/test/resources
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
[[1;34mINFO[m] [1;32mTests run: [0;1;32m53[m, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 0.297 s -- in [1mClaimOfficeTest[m
[[1;34mINFO[m] 
[[1;34mINFO[m] Results:
[[1;34mINFO[m] 
[[1;34mINFO[m] [1;32mTests run: 53, Failures: 0, Errors: 0, Skipped: 0[m
[[1;34mINFO[m] 
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] [1;32mBUILD SUCCESS[m
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[[1;34mINFO[m] Total time:  1.434 s
[[1;34mINFO[m] Finished at: 2026-09-20T12:07:53Z
[[1;34mINFO[m] [1m------------------------------------------------------------------------[m
[0m[0m
```

## APP Mass Estimation

| Component | Count | Weight | Score |
|-----------|-------|--------|-------|
| Constants | 69 | ×1 | 69 |
| Invocations | 307 | ×2 | 614 |
| Conditionals | 7 | ×4 | 28 |
| Loops | 39 | ×5 | 195 |
| Assignments | 51 | ×6 | 306 |
| **Total Mass** | | | **1212** |

## Clean Code Metrics

| Metric | Value |
|--------|-------|
| LOC (non-blank) | 814 |
| Functions | 0 |
| Longest Function | 0 lines |
| Avg LOC/Function | 0.00 |
| Median LOC/Function | 0.00 |
| Imports | 48 |

## Transcript Metrics

### Token Usage

| Metric | Value |
|--------|-------|
| Total Tokens | 33542428 |
| Context Utilization | 115% |

### TDD Cycle Metrics

| Metric | Value |
|--------|-------|
| Cycle Count | 47 |
| Avg Cycle Time | 128.28s |
| Avg Red Phase | 0s |
| Avg Green Phase | 0s |
| Avg Refactor Phase | 128.28s |

### Prediction Accuracy (Guessing Game) — Self-Reported

| Metric | Value |
|--------|-------|
| Predictions Correct | 92 |
| Predictions Total | 92 |
| Accuracy | 100% |

_Counts come from the red-phase agent's own 'Correct'/'Incorrect' markers and may be biased._

### Refactoring Metrics

| Metric | Value |
|--------|-------|
| Refactorings Applied | 28 |

### TDD Discipline

| Metric | Value |
|--------|-------|
| Tests Passed Immediately | 0 |


