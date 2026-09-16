import { readFileSync } from "node:fs";
import { type Card, scoreSphinx } from "./sphinx-score.js";

interface ScoreRequest {
  army: Card[];
}

const request = JSON.parse(readFileSync(0, "utf8")) as ScoreRequest;
const response = { score: scoreSphinx(request.army) };
process.stdout.write(JSON.stringify(response));
