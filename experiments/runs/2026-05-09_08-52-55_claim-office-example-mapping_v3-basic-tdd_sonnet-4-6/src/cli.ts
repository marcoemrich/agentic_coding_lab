import { computeQuote } from "./pricing.js";
import { processClaim, createPolicy } from "./claims.js";
import type {
  ScenarioInput,
  ScenarioOutput,
  StepResult,
  Policy,
  QuoteStep,
  ClaimStep,
} from "./types.js";

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { data += chunk; });
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

async function main(): Promise<void> {
  let input: string;
  try {
    input = await readStdin();
  } catch (err) {
    process.stderr.write(`Error reading stdin: ${err}\n`);
    process.exit(1);
  }

  let scenario: ScenarioInput;
  try {
    scenario = JSON.parse(input) as ScenarioInput;
  } catch (err) {
    process.stderr.write(`Invalid JSON input: ${err}\n`);
    process.exit(1);
  }

  const { customer, steps } = scenario;
  const results: StepResult[] = [];
  const policies: Policy[] = new Array(steps.length);
  let quoteCount = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!;

    if (step.op === "quote") {
      const quoteStep = step as QuoteStep;
      const isFirstContract = quoteCount === 0;
      quoteCount++;

      let premium: number;
      try {
        premium = computeQuote(quoteStep.items, customer, isFirstContract);
      } catch (err) {
        process.stderr.write(`Error computing quote at step ${i}: ${err}\n`);
        process.exit(1);
      }

      let policy: Policy;
      try {
        policy = createPolicy(quoteStep.items);
      } catch (err) {
        process.stderr.write(`Error creating policy at step ${i}: ${err}\n`);
        process.exit(1);
      }

      policies[i] = policy;
      results.push({ premium });
    } else if (step.op === "claim") {
      const claimStep = step as ClaimStep;
      const policyIndex = claimStep.policy;
      const policy = policies[policyIndex];

      if (policy === undefined) {
        process.stderr.write(
          `Claim at step ${i} references non-existent policy at step ${policyIndex}\n`
        );
        process.exit(1);
      }

      let claimResult: { payout: number; remainingCap: number };
      try {
        claimResult = processClaim(policy, claimStep.incident);
      } catch (err) {
        process.stderr.write(`Error processing claim at step ${i}: ${err}\n`);
        process.exit(1);
      }

      // Update the policy's remaining cap in place
      policies[policyIndex]!.remainingCap = claimResult.remainingCap;

      results.push({ payout: claimResult.payout, remainingCap: claimResult.remainingCap });
    } else {
      process.stderr.write(`Unknown op at step ${i}: ${(step as { op: string }).op}\n`);
      process.exit(1);
    }
  }

  const output: ScenarioOutput = { results };
  process.stdout.write(JSON.stringify(output) + "\n");
}

main().catch((err) => {
  process.stderr.write(`Unexpected error: ${err}\n`);
  process.exit(1);
});
