import { readFileSync } from "node:fs";
import { scoreSphinx, type Card } from "./sphinx-score.js";

interface ArmyInput {
  army: Card[];
}

const input = JSON.parse(readFileSync(0, "utf8")) as ArmyInput;
const output = { score: scoreSphinx(input.army) };

process.stdout.write(JSON.stringify(output));
