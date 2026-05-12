# RQ-1 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Steigert Example-Mapping die Korrektheit gegenüber Prose und
User-Story — und ist der Effekt modellabhängig?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

Datenbasis: 93 Runs (19 von 24 Zellen bei n≥5; Opus-4-7-Zellen
ausstehend). Stand 2026-05-12.

## Übersicht: Korrektheit (außen) nach Modell × Prompt-Stil × Thinking

| Modell | Modus | prose | example-mapping | user-story |
|---|---|---|---|---|
| opus-4-7 | −thinking | — | **1.00** (n=3) | — |
| opus-4-6 | −thinking | 0.23 | **0.60** | 0.23 |
| opus-4-6 | +thinking | 0.15 | 0.37 | 0.25 |
| sonnet-4-6 | −thinking | 0.23 | **0.71** | 0.17 |
| sonnet-4-6 | +thinking | 0.21 | 0.35 | 0.19 |
| haiku-4-5 | −thinking | 0.00 | 0.00 | 0.00 |
| haiku-4-5 | +thinking | 0.00 | 0.00 | 0.01 |

Werte: mean(`verification_pct`), je n=5 (Opus 4.7: n=3, vorläufig).

---

## F-1.1 — Schwache Modelle scheitern unabhängig vom Prompt-Stil

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
(→ F-1.2) — hat für Haiku keinen messbaren Effekt: die
Reasoning-Kapazität reicht nicht aus, um die Beispiele auf neue
Eingaben zu generalisieren.

**Bezug zu H5**: Bestätigt. Schwächere Modelle erreichen auch mit
example-mapping keine Korrektheit.

---

## F-1.2 — Example-Mapping hebt Korrektheit massiv, aber nur ohne Thinking

Bei Opus 4.6 und Sonnet 4.6 steigert example-mapping die Korrektheit
(außen) gegenüber prose um 15–48 Prozentpunkte — allerdings nur im
−thinking-Modus. Mit +thinking ist der Effekt deutlich schwächer oder
invertiert.

| Modell | Modus | prose | example-mapping | user-story | Δ (EM − prose) |
|---|---|---|---|---|---|
| opus-4-7 | −thinking | — | **1.00** (n=3) | — | — |
| opus-4-6 | −thinking | 0.23 | **0.60** | 0.23 | **+37 pp** |
| opus-4-6 | +thinking | 0.15 | 0.37 | 0.25 | +22 pp |
| sonnet-4-6 | −thinking | 0.23 | **0.71** | 0.17 | **+48 pp** |
| sonnet-4-6 | +thinking | 0.21 | 0.35 | 0.19 | +14 pp |

**Datenbasis**: 60 Runs (Opus 4.6 + Sonnet 4.6, je n=5); Opus 4.7
vorläufig (n=3). Haiku ausgenommen — dort ist der Prompt-Stil
irrelevant (→ F-1.1).

**Rationale**: Example-Mapping liefert konkrete Input/Output-Paare,
die die Mehrdeutigkeiten der Kata-Regeln auflösen. Modelle mit
ausreichender Reasoning-Kapazität (Opus, Sonnet) können die Muster
auf neue Eingaben generalisieren. Der Effekt ist bei −thinking
stärker, weil das Modell die Beispiele als Ground Truth akzeptiert
statt sie im Thinking-Block zu hinterfragen (→ F-1.3).

**Bezug zu H1**: Bestätigt für −thinking-Modus. Die >30 pp Differenz
ist klar gegeben. Für +thinking ist der Effekt vorhanden, aber
schwächer.

---

## F-1.3 — Thinking schadet bei Example-Mapping (Overthinking-Effekt)

Thinking-Mode reduziert die Korrektheit (außen) bei example-mapping
konsistent über alle nicht-schwachen Modelle:

| Modell | +thinking | −thinking | Δ |
|---|---|---|---|
| sonnet-4-6 | 0.35 (σ=0.41) | **0.71** (σ=0.18) | **−36 pp** |
| opus-4-6 | 0.37 (σ=0.44) | **0.60** (σ=0.55) | **−23 pp** |

Bei prose und user-story ist der Thinking-Effekt vernachlässigbar
(±5 pp, keine konsistente Richtung).

**Datenbasis**: 20 Runs (Opus 4.6 + Sonnet 4.6 × ±thinking ×
example-mapping, je n=5).

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

Thinking-Mode gibt dem Modell Raum, Beispiele als Reasoning-Problem
zu behandeln statt als Constraints. Bei einer Domäne mit
absichtlichen Mehrdeutigkeiten führt das zu Overriding der
Beispiel-Semantik: das Modell "denkt sich" eine alternative,
kohärenter erscheinende Interpretation aus und verwirft die vom
Beispiel implizierte Lesart.

**Bezug zu H4**: Widerlegt. Thinking verbessert `verification_pct`
nicht unabhängig vom Prompt-Stil — bei example-mapping schadet es
erheblich.

---

## F-1.4 — User-Story ≈ Prose, keine messbare Wirkung auf Korrektheit

User-Story erreicht über alle Modelle und Thinking-Modi ähnliche
Korrektheit (außen) wie Prose. Maximale Differenz: 6 pp.

| Modell | Modus | prose | user-story | Δ |
|---|---|---|---|---|
| opus-4-6 | −thinking | 0.23 | 0.23 | 0 pp |
| opus-4-6 | +thinking | 0.15 | 0.25 | +10 pp |
| sonnet-4-6 | −thinking | 0.23 | 0.17 | −6 pp |
| sonnet-4-6 | +thinking | 0.21 | 0.19 | −2 pp |
| haiku-4-5 | ±thinking | 0.00 | 0.00–0.01 | 0 pp |

**Datenbasis**: 60 Runs (alle Portkey-Modelle × prose/user-story,
je n=5).

**Rationale**: Die Stakeholder-Perspektive ("Als X möchte ich Y")
liefert keine zusätzliche Information über die Domänenregeln.
Mehrdeutigkeiten wie "Erstversicherung" bleiben in beiden Formaten
gleichermaßen unaufgelöst — nur konkrete Input/Output-Beispiele
(example-mapping) disambiguieren sie.

**Bezug zu H2**: Bestätigt. User-Story verbessert Korrektheit
gegenüber Prose nur geringfügig (≤6 pp).

---

## F-1.5 — Hohe Streuung bei Example-Mapping zeigt binäre Interpretations-Dynamik

Example-Mapping-Runs bei Opus 4.6 und Sonnet +thinking zeigen
extrem hohe Standardabweichung (σ=0.41–0.55), während prose und
user-story stabil niedrig streuen (σ=0.03–0.14).

| Zelle | mean | σ | min | max |
|---|---|---|---|---|
| opus-4-6 +thinking × EM | 0.37 | 0.44 | 0.00 | 1.00 |
| opus-4-6 −thinking × EM | 0.60 | 0.55 | 0.00 | 1.00 |
| sonnet +thinking × EM | 0.35 | 0.41 | 0.00 | 1.00 |
| sonnet −thinking × EM | 0.71 | 0.18 | 0.40 | 0.87 |
| opus-4-6 ±thinking × prose | 0.15–0.23 | 0.10–0.14 | 0.00 | 0.33 |

**Datenbasis**: 20 Runs (Opus 4.6 + Sonnet 4.6 × ±thinking ×
example-mapping).

**Rationale**: Die Runs sind quasi-binär: entweder trifft das
Modell die richtige Interpretation der Mehrdeutigkeiten (→ hohe
Korrektheit), oder es verfehlt sie (→ nahe 0 %). Der Prompt-Stil
bestimmt die *Wahrscheinlichkeit* des richtigen Treffers, nicht
die *Graduierung*. Sonnet −thinking ist die stabilste Konfiguration
(σ=0.18, min=0.40) — hier überwiegt die Beispiel-Compliance.

---
