# RQ-3 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6,
Opus 4.7 — jeweils mit/ohne Thinking) in der Code-Qualität auf einer
trainingsbekannten Kata bei stärkstem Workflow?**

Datenbasis: 24 Runs (6 Zellen × n=3–6), Stand 2026-05-14. Workflow
v4-exact-subagents, Kata game-of-life-example-mapping. Korrektheits-Innensicht
via vom Agenten geschriebene Vitest-Tests.

---

## Übersicht: Code-Qualität nach Modell (Mittelwerte)

| Modell | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | n |
|---|---:|---:|---:|---:|---:|
| opus-4-7 | 162.75 | **2.00** | **4.25** | **4.75** | 4 |
| opus-4-7-no-thinking | 155.00 | 2.50 | 5.25 | 5.25 | 4 |
| opus-4-6-portkey | **153.83** | 3.83 | 8.50 | 13.17 | 6 |
| opus-4-6-portkey-no-thinking | 155.75 | 3.00 | 5.75 | 7.75 | 4 |
| sonnet-4-6 | 183.00 | 4.00 | 7.33 | 8.00 | 3 |
| sonnet-4-6-no-thinking | 188.67 | 5.67 | 9.00 | 15.00 | 3 |

Bester Wert pro Spalte fett. Kleiner = besser.

---

## F-3.1 — Korrektheit auf v4 ist modellunabhängig perfekt ✅ stabil

**Aussage**: Alle sechs Modelle erreichen `tests_passing = 100 %` auf
game-of-life-example-mapping (24/24 Runs). H1 erfüllt — der
Code-Qualitäts-Vergleich operiert vollständig auf korrektem Code.

**Datenbasis**: 4 + 4 + 6 + 4 + 3 + 3 = 24 Runs, `tests_passing` rate_% in
allen Zellen 100. `completed_within_budget` ebenfalls 100 % über alle Zellen
— kein Run lief in den 90-Min-Timeout oder erschöpfte Retry-Budgets.

**Konsequenz**: Korrektheit ist auf diesem Setup *kein* differenzierendes
Merkmal — Modell-Ranking-Aussagen müssen auf Code-Qualitäts-Metriken basieren.

---

## F-3.2 — Opus < Sonnet bei Code-Qualität, Opus-4.7 marginal vor Opus-4.6 ✅ stabil

**Aussage**: Im no-thinking-Vergleich (apples-to-apples) liefert Opus
konsistent kompakteren, weniger smelly und weniger komplexen Code als Sonnet;
Opus-4.7 liegt knapp vor Opus-4.6:

| Metrik (no-thinking) | opus-4-7 | opus-4-6-portkey | sonnet-4-6 |
|---|---:|---:|---:|
| `code_mass` | 155.00 | 155.75 | 188.67 |
| `smell_total` | 2.50 | 3.00 | 5.67 |
| `mccabe_max` | 5.25 | 5.75 | 9.00 |
| `cognitive_max` | 5.25 | 7.75 | 15.00 |

Ranking opus-4-7 < opus-4-6 < sonnet-4-6 ist über alle vier
Code-Qualitäts-Metriken vorzeichen-konsistent. Der Sonnet-Abstand zu beiden
Opus-Varianten ist substanziell (`cognitive_max` fast 3×); der Abstand zwischen
Opus-4.7 und Opus-4.6 ist klein und innerhalb von σ, aber das Vorzeichen
stabil. H2 bestätigt.

**Datenbasis**: opus-4-7-no-thinking n=4, opus-4-6-portkey-no-thinking n=4,
sonnet-4-6-no-thinking n=3.

---

## F-3.3 — Thinking wirkt nicht uniform positiv; Opus-4.6 + Thinking degradiert Code-Qualität ⚠️ bedingt

**Aussage**: Die Hypothese "Thinking verbessert Code-Qualität" hält *nicht*
universell. Within-model-Deltas (thinking vs. no-thinking, ∆ negativ = besser
mit Thinking):

| Modell | ∆ `code_mass` | ∆ `smell_total` | ∆ `mccabe_max` | ∆ `cognitive_max` | ∆ `cc_longest_function` |
|---|---:|---:|---:|---:|---:|
| opus-4-7 | +7.75 | −0.50 | −1.00 | −0.50 | +2.00 |
| opus-4-6-portkey | −1.92 | **+0.83** | **+2.75** | **+5.42** | **+7.50** |
| sonnet-4-6 | −5.67 | −1.67 | −1.67 | −7.00 | +3.33 |

- **Sonnet 4.6**: Thinking verbessert deutlich (`cognitive_max` 15.0 → 8.0).
- **Opus 4.7**: Thinking-Effekt klein und gemischt — `cognitive_max` sinkt
  leicht, `code_mass` und `cc_longest_function` steigen leicht.
- **Opus 4.6**: Thinking **verschlechtert** über vier Qualitäts-Metriken
  (`cognitive_max` 7.75 → 13.17, `mccabe_max` 5.75 → 8.50,
  `cc_longest_function` 9.00 → 16.50, `smell_total` 3.00 → 3.83).

Damit ist die H3-Variante "Thinking-Effekt bei Opus stärker als bei Sonnet"
falsifiziert: bei Opus-4.6 ist der Effekt sogar negativ, bei Sonnet am
deutlichsten positiv.

**Bedingung**: n_opus-4-6-portkey = 6, n_opus-4-6-portkey-no-thinking = 4 mit
substanzieller σ in beiden Zellen. Vorzeichen über vier unabhängige Metriken
konsistent → der Befund ist belastbarer als jeder Einzelwert, bleibt aber bei
diesem n als ⚠️ bedingt klassifiziert. Replikation mit höherem n und ggf.
zweiter Kata (mars-rover) wäre wünschenswert.

---

## F-3.4 — Sonnet ist token-billiger, aber nicht wall-clock-schneller, und liefert die schlechteste Code-Qualität ✅ stabil

**Aussage**: Token- und Zeit-Vergleich:

| Modell | `total_tokens` (Mittel) | `duration_seconds` (Mittel) |
|---|---:|---:|
| sonnet-4-6 | 2 094 870 | 1 418.7 |
| sonnet-4-6-no-thinking | 1 991 200 | 1 395.0 |
| opus-4-7 | 3 681 570 | 1 322.3 |
| opus-4-7-no-thinking | 3 059 620 | 1 087.0 |
| opus-4-6-portkey | 4 379 140 | 1 008.5 |
| opus-4-6-portkey-no-thinking | 4 275 800 | 866.3 |

Sonnet verbraucht 43–48 % der Tokens eines Opus-Runs, läuft aber **länger** in
Wallclock-Zeit (≈1400 s vs. 870–1320 s bei Opus). Kombiniert mit F-3.2 (Sonnet
schlechteste Code-Qualität) gilt: Sonnet ist Token-billiger, aber weder
schneller noch in der Qualität konkurrenzfähig auf diesem v4-Game-of-Life-Setup.

**Hinweis zur Streuung**: σ_duration ist bei sonnet-4-6 mit 537 s sehr hoch
(min 924, max 1990) — bei n=3 ein einzelner Ausreißer dominiert. Der
Token-Befund ist trotzdem klar, da der Faktor ~2× zwischen Sonnet und Opus
deutlich über der Streuung liegt.

---

## Caveats (aus README übernommen)

- **Single workflow**: Nur v4-exact-subagents. Andere Workflows könnten andere
  Modell-Rankings produzieren.
- **Single kata**: Nur Game of Life (Library-Form, example-mapping).
  Mars-rover als zweiter Code-Qualitäts-Carrier offen.
- **Opus 4.6 via Portkey**: Findings über `opus-4-6-portkey*` nicht
  automatisch auf Direct-API-Opus-4.6 übertragbar.
- **Korrektheits-Innensicht**: `tests_passing` misst vom Agenten geschriebene
  Tests, nicht externe Verifikation.
- **n_sonnet = 3**: Sonnet-Zellen am unteren Rand von `min_replicates`. σ in
  einzelnen Outcomes hoch (z. B. `code_mass` σ=117 bei sonnet-4-6-no-thinking
  wegen Ausreißer 324). Größeres n würde F-3.2 und F-3.4 stabiler stützen.
