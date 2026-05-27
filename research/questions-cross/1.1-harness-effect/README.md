---
id: RQ-harness
question: "Wie wirkt sich der Harness-Wechsel (Claude Code vs OpenCode vs pi) auf Korrektheit, Code-Qualität und TDD-Disziplin aus, wenn Modell, Workflow-Intention und Prompt-Stil konstant gehalten werden?"
factors:
  workflow:
    - v6.2-with-why-cleaned
    - v6.2-with-why-cleaned-oc
    - v6.2-with-why-cleaned-pi
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
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-harness: Harness-Effekt Claude Code vs OpenCode vs pi

## Motivation

OpenCode- und pi-Integration als zweiter und dritter Harness werfen sofort die Frage auf: läuft "derselbe Lauf" auf allen drei Harnessen messbar anders? Alle drei haben unterschiedliche Subagent-/Skill-Konzepte, unterschiedliche Tool-Choreographie, unterschiedliche System-Prompt-Bibliotheken. Eine 1:1-Übersetzung von Workflows zwischen den Harnessen ist nicht möglich.

Diese RQ misst den Harness-Effekt bei voller TDD-Mechanik: v6.2-with-why-cleaned (CC) vs v6.2-with-why-cleaned-oc (OC) vs v6.2-with-why-cleaned-pi (pi). Skills + Subagent, Prediction-Marker, Refactor-Isolation — die harness-spezifischen Mechaniken sind aktiv, und der Effekt müsste maximal beobachtbar sein.

v1-oneshot-Varianten waren Walking-Skeleton-Material für die Harness-Integration und sind in dieser RQ bewusst NICHT enthalten — sie sagen wenig über den interessanten Fall (volle TDD-Mechanik) aus und liefen nur in prose.

Gleiches Modell (Opus 4.7 via Portkey-Vertex-EU, damit auch das Routing identisch), gleicher Prompt-Stil (example-mapping), beide Katas (game-of-life für Code-Qualität, claim-office für Korrektheit).

## Routing-Konstanz (wichtiger Punkt)

`controls.model: opus-4-7-portkey-no-thinking` heißt: **beide Harnesse routen über Portkey-Vertex-EU**, mit deaktiviertem Thinking. Die CC-Seite läuft NICHT auf Direct-Anthropic-API, sondern auf demselben Portkey-Endpoint, damit der Harness-Effekt nicht mit einem Routing-Effekt konfundiert ist (siehe Memory [[opus-46-vs-47-not-equivalent]]).

Thinking ist deaktiviert, weil (a) die existierende CC-Run-Basis (n=8 auf claim-office, n=9 auf game-of-life) schon auf no-thinking läuft und ohne Refill weiterverwendet werden kann; (b) ein erster Thinking-Smoke (n=3 pro Zelle) einen Claude-Code-Harness-Glitch ("premature end_turn") gezeigt hat, der separat zu untersuchen ist; (c) Thinking für eine Harness-Vergleichs-RQ keine erkennbare Hebelwirkung hat.

Alle drei Workflows sind auf `opus-4-7-portkey-no-thinking` testbar — keine Konfiguration im run-batch.sh nötig, weil das Modell schon in MODEL_CONFIGS gelistet ist und alle drei Harnesse über `.env`'s ANTHROPIC_CUSTOM_HEADERS bzw. PORTKEY_API_KEY laufen.

## Workflow-Tripel

| CC-Workflow | OC-Workflow | pi-Workflow | Mechanik | TDD-Metriken? |
|---|---|---|---|---|
| v6.2-with-why-cleaned | v6.2-with-why-cleaned-oc | v6.2-with-why-cleaned-pi | Skills (test-list/red/green) + Subagent (refactor) | Ja |

v6.2-with-why-cleaned-oc und -pi sind strukturgleiche Übersetzungen: test-list/red/green als Skills (shared context), Refactor als Subagent (isolated context), gleiche Marker-Konventionen, gleiche Why-Blocks in Green. Die Unterschiede sind nur die Harness-Syntax:

- **CC**: `.claude/commands/<name>.md` + `.claude/agents/refactor.md`, Tools `Skill` und `Task`
- **OC**: `.opencode/skills/<name>/SKILL.md` + `.opencode/agents/refactor.md`, Tools `skill` und `task`
- **pi**: `.pi/skills/<name>/SKILL.md` + `.pi/agents/refactor.md`. Tool `subagent` (via vendored extension) für Refactor. **Skills sind in pi Auto-Load-Dokumente, keine Tool-Calls** — das Modell liest SKILL.md einmalig und arbeitet dann freihand. Pi-Workflows müssen darum in AGENTS.md **Pflicht-Output-Marker** (`## Red`, `## Green`, `Red Phase Complete:` + Prediction-Lines) erzwingen, die der Parser zählt. Siehe `experiments/workflows/MARKERS.md`.

## Vorhandene Daten

Keine — alle bisherigen Smokes liefen auf prose; diese RQ läuft auf example-mapping. Skeleton-Smokes (v1-oneshot-*, v6.2-pi prose) verbleiben im Pool als historische Artefakte, zählen aber nicht für den Selector.

6 Zellen (3 Workflows × 2 Katas), 5 Replikate Ziel → 30 Runs voll von neu.

## Hypothesen

- **H1 (Korrektheit harness-invariant)**: `tests_passing` und `verification_pct` zeigen keinen systematischen Harness-Unterschied bei konstantem Modell+Workflow-Intention — wenn doch, ist das ein starker Befund über Harness-Bias jenseits des System-Prompts.
- **H2 (Token-Profil differenziert)**: `total_tokens` und `duration_seconds` zeigen einen Harness-Unterschied — die System-Prompts und Default-Tool-Choreographie der drei Harnesse sind unterschiedlich groß und führen zu meßbaren Effizienz-Unterschieden. **Vorbedingung für H2-Interpretation**: Pi-Workflows tragen wegen der Marker-Pflicht in AGENTS.md eine strukturelle Token-Mehrlast (siehe Anmerkungen unten); die ist *Teil* des Harness-Effekts, aber im Diff erkennbar zu halten.
- **H3 (Code-Mass-Drift)**: `code_mass` und `cognitive_max` auf game-of-life zeigen eine harness-typische Stil-Tendenz (z.B. ein Harness produziert konsistent kompaktere/expansivere Implementations).
- **H4 (TDD-Disziplin harness-invariant)**: `cycle_count`, `predictions_correct_rate` und `refactorings_applied` in den v6.2-Zellen zeigen keinen systematischen Harness-Unterschied — die Marker-Konventionen sind strukturgleich übersetzt, und die Parser (`parse_opencode_transcript.py` mit Task-Erkennung, `parse_pi_transcript.py` mit Text-Marker-Fallback) zählen dieselben Ereignisse über alle drei Harnesse.

## Methodologische Anmerkungen

- **Übersetzungs-Confound**: Ein "Harness-Effekt" in dieser RQ ist immer auch ein **Prompt-Übersetzungs-Effekt**. v6.2 hat `.claude/commands/*.md` + `.claude/agents/refactor.md` + `.claude/rules/tdd.md`; v6.2-oc und v6.2-pi haben jeweils ihre `skills/*/SKILL.md` + `agents/refactor.md` + `AGENTS.md`. Alle drei Tripel enthalten inhaltlich dasselbe, aber jede Datei ist eine eigene Schreibe. Falls signifikante Unterschiede gefunden werden: vor der Interpretation die Prompt-Files diff-en und überlegen, ob ein Wort-Choice-Drift den Befund erklärt.
- **Subagent-Erkennung im OC-Parser**: `parse_opencode_transcript.py` wurde erweitert, um `task` tool calls mit TDD-relevantem `description`/`subagent_type` (z.B. `"refactor"`) als äquivalente Skill-Invocation zu zählen.
- **Skill- und Refactor-Erkennung im pi-Parser**: pi-Skills sind Auto-Load-Dokumente, keine Tool-Calls. `parse_pi_transcript.py` zählt darum `## Red`/`## Green`/`## Test List`-Marker in Assistant-Texten als Phasen, und `subagent`-Tool-Calls mit `agent: "refactor"` als Refactorings. Mandatory-Output-Marker stehen in der jeweiligen AGENTS.md. Wenn die Marker im Modell-Output fehlen, fällt `cycle_count` still auf 0 — Spot-Check pro Run vor Aggregation (siehe [[silent-zero-metric-bugs]]). Re-Smoke 2026-05-26 hat cycle_count=29 (=tests_total) und predictions_total=59 produziert, also funktioniert die Marker-Disziplin auf Opus 4.7. Vor jedem neuen Modell auf pi: erst Smoke, dann fillen.
- **Marker-Disziplin kostet Tokens**: Der v6.2-pi Re-Smoke unter Pflicht-Markern hat 40 % mehr Tokens und 21 % mehr Wallclock verbraucht als der erste, marker-lose Smoke (~80 → 112 k Tokens; ~22 → 26 min). Bei Effizienz-Vergleichen (H2) muss diese Schreibe-Mehrlast als Caveat dokumentiert sein — pi-Workflows tragen sie strukturell, CC und OC nicht.
- **TDD-Disziplin-Metriken nur für v6.2-Zellen**: v1-Workflows liefern keine TDD-Disziplin-Metriken — `cycle_count`, `predictions_correct_rate` und `refactorings_applied` sind dort 0/null. Die H4-Hypothese bezieht sich ausschließlich auf den v6.2-Vergleich.
