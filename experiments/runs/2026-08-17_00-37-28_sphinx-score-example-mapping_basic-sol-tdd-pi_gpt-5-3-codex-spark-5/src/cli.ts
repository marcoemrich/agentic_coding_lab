import { calculateSphinxScoringResult } from "./sphinx-score.js";

let stdinData = "";

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk: string) => {
  stdinData += chunk;
});

process.stdin.on("end", () => {
  const armyInput = JSON.parse(stdinData);
  const result = calculateSphinxScoringResult(armyInput);
  process.stdout.write(JSON.stringify(result));
});
