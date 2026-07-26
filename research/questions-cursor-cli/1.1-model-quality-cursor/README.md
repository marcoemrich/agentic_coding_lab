---
id: RQ-model-quality-cursor
question: "Wie unterscheiden sich die via cursor-cli-Harness erreichbaren Modelle (Opus, Composer, Grok) in Code-Qualität und TDD-Disziplin auf game-of-life-example-mapping?"
factors:
  model:
    # Lab-Variant-IDs → cursor-agent --model (per Smoke-Run 2026-07-26 verifiziert,
    # resolved via system/init-Event). Baseline-Arm: no-thinking / vergleichbares
    # Effort-Level, soweit die Familie eine Effort-Achse hat.
    - opus-cursor         # → claude-opus-4-8-medium  ("Opus 4.8 300K Medium No Thinking")
    - composer-cursor     # → composer-2.5            ("Composer 2.5") — keine Effort-Achse
    - grok-cursor         # → cursor-grok-4.5-medium  ("Cursor Grok 4.5 Medium")
controls:
  workflow: v6.2.1-phase-continuation-cursor   # cursor-cli-Workflow (.cursor/-Marker), von v6.2.1-pi abgeleitet, Refactor inline
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primär: Code-Qualität (game-of-life trägt das Code-Qualitäts-Signal)
  - code_mass
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - lines_of_code
  - smell_total
  - smell_complexity
  - smell_magic_numbers
  - smell_duplication
  # sekundär: Korrektheit
  - verification_pct  # extern (game-of-life-verification)
  - tests_passing     # intern (vitest)
  - tests_total
  # tertiär: TDD-Disziplin
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # Kontext
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-model-quality-cursor: Modell-Effekt auf Code-Qualität (cursor-cli-Harness)

## Motivation

Mit cursor-cli (`cursor-agent`) als viertem Harness — nach Claude Code (native), OpenCode und pi (beide Requesty) — wird ein **dritter Routing-Pfad** erschlossen: der Cursor-eigene Model-Roster, auth via `CURSOR_API_KEY` über das Cursor-Abo. Das macht drei Modelle direkt vergleichbar, die auf diesem Pfad zusammenkommen: **Opus** (Anthropic-Anker, harness-übergreifend zu pi/OC/CC vergleichbar), **Composer** (Cursors eigenes Agenten-Modell) und **Grok**.

Diese RQ misst den **Modell-Effekt auf Code-Qualität und TDD-Disziplin** in einem harness-konstanten Setting (alle Zellen cursor-cli, gleicher Workflow, gleiche Kata). Sie ist das **direkte Pendant** zu RQ-model-quality (Claude-Code-Seite), RQ-model-quality-oc (OpenCode) und RQ-model-quality-pi (pi) — mit einem cursor-cli-Workflow. Der Workflow- und Routing-Unterschied muss bei Cross-Harness-Findings explizit benannt werden, KEIN 1:1-Transfer.

`game-of-life-example-mapping` als Kata: trägt das Code-Qualitäts-Signal (`smell_total`, `cognitive_max`, etc. differenzieren) und ist example-mapping-kompatibel. claim-office (Korrektheit als primärer Outcome) kann parallel in einer späteren RQ-model-novel-cursor untersucht werden.

## Harness-Status: einsatzbereit

**Stand 2026-07-26**: cursor-cli ist **vollständig in `run-batch.sh` verdrahtet und End-to-End verifiziert** (alle fünf Bausteine gebaut, Docker installiert `cursor-agent`, Smoke-Run game-of-life × `opus-cursor` sauber durch: cycle_count=9, refactorings=7, predictions 18/18, 9/9 Tests grün). Details in der [Subtree-README](../README.md#harness-status-walking-skeleton). Diese RQ ist **offen (n=0)** — Harness bereit, Fill-Batches ausstehend.

Vor dem Erstbatch:
0. **Auth (gelöst 2026-07-26)**: Headless braucht einen echten Dashboard-`CURSOR_API_KEY` (`crsr_…`), nicht den OAuth-Token. Im Container via `.env`/docker-compose setzen (analog `REQUESTY_API_KEY`). Details: [Subtree-README](../README.md#recherche-stand-cursor-agent-2026-07-26-smoke-run-durchgeführt).
1. **Modell-IDs (verifiziert)**: `opus-cursor`→`claude-opus-4-8-medium`, `composer-cursor`→`composer-2.5`, `grok-cursor`→`cursor-grok-4.5-medium`. In Baustein 4 (`run-batch.sh` case-mapping) verdrahten.
2. JSON-Event-Schema erfassen → `parse_cursor_transcript.py` bauen.
3. cursor-cli-Workflow (`.cursor/`-Marker, vier TDD-Marker aus `MARKERS.md`) anlegen und in `controls.workflow` eintragen.
4. Smoke-Test-Regel (Subtree-README): Opus-Run muss `cycle_count`/`predictions_* != null` liefern.

## Vorhandene Daten

- **Stand 2026-07-26**: Keine Runs. Harness noch nicht gebaut. Erstbatch komplett offen.

## Modell-Auswahl

Vom User gesetzt: **Opus, Composer, Grok** — der spezifische Reiz des cursor-cli-Pfads. Opus ist der harness-übergreifende Anker (Cross-Check gegen die Opus-Werte in RQ-model-quality-pi / -oc / CC: bleibt das Anthropic-Niveau über den Cursor-Routing-Pfad erhalten?). Composer ist Cursors eigenes Modell und auf keinem anderen Pfad erreichbar — der eigentliche Neuwert dieser RQ. Grok ergänzt einen dritten Anbieter-Familienzweig.

Pro Modell gilt wie bei pi/oc: Aufnahme, wenn der autonome TDD-Loop unter dem cursor-cli-Workflow sauber durchläuft und `src/` sowie ggf. `src/cli.ts` geschrieben werden. Modelle, die den Loop nicht zuverlässig zu Ende führen (Continuation-Drop, done.txt mit roten Tests), werden mit Begründung aus der RQ genommen und hier dokumentiert.

## Hypothesen

- **H1 (Anthropic-Anker über Cursor-Pfad)**: opus-cursor liefert Code-Qualität auf Anthropic-Niveau (niedrigstes `cognitive_max`/`smell_total`) und bestätigt, dass der cursor-cli-Routing-Pfad kein wertsenkender Confound ist. Cross-Check gegen Opus in RQ-model-quality-pi/-oc/CC. Wenn opus-cursor deutlich schlechter ist als Opus auf anderen Pfaden → Harness-/Routing-Artefakt, nicht Modell-Eigenschaft.
- **H2 (Composer als Unbekannte)**: composer-cursor ist auf keinem anderen Pfad messbar — diese RQ ist der erste Datenpunkt. Offen, ob es code-qualitativ mit Opus mithält oder eigene Profile zeigt (z.B. hoher Durchsatz, aber mehr Smells).
- **H3 (Modell-Spreizung)**: Über `smell_total` und `cognitive_max` zeigt sich eine messbare Spreizung zwischen Opus, Composer und Grok — d.h. der cursor-cli-Harness ist diskriminationsfähig genug, um Modell-Unterschiede sichtbar zu machen.
- **H4 (TDD-Marker-Compliance)**: `cycle_count` und `predictions_total` spreizen über die Modelle — manche nutzen die Workflow-Marker-Mechanik diszipliniert, andere driften. Niedriger cycle_count ist NICHT automatisch schwächere TDD-Disziplin, sondern auch Marker-/Skill-Compliance (parallel zum pi-/oc-Befund).

## Methodologische Anmerkungen

- **Eigener Tarif-Confound**: Kosten laufen über das Cursor-Abo, nicht über Requesty-Tarif (pi/OC) oder Anthropic-Listenpreis (CC). Bei `cost_usd`-Cross-Harness-Vergleichen explizit als Confound benennen.
- `n=5` per Zelle folgt Memory [[replicates-n-reliability]] (Default für mittleres Feld).
- TDD-Disziplin-Metriken (`cycle_count`, `predictions_*`, `refactorings_applied`) hängen davon ab, dass `parse_cursor_transcript.py` (Baustein 5) die vier Marker aus `MARKERS.md` korrekt erfasst. Vor dem ersten Batch verifizieren (Smoke-Test-Regel).
- Bei Findings unterscheiden: "Modell A hat höhere TDD-Disziplin" ≠ "Modell A nutzt den Marker-Pfad öfter".
