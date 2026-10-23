interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: { itemType: string; amount: number }[] };
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

const ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const ITEM_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_BASE = 25;
const COMPONENT_VALUE = 250;
const BLOCK_BASE = 60;
const BLOCK_SIZE = 3;

const FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANT_SURCHARGE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const REIMBURSE_THRESHOLD = 8;
const REIMBURSE_RATE = 0.5;

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

function isComponent(type: string): boolean {
  return type === "rune" || type === "moonstone";
}

function isKnownType(type: string): boolean {
  return isComponent(type) || type in ITEM_BASE;
}

function itemBasePremium(item: Item): number {
  return isComponent(item.type) ? COMPONENT_BASE : ITEM_BASE[item.type];
}

function itemValue(item: Item): number {
  return isComponent(item.type) ? COMPONENT_VALUE : ITEM_VALUE[item.type];
}

function policyBasePremium(items: Item[]): number {
  let base = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      base += itemBasePremium(item);
    }
  }
  for (const count of Object.values(componentCounts)) {
    base += count === BLOCK_SIZE ? BLOCK_BASE : count * COMPONENT_BASE;
  }
  return base;
}

function itemSurcharges(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    if (isComponent(item.type)) continue;
    const base = itemBasePremium(item);
    if (item.cursed) surcharge += CURSED_SURCHARGE * base;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) {
      surcharge += HIGH_ENCHANT_SURCHARGE * base;
    }
  }
  return surcharge;
}

function insuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    sum += itemValue(item);
  }
  return sum;
}

function quotePremium(
  customer: { yearsWithMHPCO: number },
  items: Item[],
  contractIndex: number,
): number {
  const base = policyBasePremium(items);
  const surcharge = itemSurcharges(items);

  let adjustment = FIRST_INSURANCE_SURCHARGE * base;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    adjustment -= LOYALTY_DISCOUNT * base;
  }
  if (contractIndex >= 1) {
    adjustment -= FOLLOW_UP_DISCOUNT * base;
  }

  return Math.ceil(base + surcharge + adjustment + FEE);
}

function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

function validateDamage(
  policyCounts: Record<string, number>,
  damage: { itemType: string; amount: number },
): void {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
  if (!isKnownType(damage.itemType)) {
    throw new Error(`unknown item type: ${damage.itemType}`);
  }
  if (!(damage.itemType in policyCounts)) {
    throw new Error(`damaged item not in policy: ${damage.itemType}`);
  }
}

function validateDamages(
  policyItems: Item[],
  damages: { itemType: string; amount: number }[],
): void {
  const policyCounts = countByType(policyItems);
  const damageCounts: Record<string, number> = {};

  for (const damage of damages) {
    validateDamage(policyCounts, damage);
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }

  for (const type of Object.keys(damageCounts)) {
    if (damageCounts[type] > policyCounts[type]) {
      throw new Error(`more damages of type ${type} than covered`);
    }
  }
}

function rawPayout(
  policyItems: Item[],
  damage: { itemType: string; amount: number },
): number {
  const item = policyItems.find((i) => i.type === damage.itemType);
  const enchantment = item?.enchantment ?? 0;
  const rate = enchantment >= REIMBURSE_THRESHOLD ? REIMBURSE_RATE : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function payoutForClaim(
  policyItems: Item[],
  damages: { itemType: string; amount: number }[],
): number {
  validateDamages(policyItems, damages);
  return damages.reduce((sum, damage) => sum + rawPayout(policyItems, damage), 0);
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function processScenario(
  scenario: Scenario,
): { results: unknown[] } {
  const results: unknown[] = [];
  const policies: Policy[] = [];
  let contractIndex = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const premium = quotePremium(scenario.customer, step.items, contractIndex);
      contractIndex += 1;
      const sum = insuranceSum(step.items);
      policies.push({ items: step.items, insuranceSum: sum, cap: sum * CAP_MULTIPLIER, remainingCap: sum * CAP_MULTIPLIER });
      results.push({ premium });
    } else {
      const policy = policies[step.policy];
      const payoutRequested = payoutForClaim(policy.items, step.incident.damages);
      const payout = Math.min(Math.floor(payoutRequested), policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }

  return { results };
}