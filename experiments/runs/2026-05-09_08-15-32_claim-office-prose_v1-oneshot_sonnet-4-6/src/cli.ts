import { quotePolicy } from "./quote.js";
import { processClaim } from "./claim.js";
import { Scenario, Policy, StepResult } from "./types.js";

async function main() {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const input = JSON.parse(Buffer.concat(chunks).toString("utf-8")) as Scenario;

  const { customer, steps } = input;
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;

  for (const step of steps) {
    if (step.op === "quote") {
      const { premium, policy } = quotePolicy(customer, step.items, quoteCount);
      quoteCount++;
      policies.push(policy);
      results.push({ premium });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = processClaim(policy, step.incident);
      results.push(result);
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main().catch((err) => {
  process.stderr.write(String(err) + "\n");
  process.exit(1);
});
