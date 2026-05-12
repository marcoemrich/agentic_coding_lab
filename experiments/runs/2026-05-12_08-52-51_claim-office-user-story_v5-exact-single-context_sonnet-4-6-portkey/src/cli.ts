import { processScenario, type Scenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => { input += chunk; });
process.stdin.on("end", () => {
  const scenario = JSON.parse(input) as Scenario;
  const result = processScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
});
