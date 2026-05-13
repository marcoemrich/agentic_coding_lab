import { step } from "./game-of-life.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const { aliveCells, steps } = JSON.parse(input) as {
  aliveCells: [number, number][];
  steps: number;
};

const result = step(aliveCells, steps);
process.stdout.write(JSON.stringify({ aliveCells: result }) + "\n");
