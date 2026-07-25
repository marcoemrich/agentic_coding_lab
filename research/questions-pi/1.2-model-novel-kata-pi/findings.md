# RQ-model-novel-pi — Findings

**Setup**: claim-office-example-mapping × v6.2-with-why-cleaned-pi × n=5 pro Zelle (15 Zellen, alle gefüllt). Primär-Outcome: `verification_pct` (**Korrektheit (außen)**, 15 externe Szenarien, 0.0–1.0). Alle Modelle via pi-Harness / Requesty.

**Reasoning-Caveat**: `<id>` = nativer Reasoning-Default, `<id>-no-thinking` = `--thinking off`. Der Schalter greift belegt nur bei `opus-4-8`; bei den übrigen Modellen ist der Arm-Vergleich ein Test der Steuerbarkeit selbst (siehe `README.md` → "Reasoning-Zustand"). `glm-5-2`, `gpt-5-6-sol`, `gpt-5-6-terra` haben nur einen Arm.

## Übersicht — Korrektheit (außen), höher = besser

| Modell | `verification_pct` mean | σ | `tests_passing`-Rate |
|---|---|---|---|
| opus-4-8-no-thinking | **1.00** 🏆 | 0.00 | 100 % |
| glm-5-2 | **1.00** 🏆 | 0.00 | 100 % |
| gpt-5-6-sol | **1.00** 🏆 | 0.00 | 100 % |
| opus-4-8 | **0.99** 🏆 | 0.03 | 100 % |
| sonnet-5-no-thinking | 0.84 | 0.15 | 100 % |
| deepseek-v4-pro-no-thinking | 0.80 | 0.45 | 80 % |
| kimi-k2-7-no-thinking | 0.73 | 0.42 | 80 % |
| sonnet-5 | 0.72 | 0.19 | 100 % |
| gpt-5-6-terra | 0.69 | 0.42 | 80 % |
| deepseek-v4-pro | 0.60 | 0.55 | 100 % |
| kimi-k2-7 | 0.60 | 0.55 | 60 % |
| minimax-m3-no-thinking | 0.60 | 0.55 | 80 % |
| minimax-m3 | 0.20 | 0.45 | 100 % |
| qwen3-235b | 0.00 | 0.00 | 0 % |
| qwen3-235b-no-thinking | 0.00 | 0.00 | 0 % |

🏆 nur für die vier Modelle mit `verification_pct ≥ 0.99` bei σ ≤ 0.03 (reproduzierbar perfekt). Die graduelle Mitte (0.60–0.84) trägt keinen Pokal — dort ist der Spread innerhalb σ nicht von Nachbarn trennbar.

---

## F-1.1 — Korrektheit clustert dichotom, mit gradueller Mittelzone

`verification_pct` verteilt sich nicht gleichmäßig, sondern in drei Gruppen: ein **Perfekt-Cluster** (opus-4-8 beide Arme, glm-5-2, gpt-5-6-sol: mean ≈ 1.00, σ ≤ 0.03), ein **Total-Fail-Cluster** (qwen3-235b beide Arme: 0.00, σ 0.00) und eine **graduelle Mitte** (sonnet, kimi, deepseek, gpt-5-6-terra, minimax: 0.20–0.84 mit hohem σ). Die Extreme sind eng und reproduzierbar; die Mitte ist run-to-run instabil.

| Cluster | Modelle | `verification_pct` | σ-Bereich |
|---|---|---|---|
| Perfekt | opus-4-8, opus-4-8-no-thinking, glm-5-2, gpt-5-6-sol | 0.99–1.00 | 0.00–0.03 |
| Graduell | sonnet-5(-no-thinking), deepseek(-no-thinking), kimi(-no-thinking), gpt-5-6-terra, minimax-m3(-no-thinking) | 0.20–0.84 | 0.15–0.55 |
| Total-Fail | qwen3-235b, qwen3-235b-no-thinking | 0.00 | 0.00 |

**Interpretation.** claim-office-example-mapping wirkt für die Extreme als Pass/Fail-Filter (H2), aber nicht strikt binär: fünf Modellfamilien lösen einen Teil der fünf konstruierten Mehrdeutigkeiten korrekt und andere nicht, run-abhängig. Das hohe σ in der Mitte (bis 0.55) heißt, dass dieselbe Zelle über die fünf Replikate zwischen 0 und 15 bestandenen Szenarien schwankt — die Mehrdeutigkeits-Auflösung ist bei diesen Modellen nicht stabil, nicht durchgängig falsch.

---

## F-1.2 — qwen3-235b greift die Kata nicht an

`qwen3-235b` erreicht in beiden Armen `verification_pct = 0.00` — aber nicht durch falsche Mehrdeutigkeits-Auflösung, sondern weil praktisch kein Code entsteht: **Code-Mass (APP)** ≈ 0–17, **Produktiv-LoC** ≈ 0–5, `tests_passing`-Rate 0 %, ~12k `total_tokens` (Faktor 100+ unter allen anderen Modellen). Das CLI wird nie gebaut (`cli_built = false` in vier von fünf Runs je Arm).

| Metrik | qwen3-235b | qwen3-235b-no-thinking |
|---|---|---|
| `verification_pct` | 0.00 | 0.00 |
| `code_mass` (**Code-Mass (APP)**) | 17.0 | 0.0 |
| `lines_of_code` | 5.4 | 0.0 |
| `total_tokens` | 14.1 k | 11.6 k |
| `cycle_count` | 0.2 | 0.0 |

**Interpretation.** Dies ist ein Verweigerungs-/Abbruch-Muster, kein Spec-Verstehens-Defizit. `verification_pct = 0` mit leerem `src/` heißt „kein CLI-Vertrag, keine Implementierung" — inhaltlich anders als minimax-m3 (baut vollen Code, scheitert an der externen Verification). Die niedrige Token-Zahl bei `completed_within_budget = 100 %` zeigt: qwen3 beendet den Run regulär, ohne die Aufgabe zu bearbeiten.

---

## F-1.3 — TDD-Disziplin und Korrektheit korrelieren nicht

Modelle mit perfekter Korrektheit unterscheiden sich um mehr als eine Größenordnung in TDD-Marker-Compliance. `glm-5-2` erreicht `verification_pct = 1.00` mit nur 12 `cycle_count` und 6 `predictions_total`; `opus-4-8` erreicht dasselbe mit 40 Cycles und 70 Predictions. `kimi-k2-7` erreicht 0.60 Korrektheit bei 20 Predictions, `minimax-m3` nur 0.20 bei ebenfalls 18 Predictions.

| Modell (verifiziert 1.0) | `verification_pct` | `cycle_count` | `predictions_total` | `refactorings_applied` |
|---|---|---|---|---|
| glm-5-2 | 1.00 | 12.0 | 6.0 | 3.0 |
| gpt-5-6-sol | 1.00 | 17.8 | 20.8 | 8.4 |
| opus-4-8-no-thinking | 1.00 | 51.0 | 63.2 | 15.8 |
| opus-4-8 | 0.99 | 40.2 | 70.0 | 19.4 |

**Interpretation.** Die Test-First-Marker-Compliance (`predictions_total`, `cycle_count`) ist keine notwendige Bedingung für Korrektheit (H4). glm-5-2 löst die Kata mit minimaler sichtbarer TDD-Mechanik ebenso perfekt wie das prediction-intensive opus. Marker-Compliance misst Workflow-Konformität, nicht Ergebnisqualität — beides sind getrennte Achsen.

---

## F-1.4 — Der Reasoning-Schalter verschiebt die Korrektheit nicht

Wo beide Arme existieren, liegt der `verification_pct`-Unterschied zwischen `<id>` und `<id>-no-thinking` innerhalb σ. Bei `opus-4-8` — dem einzigen Modell mit belegt greifendem Schalter — sind beide Arme ≈ 1.00. Bei den Modellen, deren Schalter laut Seil-Rätsel-Probe wirkungslos ist, streuen die Arme ohne Richtung (sonnet-off 0.84 vs on 0.72; deepseek-off 0.80 vs on 0.60; minimax-off 0.60 vs on 0.20).

| Modell | on (`<id>`) | off (`-no-thinking`) | Δ |
|---|---|---|---|
| opus-4-8 | 0.99 | 1.00 | +0.01 |
| sonnet-5 | 0.72 | 0.84 | +0.12 |
| deepseek-v4-pro | 0.60 | 0.80 | +0.20 |
| kimi-k2-7 | 0.60 | 0.73 | +0.13 |
| minimax-m3 | 0.20 | 0.60 | +0.40 |

**Interpretation.** Selbst bei opus, wo der Schalter nachweislich Thinking-Blöcke an-/abschaltet, bewegt sich die Korrektheit nicht. Bei den übrigen Modellen ist der „off"-Arm derselbe Routing-Pfad wie „on" (Schalter wirkungslos, empirisch geprüft) — die Δ dort sind Replikat-Rauschen (alle innerhalb der σ von 0.42–0.55 der jeweiligen Zellen), keine Reasoning-Effekte. Über diese RQ hinweg ist der native Reasoning-Zustand kein Prädiktor für `verification_pct`.

---

## F-1.5 — Perfekte Korrektheit bei sehr unterschiedlichem Aufwand und Kosten

Unter den vier reproduzierbar perfekten Zellen (`verification_pct ≥ 0.99`) spannt der Aufwand eine Größenordnung: `gpt-5-6-sol` erreicht 1.00 mit ~424 k Tokens in ~500 s, `glm-5-2` braucht ~2818 s (fast 1 h), opus liegt bei ~1.4–1.6 M Tokens. Da alle vier Zellen reproduzierbar perfekt sind (`verification_pct` ≈ 1.00, σ ≤ 0.03), ist `total_tokens` pro Run zugleich der **Token-Aufwand pro perfektem Ergebnis** — ein Kosten-Proxy in Abwesenheit von `cost_usd`.

| Modell (verifiziert ≥ 0.99) | `total_tokens` (= Tokens/perfektes Ergebnis) | σ | `duration_seconds` | `code_mass` | `smell_total` |
|---|---|---|---|---|---|
| gpt-5-6-sol | **424 k** 🏆 | 165 k | **503** 🏆 | **462** 🏆 | 15.4 |
| glm-5-2 | 439 k | 982 k | 2818 | 761 | **0.2** 🏆 |
| opus-4-8-no-thinking | 1.43 M | 446 k | 1656 | 895 | **0.0** 🏆 |
| opus-4-8 | 1.61 M | 395 k | 1884 | 782 | 0.4 |

Richtung: `total_tokens`, `duration_seconds`, `code_mass` (**Code-Mass (APP)**), `smell_total` (**Smell-Summe**) — kleiner = besser. Pokale nur unter den korrektheits-perfekten Zellen (Correctness-Gating: Modelle mit niedrigen Aufwands-Werten aber unvollständiger Verification zeigen Stubs/Abbrüche, keine Sparsamkeit).

**Kosten-Caveat.** `cost_usd` wird vom pi-/Requesty-Harness nicht erfasst (in allen 75 Runs leer) — eine Dollar-Übersicht ist mit den vorhandenen Daten nicht möglich. `total_tokens` ist der belastbarste verfügbare Kosten-Proxy, verzerrt aber zwischen Anbietern: die Token-Zählung mischt Input/Output/Cache und die Reasoning-Token-Kanäle (`reasoning_content`) unterschiedlich, und der $/Token-Preis variiert je Backprovider stark. Der hohe σ bei `glm-5-2` (982 k) stammt aus einem einzelnen Reasoning-Loop-Run mit ~2.2 M Tokens; der Median liegt deutlich unter dem Mean.

**Interpretation.** `gpt-5-6-sol` ist unter den perfekten Modellen das effizienteste auf Token- **und** Zeit-Achse (~424 k Tokens, ~500 s) — bei rund einem Viertel des Token-Aufwands von opus. Der Preis dafür ist die höchste **Smell-Summe** der Gruppe (15.4 vs. ≤ 0.4 bei opus/glm). `glm-5-2` ist token-günstig im Median, aber die langsamste Zelle und mit dem größten Ausreißer-Risiko. Wer perfekte Korrektheit bei minimalem Code-Smell will, wählt `opus-4-8-no-thinking` oder `glm-5-2`; wer Token-Durchsatz und Latenz priorisiert, `gpt-5-6-sol`.
