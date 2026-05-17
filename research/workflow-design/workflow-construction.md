# Workflow Construction

Methodik und Learnings für den Bau und die Reduktion von Workflow-
Varianten in diesem Repo (TDD-Workflows v3 → v7+, Skill- und Subagent-
Architekturen). Zielgruppe: zukünftige Claude-Code-Instanzen, die einen
neuen Workflow bauen, eine bestehende Variante reduzieren oder eine
Workflow-RQ entwerfen. Stand: 2026-05-17.

Schwester-Doku zur Kata-Methodik (`research/kata-design/`). Während
`MARKERS.md` die **harten Parser-Anforderungen** beschreibt, steht hier
das **inhaltliche Design** der Workflow-Files (rules/, agents/,
commands/).

## Worum es geht

Ein Workflow ist ein Satz von Skill-/Agent-/Rule-Files unter
`experiments/workflows/<variant>/.claude/`, der dem Modell die
Arbeitsweise vorgibt — Tool-Mechanik (Skill vs Task-Subagent),
Phasen-Abfolge (Red/Green/Refactor), und inhaltliche Regeln
(Test-Liste, Refactor-Prinzipien, Output-Format).

Workflow-Varianten dienen in diesem Repo *nicht* der produktiven
Nutzung, sondern dem **kontrollierten Vergleich**: Wie wirkt eine
Reduktion auf Code-Qualität, TDD-Disziplin, Tokens? Welche
Inhalte tragen, welche sind kosmetisch? Welche Architektur (Subagent
vs Single-Context) bringt was?

## Leitprinzipien

### 1. Theory of Mind statt MUSTs

Direkt aus `~/.claude/skills/skill-creator/SKILL.md` (Zeilen 139 und
302):

> *"Try to explain to the model why things are important in lieu of
> heavy-handed musty MUSTs. Use theory of mind and try to make the
> skill general and not super-narrow to specific examples."*
>
> *"Today's LLMs are smart. They have good theory of mind and when
> given a good harness can go beyond rote instructions. If you find
> yourself writing ALWAYS or NEVER in all caps, or using super rigid
> structures, that's a yellow flag — reframe and explain the reasoning."*

Konsequenz für Workflow-Files: **Why-Block statt MUST-Block**. Ein
kurzer Satz Begründung, warum etwas wichtig ist, schlägt eine Liste
von Verboten. Das Modell entscheidet dann selbst, ob ein Edge-Case
unter die Regel fällt.

Beispiel — `red.md` Step 7 (verbatim Prediction Format):

- **MUST-Variante** (alt): *"PREDICTIONS MUST be verbatim. Do not
  abbreviate. Do not collapse. Always two lines."*
- **Why-Variante** (v6.5-lean): *"Predictions are parsed as two
  separate lines by the metrics pipeline (see MARKERS.md). Collapsing
  them silently zeros `predictions_total` — the run looks fine but the
  RQ aggregation gets blind spots."*

Die Why-Variante ist kürzer und erlaubt dem Modell zu erkennen, dass
auch *neue* Marker-relevante Formate verbatim bleiben müssen, ohne dass
sie explizit verboten wurden.

RQ-14 stützt das Prinzip direkt: das Audit-Bundle aus dem externen
`claude_orchestration`-Framework hat in v6.5.1 *nur* Rationale-Blocks
und Short-Circuit-Hardening hinzugefügt (keine Reduktion). Ergebnis:
`tests_passed_immediately` 1.4 → 0, `refactorings_applied`-σ ein
Sechstel. Why-Begründung wirkt messbar — auf Kosten von ~15 % Tokens
(siehe Anti-Pattern und Befund unten).

### 2. Reduktion vor Addition

Default-Hypothese: ein Workflow-File enthält zu viel, nicht zu wenig.
Bei der RQ-9-/RQ-13-Re-Evaluation hat sich gezeigt, dass mehrere
Inhaltsklassen messbar kosmetisch sind:

- **Pep talks** (`v6.3-no-pep`): "Psychological Resistance", "Trust the
  process", "You will feel resistance" — kein messbarer Effekt.
- **Emojis und Status-Marker** (`v6.4-no-emoji`): 🔴/🟢/🔄/📋 — nur
  dekorativ, kein Effekt.
- **Project-Standards** (`v6.1-no-app`): "TypeScript Best Practices",
  "Hexagonal Architecture", "Named exports only" — irrelevant für die
  Mini-Aufgaben, kein Effekt.
- **Repeated Warnings**: "🚨 USE SKILLS" zwei-, dreimal — einmal reicht.
- **Verbatim-Duplikat-Bullet-Listen** (`v6.5.2-bullets-cut`): "Remember"-
  Sektionen und DO/DON'T-Listen, die andere File-Sections wortwörtlich
  wiederholen — RQ-15 zeigt: Cut hebt Code-Qualität (cognitive_max −29 %)
  und senkt Tokens (−15 %). Aber Achtung: die Bullets *tragen* die σ-
  Determinismus der Disziplin-Metriken; ohne sie verdreifacht sich σ
  bei `refactorings_applied`. Cut ist ein Trade-off, kein purer Win.

Bevor inhaltlich etwas hinzugefügt wird, prüfen: gibt es einen Block
im File, der ersatzlos gestrichen werden kann?

### 3. Was *nicht* gestrichen werden darf

Aus `MARKERS.md`: vier harte Marker treiben die TDD-Metriken (Skill-
Tool-Aufrufe, "Red Phase Complete"-String, Prediction-Outcome-Lines,
`experiment-done.txt`). Diese sind **vor jeder Reduktion zu schützen**
und nach jedem Smoke-Run zu verifizieren.

Inhaltlich tragend (Wirkung in Daten belegt):

- **Predictions-verbatim-Block** in `red.md` — ohne diesen mergen
  spätere Cycles die zwei Prediction-Lines zu einer; `predictions_total`
  halbiert sich.
- **"Mandatory refactoring attempt"** in `refactor.md` — ohne explizite
  Pflicht überspringt das Modell die Refactor-Phase auf einfachen
  Tests; `refactorings_applied` fällt.
- **APP-Mass-Berechnung** in `refactor.md` — nicht für die Metrik (die
  wird extern berechnet), sondern weil der explizite Vorher/Nachher-
  Vergleich das Modell zwingt, Refactorings *messbar* zu machen statt
  nur kosmetisch.

### 4. Architektur-Achse: Skill vs Subagent

Orthogonal zur Inhaltsfrage. RQ-7 vergleicht:

- **v4** (alles Subagents) — maximale Isolation, fresh context pro
  Phase, höchste Tokens.
- **v5** (alles Single-Context) — geteilter State, niedrigste Tokens,
  Disziplin-Kollaps auf langen Aufgaben (`cycle_count` fällt).
- **v6-hybrid** (nur refactor isoliert) — Pareto-Optimum gemessen:
  beste smell-Reduktion + perfekte `verification_pct` auf claim-office.
- **v7** (green+refactor isoliert) — Pareto-dominiert von v6: spart
  Tokens, verliert dafür Qualität *und* Korrektheit-außen.

**Lesart**: Isolation hilft dort, wo Frische-Perspektive Wert hat
(refactor sieht Code mit neuen Augen). Sie schadet dort, wo
*Kontinuität* nötig ist (red→green braucht die Test-Listen-Kohärenz).
Pauschal "mehr Isolation = besser" ist falsch (siehe F-7.6).

## Vorgehen beim Bauen einer neuen Workflow-Variante

Diese Reihenfolge hat sich bewährt:

1. **Hypothese formulieren**: welche *eine* Sache wird geändert
   gegenüber dem Baseline-Workflow? "Mehrere Dinge gleichzeitig" macht
   die Variante nicht testbar.
2. **Baseline kopieren** (in der Regel `v6-hybrid` oder die nächste
   bestehende Variante mit der gewünschten Tool-Mechanik): `cp -r`
   nach `experiments/workflows/<new-variant>/`.
3. **Änderung anwenden** — minimal, dokumentiert in einem Satz, der
   in die spätere RQ-README passt.
4. **MARKERS.md gegenlesen** — sind alle vier Marker nach der Änderung
   noch intakt? Insbesondere bei Reduktionen leicht zu übersehen.
5. **Smoke-Run** (1× game-of-life-example-mapping × opus-4-7-no-thinking):
   ```bash
   ./experiments/docker/batch.sh <smoke-plan>
   jq '.summary_metrics | {cycle_count, refactorings_applied,
      predictions_correct, predictions_total}' \
      experiments/runs/<latest>/metrics.json
   ```
   Healthy: `cycle_count ≥ 3`, `refactorings_applied ≥ 1`,
   `predictions_total ≈ 2 × cycle_count`.
6. Falls Marker brechen → fixen, **nicht** in den n=10-Batch gehen.
7. **n=5 → n=10** in zwei Schritten, nicht in einem Rutsch. Bei n=5
   sind Standardabweichungen oft so breit, dass scheinbare Befunde sich
   bei n=10 auflösen oder umkehren (siehe RQ-7 v7-claim-office
   `verification_pct` 1.00 bei n=5 → 0.78 bei n=10).

## Anti-Patterns aus realen Reduktions-Versuchen

### "Bundle-Reduktion" als erste RQ

Eine RQ, die mehrere Reduktionen gleichzeitig testet (z.B.
v6.5-lean = no-app + no-rules + no-pep + no-emoji + Why-Rewrites),
kann nur die Bundle-Wirkung messen — nicht, *welche* Komponente trägt.
Bei positivem Bundle-Effekt bleibt offen: liegt es an der Reduktion
oder an den Why-Rewrites? RQ-13 dokumentiert genau diese Offenheit als
Limitation.

**Konsequenz**: Bundle-RQ ist OK als *erste* Validierung ("kostet uns
die Bundle-Reduktion nichts?"). Folge-RQ braucht es, wenn man die
einzelne Komponente isolieren will. Default-Empfehlung: lieber drei
Faktor-isolierte n=5-RQs als eine Bundle-n=15-RQ.

### Reduktion ohne Marker-Check

Häufiger Fehler: ein "leaner" Workflow streicht versehentlich den
Predictions-verbatim-Block oder die "Mandatory refactoring"-Klausel.
Die Runs laufen, aber `predictions_total` oder `refactorings_applied`
fallen auf null/halb. Erst beim Aggregieren fällt es auf — dann ist
der Batch bereits durch.

**Konsequenz**: nach jeder Reduktion *vor* dem n=5-Batch: Smoke-Run
+ jq-Check der vier Marker-Metriken (Healthy-Baseline aus MARKERS.md).

### Subagent ohne Prompt-Kontext

Wenn green oder refactor als Subagent läuft (v4, v6, v7), bekommt er
*keinen* Memory-Zugriff auf den vorhergehenden Skill-State. Der
Aufruf-Prompt muss alles enthalten, was der Subagent braucht: file
paths, failing test name, current error, passing test count, recent
green summary.

In v6-hybrid und v7 ist das im `tdd.md`-File explizit als
Required-Prompt-Context-Block ausformuliert. Wer ein neues Subagent-
Workflow baut, sollte dieses Muster übernehmen — sonst halluziniert
der Subagent Files oder verfehlt die aktive Test-Phase.

## Wann eine Workflow-RQ keine Antwort liefern kann

Bei drei Konstellationen verschwendet ein n=10-Batch Tokens, weil das
Signal strukturell fehlt:

- **Faktor und Kata kollidieren**: z.B. Refactor-Variante auf
  string-calculator — die Kata ist zu trivial, `smell_total` ist
  konstant 0, Komplexitäts-Metriken fluktuieren nicht. Code-Quality-
  Signal nur auf game-of-life und claim-office (siehe Methodology-
  Constraints in README).
- **Faktor und Modell kollidieren**: TDD-Disziplin-Faktoren auf
  Haiku — Haiku hält die Skill-Discipline nicht; alle Workflows
  kollabieren auf `cycle_count ≈ 3`. Disziplin-Effekte nur sichtbar
  auf Opus.
- **Faktor ohne Mechanismus-Hypothese**: "v7 könnte besser sein als
  v6, mal sehen" ist keine RQ. Wenn unklar ist, *welcher* Mechanismus
  einen Unterschied erzeugen sollte, ist auch unklar, welche Outcomes
  zu messen sind und welche Cells controlled bleiben müssen. Erst
  Hypothese, dann Plan.

## Empirische Befunde, die das Design tragen

Die Leitprinzipien oben sind nicht abstrakt, sondern aus den RQs
ab RQ-6 abgeleitet. Sortiert nach Design-Achse, mit Verweis auf das
zugehörige Finding für Details:

### Architektur (Skill vs Subagent)

- **RQ-6 F-6.1 / F-6.2** — Isolation (v4) verbessert Code-Qualität auf
  beiden Katas, aber `verification_pct` *kehrt sich um* (v5 führt auf
  claim-office). → Isolation ist **kein universeller Sieger**;
  task-abhängig.
- **RQ-6 F-6.4** — v4 hat kata-spezifische Tail-Risiken (Streuung).
- **RQ-6 F-6.5** — `mutation_score` folgt derselben Kata-Inversion wie
  `verification_pct` → Test-Stärke und Aussen-Korrektheit hängen
  zusammen, nicht mit der Architektur-Wahl per se.
- **RQ-7 F-7.1 / F-7.2** — v6-hybrid (nur refactor isoliert) erbt den
  v4-Qualitäts-Vorteil und erreicht erstmals 100 % `verification_pct`
  auf claim-office.
- **RQ-7 F-7.3** — v6 ist deutlich teurer in Tokens als beide
  Reinformen (+2.4–2.5×) — Isolation pro Spawn lädt frischen Kontext
  ohne Cache-Vorteil.
- **RQ-7 F-7.4** — v5 kollabiert in TDD-Disziplin auf langen Katas
  (`cycle_count` claim-office: 3.4 vs v4: 37.8). Single-Context faltet
  mehrere rote-grüne Schritte zu Batches.
- **RQ-7 F-7.5** — v6 hat den höchsten `mutation_score` auf beiden
  Katas und auf GoL eine Größenordnung weniger Streuung als v4.
- **RQ-7 F-7.6** — v7 (zusätzliche green-Isolation) ist von v6
  Pareto-dominiert: spart nur Tokens, verliert Quali und
  Korrektheit-außen. → "Mehr Isolation = besser" ist falsch;
  *gezielte* Isolation (nur Refactor) ist das Pareto-Optimum.

### Inhalt (Refactor-Block-Komponenten)

- **RQ-8 F-8.1 / F-8.2** — APP-Heuristik (Code-Mass-Berechnung) im
  Refactor-Subagent verbessert Code-Qualität konsistent und verdoppelt
  bis verdreifacht die Stabilität. → **APP-Block bleibt**.
- **RQ-9 F-9.1 / F-9.4** — Four Rules of Simple Design haben *keinen*
  messbaren Quali-Effekt, wenn APP + Naming-Eval bleiben. −8.5 %
  Tokens durch Entfernung. → **Four Rules raus**.
- **RQ-10 F-10.1 / F-10.2** — Pep-Talks haben keinen Quali-Effekt,
  aber `predictions_correct_rate` fällt um 6.9 pp ohne sie (99.4 % →
  92.5 %). → Pep raus ist *fast* kostenlos, aber Disziplin-Marker
  trifft es. Trade-off explizit machen.
- **RQ-11 F-11.1 / F-11.2 / F-11.3** — Emojis ohne Effekt auf
  Mittelwerte, leichte Streuungs- und Disziplin-Drift. → Emojis raus
  ist *bedingt* OK auf opus-4-7.

### Procedural Hardening (Rationale + Short-Circuit-Schutz)

- **RQ-14 F-14.1** — Mandatory-Procedure-Preamble in `red.md` (alle
  sieben Schritte verpflichtend, kein Skip bei vorzeitig grünem Test)
  plus "Wrong Predictions Are Data" (kein retroaktives Backfilling)
  eliminieren Over-Implementation komplett: `tests_passed_immediately`
  1.4 ± 2.27 → 0 ± 0 bei n=10.
- **RQ-14 F-14.2** — Explizite Rationales in `refactor.md` ("Pflicht
  wegen Measurement-Pipeline", Bisectability-Begründung) plus konkreter
  Refactor-Bar (name tightening / APP mass ≥1 / removable smell)
  heben `refactorings_applied` 6.9 ± 2.33 → 7.8 ± 0.42 — σ ein
  Sechstel.
- **RQ-14 F-14.4** — Audit-Bundle kostet +15 % Tokens / +16 %
  Wallclock. → Rationale-Addition ist *nicht* kostenlos; "Reduktion
  vor Addition" bleibt Default. Why-Blocks mit Measurement-Pipeline-
  Bezug sind aber die ersten Additions, die das Default-Prinzip
  empirisch rechtfertigen.
- **RQ-14 F-14.5** — Streuung sinkt fast überall (TDD-Disziplin-σ
  quasi deterministisch, σ Tokens/Duration halbiert). → Hardening
  wirkt primär *streuungsreduzierend*, nicht mittelwert-verschiebend.
- **RQ-15 F-15.1 / F-15.2** — Bullet-Cut auf v6.5.1 verbessert Code-
  Qualität (`cognitive_max` 5.6 → 4.0, `mccabe_max` 4.9 → 4.1, σ
  jeweils −30 bis −50 %), hält Disziplin-Mittelwerte, lässt aber σ
  bei `refactorings_applied` und `cycle_count` um Faktor 2–3 steigen.
  → Bullets sind Pattern-Match-*Floor*-Anker: sie tragen nicht den
  Mittelwert, sondern das Worst-Case-Verhalten. Cut ist netto positiv
  für Quality/Cost, negativ für Determinismus.
- **RQ-15 F-15.3** — −38 Workflow-Zeilen erzeugen −15 % `total_tokens`
  (statt der rechnerisch erwarteten <1 %). → Effekt kommt aus
  Sekundär-Wirkungen (kürzere Refactor-Phasen mit weniger Edit-
  Iterationen), nicht aus dem entfernten Text selbst.

### Generalisierung über Modelle hinweg

- **RQ-12 F-12.1 / F-12.2** — **Wichtigste Warnung**: Workflow-
  Reduktionen sind nicht modell-agnostisch. Auf Sonnet-4-6 *vervielfacht*
  Emoji-Entfernung die Korrektheits-Rate; auf opus-4-6 versagen beide
  Varianten gleich. → Reduktions-Befunde aus opus-4-7 *nicht* auf andere
  Modelle übertragen, ohne sie dort zu replizieren.

### Bundle-Validierung + Theory-of-Mind

- **RQ-13 F-13.1 / F-13.2** — Das Bundle v6.5-lean (Four Rules raus +
  Pep raus + Emojis raus + Project-Standards raus + Why-Rewrites) ist
  *leicht besser* als v6 auf Code-Qualität und hat den stärksten
  Disziplin-Boost. → Bundle der getesteten Einzel-Reduktionen ist
  tragfähig.
- **RQ-13 F-13.6** — Drei sinnvolle Workflow-Profile für drei Ziele:
  v6 (wallclock), v6.5-lean (quality), v6.6-leaner (tokens). Kein
  "einer für alles".
- **RQ-13 Limitation** — Reduktion *und* Why-Rewrites in einem
  Schritt geändert → nicht trennbar, welche Komponente trägt. Eine
  "v6.5-no-why"-RQ würde es separieren. → Bei Bundle-RQs immer die
  Offenheit dokumentieren.
- **RQ-14 (Komplement zu RQ-13)** — nimmt das fertige v6.5-lean und
  addiert *nur* Rationale-Ergänzungen + Short-Circuit-Hardening
  (keine weitere Reduktion). Disziplin-Boost und σ-Reduktion treten
  trotzdem auf → der RQ-13-Anteil "Why-Rewrites" trägt isolierbar.
  Die in RQ-13 dokumentierte Offenheit ("welche Komponente trägt?")
  ist damit für die Rationale-Komponente positiv beantwortet.

## Verweise

- `experiments/workflows/MARKERS.md` — harte Parser-Anforderungen
  (Skill-Aufrufe, "Red Phase Complete", Prediction-Lines,
  `experiment-done.txt`).
- `~/.claude/skills/skill-creator/SKILL.md` — Quelle des Theory-of-
  Mind-/Why-Block-Prinzips (Zeilen 139, 302).
- `research/RQ-6-context-engineering/` — Architektur-Achse v4 vs v5
  ohne Inhalts-Änderung.
- `research/RQ-7-workflow-tradeoff-hybrid/` — Subagent-Isolations-
  Gradient v4/v5/v6/v7.
- `research/RQ-8-app-effect/` — APP-Heuristik tragend.
- `research/RQ-9-rules-effect/` — Four Rules raus = reine Reduktion.
- `research/RQ-10-pep-effect/`, `RQ-11-emoji-effect/` — Einzelfaktor-
  Reduktions-RQs.
- `research/RQ-12-emoji-cross-model/` — Modell-Generalisierungs-Test
  der RQ-11-Befunde (mit Warnsignal).
- `research/RQ-13-v6.5-lean-validation/` — Bundle-Reduktion +
  Why-Rewrites + drei Workflow-Profile.
- `research/RQ-14-orchestration-audit/` — externes Audit-Bundle
  (Rationale + Hardening, *ohne* weitere Reduktion) trägt isolierbar
  und kostet ~15 % Tokens.
- `research/RQ-15-bullets-cut/` — verbatim-duplikat-Bullets aus v6.5.1
  gestrichen: Quality + Cost gewinnen deutlich, Disziplin-σ verliert
  Faktor 2–3. Quality-Champion v6.5.2 vs Determinismus-Champion v6.5.1
  als zwei verschiedene Profile.
- `research/kata-design/kata-construction.md` — Schwester-Doku zur
  Kata-Methodik.
