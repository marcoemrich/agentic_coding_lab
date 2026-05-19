# RQ-3b Findings

Modell-Vergleich opus-4-7-no-thinking vs opus-4-6-portkey-no-thinking auf `claim-office-example-mapping × v4-exact-subagents`.

## Übersicht

| Modell | n | verification_pct | σ |
|---|---:|---:|---:|
| opus-4-6-portkey-no-thinking | 5 | **0.93** | 0.08 |
| opus-4-7-no-thinking | 10 | 0.67 | 0.36 |

## F-3b.1 — opus-4-6 schlägt opus-4-7 auf v4 × claim-office

Entgegen der Erwartung ("neueres Modell = besser") erreicht opus-4-6 auf v4-exact-subagents eine signifikant höhere verification_pct (0.93 vs 0.67) mit deutlich niedrigerer Streuung (σ 0.08 vs 0.36). Alle 5 opus-4-6-Runs liegen ≥ 0.80, während opus-4-7 bimodal verteilt ist (4 perfekt, 6 zwischen 0.20–0.87).

Dies steht im direkten Widerspruch zu RQ-3 F-3.3 ("opus-4-7 dominiert opus-4-6 auf Code-Qualität"). Auf der trainingsbekannten game-of-life-Kata differenziert die Korrektheit nicht (alle 1.00), und Code-Qualität zeigt opus-4-7 klar vorne. Auf der novel claim-office-Kata invertiert sich das Bild auf der Korrektheits-Achse.

Hypothese: opus-4-7 ist auf claim-office "überkreativ" — es interpretiert Mehrdeutigkeiten aktiver und trifft dabei häufiger die "falsche" Lesart. opus-4-6 parst konservativer und hält sich näher am Wortlaut der Spec. Das ist kein generelles Modell-Defizit, sondern ein Trade-off zwischen Kreativität und Spec-Treue.

Einschränkung: opus-4-6 hat n=5 (Portkey), opus-4-7 hat n=10 (Direct API). Routing-Unterschied ist ein potenzieller Confound, auch wenn Portkey nur als Proxy agiert.

## F-3b.2 — Workflow×Modell-Interaktion ist der dominierende Effekt

Der Befund "opus-4-6 besser als opus-4-7" gilt nur für v4-exact-subagents. Auf v6-hybrid kehrt sich das um:

| Workflow | opus-4-7 vpct (n) | opus-4-6 vpct (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** (5) |
| v5-exact-single-context | 0.87 (10) | 0.87 (5) |
| v6-hybrid | **1.00** (5) | 0.68 (15) |

Weder "opus-4-7 ist besser" noch "opus-4-6 ist besser" ist eine haltbare Aussage — **der Workflow bestimmt, welches Modell vorne liegt**. v5 ist modell-unabhängig konstant (0.87). Model-Vergleiche ohne Workflow-Kontrolle sind auf novel Katas nicht generalisierbar.

Mechanismus: v6-hybrid delegiert Orchestrierung an das Modell (Skill-Invocation im shared Context) — opus-4-7 beherrscht das, opus-4-6 verliert in ~40 % der Runs die Claim-Hälfte der Spec (implementiert nur Quote, `claim`-Operation komplett ignoriert, trotzdem `tests_passing=true` weil die internen Tests nur Quote abdecken). v4 gibt jeder Phase einen expliziten Subagent-Prompt — opus-4-6 profitiert von dieser Struktur, opus-4-7 wird auf v4 "überkreativ" bei Mehrdeutigkeiten.

## F-3b.3 — Korrektheit differenziert stärker als Code-Qualität

Auf game-of-life (RQ-3) trennt Code-Qualität die Modelle bei perfekter Korrektheit. Auf claim-office trennt **Korrektheit selbst** die Modelle — Code-Qualität wird sekundär, wenn 33 % der Runs die Aufgabe nicht mal lösen. H3 bestätigt: die "stärkere Challenge" exponiert Unterschiede, die auf GOL unsichtbar waren.
