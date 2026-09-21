#!/usr/bin/env bash
# Install the run's test toolchain. Called by run-batch.sh from inside the run
# directory, before the model is invoked. A non-zero exit aborts the batch:
# a broken toolchain is an infrastructure failure, not a kata result.
set -euo pipefail

# test-compile resolves and caches the plugin and dependency tree into the
# shared ~/.m2 volume without running the (still empty) suite.
exec mvn -q test-compile
