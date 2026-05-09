import { readFileSync } from "fs";
import { calculatePremium, processClaim, createPolicy } from "./mhpco.js";
import type {
  Scenario,
  ScenarioResponse,
  Result,
  QuoteStep,
  ClaimStep,
  Policy,
} from "./types.js";

async function main() {
  let input = "";

  // Read all stdin
  try {
    // In Node.js, stdin is synchronous for reading all at once
    input = readFileSync(0, "utf-8");
  } catch (error) {
    console.error("Error reading input:", error);
    process.exit(1);
  }

  try {
    const scenario: Scenario = JSON.parse(input);
    const results: Result[] = [];
    const policies: Policy[] = [];

    for (const step of scenario.steps) {
      if (step.op === "quote") {
        const quoteStep = step as QuoteStep;
        const premium = calculatePremium(
          quoteStep.items,
          scenario.customer,
          policies.length === 0 // isFirstPolicy
        );

        results.push({ premium });

        // Store the policy for future claims
        const policy = createPolicy(quoteStep.items);
        policies.push(policy);
      } else if (step.op === "claim") {
        const claimStep = step as ClaimStep;
        const policy = policies[claimStep.policy];

        if (!policy) {
          throw new Error(
            `Policy ${claimStep.policy} not found for claim operation`
          );
        }

        const { payout, remainingCap } = processClaim(
          policy,
          claimStep.incident.damages
        );

        results.push({ payout, remainingCap });

        // Update the policy's remaining cap
        policy.remainingCap = remainingCap;
      }
    }

    const response: ScenarioResponse = { results };
    console.log(JSON.stringify(response));
  } catch (error) {
    console.error("Error processing scenario:", error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exit(1);
});
