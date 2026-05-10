import { calculateQuote } from './quotes.js';
import { calculateClaim } from './claims.js';

declare const process: any;

interface Customer {
  yearsWithMHPCO: number;
}

interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface QuoteStep {
  op: 'quote';
  items: Item[];
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface Output {
  results: (QuoteResult | ClaimResult)[];
}

async function main() {
  try {
    const input = await readStdin();
    const scenario = JSON.parse(input) as Scenario;

    const results: (QuoteResult | ClaimResult)[] = [];
    const policies: Array<{ items: Item[]; remainingCap: number }> = [];

    for (const step of scenario.steps) {
      if (step.op === 'quote') {
        try {
          const premium = calculateQuote(scenario.customer, step.items);
          results.push({ premium });

          // Store policy for future claims
          const insuranceSum = calculatePolicyInsuranceSum(step.items);
          policies.push({
            items: step.items,
            remainingCap: insuranceSum * 2,
          });
        } catch (error) {
          console.error(
            `Error processing quote: ${error instanceof Error ? error.message : String(error)}`
          );
          process.exit(1);
        }
      } else if (step.op === 'claim') {
        try {
          const policyIndex = step.policy;
          if (policyIndex < 0 || policyIndex >= policies.length) {
            throw new Error(`Invalid policy index: ${policyIndex}`);
          }

          const policy = policies[policyIndex];
          const result = calculateClaim(policy, step.incident.damages);
          results.push(result);

          // Update remaining cap for future claims on same policy
          policy.remainingCap = result.remainingCap;
        } catch (error) {
          console.error(
            `Error processing claim: ${error instanceof Error ? error.message : String(error)}`
          );
          process.exit(1);
        }
      }
    }

    const output: Output = { results };
    console.log(JSON.stringify(output));
  } catch (error) {
    console.error(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

function calculatePolicyInsuranceSum(items: Item[]): number {
  const ITEM_INSURANCE_VALUES: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
  };
  const COMPONENT_INSURANCE_VALUE = 250;

  let total = 0;
  for (const item of items) {
    if (item.type in ITEM_INSURANCE_VALUES) {
      total += ITEM_INSURANCE_VALUES[item.type];
    } else {
      // Components
      total += COMPONENT_INSURANCE_VALUE;
    }
  }
  return total;
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk: string) => {
      data += chunk;
    });
    process.stdin.on('end', () => {
      resolve(data);
    });
    process.stdin.on('error', reject);
  });
}

main();
