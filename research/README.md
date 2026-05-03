# Research

Dieses Verzeichnis bündelt alle **Forschungsfragen** (RQs) des Lab und die
darunter gesammelten Findings.

## Konzept

Eine RQ definiert per **Kontroll-Variablen** und **Faktoren** eine
Selektor-Query über `experiments/runs/`. Daraus werden on-demand
`runs.csv` und `summary.md` aggregiert (geplantes Tool:
`experiments/aggregate-by-query.sh`). Die `findings.md` der RQ sammelt
die Erkenntnisse als persistente, wachsende Liste.

Batch-Plans (`experiments/batch-plans/*.json`) sind reine
**Daten-Sammel-Werkzeuge**: Sie weisen den Batch-Runner an, welche Runs
noch fehlen, damit eine RQ ihre `min_replicates` erreicht. Geplant:
`batch-plan-from-rq.py` generiert sie automatisch aus dem RQ-Frontmatter.

Aggregationen sind **query-spezifisch**, nicht batch-spezifisch — die
Auswertung einer RQ konsumiert *alle* matching Runs in
`experiments/runs/`, nicht nur die eines bestimmten Batches. Mehr
Replikate sammeln = mehr Daten ohne Plan-Pflege.

## Aktuelle RQs

| RQ | Frage | Status |
|---|---|---|
| [RQ-1](RQ-1-workflow-effect/) | Wirkt der gewählte Workflow auf Code-Qualität, Korrektheit und TDD-Disziplin? | aktiv |
| [RQ-2](RQ-2-prompt-style/) | Wirkt Prompt-Stil (prose / example-mapping / user-story) auf Code-Qualität und Korrektheit? | aktiv |
| [RQ-3](RQ-3-model-and-thinking/) | Wirken Modell-Klasse (Opus / Sonnet / Haiku) und Thinking-Mode auf Output-Qualität und Effizienz? | aktiv |
| [RQ-4](RQ-4-workflow-model-interaction/) | Profitieren schwächere Modelle stärker von strikteren Workflows als starke? | aktiv |
| [RQ-5](RQ-5-run-stability/) | Wie groß ist die Run-zu-Run-Varianz innerhalb identischer Zellen? | aktiv |

## Methoden-Constraints

Diese Regeln gelten lab-weit und werden von allen RQs respektiert:

### Workflow → erlaubte Prompt-Stile

Aus methodischer Symmetrie:

| Workflow | erlaubte Prompt-Stile | Begründung |
|---|---|---|
| v1-oneshot, v2-iterative | nur **prose** | Test-Beispiele aus example-mapping/user-story wären für Non-TDD-Workflows ein verstecktes Test-Geschenk → unfair gegenüber den TDD-Workflows. |
| v3-basic-tdd, v4-exact-subagents, v5-exact-single-context | **prose, example-mapping, user-story** | Beispiele dienen als natürliche Test-Cases — für TDD-Workflows ist das das Idealbild der Aufgabe. |

Konsequenz für RQ-Designs:

- **Workflow als Faktor** (RQ-1, RQ-4): Faktor heißt `workflow_x_prompt`
  und ist eine gepaarte Liste `{workflow, prompt}`-Tupel. Default-Pairing:
  v1/v2 → prose, v3/v4/v5 → example-mapping (sog. "fairer" Vergleich).
- **Workflow als Kontroll-Variable** (RQ-2, RQ-3): `controls.workflow`
  und `controls.prompt` werden zusammen gesetzt, mit
  Constraint-Beachtung.

### Aktive Katas

Stand 2026-05-04: **game-of-life** und **mars-rover** (jeweils alle drei
Prompt-Stile). string-calculator und pixel-art-scaler wurden gedroppt
(zu trivial, 0 Smells durchgehend). Details siehe Commit-History.

Hinweis: Bisherige Runs decken hauptsächlich game-of-life (alle Stile)
und mars-rover-prose ab. mars-rover-{example-mapping, user-story}
wurden noch kaum erhoben — wenn eine RQ sie braucht, liefert die
Selektor-Query erstmal eine kleine Stichprobe.

### Modell-Aliase

Volle API-IDs in RQ-Frontmatter pinnen, nicht Kurz-Aliase:
- `claude-opus-4-7` (Adaptive Thinking)
- `claude-opus-4-7-no-thinking`
- `claude-sonnet-4-6` (Extended Thinking)
- `claude-haiku-4-5-20251001` (Extended Thinking)

`opus`/`sonnet` als Alias lösen NICHT zur jeweils neuesten Version auf.

## Frontmatter-Schema

```yaml
---
id: RQ-N
question: "Volltext der Forschungsfrage"
factors:                          # was variiert wird
  <faktor-name>: [<value>, ...]
  # ODER für gepaarte Faktoren:
  workflow_x_prompt:
    - {workflow: v1-oneshot, prompt: prose}
    - ...
controls:                         # was konstant gehalten wird
  <var>: <value>
outcomes: [<metric>, ...]         # welche Metriken gemessen werden
min_replicates: N                 # pro Zelle
status: aktiv | partiell | abgeschlossen
---
```

## Findings-Status-Legende

- `✅ haltbar` — Daten stützen den Befund robust (n≥3, klares Signal)
- `⚠️ revidiert` — teilweise haltbar, Aussage muss präzisiert werden
- `❌ verworfen` — Daten widersprechen dem Befund klar
- `🚫 nicht prüfbar` — Datenbasis fehlt; Status offen

## Archiv

`_archive/` enthält eingefrorene Wissensstände (z.B. Findings-Validation
2026-05-04), die durch die aktuellen RQs reproduziert werden, aber als
historischer Snapshot erhalten bleiben.
