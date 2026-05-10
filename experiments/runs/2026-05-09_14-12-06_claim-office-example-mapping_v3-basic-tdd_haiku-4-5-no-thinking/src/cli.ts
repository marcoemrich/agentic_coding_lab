import { calculateQuote } from './quote.js';
import { calculateClaim } from './claim.js';

interface CustomerInput {
  yearsWithMHPCO: number;
}

interface ItemInput {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface DamageInput {
  itemType: string;
  amount: number;
}

interface IncidentInput {
  cause: string;
  damages: DamageInput[];
}

interface QuoteStepInput {
  op: 'quote';
  items: ItemInput[];
}

interface ClaimStepInput {
  op: 'claim';
  policy: number;
  incident: IncidentInput;
}

type StepInput = QuoteStepInput | ClaimStepInput;

interface ScenarioInput {
  customer: CustomerInput;
  steps: StepInput[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResultOutput {
  payout: number;
  remainingCap: number;
}

type StepResult = QuoteResult | ClaimResultOutput;

interface ScenarioOutput {
  results: StepResult[];
}

// Track policies created during scenario execution
interface StoredPolicy {
  items: ItemInput[];
  insuranceSum: number;
  remainingCap: number;
}

function calculateInsuranceSum(items: ItemInput[]): number {
  const ITEM_VALUES: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
  };

  const COMPONENT_VALUE = 250;

  let sum = 0;
  for (const item of items) {
    if (ITEM_VALUES[item.type] !== undefined) {
      sum += ITEM_VALUES[item.type];
    } else if (item.type === 'rune' || item.type === 'moonstone') {
      sum += COMPONENT_VALUE;
    } else {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  return sum;
}

async function main() {
  try {
    let input = '';

    // Read from stdin
    const stdin = process.stdin;
    stdin.setEncoding('utf8');

    for await (const chunk of stdin) {
      input += chunk;
    }

    const scenario: ScenarioInput = JSON.parse(input);
    const results: StepResult[] = [];
    const policies: StoredPolicy[] = [];

    for (const step of scenario.steps) {
      if (step.op === 'quote') {
        // Validate items
        for (const item of step.items) {
          const validTypes = ['sword', 'amulet', 'staff', 'potion', 'rune', 'moonstone'];
          if (!validTypes.includes(item.type)) {
            throw new Error(`Unknown item type: ${item.type}`);
          }
        }

        const premium = calculateQuote({
          customer: scenario.customer,
          items: step.items,
          isFirstInsurance: policies.length === 0,
        });

        const insuranceSum = calculateInsuranceSum(step.items);
        policies.push({
          items: step.items,
          insuranceSum,
          remainingCap: insuranceSum * 2,
        });

        results.push({ premium });
      } else if (step.op === 'claim') {
        if (step.policy < 0 || step.policy >= policies.length) {
          throw new Error(`Invalid policy index: ${step.policy}`);
        }

        const policy = policies[step.policy];

        const claimResult = calculateClaim({
          policy: {
            items: policy.items,
            insuranceSum: policy.insuranceSum,
            remainingCap: policy.remainingCap,
          },
          damages: step.incident.damages,
        });

        // Update remaining cap for this policy
        policy.remainingCap = claimResult.remainingCap;

        results.push({
          payout: claimResult.payout,
          remainingCap: claimResult.remainingCap,
        });
      }
    }

    const output: ScenarioOutput = { results };
    console.log(JSON.stringify(output));
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
