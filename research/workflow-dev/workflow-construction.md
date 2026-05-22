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

RQ-audit stützt das Prinzip direkt: das Audit-Bundle aus dem externen
`claude_orchestration`-Framework hat in v6.5.1 *nur* Rationale-Blocks
und Short-Circuit-Hardening hinzugefügt (keine Reduktion). Ergebnis:
`tests_passed_immediately` 1.4 → 0, `refactorings_applied`-σ ein
Sechstel. Why-Begründung wirkt messbar — auf Kosten von ~15 % Tokens
(siehe Anti-Pattern und Befund unten).

### 2. Reduktion vor Addition

Default-Hypothese: ein Workflow-File enthält zu viel, nicht zu wenig.
Bei der RQ-rules-/RQ-lean-Re-Evaluation hat sich gezeigt, dass mehrere
Inhaltsklassen messbar kosmetisch sind:

- **Pep talks** (`v6.3-no-pep`): "Psychological Resistance", "Trust the
  process", "You will feel resistance" — kein messbarer Effekt.
- **Emojis und Status-Marker** (`v6.4-no-emoji`): 🔴/🟢/🔄/📋 — nur
  dekorativ, kein Effekt.
- **Project-Standards** (`v6.1-no-app`): "TypeScript Best Practices",
  "Hexagonal Architecture", "Named exports only" — irrelevant für die
  Mini-Aufgaben, kein Effekt.
- **Repeated Warnings**: "🚨 USE SKILLS" zwei-, dreimal — einmal reicht.
- **Verbatim-Duplikat-Bullet-Listen** (`v6.5.2-bullets-cut`,
  `v6.5.3-targeted-cuts`, `v6.5.4-refactor-cut-only`): "Remember"-
  Sektionen und DO/DON'T-Listen, die andere File-Sections wortwörtlich
  wiederholen. RQ-bullets/16/17 differenzieren drei Cut-Klassen:
  - **End-of-file "Remember" (10a)**: **Floor-Anker** — letzter Pass
    vor Subagent-Output. NICHT cutten.
  - **Mid-file `refactor.md` DO/DON'T (10b)**: dekorativ und sogar
    *kontraproduktiv* für Komplexität — schwemmt Refactor-Subagent
    mit Noise zu. Cutten ist netto-positiv.
  - **Mid-file `red/SKILL.md` DO/DON'T (10c)**: phasen-spezifischer
    Pred-Hygiene-Anker — Pred-Rate fällt ohne ihn von 99 % auf 96 %.
    NICHT cutten.
  → Streichregel: mid-file-Duplikate cutten **wenn sie keine
  phasen-spezifische Mechanik schützen**. Vor jedem Cut prüfen, ob
  der Block eine messbare Disziplin- oder Format-Garantie absichert.

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

Orthogonal zur Inhaltsfrage. RQ-workflow-tradeoff vergleicht:

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
Pauschal "mehr Isolation = besser" ist falsch (siehe F-workflow-tradeoff.6).

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
   bei n=10 auflösen oder umkehren (siehe RQ-workflow-tradeoff v7-claim-office
   `verification_pct` 1.00 bei n=5 → 0.78 bei n=10).

## Anti-Patterns aus realen Reduktions-Versuchen

### "Bundle-Reduktion" als erste RQ

Eine RQ, die mehrere Reduktionen gleichzeitig testet (z.B.
v6.5-lean = no-app + no-rules + no-pep + no-emoji + Why-Rewrites),
kann nur die Bundle-Wirkung messen — nicht, *welche* Komponente trägt.
Bei positivem Bundle-Effekt bleibt offen: liegt es an der Reduktion
oder an den Why-Rewrites? RQ-lean dokumentiert genau diese Offenheit als
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

### Shared-context-Files für Red/Green sind kein Korrektheits-Hebel auf 4.7

Die intuitive Annahme, dass Red/Green-Subagents besser performen, wenn
sie persistente Spec-Notizen (`example-mapping/<feature>.md`,
`tdd-journal.md`, `architecture-notes.md`) zwischen Aufrufen lesen,
hält empirisch nicht. Auf claim-office × opus-4-7-portkey-no-thinking
(RQ-tdd-correctness, 2026-05-22):

| Workflow | n | verification_pct | duration_s |
|---|---:|---:|---:|
| v4-exact-subagents | 10 | 0.67 | 3693 |
| **v4.1-testlist-scope-fix** | 5 | **0.96** | 3229 |
| v4.2-shared-context | 5 | 0.71 | 4538 |
| v4.2.1-fake-it-green | 2 | 0.70 | ~5500 |

v4.1 fügt *nur* eine "Cover every spec example"-Pflicht zum
test-list-Subagent hinzu — sonst nichts. Damit erreicht es v5/v6-Niveau
(0.96 vs. 0.97 vs. 1.00) bei niedriger Streuung (σ 0.09). v4.2 erbt
diesen Fix UND fügt shared example-mapping für Red/Green hinzu —
trotzdem zurück auf 0.71 mit bimodaler Streuung (σ 0.41). v4.2.1
(Green-Fake-it-Pflicht zusätzlich): keine Verbesserung, +50 %
Wallclock.

Schluss für künftige Workflow-Designs:

- Wenn ein Subagent-Workflow auf novel kata schlecht performt
  (`verification_pct` < 0.8), prüfe ZUERST die Test-Listen-Vollständigkeit
  des `test-list`-Subagents. "Cover every spec example" mit Failure-Mode
  "Missing an entire operation described in the spec" ist die einfachste
  und stärkste Intervention.
- Spec-Sharing in Red/Green-Subagents lädt die Subagents zum
  Re-Interpretieren der Spec ein, statt sich auf den aktivierten Test
  zu konzentrieren. Die Spec gehört in die Test-Liste (durch test-list),
  nicht in Subagent-Memory.
- Wallclock-Aufschlag durch shared-context-Reads ist erheblich (~25–50 %),
  selbst wenn das Journal-Format auf One-Liner reduziert ist —
  Refactor-Phase reagiert insbesondere mit mehr Refactorings, weil
  Fake-it-Green die Komplexität auf Refactor verschiebt.
- v4.2-shared-context und v4.2.1-fake-it-green liegen archiviert in
  `experiments/workflows/_archive/`. Wer ähnliche Architektur-Ideen
  testen will: erst F-model-novel.4 in RQ-model-novel-findings lesen, dann begründen
  warum der Mechanismus diesmal anders ist.

Verweis: F-model-novel.4 in `research/questions/2.2-model-effect-novel-kata/findings.md`.

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
ab RQ-context abgeleitet. Sortiert nach Design-Achse, mit Verweis auf das
zugehörige Finding für Details:

### Architektur (Skill vs Subagent)

- **RQ-context F-context.1 / F-context.2** — Isolation (v4) verbessert Code-Qualität auf
  beiden Katas, aber `verification_pct` *kehrt sich um* (v5 führt auf
  claim-office). → Isolation ist **kein universeller Sieger**;
  task-abhängig.
- **RQ-context F-context.4** — v4 hat kata-spezifische Tail-Risiken (Streuung).
- **RQ-context F-context.5** — `mutation_score` folgt derselben Kata-Inversion wie
  `verification_pct` → Test-Stärke und Aussen-Korrektheit hängen
  zusammen, nicht mit der Architektur-Wahl per se.
- **RQ-workflow-tradeoff F-workflow-tradeoff.1 / F-workflow-tradeoff.2** — v6-hybrid (nur refactor isoliert) erbt den
  v4-Qualitäts-Vorteil und erreicht erstmals 100 % `verification_pct`
  auf claim-office.
- **RQ-workflow-tradeoff F-workflow-tradeoff.3** — v6 ist deutlich teurer in Tokens als beide
  Reinformen (+2.4–2.5×) — Isolation pro Spawn lädt frischen Kontext
  ohne Cache-Vorteil.
- **RQ-workflow-tradeoff F-workflow-tradeoff.4** — v5 kollabiert in TDD-Disziplin auf langen Katas
  (`cycle_count` claim-office: 3.4 vs v4: 37.8). Single-Context faltet
  mehrere rote-grüne Schritte zu Batches.
- **RQ-workflow-tradeoff F-workflow-tradeoff.5** — v6 hat den höchsten `mutation_score` auf beiden
  Katas und auf GoL eine Größenordnung weniger Streuung als v4.
- **RQ-workflow-tradeoff F-workflow-tradeoff.6** — v7 (zusätzliche green-Isolation) ist von v6
  Pareto-dominiert: spart nur Tokens, verliert Quali und
  Korrektheit-außen. → "Mehr Isolation = besser" ist falsch;
  *gezielte* Isolation (nur Refactor) ist das Pareto-Optimum.

### Inhalt (Refactor-Block-Komponenten)

- **RQ-app F-app.1 / F-app.2** — APP-Heuristik (Code-Mass-Berechnung) im
  Refactor-Subagent verbessert Code-Qualität konsistent und verdoppelt
  bis verdreifacht die Stabilität. → **APP-Block bleibt**.
- **RQ-rules F-rules.1 / F-rules.4** — Four Rules of Simple Design haben *keinen*
  messbaren Quali-Effekt, wenn APP + Naming-Eval bleiben. −8.5 %
  Tokens durch Entfernung. → **Four Rules raus**.
- **RQ-pep F-pep.1 / F-pep.2** — Pep-Talks haben keinen Quali-Effekt,
  aber `predictions_correct_rate` fällt um 6.9 pp ohne sie (99.4 % →
  92.5 %). → Pep raus ist *fast* kostenlos, aber Disziplin-Marker
  trifft es. Trade-off explizit machen.
- **RQ-emoji F-emoji.1 / F-emoji.2 / F-emoji.3** — Emojis ohne Effekt auf
  Mittelwerte, leichte Streuungs- und Disziplin-Drift. → Emojis raus
  ist *bedingt* OK auf opus-4-7.

### Procedural Hardening (Rationale + Short-Circuit-Schutz)

- **RQ-audit F-audit.1** — Mandatory-Procedure-Preamble in `red.md` (alle
  sieben Schritte verpflichtend, kein Skip bei vorzeitig grünem Test)
  plus "Wrong Predictions Are Data" (kein retroaktives Backfilling)
  eliminieren Over-Implementation komplett: `tests_passed_immediately`
  1.4 ± 2.27 → 0 ± 0 bei n=10.
- **RQ-audit F-audit.2** — Explizite Rationales in `refactor.md` ("Pflicht
  wegen Measurement-Pipeline", Bisectability-Begründung) plus konkreter
  Refactor-Bar (name tightening / APP mass ≥1 / removable smell)
  heben `refactorings_applied` 6.9 ± 2.33 → 7.8 ± 0.42 — σ ein
  Sechstel.
- **RQ-audit F-audit.4** — Audit-Bundle kostet +15 % Tokens / +16 %
  Wallclock. → Rationale-Addition ist *nicht* kostenlos; "Reduktion
  vor Addition" bleibt Default. Why-Blocks mit Measurement-Pipeline-
  Bezug sind aber die ersten Additions, die das Default-Prinzip
  empirisch rechtfertigen.
- **RQ-audit F-audit.5** — Streuung sinkt fast überall (TDD-Disziplin-σ
  quasi deterministisch, σ Tokens/Duration halbiert). → Hardening
  wirkt primär *streuungsreduzierend*, nicht mittelwert-verschiebend.
- **RQ-bullets F-bullets.1 / F-bullets.2** — Bullet-Cut auf v6.5.1 verbessert Code-
  Qualität (`cognitive_max` 5.6 → 4.0, `mccabe_max` 4.9 → 4.1, σ
  jeweils −30 bis −50 %), hält Disziplin-Mittelwerte, lässt aber σ
  bei `refactorings_applied` und `cycle_count` um Faktor 2–3 steigen.
  → Bullets sind Pattern-Match-*Floor*-Anker: sie tragen nicht den
  Mittelwert, sondern das Worst-Case-Verhalten. Cut ist netto positiv
  für Quality/Cost, negativ für Determinismus.
- **RQ-bullets F-bullets.3** — −38 Workflow-Zeilen erzeugen −15 % `total_tokens`
  (statt der rechnerisch erwarteten <1 %). → Effekt kommt aus
  Sekundär-Wirkungen (kürzere Refactor-Phasen mit weniger Edit-
  Iterationen), nicht aus dem entfernten Text selbst.
- **RQ-targeted F-targeted.1** — Floor-Anker isolierbar auf eine einzige Sektion:
  `refactor.md` "Remember" am Datei-Ende. v6.5.3 (mid-file DO/DON'Ts
  weg, "Remember" behalten) reproduziert v6.5.1's perfekten
  `tests_passed_immediately = 0` und 7er-Refactor-Floor, obwohl 30
  Zeilen Bullet-Text gestrichen sind. → Position (end-of-file) ist
  strukturell tragend, nicht Inhalt.
- **RQ-targeted F-targeted.2** — v6.5.3 ist neuer Quality-Champion: `cognitive_max`
  −37 % vs v6.5.1 (5.6 → 3.5), σ niedrigste über alle drei Varianten.
  Mid-file DO/DON'T-Wiederholungen waren *kontraproduktiv* — sie
  schwemmten den Refactor-Subagent mit Noise zu.
- **RQ-targeted F-targeted.3** — "Remember" treibt Refactor-Tiefe (mehr Iterationen,
  längere Phasen) und damit auch Tokens. v6.5.3 hat 19 % höhere Tokens
  als v6.5.2 trotz nur 8 Zeilen mehr Text. → Floor-Anker hat einen
  Token-Preis, der nicht durch Text-Länge erklärt ist.
- **RQ-targeted F-targeted.4** — `predictions_correct_rate` fällt in v6.5.3 auf
  95.8 % (7 Wrong-Predictions in 10 Runs vs 1–2 in v6.5.1/v6.5.2).
  Vermutete Ursache: `red/SKILL.md`-DO/DON'T-Cut, der den
  Wrong-Prediction-Schutz mitgestrichen hat. → Hinweis darauf, dass
  *manche* mid-file DO/DON'T-Blöcke doch tragen — pro Block testen,
  nicht pauschal cutten.
- **RQ-refactor-cut F-refactor-cut.1** — Hypothese bestätigt: v6.5.4 (10c wieder drin, 10b
  weiterhin weg) liefert **100 %** Pred-Rate (162/162 — perfekt, sogar
  besser als v6.5.1). → `red/SKILL.md`-DO/DON'T ist Pred-Hygiene-Anker,
  nicht dekorativ. Generelle Lehre: *mid-file*-Bullets können tragen
  *wenn sie phasen-spezifische Mechanik schützen* (hier:
  Prediction-Format).
- **RQ-refactor-cut F-refactor-cut.2** — v6.5.4 dominiert v6.5.1 in 7 von 8 Outcomes mit
  σ-Reduktion quer durch (oft −40 % bis −70 %). → Saubere
  Pareto-Improvement: gezieltes Cutten *einer* mid-file
  Bullet-Wiederholung (refactor.md DO/DON'T) bei Erhalt der anderen
  (red/SKILL.md DO/DON'T) ist netto-positiv.
- **RQ-refactor-cut F-refactor-cut.3** — Interaction-Effekt zwischen 10b und 10c:
  `cc_longest_function`-Optimum (v6.5.3: 12.0) braucht beide Cuts; mit
  nur 10b allein (v6.5.4) springt es auf 15.0. → Mid-file DO/DON'T-Blöcke
  wirken nicht unabhängig. `cc_longest_function`-Minimum ist
  Pareto-incompatible mit perfekter Pred-Rate.
- **RQ-delayed-refactor F-delayed-refactor.2** — Der `refactor.md`-Subagent (APP + Naming-Eval +
  Mandatory-Attempt) funktioniert **nur im periodischen TDD-Kontext**.
  Als Einmal-End-Refactor nach Vibe-Coding-Implementation produziert
  *derselbe* Agent gelegentlich schädliche Refactorings: `cognitive_max`
  7.8 ± 4.89 (max 17) vs 4.4 ± 0.97 (max 7) beim nativen Inline-Refactor
  ohne Agent. σ ist 3–8× größer. → Der Agent ist nicht universell
  besser als "Refactor it"; seine Mechanik (Mandatory-Attempt-Pflicht
  + APP-Mass-Optimierung) ist auf den iterativen Mini-Refactor pro
  Cycle ausgelegt, nicht auf den großen Einmal-Refactor.
- **RQ-delayed-refactor F-delayed-refactor.5** — Native Inline-Refactor (v8b: kein Agent, kein APP,
  kein Mandatory-Attempt) ist deterministischer als der Subagent:
  σ `mccabe_max` 0.32 vs 2.54, σ `cognitive_max` 0.97 vs 4.89. → Die
  Mandatory-Attempt-Klausel kauft Disziplin (Refactor-Anzahl) auf
  Kosten von Varianz (welche Refactorings). Im TDD-Kontext stabilisiert
  der Refactor-Trigger via Test-Run das Outcome; im End-Refactor-Kontext
  fehlt diese Korrektur.

### Refactor-Agent außerhalb periodischer TDD-Cycles

RQ-delayed-refactor zeigt, dass `refactor.md` als End-Refactor-Komponente nicht
funktioniert. Wer einen Refactor-Agent für andere Kontexte bauen will
(z.B. "refactor an existing legacy codebase"), sollte daher nicht
einfach `refactor.md` kopieren. Zwei beobachtete Probleme:

1. **Mandatory-Attempt + Mass-Optimierung als Kombination**: der Agent
   muss mindestens einen Refactor machen *und* APP-Mass senken. Wenn
   der Code schon gut ist, optimiert er gegen Mass (Konstanten,
   Bindungen, Invocations) auf Kosten von Cognitive. APP-Mass und
   Verzweigungs-Tiefe sind keine kongruenten Ziele.
2. **Keine Test-Feedback-Schleife pro Atom-Refactoring**: im periodischen
   Kontext läuft `pnpm test` nach jedem Einzel-Refactor (Step 3:
   *"Make ONE improvement at a time. Run tests after each change."*).
   Im End-Kontext führt das Modell tendenziell ein größeres Bundle aus,
   das schwerer rückrollbar ist.

Implikation für künftige Refactor-Agent-Varianten: Mandatory-Attempt
weglassen (im End-Kontext gibt es keine Pipeline-Pflicht), Optimierungs-
Ziel auf Cognitive statt Mass umstellen, und die Atom-Refactor-Regel
explizit ans Test-Verhalten koppeln statt an die Schritt-Liste.

### Generalisierung über Modelle hinweg

- **RQ-emoji-cross-model F-emoji-cross-model.1 / F-emoji-cross-model.2** — **Wichtigste Warnung**: Workflow-
  Reduktionen sind nicht modell-agnostisch. Auf Sonnet-4-6 *vervielfacht*
  Emoji-Entfernung die Korrektheits-Rate; auf opus-4-6 versagen beide
  Varianten gleich. → Reduktions-Befunde aus opus-4-7 *nicht* auf andere
  Modelle übertragen, ohne sie dort zu replizieren.

### Bundle-Validierung + Theory-of-Mind

- **RQ-lean F-lean.1 / F-lean.2** — Das Bundle v6.5-lean (Four Rules raus +
  Pep raus + Emojis raus + Project-Standards raus + Why-Rewrites) ist
  *leicht besser* als v6 auf Code-Qualität und hat den stärksten
  Disziplin-Boost. → Bundle der getesteten Einzel-Reduktionen ist
  tragfähig.
- **RQ-lean F-lean.6** — Drei sinnvolle Workflow-Profile für drei Ziele:
  v6 (wallclock), v6.5-lean (quality), v6.6-leaner (tokens). Kein
  "einer für alles".
- **RQ-lean Limitation** — Reduktion *und* Why-Rewrites in einem
  Schritt geändert → nicht trennbar, welche Komponente trägt. Eine
  "v6.5-no-why"-RQ würde es separieren. → Bei Bundle-RQs immer die
  Offenheit dokumentieren.
- **RQ-audit (Komplement zu RQ-lean)** — nimmt das fertige v6.5-lean und
  addiert *nur* Rationale-Ergänzungen + Short-Circuit-Hardening
  (keine weitere Reduktion). Disziplin-Boost und σ-Reduktion treten
  trotzdem auf → der RQ-lean-Anteil "Why-Rewrites" trägt isolierbar.
  Die in RQ-lean dokumentierte Offenheit ("welche Komponente trägt?")
  ist damit für die Rationale-Komponente positiv beantwortet.

## Verweise

- `experiments/workflows/MARKERS.md` — harte Parser-Anforderungen
  (Skill-Aufrufe, "Red Phase Complete", Prediction-Lines,
  `experiment-done.txt`).
- `~/.claude/skills/skill-creator/SKILL.md` — Quelle des Theory-of-
  Mind-/Why-Block-Prinzips (Zeilen 139, 302).
- `research/questions/4.3-context-engineering/` — Architektur-Achse v4 vs v5
  ohne Inhalts-Änderung.
- `research/workflow-dev/1.1-workflow-tradeoff-hybrid/` — Subagent-Isolations-
  Gradient v4/v5/v6/v7.
- `research/workflow-dev/2.1-app-effect/` — APP-Heuristik tragend.
- `research/workflow-dev/2.2-rules-effect/` — Four Rules raus = reine Reduktion.
- `research/workflow-dev/2.3-pep-effect/`, `research/workflow-dev/2.4-emoji-effect/` — Einzelfaktor-
  Reduktions-RQs.
- `research/workflow-dev/2.5-emoji-cross-model/` — Modell-Generalisierungs-Test
  der RQ-emoji-Befunde (mit Warnsignal).
- `research/workflow-dev/2.6-lean-validation/` — Bundle-Reduktion +
  Why-Rewrites + drei Workflow-Profile.
- `research/workflow-dev/3.1-orchestration-audit/` — externes Audit-Bundle
  (Rationale + Hardening, *ohne* weitere Reduktion) trägt isolierbar
  und kostet ~15 % Tokens.
- `research/workflow-dev/3.2-bullets-cut/` — verbatim-duplikat-Bullets aus v6.5.1
  gestrichen: Quality + Cost gewinnen deutlich, Disziplin-σ verliert
  Faktor 2–3. Quality-Champion v6.5.2 vs Determinismus-Champion v6.5.1
  als zwei verschiedene Profile.
- `research/workflow-dev/3.3-targeted-cuts/` — Floor-Anker auf end-of-file
  "Remember"-Section pinpointed. v6.5.3 (mid-file cuts, end behalten)
  ist neuer Quality-Champion (`cognitive_max` −37 %); Token-Win bleibt
  bei v6.5.2. Drei Pareto-Profile statt einem Champion.
- `research/workflow-dev/3.4-refactor-cut-only/` — F-targeted.4-Hypothese bestätigt:
  `red/SKILL.md`-DO/DON'T ist Pred-Hygiene-Anker (v6.5.4 erreicht
  100 % Pred-Rate). v6.5.4 dominiert v6.5.1 in 7 von 8 Outcomes mit
  σ-Reduktion quer durch — neuer Default-Champion. Zeigt auch
  Interaction-Effekt zwischen 10b und 10c (cc_longest_function-Minimum
  braucht beide Cuts).
- `research/kata-design/kata-construction.md` — Schwester-Doku zur
  Kata-Methodik.
