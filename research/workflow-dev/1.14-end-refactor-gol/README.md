---
id: RQ-end-refactor-gol
question: "Haelt der v6.5-end-refactor-Befund (Korrektheit intakt, Code-Qualitaet >= v6.2) auch auf der trainingsbekannten game-of-life-Kata — die Voraussetzung fuer eine globale Baseline-Promotion von v6.5 ueber v6.2?"
factors:
  workflow_x_prompt:
    - {workflow: v6.2-with-why-cleaned, prompt: example-mapping}  # interne Default-Baseline
    - {workflow: v6.5-end-refactor,     prompt: example-mapping}  # End-Refactor-Kandidat
  kata_base: [game-of-life]
controls:
  model: opus-4-7-no-thinking
outcomes:
  # primaer: Code-Qualitaet (End-Refactor zielt auf whole-src Metriken; GoL ist die Quality-Kata)
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - smell_total
  - smell_complexity
  - code_mass
  # Korrektheit (Sanity: auf GoL bei Opus ~100 % erwartet; End-Refactor darf das nicht brechen)
  - tests_passing
  - verification_pct
  - completed_within_budget
  # TDD-Disziplin (Sanity: Per-Cycle-Anteil byte-identisch zu v6.2)
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - tests_passed_immediately
  # Kosten
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-1.14: v6.5-end-refactor vs v6.2-with-why-cleaned auf game-of-life

Liefert der einmalige Whole-src-End-Refactor-Pass auch auf der **trainingsbekannten** game-of-life-Kata einen Code-Qualitaets-Gewinn ueber v6.2 — ohne Korrektheit oder TDD-Disziplin zu beschaedigen?

## Motivation

v6.5 ist auf **claim-office** ueber zwei Modelle validiert (RQ-1.12 opus-4-7, RQ-1.13 opus-4-8): Korrektheit gehalten, niedrigste Spitzen-Komplexitaet, ~v6.2-Tokenkosten. Das macht v6.5 zum staerksten Baseline-Kandidaten seit v6.2 — aber **nur auf einer Kata**.

Eine **globale** Baseline-Promotion ueber v6.2 ist nach der Repo-Methodik erst zulaessig, wenn der Befund auf game-of-life cross-validiert ist. Das Muster "GoL-Sieger ≠ claim-office-Sieger" ist im Lab mehrfach belegt (RQ-1.4 fuer Reduktionen, RQ-1.8/1.9 fuer das Audit-Bundle: GoL-Champion v6.3 kippt auf claim-office von 0.96 auf 0.35). Diese RQ schliesst die Luecke in die andere Richtung: ist der claim-office-Sieger v6.5 auch auf GoL mindestens gleichwertig?

GoL ist hier die **Code-Qualitaets-Kata** (Library-Form, kein CLI-Overhead). Korrektheit ist Sanity-Check — bei Opus auf GoL ~100 % erwartet. Der eigentliche Test ist, ob der End-Pass die Komplexitaets-Metriken auch dort senkt, wo es weniger Cross-file-Duplication gibt als auf der zweiteiligen claim-office-Codebasis (cli.ts + domain.ts). Hypothese aus F-1.12.3: auf einer simpleren, einteiligen Kata koennte der Whole-src-Hebel kleiner sein.

## Workflow-Definition

Identisch zu RQ-1.12 / RQ-1.13. `v6.5-end-refactor` = `v6.2-with-why-cleaned` + `end-refactor`-Subagent (einmaliger Whole-src-Pass nach dem letzten Green-Cycle, metric-driven: ESLint/SonarJS/APP/McCabe, ONE-change-at-a-time). Per-Cycle-Anteil byte-identisch zu v6.2. Vollbeschreibung: `../1.12-end-refactor-effect-v62/README.md`.

## Hypothesen

- **H1 (Korrektheit, Sanity):** v6.5 und v6.2 erreichen beide ~100 % `tests_passing` und `verification_pct` auf GoL. Kein Bundle-Bruch.
- **H2 (Code-Qualitaet):** v6.5 senkt `cognitive_max`, `mccabe_max`, `cc_longest_function` und/oder `code_mass` gegenueber v6.2 auch auf GoL messbar (≥ 1 σ). H2' (schwaecher): der Effekt ist kleiner als auf claim-office, weil GoL weniger Cross-file-Hebel bietet.
- **H3 (TDD-Disziplin, Sanity):** `cycle_count`, `refactorings_applied`, `predictions_correct_rate` von v6.5 innerhalb 1 σ von v6.2.
- **H4 (Kosten):** moderater Token-/Wallclock-Aufschlag von v6.5 durch den End-Pass; auf der kleineren GoL-Codebasis vermutlich geringer als auf claim-office.

**Falsifikation (entscheidend fuer die Promotion):** Wenn v6.5 auf GoL die Code-Qualitaet **nicht** ueber v6.2 hebt (alle Deltas < 1 σ) ODER die Korrektheit/Disziplin verschlechtert, ist v6.5 **kein** globaler v6.2-Ersatz — dann bleibt die Empfehlung claim-office-spezifisch.

## Datenlage zu RQ-Beginn

`controls.model` ist `opus-4-7-no-thinking` (Direct-API / native OAuth). Die vorhandenen GoL-v6.2-Runs im Pool sind opus-4-7-**portkey** und zaehlen wegen des Routing-Unterschieds (anderes `controls.model`-Label) hier nicht. Beide Zellen sind frisch: 2 × n=5 = **10 Runs**.

## Design

```
Faktor:    workflow   — v6.2 / v6.5, prompt = example-mapping fix
Kontrolle: model      — opus-4-7-no-thinking (Direct-API / native OAuth)
Kontrolle: kata_base  — game-of-life

Zellen:    2
Replikate: n = 5
Runs:      10 (alle neu)
```

## Caveats

- **Routing-Wechsel von der urspruenglichen Planung:** RQ-1.14 war zunaechst auf opus-4-7-**portkey** ausgelegt (modell-konsistent zu RQ-1.12). Da die Portkey-Route in `experiments/docker/.env` aktuell deaktiviert ist (Direct-API-Modus; Portkey-Label `@vertex-eu-global/...` gibt sonst "model may not exist"), laeuft RQ-1.14 auf **native opus-4-7** (Direct-API). Gleiches Modell wie RQ-1.12, anderes Routing. v6.2 und v6.5 teilen hier dasselbe native Routing → der **Workflow-Vergleich innerhalb dieser RQ ist sauber**; nur der Quervergleich der Absolutwerte gegen die RQ-1.12-Portkey-Zahlen ist routing-konfundiert (nur Kontext).
- **Single-shard zwingend:** Direct-API-Batches duerfen nicht gesharded werden (Rate-Limit-Druck, Memory `feedback-direct-single-shard`).
- **Subscription-Cap-Risiko (Direct-API):** lange Sessions koennen exit=0-False-Greens erzeugen; vor Aggregation `exit_reason` + `experiment-done.txt` stichprobenartig pruefen.
- **End-Refactor iterativ ohne hartes Limit** (wie RQ-1.12/1.13).
- **GoL-spezifischer Hebel:** einteilige Library-Codebasis → weniger Cross-file-Duplication als claim-office; der End-Pass koennte hier strukturell weniger Angriffsflaeche haben.

## Status / Naechste Schritte

1. Batch-Plan generieren (`batch-plan-from-rq.py`); beide Zellen frisch, 10 Runs.
2. Fill-Batch **single-shard**, Direct-API/native OAuth (kein Portkey).
3. Aggregation via `aggregate-by-query.py`, `findings.md` gemaess `/run-rq` Skill-Konventionen.
4. **Bei H2-Bestaetigung:** v6.5 als globale Default-Baseline in `workflow-construction.md` promoten. **Bei Falsifikation:** Empfehlung claim-office-spezifisch halten.

## Findings

Siehe [findings.md](findings.md) (wird mit Skill `/run-rq` befuellt nachdem n=5 pro Zelle erreicht ist).
