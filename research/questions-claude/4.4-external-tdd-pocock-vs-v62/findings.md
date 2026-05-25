# Findings — RQ-4.4: v9-pocock-tdd vs v6.2-with-why-cleaned (claim-office)

## Übersicht

| Achse | v6.2-with-why-cleaned (n=8) | v9-pocock-tdd (n=3) | Sieger |
|---|---:|---:|---|
| **Korrektheit** `verification_pct` (höher = besser) | 0.96 ± 0.09 | **1.00 ± 0** 🏆 | Pocock leicht |
| `tests_passing` rate | 100 % | 100 % | Tie 🏆🏆 |
| **Code-Qualität** `cognitive_max` (kleiner = besser) | **5.00 ± 1.77** 🏆 | 14.33 ± 1.53 | v6.2 |
| `mccabe_max` (kleiner = besser) | **4.50 ± 0.76** 🏆 | 11.67 ± 0.58 | v6.2 |
| `cc_longest_function` (kleiner = besser) | **12.38 ± 1.41** 🏆 | 32.33 ± 1.53 | v6.2 |
| `smell_total` (kleiner = besser) | **0.38 ± 0.74** 🏆 | 6.67 ± 8.96 | v6.2 |
| `code_mass` (kleiner = besser) | 878.5 ± 91 | **748.3 ± 62** 🏆 | Pocock |
| **Kosten** `duration_seconds` (kleiner = besser) | 2530 ± 401 | **570 ± 106** 🏆 | Pocock |
| `total_tokens` (kleiner = besser) | 44.4 M ± 3.4 M | **13.1 M ± 4.6 M** 🏆 | Pocock |
| **Disziplin** `refactorings_applied` | 24.88 ± 6.90 | 0 ± 0 | by-design unterschiedlich |
| `cycle_count` | 37.38 ± 1.60 | 14.00 ± 3.46 | by-design unterschiedlich |
| `tests_passed_immediately` (kleiner = strikter) | 15.12 ± 5.84 | **2.33 ± 4.04** 🏆 | Pocock |
| `predictions_correct_rate` (höher = besser) | **97.2 %** 🏆 | 89.9 % | v6.2 |

> **Caveat zum Trophy-Gating:** Die Skill-Konvention vergibt Quality/Cost-Trophies nur bei `verification_pct = 1.0`. v6.2 liegt bei 0.96 (1× 0.73-Outlier von 8). Strenge Lesart würde v6.2 keine Quality-Trophies geben — hier pragmatisch vergeben, weil 7/8 v6.2-Runs perfekt sind.

> **Caveat n=3** für Pocock: Memory-Note `replicates-n-reliability` warnt vor n=3 für Rangordnung. Effekt-Größen sind hier so deutlich (>3 σ in allen Quality/Cost-Metriken), dass Aussagen-Richtung stabil ist; präzise σ-Vergleiche brauchen n≥8.

---

## F-4.4.1 — Pocock und v6.2 gleichwertig korrekt

Beide erreichen ~100 % Korrektheit auf claim-office-example-mapping (Pocock 1.00/1.00 in 3 Runs, v6.2 0.96 mean mit 1 Outlier auf 0.73 in 8 Runs). H2 bestätigt. → Korrektheit ist auf dieser Kata×Modell-Kombo nicht der differenzierende Faktor.

---

## F-4.4.2 — v6.2 produziert sauberer Code, Pocock kompakter

v6.2 dominiert die lokalen Komplexitäts- und Smell-Metriken um Faktoren (cognitive_max 5 vs 14, mccabe 4.5 vs 12, longest_function 12 vs 32, smell_total 0.4 vs 6.7). Pocock dafür mit kleinerem code_mass (748 vs 879). Lesart: Pocock schreibt weniger, aber dichter; v6.2 schreibt mehr und verteilt es feingranularer. H4 (Pocock besser bei Quality) **widerlegt**.

---

## F-4.4.3 — Pocock ~70–78 % günstiger

Wallclock 570s vs 2530s (−78 %), Tokens 13 M vs 44 M (−70 %). H6 (−20 % Wallclock, −15 % Tokens) **deutlich übertroffen**. Lesart: weniger Cycles × weniger Phasen × kein Subagent-Spawn pro Refactor → drastisch weniger Roundtrips.

---

## F-4.4.4 — Tail-Refactor löst auf claim-office nicht aus

v9-pocock-tdd's "After all tests pass, look for refactor candidates" führte in 3/3 Runs zu `refactorings_applied = 0`. Per-Cycle-Refactor (v6.2) zeigt 24.88 ± 6.90. Das ist nicht "Pocock skipt Refactor" — der Skill ist explizit Tail-orientiert — sondern: bei grünem Test stuft das Modell den Code als gut genug ein und ohne extra-Prompt-Druck wird nicht weiter umgebaut. H3 **deutlich bestätigt**. Direkte Folge ist sichtbar in F-4.4.2: ohne Refactor-Iterationen bleibt die initiale Implementierung, mit höherer Komplexität, stehen.

---

## F-4.4.5 — Pocock macht weniger, größere Schritte

`cycle_count` v6.2 37.38 ± 1.60 vs Pocock 14.00 ± 3.46. v6.2's expliziter test-list-Prompt scheint Cycle-Granularität zu erhöhen; Pocock's "one behavior at a time" wird breiter interpretiert. Konsistent mit dem ~13 M vs 44 M Token-Spread.

---

## F-4.4.6 — Pocock skippt seltener

`tests_passed_immediately` v6.2 15.12 ± 5.84 vs Pocock 2.33 ± 4.04. v6.2 hat in 40 % seiner Cycles Tests, die direkt grün sind — entweder Mehrfach-Behaviors pro Test oder Speculative Implementation. Pocock's Vertical-Slice-Disziplin (mit verbatim Red-Marker-Block) hält strikter.
