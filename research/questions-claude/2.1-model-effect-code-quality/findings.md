# RQ-model-quality Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie stark unterscheiden sich die verfügbaren Modelle (Sonnet 4.6, Opus 4.6,
Opus 4.7, Opus 4.8, Fable 5 — jeweils mit/ohne Thinking) in der Code-Qualität
auf einer trainingsbekannten Kata bei stärkstem Workflow?**

Datenbasis: 38 Runs (10 Zellen × n=3, plus zusätzliche
opus-4-7-no-thinking-Replikate aus dem RQ-tdd-quality-Pool → dort n=10, und
opus-4-8-no-thinking mit n=4). Workflow v4-exact-subagents, Kata
game-of-life-example-mapping mit explizitem API-Vertrag
(`nextGeneration(cells: Cell[]): Cell[]`). Korrektheits-Innensicht via vom
Agenten geschriebene Vitest-Tests, Außensicht via Modul-Import-Adapter
`game-of-life-verification/` (15 Szenarien).

---

## Übersicht: Code-Qualität nach Modell (Mittelwerte)

| Modell | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| fable-5 | 163.00 | 3.00 | **2.00** 🏆 | **1.00** 🏆 | 8.33 | **1.00** 🏆 | 3 |
| fable-5-no-thinking | 163.33 | **2.33** 🏆 | 2.67 | 1.67 | 6.67 | **1.00** 🏆 | 3 |
| opus-4-8 | **145.33** 🏆 | 2.67 | 4.33 | 5.33 | **4.33** 🏆 | **1.00** 🏆 | 3 |
| opus-4-8-no-thinking | 190.50 | 3.00 | 4.25 | 4.75 | 11.50 | **1.00** 🏆 | 4 |
| opus-4-7 | 159.00 | **2.33** 🏆 | 3.33 | 3.00 | 7.00 | **1.00** 🏆 | 3 |
| opus-4-7-no-thinking | 166.60 | 2.60 | 4.50 | 4.40 | 8.10 | **1.00** 🏆 | 10 |
| opus-4-6-portkey | 173.00 | 4.33 | 6.67 | 12.00 | 19.33 | **1.00** 🏆 | 3 |
| opus-4-6-portkey-no-thinking | 175.67 | 4.33 | 7.67 | 13.00 | 18.67 | **1.00** 🏆 | 3 |
| sonnet-4-6 | 178.00 | 5.67 | 6.33 | 11.00 | 21.67 | **1.00** 🏆 | 3 |
| sonnet-4-6-no-thinking | 166.67 | 3.33 | 6.00 | 5.00 | 15.00 | 0.73 | 3 |

Bester Wert pro Spalte fett + 🏆. Kleiner = besser (außer `verification_pct`: größer = besser).
Quality-Trophies sind korrektheits-gegated: nur Zellen mit `verification_pct = 1.0`
sind trophy-fähig (sonnet-4-6-no-thinking mit 0.73 ausgenommen).
`verification_pct`: neun Zellen gleichauf bei 1.00 → Ties, alle 🏆.
`smell_total`: opus-4-7 und fable-5-no-thinking gleichauf bei 2.33 → Tie, beide 🏆.

Fable 5 setzt die neuen Bestwerte auf den reinen Komplexitäts-Scores:
`cognitive_max` 1.0 und `mccabe_max` 2.0 (mit Thinking) liegen deutlich unter
allem anderen — die Spitzen-Komplexität ist faktisch trivial. Opus 4.8 (mit
Thinking) bleibt der **kompakteste Code** (`code_mass` 145.3,
`cc_longest_function` 4.3). Damit gibt es zwei verschiedene Qualitäts-Gewinner:
Fable 5 für niedrigste Komplexität, Opus 4.8 für geringste Code-Mass.

---

## F-model-quality.1 — Korrektheit (innen + außen) auf v4 ist nahezu modellunabhängig perfekt

**Aussage**: `tests_passing` liegt für alle zehn Modell-Zellen bei 100 % (38/38
Runs). `verification_pct` liegt in neun von zehn Zellen ebenfalls bei
1.00 — der explizite API-Vertrag (`Cell = [number, number]`,
`nextGeneration(cells: Cell[]): Cell[]`) eliminiert die zuvor beobachteten
Repräsentations-Mismatches fast vollständig. Beide Fable-5-Zellen und beide
Opus-4.8-Zellen liefern 15/15 in allen Replikaten.

Einzige Ausnahme: **sonnet-4-6-no-thinking** mit `verification_pct = 0.73`
— 2/3 Runs perfekt (15/15), ein Run mit 3/15 (siehe F-model-quality.5).

**Datenbasis**: 38 Runs, 15 Verifikations-Szenarien pro Run.

**Konsequenz**: Auf v4 + game-of-life + Direct-API/Portkey-Opus + Sonnet ist
Korrektheit kein differenzierendes Merkmal mehr. Code-Qualitäts-Ranking-Aussagen
sind auf korrektem Code basiert.

---

## F-model-quality.2 — Modell-Ranking: Fable 5 führt auf Komplexität, Opus 4.8 auf Code-Mass; beide deutlich vor Opus 4.6 und Sonnet

**Aussage**: Die Spitze teilen sich zwei Modelle mit unterschiedlichem Profil.
**Fable 5** liefert die niedrigste Spitzen-Komplexität überhaupt
(`cognitive_max` 1.0, `mccabe_max` 2.0 — beide nahe dem theoretischen Minimum),
**Opus 4.8** die geringste Code-Mass und die kürzeste längste Funktion
(`code_mass` 145.3, `cc_longest_function` 4.3). Beide liegen klar vor Opus 4.7
(solides Mittelfeld der Top-Gruppe), und alle drei deutlich vor Opus 4.6 und
Sonnet:

| Metrik (mit Thinking) | fable-5 | opus-4-8 | opus-4-7 | opus-4-6-portkey | sonnet-4-6 |
|---|---:|---:|---:|---:|---:|
| `code_mass` | 163.00 | **145.33** 🏆 | 159.00 | 173.00 | 178.00 |
| `cc_longest_function` | 8.33 | **4.33** 🏆 | 7.00 | 19.33 | 21.67 |
| `smell_total` | 3.00 | 2.67 | **2.33** 🏆 | 4.33 | 5.67 |
| `mccabe_max` | **2.00** 🏆 | 4.33 | 3.33 | 6.67 | 6.33 |
| `cognitive_max` | **1.00** 🏆 | 5.33 | 3.00 | 12.00 | 11.00 |

Kleiner = besser; 🏆 = bestes Modell pro Metrik (Zeile), korrektheits-gegated
(alle fünf Zellen hier bei `verification_pct = 1.0`).

Der Abstand der Spitzengruppe zu Opus 4.6 ist substanziell: auf `cognitive_max`
trennt Fable 5 (1.0) von Opus 4.6 (12.0) ein Faktor ~12×, auf
`cc_longest_function` Opus 4.8 (4.3) von Opus 4.6 (19.3) ein Faktor ~4.5×. Die
beiden Spitzenprofile sind komplementär: Fable 5 hält die Spitzen-Komplexität
trivial, schreibt aber etwas mehr Code; Opus 4.8 minimiert die Code-Mass, packt
die Logik dafür dichter (höhere `cognitive_max`/`mccabe_max` als Fable 5).

**Datenbasis**: fable-5 n=3, opus-4-8 n=3, opus-4-7 n=3, opus-4-6-portkey n=3,
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
| fable-5 | −0.33 | +0.67 | −0.67 | −0.67 | +1.66 |
| opus-4-8 | **−45.17** | −0.33 | +0.08 | +0.58 | −7.17 |
| opus-4-7 | −8.67 | −0.17 | −0.67 | +0.17 | −2.33 |
| opus-4-6-portkey | −2.67 | 0.00 | −1.00 | −1.00 | +0.66 |
| sonnet-4-6 | +11.33 | +2.34 | +0.33 | **+6.00** | +6.67 |

∆-Tabelle (Thinking-Effekt, ∆ negativ = besser mit Thinking) — kein Modell-Wettbewerb, daher kein 🏆.
Das Fett markiert die stärksten Effekte: **−45.17** (stärkste Verbesserung, Opus 4.8 auf `code_mass`)
und **+6.00** (stärkste Verschlechterung, Sonnet auf `cognitive_max`).

- **Fable 5**: Thinking-Effekt durchweg klein und uneinheitlich (alle |∆| < 2),
  effektiv neutral. Fable 5 erreicht seine triviale Spitzen-Komplexität mit und
  ohne Thinking gleichermaßen — die niedrige `cognitive_max`/`mccabe_max` ist
  kein Thinking-Artefakt, sondern Modell-intrinsisch.
- **Opus 4.8**: Thinking wirkt **stark auf die Code-Größe** — `code_mass`
  fällt um 45 (190 → 145) und die längste Funktion mehr als halbiert sich
  (11.5 → 4.3). Auf den reinen Komplexitäts-Scores ist der Effekt dagegen
  leicht negativ (`cognitive_max` +0.58, `mccabe_max` +0.08): mit Thinking
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

## F-model-quality.4 — Token-Kosten: Fable 5 und Sonnet/Opus 4.7 die günstigsten, Opus 4.8 der teuerste; Wallclock einheitlich

**Aussage**: Token-Verbrauch (Mittel) und Wallclock-Zeit nach Modell:

| Modell | `total_tokens` (Mittel) | `duration_seconds` (Mittel) |
|---|---:|---:|
| sonnet-4-6-no-thinking | 2.21 M | 1116.7 |
| fable-5-no-thinking | **2.26 M** 🏆 | 1158.0 |
| sonnet-4-6 | 2.41 M | 846.3 |
| opus-4-7 | 2.49 M | **827.7** 🏆 |
| opus-4-7-no-thinking | 2.56 M | 1162.9 |
| fable-5 | 2.64 M | 1269.0 |
| opus-4-6-portkey | 2.93 M | 956.3 |
| opus-4-8-no-thinking | 3.17 M | 1045.5 |
| opus-4-8 | 3.80 M | 1017.0 |
| opus-4-6-portkey-no-thinking | 3.87 M | 1160.7 |

Kleiner = besser; 🏆 = bestes Modell pro Spalte, korrektheits-gegated
(sonnet-4-6-no-thinking mit `verification_pct = 0.73` ist trotz niedrigstem
Token-Wert nicht trophy-fähig — der niedrige Verbrauch spiegelt teils einen
fehlerhaften Lauf, nicht echte Sparsamkeit; daher geht der Token-Pokal an
fable-5-no-thinking als günstigste korrekte Zelle).

Spread zwischen günstigstem korrekten Modell (fable-5-no-thinking ~2.3 M) und
teuerstem (opus-4-6-no-thinking ~3.9 M, opus-4-8 ~3.8 M) ist Faktor ~1.7×.
**Fable 5 verbindet niedrigste Komplexität (F-model-quality.2) mit günstigem
Token-Budget** — anders als Opus 4.8, dessen kompakter Output (geringste
Code-Mass) mit dem höchsten Inferenz-Budget erkauft wird (~1.4× gegenüber
Fable 5).

Wallclock liegt überwiegend bei ~14–21 min/Run; einzelne opus-4-7-no-thinking-
Replikate streuen stark nach oben (Pool n=10, max 3923 s).

**Konsequenz**: Auf v4 ist Modell-Wahl ein Trade-off zwischen Code-Kompaktheit
(Opus 4.8 vorn auf `code_mass`) und der Kombination aus niedriger Komplexität
und Token-Budget (Fable 5 vorn). Fable 5 ist der beste Allrounder — triviale
Spitzen-Komplexität bei günstigen Kosten; Opus 4.8 lohnt, wenn minimale
Code-Mass das Ziel ist und das höhere Token-Budget akzeptabel.

---

## F-model-quality.5 — Vertrags-Konformität unter explizitem API-Vertrag fast vollständig erreicht; ein Sonnet-Ausreißer redefiniert `Cell` als Objekt

**Aussage**: Mit explizitem API-Vertrag in der Kata-Prompt
(`type Cell = [number, number]; export function nextGeneration(cells: Cell[]): Cell[]`)
verschwinden die zuvor beobachteten Repräsentations-Mismatches fast
vollständig. Verbleibend ist ein einziger Ausreißer:

| Run | Modell | Gewählte Signatur | `verification_pct` |
|---|---|---|---:|
| `2026-05-14_21-09-13_…_sonnet-4-6-no-thinking` | sonnet-4-6-no-thinking | `Cell = { x: number; y: number }` (Objekt) | 0.20 |

Alle anderen 37 Runs halten sich an die `[number, number]`-Tupel-Form (bzw.
deren Superset `number[]`) und erreichen 15/15 — darunter alle sechs
Fable-5-Runs und alle sieben Opus-4.8-Runs. Die Sonnet-Abweichung zeigt: der
explizite Prompt-Vertrag
reduziert Repräsentations-Drift drastisch (Sonnet zuvor 6/6 Runs `boolean[][]`
→ jetzt 5/6 Runs Tupel), eliminiert ihn aber nicht in allen Fällen.

**Datenbasis**: 38 Runs, manuelle Inspektion der `nextGeneration`-Signaturen
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
- **Fable 5 / Opus 4.8 nur Native-API**: `fable-5*` und `opus-4-8*` laufen
  über die native Anthropic-API (CLI 2.1.170, geleerte `ANTHROPIC_*`-Env,
  native OAuth), nicht über Portkey. Ein Routing-Confound gegenüber den
  Portkey-Opus-4.6-Zellen besteht, ist hier aber für die Code-Qualitäts-
  Metriken als unkritisch angenommen.
- **n = 3 pro Zelle** (außer opus-4-7-no-thinking mit n=10 dank
  RQ-tdd-quality-Pooling, opus-4-8-no-thinking mit n=4): σ in einzelnen
  Outcomes hoch — Thinking-Deltas (F-model-quality.3) und der
  Repräsentations-Ausreißer (F-model-quality.5) sind bei n=3
  replikationsbedürftig. Fable 5 erreicht seine Bestwerte auf
  `cognitive_max`/`mccabe_max` mit σ ≤ 0.58 (sehr eng), die niedrige
  Spitzen-Komplexität ist also über die drei Replikate stabil.
- **API-Vertrag eingeführt**: Alle Runs in dieser Datenbasis nutzen den
  expliziten API-Vertrag in der Prompt (commit `0902a4f`). Frühere Findings
  über Repräsentations-Wahl ohne expliziten Vertrag sind nicht direkt
  vergleichbar.
