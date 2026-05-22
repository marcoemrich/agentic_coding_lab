## Übersicht

| Outcome | v4 × opus-4-7 | v4.1 × opus-4-7 | v4 × opus-4-6-pk | v4.1 × opus-4-6-pk |
|---|---|---|---|---|
| `verification_pct` | 0.67 ± 0.36 | **0.95 ± 0.10** 🏆 | **0.93 ± 0.08** 🏆 | 0.93 ± 0.09 🏆 |
| `cycle_count` | 37.8 | 46.3 | 29.4 | 43.6 |
| `refactorings_applied` | 16.4 | 7.8 | 18.0 | 11.0 |
| `completed_within_budget` | 100% | 100% | 80% | **100%** |

(`verification_pct`: höher = besser; 🏆 bei ≥ 0.90)

## F-testlist-fix.1 — v4.1 beseitigt die Korrektheits-Bimodalität auf Opus 4.7

**Effekt:** v4-exact-subagents zeigt auf opus-4-7-no-thinking bimodale `verification_pct` (4× perfekt, 6× unter 0.40, Schnitt 0.67 ± 0.36). v4.1-testlist-scope-fix hebt den Schnitt auf 0.95 ± 0.10 (3× perfekt, 1× bei 0.80, n=4) und eliminiert die Low-Outlier-Runs.

**Datenbasis:** v4: n=10, v4.1: n=4 (1 unter min_replicates=5).

**Rationale:** Der Test-List-Scope-Fix von v4.1 produziert ~22% mehr TDD-Cycles (46 vs. 38), was zu gründlicherer Spezifikationsabdeckung führt. Die höhere Cycle-Zahl kostet kein zusätzliches Budget auf dem schnellen Modell (3491s vs. 3693s).

---

## F-testlist-fix.2 — Kein Korrektheits-Effekt auf Opus 4.6 Portkey

**Effekt:** Auf opus-4-6-portkey-no-thinking liefern v4 und v4.1 nahezu identische `verification_pct` (0.93 ± 0.08 vs. 0.93 ± 0.09). Dort war v4 bereits auf hohem Niveau — der Test-List-Scope-Fix löst ein Problem, das auf 4.6 nicht existierte.

**Datenbasis:** v4: n=5, v4.1: n=5. Alle v4.1-Runs mit 7200s-Budget (5400s führte zu 5/5 Timeouts).

**Rationale:** Opus 4.6 (Portkey) produziert unter v4 schon ~29 Cycles mit 0.93 `verification_pct` — die Bimodalität des 4.7-Modells unter v4 (6/10 Low-Outlier) liegt nicht an v4, sondern an einer Modell-Workflow-Interaktion, die nur 4.7 betrifft. v4.1 repariert diese spezifisch für 4.7.

---

## F-testlist-fix.3 — v4.1 braucht mehr Budget als v4

**Effekt:** v4.1 macht 44–46 Cycles (v4: 29–38). Auf opus-4-6-portkey überschritt das bei 5400s-Budget (alte Einstellung) systematisch die Laufzeit — 5/5 Timeouts, `verification_pct` = 0.20. Mit 7200s-Budget sind alle 5 Runs innerhalb des Budgets (`completed_within_budget` = 100%).

**Datenbasis:** 5/5 Timeouts bei 5400s (gelöscht), 5/5 OK bei 7200s.

**Rationale:** Der Test-List-Scope-Fix erzeugt längere Test-Listen und damit mehr Red-Green-Refactor-Cycles. Auf dem schnelleren Opus 4.7 passt das noch ins Budget, auf Opus 4.6 (Portkey) nur mit 7200s.
