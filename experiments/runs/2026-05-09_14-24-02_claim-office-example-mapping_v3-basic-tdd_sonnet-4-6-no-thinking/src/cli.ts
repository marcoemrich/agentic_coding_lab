import { computeQuote, processClaim, createPolicy } from "./claim-office.js";
import type { Scenario, Policy, StepResult, QuoteStep, ClaimStep } from "./types.js";

async function main() {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
  }

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (e) {
    process.stderr.write(`Error parsing input JSON: ${(e as Error).message}\n`);
    process.exit(1);
  }

  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();

  // Track contract count for this customer in this scenario
  let contractCount = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    if (step.op === "quote") {
      const quoteStep = step as QuoteStep;
      // Validate item types
      const knownTypes = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];
      for (const item of quoteStep.items) {
        if (!knownTypes.includes(item.type)) {
          process.stderr.write(`Unknown item type: ${item.type}\n`);
          process.exit(1);
        }
      }

      const isFirstContract = contractCount === 0;
      const premium = computeQuote(customer, quoteStep.items, isFirstContract);
      results.push({ premium });

      // Create policy for future claims
      const policy = createPolicy(quoteStep.items, i);
      policies.set(i, policy);
      contractCount++;
    } else if (step.op === "claim") {
      const claimStep = step as ClaimStep;
      const policy = policies.get(claimStep.policy);

      if (!policy) {
        process.stderr.write(`No policy found for step index: ${claimStep.policy}\n`);
        process.exit(1);
      }

      try {
        const result = processClaim(policy, claimStep.incident);
        // Update policy remaining cap
        policy.remainingCap = result.remainingCap;
        results.push(result);
      } catch (e) {
        process.stderr.write(`Claim error: ${(e as Error).message}\n`);
        process.exit(1);
      }
    } else {
      process.stderr.write(`Unknown operation: ${(step as { op: string }).op}\n`);
      process.exit(1);
    }
  }

  process.stdout.write(JSON.stringify({ results }) + "\n");
}

main().catch((e) => {
  process.stderr.write(`Fatal error: ${(e as Error).message}\n`);
  process.exit(1);
});
