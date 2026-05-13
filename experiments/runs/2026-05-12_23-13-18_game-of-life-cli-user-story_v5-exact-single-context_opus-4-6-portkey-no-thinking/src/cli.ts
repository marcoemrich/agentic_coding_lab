import { simulate } from "./game-of-life.js";

let input = "";
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  const { aliveCells, steps } = JSON.parse(input);
  const result = simulate(aliveCells, steps);
  process.stdout.write(JSON.stringify({ aliveCells: result }));
});
