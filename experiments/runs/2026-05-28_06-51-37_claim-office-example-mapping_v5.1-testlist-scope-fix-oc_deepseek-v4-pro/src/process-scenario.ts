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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function computeItemBasePremium(item: any): number {
  return BASE_PREMIUMS[item.type];
}

function computePolicyBasePremium(items: any[]): number {
  const counts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    if (!BASE_PREMIUMS[item.type]) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (isComponent(item.type)) {
      counts[item.type] = (counts[item.type] || 0) + 1;
    } else {
      total += BASE_PREMIUMS[item.type];
    }
  }

  for (const [type, count] of Object.entries(counts)) {
    if (count % 3 === 0) {
      total += (count / 3) * 60;
    } else {
      total += count * 25;
    }
  }

  return total;
}

function computeQuotePremium(items: any[], customer: any, quoteIndex: number): number {
  if (items.length === 0) return 5;

  for (const item of items) {
    if (!BASE_PREMIUMS[item.type]) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  let itemSpecificSurcharges = 0;
  for (const item of items) {
    if (isComponent(item.type)) continue;
    const base = computeItemBasePremium(item);
    if (item.cursed) itemSpecificSurcharges += base * 0.5;
    if (item.enchantment >= 5) itemSpecificSurcharges += base * 0.3;
  }

  const policyBase = computePolicyBasePremium(items);

  let total = policyBase + itemSpecificSurcharges;

  total += policyBase * 0.1; // first insurance

  if (customer.yearsWithMHPCO >= 2) total -= policyBase * 0.2; // loyalty
  if (quoteIndex > 0) total -= policyBase * 0.15; // follow-up contract

  return Math.ceil(total + 5);
}

interface Policy {
  items: any[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

function createPolicy(items: any[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += INSURANCE_VALUES[item.type];
  }
  const cap = insuranceSum * 2;
  return { items, insuranceSum, cap, remainingCap: cap };
}

function computePayout(policy: Policy, damages: any[]): { payout: number; remainingCap: number } {
  const itemCounts: Record<string, number> = {};
  for (const item of policy.items) {
    itemCounts[item.type] = (itemCounts[item.type] || 0) + 1;
  }

  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    if (d.amount < 0) throw new Error("Negative damage amount");
    damageCounts[d.itemType] = (damageCounts[d.itemType] || 0) + 1;
  }

  for (const [type, count] of Object.entries(damageCounts)) {
    if (!itemCounts[type] || count > itemCounts[type]) {
      throw new Error(`Damage count for ${type} exceeds insured count`);
    }
  }

  let totalPayout = 0;
  const policyItemIdx: Record<string, number> = {};

  for (const damage of damages) {
    const type = damage.itemType;
    const idx = policyItemIdx[type] || 0;
    const item = policy.items.filter((i: any) => i.type === type)[idx];
    policyItemIdx[type] = idx + 1;

    let reimbursement = damage.amount;

    if (item.enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    } else if (item.material === "dragon") {
      reimbursement = damage.amount;
    } else if (item.material === "dragon" && item.enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    }

    reimbursement = Math.max(0, reimbursement - 100);
    totalPayout += Math.floor(reimbursement);
  }

  totalPayout = Math.min(totalPayout, policy.remainingCap);
  const newRemainingCap = policy.remainingCap - totalPayout;
  policy.remainingCap = newRemainingCap;

  return { payout: totalPayout, remainingCap: newRemainingCap };
}

export function processScenario(input: any): any {
  const results: any[] = [];
  let quoteIndex = 0;
  const policies: Policy[] = [];

  for (const step of input.steps) {
    if (step.op === "quote") {
      const premium = computeQuotePremium(step.items, input.customer, quoteIndex);
      results.push({ premium });
      policies.push(createPolicy(step.items));
      quoteIndex++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`Policy index ${step.policy} not found`);
      const { payout, remainingCap } = computePayout(policy, step.incident.damages);
      results.push({ payout, remainingCap });
    }
  }

  return { results };
}