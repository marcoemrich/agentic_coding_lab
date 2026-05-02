#!/usr/bin/env python3
"""Generate the smart-subset batch plan.

Rationale (see experiments/COST-PLANNING.md and old_runs/experiment-overview.md):

  - Old runs (235) already showed v2-iterative is consistently the worst across
    all 7 katas, so we only sanity-check it on a tiny set.
  - v1-oneshot is a fast baseline; one slot per kata family is enough.
  - The strongest existing finding is the v4 + thinking interaction, so v4 and
    v5 get full coverage with replicates.
  - The new interesting variable is prompt style (-prose, -example-mapping,
    -user-story). Old auswertung had only one style per kata. We test all three
    styles on two katas (one novel: pixel-art-scaler, one classic: string-
    calculator) to isolate the prompt-style effect from training-data effects.
  - mars-rover and game-of-life are kept (prose only) for complexity scaling.
  - Models: opus+thinking, opus-no-thinking (for thinking-effect replication),
    sonnet+thinking, haiku+thinking (haiku is new since the old auswertung).
  - Replicates: 3 only for the headline cells (v4/v5 with opus+thinking on
    pixel-art-scaler-prose and string-calculator-prose) since those are where
    inter-run variance matters most for the hero claim.
"""
import json
from pathlib import Path

# --- Spec ---------------------------------------------------------------------

# Kata families: which prompt-style variants are included
KATA_FAMILIES = {
    "pixel-art-scaler":   ["prose", "example-mapping", "user-story"],  # novel, full
    "string-calculator":  ["prose", "example-mapping", "user-story"],  # classic, full
    "mars-rover":         ["prose"],                                   # complexity
    "game-of-life":       ["prose"],                                   # complexity
}

WORKFLOWS_FULL    = ["v4-exact-subagents", "v5-exact-single-context"]
WORKFLOWS_LIGHT   = ["v1-oneshot", "v3-basic-tdd"]
WORKFLOWS_MINIMAL = ["v2-iterative"]

MODELS = [
    "opus-4-7",              # opus with thinking
    "opus-4-7-no-thinking",  # opus without thinking (replicate the v4/thinking finding)
    "sonnet-4-6",            # sonnet with thinking
    "haiku-4-5",             # haiku with thinking (new tier)
]

# Kata slugs that get the v2-iterative sanity check (one classic, one novel)
V2_SANITY_KATAS = ["string-calculator-prose", "pixel-art-scaler-prose"]

# Replicate count: cells matching (workflow, model, kata) get this many runs
REPLICATE_RULES = [
    # (workflow, model, kata) -> count
    # Headline cells: v4 + opus+thinking on the two prose hero katas
    (("v4-exact-subagents", "opus-4-7", "pixel-art-scaler-prose"), 3),
    (("v4-exact-subagents", "opus-4-7", "string-calculator-prose"), 3),
    (("v5-exact-single-context", "opus-4-7", "pixel-art-scaler-prose"), 3),
    (("v5-exact-single-context", "opus-4-7", "string-calculator-prose"), 3),
]


# --- Generation ---------------------------------------------------------------

def kata_slug(family: str, style: str) -> str:
    return f"{family}-{style}"


def replicate_count(workflow: str, model: str, kata: str) -> int:
    for (wf, mdl, kt), count in REPLICATE_RULES:
        if wf == workflow and mdl == model and kt == kata:
            return count
    return 1


def expand_runs():
    runs = []
    katas = [kata_slug(f, s) for f, styles in KATA_FAMILIES.items() for s in styles]

    # Full workflows on every kata x model
    for kata in katas:
        for workflow in WORKFLOWS_FULL:
            for model in MODELS:
                n = replicate_count(workflow, model, kata)
                for _ in range(n):
                    runs.append({"kata": kata, "workflow": workflow, "model": model})

    # Light workflows: every kata, but only one model (sonnet+thinking) as baseline
    for kata in katas:
        for workflow in WORKFLOWS_LIGHT:
            runs.append({"kata": kata, "workflow": workflow, "model": "sonnet-4-6"})

    # Minimal workflows: v2 sanity check on two prose katas with sonnet+thinking
    for kata in V2_SANITY_KATAS:
        for workflow in WORKFLOWS_MINIMAL:
            runs.append({"kata": kata, "workflow": workflow, "model": "sonnet-4-6"})

    return runs


def main():
    runs = expand_runs()
    plan = {
        "name": "Smart subset (~150-170 runs)",
        "description": (
            "Reduzierte Matrix basierend auf Erkenntnissen aus 235 alten Runs. "
            "Fokus: Prompt-Stil-Effekt (-prose/-example-mapping/-user-story) auf 2 Katas, "
            "Replikation des v4+thinking-Befunds, Haiku 4.5 als neuer Modell-Tier. "
            "v2-iterative nur als Sanity-Check (alte Auswertung zeigt v2 \u00fcberall am schlechtesten). "
            "Generiert von batch-plans/generators/smart-subset.py."
        ),
        "runs": runs,
    }
    out = Path(__file__).parent.parent / "smart-subset.json"
    out.write_text(json.dumps(plan, indent=2) + "\n")

    # Quick stats to stdout
    print(f"Wrote {out} with {len(runs)} runs")
    by_workflow = {}
    by_model = {}
    by_kata = {}
    for r in runs:
        by_workflow[r["workflow"]] = by_workflow.get(r["workflow"], 0) + 1
        by_model[r["model"]]       = by_model.get(r["model"], 0) + 1
        by_kata[r["kata"]]         = by_kata.get(r["kata"], 0) + 1
    print("\nBy workflow:")
    for k, v in sorted(by_workflow.items()):
        print(f"  {k:35s} {v}")
    print("\nBy model:")
    for k, v in sorted(by_model.items()):
        print(f"  {k:25s} {v}")
    print("\nBy kata:")
    for k, v in sorted(by_kata.items()):
        print(f"  {k:40s} {v}")


if __name__ == "__main__":
    main()
