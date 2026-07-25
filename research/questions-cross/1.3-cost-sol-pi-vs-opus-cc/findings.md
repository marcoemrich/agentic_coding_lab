# RQ-cost-sol-pi-vs-opus-cc — Findings

**Setup:** Kosten-Umstiegs-Vergleich zweier gekoppelter Praxis-Bündel —
**sol-pi** (`gpt-5-6-sol` auf pi) vs **opus-cc** (`opus-4-8` auf Claude Code) —
bei konstantem Prompt-Stil (`example-mapping`) und outcome-äquivalentem
TDD-Workflow, über beide Katas. n=5 pro Zelle, 4 Zellen (2 Bündel × 2 Katas).

**Confound-Caveat (bindend):** Modell UND Harness variieren gemeinsam — der
gemessene Unterschied ist die **Summe** aus Modell- und Harness-Effekt, nicht
einer allein. Isolierte Effekte: Harness in `RQ-harness-requesty`
(`../1.2-harness-requesty/`), Modell in `RQ-model-quality-pi`
(`../../questions-pi/1.1-model-quality-pi/`).

**Kosten-Caveat:** `cost_usd` ist Listenpreis-Schätzung (Token × Preis,
`compute-cost.py`), kein abgerechneter Betrag. Die zwei Bündel tragen
**verschiedene Tarife** (sol `azure/gpt-5.6-sol` $5.00/$30.00/$0.50; opus
`vertex/claude-opus-4-8@eu` Requesty $5.50/$27.50/$0.55/$6.25 pro 1M) — der
Preisunterschied ist Tarif **und** Aufwand zusammen, was der Umstiegs-Frage
entspricht.

## Übersicht

Primär-Outcome **Kosten** `cost_usd` (kleiner = besser) + Korrektheit außen
`verification_pct` (höher = besser), je Bündel × Kata.

### claim-office (CLI-Kata, hohe Token-Last)

| Metrik (Richtung) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (kleiner) | **2.54** 🏆 | 32.89 |
| `total_tokens` (kleiner) | **2.09 M** 🏆 | 49.9 M |
| `duration_seconds` (kleiner) | **503** 🏆 | 3149 |
| `verification_pct` (höher) | **1.00** 🏆 | 0.93 |
| `tests_passing`-Rate (höher) | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` (kleiner) | 9.2 | **3.0** 🏆 |
| `mccabe_max` (kleiner) | 6.8 | **3.8** 🏆 |
| `smell_total` (Smell-Summe, kleiner) | 15.4 | **0.0** 🏆 |

### game-of-life (Code-Qualitäts-Kata, alle Zellen `verification_pct` = 1.0)

| Metrik (Richtung) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (kleiner) | **1.09** 🏆 | 3.45 |
| `total_tokens` (kleiner) | **0.66 M** 🏆 | 4.09 M |
| `duration_seconds` (kleiner) | **240** 🏆 | 719 |
| `verification_pct` (höher) | **1.0** 🏆 | **1.0** 🏆 |
| `cognitive_max` (kleiner) | 13.4 | **5.0** 🏆 |
| `mccabe_max` (kleiner) | 9.4 | **4.6** 🏆 |
| `smell_total` (Smell-Summe, kleiner) | 3.6 | **2.2** 🏆 |

Trophy-Gating: Kosten-/Korrektheits-Trophies gehen an das jeweils bessere Bündel;
Qualitäts-Trophies nur unter Zellen mit voller Korrektheit — auf beiden Katas
erfüllen beide Bündel `tests_passing` = 100 % (und auf game-of-life beide
`verification_pct` = 1.0), also regulär vergeben.

---

## F-1.1 — sol-pi ist auf beiden Katas drastisch günstiger — auf der teuren Kata ~13×

Der Kostenvorteil von sol-pi skaliert mit der Token-Last der Kata: auf der
günstigen game-of-life ~3.2×, auf der token-schweren claim-office ~13×.

| Kata | sol-pi `cost_usd` | opus-cc `cost_usd` | Faktor | Ersparnis |
|---|---:|---:|---:|---:|
| claim-office | 2.54 | 32.89 | **~13.0×** | ~92 % |
| game-of-life | 1.09 | 3.45 | **~3.2×** | ~68 % |

Der Vorteil speist sich aus zwei gleichgerichteten Hebeln: sol-pi zieht **massiv
weniger Tokens** (claim-office 2.09 M vs 49.9 M = ~4 %, game-of-life 0.66 M vs
4.09 M = ~16 %) und läuft auf dem günstigen Modell-Tarif. Der Token-Abstand ist
auf claim-office extrem — opus-cc verarbeitet dort das ~24-Fache. Da beide Bündel
verschiedene Tarife tragen, ist der $-Faktor nicht rein Token-getrieben, aber die
Token-Rangfolge dominiert die Größenordnung. sol-pi ist zusätzlich deutlich
schneller (claim-office 503 s vs 3149 s, game-of-life 240 s vs 719 s). H1
bestätigt: Spread auf claim-office > game-of-life.

---

## F-1.2 — Der Preisvorteil kostet keine Korrektheit — auf claim-office ist sol-pi sogar genauer

Trotz ~13× niedrigerer Kosten liegt sol-pi bei der außen gemessenen Korrektheit
gleichauf oder vorne.

| Kata | Outcome | sol-pi | opus-cc |
|---|---|---:|---:|
| claim-office | `verification_pct` (mean) | 1.00 | 0.93 |
| claim-office | `verification_pct` (σ) | 0.00 | 0.12 |
| claim-office | `tests_passing` | 100 % | 100 % |
| game-of-life | `verification_pct` (mean) | 1.0 | 1.0 |
| game-of-life | `tests_passing` | 100 % | 100 % |

Auf game-of-life sind beide Bündel voll korrekt. Auf claim-office erreicht sol-pi
`verification_pct` = 1.00 bei σ = 0, während opus-cc auf 0.93 (σ = 0.12, min 0.73)
streut — ein einzelner opus-cc-Run fällt auf 0.73. Der günstige Umstieg bringt
hier also **keinen** Korrektheits-Nachteil, im Gegenteil einen kleinen Vorteil bei
höherer Konsistenz. H2 bestätigt. (Caveat: n=5, die opus-cc-Streuung liegt
innerhalb der Replikat-Varianz aus `RQ-harness-requesty` — kein belastbarer
Modell-Korrektheits-Nachteil, aber klar kein sol-pi-Defizit.)

---

## F-1.3 — Billiger heißt nicht sauberer: sol-pi trägt durchweg höhere Komplexität und mehr Smells

Der Preisvorteil erkauft sich Wartbarkeit. opus-cc gewinnt jede Qualitäts-Achse
auf beiden Katas — am deutlichsten bei der Smell-Summe auf claim-office.

| Kata | Metrik (kleiner = besser) | sol-pi | opus-cc |
|---|---|---:|---:|
| claim-office | `cognitive_max` | 9.2 | 3.0 |
| claim-office | `mccabe_max` | 6.8 | 3.8 |
| claim-office | `smell_total` (Smell-Summe) | 15.4 | 0.0 |
| game-of-life | `cognitive_max` | 13.4 | 5.0 |
| game-of-life | `mccabe_max` | 9.4 | 4.6 |
| game-of-life | `smell_total` (Smell-Summe) | 3.6 | 2.2 |

opus-cc's `cognitive_max` liegt bei ~30–40 % der sol-pi-Werte; auf claim-office
produziert opus-cc **null** Smells gegenüber 15.4 bei sol-pi. Das deckt sich mit
`RQ-model-quality-pi` F-1.2 (gpt-5-6-sol trägt bei game-of-life `cognitive_max`
13.4 — identischer Wert, da dieselben Runs) und mit `RQ-harness-requesty` F-1.3
(CC drückt die Spitzen-Komplexität via häufigerem Refactoring). Beide Effekte
addieren sich hier: das schwächere Modell UND der Refactor-ärmere Harness ziehen
in dieselbe Richtung. H3 bestätigt.

---

## Praxis-Fazit

Wer von **opus-cc auf sol-pi** umsteigt, spart je nach Kata **~68 % bis ~92 %**
der Laufkosten und läuft ~3× schneller, **ohne Korrektheit einzubüßen** (auf
claim-office sogar konsistenter). Der Preis ist **Wartbarkeit**: spürbar höhere
Spitzen-Komplexität und deutlich mehr Code-Smells — auf der CLI-Kata der größte
Abstand. Faustregel: sol-pi für kosten- und durchsatzkritische Arbeit mit
tolerierbarer Nachbearbeitung; opus-cc, wo niedrige Komplexität und Smell-Freiheit
den Aufpreis rechtfertigen.
