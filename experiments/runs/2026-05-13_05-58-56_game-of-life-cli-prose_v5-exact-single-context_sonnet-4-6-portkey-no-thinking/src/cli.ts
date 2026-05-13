import { nextGeneration, type Cell } from "./game-of-life.js";

const input = JSON.parse(await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
}));

const { aliveCells, steps }: { aliveCells: Cell[]; steps: number } = input;

let cells: Cell[] = aliveCells;
for (let i = 0; i < steps; i++) {
  cells = nextGeneration(cells);
}

process.stdout.write(JSON.stringify({ aliveCells: cells }) + "\n");
