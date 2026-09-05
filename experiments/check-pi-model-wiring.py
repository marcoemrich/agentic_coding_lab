#!/usr/bin/env python3
"""Check that every pi model wired in run-batch.sh is declared in models.json.

The bug this exists for
-----------------------
A pi model is wired in two independent places:

  1. `experiments/docker/run-batch.sh` — MODEL_CONFIGS plus the `pi_model`
     case-map that turns a lab-variant id into a `<provider>/<model-id>` string.
  2. `experiments/docker/pi-config/agent/models.json` — the provider catalogue
     pi resolves that string against.

Only (1) is needed for a run to *happen*. When (2) is missing, pi logs

    Warning: Model "<id>" not found for provider "<provider>". Using custom
    model id.

passes the id through to the API — the run executes correctly and the
transcript records the right model — and then prices the run with **another
model's tariff**. The result is a `cost_usd` that looks measured and is
fabricated.

This is silent in every artefact the lab normally inspects: `exit_reason` is
`ok`, `metrics.json` names the right model, quality metrics are unaffected.
Only the cost column is wrong, and only by a factor nobody can spot by eye.

Found 2026-09-05: `gpt-6-astra` was wired in run-batch.sh but absent from
models.json, and 22 runs recorded $81.73 of phantom spend at Sol's tariff.

What this reports
-----------------
- **wired but undeclared** — the bug above. Exit code 1.
- **declared but never wired** — informational; a catalogue entry no lab id
  reaches. Harmless, listed under -v only.

A model declared *without* a `cost` block is correct and expected on the
flat-rate subscription route: pi then reports 0 rather than guessing. That is
the fix for an undeclared model, not a second problem.

Usage
-----
    experiments/check-pi-model-wiring.py [-v]
    experiments/check-pi-model-wiring.py --models-json <path>
"""

import argparse
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
RUN_BATCH = REPO_ROOT / "experiments" / "docker" / "run-batch.sh"
MODELS_JSON = REPO_ROOT / "experiments" / "docker" / "pi-config" / "agent" / "models.json"

# Matches a case-map arm such as
#     gpt-6-astra-codex-no-thinking) pi_model="openai-codex/gpt-6-astra" ;;
# The lab id is the label before ')', the routing target the quoted string.
CASE_ARM = re.compile(
    r'^\s*(?P<lab_id>[A-Za-z0-9._-]+)\)\s*pi_model="(?P<pi_model>[^"]+)"'
)


def parse_wiring(run_batch: Path) -> dict[str, str]:
    """lab id -> pi_model routing string, from run-batch.sh's case-map."""
    if not run_batch.is_file():
        sys.exit(f"{run_batch}: not found")
    wiring = {}
    for line in run_batch.read_text().splitlines():
        m = CASE_ARM.match(line)
        if m:
            wiring[m.group("lab_id")] = m.group("pi_model")
    if not wiring:
        sys.exit(
            f"{run_batch}: no `pi_model=\"...\"` case arms found. The case-map "
            f"format changed and this checker's regex needs updating — do not "
            f"read the empty result as 'everything is wired'."
        )
    return wiring


def parse_catalogue(models_json: Path) -> dict[str, dict[str, bool]]:
    """provider -> {model id: has a cost block}."""
    if not models_json.is_file():
        sys.exit(f"{models_json}: not found")
    try:
        data = json.loads(models_json.read_text())
    except json.JSONDecodeError as exc:
        sys.exit(f"{models_json}: invalid JSON ({exc})")

    catalogue = {}
    for provider, pdef in (data.get("providers") or {}).items():
        models = pdef.get("models") or []
        # pi accepts both shapes; normalise to {id: has_cost}.
        entries = models.values() if isinstance(models, dict) else models
        catalogue[provider] = {
            m["id"]: bool(m.get("cost"))
            for m in entries
            if isinstance(m, dict) and m.get("id")
        }
    return catalogue


def split_target(pi_model: str) -> tuple[str, str]:
    """`openai-codex/gpt-6-astra` -> ('openai-codex', 'gpt-6-astra').

    The provider is the first path segment; everything after it is the model
    id as models.json spells it, including any further slashes and the
    `@region` suffix (`requesty/azure/gpt-5.6-sol@swedencentral`).
    """
    provider, _, model_id = pi_model.partition("/")
    return provider, model_id


def load_prices() -> dict | None:
    """PRICES from compute-cost.py, or None when it cannot be imported.

    A missing table must not turn into "everything is unpriced" — that would
    be a louder lie than the silence it replaces — so the price check is
    skipped rather than failed when the import does not work.
    """
    import importlib.util
    path = REPO_ROOT / "experiments" / "compute-cost.py"
    if not path.is_file():
        return None
    try:
        spec = importlib.util.spec_from_file_location("_compute_cost", path)
        mod = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(mod)
        return getattr(mod, "PRICES", None)
    except Exception:
        return None


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("-v", "--verbose", action="store_true",
                    help="also list declared-but-unwired models and cost blocks")
    ap.add_argument("--models-json", type=Path, default=MODELS_JSON,
                    help=f"catalogue to check against (default: {MODELS_JSON})")
    ap.add_argument("--run-batch", type=Path, default=RUN_BATCH,
                    help=f"script to read the case-map from (default: {RUN_BATCH})")
    args = ap.parse_args()

    wiring = parse_wiring(args.run_batch)
    catalogue = parse_catalogue(args.models_json)

    prices = load_prices()

    undeclared: list[tuple[str, str, str]] = []   # lab id, provider, model id
    unknown_provider: list[tuple[str, str]] = []  # lab id, pi_model
    unpriced: list[str] = []                      # lab id
    wired_ids: set[tuple[str, str]] = set()

    for lab_id, pi_model in sorted(wiring.items()):
        provider, model_id = split_target(pi_model)
        if provider not in catalogue:
            unknown_provider.append((lab_id, pi_model))
            continue
        wired_ids.add((provider, model_id))
        if model_id not in catalogue[provider]:
            undeclared.append((lab_id, provider, model_id))
        if prices is not None and lab_id not in prices:
            unpriced.append(lab_id)

    print(f"pi model wiring: {len(wiring)} lab ids -> "
          f"{len(wired_ids)} routing targets across {len(catalogue)} providers")

    if unknown_provider:
        print("\nrouted to a provider that models.json does not define:")
        for lab_id, pi_model in unknown_provider:
            print(f"  {lab_id:<32} -> {pi_model}")

    if unpriced:
        print("\nWIRED BUT UNPRICED — compute-cost.py has no PRICES entry, so "
              "these report cost_usd 0:")
        for lab_id in unpriced:
            print(f"  {lab_id}")
        print("\nFix: add the lab id to PRICES in compute-cost.py. cost_usd is a "
              "list-price comparison value — what the work would have cost over "
              "the API — so a flat-rate route needs an entry too, not a 0.")

    if undeclared:
        print("\nWIRED BUT UNDECLARED — these inherit another model's tariff, "
              "and their cost_usd is fabricated:")
        for lab_id, provider, model_id in undeclared:
            print(f"  {lab_id:<32} -> {provider}/{model_id}")
        print("\nFix: add the model to models.json under its provider. Omit the "
              "`cost` block when the tariff is unknown or the route is a "
              "flat-rate subscription — pi then reports 0 instead of guessing.")

    if args.verbose:
        declared_unwired = [
            (p, m) for p, models in catalogue.items()
            for m in models if (p, m) not in wired_ids
        ]
        if declared_unwired:
            print(f"\ndeclared but never wired ({len(declared_unwired)}) — "
                  f"catalogue entries no lab id reaches:")
            for provider, model_id in sorted(declared_unwired):
                print(f"  {provider}/{model_id}")
        print("\nwired targets and their tariff status:")
        width = max((len(f"{p}/{m}") for p, m in wired_ids), default=0)
        for provider, model_id in sorted(wired_ids):
            if model_id in catalogue.get(provider, {}):
                has_cost = catalogue[provider][model_id]
                status = "cost block" if has_cost else "no cost block -> reports 0"
            else:
                status = "UNDECLARED"
            print(f"  {provider + '/' + model_id:<{width}}  {status}")

    if undeclared or unknown_provider or unpriced:
        return 1
    print("\nok — every wired pi model is declared and priced.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
