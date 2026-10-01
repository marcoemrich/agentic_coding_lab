#!/usr/bin/env bash
# Install the run's test toolchain. Called by run-batch.sh from inside the run
# directory, before the model is invoked. A non-zero exit aborts the batch:
# a broken toolchain is an infrastructure failure, not a kata result.
set -euo pipefail

# Compiles the pinned dependencies into target/ from the offline registry,
# without running the (still empty) suite, so the agent's first `cargo test`
# does not pay for serde. `--no-run` is not recorded as a TDD event.
exec cargo test --no-run --quiet
