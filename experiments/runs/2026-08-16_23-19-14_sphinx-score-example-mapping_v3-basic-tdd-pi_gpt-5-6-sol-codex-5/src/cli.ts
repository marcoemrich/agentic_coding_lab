import { readFileSync } from "node:fs";
import { scoreSphinx, type Card } from "./sphinx-score.js";

type Input = { army: Card[] };

const input = JSON.parse(readFileSync(0, "utf8")) as Input;
const result = { score: scoreSphinx(input.army) };

process.stdout.write(JSON.stringify(result));
