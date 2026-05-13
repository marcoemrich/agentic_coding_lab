import { advance } from "./game-of-life.js";

const input = JSON.parse(await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
}));

const aliveCells: [number, number][] = input.aliveCells;
const steps: number = input.steps;

const result = advance(aliveCells, steps);

process.stdout.write(JSON.stringify({ aliveCells: result }) + "\n");
