import process from "node:process";
import { scoreSphinxes, type Card } from "./sphinx-score.js";

let input = "";
for await (const chunk of process.stdin) {
  input += chunk;
}

const armyInput = JSON.parse(input) as { army: Card[] };
process.stdout.write(JSON.stringify({ score: scoreSphinxes(armyInput.army) }));
