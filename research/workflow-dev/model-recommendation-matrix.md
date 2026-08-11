# Workflow-Empfehlung pro Modell

Leitplanke für die Workflow-Weiterentwicklung: **es gibt keinen universell besten Workflow.** Die
Güte eines Workflows hängt vom eingesetzten Modell ab — auf der Architektur-Achse (v4/v5/v6) tauschen
v4 und v6 je nach Modell die Plätze. Wer einen Workflow optimiert, muss das Zielmodell mitnennen;
eine Verbesserung auf opus-4-7 ist nicht automatisch eine auf opus-4-6.

Vollständiger Befund (Tabelle, Stichproben, Mechanismus):
`research/questions/3.1-workflow-model-interaction/findings.md` (RQ-workflow-model, F-workflow-model.1/F-workflow-model.2).

## Empfehlung opus-4-6 / opus-4-7 (Korrektheit auf novel Kata, `claim-office-example-mapping`)

| Modell | empfohlener Workflow | verification_pct (n) | Begründung |
|---|---|---:|---|
| opus-4-7-no-thinking | **v6-hybrid** | 1.00 (5) | beherrscht die Orchestrierungs-Delegation im shared Context |
| opus-4-6-portkey-no-thinking | **v4-exact-subagents** | 0.93 (5) | profitiert vom expliziten Subagent-Prompt pro Phase |
| (modell-unabhängig als Fallback) | v5-exact-single-context | 0.97 (9) / 0.87 (5) | am wenigsten modell-sensitiv, kein Spitzenwert |

## Empfehlung opus-5-no-thinking (drei Dimensionen)

Auf opus-5 hält die Architektur-Rangfolge v3 → v5.1 → v6.1 → v6.6 (RQ-architecture-axis-opus5
F-1.1). Anders als bei den 4.x-Modellen liegt hier genug Datenmaterial für getrennte
Empfehlungen nach Optimierungsziel vor — und die drei Ziele fallen auf **drei verschiedene
Workflows**.

| Ziel | empfohlener Workflow | Kennzahl | Begründung |
|---|---|---|---|
| **Code-Qualität** | `v6.6-lab-split-cc` | `cc_avg_loc_per_function` 3.21 / 3.57 | gewinnt praktisch jede Qualitätsmetrik auf beiden Katas |
| **Preis/Leistung** | `v6.1-hybrid-testlist-scope-fix` | 86 % des Gewinns für 60 % der Tokens | beste Dekomposition je Token |
| **Dauer/Leistung** | `v6.1-hybrid-testlist-scope-fix` | 86 % des Gewinns für 47 % der Wallclock | s. Warnung zu v5.1 unten |

Datenbasis (claim-office-example-mapping, opus-5, n=5, aus RQ-architecture-axis-opus5).
„Gewinn" = Anteil an der Dekompositions-Verbesserung von v3 auf v6.6:

| Workflow | `cc_avg` | Gewinn | Tokens | Dauer | Gewinn/100M Token | Gewinn/10 min | `verification_pct` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v3-basic-tdd | 9.18 | 0 % | 4 M | 5 min | — | — | 1.00 |
| v5.1-testlist-scope-fix | 5.89 | 55 % | 83 M | 23 min | 3.96 | **1.43** | 0.79 ⚠ |
| v6.1-hybrid-testlist-scope-fix | 4.04 | 86 % | 82 M | 44 min | **6.27** | 1.17 | 0.99 |
| v6.6-lab-split-cc | 3.21 | 100 % | 137 M | 93 min | 4.36 | 0.64 | 0.95 |

**Warum Dauer und Tokens auseinanderfallen:** v5.1 und v6.1 verbrauchen fast gleich viele
Tokens (83 vs. 82 M), aber v6.1 braucht die doppelte Wallclock. Die Subagenten-Architektur
serialisiert — jeder isolierte Refactor-Aufruf ist ein eigener Roundtrip. Wer auf Wanduhr
optimiert, zahlt das nicht in Verbrauch, sondern in Wartezeit.

**⚠ v5.1 gewinnt die Dauer-Effizienz, wird aber nicht empfohlen.** Sein
`verification_pct` von 0.79 ist **bimodal, nicht graduell**: ein Run von fünf brach nach 2
Zyklen mit 6 Funktionen und 60 grünen selbstgeschriebenen Tests ab (RQ-architecture-axis-opus5
F-1.4). Das ist ein Totalausfall-Risiko von ~20 %, kein moderater Qualitätsabschlag. Für
korrektheitskritische Arbeit ist der Workflow damit unbrauchbar, egal wie gut die
Zeit-Kennzahl aussieht. Die Dauer-Empfehlung geht deshalb an v6.1 als schnellste Variante
ohne dieses Risiko.

**Gültigkeitsbereich.** Die Zahlen stammen von claim-office (novel Kata, CLI-Vertrag,
externe Verifikation). Auf game-of-life ist die Rangfolge dieselbe, die Spanne aber enger.
Auf sphinx-score bestätigt RQ-workflow-reduction-opus5 das Token- und Dauer-Muster (v6.1
Token-Sieger, v5.1 Dauer-Sieger auf beiden Katas).

### Was die Reduktionskette daran nicht ändert

`RQ-workflow-reduction-opus5` hat auf sphinx-score und game-of-life geprüft, wie weit sich
v6.6 kürzen lässt. Die Kette ordnet auf keiner der beiden Katas monoton (F-1.1), und keine
der drei neuen Varianten verdrängt eine Empfehlung oben:

- `v6.7-app-subordinate-cc` (v6.6 + APP-Patch) hat auf sphinx die beste Roh-Dekomposition
  (2.96), ist aber die einzige Zelle im Feld unter `verification_pct` 1.00 — zwei von fünf
  Runs bei 0.81 (F-1.2). Nicht als Qualitätsempfehlung setzen, solange das auf n=5 mit zwei
  Ausreißern steht und auf game-of-life nicht reproduziert ist.
- `v6.8-no-end-refactor-cc` spart 16–19 % Tokens gegenüber v6.7, ohne im Mittel Dekomposition
  zu verlieren (F-1.3) — der Nutzen der End-Refactor-Phase zeigt sich nur im Peak.
- `v5.2-no-subagent-cc` ist auf beiden Katas mindestens so gut wie v6.8 (F-1.4); der isolierte
  Subagent trägt auf Katas dieser Größe nichts.

Diese drei Befunde stammen von kleinen Katas, auf denen elf von zwölf Zellen bei
`verification_pct` 1.00 sättigen. Sie sagen nichts über claim-office-Verhältnisse aus — die
Empfehlungstabelle oben bleibt maßgeblich, bis die Kette dort gemessen ist.

## Konsequenz für die Weiterentwicklung

- Workflow-Optimierungen, die auf opus-4-7 gemessen wurden (die gesamte v6.5-Reduktionskette unter
  `research/workflow-dev/2.*`/`3.*`), gelten **nur für opus-4-7**, bis sie cross-model repliziert
  sind.
- Vor jeder „dieser Workflow ist besser"-Aussage: auf welchem Modell? Cross-Model-Replikation ist
  Pflicht, bevor eine Empfehlung modell-unabhängig formuliert wird.
- **Und auf welcher Zielgröße?** Auf opus-5 fallen Qualität, Preis/Leistung und Dauer/Leistung
  auseinander; eine Empfehlung ohne genanntes Optimierungsziel ist unvollständig.
- Die Rangfolge selbst ist nicht modell-invariant: auf Sol schlug strukturloses v3 jede
  Architektur (`RQ-architecture-axis-sol-pi` F-1.6), auf opus-5 hält die Ordnung
  (`RQ-architecture-axis-opus5` F-1.1).
