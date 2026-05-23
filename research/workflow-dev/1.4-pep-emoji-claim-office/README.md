---
id: RQ-pep-emoji-claim-office
question: "Haelt der Interaktions-Befund aus RQ-pep-emoji-v6.1 (Pep+Emoji-Reduktion: Anti-Additivitaet bei refactorings_applied, Saettigung bei tests_passed_immediately, Korrektheit invariant) auch auf einer komplexeren Kata mit echten Mehrdeutigkeiten?"
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}  # pep + emoji (baseline)
    - {workflow: v6.1-no-pep,                    prompt: example-mapping}  # no-pep + emoji
    - {workflow: v6.1-no-emoji,                  prompt: example-mapping}  # pep + no-emoji
    - {workflow: v6.1-no-pep-no-emoji,           prompt: example-mapping}  # neither
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primaer: Korrektheit (claim-office hat echte Ambiguitaeten, verification_pct skaliert nicht-trivial)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # sekundaer: Code-Qualitaet
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # TDD-Disziplin (Interaktions-Bestaetigung erwartet, falls Befund kata-stabil)
  - refactorings_applied
  - cycle_count
  - predictions_correct_rate
  - tests_passed_immediately
  # Kosten
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-pep-emoji-claim-office: v6.1-Reduktionsserie auf claim-office (Korrektheits-Stresstest)

Bleibt die Interaktions-Lesart aus [RQ-pep-emoji-v6.1](../1.3-pep-emoji-combined-v6.1/findings.md) F-1.1 auch auf claim-office bestehen — oder rutscht insbesondere `v6.1-no-pep-no-emoji` wegen seiner reduzierten Refactor-Aktivitaet (3.8 vs Baseline 4.1 auf game-of-life) in eine Korrektheits-Regression?

## Motivation

RQ-pep-emoji-v6.1 zeigte auf `game-of-life-example-mapping`:
- Korrektheit invariant ueber alle 4 Workflows (100/100/100/100)
- Disziplin-Verschiebung **nicht additiv**: kombiniert refactoriert *weniger* als Baseline (3.8 vs 4.1), kombiniert ist *schnellste* Zelle (-15 % Wallclock)
- Code-Qualitaet indistinguishable (alle Δ < 1σ)

Diese Befunde wurden empfohlen als "v6.1-no-pep beste Wahl fuer Code-Qualitaets-Forschung, v6.1-no-pep-no-emoji beste Wahl fuer Speed". Vor Uebernahme in die `model-recommendation-matrix.md` muss aber geprueft werden, ob das auf einer **komplexeren Kata** stabil bleibt.

**Warum claim-office statt -lite:** Per Memory ([claim-office-lite-Profil](../../.claude/projects/-home-memrich-sync-workspace-agentic-coding-lab-project-main/memory/claim-office-lite.md)) ist lite fuer Korrektheits-Forschung untauglich — sie saturiert/kollabiert je nach Stil. Die volle Variante (15 Szenarien, mit Cap/Multi-Claim) hat eine funktionierende `verification_pct`-Skala, in der Korrektheits-Regressionen sichtbar werden. Genau das wird hier gebraucht.

**Konkrete Vorhersage fuer v6.1-no-pep-no-emoji:** falls die "weniger Refactor-Aktivitaet"-Lesart stimmt, sollten claim-office-spezifische Mehrdeutigkeiten (HPSMV-Erstversicherung, alike-Komponenten, Multi-Claim-Reihenfolge) schlechter aufgeloest werden. Erwartung: `verification_pct` < 90 % vs Baseline > 95 %.

## Workflow-Definition

Alle 4 Workflows wie in RQ-pep-emoji-v6.1 definiert; keine neuen Workflow-Files noetig. Wiederverwendung der bestehenden v6.1-* Definitionen.

## Hypothesen

- **H1 (Korrektheit invariant)**: alle 4 Workflows liefern statistisch ununterscheidbares `verification_pct` (Median-Spread < 5 pp). Konsequenz: der RQ-1.3-Befund ist kata-stabil; v6.1-no-pep-no-emoji als Recipe-Empfehlung freigegeben.
- **H2 (no-pep-no-emoji-Regression)**: `v6.1-no-pep-no-emoji` faellt im `verification_pct` um ≥ 10 pp gegenueber `v6.1-hybrid` zurueck. Konsequenz: die in RQ-1.3 als "Speed-Wahl" identifizierte Kombination ist auf komplexen Katas nicht sicher; Empfehlung bleibt bei `v6.1-no-pep` oder `v6.1-hybrid`.
- **H3 (Disziplin-Pattern stabil)**: `refactorings_applied` und `tests_passed_immediately` zeigen dieselbe nicht-additive Interaktion wie auf game-of-life (kombiniert refactoriert weniger als Baseline, no-pep-saturierte Immediate-Werte).
- **H4 (Disziplin-Pattern kata-spezifisch)**: auf claim-office kehrt sich das Interaktions-Muster um — kombiniert refactoriert *mehr* als Einzel-Reduktionen, weil Mehrdeutigkeiten zusaetzliche Iterationen erzwingen. Konsequenz: H1-Befund waere mehrdeutig zu lesen.
- **H5 (Code-Qualitaet weiterhin indistinguishable)**: alle 5 Code-Qualitaets-Metriken bleiben innerhalb 1σ konsistent ueber die 4 Workflows.

**A-priori Erwartung:** H1 + H3 (kata-stabil) ist das wahrscheinlichste Szenario, weil die v6.1-Basis korrektheits-robust ist und der Mechanismus aus RQ-1.3 F-1.1 ("Reassurance-Schicht-Wegfall fuehrt zu weniger Refactor-Subagent-Triggern") nicht kata-spezifisch ist. Aber claim-office hat echte Mehrdeutigkeiten, die in RQ-1 (v1-Archiv) als kata-stilabhaengig identifiziert wurden — eine Korrektheits-Regression der kombinierten Reduktion ist nicht auszuschliessen.

## Design

```
Faktor:    workflow_x_prompt — 4 Stufen (alle mit example-mapping)
             v6.1-hybrid-testlist-scope-fix   (pep + emoji, baseline)
             v6.1-no-pep                      (no-pep + emoji)
             v6.1-no-emoji                    (pep + no-emoji)
             v6.1-no-pep-no-emoji             (neither)
Kontrolle: model            — opus-4-7-portkey-no-thinking (sharded)
Kontrolle: kata_base        — claim-office

Zellen:    4 (4 Workflows x 1 Kata)
Replikate: n = 5
Runs:      20 total, alle neu (keine v6.1-* x claim-office Runs vorhanden)
Shards:    8 (Portkey)
```

## Caveats

- **Single Modell, single Kata (claim-office)**: identische Einschraenkung wie RQ-1.3, jetzt aber mit der "schwierigeren" Kata, die der eigentliche Stresstest ist.
- **Portkey-Routing**: alle 20 Runs auf `opus-4-7-portkey-no-thinking` (homogen) — keine Routing-Asymmetrie wie in RQ-1.3.
- **Verification-Suite (15 Szenarien)**: `verification_pct` ist Float 0.0-1.0, granularer als reines pass/fail. Bei nur n=5 sind kleine pp-Differenzen aber noch im Sampling-Rauschen.
- **Predictions auf claim-office**: bisher unuebliche Kata fuer die Prediction-Disziplin-Metrik. Werte koennten sich anders verteilen als auf game-of-life.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1-no-pep, v6.1-no-emoji, v6.1-no-pep-no-emoji}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.
