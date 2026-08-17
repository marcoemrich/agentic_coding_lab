import type { Card } from "./sphinx-score.js";
import { scoreSphinxes } from "./sphinx-score.js";

interface ArmyInput {
  army: Card[];
}

const stdinChunks: Buffer[] = [];
for await (const chunk of process.stdin) {
  stdinChunks.push(Buffer.from(chunk));
}

const input = JSON.parse(Buffer.concat(stdinChunks).toString("utf8")) as ArmyInput;
process.stdout.write(JSON.stringify({ score: scoreSphinxes(input.army) }));
