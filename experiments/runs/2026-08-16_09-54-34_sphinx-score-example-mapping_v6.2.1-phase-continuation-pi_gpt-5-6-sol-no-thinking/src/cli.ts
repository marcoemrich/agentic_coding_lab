import { readFileSync } from "node:fs";
import { scoreSphinx, type Card } from "./sphinx-score.js";

interface Input {
  army: Card[];
}

const input = JSON.parse(readFileSync(0, "utf8")) as Input;
process.stdout.write(JSON.stringify({ score: scoreSphinx(input.army) }));
