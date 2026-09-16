import { type Card, scoreSphinx } from "./sphinx-score.js";

type ScoreRequest = {
  army: Card[];
};

async function readStdin(): Promise<string> {
  let input = "";
  process.stdin.setEncoding("utf8");
  for await (const chunk of process.stdin) input += chunk;
  return input;
}

const request = JSON.parse(await readStdin()) as ScoreRequest;
process.stdout.write(JSON.stringify({ score: scoreSphinx(request.army) }));
