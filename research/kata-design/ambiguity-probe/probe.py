#!/usr/bin/env python3
"""Ambiguitäts-Vortest für die Versicherungs-Kata-Mehrdeutigkeiten.

Liest mehrdeutigkeiten.yaml, ruft pro (Mehrdeutigkeit × Modell-Konfig) n_repeats mal
`claude --print --bare` auf, schreibt die Antworten in results/probe.csv
und einen kompakten Markdown-Bericht results/probe.md.

Klassifizierung der Antworten erfolgt manuell durch Lesen — nicht hier.

Aufruf:
    cd research/kata-design/ambiguity-probe
    python3 probe.py
"""
from __future__ import annotations

import csv
import json
import subprocess
import sys
import time
from pathlib import Path

try:
    import yaml
except ImportError:
    print("Brauche PyYAML. Installier mit: pip install pyyaml", file=sys.stderr)
    sys.exit(1)

HERE = Path(__file__).parent
RESULTS = HERE / "results"
CSV_PATH = RESULTS / "probe.csv"
MD_PATH = RESULTS / "probe.md"


def load_config() -> dict:
    with (HERE / "mehrdeutigkeiten.yaml").open() as f:
        return yaml.safe_load(f)


def run_claude(prompt: str, model: str, effort: str) -> tuple[str, float, str | None]:
    """Ruft claude --print auf, gibt (text, dauer_s, error) zurück."""
    cmd = [
        "claude",
        "--print",
        "--no-session-persistence",
        "--model", model,
        "--effort", effort,
        "--output-format", "json",
        prompt,
    ]
    t0 = time.time()
    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,
        )
    except subprocess.TimeoutExpired:
        return "", time.time() - t0, "timeout"
    dauer = time.time() - t0
    if proc.returncode != 0:
        return "", dauer, f"exit {proc.returncode}: {proc.stderr.strip()[:200]}"
    try:
        payload = json.loads(proc.stdout)
        text = payload.get("result", "") or payload.get("response", "") or proc.stdout
    except json.JSONDecodeError:
        text = proc.stdout
    return text.strip(), dauer, None


def main() -> int:
    cfg = load_config()
    mehrdeutigkeiten = cfg["mehrdeutigkeiten"]
    modelle = cfg["modelle"]
    n = cfg["n_repeats"]

    RESULTS.mkdir(exist_ok=True)

    total = len(mehrdeutigkeiten) * len(modelle) * n
    done = 0
    rows: list[dict] = []

    print(f"Vortest: {len(mehrdeutigkeiten)} Mehrdeutigkeiten × {len(modelle)} Modelle × n={n} = {total} Calls")
    print()

    for m in mehrdeutigkeiten:
        prompt = f"{m['regeln'].strip()}\n\n{m['frage'].strip()}"
        for modell in modelle:
            for rep in range(1, n + 1):
                done += 1
                print(f"[{done}/{total}] Mehrdeutigkeit {m['id']} · {modell['id']} · rep {rep} ... ", end="", flush=True)
                text, dauer, err = run_claude(prompt, modell["model"], modell["effort"])
                status = "OK" if err is None else f"FEHLER ({err})"
                print(f"{status} ({dauer:.1f}s)")
                rows.append({
                    "mehrdeutigkeit": m["id"],
                    "modell": modell["id"],
                    "modell_label": modell["label"],
                    "rep": rep,
                    "dauer_s": f"{dauer:.1f}",
                    "fehler": err or "",
                    "antwort": text,
                })

    with CSV_PATH.open("w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    print(f"\nCSV geschrieben: {CSV_PATH}")

    write_markdown(cfg, rows)
    print(f"Markdown-Bericht: {MD_PATH}")
    return 0


def write_markdown(cfg: dict, rows: list[dict]) -> None:
    lines: list[str] = []
    lines.append("# Ambiguitäts-Vortest — Roh-Antworten")
    lines.append("")
    lines.append("Pro Mehrdeutigkeit die Antworten aller Modell-Konfigurationen, gruppiert.")
    lines.append("Klassifikation der Antworten erfolgt manuell durch Lesen.")
    lines.append("")
    lines.append("Bezug: [../kata-mehrdeutigkeiten.md](../kata-mehrdeutigkeiten.md)")
    lines.append("")

    by_m: dict[str, list[dict]] = {}
    for row in rows:
        by_m.setdefault(row["mehrdeutigkeit"], []).append(row)

    m_index = {f["id"]: m for m in cfg["mehrdeutigkeiten"]}

    for m_id, m_rows in by_m.items():
        m = m_index[m_id]
        lines.append(f"## Mehrdeutigkeit {m_id} — {m['titel']}")
        lines.append("")
        lines.append("**Regeln:**")
        lines.append("")
        lines.append("```")
        lines.append(m["regeln"].strip())
        lines.append("```")
        lines.append("")
        lines.append("**Frage:**")
        lines.append("")
        lines.append("```")
        lines.append(m["frage"].strip())
        lines.append("```")
        lines.append("")
        lines.append("**Lesarten:**")
        lines.append("")
        for k, v in m["lesarten"].items():
            lines.append(f"- `{k}`: {v}")
        lines.append("")
        by_modell: dict[str, list[dict]] = {}
        for row in m_rows:
            by_modell.setdefault(row["modell"], []).append(row)
        for modell_id, modell_rows in by_modell.items():
            label = modell_rows[0]["modell_label"]
            lines.append(f"### {label}")
            lines.append("")
            for r in modell_rows:
                if r["fehler"]:
                    lines.append(f"- **rep {r['rep']}** ({r['dauer_s']}s) — FEHLER: {r['fehler']}")
                else:
                    antwort_clean = r["antwort"].replace("\n", " ").strip()
                    lines.append(f"- **rep {r['rep']}** ({r['dauer_s']}s): {antwort_clean}")
            lines.append("")

    MD_PATH.write_text("\n".join(lines))


if __name__ == "__main__":
    sys.exit(main())
