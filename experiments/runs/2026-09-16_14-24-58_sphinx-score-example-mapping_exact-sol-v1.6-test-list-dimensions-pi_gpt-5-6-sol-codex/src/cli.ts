import { scoreSphinx, type Card } from "./sphinx-score.js";

interface StandardInput extends AsyncIterable<string> {
  setEncoding(encoding: string): void;
}

interface Runtime {
  process: {
    stdin: StandardInput;
    stdout: { write(output: string): void };
  };
}

function scoreDocument(input: string): string {
  const document = JSON.parse(input) as { army: Card[] };
  return JSON.stringify({ score: scoreSphinx(document.army) });
}

const { stdin, stdout } = (globalThis as unknown as Runtime).process;
stdin.setEncoding("utf8");

let input = "";
for await (const chunk of stdin) {
  input += chunk;
}

stdout.write(scoreDocument(input));
