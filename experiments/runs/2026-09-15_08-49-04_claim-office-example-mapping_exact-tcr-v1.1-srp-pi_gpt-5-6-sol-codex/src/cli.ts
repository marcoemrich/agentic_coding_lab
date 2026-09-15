import { runScenario, type Scenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk: string) => { input += chunk; });
process.stdin.on("end", () => {
  try {
    process.stdout.write(JSON.stringify(runScenario(JSON.parse(input) as Scenario)));
  } catch (error) {
    const description = error instanceof Error ? error.message : String(error);
    process.stderr.write(description);
    process.exitCode = 1;
  }
});
