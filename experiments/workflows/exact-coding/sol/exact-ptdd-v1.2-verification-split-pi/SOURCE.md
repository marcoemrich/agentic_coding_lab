# Source

Experimental branch of `exact-ptdd-v1-pi`.

The sole treatment is a split of the test list into driving tests and verification tests. The test-list skill sorts each test by whether it is expected to fail once its predecessors are implemented minimally; tests expected to pass, typically cross-dimension combinations from the dimensions cross-check, go into a group named `verification` after all driving tests. The Predictive-TDD cycle re-examines each driving test before activating it and may move it into that group, naming the earlier test that forced the covering behavior. Verification tests are activated only after every driving test is green, each with the prediction that it passes; one that fails gets a full cycle.

The group name is a measurement contract: `tdd-report.py` ends the TDD part of the phase chain at the first verification test, so `tdd_discipline` reads only the driving part. See README, "Verification tests and the cutoff", and `experiments/workflows/MARKERS.md`.

Predictions, dimensions cross-check, stack profiles, domain-boundary trial, narrow undo, lab markers, and autonomy remain unchanged.

Validation status: unmeasured before smoke and fill runs.
