import { calculateSphinxScore } from "./sphinx-score.js";

const inputChunks: string[] = [];

for await (const chunk of process.stdin) {
  inputChunks.push(chunk);
}

const armyPayload = JSON.parse(inputChunks.join(""));
const score = calculateSphinxScore(armyPayload);
process.stdout.write(`${JSON.stringify({ score })}`);
