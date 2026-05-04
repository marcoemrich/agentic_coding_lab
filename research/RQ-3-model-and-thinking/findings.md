# RQ-3 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf
Output-Qualität und Effizienz?**

Quelle der initialen Findings: `_archive/findings-validation-2026-05-04/`
(re-evaluierte alte 235-Run-Studie, Zellen B1, B2). Spätere Updates
entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

Status-Legende siehe [`research/README.md`](../README.md#findings-status-legende).

---

## F-3.1 — Modell-Klasse korreliert mit Code-Qualität (Opus < Sonnet < Haiku) · ⚠️ revidiert

**Aussage**: Stärkere Modelle erzeugen kompakteren Code mit niedrigerer
`cc_longest_function`. Reihenfolge **Opus < Sonnet < Haiku** auf
LoC und cc_longest bestätigt.

**Datenbasis** (smart-subset, game-of-life-prose, v4-exact-subagents, n=1):

| Modell | LoC | cc_longest | smell_total |
|---|---:|---:|---:|
| Opus 4.7 (Thinking) | 32 | **4** | 2 |
| Opus 4.7 no-thinking | 41 | 10 | 2 |
| Sonnet 4.6 | 42 | 18 | 3 |
| Haiku 4.5 | 59 | 22 | 4 |

**Caveats**:
- n=1 pro Zelle — keine σ-Schätzung möglich.
- Mai-2026-Modelle sind absolut deutlich kompakter als die alten Werte
  (Opus 32 LoC vs. 171 Mass aus alter Studie); Skala kaum vergleichbar.
- Faktor "Sonnet 57 % komplexer als Opus" aus alter Studie nicht direkt
  reproduziert.

Quelle: ehemals B1.

**Replikation nötig**: n≥3 pro Modell auf game-of-life mit konstantem
Workflow (RQ-3-Faktor-Design).

---

## F-3.2 — Extended Thinking hilft bei Code-Qualität, kaum bei Pass-Rate · ⚠️ revidiert

**Aussage**: Adaptive/Extended Thinking reduziert `cc_longest_function`
messbar, hat aber keinen Pass-Rate-Effekt (in der Datenbasis 100 % bei
beiden Modi). Dauer-Effekt klein.

**Datenbasis** (smart-subset, Opus thinking vs. no-thinking):

| Workflow | thinking | n | Pass-Rate | Dauer | LoC |
|---|---|---:|---:|---:|---:|
| v4 | thinking | 11 | 100 % | 549 s | 11.1 |
| v4 | no-thinking | 8 | 100 % | 650 s | 13.0 |
| v5 | thinking | 12 | 100 % | 245 s | 8.7 |
| v5 | no-thinking | 8 | 100 % | 230 s | 12.6 |

Auf game-of-life-prose konkret (n=1):
- v5 + thinking: cc_longest = 19 vs. v5 + no-thinking: 29 → Bonus
- v4 + thinking: cc_longest = 4 vs. v4 + no-thinking: 10 → Bonus

**Caveats**:
- Pass-Rate-Effekt = 0 in dieser Replikation.
- Aussage "5/7 vs. 7/7 Katas" aus alter Studie nicht reproduzierbar
  (anderes Kata-Set heute).
- Dauer-Effekt klein und richtungs-uneinheitlich (-15 % auf v4, +7 % auf v5).

Quelle: ehemals B2.

**Replikation nötig**: RQ-3 misst opus-4-7 vs. opus-4-7-no-thinking und
sonnet-4-6 vs. sonnet-4-6-no-thinking je n≥3 auf game-of-life.

---

## Offene Hypothesen aus RQ-3-README, noch keine Daten

- **H3**: Schwächere Modelle erzeugen größere `code_mass` (defensivere
  Implementierungen).
- **H4**: Thinking erhöht `duration_seconds` ohne proportionale
  Korrektheits-Verbesserung — außer auf v4/v5.

Coverage in `summary.md` zeigt: derzeit nur 1/5 Modell-Zellen voll.
Datenerhebung über RQ-3-Batch erforderlich.
