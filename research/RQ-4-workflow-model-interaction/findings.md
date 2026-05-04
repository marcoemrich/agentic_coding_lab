# RQ-4 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Profitieren schwächere Modelle stärker von strikteren Workflows als starke?**

Quelle der initialen Findings: `_archive/findings-validation-2026-05-04/`
(re-evaluierte alte 235-Run-Studie, Zellen A4, A5, B3, C1, C7). Spätere
Updates entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

Status-Legende siehe [`research/README.md`](../README.md#findings-status-legende).

---

## F-4.1 — Pass-Rate ist modell-abhängig: Haiku scheitert in v4/v5 · ⚠️ revidiert

**Aussage**: Pass-Rate ist NICHT universell 100 %. Sie hängt vom Modell
und Workflow ab — Haiku-4-5 fällt in den TDD-Subagent-Workflows (v4, v5)
deutlich aus, während Opus und Sonnet 100 % liefern.

**Datenbasis** (smart-subset, 89 Runs nach Bereinigung):

| Workflow | Modell | n | Pass-Rate |
|---|---|---:|---:|
| v1–v3 | alle (inkl. Haiku) | — | 100 % |
| v4 | Opus, Sonnet | viele | 100 % |
| v4 | **Haiku 4.5** | 8 | **75 %** (6/8) |
| v5 | Opus, Sonnet | viele | 100 % |
| v5 | **Haiku 4.5** | 8 | **50 %** (4/8) |

Failure-Modus bei Haiku in v5: `it.todo`-Stubs ohne Implementation.
Failure-Modus bei Haiku in v4: Subagent-Pipeline bricht ab.

**Interpretation**: Multi-Step-Subagent-Workflows benötigen
Reasoning-Kapazität, die Haiku 4.5 nicht durchgängig bietet. Workflows
v1–v3 (single-shot bzw. simpel iterativ) sind universell tauglich.

Quelle: ehemals C1.

---

## F-4.2 — Bester Workflow hängt vom Thinking-Modus ab · 🚫 nicht prüfbar

**Aussage** (alt): "Mit Thinking: v4 bester. Ohne Thinking: v5 bester."

**Status**: Datenbasis fehlt. game-of-life-fair und stability laufen
nur auf opus-no-thinking; smart-subset hat keine n≥3-Vergleiche.

Was smart-subset (n=1) andeutet:
- v5 + thinking: cc_longest = 19 vs. v5 + no-thinking: 29
- v4 + thinking: cc_longest = 4 vs. v4 + no-thinking: 10

→ Trend "v4 mit Thinking ist Spitze" stützt sich, aber kein robustes Signal.

**Replikation nötig**: RQ-4-Faktor-Design liefert die Daten (v1/v3/v4/v5
× Opus-no-thinking / Sonnet / Haiku, n=3).

Quelle: ehemals A4 + C7 (gleiche Aussagen-Klasse).

---

## F-4.3 — Thinking-Bonus auf v4 Mass-Reduktion · 🚫 nicht prüfbar mit n≥3

**Aussage** (alt): "v4 mit Thinking gewinnt 7/7 Katas mit 19–82 %
Mass-Reduktion gegenüber no-thinking."

**Smart-subset-Datenpunkt** (game-of-life-prose, n=1):

| Workflow × Modell | LoC | smell_total | cc_longest |
|---|---:|---:|---:|
| v4 × opus-4-7 (Thinking) | 32 | 2 | 4 |
| v4 × opus-4-7-no-thinking | 41 | 2 | 10 |

→ Trend "Thinking macht v4 etwas kompakter" bestätigt sich, aber n=1.

**Replikation nötig**: n≥3 pro (Workflow × Modell × Thinking)-Zelle —
formal Aufgabe von RQ-3 (Modell allein) und RQ-4 (Modell × Workflow).

Quelle: ehemals A5.

---

## F-4.4 — TDD verkleinert Modell-Abstand · 🚫 nicht prüfbar

**Aussage** (alt): "Opus produziert einfacheren Code als Sonnet, besonders
bei komplexen Katas. TDD verkleinert den Abstand."

Smart-subset deutet eher an: **v4 nivelliert die Pass-Rate** zwischen Opus
und Sonnet (beide 100 %), aber **nicht die cc_longest_function** (Opus
4 vs. Sonnet 18, immer noch Faktor 4×). TDD reduziert also Korrektheits-,
nicht Stil-Unterschiede.

**Replikation nötig**: RQ-4 testet diese Hypothese direkt (Workflow ×
Modell, ausgewertet als Interaktionseffekt).

Quelle: ehemals B3.

---

## Offene Hypothesen aus RQ-4-README

- **H1**: Striktere Workflows verbessern Haikus `tests_passing` deutlich,
  Opus' nur marginal. (F-4.1 stützt das qualitativ — Haiku scheitert
  ausgerechnet bei v4/v5.)
- **H2**: Smells reduzieren sich bei schwachen Modellen durch v4/v5
  stärker als bei starken.
- **H3**: Opus erreicht mit v3 schon Quality-Niveau, das v4/v5 nur noch
  marginal verbessert.
- **H4**: v5 (single-context) hilft schwachen Modellen anders als v4.

Coverage in `summary.md`: 25 Runs auf 12 Zellen — viele Zellen unter
n=3. Datenerhebung über RQ-4-Batch erforderlich.
