import { type Card, scoreSphinxes } from "./sphinx-score.js";

type ArmyInput = {
  army: Card[];
};

process.stdin.setEncoding("utf8");
let inputJson = "";
for await (const chunk of process.stdin) inputJson += chunk;

const input = JSON.parse(inputJson) as ArmyInput;
const output = { score: scoreSphinxes(input.army) };

process.stdout.write(JSON.stringify(output));
