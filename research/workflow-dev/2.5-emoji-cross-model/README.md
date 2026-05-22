---
id: RQ-emoji-cross-model
question: "Replizieren die RQ-emoji-Befunde (Emojis ohne Code-Qualitaets-Effekt, Tokens -5%) auch auf sonnet-4-6 und opus-4-6, oder ist der Effekt opus-4-7-spezifisch?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,     prompt: example-mapping}
    - {workflow: v6.4-no-emoji, prompt: example-mapping}
  model:
    - opus-4-7-no-thinking
    - sonnet-4-6-no-thinking
    - opus-4-6-portkey-no-thinking
controls:
  kata_base: game-of-life
outcomes:
  # primaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD-Disziplin
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

# RQ-emoji-cross-model: Emoji-Effekt cross-model — replizieren die RQ-emoji-Befunde auf Sonnet und Opus-4-6?

Halten die RQ-emoji-Befunde (Emojis ohne Code-Qualitaets-Mittel-Effekt, Tokens −5 %, schwache Disziplin-Drift) auch fuer `sonnet-4-6-no-thinking` und `opus-4-6-portkey-no-thinking`, oder sind sie opus-4-7-spezifisch?

## Motivation

RQ-emoji hat fuer `opus-4-7-no-thinking` n=10 gezeigt: Emojis tragen nicht zur Code-Qualitaet bei, sparen aber 5 % Tokens und 7 % Wallclock. Mit gewissen Vorbehalten (Streuung leicht groesser, Refactor-Quote −17 %, Over-Implementation +21 %).

Vor einer breiten Workflow-Promotion (z. B. v6.4 als Default-Hybrid oder als Bestandteil eines v6.5-Bundles) braucht der Befund eine **Cross-Modell-Validierung**. Schwaechere Modelle (Sonnet, Opus 4.6) koennten anders auf den Wegfall der visuellen Disziplin-Anker reagieren:

- Sie koennten die Emojis als wichtigere Struktur-Marker brauchen — dann waere v6.4 dort schlechter (Code-Qualitaet schlechter, Refactor-Drift staerker).
- Sie koennten den Wegfall ohne Effekt verkraften — dann waere der Befund modell-uebergreifend stabil.

## Workflow-Definition

Identisch zu RQ-emoji:
- **v6-hybrid**: vollstaendige Emoji-Dekoration in allen 5 Workflow-Files (~85 Emojis)
- **v6.4-no-emoji**: alle Emojis entfernt, Prediction-Templates auf "- Correct"/"- Incorrect" (parser-kompatibel)

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6-hybrid, v6.4-no-emoji), beide mit example-mapping
Faktor:    model            — 3 Stufen (opus-4-7-no-thinking, sonnet-4-6-no-thinking, opus-4-6-portkey-no-thinking)
Kontrolle: kata_base        — game-of-life

Zellen:    6 (2 workflows x 3 models)
Replikate: n = 5
Runs:      30 total
           — opus-4-7-Zellen voll aus RQ-emoji-Pool (10 v6 + 10 v6.4 = 20 Runs)
           — sonnet-4-6-Zellen neu (5 v6 + 5 v6.4 = 10 Runs, Direct-API)
           — opus-4-6-Zellen neu (5 v6 + 5 v6.4 = 10 Runs, Portkey)
```

## Hypothesen

- **H1 (Cross-Model-Replikation der Mittel-Befunde)**: Code-Qualitaets-Mittel auf sonnet und opus-4-6 sind zwischen v6 und v6.4 ebenfalls innerhalb ±1 σ. Konsequenz bei H1: Emoji-Effekt-Profil ist modell-unabhaengig — `tests_passing`-Stabilitaet und Reduktions-Empfehlung uebertragbar.
- **H2 (Modell-spezifischer Emoji-Effekt)**: bei mindestens einem der schwaecheren Modelle (sonnet oder opus-4-6) zeigt v6.4 systematisch hoehere Komplexitaet (≥ +1 σ in mindestens 2 von 5 Metriken). Konsequenz bei H2: Emojis als visuelle Anker werden von schwaecheren Modellen mehr genutzt; Reduktion ist modell-abhaengig.
- **H3 (Token-Einsparung modell-abhaengig)**: schwaechere Modelle koennten staerker auf den Emoji-Output reagieren — entweder verstaerkt (sonnet/opus-4-6 echoen Emojis exzessiver, Einsparung ohne sie groesser) oder abgeschwaecht.
- **H4 (Disziplin-Drift modell-abhaengig)**: Refactor-Quote-Abfall und Over-Implementation-Anstieg aus RQ-emoji koennten bei schwaecheren Modellen ausgepraegter sein, weil die Emoji-Anker dort relativ wichtiger waren.

**A-priori Erwartung**: Mix aus H1 (Mittel-Effekt repliziert) und partieller H4 (Disziplin-Drift bei schwaecheren Modellen staerker).

## Caveats

- **n=5 pro neuer Zelle**: ausreichend fuer Median-Differenzen ueber 1 σ, zu knapp fuer Stabilitaets-Aussagen pro Modell. Erweiterung auf n=10 nach Erstsignal.
- **Mixed Routing**: sonnet via Direct-API, opus-4-6 via Portkey. Plans muessen separat ausgefuehrt werden (`batch.sh` setzt `CLAUDE_CONFIG_DIR` pro Plan, nicht pro Run).
- **Single Kata**: nur game-of-life-example-mapping. Cross-Kata-Validierung waere weitere RQ.
- **No-thinking-Konsistenz**: alle drei Modell-Varianten sind no-thinking, um mit dem RQ-emoji-Setup vergleichbar zu bleiben. Thinking-Varianten waeren separate Untersuchung.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6-hybrid, v6.4-no-emoji}`,
`kata = game-of-life-example-mapping`,
`model ∈ {opus-4-7-no-thinking, sonnet-4-6-no-thinking, opus-4-6-portkey-no-thinking}`.
