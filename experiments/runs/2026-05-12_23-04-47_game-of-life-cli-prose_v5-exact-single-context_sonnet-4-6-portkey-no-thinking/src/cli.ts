import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const input = await new Promise<string>((resolve) => {
  const chunks: Buffer[] = [];
  process.stdin.on("data", (chunk: Buffer) => chunks.push(chunk));
  process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString()));
});

const { aliveCells, steps } = JSON.parse(input) as { aliveCells: Cell[]; steps: number };

let current = aliveCells;
for (let i = 0; i < steps; i++) {
  current = nextGeneration(current);
}

process.stdout.write(JSON.stringify({ aliveCells: current }) + "\n");
