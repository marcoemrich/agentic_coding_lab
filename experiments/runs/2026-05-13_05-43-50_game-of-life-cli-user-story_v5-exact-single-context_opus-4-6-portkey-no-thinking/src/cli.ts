import { simulate } from "./game-of-life.js";

let data = "";
process.stdin.on("data", (chunk) => { data += chunk; });
process.stdin.on("end", () => {
  const { aliveCells, steps } = JSON.parse(data);
  const result = simulate(aliveCells, steps);
  process.stdout.write(JSON.stringify({ aliveCells: result }));
});
