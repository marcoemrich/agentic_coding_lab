# RQ-model-novel-pi — Findings

**Setup**: claim-office-example-mapping × v6.2-with-why-cleaned-pi × Ziel-n=5 pro Zelle.

**Status: offen (n=0).** Keine example-mapping-Runs vorhanden. Die Lab-Variant→pi-Modell-Mappings für alle RQ-Modelle (opus-4-8, sonnet-5, gpt-5-6-sol, gpt-5-6-terra, glm-5-1, glm-5-2, kimi-k2-7, minimax-m3, deepseek-v4-pro, qwen3-235b) sind in `experiments/docker/run-batch.sh` verdrahtet; es fehlen noch Routing-Smoke und der erste example-mapping-Batch. Vorhandene claim-office-**prose**-Runs mit opus-4-7 zählen nicht für diese RQ (falscher Prompt + falsches Modell) — siehe `README.md` → "Vorhandene Daten".

Findings werden über `/run-rq RQ-model-novel-pi` bzw. `/reanalyze` erzeugt, sobald Runs vorliegen — nicht ad-hoc schreiben.
