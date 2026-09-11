---
id: RQ-end-refactor-opus48
question: "Haelt der exact-hybrid-v5-end-refactor-cc-Befund aus RQ-1.12 (Korrektheit intakt, Code-Qualitaet >= hybrid-v4, Token-Kosten ~hybrid-v4) auf Opus 4.8 (no-thinking) — oder taeuscht der zusaetzliche End-Refactor-Pass auf dem neuen Modell die claim-office-Vollstaendigkeit aus (Bundle-Bruch-Muster aus RQ-1.9/RQ-1.10)?"
factors:
  workflow_x_prompt:
    - {workflow: exact-hybrid-v4-cleaned-cc,        prompt: example-mapping}  # Baseline: Per-Cycle APP-Refactor
    - {workflow: exact-hybrid-v4.4-metric-refactor-cc,  prompt: example-mapping}  # Per-Cycle metric-driven (ESLint/McCabe pre/post pro Cycle)
    - {workflow: exact-hybrid-v5-end-refactor-cc,            prompt: example-mapping}  # hybrid-v4 Per-Cycle + zusaetzlicher End-Refactor-Pass (whole src/, iterativ, metric-driven)
  kata_base: [claim-office, game-of-life]
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
  # TDD-Disziplin (Sanity: Per-Cycle-Anteil von hybrid-v5 ist byte-identisch zu hybrid-v4)
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

# RQ-1.13: exact-hybrid-v5-end-refactor-cc auf Opus 4.8 — haelt der RQ-1.12-Befund modelluebergreifend? (claim-office)

RQ-1.12 hat auf **opus-4-7-(portkey-)no-thinking** gezeigt: der zusaetzliche iterative End-Refactor-Pass (hybrid-v5) haelt die Korrektheit (`verification_pct` 0.99, 5/5 `experiment-done.txt`), liefert kompakteren Code als hybrid-v4 (`code_mass` −11 %, `cognitive_max` −44 %), liegt auf Code-Qualitaet praktisch gleichauf mit hybrid-v4.4 und kostet dabei nur ~hybrid-v4-Tokens (statt v6.4s ~2.4×). RQ-1.13 prueft, ob dieser Befund auf **Opus 4.8 (no-thinking)** Bestand hat.

## Motivation

Reduktionen und additive Bundles sind **nicht modell-agnostisch** (Memory `opus-46-vs-47-not-equivalent`, oneshot-v1-Archiv-RQ-emoji-cross-model: auf Sonnet-4-6 vervielfacht Emoji-Entfernung die Korrektheit, auf opus-4-6 versagen beide Varianten gleich). Die gesamte hybrid-v1.x-Linie wurde primaer auf opus-4-7 vermessen. Bevor hybrid-v5 als modelluebergreifende Default-Empfehlung taugt, braucht es eine Replikation auf dem neuen Spitzenmodell.

Die spezifische Sorge: das **Bundle-Bruch-Muster** aus RQ-1.9 (exact-hybrid-v4.3-audit-bundle-cc) und RQ-1.10 (exact-hybrid-v4.1-refactor-vocab-cc) — Agent self-terminiert auf claim-office nach <½ der Baseline-Cycles, `code_mass` halbiert, interne Tests gruen, aber externe `verification_pct` kollabiert (0.96 → 0.35 / 0.23). hybrid-v5 hat dieses Muster auf opus-4-7 vermieden. Es ist a priori nicht ausgemacht, dass es auf opus-4-8 ebenfalls ausbleibt: ein faehigeres Modell koennte den End-Pass aggressiver fahren und frueher "fertig" erklaeren.

## Workflow-Definition

Identisch zu RQ-1.12 — `exact-hybrid-v5-end-refactor-cc` unterscheidet sich von `exact-hybrid-v4-cleaned-cc` in genau den Dateien `.claude/agents/end-refactor.md` (NEU), `.claude/rules/tdd.md` und `.claude/rules/tdd-experiment-mode.md` (End-Refactor-Schritt ergaenzt); `.claude/agents/refactor.md` ist byte-identisch zu hybrid-v4. Die vier MARKERS bleiben unangetastet; der End-Refactor ist ein zusaetzlicher `Task({subagent_type: "end-refactor"})`-Call **vor** dem `experiment-done.txt`-Write. Vollbeschreibung: `../1.12-end-refactor-effect-v62/README.md`.

## Hypothesen

- **H1 (Korrektheit, primaer):** hybrid-v5 erhaelt die Korrektheit auf claim-office × opus-4-8 (`verification_pct` ≥ 0.85, `experiment-done.txt` in ≥ 80 % der Runs). Kein Bundle-Bruch wie in RQ-1.9 / RQ-1.10.
- **H2 (RQ-1.12-Replikation):** Die Rangordnung der drei Workflows auf den Code-Qualitaets-Outcomes bleibt auf opus-4-8 erhalten (hybrid-v5 ≈ hybrid-v4.4 < hybrid-v4 bei `code_mass` / Funktionslaenge; hybrid-v4.4 knapp vorn bei `cognitive_max` / `mccabe_max`).
- **H3 (Kosten-Replikation):** hybrid-v5 bleibt deutlich guenstiger als hybrid-v4.4 (Tokens & Wallclock), Aufschlag ueber hybrid-v4 moderat.
- **H4 (Modell-Effekt, sekundaer):** opus-4-8 liefert bei gleichem Workflow tendenziell gleiche oder bessere Korrektheit/Code-Qualitaet als opus-4-7 (Quervergleich gegen die RQ-1.12-Zahlen — **nur als Kontext, nicht kausal**, da Routing-Unterschied; siehe Caveats).

**Falsifikation H1:** Wenn hybrid-v5 auf opus-4-8 in das Self-Termination-Muster faellt (verification_pct kollabiert bei intakten internen Tests), ist der End-Pass modell-sensibel und darf nicht ohne Per-Modell-Validierung empfohlen werden.

## Datenlage zu RQ-Beginn

Bestehende Runs im Pool (Stand 2026-05-30):

| Workflow | claim-office | game-of-life | Bemerkung |
|---|---:|---:|---|
| `exact-hybrid-v4-cleaned-cc`        | 5 | 0 | claim-office da (1 ver=0-Outlier, 1 timeout — beide legitime Findings); GoL neu |
| `exact-hybrid-v4.4-metric-refactor-cc`  | 5 | 0 | claim-office da; GoL neu |
| `exact-hybrid-v5-end-refactor-cc`            | 5 | 0 | claim-office da; GoL neu |

Die **claim-office**-Haelfte (15 Runs, 29./30.05.) ist vollstaendig erhoben. Offen ist die **game-of-life**-Haelfte: 3 Zellen × n=5 = **15 Runs** frisch zu erheben (Direct-API/native, single-shard). (Die RQ-1.12-Runs sind opus-4-7/Portkey und zaehlen wegen des fixen `controls.model` hier nicht mit.)

## Design

```
Faktor:    workflow   — 3 Stufen (hybrid-v4 / hybrid-v4.4 / hybrid-v5), prompt = example-mapping fix
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
- **End-Refactor-Pass ist iterativ ohne hartes Limit:** `duration_seconds` / `total_tokens` von hybrid-v5 liegen im Mittel ueber hybrid-v4; der TDD-Cycle-Anteil ist davon entkoppelt.
- **Bundle-Caveat (kausale Lokalisierung):** Der End-Refactor-Agent kombiniert Whole-src-Scope + iterative Mehrfach-Refactorings + Pre/Post-Messung. Ein Effekt ist nicht auf eine dieser Komponenten lokalisierbar.
- **Kata-Asymmetrie (RQ-1.12-Lehre):** Der v6.5-End-Pass wirkt auf der **mehrteiligen** claim-office-Codebasis (Cross-file-Konsolidierung), war auf der **einteiligen** game-of-life-Library aber Rauschen (F-1.12.2). Die GoL-Zellen prüfen daher primär, ob dieser kata-abhängige Unterschied auf opus-4-8 reproduziert — nicht, ob hybrid-v5 dort gewinnt. Katas werden **nie gemittelt**.

## Status / Naechste Schritte

1. exact-hybrid-v5-end-refactor-cc Smoke-Run (n=1, claim-office-example-mapping, **opus-4-8-no-thinking**) zur Sanity: cycle_count >= 3, refactorings_applied >= 1, End-Pass laeuft, `experiment-done.txt` wird geschrieben.
2. Batch-Plan generieren (`batch-plan-from-rq.py`); alle 15 Zellen werden als Fill erkannt (keine Treffer im Pool).
3. Fill-Batch **single-shard**, Direct-API/native OAuth (kein Portkey).
4. Aggregation via `aggregate-by-query.py`, `findings.md` schreiben gemaess `/run-rq` Skill-Konventionen (Trophy-Konvention, Spot-Check vor Aggregation, Plausibilitaets-Cross-Check, 🏆 in Uebersichts-Tabelle).

## Findings

Siehe [findings.md](findings.md) (wird mit Skill `/run-rq` befuellt nachdem n=5 pro Workflow erreicht ist).
