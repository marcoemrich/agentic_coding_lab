import { evolve } from "./game-of-life.js";

let input = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  const { aliveCells, steps } = JSON.parse(input);
  const result = evolve(aliveCells, steps);
  process.stdout.write(JSON.stringify({ aliveCells: result }) + "\n");
});
