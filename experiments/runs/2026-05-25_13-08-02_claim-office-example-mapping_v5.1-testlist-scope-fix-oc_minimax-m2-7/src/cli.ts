import { calculatePremium, calculatePayout, processScenario } from "./claim-office.js";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

let input = "";

rl.on("line", (line) => {
  input += line;
});

rl.on("close", () => {
  try {
    const scenario = JSON.parse(input);
    const result = processScenario(scenario);
    console.log(JSON.stringify(result));
    process.exit(0);
  } catch (e) {
    console.error(String(e));
    process.exit(1);
  }
});