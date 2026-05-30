---
id: RQ-model-quality
question: "Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8 — jeweils mit/ohne Thinking) in der Code-Qualität auf einer trainingsbekannten Kata bei stärkstem Workflow?"
factors:
  model:
    - opus-4-8
    - opus-4-8-no-thinking
    - opus-4-7
    - opus-4-7-no-thinking
    - opus-4-6-portkey
    - opus-4-6-portkey-no-thinking
    - sonnet-4-6
    - sonnet-4-6-no-thinking
controls:
  workflow: v4-exact-subagents
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primär: Code-Qualität
  - code_mass
  - smell_total
  - cc_longest_function
  - cc_loc
  - mccabe_max
  - cognitive_max
  # sekundär: Korrektheit (innen + außen)
  - tests_passing
  - verification_pct
  - verification_passed
  - verification_total
  - completed_within_budget
  # Kontext
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-model-quality: Modell-Effekt auf Code-Qualität

Wie stark differenzieren sich die produktiv verfügbaren Modelle in der Code-Qualität, wenn Workflow und Kata kontrolliert sind?

## Motivation

Frühere Befunde (siehe `_archive/rqs-v1/RQ-3-model-and-thinking/`) zeigen ein Modell-Ranking auf Code-Qualität auf einem schwächeren Workflow-Setup. Diese RQ misst den Effekt **isoliert auf dem aktuell stärksten Workflow (v4-exact-subagents)** und vergleicht erstmals direkt Opus 4.6 ↔ Opus 4.7 ↔ Sonnet 4.6, jeweils mit und ohne Thinking. Korrektheit wird als Sanity-Check mitgemessen, ist aber nicht das Studienobjekt — sie wird bei diesen Modellen auf Game of Life als ≈ 100 % erwartet.

Haiku ist bewusst nicht enthalten: in bisherigen Läufen liegt Haiku regelmäßig unter 100 % Korrektheit auf Game of Life, was den Code-Qualitäts-Vergleich entwertet (Qualitätsmetriken sind nur auf korrektem Code aussagekräftig).

## Modelle

| Lab-Variant | Thinking | API-Route |
|---|---|---|
| opus-4-8 | Adaptiv (default) | Direct API |
| opus-4-8-no-thinking | Aus | Direct API |
| opus-4-7 | Adaptiv (default) | Direct API |
| opus-4-7-no-thinking | Aus | Direct API |
| opus-4-6-portkey | Extended (default) | Portkey Gateway |
| opus-4-6-portkey-no-thinking | Aus | Portkey Gateway |
| sonnet-4-6 | Extended (default) | Direct API |
| sonnet-4-6-no-thinking | Aus | Direct API |

**Batch-Hinweis**: Direct-API- und Portkey-Varianten **können nicht im selben Batch** laufen (unterschiedliche Konfiguration / Routing). `batch-plan-from-rq.py` erzeugt einen gemeinsamen Plan; beim Ausführen entweder zwei separate Plan-Files manuell aufteilen oder zwei aufeinanderfolgende `batch.sh`-Läufe fahren. Die `-portkey`-Suffix-Erkennung in `batch.sh` setzt den passenden Config-Dir automatisch — aber gemischte Plans laufen nicht.

## Warum v4-exact-subagents als Kontroll-Workflow?

v4-exact-subagents ist nach den bisherigen Befunden der stärkste Workflow für Code-Qualität auf Game of Life (isolierte Phasen-Kontexte, klare Red/Green/Refactor-Trennung). Eine reine Modellbewertung soll das Modell-Signal isolieren, daher wird der Workflow gepinnt — nicht als Faktor variiert. Eine spätere RQ kann Modell × Workflow-Interaktion adressieren.

## Warum Prompt = example-mapping fix?

RQ-prompt-known-kata hat empirisch gezeigt, dass der Prompt-Stil bei trainingsbekannten Katas (Game of Life) **keinen** belastbaren Effekt auf Code-Qualität hat (Opus und Sonnet stilunabhängig 100 % Korrektheit; Stil-Spread bei Qualitätsmetriken nicht über Modelle konsistent). Daher pinnen wir example-mapping und sparen den Faktor.

## Warum Game of Life?

- Trainingsbekannt → Korrektheit auf hohem Modell-Niveau verlässlich bei 100 %, d. h. Qualitäts-Vergleich operiert auf korrektem Code.
- Code-Qualitäts-Signal ist auf Game of Life nachweislich differenzierend (vgl. Methodologie-Constraints in README).
- Library-Form (`game-of-life-example-mapping`), keine CLI — keine CLI-Overhead-Anteile in den Qualitätsmetriken.

## Design

```
Faktor:    model      — 8 Stufen (4 Modelle × {thinking, no-thinking})
Kontrolle: workflow   — v4-exact-subagents
Kontrolle: kata_base  — game-of-life (+ prompt = example-mapping)

Zellen:    8
Replikate: n = 3
Runs:      24 total
```

## Hypothesen

- **H1** (Korrektheit-Sanity): `tests_passing` *und* `verification_pct` liegen für alle acht Modelle bei 100 % (3/3 pro Zelle). Eine Zelle mit < 100 % entwertet den Code-Qualitäts-Vergleich für dieses Modell oder weist auf eine Repräsentations-Adhärenz-Lücke hin.
- **H2** (Modell-Ranking Code-Qualität): Auf `code_mass`, `smell_total`, `cc_longest_function`, `mccabe_max`, `cognitive_max` zeigt sich ein konsistentes Ranking Opus 4.8 ≤ Opus 4.7 ≤ Opus 4.6 ≤ Sonnet 4.6 (kleiner = besser).
- **H3** (Thinking-Effekt): Innerhalb jedes Modells verbessert Thinking die Code-Qualität (niedrigeres `code_mass`, `cognitive_max`); der Effekt ist bei Opus stärker als bei Sonnet (vgl. F-3.x aus `_archive/rqs-v1/RQ-3-model-and-thinking/`).

**Falsifikation H2** (kein konsistentes Ranking über die Qualitäts-Outcomes): Modell-Effekt auf Code-Qualität ist auf v4 nicht stabil → andere Workflows könnten andere Modell-Rankings zeigen.

**Falsifikation H3** (Thinking-Effekt < Rauschen oder umgekehrt): Thinking wirkt auf v4 anders als auf älteren Workflow-Setups.

## Caveats

- **(a) Single workflow point**: Nur v4-exact-subagents. Keine Workflow-Generalisierung — Modell-Ranking könnte auf anderen Workflows abweichen.
- **(b) Single kata**: Nur Game of Life (Library-Form, example-mapping). Mars-rover als zweiter Code-Qualitäts-Carrier wäre eine sinnvolle Erweiterung, ist hier aber nicht enthalten.
- **(c) Opus 4.6 via Portkey, nicht Direct-API**: Die `opus-4-6-portkey*`-Varianten routen über Portkey. Findings sind nicht automatisch auf Direct-API-Opus-4.6 übertragbar (sollte dieser je verfügbar werden).
- **(d) Außen-Korrektheit via Modul-Import-Adapter**: `verification_pct` wird über `experiments/katas/game-of-life-verification/` gemessen — der Adapter importiert die `evolve`-Funktion direkt aus `src/game-of-life.{ts,…}` und ruft sie pro Szenario `steps` mal auf. Kein CLI-Vertrag nötig, daher keine CLI-Overhead-Anteile in den Code-Qualitäts-Metriken. Der Adapter erwartet allerdings die Repräsentation `Cell[]` mit `Cell = [number, number]` (Tupel-Array). Andere reasonable Repräsentationen (`boolean[][]`, `Set<string>`, `{x,y}[]`) sind durch die Kata nicht ausgeschlossen, scheitern aber an dieser Adapter-Konvention — das ist als Repräsentations-Adhärenz-Signal beabsichtigt.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow=v4-exact-subagents`,
`kata=game-of-life-example-mapping`,
Modell ∈ {opus-4-7, opus-4-7-no-thinking, opus-4-6-portkey, opus-4-6-portkey-no-thinking, sonnet-4-6, sonnet-4-6-no-thinking}.
