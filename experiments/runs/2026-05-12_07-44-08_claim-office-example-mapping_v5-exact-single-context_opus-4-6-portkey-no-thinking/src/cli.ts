import { processScenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (chunk: string) => (input += chunk));
process.stdin.on("end", () => {
  try {
    const scenario = JSON.parse(input);
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err: any) {
    process.stderr.write((err.message ?? String(err)) + "\n");
    process.exitCode = 1;
  }
});
