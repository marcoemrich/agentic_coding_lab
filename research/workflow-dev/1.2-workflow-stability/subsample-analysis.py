#!/usr/bin/env python3
"""Subsample analysis for RQ-5.

For each workflow cell at n=10, compute:
- σ, CV, IQR, outlier rate per code-quality metric
- Reproducibility: out of all C(10,3)=120 random subsamples of size 3,
  how often does the subsample mean land within ±20% of the n=10 mean?
- Ranking-stability: out of all C(10,3)=120 subsamples per cell, draw
  one subsample per cell and check whether the workflow ranking based
  on subsample means matches the n=10 ranking. Repeat 1000 random
  draws to estimate ranking-flip probability.

Reads research/workflow-dev/1.2-workflow-stability/runs.csv.
Writes a markdown table to stdout that gets pasted into findings.md.
"""
from __future__ import annotations

import csv
import itertools
import random
import statistics
from collections import defaultdict
from pathlib import Path

CSV_PATH = Path(__file__).resolve().parent / "runs.csv"
METRICS = ["code_mass", "smell_total", "cc_longest_function",
           "mccabe_max", "cognitive_max"]


def load_cells() -> dict[str, dict[str, list[float]]]:
    """Return cells[workflow][metric] -> list[float]."""
    cells: dict[str, dict[str, list[float]]] = defaultdict(lambda: defaultdict(list))
    with open(CSV_PATH) as f:
        for row in csv.DictReader(f):
            wf = row["workflow"]
            for m in METRICS:
                val = row.get(m, "").strip()
                if val and val != "None":
                    try:
                        cells[wf][m].append(float(val))
                    except ValueError:
                        pass
    return {k: dict(v) for k, v in cells.items()}


def iqr(xs: list[float]) -> float:
    s = sorted(xs)
    q1 = statistics.quantiles(s, n=4)[0] if len(s) >= 4 else min(s)
    q3 = statistics.quantiles(s, n=4)[2] if len(s) >= 4 else max(s)
    return q3 - q1


def outlier_rate(xs: list[float]) -> float:
    if len(xs) < 2:
        return 0.0
    mu = statistics.mean(xs)
    sd = statistics.pstdev(xs)
    if sd == 0:
        return 0.0
    return sum(1 for x in xs if abs(x - mu) > 2 * sd) / len(xs)


def stability_per_metric(cells: dict) -> None:
    """Print per-cell stability table per metric."""
    for metric in METRICS:
        print(f"\n### Stabilitäts-Kennzahlen für `{metric}` (n=10 pro Zelle)\n")
        print("| Workflow | n | mean | σ | CV (σ/μ) | IQR | outlier_rate | reprod_score |")
        print("|---|---:|---:|---:|---:|---:|---:|---:|")
        for wf, by_metric in sorted(cells.items()):
            xs = by_metric.get(metric, [])
            if not xs:
                continue
            n = len(xs)
            mu = statistics.mean(xs)
            sd = statistics.pstdev(xs)
            cv = sd / mu if mu else float("nan")
            outlier = outlier_rate(xs)
            reprod = reproducibility_score(xs, mu, tolerance=0.20, sub_n=3)
            print(f"| {wf} | {n} | {mu:.2f} | {sd:.2f} | {cv:.3f} | {iqr(xs):.2f} "
                  f"| {outlier:.2f} | {reprod:.2f} |")


def reproducibility_score(xs: list[float], full_mean: float,
                          tolerance: float = 0.20, sub_n: int = 3) -> float:
    """Fraction of all C(n, sub_n) subsamples whose mean is within ±tolerance × full_mean."""
    if len(xs) < sub_n:
        return float("nan")
    if full_mean == 0:
        return float("nan")
    band = tolerance * abs(full_mean)
    hits = 0
    total = 0
    for combo in itertools.combinations(xs, sub_n):
        m = sum(combo) / sub_n
        if abs(m - full_mean) <= band:
            hits += 1
        total += 1
    return hits / total


def ranking_stability(cells: dict, metric: str, sub_n: int = 3,
                      trials: int = 1000, rng_seed: int = 42) -> tuple[float, list[str]]:
    """Probability that a random subsample-of-3 per cell preserves the n=10 ranking.

    Returns (probability, true_ranking) where true_ranking is the workflow
    ordering by ascending mean at n=10.
    """
    rng = random.Random(rng_seed)
    valid = {wf: by[metric] for wf, by in cells.items()
             if metric in by and len(by[metric]) >= sub_n}
    full_means = {wf: statistics.mean(xs) for wf, xs in valid.items()}
    true_ranking = sorted(full_means, key=lambda w: full_means[w])
    hits = 0
    for _ in range(trials):
        sample_means = {wf: statistics.mean(rng.sample(xs, sub_n))
                        for wf, xs in valid.items()}
        sub_ranking = sorted(sample_means, key=lambda w: sample_means[w])
        if sub_ranking == true_ranking:
            hits += 1
    return hits / trials, true_ranking


def main() -> None:
    cells = load_cells()
    print("# RQ-5 Subsampling-Analyse — generiert\n")
    print("Datenquelle: `runs.csv` (n=10 pro Zelle, v5 ggf. ergänzt).\n")
    stability_per_metric(cells)

    print("\n### Ranking-Stabilität bei n=3-Subsamples (1000 Trials)\n")
    print("| Metrik | P(n=3-Ranking = n=10-Ranking) | n=10-Ranking |")
    print("|---|---:|---|")
    for metric in METRICS:
        p, ranking = ranking_stability(cells, metric)
        rank_str = " < ".join(ranking)
        print(f"| {metric} | {p:.3f} | {rank_str} |")


if __name__ == "__main__":
    main()
