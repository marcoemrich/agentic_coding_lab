# RQ-model-quality-pi — Findings

**Setup**: game-of-life-example-mapping × v6.2-with-why-cleaned-pi × Ziel-n=5 pro Zelle.

**Status: offen (n=0).** Keine Runs vorhanden. Die Lab-Variant→pi-Modell-Mappings für alle RQ-Modelle (opus-4-8, sonnet-5, gpt-5-6-sol, gpt-5-6-terra, glm-5-1, glm-5-2, kimi-k2-7, minimax-m3, deepseek-v4-pro, qwen3-235b) sind in `experiments/docker/run-batch.sh` verdrahtet; es fehlen noch Routing-Smoke (n=1) und der erste Batch. Siehe `README.md` → "Harness-Status".

Findings werden über `/run-rq RQ-model-quality-pi` bzw. `/reanalyze` erzeugt, sobald Runs vorliegen — nicht ad-hoc schreiben (Trophy-Konvention, Spot-Check, Korrektheits-Gating laufen über den Skill).
