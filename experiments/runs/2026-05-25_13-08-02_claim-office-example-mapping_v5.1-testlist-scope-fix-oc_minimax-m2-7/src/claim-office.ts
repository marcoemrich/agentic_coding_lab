const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  quoteIndex: number;
}

interface DamageEntry {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: DamageEntry[];
}

function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  return counts;
}

function calculateComponentPremium(type: string, count: number): number {
  if (count === 0) return 0;
  if (count === 3) return 60;
  return count * BASE_PREMIUMS[type];
}

function calculateItemPremium(item: Item): number {
  const base = BASE_PREMIUMS[item.type];
  if (base === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  let total = base;
  if (item.cursed) {
    total += base * 0.5;
  }
  if (item.enchantment !== undefined && item.enchantment >= 5) {
    total += base * 0.3;
  }
  return total;
}

export function calculateInsuranceSum(items: Item[]): number {
  let sum = 0;
  const counts = countByType(items);
  for (const [type, count] of Object.entries(counts)) {
    if (COMPONENT_TYPES.includes(type)) {
      sum += INSURANCE_VALUES[type] * count;
    } else {
      sum += (INSURANCE_VALUES[type] || 0) * count;
    }
  }
  return sum;
}

export function calculatePremium(
  items: Item[],
  yearsWithMHPCO: number = 0,
  isFollowUpContract: boolean = false,
  applySurcharges: boolean = true
): number {
  if (items.length === 0) return 5;

  const counts = countByType(items);
  let mainItemsTotal = 0;
  let componentTotal = 0;
  const processedComponents = new Set<string>();

  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      if (!processedComponents.has(item.type)) {
        componentTotal += calculateComponentPremium(item.type, counts[item.type]);
        processedComponents.add(item.type);
      }
    } else {
      mainItemsTotal += calculateItemPremium(item);
    }
  }

  let total = mainItemsTotal + componentTotal;

  if (yearsWithMHPCO >= 2) {
    total = total * 0.8;
  }

  if (applySurcharges) {
    total = total * 1.1;
  }

  if (isFollowUpContract) {
    total = total * 0.85;
  }

  total = Math.ceil(total);
  total = total + 5;

  return total;
}

export function calculatePayout(
  policy: Policy,
  incident: Incident
): { payout: number; remainingCap: number } {
  const usedIndices: Set<number> = new Set();
  let totalPayout = 0;

  for (const damage of incident.damages) {
    let amount = damage.amount;

    if (amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }

    let foundIndex = -1;
    for (let i = 0; i < policy.items.length; i++) {
      if (policy.items[i].type === damage.itemType && !usedIndices.has(i)) {
        foundIndex = i;
        usedIndices.add(i);
        break;
      }
    }

    if (foundIndex === -1) {
      throw new Error(`Item ${damage.itemType} is not part of the policy`);
    }

    const item = policy.items[foundIndex];

    if (item.enchantment !== undefined && item.enchantment >= 8) {
      amount = amount * 0.5;
    }

    amount = amount - 100;
    if (amount < 0) amount = 0;

    totalPayout += amount;
  }

  if (totalPayout > policy.remainingCap) {
    totalPayout = policy.remainingCap;
  }

  const remainingCap = policy.remainingCap - totalPayout;

  return { payout: totalPayout, remainingCap };
}

export function processScenario(scenario: {
  customer: { yearsWithMHPCO: number };
  steps: Array<{
    op: string;
    items?: Item[];
    policy?: number;
    incident?: Incident;
  }>;
}): { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> } {
  const policies: Policy[] = [];
  const results: Array<{ premium?: number; payout?: number; remainingCap?: number }> = [];
  let quoteCount = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const items = step.items || [];
      const insuranceSum = calculateInsuranceSum(items);
      const cap = insuranceSum * 2;
      const isFollowUp = quoteCount > 0;
      const premium = calculatePremium(items, scenario.customer.yearsWithMHPCO, isFollowUp);

      policies.push({
        items,
        insuranceSum,
        cap,
        remainingCap: cap,
        quoteIndex: results.length,
      });

      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy!];
      const result = calculatePayout(policy, step.incident!);
      policy.remainingCap = result.remainingCap;
      results.push({ payout: result.payout, remainingCap: result.remainingCap });
    }
  }

  return { results };
}