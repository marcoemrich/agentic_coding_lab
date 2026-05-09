import type { Scenario, Policy, StepResult } from './types.js';
import { quote } from './quote.js';
import { processClaim } from './claim.js';

async function main(): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const input = JSON.parse(Buffer.concat(chunks).toString('utf8')) as Scenario;

  const results: StepResult[] = [];
  // Indexed by step position; only quote steps create a policy entry
  const stepPolicies: Array<Policy | null> = new Array(input.steps.length).fill(null);
  let contractNumber = 0;

  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];

    if (step.op === 'quote') {
      contractNumber += 1;
      const { premium, policy } = quote(step.items, input.customer, contractNumber);
      stepPolicies[i] = policy;
      results.push({ premium });
    } else {
      const policy = stepPolicies[step.policy];
      if (policy === null) {
        throw new Error(`Step ${i}: no policy found at step index ${step.policy}`);
      }
      const { payout, remainingCap } = processClaim(policy, step.incident.damages);
      // Mutate remaining cap so subsequent claims on the same policy see updated cap
      policy.remainingCap = remainingCap;
      results.push({ payout, remainingCap });
    }
  }

  process.stdout.write(JSON.stringify({ results }) + '\n');
}

main().catch((err) => {
  process.stderr.write(String(err) + '\n');
  process.exit(1);
});
