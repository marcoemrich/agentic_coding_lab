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

## F-3.1 — Modell-Klasse korreliert mit Code-Qualität (Opus < Sonnet < Haiku) · ✅ haltbar

**Aussage**: Code-Mass-Ranking **Opus < Sonnet < Haiku** auf
game-of-life × v4-exact-subagents × example-mapping bestätigt mit
n=3–6 pro Zelle. Ranking robust über Thinking-Modus.

**Datenbasis** (RQ-3 fill, game-of-life-example-mapping × v4-exact-subagents):

| Modell | n | LoC mean (std) | smell mean | cc_long mean |
|---|---:|---:|---:|---:|
| opus-4-7              | 3 | 178 (14)  | 3.0 | 8.7  |
| opus-4-7-no-thinking  | 6 | 169 (24)  | 2.5 | 15.2 |
| sonnet-4-6            | 3 | 210 (73)  | 4.7 | 14.0 |
| sonnet-4-6-no-thinking| 3 | 272 (125) | 3.0 | 19.0 |
| haiku-4-5             | 3 | 273 (28)  | 5.3 | 19.7 |

**Begründung**: Opus liefert ~37 % weniger LoC als Haiku (169–178 vs. 273)
bei deutlich besserem cc_longest (8.7 vs. 19.7). Sonnet-Position
abhängig vom Thinking-Modus.

**Caveats**:
- Sonnet-no-thinking hat hohe Varianz (LoC std=125 → min 180, max 414).
- Faktor "Sonnet 57 % komplexer als Opus" aus alter Studie weiterhin
  nicht reproduziert (Sonnet-thinking nur ~18 % über Opus).

Quelle: ehemals B1, repliziert 2026-05-04 via RQ-3-fill (12 neue Runs).

---

## F-3.2 — Extended Thinking hilft bei cc_longest, nicht universell bei smell, gar nicht bei Pass-Rate · ✅ haltbar (cc_longest) / ⚠️ revidiert (smell)

**Aussage**: Thinking hat **keinen Pass-Rate-Effekt** auf game-of-life × v4
(100 % beide Modi), reduziert aber `cc_longest_function` bei Opus
deutlich (8.7 vs. 15.2). Sonnet-Effekt schwächer (14.0 vs. 19.0).
Smell-Effekt **nicht** universell — bei Opus ist no-thinking sogar
besser (2.5 vs. 3.0), bei Sonnet umgekehrt (3.0 vs. 4.7).

**Datenbasis** (RQ-3 fill, game-of-life-example-mapping × v4-exact-subagents):

| Modell | thinking | n | pass | dauer | LoC | smell | cc_long |
|---|---|---:|---:|---:|---:|---:|---:|
| opus-4-7    | ja  | 3 | 100% | 815  | 178 | 3.0 | **8.7** |
| opus-4-7    | nein| 6 | 100% | 779  | 169 | 2.5 | 15.2 |
| sonnet-4-6  | ja  | 3 | 100% | 989  | 210 | 4.7 | 14.0 |
| sonnet-4-6  | nein| 3 | 100% | 1092 | 272 | 3.0 | 19.0 |

**Caveats**:
- Pass-Rate-Effekt = 0 — H4 (thinking erhöht Dauer ohne
  Korrektheits-Verbesserung) hier nicht prüfbar, da Sättigung.
- Dauer-Effekt richtungs-uneinheitlich (Opus +5 %, Sonnet -9 %).
- Smell-Effekt **negativ** bei Opus → "thinking → besseres Design"
  nicht universell.

Quelle: ehemals B2, repliziert 2026-05-04 via RQ-3-fill.

---

## F-3.3 — Pass-Rate-Sättigung auf v4-exact-subagents · ✅ haltbar

**Aussage**: Auf game-of-life × v4-exact-subagents × example-mapping
erreicht **jedes** getestete Modell (Opus, Sonnet, Haiku — mit/ohne
thinking) 100 % Pass-Rate (18/18 Runs). Hypothese H1 ("Opus > Sonnet >
Haiku robuster") **nicht reproduzierbar** auf dieser Zelle.

**Datenbasis**: 18 Runs RQ-3-fill, alle 100 % `tests_passing`.

**Begründung**: Entweder ist (a) game-of-life-example-mapping bei v4 zu
einfach für eine Modell-Differenzierung auf Pass-Rate, oder (b)
v4-Strenge fängt schwächere Modelle stark genug ab. Das schließt H1
nicht aus, sondern verschiebt die Replikation auf schwierigere Settings
(z.B. mars-rover oder v3-prose).

**Replikations-Empfehlung**: H1 auf mars-rover oder v3-prose erneut
prüfen.

---

## F-3.4 — Haiku ist token-teuerster · ✅ haltbar

**Aussage**: Haiku 4.5 verbraucht **2.3× mehr Tokens als Opus 4.7**
(3.81M vs. 2.53M auf identischer Zelle), trotz nominell günstigerem
Preis. Längere Antworten + Context-Inflation (28.7 % vs. 7.7 %
Auslastung).

**Datenbasis** (RQ-3 fill, game-of-life-example-mapping × v4-exact-subagents):

| Modell | total_tokens | ctx % | duration |
|---|---:|---:|---:|
| haiku-4-5             | 3.81M | 28.7 | 1072 s |
| opus-4-7-no-thinking  | 2.62M | 22.2 |  779 s |
| opus-4-7              | 2.53M |  7.7 |  815 s |
| sonnet-4-6-no-thinking| 2.10M |  5.7 | 1092 s |
| sonnet-4-6            | 1.64M |  5.0 |  989 s |

**Begründung**: Sonnet-thinking ist token-effizientestes Modell auf v4.
Haiku skaliert weder Tokens noch Dauer besser als Opus → Effizienz-
Argument für Haiku auf v4-Workflows brüchig. H3 (schwächere Modelle
defensiver/größere code_mass) **bestätigt** mit code_mass und tokens.

---

## Offene Hypothesen aus RQ-3-README

- **H1**: Pass-Rate-Differenzierung — auf v4 nicht prüfbar (Sättigung,
  siehe F-3.3). Replikation auf v3 oder mars-rover ausstehend.
- **H4**: Thinking erhöht Dauer ohne Korrektheits-Verbesserung — auf
  v4 nicht prüfbar (Pass-Rate gesättigt; Dauer-Effekt richtungs-
  uneinheitlich, siehe F-3.2).
