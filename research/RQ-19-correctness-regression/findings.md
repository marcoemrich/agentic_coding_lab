# RQ-19 Findings

Lokalisierung der `verification_pct`-Regression auf `claim-office-example-mapping × opus-4-7-no-thinking` entlang der v6-Optimierungskette. n=3–10 pro Workflow (Triage-Probe).

## Übersicht: verification_pct pro Workflow

| Workflow | n_ok | mean | Einzelwerte | Quelle |
|---|---:|---:|---|---|
| `v6-hybrid` | 5 | **1.00** | 1 1 1 1 1 | RQ-7-Pool |
| `v6.1-no-app` | 3 | **1.00** | 1 1 1 | RQ-19 |
| `v6.2-no-rules` | 3 | **1.00** | 1 1 1 | RQ-19 |
| `v6.3-no-pep` | 3 | **1.00** | 1 1 1 | RQ-19 |
| `v6.4-no-emoji` | 3 | 0.93 | 0.80 1 1 | RQ-19 |
| **`v6.5-lean`** | 3 | **0.38** | 0 0.13 1 | RQ-19 |
| `v6.5.1-orchestration-audited` | 3 | 0.36 | 0 0.07 1 | RQ-19 |
| `v6.5.2-bullets-cut` | 3 | 0.51 | 0.13 0.67 0.73 | RQ-19 |
| `v6.5.3-targeted-cuts` | 1 | 0.73 | 0.73 (zu dünn) | RQ-19 |
| `v6.5.4-refactor-cut-only` | 10 | 0.40 | 0 0 0 0.13 0.13 0.20 0.67 0.87 1 1 | RQ-18.1 |

## F-19.1 — Bruchstelle ist v6-hybrid → v6.5-lean

Alle vier Einzel-Cut-Varianten (v6.1 bis v6.4) halten Korrektheit auf claim-office stabil (mean ≥ 0.93). Der Sprung von 1.00 auf 0.38 tritt erst bei v6.5-lean auf — und keine nachfolgende Iteration (v6.5.1 Audit, v6.5.2 Bullets, v6.5.3 targeted, v6.5.4 cut-only) hat ihn repariert. Die gesamte v6.5er-Quality-Optimierungskette (RQ-13 bis RQ-17) lief auf einem schon defekten Workflow.

## F-19.2 — Die Einzel-Cuts sind nicht der Täter

v6.5-lean bündelt vier Reduktionen plus strukturelle Rewrites:

| Komponente | Isoliert getestet? | Effekt auf verification_pct |
|---|---|---|
| APP-Heuristik raus | v6.1-no-app | 1.00 (kein Effekt) |
| Four Rules raus | v6.2-no-rules | 1.00 (kein Effekt) |
| Pep-Talks raus | v6.3-no-pep | 1.00 (kein Effekt) |
| Emojis raus | v6.4-no-emoji | 0.93 (marginal) |
| Project-Standards raus | nicht isoliert | unbekannt |
| **skill-creator-Why-Rewrites** | nicht isoliert | **Hauptverdächtiger** |

Die vier isoliert getesteten Cuts tragen die Regression nicht. Bleiben zwei untestete Komponenten: der Project-Standards-Cut und die skill-creator-Why-Rewrites (strukturelle Umformulierungen in `tdd.md`, `red.md` Step 7, `green.md` Minimality).

## F-19.3 — Why-Rewrites sind der Hauptverdächtige

Die skill-creator-Why-Rewrites haben `tdd.md` strukturell umgeschrieben: Checklist + Remember + redundante DO-NOTs raus, stattdessen einleitender "Why skills required"-Block mit Marker-Compliance-Begründung. `red.md` Step 7 bekam einen Why-Block. `green.md` erhielt eine gemergte Minimal-Strategies-Section + Why-Minimality-Block.

Diese Rewrites sind die einzige Komponente, die:
1. in keiner v6.1–v6.4-Variante enthalten ist (dort nur Cuts, keine Rewrites),
2. die Phasen-Mechanik (`tdd.md`, `red.md`, `green.md`) direkt betrifft,
3. in v6.5-lean erstmals eingeführt wurde und ab dort in allen Folge-Varianten bleibt.

Hypothese: die Why-Rewrites lockern die prozedurale Test-List-Disziplin. Im Kontext von game-of-life (trainingsbekannt, wenige Mehrdeutigkeiten) ist das ein Qualitäts-Gewinn — weniger starre Vorgaben, kreativere Lösungen. Im Kontext von claim-office (novel, 5 Mehrdeutigkeiten) führt die gelockerte Disziplin dazu, dass der Agent Mehrdeutigkeiten nicht systematisch abarbeitet, sondern interpretiert und überspringt.

Einschränkung: der Project-Standards-Cut (Hexagonal, DI, Named exports aus `refactor.md`) ist als Einzelfaktor nicht getestet. Ein Interaktions-Effekt zwischen diesem Cut und den Why-Rewrites ist nicht ausschließbar, aber unplausibel — die Project-Standards betreffen `refactor.md`, nicht die Phasen-Mechanik.

## F-19.4 — Die Korrektheits-Blindheit der v6.5er-RQ-Kette

RQ-13 bis RQ-17 haben Code-Qualität auf game-of-life gemessen. game-of-life hat keine externe Verification-Suite — `tests_passing=true` war die einzige Korrektheits-Prüfung, und die misst nur interne Konsistenz ("Code besteht seine eigenen Tests"). Ob der Agent die richtige Interpretation der Aufgabe gewählt hat, wurde nie extern geprüft.

Konsequenz: alle v6.5er-Quality-Wins (cognitive_max-Reduktion, Smell-Reduktion, σ-Stabilisierung) sind als Messungen valide, aber sie wurden auf einem Workflow erzielt, der auf novel Code systematisch falsche Ergebnisse produziert. Der "Default-Champion" v6.5.4 (RQ-17 F-17.2) ist nur Code-Quality-Champion, nicht Korrektheits-Champion.

## F-19.5 — Lehre für die Workflow-Methodik

Jede Workflow-Iteration braucht mindestens eine Korrektheits-Stichprobe auf einer Kata mit externer Verification-Suite, auch wenn die RQ primär Code-Qualität untersucht. Vorschlag: `claim-office-example-mapping × n=3` als Pflicht-Smoke vor jedem n=10-Quality-Batch in `workflow-construction.md` verankern.

## Nächster Schritt

Isolation der verdächtigen Komponente: v6.5-lean minus Why-Rewrites (alle vier Cuts angewandt, aber originale MUST/Procedure-Formulierungen aus v6-hybrid beibehalten) × claim-office-example-mapping × n=3. Falls dort verification_pct ≈ 1.0 → Why-Rewrites bestätigt als Täter. Falls auch dort Bruch → Bundle-Interaction-Effekt oder Project-Standards-Cut.
