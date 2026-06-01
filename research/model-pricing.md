# Token-Preise Coding-Modelle (Stand 2026-05-29)

Quellen: Anthropic API (claude.com/pricing), OpenRouter API (`/api/v1/models`).
Alle Preise in USD pro 1M Token.

## Übersicht

| Modell | Input | Output | Cache Read |
|---|---:|---:|---:|
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
