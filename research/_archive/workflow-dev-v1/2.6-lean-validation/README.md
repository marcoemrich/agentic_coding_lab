---
id: RQ-lean
question: "Performt v6.5-lean (Four Rules raus, Pep raus, Emojis raus, mit strukturellen Rewrites + Why-Begruendungen) mindestens gleichwertig zu v6 auf Code-Qualitaet und TDD-Disziplin?"
factors:
  workflow_x_prompt:
    - {workflow: v6-hybrid,   prompt: example-mapping}
    - {workflow: v6.5-lean,   prompt: example-mapping}
    - {workflow: v6.6-leaner, prompt: example-mapping}
controls:
  model: opus-4-7-no-thinking
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
min_replicates: 10
status: aktiv
---

# RQ-lean: v6.5-lean — Bundle-Validierung der Reduktionen + Why-Rewrites

Halten alle Reduktionen aus RQ-app bis RQ-emoji plus die skill-creator-Craft-Rewrites gemeinsam in einem Workflow, oder ergeben sich kombinatorische Effekte?

## Motivation

Nach den Einzel-RQs hatten wir konsolidierte Befunde pro Reduktion:
- **RQ-app**: APP haelt (bleibt drin)
- **RQ-rules**: Four Rules wirkungslos (kann raus)
- **RQ-pep**: Pep-Talks gemischt (Pred-Rate −7 pp bei "strict discipline"-Streichung)
- **RQ-emoji**: Emojis cross-model mixed — auf opus-4-7 Quali gleich, Tokens −5 %, Disziplin-Drift; auf sonnet sogar dringend zu entfernen

v6.5-lean kombiniert die OK-bewerteten Reduktionen plus skill-creator-Craft-Rewrites:
- Four Rules entfernt (RQ-rules → keep removal)
- Pep entfernt aus red/green (RQ-pep) und aus tdd.md "Trust the process"
- Emojis entfernt aus allen Files (RQ-emoji)
- `tdd.md` strukturell umgeschrieben: Checklist + Remember + redundante DO-NOTs raus, statt dessen einleitender "Why skills required"-Block mit Marker-Compliance-Begruendung
- `red.md` Step 7 mit Why-Block ergaenzt (Marker-Compliance-Erklaerung fuer verbatim Format)
- `green.md` Minimal-Strategies-Section in Step 2 gemerged + Why-Minimality-Block ergaenzt
- `refactor.md` "Integration with Project Standards" (Hexagonal, DI, Named exports) entfernt — irrelevant fuer Kata

Die Reduktion: 814 → 657 Zeilen ueber die 5 Workflow-Files (−19 %).

Die Frage ist nicht ob die Einzel-Effekte halten (das wissen wir), sondern:
1. ob die Kombination keine **neuen Probleme** zeigt, die in den Einzel-RQs nicht sichtbar waren,
2. ob die **Why-Rewrites** (skill-creator-Patterns) messbar besser performen als reine Reduktion ohne Rewrite.

## Workflow-Definition

- **v6-hybrid (Kontrolle, n=10 aus RQ-stability-Pool)**: volle Originalfassung mit allen Sektionen
- **v6.5-lean (neu, n=5)**: kombinierte Reduktion + Rewrites wie oben beschrieben

## Hypothesen

- **H1 (Gleichwertige Code-Qualitaet)**: alle 5 primaeren Code-Qualitaets-Metriken liegen innerhalb ±1 σ der v6-Streuung.
- **H2 (Stabilitaet)**: keine σ-Verdopplung wie in RQ-app (APP raus war negativ), kein verlorener 0%-Outlier-Status wie in RQ-emoji.
- **H3 (Tokens)**: kombinierte Reduktion erzielt **additive Token-Einsparung** der Einzel-Effekte. RQ-rules hatte −8.5 %, RQ-emoji −5.3 %. Erwartung: v6.5 ≈ −12 bis −15 % Tokens vs v6.
- **H4 (Disziplin-Stabilitaet)**: keine Verschlechterung der Disziplin-Indikatoren. Pred-Rate, cycle_count, refactorings_applied bleiben in v6-Baendern.
- **H5 (Korrektheit)**: 100 % tests_passing und 100 % verification_pct (Sanity).
- **H6 (Why-Rewrites helfen ueber reine Reduktion hinaus)**: Vergleich mit RQ-rules-Beobachtung (Four Rules raus war −8.5 % Tokens ohne Quali-Verlust). Wenn v6.5 messbar **bessere** Quali als RQ-rules-Profil zeigt, traegt die Why-Begruendung; wenn nur additive Reduktion ohne Quali-Plus, sind die Rewrites kosmetisch.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (v6-hybrid, v6.5-lean), beide mit example-mapping
Kontrolle: model            — opus-4-7-no-thinking
Kontrolle: kata_base        — game-of-life

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5 fuer Erstsignal, ggf. Erweiterung auf n = 10 bei Bedarf
Runs:      15 total (10 v6 aus RQ-stability-Pool + 5 neue v6.5-lean)
```

## Caveats

- **n=5 fuer v6.5-lean**: Erstsignal-Niveau, fuer robuste Stabilitaetsaussagen ggf. n=10 noetig (vgl. RQ-emoji wo n=5 → n=10 die Mittel-Tilt-Beobachtung flippte).
- **Single Kata, single Modell**: weiteres als opus-4-7-no-thinking auf game-of-life nicht abgedeckt. Cross-Model-Validation analog zu RQ-emoji-cross-model ist Folge-RQ falls v6.5 promotet wird.
- **Mehrere Aenderungen gleichzeitig**: dieser Test kann nicht isolieren, ob die Why-Rewrites tragen oder rein die Reduktion. RQ-lean misst nur den Bundle-Effekt. Falls Bundle gleichwertig zu v6: Bundle akzeptiert; falls Quali- oder Disziplin-Drop: detaillierte Sub-RQ noetig.
- **Marker-Compliance**: gleiche Mechanik wie v6 (Skills + Subagent). Pre-Validation via Smoke entfaellt — beim Erst-n=5-Batch werden Marker-Bruche sichtbar.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6-hybrid, v6.5-lean}`,
`kata = game-of-life-example-mapping`,
`model = opus-4-7-no-thinking`.
