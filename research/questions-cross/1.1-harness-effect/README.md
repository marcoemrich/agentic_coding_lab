---
id: RQ-harness
question: "Wie wirkt sich der Harness-Wechsel (Claude Code vs OpenCode) auf Korrektheit, Code-Qualität und TDD-Disziplin aus, wenn Modell, Workflow-Intention und Prompt-Stil konstant gehalten werden?"
factors:
  workflow:
    - v6.2-with-why-cleaned
    - v6.2-with-why-cleaned-oc
  kata_base:
    - claim-office
    - game-of-life
controls:
  model: opus-4-7-portkey-no-thinking
  prompt: example-mapping
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
  # TDD-Disziplin (nur v6.2-Zellen)
  - cycle_count
  - predictions_correct_rate
  - refactorings_applied
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

Diese RQ misst den Harness-Effekt auf **zwei Ebenen der Harness-Mechanik**:

1. **Minimal-Footprint** (v1-oneshot vs v1-oneshot-oc): Kein TDD, keine Subagents, keine Phase-Tools — der Harness-Effekt ist hier am saubersten zu isolieren.
2. **Voller TDD-Mechanik** (v6.2-with-why-cleaned vs v6.2-with-why-cleaned-oc): Skills + Subagent, Prediction-Marker, Refactor-Isolation — hier werden die Harness-spezifischen Mechaniken aktiv, und der Effekt müsste größer ausfallen.

Gleiches Modell (Opus 4.7 via Portkey-Vertex-EU, damit auch das Routing identisch), gleicher Prompt-Stil (prose), beide Katas (game-of-life für Code-Qualität, claim-office für Korrektheit).

## Routing-Konstanz (wichtiger Punkt)

`controls.model: opus-4-7-portkey-no-thinking` heißt: **beide Harnesse routen über Portkey-Vertex-EU**, mit deaktiviertem Thinking. Die CC-Seite läuft NICHT auf Direct-Anthropic-API, sondern auf demselben Portkey-Endpoint, damit der Harness-Effekt nicht mit einem Routing-Effekt konfundiert ist (siehe Memory [[opus-46-vs-47-not-equivalent]]).

Thinking ist deaktiviert, weil (a) die existierende CC-Run-Basis (n=8 auf claim-office, n=9 auf game-of-life) schon auf no-thinking läuft und ohne Refill weiterverwendet werden kann; (b) ein erster Thinking-Smoke (n=3 pro Zelle) einen Claude-Code-Harness-Glitch ("premature end_turn") gezeigt hat, der separat zu untersuchen ist; (c) Thinking für eine Harness-Vergleichs-RQ keine erkennbare Hebelwirkung hat.

Alle vier Workflows sind auf `opus-4-7-portkey-no-thinking` testbar — keine Konfiguration im run-batch.sh nötig, weil das Modell schon in MODEL_CONFIGS gelistet ist und für beide Harnesse über `.env`'s ANTHROPIC_CUSTOM_HEADERS bzw. PORTKEY_API_KEY läuft.

## Workflow-Paarungen

| CC-Workflow | OC-Workflow | Mechanik | TDD-Metriken? |
|---|---|---|---|
| v1-oneshot | v1-oneshot-oc | Keine Skills, keine Subagents | Nein |
| v6.2-with-why-cleaned | v6.2-with-why-cleaned-oc | Skills (test-list/red/green) + Subagent (refactor) | Ja |

v6.2-with-why-cleaned-oc ist eine strukturgleiche Übersetzung: test-list/red/green als Skills (shared context), Refactor als Subagent (isolated context), gleiche Marker-Konventionen, gleiche Why-Blocks in Green. Der einzige Unterschied ist die Harness-Syntax (`.claude/commands/` → `.opencode/skills/`, `.claude/agents/` → `.opencode/agents/`, `Skill` → `skill`, `Task` → `task`).

## Vorhandene Daten

- **v1-oneshot-oc × opus-4-7-portkey × claim-office-prose**: n=2 (Skeleton-Smokes 2026-05-25).
- **v1-oneshot × opus-4-7-portkey × {claim-office, game-of-life}**: keine Runs.
- **v1-oneshot-oc × opus-4-7-portkey × game-of-life-prose**: keine Runs.
- **v6.2-with-why-cleaned × opus-4-7-portkey × prose**: keine Runs.
- **v6.2-with-why-cleaned-oc × opus-4-7-portkey × prose**: keine Runs.

Sieben der acht Zellen sind offen, eine ist bei n=2.

## Hypothesen

- **H1 (Korrektheit harness-invariant)**: `tests_passing` und `verification_pct` zeigen keinen systematischen Harness-Unterschied bei konstantem Modell+Workflow-Intention — wenn doch, ist das ein starker Befund über Harness-Bias jenseits des System-Prompts.
- **H2 (Token-Profil differenziert)**: `total_tokens` und `duration_seconds` zeigen einen Harness-Unterschied — die System-Prompts und Default-Tool-Choreographie der beiden Harnesse sind unterschiedlich groß und führen zu meßbaren Effizienz-Unterschieden.
- **H3 (Code-Mass-Drift)**: `code_mass` und `cognitive_max` auf game-of-life zeigen eine harness-typische Stil-Tendenz (z.B. ein Harness produziert konsistent kompaktere/expansivere Implementations).
- **H4 (TDD-Disziplin harness-invariant)**: `cycle_count`, `predictions_correct_rate` und `refactorings_applied` in den v6.2-Zellen zeigen keinen systematischen Harness-Unterschied — die Marker-Konventionen sind strukturgleich übersetzt, und der Metrik-Parser (bzw. `parse_opencode_transcript.py` mit Task-Erkennung) zählt dieselben Ereignisse.

## Methodologische Anmerkungen

- **Übersetzungs-Confound**: Ein "Harness-Effekt" in dieser RQ ist immer auch ein **Prompt-Übersetzungs-Effekt**. v1-oneshot hat `.claude/rules/experiment-mode.md`; v1-oneshot-oc hat `.opencode/AGENTS.md`. v6.2 hat `.claude/commands/*.md` + `.claude/agents/refactor.md` + `.claude/rules/tdd.md`; v6.2-oc hat `.opencode/skills/*/SKILL.md` + `.opencode/agents/refactor.md` + `.opencode/AGENTS.md`. Beide Paare enthalten inhaltlich dasselbe, aber jeder Text ist eine eigene Schreibe. Falls signifikante Unterschiede gefunden werden: vor der Interpretation die Prompt-Files diff-en und überlegen, ob ein Wort-Choice-Drift den Befund erklärt.
- **Zwei Ebenen der Harness-Mechanik**: v1-oneshot nutzt kein Skill/Subagent/Phase-Tool — der Harness-Effekt ist dort minimal. v6.2 nutzt Skills + Subagent — dort ist die Harness-Mechanik voll aktiv, und ein größerer Effekt wäre erwartbar. Der Vergleich der beiden Ebenen ist selbst ein Befund: wenn der Harness-Effekt bei v1 null ist aber bei v6.2 signifikant, dann wirkt der Harness über seine Mechanik, nicht über seinen Baseline-System-Prompt.
- **Subagent-Erkennung im OC-Parser**: `parse_opencode_transcript.py` wurde erweitert, um `task` tool calls mit TDD-relevantem `description`/`subagent_type` (z.B. `"refactor"`) als äquivalente Skill-Invocation zu zählen. Dadurch bleibt `refactorings_applied` auch bei der v6.2-oc Hybrid-Architektur messbar. Caveat: die Heuristik basiert auf String-Matching im `description`-Feld; falls OpenCode das Feld anders abbildet als erwartet, müsste der Parser nach einem Smoke-Run angepasst werden.
- **TDD-Disziplin-Metriken nur für v6.2-Zellen**: v1-oneshot liefert keine TDD-Disziplin-Metriken — `cycle_count`, `predictions_correct_rate` und `refactorings_applied` sind dort 0/null. Die H4-Hypothese bezieht sich ausschließlich auf den v6.2-Vergleich.
