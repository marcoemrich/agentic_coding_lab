---
id: RQ-21
question: "Schließt v4.2-shared-context — durch persistierte Shared-Context-Files (example-mapping, tdd-journal, architecture-notes) — den Korrektheits-Gap zwischen v4-Subagents und v6-hybrid auf claim-office-example-mapping × Opus 4.7 (Direct API, no-thinking)?"
factors:
  workflow:
    - v4-exact-subagents
    - v4.1-testlist-scope-fix
    - v4.2-shared-context
    - v6-hybrid
controls:
  kata_base: claim-office
  prompt: example-mapping
  model: opus-4-7-no-thinking
outcomes:
  - verification_pct
  - verification_passed
  - tests_passing
  - cli_built
  - cycle_count
  - refactorings_applied
  - duration_seconds
  - total_tokens
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-21: v4.2-shared-context Korrektheits-Effekt vs. v4 / v4.1 / v6-hybrid

## Motivation

Log-Analyse von v4-exact-subagents-Runs auf Opus 4.7 zeigte, dass Red/Green-Subagents niemals `prompt.md` lesen. Sie operieren mit dem Launch-Prompt-Skelett des Orchestrators (Testname + Einzeiler "Expected behavior") und den `*.spec.ts`/`*.ts`-Dateien. Der Orchestrator kompensiert das ad-hoc — mit hoher Varianz: in einem Run bekam Test 4 den ganzen Algorithmus erklärt, Tests 7/8/9 nur einen Einzeiler. Das erklärt die historische Bimodalität von `verification_pct` auf claim-office (mean ~0.66, Range 0.20–1.00, 10 Runs).

v6-hybrid hat diese Lücke nicht, weil Red/Green dort als Skills im Main-Context laufen und damit den vollen prompt.md-Kontext (statisch gelesen am Anfang) sowie alle vorherigen Cycle-Outputs (dynamisch im History) sehen — und erreicht auf demselben Cell stabile 5/5 × 1.00.

v4.2-shared-context behält die Subagent-Architektur bei, kompensiert aber das fehlende geteilte Working-Memory durch **drei persistierte Markdown-Dateien**:
- `example-mapping/<feature>.md` — geschrieben von `test-list`, gelesen von `red`/`green`
- `tdd-journal.md` — Red+Green-Cycle-Log (Predictions, was hielt, minimale Impls)
- `architecture-notes.md` — Refactor-Design-Memory, gelesen von Refactor und (für Helfer-Sichtbarkeit) auch von Red/Green

Zusätzliche test-list-Härtung gegen den `cli_built: false`-Failure-Mode (Spec-Anforderungen, insbesondere Interface-Tests wie CLI/stdin, dürfen nicht deferred werden) wurde nach dem ersten Smoke ergänzt.

## Hypothesen

- **H1 (v4.2 hebt Korrektheits-Mittel):** v4.2 erreicht im Mittel höhere `verification_pct` als v4 auf claim-office-example-mapping × opus-4-7-no-thinking; insbesondere weniger Low-Outlier-Runs (<0.40).
- **H2 (v4.2 reduziert Varianz):** v4.2 reduziert die Streuung von `verification_pct` gegenüber v4 deutlich; die Bimodalität verschwindet oder schwächt sich ab.
- **H3 (v4.2 schließt den Gap zu v6-hybrid):** v4.2 erreicht ein Korrektheits-Niveau, das näher an v6-hybrid (5/5 × 1.00) liegt als an v4 — operationalisiert als: mean(v4.2) - mean(v4) ≥ 0.5 × (mean(v6) - mean(v4)).
- **H4 (v4.2 vs. v4.1):** v4.2 liefert auf demselben Cell höhere oder mindestens gleichauf liegende `verification_pct` als v4.1-testlist-scope-fix. Sonst sind die zusätzlichen Shared-Context-Files überflüssig und v4.1 wäre die schlankere bevorzugte Variante.

## Design

- 4 Workflows × 1 Modell × 1 Kata × 1 Prompt-Stil = 4 Zellen
- min_replicates = 5 pro Zelle, n=20 insgesamt
- Reuse aus `experiments/runs/`:
  - v4-exact-subagents × opus-4-7-no-thinking: 10 Runs vorhanden → 0 Refill
  - v4.1-testlist-scope-fix × opus-4-7-no-thinking: 5 Runs vorhanden → 0 Refill
  - v6-hybrid × opus-4-7-no-thinking: 5 Runs vorhanden → 0 Refill
  - v4.2-shared-context × opus-4-7-no-thinking: 3 vorhanden (1 ok, 2 timeout) → Refill via `experiments/batch-plans/v4.2-claim-office-refill.json`

## Erwartetes Ergebnis-Muster

| Workflow | Erwartung mean(verification_pct) | Erwartung Std |
|----------|----------------------------------|---------------|
| v4-exact-subagents | ~0.66 (bekannt) | ~0.32 (bekannt) |
| v4.1-testlist-scope-fix | ? (RQ-20 misst das) | ? |
| **v4.2-shared-context** | **≥ 0.85, wenn H3 hält** | **≤ 0.15, wenn H2 hält** |
| v6-hybrid | 1.00 (bekannt) | 0.00 (bekannt) |

**Wenn H1+H2+H3 alle halten:** Shared-Context-Files sind eine effektive Methode, Subagent-Korrektheit auf v6-Niveau zu heben. Das stützt die Hypothese, dass "fehlender geteilter Kontext" und nicht "Skill-vs-Subagent-Architektur" der dominante Effekt war.

**Wenn nur H1, nicht H2:** v4.2 schiebt den Mittelwert hoch, behält aber die Bimodalität. Dann ist der Kontext-Reichtum nur eine Ursache; eine zweite (z.B. Subagent-Spawn-Latenz, Orchestrator-Pessimismus) bleibt unadressiert.

**Wenn H4 nicht hält (v4.1 ≥ v4.2):** Die zusätzlichen Shared-Files bringen keinen weiteren Effekt gegenüber dem v4.1-Test-List-Fix. Die schlankere v4.1-Variante sollte dann bevorzugt werden, und v4.2 als Komplexitäts-Overhead ohne Nutzen verworfen.

## Methodisches Detail: Timeout-Verhalten beachten

v4.2-Runs sind im Schnitt ~2-3× langsamer als v4 (mehr Reads/Writes pro Cycle, mehr substantielle Cycles). Der per-Run-Timeout von 5400s greift häufiger. Per Konvention zählen Timeouts für `min_replicates`, werden aber nicht refilled. Die Outcome-Spalte `completed_within_budget` macht diesen Effekt sichtbar — er ist ein eigenständiger Befund, nicht Rauschen.

## Bezug zu anderen RQs

- **RQ-20** (v4 vs. v4.1 same model/kata): liefert die v4.1-Spalte; RQ-21 baut darauf auf und addiert v4.2 + v6-hybrid.
- **RQ-19** (correctness regression): historischer Kontext zur claim-office-Bimodalität.
- **RQ-4b** (workflow-effect-correctness): breitere Workflow-Korrektheits-Landschaft.
