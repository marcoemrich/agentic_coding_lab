import { readFileSync } from "node:fs";

import { calculateSphinxScore } from "./sphinx-score.js";

const input = JSON.parse(readFileSync(0, "utf8"));
const score = calculateSphinxScore(input);

process.stdout.write(JSON.stringify({ score }));
