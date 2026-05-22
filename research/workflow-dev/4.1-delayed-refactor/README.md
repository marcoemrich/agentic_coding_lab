---
id: RQ-delayed-refactor
question: "Produziert periodisches Refactoring innerhalb von TDD-Cycles besseren Code als ein einzelnes End-Refactoring nach Vibe-Coding-Implementierung + nachträglich geschriebenen Tests? Und falls ja: liegt das am Zeitpunkt (periodisch vs einmalig) oder am Refactor-Inhalt (spezialisierter Subagent mit APP/Naming vs nativer Inline-Refactor)?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,                    prompt: example-mapping}
    - {workflow: v8a-delayed-refactor-agent,  prompt: example-mapping}
    - {workflow: v8b-delayed-refactor-native, prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
  kata_base: game-of-life-cli
outcomes:
  # primär: Korrektheit-außen (verification suite)
  - verification_pct
  - verification_passed
  # sekundär: Code-Qualität
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - smell_total
  - lines_of_code
  # Kosten
  - duration_seconds
  - total_tokens
  # Korrektheit (Sanity)
  - tests_passing
  - completed_within_budget
  # Test-Charakteristik (nachträglich vs TDD-driven)
  - tests_total
  - test_lines
min_replicates: 10
status: geplant
---

# RQ-delayed-refactor: Delayed-Refactor — entkräftet TDD-mit-periodischem-Refactor das Vibe-Coding-mit-End-Refactor-Argument?

Die Hypothese, die TDD-mit-periodischem-Refactor stützt, ist: *iterativ kleine Refactorings nach jedem Green-Cycle produzieren besseren Code als ein einzelnes großes Refactoring nach einer kompletten Implementierung.* Das naive Gegenargument: "Mach einfach Vibe-Coding, schreib am Schluss Tests, refactor dann." RQ-delayed-refactor testet das direkt.

## Motivation

Bisherige RQs haben TDD-Workflows untereinander verglichen (v3 vs v4 vs v5 vs v6 vs v6.5.x). Keine RQ hat **TDD-mit-Refactor** gegen **Oneshot + nachträgliche Tests + End-Refactor** gestellt. Wenn das End-Refactor-Pattern Code-Qualitäts-Outcomes auf TDD-Niveau erreicht, wäre der TDD-Refactor-Periodizitäts-Vorteil empirisch nicht stützbar — das ist ein wichtiger Negativ-Befund, falls er eintritt. Wenn TDD klar dominiert, haben wir ein Argument für den Periodizitäts-Effekt.

Die zweite Frage trennt **Zeitpunkt** von **Inhalt**: v8a nutzt denselben spezialisierten Refactor-Subagent (`refactor.md` 1:1 aus v6.5.4 — identisch zu v6.5.3) wie der TDD-Arm. v8b nutzt eine native Inline-Anweisung im v3-Stil ("Refactor. Tests must stay green.") ohne APP, ohne Naming-Block, ohne Mandatory-Attempt-Klausel. Differenz v8a vs v8b isoliert den Inhalts-Effekt des Refactor-Agenten unter sonst gleichen Bedingungen (gleicher Kontext, gleiche Vibe-Coded-Implementation, gleiche nachträgliche Tests).

## Workflow-Definition

- **v6.5.4-refactor-cut-only (TDD-Baseline, n=10)** — aktueller Quality-Champion. Periodisches Refactor pro Cycle via Subagent, APP + Naming-First.
- **v8a-delayed-refactor-agent (n=10, neu)** — drei Phasen in einer Session: (1) Oneshot-Implementierung ohne Tests, (2) Test-Suite gegen `prompt.md` (Spec-Anker, nicht Code-Anker), (3) Refactor-Subagent (`refactor.md` 1:1 aus v6.5.4) als einziger und finaler Pass.
- **v8b-delayed-refactor-native (n=10, neu)** — identisch zu v8a in Phase 1+2, aber Phase 3 ist eine native Inline-Refactor-Anweisung ohne Agent-File: *"Refactor src/<feature>.ts. Tests must stay green. Run pnpm test after each change. Stop when no further improvement is obvious."* — kein APP, keine Naming-Evaluation, keine Mandatory-Attempt-Klausel.

## Hypothesen

- **H1 (Periodizität trägt)**: v6.5.4 dominiert v8a auf den primären Code-Qualitäts-Metriken (`cognitive_max`, `mccabe_max`, `cc_longest_function`) — falsifiziert, wenn alle drei Metriken bei v8a innerhalb 1 σ von v6.5.4 liegen.
- **H2 (Refactor-Inhalt trägt)**: v8a dominiert v8b auf denselben Metriken — falsifiziert, wenn die Spezial-Refactor-Mechanik (APP, Naming, Mandatory-Attempt) gegenüber nativem Inline-Refactor keinen messbaren Vorteil bringt.
- **H3 (Vibe-Tests sind regressionsförmig)**: v8a/v8b haben systematisch andere Test-Charakteristik als v6.5.4 (z.B. höhere `test_lines/tests_total`-Ratio, da Tests den Code spiegeln statt das Spec); explorativ, nicht streng falsifizierbar.
- **H4 (Kosten-Trade-off)**: v8a/v8b verbrauchen weniger `total_tokens` als v6.5.4 (kein Cycle-Overhead) — wenn TDD-Quality-Vorteil signifikant ist, ist das der Preis.

## Marker-Erwartung (by design)

| Metrik | v6.5.4 | v8a | v8b |
|---|---:|---:|---:|
| `cycle_count` | 3–5 | 0 | 0 |
| `predictions_total` | ~2× cycle_count | 0 | 0 |
| `refactorings_applied` | 3–5 | 1 | 0 |
| `experiment-done.txt` | DONE | DONE | DONE |

Die TDD-Disziplin-Marker sind in den v8-Armen **definitionsgemäß** null — sie liegen außerhalb des Vergleichs. Outcome-Vergleich läuft ausschließlich über Code-Qualität, Kosten und Korrektheit.

## Smoke-Run (2026-05-17)

- v8a: `tests_passing=true`, LoC 36, code_mass 145, mccabe_max 6, cognitive_max 10. `experiment-done.txt` sauber `DONE`.
- v8b: `tests_passing=true`, LoC 42, code_mass 147, mccabe_max 4, cognitive_max 4. `experiment-done.txt` sauber `DONE`.

Beide Workflows liefern saubere Marker und gültige Outcome-Metriken. Re-smoke v8a nach Update auf v6.5.4-refactor.md bestätigt — keine `experiment-done.txt`-Leakage (war Single-Run-Artefakt im allerersten Smoke).

## Offene Punkte

- **claim-office-Erweiterung** (RQ-delayed-claim-office oder RQ-regression): Korrektheits-Achse zusätzlich zur Code-Qualität. Wird angegangen, wenn RQ-delayed-refactor-game-of-life ein klares Signal in irgendeine Richtung zeigt.
- **Test-Qualität ist nicht direkt messbar**: H3 bleibt explorativ. Falls qualitative Inspektion zeigt, dass v8-Tests systematisch implementationsspiegelnd sind, lohnt eine eigene Mutation-Score-RQ.
