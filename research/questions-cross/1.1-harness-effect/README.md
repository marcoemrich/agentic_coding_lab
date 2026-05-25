---
id: RQ-harness
question: "Wie wirkt sich der Harness-Wechsel (Claude Code vs OpenCode) auf Korrektheit und Code-Qualität aus, wenn Modell, Workflow-Intention und Prompt-Stil konstant gehalten werden?"
factors:
  workflow:
    - v1-oneshot
    - v1-oneshot-oc
  kata_base:
    - game-of-life
    - claim-office
controls:
  model: opus-4-7-portkey
  prompt: prose
outcomes:
  # primär: Korrektheit (innen + außen)
  - tests_passing
  - tests_total
  - verification_pct
  - verification_passed
  # Code-Qualität
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # Kontext
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-harness: Harness-Effekt Claude Code vs OpenCode

## Motivation

OpenCode-Integration als zweiter Harness wirft sofort die Frage auf: läuft "derselbe Lauf" auf beiden Harnessen messbar anders? Beide haben unterschiedliche Subagent-/Skill-Konzepte, unterschiedliche Tool-Choreographie, unterschiedliche System-Prompt-Bibliotheken. Eine 1:1-Übersetzung von Workflows zwischen den Harnessen ist nicht möglich — aber bei v1-oneshot (keine TDD, keine Subagents, kein Skill-Tool) ist die Harness-Mechanik am wenigsten beteiligt, also die Vergleichbarkeit am größten.

Diese RQ misst den Harness-Effekt im **harness-mechanik-minimalsten Setting**: v1-oneshot vs v1-oneshot-oc, gleiches Modell (Opus 4.7 via Portkey-Vertex-EU, damit auch das Routing identisch), gleicher Prompt-Stil (prose), beide Katas (game-of-life für Code-Qualität, claim-office für Korrektheit).

## Routing-Konstanz (wichtiger Punkt)

`controls.model: opus-4-7-portkey` heißt: **beide Harnesse routen über Portkey-Vertex-EU**. Die CC-Seite läuft NICHT auf Direct-Anthropic-API, sondern auf demselben Portkey-Endpoint, damit der Harness-Effekt nicht mit einem Routing-Effekt konfundiert ist (siehe Memory [[opus-46-vs-47-not-equivalent]]).

`v1-oneshot` (CC) und `v1-oneshot-oc` (OC) sind aktuell beide auf `opus-4-7-portkey` testbar — keine Konfiguration im run-batch.sh nötig, weil das Modell schon in MODEL_CONFIGS gelistet ist und für beide Harnesse über `.env`'s ANTHROPIC_CUSTOM_HEADERS bzw. PORTKEY_API_KEY läuft.

## Vorhandene Daten

- **v1-oneshot-oc × opus-4-7-portkey × claim-office-prose**: n=2 (Skeleton-Smokes 2026-05-25).
- **v1-oneshot × opus-4-7-portkey × {claim-office, game-of-life}**: keine Runs (CC-v1-Pool hat opus-4-7 ohne Portkey-Routing, andere Konstellationen).
- **v1-oneshot-oc × opus-4-7-portkey × game-of-life-prose**: keine Runs.

Drei der vier Zellen sind offen, eine ist bei n=2.

## Hypothesen

- **H1 (Korrektheit harness-invariant)**: `tests_passing` und `verification_pct` zeigen keinen systematischen Harness-Unterschied bei konstantem Modell+Workflow-Intention — wenn doch, ist das ein starker Befund über Harness-Bias jenseits des System-Prompts.
- **H2 (Token-Profil differenziert)**: `total_tokens` und `duration_seconds` zeigen einen Harness-Unterschied — die System-Prompts und Default-Tool-Choreographie der beiden Harnesse sind unterschiedlich groß und führen zu meßbaren Effizienz-Unterschieden.
- **H3 (Code-Mass-Drift)**: `code_mass` und `cognitive_max` auf game-of-life zeigen eine harness-typische Stil-Tendenz (z.B. ein Harness produziert konsistent kompaktere/expansivere Implementations).

## Methodologische Anmerkungen

- **Übersetzungs-Confound**: Ein "Harness-Effekt" in dieser RQ ist immer auch ein **Prompt-Übersetzungs-Effekt**. v1-oneshot hat `.claude/rules/experiment-mode.md`; v1-oneshot-oc hat `.opencode/AGENTS.md`. Beide enthalten inhaltlich dasselbe ("kein TDD, direkt implementieren, schreibe experiment-done.txt"), aber jeder Text ist eine eigene Schreibe. Falls signifikante Unterschiede gefunden werden: vor der Interpretation die zwei Prompt-Files diff-en und überlegen, ob ein Wort-Choice-Drift den Befund erklärt.
- **Minimaler Harness-Footprint**: v1-oneshot wurde gewählt, weil es kein Skill/Subagent/Phase-Tool nutzt — also wenig Harness-spezifische Mechanik aktiviert. Ein RQ-harness auf v5-oc vs v5-cc (sobald v5-oc existiert) wäre der schärfere Test, weil dort die jeweiligen Subagent-/Skill-Konzepte aktiv werden.
- v1 liefert keine TDD-Disziplin-Metriken — diese Outcomes sind ausgeklammert.
