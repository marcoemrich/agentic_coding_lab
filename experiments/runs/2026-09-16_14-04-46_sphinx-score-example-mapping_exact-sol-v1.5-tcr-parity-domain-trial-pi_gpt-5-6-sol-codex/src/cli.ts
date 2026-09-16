import { type Card, scoreSphinxes } from "./sphinx-score.js";

interface ScoreRequest {
  army: Card[];
}

process.stdin.setEncoding("utf8");
let json = "";
for await (const chunk of process.stdin) {
  json += chunk;
}

const request = JSON.parse(json) as ScoreRequest;
process.stdout.write(JSON.stringify({ score: scoreSphinxes(request.army) }));
