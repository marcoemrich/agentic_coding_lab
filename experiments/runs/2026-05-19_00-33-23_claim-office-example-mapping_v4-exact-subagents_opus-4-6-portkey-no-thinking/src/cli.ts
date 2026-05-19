import { processScenario } from "./claim-office.js";

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk: string) => {
  input += chunk;
});
process.stdin.on("end", () => {
  try {
    const raw = JSON.parse(input);
    const scenario = {
      customer: { years: raw.customer.yearsWithMHPCO },
      steps: raw.steps.map((step: Record<string, unknown>) => ({
        ...step,
        type: step.op,
      })),
    };
    const output = processScenario(scenario);
    process.stdout.write(JSON.stringify(output) + "\n");
  } catch (err) {
    process.stderr.write(
      err instanceof Error ? err.message : "Unknown error\n",
    );
    process.exit(1);
  }
});
