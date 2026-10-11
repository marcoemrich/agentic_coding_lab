"""Build the approved results-site prototype into one self-contained HTML file.

Reads the run pool and RQ frontmatter (read-only), computes the two sample RQ
pages and the index, and inlines the data into template.html.

    python3 site/prototype/extract.py site/prototype/results-site-prototype.html
"""
import contextlib, importlib.util, io, json, math, statistics, sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[1]
spec = importlib.util.spec_from_file_location("agg", REPO / "experiments/aggregate-by-query.py")
agg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(agg)

DETAIL = {"RQ-tdd-workflow-comparison-opus55", "RQ-external-tdd-workflows-opus5"}
GH = "https://github.com/marcoemrich/agentic_coding_lab/tree/main/"

# Prototype registry: (display name, direction, group, unit, flags)
H, L, I = "higher", "lower", "informative"
REG = {
    "verification_pct": ("Correctness (external)", H, "Correctness", "%", []),
    "tests_passing": ("Correctness (internal)", H, "Correctness", "bool", []),
    "completed_within_budget": ("Within budget", H, "Correctness", "bool", []),
    "tdd_discipline": ("TDD discipline", H, "TDD discipline", "score", ["testlist"]),
    "tdd_discipline_test_first": ("Discipline: test first", H, "TDD discipline", "score", ["testlist"]),
    "tdd_discipline_step": ("Discipline: step", H, "TDD discipline", "score", []),
    "tdd_discipline_closure": ("Discipline: closure", H, "TDD discipline", "score", ["testlist"]),
    "test_first_rate": ("Test-first rate", H, "TDD discipline", "ratio", ["testlist"]),
    "red_batch_size": ("Red batch size", L, "TDD discipline", "tests", []),
    "red_batch_max": ("Red batch max", L, "TDD discipline", "tests", []),
    "red_batch_unmeasurable": ("Red batch unmeasurable", L, "TDD discipline", "count", []),
    "green_batch_size": ("Green batch size", L, "TDD discipline", "tests", []),
    "chain_suite_runs": ("Suite runs", I, "TDD discipline", "count", []),
    "cycles_total": ("Cycles total", I, "TDD discipline", "count", ["testlist"]),
    "cycles_closed": ("Cycles closed", I, "TDD discipline", "count", []),
    "refactor_events": ("Refactor events", I, "TDD discipline", "count", []),
    "skip_events": ("Skip events", I, "TDD discipline", "count", ["testlist"]),
    "refactor_per_cycle": ("Refactor per cycle", I, "TDD discipline", "ratio", []),
    "green_attempts": ("Green attempts", I, "TDD discipline", "count", []),
    "chain_deviations": ("Chain deviations", L, "TDD discipline", "count", ["testlist"]),
    "chain_opens_red": ("Chain opens red", H, "TDD discipline", "bool", []),
    "chain_ends_green": ("Chain ends green", H, "TDD discipline", "bool", []),
    "refactorings_applied": ("Refactorings applied (legacy)", I, "TDD discipline", "count", []),
    "tests_passed_immediately": ("Tests passed immediately", L, "TDD discipline", "count", []),
    "predictions_correct_rate": ("Predictions correct (legacy)", H, "TDD discipline", "%", []),
    "cycle_count": ("Cycle count (legacy)", I, "TDD discipline", "count", []),
    "test_blocks": ("Test blocks", I, "TDD discipline", "count", []),
    "test_cases_total": ("Test cases", I, "TDD discipline", "count", []),
    "test_cases_first_block": ("Test cases in first block", L, "TDD discipline", "count", []),
    "red_verified": ("Red verified", H, "TDD discipline", "count", []),
    "red_unverified": ("Red unverified", L, "TDD discipline", "count", []),
    "suite_cycles": ("Suite cycles", I, "TDD discipline", "count", []),
    "suite_new_failures": ("Suite new failures", I, "TDD discipline", "count", []),
    "suite_opens_red": ("Suite opens red", H, "TDD discipline", "bool", []),
    "suite_unresolved_red": ("Suite unresolved red", L, "TDD discipline", "count", []),
    "suite_runs": ("Suite runs (legacy)", I, "TDD discipline", "count", []),
    "suite_unknown_runs": ("Suite unknown runs", L, "TDD discipline", "count", []),
    "avg_loc_per_function": ("Avg LoC per function", L, "Code quality", "LoC", []),
    "longest_function": ("longest_function", L, "Code quality", "LoC", []),
    "cognitive_max": ("cognitive_max", L, "Code quality", "", []),
    "mccabe_max": ("mccabe_max", L, "Code quality", "", []),
    "smell_total": ("Smell Total", L, "Code quality", "count", []),
    "code_mass": ("Code Mass (APP)", L, "Code quality", "", []),
    "duration_seconds": ("Duration", L, "Cost", "s", []),
    "total_tokens": ("Tokens", L, "Cost", "tokens", []),
    "cost_usd": ("Cost", L, "Cost", "USD", []),
}
GATED_GROUPS = {"Code quality", "Cost"}  # trophy only for cells with verification_pct >= 0.90


def num(v):
    if v is None or isinstance(v, bool):
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    return None if math.isnan(f) else f


def lineage():
    y = yaml.safe_load((REPO / "experiments/workflows/LINEAGE.yaml").read_text())
    out = {}
    for cat, c in y["categories"].items():
        for name, w in (c.get("workflows") or {}).items():
            out[name] = {**w, "category": cat}
    return out


def load_pool():
    pool = []
    for d in sorted(agg.RUNS_DIR.iterdir()):
        f = d / "metrics.json"
        if d.name.startswith("_") or not f.is_file():
            continue
        try:
            pool.append((d.name, json.loads(f.read_text())))
        except json.JSONDecodeError:
            pass
    return pool


def match(cells, pool):
    by = {}
    for rid, m in pool:
        for c in cells:
            if agg.matches_cell(m, c):
                by.setdefault(agg.cell_key(c), []).append((rid, m))
                break
    return by


def span(runs):
    ds = sorted(m.get("started_at", "")[:10] for _, m in runs if m.get("started_at"))
    return [ds[0], ds[-1]] if ds else None


def metric_value(m, rid, col):
    row = agg.metrics_to_row(m, rid)
    return row.get(col)


def aggregate(outcome, col, runs):
    unit = REG.get(outcome, ("", I, "", "", []))[3]
    n = len(runs)
    if outcome.endswith("_correct_rate"):
        stem = outcome[: -len("_correct_rate")]
        k = t = 0
        used = 0
        for rid, m in runs:
            r = agg.metrics_to_row(m, rid)
            c, d = num(r.get(f"{stem}_correct")), num(r.get(f"{stem}_total"))
            if c is None and f"legacy_{stem}_correct" in r:
                c, d = num(r.get(f"legacy_{stem}_correct")), num(r.get(f"legacy_{stem}_total"))
            if d:
                k += c or 0; t += d; used += 1
        if used == 0:
            return {"state": "not_collected", "n": n}
        return {"kind": "rate", "k": int(k), "t": int(t), "value": k / t, "n_used": used, "n": n,
                "state": "partial" if used < n else "ok"}
    vals = []
    for rid, m in runs:
        v = agg.metrics_to_row(m, rid).get(col)
        if unit == "bool":
            if isinstance(v, bool):
                vals.append(1.0 if v else 0.0)
            elif v in ("True", "False"):
                vals.append(1.0 if v == "True" else 0.0)
        else:
            f = num(v)
            if f is not None:
                vals.append(f)
    if not vals:
        return {"state": "not_collected", "n": n}
    res = {"n_used": len(vals), "n": n, "state": "partial" if len(vals) < n else "ok"}
    if unit == "bool":
        res.update(kind="bool", k=int(sum(vals)), value=sum(vals) / len(vals))
    else:
        res.update(kind="num", value=statistics.fmean(vals),
                   sd=statistics.stdev(vals) if len(vals) > 1 else None)
    return res


def trophies(rows, outcomes, spans_boundary):
    corr = {r["key"]: (r["values"].get("verification_pct") or {}).get("value") for r in rows}
    for o in outcomes:
        name, direction, group, unit, flags = REG[o]
        if direction == I:
            continue
        if "testlist" in flags and spans_boundary:
            for r in rows:
                (r["values"].get(o) or {})["suppressed"] = True
            continue
        cand = []
        for r in rows:
            v = r["values"].get(o) or {}
            if v.get("value") is None:
                continue
            if group in GATED_GROUPS and corr.get(r["key"]) is not None and corr[r["key"]] < 0.90:
                v["gated"] = True
                continue
            cand.append((r, v))
        vals = [round(v["value"], 2) for _, v in cand]
        if len(set(vals)) < 2:
            continue
        best = max(vals) if direction == H else min(vals)
        for (r, v), rv in zip(cand, vals):
            if rv == best:
                v["trophy"] = True


def detail(fm, cells, by, lin):
    outcomes = fm.get("outcomes", [])
    resolved = agg.resolve_outcomes(outcomes, fm["id"])
    katas = sorted({agg.kata_for_cell(c) for c in cells})
    varying = [k for k in ("workflow", "model", "prompt", "harness_version")
               if len({str(c.get(k)) for c in cells}) > 1]
    tl = {}
    for c in cells:
        tl[c["workflow"]] = agg.uses_test_list(c["workflow"])
    spans_boundary = len({v for v in tl.values() if v is not None}) > 1
    tables = []
    for k in katas:
        rows = []
        for c in [c for c in cells if agg.kata_for_cell(c) == k]:
            runs = by.get(agg.cell_key(c), [])
            row = {"key": "|".join(map(str, agg.cell_key(c))),
                   "labels": {v: c.get(v) for v in varying},
                   "n": len(runs), "span": span(runs),
                   "run_ids": [rid for rid, _ in runs],
                   "test_list": tl.get(c["workflow"]),
                   "values": {}}
            if runs:
                for o, col in zip(outcomes, resolved):
                    row["values"][o] = aggregate(o, col, runs)
            rows.append(row)
        trophies([r for r in rows if r["n"]], outcomes, spans_boundary)
        tables.append({"kata": k, "rows": rows})
    controls = {k: v for k, v in (fm.get("controls") or {}).items()}
    wfs = sorted({c["workflow"] for c in cells})
    return {"outcomes": outcomes, "varying": varying, "controls": controls,
            "spans_test_list_boundary": spans_boundary, "tables": tables,
            "workflows": {w: {"description": (lin.get(w) or {}).get("description"),
                              "arm": (lin.get(w) or {}).get("arm"),
                              "status": (lin.get(w) or {}).get("status"),
                              "test_list": tl.get(w)} for w in wfs}}


def main():
    pool = load_pool()
    lin = lineage()
    out = {"generated": __import__("datetime").datetime.now().isoformat(timespec="minutes"),
           "pool_size": len(pool), "registry": {k: dict(zip(("name", "direction", "group", "unit", "flags"), v)) for k, v in REG.items()},
           "rqs": []}
    for rd in sorted(REPO.glob("research/questions-*/*/README.md")):
        fm = agg.parse_frontmatter(rd)
        if not fm.get("id"):
            continue
        with contextlib.redirect_stderr(io.StringIO()):
            cells = agg.expand_cells(fm)
            by = match(cells, pool)
        mr = fm.get("min_replicates", 1)
        allruns = [r for v in by.values() for r in v]
        e = {"id": fm["id"], "question": fm.get("question"), "subtree": rd.parent.parent.name,
             "chapter": rd.parent.name.split("-")[0], "dir": str(rd.parent.relative_to(REPO)),
             "closed": fm.get("closed"), "cells": len(cells),
             "cells_full": sum(1 for c in cells if len(by.get(agg.cell_key(c), [])) >= mr),
             "runs": len(allruns), "span": span(allruns), "min_replicates": mr,
             "katas": sorted({agg.kata_for_cell(c) for c in cells})}
        if fm["id"] in DETAIL:
            with contextlib.redirect_stderr(io.StringIO()):
                e["detail"] = detail(fm, cells, by, lin)
            fp = rd.parent / "findings.md"
            e["findings_md"] = fp.read_text() if fp.is_file() else None
        out["rqs"].append(e)
    data = json.dumps(out, default=str).replace("</", "<\\/")
    html = (HERE / "template.html").read_text().replace("__DATA__", data)
    Path(sys.argv[1]).write_text(html)
    print(len(out["rqs"]), "rqs ->", sys.argv[1])


main()
