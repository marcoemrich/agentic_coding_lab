import { processScenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk: string) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const scenario = JSON.parse(input);
  const result = processScenario(scenario);
  process.stdout.write(JSON.stringify(result) + "\n");
});
