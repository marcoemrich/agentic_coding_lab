#!/usr/bin/env bash
# Install the run's test toolchain. Called by run-batch.sh from inside the run
# directory, before the model is invoked. A non-zero exit aborts the batch:
# a broken toolchain is an infrastructure failure, not a kata result.
set -euo pipefail

# --prod=false installs devDependencies even when the container sets
# NODE_ENV=production; --prefer-offline reuses the persistent pnpm store.
exec pnpm install --prod=false --prefer-offline
