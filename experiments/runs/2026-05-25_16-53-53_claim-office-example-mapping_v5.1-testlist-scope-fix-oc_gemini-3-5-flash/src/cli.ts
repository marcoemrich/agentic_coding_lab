import * as fs from "fs";
import { runScenario } from "./claim-office.js";

function main() {
  try {
    const input = fs.readFileSync(0, "utf-8");
    const scenario = JSON.parse(input);
    const results = runScenario(scenario);
    console.log(JSON.stringify(results));
  } catch (error: any) {
    console.error(error.message);
    process.exit(1);
  }
}

main();
