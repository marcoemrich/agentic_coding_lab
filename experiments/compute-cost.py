#!/usr/bin/env python3
"""Compute USD cost per run from token counts in transcript-metrics.json.

Reads the per-run ``transcript-metrics.json`` (input/output/cache_read/
cache_write/cache_creation tokens) and applies model-specific list prices
to produce a ``cost_usd`` value that is written into ``metrics.json`` as
``final_metrics.cost_usd``.

Prices are sourced from ``research/model-pricing.md`` (manually maintained
from Anthropic, OpenRouter, and Portkey list prices). The script does NOT
fetch live prices.

Caveat: pi/Requesty runs carry the Requesty catalogue price (upstream provider tariff,
no markup according to the vendor) — close to the amount actually billed, but without
workspace-specific discounts / smart-routing savings. Requesty returns NO cost
inline (usage=null in the response), so tokens×price remains the only way. On the
vertex Anthropic routes Requesty sits ~10 % above the native Anthropic list price. Treat
cost_usd as a "list-price baseline", not as the billed amount.

Idempotent: runs with a numeric cost_usd are recomputed unless --skip-existing
is passed (recomputation is cheap, so default is to refresh).

Given an RQ dir, the run set comes from that RQ's ``runs.csv`` -- which is
written by ``aggregate-by-query.py``. Aggregate BEFORE costing a freshly filled
RQ, otherwise the csv still lists the pre-batch runs. The script cross-checks
the csv against the frontmatter selector and exits non-zero on a stale one
rather than costing a subset and reporting success.

Usage:
  experiments/compute-cost.py research/questions-cross/1.1-harness-effect/
  experiments/compute-cost.py experiments/runs/<run-dir>/   # single run
  experiments/compute-cost.py --all                          # every run
  experiments/compute-cost.py <target> --dry-run
"""
from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path


# Prices in USD per 1M tokens. Source: research/model-pricing.md (as of 2026-05-29).
# input / output / cache_read / cache_write
PRICES = {
    # opus-5: native (claude-opus-5 via OAuth bypass in run-batch.sh), real
    # Anthropic list price 5.00/25.00/0.50/6.25 — NOT the Requesty tariff.
    "opus-5":           (5.00,  25.00, 0.50, 6.25),
    "opus-5-no-thinking": (5.00, 25.00, 0.50, 6.25),
    # opus-5-5: native (claude-opus-5-5 via OAuth bypass), Anthropic list price
    # 4.00/20.00/0.20/5.00 (platform.claude.com/docs models overview +
    # claude.com/pricing, retrieved 2026-09-23). The cache_read multiplier
    # is 0.05x instead of the usual 0.1x — on the cache-heavy EXACT Coding
    # workflows that alone decides the cost ranking, so in every opus-5 vs.
    # opus-5-5 comparison read total_tokens first.
    "opus-5-5":         (4.00,  20.00, 0.20, 5.00),
    "opus-5-5-no-thinking": (4.00, 20.00, 0.20, 5.00),
    # fable-5 / fable-5-1: native (bare claude-fable-* via OAuth bypass), real
    # Anthropic list price 10.00/50.00/*/12.50 (5m cache write). cache_read
    # separates the two: Fable 5 uses the standard 0.1x multiplier (1.00),
    # Fable 5.1 per the pricing page 0.025x (0.25). On the Max subscription
    # nothing is billed per token — the number is the list-price comparison
    # value, not the invoice amount (see CLAUDE.md).
    "fable-5":          (10.00, 50.00, 1.00, 12.50),
    "fable-5-no-thinking": (10.00, 50.00, 1.00, 12.50),
    "fable-5-1":        (10.00, 50.00, 0.25, 12.50),
    "fable-5-1-no-thinking": (10.00, 50.00, 0.25, 12.50),
    # opus-cursor: cursor-agent route, model claude-opus-4-8-medium (native, medium
    # effort). cost_usd=null in cursor stream-json → tokens×price needed. Native
    # list prices (cursor routes directly, no Requesty markup).
    "opus-cursor":      (5.00,  25.00, 0.50, 6.25),
    # opus-4-8: in the current run pool routed EXCLUSIVELY via Requesty (pi harness) →
    # Requesty vertex tariff 5.50/27.50/0.55 (~10 % above Anthropic native). If native
    # Anthropic opus-4-8 runs are ever added, they need a route-dependent distinction.
    "opus-4-8":         (5.50,  27.50, 0.55, 6.25),
    "opus-4-8-no-thinking": (5.50, 27.50, 0.55, 6.25),
    # CC/OC label of the same model on the same vertex/claude-opus-4-8@eu route
    # (RQ-harness-requesty § price baseline): identical Requesty tariff to opus-4-8.
    # Requesty no longer returns inline cost on this route → tokens×price estimate
    # for all three harnesses, measured consistently.
    "opus-4-8-requesty":         (5.50,  27.50, 0.55, 6.25),
    "opus-4-8-requesty-no-thinking": (5.50, 27.50, 0.55, 6.25),
    # opus-5-requesty: vertex/claude-opus-5@eu via pi/Requesty. Input/output/
    # cache_read identical to opus-4-8-requesty, cache_write is higher
    # (6.88 instead of 6.25) — values from the live catalogue 2026-08-05. The bare
    # opus-5 entry above is the native direct-API route at the Anthropic list price
    # and must not be mixed with this cell.
    "opus-5-requesty":         (5.50,  27.50, 0.55, 6.88),
    "opus-5-requesty-no-thinking": (5.50, 27.50, 0.55, 6.88),
    "opus-4-8-portkey": (5.00, 25.00, 0.50, 6.25),
    "opus-4-8-portkey-no-thinking": (5.00, 25.00, 0.50, 6.25),
    "opus-4-7":         (5.00,  25.00, 0.50, 6.25),
    "opus-4-7-no-thinking": (5.00, 25.00, 0.50, 6.25),
    "opus-4-7-portkey": (5.00, 25.00, 0.50, 6.25),
    "opus-4-7-portkey-no-thinking": (5.00, 25.00, 0.50, 6.25),
    "opus-4-6":         (15.00, 75.00, 1.50, 18.75),
    "opus-4-6-no-thinking": (15.00, 75.00, 1.50, 18.75),
    "opus-4-6-portkey": (15.00, 75.00, 1.50, 18.75),
    "opus-4-6-portkey-no-thinking": (15.00, 75.00, 1.50, 18.75),
    # sonnet-5-native: native (claude-sonnet-5 via OAuth bypass), real
    # Anthropic list price 2.00/10.00/0.20/2.50 (cache_read 0.1x, cache_write
    # 1.25x). The `sonnet-5` entry further down is the pi/Requesty route
    # (2.20/11.00/0.22) and must not be mixed with this cell.
    "sonnet-5-native":  (2.00,  10.00, 0.20, 2.50),
    "sonnet-5-native-no-thinking": (2.00, 10.00, 0.20, 2.50),
    "sonnet-4-6":       (3.00,  15.00, 0.30, 3.75),
    "sonnet-4-6-no-thinking": (3.00, 15.00, 0.30, 3.75),
    "sonnet-4-6-portkey": (3.00, 15.00, 0.30, 3.75),
    "sonnet-4-6-portkey-no-thinking": (3.00, 15.00, 0.30, 3.75),
    "haiku-4-5":        (1.00,  5.00,  0.10, 1.25),
    "haiku-4-5-no-thinking": (1.00, 5.00, 0.10, 1.25),
    "haiku-4-5-portkey": (1.00, 5.00, 0.10, 1.25),
    "haiku-4-5-portkey-no-thinking": (1.00, 5.00, 0.10, 1.25),
    "kimi-k2-6":        (0.73,  3.49,  0.37, 0.0),
    "minimax-m2-7":     (0.28,  1.20,  0.0,  0.0),
    "gemini-2-5-pro":   (1.25,  10.00, 0.31, 0.0),
    "gemini-3-5-flash": (0.30,  2.50,  0.075, 0.0),
    # pi/Requesty models. Prices = live Requesty catalogue
    # (curl https://router.eu.requesty.ai/v1/models, as of 2026-07-25), per route
    # from the pi_model map in experiments/docker/run-batch.sh. Requesty charges the
    # upstream provider price; on the vertex Anthropic routes that is ~10 % above the
    # Anthropic list price (opus-4-8 5.50/27.50 instead of 5.00/25.00) — so this
    # block deliberately differs from the native opus/sonnet entries above. cache_write
    # on the OpenAI/GLM/Kimi routes is not listed separately → 0.
    # Models with supports_caching=false (qwen3-235b, glm-5-1) bill cache_read at the
    # full input price → cache_read = input.
    "kimi-k2-7":        (1.25,  4.50,  0.31, 0.0),   # tensorx/kimi-k2.7-code
    "kimi-k2-7-no-thinking": (1.25, 4.50, 0.31, 0.0),
    # kimi-k3: two routes with different tariff and cache behaviour.
    # sference (primary route) is cheaper and caches; nebius has
    # supports_caching=false → cache_read = input. The route is in the name.
    # The old bare ID "kimi-k3" (= sference) was retired 2026-08-04;
    # its runs live under runs/_archive/kimi-k3-preroute-fix-2026-08-04/.
    "kimi-k3-sference": (2.25,  11.25, 0.225, 0.0),  # sference/kimi-k3
    "kimi-k3-sference-no-thinking": (2.25, 11.25, 0.225, 0.0),
    "kimi-k3-nebius":   (3.00,  15.00, 3.00, 0.0),   # nebius/kimi-k3 (no cache discount: cr=in)
    "kimi-k3-nebius-no-thinking": (3.00, 15.00, 3.00, 0.0),
    "minimax-m3":       (0.40,  2.00,  0.10, 0.0),   # tensorx/minimax-m3
    "minimax-m3-no-thinking": (0.40, 2.00, 0.10, 0.0),
    "deepseek-v4-pro":  (1.75,  3.50,  0.44, 0.0),   # tensorx/deepseek-v4-pro
    "deepseek-v4-pro-no-thinking": (1.75, 3.50, 0.44, 0.0),
    "qwen3-235b":       (0.20,  0.60,  0.20, 0.0),   # nebius/… (no cache discount: cr=in)
    "qwen3-235b-no-thinking": (0.20, 0.60, 0.20, 0.0),
    "glm-5-1":          (1.40,  4.40,  1.40, 0.0),   # nebius/zai-org/glm-5.1 (no cache discount: cr=in)
    "glm-5-1-no-thinking": (1.40, 4.40, 1.40, 0.0),
    "glm-5-2":          (1.50,  4.50,  0.38, 0.0),   # tensorx/glm-5.2
    "glm-5-2-no-thinking": (1.50, 4.50, 0.38, 0.0),
    "gpt-5-6-sol":      (5.00,  30.00, 0.50, 0.0),   # azure/gpt-5.6-sol
    "gpt-5-6-sol-no-thinking": (5.00, 30.00, 0.50, 0.0),
    # Same Requesty route as gpt-5-6-sol, only the pi-config profile
    # differs (reasoning: true) -> same tariff.
    "gpt-5-6-sol-reasoning": (5.00, 30.00, 0.50, 0.0),
    # OpenAI subscription route (openai-codex). No per-token billing — the
    # values are pure comparison prices ("what would this have cost over the
    # API"), on the same basis as the Requesty cells they are compared
    # against. Deliberately WITHOUT cacheWrite and without the >272k tariff step
    # from models.json: otherwise the subscription cell would be priced
    # differently from every Requesty cell in the same comparison.
    "gpt-5-6-sol-codex": (5.00, 30.00, 0.50, 0.0),   # openai-codex/gpt-5.6-sol
    "gpt-5-6-sol-codex-no-thinking": (5.00, 30.00, 0.50, 0.0),
    "gpt-5-6-sol-codex-noreason": (5.00, 30.00, 0.50, 0.0),
    # Tariffs verified online 2026-09-05 against three independent sources each
    # (OpenAI docs / OpenRouter / pi.dev for Astra; search / pi.dev / OpenRouter
    # for Spark). cache_write is irrelevant on this route: in all 119
    # codex runs in the pool cache_write = 0 tokens.
    # Astra's >272k tariff step (2x input/cache, 1.5x output) is deliberately NOT
    # modelled -- same reason as for Sol: otherwise the cell would be priced
    # differently from the Requesty cells it is compared against.
    "gpt-6-astra-codex": (10.00, 50.00, 1.00, 0.0),   # openai-codex/gpt-6-astra
    "gpt-6-astra-codex-no-thinking": (10.00, 50.00, 1.00, 0.0),
    # GPT-6 Sol, launch 2026-09-22: $2 / $10 / $0.20 cached (OpenAI launch,
    # TechCrunch, VentureBeat). >272k tariff step not modelled, as for
    # Sol/Astra.
    "gpt-6-sol-codex": (2.00, 10.00, 0.20, 0.0),   # openai-codex/gpt-6-sol
    # GPT-6.1 Sol: $2 / $10 like 6 Sol, but cached input drops to $0.10 (5 %
    # of input, against 10 % for 6 Sol) -- OpenAI model docs, verified
    # 2026-10-05. >272k tariff step not modelled, as for Sol/Astra.
    "gpt-6-1-sol-codex": (2.00, 10.00, 0.10, 0.0),   # openai-codex/gpt-6.1-sol
    "gpt-5-3-codex-spark": (1.75, 14.00, 0.175, 0.0),  # openai-codex/gpt-5.3-codex-spark
    "gpt-5-6-terra":    (2.50,  15.00, 0.25, 0.0),   # azure/gpt-5.6-terra
    "gpt-5-6-terra-no-thinking": (2.50, 15.00, 0.25, 0.0),
    "sonnet-5":         (2.20,  11.00, 0.22, 0.0),   # vertex/claude-sonnet-5@eu (Requesty tariff)
    "sonnet-5-no-thinking": (2.20, 11.00, 0.22, 0.0),
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
    # If the transcript captured a real routed cost (Requesty /v1/messages
    # path, CC/OC), it already sits in final_metrics.cost_usd via
    # analyze-run.sh — don't overwrite it with a list-price estimate.
    #
    # pi is the exception, and the reason is not that its number is missing but
    # that it is not a *routed* charge: pi computes cost itself from whatever
    # `cost` block models.json happens to declare. On the Requesty route no
    # block is declared, so it emits 0 — which is where the earlier premise
    # ("pi runs carry cost_usd = 0") came from. On the OpenAI subscription
    # route a block IS declared, so pi emits a positive number computed from
    # its own catalogue, and for an *undeclared* model it emits one computed
    # from a different model's tariff. That is how gpt-6-astra came to record
    # $81.73 of phantom spend at Sol's prices (see check-pi-model-wiring.py):
    # the value was positive, so this function skipped it as "actual cost".
    #
    # For pi the PRICES table below is therefore the single source, on both
    # routes, so every pi cell is computed on the same basis. cost_usd is a
    # list-price comparison value — what the work would have cost over the
    # API — not a record of what was billed; on a flat-rate subscription
    # nothing per-token is billed at all.
    tm_cost = tm.get("cost_usd")
    is_pi = metrics.get("cli_model") == "pi-only"
    if not is_pi and isinstance(tm_cost, (int, float)) and tm_cost > 0:
        return ("skip-actual-cost", tm_cost)
    cost = compute_cost(tokens, model)
    if cost is None:
        return ("price-lookup-failed", None)
    if dry_run:
        return ("would-write", cost)
    fm = metrics.setdefault("final_metrics", {})
    fm["cost_usd"] = cost
    metrics_file.write_text(json.dumps(metrics, indent=2) + "\n")
    return ("written", cost)


def _selector_run_ids(rq_dir: Path) -> set[str] | None:
    """Run ids the RQ frontmatter selector matches right now.

    Returns None when the answer cannot be determined (aggregate-by-query.py
    not importable, unparseable frontmatter). Callers then skip the staleness
    check rather than fail -- this is a guard against a silent partial run, and
    it must never become a new way for the script to break.
    """
    try:
        sys.path.insert(0, str(Path(__file__).resolve().parent))
        import importlib

        agg = importlib.import_module("aggregate-by-query".replace("-", "_"))
    except Exception:
        try:
            import importlib.util

            spec = importlib.util.spec_from_file_location(
                "_agg", Path(__file__).resolve().parent / "aggregate-by-query.py"
            )
            if spec is None or spec.loader is None:
                return None
            agg = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(agg)
        except Exception:
            return None
    try:
        fm = agg.parse_frontmatter(rq_dir / "README.md")
        cells = agg.expand_cells(fm)
        _, by_cell = agg.collect_runs(cells)
        # by_cell maps cell-key -> [path/to/<run-id>/metrics.json]. Use it
        # rather than the first return value, whose tuple arity has changed
        # before (it is a 3-tuple today, its docstring still says 2).
        return {p.parent.name for paths in by_cell.values() for p in paths}
    except Exception:
        return None


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
            # Look the id column up by NAME. It is not the first column
            # (that is `kata`), and its index has moved as columns were
            # added -- a positional read silently yields kata names, which
            # match no run dir, so the script reports "processing 0 runs"
            # and exits 0. A whole RQ then looks up-to-date while nothing
            # was ever computed.
            ids = set()
            with runs_csv.open(newline="") as fh:
                for row in csv.DictReader(fh):
                    rid = (row.get("run_id") or "").strip()
                    if rid:
                        ids.add(rid)
            if not ids:
                raise SystemExit(
                    f"{runs_csv} has no usable 'run_id' column -- refusing to "
                    f"silently process nothing. Re-run aggregate-by-query.py?"
                )
            # runs.csv may be STALE. It is written by aggregate-by-query.py, so
            # on a freshly-filled RQ it still lists the pre-batch run set --
            # this script then costs a subset, reports success, and the cells
            # missing from the csv end up with no cost_usd at all. That reads
            # as "metric not applicable", not as an error. Cross-check the csv
            # against the frontmatter selector and refuse rather than compute a
            # partial answer. (The empty-csv guard above does not catch this:
            # a stale csv is non-empty, just short.)
            expected = _selector_run_ids(target)
            if expected is not None and (missing := expected - ids):
                raise SystemExit(
                    f"{runs_csv} is stale: the RQ selector matches "
                    f"{len(expected)} runs, the csv lists {len(ids)}. "
                    f"{len(missing)} run(s) would be skipped, e.g. "
                    f"{sorted(missing)[0]}. Run aggregate-by-query.py first, "
                    f"then re-run this script."
                )
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
    counts = {"written": 0, "would-write": 0, "skipped": 0, "actual-cost": 0}
    for run in runs:
        status, cost = process_run(run, dry_run=args.dry_run)
        if status in ("written", "would-write"):
            counts[status] += 1
            if cost is not None and cost > 0.001:
                print(f"  {run.name} | ${cost:.4f}")
        elif status == "skip-actual-cost":
            counts["actual-cost"] += 1
        else:
            counts["skipped"] += 1
    print(f"summary: {counts}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
