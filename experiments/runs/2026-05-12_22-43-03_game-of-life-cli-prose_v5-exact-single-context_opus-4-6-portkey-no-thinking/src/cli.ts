import { advance } from "./game-of-life.js";
import type { Cell } from "./game-of-life.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  const { aliveCells, steps } = JSON.parse(input) as { aliveCells: Cell[]; steps: number };
  const result = advance(aliveCells, steps);
  process.stdout.write(JSON.stringify({ aliveCells: result }) + "\n");
});
