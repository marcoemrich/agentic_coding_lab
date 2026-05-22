import { quote, claim, type Customer, type Item, type Incident } from "./claim-office.js";

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

interface QuoteStep {
  op?: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

function errorResult(message: string): CliResult {
  return { stdout: "", stderr: message, exitCode: 1 };
}

function validateQuoteItems(items: Item[]): string | null {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      return `unknown item type: ${item.type}`;
    }
  }
  return null;
}

function validateClaim(policyItems: Item[], incident: Incident): string | null {
  const policyTypes = new Set(policyItems.map((item) => item.type));
  const damageCounts = new Map<string, number>();
  for (const damage of incident.damages) {
    if (!policyTypes.has(damage.itemType)) {
      return `claim damage itemType ${damage.itemType} not in policy`;
    }
    if (damage.amount < 0) {
      return `claim damage amount must be non-negative: ${damage.amount}`;
    }
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const [itemType, count] of damageCounts) {
    const policyCount = policyItems.filter((item) => item.type === itemType).length;
    if (count > policyCount) {
      return `claim has more ${itemType} damages (${count}) than policy contains (${policyCount})`;
    }
  }
  return null;
}

export function runScenario(scenarioJson: string): CliResult {
  const scenario: Scenario = JSON.parse(scenarioJson);
  const results = [];
  for (const step of scenario.steps) {
    if (step.op === "claim") {
      const policyItems = (scenario.steps[step.policy] as QuoteStep).items;
      const error = validateClaim(policyItems, step.incident);
      if (error) return errorResult(error);
      results.push(claim({ items: policyItems }, step.incident));
      continue;
    }
    const error = validateQuoteItems(step.items);
    if (error) return errorResult(error);
    results.push({ premium: quote(scenario.customer, step.items) });
  }
  return { stdout: JSON.stringify({ results }), stderr: "", exitCode: 0 };
}
