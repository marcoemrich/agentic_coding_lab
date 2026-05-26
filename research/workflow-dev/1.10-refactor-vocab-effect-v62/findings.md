# RQ-1.10 — Findings: v6.2.1-refactor-vocab vs v6.2-with-why-cleaned

Stand: 2026-05-26 · n=5 je neue Zelle (refactor-vocab), n=8 / n=10 Baseline-Reuse aus RQ-1.9 (claim-office) bzw. RQ-1.7 (game-of-life) · Modell `opus-4-7-portkey-no-thinking` · Prompt-Stil `example-mapping`.

## Übersicht

Primaer-Outcome **Korrektheit** (`verification_pct` / `tests_passing`, höher = besser) plus Bundle-Risiko-Sentinel **Code-Mass** (höher = mehr produktiver Output; hier diagnostisch fuer "Agent hat aufgehoert"):

| kata          | metric                  | v6.2-with-why-cleaned | v6.2.1-refactor-vocab | Trophy |
|---|---|---:|---:|:--|
| game-of-life  | tests_passing-Rate      | **100 %** 🏆          | **100 %** 🏆        | tie    |
| game-of-life  | code_mass (mean)        | **153** 🏆            | 172                 | Baseline (refactor-vocab +12 %) |
| claim-office  | verification_pct (mean) | **0.96** 🏆           | 0.23                | Baseline (-0.73 absolut) |
| claim-office  | verification_pct (min)  | **0.73** 🏆           | 0.00                | Baseline |
| claim-office  | cycle_count (mean)      | **37.4** 🏆           | 16.0                | Baseline (Agent stoppt nach <½ Zyklen) |
| claim-office  | code_mass (mean)        | **879** 🏆            | 372                 | Baseline (-58 % Output) |

Auf game-of-life keine Korrektheits-Differenz (beide 100 %); auf claim-office bricht refactor-vocab in 4/5 Runs ein (`verification_pct ∈ {0, 0, 0.067, 0.133}`, 1/5 bei 0.933). Mittel der Kosten (`duration_seconds`, `total_tokens`) auf claim-office optisch zugunsten refactor-vocab — aber **nicht trophy-faehig**: weil der Agent frueh aufgibt, nicht weil die Loesung kuerzer ist (`code_mass` halbiert, `cycle_count` halbiert). **Correctness-Gating** der Trophy-Konvention greift: Quality/Cost-Trophies erst ab `verification_pct = 1.0`; auf claim-office hat refactor-vocab keinen 1.0-Run, also keine Quality/Cost-Trophies dort.

---

## F-1.10.1 — Korrektheits-Kollaps auf claim-office (Bundle-Risiko bestaetigt)

Der additive Refactor-Vokabular-Block (Complexity-Awareness + SRP + Smell-Tabelle) bricht die Korrektheit auf claim-office von `verification_pct = 0.96` (Baseline, σ=0.09) auf `0.23` (refactor-vocab, σ=0.40). 4 von 5 Runs liegen unter 0.15, ein Run erreicht 0.93.

| kata         | workflow              | n | verif mean | verif min | verif max | σ    |
|---|---|---:|---:|---:|---:|---:|
| claim-office | v6.2-with-why-cleaned | 8 | **0.96** 🏆 | **0.73** 🏆 | 1.00 | 0.09 |
| claim-office | v6.2.1-refactor-vocab   | 5 | 0.23      | 0.00      | 0.93 | 0.40 |

**Mechanismus** (aus Spot-Check der 5 refactor-vocab-Runs):

- Agent self-terminiert vorzeitig: `cycle_count = 7, 8, 8, 22, 35` (Baseline 36-40), `duration_seconds = 629-2328` (Baseline 2194-3285), kein Rate-Limit, kein Timeout, `exit_code = 0` in allen 5 Faellen.
- `code_mass` halbiert (372 vs 879). Die _geschriebenen_ Tests laufen grün, aber die Test-Liste wurde nicht abgearbeitet — `tests_passing = true` ist dadurch ein irrefuehrendes Internal-Signal.
- Der CLI-Nudge (`run-batch.sh` legt `src/cli.ts` post-hoc an, wenn der Agent ihn vergisst) macht Stub-Aufrufe gegen `runScenario`, die scheitern, weil die Domain-Logik incomplete ist — daher `verification_pct ≈ 0` statt `null`.
- Hypothese fuer den frueh-Stopp: zusaetzliche Refactor-Vokabel verschiebt Aufmerksamkeit von Test-Listen-Abarbeitung in Richtung Code-Quality-Selbst-Audit; der Agent betrachtet die ersten Zyklen als "abgeschlossen, weil refactored".

H0-Falsifizierer aus dem RQ-README ist getriggert: "Korrektheit regrediert auf claim-office → Vokabel-Erweiterung empirisch redundant, v6.2 bleibt Default". Pattern matched [audit-bundle-kata-asymmetry](../1.9-audit-bundle-validation-claim-office/findings.md) — RQ-1.9 zeigte v6.3-audit-bundle 0.96 → 0.35 auf gleicher Kata.

**Konsequenz**: v6.2.1-refactor-vocab wird **nicht promotet**. Default bleibt v6.2-with-why-cleaned.

---

## F-1.10.2 — game-of-life: kein erkennbarer Code-Qualitaets-Gewinn

Auf game-of-life liegen alle primaeren Komplexitaets-Metriken innerhalb 1σ der Baseline. `code_mass` steigt um 12 %, `duration_seconds` um 14 %, `total_tokens` um 15.5 %.

| metric                  | v6.2-with-why-cleaned (n=10) | v6.2.1-refactor-vocab (n=5) | Δ        |
|---|---:|---:|---:|
| cognitive_max (mean)    | 4.3 (σ 2.8)                  | 4.2 (σ 2.2)               | -0.1     |
| cognitive_avg (mean)    | 2.9 (σ 1.7)                  | 2.9 (σ 0.8)               | 0        |
| mccabe_max (mean)       | 4.2 (σ 1.3)                  | 3.8 (σ 0.5)               | -0.4     |
| mccabe_avg (mean)       | 2.01 (σ 0.58)                | 1.67 (σ 0.42)             | -0.34    |
| cc_longest_function     | 12.2 (σ 6.9)                 | 10.0 (σ 5.6)              | -2.2     |
| cc_avg_loc_per_function | 5.2 (σ 2.0)                  | 4.4 (σ 2.2)               | -0.8     |
| code_mass (mean)        | **153** (σ 14)               | 172 (σ 26)                | +12 %    |
| smell_total (mean)      | 2.4 (σ 0.5)                  | 2.2 (σ 0.5)               | -0.2     |
| refactorings_applied    | 7.9 (σ 1.9)                  | 9.2 (σ 0.8)               | +1.3     |
| duration_seconds        | **627** (σ 117)              | 716 (σ 70)                | +14 %    |
| total_tokens            | **8.32 M**                   | 9.60 M                    | +15.5 %  |

Alle Komplexitaets-Differenzen liegen innerhalb 1σ der Baseline-Varianz — kein robuster Gewinn. `refactorings_applied` steigt leicht (+1.3), der Agent fuehrt die zusaetzliche Vokabel als Refactor-Anlass aus, ohne dass sich die Mess-Metriken bewegen. Trophy nur fuer eindeutig bessere Spalten (`code_mass`, `duration_seconds`, `total_tokens`); auf Komplexitaets-Spalten Spread unter 1σ → kein Trophy ("tie").

**Goodhart-Caveat** (gemaess README "Goodhart's Law"): `cognitive_*` und `mccabe_*` werden im neuen `refactor.md` explizit benannt — sie sind fuer v6.2.1-refactor-vocab **Compliance-Metriken**, fuer v6.2-with-why-cleaned bleiben sie unabhaengig. Cross-Workflow-Vergleich auf diesen Metriken ist daher asymmetrisch und tendenziell zugunsten von refactor-vocab gefaerbt. Die Tatsache, dass selbst _mit_ dieser Faerbung kein Gewinn sichtbar ist, verstaerkt H0. `mutation_score` (versteckte Metrik) waere der saubere Test, ist aber fuer diese RQ nicht aktiviert.

---

## F-1.10.3 — TDD-Disziplin: GoL neutral, claim-office gestoert (Folge von F-1.10.1)

| kata         | workflow              | cycle_count mean | refactorings_applied mean | predictions_correct_rate |
|---|---|---:|---:|---:|
| game-of-life | v6.2-with-why-cleaned | 8.5  | 7.9  | **100 %** 🏆 |
| game-of-life | v6.2.1-refactor-vocab   | 9.2  | 9.2  | 97.8 %       |
| claim-office | v6.2-with-why-cleaned | **37.4** 🏆 | **24.9** 🏆 | 97.2 % |
| claim-office | v6.2.1-refactor-vocab   | 16.0 (σ 12.3) | 12.0 | 98.1 %  |

Auf GoL: TDD-Disziplin im Rahmen der Baseline (H3 erfuellt). Auf claim-office: `cycle_count` halbiert mit σ=12.3 — Folge von F-1.10.1 (Agent stoppt frueh), nicht eigenstaendiger Effekt. `predictions_correct_rate` bleibt in beiden Workflows hoch (≥ 97 %) — wenn der Agent _arbeitet_, ist seine Selbst-Voraussage korrekt; das Bundle bricht die Quantitaet, nicht die Vorhersage-Qualitaet.
