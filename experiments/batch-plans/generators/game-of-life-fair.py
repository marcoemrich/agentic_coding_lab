#!/usr/bin/env python3
"""Generator for game-of-life-fair.json.

Fair workflow comparison on game-of-life with methodically clean
workflow→prompt assignment:

    - v1-oneshot, v2-iterative   → game-of-life-prose
      (no test-example hints — fair "Vibe Coding" baseline)
    - v3-basic-tdd, v4-exact-subagents, v5-exact-single-context
                                 → game-of-life-example-mapping
      (rule examples serve as natural test cases — fair TDD ideal-condition)

Single model: opus-4-7-no-thinking (clearest workflow effect from
game-of-life-stability). n=3 per cell → 15 runs total.

Wallclock estimate (from stability):
    v1 ~57s × 3, v2 ~62s × 3, v3 ~49s × 3, v4 ~728s × 3, v5 ~307s × 3
    → ~60 min sequential + overhead → ~75 min.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]  # repo experiments/
OUT = ROOT / "batch-plans" / "game-of-life-fair.json"

MODEL = "opus-4-7-no-thinking"
REPLICATES = 3

CELLS = [
    ("game-of-life-prose", "v1-oneshot"),
    ("game-of-life-prose", "v2-iterative"),
    ("game-of-life-example-mapping", "v3-basic-tdd"),
    ("game-of-life-example-mapping", "v4-exact-subagents"),
    ("game-of-life-example-mapping", "v5-exact-single-context"),
]

DESCRIPTION = (
    "Fairer Workflow-Vergleich auf game-of-life. "
    "v1+v2 mit prose (kein Test-Beispiel-Hint), v3+v4+v5 mit "
    "example-mapping (Beispiele als Test-Spec — TDD-Idealbedingung). "
    "Modell opus-4-7-no-thinking (deutlichster Workflow-Effekt aus "
    "game-of-life-stability). n=3 pro Zelle. "
    "Generiert von batch-plans/generators/game-of-life-fair.py."
)


def main() -> None:
    runs = []
    for kata, workflow in CELLS:
        for _ in range(REPLICATES):
            runs.append({"kata": kata, "workflow": workflow, "model": MODEL})

    plan = {
        "name": f"Game-of-life fair ({len(runs)} runs)",
        "description": DESCRIPTION,
        "runs": runs,
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8") as f:
        json.dump(plan, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"wrote {OUT} with {len(runs)} runs")


if __name__ == "__main__":
    main()
