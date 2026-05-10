#!/bin/bash
# Convenience wrapper around `docker compose --profile batch run --rm batch`.
# Usage:
#   ./batch.sh                              # full cross-product (no plan)
#   ./batch.sh smoke-test                   # plan name, .json optional
#   ./batch.sh smoke-test.json              # plan name with extension
#   ./batch.sh /abs/path/plan.json          # absolute path also works
#   ./batch.sh smoke-test --shards 2        # split into 2 shards, run in parallel
#   ./batch.sh smoke-test --shards 2 --detach   # parallel, return immediately
#
# Pass through extra env vars as needed:
#   CLAUDE_TIMEOUT_SECONDS=600 ./batch.sh smoke-test

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLANS_DIR="$SCRIPT_DIR/../batch-plans"

cd "$SCRIPT_DIR"

# ---------------------------------------------------------------------------
# Argument parsing
# ---------------------------------------------------------------------------

plan_arg=""
shards=1
detach="false"

while [ $# -gt 0 ]; do
    case "$1" in
        --shards)
            shards="$2"
            shift 2
            ;;
        --shards=*)
            shards="${1#--shards=}"
            shift
            ;;
        --detach)
            detach="true"
            shift
            ;;
        --help|-h)
            sed -n '2,12p' "$0"
            exit 0
            ;;
        -*)
            echo "Unknown flag: $1" >&2
            exit 2
            ;;
        *)
            if [ -n "$plan_arg" ]; then
                echo "Usage: $0 [PLAN_NAME_OR_PATH] [--shards N] [--detach]" >&2
                exit 2
            fi
            plan_arg="$1"
            shift
            ;;
    esac
done

if ! [[ "$shards" =~ ^[1-9][0-9]*$ ]]; then
    echo "--shards must be a positive integer, got: $shards" >&2
    exit 2
fi

# ---------------------------------------------------------------------------
# No-plan mode (full cross-product) — sharding doesn't apply
# ---------------------------------------------------------------------------

if [ -z "$plan_arg" ]; then
    if [ "$shards" -gt 1 ]; then
        echo "--shards requires a plan file (full cross-product cannot be sharded)" >&2
        exit 2
    fi
    echo "Running full cross-product (no plan)"
    echo "Logging to: $SCRIPT_DIR/batch.log"
    docker compose --profile batch run --rm batch 2>&1 | tee batch.log
    exit "${PIPESTATUS[0]}"
fi

# ---------------------------------------------------------------------------
# Plan resolution
# ---------------------------------------------------------------------------

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

plan_basename="$(basename "$plan_file")"
plan_stem="${plan_basename%.json}"

# ---------------------------------------------------------------------------
# Single-shard mode (sequential, backward-compat)
# ---------------------------------------------------------------------------

if [ "$shards" -eq 1 ]; then
    log_file="batch.${plan_stem}.log"
    echo "Running batch with plan: $plan_basename"
    echo "Logging to: $SCRIPT_DIR/$log_file"
    ln -sfn "$log_file" batch.log
    if [ "$detach" = "true" ]; then
        BATCH_PLAN="$plan_basename" docker compose --profile batch run --rm batch \
            > "$log_file" 2>&1 &
        pid=$!
        echo "Started in background. PID: $pid"
        echo "Tail: tail -f $SCRIPT_DIR/$log_file"
        exit 0
    else
        BATCH_PLAN="$plan_basename" docker compose --profile batch run --rm batch \
            2>&1 | tee "$log_file"
        exit "${PIPESTATUS[0]}"
    fi
fi

# ---------------------------------------------------------------------------
# Multi-shard mode (parallel)
# ---------------------------------------------------------------------------

# Round-robin split. Shards land in PLANS_DIR so the container (which
# bind-mounts that dir read-only) can resolve them via $BATCH_PLAN.
echo "Splitting plan into $shards shards (round-robin)..."
python3 - "$plan_file" "$shards" "$plan_stem" "$PLANS_DIR" <<'PY' || exit $?
import json, sys
plan_file, shards, stem, plans_dir = sys.argv[1:]
shards = int(shards)
plan = json.load(open(plan_file))
runs = plan.get("runs") or []
if not runs:
    sys.exit("Plan has no runs")
for i in range(shards):
    sub = {
        "name": f"{plan.get('name','plan')} (shard {i+1}/{shards})",
        "description": (
            f"Shard {i+1}/{shards} of {stem}.json (round-robin index {i}::{shards}). "
            + plan.get("description", "")
        ),
        "runs": runs[i::shards],
    }
    out = f"{plans_dir}/{stem}.shard{i+1}.json"
    with open(out, "w") as f:
        json.dump(sub, f, indent=2)
    print(f"  wrote {out} ({len(sub['runs'])} runs)", file=sys.stderr)
PY

# Start all non-empty shards. Each shard logs to its own
# batch.<plan>.shard<i>.log. A shard with zero runs (possible when
# shards > len(runs)) is skipped — run-batch.sh would refuse it
# anyway and we'd burn a container start for nothing.
pids=()
started=0
for i in $(seq 1 "$shards"); do
    sf="${PLANS_DIR}/${plan_stem}.shard${i}.json"
    sf_basename="${plan_stem}.shard${i}.json"
    n=$(jq '.runs | length' "$sf" 2>/dev/null || echo 0)
    if [ "$n" -eq 0 ]; then
        echo "Skipping shard $i/$shards (0 runs)"
        rm -f "$sf"
        continue
    fi
    log_file="batch.${plan_stem}.shard${i}.log"
    echo "Starting shard $i/$shards ($n runs) → $log_file"
    BATCH_PLAN="$sf_basename" docker compose --profile batch run --rm batch \
        > "$log_file" 2>&1 &
    pids+=($!)
    started=$((started + 1))
done

if [ "$started" -eq 0 ]; then
    echo "No shards started (plan was empty or all shards empty)" >&2
    exit 3
fi

# batch.log convention: point at the first non-empty shard for tools
# that haven't been updated to handle multiple shard logs yet.
first_log=$(ls -1 "batch.${plan_stem}.shard"*.log 2>/dev/null | head -1)
[ -n "$first_log" ] && ln -sfn "$first_log" batch.log

if [ "$detach" = "true" ]; then
    echo "Started ${#pids[@]} shards in background. PIDs: ${pids[*]}"
    echo "Logs: $SCRIPT_DIR/batch.${plan_stem}.shard*.log"
    echo "Watch: $SCRIPT_DIR/watch-batch.sh"
    exit 0
fi

echo "Running $shards shards in parallel; waiting for completion..."
rc=0
for pid in "${pids[@]}"; do
    wait "$pid" || rc=$?
done
exit "$rc"
