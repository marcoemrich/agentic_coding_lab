import * as fs from "fs";
import { processScenario } from "./claim-office.js";

function main() {
  try {
    const input = fs.readFileSync(0, "utf-8");
    if (!input || input.trim() === "") {
      process.exit(0);
    }
    const scenario = JSON.parse(input);
    const result = processScenario(scenario);
    console.log(JSON.stringify(result));
  } catch (error: any) {
    console.error(error.message || String(error));
    process.exit(1);
  }
}

main();
