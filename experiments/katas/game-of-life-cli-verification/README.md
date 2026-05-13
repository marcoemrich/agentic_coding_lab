# Game of Life CLI — Verification Suite

External acceptance suite for the `game-of-life-cli-{prose,user-story,example-mapping}` kata family. The implementer never sees these scenarios during a run; `analyze-run.sh` invokes them after the run completes.

## Contract

- **Command**: `pnpm exec tsx src/cli.ts` (executed in the run directory)
- **Stdin**: JSON `{ "aliveCells": [[x, y], ...], "steps": N }` with `N >= 0`
- **Stdout**: JSON `{ "aliveCells": [[x, y], ...] }`, lexicographically sorted by `(x, y)`
- **Comparison**: canonical deep-equal via `jq -S .` on both sides. Object keys are sorted by `jq -S`, but array order is significant — hence the sort requirement.

## Scenarios

| NN | Pattern | Steps | What it tests |
|----|---------|-------|---------------|
| 01 | empty                       | 1 | Empty world stays empty |
| 02 | single cell dies            | 1 | Underpopulation (0 neighbors) |
| 03 | block (still life)          | 1 | Period-1 still life |
| 04 | block, identity             | 0 | `steps: 0` returns input unchanged |
| 05 | beehive (still life)        | 2 | Multi-step still life |
| 06 | blinker                     | 1 | Period-2 oscillator, phase 1 |
| 07 | blinker, identity           | 2 | Period-2 oscillator closes |
| 08 | toad                        | 1 | Period-2 oscillator (6 cells) |
| 09 | toad, identity              | 2 | Period-2 closes |
| 10 | beacon                      | 1 | Period-2 oscillator (8 cells) |
| 11 | glider, half-phase          | 5 | 1.25 periods → non-trivial offset |
| 12 | glider                      | 1 | Spaceship single step |
| 13 | glider, full period         | 4 | Translation by (+1, +1) |
| 14 | glider, negative coords     | 4 | Unbounded world allows negative `x`, `y` |
| 15 | two disjoint blinkers       | 1 | Independent regions evolve correctly |

## Manual execution

```bash
for inp in scenarios/*.input.json; do
    name=$(basename "$inp" .input.json)
    exp="${inp%.input.json}.expected.json"
    actual=$(cd /path/to/run && pnpm exec tsx src/cli.ts < "$inp")
    diff <(echo "$actual" | jq -S .) <(jq -S . "$exp") && echo "PASS: $name" || echo "FAIL: $name"
done
```
