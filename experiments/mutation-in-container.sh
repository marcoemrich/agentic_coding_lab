#!/usr/bin/env bash
#
# Run compute-mutation-score.py for one RQ INSIDE the batch container.
#
# Why this exists: Rust is the only stack whose toolchain is not expected on the
# host. cargo, cargo-mutants and the pinned registry live in the image, so the
# engine has to run there. The host alternative CLAUDE.md describes
# (cargo install --locked cargo-mutants) needs a full Rust toolchain on the host
# and pins the engine version by hand in a second place; this wrapper uses the
# one the runs were produced with and cannot drift from it.
#
# For TypeScript, Java and Python the host path still works and is cheaper
# (no container start). Use this one when the RQ's stack is rust-cargo, or when
# the host simply lacks a toolchain.
#
# The container carries python3-yaml but deliberately no pandas: the script
# needs parse_frontmatter() from aggregate-by-query.py, not its pivot tables,
# and that module imports pandas lazily for exactly this reason. Writing
# summary.md stays a host job — run aggregate-by-query.py there afterwards so
# the fresh mutation fields reach the pivots.
#
# Usage:
#   mutation-in-container.sh <rq_dir> [extra args for compute-mutation-score.py]
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
IMAGE="${BATCH_IMAGE:-docker-batch:latest}"
CONTAINER_EXP=/home/experimenter/experiments

usage() { sed -n '2,24p' "$0"; exit 1; }
[ $# -eq 0 ] && usage

rq_dir="$1"; shift
[ -d "$rq_dir" ] || { echo "Not a directory: $rq_dir" >&2; exit 1; }
[ -f "$rq_dir/README.md" ] || { echo "No README.md in $rq_dir" >&2; exit 1; }

# Absolute, then relative to the repo root, so it resolves inside the container.
rq_abs="$(cd "$rq_dir" && pwd)"
case "$rq_abs" in
    "$REPO_ROOT"/*) rq_rel="${rq_abs#"$REPO_ROOT"/}" ;;
    *) echo "RQ dir must live inside $REPO_ROOT" >&2; exit 1 ;;
esac

echo "Mutation scoring $rq_rel in $IMAGE"

docker run --rm \
    -v "$SCRIPT_DIR/runs:$CONTAINER_EXP/runs:rw" \
    -v "$SCRIPT_DIR/compute-mutation-score.py:$CONTAINER_EXP/compute-mutation-score.py:ro" \
    -v "$SCRIPT_DIR/aggregate-by-query.py:$CONTAINER_EXP/aggregate-by-query.py:ro" \
    -v "$SCRIPT_DIR/workflow_paths.py:$CONTAINER_EXP/workflow_paths.py:ro" \
    -v "$SCRIPT_DIR/rust_tdd.py:$CONTAINER_EXP/rust_tdd.py:ro" \
    -v "$SCRIPT_DIR/workflows:$CONTAINER_EXP/workflows:ro" \
    -v "$REPO_ROOT/research:/home/experimenter/research:ro" \
    -w "$CONTAINER_EXP" "$IMAGE" \
    python3 compute-mutation-score.py "/home/experimenter/$rq_rel" "$@"

echo
echo "Done. Run aggregate-by-query.py on the host now so the new mutation"
echo "fields reach runs.csv and summary.md."
