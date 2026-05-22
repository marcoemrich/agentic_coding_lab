import { runScenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});
process.stdin.on("end", () => {
  const scenario = JSON.parse(input);
  const result = runScenario(scenario);
  process.stdout.write(JSON.stringify(result));
});
