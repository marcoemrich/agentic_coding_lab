# RQ-model-quality-pi — Findings

**Setup**: game-of-life-example-mapping × v6.2.1-phase-continuation-pi × n=5 pro Zelle (10 Zellen, alle gefüllt). Diese RQ misst den **Modell-Effekt auf Code-Qualität und TDD-Disziplin** in einem harness-konstanten Setting. Primär-Achsen: `smell_total` (**Smell-Summe**), `cognitive_max`, `mccabe_max` — alle **kleiner = besser**. `tests_passing` (intern) und `verification_pct` (extern, game-of-life-verification) dienen als Korrektheits-Gate. Alle Modelle via pi-Harness / Requesty.

**Reasoning-Caveat**: Alle Modelle laufen im nativen Reasoning-Default (kein `-no-thinking`-Arm in dieser RQ). `glm-5-1` und `glm-5-2` sind ein direkter Intra-Familie-Versionsvergleich.

**Qualitäts-Gating**: Qualitätsmetriken sind nur sinnvoll, wenn der Code funktioniert. `qwen3-235b` (0 % `tests_passing`) und die 80-%-Modelle (glm-5-1, gpt-5-6-terra) tragen daher keinen Qualitäts-Pokal — niedrige Smell-/Complexity-Werte auf nicht-bestehendem Code sind kein Qualitätssignal.

## Übersicht — Code-Qualität, kleiner = besser (nur Zellen mit `tests_passing` = 100 %)

| Modell | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` | `cc_longest_function` | `tests_passing` |
|---|---|---|---|---|---|---|
| glm-5-2 | **1.0** 🏆 | 7.8 | 6.6 | 178.2 | 22.6 | 100 % |
| sonnet-5 | 2.2 | **6.6** 🏆 | **5.0** 🏆 | 183.0 | 19.6 | 100 % |
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 150.4 | 21.6 | 100 % |
| opus-4-8 | 3.4 | 9.6 | 6.8 | 149.2 | 17.4 | 100 % |
| gpt-5-6-sol | 3.6 | 13.4 | 9.4 | **134.8** 🏆 | 21.2 | 100 % |
| deepseek-v4-pro | 4.0 | 14.0 | 10.2 | 158.4 | 25.4 | 100 % |
| minimax-m3 | 8.4 | **6.6** 🏆 | 5.2 | 212.2 | **15.0** 🏆 | 100 % |
| — 80 %/0 % (kein Pokal) | | | | | | |
| glm-5-1 | 2.2 | 7.2 | 6.0 | 144.8 | 22.2 | 80 % |
| gpt-5-6-terra | 6.0 | 7.8 | 6.0 | 136.4 | 23.2 | 80 % |
| qwen3-235b | 1.8 | 6.4 | 3.4 | 206.6 | 42.4 | 0 % |

Richtung: alle fünf Qualitätsmetriken **kleiner = besser** (`smell_total` = **Smell-Summe**, `code_mass` = **Code-Mass (APP)**, `cc_longest_function` = **Spitzen-Komplexität**). Pokale nur unter den korrektheits-vollständigen Zellen (`tests_passing` = 100 %). Bei `cognitive_max` teilen sich sonnet-5 und minimax-m3 den Bestwert (6.6) — minimax trägt ihn mit, da `tests_passing` = 100 %, trotz nur 0.87 externer Verification. Bei `code_mass` führt gpt-5-6-sol (134.8), bei `cc_longest_function` minimax-m3 (15.0).

---

## F-1.1 — glm-5-2 liefert den saubersten Code, sonnet die niedrigste Komplexität

Unter den sieben korrektheits-vollständigen Modellen führt `glm-5-2` bei der **Smell-Summe** (1.0, gegenüber 2.2–8.4 der übrigen) und `sonnet-5` bei beiden Komplexitäts-Maßen (`cognitive_max` 6.6, `mccabe_max` 5.0). Kein Modell dominiert alle drei Achsen: glm-5-2 ist smell-arm, aber cognitive_max 7.8; sonnet ist komplexitäts-arm, aber smell 2.2.

| Modell | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` |
|---|---|---|---|---|
| glm-5-2 | 1.0 | 7.8 | 6.6 | 178 |
| sonnet-5 | 2.2 | 6.6 | 5.0 | 183 |
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 150 |
| opus-4-8 | 3.4 | 9.6 | 6.8 | 149 |

**Interpretation.** Die Modelle spreizen bei game-of-life über `smell_total` und `cognitive_max` messbar (H2 bestätigt: der pi-Harness ist diskriminationsfähig). Die Qualitätsachsen sind teilweise orthogonal — ein Modell mit wenig Smell hat nicht automatisch niedrige zyklomatische Komplexität. `glm-5-2` verbessert sich gegenüber `glm-5-1` in `verification_pct` (1.00 vs. 0.80, F-1.3), bei ähnlichem Qualitätsprofil.

---

## F-1.2 — deepseek und gpt-5-6-sol lösen die Kata korrekt, aber mit hoher Komplexität

`deepseek-v4-pro` und `gpt-5-6-sol` erreichen beide `verification_pct = 1.00` und `tests_passing = 100 %`, tragen aber die höchste zyklomatische und kognitive Komplexität des grünen Feldes: `cognitive_max` 14.0 bzw. 13.4, `mccabe_max` 10.2 bzw. 9.4 — rund doppelt so hoch wie sonnet (6.6 / 5.0).

| Modell | `verification_pct` | `cognitive_max` | `mccabe_max` | `smell_total` |
|---|---|---|---|---|
| deepseek-v4-pro | 1.00 | 14.0 | 10.2 | 4.0 |
| gpt-5-6-sol | 1.00 | 13.4 | 9.4 | 3.6 |
| sonnet-5 | 1.00 | 6.6 | 5.0 | 2.2 |

**Interpretation.** Korrektheit und Code-Komplexität sind entkoppelt: dieselbe perfekte externe Verification wird von sonnet mit halb so komplexem Code erreicht. Wer nur auf `verification_pct` optimiert, übersieht, dass deepseek/gpt-sol wartungsintensiveren Code produzieren — auf game-of-life ist das Signal klein (max ~14), skaliert aber mit der Kata-Größe.

---

## F-1.3 — Korrektheit clustert oben, mit qwen als Total-Fail

Auf der leichteren game-of-life-Kata erreichen sieben von zehn Modellen `verification_pct = 1.00`; der Continuation-Drop-Fix (v6.2.1) sorgt dafür, dass auch kimi/minimax/qwen den TDD-Loop durchlaufen. `qwen3-235b` bildet den Boden: es baut Code (`cli_built = true`), bekommt ihn aber nie grün (`tests_passing = 0 %`, `verification_pct = 0.25` über n=4 mit Verification-Ergebnis).

| Modell | `verification_pct` | `tests_passing`-Rate |
|---|---|---|
| opus-4-8, sonnet-5, gpt-5-6-sol, glm-5-2, kimi-k2-7, deepseek-v4-pro | 1.00 | 100 % |
| minimax-m3 | 0.87 | 100 % |
| glm-5-1 | 0.80 | 80 % |
| gpt-5-6-terra | 0.59 | 80 % |
| qwen3-235b | 0.25 | 0 % |

**Interpretation.** Das qwen-Muster ist harness- und kata-übergreifend konsistent mit RQ-model-novel-pi (claim-office): qwen produziert eine Implementierung, die weder intern noch extern besteht — ein echtes Kompetenz-Defizit, kein Abbruch. Die leichtere Kata hebt das Gesamtniveau (sieben perfekte Modelle vs. fünf auf claim-office), trennt die Schwachen aber gleich klar.

---

## F-1.4 — TDD-Disziplin variiert stark ohne Korrektheits-Korrelation

Unter den korrektheits-perfekten Modellen spannt `predictions_total` von 10 (gpt-5-6-sol) bis 19 (opus-4-8) und `cycle_count` von 8.6 (opus) bis 14.8 (sonnet). sonnet erreicht perfekte Korrektheit mit den wenigsten Predictions (4.8) überhaupt — deutlich unter dem Feld.

| Modell (verifiziert 1.0) | `cycle_count` | `predictions_total` | `refactorings_applied` |
|---|---|---|---|
| sonnet-5 | 14.8 | 4.8 | 3.2 |
| opus-4-8 | 8.6 | 19.4 | 3.0 |
| glm-5-2 | 10.8 | 11.2 | 5.8 |
| kimi-k2-7 | 9.6 | 13.6 | 3.4 |
| gpt-5-6-sol | 9.0 | 10.0 | 5.0 |

**Interpretation.** Wie in RQ-model-novel-pi (F-1.3) ist Marker-Compliance keine notwendige Bedingung für Korrektheit (H3/H4). sonnet-5 löst game-of-life perfekt mit 4.8 Predictions, opus braucht 19.4 für dasselbe Ergebnis. `cycle_count`/`predictions_total` messen Workflow-Konformität, nicht Ergebnisqualität.

---

## F-1.5 — Kosten spreizen um das 6-Fache bei vergleichbarer Qualität

Die geschätzten Laufkosten reichen von ~$0.60/Run (kimi, korrektheits-vollständig) bis ~$2.83 (sonnet). Unter den korrektheits-vollständigen, qualitativ starken Modellen ist `kimi-k2-7` mit ~$0.60/Run am günstigsten, `sonnet-5` (~$2.83) und `glm-5-2` (~$2.53) am teuersten. Die gescheiterten/teil-gescheiterten Modelle liegen dazwischen (qwen ~$0.72 bei 0 % tests_passing, gpt-5-6-terra ~$0.67 / glm-5-1 ~$1.74 bei 80 %).

| Modell (`tests_passing` 100 %) | `cost_usd` (Schätzung/Run) | `duration_seconds` | `total_tokens` | `smell_total` | `cognitive_max` |
|---|---|---|---|---|---|
| kimi-k2-7 | **$0.60** 🏆 | 234 | 1.338.798 | 3.0 | 10.8 |
| minimax-m3 | $0.77 | 4121 | 4.676.979 | 8.4 | 6.6 |
| deepseek-v4-pro | $0.83 | **200** 🏆 | 1.378.866 | 4.0 | 14.0 |
| gpt-5-6-sol | $1.09 | 240 | **661.453** 🏆 | 3.6 | 13.4 |
| opus-4-8 | $2.00 | 339 | 1.230.420 | 3.4 | 9.6 |
| glm-5-2 | $2.53 | 883 | 4.360.550 | 1.0 | 7.8 |
| sonnet-5 | $2.83 | 1216 | 3.664.000 | 2.2 | 6.6 |

Richtung: `cost_usd`, `duration_seconds` (Wall-Clock), `total_tokens` — kleiner = besser. Pokal nur unter `tests_passing` = 100 %. Bei `duration_seconds` führt deepseek-v4-pro (200 s), bei `total_tokens` gpt-5-6-sol (661k).

**Kosten-Caveat.** `cost_usd` ist eine **Listenpreis-Schätzung** (Requesty-Tarife pro 1M Token × gemessene Token, `research/model-pricing.md`, Stand 2026-07-25), kein abgerechneter Betrag — ohne workspace-spezifische Rabatte oder Smart-Routing-Ersparnis. Requesty liefert keine Inline-Kosten (`usage = null`); Token-Zahlen nach dem Parser-Fix (korrekte `cache_read`-Summierung).

**Interpretation.** Der günstigste qualitativ überzeugende Kompromiss ist `glm-5-2` bzw. `sonnet-5`: beste Qualität (smell 1.0 / komplexität 6.6-5.0), aber am oberen Preisende. Wer Kosten priorisiert und moderate Komplexität toleriert, wählt `kimi-k2-7` (~$0.60, 1/5 von sonnet) mit smell 3.0 — akzeptabel, aber cognitive_max 10.8. Ein „billig UND sauber"-Modell fehlt in diesem Feld: die smell-ärmsten Modelle (glm-5-2, sonnet) sind zugleich die teuersten. Wall-Clock und Token laufen nicht parallel zu den Kosten: `deepseek-v4-pro` und `gpt-5-6-sol` sind mit ~200–240 s am schnellsten und gpt-5-6-sol mit 661k am token-sparsamsten, während `minimax-m3` trotz niedriger Kosten (~$0.77) mit 4121 s und 4,7 M Token weit aus dem Rahmen fällt — der günstige Run erkauft sich seinen Preis über extreme Laufzeit und Token-Menge.

---

**Daten-Caveat.** Ein qwen3-235b-Run (`12-20-43`) wurde ohne Metadaten-Header angelegt (fehlendes `record-run`-Feld); kata/workflow/model wurden nachträglich aus dem Verzeichnisnamen ergänzt, damit er für die Qualitätsmetriken zählt. Für diesen Run liegt kein externes `verification_pct` vor, daher basiert die qwen-verification-Zahl auf n=4.
