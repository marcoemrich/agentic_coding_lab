---
id: RQ-metric-driven-refactor-v62
question: "Verbessert ein Refactor-Agent, der deterministische Metriken (ESLint smells, SonarJS cognitive complexity, McCabe cyclomatic complexity) selbst pre/post misst und APP-Mass parallel ausweist, die Code-Qualitaet auf claim-office gegenueber dem Baseline-v6.2-with-why-cleaned-Workflow — ohne Korrektheit oder TDD-Disziplin zu beschaedigen?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned,        prompt: example-mapping}  # Baseline (aktuelle Default-Basis aus RQ-1.6)
    - {workflow: v6.4-metric-driven-refactor,  prompt: example-mapping}  # + Tool-Aufrufe (ESLint pre/post) + McCabe-Berechnung parallel zu APP
  kata_base: [claim-office]
controls:
  model:
    any:
      - opus-4-7-no-thinking          # canonical fuer neue v6.4-Fill-Runs (subscription tokens, single-shard)
      - opus-4-7-portkey-no-thinking  # akzeptiert fuer wiederverwendete v6.2-Baseline-Runs (Portkey-Gateway)
outcomes:
  # primaer: Code-Qualitaet (Metriken treiben den Refactor direkt)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD-Disziplin (Sanity: zusaetzliche Tool-Aufrufe duerfen Refactor-Frequenz nicht stoeren)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Korrektheit (Sanity: Bundle-Risiko aus RQ-1.9/RQ-1.10 vs claim-office)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # Kosten (Pre/Post-Tool-Aufrufe + groesseres Refactor-Prompt → leichter Aufschlag erwartet)
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.11: v6.4-metric-driven-refactor vs v6.2-with-why-cleaned (claim-office)

Aendert ein deterministisch messender Refactor-Agent die Code-Qualitaet auf einer novel kata mit echten Mehrdeutigkeiten — ohne in das Bundle-Bruch-Muster aus RQ-1.9 (`v6.3-audit-bundle`) und RQ-1.10 (`v6.2.1-refactor-vocab`) zu fallen?

## Motivation

Der `refactor`-Agent in der v6.x-Linie ueberlaesst die Beurteilung von Code-Qualitaet bisher dem Modell selbst (APP-Mass-Berechnung, Naming-Evaluation, qualitative Smell-Beschreibung). Zwei vorausgegangene Erweiterungs-Versuche scheiterten auf claim-office:

- **RQ-1.9** (`v6.3-audit-bundle`): zusaetzliche Rationale-Bloecke + Red-Phase-Hardening. Auf GoL klar positiv, auf claim-office `verification_pct` 0.96 → 0.35 (Self-Stop in 6/8 Runs).
- **RQ-1.10** (`v6.2.1-refactor-vocab`): rein additiver Vokabular-Block im Refactor-Agent (Complexity-Awareness, SRP, Smell→Move-Tabelle). Auf GoL Code-Qualitaet im 1-σ-Noise, auf claim-office `verification_pct` 0.96 → 0.23 (Self-Stop in 4/5 Runs).

Beide Faelle zeigen dasselbe Muster: Self-Termination nach < ½ der Baseline-Cycles, internes `tests_passing = true` (die geschriebenen Tests sind gruen), externe `verification_pct` kollabiert. Welche Komponente das Self-Stop-Verhalten triggert, ist mit Bundle-Befunden nicht entscheidbar.

`v6.4-metric-driven-refactor` testet eine mechanistisch andere Hypothese: **statt Vokabular zu ergaenzen, ruft der Agent deterministische Tools auf und laesst die Zahlen den Refactor steuern**.

## Workflow-Definition

`v6.4-metric-driven-refactor` lebt unter `experiments/workflows/v6.4-metric-driven-refactor/` und unterscheidet sich von `v6.2-with-why-cleaned` ausschliesslich in einer Datei: `.claude/agents/refactor.md`. Alle anderen Files (`commands/test-list.md`, `commands/red.md`, `commands/green.md`, `rules/tdd.md`, `rules/tdd-with-ts-and-vitest.md`, `rules/tdd-experiment-mode.md`, `settings.json`) sind byte-identisch zur Baseline. Die vier MARKERS (Skill-Aufrufe, "Red Phase Complete", Prediction-Lines, `experiment-done.txt`) sind unangetastet.

Die Erweiterungen im `refactor.md` sind:

| Komponente | Beschreibung | Quelle |
|---|---|---|
| **Step 0 — Pre-Measurement (ESLint)** | `pnpm exec eslint src/ --format json` aufrufen; Smells (Liste mit rule-id, location, message) und SonarJS cognitive complexity pro Funktion aus dem Output extrahieren | Tool-Call (Bash-Skill schon erlaubt via `settings.json`) |
| **Step 3 — McCabe Cyclomatic Complexity** | Pro Funktion: bei 1 starten, +1 fuer jedes if/else-if/case/&&/‖/?:/for/while/catch. Worst-Case-Funktion identifizieren als Refactor-Ziel; Minimierungs-Angles werden im Prompt aufgezaehlt (Guard-Clauses, Lookup-Tables, Polymorphismus) | Agent-interne Berechnung analog zur APP-Mass-Berechnung (Steps 2) |
| **Step 5 — Post-Measurement (ESLint)** | ESLint erneut aufrufen, Smell- und Cognitive-Delta berechnen | Tool-Call |
| **Step 6 — Document Decision** | Pre/Post-Block ueber ALLE vier Metriken (Smells, Cognitive, APP, McCabe); explizite Klausel "Wenn eine Metrik schlechter wurde: revert und alternativen Winkel" | Prompt-Inhalt |
| **APP** | unveraendert beibehalten (parallel, nicht ersetzend) | erbt von Baseline |

Bewusst NICHT enthalten (verboten gemaess `CLAUDE.md` → "Keine numerischen Schwellwerte in Workflow-Prompts"):

- Keine Aussage "if cognitive > 15 then refactor" oder Aehnliches im Prompt.
- Keine Auto-Revert-Schleife mit Iterationslimit.
- Keine ESLint-config-Aenderungen (die existierenden Schwellwerte aus `eslint.config.mjs` sind Pipeline-Infrastruktur, nicht Workflow-Inhalt).

## Hypothesen

- **H1 (Korrektheit, primaer):** v6.4 erhaelt die Korrektheit auf claim-office (`verification_pct` ≥ 0.85, `experiment-done.txt` in ≥ 80 % der Runs). Belastet das Bundle-Risiko nicht, weil der Mechanismus deterministisch und nicht vokabular-getrieben ist.
- **H2 (Code-Qualitaet):** v6.4 reduziert `cognitive_max` und `mccabe_max` gegenueber Baseline messbar (mind. 1 σ Effektgroesse), weil das Pre/Post-Messen dem Agent objektive Trigger gibt.
- **H3 (TDD-Disziplin, Sanity):** `cycle_count`, `refactorings_applied`, `predictions_correct_rate` bleiben innerhalb 1 σ der Baseline. Wenn nicht: Tool-Aufrufe stoeren den TDD-Loop, was ein eigenstaendiger Befund waere.
- **H4 (Kosten):** Token- und Wallclock-Aufschlag durch zwei Tool-Aufrufe pro Cycle plus McCabe-Berechnung. Erwartet +10–20 % Tokens, Wallclock je nach Cycle-Count.

## Datenlage zu RQ-Beginn

Stichproben-Smoke 2026-05-27 (claim-office-example-mapping × v6.4 × opus-4-7-no-thinking, native API, n=2 nach Subscription-Cap-Bereinigung):

| Run | ver_pct | cycles | refactorings | done.txt | Wallclock |
|---|---:|---:|---:|---|---:|
| 2026-05-27_03-39-46 | **1.00** (15/15) | 38 | 37 | ✓ | 5000s |
| 2026-05-27_14-28-32-2 | **0.93** (14/15) | 42 | n/a | ✓ | 9197s |

Mean ver_pct (n=2) = 0.965, beide done.txt vorhanden. Akzeptanzschwelle 0.85 vorerst erfuellt; H1 ist konsistent mit der Stichprobe, braucht aber n=5 fuer eine belastbare Aussage.

Zwei weitere Runs der Stichprobe vom 27.05. waren Subscription-Cap- bzw. External-Session-Cut-Artefakte (siehe Memory `v64-stress-postmortem.md`); sie wurden retroaktiv als `subscription-capped` / `external-session-cut` markiert und zaehlen nicht. Der dadurch ausgeloeste Detection-Fix in `run-batch.sh` sollte solche Artefakte ab 2026-05-27 sofort erkennen und in den Retry-Pfad umlenken.

## Caveats

- **Routing-Asymmetrie:** Die 18 wiederverwendeten v6.2-Baseline-Runs liegen unter `opus-4-7-portkey-no-thinking` (Portkey-Gateway via Vertex EU). Die v6.4-Runs entstehen unter `opus-4-7-no-thinking` (Native API, Subscription-Tokens). Beide Zellen werden via `controls.model: {any: [...]}` zusammengefuehrt — Memory-Notiz `controls-model-or-match.md` deckt diesen Mechanismus. Annahme: das Routing beeinflusst das Outcome auf opus-4-7 nicht. Eine spaetere Replikation einer Zelle ueber-kreuz (v6.4 Portkey oder v6.2 native) wuerde die Annahme schaerfer pruefen, ist fuer den primaeren Workflow-Vergleich aber nachrangig.
- **Single-shard fuer v6.4:** Subscription-Tokens stehen unter Last; parallele Shards erhoehen das Cap-Risiko. Ab 2026-05-27 fixt `run-batch.sh` zwar Empty-Log-Cuts (Retry mit Backoff), aber jeder Cut kostet zusaetzliche Wallclock. v6.4-Fill-Runs einzeln fahren.
- **Bundle-Caveat (kausale Lokalisierung):** v6.4 kombiniert drei Aenderungen — (a) ESLint-Aufruf, (b) McCabe-Berechnung neben APP, (c) Pre/Post-Disziplin mit Revert-Klausel. Wenn ein Effekt sichtbar wird, sind diese drei nicht voneinander getrennt. Eine spaetere Sub-RQ koennte (a) isoliert testen (nur ESLint, keine McCabe), wenn der Bundle-Effekt eine Ablation rechtfertigt.
- **claim-office-only:** GoL bleibt fuer eine eventuelle Folge-RQ. GoL-Smoke (n=1) lief sauber (9 cycles, 18/18 predictions, ver 1.0), aber das ist kein Code-Qualitaets-Befund.

## Status / Naechste Schritte

1. Batch-Plan generieren (`batch-plan-from-rq.py`), die 2 bestehenden v6.4-Runs werden als Treffer erkannt, fehlende Runs aufgefuellt.
2. Fill-Batch single-shard, Native API, `ANTHROPIC_*=""`-Override fuer Subscription-Routing.
3. Aggregation via `aggregate-by-query.py`, `findings.md` schreiben gemaess `/run-rq` Skill-Konventionen (Trophy-Konvention, Spot-Check vor Aggregation, Plausibilitaets-Cross-Check).

## Findings

Siehe [findings.md](findings.md) (wird mit Skill `/run-rq` befuellt nachdem n=5 erreicht ist).
