#!/usr/bin/env python3
"""Compute USD cost per run from token counts in transcript-metrics.json.

Reads the per-run ``transcript-metrics.json`` (input/output/cache_read/
cache_write/cache_creation tokens) and applies model-specific list prices
to produce a ``cost_usd`` value that is written into ``metrics.json`` as
``final_metrics.cost_usd``.

Prices are sourced from ``research/model-pricing.md`` (manually maintained
from Anthropic, OpenRouter, and Portkey list prices). The script does NOT
fetch live prices.

Caveat: Portkey-routed runs may diverge from the direct-API list price
depending on the workspace tariff. We use the direct-API price as best
estimate; treat cost_usd as a "list-price baseline", not actual billed
amount.

Idempotent: runs with a numeric cost_usd are recomputed unless --skip-existing
is passed (recomputation is cheap, so default is to refresh).

Usage:
  experiments/compute-cost.py research/questions-cross/1.1-harness-effect/
  experiments/compute-cost.py experiments/runs/<run-dir>/   # single run
  experiments/compute-cost.py --all                          # every run
  experiments/compute-cost.py <target> --dry-run
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


# Prices in USD per 1M tokens. Source: research/model-pricing.md (Stand 2026-05-25).
# input / output / cache_read / cache_write
PRICES = {
    "opus-4-7":         (5.00,  25.00, 0.50, 6.25),
    "opus-4-7-no-thinking": (5.00, 25.00, 0.50, 6.25),
    "opus-4-7-portkey": (5.00, 25.00, 0.50, 6.25),
    "opus-4-7-portkey-no-thinking": (5.00, 25.00, 0.50, 6.25),
    "opus-4-6":         (15.00, 75.00, 1.50, 18.75),
    "opus-4-6-no-thinking": (15.00, 75.00, 1.50, 18.75),
    "opus-4-6-portkey": (15.00, 75.00, 1.50, 18.75),
    "opus-4-6-portkey-no-thinking": (15.00, 75.00, 1.50, 18.75),
    "sonnet-4-6":       (3.00,  15.00, 0.30, 3.75),
    "sonnet-4-6-no-thinking": (3.00, 15.00, 0.30, 3.75),
    "sonnet-4-6-portkey": (3.00, 15.00, 0.30, 3.75),
    "sonnet-4-6-portkey-no-thinking": (3.00, 15.00, 0.30, 3.75),
    "haiku-4-5":        (1.00,  5.00,  0.10, 1.25),
    "haiku-4-5-no-thinking": (1.00, 5.00, 0.10, 1.25),
    "haiku-4-5-portkey": (1.00, 5.00, 0.10, 1.25),
    "haiku-4-5-portkey-no-thinking": (1.00, 5.00, 0.10, 1.25),
    "kimi-k2-6":        (0.73,  3.49,  0.37, 0.0),
    "glm-5-1":          (0.98,  3.08,  0.18, 0.0),
    "minimax-m2-7":     (0.28,  1.20,  0.0,  0.0),
    "gemini-2-5-pro":   (1.25,  10.00, 0.31, 0.0),
    "gemini-3-5-flash": (0.30,  2.50,  0.075, 0.0),
}


def compute_cost(tokens: dict, model: str) -> float | None:
    if model not in PRICES:
        return None
    p_in, p_out, p_cr, p_cw = PRICES[model]
    inp = int(tokens.get("input") or 0)
    out = int(tokens.get("output") or 0)
    cr = int(tokens.get("cache_read") or 0)
    # CC writes 'cache_creation', OC/pi write 'cache_write'. Accept either.
    cw = int(tokens.get("cache_write") or tokens.get("cache_creation") or 0)
    cost = (inp * p_in + out * p_out + cr * p_cr + cw * p_cw) / 1_000_000
    return round(cost, 4)


def process_run(run_dir: Path, dry_run: bool) -> tuple[str, float | None]:
    metrics_file = run_dir / "metrics.json"
    transcript_metrics = run_dir / "transcript-metrics.json"
    if not metrics_file.exists():
        return ("no-metrics", None)
    try:
        metrics = json.loads(metrics_file.read_text())
    except json.JSONDecodeError:
        return ("bad-metrics-json", None)
    model = metrics.get("model")
    if not model:
        return ("no-model", None)
    if model not in PRICES:
        return (f"no-price-for-{model}", None)
    if not transcript_metrics.exists():
        return ("no-transcript-metrics", None)
    try:
        tm = json.loads(transcript_metrics.read_text())
    except json.JSONDecodeError:
        return ("bad-transcript-metrics", None)
    tokens = tm.get("total_tokens") or {}
    cost = compute_cost(tokens, model)
    if cost is None:
        return ("price-lookup-failed", None)
    if dry_run:
        return ("would-write", cost)
    fm = metrics.setdefault("final_metrics", {})
    fm["cost_usd"] = cost
    metrics_file.write_text(json.dumps(metrics, indent=2) + "\n")
    return ("written", cost)


def iter_target_runs(target: Path) -> list[Path]:
    if target.is_dir() and (target / "metrics.json").exists():
        # Single run dir.
        return [target]
    if target.name == "runs" and target.is_dir():
        return sorted(p for p in target.iterdir() if (p / "metrics.json").exists())
    if (target / "README.md").exists() and "research" in str(target):
        # RQ dir — read frontmatter selector, then walk experiments/runs/.
        # We just match every run; aggregate-by-query.py will filter again.
        repo_root = Path(__file__).resolve().parent.parent
        runs_root = repo_root / "experiments" / "runs"
        # Cheap: pass all runs; filter happens at aggregate time anyway.
        # For RQ-scoped runs only, the caller can grep runs.csv after the fact.
        # Here we honor: if the user gave us an RQ dir, only update runs that
        # already appear in that RQ's runs.csv (if present), else update all.
        runs_csv = target / "runs.csv"
        if runs_csv.exists():
            ids = set()
            for line in runs_csv.read_text().splitlines()[1:]:
                rid = line.split(",", 1)[0].strip().strip('"')
                if rid:
                    ids.add(rid)
            return [runs_root / rid for rid in sorted(ids) if (runs_root / rid).is_dir()]
        return sorted(p for p in runs_root.iterdir() if (p / "metrics.json").exists())
    raise SystemExit(f"unrecognized target: {target}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("target", nargs="?", help="RQ dir, run dir, or experiments/runs/")
    ap.add_argument("--all", action="store_true", help="process every run in experiments/runs/")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parent.parent
    if args.all:
        target = repo_root / "experiments" / "runs"
    elif args.target:
        target = Path(args.target).resolve()
    else:
        ap.error("specify target or --all")

    runs = iter_target_runs(target)
    print(f"processing {len(runs)} runs", file=sys.stderr)
    counts = {"written": 0, "would-write": 0, "skipped": 0}
    for run in runs:
        status, cost = process_run(run, dry_run=args.dry_run)
        if status in ("written", "would-write"):
            counts[status] += 1
            if cost is not None and cost > 0.001:
                print(f"  {run.name} | ${cost:.4f}")
        else:
            counts["skipped"] += 1
    print(f"summary: {counts}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
