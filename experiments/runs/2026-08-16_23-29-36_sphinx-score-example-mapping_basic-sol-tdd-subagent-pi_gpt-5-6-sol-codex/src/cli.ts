import { readFileSync } from "node:fs";
import { scoreSphinxes, type ArmyInput } from "./sphinx-score.js";

const input = JSON.parse(readFileSync(0, "utf8")) as ArmyInput;

process.stdout.write(JSON.stringify(scoreSphinxes(input)));
