const KNOWN_TYPES = ["sword", "amulet", "staff", "potion", "rune", "moonstone"];

function validateItemTypes(items: any[]): void {
  for (const item of items) {
    if (!KNOWN_TYPES.includes(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function basePremium(item: any): number {
  return BASE_PREMIUMS[item.type] ?? 0;
}

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function isComponent(item: any): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function groupByType(items: any[]): Record<string, any[]> {
  const result: Record<string, any[]> = {};
  for (const item of items) {
    if (!result[item.type]) result[item.type] = [];
    result[item.type].push(item);
  }
  return result;
}

function componentGroupPremium(group: any[]): number {
  if (group.length === BLOCK_SIZE) return BLOCK_PREMIUM;
  return group.reduce((sum: number, item: any) => sum + basePremium(item), 0);
}

function countByType(entries: any[], typeKey: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    const type = entry[typeKey];
    counts[type] = (counts[type] ?? 0) + 1;
  }
  return counts;
}

function validateDamageCoverage(damages: any[], policyItems: any[]): void {
  const damageCounts = countByType(damages, "itemType");
  const policyCounts = countByType(policyItems, "type");
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`Damages exceed policy coverage for type: ${type}`);
    }
  }
}

function calculatePayout(damages: any[], policyItems: any[]): number {
  let payout = 0;
  for (const damage of damages) {
    const matchingItem = policyItems.find((item: any) => item.type === damage.itemType);
    let reimbursement = damage.amount;
    if (matchingItem && matchingItem.enchantment >= 8) {
      reimbursement = damage.amount * 0.5;
    }
    payout += reimbursement - DEDUCTIBLE;
  }
  return payout;
}

function processClaim(
  step: any,
  policyItems: any[],
  remainingCaps: Record<number, number>,
): { payout: number; remainingCap: number } {
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Negative damage amount");
    }
  }

  validateDamageCoverage(step.incident.damages, policyItems);

  const insuranceSum = policyItems.reduce(
    (sum: number, item: any) => sum + (INSURANCE_VALUES[item.type] ?? 0),
    0,
  );
  const cap = 2 * insuranceSum;
  if (remainingCaps[step.policy] === undefined) {
    remainingCaps[step.policy] = cap;
  }

  let payout = calculatePayout(step.incident.damages, policyItems);
  if (payout > remainingCaps[step.policy]) {
    payout = remainingCaps[step.policy];
  }
  payout = Math.floor(payout);
  remainingCaps[step.policy] -= payout;

  return { payout, remainingCap: remainingCaps[step.policy] };
}

function calculateItemSurcharges(items: any[]): number {
  let surcharges = 0;

  for (const item of items) {
    if (isComponent(item)) continue;
    const base = basePremium(item);
    if (item.cursed) {
      surcharges += base * 0.5;
    }
    if (item.enchantment >= 5) {
      surcharges += base * 0.3;
    }
  }

  return surcharges;
}

function calculateRawPolicyBase(items: any[]): number {
  const components = items.filter(isComponent);
  const nonComponents = items.filter((i: any) => !isComponent(i));

  let rawPolicyBase = 0;
  for (const item of nonComponents) {
    rawPolicyBase += basePremium(item);
  }
  for (const group of Object.values(groupByType(components))) {
    rawPolicyBase += componentGroupPremium(group);
  }

  return rawPolicyBase;
}

function processQuote(
  step: any,
  customer: any,
  quoteCount: number,
): { premium: number } {
  validateItemTypes(step.items);

  const rawPolicyBase = calculateRawPolicyBase(step.items);
  const itemSurcharges = calculateItemSurcharges(step.items);

  let policyWideModifier = rawPolicyBase * 0.1;

  if (customer.yearsWithMHPCO >= 2) {
    policyWideModifier -= rawPolicyBase * 0.2;
  }

  if (quoteCount > 1) {
    policyWideModifier -= rawPolicyBase * 0.15;
  }

  const premium = Math.ceil(rawPolicyBase + itemSurcharges + policyWideModifier + PROCESSING_FEE);

  return { premium };
}

export function claimOffice(input: any): unknown {
  const results = [];
  const quoteSteps: any[] = [];
  const remainingCaps: Record<number, number> = {};
  let quoteCount = 0;

  for (const step of input.steps) {
    if (step.op === "claim") {
      const policyItems = quoteSteps[step.policy];
      results.push(processClaim(step, policyItems, remainingCaps));
      continue;
    }

    quoteSteps.push(step.items);
    quoteCount++;
    results.push(processQuote(step, input.customer, quoteCount));
  }

  return { results };
}
