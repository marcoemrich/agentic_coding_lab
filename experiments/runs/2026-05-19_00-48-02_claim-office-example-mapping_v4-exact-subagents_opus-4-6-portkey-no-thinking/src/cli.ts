import { processSteps } from "./claim-office.js";

const input = await new Promise<string>((resolve) => {
  let data = "";
  process.stdin.setEncoding("utf-8");
  process.stdin.on("data", (chunk: string) => (data += chunk));
  process.stdin.on("end", () => resolve(data));
});

try {
  const scenario = JSON.parse(input);
  const results = processSteps(scenario.customer, scenario.steps);
  process.stdout.write(JSON.stringify({ results }));
} catch (error) {
  process.stderr.write(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
