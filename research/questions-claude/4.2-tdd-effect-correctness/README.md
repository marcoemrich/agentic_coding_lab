---
id: RQ-tdd-correctness
question: "Unterscheidet sich die externe Korrektheit (verification_pct) zwischen TDD-Workflow-Varianten auf der neuartigen claim-office-Kata?"
factors:
  workflow_x_prompt:
    # TDD-Achse (gefixte Linie)
    - {workflow: v3-basic-tdd,                                  prompt: example-mapping}
    - {workflow: v4.1-testlist-scope-fix,                       prompt: example-mapping}
    - {workflow: v5.1-testlist-scope-fix,                       prompt: example-mapping}
    - {workflow: v6.1-hybrid-testlist-scope-fix,                prompt: example-mapping}
    - {workflow: v7.1-hybrid-green-refactor-testlist-scope-fix, prompt: example-mapping}
    # Non-TDD-Kontrollgruppe: vibe-coding + tests + einmaliges End-Refactoring
    - {workflow: v8a-delayed-refactor-agent,                    prompt: example-mapping}
    - {workflow: v8b-delayed-refactor-native,                   prompt: example-mapping}
controls:
  model:
    any:                            # OR-match: bestehende Direct-Runs wiederverwenden, neue via Portkey
      - opus-4-7-portkey-no-thinking
      - opus-4-7-no-thinking
  kata_base: claim-office
outcomes:
  - verification_pct
  - verification_passed
  - verification_total
  - tests_passing
  - completed_within_budget
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  - tests_passed_immediately
  - duration_seconds
  - total_tokens
min_replicates: 3
status: aktiv
---

# RQ-tdd-correctness: Workflow-Effekt auf Korrektheit (claim-office)

Unterscheidet sich die externe Korrektheit (`verification_pct`) zwischen TDD-Workflow-Varianten, wenn das Modell eine neuartige, nicht in Trainingsdaten enthaltene Kata loesen muss?

## Motivation

RQ-tdd-quality untersucht den Workflow-Effekt auf *Code-Qualitaet* (game-of-life). Hypothese H4 dort nimmt an, dass `verification_pct` workflow-unabhaengig bei ~1.0 liegt — aber diese Annahme basiert auf trainingsbekannten Katas, bei denen das Modell die Loesung "kennt".

Auf claim-office (novel kata, nicht in Trainingsdaten) ist Korrektheit nicht selbstverstaendlich. Hier koennte die Workflow-Struktur einen messbaren Einfluss haben:
- Minimal-TDD (v3) erzwingt nur lose inkrementelle Verifikation.
- v4.1 (testlist-scope-fix, isolierte Subagents) begrenzt den Scope pro Zyklus explizit und arbeitet phasen-isoliert.
- v5.1 (testlist-scope-fix, Single-Context) nutzt denselben Phasen-Skript-Inhalt wie v4.1, aber im geteilten Kontext.
- v6.1 (hybrid) kombiniert Skill-basierte Red/Green im Shared-Context mit isoliertem Refactor-Subagent.
- v7.1 (hybrid-green-refactor) isoliert zusaetzlich zur Refactor- auch die Green-Phase als Subagent; Test-Liste und Red bleiben Skills im Shared-Context.

Alle vier strukturierten Workflows tragen den test-list-scope-fix ("Cover every spec example"). Die Frage ist, ob die Kontext-Architektur-Unterschiede sich in der Aussen-Korrektheit niederschlagen, *bevor* wir Code-Qualitaet vergleichen.

Zusaetzlich aufgenommen ist eine **Non-TDD-Kontrollgruppe** (v8a/v8b), um die kritische Vorfrage zu beantworten: *ist TDD ueberhaupt notwendig fuer Korrektheit, oder erreicht Vibe-Coding + nachtraegliche Tests + einmaliges End-Refactoring dasselbe `verification_pct`-Niveau?* Diese Kontrolle steht orthogonal zu H1/H2/H3 (die TDD-Inner-Vergleich machen) — siehe H4 unten.

## Non-TDD-Kontrollgruppe (v8a, v8b)

v8a und v8b sind keine TDD-Workflows, sondern Drei-Phasen-Kontrollen:

- **v8a-delayed-refactor-agent** — Phase 1: Implementation ohne Tests. Phase 2: Test-Suite gegen `prompt.md` (mit "Cover every spec example"-Pflicht, gleich wie der test-list-scope-fix). Phase 3: einmaliger Refactor via Subagent (`refactor.md` inhaltlich identisch zu v6.1/v7.1 — Four Rules of Simple Design + APP + Naming + Mandatory-Attempt).
- **v8b-delayed-refactor-native** — identisch zu v8a in Phase 1+2 **und Phase 3 inhaltlich** (Four Rules + APP + Naming + Mandatory-Attempt), aber Phase 3 wird ueber den Slash-Command `/refactor` (`.claude/commands/refactor.md`) **inline im Haupt-Session-Kontext** ausgefuehrt statt als frischer Subagent gespawnt. Strukturell symmetrisch zu v8a (`.claude/agents/refactor.md`): beide externalisieren die Refactor-Spec in eine eigene Datei, einzige Differenz ist Agent-Spawn vs Command-Invocation. v8a vs v8b isoliert damit den **Subagent-Mechanismus** bei sonst identischem Refactor-Inhalt und Timing.

TDD-Disziplin-Metriken (`cycle_count`, `refactorings_applied`, `predictions_correct_rate`, `tests_passed_immediately`) sind in den v8-Armen **by-design null** — sie liegen ausserhalb des Vergleichs. Outcome-Vergleich gegen die TDD-Arme laeuft ueber `verification_pct`, `tests_passing`, `completed_within_budget` und Kosten.

## Design

```
Faktor:    workflow_x_prompt  — 7 Stufen (TDD-Achse: v3+EM, v4.1+EM,
                                          v5.1+EM, v6.1+EM, v7.1+EM
                                          Non-TDD-Kontrolle: v8a+EM, v8b+EM)
Kontrolle: model              — opus-4-7-no-thinking (Portkey ODER Direct, OR-match, siehe Caveat a)
Kontrolle: kata_base          — claim-office

Zellen:    7
Replikate: n = 3
Runs:      vollstaendig neu zu erheben (gefixte Linie + v8-Kontrolle)
```

> **Historische Notiz:** Die ursprüngliche Frontmatter enthielt zusätzlich
> v4.2-shared-context und v4.2.1-fake-it-green als Workflow-Stufen. Beide
> wurden 2026-05-22 entfernt, nachdem die Daten klar zeigten, dass der
> shared-context-Zweig keine Korrektheits-Verbesserung gegenüber v4.1
> bringt (siehe `research/workflow-dev/workflow-construction.md` und
> F-model-novel.4 in [RQ-model-novel](../RQ-model-novel-model-effect-novel-kata/findings.md)). Die
> archivierten Workflow-Definitionen liegen in
> `experiments/workflows/_archive/`; die 5+2 abgeschlossenen Runs bleiben
> als historische Datenpunkte erhalten, werden aber nicht mehr für die
> Aggregation gematcht.
>
> Ebenfalls 2026-05-22 wurde die RQ auf die **gefixte Workflow-Linie**
> umgestellt: v4-exact-subagents → v4.1-testlist-scope-fix,
> v5-exact-single-context → v5.1-testlist-scope-fix,
> v6-hybrid → v6.1-hybrid-testlist-scope-fix. Alle drei strukturierten
> Workflows tragen jetzt den test-list-scope-fix; v4.1 und v5.1 sind so
> abgeleitet, dass ihr Phasen-Skript-Inhalt identisch ist und sich nur im
> Aufruf-Mechanismus unterscheidet (vgl. RQ-context). Die alten v4-/v5-/v6-Runs
> sind damit nicht mehr übertragbar — die Zellen werden neu erhoben.

## Hypothesen

- **H1 (Korrektheit variiert zwischen Workflows)**: `verification_pct` unterscheidet sich signifikant zwischen den 5 TDD-Workflow-Stufen. Phasen-strukturierte Workflows (v4.1/v5.1/v6.1/v7.1) erreichen hoehere Korrektheit als minimal-TDD (v3), weil inkrementelle Verifikation bei unbekannten Anforderungen wichtiger ist als bei trainingsbekannten Katas.
- **H2 (Kontext-Architektur bei gleichem Scope-Fix)**: Da v4.1 und v5.1 denselben Phasen-Skript-Inhalt inkl. test-list-scope-fix tragen und sich nur in der Kontext-Architektur (isolierte Subagents vs. Single-Context) unterscheiden, isoliert ihr `verification_pct`-Vergleich den reinen Kontext-Effekt auf Korrektheit. Erwartung: gering — der Scope-Fix ("Cover every spec example") dominiert ueber die Architektur.
- **H3 (Korrektheit ist hoch ueber alle Workflows)**: Nullhypothese — `verification_pct` ist fuer alle Workflows aehnlich hoch (>0.8). Die Workflow-Struktur beeinflusst *wie* der Code entsteht, nicht *ob* er korrekt ist. Das waere konsistent mit RQ-tdd-quality H4.
- **H4 (TDD ist notwendig fuer Korrektheit auf novel kata)**: Die TDD-Arme (v3/v4.1/v5.1/v6.1/v7.1) erreichen hoehere `verification_pct` als die Non-TDD-Kontrollgruppe (v8a/v8b). Der Mechanismus: inkrementelle Test-Definition pro Cycle zwingt zur fortlaufenden Spec-Re-Lektuere, waehrend Vibe-Coding in Phase 1 sich auf den ersten Spec-Lese-Eindruck verlaesst und in Phase 2 Tests gegen die eigene Implementation neigt zu schreiben (siehe Caveat e). Falsifikation: v8a/v8b liegen innerhalb 1 σ der TDD-Arme — dann ist der Vibe-+-End-Refactor-Ansatz fuer Korrektheit-aussen aequivalent.

**Falsifikation H1** (verification_pct ueberlappt vollstaendig zwischen TDD-Stufen): Workflow-Struktur hat innerhalb der TDD-Achse keinen Korrektheits-Effekt auf novel katas — Korrektheit ist primaer modell-getrieben.

**Falsifikation H4** (v8a/v8b ≈ TDD-Arme): Der TDD-Vorteil fuer Korrektheit ist auf claim-office nicht empirisch stuetzbar — Konsequenz fuer die Empfehlung "TDD ist fuer novel katas wertvoll" aus RQ-prompt-correctness / RQ-model-novel.

## Abgrenzung zu RQ-tdd-quality

| | RQ-tdd-quality | RQ-tdd-correctness |
|---|---|---|
| Primaer-Outcome | Code-Qualitaet | Korrektheit |
| Kata | game-of-life (trainingsbekannt) | claim-office (novel) |
| Modell | opus-4-7-no-thinking | opus-4-7 (Portkey ODER Direct, siehe Caveat a) |
| Workflows | v1–v6.1 + v8a/v8b | gefixte Linie v3/v4.1/v5.1/v6.1/v7.1 + v8a/v8b |
| Non-TDD | v1+v2 (prompt-rein) + v8a/v8b (struktur-rein) | v8a/v8b (struktur-reine Non-TDD-Kontrollgruppe) |
| Sub-Varianten | keine | gefixte Linie (v4.2/v4.2.1-Zweig 2026-05-22 verworfen, siehe historische Notiz oben) |

## Caveats

- **(a) Routing gemischt**: `controls.model` ist eine ODER-Liste `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. Bestehende Direct-Runs (39 Stk., aufgebaut vor Portkey-Umstieg) werden weiterverwendet, neue Refill-Runs gehen ueber Portkey (erstes Listenelement). In den Aggregations-Pivots werden beide Routen als eine Zelle behandelt — Annahme: Routing hat keinen Korrektheits-Effekt (selbes Modellgewicht, selbe Sampling-Parameter). Falls Pivots starke Routing-bedingte Streuung zeigen, kann die Zerlegung durch Gruppierung nach `model` (statt `cell_model`) in `runs.csv` debugged werden.
- **(b) Portkey-Routing-Charakteristik**: Portkey kann anderes Retry-/Timeout-Verhalten haben als Direct. Auf `verification_pct` kein Effekt erwartet, auf `completed_within_budget`/`duration_seconds` aber moeglich. Wird in den Pivots beobachtet.
- **(c) Prompt-Stil einheitlich**: Alle Workflows nutzen `example-mapping`. Der Prompt-Stil-Effekt auf claim-office (RQ-prompt-correctness) wird hier nicht kontrolliert, aber da alle Zellen denselben Stil nutzen, ist er kein Confounder.
- **(d) v8 auf example-mapping ist kein reines Vibe-Coding**: Die Beispiel-Liste im Prompt ist faktisch eine implizite Test-Spec, die das Modell in Phase 1 mitlesen und in Phase 2 in Tests konvertieren kann. Das verfaelscht die "Vibe-Coding vs TDD"-Achse leicht zugunsten von v8, ist aber fuer die **Refactor-Zeitpunkt-/Korrektheits-Achse** (H4) akzeptabel: alle Arme bekommen identische Spec-Strukturierung; einzige Variable ist *wann* Tests/Refactor passieren (periodisch waehrend der Implementation vs einmal am Ende). Ein "rein vibe" Non-TDD-Arm (z.B. v1+prose) wuerde Spec-Stil-Effekt mit Workflow-Effekt vermischen.
- **(e) v8-Tests gegen Implementation statt Spec**: Phase 2 von v8a/v8b enthaelt zwar die explizite Pflicht "source of behavior is `prompt.md` — not the implementation you just wrote", aber das Modell hat seine eigene Implementation gerade frisch im Kontext. Selbst mit Spec-Anker bleibt ein Bias-Risiko: Tests koennten implizit der Implementation folgen statt der Spec, insbesondere bei Mehrdeutigkeiten. Diese Schwaeche ist Teil dessen, was H4 messen will — sie ist nicht zu reparieren, ohne v8 zu TDD zu machen.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v3-basic-tdd, v4.1-testlist-scope-fix, v5.1-testlist-scope-fix, v6.1-hybrid-testlist-scope-fix, v7.1-hybrid-green-refactor-testlist-scope-fix, v8a-delayed-refactor-agent, v8b-delayed-refactor-native}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (ODER-Match, siehe Caveat a).
