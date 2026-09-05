# Token-Preise Coding-Modelle (Stand 2026-05-29)

Quellen: Anthropic API (claude.com/pricing), OpenRouter API (`/api/v1/models`).
Alle Preise in USD pro 1M Token.

## Requesty-Preise pi-Harness-Modelle (Stand 2026-07-25)

Für die aktuellen pi-/Requesty-Modelle (RQ-model-novel-pi, RQ-model-quality-pi, RQ-harness-requesty). Requesty berechnet den Upstream-Provider-Preis (kein Markup laut Anbieter; älterer Stand nannte 5 %). Preise = **Live-Requesty-Katalog** (`curl https://router.eu.requesty.ai/v1/models`), pro Route aus der `pi_model`-Map in `experiments/docker/run-batch.sh`. Alle Preise USD pro 1M Token.

| lab-variant | Requesty-Route | Input | Output | Cache Read | Cache? |
|---|---|---:|---:|---:|:--:|
| opus-4-8 | `vertex/claude-opus-4-8@eu` | $5.50 | $27.50 | $0.55 | ja |
| opus-5-requesty | `vertex/claude-opus-5@eu` | $5.50 | $27.50 | $0.55 | ja |
| sonnet-5 | `vertex/claude-sonnet-5@eu` | $2.20 | $11.00 | $0.22 | ja |
| gpt-5-6-sol | `azure/gpt-5.6-sol@swedencentral` | $5.00 | $30.00 | $0.50 | ja |
| gpt-5-6-terra | `azure/gpt-5.6-terra@swedencentral` | $2.50 | $15.00 | $0.25 | ja |
| glm-5-1 | `nebius/zai-org/glm-5.1` | $1.40 | $4.40 | $1.40 | **nein** |
| glm-5-2 | `tensorx/glm-5.2` | $1.50 | $4.50 | $0.38 | ja |
| kimi-k2-7 | `tensorx/kimi-k2.7-code` | $1.25 | $4.50 | $0.31 | ja |
| kimi-k3 | `sference/kimi-k3` | $2.25 | $11.25 | $0.225 | ja |
| kimi-k3-nebius | `nebius/kimi-k3` | $3.00 | $15.00 | $3.00 | **nein** |
| minimax-m3 | `tensorx/minimax-m3` | $0.40 | $2.00 | $0.10 | ja |
| deepseek-v4-pro | `tensorx/deepseek-v4-pro` | $1.75 | $3.50 | $0.44 | ja |
| qwen3-235b | `nebius/qwen/qwen3-235b-a22b-instruct-2507` | $0.20 | $0.60 | $0.20 | **nein** |

Anmerkungen:
- Diese Werte weichen bewusst von den **nativen** Anthropic-Listpreisen ab: auf den vertex-Routen liegt Requesty ~10 % höher (opus-4-8 $5.50/$27.50 statt $5.00/$25.00 nativ). Im aktuellen Run-Pool laufen ALLE `opus-4-8`/`sonnet-5`-Runs über pi/Requesty, deshalb tragen die shared lab-variants in `compute-cost.py` den Requesty-Tarif.
- **`supports_caching=false`** (glm-5-1, qwen3-235b, kimi-k3-nebius): Requesty rechnet cache_read zum vollen Input-Preis ab → in `compute-cost.py` ist `cache_read = input` gesetzt (kein Rabatt).
- **kimi-k3** hat zwei lab-variants für zwei Routen: `kimi-k3` (sference, Primärroute) und `kimi-k3-nebius` (Fallback, `run-batch.sh:749`). Die Tarife unterscheiden sich deutlich (sference ~25 % billiger und mit Cache-Rabatt) — Runs der beiden Routen sind in Kosten-Vergleichen nicht austauschbar.
- Cache-Write auf den OpenAI-/GLM-/Kimi-/MiniMax-/DeepSeek-Routen nicht separat ausgewiesen → in `compute-cost.py` als 0 geführt.
- Requesty rotiert Modelle/Provider schnell — bei Abweichungen den Live-Katalog gegen `compute-cost.py` `PRICES` und `experiments/docker/pi-config/agent/models.json` diffen.

## OpenAI-Subscription-Route (openai-codex, Stand 2026-09-05)

Die drei Modelle, die pi über `openai-codex` (`chatgpt.com/backend-api`, OAuth)
erreicht. **Auf dieser Route wird nichts pro Token abgerechnet** — die Werte
sind reine Vergleichspreise: was dieselbe Arbeit über die API gekostet hätte,
auf derselben Basis wie die Requesty-Zellen, gegen die sie verglichen werden.

| lab-variant | pi-Route | Input | Output | Cache Read | Cache Write |
|---|---|---:|---:|---:|---:|
| gpt-5-6-sol-codex | `openai-codex/gpt-5.6-sol` | $5.00 | $30.00 | $0.50 | $6.25 |
| gpt-6-astra-codex | `openai-codex/gpt-6-astra` | $10.00 | $50.00 | $1.00 | $12.50 |
| gpt-5-3-codex-spark | `openai-codex/gpt-5.3-codex-spark` | $1.75 | $14.00 | $0.175 | $0 |

Quellen (je unabhängig gegengeprüft, 2026-09-05): Astra —
[OpenAI API-Docs](https://developers.openai.com/api/docs/models/gpt-6-astra),
[OpenRouter](https://openrouter.ai/openai/gpt-6-astra),
[pi.dev](https://pi.dev/models/openai/gpt-6-astra); Spark —
[pi.dev](https://pi.dev/models/openai/gpt-5-3-codex-spark),
[OpenRouter](https://openrouter.ai/openai/gpt-5.3-codex).

Anmerkungen:
- **Cache-Write ist auf dieser Route belanglos**, obwohl er ausgewiesen wird: in
  allen 119 codex-Runs im Pool ist `cache_write` = 0 Tokens. `compute-cost.py`
  führt ihn deshalb wie bei den übrigen OpenAI-Routen als 0.
- **Der Langkontext-Tarifsprung ist bewusst NICHT abgebildet.** Sol und Astra
  berechnen Requests über 272k Input mit 2× Input/Cache und 1.5× Output
  (Astra: $20/$75/$2). `compute-cost.py` rechnet flach. Die Werte sind damit
  eine **Untergrenze** für Runs mit großen Einzelrequests — konsistent über alle
  Zellen, was für den Vergleich zählt, aber kein Rechnungsbetrag.
- **pis eigene Inline-Kosten sind nicht die Quelle** und dürfen es nicht werden.
  Sie sind aus unseren Tokenzahlen nicht reproduzierbar: ein Least-Squares-Fit
  über 83 codex-Runs ergibt einen *negativen* Input-Preis bei 33.6 % mittlerem
  Fehler — vermutlich, weil die Tarifsprünge pro Request greifen und sich in der
  Summe nichtlinear verhalten. `compute-cost.py` PRICES ist die alleinige Quelle
  für alle pi-Runs, beide Routen (`cli_model == "pi-only"`).
- Astras Kontextfenster ist **strittig**: OpenRouter nennt 1.050.000,
  [pi.dev](https://pi.dev/models/openai/gpt-6-astra) nennt 272.000.
  `models.json` folgt pi.dev; die 272k aus den Preisquellen sind die
  Tarifgrenze, nicht zwingend das Limit. Unter-Deklaration ist die sichere
  Richtung.
- Spark ist in `models.json` mit contextWindow 272000 / maxTokens 128000
  geführt, pi.dev nennt 128.000 / 32.000. Das ist eine **Über**-Deklaration und
  damit die unsichere Richtung — ungeprüft, hier nur festgehalten.

Ältere Quellen (zum Nachvollziehen): [Requesty GLM-5.2](https://www.requesty.ai/models/zai/glm-5.2), [aipricing.guru GPT-5.6](https://www.aipricing.guru/openai-pricing/).

## Übersicht

| Modell | Input | Output | Cache Read |
|---|---:|---:|---:|
| Claude Opus 5 | $5.00 | $25.00 | $0.50 |
| Claude Opus 4.8 | $5.00 | $25.00 | $0.50 |
| Claude Opus 4.7 | $5.00 | $25.00 | $0.50 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 |
| Moonshot Kimi K2.6 | $0.73 | $3.49 | $0.37 |
| Z-AI GLM 5.1 | $0.98 | $3.08 | $0.18 |
| MiniMax M2.7 | $0.28 | $1.20 | – |
| DeepSeek V4 Pro | $0.44 | $0.87 | – |
| Qwen3-Coder-Plus | $0.65 | $3.25 | – |
| OpenAI GPT-5.5 | $5.00 | $30.00 | – |
| OpenAI GPT-5.3-Codex | $1.75 | $14.00 | – |

## Anmerkungen

- **GPT-5.5-codex existiert nicht** auf OpenRouter. Verfügbar: `gpt-5.5` ($5/$30), `gpt-5.5-pro` ($30/$180). Neuester Codex-Build ist `gpt-5.3-codex` (März 2026).
- **DeepSeek V4 Pro** ist das aktuelle Flagship. V4-Familie hat keine separate Coder-Variante mehr — Pro ist coding-fähig.
- **Qwen3-Coder-Plus** ist die bezahlte Flagship-Variante. Alternativen: `qwen3-coder-next` (Preview, $0.11/$0.80), `qwen3-coder` (480B base, $0.22/$1.80).
- **Kimi K2.6** Preis schwankt zwischen Providern ($0.73–$0.77 input / $3.49–$4.00 output), oben der Hauptpreis.
- **Opus 4.7/4.8** unterstützen Prompt Caching (Cache-Hit = 10% vom Basis-Input-Preis). Opus 4.8 hat identische Token-Tarife wie 4.7. Kimi und GLM bieten ebenfalls Cache Reads über OpenRouter.
- **Fast mode** (Research Preview): Opus 4.7 = $30/$150, Opus 4.8 = $10/$50 (4.8 ist deutlich günstiger im Fast-Mode).

## Relative Größenordnung

Pro 1M Token zu gleichen Teilen Input/Output:

1. DeepSeek V4 Pro — **$0.66**
2. MiniMax M2.7 — **$0.74**
3. Qwen3-Coder-Plus — **$1.95**
4. GLM 5.1 — **$2.03**
5. Kimi K2.6 — **$2.11**
6. GPT-5.3-Codex — **$7.88**
7. Sonnet 4.6 — **$9.00**
8. Opus 4.7 — **$15.00**
9. GPT-5.5 — **$17.50**

## Opus 4.7 vs DeepSeek V4 Pro

- ~11× teurer im Input, ~29× im Output.
- Coding-Workloads sind output-heavy → real eher 20–25× Faktor.
- Mit aktivem Prompt Caching auf Opus (Cache-Hit $0.50/M) sinkt der Input-Anteil deutlich.

## Weitere DeepSeek-Varianten (zum Vergleich)

| Modell | Input | Output |
|---|---:|---:|
| deepseek-v4-flash | $0.10 | $0.20 |
| deepseek-v4-flash:free | $0 | $0 |
| deepseek-v3.2 | $0.252 | $0.378 |
| deepseek-v3.2-speciale | $0.287 | $0.431 |
| deepseek-v3.1-terminus | $0.27 | $0.95 |
| deepseek-r1-0528 | $0.50 | $2.15 |

## Weitere OpenAI Codex-Varianten

| Modell | Input | Output |
|---|---:|---:|
| gpt-5-codex | $1.25 | $10.00 |
| gpt-5.1-codex | $1.25 | $10.00 |
| gpt-5.1-codex-max | $1.25 | $10.00 |
| gpt-5.1-codex-mini | $0.25 | $2.00 |
| gpt-5.2-codex | $1.75 | $14.00 |
| gpt-5.3-codex | $1.75 | $14.00 |
