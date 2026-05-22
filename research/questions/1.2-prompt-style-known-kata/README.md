---
id: RQ-2
question: "Beeinflusst der Prompt-Stil (prose/user-story/example-mapping) bei einer trainingsbekannten Kata (Game of Life) Korrektheit und Code-Qualität — und ist dieser Effekt modellabhängig?"
factors:
  prompt: [prose, user-story, example-mapping]
  model:
    - opus-4-6-portkey-no-thinking
    - sonnet-4-6-portkey-no-thinking
    - haiku-4-5-portkey-no-thinking
controls:
  workflow: v5-exact-single-context
  kata_base: game-of-life-cli
outcomes:
  - verification_pct
  - verification_passed
  - verification_total
  - tests_passing
  - completed_within_budget
  - cli_built
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-2: Prompt-Stil-Effekt bei trainingsbekannter Kata

Beeinflusst der Prompt-Stil bei einer trainingsbekannten Kata (Game of Life) Korrektheit *und* Code-Qualität — und ist der Effekt modellabhängig?

## Motivation

RQ-1 misst den Prompt-Stil-Effekt auf einer domain-novel Kata (claim-office) und prognostiziert in ihrer Sektion "Warum nicht game-of-life?", dass Stile auf trainingsbekannten Katas in Korrektheit *nicht messbar differenzieren*, weil das Modell-Vorwissen die Stil-Unterschiede überschreibt. RQ-2 prüft diese Prognose empirisch und erweitert sie um die Code-Qualitäts-Dimension.

Das Ergebnis hat Konsequenzen für alle späteren Code-Qualitäts-RQs auf Game of Life:

- **Bestätigt** (kein Stil-Effekt) → spätere Code-Qualitäts-RQs können auf einen Stil fixieren und sparen den Faktor.
- **Widerlegt** (Stil-Effekt sichtbar) → Stil muss als Faktor in allen Code-Qualitäts-RQs mitlaufen, sonst Confound.

## Prompt-Stile

| Stil | Beschreibung |
|---|---|
| **prose** | Beschreibung der Regeln in Fließtext, keine Beispiele. |
| **user-story** | "Als X möchte ich Y, damit Z" — Stakeholder-Perspektive plus Akzeptanzkriterien ohne Zahlbeispiele. |
| **example-mapping** | Regel + 1–2 konkrete Schema-Beispiele, die das I/O-Format demonstrieren. |

Konfiguration: `experiments/katas/game-of-life-cli-{prose,user-story,example-mapping}/prompt.md`. Alle drei sind inhalts-äquivalent (gleiche Regeln, gleicher I/O-Vertrag, gleiche Constraints), unterscheiden sich nur in der Präsentationsform.

## Modelle

| Modell | Thinking | API-Route |
|---|---|---|
| opus-4-6-portkey-no-thinking | Aus | Portkey Gateway |
| sonnet-4-6-portkey-no-thinking | Aus | Portkey Gateway |
| haiku-4-5-portkey-no-thinking | Aus | Portkey Gateway |

Alle Modelle laufen über Portkey (rate-limit-frei). Thinking ist durchgehend aus, um den Prompt-Stil-Effekt nicht mit dem Thinking-Effekt zu vermischen (siehe Caveat unten).

## Warum v5 als Kontroll-Workflow?

Konsistent mit RQ-1: v5-exact-single-context liefert das sauberste Signal (kein Phase-Handoff, kein State-Verlust), sodass beobachtete Varianz auf Stil und/oder Modell zurückführbar ist, nicht auf den Workflow. Details siehe RQ-1.

## Warum game-of-life-cli?

### Trainingsbekannte Kata mit messbarer externer Korrektheit

Conway's Game of Life ist im Trainingsmaterial allgegenwärtig — das ist der Punkt. Die Hypothese "Stile differenzieren nicht bei trainingsbekannten Katas" lässt sich nur prüfen, wenn die Kata tatsächlich im Vorwissen vorhanden ist.

Die bestehenden GOL-Katas (`game-of-life-{prose,user-story,example-mapping}`) sind Library-only (eine Funktion, vitest-Tests). Sie liefern nur die *innere* Korrektheits-Sicht (`tests_passing`) — der Agent schreibt sich seine eigenen Tests. Für eine *äußere* Korrektheits-Sicht (verification gegen eine fixe Akzeptanz-Suite) braucht es ein CLI-Interface, das wir für RQ-2 als neue Kata-Familie hinzufügen: `game-of-life-cli-{prose,user-story,example-mapping}`.

### Externe Verifikations-Suite

`experiments/katas/game-of-life-cli-verification/` enthält 15 Szenarien (Stills, Oscillators Periode 2, Glider, Halbphasen, negative Koordinaten, leeres Grid, `steps:0`-Identität). Der Agent sieht diese Suite nie. `analyze-run.sh` pipet jedes Szenario in den vom Agenten gebauten `src/cli.ts` und vergleicht canonical via `jq -S` mit der erwarteten Ausgabe. `verification_pct` (0.0–1.0) ist der Anteil bestandener Szenarien.

## Design

```
Faktor 1:  prompt        — 3 Stufen (prose, user-story, example-mapping)
Faktor 2:  model         — 3 Stufen (opus-4-6 / sonnet-4-6 / haiku-4-5, alle Portkey, alle no-thinking)
Kontrolle: workflow      — v5-exact-single-context
Kontrolle: kata_base     — game-of-life-cli

Zellen:    3 × 3 = 9
Replikate: n = 3
Runs:      27 total
```

## Hypothesen

- **H1** (Korrektheit): Pro Modell ist der Spread von `verification_pct` zwischen den drei Stilen geringer als 10 Prozentpunkte — die Kata ist im Trainingsmaterial bekannt, Stil-Unterschiede werden vom Vorwissen kompensiert.
- **H2** (Code-Qualität): Es existiert kein konsistentes Stil-Ranking auf `code_mass`, `smell_total`, `cc_longest_function`, `mccabe_max`, `cognitive_max`, das modellübergreifend stabil ist — Stil-induzierte Qualitäts-Variation ist Rauschen auf bekannter Kata.
- **H3** (Modell-Ranking): `code_mass` und Komplexitäts-Outcomes folgen weiterhin dem Modell-Ranking Opus < Sonnet < Haiku (vgl. F-3.1 in `_archive/rqs-v1/RQ-3-model-and-thinking/findings.md`), unabhängig vom Prompt-Stil.

- **H4** (Mehrdeutigkeits-Hypothese): Bei trainingsbekannten Katas greift der Example-Mapping-Vorteil nicht, weil keine domänenspezifischen Mehrdeutigkeiten vorhanden sind, die durch Beispiele aufgelöst werden müssten. Stattdessen können konkrete Beispiele das trainierte Pattern (Library-Form) so stark aktivieren, dass der tatsächliche Task-Vertrag (CLI) verdrängt wird — example-mapping wird *kontraproduktiv*. Dieses Phänomen tritt bei domain-novel Katas (claim-office) nicht auf, weil dort kein konkurrierendes Vorwissen existiert.

**Falsifikation H1** (≥1 Modell zeigt ≥10 pp Spread): Stil-Effekt auch bei trainingsbekannter Kata vorhanden → Code-Qualitäts-RQs müssen Stil als Faktor führen, nicht kontrollieren.

**Falsifikation H2** (mindestens ein Code-Qualitäts-Outcome zeigt ein modellübergreifend konsistentes Stil-Ranking): Stil beeinflusst Qualität auch wenn nicht Korrektheit → noch stärkere Implikation für Code-Qualitäts-RQs.

**Falsifikation H4** (example-mapping verbessert Korrektheit auch auf trainingsbekannter Kata): Das Vorwissen-Verdrängungsmodell greift nicht → Beispiele helfen universell, nicht nur bei Mehrdeutigkeit.

## Caveats

- **(a) Thinking aus**: Findings gelten nur für No-Thinking-Modus. Mit Thinking könnten sich Korrektheits- oder Qualitäts-Ergebnisse verschieben — insbesondere bei Opus zeigt sich aus RQ-3-v1 ein deutlicher Thinking-Effekt auf Code-Qualität (cognitive_max −42 %). Eine separate RQ wäre für die Thinking-Dimension nötig.
- **(b) Opus 4.6 via Portkey, nicht 4.7**: Die `*-portkey`-Varianten routen Opus 4.6. Findings über `opus-4-6-portkey-no-thinking` sind *nicht* automatisch auf Opus 4.7 oder Direct-API-Opus-4.6 übertragbar.
- **(c) CLI-Overhead-Bias**: Die `game-of-life-cli-*`-Kata pinnt JSON-IO + Dispatcher in `src/cli.ts`. Code-Qualitäts-Metriken (`code_mass`, `smell_total`, `cc_*`, `mccabe_*`, `cognitive_*`) enthalten einen CLI-Overhead-Anteil, den die existierende Library-Variante `game-of-life-*` nicht hat. Cross-Kata-Vergleiche zwischen `game-of-life-cli-*` und `game-of-life-*` bei Code-Qualität sind daher nicht direkt gültig. Innerhalb von RQ-2 (Variation nur über prompt × model) ist der Bias über alle Zellen konstant und stört den Stil-Vergleich nicht.
- **(d) Single workflow point**: v5-exact-single-context als alleiniger Workflow. Keine Workflow-Generalisierung — andere Workflows könnten andere Stil-Effekte erzeugen.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow=v5-exact-single-context`,
`kata=game-of-life-cli-{prose|user-story|example-mapping}`,
Modell ∈ {opus-4-6-portkey-no-thinking, sonnet-4-6-portkey-no-thinking, haiku-4-5-portkey-no-thinking}.
