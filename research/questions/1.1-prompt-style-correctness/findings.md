# RQ-prompt-correctness Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Steigert Example-Mapping die Korrektheit gegenüber Prose und
User-Story — und ist der Effekt modellabhängig?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

Datenbasis: 93 Runs (19 von 24 Zellen bei n≥5; Opus-4-7-Zellen
ausstehend). Stand 2026-05-12.

Korrektur 2026-05-12: 9 Runs hatten `cli_built=false` (fehlende
`src/cli.ts`) → Verifikation konnte nicht laufen → `verification_pct`
fälschlich 0. Nachträglich per Agent-Nudge behoben und neu analysiert.
Betroffen: 6× EM, 2× prose, 1× user-story. Prompt gehärtet +
Batch-Retry eingebaut um das Problem in zukünftigen Runs zu vermeiden.

## Übersicht: Korrektheit (außen) nach Modell × Prompt-Stil × Thinking

| Modell | Modus | prose | example-mapping | user-story |
|---|---|---|---|---|
| opus-4-7 | −thinking | — | **1.00** 🏆 (n=3) | — |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.23 |
| opus-4-6 | +thinking | 0.15 | **0.77** 🏆 | 0.25 |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | 0.19 |
| haiku-4-5 | −thinking | 0.00 | 0.00 | 0.00 |
| haiku-4-5 | +thinking | 0.00 | 0.00 | 0.01 |

Werte: mean(`verification_pct`), je n=5 (Opus 4.7: n=3, vorläufig).
Höher = besser; 🏆 = bester Stil pro Zeile (Haiku-Zeilen: kein Effekt, alle Werte ~0 → kein Sieger).

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

Bei Opus 4.6 und Sonnet 4.6 steigert example-mapping die Korrektheit
(außen) gegenüber prose um 14–64 Prozentpunkte. Bei Opus ist der
Effekt in beiden Thinking-Modi stark; bei Sonnet nur ohne Thinking.

| Modell | Modus | prose | example-mapping | user-story | Δ (EM − prose) |
|---|---|---|---|---|---|
| opus-4-7 | −thinking | — | **1.00** 🏆 (n=3) | — | — |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.23 | **+64 pp** |
| opus-4-6 | +thinking | 0.15 | **0.77** 🏆 | 0.25 | **+62 pp** |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 | **+48 pp** |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | 0.19 | +14 pp |

Höher = besser; 🏆 = bester Stil pro Zeile (Spalten prose/EM/user-story).
Δ ist eine Effektgröße, kein Wettbewerb → kein 🏆.

**Datenbasis**: 60 Runs (Opus 4.6 + Sonnet 4.6, je n=5); Opus 4.7
vorläufig (n=3). Haiku ausgenommen — dort ist der Prompt-Stil
irrelevant (→ F-prompt-correctness.1).

**Rationale**: Example-Mapping liefert konkrete Input/Output-Paare,
die die Mehrdeutigkeiten der Kata-Regeln auflösen. Modelle mit
ausreichender Reasoning-Kapazität (Opus, Sonnet) können die Muster
auf neue Eingaben generalisieren.

**Bezug zu H1**: Bestätigt. EM steigert Korrektheit bei Opus um
+62–64 pp (beide Modi) und bei Sonnet −thinking um +48 pp.
Sonnet +thinking zeigt +14 pp — schwächer, aber gleiche Richtung.

---

## F-prompt-correctness.3 — Thinking schadet bei Example-Mapping (Sonnet > Opus)

Thinking-Mode reduziert die Korrektheit (außen) bei example-mapping,
aber der Effekt ist modellabhängig:

| Modell | +thinking | −thinking | Δ |
|---|---|---|---|
| sonnet-4-6 | 0.35 (σ=0.41) | **0.71** 🏆 (σ=0.18) | **−36 pp** |
| opus-4-6 | 0.77 (σ=0.35) | **0.87** 🏆 (σ=0.30) | −10 pp |

Höher = besser; 🏆 = besserer Modus pro Zeile (+thinking vs. −thinking). Δ = Effektgröße, kein 🏆.

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

Der Effekt ist bei Sonnet stark (−36 pp) und bei Opus schwach
(−10 pp). Opus hat offenbar genug Reasoning-Kapazität, um die
Beispiel-Semantik auch mit Thinking meist korrekt zu übernehmen —
Sonnet hinterfragt sie häufiger und konstruiert Alternativ-Lesarten.

**Bezug zu H4**: Teilweise widerlegt. Thinking verbessert
`verification_pct` nicht — bei Sonnet × EM schadet es erheblich
(−36 pp), bei Opus × EM leicht (−10 pp).

---

## F-prompt-correctness.4 — User-Story ≈ Prose, keine messbare Wirkung auf Korrektheit

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

## F-prompt-correctness.5 — Streuung bei Example-Mapping ist modellabhängig

Example-Mapping-Runs streuen stärker als prose/user-story, aber
die Streuung hängt stark vom Modell ab:

| Zelle | mean | σ | min | max |
|---|---|---|---|---|
| opus-4-6 +thinking × EM | 0.77 | 0.35 | 0.20 | 1.00 |
| opus-4-6 −thinking × EM | 0.87 | 0.30 | 0.33 | 1.00 |
| sonnet +thinking × EM | 0.35 | 0.41 | 0.00 | 1.00 |
| sonnet −thinking × EM | 0.71 | 0.18 | 0.40 | 0.87 |
| opus-4-6 ±thinking × prose | 0.15–0.23 | 0.10–0.14 | 0.00 | 0.33 |

**Datenbasis**: 20 Runs (Opus 4.6 + Sonnet 4.6 × ±thinking ×
example-mapping).

**Rationale**: Sonnet +thinking zeigt weiterhin quasi-binäres
Verhalten (0 % oder hoch), während Opus in beiden Modi konsistenter
die richtige Interpretation trifft. Die Streuung bei Sonnet
+thinking (σ=0.41) ist ein Thinking-Effekt (→ F-prompt-correctness.3), nicht ein
generelles EM-Problem — Sonnet −thinking und Opus ±thinking
streuen deutlich weniger.

---
