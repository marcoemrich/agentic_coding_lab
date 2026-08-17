import { calculateSphinxScore, type ArmyInput } from "./sphinx-score.js";

const chunks: string[] = [];
for await (const chunk of process.stdin) {
  chunks.push(String(chunk));
}

const armyPayload = JSON.parse(chunks.join("")) as ArmyInput;
const score = calculateSphinxScore(armyPayload);

process.stdout.write(JSON.stringify({ score }));
