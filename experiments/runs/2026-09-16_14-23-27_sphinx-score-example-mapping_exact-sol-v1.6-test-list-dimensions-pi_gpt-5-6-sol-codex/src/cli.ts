import { stdin, stdout } from "node:process";
import { scoreSphinx, type Card } from "./sphinx-score.js";

interface ScoreRequest {
  army: Card[];
}

stdin.setEncoding("utf8");
let input = "";
for await (const chunk of stdin) input += chunk;

const request = JSON.parse(input) as ScoreRequest;
const response = { score: scoreSphinx(request.army) };
stdout.write(JSON.stringify(response));
