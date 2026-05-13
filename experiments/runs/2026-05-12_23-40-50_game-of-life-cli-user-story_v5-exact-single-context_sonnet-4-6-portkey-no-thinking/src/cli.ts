import { step } from "./game-of-life.js";

const chunks: Buffer[] = [];
process.stdin.on("data", (chunk) => chunks.push(chunk));
process.stdin.on("end", () => {
  const input = JSON.parse(Buffer.concat(chunks).toString());
  const aliveCells = step(input.aliveCells, input.steps);
  process.stdout.write(JSON.stringify({ aliveCells }) + "\n");
});
