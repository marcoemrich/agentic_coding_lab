import { readFileSync } from "node:fs";
import { type Card, scoreSphinxes } from "./sphinx-score.js";

interface ArmyDocument {
  army: Card[];
}

const input = JSON.parse(readFileSync(0, "utf8")) as ArmyDocument;
process.stdout.write(JSON.stringify({ score: scoreSphinxes(input.army) }));
