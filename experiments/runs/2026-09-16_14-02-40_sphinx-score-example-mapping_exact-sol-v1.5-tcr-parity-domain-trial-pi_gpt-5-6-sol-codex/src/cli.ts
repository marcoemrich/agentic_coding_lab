import { readFileSync } from "node:fs";
import { sphinxScore } from "./sphinx-score.js";

interface ScoreRequest {
  army: Parameters<typeof sphinxScore>[0];
}

const request = JSON.parse(readFileSync(0, "utf8")) as ScoreRequest;
process.stdout.write(JSON.stringify({ score: sphinxScore(request.army) }));
