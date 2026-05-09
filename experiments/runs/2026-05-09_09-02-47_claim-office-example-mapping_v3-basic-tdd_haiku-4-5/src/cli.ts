import { Engine, Item, DamageEvent, Policy } from './engine';

interface Customer {
  yearsWithMHPCO: number;
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
    damages: DamageEvent[];
  };
}

type Step = QuoteStep | ClaimStep;

interface Input {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type Result = QuoteResult | ClaimResult;

interface Output {
  results: Result[];
}

async function main() {
  try {
    // Read input from stdin
    const input = await readStdin();

    // Parse input
    let scenario: Input;
    try {
      scenario = JSON.parse(input);
    } catch (e) {
      throw new Error('Invalid JSON input');
    }

    // Validate input structure
    if (!scenario.customer || !scenario.steps || !Array.isArray(scenario.steps)) {
      throw new Error('Invalid input structure: expected customer and steps');
    }

    const engine = new Engine();
    const results: Result[] = [];
    const policies: Map<number, Policy> = new Map();

    // Process each step
    for (let stepIndex = 0; stepIndex < scenario.steps.length; stepIndex++) {
      const step = scenario.steps[stepIndex];

      if (step.op === 'quote') {
        // Process quote
        const isFirstInsurance = stepIndex === 0;
        try {
          const premium = engine.quote({
            yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
            items: step.items,
            isFirstInsurance,
          });

          // Create and store policy for later claims
          const policy = engine.createPolicy({
            yearsWithMHPCO: scenario.customer.yearsWithMHPCO,
            items: step.items,
            isFirstInsurance,
          });
          policies.set(stepIndex, policy);

          results.push({ premium });
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          throw new Error(`Error processing quote step ${stepIndex}: ${message}`);
        }
      } else if (step.op === 'claim') {
        // Process claim
        const policyIndex = step.policy;
        if (!policies.has(policyIndex)) {
          throw new Error(`Policy ${policyIndex} not found for claim at step ${stepIndex}`);
        }

        // Validate that policy covers all damage items
        const policy = policies.get(policyIndex)!;
        const policyItemTypes = new Map<string, number>();

        for (const item of policy.items) {
          const count = policyItemTypes.get(item.type) || 0;
          policyItemTypes.set(item.type, count + 1);
        }

        // Check that damages don't exceed covered items
        const damageItemTypes = new Map<string, number>();
        for (const damage of step.incident.damages) {
          const count = damageItemTypes.get(damage.itemType) || 0;
          damageItemTypes.set(damage.itemType, count + 1);

          // Validate damage amount
          if (damage.amount < 0) {
            throw new Error(`Invalid damage amount: ${damage.amount} at step ${stepIndex}`);
          }
        }

        // Check that we have enough items to cover damage
        for (const [itemType, damageCount] of damageItemTypes.entries()) {
          const coveredCount = policyItemTypes.get(itemType) || 0;
          if (damageCount > coveredCount) {
            throw new Error(
              `Claim at step ${stepIndex} damages ${damageCount} ${itemType}(s) but policy only covers ${coveredCount}`
            );
          }
        }

        try {
          const claimResult = engine.claim(policy, step.incident.damages);
          results.push(claimResult);
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          throw new Error(`Error processing claim step ${stepIndex}: ${message}`);
        }
      } else {
        throw new Error(`Unknown operation: ${(step as any).op}`);
      }
    }

    // Write output to stdout
    const output: Output = { results };
    console.log(JSON.stringify(output));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';

    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });

    process.stdin.on('end', () => {
      resolve(data);
    });

    process.stdin.on('error', reject);
  });
}

main();
