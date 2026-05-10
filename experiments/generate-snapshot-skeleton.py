#!/usr/bin/env python3
"""Generate a skeleton for a research-overview snapshot.

Reads research/RQ-*/README.md (frontmatter) and findings.md, counts runs in
experiments/runs/ per RQ, and emits a Markdown skeleton with all data-driven
sections pre-filled. Synthesis sections (RQ paragraphs, cross-RQ synthesis,
limitations narrative) are left as <!-- TODO Claude: ... --> markers for the
/build-overview skill to fill in.

Output: /tmp/snapshot-skeleton-YYYY-MM-DD.md (override with --out PATH).

Usage:
  experiments/generate-snapshot-skeleton.py
  experiments/generate-snapshot-skeleton.py --out /tmp/foo.md
"""
from __future__ import annotations

import argparse
import importlib.util
import json
import re
import sys
from datetime import date
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
RESEARCH_DIR = REPO_ROOT / "research"

# Reuse parse_frontmatter, expand_cells, kata_for_cell, RUNS_DIR from
# aggregate-by-query.py (hyphenated filename → importlib spec).
_AGG = Path(__file__).resolve().parent / "aggregate-by-query.py"
_spec = importlib.util.spec_from_file_location("aggregate_by_query", _AGG)
agg = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(agg)  # type: ignore[union-attr]

# Reuse count_runs_per_cell from batch-plan-from-rq.py.
_BPL = Path(__file__).resolve().parent / "batch-plan-from-rq.py"
_spec2 = importlib.util.spec_from_file_location("batch_plan_from_rq", _BPL)
bpl = importlib.util.module_from_spec(_spec2)
_spec2.loader.exec_module(bpl)  # type: ignore[union-attr]


# -----------------------------------------------------------------------
# Findings parsing
# -----------------------------------------------------------------------

FINDING_HEADER_RE = re.compile(
    r"^##\s+(F-\d+\.\d+)\s+—\s+(.+?)\s*$"
)


def parse_findings(findings_md: Path) -> list[dict]:
    """Return list of {id, title} sorted by ID."""
    if not findings_md.is_file():
        return []
    findings = []
    for line in findings_md.read_text().splitlines():
        m = FINDING_HEADER_RE.match(line)
        if not m:
            continue
        fid = m.group(1)
        rest = m.group(2)

        # Defensive: strip trailing status suffix `· …` if any old file still has it.
        if "·" in rest:
            title_part = rest.rsplit("·", 1)[0].strip()
        else:
            title_part = rest.strip()

        findings.append({"id": fid, "title": title_part})
    findings.sort(
        key=lambda f: tuple(int(p) for p in f["id"].split("-")[1].split("."))
    )
    return findings


# -----------------------------------------------------------------------
# RQ collection
# -----------------------------------------------------------------------

def collect_rqs() -> list[dict]:
    """For each research/RQ-*/, parse frontmatter, findings, count runs."""
    rqs = []
    for rq_dir in sorted(RESEARCH_DIR.iterdir()):
        if not rq_dir.is_dir() or not rq_dir.name.startswith("RQ-"):
            continue
        readme = rq_dir / "README.md"
        if not readme.is_file():
            continue
        fm = agg.parse_frontmatter(readme)
        cells = agg.expand_cells(fm)
        counts = bpl.count_runs_per_cell(cells)
        n_total = sum(counts.values())
        n_cells = len(cells)
        min_rep = int(fm.get("min_replicates", 1))
        n_full = sum(1 for v in counts.values() if v >= min_rep)
        coverage_pct = round(100 * n_full / n_cells) if n_cells else 0

        findings = parse_findings(rq_dir / "findings.md")

        rqs.append({
            "dir": rq_dir,
            "id": fm.get("id", rq_dir.name),
            "question": fm.get("question", ""),
            "status": fm.get("status", ""),
            "min_replicates": min_rep,
            "n_cells": n_cells,
            "n_full": n_full,
            "n_runs": n_total,
            "coverage_pct": coverage_pct,
            "findings": findings,
            "fm": fm,
        })
    return rqs


def total_runs() -> int:
    n = 0
    for run_dir in agg.RUNS_DIR.iterdir():
        if (run_dir / "metrics.json").is_file():
            n += 1
    return n


# -----------------------------------------------------------------------
# Skeleton emission
# -----------------------------------------------------------------------

def emit_skeleton(rqs: list[dict], total: int, today: str) -> str:
    L: list[str] = []
    p = L.append

    p(f"# Experiment-Overview: TDD-Workflows × Modelle × Prompt-Stile")
    p("")
    p(f"Stand: {today}. Datenbasis: `experiments/runs/` ({total} Runs gesamt).")
    p("")
    p("<!-- TODO Claude: 2–3 Sätze Einleitung — Ziel der Studie und was dieser "
      "Snapshot abdeckt. Stilvorlage: research/_archive/findings-validation-"
      "2026-05-04/experiment-overview-v2.md. -->")
    p("")
    p("---")
    p("")

    # 1. Forschungsfragen-Übersicht
    p("## 1. Forschungsfragen-Übersicht")
    p("")
    p("| RQ | Frage | Status | Cells | Coverage | n Runs |")
    p("|---|---|---|---:|---:|---:|")
    for rq in rqs:
        p(f"| [{rq['id']}]({rq['dir'].relative_to(REPO_ROOT)}/) "
          f"| {rq['question']} "
          f"| {rq['status']} "
          f"| {rq['n_cells']} "
          f"| {rq['n_full']}/{rq['n_cells']} ({rq['coverage_pct']} %) "
          f"| {rq['n_runs']} |")
    p("")
    p("---")
    p("")

    # 2. Experiment-Design
    p("## 2. Experiment-Design")
    p("")
    p("### 2.1 Variablen")
    p("")
    p("**Workflow** — fünf Klassen mit zunehmender TDD-Strenge:")
    p("")
    p("| Workflow | Aufbau | TDD-Strenge |")
    p("|---|---|---|")
    p("| v1-oneshot              | \"Implementiere X.\" | keine |")
    p("| v2-iterative            | \"Plane Schritt für Schritt, dann implementiere.\" | keine |")
    p("| v3-basic-tdd            | \"Verwende TDD.\" | minimal (Self-Reporting) |")
    p("| v4-exact-subagents      | Eigener Subagent pro Phase (Predictor + Red/Green/Refactor) | strikt, multi-context |")
    p("| v5-exact-single-context | Alle Phasen in einer Konversation, gleiches Phasen-Skript | strikt, single-context |")
    p("")
    p("Konfiguration: `experiments/workflows/v{1..5}-*/.claude/agents/` und `.claude/rules/`.")
    p("")
    p("**Modell × Thinking** (Lab-Varianten-IDs):")
    p("")
    p("| Lab-Varianten-ID | API-ID | Thinking |")
    p("|---|---|---|")
    p("| `opus-4-7`               | `claude-opus-4-7`            | Adaptive |")
    p("| `opus-4-7-no-thinking`   | `claude-opus-4-7`            | aus |")
    p("| `sonnet-4-6`             | `claude-sonnet-4-6`          | Extended |")
    p("| `sonnet-4-6-no-thinking` | `claude-sonnet-4-6`          | aus |")
    p("| `haiku-4-5`              | `claude-haiku-4-5-20251001`  | Extended |")
    p("")
    p("**Kata × Prompt-Stil** (aktive Katas):")
    p("")
    p("| Kata | Prompt-Stile | Komplexität |")
    p("|---|---|---|")
    p("| game-of-life      | prose, example-mapping, user-story | groß (~40 LoC) |")
    p("| mars-rover        | prose, (example-mapping, user-story selten erhoben) | mittel (~30 LoC) |")
    p("")
    p("Prompt-Stile:")
    p("- **prose**: Beschreibung der Regeln in Prosa, keine Test-Beispiele.")
    p("- **example-mapping**: Regel + 1–3 konkrete Input/Output-Beispiele pro Regel.")
    p("- **user-story**: \"Als X möchte ich Y, damit Z\" — Beschreibung ohne Beispiele.")
    p("")
    p("### 2.2 Workflow → Prompt-Mapping")
    p("")
    p("Aus methodischer Symmetrie (siehe Top-`README.md`, Abschnitt 'Methodology constraints'):")
    p("")
    p("| Workflow | erlaubte Prompt-Stile | Begründung |")
    p("|---|---|---|")
    p("| v1, v2 | nur prose | Test-Beispiele in example-mapping wären für Non-TDD-Workflows ein verstecktes Test-Geschenk → unfair gegenüber den TDD-Workflows. |")
    p("| v3, v4, v5 | alle drei | Beispiele dienen als natürliche Test-Cases — für TDD-Workflows ist das das Idealbild der Aufgabe. |")
    p("")
    p("---")
    p("")

    # 3. Methodik
    p("## 3. Methodik")
    p("")
    p("<!-- TODO Claude: prüfen ob noch aktuell gegen experiments/docker/Dockerfile, "
      "experiments/analyze-run.sh, experiments/aggregate-by-query.py. Falls "
      "Pipeline unverändert seit dem v2-Snapshot, kann dieser Block 1:1 "
      "übernommen werden. -->")
    p("")
    p("### 3.1 Run-Pipeline")
    p("")
    p("1. Container-Image `docker-batch` (Node 22 slim, claude-code 2.1.107 gepinnt) wird gestartet.")
    p("2. Run-Dir `runs/<timestamp>_<kata>_<workflow>_<model>/` wird angelegt; Workflow-Konfig (`.claude/agents/`, `.claude/rules/`) und Kata-Prompt (`prompt.md`) hinein kopiert.")
    p("3. pnpm-Workspace mit TypeScript, Vitest, ESLint+SonarJS aufgesetzt.")
    p("4. `claude --print \"$(< prompt.md)\"` läuft headless, ohne HITL.")
    p("5. `analyze-run.sh` schreibt `metrics.json` und `analysis-report.md`.")
    p("6. `aggregate-by-query.py <RQ>/` baut `runs.csv` und `summary.md` pro RQ.")
    p("")
    p("### 3.2 Erfasste Metriken")
    p("")
    p("**Korrektheit**: `tests_passing`.")
    p("**Effizienz**: `duration_seconds`, `total_tokens`, `context_utilization_pct`.")
    p("**Code-Volumen**: `lines_of_code`, `test_lines`, `tests_total`, `code_mass`.")
    p("**Code-Qualität (ESLint+SonarJS)**: `cc_loc`, `cc_functions`, `cc_longest_function`, "
      "`cc_avg_loc_per_function`, `smell_total`, `smell_complexity`, `smell_magic_numbers`, "
      "`smell_duplication`, `smell_code_quality`, `coverage_statements_pct`, `coverage_branches_pct`.")
    p("**TDD-Disziplin**: `cycle_count`, `refactorings_applied`, `predictions_correct/total`, "
      "`tests_passed_immediately`, `avg_red_seconds`, `avg_green_seconds`, `avg_refactor_seconds`.")
    p("")
    p("### 3.3 Bewertungsgrundsätze")
    p("")
    p("- **Korrektheit zuerst**: ein Run mit `tests_passing=false` zählt nicht als gleichwertige Lösung.")
    p("- **Pro Kata aggregieren**: Workflow×Modell-Tabellen werden ausschließlich pro Kata gebildet.")
    p("- **Effekt-Schwelle**: Bei n=1 pro Zelle gelten nur Differenzen mit Faktor ≥ 2 oder klar getrennten σ-Bändern als belastbar.")
    p("")
    p("---")
    p("")

    # 4. Ergebnisse — pro RQ
    p("## 4. Ergebnisse")
    p("")
    for rq in rqs:
        rel = rq["dir"].relative_to(REPO_ROOT)
        p(f"### 4.{rq['id'].split('-')[1]} {rq['id']} — {rq['question']}")
        p("")
        p(f"_Datenbasis: {rq['n_runs']} Runs · "
          f"Coverage: {rq['n_full']}/{rq['n_cells']} Zellen "
          f"({rq['coverage_pct']} %) bei min_replicates={rq['min_replicates']}._")
        p("")

        p("**Befunde**:")
        p("")
        for f in rq["findings"]:
            p(f"- **{f['id']}** — {f['title']}")
        if not rq["findings"]:
            p("- _Keine Findings dokumentiert._")
        p("")
        p(f"<!-- TODO Claude: 60–100 Wörter Synthese der Befunde dieser RQ. "
          f"Top-Befund ausführlich + ggf. 1 Caveat aus dem Befund selbst "
          f"(z.B. enge Datenbasis, nur eine Kata) + Verweis auf "
          f"`{rel}/findings.md`. Tabellen aus findings.md NICHT duplizieren. -->")
        p("")

    p("---")
    p("")

    # 5. Cross-RQ-Synthese
    p("## 5. Cross-RQ-Synthese")
    p("")
    p("<!-- TODO Claude: 3–5 nummerierte Punkte, die aus mehreren RQs zusammen "
      "entstehen und in keiner einzelnen findings.md stehen. Beispiele aus dem "
      "v2-Snapshot: \"Workflow-Wahl ist bedeutsamer als Modell-Wahl auf großen "
      "Katas\", \"v5 ist der praktische Sweet Spot\", \"Magic Numbers dominieren "
      "das Smell-Signal\". Die Punkte sollen Cross-RQ-Verbindungen herstellen, "
      "nicht einzelne Findings paraphrasieren. -->")
    p("")
    p("---")
    p("")

    # 6. Limitierungen
    p("## 6. Limitierungen")
    p("")
    p("<!-- TODO Claude: 5–8 Stichpunkte. Pflicht-Items: nur Anthropic-Modelle, "
      "nur synthetische Katas, nur TypeScript, headless ohne HITL, n ≤ 3 pro "
      "Zelle. Optional: konkrete Coverage-Lücken aus den RQ-Coverage-Werten "
      "oben (z.B. \"RQ-X bei N % Coverage\"). -->")
    p("")
    p("---")
    p("")

    # 7. Reproduzierbarkeit
    p("## 7. Reproduzierbarkeit")
    p("")
    p("Alle Daten und Analyse-Skripte liegen im Repo:")
    p("")
    p("- `research/RQ-*/README.md` — RQ-Definitionen (Frontmatter mit factors/controls/outcomes)")
    p("- `research/RQ-*/findings.md` — persistente Befund-Listen")
    p("- `experiments/runs/*/metrics.json` — Rohdaten pro Run")
    p("- `experiments/aggregate-by-query.py` — RQ-spezifische Aggregation")
    p("- `experiments/batch-plan-from-rq.py` — Batch-Plan-Generierung aus RQ-Frontmatter")
    p("- `experiments/docker/Dockerfile` + `run-batch.sh` + `batch.sh` — Container-Pipeline")
    p("- `experiments/analyze-run.sh` + `analyze_transcript.py` — Run-Analyse")
    p("")
    p("Container-Pin: `claude-code@2.1.107` (siehe `experiments/docker/Dockerfile`).")
    p("")
    p("---")
    p("")

    # 8. Files
    p("## 8. Files")
    p("")
    p("| Pfad | Inhalt |")
    p("|---|---|")
    for rq in rqs:
        rel = rq["dir"].relative_to(REPO_ROOT)
        p(f"| `{rel}/findings.md` | {rq['id']} — {rq['question']} |")
        runs_csv = rq["dir"] / "runs.csv"
        if runs_csv.is_file():
            p(f"| `{rel}/runs.csv` | {rq['id']} aggregierte Run-Metriken |")
    p("| `experiments/runs/` | Alle Run-Verzeichnisse mit Source, Transcript, Metriken |")
    p("")

    return "\n".join(L) + "\n"


# -----------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------

def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument(
        "--out", type=Path, default=None,
        help="output path (default: /tmp/snapshot-skeleton-YYYY-MM-DD.md)",
    )
    args = parser.parse_args(argv)

    today = date.today().isoformat()
    out = args.out or Path(f"/tmp/snapshot-skeleton-{today}.md")

    rqs = collect_rqs()
    total = total_runs()

    skeleton = emit_skeleton(rqs, total, today)
    out.write_text(skeleton)

    print(f"Wrote {out}", file=sys.stderr)
    print(f"  RQs: {len(rqs)}", file=sys.stderr)
    print(f"  Runs total: {total}", file=sys.stderr)
    for rq in rqs:
        n_findings = len(rq["findings"])
        print(f"  {rq['id']}: {rq['n_runs']} runs, "
              f"{rq['n_full']}/{rq['n_cells']} cells, "
              f"{n_findings} findings",
              file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
