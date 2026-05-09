# RQ-5 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wie groß ist die Run-zu-Run-Varianz innerhalb identischer Zellen?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`. Diese RQ liefert die methodische
Basis für `min_replicates`-Entscheidungen in allen anderen RQs.

---

## F-5.1 — `tests_passing` ist deterministisch (σ ≈ 0)

**Aussage**: Auf game-of-life × Opus-no-thinking ist `tests_passing` über
alle 11 Workflow×Prompt-Zellen 100 %. **n=1 reicht für diese Metrik**
auf dieser Datenbasis.

50/50 Runs grün. H1 bestätigt.

**Caveat**: Auf schwächeren Modellen (Haiku, s. RQ-4) versagt diese
Aussage — dort ist `tests_passing` nicht stabil.

---

## F-5.2 — `code_mass` zeigt mittleres Rauschen, σ ~7–26

**Aussage**: `code_mass` ist die rauschigste der robusten Metriken.
σ liegt bei 7–26 (μ ~150–180), also relative Streuung ~5–15 %.

| Workflow / Stil | μ | σ |
|---|---:|---:|
| v1-oneshot / prose | 164 | **7** (am stabilsten) |
| v2-iterative / prose | 163 | 11 |
| v5 / example-mapping | 157 | 14 |
| v3 / example-mapping | 157 | 20 |
| v4 / prose | 168 | 20 |
| v4 / example-mapping | 169 | **24** |
| v4 / user-story | 149 | **26** (am unruhigsten) |

Tendenz: **v4 hat die höchste `code_mass`-Streuung** — H4 (mehr
Subagent-Übergänge → mehr Variabilität) wird qualitativ gestützt.
v1/v2 sind am stabilsten, weil sie ein single-shot bzw. fest iteriertes
Verfahren nutzen.

→ **Empfehlung**: Für `code_mass`-Vergleiche zwischen Workflows
mindestens **n=3** pro Zelle, besser n=6.

---

## F-5.3 — Komplexitäts-Metriken streuen mit hohen Outliers

**Aussage**: `cc_longest_function`-σ liegt zwischen 3.6 (v1/prose) und
8.4 (v5/prose). Bei TDD-Workflows mit Refactor-Phasen (v4, v5) sind
Min-Werte sehr niedrig (2 = trivial), Max-Werte aber teilweise > 25 —
also bimodale Verteilung ("manchmal sehr aufgeräumt, manchmal nicht").

Die numerischen Komplexitäts-Scores zeigen das **gleiche bimodale
Muster, sogar verstärkt**:

| Zelle (game-of-life, opus-no-thinking, n=6) | cc_long σ | mccabe σ | cognitive σ | cognitive range |
|---|---:|---:|---:|---|
| v5 / example-mapping | 8 | 2.7 | **7.1** | 2–21 |
| v4 / example-mapping | 4.4 | 1.5 | 3.2 | 1–10 |
| v3 / example-mapping | 5.0 | 2.5 | 4.1 | 9–21 |
| v1 / prose | 3.6 | 2.2 | 4.7 | 9–20 |

Bei v5 reicht die Cognitive-Spanne über den Faktor 10 (2 vs. 21) — ein
einzelner Outlier verschiebt den Mittelwert massiv.

→ **Empfehlung**: n≥6 für alle Komplexitäts-Maße
(`cc_longest_function`, `mccabe_max`, `cognitive_max`), sonst kann ein
einzelner Outlier den Mittelwert kippen. Cognitive ist die unruhigste
der drei.

---

## F-5.5 — `duration_seconds` ist hochstabil bei v1/v2/v3, sehr unruhig bei v4

**Aussage**: σ skaliert ungefähr proportional zu μ — kleine Workflows
sind absolut stabil, lange Workflows haben hohe absolute Streuung.

| Workflow | μ (s) | σ (s) | σ/μ |
|---|---:|---:|---:|
| v1 / prose | 50 | 4 | 8 % |
| v3 / prose | 47 | 4 | 7 % |
| v2 / prose | 52 | 7 | 13 % |
| v3 / example-mapping | 56 | 14 | 25 % |
| v5 / example-mapping | 350 | 17 | 5 % |
| v5 / prose | 354 | 81 | 23 % |
| v4 / example-mapping | 779 | 152 | 19 % |
| v4 / user-story | 761 | 167 | 22 % |
| v4 / prose | 802 | **198** | 25 % |

v4/prose hat Range 533–995 — fast Faktor 2× zwischen schnellstem und
langsamstem Run. Tokens-Variation der Subagent-Calls treibt das.

→ **Empfehlung**: Für Speed-Vergleiche zwischen Workflows reicht n=3,
weil der Effekt-Größenordnungs-Unterschied (v1 vs. v4: 16×) jede
Streuung deutlich überschreitet.

---

## F-5.6 — Konsequenzen für andere RQs

Aus F-5.1 bis F-5.5:

- `tests_passing` auf Opus + game-of-life: n=1 reicht.
- `code_mass`, `cc_longest_function`: **n≥3 nötig**, für v4 (höchste σ)
  eher n=6.
- `duration_seconds`: n=3 reicht für Workflow-Vergleiche.
- **v4 ist die varianz-anfälligste Zelle** — wer v4 exakt schätzen will,
  braucht mehr Replikate als für v1/v2/v3/v5.

`min_replicates: 3` in allen RQ-Frontmattern ist als Mindest-Schwelle
sinnvoll. Für RQ-3 (Modell-Vergleich auf v4 + cc_longest) wäre eine
Erhöhung auf n=6 begründbar.
