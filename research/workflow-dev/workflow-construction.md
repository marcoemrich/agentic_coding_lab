# Workflow Construction

Single Source of Truth für TDD-Workflows in diesem Repo. Drei Ebenen in einem File:

1. **[Inventar](#inventar)** — welche Workflow-Varianten sind aktiv, wofür?
2. **[Methodik](#methodik)** — wie baut man einen neuen Workflow / eine Reduktions-RQ?
3. **[Tragende Befunde](#tragende-befunde)** — welche RQ-Ergebnisse stützen die Methodik?

Schwester-Dokus:
- `experiments/workflows/MARKERS.md` — harte Parser-Anforderungen (Skill-Aufrufe, "Red Phase Complete"-String, Prediction-Lines, `experiment-done.txt`).
- `research/workflow-dev/model-recommendation-matrix.md` — pro Modell empfohlener Workflow.
- `research/kata-design/kata-construction.md` — Kata-Methodik.

Historie der vor-v6.1-Workflows + erste Reduktions-Kette (v6.5er, v6.6) liegt unter `experiments/workflows/_archive/` und `research/_archive/workflow-dev-v1/`. Befunde aus dieser Kette sind nicht in dieses File übernommen — die Kette war korrektheits-defekt (siehe Anti-Pattern "Bundle-Reduktion ohne Korrektheits-Stichprobe" unten), und alle Folge-Iterationen liefen auf gebrochenem Workflow. Die jetzige v6.1-Linie ist der Neustart auf reparierter Basis.

---

## Inventar

### Generationen — Architektur-Achse

| Variante | Mechanik | Status / Verwendung |
|---|---|---|
| `v1-oneshot` | Single-Shot, keine TDD-Struktur | Kontrolle für TDD-Effekt |
| `v2-iterative` | Iterativ, keine expliziten Phasen | Kontrolle |
| `v3-basic-tdd` | Inline TDD, kein Skill, kein Subagent | TDD-Basislinie |
| `v4-exact-subagents` / `v4.1-testlist-scope-fix` | Alle Phasen als Task-Subagents (isoliert) | maximale Isolation; v4.1 hat zusätzlich "Cover every spec example"-Pflicht im test-list |
| `v5-exact-single-context` / `v5.1-testlist-scope-fix` | Alles in einem Context | niedrigste Tokens, Disziplin-Kollaps auf langen Katas |
| `v6-hybrid` | Red/Green als Skills, Refactor als isolierter Subagent | erste Hybrid-Variante (Korrektheit-defekt nach Skill-Creator-Eingriff in v6.5-lean, siehe Anti-Patterns) |
| `v6.1-hybrid-testlist-scope-fix` | v6-hybrid + Test-List-Scope-Fix | **Aktuelle Default-Basis für Reduktions-RQs** |
| `v7-hybrid-green-refactor` / `v7.1-...-testlist-scope-fix` | Green und Refactor isoliert | Pareto-dominiert von v6 (RQ-context, v1-Archiv) |
| `v8a-delayed-refactor-agent` / `v8b-delayed-refactor-native` | Oneshot + End-Refactor (Vibe-Coding-Kontrolle) | Kontrolle für "periodisches TDD vs End-Refactor" |

### v6.1-Reduktionslinie (aktuell aktiv)

Alle Varianten leben unter `experiments/workflows/v6.1-*` und differieren nur in den fünf Workflow-Files (`commands/test-list.md`, `commands/red.md`, `commands/green.md`, `agents/refactor.md`, `rules/tdd.md`). Settings, Marker und Subagent-Mechanik identisch zu `v6.1-hybrid-testlist-scope-fix`.

| Variante | Was anders vs Basis | Treiber-RQ | Kernbefund |
|---|---|---|---|
| `v6.1-hybrid-testlist-scope-fix` | — (Basis) | — | Vollständige MUST/CRITICAL/🚨-Imperative + PEP + Emoji |
| `v6.1-no-pep` | "Psychological Resistance"-Sektion und motivierende Inline-Kommentare in red/green raus | [RQ-1.1](1.1-pep-effect-v6.1/findings.md) | Korrektheit invariant auf GOL; +67 % Refactorings, +30 % Wallclock. **Auf claim-office −3 pp Korrektheit** (RQ-1.4) |
| `v6.1-no-emoji` | 95 Decoration-Emojis (✅❌🔴🟢🔄📋🚨⚠️) raus | [RQ-1.2](1.2-emoji-effect-v6.1/findings.md) | Korrektheit invariant auf GOL; +29 % Refactorings, **spart KEINE Tokens** (sogar +8.5 %). **Auf claim-office −20 pp Korrektheit** (1× Komplett-Failure, RQ-1.4) |
| `v6.1-no-pep-no-emoji` | beide Reduktionen kombiniert | [RQ-1.3](1.3-pep-emoji-combined-v6.1/findings.md), [RQ-1.4](1.4-pep-emoji-claim-office/findings.md) | Effekte nicht additiv; kombiniert refactoriert *unter* Baseline. **Auf claim-office −5 pp Korrektheit** |
| `v6.1-with-why` | 3 Why-Blöcke aus v6.5-lean (green.md, red.md Step 7, rules/tdd.md) **bei voll erhaltenen MUSTs** | [RQ-1.5](1.5-why-block-effect-v6.1/findings.md) | Korrektheit invariant auf claim-office (1× Outlier 0.27); +87 % Refactorings, −87 % Smells, Spitzen-Komplexität −37–43 % bei σ −82–90 %; +53 % Wallclock, +22 % Tokens |

### Tragende Inhalte — vor jeder Reduktion schützen

1. **Vier Marker aus `MARKERS.md`** (Skill-Tool-Aufrufe; `Red Phase Complete`-Sentinel; Prediction-Lines per Regex `(- |✅ |❌ )(Correct|Incorrect)`; `experiment-done.txt`).
2. **Predictions-verbatim-Block in `red.md` Step 7** — ohne diesen mergen Cycles die zwei Prediction-Lines zu einer, `predictions_total` halbiert sich.
3. **"Mandatory refactoring attempt" in `refactor.md`** — ohne explizite Pflicht überspringt das Modell die Refactor-Phase auf einfachen Tests; `refactorings_applied` fällt.
4. **APP-Mass-Berechnung in `refactor.md`** — nicht für die Metrik (die wird extern berechnet), sondern weil der explizite Vorher/Nachher-Vergleich das Modell zwingt, Refactorings *messbar* zu machen statt nur kosmetisch.

### Aktuelle Front

- **Default für korrekheits-kritische Arbeit auf claim-office × opus-4-7-portkey-no-thinking:** `v6.1-with-why`. Pareto-dominant auf TDD-Disziplin und Code-Qualität bei invarianter Korrektheit (RQ-1.5 F-1.1, RQ-1.4 F-1.3).
- **Default für Speed/Token-Effizienz, trainingsbekannte Katas:** `v6.1-no-pep` auf GOL. Auf claim-office nicht empfohlen.
- **Default für Methoden-Vergleichs-RQs (Reduktions-Kette):** `v6.1-hybrid-testlist-scope-fix` als Baseline.
- **Niemals als Default verwenden:** `v6.1-no-emoji` und `v6.1-no-pep-no-emoji` auf novel Code mit echten Mehrdeutigkeiten. Beide haben dokumentierte Korrektheits-Brüche auf claim-office.

---

## Methodik

### Leitprinzipien

#### 1. Theory of Mind statt MUSTs (oder neben MUSTs)

Direkt aus `~/.claude/skills/skill-creator/SKILL.md` (Zeilen 139, 302):

> *"Try to explain to the model why things are important in lieu of heavy-handed musty MUSTs. Use theory of mind and try to make the skill general and not super-narrow to specific examples."*
>
> *"Today's LLMs are smart. They have good theory of mind and when given a good harness can go beyond rote instructions."*

Empirisch in [RQ-1.5](1.5-why-block-effect-v6.1/findings.md) bestätigt: Why-Blöcke neben MUSTs (nicht statt) liefern messbar bessere TDD-Disziplin und Code-Qualität. Konkret bei `v6.1-with-why` vs `v6.1-hybrid` auf claim-office:

- +87 % Refactorings, −87 % Smells
- Spitzen-Komplexität (`cognitive_max`, `cc_longest_function`, `mccabe_max`) −37 bis −43 % im Mean, **σ −82 bis −90 %**
- Korrektheit invariant (1× Outlier in 8 Runs, sonst 100 %)

Beispiel-Muster — `red.md` Step 7 in `v6.1-with-why`:

```
You MUST output the full Step 7 block verbatim with `Correct` or `Incorrect`
chosen for each prediction. Do not abbreviate. Do not collapse the two
prediction lines into one.

**Why this format matters:** The block is mechanically parsed to compute
`predictions_correct_rate`. The parser expects two lines matching
`(- |✅ |❌ )(Correct|Incorrect)` per cycle — one for the compilation prediction,
one for the runtime prediction. Collapsing them into a single line, summarizing
them as "both correct", or skipping the block entirely drops the predictions
count for this cycle to zero. Format consistency here directly drives a metric
the experiment measures.
```

Das `MUST output … verbatim` bleibt erhalten; der Why-Block steht **zusätzlich**, nicht ersetzend. Wichtige Lehre: **Why-Blöcke ersetzen Imperative nicht — sie kontextualisieren sie.** Reine Why-Variante (lean-Stil, MUSTs raus) ist hier nicht direkt getestet, aber das v6.5-lean-Bundle hat gleichzeitig MUSTs UND PEP entfernt und brach die Korrektheit; die Effekte sind verflochten (siehe Anti-Patterns).

#### 2. Reduktion vor Addition

Default-Hypothese: ein Workflow-File enthält zu viel, nicht zu wenig. Empirisch bestätigt für mehrere Inhaltsklassen — aber **kata-abhängig**:

- **Pep talks** ([RQ-1.1](1.1-pep-effect-v6.1/findings.md)): "Psychological Resistance", "Trust the process" — auf GOL Code-Qualität invariant, aber Disziplin verschiebt sich (no-pep refactoriert +67 %). Auf claim-office: −3 pp Korrektheit.
- **Decoration-Emojis** ([RQ-1.2](1.2-emoji-effect-v6.1/findings.md)): ✅❌🔴🟢🔄📋🚨⚠️ — auf GOL invariant, **spart KEINE Tokens** (sogar +8.5 %). Auf claim-office: 1/5 Komplett-Failure (Agent stoppte nach Test-List ohne Implementation), −20 pp im Mittel.

**Konsequenz:** Reduktion vor Addition gilt — aber jede Reduktion braucht **separat eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite** (claim-office × n ≥ 5). Reduktionen, die auf GOL "neutral" wirken, brechen auf novel Code regelmäßig. Siehe auch Anti-Pattern "Bundle-Reduktion ohne Korrektheits-Stichprobe".

#### 3. Was *nicht* gestrichen werden darf

Siehe "Tragende Inhalte" im Inventar. Vor jeder Reduktion gegenlesen.

#### 4. Architektur-Achse: Skill vs Subagent

Orthogonal zur Inhaltsfrage. Befunde aus der v1-RQ-Kette (vor v6.1-Rebuild), liegen archiviert in `research/_archive/workflow-dev-v1/1.1-workflow-tradeoff-hybrid/` und sind unter v6.1 nicht re-validiert. Der Pareto-Befund **v6-hybrid (nur refactor isoliert) > v4 (alles isoliert) > v5 (alles single-context)** wird in der aktuellen Linie als Architektur-Default übernommen (`v6.1-*` erbt diese Architektur), eine systematische Re-Validierung auf v6.1-Basis steht aus.

**Lesart aus der archivierten Kette:** Isolation hilft dort, wo Frische-Perspektive Wert hat (refactor sieht Code mit neuen Augen). Sie schadet dort, wo Kontinuität nötig ist (red→green braucht Test-Listen-Kohärenz). Pauschal "mehr Isolation = besser" ist falsch.

#### 5. Mechanismus: `commands/` mit Skill-Tool — bewusste Entscheidung

Alle v6.x-Workflows legen die drei TDD-Phasen als `.claude/commands/{test-list,red,green}.md` ab, ruft sie aber aus `rules/tdd.md` als `Skill({ skill: "..." })` auf. Das ist **kein Mismatch**, sondern bewusste Wahl.

**Grundlage:** Laut [Claude Code Slash-Commands-Doku](https://code.claude.com/docs/en/slash-commands) sind Custom Commands in Skills "merged" — `.claude/commands/<name>.md` und `.claude/skills/<name>/SKILL.md` erzeugen beide `/name` und sind für das Skill-Tool gleichwertig adressierbar. Commands sind explizit **nicht** deprecated ("Your existing `.claude/commands/` files keep working").

**Empirische Bestätigung:** Im RQ-1.5-Baseline-Run mit `commands/` + `Skill({skill: "..."})` waren 61 Skill-Aufrufe (43× `red`, 17× `green`, 1× `test-list`) erfolgreich; alle vier Marker-Metriken (cycle_count=43, predictions_correct_rate=96%, refactorings_applied=17) korrekt populiert.

**Warum nicht auf `skills/<name>/SKILL.md` migrieren?** Skills bieten zusätzlich: Supporting-Files-Verzeichnis, Auto-Invocation via `description`-Frontmatter, `disable-model-invocation`, `paths`-Trigger. Für unsere expliziten `Skill({skill:"..."})`-Aufrufe aus `tdd.md` bringt keine dieser Features einen Mehrwert. Eine Migration wäre kosmetisch und würde das Risiko bergen, dass das `description`-Frontmatter die Skill-Auswahl unbeabsichtigt mit-triggert.

**Konsequenz für Reduktions-RQs:** Workflow-Varianten erben die `commands/`-Struktur unverändert. Skill-Tool-Aufrufe in `rules/tdd.md` zählen weiter als Marker-1 (siehe `MARKERS.md`).

**Caveat-Quelle:** Ein archivierter `/blueprint-audit`-Lauf (v6.5.1, 2026-05-17) flaggte `commands/` + Skill-Aufruf als "wrong mechanism = silent zero metric" und empfahl Migration. Diese Behauptung ist durch obigen Befund klar widerlegt — vermutlich basierte sie auf einer früheren Claude-Code-Version, in der die Merge-Semantik noch nicht galt. Der Audit-Befund ist als historisches Artefakt zu lesen, nicht als aktuelle Empfehlung.

### Vorgehen beim Bauen einer neuen Workflow-Variante

1. **Hypothese formulieren**: welche *eine* Sache wird geändert? "Mehrere Dinge gleichzeitig" macht die Variante nicht testbar.
2. **Baseline kopieren** (in der Regel `v6.1-hybrid-testlist-scope-fix`): `cp -r experiments/workflows/v6.1-hybrid-testlist-scope-fix experiments/workflows/<new-variant>`.
3. **Änderung anwenden** — minimal, in einem Satz dokumentierbar, der in die spätere RQ-README passt.
4. **MARKERS.md gegenlesen** — alle vier Marker noch intakt? Insbesondere bei Reduktionen leicht zu übersehen.
5. **Smoke-Run** (1× game-of-life-example-mapping × opus-4-7-no-thinking, ~5–8 min):
   ```bash
   ./experiments/docker/batch.sh <smoke-plan>
   jq '.summary_metrics | {cycle_count, refactorings_applied,
      predictions_correct, predictions_total}' \
      experiments/runs/<latest>/metrics.json
   ```
   Healthy: `cycle_count ≥ 3`, `refactorings_applied ≥ 1`, `predictions_total ≈ 2 × cycle_count`.
6. Falls Marker brechen → fixen, **nicht** in den n=10-Batch gehen.
7. **n=5 → n=8 oder n=10** in zwei Schritten, nicht in einem Rutsch. Bei n=5 sind Standardabweichungen oft so breit, dass scheinbare Befunde sich bei n=8+ auflösen oder umkehren.
8. **Wenn die Reduktion strukturell ist (Test-List, Refactor-Mandat) oder die RQ Code-Korrektheit berührt**: zusätzlich Korrektheits-Stichprobe auf claim-office-example-mapping × n ≥ 5. GOL-only-Validierung verbirgt Korrektheits-Brüche systematisch (siehe Anti-Pattern).

### Anti-Patterns aus realen Reduktions-Versuchen

#### Bundle-Reduktion ohne Korrektheits-Stichprobe

Eine RQ, die mehrere Reduktionen gleichzeitig testet (z.B. das archivierte `v6.5-lean` = no-app + no-rules + no-pep + no-emoji + Why-Rewrites), kann nur die Bundle-Wirkung messen — nicht, *welche* Komponente trägt. Das ist OK für eine erste Validierung ("kostet uns das Bundle nichts?"), wird aber zur **Katastrophe**, wenn das Bundle auf GOL gemessen wird und einen Korrektheits-Bruch auf novel Code (claim-office) versteckt.

**Konkret passiert:** Die v6.5er-Kette (v6.5-lean, .1, .2, .3, .4 + v6.6) wurde nur auf GOL gemessen und lief ~5 Iterationen auf einem Workflow, der auf claim-office `verification_pct` von 1.00 auf 0.38 senkte. Die gesamte Kette ist als Quelle für Korrektheits-Empfehlungen unbrauchbar; sie steht im Archiv. Die jetzige v6.1-Linie ist der Neustart auf reparierter Basis.

**Lehre:** **Jede Workflow-Iteration braucht eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite** (claim-office-example-mapping × n ≥ 3), auch wenn die RQ primär Code-Qualität misst. Faktor-isolierte RQs (eine Reduktion pro RQ) sind Bundle-RQs vorzuziehen — sie kosten am Ende oft weniger, weil sie die kausalen Pfade direkt liefern.

**Empirisch belegt durch die v6.1-Reduktionslinie:** RQ-1.1 (PEP), 1.2 (Emoji), 1.3 (kombiniert) und 1.4 (claim-office-Stresstest) haben in vier separaten RQs gezeigt, was das v6.5-lean-Bundle in einem Schritt versteckt hatte:
- Einzeleffekte auf GOL waren neutral (passt zur ursprünglichen Bundle-Lesart)
- Auf claim-office bricht die Korrektheit moderat (no-pep) bis katastrophal (no-emoji), und das **Disziplin-Muster kehrt sich um** (Refactor-Sieger ist hybrid statt no-pep)

#### Reduktion ohne Marker-Check

Häufiger Fehler: ein "leaner" Workflow streicht versehentlich den Predictions-verbatim-Block oder die "Mandatory refactoring"-Klausel. Die Runs laufen, aber `predictions_total` oder `refactorings_applied` fallen auf null/halb. Erst beim Aggregieren fällt es auf — dann ist der Batch bereits durch.

**Konsequenz:** nach jeder Reduktion *vor* dem Mehr-Replikat-Batch: Smoke-Run + jq-Check der vier Marker-Metriken (Healthy-Baseline aus MARKERS.md). Siehe Schritt 5–6 in "Vorgehen beim Bauen einer neuen Variante".

#### Subagent ohne Prompt-Kontext

Wenn green oder refactor als Subagent läuft (v4, v6.1, v7), bekommt er *keinen* Memory-Zugriff auf den vorhergehenden Skill-State. Der Aufruf-Prompt muss alles enthalten: file paths, failing test name, current error, passing test count, recent green summary.

In `v6.1-hybrid-testlist-scope-fix/.claude/rules/tdd.md` ist das als Required-Prompt-Context-Block ausformuliert. Wer ein neues Subagent-Workflow baut, sollte dieses Muster übernehmen — sonst halluziniert der Subagent Files oder verfehlt die aktive Test-Phase.

#### Shared-context-Files für Red/Green sind kein Korrektheits-Hebel auf 4.7

Die intuitive Annahme, dass Red/Green-Subagents besser performen, wenn sie persistente Spec-Notizen (`example-mapping/<feature>.md`, `tdd-journal.md`, `architecture-notes.md`) zwischen Aufrufen lesen, hält empirisch nicht. Auf claim-office × opus-4-7-portkey-no-thinking (RQ-tdd-correctness, 2026-05-22):

| Workflow | n | verification_pct | duration_s |
|---|---:|---:|---:|
| v4-exact-subagents | 10 | 0.67 | 3693 |
| **v4.1-testlist-scope-fix** | 5 | **0.96** | 3229 |
| v4.2-shared-context | 5 | 0.71 | 4538 |
| v4.2.1-fake-it-green | 2 | 0.70 | ~5500 |

v4.1 fügt *nur* eine "Cover every spec example"-Pflicht zum test-list-Subagent hinzu — sonst nichts. Damit erreicht es v5/v6-Niveau bei niedriger Streuung. v4.2 erbt diesen Fix UND fügt shared example-mapping für Red/Green hinzu — trotzdem zurück auf 0.71 mit bimodaler Streuung.

**Lehre:**
- Wenn ein Subagent-Workflow auf novel kata schlecht performt (`verification_pct` < 0.8), prüfe ZUERST die Test-Listen-Vollständigkeit des `test-list`-Subagents. "Cover every spec example" mit Failure-Mode "Missing an entire operation described in the spec" ist die einfachste und stärkste Intervention.
- Spec-Sharing in Red/Green-Subagents lädt die Subagents zum Re-Interpretieren der Spec ein, statt sich auf den aktivierten Test zu konzentrieren. Die Spec gehört in die Test-Liste (durch test-list), nicht in Subagent-Memory.
- v4.2/v4.2.1 liegen archiviert in `experiments/workflows/_archive/`. Wer ähnliche Architektur-Ideen testen will: erst den verlinkten Befund lesen, dann begründen warum der Mechanismus diesmal anders ist.

Verweis: F-model-novel.4 in `research/questions/2.2-model-effect-novel-kata/findings.md`.

#### Disziplin-Muster aus GOL nicht auf andere Katas verallgemeinern

Die GOL-basierten Disziplin-Befunde der v6.1-Linie (RQ-1.1, RQ-1.2, RQ-1.3) sehen klar und konsistent aus: "weniger Drumherum → mehr Refactoring → mehr Disziplin". Auf claim-office (RQ-1.4) **kippt das Muster komplett**:

| Metrik | GOL-Sieger (RQ-1.3) | claim-office-Sieger (RQ-1.4) |
|---|---|---|
| `refactorings_applied` | no-pep (7.0) > hybrid (4.1) | **hybrid (11.6)** > no-pep (6.6) |
| `refactorings_applied` (kombiniert) | 3.8 (unter Baseline) | 9.8 (zwischen Reduktionen) |
| `verification_pct` | 100/100/100/100 (alle) | **1.00 nur in hybrid**, sonst 0.80–0.97 |

**Lehre:** Disziplin-Effekte aus trainingsbekannten Katas (GOL) sind kein Beweis für die gleiche Wirkung auf novel Code mit Mehrdeutigkeiten. Vor Recipe-Empfehlungen: auf claim-office gegenchecken.

### Wann eine Workflow-RQ keine Antwort liefern kann

Bei drei Konstellationen verschwendet ein n=10-Batch Tokens, weil das Signal strukturell fehlt:

- **Faktor und Kata kollidieren**: z.B. Refactor-Variante auf string-calculator — die Kata ist zu trivial, `smell_total` ist konstant 0, Komplexitäts-Metriken fluktuieren nicht. Code-Quality-Signal nur auf game-of-life und claim-office.
- **Faktor und Modell kollidieren**: TDD-Disziplin-Faktoren auf Haiku — Haiku hält die Skill-Discipline nicht; alle Workflows kollabieren auf `cycle_count ≈ 3`. Disziplin-Effekte nur sichtbar auf Opus.
- **Faktor ohne Mechanismus-Hypothese**: "v7 könnte besser sein als v6, mal sehen" ist keine RQ. Wenn unklar ist, *welcher* Mechanismus einen Unterschied erzeugen sollte, ist auch unklar, welche Outcomes zu messen sind und welche Cells controlled bleiben müssen. Erst Hypothese, dann Plan.

---

## Tragende Befunde

Empirische Stützen für die Leitprinzipien oben. Geordnet nach Design-Achse.

### Theory-of-Mind / Why-Blöcke

- **[RQ-1.5 F-1.1](1.5-why-block-effect-v6.1/findings.md#f-11)** — Why-Blöcke neben MUSTs (v6.1-with-why): kein Korrektheits-Effekt, aber +87 % Refactorings, −87 % Smells, Spitzen-Komplexität −37–43 %, σ −82–90 %. Hypothese H2 aus RQ-1.5 bestätigt. **Theory-of-Mind hat empirische Stütze aus diesem Repo, nicht nur die Anthropic-Skill-Creator-Doku.**
- **[RQ-1.5 F-1.2](1.5-why-block-effect-v6.1/findings.md#f-12)** — Pro Cycle gleich schnell/teuer; der ~50 % Wallclock-Aufschlag und ~22 % Token-Aufschlag pro Run sind reine Konsequenz des höheren Cycle-Counts, nicht Why-Bloat-Overhead.

### Pep-/Emoji-Reduktion (v6.1-Linie)

- **[RQ-1.1 F-1.1](1.1-pep-effect-v6.1/findings.md#f-11)** — Pep-Talks (`"Psychological Resistance"`, motivierende Inline-Kommentare) auf GOL: Code-Qualität invariant, Disziplin verschiebt sich (`refactorings_applied` +67 %, `tests_passed_immediately` −75 %). +30 % Wallclock, +21 % Tokens.
- **[RQ-1.2 F-1.1](1.2-emoji-effect-v6.1/findings.md#f-11)** — Decoration-Emojis auf GOL: Code-Qualität invariant, leichte Disziplin-Verschiebung wie bei Pep-Reduktion (+29 % Refactorings, −54 % Sofort-Grün).
- **[RQ-1.2 F-1.2](1.2-emoji-effect-v6.1/findings.md#f-12)** — Emojis sparen **keine Tokens** (sogar +8.5 % Tokens, +12 % Wallclock). Der erwartete "Compactness-Gewinn" tritt nicht ein, weil die Token-Last der 95 Emojis im Promille-Bereich liegt.
- **[RQ-1.3 F-1.1](1.3-pep-emoji-combined-v6.1/findings.md#f-11)** — Pep- und Emoji-Effekte **nicht additiv**: kombiniert refactoriert mit 3.8 *unter* Baseline 4.1 (additive Vorhersage wäre ~9.1). `tests_passed_immediately` saturiert bei no-pep-Wert.
- **[RQ-1.3 F-1.3](1.3-pep-emoji-combined-v6.1/findings.md#f-13)** — Kombinierte Reduktion ist auf GOL die schnellste Zelle (−15 % Wallclock vs Baseline), aber zum Preis der reduzierten Refactor-Aktivität, die die Einzelreduktionen als positiv ausgaben.
- **[RQ-1.4 F-1.1](1.4-pep-emoji-claim-office/findings.md#f-11)** — Auf claim-office: nur v6.1-hybrid hat 100 % `verification_pct`. no-emoji bricht auf 80 % (1× Komplett-Failure, Agent stoppte nach Test-List), no-pep auf 97 %, kombiniert auf 95 %. **GOL-Korrektheits-Invarianz übersetzt sich NICHT auf novel Code.**
- **[RQ-1.4 F-1.2](1.4-pep-emoji-claim-office/findings.md#f-12)** — Disziplin-Pattern kehrt sich um: auf claim-office refactoriert hybrid (11.6) am meisten, no-pep (6.6) deutlich weniger. Die GOL-Lesart "weniger Drumherum = mehr Disziplin" ist kata-spezifisch.
- **[RQ-1.4 F-1.3](1.4-pep-emoji-claim-office/findings.md#f-13)** — Recipe-Empfehlung kata-abhängig: GOL → `v6.1-no-pep` als Quality-Choice; claim-office → `v6.1-hybrid` als einzige korrektheits-sichere Wahl.

### Architektur-Achse (auf v6.1 nicht re-validiert)

Die archivierten v1-RQs (`research/_archive/workflow-dev-v1/`) etablierten v6-hybrid als Pareto-Optimum: red/green als Skills (Test-Listen-Kohärenz), refactor als isolierter Subagent (Frische-Perspektive). Die jetzige v6.1-Linie erbt diese Architektur, eine systematische Re-Validierung auf v6.1-Basis steht aus.

Falls auf v6.1 re-validiert werden soll: separate RQ aufsetzen mit v6.1-hybrid (Default), v6.1-all-skills, v6.1-all-subagents als Vergleichszellen. Achtung: das ist eine Architektur-Variation, kein Reduktions-Test — sie fällt nicht unter "Reduktion vor Addition".

### Test-List-Vollständigkeit als Korrektheits-Hebel

- **F-model-novel.4** (`research/questions/2.2-model-effect-novel-kata/findings.md`) — "Cover every spec example"-Pflicht im test-list-Subagent ist die stärkste isolierte Intervention für `verification_pct` auf novel Katas. v4.1 = v4 + dieser eine Fix erreicht v5/v6-Niveau (0.96 vs 0.67). Spec-Sharing in Red/Green hingegen verschlechtert das Ergebnis (v4.2: 0.71).

### Generalisierung über Modelle hinweg

Die v1-Archiv-RQ-emoji-cross-model warnt: Reduktionen sind nicht modell-agnostisch. Auf Sonnet-4-6 vervielfacht Emoji-Entfernung die Korrektheits-Rate; auf opus-4-6 versagen beide Varianten gleich. Die v6.1-Linie wurde primär auf opus-4-7 (no-thinking, Direct API und Portkey) gemessen — Übertragung auf andere Modelle braucht separate Replikation. Aktuelle Modell-Empfehlungen: `model-recommendation-matrix.md`.

---

## Verweise

- `experiments/workflows/MARKERS.md` — harte Parser-Anforderungen.
- `experiments/workflows/_archive/` — Workflow-Files der v6.5er-Kette (v6.5-lean, .1–.4, v6.6) + frühe v6.x.
- `research/_archive/workflow-dev-v1/` — RQs der v1-Generation (RQ-context, RQ-workflow-tradeoff, RQ-app/rules/pep/emoji/lean/audit/bullets/targeted/refactor-cut/delayed-refactor).
- `research/workflow-dev/1.1-pep-effect-v6.1/` bis `1.5-why-block-effect-v6.1/` — aktuelle Reduktions-RQs auf v6.1-Basis.
- `research/workflow-dev/v6-reduction-recipe.md` — Reduktions-Rezept (Schritt-für-Schritt-Methodik aus der ersten v6.5er-Kette, jetzt auf v6.1-Basis re-anwendbar).
- `research/workflow-dev/model-recommendation-matrix.md` — pro Modell empfohlener Workflow.
- `research/kata-design/kata-construction.md` — Kata-Methodik.
- `~/.claude/skills/skill-creator/SKILL.md` — Quelle des Theory-of-Mind-Prinzips (Zeilen 139, 302).
