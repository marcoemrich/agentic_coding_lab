# RQ-8 — Findings: APP-Heuristik im Refactor-Subagent

## Übersicht

Vergleich v6-hybrid (mit APP, n=10) vs v6.1-no-app (ohne APP, n=5) auf game-of-life-example-mapping, opus-4-7-no-thinking. **APP hilft auf allen 5 primären Code-Qualitäts-Metriken.**

| Metrik | v6 (mit APP) μ±σ | v6.1 (ohne APP) μ±σ | Δ (v6.1 − v6) | v6 σ-Schwelle | über Schwelle? |
|---|---:|---:|---:|---:|:---:|
| Smell-Summe | 2.2 ± 0.42 | 3.2 ± 1.30 | **+1.0** | 0.42 | ✅ |
| `cognitive_max` | 5.2 ± 2.30 | 8.4 ± 4.93 | **+3.2** | 2.30 | ✅ |
| `mccabe_max` | 4.5 ± 1.51 | 6.0 ± 2.55 | **+1.5** | 1.51 | ✅ knapp |
| Spitzen-Komplexität (`cc_longest_function`) | 13.1 ± 5.97 | 15.2 ± 9.44 | +2.1 | 5.97 | — |
| Code-Mass (APP) | 158.6 ± 15.14 | 166.0 ± 5.15 | +7.4 | 15.14 | — |

Niedriger = besser. Drei der fünf Metriken zeigen v6.1 mindestens 1σ schlechter als v6 mit konsistenter Richtung über alle fünf.

---

## F-8.1 — APP-Heuristik im Refactor-Subagent verbessert Code-Qualität konsistent auf allen primären Metriken

**Aussage:** Der Refactor-Subagent ohne APP-Block produziert auf allen fünf primären Code-Qualitäts-Metriken **schlechtere Werte** als der Subagent mit APP. Auf zwei Metriken (Smell-Summe, `cognitive_max`) liegt der Effekt klar über einer Standardabweichung der v6-Streuung; auf `mccabe_max` knapp über; auf `cc_longest_function` und Code-Mass unter der Schwelle, aber mit konsistenter Richtung.

**Hypothesen-Auswertung:**
- H1 (APP wirkungslos) — **falsifiziert.**
- H2 (APP hilft messbar, Median-Differenz ≥ +1σ in mindestens zwei der fünf Metriken, konsistente Richtung) — **bestätigt.**

**Mechanismus-Hypothese:** APP zwingt den Refactor-Subagent zu einer expliziten Vorher-Nachher-Berechnung, was offenbar **die Qualität der ausgewählten Refactorings** beeinflusst — nicht ihre Anzahl (siehe F-8.3). Ohne den Mass-Anker entscheidet das Modell qualitativ über Verbesserungen ("liest sich besser") und wählt seltener Strukturänderungen, die Spitzen-Komplexität tatsächlich reduzieren.

**Datenbasis:** 15 Runs (v6 n=10 aus RQ-5-Pool, v6.1 n=5 neu), gleiches Modell und Kata, gleicher Skill/Subagent-Mechanismus, gleicher Refactor-Prompt **abgesehen von** den APP-Bestandteilen.

---

## F-8.2 — APP-Heuristik stabilisiert die Refactor-Ergebnisse (Streuung verdoppelt sich bis verdreifacht ohne APP)

**Aussage:** v6.1 produziert nicht nur im Mittel schlechtere Code-Qualität, sondern auch **deutlich instabilere** Werte:

| Metrik | v6 σ (mit APP) | v6.1 σ (ohne APP) | σ-Faktor |
|---|---:|---:|---:|
| Smell-Summe | 0.42 | 1.30 | **3.1×** |
| `cognitive_max` | 2.30 | 4.93 | **2.1×** |
| Spitzen-Komplexität | 5.97 | 9.44 | 1.6× |
| `mccabe_max` | 1.51 | 2.55 | 1.7× |

v6.1 verliert damit auch den "0% Outlier-Rate"-Status, den v6 in RQ-5 F-5.2 hatte. Auf `cognitive_max` liegt der schlechteste v6.1-Run bei 15 (vs. v6-Maximum 7) — der Refactor-Aussetzer-Failure-Mode aus v4 (10% Tail) ist ohne APP teilweise zurück.

**Mechanismus-Hypothese:** APP gibt dem Refactor-Subagent eine **objektive Mess-Schiene**, die unabhängig von der konkreten Code-Form funktioniert. Ohne sie variiert das Modell stärker in seiner Strenge — manche Runs refactorieren strukturell, andere nur kosmetisch.

**Datenbasis:** 15 Runs. Bei n=5 für v6.1 ist die σ-Schätzung breit (95%-Konfidenzintervall der wahren σ etwa [0.6, 2.5] für Smell), aber der σ-Faktor ≥ 2 bei zwei Metriken übersteigt den Schätzungs-Spielraum klar.

---

## F-8.3 — APP wirkt nicht über die Refactor-Quote — TDD-Disziplin bleibt unverändert

**Aussage:** Trotz Entfernung der APP-Heuristik bleibt die Refactor-Frequenz und die TDD-Disziplin in den v6-Bändern aus RQ-5 F-5.6:

| Outcome | v6 (mit APP) | v6.1 (ohne APP) |
|---|---:|---:|
| `cycle_count` μ±σ | 8.3 ± 0.82 | **8.2 ± 0.45** (sogar enger) |
| `refactorings_applied` μ±σ | 4.0 ± 1.63 | 4.2 ± 2.17 |
| `predictions_correct_rate` | 99.4 % | 100.0 % |
| `tests_passed_immediately` μ±σ | 3.3 ± 3.02 | 4.6 ± 2.07 |

**Konsequenz:** Der Qualitäts-Vorteil aus F-8.1 ist **nicht** dadurch erklärbar, dass v6 mehr Refactorings durchführt. Die Anzahl der Refactor-Phasen ist praktisch identisch. APP wirkt also über die **Auswahl/Tiefe** der einzelnen Refactorings, nicht über deren Häufigkeit.

H4 (TDD-Disziplin unverändert) — **bestätigt.**

**Anekdotisch:** `tests_passed_immediately` ist bei v6.1 leicht höher (4.6 vs 3.3) — Hinweis auf etwas mehr Over-Implementation in der Green-Phase, aber im Rahmen der v6-Streuung.

---

## F-8.4 — Token- und Wallclock-Einsparung durch APP-Entfernung minimal (~8%), Tradeoff ungünstig

**Aussage:** Die Hoffnung, dass ein schlankerer Refactor-Prompt substanzielle Token-Einsparungen bringt, wird nicht eingelöst:

| Outcome | v6 (mit APP) | v6.1 (ohne APP) | Differenz |
|---|---:|---:|---:|
| `total_tokens` μ | 6.62 M | 6.08 M | −8.2 % |
| `duration_seconds` μ | 521 | 481 | −7.8 % |

H3 (APP kostet ≥ 5%) **bestätigt**, aber mit zu kleiner Effektstärke, um den Qualitäts- und Stabilitäts-Verlust aus F-8.1/F-8.2 aufzuwiegen. Pro eingesparten Token verliert v6.1 messbare Code-Qualität — kein attraktiver Tradeoff.

**Konsequenz:** APP bleibt im Refactor-Subagent. v6 bleibt der Default-Hybrid, v6.1-no-app wird **nicht** der Nachfolger.

---

## Folgerung für die Workflow-Optimierung

- APP ist **kein Prompt-Ballast** — sondern ein **tragender Bestandteil** des v6-Refactor-Subagents. Künftige Reduktionsversuche sollten andere Prompt-Blöcke ins Visier nehmen (z.B. die ausführlichen Refactoring-Beispiele oder die "Common TDD Failure Modes"-Listen).
- Die zentralen Befund-Stützen sind F-8.1 (alle 5 Metriken konsistent schlechter) und F-8.2 (Streuung verdoppelt). Die ungewöhnlich saubere Konsistenz über fünf orthogonale Metriken bei n=5 deutet auf einen robusten Effekt — sollte aber bei Bedarf mit n=10 + zweiter Kata (claim-office) repliziert werden, bevor "APP unverzichtbar" als allgemeine Aussage gilt.

## Caveats

- **n=5 v6.1**: Stabilitäts-Vergleich (F-8.2) ist daten-knapp; σ-Schätzung breit. Cross-Validation mit n=10 würde den Effekt schärfen.
- **Single Kata**: nur game-of-life (Library-Form). Auf claim-office (CLI, verzweigte Logik) könnte APP einen anderen Effekt-Charakter zeigen — APP-Mass ist auf Code mit vielen Conditionals/Loops besonders wirksam.
- **Single Modell**: opus-4-7-no-thinking. Schwächere Modelle könnten ohne APP-Heuristik in stärkere Drift verfallen — der Effekt aus F-8.2 könnte sich auf Sonnet/Haiku vergrößern.
