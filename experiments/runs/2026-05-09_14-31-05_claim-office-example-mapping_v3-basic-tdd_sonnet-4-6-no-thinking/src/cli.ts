#!/usr/bin/env node
import { computePremium, computeInsuranceSum, processClaim } from './claim-office.js';
import type { Customer, Item, Policy, Incident, DamageEntry } from './types.js';

interface ScenarioCustomer {
  yearsWithMHPCO: number;
  contractCount?: number;
}

interface QuoteStep {
  op: 'quote';
  items: Array<{
    type: string;
    material: string;
    enchantment?: number;
    cursed?: boolean;
  }>;
}

interface ClaimStep {
  op: 'claim';
  policy: number; // zero-based index of a prior quote step
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: ScenarioCustomer;
  steps: Step[];
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', chunk => { data += chunk; });
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
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

  let scenario: Scenario;
  try {
    scenario = JSON.parse(input) as Scenario;
  } catch (err) {
    process.stderr.write(`Invalid JSON input: ${err}\n`);
    process.exit(1);
  }

  const customer: Customer = {
    yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
    contractCount: scenario.customer.contractCount ?? 0,
  };

  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  const policies: Policy[] = new Array(scenario.steps.length).fill(null);
  let contractCount = customer.contractCount;

  for (const step of scenario.steps) {
    if (step.op === 'quote') {
      const items: Item[] = step.items.map(i => ({
        type: i.type as Item['type'],
        material: i.material,
        enchantment: i.enchantment ?? 0,
        cursed: i.cursed ?? false,
      }));

      let premium: number;
      try {
        const stepCustomer: Customer = { yearsWithMHPCO: customer.yearsWithMHPCO, contractCount };
        premium = computePremium(stepCustomer, items);
      } catch (err) {
        process.stderr.write(`Error computing premium: ${err}\n`);
        process.exit(1);
      }

      // Create the policy for potential future claims
      const insuranceSum = computeInsuranceSum(items);
      const policy: Policy = {
        items,
        remainingCap: insuranceSum * 2,
      };
      policies[results.length] = policy;
      contractCount++;
      results.push({ premium });
    } else if (step.op === 'claim') {
      const policyIndex = step.policy;
      const policy = policies[policyIndex];
      if (!policy) {
        process.stderr.write(`No policy found at step index ${policyIndex}\n`);
        process.exit(1);
      }

      const incident: Incident = {
        cause: step.incident.cause,
        damages: step.incident.damages.map(d => ({
          itemType: d.itemType as DamageEntry['itemType'],
          amount: d.amount,
        })),
      };

      let claimResult: { payout: number; remainingCap: number };
      try {
        claimResult = processClaim(policy, incident);
        // Update the policy's remainingCap for subsequent claims
        policy.remainingCap = claimResult.remainingCap;
      } catch (err) {
        process.stderr.write(`Error processing claim: ${err}\n`);
        process.exit(1);
      }

      results.push(claimResult);
    } else {
      process.stderr.write(`Unknown operation: ${(step as { op: string }).op}\n`);
      process.exit(1);
    }
  }

  process.stdout.write(JSON.stringify({ results }) + '\n');
}

main().catch(err => {
  process.stderr.write(`Unexpected error: ${err}\n`);
  process.exit(1);
});
