import { scoreSphinxes, type Card } from "./sphinx-score.js";

interface InputDocument {
  army: Card[];
}

async function readStandardInput(): Promise<string> {
  let input = "";

  for await (const chunk of process.stdin) {
    input += String(chunk);
  }

  return input;
}

const input = JSON.parse(await readStandardInput()) as InputDocument;
process.stdout.write(JSON.stringify({ score: scoreSphinxes(input.army) }));
