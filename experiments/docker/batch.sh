#!/bin/bash
# Convenience wrapper around `docker compose --profile batch run --rm batch`.
# Usage:
#   ./batch.sh                       # full cross-product (no plan)
#   ./batch.sh smoke-test            # plan name, .json optional
#   ./batch.sh smoke-test.json       # plan name with extension
#   ./batch.sh /abs/path/plan.json   # absolute path also works
#
# Pass through extra env vars as needed:
#   CLAUDE_TIMEOUT_SECONDS=600 ./batch.sh smoke-test

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLANS_DIR="$SCRIPT_DIR/../batch-plans"

cd "$SCRIPT_DIR"

if [ $# -gt 1 ]; then
    echo "Usage: $0 [PLAN_NAME_OR_PATH]" >&2
    exit 2
fi

if [ $# -eq 1 ]; then
    plan_arg="$1"

    # Accept "smoke-test", "smoke-test.json", or an absolute/relative path.
    if [ -f "$plan_arg" ]; then
        plan_file="$plan_arg"
    elif [ -f "$PLANS_DIR/$plan_arg" ]; then
        plan_file="$PLANS_DIR/$plan_arg"
    elif [ -f "$PLANS_DIR/${plan_arg}.json" ]; then
        plan_file="$PLANS_DIR/${plan_arg}.json"
    else
        echo "Plan file not found: $plan_arg" >&2
        echo "Looked in:"                     >&2
        echo "  $plan_arg"                    >&2
        echo "  $PLANS_DIR/$plan_arg"         >&2
        echo "  $PLANS_DIR/${plan_arg}.json"  >&2
        echo                                  >&2
        echo "Available plans:"               >&2
        ls "$PLANS_DIR"/*.json 2>/dev/null | xargs -n1 basename | sed 's/^/  /' >&2
        exit 2
    fi

    # run-batch.sh inside the container expects either a bare filename
    # (resolved against /home/experimenter/experiments/batch-plans) or an
    # absolute path inside the container. We pass just the basename so the
    # script's own resolution logic handles it.
    plan_basename="$(basename "$plan_file")"

    echo "Running batch with plan: $plan_basename"
    BATCH_PLAN="$plan_basename" exec docker compose --profile batch run --rm batch
else
    echo "Running full cross-product (no plan)"
    exec docker compose --profile batch run --rm batch
fi
