type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };
type ScenarioInput = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_INSURANCE_VALUE = 250;
const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;
const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

function componentBaseFor(count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE
    : count * COMPONENT_BASE;
}

function policyBase(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let base = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      base += ITEM_BASE_PREMIUM[item.type];
    }
  }
  for (const count of Object.values(componentCounts)) {
    base += componentBaseFor(count);
  }
  return base;
}

function surchargeOn(
  items: Item[],
  rate: number,
  applies: (item: Item) => boolean,
): number {
  let total = 0;
  for (const item of items) {
    if (applies(item)) {
      total += ITEM_BASE_PREMIUM[item.type] * rate;
    }
  }
  return total;
}

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

function quotePremium(
  customer: { yearsWithMHPCO: number },
  items: Item[],
  quoteIndex: number,
): number {
  const base = policyBase(items);
  // First-insurance is +10% on the base; use integer tenths to avoid float drift.
  const withFirstInsurance = (base * 11) / 10;
  const surcharges =
    surchargeOn(items, CURSE_SURCHARGE_RATE, isCursed) +
    surchargeOn(items, HIGH_ENCHANTMENT_RATE, isHighlyEnchanted);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? base * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = quoteIndex > 0 ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  const discounts = loyaltyDiscount + followUpDiscount;
  return Math.ceil(withFirstInsurance + surcharges - discounts) + PROCESSING_FEE;
}

function insuranceValueOf(item: Item): number {
  return COMPONENT_TYPES.has(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : ITEM_INSURANCE_VALUE[item.type];
}

function insuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) sum += insuranceValueOf(item);
  return sum;
}

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function reimbursementFor(item: Item, amount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

const KNOWN_ITEM_TYPES = new Set<string>([
  ...Object.keys(ITEM_INSURANCE_VALUE),
  ...COMPONENT_TYPES,
]);

function validateKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function validateDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
}

function validateDamageCountsAgainstInsured(
  damages: Damage[],
  insuredItems: Item[],
): void {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const insuredCount = insuredItems.filter((i) => i.type === itemType).length;
    if (count > insuredCount) {
      throw new Error(
        `Claim has ${count} damage entries of type ${itemType} but only ${insuredCount} insured`,
      );
    }
  }
}

export function runScenario(input: unknown): unknown {
  const { customer, steps } = input as ScenarioInput;
  let quoteIndex = 0;
  const remainingCaps: Record<number, number> = {};
  const policyItems: Record<number, Item[]> = {};
  const results = steps.map((step, index) => {
    if (step.op === "quote") {
      validateKnownItemTypes(step.items);
      remainingCaps[index] = CAP_MULTIPLIER * insuranceSum(step.items);
      policyItems[index] = step.items;
      return { premium: quotePremium(customer, step.items, quoteIndex++) };
    }
    const items = policyItems[step.policy];
    validateDamageAmounts(step.incident.damages);
    validateDamageCountsAgainstInsured(step.incident.damages, items);
    let desiredPayout = 0;
    for (const damage of step.incident.damages) {
      const item = items.find((i) => i.type === damage.itemType)!;
      desiredPayout += reimbursementFor(item, damage.amount) - DEDUCTIBLE_PER_DAMAGE;
    }
    const cap = remainingCaps[step.policy];
    const payout = Math.floor(Math.min(desiredPayout, cap));
    const remainingCap = cap - payout;
    remainingCaps[step.policy] = remainingCap;
    return { payout, remainingCap };
  });
  return { results };
}
