---
id: RQ-pep-emoji-v6.1
question: "Sind die Effekte der pep- und emoji-Reduktionen auf v6.1-Basis additiv (zwei unabhaengige Kanaele) oder gemeinsam getragen (ein 'Prompt-Drumherum'-Mechanismus)?"
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}  # pep + emoji  (baseline)
    - {workflow: v6.1-no-pep,                    prompt: example-mapping}  # no-pep + emoji
    - {workflow: v6.1-no-emoji,                  prompt: example-mapping}  # pep + no-emoji
    - {workflow: v6.1-no-pep-no-emoji,           prompt: example-mapping}  # neither
controls:
  model:
    any:
      - opus-4-7-portkey-no-thinking  # canonical fuer neue Fill-Runs (portkey, sharded)
      - opus-4-7-no-thinking          # akzeptiert fuer wiederverwendete Baseline-Runs (direct API)
  kata_base: game-of-life
outcomes:
  # primaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD-Disziplin (Interaktion zwischen pep & emoji erwartet)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Kosten
  - duration_seconds
  - total_tokens
  # Korrektheit (Sanity)
  - tests_passing
  - verification_pct
  - completed_within_budget
min_replicates: 5
status: aktiv
---

# RQ-pep-emoji-v6.1: Pep + Emoji kombiniert (2×2-Interaktionstest)

Wirken die pep-Reduktion ([RQ-pep-v6.1](../1.1-pep-effect-v6.1/README.md)) und die emoji-Reduktion ([RQ-emoji-v6.1](../1.2-emoji-effect-v6.1/README.md)) auf v6.1-Basis ueber **zwei unabhaengige Kanaele** (additiver Effekt) oder ueber einen **gemeinsamen Mechanismus** (z.B. "weniger Prompt-Drumherum laesst das Modell strenger dem Prozess folgen" — dann subadditiv oder sogar gleichbleibend)?

## Motivation

Beide Einzel-Reduktionen zeigten dasselbe Disziplin-Muster auf v6.1-Basis (mehr `refactorings_applied`, weniger `tests_passed_immediately`) ohne Korrektheits- oder Code-Qualitaets-Schaden:

| Effekt | RQ-pep-v6.1 (F-1.1) | RQ-emoji-v6.1 (F-1.1) |
|---|---|---|
| `refactorings_applied` | +67 % (4.2 → 7.0) | +29 % (4.2 → 5.4) |
| `tests_passed_immediately` | −75 % (4.8 → 1.2) | −54 % (4.8 → 2.2) |
| Code-Qualitaet | indistinguishable | indistinguishable |
| Korrektheit | 100 % / 100 % | 100 % / 100 % |

Zwei Erklaerungen sind kompatibel mit diesen Einzeldaten:

- **Hypothese A (additiv)**: pep und emoji adressieren unterschiedliche Modell-Verhalten. Kombination sollte beide Effekte aufsummieren — z.B. `refactorings_applied` Richtung +67 % + 29 % = ~+96 % (≈ 4.2 → 8.2), `tests_passed_immediately` ~ Multiplikation der Reduktions-Faktoren (0.25 × 0.46 ≈ 0.12, also 4.2 → ≈ 0.6).
- **Hypothese B (gemeinsamer Mechanismus)**: beide entfernen "Reassurance/Decoration-Schicht". Der Kanal saettigt — Kombination wirkt nicht staerker als der staerkere Einzel-Eingriff (also ≈ no-pep allein).

Die naheliegende Konsequenz fuer den Reduktions-Recipe ([v6-reduction-recipe.md](../v6-reduction-recipe.md)) ist unterschiedlich: bei (A) lohnt sich die Kombination als naechster Schritt, bei (B) sind weitere Reduktionen redundant zur staerkeren Einzelreduktion und der Reduktionsweg muss anderswo gesucht werden.

## Workflow-Definition

- **v6.1-hybrid-testlist-scope-fix** (pep + emoji): Baseline, 5 Runs wiederverwendet aus RQ-pep-v6.1 / RQ-emoji-v6.1.
- **v6.1-no-pep** (no-pep + emoji): 5 Runs wiederverwendet aus RQ-pep-v6.1.
- **v6.1-no-emoji** (pep + no-emoji): 5 Runs wiederverwendet aus RQ-emoji-v6.1.
- **v6.1-no-pep-no-emoji** (neither, neu, n=5): kombiniert beide Reduktionen.
  - Basis: v6.1-no-pep
  - Aenderung: dieselbe Decoration-Emoji-Strip-Operation wie in v6.1-no-emoji (95 Emojis entfernt: ✅ ❌ 🚨 🔴 🟢 🔄 📋 ⚠️). Predictions `✅ Correct`/`❌ Incorrect` → `- Correct`/`- Incorrect`. ❓ in `test-list.md` als semantische Spec-Referenz behalten.
  - Verifikation: MARKERS-Compliance (`Red Phase Complete:` + zwei Prediction-Lines pro Cycle + Verbatim-Klausel) intakt. Diff zu v6.1-no-pep = 253 Zeilen (reine Emoji-Strip, vergleichbar mit v6.1-hybrid → v6.1-no-emoji = 253 Zeilen).

## Hypothesen

- **H1 (additiv)**: `refactorings_applied` in v6.1-no-pep-no-emoji liegt ≥ 7.5 (≥ no-pep-Wert plus ein Drittel des no-emoji-Effekts).
- **H2 (gemeinsamer Mechanismus / saturiert)**: `refactorings_applied` und `tests_passed_immediately` in v6.1-no-pep-no-emoji unterscheiden sich nicht signifikant von v6.1-no-pep allein (Δ < 1σ in beiden Metriken).
- **H3 (Korrektheit invariant)**: alle 4 Workflows bleiben bei 100 % `verification_pct` und 100 % `tests_passing`.
- **H4 (Code-Qualitaet bleibt indistinguishable)**: keine der 5 primaeren Code-Qualitaets-Metriken zeigt > 1σ konsistenten Trend ueber die 4 Workflows.
- **H5 (Token-Kosten)**: v6.1-no-pep-no-emoji verbraucht *mehr* Tokens als v6.1-hybrid (Trend aus RQ-emoji-v6.1 F-1.2: zusaetzliche Refactor-Phasen kosten mehr als die entfernten Decoration-Tokens einsparen). Erwartung: ≈ Mittel zwischen no-pep und no-emoji oder leicht darueber.

**A-priori Erwartung:** Wahrscheinlichste Lesart ist **H2 (saturiert)** — beide Reduktionen entfernen verwandte "Reassurance/Wegweiser"-Schichten, das Modell hat ohnehin schon ein straffes Prozess-Skelett. Aber die Daten muessen pruefen; bei H1-Bestaetigung waeren die Reduktions-Kanaele tatsaechlich orthogonal und der naechste Reduktions-Schritt (z.B. APP-Erklaerungen, Why-Bloecke) waere als unabhaengiger weiterer Hebel zu erwarten.

## Design

```
Faktor:    workflow_x_prompt — 4 Stufen (alle mit example-mapping)
             v6.1-hybrid-testlist-scope-fix   (pep + emoji, baseline)
             v6.1-no-pep                      (no-pep + emoji)
             v6.1-no-emoji                    (pep + no-emoji)
             v6.1-no-pep-no-emoji             (neither, neu)
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    4 (4 Workflows x 1 Kata)
Replikate: n = 5
Runs:      20 total
           — 5 v6.1-hybrid-testlist-scope-fix (reuse RQ-pep-v6.1)
           — 5 v6.1-no-pep                    (reuse RQ-pep-v6.1)
           — 5 v6.1-no-emoji                  (reuse RQ-emoji-v6.1)
           — 5 v6.1-no-pep-no-emoji           (neu)
```

**Wiederverwendung sauber:** alle 3 vorhandenen Zellen sind unter identischen Kontroll-Bedingungen gelaufen (opus-4-7-no-thinking × game-of-life-example-mapping). `aggregate-by-query.py` sammelt automatisch alle matching Runs.

## Caveats

- **Single Kata, single Modell**: identisch zu Schwester-RQs. Eine Generalisierung auf claim-office wuerde zusaetzlich die ❓-Behalten-Entscheidung scharf testen (claim-office nutzt ❓-Spec-Syntax aktiv).
- **n=5 pro Zelle**: bei der Interaktions-Lesart wichtig, weil 1σ-Schwellen sensitiv von der Streuung abhaengen. Bei knappen Ergebnissen evtl. n=10 ueber claim-office oder Sonnet erweitern.
- **Konfounder Refactor-Token-Kosten**: ein etwaiger Token-Anstieg in v6.1-no-pep-no-emoji ist nicht zwingend ein "schlechteres Prompt-Effizienz"-Befund, sondern Folge von zusaetzlichen Refactor-Phasen (siehe RQ-emoji-v6.1 F-1.2 Diskussion).
- **Routing-Asymmetrie (Caveat)**: die 15 wiederverwendeten Baseline-Runs (v6.1-hybrid, v6.1-no-pep, v6.1-no-emoji) sind unter `opus-4-7-no-thinking` (direct API) entstanden. Die 5 neuen v6.1-no-pep-no-emoji-Runs laufen unter `opus-4-7-portkey-no-thinking` (Portkey-Gateway). Die Zellen werden via `controls.model: {any: [...]}` (OR-Match) zusammengefuehrt — siehe Memory `controls-model-or-match.md`. Annahme: das Routing beeinflusst das Outcome nicht. Eine Replikation der no-pep-no-emoji-Zelle auf direct API wuerde die Annahme schaerfer pruefen, ist aber fuer den Interaktions-Vergleich nachrangig.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1-no-pep, v6.1-no-emoji, v6.1-no-pep-no-emoji}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
