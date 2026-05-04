---
name: run-rq
description: |
  Use this skill to drive a research question (RQ) end-to-end: validate the
  RQ README, generate a fill batch-plan, start the Docker batch in the
  background, monitor progress, run aggregation, and propose findings updates.
  Trigger when the user says "RQ-N voranbringen", "run-rq", "fill RQ-N",
  "run RQ-N", "Forschungsfrage N starten", or names a specific RQ-N directory
  in research/.
---

# Skill: run-rq

End-to-end orchestration for advancing a single research question (RQ) in
this lab repo. **Reine Orchestrierung** — alle Operationen rufen bestehende
Repo-Skripte auf, es wird kein neuer Python-/Bash-Code geschrieben.

## Argument

- `RQ-N` (z.B. `RQ-3`) oder `research/RQ-N-*/` (Pfad).
- Wenn nicht gegeben: aus dem letzten User-Turn erschließen, sonst zurückfragen
  ("Welche RQ? z.B. RQ-3").

## Repo-Konventionen (aus `research/README.md` und memory)

- RQ-Verzeichnis: `research/RQ-{N}-*/` mit `README.md`, `findings.md`,
  `runs.csv`, `summary.md`.
- Frontmatter-Pflichtfelder: `id, question, factors, controls, outcomes,
  min_replicates, status`.
- Methoden-Constraint: v1/v2 nur mit `prompt: prose`; v3/v4/v5 mit allen drei
  Stilen. Wenn `factors.workflow_x_prompt` existiert, gibt es kein
  zusätzliches `factors.workflow` / `controls.workflow`.
- Aktive Katas: nur `game-of-life`, `mars-rover`. `controls.kata_base`
  muss aus dieser Menge sein.
- Modell-IDs sind **Lab-Varianten-IDs** (`opus-4-7`, `opus-4-7-no-thinking`,
  `sonnet-4-6`, `sonnet-4-6-no-thinking`, `haiku-4-5`, `haiku-4-5-no-thinking`).
- Aggregation ist query-basiert: ALLE Runs in `experiments/runs/`, die zur
  Selektor-Query passen, zählen — egal aus welchem Batch.
- Batch-Plan ist idempotent: zählt bestehende Matches und füllt nur fehlende
  bis `min_replicates`.

## Phasen

Sequenziell ausführen. Bei Fehlern in einer Phase **stoppen und den User
fragen**, nicht zur nächsten Phase überspringen.

---

### Phase 1 — Validate

1. RQ-Pfad auflösen mit Glob: `research/RQ-{N}-*/`. Bei mehreren Treffern
   den ersten nehmen und den User informieren.
2. `README.md` lesen.
3. Frontmatter-Block (zwischen den ersten beiden `---`-Zeilen) parsen.
   Pflichtfelder prüfen: `id, question, factors, controls, outcomes,
   min_replicates, status`. Fehlende Felder → Phase abbrechen, User informieren.
4. Methoden-Constraints prüfen:
   - Wenn `factors.workflow_x_prompt` gesetzt: darf KEIN `factors.workflow`
     und KEIN `controls.workflow` zusätzlich gesetzt sein.
   - In jedem `workflow_x_prompt`-Eintrag: wenn `workflow ∈ {v1-oneshot,
     v2-iterative}`, muss `prompt == prose` sein.
   - `controls.kata_base ∈ {game-of-life, mars-rover}`.
   - Modell-Werte (in `controls.model` und/oder `factors.model`) müssen
     in der Lab-Varianten-Tabelle stehen.
5. `findings.md` lesen (wird in Phase 6 als Vorher-Stand gebraucht).
6. Soll-Berechnung: aus `factors` × `controls` die Zahl der Zellen ableiten
   (jeder Faktor multipliziert; gepaarte Faktoren wie `workflow_x_prompt`
   zählen als ein Faktor mit `len(pairing)` Werten). Soll-Runs = Zellen ×
   `min_replicates`. Diese Zahl dem User mitteilen.

Output an User (kompakt):
```
RQ-N validiert: <id>, <#cells> Zellen × min_replicates=<n> = <soll> Soll-Runs.
status: <status>
```

---

### Phase 2 — Plan

1. Dry-Run aufrufen:
   ```
   experiments/batch-plan-from-rq.py research/RQ-{N}-*/ --dry-run
   ```
2. Output enthält die Anzahl fehlender Runs. User informieren:
   ```
   Cells: X, missing runs: Y → würde experiments/batch-plans/rq-{n}-fill.json schreiben
   ```
3. Wenn `Y == 0`: keine neuen Runs nötig — direkt zu Phase 5 springen.
4. Sonst: User-Bestätigung einholen ("Plan mit Y Runs jetzt schreiben?").
   Erst nach explizitem "ja" weitermachen.
5. Plan ohne `--dry-run` schreiben:
   ```
   experiments/batch-plan-from-rq.py research/RQ-{N}-*/
   ```
6. Generierten Plan kurz inspizieren (Read auf
   `experiments/batch-plans/rq-{n}-fill.json`) und die Zellverteilung
   (`{kata, workflow, model}`-Häufigkeiten) dem User zusammenfassen.

---

### Phase 3 — Run

1. **Pre-Check**:
   - `docker ps --filter name=docker-batch-run --format '{{.Names}}'` —
     wenn ein Container läuft: STOPPEN und beim User nachfragen, ob der
     bestehende Batch erst beendet werden soll.
   - Wenn `experiments/docker/batch.log` aus früherem Lauf existiert und
     >0 bytes hat: User fragen, ob es als
     `experiments/docker/batch.<plan>.log` gesichert werden soll
     (`mv`, kein Löschen).
2. **User-Bestätigung** vor Start: "Starte Batch `rq-{n}-fill` mit Y Runs
   im Hintergrund? Erwartete Wallclock ≈ Y × 6 min ≈ Z min." (6 min/Run
   gemäß memory smart-subset-Erfahrung.)
3. Hintergrund-Start (gemäß memory: KEIN `nohup ... &`):
   ```bash
   cd experiments/docker && ./batch.sh rq-{n}-fill
   ```
   mit `run_in_background: true` im Bash-Tool. Task-ID merken.
4. Container-Name nach ein paar Sekunden via
   `docker ps --filter name=docker-batch-run --format '{{.Names}}'` ermitteln
   und dem User melden.

---

### Phase 4 — Monitor

1. Polling-Schleife mit `experiments/docker/watch-batch.sh rq-{n}-fill`:
   - Erste 5 min: alle 60 s ein Snapshot.
   - Danach: alle 5 min.
   - Bei jedem Poll Counter `[N/total]` und Container-Status berichten.
2. Beendigungs-Bedingungen:
   - `Container STOPPED` UND Counter = `[total/total]` → erfolgreich,
     weiter zu Phase 5.
   - `Container STOPPED` UND Counter < total → Resume (Phase 4b).
   - User signalisiert Abbruch → `docker stop <container>` → Resume
     (Phase 4b).
3. **Wichtig**: Memory-Patterns ernst nehmen:
   - `\b429\b` mit `claude_exit != 0` = echtes Rate-Limit; Backup-Warnung
     mit `backup.<ms>.json` (kann zufällig `429` enthalten) IGNORIEREN.
   - "Claude configuration file not found at: …" beim Container-Start ist
     harmlos.
   - Nicht panikartig retryen, wenn `watch-batch.sh` einmal verzögert
     antwortet.
4. **Mid-execution-Cleanup nach Stop**: das jüngste Run-Dir in
   `experiments/runs/`, dem `analysis-report.md` ODER `transcript.jsonl`
   fehlt, ist mid-execution unterbrochen worden. User fragen:
   "Lösche unterbrochenes Run-Dir `<run-dir>` (kein analysis-report.md)?"
   Erst nach explizitem "ja" mit `rm -rf` löschen.

#### Phase 4b — Resume

1. Resume-Plan generieren:
   ```
   experiments/docker/resume-plan.sh rq-{n}-fill
   ```
   → schreibt `/tmp/rq-{n}-fill-resume.json`.
2. Größe dem User zeigen (`jq '.runs | length' /tmp/rq-{n}-fill-resume.json`).
3. User-Bestätigung einholen: "Restart mit `<m>` verbleibenden Runs?"
4. Nach "ja":
   ```bash
   cd experiments/docker && ./batch.sh /tmp/rq-{n}-fill-resume.json
   ```
   im Hintergrund. Zurück zu Phase 4.

---

### Phase 5 — Aggregate

1. Aufrufen:
   ```
   experiments/aggregate-by-query.py research/RQ-{N}-*/
   ```
2. Erwartete Outputs:
   - `research/RQ-{N}-*/runs.csv` (eine Zeile pro matched Run)
   - `research/RQ-{N}-*/summary.md` (per-Zelle-Pivots für jeden `outcome`)
3. `summary.md` komplett lesen und dem User zusammenfassen — die
   Zellen-Pivot-Tabellen einzeln zeigen.
4. Sanity-Check: hat jede Zelle ≥ `min_replicates`? Wenn nicht: warnen und
   anbieten, zu Phase 2 zurückzuspringen (ggf. neue Runs).

---

### Phase 6 — Findings-Vorschlag

**Niemals automatisch in `findings.md` schreiben.** Nur Vorschlag im Chat
ausgeben, dann auf explizites "ja, übernehmen" warten, dann via `Edit`
patchen.

1. Diff-Quellen:
   - **Vorher**: `findings.md` aus Phase 1.
   - **Neu**: `summary.md` aus Phase 5.
2. Heuristische Vorschläge generieren:
   - **Neuer Befund**: Zelle/Faktor-Gruppe mit Δ ≥ 1σ über die anderen
     Gruppen UND der Effekt ist in `findings.md` noch nicht behandelt →
     neuer `F-{N}.{M+1}`-Block (M = höchste bestehende Findung-Nummer).
   - **Status-Update**: Bestehender Finding mit `🚫 nicht prüfbar`,
     dessen Zelle jetzt `n ≥ min_replicates` hat → Status-Vorschlag
     `✅ haltbar` / `⚠️ revidiert` / `❌ verworfen` je nach
     Datenlage.
   - **Revision**: Bestehender Finding mit Datenbasis-Tabelle, deren
     Zellwerte in `summary.md` jetzt anders sind → `⚠️ revidiert`-
     Vorschlag mit Diff alt/neu.
3. Format der Vorschläge: Repo-Stil aus `research/RQ-1-workflow-effect/findings.md`
   übernehmen — Aussage / Datenbasis-Tabelle / Begründung / Status-Marker.
4. User-Entscheidung pro Vorschlag einholen. Bei "ja" mit `Edit`:
   - Neue F-Blöcke ans Ende von `findings.md`.
   - Status-Updates inline in der entsprechenden `## F-x.y`-Zeile.
5. Bei "nein": Vorschlag bleibt nur im Chat, `findings.md` bleibt unverändert.

---

## Out-of-Scope (bewusst NICHT im Skill)

- Eigentliche Batch-Ausführung im Container (`run-batch.sh` läuft im Container).
- ESLint/Smell-Detection (läuft pro Run in `analyze-run.sh`).
- Cross-RQ-Aggregation oder Erstellung neuer RQs.
- Automatisches Commit/Push von `runs.csv` / `summary.md` / `findings.md` —
  bleibt User-Entscheidung.
- Worktree-Wechsel oder Merge nach `main`.

## Verhalten bei Fehlern

- **Phase 1 schlägt fehl**: nicht weiterfahren, klaren Constraint-Hinweis
  geben (z.B. "v1-oneshot mit prompt=example-mapping verstößt gegen
  Methoden-Constraint in research/README.md").
- **Phase 2/3-Skripte mit Non-Zero-Exit**: Output dem User zeigen, NICHT
  blind retryen.
- **Phase 4 verliert Container**: `docker ps -a` zeigen, dann Resume
  anbieten.
- **Phase 5 erzeugt leere `runs.csv`**: prüfen, ob `experiments/runs/`
  überhaupt matchende Runs hat (Selektor zu eng?). User informieren.
