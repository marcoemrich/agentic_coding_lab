import fs from "node:fs";
import { calculateSphinxScore } from "./sphinx-score.js";
import type { Army } from "./sphinx-score.js";

const input = fs.readFileSync(0, "utf8");
const parsedInput: Army = JSON.parse(input);
const result = {
  score: calculateSphinxScore(parsedInput),
};

process.stdout.write(JSON.stringify(result));
