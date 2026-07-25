---
id: RQ-model-quality-pi
question: "Wie unterscheiden sich die via pi-Harness (Requesty-Routing) erreichbaren Modelle in Code-Qualität und TDD-Disziplin auf game-of-life-example-mapping mit dem v6.2.1-phase-continuation-pi-Workflow?"
factors:
  model:
    - opus-4-8            # aktuelles Opus (vertex/bedrock claude-opus-4-8@eu)
    - sonnet-5            # aktuelles Sonnet (vertex/claude-sonnet-5@eu)
    - gpt-5-6-sol         # GPT SOL (azure/gpt-5.6-sol@swedencentral)
    - gpt-5-6-terra       # GPT TERRA (azure/gpt-5.6-terra@swedencentral)
    - glm-5-1             # GLM 5.1 (nebius/zai-org/glm-5.1)
    - glm-5-2             # GLM 5.2 (tensorx/glm-5.2)
    - kimi-k2-7           # aktuelles Kimi (tensorx/kimi-k2.7-code)
    - minimax-m3          # MiniMax M3 (tensorx/minimax-m3)
    - deepseek-v4-pro     # DeepSeek V4 Pro (tensorx/deepseek-v4-pro)
    - qwen3-235b          # aktuelles Qwen (nebius/qwen/qwen3-235b-a22b-instruct-2507)
controls:
  workflow: v6.2.1-phase-continuation-pi
  kata_base: game-of-life
  prompt: example-mapping
outcomes:
  # primär: Code-Qualität (game-of-life trägt das Code-Qualitäts-Signal)
  - code_mass
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - mccabe_avg
  - cc_longest_function
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - lines_of_code
  - smell_total
  - smell_complexity
  - smell_magic_numbers
  - smell_duplication
  # sekundär: Korrektheit
  - verification_pct  # extern (game-of-life-verification)
  - tests_passing     # intern (vitest)
  - tests_total
  # tertiär: TDD-Disziplin
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # Kontext
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-model-quality-pi: Modell-Effekt auf Code-Qualität (pi-Harness)

## Motivation

Mit pi als drittem Harness (nach Claude Code und OpenCode) werden Modelle über einen weiteren Routing-Pfad erreichbar: pi routet via **Requesty** (`provider=requesty`, `api:"openai-completions"`, Bearer-Auth), das GPT-5.x (Azure), kimi/minimax (Bedrock/Inceptron/TensorX), glm/deepseek (TensorX/Nebius), Gemini (Vertex) und Mistral/Nebius-Modelle unter einer OpenAI-kompatiblen Schnittstelle bündelt.

Diese RQ misst den **Modell-Effekt auf Code-Qualität und TDD-Disziplin** in einem harness-konstanten Setting (alle Zellen pi, alle gleicher Workflow, alle gleiche Kata). Sie ist das **direkte Pendant** zu RQ-model-quality (Claude-Code-Seite) und RQ-model-quality-oc (OpenCode-Seite) — aber mit `v6.2.1-phase-continuation-pi` als Workflow. Der Workflow-Unterschied muss bei Findings-Vergleichen über die Harnesse hinweg explizit benannt werden, KEIN 1:1-Transfer.

`game-of-life-example-mapping` als Kata: trägt das Code-Qualitäts-Signal (`smell_total`, `cognitive_max`, etc. differenzieren) und ist example-mapping-kompatibel (v6.2.1 erlaubt wie v6.2 alle drei Prompt-Stile). claim-office wird parallel in RQ-model-novel-pi untersucht (Korrektheit als primärer Outcome).

## Harness-Status: Walking Skeleton

**Stand 2026-07-24**: Die Lab-Variant→pi-Modell-Mappings für alle `factors.model`-Werte dieser RQ sind in `experiments/docker/run-batch.sh` (`harness = pi`-Branch, `case "$model_name"`) verdrahtet, mit IDs 1:1 aus `pi-config/agent/models.json`:

| Lab-Variant | Requesty-Route |
|---|---|
| `opus-4-8` | `requesty/vertex/claude-opus-4-8@eu` |
| `sonnet-5` | `requesty/vertex/claude-sonnet-5@eu` |
| `gpt-5-6-sol` | `requesty/azure/gpt-5.6-sol@swedencentral` |
| `gpt-5-6-terra` | `requesty/azure/gpt-5.6-terra@swedencentral` |
| `glm-5-1` | `requesty/nebius/zai-org/glm-5.1` |
| `glm-5-2` | `requesty/tensorx/glm-5.2` |
| `kimi-k2-7` | `requesty/tensorx/kimi-k2.7-code` |
| `minimax-m3` | `requesty/tensorx/minimax-m3` |
| `deepseek-v4-pro` | `requesty/tensorx/deepseek-v4-pro` |
| `qwen3-235b` | `requesty/nebius/qwen/qwen3-235b-a22b-instruct-2507` |

Diese RQ ist zunächst **offen (n=0)**: Mapping steht, aber pro Modell fehlt noch der erste Batch. Vorgehen identisch zum Start von `questions-opencode/`. Der Workflow `v6.2.1-phase-continuation-pi` adressiert gezielt den Continuation-Drop am Übergang Test-List→Red, der unter `v6.2-with-why-cleaned-pi` bei kimi und minimax Runs abbrechen ließ (nur Test-List, kein `src/cli.ts`). Smoke-Beleg auf claim-office × v6.2.1 (2026-07-25): kimi-k2-7 und minimax-m3-no-thinking laufen jetzt autonom durch (`cli_built=true`, grüne Tests, `experiment-done.txt`). Ob jedes Modell den Loop stabil zu Ende führt, ist pro Zelle nach dem Erstbatch zu prüfen.

## Vorhandene Daten

- **Stand 2026-07-24**: Keine game-of-life-Runs für irgendeine Zelle dieser RQ. Erstbatch komplett offen. (Vorhandene pi-Runs auf `v6.2-with-why-cleaned-pi` und `v6.2.1-phase-continuation-pi` liegen auf claim-office, nicht auf game-of-life — siehe RQ-model-novel-pi.)

## Modell-Auswahl

Die `factors.model`-Liste ist vom User gesetzt: aktuelles Opus + Sonnet (Anthropic-Anker, harness-übergreifend zu `-oc`/CC vergleichbar), GPT-5.6 **SOL und TERRA** (Intra-Familie-Varianten, analog zu GLM 5.1/5.2), GLM 5.1 **und** 5.2 (direkter Intra-Familie-Versionsvergleich), aktuelles Kimi, plus MiniMax M3, DeepSeek V4 Pro und aktuelles Qwen (qwen3-235b). Pro Modell gilt wie bei `-oc`: Aufnahme, wenn der autonome Loop unter `v6.2.1-phase-continuation-pi` sauber durchläuft und `src/cli.ts` geschrieben wird. Modelle, die den Skill-Loop nicht zuverlässig zu Ende führen (Continuation-Drop, done.txt mit roten Tests, kein cli.ts), werden mit Begründung aus der RQ genommen und hier dokumentiert — analog zur Gemini-2.5-Pro-/Devstral-/Codestral-Historie in `questions-opencode/`. Der Test-List→Red-Continuation-Drop, der unter v6.2 kimi/minimax betraf, ist in v6.2.1 gefixt (siehe Harness-Status).

MiniMax und DeepSeek sind bewusst dabei, weil sie im `-oc`-Pendant klare, dokumentierte Kontrastprofile hatten: MiniMax = "interne Tests grün, externe Verification 0/15" (Spec-Misverständnis), DeepSeek-Pro = Skill-Compliance-Champion mit Duration-Tail-Risk. Das macht den Cross-Harness-Vergleich direkt.

Der Backprovider-Pfad ist in jeder Lab-Variant implizit gepinnt (Opus/Sonnet via Vertex EU, GPT via Azure, GLM-5.1 via Nebius, GLM-5.2 + Kimi + MiniMax + DeepSeek via TensorX, Qwen via Nebius); ein wechselnder Backprovider braucht eine neue Variant.

### Nicht aufgenommen / weitere Kandidaten

- **Gemma**: In `pi-config/agent/models.json` **nicht vorhanden** (kein Gemma bei Requesty konfiguriert). Erst aufnehmbar, wenn ein Gemma-Modell in `models.json` ergänzt und via Requesty routbar ist.
- **`gpt-5-6-luna`** (Azure) — drittes GPT-5.6-Geschwister neben SOL und TERRA; würde den GPT-Zweig weiter spreizen.
- **`gemini-2-5-pro`** (`vertex/gemini-2.5-pro@europe-west1`) — im `-oc`-Lauf wegen Continuation-Drop raus; unter v6.2.1 (expliziter Phase-Continuation-Fix) evtl. stabiler.
- **`qwen3-next-80b-a3b-thinking`** (Nebius) — thinking-Variante neben dem aufgenommenen qwen3-235b, falls der Qwen-Zweig gespreizt werden soll.

## Hypothesen

- **H1 (Anthropic-Anker)**: opus-4-8 und sonnet-5 liefern die niedrigsten Werte bei `cognitive_max` und `smell_total` und bestätigen, dass das Anthropic-Niveau auch über das Requesty-Routing erhalten bleibt (sonst ist der pi-Harness ein wertloser Confound). Cross-Check gegen die Opus-Werte in RQ-model-quality-oc.
- **H1b (GLM-Versionssprung)**: glm-5-2 verbessert `smell_total`/`cognitive_max` gegenüber glm-5-1 messbar — direkter Intra-Familie-Versionsvergleich innerhalb einer Zelle-Matrix (beide via unterschiedliche Backprovider: 5.1 Nebius, 5.2 TensorX; Backprovider-Confound als Caveat notieren).
- **H2 (Nicht-Anthropic-Spreizung)**: Die Nicht-Anthropic-Modelle (gpt-5-6-sol, glm-5-1, glm-5-2, kimi-k2-7) zeigen über `smell_total` und `cognitive_max` eine messbare Spreizung — d.h. der pi-Harness ist diskriminationsfähig genug, um Modell-Unterschiede sichtbar zu machen.
- **H3 (Skill-Tool-Compliance modellabhängig)**: `cycle_count` und `predictions_total` spreizen über die Modelle — manche nutzen den v6.2.1-Skill-/Subagent-Mechanismus diszipliniert, andere driften in inline-Mode. Niedriger cycle_count ist NICHT automatisch schwächere TDD-Disziplin, sondern auch Compliance mit der pi-Skill-Affordance. (Parallel zum `-oc`-Befund: nur manche Modelle produzieren Prediction-Marker.)

## Methodologische Anmerkungen

- Alle Modelle laufen via Requesty, aber mit unterschiedlichen Backprovidern (Azure für GPT-5.x, Bedrock/Vertex für Anthropic/Gemini, TensorX/Nebius/Inceptron für die übrigen). Backprovider-Routing-Effekte sind in den Lab-Variant-IDs implizit gepinnt.
- `n=5` per Zelle folgt Memory [[replicates-n-reliability]] (Default für mittleres Feld).
- v6.2.1 erzwingt (wie v6.2) Test-First-TDD mit der Why-Block-/Skill-Mechanik. Beobachtbare Drift in `cycle_count` (nur ein Teil der echten Cycles wird über den Skill-/Marker-Pfad erfasst) ist eine Workflow-Compliance-Eigenschaft, kein Parser-Bug. Bei Findings unterscheiden: "Modell A hat höhere TDD-Disziplin" ≠ "Modell A nutzt den Skill-Marker öfter".
- TDD-Disziplin-Metriken (`cycle_count`, `predictions_*`, `refactorings_applied`) hängen davon ab, dass der pi-Transcript-Parser die Marker erfasst. v6.2.1 ändert nur den Phasenübergang (Test-List→Red-Continuation), nicht die Marker selbst — alle P1–P7 sind unverändert. Vor dem ersten Batch verifizieren, dass ein Opus-Run diese Metriken != null liefert (Smoke-Test-Regel aus CLAUDE.md).
