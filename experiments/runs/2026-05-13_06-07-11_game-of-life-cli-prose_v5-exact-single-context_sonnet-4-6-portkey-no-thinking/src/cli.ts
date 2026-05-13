import { nextGeneration, Cell } from "./game-of-life.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const { aliveCells, steps } = JSON.parse(input) as { aliveCells: Cell[]; steps: number };

let cells: Cell[] = aliveCells;
for (let i = 0; i < steps; i++) {
  cells = nextGeneration(cells);
}

process.stdout.write(JSON.stringify({ aliveCells: cells }) + "\n");
