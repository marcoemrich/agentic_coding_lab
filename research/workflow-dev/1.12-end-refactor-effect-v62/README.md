---
id: RQ-end-refactor-v62
question: "Verbessert ein metric-driven Refactor-Pass die Code-Qualitaet gegenueber dem Per-Cycle-Baseline-Workflow (v6.2-with-why-cleaned) — und greift der Hebel als rein per-cycle (v6.4-metric-driven-refactor) oder als zusaetzlicher Whole-src-End-Pass (v6.5-end-refactor) — ohne Korrektheit oder TDD-Disziplin zu beschaedigen, und haelt der Befund ueber zwei Kata-Typen (mehrteilige CLI-Codebasis claim-office vs einteilige Library game-of-life)?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned,        prompt: example-mapping}  # Baseline: Per-Cycle APP-Refactor
    - {workflow: v6.4-metric-driven-refactor,  prompt: example-mapping}  # Per-Cycle metric-driven (ESLint/McCabe pre/post pro Cycle)
    - {workflow: v6.5-end-refactor,            prompt: example-mapping}  # v6.2 Per-Cycle + zusaetzlicher End-Refactor-Pass (whole src/, iterativ, metric-driven)
  kata_base: [claim-office, game-of-life]  # claim-office = mehrteilige CLI-Codebasis (cli.ts + domain.ts), game-of-life = einteilige Library
controls:
  model:
    any:
      - opus-4-7-portkey-no-thinking  # claim-office-Routing (Portkey-Gateway via .env; native opus-4-7-no-thinking gibt 400 ohne x-portkey-provider, siehe RQ-Diary 2026-05-27)
      - opus-4-7-no-thinking          # game-of-life-Routing (Direct-API / native OAuth) + wiederverwendete v6.4-claim-office-Runs aus RQ-1.11 (selbe .env-Route, anderes Label)
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

# RQ-1.12: metric-driven Refactor (v6.4 per-cycle / v6.5 end) vs v6.2-Baseline — über zwei Kata-Typen

Liefert ein metric-driven Refactor-Pass einen messbaren Code-Qualitaets-Gewinn gegenueber der reinen v6.2-Per-Cycle-Baseline — und greift der Hebel besser **laufend** (v6.4, Refactor in jedem Cycle) oder als **einmaliger Whole-src-End-Pass** (v6.5, nach dem letzten Green-Cycle) — ohne in das Bundle-Bruch-Muster aus RQ-1.9 / RQ-1.10 zu fallen? Geprueft auf zwei Kata-Typen: der mehrteiligen CLI-Codebasis **claim-office** (cli.ts + domain.ts, Cross-file-Duplication moeglich) und der einteiligen Library **game-of-life** (kein Cross-file-Hebel).

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

## Datenlage

6 Zellen (3 Workflows × 2 Katas), alle bei ≥ min_replicates=5 — 43 Runs im Pool, keine neuen noetig:

| Kata | Workflow | n | Routing-Mix |
|---|---|---:|---|
| claim-office | v6.2 / v6.4 / v6.5 | 8 / 5 / 5 | alle portkey |
| game-of-life | v6.2 | 15 | 5 native + 10 portkey |
| game-of-life | v6.4 | 5 | native |
| game-of-life | v6.5 | 5 | native |

Die game-of-life-Zellen wurden teils nativ (RQ-1.14-Fill), teils portkey (aeltere Workflow-Dev-Runs) gefahren; `controls.model: {any: [...]}` fasst beide als dasselbe Modell zusammen (siehe Caveat).

## Caveats

- **Label-Asymmetrie (kein Routing-Unterschied mehr):** Seit 2026-05-25 laeuft jeder Run im Container ueber `experiments/docker/.env` (Portkey-Gateway via Vertex EU). Die Modell-Labels (`opus-4-7-no-thinking` vs `opus-4-7-portkey-no-thinking`) unterscheiden sich nur in `MODEL_CONFIGS` als CLI-Argument: das Portkey-Label setzt `@vertex-eu-global/...`, das Nicht-Portkey-Label das nackte `claude-opus-4-7`. Das nackte Label produziert seit 2026-05-27 ein `400 x-portkey-config required` (Portkey kann den Provider ohne Prefix nicht aufloesen) — daher kanonisches Modell fuer v6.5-Fill `opus-4-7-portkey-no-thinking`. Die 5 wiederverwendeten v6.4-Runs aus RQ-1.11 tragen das alte Label `opus-4-7-no-thinking`, gingen aber denselben Portkey-Weg; `controls.model: {any: [...]}` fasst beide zusammen.
- **Single-shard fuer v6.5:** Lange iterative End-Refactor-Sessions auf Opus 4.7 × claim-office haben unter parallelen Portkey-Shards ein Cut-Risiko (Memory `portkey-shards-external-cut-risk.md`); deswegen Fill-Runs einzeln fahren.
- **End-Refactor-Pass ist iterativ ohne hartes Limit:** Wenn ein Run viele Verbesserungen findet, kann der End-Pass mehrere Tausend Tokens und Wallclock verbrauchen. Der TDD-Cycle-Anteil ist davon entkoppelt (cycles waren da schon abgeschlossen), aber `duration_seconds` und `total_tokens` werden im Mittel ueber v6.2 liegen.
- **Bundle-Caveat (kausale Lokalisierung):** Der End-Refactor-Agent kombiniert (a) Whole-src-Scope, (b) iterative Mehrfach-Refactorings, (c) Pre/Post-Messung. Wenn v6.5 v6.4 schlaegt, ist nicht voneinander getrennt, ob der zusaetzliche Effekt aus dem Whole-src-Blick oder aus der Mehrfach-Iteration kommt.
- **Routing-Mix (`any:` über Portkey + native):** opus-4-7 wird ueber beide Routings als **dasselbe Modell** behandelt — Code-Qualitaet und Korrektheit sind routing-invariant (gleiche Gewichte, gleiche Outputs). **Aber `duration_seconds` und `total_tokens` sind es nicht:** unterschiedliche Hardware und Caching-Strategie pro Route. In routing-gemischten Zellen (game-of-life v6.2: 5 native + 10 portkey) ist der Kosten-Mean daher ein Misch-Mean und **nicht** als sauberer Vergleich lesbar. Konsequenz fuer findings: Kosten werden pro Routing getrennt ausgewiesen, Kosten-Trophies nur innerhalb gleichen Routings.
- **Quervergleich der Absolutwerte zwischen den Katas ist tabu:** claim-office (Code-Mass ~800) und game-of-life (Code-Mass ~160) werden **nie** gemittelt (Repo-Methodik). Jede Kata bekommt in findings einen eigenen Block; der Workflow-Vergleich findet ausschliesslich *innerhalb* einer Kata statt.

## Status / Naechste Schritte

Abgeschlossen — alle 6 Zellen bei n ≥ 5 (43 Runs). Diese RQ vereint die frueher getrennten claim-office- (RQ-1.12) und game-of-life-Studien (vormals RQ-1.14, jetzt hier aufgegangen). Befund in [findings.md](findings.md): auf **beiden** Katas senkt der per-cycle-Refactor v6.4 die Spitzen-Komplexitaet am staerksten unter v6.2; der End-Refactor v6.5 ist auf claim-office gleichauf mit v6.4, auf der einteiligen GoL-Library jedoch ohne robusten Gewinn (und teuerster). Korrektheit/Disziplin ueberall intakt. Keine globale v6.5-Promotion ueber v6.2; metric-driven Refactor lohnt, der wirksame Hebel-Zeitpunkt ist kata-abhaengig.

## Findings

Siehe [findings.md](findings.md).
