import { quote, claim } from "./claim-office.js";

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  const scenario = JSON.parse(data);
  const results = [];
  const policies: Record<number, { items: any; remainingCap: number | undefined }> = {};
  try {
    for (let i = 0; i < scenario.steps.length; i++) {
      const step = scenario.steps[i];
      if (step.op === "quote") {
        results.push({ premium: quote({ customer: scenario.customer, items: step.items }).premium });
        policies[i] = { items: step.items, remainingCap: undefined };
      } else if (step.op === "claim") {
        const policy = policies[step.policy];
        const result = claim({ items: policy.items, damages: step.incident.damages, remainingCap: policy.remainingCap });
        policy.remainingCap = result.remainingCap;
        results.push(result);
      }
    }
  } catch (err) {
    process.stderr.write((err as Error).message + "\n");
    process.exit(1);
  }
  process.stdout.write(JSON.stringify({ results }));
});
