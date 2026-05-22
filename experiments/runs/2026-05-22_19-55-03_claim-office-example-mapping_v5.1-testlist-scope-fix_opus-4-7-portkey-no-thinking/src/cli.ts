import { quote, createPolicy, claim, Item, Policy, Incident } from "./claim-office.js";

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}
type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

async function main(): Promise<void> {
  const raw = await readStdin();
  const scenario: Scenario = JSON.parse(raw);
  const policies = new Map<number, Policy>();
  const results: unknown[] = [];
  let priorContracts = 0;

  for (let i = 0; i < scenario.steps.length; i++) {
    const step = scenario.steps[i];
    if (step.op === "quote") {
      validateItems(step.items);
      const premium = quote(scenario.customer, step.items, priorContracts);
      policies.set(i, createPolicy(step.items));
      results.push({ premium });
      priorContracts++;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`unknown policy index: ${step.policy}`);
      for (const dmg of step.incident.damages) {
        if (!KNOWN_ITEM_TYPES.has(dmg.itemType)) {
          throw new Error(`unknown damage item type: ${dmg.itemType}`);
        }
      }
      const r = claim(policy, step.incident);
      results.push(r);
    }
  }
  process.stdout.write(JSON.stringify({ results }));
}

main().catch((err) => {
  process.stderr.write(`${err.message ?? err}\n`);
  process.exit(1);
});
