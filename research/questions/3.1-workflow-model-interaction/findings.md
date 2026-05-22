# Findings: RQ-21 — Workflow×Modell-Interaktion

Datenbasis: `claim-office-example-mapping`, externe Verifikations-Suite (`verification_pct`).
Herkunft: herausgelöst aus der Lokalisierungs-RQ `research/workflow-dev/5.1-correctness-regression/`
(vormals F-19.6), wo die v4/v5/v6-Spalten als Nebenbefund anfielen.

## F-21.1 — v4 und v6 tauschen je nach Modell die Plätze

| Workflow | opus-4-7 (n) | opus-4-6 (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** (5) |
| v5-exact-single-context | 0.87 (10) | 0.87 (5) |
| v6-hybrid | **1.00** (5) | 0.68 (15) |

v4 und v6 sind **modell-abhängig komplementär**: v6-hybrid ist opus-4-7-Optimum (1.00), aber auf
opus-4-6 instabil (0.68). v4-exact-subagents ist auf opus-4-6 stabil (0.93), aber auf opus-4-7
bimodal (0.67). v5 ist modell-unabhängig konstant (0.87).

Es gibt damit **keinen universell besten Workflow** auf dieser Achse — die Wahl ist
modell-bedingt. Die Praxis-Empfehlung daraus steht in
`research/workflow-dev/model-recommendation-matrix.md`.

## F-21.2 — Mechanismus: Orchestrierungs-Delegation vs. expliziter Subagent-Prompt

v6-hybrid delegiert die Orchestrierung an das Modell (Skill-Invocation-Semantik im shared Context).
opus-4-7 beherrscht das. opus-4-6 verliert in ~40 % der Runs die Claim-Hälfte der Spec — das Modell
implementiert nur Quote und ignoriert Claim komplett (`grep "claim\|payout\|deductible"
claim-office.ts` = 0 Treffer, `tests_total` trotzdem 19–23 weil die internen Tests nur Quote
abdecken).

v4 gibt jeder Phase einen expliziten Subagent-Prompt. opus-4-6 profitiert von dieser Struktur,
opus-4-7 wird auf v4 "überkreativ" und trifft bei Mehrdeutigkeiten häufiger die falsche Lesart.
