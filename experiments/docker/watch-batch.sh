#!/bin/bash
# Status snapshot of running (or finished) batches.
# Usage:
#   ./watch-batch.sh              # auto-detect: shows ALL running docker-batch-run containers,
#                                 # falls back to last plan from batch.log if none running
#   ./watch-batch.sh PLAN_NAME    # explicit plan name (e.g. smart-subset, game-of-life-stability)
#                                 # For sharded batches, use the parent plan name (e.g. rq-9-fill)
#                                 # and the script aggregates across all shards automatically.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

LOG_FILE="batch.log"
RUNS_DIR="../runs"
PLANS_DIR="../batch-plans"

# Per-plan log file convention: batch.<plan-stem>.log. Falls back to
# legacy batch.log so reports for older runs still work.
log_file_for_plan() {
    local plan="$1"
    plan="${plan%.json}"
    if [ -f "batch.${plan}.log" ]; then
        echo "batch.${plan}.log"
    else
        echo "$LOG_FILE"
    fi
}

# Detect shard log files for a plan stem.
# Sets globals: SHARD_LOGS (log file paths), SHARD_STEMS (shard plan stems),
# SHARD_COUNT (number of shards). Call directly, not in a subshell.
detect_shards() {
    local stem="$1"
    SHARD_LOGS=()
    SHARD_STEMS=()
    SHARD_COUNT=0
    local i=1
    while [ -f "batch.${stem}.shard${i}.log" ]; do
        SHARD_LOGS+=("batch.${stem}.shard${i}.log")
        SHARD_STEMS+=("${stem}.shard${i}")
        i=$((i + 1))
    done
    # If a non-shard log exists and is newer than the shard logs, a
    # subsequent non-sharded run reused the same plan name. Ignore stale
    # shard logs so the current run is shown instead.
    if [ "${#SHARD_LOGS[@]}" -gt 0 ] && [ -f "batch.${stem}.log" ]; then
        local nonshard_ts shard1_ts
        nonshard_ts=$(stat -c %Y "batch.${stem}.log" 2>/dev/null || echo 0)
        shard1_ts=$(stat -c %Y "${SHARD_LOGS[0]}" 2>/dev/null || echo 0)
        if [ "$nonshard_ts" -gt "$shard1_ts" ]; then
            SHARD_LOGS=()
            SHARD_STEMS=()
        fi
    fi
    SHARD_COUNT=${#SHARD_LOGS[@]}
}

# Strip .shardN suffix from a plan stem to get the parent plan name.
parent_plan_stem() {
    echo "$1" | sed 's/\.shard[0-9]*$//'
}

# Render an aggregated snapshot across all shards.
# Expects SHARD_LOGS and SHARD_STEMS arrays to be populated via detect_shards().
render_sharded_snapshot() {
    local plan_name="$1"

    # Total runs from parent plan (authoritative) or sum of shard plans.
    local total=0
    local per_shard_totals=()
    local parent_plan_file="$PLANS_DIR/${plan_name}.json"
    if [ -f "$parent_plan_file" ]; then
        total=$(jq '.runs | length' "$parent_plan_file")
    fi
    for stem in "${SHARD_STEMS[@]}"; do
        local sf="$PLANS_DIR/${stem}.json"
        local st=0
        if [ -f "$sf" ]; then
            st=$(jq '.runs | length' "$sf")
        fi
        per_shard_totals+=("$st")
        if [ "$total" -eq 0 ]; then
            total=$((total + st))
        fi
    done

    # Read and aggregate log content from each shard.
    local all_ok=0 all_timeout=0 all_ratelimit=0 all_transient=0 all_fail=0
    local total_seconds=0 total_ok_count=0
    local current_sum=0
    local shard_progress=()
    local shard_last_lines=()
    local shard_container_info=()

    for idx in "${!SHARD_LOGS[@]}"; do
        local logf="${SHARD_LOGS[$idx]}"
        local snum=$((idx + 1))
        local log_text=""
        [ -f "$logf" ] && log_text=$(cat "$logf" 2>/dev/null || true)

        # Counter from this shard's log.
        local current
        current=$(echo "$log_text" | grep -oE '\[[0-9]+/[0-9]+\]' | tail -1 | tr -d '[]' || true)
        current="${current:-0/${per_shard_totals[$idx]}}"
        local cur_idx
        cur_idx=$(echo "$current" | cut -d/ -f1)
        current_sum=$((current_sum + cur_idx))
        shard_progress+=("shard${snum}: ${current}")

        # Extract the log section after the last "Total runs:" banner.
        local log_section
        log_section=$(echo "$log_text" | awk '/Total runs:/ {buf=""} {buf = buf $0 "\n"} END {printf "%s", buf}')
        log_section=$(echo "$log_section" | sed 's/\x1b\[[0-9;]*m//g' | tr -d '\r')

        local ok timeout rl tr fl
        ok=$(echo "$log_section" | grep -cE 'OK \([0-9]+s\)' || true)
        timeout=$(echo "$log_section" | grep -cE 'timeout \([0-9]+s\)' || true)
        rl=$(echo "$log_section" | grep -cE 'rate-limited after [0-9]+ retries' || true)
        tr=$(echo "$log_section" | grep -cE 'transient-api-error after [0-9]+ retries' || true)
        fl=$(echo "$log_section" | grep -E 'Failed:' | grep -vE 'Failed: timeout|Failed:[[:space:]]+[0-9]+$' | wc -l)
        : "${ok:=0}" "${timeout:=0}" "${rl:=0}" "${tr:=0}" "${fl:=0}"

        all_ok=$((all_ok + ok))
        all_timeout=$((all_timeout + timeout))
        all_ratelimit=$((all_ratelimit + rl))
        all_transient=$((all_transient + tr))
        all_fail=$((all_fail + fl))

        # Duration sum for average.
        local sec
        sec=$(echo "$log_section" \
            | grep -oE 'OK \([0-9]+s\)' \
            | grep -oE '[0-9]+' \
            | awk '{s+=$1} END {print s+0}')
        total_seconds=$((total_seconds + sec))
        total_ok_count=$((total_ok_count + ok))

        # Container status for this shard.
        local shard_stem="${SHARD_STEMS[$idx]}"
        local cname=""
        local cstatus_line=""
        while read -r cn; do
            [ -z "$cn" ] && continue
            local cp
            cp=$(plan_from_container "$cn" 2>/dev/null || true)
            if [ "$cp" = "$shard_stem" ]; then
                cname="$cn"
                break
            fi
        done < <(docker ps --filter "name=docker-batch-run" --format '{{.Names}}' 2>/dev/null || true)
        if [ -n "$cname" ]; then
            local cs
            cs=$(docker ps --filter "name=$cname" --format '{{.Status}}' 2>/dev/null | head -1 || true)
            cstatus_line="RUNNING ($cs) — $cname"
        else
            cstatus_line="STOPPED"
        fi
        shard_container_info+=("    shard${snum}: $cstatus_line")

        # Last 5 log lines (stripped of ANSI).
        local tail_lines
        tail_lines=$(echo "$log_text" | tail -n 5 | sed 's/\x1b\[[0-9;]*m//g')
        shard_last_lines+=("$tail_lines")
    done

    # Compute averages and ETA.
    local avg_seconds=0 avg_minutes="—"
    if [ "$total_ok_count" -gt 0 ]; then
        avg_seconds=$((total_seconds / total_ok_count))
        avg_minutes=$(awk -v s="$avg_seconds" 'BEGIN {printf "%.1f", s/60}')
    fi
    local eta_str="—"
    if [ "$avg_seconds" -gt 0 ]; then
        local remaining=$((total - current_sum))
        [ "$remaining" -lt 0 ] && remaining=0
        local eta_seconds=$((remaining * avg_seconds))
        local eta_min=$((eta_seconds / 60))
        local eta_clock
        eta_clock=$(date -d "+${eta_seconds} seconds" '+%H:%M' 2>/dev/null || echo "?")
        eta_str="~${eta_min} min (≈${eta_clock})"
    fi

    # Run dirs created since batch start (use oldest shard log mtime as reference).
    local ref_ts=0
    for logf in "${SHARD_LOGS[@]}"; do
        local lts
        lts=$(stat -c %Y "$logf" 2>/dev/null || echo 0)
        if [ "$ref_ts" -eq 0 ] || [ "$lts" -lt "$ref_ts" ]; then
            ref_ts=$lts
        fi
    done
    local fresh_runs
    fresh_runs=$(find "$RUNS_DIR" -maxdepth 1 -mindepth 1 -type d -newermt "@$ref_ts" 2>/dev/null | wc -l)

    # Count running containers.
    local running_containers=0
    for info in "${shard_container_info[@]}"; do
        if echo "$info" | grep -q "RUNNING"; then
            running_containers=$((running_containers + 1))
        fi
    done
    local containers_summary
    if [ "$running_containers" -gt 0 ]; then
        containers_summary="$running_containers RUNNING"
    else
        containers_summary="all STOPPED"
    fi

    # Per-shard total breakdown.
    local totals_breakdown
    totals_breakdown=$(IFS='+'; echo "${per_shard_totals[*]}" | sed 's/+/ + /g')

    # Shard progress breakdown.
    local progress_breakdown
    progress_breakdown=$(IFS=','; echo "${shard_progress[*]}" | sed 's/,/, /g')

    echo "═══════════════════════════════════════════════════"
    echo "  Batch status: $plan_name ($SHARD_COUNT shards)"
    echo "═══════════════════════════════════════════════════"
    echo "  Plan total runs:   $total ($totals_breakdown)"
    echo "  Progress (log):    $current_sum/$total ($progress_breakdown)"
    echo "  Run dirs created:  $fresh_runs (since start)"
    echo "  Containers:        $containers_summary"
    for info in "${shard_container_info[@]}"; do
        echo "$info"
    done
    echo
    echo "  Aggregate (all shards):"
    echo "    OK:           $all_ok   avg ${avg_minutes} min/run"
    echo "    Timeout:      $all_timeout"
    echo "    Rate-limit:   $all_ratelimit"
    echo "    Transient API: $all_transient"
    echo "    Other fail:   $all_fail"
    echo "    ETA:          $eta_str"
    echo
    echo "─── last 5 log lines per shard ─────────────────────"
    for idx in "${!SHARD_LOGS[@]}"; do
        local snum=$((idx + 1))
        echo "  [shard${snum}]"
        echo "${shard_last_lines[$idx]}" | sed 's/^/    /'
    done
    echo "────────────────────────────────────────────────────"
    echo
}

# Render one snapshot for a (plan_name, container_name_or_empty, log_source) triple.
# log_source can be a file path or "docker:<container_name>" for live container logs.
render_snapshot() {
    local plan_name="$1"
    local container="$2"      # may be empty
    local log_source="$3"
    local started_at="$4"     # epoch seconds, may be empty

    local plan_file="$PLANS_DIR/${plan_name}.json"
    if [ ! -f "$plan_file" ]; then
        echo "  Plan file not found: $plan_file" >&2
        return 1
    fi

    local total
    total=$(jq '.runs | length' "$plan_file")

    # Read log content depending on source.
    local log_text=""
    if [[ "$log_source" == docker:* ]]; then
        local cname="${log_source#docker:}"
        log_text=$(docker logs "$cname" 2>&1 || true)
    elif [ -f "$log_source" ]; then
        log_text=$(cat "$log_source" 2>/dev/null || true)
    fi

    # Counter from log: last "[N/total]" marker
    local current
    current=$(echo "$log_text" | grep -oE '\[[0-9]+/[0-9]+\]' | tail -1 | tr -d '[]' || true)
    current="${current:-0/$total}"

    # Container state line
    local container_state
    if [ -n "$container" ]; then
        local cstatus
        cstatus=$(docker ps --filter "name=$container" --format '{{.Status}}' 2>/dev/null | head -1 || true)
        if [ -n "$cstatus" ]; then
            container_state="RUNNING ($cstatus) — $container"
        else
            container_state="STOPPED — $container"
        fi
    else
        container_state="STOPPED (no container)"
    fi

    # Run dirs created since started_at (or log mtime as fallback)
    local ref_ts="${started_at:-0}"
    if [ "$ref_ts" = "0" ] && [ -f "$log_source" ]; then
        ref_ts=$(stat -c %Y "$log_source" 2>/dev/null || echo 0)
    fi
    local fresh_runs
    fresh_runs=$(find "$RUNS_DIR" -maxdepth 1 -mindepth 1 -type d -newermt "@$ref_ts" 2>/dev/null | wc -l)

    # Aggregate metrics from this batch's log section.
    # We only count entries that follow the most recent "Total runs: N"
    # banner so a single batch.log shared across runs is sliced correctly.
    local log_section
    log_section=$(echo "$log_text" | awk '/Total runs:/ {buf=""} {buf = buf $0 "\n"} END {printf "%s", buf}')
    log_section=$(echo "$log_section" | sed 's/\x1b\[[0-9;]*m//g')
    # Strip any \r so awk on duration sums sees clean numbers.
    log_section=$(echo "$log_section" | tr -d '\r')

    local ok_count timeout_count ratelimit_count transient_count fail_count avg_seconds avg_minutes
    # `grep -c` exits 1 with 0 matches; the `|| echo 0` then APPENDS a stray
    # "0" to grep's already-printed "0", giving two-line output. Use `|| true`
    # and rely on grep's "0" being the only number on stdout.
    ok_count=$(echo "$log_section" | grep -cE 'OK \([0-9]+s\)' || true)
    timeout_count=$(echo "$log_section" | grep -cE 'timeout \([0-9]+s\)' || true)
    # run-batch.sh emits "rate-limited after N retries" (lowercase) for
    # the rate-limit/529 class and "transient-api-error after N retries"
    # for "API Error: terminated" and friends. Both classes are tallied
    # together in run-batch.sh's "Rate-limited" summary counter, but here
    # we split them so the user sees what kind of upstream trouble hit.
    ratelimit_count=$(echo "$log_section" | grep -cE 'rate-limited after [0-9]+ retries' || true)
    transient_count=$(echo "$log_section" | grep -cE 'transient-api-error after [0-9]+ retries' || true)
    # Per-run "Failed: error-..." but NOT "Failed: timeout" (already counted) and NOT the summary "Failed:  N" line.
    fail_count=$(echo "$log_section" | grep -E 'Failed:' | grep -vE 'Failed: timeout|Failed:[[:space:]]+[0-9]+$' | wc -l)
    : "${ok_count:=0}" "${timeout_count:=0}" "${ratelimit_count:=0}" "${transient_count:=0}" "${fail_count:=0}"

    # Avg over OK runs only (timeouts are budget hits, not informative for ETA).
    avg_seconds=$(echo "$log_section" \
        | grep -oE 'OK \([0-9]+s\)' \
        | grep -oE '[0-9]+' \
        | awk '{s+=$1; n++} END {if(n>0) printf "%d", s/n; else print "0"}')
    if [ "$avg_seconds" -gt 0 ]; then
        avg_minutes=$(awk -v s="$avg_seconds" 'BEGIN {printf "%.1f", s/60}')
    else
        avg_minutes="—"
    fi

    # ETA = remaining_runs × avg_seconds, only if we have a counter and a sample.
    local eta_str="—"
    local cur_idx
    cur_idx=$(echo "$current" | cut -d/ -f1)
    if [[ "$cur_idx" =~ ^[0-9]+$ ]] && [ "$avg_seconds" -gt 0 ]; then
        # Runs not yet done = total - (cur_idx - 1). The current run isn't OK yet.
        local remaining=$(( total - cur_idx + 1 ))
        if [ "$remaining" -lt 0 ]; then remaining=0; fi
        local eta_seconds=$(( remaining * avg_seconds ))
        local eta_min=$(( eta_seconds / 60 ))
        local eta_clock
        eta_clock=$(date -d "+${eta_seconds} seconds" '+%H:%M' 2>/dev/null || echo "?")
        eta_str="~${eta_min} min (≈${eta_clock})"
    fi

    echo "═══════════════════════════════════════════════════"
    echo "  Batch status: $plan_name"
    echo "═══════════════════════════════════════════════════"
    echo "  Plan total runs:   $total"
    echo "  Counter (log):     $current"
    echo "  Run dirs created:  $fresh_runs (since start)"
    echo "  Container:         $container_state"
    echo "  Log source:        $log_source"
    echo
    echo "  Aggregate (this batch):"
    echo "    OK:           $ok_count   avg ${avg_minutes} min/run"
    echo "    Timeout:      $timeout_count"
    echo "    Rate-limit:   $ratelimit_count"
    echo "    Transient API: $transient_count"
    echo "    Other fail:   $fail_count"
    echo "    ETA:          $eta_str"
    echo
    echo "─── last 10 log lines ──────────────────────────────"
    echo "$log_text" | tail -n 10 | sed 's/\x1b\[[0-9;]*m//g'
    echo "────────────────────────────────────────────────────"
    echo
}

# Extract BATCH_PLAN env from a container, strip .json, return plan name.
plan_from_container() {
    local cname="$1"
    docker inspect "$cname" --format '{{range .Config.Env}}{{println .}}{{end}}' 2>/dev/null \
        | grep '^BATCH_PLAN=' | head -1 | cut -d= -f2- | sed 's/\.json$//'
}

container_started_at_epoch() {
    local cname="$1"
    local iso
    iso=$(docker inspect "$cname" --format '{{.State.StartedAt}}' 2>/dev/null || true)
    [ -z "$iso" ] && { echo 0; return; }
    date -d "$iso" +%s 2>/dev/null || echo 0
}

# Last "Plan: <path>" line from batch.log, returns plan name or empty.
plan_from_logfile() {
    [ -f "$LOG_FILE" ] || return
    sed 's/\x1b\[[0-9;]*m//g' "$LOG_FILE" 2>/dev/null \
        | grep -oE 'Plan:[[:space:]]+\S+' \
        | tail -1 | awk '{print $2}' | xargs -I{} basename {} .json 2>/dev/null
}

# ---------------------------------------------------------------------------
# Mode dispatch
# ---------------------------------------------------------------------------

if [ $# -ge 1 ]; then
    plan="$1"
    plan="${plan%.json}"

    # Check if this plan has shard logs.
    detect_shards "$plan"
    if [ "$SHARD_COUNT" -gt 0 ]; then
        render_sharded_snapshot "$plan"
        echo "Live tail (file):    tail -f $SCRIPT_DIR/batch.${plan}.shard{1..${SHARD_COUNT}}.log"
        exit 0
    fi

    # Non-sharded: try to find a matching running container, else fall back to batch.log.
    found=""
    while read -r cname; do
        [ -z "$cname" ] && continue
        cplan=$(plan_from_container "$cname")
        if [ "$cplan" = "$plan" ]; then
            found="$cname"
            break
        fi
    done < <(docker ps --filter "name=docker-batch-run" --format '{{.Names}}')

    plan_log=$(log_file_for_plan "$plan")
    if [ -n "$found" ]; then
        started=$(container_started_at_epoch "$found")
        render_snapshot "$plan" "$found" "docker:$found" "$started"
    else
        render_snapshot "$plan" "" "$plan_log" ""
    fi
    echo "Live tail (running): docker logs -f <container>"
    echo "Live tail (file):    tail -f $SCRIPT_DIR/$plan_log"
    exit 0
fi

# No argument: enumerate running batch containers, grouping shards.
mapfile -t containers < <(docker ps --filter "name=docker-batch-run" --format '{{.Names}}')

if [ "${#containers[@]}" -gt 0 ]; then
    # Collect parent plan stems so sharded plans are rendered once.
    declare -A seen_parents
    for cname in "${containers[@]}"; do
        plan=$(plan_from_container "$cname")
        plan="${plan:-<unknown>}"
        plan="${plan%.json}"
        parent=$(parent_plan_stem "$plan")

        if [ -n "${seen_parents[$parent]+x}" ]; then
            continue
        fi
        seen_parents[$parent]=1

        # Check if this parent has shard logs.
        detect_shards "$parent"
        if [ "$SHARD_COUNT" -gt 0 ]; then
            render_sharded_snapshot "$parent" || true
        else
            started=$(container_started_at_epoch "$cname")
            render_snapshot "$plan" "$cname" "docker:$cname" "$started" || true
        fi
    done
    echo "Live tail: docker logs -f <container>"
    exit 0
fi

# No running container — show last finished batch from batch.log.
# (batch.log is a symlink to the most recent batch.<plan>.log)
last_plan=$(plan_from_logfile)
if [ -n "$last_plan" ]; then
    # The plan from batch.log may be a shard name; resolve parent.
    parent=$(parent_plan_stem "$last_plan")
    detect_shards "$parent"
    if [ "$SHARD_COUNT" -gt 0 ]; then
        echo "(no running batch — showing last entry from shard logs)"
        echo
        render_sharded_snapshot "$parent"
        echo "Live tail (file): tail -f $SCRIPT_DIR/batch.${parent}.shard*.log"
    else
        last_log=$(log_file_for_plan "$last_plan")
        echo "(no running batch — showing last entry from $last_log)"
        echo
        render_snapshot "$last_plan" "" "$last_log" ""
        echo "Live tail (file): tail -f $SCRIPT_DIR/$last_log"
    fi
else
    echo "No running batch and no plan found in $LOG_FILE." >&2
    echo "Pass a plan name explicitly: $0 PLAN_NAME" >&2
    exit 1
fi
