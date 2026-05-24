---
id: RQ-why-block-effect-v6.1
question: "Tragen Why-Bloecke (kausale Begruendungen neben MUSTs) auf v6.1-Basis einen messbaren TDD-Disziplin- oder Korrektheits-Vorteil ueber rein imperative Anweisungen — bei voll erhaltenem PEP?"
factors:
  workflow_x_prompt:
    - {workflow: v6.1-hybrid-testlist-scope-fix, prompt: example-mapping}  # Baseline (kein Why)
    - {workflow: v6.1-with-why,                  prompt: example-mapping}  # mit Why-Bloecken aus lean uebernommen
controls:
  model: opus-4-7-portkey-no-thinking
  kata_base: claim-office
outcomes:
  # primaer: TDD-Disziplin (wo Why-Bloecke am ehesten wirken)
  - predictions_correct_rate
  - refactorings_applied
  - tests_passed_immediately
  - cycle_count
  # Korrektheit (claim-office hat echte Mehrdeutigkeiten)
  - verification_pct
  - tests_passing
  - completed_within_budget
  # Code-Qualitaet (sekundaer)
  - code_mass
  - smell_total
  - cc_longest_function
  - cognitive_max
  - mccabe_max
  # Kosten
  - duration_seconds
  - total_tokens
min_replicates: 8
status: aktiv
---

# RQ-why-block-effect-v6.1: Why-Block-Effekt auf v6.1-Basis (claim-office)

Tragen Why-Bloecke (kausale Begruendungen neben Imperativen) einen eigenstaendigen Beitrag zur TDD-Disziplin oder Korrektheit — oder ist der wahrgenommene Vorteil aus v6.5-lean vollstaendig durch die parallel entfernten PEP-/Emoji-Elemente erklaerbar?

## Motivation

Die v6.5-lean-Variante hat **drei orthogonale Aenderungen gleichzeitig** vorgenommen (vgl. v6.1-hybrid-testlist-scope-fix vs `_archive/v6.5-lean/`):

1. **PEP-/Mantra-Reduktion** in `commands/red.md` und `commands/green.md` — isoliert getestet in [RQ-pep-v6.1](../1.1-pep-effect-v6.1/findings.md).
2. **Emoji-/Glyph-Reduktion** in allen 5 Files (Section-Header, Output-Templates) — isoliert getestet in [RQ-emoji-v6.1](../1.2-emoji-effect-v6.1/findings.md).
3. **Why-Block-Addition**: drei neue Why-Begruendungen, die in v6.1 nicht existieren — `commands/green.md` "Why minimality matters", `commands/red.md` Step 7 "Why this format matters", `rules/tdd.md` "skill+subagent → measurement pipeline".

RQ-1.1, RQ-1.2 und RQ-1.3 (kombiniert) haben die ersten beiden Faktoren isoliert. RQ-1.5 schliesst die Luecke fuer den dritten: addiert die drei lean-Why-Bloecke auf die volle v6.1-Basis (PEP und Emojis bleiben erhalten), und vergleicht gegen v6.1-Baseline.

**Bisheriger Stand der Theory-of-Mind-Empfehlung:** `research/workflow-dev/workflow-construction.md` Zeilen 30–47 propagiert das Why-Block-Pattern auf Basis der Anthropic-Skill-Creator-Doku (`~/.claude/skills/skill-creator/SKILL.md` Zeilen 139, 302). Eine **empirische** Stuetze aus diesem Repo fehlt bisher. RQ-1.5 liefert sie — oder widerlegt sie.

## Workflow-Definition

- **v6.1-hybrid-testlist-scope-fix (Baseline, n=5)**: voll-imperative v6.1-Basis. Alle MUST/CRITICAL/🚨-Marker. Keine Why-Bloecke. Identisch zur Baseline in RQ-1.1/1.2/1.3/1.4.
- **v6.1-with-why (neu, n=5)**: identisch zu v6.1-hybrid-testlist-scope-fix, plus drei Why-Bloecke 1:1 aus `_archive/v6.5-lean/` uebernommen:
  - **commands/green.md**: "Why minimality matters"-Block nach Eroeffnungs-Heading, vor "Your Mission".
  - **commands/red.md** Step 7: "Why this format matters"-Block nach `MUST output … verbatim`-Anweisung, vor Output-Template. Erklaert den Parser-Regex.
  - **rules/tdd.md**: "skill+subagent → measurement pipeline"-Absatz nach v4/v5-Hybrid-Erklaerung, vor Checkliste.
- **Was unveraendert bleibt**: alle MUST/CRITICAL/🚨/⚠️-Marker, alle Skill-Tool-Calls, alle Parser-relevanten Marker (Predictions-Regex inkl. `✅`-Glyph, `Red Phase Complete`-Sentinel, `experiment-done.txt`-Termination). `commands/test-list.md` und `agents/refactor.md` byte-identisch zu v6.1. Keine PEP-/Mantra-Reduktion, keine Emoji-Entfernung.

## Hypothesen

- **H1 (Why-Bloecke wirkungslos neben MUSTs)**: v6.1-with-why und v6.1-hybrid statistisch ununterscheidbar auf allen primaeren Metriken (Median-Differenz innerhalb ±1σ der Baseline-Streuung).
  *Konsequenz:* Theory-of-Mind-Pattern ist neben Imperativen redundant. Lean's etwaiger Vorteil ist vollstaendig durch PEP-/Emoji-Wegfall erklaerbar, nicht durch Why-Addition. `workflow-construction.md` Empfehlung wird konditioniert: "Why-Bloecke ersetzen MUSTs sinnvoll, aber addieren neben ihnen nichts."

- **H2 (Why-Bloecke helfen messbar)**: v6.1-with-why verbessert mindestens eine TDD-Disziplin-Metrik um ≥ +1σ bei invariantem `verification_pct`. Plausibelster Kandidat: `predictions_correct_rate` — der red.md-Why erklaert explizit den Parser, das ist der direkteste kausale Pfad. Sekundaer plausibel: `refactorings_applied` (durch tdd.md-Why ueber Mess-Pipeline).
  *Konsequenz:* Theory-of-Mind-Pattern empirisch validiert. `workflow-construction.md` aktualisieren: "MUST X. Why: Y." als bevorzugter Default vor reinem MUST.

- **H3 (Why-Bloecke schaden)**: v6.1-with-why verschlechtert sich auf irgendeiner primaeren Metrik um ≥ +1σ (Why-Text verdraengt Aufmerksamkeit vom operationellen Signal, oder lenkt den Agenten in Meta-Reflexion ab).
  *Konsequenz:* Theory-of-Mind-Pattern muss bedingt formuliert werden — Why-Bloecke helfen nur, wenn Imperative entfernt werden, nicht zusaetzlich. Lean-Stil ist dann die einzige tragfaehige Variante.

**A-priori Erwartung:** H1 ist das wahrscheinlichste Szenario. Die drei Why-Bloecke adressieren Mess-Pipeline-Risiken (Marker-Konsistenz, Skill-Delegation), die v6.1's bestehende MUSTs bereits abdecken — die zusaetzliche Begruendung bringt wenig, wenn die Anweisung sowieso befolgt wird. H2 waere ueberraschend und ein starkes Argument fuer das Theory-of-Mind-Pattern.

## Design

```
Faktor:    workflow_x_prompt — 2 Stufen (beide mit example-mapping)
             v6.1-hybrid-testlist-scope-fix   (Baseline)
             v6.1-with-why                    (mit Why-Bloecken)
Kontrolle: model            — opus-4-7-portkey-no-thinking (sharded)
Kontrolle: kata_base        — claim-office

Zellen:    2 (2 Workflows x 1 Kata)
Replikate: n = 5
Runs:      10 total, davon 5 bereits vorhanden (v6.1-hybrid-Baseline-Zelle gefuellt)
Neue Runs: 5 (alle v6.1-with-why)
Shards:    Portkey, default
```

## Caveats

- **Single Kata, single Modell**: identische Einschraenkung wie RQ-1.4. claim-office ist der bewusst gewaehlte Korrektheits-Stresstest (15 Szenarien, granulare `verification_pct`-Skala).
- **Baseline-Zelle wird wiederverwendet**: die 5 bestehenden `v6.1-hybrid-testlist-scope-fix × claim-office-example-mapping × opus-4-7-portkey-no-thinking`-Runs aus RQ-1.4 sind die Baseline-Zelle. Triangulier-Check: Baseline-Zahlen in RQ-1.5 muessen zu den v6.1-hybrid-Zahlen in RQ-1.4 passen (gleiche Runs).
- **n=5 ist klein** fuer Effekte ≤ 0.5σ — H1 vs H2 ist bei sehr kleinen Effekten nicht trennbar.
- **Why-Block-Coverage ist selektiv**: nur die drei lean-Stellen bekommen einen Why; die uebrigen ~7 MUSTs in rules/tdd.md und alle 4 MUSTs in agents/refactor.md bleiben nackt. Falls H2 eintritt, ist die Frage offen, ob Why-Block-Vollabdeckung den Effekt verstaerkt — Anschluss-RQ-Frage.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v6.1-hybrid-testlist-scope-fix, v6.1-with-why}`,
`kata = claim-office-example-mapping`,
`model = opus-4-7-portkey-no-thinking`.
