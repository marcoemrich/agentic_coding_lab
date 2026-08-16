import { scoreSphinxes, type Card } from "./sphinx-score.js";

let input = "";
for await (const chunk of process.stdin) input += chunk;

const scoreRequest = JSON.parse(input) as { army: Card[] };
process.stdout.write(JSON.stringify({ score: scoreSphinxes(scoreRequest.army) }));
