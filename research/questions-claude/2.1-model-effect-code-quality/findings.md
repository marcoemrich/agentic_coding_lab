# RQ-model-quality Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6,
Opus 4.7, Opus 4.8 — jeweils mit/ohne Thinking) in der Code-Qualität auf einer
trainingsbekannten Kata bei stärkstem Workflow?**

Datenbasis: 31 Runs (8 Zellen × n=3, plus zusätzliche
opus-4-7-no-thinking-Replikate aus dem RQ-tdd-quality-Pool → dort n=10),
Stand 2026-05-29. Workflow v4-exact-subagents, Kata
game-of-life-example-mapping mit explizitem API-Vertrag
(`nextGeneration(cells: Cell[]): Cell[]`). Korrektheits-Innensicht via vom
Agenten geschriebene Vitest-Tests, Außensicht via Modul-Import-Adapter
`game-of-life-verification/` (15 Szenarien).

---

## Übersicht: Code-Qualität nach Modell (Mittelwerte)

| Modell | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| opus-4-8 | **145.33** 🏆 | 2.67 | 4.33 | 5.33 | **4.33** 🏆 | **1.00** 🏆 | 3 |
| opus-4-8-no-thinking | 186.33 | 3.00 | 4.00 | 4.00 | 11.67 | **1.00** 🏆 | 3 |
| opus-4-7 | 159.00 | **2.33** 🏆 | **3.33** 🏆 | **3.00** 🏆 | 7.00 | **1.00** 🏆 | 3 |
| opus-4-7-no-thinking | 166.60 | 2.60 | 4.50 | 4.40 | 8.10 | **1.00** 🏆 | 10 |
| opus-4-6-portkey | 173.00 | 4.33 | 6.67 | 12.00 | 19.33 | **1.00** 🏆 | 3 |
| opus-4-6-portkey-no-thinking | 175.67 | 4.33 | 7.67 | 13.00 | 18.67 | **1.00** 🏆 | 3 |
| sonnet-4-6 | 178.00 | 5.67 | 6.33 | 11.00 | 21.67 | **1.00** 🏆 | 3 |
| sonnet-4-6-no-thinking | 166.67 | 3.33 | 6.00 | 5.00 | 15.00 | 0.73 | 3 |

Bester Wert pro Spalte fett + 🏆. Kleiner = besser (außer `verification_pct`: größer = besser).
Quality-Trophies sind korrektheits-gegated: nur Zellen mit `verification_pct = 1.0`
sind trophy-fähig (sonnet-4-6-no-thinking mit 0.73 ausgenommen).
`verification_pct`: sieben Zellen gleichauf bei 1.00 → Ties, alle 🏆.

Opus 4.8 (mit Thinking) liefert den **kompaktesten Code überhaupt** (`code_mass`
145.3, `cc_longest_function` 4.3 — beides neue Bestwerte über alle Modelle),
bleibt aber bei `smell_total`/`mccabe_max`/`cognitive_max` knapp hinter Opus 4.7.

---

## F-model-quality.1 — Korrektheit (innen + außen) auf v4 ist nahezu modellunabhängig perfekt

**Aussage**: `tests_passing` liegt für alle acht Modelle bei 100 % (31/31
Runs). `verification_pct` liegt in sieben von acht Zellen ebenfalls bei
1.00 — der explizite API-Vertrag (`Cell = [number, number]`,
`nextGeneration(cells: Cell[]): Cell[]`) eliminiert die zuvor beobachteten
Repräsentations-Mismatches fast vollständig. Beide Opus-4.8-Zellen liefern
15/15 in allen drei Replikaten.

Einzige Ausnahme: **sonnet-4-6-no-thinking** mit `verification_pct = 0.73`
— 2/3 Runs perfekt (15/15), ein Run mit 3/15 (siehe F-model-quality.5).

**Datenbasis**: 31 Runs, 15 Verifikations-Szenarien pro Run.

**Konsequenz**: Auf v4 + game-of-life + Direct-API/Portkey-Opus + Sonnet ist
Korrektheit kein differenzierendes Merkmal mehr. Code-Qualitäts-Ranking-Aussagen
sind auf korrektem Code basiert.

---

## F-model-quality.2 — Modell-Ranking: Opus-4.8 und Opus-4.7 an der Spitze, deutlich vor Opus-4.6; Sonnet im Mittelfeld

**Aussage**: Die beiden jüngsten Opus-Generationen (4.8, 4.7, jeweils mit
Thinking) liefern den klar besten Code; Opus 4.6 ist das schwächste der
Opus-Modelle auf v4. Opus 4.8 gewinnt auf `code_mass` und
`cc_longest_function` (neue Bestwerte überhaupt), Opus 4.7 führt auf den
reinen Komplexitäts-Scores:

| Metrik (mit Thinking) | opus-4-8 | opus-4-7 | opus-4-6-portkey | sonnet-4-6 |
|---|---:|---:|---:|---:|
| `code_mass` | **145.33** 🏆 | 159.00 | 173.00 | 178.00 |
| `cc_longest_function` | **4.33** 🏆 | 7.00 | 19.33 | 21.67 |
| `smell_total` | 2.67 | **2.33** 🏆 | 4.33 | 5.67 |
| `mccabe_max` | 4.33 | **3.33** 🏆 | 6.67 | 6.33 |
| `cognitive_max` | 5.33 | **3.00** 🏆 | 12.00 | 11.00 |

Kleiner = besser; 🏆 = bestes Modell pro Metrik (Zeile), korrektheits-gegated
(alle vier Zellen hier bei `verification_pct = 1.0`).

Opus 4.8 und Opus 4.7 liegen eng beieinander und beide deutlich vor Opus 4.6
und Sonnet: die Spannweite zwischen Spitze (Opus 4.8/4.7) und Opus 4.6 ist auf
`cc_longest_function` mit Faktor ~3–4.5× substanziell, auf `cognitive_max`
mit Faktor ~4× ebenfalls. Opus 4.8 produziert den kompaktesten Code und die
kürzeste längste Funktion, zahlt dafür aber etwas höhere
`cognitive_max`/`mccabe_max` als Opus 4.7 — die Abstraktion ist dichter
gepackt, nicht über mehr/längere Funktionen verteilt.

**Datenbasis**: opus-4-8 n=3, opus-4-7 n=3, opus-4-6-portkey n=3,
sonnet-4-6 n=3 (jeweils mit Thinking).

**Bemerkung zur Reihenfolge**: Sonnet vor Opus 4.6 (im no-thinking-Vergleich,
siehe Übersicht) ist eine Umkehr gegenüber naiver Modell-Tier-Intuition
("Opus > Sonnet"). Plausible Erklärung: Sonnet (no-thinking) erzeugt schlicht
*kürzeren, weniger generalisierten* Code, während Opus 4.6 dazu neigt, eine
vollständigere Abstraktion zu bauen (vgl. F-model-quality.3 — Opus 4.6 +
Thinking degradiert sogar).

---

## F-model-quality.3 — Thinking wirkt nicht uniform; bei Opus 4.8 stark auf Code-Größe, bei Opus 4.6 neutral, bei Sonnet negativ auf cognitive_max

**Aussage**: Within-model-Deltas (thinking vs. no-thinking, ∆ negativ = besser
mit Thinking):

| Modell | ∆ `code_mass` | ∆ `smell_total` | ∆ `mccabe_max` | ∆ `cognitive_max` | ∆ `cc_longest_function` |
|---|---:|---:|---:|---:|---:|
| opus-4-8 | **−41.00** | −0.33 | +0.33 | +1.33 | −7.34 |
| opus-4-7 | −8.67 | −0.17 | −0.67 | +0.17 | −2.33 |
| opus-4-6-portkey | −2.67 | 0.00 | −1.00 | −1.00 | +0.66 |
| sonnet-4-6 | +11.33 | +2.34 | +0.33 | **+6.00** | +6.67 |

∆-Tabelle (Thinking-Effekt, ∆ negativ = besser mit Thinking) — kein Modell-Wettbewerb, daher kein 🏆.
Das Fett markiert die stärksten Effekte: **−41.00** (stärkste Verbesserung, Opus 4.8 auf `code_mass`)
und **+6.00** (stärkste Verschlechterung, Sonnet auf `cognitive_max`).

- **Opus 4.8**: Thinking wirkt **stark auf die Code-Größe** — `code_mass`
  fällt um 41 (186 → 145) und die längste Funktion mehr als halbiert sich
  (11.7 → 4.3). Auf den reinen Komplexitäts-Scores ist der Effekt dagegen
  leicht negativ (`cognitive_max` +1.33, `mccabe_max` +0.33): mit Thinking
  packt Opus 4.8 die Logik kompakter in weniger/kürzere Funktionen, was die
  Dichte pro Funktion minimal erhöht.
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

**Bedingung**: n = 3 in den Opus-4.8-, Opus-4.6- und Sonnet-Zellen,
σ_cognitive bei sonnet-4-6 mit 7.81 sehr hoch (range 2–16). Die Mittelwert-
sprünge sind über mehrere Metriken vorzeichen-konsistent, aber bei n=3 ist
Replikation wünschenswert.

---

## F-model-quality.4 — Token-Kosten: Opus 4.8 ist der teuerste, Sonnet/Opus 4.7 die günstigsten; Wallclock einheitlich

**Aussage**: Token-Verbrauch (Mittel) und Wallclock-Zeit nach Modell:

| Modell | `total_tokens` (Mittel) | `duration_seconds` (Mittel) |
|---|---:|---:|
| sonnet-4-6-no-thinking | 2.21 M | 1116.7 |
| sonnet-4-6 | **2.41 M** 🏆 | 846.3 |
| opus-4-7 | 2.49 M | **827.7** 🏆 |
| opus-4-7-no-thinking | 2.56 M | 1162.9 |
| opus-4-6-portkey | 2.93 M | 956.3 |
| opus-4-8-no-thinking | 3.27 M | 1051.7 |
| opus-4-8 | 3.80 M | 1017.0 |
| opus-4-6-portkey-no-thinking | 3.87 M | 1160.7 |

Kleiner = besser; 🏆 = bestes Modell pro Spalte, korrektheits-gegated
(sonnet-4-6-no-thinking mit `verification_pct = 0.73` ist trotz niedrigstem
Token-Wert nicht trophy-fähig — der niedrige Verbrauch spiegelt teils einen
fehlerhaften Lauf, nicht echte Sparsamkeit).

Spread zwischen günstigstem korrekten Modell (sonnet-4-6 ~2.4 M) und teuerstem
(opus-4-6-no-thinking ~3.9 M, opus-4-8 ~3.8 M) ist Faktor ~1.6×. **Opus 4.8 ist
das token-hungrigste der jungen Modelle** — der kompaktere Output
(F-model-quality.2) wird mit substanziell mehr Inferenz-Budget erkauft (~1.5×
gegenüber Opus 4.7).

Wallclock liegt überwiegend bei ~14–20 min/Run; einzelne opus-4-7-no-thinking-
Replikate streuen stark nach oben (Pool n=10, max 3923 s).

**Konsequenz**: Auf v4 ist Modell-Wahl ein Trade-off zwischen Code-Kompaktheit
(Opus 4.8 vorn, F-model-quality.2) und Token-Budget (Opus 4.7/Sonnet vorn).
Opus 4.7 bleibt der beste Kompromiss aus Qualität und Kosten; Opus 4.8 lohnt,
wenn maximale Kompaktheit das Ziel ist und das höhere Token-Budget akzeptabel.

---

## F-model-quality.5 — Vertrags-Konformität unter explizitem API-Vertrag fast vollständig erreicht; ein Sonnet-Ausreißer redefiniert `Cell` als Objekt

**Aussage**: Mit explizitem API-Vertrag in der Kata-Prompt
(`type Cell = [number, number]; export function nextGeneration(cells: Cell[]): Cell[]`)
verschwinden die zuvor beobachteten Repräsentations-Mismatches fast
vollständig. Verbleibend ist ein einziger Ausreißer:

| Run | Modell | Gewählte Signatur | `verification_pct` |
|---|---|---|---:|
| `2026-05-14_21-09-13_…_sonnet-4-6-no-thinking` | sonnet-4-6-no-thinking | `Cell = { x: number; y: number }` (Objekt) | 0.20 |

Alle anderen 30 Runs halten sich an die `[number, number]`-Tupel-Form (bzw.
deren Superset `number[]`) und erreichen 15/15 — darunter alle sechs
Opus-4.8-Runs. Die Sonnet-Abweichung zeigt: der explizite Prompt-Vertrag
reduziert Repräsentations-Drift drastisch (Sonnet zuvor 6/6 Runs `boolean[][]`
→ jetzt 5/6 Runs Tupel), eliminiert ihn aber nicht in allen Fällen.

**Datenbasis**: 31 Runs, manuelle Inspektion der `nextGeneration`-Signaturen
in `src/game-of-life.ts`.

**Mechanik-Vermutung**: Sonnet (no-thinking) interpretiert `type Cell = [number, number]`
gelegentlich als "irgendein Cell-Typ" und ersetzt ihn durch eine vermeintlich
ausdrucksstärkere Objektform. Bei n=3 ist ein Ausreißer 33 % der Zelle —
größeres n nötig zur stabilen Frequenz-Schätzung.

**Bedingung**: n=3 in der betroffenen Zelle.

---

## Caveats

- **Single workflow**: Nur v4-exact-subagents. Andere Workflows könnten
  andere Modell-Rankings produzieren (vgl. RQ-tdd-quality F-tdd-quality.1).
- **Single kata**: Nur Game of Life (Library-Form, example-mapping).
  Mars-rover als zweiter Code-Qualitäts-Carrier offen.
- **Opus 4.6 via Portkey**: Findings über `opus-4-6-portkey*` nicht
  automatisch auf Direct-API-Opus-4.6 übertragbar.
- **n = 3 pro Zelle** (außer opus-4-7-no-thinking mit n=10 dank
  RQ-tdd-quality-Pooling): σ in einzelnen Outcomes hoch — Thinking-Deltas
  (F-model-quality.3) und der Repräsentations-Ausreißer (F-model-quality.5)
  sind bei n=3 replikationsbedürftig.
- **API-Vertrag eingeführt**: Alle Runs in dieser Datenbasis nutzen den
  expliziten API-Vertrag in der Prompt (commit `0902a4f`). Frühere Findings
  über Repräsentations-Wahl ohne expliziten Vertrag sind nicht direkt
  vergleichbar.
