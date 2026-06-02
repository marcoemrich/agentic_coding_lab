# RQ-prompt-correctness Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Steigert Example-Mapping die Korrektheit gegenüber Prose und
User-Story — und ist der Effekt modellabhängig?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

Datenbasis: 128 Runs (22 von 24 Zellen bei n≥5; nur opus-4-6 ×
example-mapping bei n=4). Stand 2026-06-02.

## Übersicht: Korrektheit (außen) nach Modell × Prompt-Stil × Thinking

| Modell | Modus | prose | example-mapping | user-story |
|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | **0.95** 🏆 | 0.21 |
| opus-4-7 | −thinking | 0.21 | **0.97** 🏆 | 0.13 |
| opus-4-6 | +thinking | 0.24 | **0.72** 🏆 | 0.22 |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.18 |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | — |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 |
| haiku-4-5 | +thinking | 0.00 | 0.00 | 0.01 |
| haiku-4-5 | −thinking | 0.00 | 0.00 | 0.00 |

Werte: mean(`verification_pct`), je n=5 (opus-4-6 EM n=4; opus-4-7
−thinking EM n=9). Höher = besser; 🏆 = bester Stil pro Zeile
(Haiku-Zeilen: kein Effekt, alle Werte ~0 → kein Sieger).
Routing: opus-4-7 Direct-API, übrige Portkey (`controls.model`).

---

## F-prompt-correctness.1 — Schwache Modelle scheitern unabhängig vom Prompt-Stil

Haiku 4.5 erreicht 0 % Korrektheit (außen) über alle drei Prompt-Stile
und beide Thinking-Modi (n=30, 6 Zellen à 5 Runs, `verification_pct`
= 0.00, σ=0.00 in jeder Zelle).

| Prompt-Stil | +thinking | −thinking |
|---|---|---|
| prose | 0.00 | 0.00 |
| example-mapping | 0.00 | 0.00 |
| user-story | 0.01 | 0.00 |

**Datenbasis**: 30 Runs, alle Haiku-4.5-portkey × v5 × claim-office.

**Rationale**: Die Kata erfordert, dass der Agent mehrere
Domänenregeln korrekt interpretiert und in eine lauffähige CLI
umsetzt. Haiku produziert zwar kompilierbaren Code mit
`cli_built=true`, aber die Domänenlogik ist in keinem Fall nah
genug an der externen Verifikations-Suite. Example-Mapping —
das bei stärkeren Modellen den entscheidenden Unterschied macht
(→ F-prompt-correctness.2) — hat für Haiku keinen messbaren Effekt: die
Reasoning-Kapazität reicht nicht aus, um die Beispiele auf neue
Eingaben zu generalisieren.

**Bezug zu H5**: Bestätigt. Schwächere Modelle erreichen auch mit
example-mapping keine Korrektheit.

---

## F-prompt-correctness.2 — Example-Mapping hebt Korrektheit massiv

Bei Opus 4.7, Opus 4.6 und Sonnet 4.6 steigert example-mapping die
Korrektheit (außen) gegenüber prose um 14–76 Prozentpunkte. Bei Opus
ist der Effekt in beiden Thinking-Modi stark; bei Sonnet nur ohne
Thinking.

| Modell | Modus | prose | example-mapping | user-story | Δ (EM − prose) |
|---|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | **0.95** 🏆 | 0.21 | **+66 pp** |
| opus-4-7 | −thinking | 0.21 | **0.97** 🏆 | 0.13 | **+76 pp** |
| opus-4-6 | +thinking | 0.24 | **0.72** 🏆 | 0.22 | **+48 pp** |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.18 | **+64 pp** |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | — | +14 pp |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 | **+48 pp** |

Höher = besser; 🏆 = bester Stil pro Zeile (Spalten prose/EM/user-story).
Δ ist eine Effektgröße, kein Wettbewerb → kein 🏆.

**Datenbasis**: 128 Runs gesamt; diese Tabelle: Opus 4.7 (n=5/Modus,
EM −thinking n=9), Opus 4.6 (n=5/Modus, EM +thinking n=4), Sonnet 4.6
(n=5/Modus). Haiku ausgenommen — dort ist der Prompt-Stil irrelevant
(→ F-prompt-correctness.1).

**Rationale**: Example-Mapping liefert konkrete Input/Output-Paare,
die die Mehrdeutigkeiten der Kata-Regeln auflösen. Modelle mit
ausreichender Reasoning-Kapazität (Opus, Sonnet) können die Muster
auf neue Eingaben generalisieren.

**Bezug zu H1**: Bestätigt. EM steigert Korrektheit bei Opus 4.7 um
+66–76 pp, bei Opus 4.6 um +48–64 pp und bei Sonnet −thinking um
+48 pp. Sonnet +thinking zeigt +14 pp — schwächer, aber gleiche
Richtung.

---

## F-prompt-correctness.3 — Thinking schadet bei Example-Mapping (Sonnet > Opus)

Thinking-Mode reduziert die Korrektheit (außen) bei example-mapping,
aber der Effekt ist modellabhängig:

| Modell | +thinking | −thinking | Δ |
|---|---|---|---|
| sonnet-4-6 | 0.35 (σ=0.41) | **0.71** 🏆 (σ=0.18) | **−36 pp** |
| opus-4-6 | 0.72 (σ=0.38) | **0.87** 🏆 (σ=0.30) | −15 pp |
| opus-4-7 | **0.95** 🏆 (σ=0.12) | **0.97** 🏆 (σ=0.09) | −2 pp |

Höher = besser; 🏆 = besserer Modus pro Zeile (+thinking vs. −thinking). Δ = Effektgröße, kein 🏆.

Bei prose und user-story ist der Thinking-Effekt vernachlässigbar
(±5 pp, keine konsistente Richtung).

**Datenbasis**: 33 Runs (Opus 4.7 + Opus 4.6 + Sonnet 4.6 × ±thinking
× example-mapping; je n=5, außer opus-4-6 +thinking n=4 und opus-4-7
−thinking n=9).

**Mechanismus (Transcript-Analyse)**: In einem Sonnet-+thinking-Run
mit `verification_pct`=0 findet sich im Thinking-Block die
Passage: *"I'm realizing the first insurance surcharge might apply
to every item in a quote regardless of whether it's the customer's
first contract overall. Let me check the example again."* — Das
Modell hinterfragt die vom Beispiel implizierte Lesart und
konstruiert eine alternative Interpretation ("Erstversicherung" =
erster Vertrag des Kunden), die es dann als `isFirstQuote`-Parameter
implementiert. Die −thinking-Variante desselben Modells wendet den
Zuschlag stattdessen bedingungslos an — konform mit den Beispielen.

Der Effekt skaliert invers mit der Modellstärke: Sonnet stark
(−36 pp), Opus 4.6 mittel (−15 pp), Opus 4.7 vernachlässigbar
(−2 pp). Stärkere Modelle haben genug Reasoning-Kapazität, um die
Beispiel-Semantik auch mit Thinking korrekt zu übernehmen — Sonnet
hinterfragt sie häufiger und konstruiert Alternativ-Lesarten.

**Bezug zu H4**: Teilweise widerlegt. Thinking verbessert
`verification_pct` nicht — bei Sonnet × EM schadet es erheblich
(−36 pp), bei Opus 4.6 × EM spürbar (−15 pp), bei Opus 4.7 × EM
praktisch nicht (−2 pp).

---

## F-prompt-correctness.4 — User-Story ≈ Prose, keine messbare Wirkung auf Korrektheit

User-Story erreicht über alle Modelle und Thinking-Modi ähnliche
Korrektheit (außen) wie Prose. Maximale Differenz: 8 pp, ohne
konsistente Richtung.

| Modell | Modus | prose | user-story | Δ |
|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | 0.21 | −8 pp |
| opus-4-7 | −thinking | 0.21 | 0.13 | −8 pp |
| opus-4-6 | +thinking | 0.24 | 0.22 | −2 pp |
| opus-4-6 | −thinking | 0.23 | 0.18 | −5 pp |
| sonnet-4-6 | −thinking | 0.23 | 0.17 | −6 pp |
| haiku-4-5 | ±thinking | 0.00 | 0.00–0.01 | 0 pp |

**Datenbasis**: prose- und user-story-Zellen über alle Modelle ×
±thinking, je n=5 (opus-4-6/opus-4-7 user-story teils n=7–8).

**Rationale**: Die Stakeholder-Perspektive ("Als X möchte ich Y")
liefert keine zusätzliche Information über die Domänenregeln.
Mehrdeutigkeiten wie "Erstversicherung" bleiben in beiden Formaten
gleichermaßen unaufgelöst — nur konkrete Input/Output-Beispiele
(example-mapping) disambiguieren sie.

**Bezug zu H2**: Bestätigt. User-Story verbessert Korrektheit
gegenüber Prose nur geringfügig (≤6 pp).

---

## F-prompt-correctness.5 — Streuung bei Example-Mapping ist modellabhängig

Example-Mapping-Runs streuen stärker als prose/user-story, aber
die Streuung hängt stark vom Modell ab:

| Zelle | mean | σ | min | max |
|---|---|---|---|---|
| opus-4-7 +thinking × EM | 0.95 | 0.12 | 0.73 | 1.00 |
| opus-4-7 −thinking × EM | 0.97 | 0.09 | 0.73 | 1.00 |
| opus-4-6 +thinking × EM | 0.72 | 0.38 | 0.20 | 1.00 |
| opus-4-6 −thinking × EM | 0.87 | 0.30 | 0.33 | 1.00 |
| sonnet +thinking × EM | 0.35 | 0.41 | 0.00 | 1.00 |
| sonnet −thinking × EM | 0.71 | 0.18 | 0.40 | 0.87 |
| opus ±thinking × prose | 0.21–0.29 | 0.04–0.19 | 0.07 | 0.60 |

**Datenbasis**: alle EM-Zellen von Opus 4.7, Opus 4.6, Sonnet 4.6 ×
±thinking (n=5/Zelle, opus-4-6 +thinking n=4, opus-4-7 −thinking n=9).

**Rationale**: Die Streuung sinkt mit steigender Modellstärke. Sonnet
+thinking zeigt quasi-binäres Verhalten (0 % oder hoch, σ=0.41),
Opus 4.6 streut mittel (σ=0.30–0.38), Opus 4.7 trifft die richtige
Interpretation am konsistentesten (σ=0.09–0.12). Die hohe Streuung bei
Sonnet +thinking ist ein Thinking-Effekt (→ F-prompt-correctness.3),
kein generelles EM-Problem — Sonnet −thinking und Opus streuen
deutlich weniger.

---
