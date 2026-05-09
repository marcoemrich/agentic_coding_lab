import { calculateQuote, processClaim } from './core';
import type { Scenario, ScenarioResult, QuoteStep, ClaimStep } from './types';

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

async function main(): Promise<void> {
  try {
    const input = await readStdin();
    const scenario: Scenario = JSON.parse(input);

    const results: ScenarioResult['results'] = [];
    const policies: any[] = [];

    for (const step of scenario.steps) {
      if (step.op === 'quote') {
        const quoteStep = step as QuoteStep;
        const result = calculateQuote(scenario.customer, quoteStep.items);
        results.push({ premium: result.premium });
        policies.push(result.policy);
      } else if (step.op === 'claim') {
        const claimStep = step as ClaimStep;
        const policyIndex = claimStep.policy;

        if (policyIndex < 0 || policyIndex >= policies.length) {
          console.error(`Error: Invalid policy index ${policyIndex}`);
          process.exit(1);
        }

        const policy = policies[policyIndex];
        try {
          const claimResult = processClaim(policy, claimStep.incident);
          results.push({
            payout: claimResult.payout,
            remainingCap: claimResult.remainingCap
          });
          // Update policy remaining cap for future claims
          policy.remainingCap = claimResult.remainingCap;
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
          }
          process.exit(1);
        }
      }
    }

    const output: ScenarioResult = { results };
    console.log(JSON.stringify(output));
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Error: Invalid JSON input');
    } else if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error('Error: Unknown error');
    }
    process.exit(1);
  }
}

main();
