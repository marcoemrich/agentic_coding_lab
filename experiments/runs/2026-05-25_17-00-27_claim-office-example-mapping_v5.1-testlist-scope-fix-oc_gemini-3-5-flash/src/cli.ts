import { processScenario } from "./claim-office.js";
import * as fs from "fs";

function main() {
  try {
    const inputData = fs.readFileSync(0, "utf-8");
    if (!inputData.trim()) {
      console.error("Error: Stdin is empty.");
      process.exit(1);
    }
    const scenario = JSON.parse(inputData);
    const result = processScenario(scenario);
    console.log(JSON.stringify(result));
  } catch (error: any) {
    console.error("Error processing claim office scenario:", error?.message || error);
    process.exit(1);
  }
}

main();
