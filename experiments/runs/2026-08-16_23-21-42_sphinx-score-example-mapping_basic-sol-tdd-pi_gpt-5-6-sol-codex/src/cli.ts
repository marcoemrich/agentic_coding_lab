import { readFileSync } from "node:fs";
import { scoreSphinxes, type ArmyDocument } from "./sphinx-score.js";

const input = JSON.parse(readFileSync(0, "utf8")) as ArmyDocument;
process.stdout.write(`${JSON.stringify(scoreSphinxes(input))}\n`);
