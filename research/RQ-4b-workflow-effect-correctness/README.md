---
id: RQ-4b
question: "Unterscheidet sich die externe Korrektheit (verification_pct) zwischen TDD-Workflow-Varianten auf der neuartigen claim-office-Kata?"
factors:
  workflow_x_prompt:
    - {workflow: v3-basic-tdd,             prompt: example-mapping}
    - {workflow: v4-exact-subagents,        prompt: example-mapping}
    - {workflow: v4.1-testlist-scope-fix,   prompt: example-mapping}
    - {workflow: v5-exact-single-context,   prompt: example-mapping}
    - {workflow: v6-hybrid,                 prompt: example-mapping}
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
min_replicates: 5
status: aktiv
---

# RQ-4b: Workflow-Effekt auf Korrektheit (claim-office)

Unterscheidet sich die externe Korrektheit (`verification_pct`) zwischen TDD-Workflow-Varianten, wenn das Modell eine neuartige, nicht in Trainingsdaten enthaltene Kata loesen muss?

## Motivation

RQ-4 untersucht den Workflow-Effekt auf *Code-Qualitaet* (game-of-life). Hypothese H4 dort nimmt an, dass `verification_pct` workflow-unabhaengig bei ~1.0 liegt — aber diese Annahme basiert auf trainingsbekannten Katas, bei denen das Modell die Loesung "kennt".

Auf claim-office (novel kata, nicht in Trainingsdaten) ist Korrektheit nicht selbstverstaendlich. Hier koennte die Workflow-Struktur einen messbaren Einfluss haben:
- Strikte TDD-Phasen (v4/v4.1/v5) erzwingen inkrementelle Verifikation.
- v4.1 (testlist-scope-fix) begrenzt den Scope pro Zyklus explizit.
- v4.2 (shared-context) kombiniert Subagent-Phasen mit geteiltem Kontext.
- v6 (hybrid) nutzt eine andere Refactor-Architektur.

Die Frage ist, ob diese strukturellen Unterschiede sich in der Aussen-Korrektheit niederschlagen, *bevor* wir Code-Qualitaet vergleichen.

## Design

```
Faktor:    workflow_x_prompt  — 5 Stufen (v3+EM, v4+EM, v4.1+EM,
                                          v5+EM, v6+EM)
Kontrolle: model              — opus-4-7-no-thinking (Portkey ODER Direct, OR-match, siehe Caveat a)
Kontrolle: kata_base          — claim-office

Zellen:    5
Replikate: n = 5
Runs:      34 total (Bestand)
```

> **Historische Notiz:** Die ursprüngliche Frontmatter enthielt zusätzlich
> v4.2-shared-context und v4.2.1-fake-it-green als Workflow-Stufen. Beide
> wurden 2026-05-22 entfernt, nachdem die Daten klar zeigten, dass der
> shared-context-Zweig keine Korrektheits-Verbesserung gegenüber v4.1
> bringt (siehe `research/workflow-design/workflow-construction.md` und
> F-3b.4 in [RQ-3b](../RQ-3b-model-effect-novel-kata/findings.md)). Die
> archivierten Workflow-Definitionen liegen in
> `experiments/workflows/_archive/`; die 5+2 abgeschlossenen Runs bleiben
> als historische Datenpunkte erhalten, werden aber nicht mehr für die
> Aggregation gematcht.

## Hypothesen

- **H1 (Korrektheit variiert zwischen Workflows)**: `verification_pct` unterscheidet sich signifikant zwischen den 5 Workflow-Stufen. Phasen-strukturierte Workflows (v4/v4.1/v5) erreichen hoehere Korrektheit als minimal-TDD (v3), weil inkrementelle Verifikation bei unbekannten Anforderungen wichtiger ist als bei trainingsbekannten Katas.
- **H2 (Scope-Begrenzung hilft)**: v4.1 (testlist-scope-fix) zeigt hoehere oder gleiche `verification_pct` wie v4 — die explizite Scope-Begrenzung im test-list-Subagent ("Cover every spec example") verhindert, dass eine ganze Spec-Operation aus der Test-Liste fehlt.
- **H3 (Korrektheit ist hoch ueber alle Workflows)**: Nullhypothese — `verification_pct` ist fuer alle Workflows aehnlich hoch (>0.8). Die Workflow-Struktur beeinflusst *wie* der Code entsteht, nicht *ob* er korrekt ist. Das waere konsistent mit RQ-4 H4.

**Falsifikation H1** (verification_pct ueberlappt vollstaendig): Workflow-Struktur hat keinen Korrektheits-Effekt auf novel katas — Korrektheit ist primaer modell-getrieben.

## Abgrenzung zu RQ-4

| | RQ-4 | RQ-4b |
|---|---|---|
| Primaer-Outcome | Code-Qualitaet | Korrektheit |
| Kata | game-of-life (trainingsbekannt) | claim-office (novel) |
| Modell | opus-4-7-no-thinking | opus-4-7 (Portkey ODER Direct, siehe Caveat a) |
| Workflows | v1–v6 (inkl. non-TDD) | v3–v6 (nur TDD-Varianten) |
| Non-TDD | v1, v2 enthalten | ausgeschlossen (keine Kontamination) |
| Sub-Varianten | keine | v4.1 zusaetzlich (v4.2/v4.2.1-Zweig 2026-05-22 verworfen, siehe historische Notiz oben) |

## Caveats

- **(a) Routing gemischt**: `controls.model` ist eine ODER-Liste `[opus-4-7-portkey-no-thinking, opus-4-7-no-thinking]`. Bestehende Direct-Runs (39 Stk., aufgebaut vor Portkey-Umstieg) werden weiterverwendet, neue Refill-Runs gehen ueber Portkey (erstes Listenelement). In den Aggregations-Pivots werden beide Routen als eine Zelle behandelt — Annahme: Routing hat keinen Korrektheits-Effekt (selbes Modellgewicht, selbe Sampling-Parameter). Falls Pivots starke Routing-bedingte Streuung zeigen, kann die Zerlegung durch Gruppierung nach `model` (statt `cell_model`) in `runs.csv` debugged werden.
- **(b) Portkey-Routing-Charakteristik**: Portkey kann anderes Retry-/Timeout-Verhalten haben als Direct. Auf `verification_pct` kein Effekt erwartet, auf `completed_within_budget`/`duration_seconds` aber moeglich. Wird in den Pivots beobachtet.
- **(c) Prompt-Stil einheitlich**: Alle Workflows nutzen `example-mapping`. Der Prompt-Stil-Effekt auf claim-office (RQ-1) wird hier nicht kontrolliert, aber da alle Zellen denselben Stil nutzen, ist er kein Confounder.

## Findings

Siehe [findings.md](findings.md).

## Datenquelle

Alle Runs in `experiments/runs/` mit
`workflow ∈ {v3-basic-tdd, v4-exact-subagents, v4.1-testlist-scope-fix, v4.2-shared-context, v5-exact-single-context, v6-hybrid}`,
`kata = claim-office-example-mapping`,
`model ∈ {opus-4-7-portkey-no-thinking, opus-4-7-no-thinking}` (ODER-Match, siehe Caveat a).
