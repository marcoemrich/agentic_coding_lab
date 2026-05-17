# Workflow-Übersicht

Schnell-Überblick über alle Workflow-Varianten unter
`experiments/workflows/`: was sie testen, was sich bewährt hat, was
verworfen wurde. Stand: 2026-05-17.

Schwester-Doku zu `workflow-construction.md` (Methodik) und
`experiments/workflows/MARKERS.md` (Parser-Anforderungen). Stand: 2026-05-17.

## Generationen — was sie testen

### v1–v3: Baseline-Achse (Setup-Komplexität)

| Variante | Mechanik |
|---|---|
| `v1-oneshot` | keine TDD-Struktur, Single-Shot |
| `v2-iterative` | iterativ ohne explizite Phasen |
| `v3-basic-tdd` | inline TDD, kein Skill/Subagent |

### v4 vs v5: Architektur-Achse (Isolation vs Single-Context) — RQ-6, RQ-7

| Variante | Mechanik | Trade-off |
|---|---|---|
| `v4-exact-subagents` | red/green/refactor als Task-Subagents, fresh context | maximale Isolation, höchste Tokens |
| `v5-exact-single-context` | alles in einem Context | niedrigste Tokens, Disziplin-Kollaps bei langen Aufgaben |
| `v4.1-minimized`, `v4.2-conservative`, `v4.3-targeted`, `v5.1-minimized` | Minimierungs-/Targeting-Experimente innerhalb der Generation | — |

### v6: Hybrid + Reduktions-Achse — RQ-7 bis RQ-13

| Variante | Cut gegenüber v6-hybrid | RQ | Befund |
|---|---|---|---|
| `v6-hybrid` | Baseline; nur Refactor als Subagent | RQ-7 | Pareto-Optimum: beste Smell-Reduktion + perfekte verification_pct |
| `v6.1-no-app` | APP-Heuristik raus | RQ-8 | kein Effekt |
| `v6.2-no-rules` | Four Rules of Simple Design raus | RQ-9 | kein Effekt |
| `v6.3-no-pep` | Pep-Talks raus | RQ-10 | kein Effekt |
| `v6.4-no-emoji` | 🔴🟢🔄 raus | RQ-11, RQ-12 | kein Effekt |
| `v6.5-lean` | alle vier Cuts gebündelt + skill-creator-Why-Rewrites | RQ-13 | Bundle trägt, Komponenten nicht isolierbar |
| `v6.6-leaner` | weitere skill-creator-Empfehlungen (DO/DON'T-Listen raus, Test-List-Empfehlung "3-6 tests") | RQ-13 | DO/DON'T-Hypothese teilweise widerlegt: Pred-Rate −2.5 pp; Test-List-Hint senkt cycle_count −27 % |

### v6.5er Detail-Audits — RQ-14 bis RQ-17

Drei Bullet-Blöcke aus `claude_orchestration`-Audit Finding 10:
**10a** = `refactor.md` "Remember"-End-Section, **10b** = `refactor.md`
mid-file DO/DON'T, **10c** = `red/SKILL.md` mid-file DO/DON'T.

| Variante | Cuts (10a/10b/10c) | RQ | Befund |
|---|:---:|---|---|
| `v6.5.1-orchestration-audited` | ✓ / ✓ / ✓ | RQ-14 | Determinismus ↑ (σ refactorings ⅙), Tokens +15 % vs v6.5-lean |
| `v6.5.2-bullets-cut` | ✗ / ✗ / ✗ | RQ-15 | cognitive_max −29 %, Tokens −15 %, σ refactorings ×3 (Trade-off) |
| `v6.5.3-targeted-cuts` | ✓ / ✗ / ✗ | RQ-16 | Quality-Champion: cognitive_max 3.5, aber Pred-Rate 95.8 % |
| `v6.5.4-refactor-cut-only` | ✓ / ✗ / ✓ | RQ-17 | **Default-Champion**: 100 % Pred-Rate, dominiert v6.5.1 in 7/8 Outcomes |

Lehre aus den vier Varianten: **Position + Phasen-Mechanik entscheiden**.
10a ist Floor-Anker (NICHT cutten), 10b ist dekorativ und kontraproduktiv
für Komplexität (cutten), 10c ist Pred-Hygiene-Anker (NICHT cutten).

### v7: weitere Isolation — RQ-7

| Variante | Mechanik | Befund |
|---|---|---|
| `v7-hybrid-green-refactor` | green *und* refactor isoliert | Pareto-dominiert von v6: spart Tokens, verliert Qualität *und* Korrektheit |

## Skill-Creator-Beiträge

Aus `~/.claude/skills/skill-creator/SKILL.md` stammen mehrere
inhaltliche Patterns, die ab v6.5 systematisch eingearbeitet wurden:

- **Theory of Mind statt MUSTs** — Why-Block (kurzer Begründungssatz)
  ersetzt MUST/ALWAYS/NEVER-Listen. Beispiel `red.md` Step 7: statt
  "PREDICTIONS MUST be verbatim" jetzt eine Marker-Compliance-
  Begründung. Eingeflossen in `tdd.md`, `red.md`, `green.md`.
- **Reduktion vor Addition** — Default-Hypothese: Workflow-Files
  enthalten zu viel. Triebkraft der RQ-8 bis RQ-11 (Einzel-Cuts) und
  RQ-13 (Bundle).
- **DO/DON'T-Listen-Kritik** — Hypothese aus skill-creator-Review:
  Duplikat-Listen sind kosmetisch. In v6.6 (RQ-13) und v6.5.2–v6.5.4
  (RQ-15/16/17) differenziert getestet: pauschal cutten ist falsch.
  `red/SKILL.md`-DO/DON'T trägt 4 pp Pred-Rate (RQ-17); `refactor.md`
  DO/DON'T ist dekorativ und sogar kontraproduktiv für Komplexität.
  Pro Block testen, nicht pauschal.
- **Test-List-Empfehlung** — skill-creator-Hint "3-6 tests" in v6.6
  hat messbaren Scope-Effekt (cycle_count −27 %).
- **"Why skills required"-Block** — neuer Einleitungsblock in `tdd.md`
  mit Marker-Compliance-Begründung statt prozeduraler Pflicht-Liste.

Quelle: `workflow-construction.md` §1 "Theory of Mind statt MUSTs",
RQ-13-Findings F-13.2 und F-13.6.

## Verworfen / nicht weiterverfolgt

- **Mehr Isolation = besser** (v7) — widerlegt, red→green braucht Test-Listen-Kohärenz.
- **Pep talks** — dekorativ, kein Effekt.
- **Emojis / Status-Marker** — dekorativ, kein Effekt.
- **Project-Standards im Workflow** (TypeScript Best Practices, Hexagonal Architecture) — irrelevant für Mini-Katas.
- **Four Rules of Simple Design im Refactor-Subagent** — RQ-9: kein messbarer Effekt unter Portkey-Routing.
- **APP-Heuristik isoliert** — kein Effekt; aber Vorher/Nachher-Berechnung im Refactor bleibt tragend als Disziplin-Anker.
- **Numerische Schwellwerte in Prompts** (`cognitive_max < 15` etc.) — explizit verboten, Katas zu volatil.

## Tragende Inhalte (nie streichen)

- 4 Marker aus `MARKERS.md` (Skill-Calls, "Red Phase Complete", Prediction-Lines, `experiment-done.txt`).
- Predictions-verbatim-Block in `red.md`.
- "Mandatory refactoring attempt" in `refactor.md`.
- APP-Vorher/Nachher-Berechnung im Refactor als Disziplin-Zwang.
- `refactor.md` "Remember"-End-Section (10a) — Floor-Anker für
  `tests_passed_immediately` und `refactorings_applied`-Floor (RQ-16).
- `red/SKILL.md` mid-file DO/DON'T (10c) — Pred-Hygiene-Anker; ohne
  ihn fällt Pred-Rate um ~4 pp (RQ-17 F-17.1).

## Aktuelle Front

`v6.5.4-refactor-cut-only` (RQ-17) ist neuer Default-Champion: 100 %
Pred-Rate, dominiert v6.5.1 in 7 von 8 Outcomes mit σ-Reduktion quer
durch. v6.5.3 bleibt Spezialist für maximale Komplexitäts-Reduktion
(Pareto-incompatible mit perfekter Pred-Rate, siehe RQ-17 F-17.3).

## Quellen

- `research/workflow-design/workflow-construction.md` — Methodik & Design-Leitprinzipien
- `research/RQ-*/findings.md` — Einzel-RQ-Befunde
- `experiments/workflows/MARKERS.md` — Parser-Marker
