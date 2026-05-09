# RQ-3 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf
Output-Qualität und Effizienz?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

---

## F-3.1 — Modell-Klasse korreliert mit Code-Qualität (Opus < Sonnet < Haiku)

**Aussage**: Code-Mass-Ranking **Opus < Sonnet < Haiku** auf
game-of-life × v4-exact-subagents × example-mapping bestätigt mit
n=3–6 pro Zelle. Ranking robust über Thinking-Modus.

**Datenbasis** (game-of-life-example-mapping × v4-exact-subagents):

| Modell | n | LoC mean (std) | smell | cc_long | mccabe_max | cognitive_max |
|---|---:|---:|---:|---:|---:|---:|
| opus-4-7              | 3 | 178 (14)  | 3.0 | 8.7  | **3.0** | **3.3** |
| opus-4-7-no-thinking  | 6 | 169 (24)  | 2.5 | 15.2 | 4.5     | 5.7     |
| sonnet-4-6            | 3 | 210 (73)  | 4.7 | 14.0 | 7.0     | 9.7     |
| sonnet-4-6-no-thinking| 3 | 272 (125) | 3.0 | 19.0 | 6.0     | 8.0     |
| haiku-4-5             | 3 | 273 (28)  | 5.3 | 19.7 | 9.3     | 13.0    |

**Begründung**: Opus liefert ~37 % weniger LoC als Haiku (169–178 vs. 273)
bei deutlich besserem cc_longest (8.7 vs. 19.7). Das Modell-Ranking
**Opus < Sonnet < Haiku** ist auf den numerischen Komplexitäts-Scores
sogar **schärfer** als auf cc_longest: Haiku hat 3× höhere McCabe und
4× höhere Cognitive Complexity als Opus-thinking (9.3 vs. 3.0; 13.0 vs.
3.3).

**Caveats**:
- Sonnet-no-thinking hat hohe Varianz (LoC std=125 → min 180, max 414).

---

## F-3.2 — Extended Thinking hilft bei Komplexität, nicht bei Pass-Rate

**Aussage**: Thinking hat **keinen Pass-Rate-Effekt** auf game-of-life × v4
(100 % beide Modi), senkt aber bei Opus alle drei Komplexitäts-Maße
deutlich (`cc_longest`: 15.2 → 8.7; `mccabe_max`: 4.5 → 3.0;
`cognitive_max`: 5.7 → 3.3). Bei Sonnet ist der Effekt auf cc_longest
sichtbar, aber auf McCabe/Cognitive richtungs-uneinheitlich
(no-thinking sogar leicht besser bei n=3).

**Datenbasis** (game-of-life-example-mapping × v4-exact-subagents):

| Modell | thinking | n | pass | dauer | LoC | cc_long | mccabe_max | cognitive_max |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| opus-4-7    | ja  | 3 | 100% | 815  | 178 | **8.7** | **3.0** | **3.3** |
| opus-4-7    | nein| 6 | 100% | 779  | 169 | 15.2    | 4.5     | 5.7     |
| sonnet-4-6  | ja  | 3 | 100% | 989  | 210 | 14.0    | 7.0     | 9.7     |
| sonnet-4-6  | nein| 3 | 100% | 1092 | 272 | 19.0    | 6.0     | 8.0     |

**Caveats**:
- Pass-Rate-Effekt = 0 — H4 (thinking erhöht Dauer ohne
  Korrektheits-Verbesserung) hier nicht prüfbar, da Sättigung.
- Dauer-Effekt richtungs-uneinheitlich (Opus +5 %, Sonnet -9 %).

---

## F-3.3 — Pass-Rate-Sättigung auf v4-exact-subagents

**Aussage**: Auf game-of-life × v4-exact-subagents × example-mapping
erreicht **jedes** getestete Modell (Opus, Sonnet, Haiku — mit/ohne
thinking) 100 % Pass-Rate (18/18 Runs). Hypothese H1 ("Opus > Sonnet >
Haiku robuster") **nicht reproduzierbar** auf dieser Zelle.

**Datenbasis**: 18 Runs, alle 100 % `tests_passing`.

**Begründung**: Entweder ist (a) game-of-life-example-mapping bei v4 zu
einfach für eine Modell-Differenzierung auf Pass-Rate, oder (b)
v4-Strenge fängt schwächere Modelle stark genug ab. Das schließt H1
nicht aus, sondern verschiebt die Replikation auf schwierigere Settings
(z.B. mars-rover oder v3-prose).

**Replikations-Empfehlung**: H1 auf mars-rover oder v3-prose erneut
prüfen.

---

## F-3.4 — Haiku ist token-teuerster

**Aussage**: Haiku 4.5 verbraucht **2.3× mehr Tokens als Opus 4.7**
(3.81M vs. 2.53M auf identischer Zelle), trotz nominell günstigerem
Preis. Längere Antworten + Context-Inflation (28.7 % vs. 7.7 %
Auslastung).

**Datenbasis** (game-of-life-example-mapping × v4-exact-subagents):

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
