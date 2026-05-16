---
id: RQ-7
question: "Liefert ein Hybrid-Workflow (v6: red/green im Single-Context, refactor im isolierten Subagent) ein besseres Tradeoff aus Code-Qualitaet, Wallclock-Dauer und Tokenverbrauch als die Reinformen v4 (alles Subagents) und v5 (alles Single-Context)?"
factors:
  workflow: [v4-exact-subagents, v5-exact-single-context, v6-hybrid]
  kata_base: [game-of-life, claim-office]
controls:
  model: opus-4-7-no-thinking
  prompt: example-mapping
outcomes:
  # primaer: Tradeoff-Dimensionen
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  - duration_seconds
  - total_tokens
  # sekundaer: Korrektheit (innen + aussen + Test-Staerke)
  - tests_passing
  - verification_pct
  - completed_within_budget
  - mutation_score
  # TDD-Disziplin (alle drei sind echte TDD-Workflows)
  - cycle_count
  - refactorings_applied
  - tests_passed_immediately
min_replicates: 5
status: aktiv
---

# RQ-7: Workflow-Tradeoff — Hybrid v6 vs v4 vs v5

Lohnt sich ein **Hybrid-Workflow**, der die jeweils plausibel staerkere Eigenschaft aus v4 und v5 kombiniert?

## Motivation

RQ-6 hat den Faktor *isolierter vs geteilter Kontext* in der Reinform variiert (v4 alles Subagents, v5 alles Single-Context). Die plausible Dritte-Hypothese fehlt: dass nicht *alle* TDD-Phasen gleich stark von einem isolierten Kontext profitieren.

**Konkret:**
- **Red und Green** profitieren vom *geteilten* Kontext, weil sie eng aufeinander aufbauen (Red liefert Predictions und Fehlermeldung; Green muss minimal genau diesen Fehler beseitigen). Phasen-Isolation kostet hier Re-Establishment-Tokens und kann zu Inkohärenzen fuehren.
- **Refactor** profitiert vom *isolierten* Kontext, weil ein frischer Refactor-Subagent das Implementierungs-Bias der Green-Phase nicht hat. Im geteilten Kontext (v5) klebt das Refactor-Modell tendenziell am eigenen Just-Written-Code und nimmt strukturelle Verbesserungen seltener wahr.

**v6-hybrid setzt genau das um:**

| Phase | v4 | v5 | **v6** |
|---|---|---|---|
| test-list | Subagent | Skill (Single-Ctx) | **Skill (Single-Ctx)** |
| red | Subagent | Skill (Single-Ctx) | **Skill (Single-Ctx)** |
| green | Subagent | Skill (Single-Ctx) | **Skill (Single-Ctx)** |
| refactor | Subagent | Skill (Single-Ctx) | **Subagent (isoliert)** |

Wenn die Hybrid-These stimmt, liegt v6 in Code-Qualitaet **nahe an v4** (weil Refactor frischen Kontext bekommt) und in Wallclock/Tokens **naeher an v5** (weil 3 von 4 Phasen ohne Spawn-Overhead laufen). Das waere ein strikt besseres Tradeoff als v4.

## Design

```
Faktor:    workflow   — 3 Stufen (v4-exact-subagents, v5-exact-single-context, v6-hybrid)
Faktor:    kata_base  — 2 Stufen (game-of-life, claim-office)
Kontrolle: model      — opus-4-7-no-thinking
Kontrolle: prompt     — example-mapping

Zellen:    6 (3 Workflows x 2 Katas)
Replikate: n = 5 (pragmatisch; später auf n=10 erweiterbar — additive RQ)
Runs:      30 total
           — v4/v5-Zellen werden aus dem Pool wiederverwendet (RQ-6 hat n=10 dort)
           — v6 benötigt 10 neue Runs (5 game-of-life + 5 claim-office)
```

## Hypothesen

- **H1 (Code-Qualitaet, Hybrid-These)**: Auf den primaeren Code-Qualitaets-Metriken (`smell_total`, `cognitive_max`, `cc_longest_function`, `code_mass`) liegt v6 **naeher an v4 als an v5**. Operationalisierung: pro Metrik liegt der v6-Median im Intervall [v4-Median, v4-Median + 0.3 × (v5-Median − v4-Median)] (also auf der unteren 30 %-Strecke des v4→v5-Spreads, wobei niedriger = besser).
  Plausible Mechanik: der isolierte Refactor-Subagent traegt den groessten Teil des v4-Vorteils aus RQ-6 F-6.x; Red/Green-Isolation hat einen kleineren oder vernachlaessigbaren Code-Qualitaets-Effekt.
- **H2 (Wallclock, Hybrid-These)**: v6 liegt in `duration_seconds` **naeher an v5 als an v4**. Operationalisierung: v6-Median im Intervall [v5-Median, v5-Median + 0.4 × (v4-Median − v5-Median)].
  Plausible Mechanik: nur Refactor zahlt Subagent-Spawn-Latenz; Test-Liste/Red/Green sparen sich pro Zyklus die Spawn-Kosten.
- **H3 (Tokens, Tradeoff)**: `total_tokens` von v6 liegt zwischen v4 und v5 (Richtung offen). Falls H3-Richtung v6 ≈ v5 (beide niedriger als v4), bestaetigt das die Annahme aus RQ-6, dass Subagent-Re-Establishment der dominierende Token-Kostenfaktor ist.
- **H4 (besseres Tradeoff)**: Auf einer 2D-Plot-Darstellung *Wallclock vs Smell-Summe* (oder *Tokens vs Smell-Summe*) **dominiert v6 nicht-trivial v4**: gleiche oder bessere Code-Qualitaet bei strikt geringerer Dauer/Tokens. Operationalisierung: median(v6.smell_total) ≤ median(v4.smell_total) UND median(v6.duration_seconds) < median(v4.duration_seconds) UND median(v6.total_tokens) < median(v4.total_tokens).
- **H5 (Korrektheit)**: Alle drei Workflows erreichen `tests_passing = 100 %` und `verification_pct = 100 %` (auf claim-office). Korrektheit ist nicht der Engpass.
- **H6 (Cross-Kata-Replikation)**: H1, H2 und H4 replizieren auf `claim-office` mit gleicher Effektrichtung. Falsifikation H6: auf claim-office kippt das Hybrid-Muster — der Tradeoff-Vorteil waere kata-spezifisch.

**Falsifikation H1**: v6 ist auf Qualitaets-Metriken naeher an v5 (oder schlechter). Konsequenz: der isolierte Refactor-Subagent allein reicht nicht — entweder profitieren auch Red/Green von Isolation, oder der Effekt aus RQ-6 ist anders zu erklaeren.

**Falsifikation H2**: v6 ist in Wallclock naeher an v4. Konsequenz: der Subagent-Spawn-Overhead ist nicht primaer durch Anzahl der Spawns getrieben — moeglicherweise dominiert ein anderer Mechanismus (z. B. Kontext-Re-Read).

**Falsifikation H4**: v6 dominiert v4 nicht (gleiche oder schlechtere Qualitaet bei vergleichbarer Dauer). Konsequenz: das Hybrid-Konzept liefert keinen Tradeoff-Gewinn — Workflow-Empfehlungen muessen weiter zwischen v4 (Qualitaet) und v5 (Geschwindigkeit) abwaegen.

## Caveats

- **(a) Single model**: Nur `opus-4-7-no-thinking`. Auf schwaecheren Modellen koennte sich das Hybrid-Muster anders auspraegen (Red/Green-Isolation evtl. wichtiger, weil mehr Drift).
- **(b) Per-Phase-Tokens fuer red/green/test-list bei v6**: Der Parser merged jetzt skill_phases (red/green/test-list) und subagent_phases (refactor) chronologisch — Disziplin-Metriken (`tdd_cycles`, `refactorings`, `tests_immediately_passing`, per-phase Tokens) sind wieder vollstaendig. Erstmals validiert mit dem v6-smoke-Run.
- **(c) v4/v5-Zellen aus dem Pool**: Wenn der Pool fuer eine v4/v5-Zelle bereits >5 Replikate hat, nutzt der Selektor weiterhin alle. RQ-7-Aussagen ueber v4/v5 stuetzen sich also auf die volle Pool-Stichprobe (typ. n=10 aus RQ-6); v6-Aussagen auf n=5 (additiv erweiterbar).
- **(d) Marker-Compliance v6**: v6 satisfies markers anders als v4/v5 — `cycle_count` faellt auf `skill_invocations["red"]` zurueck, `refactorings_applied` kommt aus subagent_phases, `tests_immediately_passing` aus dem gemergten phases-Stream. Smoke-Run dient als Grundvalidierung.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v4-exact-subagents, v5-exact-single-context, v6-hybrid}`,
`kata ∈ {game-of-life-example-mapping, claim-office-example-mapping}`,
`model = opus-4-7-no-thinking`.
