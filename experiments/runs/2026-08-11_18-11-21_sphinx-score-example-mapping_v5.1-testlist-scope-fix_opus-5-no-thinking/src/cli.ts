import { stdin, stdout } from "node:process";
import { sphinxScore, type Card } from "./sphinx-score.js";

async function readStdin(): Promise<string> {
  stdin.setEncoding("utf8");
  let input = "";
  for await (const chunk of stdin) {
    input += chunk;
  }
  return input;
}

const { army } = JSON.parse(await readStdin()) as { army: Card[] };

stdout.write(JSON.stringify({ score: sphinxScore(army) }) + "\n");
