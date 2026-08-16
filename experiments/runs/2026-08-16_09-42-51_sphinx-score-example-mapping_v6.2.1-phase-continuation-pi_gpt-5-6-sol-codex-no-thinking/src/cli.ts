import { readFileSync } from "node:fs";
import { type Card, scoreSphinxes } from "./sphinx-score.js";

interface ScoreRequest {
  army: Card[];
}

const request = JSON.parse(readFileSync(0, "utf8")) as ScoreRequest;
process.stdout.write(JSON.stringify({ score: scoreSphinxes(request.army) }));
