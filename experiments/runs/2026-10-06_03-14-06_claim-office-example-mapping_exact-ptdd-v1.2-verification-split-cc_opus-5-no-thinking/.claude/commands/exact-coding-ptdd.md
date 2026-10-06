
# EXACT Coding Predictive TDD — TCR-Parity Port

Run one shared workflow: create the complete test list once, then implement one behavior at a time using Predictive TDD. This port retains the TCR trial workflow's non-method-specific test-list, domain-responsibility, stack, and lab contracts while replacing phase commits and hard resets with prediction, checking, and local undo.

## Preparation

1. Read `.claude/commands/test-list/SKILL.md`.
2. Read `.claude/commands/predictive-tdd/SKILL.md`.
3. Read the complete specification.
4. Determine the project's language and test framework. If `.claude/skills/exact-coding-ptdd/stacks/` contains a matching profile, read it before changing code.
5. Determine the project's inactive-test mechanism, full-suite command, and applicable quality gates from the profile and repository.
6. Establish the applicable baseline gates before creating the test list.

## Sequence

1. Create the complete ordered test list with every future behavior inactive: the driving tests first, the verification tests after them in their `verification` group.
2. Predict and run the full suite. Continue only when the inactive list leaves the suite green; correct the list without implementing behavior if it does not.
3. For exactly one driving behavior at a time, follow `.claude/commands/predictive-tdd/SKILL.md`:
   - reconsider whether the next driving test will still fail, and move it into the `verification` group before activating it if an earlier generalization already covers it,
   - activate exactly one behavior and reach the intended behavioral RED,
   - compare the predicted and actual result without committing or resetting,
   - make the smallest production change and verify GREEN,
   - review production and test code under the Four Rules of Simple Design,
   - perform the domain-responsibility review and mandatory boundary trial,
   - predict and verify each useful refactoring separately, undoing only the attempted refactoring when it fails or does not improve intent.
4. When every driving test is active and green, activate the verification tests one at a time, as described under "Verification part" in `.claude/commands/predictive-tdd/SKILL.md`.
5. Continue until every listed behavior is executable and the full suite and all applicable quality gates from the active stack profile pass.

A test already satisfied by an earlier generalization is legitimate evidence, not a gap. If you foresee it before activation, it belongs in the `verification` group. If it surprises you after activation, record the missed prediction. In neither case manufacture a failure or production change.

## Method boundary

This is Predictive TDD, not TCR. Do not stage phase changes, create `[TEST LIST]`, `[RED]`, `[GREEN]`, or `[REFACTOR]` commits, or run `git reset --hard` as a phase mechanism. The isolated repository is a controlled harness condition only. Preserve successful work in the working tree and undo an unsuccessful trial narrowly before continuing.

## Completion

The feature is complete only when every listed behavior has an executable test, all tests and applicable quality gates pass, prediction mismatches are explained, the Four Rules and domain-boundary reviews are complete, and no unagreed behavior was added.
