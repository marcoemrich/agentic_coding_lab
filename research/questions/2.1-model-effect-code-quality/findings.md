# RQ-model-quality Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6,
Opus 4.7 — jeweils mit/ohne Thinking) in der Code-Qualität auf einer
trainingsbekannten Kata bei stärkstem Workflow?**

Datenbasis: 21 Runs (6 Zellen × n=3, plus 3 zusätzliche
opus-4-7-no-thinking-Replikate aus dem RQ-tdd-quality-Batch), Stand 2026-05-15.
Workflow v4-exact-subagents, Kata game-of-life-example-mapping mit
explizitem API-Vertrag (`nextGeneration(cells: Cell[]): Cell[]`).
Korrektheits-Innensicht via vom Agenten geschriebene Vitest-Tests,
Außensicht via Modul-Import-Adapter `game-of-life-verification/`
(15 Szenarien).

---

## Übersicht: Code-Qualität nach Modell (Mittelwerte)

| Modell | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| opus-4-7 | 159.00 | 2.33 | **3.33** | 3.00 | **7.00** | 1.00 | 3 |
| opus-4-7-no-thinking | 167.67 | **2.50** | 4.00 | **2.83** | 9.33 | 1.00 | 6 |
| opus-4-6-portkey | 173.00 | 4.33 | 6.67 | 12.00 | 19.33 | 1.00 | 3 |
| opus-4-6-portkey-no-thinking | 175.67 | 4.33 | 7.67 | 13.00 | 18.67 | 1.00 | 3 |
| sonnet-4-6 | 178.00 | 5.67 | 6.33 | 11.00 | 21.67 | 1.00 | 3 |
| sonnet-4-6-no-thinking | **166.67** | 3.33 | 6.00 | 5.00 | 15.00 | 0.73 | 3 |

Bester Wert pro Spalte fett. Kleiner = besser (außer `verification_pct`: größer = besser).

---

## F-model-quality.1 — Korrektheit (innen + außen) auf v4 ist nahezu modellunabhängig perfekt ✅ stabil

**Aussage**: `tests_passing` liegt für alle sechs Modelle bei 100 % (21/21
Runs). `verification_pct` liegt in fünf von sechs Zellen ebenfalls bei
1.00 — der explizite API-Vertrag (`Cell = [number, number]`,
`nextGeneration(cells: Cell[]): Cell[]`) eliminiert die zuvor beobachteten
Repräsentations-Mismatches fast vollständig.

Einzige Ausnahme: **sonnet-4-6-no-thinking** mit `verification_pct = 0.73`
— 2/3 Runs perfekt (15/15), ein Run mit 3/15 (siehe F-model-quality.5).

**Datenbasis**: 21 Runs, 15 Verifikations-Szenarien pro Run.

**Konsequenz**: Auf v4 + game-of-life + Direct-API/Portkey-Opus + Sonnet ist
Korrektheit kein differenzierendes Merkmal mehr. Code-Qualitäts-Ranking-Aussagen
sind auf korrektem Code basiert.

---

## F-model-quality.2 — Modell-Ranking: Opus-4.7 deutlich vor Sonnet-4.6 und Opus-4.6; Sonnet jetzt vor Opus-4.6 ✅ stabil

**Aussage**: Im no-thinking-Vergleich (apples-to-apples) liefert
**Opus 4.7** den deutlich besten Code; **Sonnet 4.6** liegt davor, was Opus 4.6
betrifft, und Opus 4.6 ist das schwächste der drei Modelle auf v4:

| Metrik (no-thinking) | opus-4-7 | sonnet-4-6 | opus-4-6-portkey |
|---|---:|---:|---:|
| `cognitive_max` | **2.83** | 5.00 | 13.00 |
| `mccabe_max` | **4.00** | 6.00 | 7.67 |
| `cc_longest_function` | **9.33** | 15.00 | 18.67 |
| `smell_total` | **2.50** | 3.33 | 4.33 |
| `code_mass` | 167.67 | **166.67** | 175.67 |

Ranking opus-4-7 < sonnet-4-6 < opus-4-6 ist über vier der fünf
Code-Qualitäts-Metriken vorzeichen-konsistent (bei `code_mass` liegen
opus-4-7 und sonnet-4-6 effektiv gleichauf, ~1 % auseinander). Die
Spannweite zwischen Bester (opus-4-7) und Schlechtester (opus-4-6) ist auf
`cognitive_max` mit Faktor 4.6× substanziell.

**Datenbasis**: opus-4-7-no-thinking n=6 (RQ-model-quality + RQ-tdd-quality-Pool), sonnet-4-6-no-thinking n=3,
opus-4-6-portkey-no-thinking n=3.

**Bemerkung zur Reihenfolge**: Sonnet vor Opus 4.6 ist eine Umkehr gegenüber
naiver Modell-Tier-Intuition ("Opus > Sonnet"). Eine plausible Erklärung:
Sonnet (no-thinking) erzeugt schlicht *kürzeren, weniger generalisierten*
Code, während Opus 4.6 dazu neigt, eine vollständigere Abstraktion zu
bauen (vgl. F-model-quality.3 — Opus 4.6 + Thinking degradiert sogar).

---

## F-model-quality.3 — Thinking wirkt nicht uniform; Opus-4.6 + Thinking ohne Vorteil, Sonnet + Thinking sogar negativ auf cognitive_max ⚠️ bedingt

**Aussage**: Within-model-Deltas (thinking vs. no-thinking, ∆ negativ = besser
mit Thinking):

| Modell | ∆ `code_mass` | ∆ `smell_total` | ∆ `mccabe_max` | ∆ `cognitive_max` | ∆ `cc_longest_function` |
|---|---:|---:|---:|---:|---:|
| opus-4-7 | −8.67 | −0.17 | −0.67 | +0.17 | −2.33 |
| opus-4-6-portkey | −2.67 | 0.00 | −1.00 | −1.00 | +0.66 |
| sonnet-4-6 | +11.33 | +2.34 | +0.33 | **+6.00** | +6.67 |

- **Opus 4.7**: Thinking-Effekt klein, im wesentlichen neutral mit leichter
  Tendenz zu kompakterem Code und kürzeren Funktionen. Die Cognitive-Komplexität
  steigt minimal (+0.17).
- **Opus 4.6**: Thinking-Effekt klein und uneinheitlich — leicht besser auf
  Komplexität, leicht schlechter auf längster Funktion. Effektiv neutral.
- **Sonnet 4.6**: Thinking **verschlechtert** über alle fünf Outcomes,
  besonders `cognitive_max` (5.00 → 11.00, mehr als Verdopplung).

H3 (Thinking-Effekt bei Opus stärker als Sonnet, beide positiv) ist
falsifiziert: bei Sonnet ist der Effekt deutlich negativ. Eine plausible
Mechanik: Sonnet nutzt Thinking, um eine elegantere/vollständigere Abstraktion
zu konstruieren, die aber mehr Verzweigungen und Helfer-Logik einführt
(höhere Cognitive-Komplexität).

**Bedingung**: n_sonnet = 3 in beiden Zellen, σ_cognitive bei sonnet-4-6 mit
7.81 sehr hoch (range 2–16). Der Mittelwertsprung ist stabil über vier von
fünf Metriken vorzeichen-konsistent, aber bei n=3 ist Replikation
wünschenswert → ⚠️ bedingt.

---

## F-model-quality.4 — Token-Kosten und Wallclock nivellieren sich auf v4 weitgehend ✅ stabil

**Aussage**: Token-Verbrauch (Mittel) und Wallclock-Zeit nach Modell:

| Modell | `total_tokens` (Mittel) | `duration_seconds` (Mittel) |
|---|---:|---:|
| sonnet-4-6-no-thinking | 2.21 M | 1116.7 |
| sonnet-4-6 | 2.41 M | 846.3 |
| opus-4-7 | 2.49 M | 827.7 |
| opus-4-7-no-thinking | 2.58 M | 865.2 |
| opus-4-6-portkey | 2.93 M | 956.3 |
| opus-4-6-portkey-no-thinking | 3.87 M | 1160.7 |

Spread zwischen günstigstem (sonnet-no-thinking ~2.2 M) und teuerstem
(opus-4-6-no-thinking ~3.9 M) ist Faktor ~1.75× — deutlich kleiner als das
in früheren Runs beobachtete ~2× (vermutlich weil der API-Vertrag den
Lösungsraum einengt, sodass alle Modelle ähnlich strukturierte Implementationen
liefern).

Wallclock liegt einheitlich bei ~14–20 min/Run. Sonnet ist nicht mehr
zeitlich auffällig billig oder teuer.

**Konsequenz**: Auf v4 ist Modell-Wahl primär eine Code-Qualitätsentscheidung
(F-model-quality.2), nicht eine Token-Effizienz-Entscheidung. Opus 4.7 liefert die beste
Qualität bei mittlerem Token-Budget; Sonnet liegt qualitativ dahinter, ist
aber nicht signifikant günstiger.

---

## F-model-quality.5 — Vertrags-Konformität unter explizitem API-Vertrag fast vollständig erreicht; ein Sonnet-Ausreißer redefiniert `Cell` als Objekt ⚠️ bedingt

**Aussage**: Mit explizitem API-Vertrag in der Kata-Prompt
(`type Cell = [number, number]; export function nextGeneration(cells: Cell[]): Cell[]`)
verschwinden 5 von 6 zuvor beobachteten Repräsentations-Mismatches. Verbleibend:

| Run | Modell | Gewählte Signatur | `verification_pct` |
|---|---|---|---:|
| `2026-05-14_21-09-13_…_sonnet-4-6-no-thinking` | sonnet-4-6-no-thinking | `Cell = { x: number; y: number }` (Objekt) | 0.20 |

Alle anderen 20 Runs halten sich an die `[number, number]`-Tupel-Form und
erreichen 15/15. Die Sonnet-Abweichung zeigt: der explizite Prompt-Vertrag
reduziert Repräsentations-Drift drastisch (Sonnet zuvor 6/6 Runs `boolean[][]`
→ jetzt 5/6 Runs Tupel), eliminiert ihn aber nicht in allen Fällen.

**Datenbasis**: 21 Runs, manuelle Inspektion der `nextGeneration`-Signaturen
in `src/game-of-life.ts`.

**Mechanik-Vermutung**: Sonnet (no-thinking) interpretiert `type Cell = [number, number]`
gelegentlich als "irgendein Cell-Typ" und ersetzt ihn durch eine vermeintlich
ausdrucksstärkere Objektform. Bei n=3 ist ein Ausreißer 33 % der Zelle —
größeres n nötig zur stabilen Frequenz-Schätzung.

**Bedingung**: ⚠️ bedingt wegen n=3.

---

## Caveats

- **Single workflow**: Nur v4-exact-subagents. Andere Workflows könnten
  andere Modell-Rankings produzieren (vgl. RQ-tdd-quality F-tdd-quality.1).
- **Single kata**: Nur Game of Life (Library-Form, example-mapping).
  Mars-rover als zweiter Code-Qualitäts-Carrier offen.
- **Opus 4.6 via Portkey**: Findings über `opus-4-6-portkey*` nicht
  automatisch auf Direct-API-Opus-4.6 übertragbar.
- **n = 3 pro Zelle** (außer opus-4-7-no-thinking mit n=6 dank
  RQ-tdd-quality-Pooling): σ in einzelnen Outcomes hoch — F-model-quality.3 und F-model-quality.5 daher
  ⚠️ bedingt.
- **API-Vertrag eingeführt**: Alle Runs in dieser Datenbasis nutzen den
  expliziten API-Vertrag in der Prompt (commit `0902a4f`). Frühere Findings
  über Repräsentations-Wahl ohne expliziten Vertrag sind nicht direkt
  vergleichbar.
