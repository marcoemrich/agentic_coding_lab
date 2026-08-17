import { stdin } from "node:process";
import { scoreSphinxArmy, type Army } from "./sphinx-score.js";

async function readStdinText(): Promise<string> {
  stdin.setEncoding("utf8");
  const chunks: string[] = [];

  for await (const chunk of stdin) {
    chunks.push(chunk);
  }

  return chunks.join("");
}

const input = await readStdinText();
const payload = JSON.parse(input) as Army;
const score = scoreSphinxArmy(payload);

process.stdout.write(JSON.stringify({ score }));
