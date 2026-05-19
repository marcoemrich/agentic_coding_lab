const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

function isMainItem(type: string): boolean {
  return type in BASE_PREMIUMS;
}

function isKnownType(type: string): boolean {
  return isMainItem(type) || KNOWN_COMPONENT_TYPES.has(type);
}

function mainItemPremium(items: Item[]): number {
  return items
    .filter((item) => isMainItem(item.type))
    .reduce((sum, item) => sum + itemBasePremium(item), 0);
}

function countBy<T>(items: T[], keyFn: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function componentCounts(items: Item[]): Map<string, number> {
  return countBy(
    items.filter((item) => !isMainItem(item.type)),
    (item) => item.type,
  );
}

function componentPremium(items: Item[]): number {
  return [...componentCounts(items).values()].reduce(
    (total, count) => total + (count === 3 ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );
}

function itemBasePremium(item: Item): number {
  return BASE_PREMIUMS[item.type] ?? COMPONENT_PREMIUM;
}

function singleItemSurcharge(item: Item): number {
  const base = itemBasePremium(item);
  return (item.cursed ? base * CURSED_SURCHARGE_RATE : 0)
    + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + singleItemSurcharge(item), 0);
}

function computeQuotePremium(items: Item[], customer: { yearsWithMHPCO: number }, isFollowUp: boolean): number {
  const basePremium = mainItemPremium(items) + componentPremium(items);
  const surcharges = itemSurcharges(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + surcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!isKnownType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? COMPONENT_INSURANCE_VALUE), 0);
}

function damageReimbursement(policyItems: Item[], damage: Damage): number {
  const item = policyItems.find(i => i.type === damage.itemType);
  if (!item) {
    throw new Error(`Item type ${damage.itemType} is not covered by the policy`);
  }
  const reimbursement = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function validateDamages(items: Item[], damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  const damageCounts = countBy(damages, (d) => d.itemType);
  const insuredCounts = countBy(items, (i) => i.type);
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More damage entries for ${type} than items insured`);
    }
  }
}

function computeClaimPayout(
  items: Item[],
  remainingCap: number,
  damages: Damage[],
): { payout: number; remainingCap: number } {
  validateDamages(items, damages);
  const totalPayout = damages.reduce(
    (sum, damage) => sum + damageReimbursement(items, damage),
    0,
  );
  const payout = Math.floor(Math.min(totalPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}

export function processScenario(scenario: Scenario) {
  const policies: Array<{ items: Item[]; remainingCap: number }> = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const items = step.items;
      validateItems(items);
      const cap = 2 * insuranceSum(items);
      policies.push({ items, remainingCap: cap });
      return { premium: computeQuotePremium(items, scenario.customer, index > 0) };
    } else {
      const policy = policies[step.policy];
      const result = computeClaimPayout(policy.items, policy.remainingCap, step.incident.damages);
      policy.remainingCap = result.remainingCap;
      return result;
    }
  });
  return { results };
}
