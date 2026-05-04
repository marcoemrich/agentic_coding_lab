---
name: snapshot
description: Generiert einen experiment-overview-Snapshot aller Forschungsfragen unter research/_archive/. Aufzurufen wenn ein neuer Stichtag-Bericht über alle RQs erzeugt werden soll.
disable-model-invocation: false
allowed-tools: Bash(./experiments/generate-snapshot-skeleton.py:*) Read Write Glob
---

# /snapshot — Experiment-Overview-Snapshot erzeugen

Du erzeugst einen eingefrorenen, publizierbaren Forschungsbericht aus dem
aktuellen Stand der `research/RQ-*/findings.md`. Der Snapshot landet als
neue Datei unter `research/_archive/experiment-overview-YYYY-MM-DD.md`.

## Grundprinzip

`findings.md` = lebendes Dokument, wachsende Status-getaggte Befund-Liste.
Snapshot = eingefrorener Tabellen-lastiger Bericht zu einem Stichtag.

Beide existieren parallel. Der Snapshot wird **nicht aus der Erinnerung**
geschrieben, sondern aus einem auto-generierten Skelett befüllt.

## Lifecycle (4 Schritte)

### Schritt 1 — Skelett generieren

Bash:

```bash
./experiments/generate-snapshot-skeleton.py
```

Das Skript schreibt nach `/tmp/snapshot-skeleton-YYYY-MM-DD.md`. Es füllt
auto:

- Datenbasis-Zahl (`experiments/runs/`-Count)
- Forschungsfragen-Übersichtstabelle mit Coverage je RQ
- Experiment-Design-Tabellen (Workflow, Modell, Kata, Workflow→Prompt-Mapping)
- Methodik-Block (statisch, mit Marker zum Aktualitäts-Check)
- Pro RQ: Befund-Rohliste sortiert nach Status (haltbar zuerst)
- Caveats-Sektion: alle ⚠️/❌/🚫-Findings cross-RQ
- Reproduzierbarkeit + Files-Tabelle

An jeder Stelle, an der Synthese fehlt, steht ein
`<!-- TODO Claude: ... -->`-Marker.

### Schritt 2 — Skelett lesen + alle findings.md lesen

Lies das Skelett (`/tmp/snapshot-skeleton-YYYY-MM-DD.md`) und **alle**
`research/RQ-*/findings.md`. Notiere für jede RQ:

- die ✅-Befunde im Detail (Aussage + Datenbasis-Werte)
- die ⚠️/🚫/❌-Befunde, weil sie als Caveats in deine RQ-Synthese gehören

### Schritt 3 — Synthese-Sektionen füllen

Ersetze jeden `<!-- TODO Claude: ... -->`-Marker durch echten Inhalt.
**Niemals einen TODO-Marker stehen lassen.**

Stil-Vorgaben:

- **Sprache: Deutsch.** Wie in `findings.md`.
- **Einleitung (Abschnitt vor 1.):** 2–3 Sätze. Was ist die Studie, was
  deckt dieser Snapshot ab.
- **Methodik (Abschnitt 3):** Inhalt im Skelett ist statisch. Verifiziere
  gegen `experiments/docker/Dockerfile`, `experiments/analyze-run.sh`,
  `experiments/aggregate-by-query.py`, ob Pipeline-Beschreibung noch
  aktuell ist. Bei Abweichungen korrigiere im Snapshot. Entferne den
  `<!-- TODO Claude: prüfen ob noch aktuell ... -->`-Marker entweder
  durch eine kurze Bestätigung („Pipeline unverändert seit ...") oder
  durch die korrigierten Schritte.
- **RQ-Sektionen (4.X):** Pro RQ 60–100 Wörter Prosa nach der
  Befund-Rohliste. Top-Befund (1 ✅) ausführlich + 1 Caveat aus den
  ⚠️/🚫-Befunden + expliziter Verweis auf `research/RQ-N-.../findings.md`.
  Keine Tabellen aus findings.md duplizieren — die stehen in der
  findings.md. Wo Coverage < 100 % ist, das in der Synthese benennen
  („Bei aktuell N Runs in M von K Zellen ...").
- **Cross-RQ-Synthese (5):** 3–5 nummerierte Punkte. Jeder Punkt verbindet
  mindestens **zwei** RQs und steht so **nicht** in einer einzelnen
  findings.md. Beispiele aus dem v2-Snapshot: „Workflow-Wahl ist
  bedeutsamer als Modell-Wahl auf großen Katas" (kombiniert RQ-1 + RQ-3),
  „v5 ist der praktische Sweet Spot" (RQ-1 + Token-Effizienz-Daten aus
  RQ-3), „Magic Numbers dominieren das Smell-Signal" (RQ-1-Smell-Klassen).
- **Limitierungen (7):** 5–8 Stichpunkte. Pflicht: nur Anthropic-Modelle,
  nur synthetische Katas, nur TypeScript, headless ohne HITL, n ≤ 3 pro
  Zelle. Optional: konkrete Coverage-Lücken aus den RQ-Coverage-Werten
  oben (z.B. „RQ-3 nur 1/5 Zellen voll besetzt").

Ehrlichkeits-Regel: Falls eine RQ keine ✅-Befunde hat, **nicht** etwas
erfinden — sage stattdessen klar „Aktuelle Datenbasis liefert keinen
robusten Befund" und nutze die Synthese, um zu erklären, was fehlt.

### Schritt 4 — Datei schreiben

Nimm das Datum aus dem Skelett-Header (Zeile 3: `Stand: YYYY-MM-DD.`)
und schreibe nach:

```
research/_archive/experiment-overview-YYYY-MM-DD.md
```

Verifiziere danach mit Glob bzw. Read, dass:

1. Datei existiert
2. Keine `<!-- TODO -->`-Marker mehr drin sind
3. Alle ⚠️/❌/🚫-Befunde aus den findings.md in der Caveats-Sektion auftauchen
4. Alle ✅-Befunde irgendwo in den RQ-Sektionen referenziert sind (Nummer + Aussage)

Berichte am Ende in 1–2 Sätzen den Output-Pfad und auffällige Coverage-Lücken
(„RQ-X ist aktuell unter min_replicates").

## Stilvorlage

`research/_archive/findings-validation-2026-05-04/experiment-overview-v2.md`
zeigt die Ziel-Tabellen-Dichte und Sektion-Reihenfolge. Lies sie zur
Orientierung, **bevor** du Schritt 3 startest. Übernimm Tabellen-Stil und
Befund-Sprachfärbung — nicht die konkreten Zahlen (die kommen aus den
aktuellen findings.md).

## Was bewusst NICHT zu deinem Output gehört

- Keine Tabellen mit konkreten metrics.json-Werten neu berechnen — die
  Zahlen stehen schon in den findings.md und werden dort gepflegt.
- Kein Auto-Commit. Der Snapshot wird vom User reviewed, bevor er ins
  Repo geht.
- Kein Diff zum letzten Snapshot — das wäre ein eigener Skill.
- Keine Subagent-Auslagerung; alles im Hauptkontext.
