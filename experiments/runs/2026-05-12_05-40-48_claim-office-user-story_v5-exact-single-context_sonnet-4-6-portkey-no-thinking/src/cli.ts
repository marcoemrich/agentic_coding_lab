import { processScenario } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => { data += chunk; });
  process.stdin.on("end", () => resolve(data));
});

const scenario = JSON.parse(input);
const result = processScenario(scenario);
process.stdout.write(JSON.stringify(result) + "\n");
