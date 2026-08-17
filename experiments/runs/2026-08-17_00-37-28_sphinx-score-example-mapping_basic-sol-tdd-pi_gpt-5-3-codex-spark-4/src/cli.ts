import { stdin, stdout } from "node:process";

import { calculateSphinxScore } from "./sphinx-score";

const chunks: string[] = [];
for await (const chunk of stdin) {
  chunks.push(String(chunk));
}

const input = JSON.parse(chunks.join(""));
const scoreOutput = { score: calculateSphinxScore(input) };

stdout.write(JSON.stringify(scoreOutput));
