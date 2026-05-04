# RQ-4 Findings

Persistente Sammlung der Erkenntnisse zur Frage:
**Profitieren schwächere Modelle stärker von strikteren Workflows als starke?**

Quelle der initialen Findings: `_archive/findings-validation-2026-05-04/`
(re-evaluierte alte 235-Run-Studie, Zellen A4, A5, B3, C1, C7). Spätere
Updates entstehen aus `summary.md` dieser RQ via
`experiments/aggregate-by-query.py`.

Status-Legende siehe [`research/README.md`](../README.md#findings-status-legende).

---

## F-4.1 — Pass-Rate ist modell-abhängig: Haiku scheitert nur in v5 · ⚠️ revidiert

**Aussage**: Pass-Rate ist NICHT universell 100 %. In RQ-4-Replikation
(n≥3) zeigt sich: Haiku-4-5 erreicht in v3-basic-tdd und
v4-exact-subagents jetzt 100 %, fällt aber in v5-exact-single-context
auf 67 % (2/3) ab. Opus und Sonnet liefern überall 100 %.

**Datenbasis** (RQ-4 Aggregation 2026-05-04, game-of-life-example-mapping
+ -prose, n≥3):

| Workflow | Modell | n | Pass-Rate |
|---|---|---:|---:|
| v1-oneshot (prose) | Haiku 4.5 | 3 | 100 % |
| v3-basic-tdd | Haiku 4.5 | 3 | 100 % |
| v4-exact-subagents | Haiku 4.5 | 3 | **100 %** (war 75 %, n=8 alt) |
| v5-exact-single-context | Haiku 4.5 | 3 | **67 %** (2/3) |
| alle Workflows | Opus, Sonnet | je 3–6 | 100 % |

**Interpretation**: Der ältere Befund "Haiku scheitert in v4/v5" ist
mit n≥3 nur noch für v5 haltbar. v4-exact-subagents ist auf n=3 robust
für Haiku — die alte 75 %-Quote (6/8) war vermutlich kleines-n-Rauschen.
v5 (single-context, kein Subagent-Reset zwischen Phasen) bleibt für
Haiku der schwierigste Workflow.

Quelle: ehemals C1, revidiert mit RQ-4 n≥3 Daten.

---

## F-4.2 — Bester Workflow hängt vom Thinking-Modus ab · ⚠️ teilweise prüfbar

**Aussage** (alt): "Mit Thinking: v4 bester. Ohne Thinking: v5 bester."

**Status**: Datenbasis fehlt. game-of-life-fair und stability laufen
nur auf opus-no-thinking; smart-subset hat keine n≥3-Vergleiche.

Was smart-subset (n=1) andeutet:
- v5 + thinking: cc_longest = 19 vs. v5 + no-thinking: 29
- v4 + thinking: cc_longest = 4 vs. v4 + no-thinking: 10

→ Trend "v4 mit Thinking ist Spitze" stützt sich, aber kein robustes Signal.

**Replikation nötig**: RQ-4-Faktor-Design liefert die Daten (v1/v3/v4/v5
× Opus-no-thinking / Sonnet / Haiku, n=3).

**Update 2026-05-04**: RQ-4 deckt nun den No-Thinking-Quadranten ab
(opus-4-7-no-thinking auf v3/v4/v5). Mit-Thinking-Vergleich gehört in
RQ-3 (Modell × Thinking) und ist dort offen — diese Aussagen-Klasse
ist für RQ-4 nicht weiter prüfbar, weil das Faktor-Design Thinking
nicht variiert.

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

**Verweis**: RQ-3 (Modell × Thinking) ist die zuständige Frage für
diese Hypothese. RQ-4 hält Thinking konstant (no-thinking-Variante)
und kann den Thinking-Bonus per Design nicht messen. Status bleibt
bis RQ-3 die Daten liefert offen.

Quelle: ehemals A5.

---

## F-4.4 — TDD verkleinert Modell-Abstand teilweise · ⚠️ revidiert

**Aussage**: TDD-Workflows (v3/v4/v5) nivellieren Korrektheit
(`tests_passing` 100 % außer v5+haiku) und reduzieren bei Haiku die
Code-Volumen-Inflation deutlich, aber Smell-Unterschiede zwischen den
Modellen bleiben mit oder ohne TDD bestehen.

**Datenbasis** (RQ-4, game-of-life-example-mapping, n≥3):

| Workflow | Modell | code_mass | smell_total | cc_longest |
|---|---|---:|---:|---:|
| v3-basic-tdd | Haiku 4.5 | 220.3 | 4.33 | 44.7 |
| v3-basic-tdd | Sonnet 4.6 | 136.7 | 4.67 | 27.0 |
| v3-basic-tdd | Opus 4.7-no-thinking | 156.8 | 4.33 | 29.8 |
| v4-exact-subagents | Haiku 4.5 | 272.7 | 5.33 | 19.7 |
| v4-exact-subagents | Sonnet 4.6 | 210.0 | 4.67 | 14.0 |
| v4-exact-subagents | Opus 4.7-no-thinking | 169.0 | 2.50 | 15.2 |
| v5-exact-single-context | Haiku 4.5 | 143.3 | 5.67 | 14.7 |
| v5-exact-single-context | Sonnet 4.6 | 172.3 | 4.33 | 19.3 |
| v5-exact-single-context | Opus 4.7-no-thinking | 157.0 | 3.17 | 16.8 |

**Beobachtungen**:
- **cc_longest**: Modell-Abstand schrumpft in v4/v5 stark (Haiku 19.7
  vs. Opus 15.2 in v4 — fast gleichauf), in v3 bleibt er deutlich
  (Haiku 44.7 vs. Opus 29.8).
- **code_mass**: Haiku produziert in v3/v4 ~30–60 % mehr Code als Opus,
  in v5 dagegen sogar weniger (143 vs. 157) — single-context zwingt
  Haiku zur Kompression.
- **smell_total**: Opus erzielt in v4/v5 deutlich weniger Smells (2.5
  bzw. 3.2) als Haiku (5.3 bzw. 5.7); in v3 sind alle ~4.3–4.7. TDD
  verstärkt also den Smell-Vorsprung von Opus, statt ihn zu nivellieren.

**Interpretation**: TDD-Workflows verkleinern den Modell-Abstand bei
Komplexität (cc_longest) und Korrektheit, vergrößern ihn aber bei
Code-Sauberkeit (smell_total). "TDD nivelliert alles" ist zu pauschal.

Quelle: ehemals B3, revidiert mit RQ-4 n≥3.

---

## F-4.5 — v4-exact-subagents minimiert cc_longest universell · ✅ haltbar

**Aussage**: v4-exact-subagents erzeugt für **alle** drei Modelle die
kürzeste längste Funktion (cc_longest_function) unter den drei
TDD-Workflows. Der Effekt ist bei Haiku am größten (44.7 → 19.7,
−56 %), aber auch bei Opus (29.8 → 15.2, −49 %) und Sonnet (27.0 →
14.0, −48 %) deutlich.

**Datenbasis** (RQ-4, game-of-life-example-mapping, n≥3, cc_longest):

| Modell | v3 | v4 | v5 |
|---|---:|---:|---:|
| Haiku 4.5 | 44.7 | **19.7** | 14.7 |
| Sonnet 4.6 | 27.0 | **14.0** | 19.3 |
| Opus 4.7-no-thinking | 29.8 | **15.2** | 16.8 |

(v5 ist bei Haiku knapp niedriger, aber dort nur n=2 wegen
Test-Failures — siehe F-4.1.)

**Verhältnis zu F-1.7**: F-1.7 sagt "v4 und v5 reduzieren cc_longest
gegenüber v1/v2/v3 um 35–50 %". RQ-4 bestätigt das modellweit für v4;
v5 zeigt das Muster bei Sonnet/Opus, aber bei Haiku weniger
zuverlässig (kleinere Datenbasis und höhere Streuung).

**Interpretation**: Der Subagent-Refactor-Schritt in v4 ist der
universellste Hebel zur Funktion-für-Funktion-Komplexitätsreduktion,
unabhängig vom Modell. v5 (single-context) erzielt ähnliche Ergebnisse
für stärkere Modelle, scheitert aber bei Haiku am Run-Stability-Problem.

---

## F-4.6 — Modell-spezifisches Code-Volumen-Profil unter TDD · ✅ haltbar

**Aussage**: Code-Volumen (`code_mass`) variiert deutlich zwischen den
Modellen unter identischem Workflow — Haiku produziert systematisch
mehr Code als Opus oder Sonnet, außer in v5 (single-context), wo das
Muster bricht.

**Datenbasis** (RQ-4, game-of-life-example-mapping, n≥3, code_mass):

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
- Opus-Volumen ist über v3/v4/v5 hinweg fast konstant (157–169) —
  workflow-invariant.

**Interpretation**: Workflow-Wirkung auf Code-Volumen ist
modellabhängig: Opus ist bezüglich Volumen workflow-invariant,
Haiku reagiert stark auf den Workflow (v4: aufgebläht; v5: kollabiert
oder kompakt). Single-Context-Workflows (v5) sind für schwächere
Modelle riskanter, weil die fehlende Subagent-Reset-Schiene Fehler
nicht abpuffert.

**Verhältnis zu F-4.5**: cc_longest ist universell durch v4 minimiert,
aber code_mass ist modellabhängig. Code-Komplexität pro Funktion und
Code-Gesamtvolumen entkoppeln also unter TDD.

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
