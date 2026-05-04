# RQ-2 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität
und Korrektheit?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`. Die alte 235-Run-Studie hatte zu
Prompt-Stilen keinen direkten Vergleich (alle Workflows liefen mit
prose).

Status-Legende siehe [`research/README.md`](../README.md#findings-status-legende).

---

## F-2.1 — Prompt-Stil hat keinen sichtbaren Pass-Rate-Effekt · ✅ haltbar

**Aussage**: Auf game-of-life × v4-exact-subagents × opus-no-thinking
liefern alle drei Prompt-Stile 100 % `tests_passing`.

| Stil | n | tests_passing rate |
|---|---:|---:|
| prose | 4 | 100 % |
| example-mapping | 6 | 100 % |
| user-story | 3 | 100 % |

H1 ("example-mapping erhöht tests_passing") ist auf v4 + Opus nicht
nachweisbar — Pass-Rate ist gesättigt.

---

## F-2.2 — Code-Mass und cc_longest deuten auf user-story als knappstes Format · 🚫 vorläufig

**Aussage**: user-story produziert in den vorhandenen Daten den niedrigsten
Mittelwert für `code_mass` und `cc_longest_function` — entgegen H2 ("user-story
mehr defensiver Code").

| Stil | code_mass μ | cc_longest μ | smell_total μ |
|---|---:|---:|---:|
| prose | 168 | 11.3 | 3.0 |
| example-mapping | 169 | 15.2 | 2.5 |
| **user-story** | **149** | **8.0** | 2.3 |

**Caveats**:
- n=3 für user-story (nur min_replicates), σ ≈ 5–26.
- Spannweite cc_longest user-story 2–11: hohe Streuung, mind. ein Run
  mit cc_longest=2 (sehr aufgeräumt).
- Effekt könnte ein Stichproben-Artefakt sein.

H3 ("user-story tendenziell schlechter bei smell_total") ist nicht gestützt —
user-story hat sogar den niedrigsten smell_total-Mittelwert.

**Replikation nötig**: n≥6 pro Stil, idealerweise mit Workflow-Variation
(v3, v5 zusätzlich), um zu prüfen, ob der Effekt v4-spezifisch ist.

---

## Offene Hypothesen aus RQ-2-README

- **H1**: example-mapping erhöht `tests_passing` → vorerst widerlegt (alle 100 %).
- **H2**: user-story erzeugt mehr `code_mass` → Daten deuten ins
  Gegenteil (F-2.2).
- **H3**: user-story tendenziell höhere smell_total → Daten deuten ins
  Gegenteil (F-2.2).

Alle Hypothesen brauchen größere Stichproben oder Workflow-Variation,
bevor robuste Aussagen möglich sind.
