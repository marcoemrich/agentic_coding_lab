# Workflow-Empfehlung pro Modell

Leitplanke für die Workflow-Weiterentwicklung: **es gibt keinen universell besten Workflow.** Die
Güte eines Workflows hängt vom eingesetzten Modell ab — auf der Architektur-Achse (v4/v5/v6) tauschen
v4 und v6 je nach Modell die Plätze. Wer einen Workflow optimiert, muss das Zielmodell mitnennen;
eine Verbesserung auf opus-4-7 ist nicht automatisch eine auf opus-4-6.

Vollständiger Befund (Tabelle, Stichproben, Mechanismus):
`research/questions/3.1-workflow-model-interaction/findings.md` (RQ-21, F-21.1/F-21.2).

## Empfehlung (Korrektheit auf novel Kata, `claim-office-example-mapping`)

| Modell | empfohlener Workflow | verification_pct (n) | Begründung |
|---|---|---:|---|
| opus-4-7-no-thinking | **v6-hybrid** | 1.00 (5) | beherrscht die Orchestrierungs-Delegation im shared Context |
| opus-4-6-portkey-no-thinking | **v4-exact-subagents** | 0.93 (5) | profitiert vom expliziten Subagent-Prompt pro Phase |
| (modell-unabhängig als Fallback) | v5-exact-single-context | 0.87 | konstant über beide Modelle, kein Spitzenwert |

## Konsequenz für die Weiterentwicklung

- Workflow-Optimierungen, die auf opus-4-7 gemessen wurden (die gesamte v6.5-Reduktionskette unter
  `research/workflow-dev/2.*`/`3.*`), gelten **nur für opus-4-7**, bis sie cross-model repliziert
  sind.
- Vor jeder „dieser Workflow ist besser"-Aussage: auf welchem Modell? Cross-Model-Replikation ist
  Pflicht, bevor eine Empfehlung modell-unabhängig formuliert wird.
