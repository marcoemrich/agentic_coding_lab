import { readFileSync } from "node:fs";

import { calculateSphinxScore, type ArmyInput } from "./sphinx-score.js";

const input = readFileSync(0, "utf8");
const army = JSON.parse(input) as ArmyInput;
const score = calculateSphinxScore(army);
process.stdout.write(JSON.stringify({ score }));
