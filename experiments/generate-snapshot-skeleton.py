#!/usr/bin/env python3
"""Generate a skeleton for a research-overview snapshot.

Reads research/{questions,workflow-dev}/*/README.md (frontmatter) and findings.md, counts runs in
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

# Finding ids are F-<namespace>.<minor>. The namespace mirrors the RQ id
# (slug since the id→slug migration, e.g. F-regression.6); the legacy numeric
# form (F-19.6, F-3b.1) still matches so this stays backward-compatible.
FINDING_HEADER_RE = re.compile(
    r"^##\s+(F-[A-Za-z0-9][A-Za-z0-9-]*\.\d+)\s+—\s+(.+?)\s*$"
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

    # Within one findings.md the namespace is constant (one RQ), so the minor
    # number orders the findings. The major segment is now a slug, not an int.
    def _minor(fid: str) -> int:
        tail = fid.rsplit(".", 1)[-1]
        return int(tail) if tail.isdigit() else 0

    findings.sort(key=lambda f: _minor(f["id"]))
    return findings


# -----------------------------------------------------------------------
# RQ collection
# -----------------------------------------------------------------------

# Subtrees that hold RQ directories, in display order. The chapter number in
# each dir name (e.g. "2.6-lean-validation") is an ordering label, NOT an id —
# the stable identity is the frontmatter `id:`. Renumbering is a pure rename.
RQ_TREES = [
    ("questions", "Forschungsfragen"),
    ("workflow-dev", "Workflow-Entwicklung"),
]


def chapter_key(name: str) -> tuple[int, ...]:
    """Sort key from the chapter prefix: '2.10-foo' -> (2, 10).

    Numeric per segment so '1.2' sorts before '1.10' (lexicographic would not).
    Non-numeric prefixes sort last.
    """
    head = name.split("-", 1)[0]
    try:
        return tuple(int(p) for p in head.split("."))
    except ValueError:
        return (9_999,)


def collect_rqs() -> list[dict]:
    """Walk research/questions/ and research/workflow-dev/, parse frontmatter,
    findings, count runs. Dirs are returned tree by tree, chapter-sorted."""
    rqs = []
    for tree_name, tree_label in RQ_TREES:
        tree_dir = RESEARCH_DIR / tree_name
        if not tree_dir.is_dir():
            continue
        sub = sorted(
            (d for d in tree_dir.iterdir()
             if d.is_dir() and not d.name.startswith("_")),
            key=lambda d: chapter_key(d.name),
        )
        for rq_dir in sub:
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
                "tree": tree_name,
                "tree_label": tree_label,
                "chapter": rq_dir.name.split("-", 1)[0],
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
    p("<!-- TODO Claude: drei kurze Absätze. Pflicht-Inhalte je Absatz: "
      "(P1) das Lab ist die empirische Validierungs-Plattform für **EXACT Coding** "
      "(EXample-guided AI-Collaborative Test-driven Coding), Manuskript "
      "`../../../exact-coding-book/manuscript/exact-coding.md` (relativ zur Repo-Wurzel); "
      "Workflow-Varianten als Spektrum Vibe-Coding (v1/v2) → EXACT (v4/v6) → Delayed-Refactor (v8). "
      "(P2) **Scope.** bold-Marker. Bewusst enger agentic-tool-Scope: ausschließlich **Claude-Code-CLI** "
      "als Harness (Version aus experiments/docker/Dockerfile pinnen), headless ohne HITL, ausschließlich "
      "**Anthropic-Modelle** (Opus, Sonnet, Haiku — mit/ohne Thinking, Direct-API und Portkey). "
      "Befunde gelten **für** diesen Stack; Transfer auf andere Tools (Cursor, Aider, Cline, Windsurf), "
      "andere Provider (OpenAI, Google, lokale Modelle) oder HITL-Setups ist offen. "
      "(P3) Snapshot-Status: Zeitstand, Run-Anzahl, RQ-Anzahl, aktuelle Forschungs-Front "
      "(z.B. v6.1 als Default-Kandidat, Workflow×Modell-Interaktion), Hinweis auf ausgesparte "
      "workflow-dev-RQs falls Datenerhebung noch läuft. "
      "Stilvorlage: research/_archive/findings-validation-2026-05-04/experiment-overview-v2.md. -->")
    p("")
    p("---")
    p("")

    # 1. Forschungsfragen-Übersicht
    p("## 1. Forschungsfragen-Übersicht")
    p("")
    for tree_name, tree_label in RQ_TREES:
        tree_rqs = [r for r in rqs if r["tree"] == tree_name]
        if not tree_rqs:
            continue
        p(f"### {tree_label}")
        p("")
        p("| Kap. | RQ | Frage | Status | Cells | Coverage | n Runs |")
        p("|---|---|---|---|---:|---:|---:|")
        for rq in tree_rqs:
            p(f"| {rq['chapter']} "
              f"| [{rq['id']}]({rq['dir'].relative_to(REPO_ROOT)}/) "
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
    p("**Workflow** — sechs Generationen (Details: `research/workflow-dev/workflow-overview.md`):")
    p("")
    p("| Workflow | Aufbau | TDD-Strenge |")
    p("|---|---|---|")
    p("| v1-oneshot                              | \"Implementiere X.\" | keine |")
    p("| v2-iterative                            | \"Plane Schritt für Schritt, dann implementiere.\" | keine |")
    p("| v3-basic-tdd                            | Inline TDD, kein Skill/Subagent (Self-Reporting) | minimal |")
    p("| v4-exact-subagents                      | Eigener Subagent pro Phase (Predictor + Red/Green/Refactor), fresh context | strikt, multi-context |")
    p("| v4.1-testlist-scope-fix                 | v4 mit Test-List-Scope-Patch | strikt, multi-context |")
    p("| v5-exact-single-context                 | Alle Phasen in einer Konversation, gleiches Phasen-Skript | strikt, single-context |")
    p("| v5.1-testlist-scope-fix                 | v5 mit Test-List-Scope-Patch (an v4.1 angeglichen) | strikt, single-context |")
    p("| v6-hybrid                               | Hybrid: inline TDD + nur Refactor als Subagent | strikt, hybrid |")
    p("| v6.1-hybrid-testlist-scope-fix          | v6-hybrid mit Test-List-Scope-Patch (aktuelle Default-Basis) | strikt, hybrid |")
    p("| v6.1-no-pep                             | v6.1 ohne Pep-Talks (RQ-pep-Replikation) | strikt, hybrid |")
    p("| v7-hybrid-green-refactor                | Wie v6, aber green *und* refactor als Subagent | strikt, mehr Isolation |")
    p("| v7.1-hybrid-green-refactor-testlist-scope-fix | v7 mit Test-List-Scope-Patch | strikt, mehr Isolation |")
    p("| v8a-delayed-refactor-agent              | Oneshot → nachträgliche Tests → einmaliger End-Refactor-Agent (`refactor.md` aus v6.5.4) | delayed-refactor |")
    p("| v8b-delayed-refactor-native             | Wie v8a, aber nativer Inline-Refactor im v3-Stil, kein Agent | delayed-refactor |")
    p("")
    p("Konfiguration: `experiments/workflows/<variant>/.claude/agents/` und `.claude/rules/`. "
      "Archivierte Varianten (v5.1-minimized, v6.2–v6.6, v6.5.x-Audits) liegen unter `experiments/workflows/_archive/`.")
    p("")
    p("**Workflow-Mechanik im Detail.** Die sechs Generationen sind nicht nur eine Skala "
      "\"mehr/weniger TDD\", sondern eine systematische Variation der EXACT-Coding-Bausteine "
      "(Test-Liste, Red, Green, Refactor) und ihrer Kontext-Architektur:")
    p("")
    p("- **v1-oneshot / v2-iterative — Vibe-Coding-Baselines (kein TDD).** Ein einzelner Agent liest "
      "die Anforderungen und schreibt Code in einem Schritt (v1) oder mit explizitem Plan/Checkliste (v2); "
      "Tests werden erst nachträglich auf Basis des Example Mappings hinzugefügt. Dient als Messlatte "
      "für den Wert von TDD selbst (siehe `experiments/workflows/v1-oneshot/.claude/rules/experiment-mode.md`).")
    p("- **v3-basic-tdd — Minimal-TDD ohne Struktur.** Ein einziger Agent mit minimaler Anweisung "
      "\"use TDD\" — keine Phasen-Prompts, keine Subagents. Claude entscheidet selbst, wie es den "
      "TDD-Prozess strukturiert. Misst, wie weit eine reine Aufforderung trägt "
      "(`v3-basic-tdd/.claude/rules/experiment-mode.md`).")
    p("- **v4-exact-subagents / v4.1-testlist-scope-fix — Strict TDD, multi-context.** Jede TDD-Phase "
      "läuft als spezialisierter Subagent in **isoliertem Kontext** (`Task(subagent_type: \"red\")` etc.): "
      "`test-list` → `red` → `green` → `refactor`. Hypothese: isolierte Kontexte erzwingen Disziplin, "
      "können aber Zustand zwischen Phasen verlieren. v4.1 ergänzt im `test-list`-Subagent die Pflicht "
      "\"Cover every spec example\" — schließt den dominanten Failure-Mode auf novel Katas "
      "(unvollständige Test-Liste) auf Opus 4.7.")
    p("- **v5-exact-single-context / v5.1-testlist-scope-fix — Strict TDD, single-context.** Identisches "
      "Phasen-Skript wie v4, aber alle Phasen laufen im **gleichen Kontext** als Skill-Calls "
      "(`Skill(skill: \"red\")` etc.) statt als Subagents. Hypothese: shared context erhält den Zustand, "
      "kann aber zu Disziplin-Verlust führen. v5.1 spiegelt v4.1 mit dem identischen Test-List-Scope-Patch.")
    p("- **v6-hybrid / v6.1-hybrid-testlist-scope-fix — Hybrid mit isoliertem Refactor.** Red und Green "
      "laufen inline als Skills im Shared-Context (wie v5), Refactor läuft als isolierter Subagent (wie v4). "
      "Hypothese: kombiniert die Spec-Kohärenz des Single-Context mit der Disziplin-Schärfung der "
      "Subagent-Isolation am kritischsten Punkt (Refactor). v6.1 ist die aktuelle Default-Basis und "
      "Champion über mehrere RQs. `v6.1-no-pep` testet die Reduktion psychologischer Begründungen in Red/Green.")
    p("- **v7-hybrid-green-refactor / v7.1-…-testlist-scope-fix — Hybrid mit isoliertem Green + Refactor.** "
      "Zusätzlich zur Refactor-Isolation aus v6 läuft auch Green als isolierter Subagent. Test-Liste und Red "
      "bleiben im Shared-Context. Prüft, ob mehr Isolation gleich besser ist (Pareto-dominiert von v6 auf "
      "game-of-life: spart Tokens, verliert Qualität und Korrektheit).")
    p("- **v8a-delayed-refactor-agent / v8b-delayed-refactor-native — Delayed-Refactor-Kontrolle.** "
      "Drei sequentielle Phasen ohne TDD-Cycles: (1) Oneshot-Implementation, (2) nachträgliche Tests gegen "
      "`prompt.md` mit Coverage-Pflicht, (3) ein einmaliger End-Refactor. v8a nutzt den `refactor.md`-Subagent "
      "aus v6.5.4 (APP + Naming + Mandatory-Attempt), v8b einen nativen Inline-Refactor im v3-Stil ohne Agent. "
      "Dient als Kontroll-Achse für die Hypothese \"periodisches TDD-Refactor schlägt End-Refactor nach "
      "Vibe-Coding\".")
    p("")
    p("Tiefere Mechanik-Diskussion und die Reduktions-Genealogie (v6.5.x-Linie, v6.5.4 als "
      "Code-Qualitäts-Champion) stehen in `research/workflow-dev/workflow-overview.md` und "
      "`workflow-construction.md`. Welche Marker das Parsing der TDD-Metriken treibt, dokumentiert "
      "`experiments/workflows/MARKERS.md`.")
    p("")
    p("**Modell × Thinking** (Lab-Varianten-IDs aus `MODEL_CONFIGS` in `experiments/docker/run-batch.sh`):")
    p("")
    p("| Lab-Varianten-ID | API-ID | Thinking | Routing |")
    p("|---|---|---|---|")
    p("| `opus-4-7`                       | `claude-opus-4-7`                              | Adaptive | Direct |")
    p("| `opus-4-7-no-thinking`           | `claude-opus-4-7`                              | aus      | Direct |")
    p("| `sonnet-4-6`                     | `claude-sonnet-4-6`                            | Extended | Direct |")
    p("| `sonnet-4-6-no-thinking`         | `claude-sonnet-4-6`                            | aus      | Direct |")
    p("| `haiku-4-5`                      | `claude-haiku-4-5-20251001`                    | Extended | Direct |")
    p("| `haiku-4-5-no-thinking`          | `claude-haiku-4-5-20251001`                    | aus      | Direct |")
    p("| `opus-4-7-portkey`               | `@vertex-eu-global/anthropic.claude-opus-4-7`  | Adaptive | Portkey |")
    p("| `opus-4-7-portkey-no-thinking`   | `@vertex-eu-global/anthropic.claude-opus-4-7`  | aus      | Portkey |")
    p("| `opus-4-6-portkey`               | `@vertex-ai/anthropic.claude-opus-4-6`         | Adaptive | Portkey |")
    p("| `opus-4-6-portkey-no-thinking`   | `@vertex-ai/anthropic.claude-opus-4-6`         | aus      | Portkey |")
    p("| `sonnet-4-6-portkey`             | `@vertex-ai/anthropic.claude-sonnet-4-6`       | Extended | Portkey |")
    p("| `sonnet-4-6-portkey-no-thinking` | `@vertex-ai/anthropic.claude-sonnet-4-6`       | aus      | Portkey |")
    p("| `haiku-4-5-portkey`              | `@vertex-ai/anthropic.claude-haiku-4-5@20251001` | Extended | Portkey |")
    p("| `haiku-4-5-portkey-no-thinking`  | `@vertex-ai/anthropic.claude-haiku-4-5@20251001` | aus      | Portkey |")
    p("")
    p("Direct- und Portkey-Routings desselben Modells sind getrennte Varianten und werden nur per "
      "expliziter `controls.model: {any: [...]}`-Klausel pro RQ als gemeinsame Zelle gewertet.")
    p("")
    p("**Kata × Prompt-Stil** (aktive Katas in `experiments/katas/`):")
    p("")
    p("| Kata-Basis | Prompt-Stile | Verifikations-Suite | Hinweis |")
    p("|---|---|---|---|")
    p("| game-of-life      | prose, example-mapping, user-story | nein  | Code-Qualität, groß (~40 LoC), vitest-basiert |")
    p("| game-of-life-cli  | prose, example-mapping, user-story | ja    | CLI-Variante mit externer Akzeptanz-Suite |")
    p("| mars-rover        | prose, example-mapping, user-story | nein  | mittel (~30 LoC), vitest-basiert |")
    p("| claim-office      | prose, example-mapping, user-story | ja    | Korrektheit, novel Versicherungs-Domäne (HPSMV/MHPCO), 15 Szenarien |")
    p("| claim-office-lite | prose, example-mapping, user-story | ja    | Reduzierte claim-office-Variante (10 Szenarien) für Code-Qualitäts-Research |")
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
    p("| v3, v4(.1), v5(.1), v6(.1), v7(.1), v8a/b | alle drei | Beispiele dienen als natürliche Test-Cases — für TDD-/Refactor-Workflows ist das das Idealbild der Aufgabe. |")
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
    p("**Code-Mass & Umfang**: `code_mass` (APP), `cc_loc` (Produktiv-LoC), `test_lines` (Test-LoC), `tests_total`.")
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

    # 4. Ergebnisse — pro RQ, gruppiert nach Baum + Kapitel
    p("## 4. Ergebnisse")
    p("")
    current_tree = None
    for rq in rqs:
        if rq["tree"] != current_tree:
            current_tree = rq["tree"]
            p(f"### {rq['tree_label']}")
            p("")
        rel = rq["dir"].relative_to(REPO_ROOT)
        p(f"#### {rq['chapter']} {rq['id']} — {rq['question']}")
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
    p("- `research/questions/*/README.md` und `research/workflow-dev/*/README.md` — RQ-Definitionen (Frontmatter mit factors/controls/outcomes)")
    p("- `research/{questions,workflow-dev}/*/findings.md` — persistente Befund-Listen")
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
