import { quote, claim } from "./claim-office.js";

const KNOWN_ITEM_TYPES = new Set([
  "sword",
  "amulet",
  "staff",
  "potion",
  "rune",
  "moonstone",
]);

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

interface StepQuote {
  op: "quote";
  items: Array<{
    type: string;
    material: string;
    enchantment: number;
    cursed: boolean;
  }>;
}

interface StepClaim {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{
      itemType: string;
      amount: number;
    }>;
  };
}

type Step = StepQuote | StepClaim;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

async function main() {
  const input = await readStdin();
  const scenario: Scenario = JSON.parse(input);

  const customer = {
    yearsAsCustomer: scenario.customer.yearsWithMHPCO,
    quoteCount: 0,
  };

  const results: Array<
    | { premium: number }
    | { payout: number; remainingCap: number }
  > = [];

  // Track policies created by quote steps (items for each policy)
  const policies: Array<{
    items: StepQuote["items"];
    previousPayouts: number;
  }> = [];

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      // Validate item types
      for (const item of step.items) {
        if (!KNOWN_ITEM_TYPES.has(item.type)) {
          process.stderr.write(
            `Error: unknown item type "${item.type}"\n`,
          );
          process.exit(1);
        }
      }

      const premium = quote(customer, step.items);
      results.push({ premium });

      // Store policy for future claims
      policies.push({
        items: step.items,
        previousPayouts: 0,
      });

      // Increment quote count for follow-up discount
      customer.quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) {
        process.stderr.write(
          `Error: claim references non-existent policy at step ${step.policy}\n`,
        );
        process.exit(1);
      }

      // Validate damages
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          process.stderr.write(
            `Error: negative damage amount ${damage.amount}\n`,
          );
          process.exit(1);
        }

        if (!KNOWN_ITEM_TYPES.has(damage.itemType)) {
          process.stderr.write(
            `Error: unknown item type "${damage.itemType}" in damage\n`,
          );
          process.exit(1);
        }

        // Check that the damaged item is part of the policy
        const matchingItems = policy.items.filter(
          (item) => item.type === damage.itemType,
        );
        if (matchingItems.length === 0) {
          process.stderr.write(
            `Error: damage to "${damage.itemType}" but no such item in policy\n`,
          );
          process.exit(1);
        }
      }

      // Check that damages don't exceed insured items of each type
      const damageCounts: Record<string, number> = {};
      for (const damage of step.incident.damages) {
        damageCounts[damage.itemType] =
          (damageCounts[damage.itemType] || 0) + 1;
      }
      const policyCounts: Record<string, number> = {};
      for (const item of policy.items) {
        policyCounts[item.type] = (policyCounts[item.type] || 0) + 1;
      }
      for (const [type, count] of Object.entries(damageCounts)) {
        if (count > (policyCounts[type] || 0)) {
          process.stderr.write(
            `Error: more "${type}" damages (${count}) than insured items (${policyCounts[type] || 0})\n`,
          );
          process.exit(1);
        }
      }

      const result = claim(
        policy.items,
        step.incident,
        policy.previousPayouts,
      );
      results.push(result);
      policy.previousPayouts += result.payout;
    }
  }

  process.stdout.write(JSON.stringify({ results }));
}

main();
