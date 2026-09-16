import { readFileSync } from "node:fs";
import { sphinxScore, type Card } from "./sphinx-score.js";

type Input = {
  army: Card[];
};

const input = JSON.parse(readFileSync(0, "utf8")) as Input;
process.stdout.write(JSON.stringify({ score: sphinxScore(input.army) }));
