import { readFileSync } from "node:fs";
import { scoreSphinxes, type Card } from "./sphinx-score.js";

interface ScoringRequest {
  army: Card[];
}

const request = JSON.parse(readFileSync(0, "utf8")) as ScoringRequest;
const response = { score: scoreSphinxes(request.army) };

process.stdout.write(JSON.stringify(response));
