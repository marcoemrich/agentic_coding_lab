# Aggregation: smart-subset

_Reduzierte Matrix basierend auf Erkenntnissen aus 235 alten Runs. Fokus: Prompt-Stil-Effekt (-prose/-example-mapping/-user-story) auf 2 Katas, Replikation des v4+thinking-Befunds, Haiku 4.5 als neuer Modell-Tier. v2-iterative nur als Sanity-Check (alte Auswertung zeigt v2 überall am schlechtesten). Generiert von batch-plans/generators/smart-subset.py._

Generated: 2026-05-03T09:11:48Z

Plan triples: 90 · matched runs: 89

## Run status overview

| metric | count |
|---|---|
| total runs | 89 |
| exit_code=0 | 89 |
| exit_code≠0 | 0 |
| rate_limited=true | 0 |
| tests_passing=true | 83 |
| tests_passing=false | 6 |
| tests_passing missing | 0 |

## Tests passing rate (workflow × model)

| workflow | model | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 8 | 100% |
| v2-iterative | sonnet-4-6 | 2 | 2 | 100% |
| v3-basic-tdd | sonnet-4-6 | 8 | 8 | 100% |
| v4-exact-subagents | haiku-4-5 | 8 | 6 | 75% |
| v4-exact-subagents | opus-4-7 | 11 | 11 | 100% |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 8 | 100% |
| v4-exact-subagents | sonnet-4-6 | 8 | 8 | 100% |
| v5-exact-single-context | haiku-4-5 | 8 | 4 | 50% |
| v5-exact-single-context | opus-4-7 | 12 | 12 | 100% |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 8 | 100% |
| v5-exact-single-context | sonnet-4-6 | 8 | 8 | 100% |

## Duration seconds (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 33.2 | 21.0 | 49.0 |
| v2-iterative | sonnet-4-6 | 2 | 49.5 | 44.0 | 55.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 39.1 | 27.0 | 61.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 542.1 | 90.0 | 1290.0 |
| v4-exact-subagents | opus-4-7 | 11 | 548.5 | 321.0 | 888.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 649.6 | 397.0 | 1109.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 686.8 | 330.0 | 958.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 165.0 | 14.0 | 432.0 |
| v5-exact-single-context | opus-4-7 | 12 | 245.0 | 185.0 | 385.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 229.8 | 169.0 | 335.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 470.9 | 225.0 | 928.0 |

## Lines of code (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 11.9 | 4.0 | 34.0 |
| v2-iterative | sonnet-4-6 | 2 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 12.6 | 4.0 | 30.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 24.2 | 4.0 | 63.0 |
| v4-exact-subagents | opus-4-7 | 11 | 11.1 | 2.0 | 52.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 13.0 | 2.0 | 41.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 14.1 | 2.0 | 42.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 8.8 | 0.0 | 49.0 |
| v5-exact-single-context | opus-4-7 | 12 | 8.7 | 3.0 | 32.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 12.6 | 3.0 | 41.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 9.6 | 3.0 | 30.0 |

## Code mass (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 53.4 | 27.0 | 131.0 |
| v2-iterative | sonnet-4-6 | 2 | 28.5 | 27.0 | 30.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 63.2 | 29.0 | 139.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 82.5 | 30.0 | 174.0 |
| v4-exact-subagents | opus-4-7 | 11 | 50.3 | 21.0 | 137.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 56.1 | 21.0 | 157.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 55.2 | 21.0 | 143.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 32.1 | 0.0 | 118.0 |
| v5-exact-single-context | opus-4-7 | 12 | 41.2 | 25.0 | 113.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 54.0 | 25.0 | 155.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 48.2 | 25.0 | 110.0 |

## Coverage statements % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 2 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 75.0 | 0.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 11 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 50.0 | 0.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 12 | 100.0 | 100.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 99.4 | 95.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |

## Coverage branches % (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v2-iterative | sonnet-4-6 | 2 | 100.0 | 100.0 | 100.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 75.0 | 0.0 | 100.0 |
| v4-exact-subagents | opus-4-7 | 11 | 98.6 | 85.0 | 100.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 100.0 | 100.0 | 100.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 97.9 | 83.0 | 100.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 50.0 | 0.0 | 100.0 |
| v5-exact-single-context | opus-4-7 | 12 | 98.6 | 83.0 | 100.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 98.1 | 85.0 | 100.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 100.0 | 100.0 | 100.0 |

## Test lines (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 40.4 | 20.0 | 72.0 |
| v2-iterative | sonnet-4-6 | 2 | 35.0 | 23.0 | 47.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 54.4 | 20.0 | 127.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 39.0 | 17.0 | 108.0 |
| v4-exact-subagents | opus-4-7 | 11 | 25.4 | 17.0 | 39.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 30.4 | 17.0 | 51.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 30.6 | 17.0 | 51.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 18.6 | 9.0 | 45.0 |
| v5-exact-single-context | opus-4-7 | 12 | 32.2 | 17.0 | 62.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 33.6 | 17.0 | 56.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 23.4 | 17.0 | 32.0 |

## Tests total (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 6.9 | 4.0 | 14.0 |
| v2-iterative | sonnet-4-6 | 2 | 5.0 | 4.0 | 6.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 7.6 | 4.0 | 17.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 7.2 | 4.0 | 12.0 |
| v4-exact-subagents | opus-4-7 | 11 | 6.2 | 4.0 | 10.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 6.8 | 4.0 | 10.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 6.8 | 4.0 | 10.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 3.0 | 0.0 | 10.0 |
| v5-exact-single-context | opus-4-7 | 12 | 5.8 | 4.0 | 9.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 6.1 | 4.0 | 9.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 5.5 | 4.0 | 8.0 |

## Todos remaining (workflow × model)

| workflow | model | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |
| v2-iterative | sonnet-4-6 | 2 | 0.0 | 0.0 | 0.0 |
| v3-basic-tdd | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | haiku-4-5 | 8 | 1.4 | 0.0 | 10.0 |
| v4-exact-subagents | opus-4-7 | 11 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | opus-4-7-no-thinking | 8 | 0.0 | 0.0 | 0.0 |
| v4-exact-subagents | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | haiku-4-5 | 8 | 3.4 | 0.0 | 9.0 |
| v5-exact-single-context | opus-4-7 | 12 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | opus-4-7-no-thinking | 8 | 0.0 | 0.0 | 0.0 |
| v5-exact-single-context | sonnet-4-6 | 8 | 0.0 | 0.0 | 0.0 |

## Tests passing rate (workflow × kata)

| workflow | kata | n | match | rate |
|---|---|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 1 | 1 | 100% |
| v1-oneshot | mars-rover-prose | 1 | 1 | 100% |
| v1-oneshot | pixel-art-scaler-example-mapping | 1 | 1 | 100% |
| v1-oneshot | pixel-art-scaler-prose | 1 | 1 | 100% |
| v1-oneshot | pixel-art-scaler-user-story | 1 | 1 | 100% |
| v1-oneshot | string-calculator-example-mapping | 1 | 1 | 100% |
| v1-oneshot | string-calculator-prose | 1 | 1 | 100% |
| v1-oneshot | string-calculator-user-story | 1 | 1 | 100% |
| v2-iterative | pixel-art-scaler-prose | 1 | 1 | 100% |
| v2-iterative | string-calculator-prose | 1 | 1 | 100% |
| v3-basic-tdd | game-of-life-prose | 1 | 1 | 100% |
| v3-basic-tdd | mars-rover-prose | 1 | 1 | 100% |
| v3-basic-tdd | pixel-art-scaler-example-mapping | 1 | 1 | 100% |
| v3-basic-tdd | pixel-art-scaler-prose | 1 | 1 | 100% |
| v3-basic-tdd | pixel-art-scaler-user-story | 1 | 1 | 100% |
| v3-basic-tdd | string-calculator-example-mapping | 1 | 1 | 100% |
| v3-basic-tdd | string-calculator-prose | 1 | 1 | 100% |
| v3-basic-tdd | string-calculator-user-story | 1 | 1 | 100% |
| v4-exact-subagents | game-of-life-prose | 4 | 4 | 100% |
| v4-exact-subagents | mars-rover-prose | 4 | 4 | 100% |
| v4-exact-subagents | pixel-art-scaler-example-mapping | 4 | 3 | 75% |
| v4-exact-subagents | pixel-art-scaler-prose | 5 | 5 | 100% |
| v4-exact-subagents | pixel-art-scaler-user-story | 4 | 3 | 75% |
| v4-exact-subagents | string-calculator-example-mapping | 4 | 4 | 100% |
| v4-exact-subagents | string-calculator-prose | 6 | 6 | 100% |
| v4-exact-subagents | string-calculator-user-story | 4 | 4 | 100% |
| v5-exact-single-context | game-of-life-prose | 4 | 3 | 75% |
| v5-exact-single-context | mars-rover-prose | 4 | 4 | 100% |
| v5-exact-single-context | pixel-art-scaler-example-mapping | 4 | 3 | 75% |
| v5-exact-single-context | pixel-art-scaler-prose | 6 | 5 | 83% |
| v5-exact-single-context | pixel-art-scaler-user-story | 4 | 4 | 100% |
| v5-exact-single-context | string-calculator-example-mapping | 4 | 3 | 75% |
| v5-exact-single-context | string-calculator-prose | 6 | 6 | 100% |
| v5-exact-single-context | string-calculator-user-story | 4 | 4 | 100% |

## Duration seconds (workflow × kata)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 1 | 38.0 | 38.0 | 38.0 |
| v1-oneshot | mars-rover-prose | 1 | 49.0 | 49.0 | 49.0 |
| v1-oneshot | pixel-art-scaler-example-mapping | 1 | 30.0 | 30.0 | 30.0 |
| v1-oneshot | pixel-art-scaler-prose | 1 | 35.0 | 35.0 | 35.0 |
| v1-oneshot | pixel-art-scaler-user-story | 1 | 32.0 | 32.0 | 32.0 |
| v1-oneshot | string-calculator-example-mapping | 1 | 21.0 | 21.0 | 21.0 |
| v1-oneshot | string-calculator-prose | 1 | 32.0 | 32.0 | 32.0 |
| v1-oneshot | string-calculator-user-story | 1 | 29.0 | 29.0 | 29.0 |
| v2-iterative | pixel-art-scaler-prose | 1 | 55.0 | 55.0 | 55.0 |
| v2-iterative | string-calculator-prose | 1 | 44.0 | 44.0 | 44.0 |
| v3-basic-tdd | game-of-life-prose | 1 | 42.0 | 42.0 | 42.0 |
| v3-basic-tdd | mars-rover-prose | 1 | 40.0 | 40.0 | 40.0 |
| v3-basic-tdd | pixel-art-scaler-example-mapping | 1 | 27.0 | 27.0 | 27.0 |
| v3-basic-tdd | pixel-art-scaler-prose | 1 | 41.0 | 41.0 | 41.0 |
| v3-basic-tdd | pixel-art-scaler-user-story | 1 | 61.0 | 61.0 | 61.0 |
| v3-basic-tdd | string-calculator-example-mapping | 1 | 31.0 | 31.0 | 31.0 |
| v3-basic-tdd | string-calculator-prose | 1 | 36.0 | 36.0 | 36.0 |
| v3-basic-tdd | string-calculator-user-story | 1 | 35.0 | 35.0 | 35.0 |
| v4-exact-subagents | game-of-life-prose | 4 | 751.0 | 269.0 | 958.0 |
| v4-exact-subagents | mars-rover-prose | 4 | 883.2 | 593.0 | 1109.0 |
| v4-exact-subagents | pixel-art-scaler-example-mapping | 4 | 841.5 | 584.0 | 1290.0 |
| v4-exact-subagents | pixel-art-scaler-prose | 5 | 646.4 | 429.0 | 927.0 |
| v4-exact-subagents | pixel-art-scaler-user-story | 4 | 733.0 | 561.0 | 1100.0 |
| v4-exact-subagents | string-calculator-example-mapping | 4 | 373.2 | 283.0 | 443.0 |
| v4-exact-subagents | string-calculator-prose | 6 | 333.8 | 90.0 | 455.0 |
| v4-exact-subagents | string-calculator-user-story | 4 | 374.8 | 283.0 | 460.0 |
| v5-exact-single-context | game-of-life-prose | 4 | 299.8 | 26.0 | 631.0 |
| v5-exact-single-context | mars-rover-prose | 4 | 520.0 | 335.0 | 928.0 |
| v5-exact-single-context | pixel-art-scaler-example-mapping | 4 | 239.5 | 30.0 | 497.0 |
| v5-exact-single-context | pixel-art-scaler-prose | 6 | 235.8 | 30.0 | 389.0 |
| v5-exact-single-context | pixel-art-scaler-user-story | 4 | 322.0 | 208.0 | 503.0 |
| v5-exact-single-context | string-calculator-example-mapping | 4 | 155.8 | 14.0 | 225.0 |
| v5-exact-single-context | string-calculator-prose | 6 | 215.3 | 169.0 | 292.0 |
| v5-exact-single-context | string-calculator-user-story | 4 | 252.5 | 201.0 | 302.0 |

## Lines of code (workflow × kata)

| workflow | kata | n | avg | min | max |
|---|---|---:|---:|---:|---:|
| v1-oneshot | game-of-life-prose | 1 | 30.0 | 30.0 | 30.0 |
| v1-oneshot | mars-rover-prose | 1 | 34.0 | 34.0 | 34.0 |
| v1-oneshot | pixel-art-scaler-example-mapping | 1 | 8.0 | 8.0 | 8.0 |
| v1-oneshot | pixel-art-scaler-prose | 1 | 7.0 | 7.0 | 7.0 |
| v1-oneshot | pixel-art-scaler-user-story | 1 | 4.0 | 4.0 | 4.0 |
| v1-oneshot | string-calculator-example-mapping | 1 | 4.0 | 4.0 | 4.0 |
| v1-oneshot | string-calculator-prose | 1 | 4.0 | 4.0 | 4.0 |
| v1-oneshot | string-calculator-user-story | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | pixel-art-scaler-prose | 1 | 4.0 | 4.0 | 4.0 |
| v2-iterative | string-calculator-prose | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | game-of-life-prose | 1 | 30.0 | 30.0 | 30.0 |
| v3-basic-tdd | mars-rover-prose | 1 | 27.0 | 27.0 | 27.0 |
| v3-basic-tdd | pixel-art-scaler-example-mapping | 1 | 13.0 | 13.0 | 13.0 |
| v3-basic-tdd | pixel-art-scaler-prose | 1 | 6.0 | 6.0 | 6.0 |
| v3-basic-tdd | pixel-art-scaler-user-story | 1 | 11.0 | 11.0 | 11.0 |
| v3-basic-tdd | string-calculator-example-mapping | 1 | 4.0 | 4.0 | 4.0 |
| v3-basic-tdd | string-calculator-prose | 1 | 6.0 | 6.0 | 6.0 |
| v3-basic-tdd | string-calculator-user-story | 1 | 4.0 | 4.0 | 4.0 |
| v4-exact-subagents | game-of-life-prose | 4 | 43.5 | 32.0 | 59.0 |
| v4-exact-subagents | mars-rover-prose | 4 | 46.0 | 30.0 | 63.0 |
| v4-exact-subagents | pixel-art-scaler-example-mapping | 4 | 14.5 | 5.0 | 32.0 |
| v4-exact-subagents | pixel-art-scaler-prose | 5 | 8.0 | 4.0 | 15.0 |
| v4-exact-subagents | pixel-art-scaler-user-story | 4 | 6.2 | 4.0 | 8.0 |
| v4-exact-subagents | string-calculator-example-mapping | 4 | 3.2 | 3.0 | 4.0 |
| v4-exact-subagents | string-calculator-prose | 6 | 4.5 | 2.0 | 9.0 |
| v4-exact-subagents | string-calculator-user-story | 4 | 3.0 | 2.0 | 6.0 |
| v5-exact-single-context | game-of-life-prose | 4 | 22.0 | 0.0 | 33.0 |
| v5-exact-single-context | mars-rover-prose | 4 | 35.8 | 21.0 | 49.0 |
| v5-exact-single-context | pixel-art-scaler-example-mapping | 4 | 4.2 | 0.0 | 6.0 |
| v5-exact-single-context | pixel-art-scaler-prose | 6 | 4.8 | 0.0 | 7.0 |
| v5-exact-single-context | pixel-art-scaler-user-story | 4 | 7.2 | 4.0 | 11.0 |
| v5-exact-single-context | string-calculator-example-mapping | 4 | 2.2 | 0.0 | 3.0 |
| v5-exact-single-context | string-calculator-prose | 6 | 3.5 | 3.0 | 4.0 |
| v5-exact-single-context | string-calculator-user-story | 4 | 4.0 | 3.0 | 6.0 |

## Files

- CSV: `../results/smart-subset/runs.csv`
- Source plan: `batch-plans/smart-subset.json`
- Run dirs: `runs/*`
