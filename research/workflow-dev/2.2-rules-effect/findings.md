# RQ-rules — Findings: Four Rules of Simple Design im Refactor-Subagent

## Übersicht

Vergleich v6-hybrid (mit Four Rules, n=10) vs v6.2-no-rules (ohne Four Rules, n=5) auf game-of-life-example-mapping, opus-4-7-no-thinking. **Spiegelbild zu RQ-app: alle 5 primären Code-Qualitäts-Metriken liegen innerhalb ±1σ der v6-Streuung — Four Rules sind praktisch wirkungslos, wenn APP + Naming-Eval bleiben.**

| Metrik | v6 (mit Rules) μ±σ | v6.2 (ohne Rules) μ±σ | Δ (v6.2 − v6) | v6 σ-Schwelle | über Schwelle? |
|---|---:|---:|---:|---:|:---:|
| Code-Mass (APP) | 158.6 ± 15.14 | 148.6 ± 12.22 | **−10.0** | 15.14 | nein (v6.2 leicht besser) |
| Smell-Summe | 2.2 ± 0.42 | 2.2 ± 0.45 | 0.0 | 0.42 | nein (identisch) |
| Spitzen-Komplexität (`cc_longest_function`) | 13.1 ± 5.97 | 14.2 ± 6.69 | +1.1 | 5.97 | nein |
| `cognitive_max` | 5.2 ± 2.30 | 4.6 ± 3.05 | −0.6 | 2.30 | nein (v6.2 leicht besser) |
| `mccabe_max` | 4.5 ± 1.51 | 4.4 ± 1.34 | −0.1 | 1.51 | nein (identisch) |

Niedriger = besser. Keine einzige Metrik überschreitet die ±1σ-Schwelle der v6-Streuung. Drei Metriken (Code-Mass, `cognitive_max`, `mccabe_max`) zeigen v6.2 sogar leicht günstiger, zwei (Smell, `mccabe_max`) sind praktisch identisch, nur Spitzen-Komplexität leicht ungünstiger.

---

## F-rules.1 — Four Rules of Simple Design haben keinen messbaren Effekt auf Code-Qualität, wenn APP + Naming-Eval bleiben

**Aussage:** Auf keinem der fünf primären Code-Qualitäts-Outcomes überschreitet die Median-Differenz zwischen v6 und v6.2 eine Standardabweichung der v6-Streuung. Die Richtung ist sogar uneinheitlich (3 Metriken minimal pro v6.2, 2 praktisch identisch, 1 minimal pro v6). Damit ist der Effekt der Four-Rules-Sektion im Refactor-Subagent-Prompt **unterhalb der Mess-Auflösung dieses Designs**.

**Hypothesen-Auswertung:**
- H1 (Four Rules wirkungslos) — **bestätigt** (mit Caveat: H1 ist die schwächere Nachweis-Richtung; siehe Caveats unten).
- H2 (Four Rules helfen messbar, Median-Differenz ≥ +1σ in mindestens zwei der fünf Metriken) — **nicht erfüllt**.

**Mechanismus-Hypothese:** Die Four Rules (Tests Pass / Reveals Intent / No Duplication / Fewest Elements) überlappen stark mit APP und Naming-Eval, die in v6.2 erhalten bleiben:

- *Reveals Intent* → durch dedizierte Naming-Evaluation (Step 1) abgedeckt
- *No Duplication* → APP-Mass-Reduktion durch Extract-Helper liefert dasselbe Signal
- *Fewest Elements* → APP-Mass-Reduktion durch Inline liefert dasselbe Signal
- *Tests Pass* → ohnehin im "MUST stay green"-Bullet kodiert

Die Four Rules sind also weitgehend **redundante Heuristiken** — APP + Naming + MUST-attempt fangen denselben Effekt-Raum ab, mit weniger Prompt-Volumen.

**Datenbasis:** 15 Runs (v6 n=10 aus RQ-stability-Pool, v6.2 n=5 neu), gleiches Modell und Kata, gleicher Skill/Subagent-Mechanismus.

---

## F-rules.2 — Streuung der Code-Qualität bleibt praktisch unverändert — kein Stabilitätsverlust durch Reduktion

**Aussage:** Im starken Kontrast zu RQ-app F-app.2 (wo σ ohne APP **2–3× anstieg**) bleibt die Streuung in v6.2 nahezu identisch oder verbessert sich sogar leicht:

| Metrik | v6 σ (mit Rules) | v6.2 σ (ohne Rules) | σ-Faktor |
|---|---:|---:|---:|
| Code-Mass (APP) | 15.14 | 12.22 | 0.81× |
| Smell-Summe | 0.42 | 0.45 | 1.07× |
| Spitzen-Komplexität | 5.97 | 6.69 | 1.12× |
| `cognitive_max` | 2.30 | 3.05 | 1.33× |
| `mccabe_max` | 1.51 | 1.34 | 0.89× |

Der einzige nennenswerte σ-Anstieg ist bei `cognitive_max` (Faktor 1.33×) — verursacht durch einen einzelnen 10-Outlier bei v6.2 (vs Maximum 7 bei v6). Bei n=5 ist das ein Einzel-Run-Effekt mit breitem Schätz-Intervall.

**Konsequenz:** v6.2 erbt die Stabilitäts-Eigenschaft von v6 (RQ-stability F-stability.2: 0% Outlier-Rate). Der Stabilitäts-Anker scheint also tatsächlich **APP** zu sein (RQ-app F-app.2), nicht die Four Rules.

---

## F-rules.3 — TDD-Disziplin unverändert ohne Four Rules

**Aussage:** Cycle-Count, Refactor-Quote, Prediction-Compliance und Over-Implementation-Indikator bleiben identisch:

| Outcome | v6 (mit Rules) | v6.2 (ohne Rules) |
|---|---:|---:|
| `cycle_count` μ±σ | 8.3 ± 0.82 | **7.8 ± 0.45** (sogar enger) |
| `refactorings_applied` μ±σ | 4.0 ± 1.63 | **4.0 ± 2.24** |
| `predictions_correct_rate` | 99.4 % | 100.0 % |
| `tests_passed_immediately` μ±σ | 3.3 ± 3.02 | 3.4 ± 3.13 |
| Korrektheit-innen / -außen | 100% / 100% | 100% / 100% |

H4 (TDD-Disziplin unverändert) — **bestätigt**. Die Refactor-Frequenz wird nicht von Four Rules getragen.

---

## F-rules.4 — Token-Einsparung durch Four-Rules-Entfernung: ~8.5%, ohne Qualitätsverlust

**Aussage:** v6.2 spart messbar Tokens und kostet praktisch gleichviel Wallclock:

| Outcome | v6 | v6.2 | Differenz |
|---|---:|---:|---:|
| `total_tokens` μ | 6.62 M | 6.06 M | **−8.5 %** |
| `duration_seconds` μ | 521 | 517 | −0.8 % |

H3 (Four Rules kosten ≥ 5%) — **bestätigt**. Im Gegensatz zu RQ-app F-app.4 (wo die ~8% Token-Einsparung den Qualitätsverlust nicht wert war), liefert hier die Reduktion **keine Qualitäts-Kosten**. Tradeoff klar günstig.

---

## F-rules.5 — Konsequenz für die Workflow-Optimierung

Im direkten Vergleich mit RQ-app:

| | RQ-app: APP entfernt | RQ-rules: Four Rules entfernt |
|---|:---:|:---:|
| Code-Qualität alle 5 Metriken | ⬇️ schlechter | ➡️ unverändert |
| Streuung σ | ⬆️ verdoppelt-verdreifacht | ➡️ unverändert |
| TDD-Disziplin | ➡️ unverändert | ➡️ unverändert |
| Token-Einsparung | ~8 % | ~8.5 % |
| **Verdict** | **APP bleibt** | **Four Rules können raus** |

**v6.2-no-rules ist ein erfolgreicher Reduktions-Kandidat.** Bei n=5 ist die "ununterscheidbar"-Aussage statistisch schwächer als ein positiver Befund — aber das Daten-Muster ist klar und konsistent: keine einzige der fünf Metriken zeigt eine Richtung, die einen Verlust nahelegt; im Gegenteil, drei Metriken liegen tendenziell günstiger.

Vor einer endgültigen Workflow-Promotion (v6.2 als neuer Default-Hybrid statt v6) sollte:

1. **n auf 10 erhöht** werden, um die "ununterscheidbar"-Aussage mit voller Power abzusichern.
2. **Cross-Kata-Validierung** auf claim-office laufen — die längere CLI-Kata mit verzweigter Logik könnte einen Bereich erwischen, wo Four Rules über die Naming/APP-Abdeckung hinaus wirken (insb. *No Duplication* bei mehreren strukturähnlichen Funktionen).

## Caveats

- **H1 ist Null-Befund**: ein "kein Effekt"-Befund bei n=5 ist statistisch schwächer als ein positiver Befund. 95%-Konfidenzintervall der wahren v6.2-Mittel ist breit — ein realer Effekt kleiner als ~1σ der v6-Streuung würde mit diesem Design nicht erkannt. Für Reduktions-Entscheidungen ist das vertretbar, für eine starke "Four Rules sind nutzlos"-Aussage zu wenig.
- **Single Kata**: nur game-of-life (Library-Form). Four Rules könnten auf claim-office (CLI, verzweigte Logik) mehr Wirkung entfalten — *No Duplication* hat dort potenziell mehr Spielraum (z.B. wiederkehrende JSON-Parsing-Pfade).
- **Single Modell**: opus-4-7-no-thinking. Schwächere Modelle könnten die Four Rules brauchen, um nicht in Modell-spezifische Refactor-Antipattern zu verfallen.
- **Mögliche Inhalts-Überlappung**: Naming-Eval-Block referenziert "Reveals Intent" (Rule 2-Konzept), wurde aber als Naming-Eval beibehalten. Falls dieser kleine Rest schon ausreicht, um den Großteil des Rule-2-Effekts zu liefern, wäre die Aussage "Four Rules wirkungslos" zu stark — präziser: "die *expliziten* Rule-Sektionen über Naming-Eval hinaus wirken nicht".
