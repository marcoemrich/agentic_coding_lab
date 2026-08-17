import type { Card } from "./sphinx-score.js";
import { scoreSphinx } from "./sphinx-score.js";

let input = "";
process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) {
  input += chunk;
}

const { army } = JSON.parse(input) as { army: Card[] };
const score = scoreSphinx(army);
process.stdout.write(JSON.stringify({ score }));
