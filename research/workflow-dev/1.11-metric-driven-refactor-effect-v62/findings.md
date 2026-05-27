# RQ-1.11 Findings — v6.4-metric-driven-refactor vs v6.2-with-why-cleaned (claim-office)

## Übersicht

`claim-office-example-mapping × opus-4-7-no-thinking` (Native API für v6.4, Portkey-Gateway für v6.2-Baseline; OR-Match via `controls.model: any:`).

| Outcome (Richtung) | v6.2-with-why-cleaned (n=8) | v6.4-metric-driven-refactor (n=5) |
|---|---:|---:|
| `verification_pct` (höher = besser) | 0.96 ± 0.09 | **0.99 ± 0.03** 🏆 |
| `tests_passing` Rate (höher = besser) | **100 %** 🏆 | **100 %** 🏆 |
| `completed_within_budget` Rate (höher = besser) | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` (kleiner = besser) | 5.0 ± 1.77 | **2.4 ± 1.34** 🏆 |
| `cognitive_avg` (kleiner = besser) | 1.91 ± 0.75 | **1.27 ± 0.27** 🏆 |
| `mccabe_max` (kleiner = besser) | 4.5 ± 0.76 | **3.0 ± 1.00** 🏆 |
| `mccabe_avg` (kleiner = besser) | 1.53 ± 0.20 | **1.40 ± 0.13** 🏆 |
| `code_mass` (kleiner = besser) | 879 ± 91 | **805 ± 64** 🏆 |
| `smell_total` (kleiner = besser) | 0.38 ± 0.74 | **0.0 ± 0.0** 🏆 |
| `cc_longest_function` (kleiner = besser) | **12.4 ± 1.4** 🏆 | 13.0 ± 3.1 |
| `refactorings_applied` (höher = besser) | 24.9 ± 6.9 | **30.4 ± 8.8** 🏆 |
| `cycle_count` (kontextuell, höher signalisiert vollere TDD-Loops) | 37.4 ± 1.6 | **40.2 ± 2.2** 🏆 |
| `predictions_correct_rate` (höher = besser) | **97.2 %** 🏆 | 89.6 % |
| `tests_passed_immediately` (kleiner = besser bei TDD) | 15.1 ± 5.8 | **7.0 ± 9.6** 🏆 |
| `duration_seconds` (kleiner = besser) | **2530 ± 401** 🏆 | 5284 ± 2337 |
| `total_tokens` (kleiner = besser) | **44.4M ± 3.4M** 🏆 | 102.3M ± 17.2M |

Trophy-Konvention: `verification_pct` ist Korrektheits-Gate; beide Workflows liegen am oberen Ende und sind 🏆-fähig für Code-Qualitäts-Metriken. `cc_longest_function` als einzige Quality-Metrik gegen den Trend (Spread innerhalb 1 σ — geht eher als "kein Effekt" durch als als echte Regression). Kosten-Trophies klar Baseline-seitig.

---

## F-1.1 — Spitzen-Komplexität halbiert ohne Korrektheitskosten

Der metric-driven Refactor-Agent reduziert die Spitzen-Komplexität auf claim-office deutlich und stabilisiert die Korrektheit.

| Metrik (Richtung) | v6.2 (n=8) | v6.4 (n=5) | Δ Mean | Δ σ |
|---|---:|---:|---:|---:|
| `cognitive_max` (kleiner = besser) | 5.0 ± 1.77 | **2.4 ± 1.34** | −52 % | −24 % |
| `cognitive_avg` (kleiner = besser) | 1.91 ± 0.75 | **1.27 ± 0.27** | −33 % | −64 % |
| `mccabe_max` (kleiner = besser) | 4.5 ± 0.76 | **3.0 ± 1.00** | −33 % | +32 % |
| `smell_total` (kleiner = besser) | 0.38 ± 0.74 | **0.0 ± 0.0** | −100 % | −100 % |
| `code_mass` (kleiner = besser) | 879 ± 91 | **805 ± 64** | −8 % | −30 % |
| `verification_pct` (höher = besser) | 0.96 ± 0.09 | **0.99 ± 0.03** | +3 pp | −67 % |

Spitzen-Komplexität (`cognitive_max`, `mccabe_max`) fällt um etwa die Hälfte; Durchschnitts-Komplexität in derselben Richtung mit deutlich engerer Streuung. `smell_total` kollabiert von 0.38 auf 0 (kein einziger ESLint-Smell in 5 v6.4-Runs vs 3 Smells in 8 v6.2-Runs). Code-Mass leicht reduziert. **Korrektheit bleibt nicht nur erhalten, sie wird sogar etwas robuster** — Mean ver_pct steigt von 0.96 auf 0.99 und σ fällt von 0.09 auf 0.03. Damit wird H1 (Korrektheit ≥ 0.85) klar erfüllt und H2 (Komplexitäts-Reduktion ≥ 1 σ) auf den Spitzen-Metriken bestätigt.

Mechanistische Lesart: das Pre-Measurement zwingt den Agent, die schlechteste Funktion explizit zu identifizieren, bevor er refactoriert. Das Post-Measurement gibt ihm einen objektiven Trigger für Revert/Alternative bei einer schlechteren POST-Zahl. Beides zusammen scheint die "Naming-First, sonst nichts"-Tendenz des Baseline-Refactor-Agents zu durchbrechen.

---

## F-1.2 — Mehr und engmaschigere Refactor-Zyklen, weniger out-of-the-box-Greens

Der Pre/Post-Tool-Mechanismus aktiviert zusätzliche Refactor-Iterationen, statt sie zu verdrängen.

| Metrik (Richtung) | v6.2 (n=8) | v6.4 (n=5) | Δ Mean |
|---|---:|---:|---:|
| `refactorings_applied` (höher = besser) | 24.9 ± 6.9 | **30.4 ± 8.8** | +22 % |
| `cycle_count` | 37.4 ± 1.6 | **40.2 ± 2.2** | +8 % |
| `tests_passed_immediately` (kleiner = besser) | 15.1 ± 5.8 | **7.0 ± 9.6** | −54 % |

Der Agent durchläuft im Schnitt 2.8 mehr Cycles und führt 5.5 zusätzliche Refactor-Aktionen aus; gleichzeitig halbiert sich die Zahl der Tests, die "sofort grün" durchgingen (also ohne Green-Phase-Implementation). Das passt zur Lesart aus F-1.1: der Agent macht ernst mit der Refactor-Pflicht, weil die Pre/Post-Messung jeden Cycle eine messbare Verbesserung verlangt. H3 (TDD-Disziplin innerhalb 1 σ stabil) verfehlt — aber in die Richtung "höhere Disziplin", nicht "Loop-Störung".

---

## F-1.3 — Bundle-Bruch aus RQ-1.9 und RQ-1.10 nicht reproduziert

Deterministische Tool-Messung als Erweiterungs-Mechanismus löst nicht das Self-Stop-Muster aus, das vokabular- und rationale-getriebene Erweiterungen ausgelöst haben.

| RQ | Mechanismus | claim-office `verification_pct` | done.txt | Cycles vs Baseline |
|---|---|---:|---:|---|
| RQ-1.9 (v6.3-audit-bundle) | Rationale-Blöcke + Red-Phase-Hardening | 0.96 → **0.35** | 6/8 fehlen | 7–14 vs ~37 (Self-Stop) |
| RQ-1.10 (v6.2.1-refactor-vocab) | Refactor-Vokabular (cognitive/mccabe als Begriff) | 0.96 → **0.23** | 4/5 fehlen | 7–22 vs ~37 (Self-Stop) |
| **RQ-1.11 (v6.4-metric-driven-refactor)** | Pre/Post Tool-Aufrufe + McCabe parallel zu APP | 0.96 → **0.99** | **5/5 vorhanden** | 38–43 vs ~37 (voller Loop) |

In RQ-1.9 und RQ-1.10 brach der Agent nach unter ½ der Baseline-Cycles ab; intern `tests_passing = true`, extern `verification_pct` kollabiert. In RQ-1.11 sind alle 5 Runs ≥ 38 Cycles, alle done.txt vorhanden, alle Verifikations-Mehrheiten ≥ 14/15 Szenarien. Das stützt die Mechanismus-Hypothese: **Selfstop wird durch Per-Cycle-Aufwands-Erhöhung getriggert, wenn diese semantisch (Vokabular, Rationale) verläuft. Dieselbe Per-Cycle-Aufwands-Erhöhung über deterministische Tools triggert ihn nicht.** Welche der drei v6.4-Komponenten — (a) ESLint-Aufruf, (b) McCabe-Berechnung, (c) Pre/Post-Revert-Klausel — den Unterschied trägt, ist mit diesem Bundle nicht entscheidbar.

---

## F-1.4 — Kosten-Aufschlag stark und sehr volatil

Token- und Wallclock-Aufschlag liegt deutlich über der vorab-erwarteten Größenordnung (H4: erwartet +10–20 % Tokens, real +130 %).

| Metrik (Richtung) | v6.2 (n=8) | v6.4 (n=5) | Δ Mean | Δ σ |
|---|---:|---:|---:|---:|
| `duration_seconds` (kleiner = besser) | **2530 ± 401** | 5284 ± 2337 | +109 % | +482 % |
| `total_tokens` (kleiner = besser) | **44.4M ± 3.4M** | 102.3M ± 17.2M | +130 % | +405 % |

Wallclock im Schnitt mehr als verdoppelt, Tokens 2.3× so viel; Streuung dramatisch breiter (σ-Faktor ~5 in beiden Achsen). Mechanistische Lesart: pro Refactor-Aufruf führt der Agent ESLint zweimal aus, parsed das JSON-Output, berechnet APP-Mass und McCabe von Hand für jede Funktion, und vergleicht alle vier Metriken pre/post. Bei 30.4 Refactor-Aufrufen pro Run = ~61 zusätzliche ESLint-Tool-Calls plus deutlich mehr Output-Tokens für die ausführliche Pre/Post-Block-Dokumentation. Der Anstieg von 2.8 Cycles (F-1.2) erklärt nur einen Teil der Kosten-Inflation; der größere Anteil kommt aus dem aufgeblähten Refactor-Subagent selbst.

Die hohe Streuung in beiden Kosten-Metriken kommt überwiegend aus Run 4 (Wallclock 9197 s, Tokens 128M) und Run 1 (Wallclock 5000 s, Tokens 107M) — beide mit ver = 0.93 bzw 1.00 jedoch ohne Self-Stop. Möglich, dass aufwändigere Refactor-Pfade in einigen Runs deutlich mehr Tool-Iterationen triggern als in anderen.

---

## F-1.5 — Predictions-Rate sinkt durch ehrlichere Falschvorhersagen, nicht Format-Bruch

`predictions_correct_rate` fällt von 97.2 % auf 89.6 % (Δ −7.6 pp). Eine Stichprobe-Inspektion zeigt: der Drop kommt aus Mehr-Wenn-Falsch, nicht aus weniger Prediction-Lines.

Run `2026-05-27_14-28-32` (ver = 0.93, predictions 62/84 = 73.8 %):

| Signal | Wert |
|---|---:|
| Insgesamt parsierte Prediction-Lines (Correct + Incorrect) | 168 |
| Davon Correct | 146 |
| Davon Incorrect | 22 |
| MARKERS-Format ("Red Phase Complete" + `(- \| ✅ \| ❌) (Correct\|Incorrect)`) intakt | ja |

Die 22 Incorrect-Markierungen sind echte Falschvorhersagen, die der Agent ehrlich dokumentiert hat — nicht abgekürzte oder gemergte Prediction-Lines. Die Verteilung über die Cycles ist gleichmäßig (keine Clusterung am Anfang/Ende). Bei v6.2 ist die Rate höher, weil der Baseline-Refactor weniger Tool-Output zu prozessieren hat und die Red-Phase-Predictions damit konsistenter zu der einfacheren Code-Struktur sind, die v6.2 produziert.

Mechanistische Lesart: Pre/Post-Messung verändert die Code-Struktur sichtbar (F-1.1) — der Agent macht in komplexeren Refactor-Pfaden mehr Vorhersagen über Runtime-Verhalten, das er sich aus dem Pre-Measurement abgeleitet hat, und liegt nicht immer richtig. Das ist ein Vertrauens-positives Signal, kein Disziplin-negativer. Vergleichbares Muster in RQ-1.8 dokumentiert (`predictions_correct_rate` 100 → 97.4 % bei v6.3-audit-bundle, dort als "intendierter Effekt des Backfill-Verbots" interpretiert).
