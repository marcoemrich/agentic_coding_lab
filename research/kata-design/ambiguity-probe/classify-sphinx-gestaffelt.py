#!/usr/bin/env python3
"""Klassifiziert die Antworten von overlords-sphinx-gestaffelt.yaml.

Extrahiert die Endzahl je Antwort und ordnet sie einer Lesart zu.
Die Zuordnung Zahl -> Lesart ist unten explizit; Zahlen ausserhalb
landen als "?" und muessen von Hand gelesen werden.

Aufruf:
    cd research/kata-design/ambiguity-probe
    python3 classify-sphinx-gestaffelt.py
"""
import csv
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).parent
CSV = HERE / "results-overlords-sphinx-gestaffelt" / "probe.csv"

# Zahl -> Lesart, je Frage. Werte aus der Referenzrechnung.
LESARTEN = {
    "G1": {
        5:  "ueberschuss/ohne-selbst  (PIN)",
        7:  "ueberschuss/mit-selbst",
        11: "alle-Arten/ohne-selbst",
        13: "alle-Arten/mit-selbst",
    },
    "G2a": {
        4:  "Sphinx zaehlt nicht als Art",
        6:  "Sphinx zaehlt als Art       (PIN)",
        18: "alle-Arten-Lesart",
        3:  "nur eine Sphinx gewertet",
    },
    "G2b": {
        2:  "ohne sich selbst           (PIN)",
        3:  "mit sich selbst",
        9:  "alle-Arten/mit-selbst",
    },
}


def endzahl(text: str) -> int | None:
    """Die Punktzahl aus der Antwort. Bevorzugt eine explizite
    Ergebnis-Nennung, sonst die erste Zahl im Text."""
    t = text.strip()
    # "**5**" / "5 Punkte" / "= 5" am Anfang oder in einer Ergebniszeile
    for pat in (
        r"\*\*(\d+)\*\*",
        r"^(\d+)\b",
        r"(?:sind|ist|ergibt|macht|:)\s*(\d+)\s*Punkte?",
        r"(\d+)\s*Punkte?",
    ):
        m = re.search(pat, t, re.MULTILINE | re.IGNORECASE)
        if m:
            return int(m.group(1))
    return None


def main() -> int:
    if not CSV.exists():
        print(f"Fehlt: {CSV}", file=sys.stderr)
        return 1
    rows = list(csv.DictReader(CSV.open()))

    by = defaultdict(list)
    for r in rows:
        if r["fehler"]:
            by[(r["mehrdeutigkeit"], r["modell_label"])].append(("FEHLER", None))
            continue
        z = endzahl(r["antwort"])
        by[(r["mehrdeutigkeit"], r["modell_label"])].append((z, r["rep"]))

    for frage in ("G1", "G2a", "G2b"):
        keys = [k for k in by if k[0] == frage]
        if not keys:
            continue
        print(f"\n{'='*72}\n{frage}\n{'='*72}")
        gesamt = Counter()
        for k in sorted(keys):
            zahlen = [z for z, _ in by[k]]
            gesamt.update(zahlen)
            c = Counter(zahlen)
            teile = []
            for z, n in sorted(c.items(), key=lambda x: -x[1]):
                lab = LESARTEN[frage].get(z, "?")
                teile.append(f"{n}x {z} [{lab}]")
            print(f"  {k[1]:<28} " + " | ".join(teile))
        print(f"  {'GESAMT':<28} " + " | ".join(
            f"{n}x {z} [{LESARTEN[frage].get(z, '?')}]"
            for z, n in sorted(gesamt.items(), key=lambda x: -x[1])))
    return 0


if __name__ == "__main__":
    sys.exit(main())
