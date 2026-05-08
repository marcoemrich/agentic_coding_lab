---
name: build-overview
description: Generiert einen experiment-overview-Snapshot aller Forschungsfragen unter research/_archive/. Aufzurufen wenn ein neuer Stichtag-Bericht über alle RQs erzeugt werden soll.
disable-model-invocation: false
allowed-tools: Bash(./experiments/generate-snapshot-skeleton.py:*) Read Write Glob
---

# /build-overview — Experiment-Overview-Snapshot erzeugen

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
- Pro RQ: Befund-Rohliste (aktueller Stand, ohne Status-Tags)
- Reproduzierbarkeit + Files-Tabelle

An jeder Stelle, an der Synthese fehlt, steht ein
`<!-- TODO Claude: ... -->`-Marker.

### Schritt 2 — Skelett lesen + alle findings.md lesen

Lies das Skelett (`/tmp/snapshot-skeleton-YYYY-MM-DD.md`) und **alle**
`research/RQ-*/findings.md`. Notiere für jede RQ die aktuellen Befunde
mit Aussage + Datenbasis-Werten.

`open-questions.md` (falls vorhanden) **nicht** in den Snapshot
übernehmen — das sind interne Backlog-Items für künftige Batches, kein
publizierbarer Stand.

### Schritt 3 — Synthese-Sektionen füllen

Ersetze jeden `<!-- TODO Claude: ... -->`-Marker durch echten Inhalt.
**Niemals einen TODO-Marker stehen lassen.**

Stil-Vorgaben:

- **Sprache: Deutsch.** Wie in `findings.md`.
- **Glossar-Pflicht:** Vor Schritt 3 das Glossar in `research/README.md`
  lesen. Begriffe wie `code_mass`, `cc_loc`, `cc_longest_function`,
  `smell_total`, `verification_pct` ausschließlich in der dort definierten
  Form ("Code-Mass (APP)", "Produktiv-LoC", "Spitzen-Komplexität",
  "Smell-Summe", "Korrektheit (außen)") oder direkt per Metrik-ID in
  Backticks verwenden. Synonyme wie "Code-Volumen", "Code-Gesamtvolumen",
  "LoC-Größe" sind verboten — sie sind mehrdeutig bzw. kollidieren mit
  etablierten Definitionen (APP).
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
  Befund-Rohliste. Top-Befund ausführlich + bei Bedarf 1 Caveat aus dem
  Befund selbst (z.B. enge Datenbasis, nur eine Kata) + expliziter
  Verweis auf `research/RQ-N-.../findings.md`. Keine Tabellen aus
  findings.md duplizieren. Wo Coverage < 100 % ist, das in der Synthese
  benennen („Bei aktuell N Runs in M von K Zellen ...").
- **Findings-Konvention:** Snapshot zeigt **nur den aktuellen Stand**.
  Keine Status-Tags wie „⚠️ revidiert" / „✅ haltbar", keine Vergleiche
  mit Archiv-Snapshots oder älteren Studien (z.B. 235-Run-Studie). Falls
  die findings.md noch solche Status-Tags trägt: in der Snapshot-Synthese
  weglassen, nur die aktuelle Aussage übernehmen. Begründung: alte Runs
  hatten Pipeline-Biases (siehe Memory), Vergleiche sind methodisch nicht
  haltbar.
- **Cross-RQ-Synthese (5):** 3–5 nummerierte Punkte. Jeder Punkt verbindet
  mindestens **zwei** RQs und steht so **nicht** in einer einzelnen
  findings.md.
- **Limitierungen (7):** 5–8 Stichpunkte. Pflicht: nur Anthropic-Modelle,
  nur synthetische Katas, nur TypeScript, headless ohne HITL, n ≤ 3 pro
  Zelle. Optional: konkrete Coverage-Lücken aus den RQ-Coverage-Werten
  oben (z.B. „RQ-3 nur 1/5 Zellen voll besetzt").

Ehrlichkeits-Regel: Falls eine RQ keine belastbaren Befunde im aktuellen
Setup hat, **nicht** etwas erfinden — sage stattdessen klar „Aktuelle
Datenbasis liefert keinen robusten Befund" und nutze die Synthese, um zu
erklären, was fehlt.

### Schritt 4 — Datei schreiben

Nimm das Datum aus dem Skelett-Header (Zeile 3: `Stand: YYYY-MM-DD.`)
und schreibe nach:

```
research/_archive/experiment-overview-YYYY-MM-DD.md
```

Verifiziere danach mit Glob bzw. Read, dass:

1. Datei existiert
2. Keine `<!-- TODO -->`-Marker mehr drin sind
3. Alle aktuellen Befunde aus den findings.md irgendwo in den RQ-Sektionen referenziert sind (Nummer + Aussage)
4. Keine Status-Tags („⚠️ revidiert", „✅ haltbar") und keine Verweise auf alte Studien / Archiv-Snapshots im publizierten Snapshot

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
