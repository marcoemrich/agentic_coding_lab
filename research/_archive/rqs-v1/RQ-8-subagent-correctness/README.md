---
id: RQ-8
question: "Ist v4 (Subagent-pro-Phase) weniger korrekt als v5 (Single-Context), und unter welchen Umständen?"
factors:
  workflow: [v4-exact-subagents, v5-exact-single-context]
  kata_base: [claim-office, game-of-life]
  model: [opus-4-7, opus-4-7-no-thinking]
controls:
  prompt: example-mapping
outcomes:
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - cli_built
min_replicates: 5
status: aktiv
---

# RQ-8: Subagent-Korrektheits-Kosten

RQ-7 zeigt einen drei-achsigen Trade-off (Struktur × Korrektheit × Zeit)
zwischen v4 und v5. Die Korrektheits-Achse ist dort eine von mehreren
Hypothesen, die statistische Tiefe der Aussage ist begrenzt
(min_replicates=3, single-thinking-Konfiguration).

RQ-8 konzentriert sich **nur** auf die Korrektheits-Achse und fragt
sie systematisch ab: Ist v4 tatsächlich weniger korrekt als v5, oder
ist die Streuung in den bisherigen Daten ein Artefakt kleiner
Stichproben? Wenn v4 weniger korrekt ist — auf welchen Konfigurationen
und in welcher Größenordnung?

## Forschungsmotivation

Korrektheit ist für die Trade-off-Bewertung von Subagent-Topologien ein
KO-Kriterium: Code-Qualitäts-Vorteile sind irrelevant, wenn der Code
nicht funktioniert. Die bisherigen Daten sind suggestiv, aber dünn:

| Zelle | n | Korrektheit-Profil |
|---|---|---|
| claim-office × v4 × no-thinking | 5 | 0.71 mean, Ausreißer 0.33 + 0.27 |
| claim-office × v5 × no-thinking | 3 | 1.00 konstant |
| claim-office × v4 × thinking | 4 | 0.43 mean, 2× 0% Total-Ausfall |
| game-of-life × v4 × no-thinking | 3 | 100% (tests_passing) |
| game-of-life × v5 × no-thinking | 13 | 100% (tests_passing) |

Die Frage ist:
- **Persistiert das claim-office-v4-Defizit** bei n=5 pro Zelle, oder
  sind die einzelnen Ausreißer-Runs Mess-Rauschen?
- **Ist Thinking ein Verstärker** der v4-Instabilität, oder zufällig?
- **Ist game-of-life-Robustheit** real, oder Stichproben-Artefakt
  (n=3 v4 gegen n=13 v5)?

## Design

**Faktoren (3-fach):** workflow × kata_base × model-thinking-Variante
= 2 × 2 × 2 = 8 Zellen × n=5 = 40 Runs

(Konvention im Repo: `model` enthält die Thinking-Variante als Suffix
— `opus-4-7` für Thinking-an, `opus-4-7-no-thinking` für Thinking-aus.
Daher matcht hier `model` zwei Werte statt eines getrennten
`thinking`-Faktors.)

**Höhere min_replicates (n=5)** als Repo-Standard (n=3): bei v4 sind
einzelne 0%-Ausreißer Teil des realen Verhaltens (Subagent-Lotterie),
keine Mess-Fehler. n=5 sorgt dafür, dass ein Ausreißer 20% des Mittels
gewichtet statt 33% — der Mittelwert bleibt aussagekräftig, ohne dass
einzelne Pech-Runs ihn dominieren.

**Modell auf Opus fixiert (beide Thinking-Varianten):** kleinere
Modelle sind auf claim-office-v4 ohnehin unbrauchbar (Haiku 0/7,
Sonnet 0/1 in bestehenden Daten). Auf Opus existieren beide Outcomes
— Erfolg und Ausfall — und damit ist hier die einzige Konfiguration,
in der die Frage "wann scheitert v4" überhaupt sinnvoll messbar ist.
Beide Thinking-Modi werden untersucht, weil aktuelle Daten suggerieren,
dass Thinking v4-Instabilität verstärkt (siehe H3).

**Prompt = example-mapping:** wie in RQ-7, vergleichbarste
Konfiguration für TDD-Workflows.

## Untersuchte Hypothesen

- **H1 (Hauptfrage):** Auf identischer Kata × Thinking-Konfiguration
  hat v4 ein niedrigeres mittleres `verification_pct` als v5.
  **Operationalisierung:** Per Zelle Mittelwert ± Streuung berichten,
  Differenz v5 − v4 als Effektstärke. Bei game-of-life (Vitest-only):
  `tests_passing`-Rate.

- **H2 (Kata-Moderation):** Der Korrektheits-Verlust von v4 ist auf
  claim-office größer als auf game-of-life. Plausibler Mechanismus:
  claim-office hat zwei Operationen mit Shared State, der zwischen
  Subagent-Phasen rekonstruiert werden muss; game-of-life hat eine
  zustandslose pure-function-Implementation, weniger
  Re-Establishment-Aufwand.
  **Operationalisierung:** (v5 − v4) auf claim-office vs. (v5 − v4)
  auf game-of-life vergleichen.

- **H3 (Thinking-Moderation):** Thinking verstärkt v4-Instabilität
  statt sie zu mildern. Plausibler Mechanismus: Thinking-Tokens addieren
  weitere Kontext-Last zum ohnehin frischen Subagent-Kontext, was zu
  inkonsistenten Strategie-Entscheidungen pro Phase führt. Aktuelle
  Daten claim-office: v4-thinking 0.43 (2× 0%) vs. v4-no-thinking 0.78
  (kein Total-Ausfall). Erwartung: bei n=5 bleibt thinking schlechter
  oder gleich, nicht besser.
  **Operationalisierung:** v4-thinking vs. v4-no-thinking pro Kata
  vergleichen.

- **H4 (Streuung als Korrektheits-Signal):** v4 zeigt höhere
  Standardabweichung von `verification_pct` über Replikate als v5.
  Insbesondere zeigt v4 binäre Outcomes (0% oder 100%, selten
  dazwischen), v5 zeigt enge Streuung um einen hohen Mittelwert.
  **Operationalisierung:** σ pro Zelle berichten, plus Histogramm der
  Einzelwerte (insbesondere: Anzahl 0%-Runs pro Zelle).

## Datenquelle

Alle Runs in `experiments/runs/` mit:
- `workflow ∈ {v4-exact-subagents, v5-exact-single-context}`
- `prompt = example-mapping`
- `model ∈ {opus-4-7, opus-4-7-no-thinking}`
- `kata ∈ {claim-office-example-mapping, game-of-life-example-mapping}`

Aktuelle Coverage prüfen via `aggregate-by-query.py`. Lücken füllen
über `batch-plan-from-rq.py`.

## Findings

Siehe [findings.md](findings.md).

## Abgrenzung zu anderen RQs

- **RQ-7 (Subagent-Effekt)**: misst alle Outcomes (Quality + Korrektheit
  + Zeit) als Trade-off, single-thinking, n=3. RQ-8 fokussiert nur
  Korrektheit, beide thinking-Modi, n=5 — schärfere Aussage auf einer
  Achse.
- **RQ-3 (Modell + Thinking)**: misst Thinking-Effekt über Modelle
  hinweg, alle Workflows. RQ-8 ist enger: Thinking nur als Moderator
  der v4/v5-Differenz auf Opus.
- **RQ-5 (Run-Stabilität)**: misst σ über alle Workflow×Prompt-Zellen.
  RQ-8-H4 ist eine Anwendung dieses Stabilitäts-Begriffs spezifisch
  auf Korrektheit und nur auf v4 vs. v5.
