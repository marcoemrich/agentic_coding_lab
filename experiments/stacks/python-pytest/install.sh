#!/usr/bin/env bash
# Install the run's test toolchain. Called by run-batch.sh from inside the run
# directory, before the model is invoked. A non-zero exit aborts the batch:
# a broken toolchain is an infrastructure failure, not a kata result.
set -euo pipefail

# `uv venv` bootstraps its own virtualenv and needs neither ensurepip nor the
# distribution's python3-venv package. The pins live in requirements-dev.txt
# rather than a lock file so the recorded artifact states its own tool
# versions in one readable place; UV_CACHE_DIR points at the shared volume.
uv venv .venv
exec uv pip install --python .venv/bin/python -r requirements-dev.txt
