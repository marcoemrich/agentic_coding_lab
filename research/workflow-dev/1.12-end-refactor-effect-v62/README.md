---
id: RQ-end-refactor-v62
question: "Verbessert ein zusaetzlicher metric-driven End-Refactor-Pass (v6.5-end-refactor) nach Abschluss aller TDD-Cycles die Code-Qualitaet auf claim-office gegenueber dem Per-Cycle-Baseline-Workflow (v6.2-with-why-cleaned) und gegenueber dem rein per-cycle metric-driven Refactor (v6.4-metric-driven-refactor) — ohne Korrektheit oder TDD-Disziplin zu beschaedigen?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned,        prompt: example-mapping}  # Baseline: Per-Cycle APP-Refactor
    - {workflow: v6.4-metric-driven-refactor,  prompt: example-mapping}  # Per-Cycle metric-driven (ESLint/McCabe pre/post pro Cycle)
    - {workflow: v6.5-end-refactor,            prompt: example-mapping}  # v6.2 Per-Cycle + zusaetzlicher End-Refactor-Pass (whole src/, iterativ, metric-driven)
  kata_base: [claim-office]
controls:
  model:
    any:
      - opus-4-7-portkey-no-thinking  # canonical fuer neue v6.5-Fill-Runs (Portkey-Gateway via .env; native opus-4-7-no-thinking gibt 400 ohne x-portkey-provider, siehe RQ-Diary 2026-05-27)
      - opus-4-7-no-thinking          # akzeptiert fuer wiederverwendete v6.4-Runs aus RQ-1.11 (selbe .env-Route, anderes Label)
outcomes:
  # primaer: Code-Qualitaet (End-Refactor zielt explizit auf whole-src Metriken)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # TDD-Disziplin (Sanity: Per-Cycle-Anteil von v6.5 ist byte-identisch zu v6.2; cycle-Metriken sollten v6.2 entsprechen)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Korrektheit (Sanity: End-Refactor darf claim-office-Verification nicht brechen — vgl. Bundle-Risiko aus RQ-1.9/RQ-1.10)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # Kosten (zusaetzlicher End-Pass = iterative ESLint+McCabe-Aufrufe nach dem letzten Cycle)
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.12: v6.5-end-refactor vs v6.4-metric-driven-refactor vs v6.2-with-why-cleaned (claim-office)

Liefert ein einmaliger, iterativer **End-Refactor-Pass** ueber die ganze `src/` einen messbaren Code-Qualitaets-Gewinn gegenueber reinem Per-Cycle-Refactoring — ohne in das Bundle-Bruch-Muster aus RQ-1.9 / RQ-1.10 zu fallen?

## Motivation

RQ-1.11 hat gezeigt, dass v6.4 (metric-driven **per cycle**) auf claim-office die Korrektheit haelt (siehe `1.11-metric-driven-refactor-effect-v62/findings.md`). Offen blieb: lohnt sich ein **zusaetzlicher** Whole-src-Pass nach dem letzten Green-Cycle? Hypothesen, die diese Frage aufwerfen:

- Per-Cycle-Refactoring sieht in jedem Cycle nur den frisch beruehrten Code. **Cross-file Duplication** (z.B. `cli.ts` ↔ `domain.ts` auf claim-office) und **kumulative Komplexitaet** in einer Funktion, die durch viele kleine Cycles waechst, sind im Per-Cycle-Scope unsichtbar.
- Naming-Entscheidungen, die ein Per-Cycle-Refactor frueh trifft, basieren auf einem unvollstaendigen Bild der Funktion. Erst nach dem letzten Test ist klar, was die Funktion wirklich tut.
- Wenn der Per-Cycle-Refactor zu konservativ ist (revertet im Zweifel), kann ein zweiter, fokussierter Pass mit Zugang zur ganzen Codebasis und stabilen Tests mutiger sein.

`v6.5-end-refactor` testet, ob dieser zusaetzliche Pass den erwarteten Gewinn liefert, ohne die in v6.4 etablierte Korrektheits-Robustheit zu opfern.

## Workflow-Definition

`v6.5-end-refactor` lebt unter `experiments/workflows/v6.5-end-refactor/` und unterscheidet sich von `v6.2-with-why-cleaned` in genau drei Dateien:

| Datei | Aenderung gegenueber v6.2 |
|---|---|
| `.claude/agents/refactor.md` | **byte-identisch** (Per-Cycle-Refactor bleibt v6.2-APP-getrieben) |
| `.claude/agents/end-refactor.md` | **NEU** — Subagent fuer den finalen Pass, mit den deterministischen Mechanismen aus v6.4 (ESLint pre/post, McCabe-Berechnung, APP, SonarJS cognitive) auf Whole-src-Scope ausgeweitet; iteriert ONE-change-at-a-time bis keine Metrik mehr verbessert |
| `.claude/rules/tdd.md` | Tabelle "Which Tool to Use" um End-Refactor-Zeile erweitert; Schritt 6 (End-Refactor-Task-Aufruf) hinzugefuegt |
| `.claude/rules/tdd-experiment-mode.md` | Autonomous-Workflow um Schritt 4 (End-Refactor) erweitert; Done-Marker erst nach End-Refactor-Return |

Bewusst NICHT enthalten (verboten gemaess `CLAUDE.md` → "Keine numerischen Schwellwerte in Workflow-Prompts"):

- Keine "if cognitive > N then refactor"-Schwellwerte im End-Refactor-Prompt.
- Kein Iterationslimit (Stop-Kriterium ist qualitativ: "no metric improves further").
- Keine ESLint-config-Aenderungen.

Die vier MARKERS (Skill-Aufrufe `/test-list`, `/red`, `/green`; Task-Aufrufe `refactor`; `experiment-done.txt`) bleiben unangetastet. Der End-Refactor-Aufruf ist ein zusaetzlicher `Task({subagent_type: "end-refactor"})`-Call **vor** dem `experiment-done.txt`-Write.

## Hypothesen

- **H1 (Korrektheit, primaer):** v6.5 erhaelt die Korrektheit auf claim-office (`verification_pct` ≥ 0.85, `experiment-done.txt` in ≥ 80 % der Runs). Das Bundle-Risiko aus RQ-1.9 / RQ-1.10 wird vermieden, weil der End-Pass deterministisch und ausserhalb des TDD-Loops laeuft (kein Eingriff in die Cycle-Dynamik).
- **H2 (Code-Qualitaet vs v6.2):** v6.5 reduziert `cognitive_max`, `mccabe_max` und `cc_longest_function` gegenueber v6.2 messbar (mind. 1 σ Effektgroesse).
- **H3 (Code-Qualitaet vs v6.4):** v6.5 ist gegenueber v6.4 zumindest **gleichauf** auf Code-Qualitaets-Metriken; H3' (staerker): Whole-src-Scope sieht zusaetzliche Cross-file-Verbesserungen → noch geringerer `code_mass`-Mean oder weniger `smell_total`.
- **H4 (TDD-Disziplin, Sanity):** `cycle_count`, `refactorings_applied`, `predictions_correct_rate` bleiben in v6.5 innerhalb 1 σ der v6.2-Baseline — der Per-Cycle-Anteil ist byte-identisch, also sollten die Cycle-Metriken nicht abweichen. Eine Abweichung waere ein Befund (z.B. wenn das Wissen um den End-Pass den Per-Cycle-Refactor demotiviert).
- **H5 (Kosten):** Token- und Wallclock-Aufschlag gegenueber v6.2 durch den End-Pass; gegenueber v6.4 vermutlich vergleichbar oder hoeher (End-Pass iteriert, v6.4 misst nur per Cycle). Erwartet je nach iterierten Verbesserungen +5–25 % Tokens.

## Datenlage zu RQ-Beginn

Bestehende Runs im Pool (Stand 2026-05-27):

| Workflow | n | Modell-Routing | Bemerkung |
|---|---:|---|---|
| `v6.2-with-why-cleaned`        | 8 | `opus-4-7-portkey-no-thinking` | aus RQ-1.6 / RQ-1.11 Baseline-Pool |
| `v6.4-metric-driven-refactor`  | 5 | `opus-4-7-no-thinking` (native) | aus RQ-1.11 Fill |
| `v6.5-end-refactor`            | 0 | — | **neu, 5 Runs zu fahren** |

Min_replicates=5 ist fuer v6.2 und v6.4 erreicht; v6.5 braucht 5 frische Runs.

## Caveats

- **Label-Asymmetrie (kein Routing-Unterschied mehr):** Seit 2026-05-25 laeuft jeder Run im Container ueber `experiments/docker/.env` (Portkey-Gateway via Vertex EU). Die Modell-Labels (`opus-4-7-no-thinking` vs `opus-4-7-portkey-no-thinking`) unterscheiden sich nur in `MODEL_CONFIGS` als CLI-Argument: das Portkey-Label setzt `@vertex-eu-global/...`, das Nicht-Portkey-Label das nackte `claude-opus-4-7`. Das nackte Label produziert seit 2026-05-27 ein `400 x-portkey-config required` (Portkey kann den Provider ohne Prefix nicht aufloesen) — daher kanonisches Modell fuer v6.5-Fill `opus-4-7-portkey-no-thinking`. Die 5 wiederverwendeten v6.4-Runs aus RQ-1.11 tragen das alte Label `opus-4-7-no-thinking`, gingen aber denselben Portkey-Weg; `controls.model: {any: [...]}` fasst beide zusammen.
- **Single-shard fuer v6.5:** Lange iterative End-Refactor-Sessions auf Opus 4.7 × claim-office haben unter parallelen Portkey-Shards ein Cut-Risiko (Memory `portkey-shards-external-cut-risk.md`); deswegen Fill-Runs einzeln fahren.
- **End-Refactor-Pass ist iterativ ohne hartes Limit:** Wenn ein Run viele Verbesserungen findet, kann der End-Pass mehrere Tausend Tokens und Wallclock verbrauchen. Der TDD-Cycle-Anteil ist davon entkoppelt (cycles waren da schon abgeschlossen), aber `duration_seconds` und `total_tokens` werden im Mittel ueber v6.2 liegen.
- **Bundle-Caveat (kausale Lokalisierung):** Der End-Refactor-Agent kombiniert (a) Whole-src-Scope, (b) iterative Mehrfach-Refactorings, (c) Pre/Post-Messung. Wenn v6.5 v6.4 schlaegt, ist nicht voneinander getrennt, ob der zusaetzliche Effekt aus dem Whole-src-Blick oder aus der Mehrfach-Iteration kommt.
- **claim-office-only:** GoL bleibt fuer eine eventuelle Folge-RQ — das End-Refactor-Konzept koennte auf einer simpleren Kata weniger Hebel haben (weniger Cross-file-Duplication, weniger Funktionen).

## Status / Naechste Schritte

1. v6.5-end-refactor Smoke-Run (n=1, claim-office-example-mapping, opus-4-7-portkey-no-thinking) zur Sanity: cycle_count >= 3, refactorings_applied >= 1, End-Pass laeuft, `experiment-done.txt` wird geschrieben.
2. Batch-Plan generieren (`batch-plan-from-rq.py`); 8 v6.2 + 5 v6.4 werden als Treffer erkannt, 5 v6.5 werden aufgefuellt.
3. Fill-Batch single-shard, Portkey-Routing via `.env`.
4. Aggregation via `aggregate-by-query.py`, `findings.md` schreiben gemaess `/run-rq` Skill-Konventionen (Trophy-Konvention, Spot-Check vor Aggregation, Plausibilitaets-Cross-Check, 🏆 in Uebersichts-Tabelle).

## Findings

Siehe [findings.md](findings.md) (wird mit Skill `/run-rq` befuellt nachdem n=5 fuer v6.5 erreicht ist).
