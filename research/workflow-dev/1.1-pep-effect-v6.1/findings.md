# RQ-pep-v6.1 — Findings

_Liefern psychologische Begruendungen ('pep talks') in den Red- und Green-Skill-Prompts auf v6.1-Basis einen messbaren Code-Qualitaets- oder TDD-Disziplin-Vorteil ueber rein operationale Anweisungen?_

## Übersicht (Primär-Outcome Code-Qualität — kleiner = besser)

| Outcome | v6.1-hybrid (pep) | v6.1-no-pep |
|---|---:|---:|
| `code_mass` (APP) | 147.6 | **144.6** 🏆 |
| `smell_total` | 2.6 | **2.0** 🏆 |
| `cc_longest_function` | 15.0 | **13.2** 🏆 |
| `cognitive_max` | 6.2 | **4.6** 🏆 |
| `mccabe_max` | 5.2 | **4.8** 🏆 |

Alle Code-Qualitäts-Metriken leicht zugunsten **no-pep**, aber Spreads sind groß (std meist ≥ 1σ vom Mittelwert-Delta) — Lesung: **kein klarer Effekt**, Trend leicht pro Reduktion.

---

## F-1.1 — Pep-Talks: kein Code-Qualitäts-Vorteil, aber Disziplin-Verschiebung

**Aussage:** Das Entfernen der "Psychological Resistance"-Sektion und motivierender Inline-Kommentare aus `green.md`/`red.md` auf v6.1-Basis verschlechtert weder Korrektheit (beide 100% `verification_pct`) noch Code-Qualität. Es verändert aber das TDD-Verhalten: **no-pep refactoriert deutlich häufiger** und implementiert **deutlich seltener vorab** (weniger `tests_passed_immediately`).

| Metrik (Richtung) | v6.1-hybrid (pep) | v6.1-no-pep | Δ |
|---|---:|---:|---|
| `refactorings_applied` (höher = aktiver) | 4.2 (std 2.28) | **7.0** 🏆 (std 3.24) | +67% |
| `tests_passed_immediately` (kleiner = disziplinierter) | 4.8 (std 2.95) | **1.2** 🏆 (std 2.68) | −75% |
| `cycle_count` | 8.4 | 8.8 | ≈ |
| `predictions_correct_rate` | 98.8% | **100.0%** 🏆 | ≈ |
| `verification_pct` | **100%** 🏆 | **100%** 🏆 | = |
| `tests_passing` | **100%** 🏆 | **100%** 🏆 | = |
| `duration_seconds` (kleiner = günstiger) | **597** 🏆 | 777 | +30% |
| `total_tokens` (kleiner = günstiger) | **7.17M** 🏆 | 8.66M | +21% |

**Rationale:** Die a-priori Hypothese H3 sagte das Gegenteil voraus (no-pep → mehr Over-Implementation). Beobachtet wird das umgekehrte Muster — ohne motivierende Reassurance bleibt das Modell strikter am minimalen Green-Schritt und schiebt Erweiterungen in den Refactor-Subagent. Mechanismus offen: vermutlich beeinflusst das Wegfallen der "Hardcoded returns are perfectly fine"-Reassurance die Default-Strategie, nicht die explizite Disziplin. **Kosten:** no-pep braucht +30% Wallclock und +21% Tokens, getrieben durch die zusätzlichen Refactor-Cycles. H1 (Pep-Talks wirkungslos) ist auf Code-Qualität bestätigt, aber durch H3-inverses TDD-Disziplin-Muster eingeschränkt.

**Konsequenz:** v6.1-no-pep ist eine valide Reduktion für Code-Qualitäts-orientierte Workflows. Für Token-Effizienz bleibt v6.1-hybrid besser. MARKERS-Klassifikation als "decorative" stimmt für Output-Qualität, ist aber unscharf für TDD-Verhalten.

**Datenbasis:** n=5 pro Zelle, `game-of-life-example-mapping`, `opus-4-7-no-thinking`. Siehe `summary.md` und `runs.csv`.
