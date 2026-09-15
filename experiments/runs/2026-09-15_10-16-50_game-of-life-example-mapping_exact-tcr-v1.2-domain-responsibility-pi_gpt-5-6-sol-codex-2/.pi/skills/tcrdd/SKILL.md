---
name: tcrdd
description: Run Test-Commit-Revert within a TDD Red-Green-Refactor cycle. Use when the user explicitly requests TCRDD, TCR, commit-on-green, or revert-on-failure.
---

# TCRDD

Apply Test-Commit-Revert to every phase of a Red-Green-Refactor cycle. A phase is valid only after an actual test run with the expected result.

## Preconditions

1. Start from a clean Git working tree, including no untracked files.
2. If the tree is not clean, stop and ask the user to commit, stash, or remove the existing changes.
3. Determine the repository's full test-suite command and reuse it in every phase.

The clean-tree requirement is mandatory: each phase stages all changes, and a failed phase is discarded with `git reset --hard HEAD`.

## Cycle

Work in one small step at a time:

```text
RED → GREEN → REFACTOR → RED ...
```

### RED

1. Add exactly one test for the smallest next behavior.
2. Stage the complete change:

   ```bash
   git add -A
   ```

3. Run the full test suite.
4. If the new test fails for the intended reason, commit:

   ```bash
   git commit -m "[RED] <behavior>"
   ```

5. If the test passes unexpectedly or fails for another reason, discard the phase:

   ```bash
   git reset --hard HEAD
   ```

Do not proceed until the test has produced the intended failure.

### GREEN

1. Make the smallest production change that can pass the failing test.
2. Stage the complete change:

   ```bash
   git add -A
   ```

3. Run the full test suite.
4. If all tests pass, commit:

   ```bash
   git commit -m "[GREEN] <behavior>"
   ```

5. If any test fails, discard the phase:

   ```bash
   git reset --hard HEAD
   ```

Do not add behavior not required by the current failing test.

### REFACTOR

With all tests green, review production and test code against the Four Rules of Simple Design, in order:

1. Passes the tests
2. Reveals intention
3. Contains no duplication, including duplicated knowledge
4. Has the fewest elements

Use domain-appropriate names and do not leak temporary implementation details into them. Linters and smell detectors are evidence, not substitutes for this review.

### Domain responsibility review

Apply the Single Responsibility Principle as part of Rule 2, using Domain-Driven Design's ubiquitous-language idea as the semantic anchor. This is a domain-language review, not a request to introduce DDD patterns or architecture layers.

For each production unit under review:

- State its responsibility as a short domain sentence using terms from the specification. A mechanical description such as "process data", "calculate result", or "handle scenario" is too broad to establish cohesion.
- Name the policy decisions and domain knowledge the unit owns. Ask which rules could change independently because the business meaning, policy, or actor differs—not merely which lines could be extracted.
- Separate independently changing domain decisions behind names that explain their policy. Also separate domain decisions from application orchestration and adapters such as transport, persistence, parsing, or presentation.
- Keep cohesive knowledge together. Do not split code merely to shorten a function, satisfy a metric, or imitate a design pattern.

**Priority over Rule 4:** A well-named element that isolates independently changing domain knowledge is necessary because it reveals intent. It is not an "extra element" for Rule 4 to remove. Apply "fewest elements" only after the domain responsibilities and their boundaries are explicit; never inline or reject a domain boundary solely because fewer functions, classes, or modules would result.

Before concluding that no useful refactoring exists, record:

```text
Domain responsibility: <the unit's responsibility in specification language>
Independent change axes: <the distinct policy decisions, or why they form one cohesive decision>
Boundary decision: <the domain boundary extracted, or why keeping the unit together better reveals intent>
```

A generic claim that the code is small, simple, or already cohesive is not sufficient. The decision must refer to the actual domain rules in the current unit. Use the active stack profile only for language- and framework-specific application guidance.

For each improvement:

1. Make exactly one behavior-preserving structural change.
2. Stage the complete change:

   ```bash
   git add -A
   ```

3. Run the full test suite.
4. If all tests pass, commit:

   ```bash
   git commit -m "[REFACTOR] <structural change>"
   ```

5. If any test fails, discard the phase:

   ```bash
   git reset --hard HEAD
   ```

Review the Four Rules again after each successful refactoring. If no refactoring improves them, leave the code unchanged and continue with RED.

## Rules

- Run the tests; never infer or merely report their outcome.
- Make only one small change per phase.
- Commit only when the phase's expected test outcome occurs.
- Revert the whole phase when the expected outcome does not occur.
- Never mix new behavior into REFACTOR.
- Never continue from a failed or unexplained test run.
