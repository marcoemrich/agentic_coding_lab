---
id: RQ-9
question: "Trägt der verbose Instruktions-Inhalt eines TDD-Workflows zur Code-Qualität und TDD-Disziplin bei, oder ist er entbehrlich?"
factors:
  workflow_x_prompt:
    - {workflow: v5-exact-single-context, prompt: example-mapping}
    - {workflow: v5.1-minimized,          prompt: example-mapping}
  kata_base: [game-of-life]
controls:
  model: opus-4-6-portkey
outcomes:
  - tests_passing
  - cc_loc
  - cc_avg_loc_per_function
  - cc_longest_function
  - mccabe_max
  - mccabe_avg
  - cognitive_max
  - cognitive_avg
  - smell_total
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  - predictions_correct_rate
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 3
status: aktiv
---

# RQ-9: Workflow-Minimierung — was ist tragend, was ist Boilerplate?

Der `v5-exact-single-context`-Workflow umfasst aktuell 827 Zeilen über
7 Markdown-Dateien (Rules + Phase-Commands). Sehr viel davon ist
dekoratives Beiwerk: wiederholte "USE SKILLS"-Warnungen,
Self-Check-Listen, "Common Failure Modes", "Why this discipline works"-
Pep-Talks, APP-Mass-Berechnungs-Tabellen und Component-Counts. Nur vier
Marker treiben tatsächlich die Auswertung
(siehe [`experiments/workflows/MARKERS.md`](../../experiments/workflows/MARKERS.md)).

## Hypothese

Wenn das Verbose-Beiwerk entfernt wird und die Workflow-Files auf das
Kern-Skript plus die parser-relevanten Marker reduziert werden, ergeben
sich **vergleichbare Code-Qualitäts- und TDD-Disziplin-Werte** wie bei
v5 — bei niedrigeren `total_tokens` und potenziell niedrigerer
`duration_seconds`.

Falls *Verschlechterung* eintritt, wissen wir, dass ein Teil der
verbose Anweisungen tragend ist, und können in v5.2/v5.3 gezielter
schneiden, um die tragenden Komponenten zu lokalisieren.

## v5.1-minimized

Reduktion: 827 → ~270 Zeilen (−67 %).

| Datei | v5 | v5.1 | Was raus |
|---|---:|---:|---|
| `rules/tdd.md` | 185 | ~30 | "USE SKILLS"-Warnungen (7×), Self-Check-Listen, Common-Failure-Modes, Pep-Talks |
| `rules/tdd_with_ts_and_vitest.md` | 27 | ~25 | minimaler Trim |
| `rules/tdd-experiment-mode.md` | 22 | 22 | unverändert (DONE-Marker bleibt) |
| `commands/test-list.md` | 110 | ~40 | Include/Exclude-Tabellen, Step-1..5-Redundanz |
| `commands/red.md` | 138 | ~70 | Step 1-6-Beispielblöcke, Prediction-Failure-Protocol |
| `commands/green.md` | 134 | ~50 | "Implementation Strategies"-Duplizierung, "Psychological Resistance" |
| `commands/refactor.md` | 211 | ~60 | APP-Mass-Formel + Component-Tabelle + Step-Mass-Reports |

## Erhaltene Marker (zwingend)

Aus [`experiments/workflows/MARKERS.md`](../../experiments/workflows/MARKERS.md):

1. **Skill-Tool-Calls** in Sequenz `test-list → red → green → refactor`
   — bleibt durch `tdd-experiment-mode.md` (unverändert) erzwungen.
2. **String `"Red Phase Complete"`** in `red.md` Step 7.
3. **Zwei Prediction-Zeilen pro Red-Phase** im Format
   `… ✅ Correct` (Compilation + Runtime), plus
   "MUST verbatim, do not abbreviate, do not collapse"-Klausel.
4. **`experiment-done.txt` mit `DONE`** als Termination-Hinweis.

## Design-Begründungen

**Control: `model: opus-4-6-portkey`** — Diese RQ läuft über das
Portkey-Gateway, weil die direkte Anthropic-API für den Autor aktuell
unter Rate-Limit-Druck steht. Portkey routet auf
`claude-opus-4-6` (thinking aktiv); Setup über `ANTHROPIC_BASE_URL` +
`ANTHROPIC_CUSTOM_HEADERS` (siehe
[`experiments/docker/.env.example`](../../experiments/docker/.env.example)).

Konsequenzen für die Vergleichbarkeit:

- **Befund gilt für Opus 4.6 unter Portkey-Routing.** Übertragbarkeit
  auf Opus 4.7 oder auf Direct-API-4.6 ist offen — das wäre eine eigene
  Frage. Dass der Workflow-Reduktions-Effekt modell-übergreifend gleich
  wirkt, ist plausibel, aber nicht durch diese RQ belegt.
- **Bestehende v5-Baseline-Runs sind hier nicht verwertbar**, weil sie
  auf `opus-4-7-no-thinking` liefen. Beide Faktor-Zellen (v5 und v5.1)
  müssen frisch gefahren werden.
- Modell-Versions-Effekt ist Gegenstand einer separaten Modell-Vergleichs-
  RQ; in dieser RQ wird `opus-4-6-portkey` strikt als Control gepinnt.

**Control: `kata_base: [game-of-life]`** — Einzige Kata mit
verlässlichem Code-Qualitäts-Signal (mars-rover hat zu wenig Smells,
string-calculator/pixel-art sind zu trivial). Korrektheit ist für
opus auf game-of-life saturiert (100 % pass), daher liefert das Auslassen
von claim-office hier kein Korrektheits-Signal-Verlust.

**Faktor: nur `v5` vs. `v5.1`** — Andere Workflows sind nicht relevant
für diese Frage. v5 wurde gewählt, weil er aktuell die schnellste
TDD-Variante ist (User-Anforderung) und weil seine Disziplin-Marker
parser-vollständig dokumentiert sind.

## Vorgehen

0. **Container-Voraussetzung Portkey** (einmalig): vor dem ersten
   Batch-Lauf `~/.claude.portkey/settings.json` mit gültigem
   Portkey-API-Key anlegen. Anleitung:
   [`experiments/docker/claude-config-portkey.README.md`](../../experiments/docker/claude-config-portkey.README.md).
   Der `run-rq`-Skill prüft die Datei automatisch und stoppt sonst.
   Manueller Batch-Aufruf für diese RQ:
   `CLAUDE_CONFIG_DIR=~/.claude.portkey ./experiments/docker/batch.sh <plan>`.
1. v5.1 anlegen, Marker per `grep` verifizieren.
2. **Smoke-Test**: 1 Run mit v5.1, `metrics.json` per
   `MARKERS.md`-jq-Check validieren. Ohne grünes Smoke-Ergebnis kein
   Batch.
3. Erst dann den n=3-Fill-Plan über `batch-plan-from-rq.py` generieren
   und ausführen.
4. `aggregate-by-query.py` über RQ-9 → `runs.csv` + `summary.md`.
5. Findings nach Datenlage; bei Auffälligkeit → v5.2 mit gezielterem
   Schnitt.

## Findings

Siehe [findings.md](findings.md) (entsteht nach erstem Datenlauf).
