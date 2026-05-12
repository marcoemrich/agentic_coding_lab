import { processScenario } from "./claim-office.js";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let inputData = "";

rl.on("line", (line) => {
  inputData += line;
});

rl.on("close", () => {
  try {
    const scenario = JSON.parse(inputData);
    const result = processScenario(scenario);
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error("Error processing scenario:", error);
    process.exit(1);
  }
});
