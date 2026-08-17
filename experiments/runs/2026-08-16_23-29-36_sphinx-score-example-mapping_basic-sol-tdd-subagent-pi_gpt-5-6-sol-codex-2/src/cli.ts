import { readFileSync } from "node:fs";
import { scoreSphinx, type Card } from "./sphinx-score.js";

interface ScoringInput {
  army: Card[];
}

const input = JSON.parse(readFileSync(0, "utf8")) as ScoringInput;
const output = { score: scoreSphinx(input.army) };
process.stdout.write(JSON.stringify(output));
