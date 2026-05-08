# RQ-4 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Profitieren schwächere Modelle stärker von strikteren Workflows als starke?**

Findings entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

---

## F-4.5 — v4-exact-subagents minimiert cc_longest universell

**Aussage**: v4-exact-subagents erzeugt für **alle** drei Modelle die
kürzeste längste Funktion (cc_longest_function) unter den drei
TDD-Workflows. Der Effekt ist bei Haiku am größten (44.7 → 19.7,
−56 %), aber auch bei Opus (29.8 → 15.2, −49 %) und Sonnet (27.0 →
14.0, −48 %) deutlich.

**Datenbasis** (game-of-life-example-mapping, n≥3, cc_longest):

| Modell | v3 | v4 | v5 |
|---|---:|---:|---:|
| Haiku 4.5 | 44.7 | **19.7** | 14.7 |
| Sonnet 4.6 | 27.0 | **14.0** | 19.3 |
| Opus 4.7-no-thinking | 29.8 | **15.2** | 16.8 |

(v5 ist bei Haiku knapp niedriger, aber dort nur n=2 wegen
Test-Failures.)

**Interpretation**: Der Subagent-Refactor-Schritt in v4 ist der
universellste Hebel zur Funktion-für-Funktion-Komplexitätsreduktion,
unabhängig vom Modell. v5 (single-context) erzielt ähnliche Ergebnisse
für stärkere Modelle, scheitert aber bei Haiku am Run-Stability-Problem.

---

## F-4.6 — Modell-spezifisches Code-Mass-Profil (APP) unter TDD

**Aussage**: Code-Mass im Sinne der Absolute Priority Premise
(`code_mass` = `lines_of_code` + `test_lines`) variiert deutlich zwischen den
Modellen unter identischem Workflow — Haiku produziert systematisch
mehr Code als Opus oder Sonnet, außer in v5 (single-context), wo das
Muster bricht.

**Datenbasis** (game-of-life-example-mapping, n≥3, code_mass):

| Modell | v3 | v4 | v5 |
|---|---:|---:|---:|
| Haiku 4.5 | 220.3 | 272.7 | 143.3 |
| Sonnet 4.6 | 136.7 | 210.0 | 172.3 |
| Opus 4.7-no-thinking | 156.8 | 169.0 | 157.0 |

**Beobachtungen**:
- v3/v4: Haiku schreibt 30–60 % mehr LoC+Tests als Opus.
- v5: Haiku schreibt **weniger** als Opus/Sonnet (143 vs. 157/172),
  aber bei kleinerer Datenbasis (n=2 Pass) und höchster Streuung
  (std=133, weil ein Run code_mass=0 ergab — Haiku gab in v5 teilweise
  auf statt zu komprimieren).
- Opus-`code_mass` ist über v3/v4/v5 hinweg fast konstant (157–169) —
  workflow-invariant.

**Interpretation**: Workflow-Wirkung auf Code-Mass (APP) ist
modellabhängig: Opus ist bezüglich Code-Mass workflow-invariant,
Haiku reagiert stark auf den Workflow (v4: aufgebläht; v5: kollabiert
oder kompakt). Single-Context-Workflows (v5) sind für schwächere
Modelle riskanter, weil die fehlende Subagent-Reset-Schiene Fehler
nicht abpuffert.

**Verhältnis zu F-4.5**: cc_longest ist universell durch v4 minimiert,
aber `code_mass` (APP) ist modellabhängig. Code-Komplexität pro Funktion
und Code-Mass entkoppeln also unter TDD.
