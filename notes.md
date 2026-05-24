# Notes

## v6.5 Korrektheits-Rückschlag (Optimierungs-Kette 16.-18.05.2026, Rebuild 22.05.2026)

Lange Quality-Optimierungskette **v6-hybrid → v6.5-lean → v6.5.1-audited → v6.5.2-bullets-cut → v6.5.3-targeted-cuts → v6.5.4-refactor-cut-only** (mit v6.6-leaner) lief vom **16.05. bis 18.05.2026** auf game-of-life und verbesserte Code-Qualität kontinuierlich — v6.5.4 wurde "Quality-Champion" (cognitive_max −29 %, 100 % Pred-Rate).

**Der Rückschlag (entdeckt 18.05.2026):** Erste claim-office-Verifikation von v6.5-lean × opus-4-7 zeigte `verification_pct`-Kollaps von **1.00 (v6-hybrid) auf 0.38 (v6.5-lean)**, defekt in der gesamten Folgekette (0.36–0.73). Die ~5 Iterationen Quality-Tuning liefen auf einem Workflow, der auf novel Code systematisch falsche Ergebnisse produzierte. Debug auf claim-office war nötig, um das Problem überhaupt zu finden — game-of-life-only-Messung der Kette hatte den Bruch zwei Tage lang versteckt.

### Täter 1 — skill-creator SKILL

v6.5-lean wurde mit dem `skill-creator`-Skill umgeschrieben (Ziel: Theory-of-Mind statt Imperative). Konkret entfernt/umformuliert:

- `⚠️ CRITICAL: Skill + Subagent Usage is MANDATORY` → "Why skills are required"-Begründungsblock
- `MUST verbatim`-Anweisung für Predictions → Why-Block zur Parser-Mechanik
- `🚨 INVOKE SKILL` / `DO NOT write...` → schlichte Invoke-Anweisungen
- Checklist + "Remember"-Sektion + TDD-Pep raus
- Four Rules of Simple Design + Integration-with-Project-Standards aus refactor.md raus

Parser-seitig alles safe (keine Marker zerstört). Verhaltens-seitig: Bruch. **Lehre: "parser-safe" ≠ "verhaltens-neutral".**

### Täter 2 (unabhängig) — test-list-scope-fix

Parallel hatte v4 vs v4.1 gezeigt, dass `commands/test-list.md` mit Scope "base functionality ONLY / 3-6 tests" zu wenig Coverage erzwingt; v4.1 nutzt "cover every rule/example/❓ + expected values". Derselbe Fix musste in die neue v6-Basis portiert werden (`v6.1-hybrid-testlist-scope-fix`) — sonst gefixt-gegen-ungefixt-Confound in RQ 4.x.

### Aufräum-Run (neuer langer Optimierungs-Lauf)

- Alte v6.5-Kette → `experiments/workflows/_archive/` (Lookup ignoriert `_`-Präfix)
- Alte RQs (2.x/3.x) → `research/_archive/workflow-dev-v1/`
- Neue Basis `v6.1-hybrid-testlist-scope-fix` = v6-hybrid + test-list-scope-fix (Diff = nur 2 Files: `test-list.md` + zwei "BASE FUNCTIONALITY ONLY"-Reste in `tdd.md`)
- Rezept jedes alten Cuts in `research/workflow-dev/v6-reduction-recipe.md` zur Wiederanwendung auf reparierter Basis
- Neue RQs `1.1-pep-effect-v6.1` … `1.5-why-block-effect-v6.1` re-validieren die Cuts isoliert auf neuer Basis, **mit** claim-office-Smoke (gestartet 23.-24.05.2026)

### Lehren

1. **skill-creator nicht blind auf Workflow-Prompts loslassen.** "MUST"/"CRITICAL"/Imperative wirken bei TDD-Workflows als verhaltens-tragend, nicht nur als Pep — Entfernen kann Korrektheit auf novel Code zerstören, ohne dass Marker oder game-of-life-Metriken etwas merken.
2. **Bundle-Sprünge vermeiden.** v6.5-lean bündelte 4 Einzel-Cuts + Why-Rewrites + Project-Standards-Cut in **einem** Schritt → Täter erst durch Re-Test isolierbar. Einzeln rollen.
3. **Jede Reduktions-Iteration braucht claim-office-Smoke (n≥3)**, auch wenn die RQ primär Code-Qualität untersucht. Game-of-life-only ist methodisch ungenügend.

## Opus 4.6 ≠ Opus 4.7 auf Workflows (Wechsel-Zwang ab ~16.05.2026, RQ 3.1 ausgewertet 22.05.2026)

Arbeitsannahme war: Opus 4.6 und 4.7 liefern auf den Workflows grundsätzlich gleiche Ergebnisse, nur verschoben (4.7 stärker). Daher hätte ein temporärer Modell-Wechsel die Workflow-Befunde nicht verzerren dürfen.

**Stimmt nicht** (RQ 3.1 / `research/questions/3.1-workflow-model-interaction/`, F-workflow-model.1): v4 und v6 **tauschen je nach Modell die Plätze** auf `verification_pct` (claim-office-example-mapping):

| Workflow | opus-4-7 | opus-4-6 |
|---|---:|---:|
| v4-exact-subagents | 0.67 | **0.93** |
| v5-exact-single-context | 0.87 | 0.87 |
| v6-hybrid | **1.00** | 0.68 |

Mechanismus (F-workflow-model.2): v6-hybrid delegiert Orchestrierung an das Modell (Skill-Invocation im shared Context) — das beherrscht 4.7, 4.6 verliert in ~40 % der Runs die Claim-Hälfte. v4 gibt jeder Phase einen expliziten Subagent-Prompt — stützt 4.6, macht 4.7 auf Mehrdeutigkeiten "überkreativ".

**Warum der Wechsel überhaupt nötig war:** Portkey hatte zu dem Zeitpunkt nur 4.6 verfügbar. Mein Direct-API-4.7-Account war nach 2-3 Tagen aktiver v6.5-Optimierungs-Arbeit (15.-18.05.) durch das **Wochen-Ratelimit** aufgebraucht — erste Portkey-4.6-Runs starteten am 16.05., voller Wechsel ab 19.05. (claim-office-Verifikation lief nur noch auf Portkey-4.6). 4.7-Zugriff erst wieder ab ~22.05. Workflow-Arbeit unter Zeitdruck zwang den Wechsel.

**Konsequenz:** Modell-Wechsel innerhalb einer Workflow-Optimierungs-Kette ist **keine kostenlose Substitution**. Pinning des Modells gehört zur Methodik dieser RQs; ein erzwungener Wechsel ist als Confound zu dokumentieren, nicht als "weiterarbeiten mit dem zweitstärksten Opus". Praxis-Empfehlung pro Modell jetzt in `research/workflow-dev/model-recommendation-matrix.md`.

**Lehre für Kapazitätsplanung:** Wochen-Ratelimit auf Direct-API 4.7 ist real und bricht in 2-3 Tagen ein, wenn aktiv reduziert/optimiert wird. Bei Workflow-Arbeit, die strikt 4.7 braucht: entweder Kapazitäts-Puffer einplanen oder vorab klären, ob Portkey die nötige Modellversion anbietet — sonst zwingt die Lage Methodik-Kompromisse.

## n=3 zu klein, "verlässlich ab n=?" (Konsolidierung aus RQ-stability vom 15.05.2026)

Praktische Beobachtung: n=3 ist in vielen Zellen **nicht aussagefähig** — Mittelwerte kippen zwischen Wiederholungen, einzelne Runs dominieren die Statistik. n=5 ist deutlich besser, aber auch noch nicht überall belastbar.

**Was die Daten aus RQ-stability (`research/questions/5.1-workflow-stability/`, n=10 pro Zelle, opus-4-7-no-thinking, game-of-life) sagen:**

- **F-stability.3:** Bei n=3 stimmt die *volle* Workflow-Rangordnung nur in **15-62 %** der Fälle mit der n=10-Wahrheit überein (1000 Trials Subsampling):
  - `code_mass` 15.9 %, `smell_total` 25.2 %, `cc_longest_function` 23.6 %, `mccabe_max` 62.5 %, `cognitive_max` 50.5 %.
  - v4 als "Bester" ist robust erkennbar (>90 %), mittleres Feld (v1/v2/v5) ist mit n=3 nicht trennbar.
- **F-stability.5:** Für Tail-Charakterisierung (P95/P99 von Tokens/Wallclock) ist selbst n=10 zu knapp; **n=30+** wäre nötig.
- **F-stability.7:** `mutation_score`-σ klein genug, dass n=5-7 reicht; v5 ist Ausreißer (σ=0.036, Range 0.84-0.97 → n≥10).

**Faustregel (aus den vorhandenen Subsampling-Daten, GoL/4-7):**

| Aussage-Typ | Notwendiges n |
|---|---|
| "Workflow A ist Sieger" bei großem Abstand (Faktor ≥3 in μ) | n=3 reicht |
| Drei-Workflow-Vergleich, mittleres Feld | n≥7 |
| Volle Rangordnung über 5+ Workflows | n=10 zeigt schon Restunsicherheit |
| Tail-Quantile (P95/P99, Worst-Case-Budget) | n≥30 |
| Hoch-σ-Workflows (v5 auf Tokens, v5 auf mutation_score) | n≥10 |
| Korrektheits-Smoke (binär, claim-office unter v6-hybrid) | n=3 reicht wenn alle grün; bei Mix muss n≥5 |

**Was offen ist:** Die Subsampling-Antwort ("ab welchem n verlässlich") ist **modell-, kata- und metrik-spezifisch**. RQ-stability-Daten gelten für opus-4-7-no-thinking × game-of-life × Code-Komplexität. Übertragung auf claim-office (Korrektheit) und andere Modelle ist nicht gemessen — Caveats (a)/(b) im RQ-README dokumentieren das.

**Konsequenz für Praxis:**
- Default für neue RQs: `min_replicates: 5` statt 3. n=3 nur für binäre Sanity-Checks ("läuft überhaupt grün?").
- Bei kleinen erwarteten Effekten oder Vergleich im mittleren Feld: n=7-10 einplanen.
- Bei Tail-Aussagen (Budget-Planung, Worst-Case-Latenz): n=30+ oder explizit als "grobe Schätzung" markieren.
- Bei Workflow-Optimierungs-Iteration mit kleinem n vorsichtig sein — F-stability.3 zeigt, dass mittlere Rangwechsel zwischen Iterationen reines Sampling-Artefakt sein können (Bezug zum v6.5-Setback oben: dort hat v6.5.3 mit n=1 angeblich gewonnen, war aber statistisch leer).

## v4-Wallclock × Single-Shard-Pflicht = zähe Arbeit (akut während v6.5-Optimierung 16.-22.05.2026)

v4-exact-subagents ist auf Wallclock der teuerste Workflow: typisch ~14 min/Run, Worst-Case **~65 min/Run** (RQ-stability F-stability.5, wallclock-σ=984 s, einzelner Run 3923 s = 5× Median). Grund: vier Phasen (test-list/red/green/refactor) als isolierte Task-Subagents, jede mit eigenem Context-Cold-Start.

**Sharding-Constraint:** Direct-API-Batches müssen single-shard laufen ([[feedback-direct-single-shard]]) — bei Rate-Limit-Hit verliert man sonst alle parallelen Container synchron (Backoff 60 s → 5 min → 30 min → 1 h → 2 h). Risiko, viele Runs zu verlieren, ist bei v4 besonders hoch, weil jeder verlorene Run teuer nachzuholen ist.

**Konsequenz für eine v4-RQ-Zelle (n=5):**
- Sequenziell: 5 × 14 min = **70 min** typisch, Worst-Case 5 × 65 min ≈ **5,4 h**.
- Plus Subagent-Schwergewicht (~2,5 M Tokens/Run) frisst Wochen-Ratelimit doppelt.
- Mehrere Modelle/Prompts in einer RQ → leicht **Tage** Wallclock pro Refill.

**Praktischer Pain:** lange Wartefenster (oft mehrere Stunden bis zum nächsten Zwischenergebnis), kein paralleles Vorankommen, jeder Rate-Limit-Hit verlängert um 1-2 h. Bei v6.5-Setback (oben) zwang das zusätzlich den Modell-Wechsel auf Portkey-4.6 — was wiederum die Workflow-Befunde verzerrte (siehe Opus-4.6-vs-4.7-Block).

**Lehren / Mitigations:**
- v4-Zellen früh planen, nicht ans Ende einer RQ-Pipeline; bei Verzögerung blockiert v4 die ganze RQ.
- Wenn die RQ es zulässt: v4-Zellen auf Portkey-Variante umziehen (`opus-4-7-no-thinking-portkey`), dann sharden. Vorab prüfen, ob die exakte Modellversion auf Portkey verfügbar ist (siehe Opus-4.6-vs-4.7-Block — Modellwechsel innerhalb einer RQ ist nicht frei).
- Bei n-Hochstufung (siehe vorherigen Block) den v4-Multiplier beachten: n=10 für v4-Direct = sehr großes Zeitbudget. Eventuell v4 bei niedrigerem n belassen, andere Workflows höher.
- v4-Workflow-Iterationen vermeiden, wenn die Änderung nicht spezifisch v4 betrifft — dieselbe Reduktion zuerst auf v5/v6 testen (kürzere Wallclock), dann gezielt v4 verifizieren.

## Kata-Aufarbeitung — von Trainings-bekannten Trivial-Katas zu novel + externer Verifikation (April-Mai 2026)

Ausgangspunkt der ganzen Aufarbeitung war: die ursprüngliche Kata-Auswahl war methodisch schwach. Drei verkettete Probleme:

**(1) Triviale Katas → One-Shot statt TDD-Messung (Drop am 04.05.2026):** string-calculator und pixel-art-scaler waren so klein (string-calculator ~3 LoC Lösung), dass alle Workflows — auch v1-oneshot — sie korrekt one-shotten konnten. Damit messen sie keinen TDD-Effekt: jeder Workflow erreicht 100 % Korrektheit, Smell-Counts sind 0, kein Signal zwischen den Zellen. Zusätzlich nie-gelaufene Katas (chimera-score, diamond, word-score) raus. Reduktion 137 Runs → 68 Runs.

**(2) Trainings-Bekanntheit → Lösungs-Verzerrung (game-of-life ist Trainingsdaten):** Game of Life ist eine der bekanntesten Katas; die kanonische Lösung steht in Trainingsdaten praktisch jedes LLM. Konsequenzen:
  - Workflow-Effekte können durch "Modell kennt die Lösung schon"-Bias maskiert werden — v1-oneshot funktioniert auf GoL ungewöhnlich gut.
  - TDD-Hints in Prompts wirken als Trigger (Data-Poisoning); deshalb **10.04. TDD-Hints entfernt**, **02.05. zusätzlich vitest-Hints entfernt**.
  - **Trotzdem nutzbar** für Untersuchungen, die genau diesen Bias kontrollieren oder nicht treffen: Code-Qualitäts-Vergleiche (Form der Lösung) bei konstantem Kata, Reduktions-Validierungen (Bias konstant über Iterationen).
  - **Untauglich** für Korrektheits-Aussagen über "kann der Workflow novel code?" — dafür braucht es novel Katas.

**(3) Interne Tests sind nicht verlässlich genug — externe Verification-Suite nötig:** Internes Vitest aus dem Run misst, ob das Modell seine eigenen Tests grün bekommt, nicht ob die Lösung korrekt ist. Beobachtetes Failure-Pattern: Modell schreibt nur Tests für die einfache Hälfte der Spec, implementiert nur diese Hälfte, alle Tests grün — Korrektheit aber 50 %. `tests_passing = true` bei `verification_pct = 0.5` ist real (siehe RQ 3.1 / claim-office, wo opus-4-6 in ~40 % der v6-Runs die Claim-Hälfte komplett auslässt; `tests_total` 19-23 weil interne Tests nur Quote abdecken).

**Lösung: claim-office-Kata + Verification-Suite (08.05.2026):**
  - Eigens entwickelte Versicherungs-Domäne (HPSMV/MHPCO), garantiert nicht in Trainingsdaten.
  - CLI-basiert (stdin/stdout JSON), zwei Operationen (`quote` + `claim`) mit konstruierten Mehrdeutigkeiten.
  - Externe Verifikations-Suite (`experiments/katas/claim-office-verification/`): 15 Szenarien `*.input.json`/`*.expected.json` (+ Stories), läuft auf dem Host nach dem Container-Run, der Agent sieht die Suite nie.
  - Generischer Mechanismus für CLI-Katas (`runner.json` + `scenarios/`); analog für GoL-CLI nachgezogen (13.05./14.05.).
  - Metrik `verification_pct` (Float 0.0-1.0) als externes Korrektheits-Maß **zusätzlich** zu `tests_passing`.

**Lehre:** Ohne externe Verifikation hätten die v6.5-Quality-Wins als methodisch sauber gegolten — der Korrektheits-Bruch (siehe ersten Block) wurde nur sichtbar, weil claim-office eine externe Suite hat. Auf game-of-life-only (interne Tests) waren v6.5.x alle grün.

**Aktive Kata-Rollen (Stand 24.05.2026):**

| Kata | Eigenschaft | Geeignet für |
|---|---|---|
| `claim-office` | novel, externe Verification-Suite | Korrektheits-Messung, Workflow-Smoke auf novel Code |
| `claim-office-lite` | novel, reduzierte Suite (10 Szenarien) | Code-Qualität auf novel Code (nicht für Korrektheit — saturiert/kollabiert je nach Stil) |
| `game-of-life` | trainings-bekannt, externe Suite | Code-Qualität, Reduktions-Validierung (Bias kontrollieren) |
| `mars-rover` | trainings-bekannt | bisher kaum genutzt |

**Konsequenz für RQ-Design:** Kata-Zuordnung explizit nach Forschungsfrage (siehe CLAUDE.md): claim-office → Korrektheit, game-of-life → Code-Qualität. Nie Workflow-Optimierungen rein auf game-of-life messen ohne claim-office-Smoke (Lehre aus v6.5-Setback).

## Anfangs keine RQ-Disziplin → Full-Matrix-Falle (Februar 2026, RQ-Struktur eingeführt 04.05.2026)

In der Initialphase (Februar 2026) gab es keine explizit formulierten Forschungsfragen. Stattdessen wurde versucht, **alle Parameter mit allen zu kombinieren** — Workflows × Katas × Prompt-Styles × Modelle × n=3 Replikate als ein großer Matrix-Run. Resultierende Größenordnung der Voll-Matrix:

```
7 Katas × 3 Prompts × 5 Workflows × 2 Modelle × n=3 = 630 Runs
```

Tatsächlich gelaufen wurden ~235 Runs (alte Studie, Stand 11.02.2026, archiviert in `old_runs/all-runs-statistics-*.md`) — die volle 630er-Matrix wurde nie vollendet. Mit Direct-API-Wochen-Ratelimit (siehe Opus-4.6-vs-4.7-Block oben: ~2-3 Tage aktive Arbeit, dann Wochen-Wartezeit) wären für 630 Runs **mehrere Wochen Wallclock** nötig gewesen — Hinzunahme von v4 (~14 min typisch, 65 min worst-case) und die Single-Shard-Pflicht (siehe v4-Wallclock-Block) hätten das nochmal mehrfach gestreckt.

**Was an einer Full-Matrix ohne RQ-Disziplin schief geht:**
- **Falsche Frage-Vielfalt:** Eine Matrix beantwortet keine spezifische Frage, sondern liefert eine n-dimensionale Tabelle, die jeden möglichen Interaktions-Effekt vermengt. Ohne RQ ist nicht klar, welche Confounds kontrolliert werden müssten.
- **Kosten skalieren multiplikativ:** Jede zusätzliche Faktor-Stufe kostet ×N Runs. Eine isolierte Frage ("Workflow-Effekt bei festem Modell und Kata") kostet 5×3 = 15 Runs statt 630.
- **Befunde lassen sich nicht sauber zuordnen:** Im 235-Run-Bestand wurden im Nachhinein 21 Befunde aus den Daten extrahiert (`research/_archive/findings-validation-2026-05-04/old-findings.md`). Diese mussten am 04.05.2026 mühsam auf neue RQs verteilt und gegen frische Daten re-validiert werden (✅ haltbar / ⚠️ revidiert / ❌ verworfen / 🚫 nicht prüfbar pro Befund).
- **Trivial-Kata-Anteil bleibt unsichtbar:** Wenn pixel-art-scaler und string-calculator dasselbe Gewicht in der Matrix haben wie game-of-life, dominieren sie die Mittelwerte und maskieren echte Workflow-Unterschiede (Lehre aus Kata-Block oben).

**Wende am 04.05.2026 — RQ-driven Struktur:**
- Fünf initiale RQs eingeführt, jede mit explizitem Faktor + Kontrolle + Outcomes-Liste im Frontmatter.
- `batch-plan-from-rq.py` generiert nur die für die jeweilige RQ benötigten Runs (typisch 15-50 statt 630).
- `aggregate-by-query.py` zieht runs aus dem flachen Pool, die zum RQ-Selektor passen — Re-Use von Runs über RQs hinweg ist explizit.
- Findings werden pro RQ geführt, nicht als Master-Tabelle.
- Pre-existierende 235-Run-Daten in `research/_archive/findings-validation-2026-05-04/`, alte Befunde re-evaluiert und auf RQs verteilt (siehe Mapping-Tabelle dort).

**Lehre:** Vor jedem Refill **erst RQ formulieren** (Frage + ein Faktor + Kontrollen + erwartete Outcomes), dann minimalen Plan generieren. Voll-Matrix-Denken ist bei Rate-Limit-beschränkter API praktisch undurchführbar und liefert methodisch schwächere Befunde als gezielte Einzel-RQs. Faktor-Produkt × n × v4-Wallclock vorher rechnen — wenn > 1-2 Tage Wallclock, RQ enger schneiden oder auf Portkey-Routing umziehen.

## Wiederkehrende Mess-Bugs → stille Null-Werte in Metriken (laufendes Thema Feb-Mai 2026)

Über die gesamte Projektlaufzeit wiederkehrend: einzelne Metriken zeigen 0 oder null, **manchmal korrekt** (Workflow misst die Phase wirklich nicht), aber **meist Mess-Bug**. Charakteristisch: der Bug schreit nicht — Batches laufen sauber durch, Aggregation produziert Zahlen, nur eben falsche. Erkennen geht nur über Sanity-Checks (plötzliche Schritte zwischen Workflows / Versions / Container-Builds) oder durch RQ-Befunde, die zu seltsam aussehen, um echt zu sein.

**Konkret aufgetretene Bug-Klassen (chronologisch, Auswahl der lehrreichen Fälle):**

| Datum | Bug | Symptom | Ursache | Folge |
|---|---|---|---|---|
| 02.05.2026 | Transcript-JSONLs nicht in Run-Dir kopiert | TDD-Metriken null in 91/93 Runs (smart-subset) | `save_transcript()` fehlte in `run-batch.sh` | post-hoc enrich nötig |
| 02.05.2026 | ESLint+SonarJS im Container nicht installiert | `smell_*=0` in 89/89 Runs | `package.json`-Heredoc ohne eslint-Deps | post-hoc nachgerüstet, später ins Image gebacken |
| 03.05.2026 | Rate-Limit-False-Positive | Runs als rate-limited markiert | Timestamp `backup.<ms>.json` enthielt Ziffernfolge `429` | Match-Pattern auf `\b429\b` + `claude_exit != 0` |
| 09.05.2026 | awk PCRE im Container | `cc_functions=0` in **allen** Container-Runs | analyze-run.sh nutzte `\s`/`\w` (PCRE), Container-`mawk` nur POSIX | Fix POSIX-Klassen + `gawk` als Doppelabsicherung |
| 09.05.2026 | v3 Phase-Inferenz fehlte | `cycle_count`/`refactorings_applied=0` für v3 | kein Phasen-Extraktor für inline-TDD (kein Skill, kein Subagent) | `infer_phases_from_tool_sequence()` neu |
| 09.05.2026 | v5 Predictions-Regex | `predictions_correct=0` | Plan-Patch emittierte `✅ Correct`, Regex matchte nur `- Correct` | `(?:-\|✅\|❌)` als Alternative; v5-Runs rerun |
| 09.05.2026 | v4 Predictions-Compliance | v4 ~0.7 Predictions/Cycle vs. v5 ~2.0 (Compliance-Artefakt, kein Disziplin-Signal) | v4 `red.md` Step 7 hatte nur eine Prediction-Zeile + kein "MUST verbatim" | Step-7 + Subagent-Spawn-Templates erweitert; v4-Runs rerun |
| 10.05.2026 | claim-office cc_* nur aus `cli.ts` | Single-File-Aggregation versteckt Multi-File-Code | analyze-run.sh aggregierte nicht über alle non-spec `.ts` | Multi-File-Aggregation + neues Feld `median_loc_per_function` |
| 10.05.2026 | `tests_passing` grep `"passed"` matchte `"X failed \| Y passed"` | tests_passing=true bei tatsächlich roten Tests (2 Runs betroffen) | grep ohne Vitest-Summary-Anker | Match auf `^\s*Tests\s+.*passed` UND nicht `failed` |
| 10.05.2026 | Container-pnpm 11 blockt esbuild-Build | `tests_passing=false` in 27 real grünen Runs | pnpm@latest=11 + `ERR_PNPM_IGNORED_BUILDS` | `pnpm.onlyBuiltDependencies` in Templates; pnpm 9.15.9 pin |
| 12.05.2026 | `cli_built=false`-Artefakt | claim-office-Runs ohne CLI als Test-Failure markiert | Prompt erzwang `src/cli.ts` nicht hart genug | Prompt-Hardening + Nudge im analyze-run |
| 14.05.2026 | analyze-run installierte pnpm-Deps nicht automatisch | tests_passing=null bei Re-Analyse alter Runs | fehlende `node_modules` → vitest crash | auto-install in analyze-run.sh |

**Strukturelle Ursachen (wiederkehrend, nicht datums-spezifisch):**

- **Workflow-Marker fehlt → stille Null** (siehe `experiments/workflows/MARKERS.md`): Vier hardcoded Marker treiben alle TDD-Metriken. Wird einer beim Workflow-Edit übersehen, läuft der Batch sauber, Aggregation zeigt die Spalte als 0 — kein Fehler-Signal. Pre-Edit-Check `MARKERS.md` lesen ist Pflicht.
- **Container ≠ Host:** Tools im Container (`mawk` statt `gawk`, anderes `pnpm`, kein Host-`~/.claude`) müssen explizit gepinnt werden. Bugs treten in Container-Runs auf, nicht beim lokalen Test.
- **Workflow-Änderung verändert Metrik-Output:** v4/v5-Beispiele zeigen, dass derselbe Parser-Regex je nach Workflow-Generation andere Hit-Raten produziert. Workflow- und analyze-run-Änderungen versionieren sich gemeinsam — Cross-Version-Vergleiche brauchen Pipeline-Audit.

**Debug-Pattern (was wiederholt funktioniert hat):**

1. **Spot-Check vor Aggregation:** `jq '.final_metrics | {cycle_count, refactorings_applied, predictions_correct, predictions_total, tests_passing}'` auf den letzten Run. Healthy für TDD-Workflows: `cycle_count≥3`, `refactorings_applied≥1`, `predictions_total ~ 2 × cycle_count`. Alles 0 → Bug oder echter Workflow-Ausfall.
- 2. **"Plötzliche Schritte"-Diagnose:** Wenn Metrik X zwischen zwei Workflow-Versionen / Container-Builds sprunghaft auf 0 fällt, ist es fast immer Pipeline, nicht Verhalten.
3. **Erst Pipeline prüfen, dann Befund glauben:** Vor "v4/v5 verhält sich plötzlich anders"-Schluss immer `analyze-run.sh`-Diff und Container-Image-Diff zum letzten gesunden Stand prüfen (steht so auch in MEMORY.md).
4. **Run-Completion-Signal ist `metrics.json | jq .run_status.exit_reason`**, nicht `analysis-report.md`-Existenz. Beim Aufräumen unfertiger Runs sonst Datenverlust.

**Lehre:** Mess-Pipeline ist genauso Forschungsobjekt wie der Workflow. Jeder Pipeline-Fix invalidiert die zuvor erhobenen Werte der betroffenen Metrik — entweder rerun oder explizit als "vor Fix X" markieren. Stille Nullen sind der teuerste Bug-Typ, weil sie nie als Fehler erscheinen, nur als "Workflow ist halt schwach hier".

## Claude-Code-CLI-Version-Pinning-Hölle (Februar-Mai 2026, aktueller Pin 2.1.107)

Jeder CLI-Version-Bump bricht etwas anderes, und das Symptom ist nie ein klarer Fehler. Konkrete Inzidenten:

- **2.1.37 (Februar 2026):** Hängt indefinit auf `claude --print`, wenn cwd ein `.claude/agents/`-Verzeichnis enthält (v4-exact-subagents-Workflow). Symptom: `run.log` 0 bytes, exit 124 nach Timeout. Betrifft Haiku, Sonnet, Opus gleichermaßen — also kein Modell-Issue, sondern CLI-Bug. Tage verloren mit falschen "Modell-ist-defekt"-Hypothesen, bevor die CLI als Täter klar war.
- **2.1.126 (Ende April):** Regrediert; will `~/.claude.json` als Datei (Geschwister von `.claude/`-Verzeichnis), die wir nicht provisionieren → silent exit ohne Output. Wieder kein Error-Signal, nur leerer Output.
- **2.1.107 (aktueller Pin):** Verifiziert: Smoke-Test v3+Sonnet 28 s, v4+Opus-4.7+thinking 569 s — alle OK.

**Lehre:** Beim Image-Rebuild **immer** `docker compose build batch && docker run --rm --entrypoint claude docker-batch --version` zur Verifikation, dann v3-Smoke + v4-Smoke (v4 hat den Subagent-Code-Pfad, der vom CLI-Bug 2.1.37 getroffen wurde). Version-Bump nicht ohne diesen End-to-End-Test einchecken. CLI-Versions-Fehler präsentieren sich als stille Hänger / leerer Output — das Pattern "es läuft, aber Ergebnis ist null" gilt auch hier (siehe Stille-Null-Block oben).

## Workflow-Pipeline-Kopplung → erzwungene Reruns (09.05.2026)

Workflow-Definition und Metrik-Parser sind gekoppelt. Wenn der Parser-Regex ändert, muss der Workflow das Format produzieren, das er erwartet — und umgekehrt. Konkret betroffen am 09.05.2026:

- **v4-Predictions-Compliance:** v4 `red.md` Step 7 hatte nur **eine** Prediction-Zeile + kein "MUST verbatim". Resultat: v4 markierte ~0.7 Predictions/Cycle vs. v5 ~2.0. Der vermeintliche v4-vs-v5-Disziplin-Unterschied war reines Compliance-Artefakt, kein Verhaltens-Signal. Fix erforderte **Rerun aller v4-Runs** für gültige Predictions-Vergleiche.
- **v5-Predictions-Regex:** Plan-Patch erzeugte `✅ Correct`-Format, Regex matchte nur `- Correct` (v4-Style). Fix `(?:-|✅|❌)` als Alternative, Workflow-File-Erweiterung für zwei Prediction-Zeilen — **Rerun aller v5-Runs** nötig.

**Doppelte Kosten:** Pipeline-Fix selbst ist billig (Minuten Code-Change), die invalidierten Runs müssen aber komplett neu gefahren werden. Mit v4-Wallclock-Multiplier (siehe v4-Block oben) und Direct-API-Single-Shard-Pflicht waren das mehrere Tage Nach-Arbeit pro Fix. Vorher-Werte bleiben in den Run-Dirs liegen und müssen explizit als "vor Pipeline-Fix X" markiert werden, sonst kontaminieren sie spätere Aggregationen.

**Lehre:** Pipeline-Fix-Kosten enthalten den Rerun, nicht nur die Code-Änderung. Bei Plan-Änderungen am Workflow, die das Output-Format betreffen, vor dem Commit klären: welche Metriken werden invalidiert, welche Runs müssen rerunnen, lohnt sich der Fix bei der erforderlichen Wallclock überhaupt? Bei v4-Reruns: zuerst auf v5/v6 verifizieren (kürzere Wallclock), v4 nur gezielt zum Schluss.

## Container-Setup-Falle: Host-`~/.claude` lässt Container still hängen

Erste Container-Runs hingen indefinit (Symptom: `run.log` 0 bytes, Timeout nach 1800 s). Ursache nicht sofort sichtbar — Container baut sauber, startet sauber, nur kein Output.

**Ursache:** Default-Bind-Mount würde Host-`~/.claude` in den Container reichen. Host-`settings.json` enthält fish-MCP-Spawns + Host-Pfade in `additionalDirectories` → im `node:22-slim`-Container kein fish vorhanden, MCP-Init hängt still ohne Fehler. Ähnlich: `.credentials.json`-Symlink mit Host-absoluten Pfaden zeigt im Container ins Leere.

**Fix:**
- Dedizierter `experiments/docker/claude-config/`-Verzeichnis-Mount, eingecheckt mit nativer `settings.json` (`mcpServers: {}`).
- `.credentials.json` per **separatem Bind-Mount** (`~/.claude/.credentials.json:/home/experimenter/.claude/.credentials.json`), nicht als Symlink im Config-Dir.
- Override-Vars für lokales Debugging: `CLAUDE_CONFIG_DIR=~/.claude` / `CLAUDE_CREDENTIALS_FILE=...`.

**Lehre:** Container-Umgebung ≠ Host-Umgebung, auch wenn beide "Linux" sind. Host-Configs mit Tool-Spawns (fish, MCP-Server, IDE-Hooks) gehen davon aus, dass die Tools verfügbar sind — im minimalen Container sind sie es nicht, und das Ergebnis ist oft ein stiller Hänger statt eines Fehlers. Container braucht eigene minimale Config, eingecheckt und versioniert.

## Kata-Konstruktion ist schwerer als gedacht (HPSMV-Pre-Test-Befunde, 08.05.2026)

Die erste claim-office-Version (HPSMV) hatte zwei Anti-Pattern-Patzer, die ohne systematischen Vortest in der Studie gelandet wären:

- **Eingabe-Schema verriet Lesart:** Ursprüngliches `existingContracts`-Feld im Input-JSON pinnte die kunden-bezogene Lesart von "Erstversicherung" (Kunde hatte vorher keinen Vertrag) — und schloss die alternative item-bezogene Lesart (für dieses Item gab es noch keinen Vertrag) faktisch aus. Die konstruierte Mehrdeutigkeit war im Prompt-Text drin, aber durch das Schema schon entschieden. Feld musste raus, Input neutral machen.
- **Numerische Inkonsistenz:** Bonus-Preis 80 G war als "Aufschlag" beschrieben, war aber bei 3 × 25 = 75 G Basis nur 5 G Aufschlag — kein erkennbarer Bonus-Effekt. Korrigiert auf 60 G (= 80 G total). Wäre als "kein Effekt"-Befund durchgegangen, in Wahrheit war die Zahl falsch gewählt.

**Detektion:** Vortest-Skript `research/kata-design/ambiguity-probe/probe.py` — schickt Regel+Frage an Opus/Sonnet/Haiku (mit/ohne thinking) × n=5 mit Default-Temperatur, klassifiziert manuell durch Lesen der Roh-Antworten. Ohne diesen Vortest wären die Patzer in der Studie gelandet.

**Lehre:** Kata-Erstellung ist nicht fertig, wenn der Prompt steht. Pre-Publish-Checklist nötig (Methodik in `research/kata-design/kata-construction.md`):
- Eingabe-Schema verrät keine Lesart — auf Feldnamen achten, die eine Interpretation pinnen.
- Numerische Konsistenz prüfen — alle Werte durchrechnen, Bonus/Aufschlag/Rabatt müssen Zahlen-mäßig auch das tun, was die Sprache verspricht.
- Vortest mit n≥3 Modellen, klassifizierte Antworten lesen, nicht nur Pass-Rate zählen.
- Wegweiser-Vokabular vermeiden ("im Zweifelsfall", "kann beeinflussen", "in jedem Fall", "ausgenommen") — antagonisiert das Modell statt Mehrdeutigkeiten zu konstruieren.
- Aufgaben-Kohärenz: alle Operationen auf gemeinsamem Zustand, keine Lifecycle-Operation, deren einziger Zweck eine Mehrdeutigkeit ist.

## Tooling-Tracking-Falle: `nohup ./batch.sh &` mit `run_in_background:true`

Beim Starten langer Batches verlockend, `nohup ./batch.sh <plan> &` mit Tool-Parameter `run_in_background: true` zu kombinieren — fühlt sich an wie "doppelt sicher im Hintergrund". Tatsächlich: das `&` returniert sofort, das Tool meldet "completed" nach Sekunden, obwohl der Container weiterläuft. Tracking verloren.

**Konsequenzen:**
- Tool meldet vermeintlichen "Erfolg", obwohl Batch noch Stunden läuft.
- Status-Check über Bash-Tool funktioniert nicht mehr — der ursprüngliche Prozess ist tot, der Container weitergelaufen.
- Mehrfach passiert: ich (Claude) dachte, der Batch sei fertig, habe an den Run-Dirs weitergearbeitet, während noch frische Runs erzeugt wurden.

**Korrekt:** `./batch.sh <plan>` direkt mit `run_in_background: true` aufrufen (ohne nohup, ohne `&`). Dann trackt das Tool den `docker compose run`-Prozess korrekt bis Batch-Ende. Status während Lauf via `docker logs -f docker-batch-run-<hash>` oder `tail -f experiments/docker/batch.<plan>.log`. Stop via `docker stop docker-batch-run-<hash>`.

**Lehre:** Tool-Mechanik vs. Shell-Mechanik nicht doppelt anwenden. Wenn das Harness "im Hintergrund laufen lassen" anbietet, nicht zusätzlich `nohup`/`&` in den Command einbauen — die Konzepte überlagern sich destruktiv und die Verlierer-Information ist immer das Tracking.

## Reanalyze-Disziplin nach Pipeline-Fix (laufendes Risiko)

Pipeline-Fix invalidiert betroffene Metriken in allen vorher gelaufenen Runs. Wer nach dem Fix einfach weiterläuft und neue Runs einsammelt, erzeugt **Mischkohorten** (alt mit falschem Wert, neu mit korrektem Wert) — Aggregation glättet die zu unsinnigen Mittelwerten und produziert Befunde, die niemand reproduzieren kann.

**Wiederholt aufgetretene Varianten:**
- analyze-run.sh multi-file fix (10.05.): claim-office cc_*-Werte vor/nach Fix unterschiedlich → ältere Runs zeigten nur cli.ts, neue zeigten Multi-File-Aggregat. Ohne Reanalyze waren claim-office-Aggregationen vor 10.05. systematisch zu niedrig.
- Container pnpm-11-bug: 27 Runs vom 10.05. mit `tests_passing=false` obwohl real grün — wenn nicht explizit reanalyzed, wären sie als "Workflow X schafft die Tests nicht" in die Findings gerutscht.
- v4/v5 Predictions-Regex/Compliance (09.05.): Reruns nötig statt Reanalyze (Workflow erzeugt das Format jetzt anders) — andere Klasse von Pipeline-Fix.

**Skill `/reanalyze` existiert genau deshalb:** Re-Run der Analyse-Pipeline auf alle Runs, die zu einer RQ matchen, Reaggregation, Findings-Update-Vorschlag. War aber nicht von Anfang an Routine — frühe Pipeline-Fixes wurden mehrfach vergessen zu propagieren.

**Lehre:** Pipeline-Fix-Workflow ist immer dreistufig: (1) Fix einchecken, (2) `/reanalyze` der betroffenen RQs ODER expliziter Rerun (wenn der Fix das Output-Format ändert), (3) Findings-Update mit Hinweis auf die invalidierten Vorher-Werte. Schritt 2 wird unter Zeitdruck am häufigsten übersprungen — gerade dann gilt: ein Fix ohne Reanalyze ist kein Fix, sondern eine neue Datenquelle.
