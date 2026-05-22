# RQ-model-novel Findings

Modell-Vergleich opus-4-7-no-thinking vs opus-4-6-portkey-no-thinking auf `claim-office-example-mapping × v4-exact-subagents`.

## Übersicht

| Modell | n | verification_pct | σ |
|---|---:|---:|---:|
| opus-4-6-portkey-no-thinking | 5 | **0.93** | 0.08 |
| opus-4-7-no-thinking | 10 | 0.67 | 0.36 |

## F-model-novel.1 — opus-4-6 schlägt opus-4-7 auf v4 × claim-office

Entgegen der Erwartung ("neueres Modell = besser") erreicht opus-4-6 auf v4-exact-subagents eine signifikant höhere verification_pct (0.93 vs 0.67) mit deutlich niedrigerer Streuung (σ 0.08 vs 0.36). Alle 5 opus-4-6-Runs liegen ≥ 0.80, während opus-4-7 bimodal verteilt ist (4 perfekt, 6 zwischen 0.20–0.87).

Dies steht im direkten Widerspruch zu RQ-model-quality F-model-quality.3 ("opus-4-7 dominiert opus-4-6 auf Code-Qualität"). Auf der trainingsbekannten game-of-life-Kata differenziert die Korrektheit nicht (alle 1.00), und Code-Qualität zeigt opus-4-7 klar vorne. Auf der novel claim-office-Kata invertiert sich das Bild auf der Korrektheits-Achse.

Hypothese: opus-4-7 ist auf claim-office "überkreativ" — es interpretiert Mehrdeutigkeiten aktiver und trifft dabei häufiger die "falsche" Lesart. opus-4-6 parst konservativer und hält sich näher am Wortlaut der Spec. Das ist kein generelles Modell-Defizit, sondern ein Trade-off zwischen Kreativität und Spec-Treue.

Einschränkung: opus-4-6 hat n=5 (Portkey), opus-4-7 hat n=10 (Direct API). Routing-Unterschied ist ein potenzieller Confound, auch wenn Portkey nur als Proxy agiert.

## F-model-novel.2 — Workflow×Modell-Interaktion ist der dominierende Effekt

Der Befund "opus-4-6 besser als opus-4-7" gilt nur für v4-exact-subagents. Auf v6-hybrid kehrt sich das um:

| Workflow | opus-4-7 vpct (n) | opus-4-6 vpct (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** (5) |
| v5-exact-single-context | 0.87 (10) | 0.87 (5) |
| v6-hybrid | **1.00** (5) | 0.68 (15) |

Weder "opus-4-7 ist besser" noch "opus-4-6 ist besser" ist eine haltbare Aussage — **der Workflow bestimmt, welches Modell vorne liegt**. v5 ist modell-unabhängig konstant (0.87). Model-Vergleiche ohne Workflow-Kontrolle sind auf novel Katas nicht generalisierbar.

Mechanismus: v6-hybrid delegiert Orchestrierung an das Modell (Skill-Invocation im shared Context) — opus-4-7 beherrscht das, opus-4-6 verliert in ~40 % der Runs die Claim-Hälfte der Spec (implementiert nur Quote, `claim`-Operation komplett ignoriert, trotzdem `tests_passing=true` weil die internen Tests nur Quote abdecken). v4 gibt jeder Phase einen expliziten Subagent-Prompt — opus-4-6 profitiert von dieser Struktur, opus-4-7 wird auf v4 "überkreativ" bei Mehrdeutigkeiten.

## F-model-novel.3 — Korrektheit differenziert stärker als Code-Qualität

Auf game-of-life (RQ-model-quality) trennt Code-Qualität die Modelle bei perfekter Korrektheit. Auf claim-office trennt **Korrektheit selbst** die Modelle — Code-Qualität wird sekundär, wenn 33 % der Runs die Aufgabe nicht mal lösen. H3 bestätigt: die "stärkere Challenge" exponiert Unterschiede, die auf GOL unsichtbar waren.

## F-model-novel.4 — Präziserer Mechanismus auf opus-4-7: Test-Listen-Vollständigkeit, nicht Subagent-Isolation

Status: ✅ stabil (für Test-Listen-Hebel; v4.2-Sackgasse mit 2026-05-22 final). Verfeinert F-model-novel.2.

Aus RQ-tdd-correctness auf claim-office × opus-4-7-portkey-no-thinking (35 Runs):

| Workflow | n | verification_pct | passed_immediately | Test-List-Vollständigkeit | shared example-mapping |
|---|---:|---:|---:|---|---|
| v4-exact-subagents | 10 | 0.67 (σ 0.36) | 17.8 | nicht erzwungen | nein |
| **v4.1-testlist-scope-fix** | 5 | **0.96 (σ 0.09)** | 22.2 | "Cover every spec example" | nein |
| v4.2-shared-context† | 5 | 0.71 (σ 0.41) | 14.0 | "Cover every spec example" | ja |
| v4.2.1-fake-it-green† | 2 | 0.70 | 12.0 | "Cover every spec example" | ja + Green-Fake-it |
| v5-exact-single-context | 9 | 0.97 (σ 0.09) | 0.9 | (single context, implizit vollständig) | n.a. |
| v6-hybrid | 5 | 1.00 (σ 0.00) | 10.0 | (single context, implizit vollständig) | n.a. |

† Workflows archiviert in `experiments/workflows/_archive/` (2026-05-22). Aus RQ-tdd-correctness-Frontmatter entfernt, die abgeschlossenen Runs bleiben als Belege für diese Findings erhalten.

**Beobachtung 1 — v4.1 schließt die v4-Lücke fast komplett.** Der einzige inhaltliche Unterschied v4 → v4.1 ist im `test-list`-Subagent: explizite Pflicht "Every requirement in the spec MUST produce at least one test … Every operation the spec names". Sonst nichts. Damit erreicht v4.1 v5/v6-Niveau auf 4.7 (0.96), mit deutlich engerer Streuung (σ 0.09 vs. 0.36).

**Beobachtung 2 — v4.2 (shared example-mapping zusätzlich) bringt keine Verbesserung gegenüber v4.1.** v4.2 erbt den Test-List-Fix von v4.1 *und* schreibt zusätzlich `example-mapping/<feature>.md`, das Red und Green vor jeder Phase lesen. Trotzdem nur 0.71 — innerhalb der v4-Streuung und deutlich unter v4.1. Die bimodale Verteilung (σ 0.41, min 0, max 1.00) deutet darauf, dass die zusätzliche Spec-Sicht in Red/Green eher destabilisiert als hilft. Wenn fehlender Spec-Kontext im Red/Green-Subagent der Grund für die v4-Schwäche wäre, müsste v4.2 besser sein als v4.1 — ist es nicht.

**Beobachtung 3 — v4.2 senkt `passed_immediately` (14.0 vs. v4.1's 22.2), ohne `verification_pct` zu verbessern.** Die Spec-Sicht in Red/Green reduziert offenbar Green-Antizipation (weniger Tests, die schon grün sind, bevor Red sie aktiviert). Aber dieser Disziplin-Gewinn übersetzt sich nicht in Korrektheit — was ein Hinweis darauf ist, dass passed_immediately ein sekundärer Mechanismus ist, nicht der dominante.

**Verfeinerte Hypothese (ersetzt "überkreativ" aus F-model-novel.2 für 4.7):**

Auf opus-4-7 ist der dominante Failure-Mode in v4 **eine unvollständige Test-Liste, die eine ganze Spec-Operation (z.B. `claim`) ausblendet** — analog zum dokumentierten 4.6-Failure auf v6 (Claim-Hälfte verloren, F-model-novel.2). Sobald die Test-Liste vollständig ist (v4.1), sind die nachfolgenden Subagent-Phasen (Red/Green) durch die aktivierten Tests ausreichend gesteuert. Zusätzlicher Spec-Kontext in Red/Green (v4.2) bringt keinen Mehrwert und verschlechtert sogar — möglicher Mechanismus: Red/Green re-interpretieren die Spec statt sich strikt am aktiven Test zu orientieren.

**Folge für F-model-novel.2:** "4.7 wird überkreativ bei Mehrdeutigkeiten" beschreibt das Symptom, nicht den Mechanismus. Der eigentliche Mechanismus liegt eine Stufe früher — im `test-list`-Schritt. v6 ist auf 4.7 nicht überlegen, *weil* Red kein Subagent ist, sondern *weil* das Single-Context-Setup unvollständige Test-Listen strukturell verhindert.

**Aufgelöst (2026-05-22):** Zwei v4.2.1-Runs zeigen verification_pct 0.73 und 0.67 — beide innerhalb der v4.2-Range und deutlich unter v4.1. passed_immediately fiel auf 12 (vs. v4.2: 14, v4.1: 22.2), aber Korrektheit profitiert nicht. Die Wallclock stieg um ~50 % gegenüber v4.2 (5500s vs. 4500s), weil Refactor mehr Arbeit übernimmt, wenn Green nur fakes (40 Refactorings statt 25.7).

**Endgültiger Schluss:** Green-Antizipation ist KEIN zweiter unabhängiger Failure-Mode auf 4.7 — das Senken von passed_immediately durch Fake-it ist real, übersetzt sich aber nicht in Korrektheit. **Test-Listen-Vollständigkeit (v4.1) ist der einzig relevante Workflow-Hebel auf 4.7 für claim-office-Korrektheit.** Der v4.2-Zweig (shared-context-Files für Red/Green) wurde am 2026-05-22 verworfen; die Workflow-Definitionen liegen archiviert in `experiments/workflows/_archive/`. Konsequenz für künftige Workflow-Designs siehe `research/workflow-dev/workflow-construction.md` → "Shared-context-Files für Red/Green sind kein Korrektheits-Hebel auf 4.7".
