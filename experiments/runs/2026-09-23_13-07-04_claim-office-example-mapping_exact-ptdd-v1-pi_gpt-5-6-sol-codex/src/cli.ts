import process from "node:process";
import { processScenario, type Scenario } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let content = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk: string) => { content += chunk; });
  process.stdin.on("end", () => { resolve(content); });
});

process.stdout.write(JSON.stringify(processScenario(JSON.parse(input) as Scenario)));
