# RQ-model-novel-pi — Findings

**Setup**: claim-office-example-mapping × v6.2.1-phase-continuation-pi × n=5 pro Zelle (15 Zellen, alle gefüllt). Primär-Outcome: `verification_pct` (**Korrektheit (außen)**, 15 externe Szenarien, 0.0–1.0). Alle Modelle via pi-Harness / Requesty.

**Workflow-Caveat**: Zellen aggregieren v6.2-with-why-cleaned-pi und v6.2.1-phase-continuation-pi gemeinsam (OR-Match, kanonisch als v6.2.1 gelabelt). v6.2.1 fixt nur den Continuation-Drop am Test-List→Red-Übergang (kimi/minimax/qwen brachen dort ab: nur `*.spec.ts`, kein `cli.ts`) und gilt als outcome-neutral. Betroffene Drop-Runs wurden durch v6.2.1-Runs ersetzt; die übrigen Zellen bleiben unveränderte v6.2-Runs.

**Reasoning-Caveat**: `<id>` = nativer Reasoning-Default, `<id>-no-thinking` = `--thinking off`. Der Schalter greift belegt nur bei `opus-4-8`; bei den übrigen Modellen ist der Arm-Vergleich ein Test der Steuerbarkeit selbst (siehe `README.md` → "Reasoning-Zustand"). `glm-5-2`, `gpt-5-6-sol`, `gpt-5-6-terra` haben nur einen Arm.

## Übersicht — Korrektheit (außen), höher = besser

| Modell | `verification_pct` mean | σ | `tests_passing`-Rate |
|---|---|---|---|
| opus-4-8-no-thinking | **1.00** 🏆 | 0.00 | 100 % |
| glm-5-2 | **1.00** 🏆 | 0.00 | 100 % |
| gpt-5-6-sol | **1.00** 🏆 | 0.00 | 100 % |
| kimi-k2-7 | **1.00** 🏆 | 0.00 | 100 % |
| opus-4-8 | **0.99** 🏆 | 0.03 | 100 % |
| sonnet-5-no-thinking | 0.84 | 0.15 | 100 % |
| deepseek-v4-pro-no-thinking | 0.80 | 0.45 | 80 % |
| minimax-m3-no-thinking | 0.77 | 0.44 | 80 % |
| kimi-k2-7-no-thinking | 0.73 | 0.42 | 80 % |
| sonnet-5 | 0.72 | 0.19 | 100 % |
| gpt-5-6-terra | 0.69 | 0.42 | 80 % |
| deepseek-v4-pro | 0.60 | 0.55 | 100 % |
| minimax-m3 | 0.20 | 0.45 | 100 % |
| qwen3-235b | 0.00 | 0.00 | 0 % |
| qwen3-235b-no-thinking | 0.00 | 0.00 | 0 % |

🏆 nur für die fünf Modelle mit `verification_pct ≥ 0.99` bei σ ≤ 0.03 (reproduzierbar perfekt). Die graduelle Mitte (0.60–0.84) trägt keinen Pokal — dort ist der Spread innerhalb σ nicht von Nachbarn trennbar.

---

## F-1.1 — Korrektheit clustert dichotom, mit gradueller Mittelzone

`verification_pct` verteilt sich nicht gleichmäßig, sondern in drei Gruppen: ein **Perfekt-Cluster** (opus-4-8 beide Arme, glm-5-2, gpt-5-6-sol, kimi-k2-7: mean ≈ 1.00, σ ≤ 0.03), ein **Total-Fail-Cluster** (qwen3-235b beide Arme: 0.00, σ 0.00) und eine **graduelle Mitte** (sonnet, deepseek, kimi-no-thinking, gpt-5-6-terra, minimax: 0.20–0.84 mit hohem σ). Die Extreme sind eng und reproduzierbar; die Mitte ist run-to-run instabil.

| Cluster | Modelle | `verification_pct` | σ-Bereich |
|---|---|---|---|
| Perfekt | opus-4-8, opus-4-8-no-thinking, glm-5-2, gpt-5-6-sol, kimi-k2-7 | 0.99–1.00 | 0.00–0.03 |
| Graduell | sonnet-5(-no-thinking), deepseek(-no-thinking), kimi-k2-7-no-thinking, gpt-5-6-terra, minimax-m3(-no-thinking) | 0.20–0.84 | 0.15–0.55 |
| Total-Fail | qwen3-235b, qwen3-235b-no-thinking | 0.00 | 0.00 |

**Interpretation.** claim-office-example-mapping wirkt für die Extreme als Pass/Fail-Filter (H2), aber nicht strikt binär: fünf Modellfamilien lösen einen Teil der fünf konstruierten Mehrdeutigkeiten korrekt und andere nicht, run-abhängig. Das hohe σ in der Mitte (bis 0.55) heißt, dass dieselbe Zelle über die fünf Replikate zwischen 0 und 15 bestandenen Szenarien schwankt — die Mehrdeutigkeits-Auflösung ist bei diesen Modellen nicht stabil, nicht durchgängig falsch. Bemerkenswert: `kimi-k2-7` (Reasoning-on) ist reproduzierbar perfekt, während sein `-no-thinking`-Arm in der graduellen Mitte liegt (0.73, σ 0.42) — der einzige Fall, in dem ein Reasoning-Arm die Cluster-Grenze überschreitet.

---

## F-1.2 — qwen3-235b baut Code, löst die Kata aber nie

`qwen3-235b` erreicht in beiden Armen `verification_pct = 0.00` und `tests_passing`-Rate 0 %. Unter v6.2.1 entsteht durchgehend Code (`cli_built = true` in allen Runs, **Produktiv-LoC** 27–331, **Code-Mass (APP)** ≈ 250–300 mean), aber keiner davon besteht die interne Test-Suite oder die externe Verification. Der `cycle_count` bleibt niedrig (2.8 bzw. 8.6) und stark streuend.

| Metrik | qwen3-235b | qwen3-235b-no-thinking |
|---|---|---|
| `verification_pct` | 0.00 | 0.00 |
| `tests_passing`-Rate | 0 % | 0 % |
| `code_mass` (**Code-Mass (APP)**) | 296.4 | 251.4 |
| `cc_longest_function` (**Spitzen-Komplexität**) | 33.0 | 33.2 |
| `lines_of_code` (**Produktiv-LoC**) | 117.8 | 84.0 |
| `cycle_count` | 2.8 | 8.6 |
| `predictions_total` | 10.8 | 14.8 |

**Interpretation.** Dies ist ein echtes Kompetenz-Defizit, kein Abbruch. Unter dem alten Workflow (v6.2) brach qwen am Test-List→Red-Übergang ab (leeres `src/`, kein CLI); mit dem v6.2.1-Fix läuft der TDD-Loop durch und qwen produziert eine vollständige Implementierung — die aber weder die internen Tests grün bekommt noch die 15 externen Szenarien löst. Das hohe σ in `code_mass`/`lines_of_code` (Produktiv-LoC 27 bis 331) zeigt: qwen findet keine stabile Herangehensweise. Auch die **Spitzen-Komplexität** streut extrem (min 3, max 78, σ ≈ 28 in beiden Armen) — mal ein Ein-Zeilen-Stub, mal eine unstrukturierte Monster-Funktion, ohne konvergente Struktur. Inhaltlich anders als minimax-m3 (baut Code, `tests_passing = 100 %`, scheitert nur an der externen Verification) — qwen scheitert schon intern.

---

## F-1.3 — TDD-Disziplin und Korrektheit korrelieren nicht

Modelle mit perfekter Korrektheit unterscheiden sich um mehr als eine Größenordnung in TDD-Marker-Compliance. `glm-5-2` erreicht `verification_pct = 1.00` mit 31 `predictions_total`; `opus-4-8` erreicht dasselbe mit 70 Predictions. `kimi-k2-7` erreicht ebenfalls 1.00 bei nur 37.6 Predictions, während `minimax-m3` mit vergleichbaren 18.4 Predictions nur 0.20 Korrektheit liefert.

| Modell (verifiziert ≥ 0.99) | `verification_pct` | `cycle_count` | `predictions_total` | `refactorings_applied` |
|---|---|---|---|---|
| gpt-5-6-sol | 1.00 | 17.8 | 20.8 | 8.4 |
| kimi-k2-7 | 1.00 | 23.4 | 37.6 | 12.0 |
| glm-5-2 | 1.00 | 44.8 | 31.2 | 15.6 |
| opus-4-8-no-thinking | 1.00 | 51.0 | 63.2 | 15.8 |
| opus-4-8 | 0.99 | 40.2 | 70.0 | 19.4 |

**Interpretation.** Die Test-First-Marker-Compliance (`predictions_total`, `cycle_count`) ist keine notwendige Bedingung für Korrektheit (H4). gpt-5-6-sol und kimi-k2-7 lösen die Kata mit der Hälfte bis einem Drittel der Opus-Prediction-Menge ebenso perfekt. Marker-Compliance misst Workflow-Konformität, nicht Ergebnisqualität — beides sind getrennte Achsen.

---

## F-1.4 — Der Reasoning-Schalter verschiebt die Korrektheit nicht

Wo beide Arme existieren, liegt der `verification_pct`-Unterschied zwischen `<id>` und `<id>-no-thinking` meist innerhalb σ. Bei `opus-4-8` — dem einzigen Modell mit belegt greifendem Schalter — sind beide Arme ≈ 1.00. Bei den Modellen, deren Schalter laut Seil-Rätsel-Probe wirkungslos ist, streuen die Arme ohne konsistente Richtung (sonnet-off 0.84 vs on 0.72; deepseek-off 0.80 vs on 0.60; minimax-off 0.77 vs on 0.20; kimi hingegen off 0.73 vs on 1.00).

| Modell | on (`<id>`) | off (`-no-thinking`) | Δ (off − on) |
|---|---|---|---|
| opus-4-8 | 0.99 | 1.00 | +0.01 |
| sonnet-5 | 0.72 | 0.84 | +0.12 |
| deepseek-v4-pro | 0.60 | 0.80 | +0.20 |
| kimi-k2-7 | 1.00 | 0.73 | −0.27 |
| minimax-m3 | 0.20 | 0.77 | +0.57 |

**Interpretation.** Selbst bei opus, wo der Schalter nachweislich Thinking-Blöcke an-/abschaltet, bewegt sich die Korrektheit nicht. Bei den übrigen Modellen ist der „off"-Arm derselbe Routing-Pfad wie „on" (Schalter wirkungslos, empirisch geprüft) — die Δ dort sind Replikat-Rauschen (alle innerhalb der σ von 0.42–0.55 der jeweiligen Zellen), keine Reasoning-Effekte. Dass die Δ mal positiv (minimax +0.57), mal negativ (kimi −0.27) ausfallen, ohne dass der Schalter überhaupt wirkt, bestätigt: Es ist Rauschen, kein Reasoning-Signal. Über diese RQ hinweg ist der native Reasoning-Zustand kein Prädiktor für `verification_pct`.

---

## F-1.5 — Perfekte Korrektheit bei stark unterschiedlichen Kosten

Unter den fünf reproduzierbar perfekten Zellen (`verification_pct ≥ 0.99`) spannt die geschätzte Laufkosten fast eine Größenordnung: `gpt-5-6-sol` löst die Kata perfekt für ~$2.54/Run, opus-4-8 kostet ~$14.43 — rund 5,7×. Die Schätzung wendet die aktuellen Requesty-Token-Tarife (Stand 2026-07-25, `research/model-pricing.md`) auf die pro Run gemessene Token-Aufschlüsselung (Input/Output/Cache) an.

| Modell (verifiziert ≥ 0.99) | `cost_usd` (Schätzung/Run) | σ | `duration_seconds` | `code_mass` | `cc_longest_function` | `smell_total` |
|---|---|---|---|---|---|---|
| gpt-5-6-sol | **$2.54** 🏆 | 0.65 | **503** 🏆 | **462** 🏆 | 24.0 | 15.4 |
| kimi-k2-7 | $6.79 | 1.46 | 2214 | 851 | 19.4 | **0.0** 🏆 |
| glm-5-2 | $7.76 | 4.51 | 2818 | 761 | 24.0 | 0.2 |
| opus-4-8-no-thinking | $13.68 | 3.17 | 1656 | 895 | **18.2** 🏆 | **0.0** 🏆 |
| opus-4-8 | $14.43 | 2.98 | 1884 | 782 | 22.0 | 0.4 |

Richtung: `cost_usd`, `duration_seconds`, `code_mass` (**Code-Mass (APP)**), `cc_longest_function` (**Spitzen-Komplexität**), `smell_total` (**Smell-Summe**) — kleiner = besser. Pokale nur unter den korrektheits-perfekten Zellen (Correctness-Gating: Modelle mit niedrigen Kosten aber unvollständiger Verification zeigen Stubs/Abbrüche, keine Sparsamkeit). Bei `smell_total` teilen sich kimi-k2-7 und opus-4-8-no-thinking den Pokal (beide 0.0). `gpt-5-6-terra` ($0.60/Run) ist billiger, aber mit `verification_pct = 0.69` nicht im Perfekt-Cluster und daher ohne Pokal.

**Kosten-Caveat.** `cost_usd` ist eine **Listenpreis-Schätzung** (Requesty-Tarife pro 1M Token × gemessene Token), kein abgerechneter Betrag — ohne workspace-spezifische Rabatte oder Smart-Routing-Ersparnis (laut Anbieter 30–80 % durch Caching möglich). Requesty liefert keine Inline-Kosten (`usage = null`), daher ist Token × Preis der einzige Weg. Die Token-Zahlen und damit die Kosten liegen nach dem Parser-Fix (korrekte `cache_read`-Summierung über den Main-Thread) deutlich höher als in früheren Schätzungen. Alle 15 Zellen haben jetzt eine Schätzung.

**Interpretation.** `gpt-5-6-sol` ist unter den perfekten Modellen mit Abstand am günstigsten (~$2.54/Run, ~1/5.7 der Opus-Kosten) und zugleich am schnellsten — der Preis ist die höchste **Smell-Summe** der Gruppe (15.4 vs. ≤ 0.4 bei den übrigen). Die **Spitzen-Komplexität** liegt bei allen fünf perfekten Zellen eng beieinander (18–24 Zeilen längste Funktion) — anders als die instabile qwen-Streuung ist die Struktur hier durchweg kompakt; opus-4-8-no-thinking hält mit 18.2 die niedrigste Spitze. `kimi-k2-7` ist der interessante Mittelweg: perfekte Korrektheit, **Smell-Summe 0.0** (bester der Gruppe, gleichauf mit opus-4-8-no-thinking) und mit ~$6.79 rund halb so teuer wie opus. Wer perfekte Korrektheit bei minimalem Code-Smell zu moderaten Kosten braucht, findet in kimi-k2-7 den besten Kompromiss; wer Kosten und Latenz über alles stellt und etwas Smell toleriert, wählt `gpt-5-6-sol`; die Opus-Arme ($13.68–14.43) liefern dieselbe Korrektheit bei minimalem Smell und niedrigster Spitzen-Komplexität, aber zum höchsten Preis.
