---
id: RQ-end-refactor-opus48
question: "Haelt der v6.5-end-refactor-Befund aus RQ-1.12 (Korrektheit intakt, Code-Qualitaet >= v6.2, Token-Kosten ~v6.2) auf Opus 4.8 (no-thinking) — oder taeuscht der zusaetzliche End-Refactor-Pass auf dem neuen Modell die claim-office-Vollstaendigkeit aus (Bundle-Bruch-Muster aus RQ-1.9/RQ-1.10)?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned,        prompt: example-mapping}  # Baseline: Per-Cycle APP-Refactor
    - {workflow: v6.4-metric-driven-refactor,  prompt: example-mapping}  # Per-Cycle metric-driven (ESLint/McCabe pre/post pro Cycle)
    - {workflow: v6.5-end-refactor,            prompt: example-mapping}  # v6.2 Per-Cycle + zusaetzlicher End-Refactor-Pass (whole src/, iterativ, metric-driven)
  kata_base: [claim-office]
controls:
  model: opus-4-8-no-thinking
outcomes:
  # primaer: Korrektheit (das Bundle-Bruch-Risiko zeigt sich zuerst hier; vgl. RQ-1.9/RQ-1.10)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # Code-Qualitaet (End-Refactor zielt explizit auf whole-src Metriken)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD-Disziplin (Sanity: Per-Cycle-Anteil von v6.5 ist byte-identisch zu v6.2)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Kosten
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.13: v6.5-end-refactor auf Opus 4.8 — haelt der RQ-1.12-Befund modelluebergreifend? (claim-office)

RQ-1.12 hat auf **opus-4-7-(portkey-)no-thinking** gezeigt: der zusaetzliche iterative End-Refactor-Pass (v6.5) haelt die Korrektheit (`verification_pct` 0.99, 5/5 `experiment-done.txt`), liefert kompakteren Code als v6.2 (`code_mass` −11 %, `cognitive_max` −44 %), liegt auf Code-Qualitaet praktisch gleichauf mit v6.4 und kostet dabei nur ~v6.2-Tokens (statt v6.4s ~2.4×). RQ-1.13 prueft, ob dieser Befund auf **Opus 4.8 (no-thinking)** Bestand hat.

## Motivation

Reduktionen und additive Bundles sind **nicht modell-agnostisch** (Memory `opus-46-vs-47-not-equivalent`, v1-Archiv-RQ-emoji-cross-model: auf Sonnet-4-6 vervielfacht Emoji-Entfernung die Korrektheit, auf opus-4-6 versagen beide Varianten gleich). Die gesamte v6.x-Linie wurde primaer auf opus-4-7 vermessen. Bevor v6.5 als modelluebergreifende Default-Empfehlung taugt, braucht es eine Replikation auf dem neuen Spitzenmodell.

Die spezifische Sorge: das **Bundle-Bruch-Muster** aus RQ-1.9 (v6.3-audit-bundle) und RQ-1.10 (v6.2.1-refactor-vocab) — Agent self-terminiert auf claim-office nach <½ der Baseline-Cycles, `code_mass` halbiert, interne Tests gruen, aber externe `verification_pct` kollabiert (0.96 → 0.35 / 0.23). v6.5 hat dieses Muster auf opus-4-7 vermieden. Es ist a priori nicht ausgemacht, dass es auf opus-4-8 ebenfalls ausbleibt: ein faehigeres Modell koennte den End-Pass aggressiver fahren und frueher "fertig" erklaeren.

## Workflow-Definition

Identisch zu RQ-1.12 — `v6.5-end-refactor` unterscheidet sich von `v6.2-with-why-cleaned` in genau den Dateien `.claude/agents/end-refactor.md` (NEU), `.claude/rules/tdd.md` und `.claude/rules/tdd-experiment-mode.md` (End-Refactor-Schritt ergaenzt); `.claude/agents/refactor.md` ist byte-identisch zu v6.2. Die vier MARKERS bleiben unangetastet; der End-Refactor ist ein zusaetzlicher `Task({subagent_type: "end-refactor"})`-Call **vor** dem `experiment-done.txt`-Write. Vollbeschreibung: `../1.12-end-refactor-effect-v62/README.md`.

## Hypothesen

- **H1 (Korrektheit, primaer):** v6.5 erhaelt die Korrektheit auf claim-office × opus-4-8 (`verification_pct` ≥ 0.85, `experiment-done.txt` in ≥ 80 % der Runs). Kein Bundle-Bruch wie in RQ-1.9 / RQ-1.10.
- **H2 (RQ-1.12-Replikation):** Die Rangordnung der drei Workflows auf den Code-Qualitaets-Outcomes bleibt auf opus-4-8 erhalten (v6.5 ≈ v6.4 < v6.2 bei `code_mass` / Funktionslaenge; v6.4 knapp vorn bei `cognitive_max` / `mccabe_max`).
- **H3 (Kosten-Replikation):** v6.5 bleibt deutlich guenstiger als v6.4 (Tokens & Wallclock), Aufschlag ueber v6.2 moderat.
- **H4 (Modell-Effekt, sekundaer):** opus-4-8 liefert bei gleichem Workflow tendenziell gleiche oder bessere Korrektheit/Code-Qualitaet als opus-4-7 (Quervergleich gegen die RQ-1.12-Zahlen — **nur als Kontext, nicht kausal**, da Routing-Unterschied; siehe Caveats).

**Falsifikation H1:** Wenn v6.5 auf opus-4-8 in das Self-Termination-Muster faellt (verification_pct kollabiert bei intakten internen Tests), ist der End-Pass modell-sensibel und darf nicht ohne Per-Modell-Validierung empfohlen werden.

## Datenlage zu RQ-Beginn

Bestehende Runs im Pool (Stand 2026-05-29):

| Workflow | n (opus-4-8-no-thinking) | Bemerkung |
|---|---:|---|
| `v6.2-with-why-cleaned`        | 0 | neu zu fahren |
| `v6.4-metric-driven-refactor`  | 0 | neu zu fahren |
| `v6.5-end-refactor`            | 0 | neu zu fahren |

Es gibt **keine** wiederverwendbaren opus-4-8-Runs fuer diese drei Workflows — alle 3 Zellen × n=5 = **15 Runs** sind frisch zu erheben. (Die RQ-1.12-Runs sind opus-4-7/Portkey und zaehlen wegen des fixen `controls.model` hier nicht mit.)

## Design

```
Faktor:    workflow   — 3 Stufen (v6.2 / v6.4 / v6.5), prompt = example-mapping fix
Kontrolle: model      — opus-4-8-no-thinking (Direct-API / native OAuth)
Kontrolle: kata_base  — claim-office

Zellen:    3
Replikate: n = 5
Runs:      15 total (alle neu)
```

## Caveats

- **Routing-Unterschied zu RQ-1.12 (kein Quer-Pooling!):** opus-4-8 ist **nicht** auf Portkey/Vertex verfuegbar und laeuft Direct-API ueber native OAuth (`~/.claude/.credentials.json`); `run-batch.sh` blankt dafuer die Portkey-`.env`-Routing-Vars (Kommentar in `MODEL_CONFIGS`). RQ-1.12 lief Portkey-via-Vertex-EU. Die beiden RQs teilen daher **keine** Zelle — der H4-Quervergleich gegen RQ-1.12 ist Routing-konfundiert und nur als Kontext zu lesen, nicht als kausaler Modell-Effekt. Wer den reinen Modell-Effekt will, braeuchte beide Modelle auf demselben Routing.
- **Single-shard zwingend:** Direct-API-Batches duerfen nicht gesharded werden (Rate-Limit-Druck, Memory `feedback-direct-single-shard`). Alle 15 Runs einzeln.
- **Subscription-Cap-Risiko (Direct-API-spezifisch):** Lange iterative End-Refactor-Sessions × claim-office koennen in ein Subscription-Cap laufen; die Anthropic-CLI verlaesst den Container dann mit `exit=0` ("Waiting for retry window"). `run-batch.sh` fixt das seit 2026-05-27 im exit-0-Pfad (Memory `v64-stress-postmortem`) — vor Aggregation trotzdem `jq .run_status.exit_reason` + `experiment-done.txt`-Praesenz stichprobenartig pruefen.
- **End-Refactor-Pass ist iterativ ohne hartes Limit:** `duration_seconds` / `total_tokens` von v6.5 liegen im Mittel ueber v6.2; der TDD-Cycle-Anteil ist davon entkoppelt.
- **Bundle-Caveat (kausale Lokalisierung):** Der End-Refactor-Agent kombiniert Whole-src-Scope + iterative Mehrfach-Refactorings + Pre/Post-Messung. Ein Effekt ist nicht auf eine dieser Komponenten lokalisierbar.
- **claim-office-only:** GoL-Cross-Validierung bleibt fuer eine eventuelle Folge-RQ.

## Status / Naechste Schritte

1. v6.5-end-refactor Smoke-Run (n=1, claim-office-example-mapping, **opus-4-8-no-thinking**) zur Sanity: cycle_count >= 3, refactorings_applied >= 1, End-Pass laeuft, `experiment-done.txt` wird geschrieben.
2. Batch-Plan generieren (`batch-plan-from-rq.py`); alle 15 Zellen werden als Fill erkannt (keine Treffer im Pool).
3. Fill-Batch **single-shard**, Direct-API/native OAuth (kein Portkey).
4. Aggregation via `aggregate-by-query.py`, `findings.md` schreiben gemaess `/run-rq` Skill-Konventionen (Trophy-Konvention, Spot-Check vor Aggregation, Plausibilitaets-Cross-Check, 🏆 in Uebersichts-Tabelle).

## Findings

Siehe [findings.md](findings.md) (wird mit Skill `/run-rq` befuellt nachdem n=5 pro Workflow erreicht ist).
