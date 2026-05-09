# RQ-2 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität
und Korrektheit?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

---

## F-2.1 — Prompt-Stil hat keinen sichtbaren Pass-Rate-Effekt

**Aussage**: Auf game-of-life × v4-exact-subagents × opus-no-thinking
liefern alle drei Prompt-Stile 100 % `tests_passing`.

| Stil | n | tests_passing rate |
|---|---:|---:|
| prose | 4 | 100 % |
| example-mapping | 6 | 100 % |
| user-story | 3 | 100 % |

H1 ("example-mapping erhöht tests_passing") ist auf v4 + Opus nicht
nachweisbar — Pass-Rate ist gesättigt.
