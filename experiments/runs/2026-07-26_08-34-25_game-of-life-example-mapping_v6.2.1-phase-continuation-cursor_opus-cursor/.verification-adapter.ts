import { readFileSync } from "fs";

const input = JSON.parse(readFileSync("/dev/stdin", "utf-8"));
const { aliveCells, steps } = input;

type Cell = [number, number];

async function loadEvolve(): Promise<(cells: Cell[]) => Cell[]> {
  const modulePaths = [
    "./src/game-of-life",
    "./src/gameOfLife",
    "./src/life",
    "./src/gol",
    "./src/index",
  ];

  for (const path of modulePaths) {
    let mod: any;
    try { mod = await import(path); } catch { continue; }

    for (const key of Object.keys(mod)) {
      if (typeof mod[key] === "function") {
        const fn = mod[key];
        if (fn.length >= 2) {
          return (cells: Cell[]) => fn(cells, 1);
        }
        return fn;
      }
    }

    if (typeof mod.default === "function") {
      const fn = mod.default;
      if (fn.length >= 2) {
        return (cells: Cell[]) => fn(cells, 1);
      }
      return fn;
    }
  }
  throw new Error("No evolve function found in src/");
}

async function main() {
  const evolve = await loadEvolve();

  let cells: Cell[] = aliveCells;
  for (let i = 0; i < steps; i++) {
    cells = evolve(cells);
  }

  const sorted = cells
    .map(([x, y]) => [x, y] as Cell)
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);

  console.log(JSON.stringify({ aliveCells: sorted }));
}

main().catch((e) => {
  process.stderr.write(String(e) + "\n");
  process.exit(1);
});
