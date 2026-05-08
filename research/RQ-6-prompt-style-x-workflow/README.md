---
id: RQ-6
question: "Verbessern user-story oder example-mapping die Korrektheit gegenüber prose — und hängt der Effekt vom Workflow ab?"
factors:
  prompt: [prose, example-mapping, user-story]
  workflow: [v3-basic-tdd, v4-exact-subagents, v5-exact-single-context]
  kata_base: [claim-office]
controls:
  model: opus-4-7-no-thinking
outcomes:
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - code_mass
  - smell_total
  - cc_longest_function
  - cycle_count
  - predictions_correct
  - duration_seconds
min_replicates: 3
status: aktiv
---

# RQ-6: Reichern user-story und example-mapping die Korrektheit an?

prose ist die schlankste Spezifikations-Form: Regeln in Fließtext, ohne
Beispiele und ohne explizite Stakeholder-Sicht. user-story und
example-mapping liefern jeweils Zusatzinformation:

- **user-story** macht Akteure, Motivation und Akzeptanzkriterien
  explizit ("Als X möchte ich Y, damit Z").
- **example-mapping** liefert konkrete Input/Output-Beispiele pro Regel.

Diese RQ misst, **um wieviel** die beiden angereicherten Stile
`verification_pct` (und sekundär die TDD-Disziplin-Outcomes) gegenüber
prose verbessern, und **ob dieser Zugewinn vom Workflow abhängt**.

## Forschungsmotivation

prose ist Baseline. Die Praxis-Frage ist:

1. Lohnt es sich, Aufgaben als user-story zu formulieren? (Stakeholder-
   Sicht statt nur Regeln)
2. Lohnt es sich, ein example-mapping mitzugeben? (Beispiele als
   Test-Anker)
3. Hängt die Antwort davon ab, mit welchem TDD-Workflow gearbeitet wird
   — d.h. profitiert ein lockerer Workflow (v3) stärker von der
   Anreicherung als ein strikt skripteter (v4/v5), oder umgekehrt?

## Faktoren

| Faktor | Werte |
|---|---|
| `prompt` | prose, example-mapping, user-story |
| `workflow` | v3-basic-tdd, v4-exact-subagents, v5-exact-single-context (nur TDD-Workflows) |

3 × 3 = 9 Zellen × n=3 Replikate = 27 Runs.

## Design-Begründung

**Nur TDD-Workflows**: v1/v2 sind durch das Methoden-Constraint
(`research/README.md`) auf prose festgelegt. Eine 3×5-Matrix mit leeren
Zellen für v1/v2 × {example-mapping, user-story} würde das Design
verfälschen.

**Nur claim-office**: game-of-life ist als Mehrdeutigkeits-Aufdecker
nicht brauchbar — die Modelle kennen die Spec inkl. Beispielen aus
den Trainingsdaten, die Stile differenzieren auf game-of-life nicht.
Die HPSMV-Mehrdeutigkeiten in claim-office sind eigens konstruiert,
um Stil-Unterschiede sichtbar zu machen
(siehe `research/kata-design/`).

**Single Model (opus-4-7-no-thinking)**: hält RQ-6 single-factor in
Modell-Dimension. Modell × Workflow × Stil wäre eine RQ-7.

## Untersuchte Hypothesen

- H1: example-mapping erhöht `verification_pct` deutlich gegenüber
  prose (Beispiele lösen Mehrdeutigkeiten direkt auf — beobachtet in
  RQ-1: 100 % vs 20–27 % auf claim-office unter v3 / v4).
- H2: user-story erhöht `verification_pct` gegenüber prose nur
  geringfügig — Stakeholder-Perspektive löst keine domain-internen
  Mehrdeutigkeiten auf.
- H3: Der example-mapping-Zugewinn ist über v3 / v4 / v5 hinweg
  ähnlich groß (Stil-Effekt workflow-unabhängig). Falls doch
  workflow-abhängig: v3 profitiert am stärksten, weil v3 weniger
  Disziplin-Skript hat und Beispiele als Test-Cases direkter übernimmt.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`model=opus-4-7-no-thinking`,
`workflow ∈ {v3-basic-tdd, v4-exact-subagents, v5-exact-single-context}`,
`kata=claim-office-{prose|example-mapping|user-story}`.

Aktuelle Datenbasis (Stand 2026-05-09): laufender
`claim-office-fill`-Batch füllt die meisten Zellen auf n=3. Die Zelle
`v4 × example-mapping × no-thinking` enthält bereits 1 Run; 2 weitere
müssen nachgezogen werden.
