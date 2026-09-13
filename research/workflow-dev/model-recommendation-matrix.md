# Workflow-Empfehlung pro Modell

Leitplanke für die Workflow-Weiterentwicklung: **es gibt keinen universell besten Workflow.** Die
Güte eines Workflows hängt vom eingesetzten Modell ab — auf der Architektur-Achse (subagents-v1/single-context-v1/hybrid-v1) tauschen
subagents-v1 und hybrid-v1 je nach Modell die Plätze. Wer einen Workflow optimiert, muss das Zielmodell mitnennen;
eine Verbesserung auf opus-4-7 ist nicht automatisch eine auf opus-4-6.

Vollständiger Befund (Tabelle, Stichproben, Mechanismus):
`research/questions/3.1-workflow-model-interaction/findings.md` (RQ-workflow-model, F-workflow-model.1/F-workflow-model.2).

## Empfehlung opus-4-6 / opus-4-7 (Korrektheit auf novel Kata, `claim-office-example-mapping`)

| Modell | empfohlener Workflow | verification_pct (n) | Begründung |
|---|---|---:|---|
| opus-4-7-no-thinking | **exact-hybrid-v1-cc** | 1.00 (5) | beherrscht die Orchestrierungs-Delegation im shared Context |
| opus-4-6-portkey-no-thinking | **exact-subagents-v1-cc** | 0.93 (5) | profitiert vom expliziten Subagent-Prompt pro Phase |
| (modell-unabhängig als Fallback) | exact-single-context-v1-cc | 0.97 (9) / 0.87 (5) | am wenigsten modell-sensitiv, kein Spitzenwert |

## Empfehlung opus-5-no-thinking (drei Dimensionen)

Auf opus-5 hält die Architektur-Rangfolge inline-tdd-v1 → single-context-v2 → hybrid-v2 → hybrid-v6 (RQ-architecture-axis-opus5
F-1.1). Anders als bei den 4.x-Modellen liegt hier genug Datenmaterial für getrennte
Empfehlungen nach Optimierungsziel vor — und die drei Ziele fallen auf **drei verschiedene
Workflows**.

| Ziel | empfohlener Workflow | Kennzahl | Begründung |
|---|---|---|---|
| **Code-Qualität** | `exact-hybrid-v6-lab-split-cc` | `cc_avg_loc_per_function` 3.21 / 3.57 | gewinnt praktisch jede Qualitätsmetrik auf beiden Katas |
| **Preis/Leistung** | `exact-hybrid-v2-testlist-fix-cc` | 86 % des Gewinns für 60 % der Tokens | beste Dekomposition je Token |
| **Dauer/Leistung** | `exact-hybrid-v2-testlist-fix-cc` | 86 % des Gewinns für 47 % der Wallclock | s. Warnung zu single-context-v2 unten |

Datenbasis (claim-office-example-mapping, opus-5, n=5, aus RQ-architecture-axis-opus5).
„Gewinn" = Anteil an der Dekompositions-Verbesserung von inline-tdd-v1 auf hybrid-v6:

| Workflow | `cc_avg` | Gewinn | Tokens | Dauer | Gewinn/100M Token | Gewinn/10 min | `verification_pct` |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-inline-tdd-v1-cc | 9.18 | 0 % | 4 M | 5 min | — | — | 1.00 |
| exact-single-context-v2-testlist-fix-cc | 5.89 | 55 % | 83 M | 23 min | 3.96 | **1.43** | 0.79 ⚠ |
| exact-hybrid-v2-testlist-fix-cc | 4.04 | 86 % | 82 M | 44 min | **6.27** | 1.17 | 0.99 |
| exact-hybrid-v6-lab-split-cc | 3.21 | 100 % | 137 M | 93 min | 4.36 | 0.64 | 0.95 |

**Warum Dauer und Tokens bei single-context-v2 → hybrid-v2 auseinanderfallen:** beide verbrauchen fast gleich
viele Tokens (83 vs. 82 M), aber hybrid-v2 braucht die doppelte Wallclock (23 → 44 min). Hier
serialisiert die Subagenten-Architektur — jeder isolierte Refactor-Aufruf ist ein eigener
Roundtrip. Wer auf Wanduhr optimiert, zahlt das nicht in Verbrauch, sondern in Wartezeit.

Das ist eine Aussage über **genau dieses Paar**, kein allgemeiner Subagenten-Effekt. Zwischen
Workflows, die beide einen Refactor-Subagenten haben, laufen Dauer und Tokens gleich mit, und
der Unterschied kommt aus der Menge der Refactorings — siehe den nächsten Abschnitt zu
hybrid-v2 vs. hybrid-v8.

**⚠ single-context-v2 gewinnt die Dauer-Effizienz, wird aber nicht empfohlen.** Sein
`verification_pct` von 0.79 ist **bimodal, nicht graduell**: ein Run von fünf brach nach 2
Zyklen mit 6 Funktionen und 60 grünen selbstgeschriebenen Tests ab (RQ-architecture-axis-opus5
F-1.4). Das ist ein Totalausfall-Risiko von ~20 %, kein moderater Qualitätsabschlag. Für
korrektheitskritische Arbeit ist der Workflow damit unbrauchbar, egal wie gut die
Zeit-Kennzahl aussieht. Die Dauer-Empfehlung geht deshalb an hybrid-v2 als schnellste Variante
ohne dieses Risiko.

**Gültigkeitsbereich.** Die Zahlen stammen von claim-office (novel Kata, CLI-Vertrag,
externe Verifikation). Auf game-of-life ist die Rangfolge dieselbe, die Spanne aber enger.
Auf sphinx-score bestätigt RQ-workflow-reduction-opus5 das Token- und Dauer-Muster (hybrid-v2
Token-Sieger, single-context-v2 Dauer-Sieger auf beiden Katas).

### Kosten folgen dem Refactoring-Volumen

`exact-hybrid-v2-testlist-fix-cc` läuft spürbar schneller und billiger als
`exact-hybrid-v8-no-end-refactor-cc`, obwohl beide dieselbe Architektur haben (Refactor-Subagent pro
Zyklus, keine End-Refactor-Phase). hybrid-v8 ist dabei nicht langsamer pro Arbeitseinheit — es
leistet schlicht mehr Refactoring:

| Kata | `refactorings_applied` hybrid-v2 → hybrid-v8 | Dauer | Tokens |
|---|---:|---:|---:|
| game-of-life | 4.4 → 9.2 (2.09×) | 621 → 1097 s (1.77×) | 8.0 → 12.2 M (1.53×) |
| sphinx-score | 6.0 → 7.8 (1.30×) | 786 → 986 s (1.25×) | 10.6 → 12.3 M (1.16×) |

`cycle_count` ist identisch (10.2–10.6), der Unterschied entsteht vollständig innerhalb der
Refactor-Phase, und der Refactoring-Faktor sagt den Zeitfaktor auf beiden Katas eng voraus.

**Nicht dem APP-Patch zuschreiben.** hybrid-v2 → hybrid-v8 unterscheidet sich in zwei Komponenten (Patch
*und* Lab-Split-Regeldateien). Die saubere Isolation des Patches ist hybrid-v6 → hybrid-v7, und dort
läuft der Effekt andersherum: auf sphinx-score sinkt das Refactoring-Volumen von 11.67 auf
10.4, die Dauer von 1475 auf 1264 s, die Tokens von 19.1 auf 14.7 M; auf game-of-life bleibt
alles flach. Der Patch kauft sein Dekompositions-Verhalten nicht mit zusätzlichen
Refactoring-Durchläufen.

Welche Komponente das Volumen tatsächlich hebt, ist offen — der Lab-Split wurde nie isoliert
variiert. Details: `RQ-workflow-reduction-opus5` F-1.7.

### Was die Reduktionskette daran nicht ändert

`RQ-workflow-reduction-opus5` hat auf sphinx-score und game-of-life geprüft, wie weit sich
hybrid-v6 kürzen lässt. Die Kette ordnet auf keiner der beiden Katas monoton (F-1.1), und keine
der drei neuen Varianten verdrängt eine Empfehlung oben:

- `exact-hybrid-v7-app-subordinate-cc` (hybrid-v6 + APP-Patch) hat auf sphinx die beste Roh-Dekomposition
  (2.96), ist aber die einzige Zelle im Feld unter `verification_pct` 1.00 — zwei von fünf
  Runs bei 0.81 (F-1.2). Nicht als Qualitätsempfehlung setzen, solange das auf n=5 mit zwei
  Ausreißern steht und auf game-of-life nicht reproduziert ist.
- `exact-hybrid-v8-no-end-refactor-cc` spart 16–19 % Tokens gegenüber hybrid-v7, ohne im Mittel Dekomposition
  zu verlieren (F-1.3) — der Nutzen der End-Refactor-Phase zeigt sich nur im Peak.
- `exact-single-context-v3-no-subagent-cc` ist auf beiden Katas mindestens so gut wie hybrid-v8 (F-1.4); der isolierte
  Subagent trägt auf Katas dieser Größe nichts.

Diese drei Befunde stammen von kleinen Katas, auf denen elf von zwölf Zellen bei
`verification_pct` 1.00 sättigen. Sie sagen nichts über claim-office-Verhältnisse aus — die
Empfehlungstabelle oben bleibt maßgeblich, bis die Kette dort gemessen ist.

## Empfehlung GPT-5.6 SOL auf pi (OpenAI-Subscription-Route)

Die native SOL-Linie ist kata-abhängig. Für große, novelle Spezifikationen ist
**`exact-sol-v1.3-stack-profile-pi` der Default der SOL-EXACT-Coding-Linie**. Für
kleine oder trainingsbekannte Aufgaben bleibt `baseline-inline-tdd-v1-pi` die
kostengünstigere Empfehlung; sie ist ein Vergleichsboden und kein zweiter
EXACT-Coding-Workflow.

| Einsatz | empfohlener Workflow | Evidenz | Begründung |
|---|---|---|---|
| Große, novelle Specs | **`exact-sol-v1.3-stack-profile-pi`** | RQ-1.16–1.18, RQ-1.21 | Four Rules ohne APP-/Messaufschlag; vollständige TS/Vitest-Auslagerung; 20/20 frische RQ-1.21-Runs intern und extern korrekt |
| Kleine/trainingsbekannte Katas | `baseline-inline-tdd-v1-pi` | RQ-1.16 | Die native SOL-Linie löst dort keinen stabilen Qualitätsvorteil auf und kostet mehr |

Die Promotion von v1.3 ist eine Schichtungsentscheidung, keine neue Methodik:
`predictive-tdd/SKILL.md` bleibt unverändert, während konkrete Sprache- und
Frameworkdetails vollständig in `stacks/typescript-vitest.md` liegen. Validiert
ist diese Empfehlung auf `gpt-5-6-sol-codex` mit pi; Ports auf andere Harnesse
sind Distributionsvarianten derselben Linie, aber keine zusätzliche empirische
Cross-Harness-Behauptung.

## Konsequenz für die Weiterentwicklung

- Workflow-Optimierungen, die auf opus-4-7 gemessen wurden (die gesamte v6.5-Reduktionskette unter
  `research/workflow-dev/2.*`/`3.*`), gelten **nur für opus-4-7**, bis sie cross-model repliziert
  sind.
- Vor jeder „dieser Workflow ist besser"-Aussage: auf welchem Modell? Cross-Model-Replikation ist
  Pflicht, bevor eine Empfehlung modell-unabhängig formuliert wird.
- **Und auf welcher Zielgröße?** Auf opus-5 fallen Qualität, Preis/Leistung und Dauer/Leistung
  auseinander; eine Empfehlung ohne genanntes Optimierungsziel ist unvollständig.
- Die Rangfolge selbst ist nicht modell-invariant: auf Sol schlug strukturloses inline-tdd-v1 jede
  Architektur (`RQ-architecture-axis-sol-pi` F-1.6), auf opus-5 hält die Ordnung
  (`RQ-architecture-axis-opus5` F-1.1).
