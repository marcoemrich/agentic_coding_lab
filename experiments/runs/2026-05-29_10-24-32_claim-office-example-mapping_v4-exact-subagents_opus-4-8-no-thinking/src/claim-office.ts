const PROCESSING_FEE = 5;
const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type Customer = { years: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type Step = {
  type: string;
  items?: Item[];
  customer?: Customer;
  policy?: number;
  incident?: Incident;
};

const BLOCK_OF_3_PRICE = 60;

const COMPONENT_TYPES = ["rune", "moonstone"];

function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

function priceForType(type: string, count: number): number {
  if (COMPONENT_TYPES.includes(type) && count === 3) {
    return BLOCK_OF_3_PRICE;
  }
  return count * BASE_PREMIUM_BY_TYPE[type];
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= 5;
}

function hasItemModifier(item: Item): boolean {
  return Boolean(item.cursed) || isHighlyEnchanted(item);
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

function itemSurcharge(item: Item): number {
  const base = BASE_PREMIUM_BY_TYPE[item.type];
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
}

function modifiedItemsBasePremium(items: Item[]): number {
  return items
    .filter(hasItemModifier)
    .reduce((total, item) => total + BASE_PREMIUM_BY_TYPE[item.type], 0);
}

function plainPremium(items: Item[]): number {
  const counts = countByType(items.filter((item) => !hasItemModifier(item)));
  return Object.entries(counts).reduce(
    (total, [type, count]) => total + priceForType(type, count),
    0,
  );
}

function basePremium(items: Item[]): number {
  return modifiedItemsBasePremium(items) + plainPremium(items);
}

function surchargePremium(items: Item[]): number {
  return items.reduce((total, item) => total + itemSurcharge(item), 0);
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

function isLoyal(customer: Customer): boolean {
  return customer.years >= LOYALTY_MIN_YEARS;
}

function policyPremium(step: Step, isFollowUp: boolean): number {
  const items = step.items ?? [];
  const base = basePremium(items);
  const surcharges = surchargePremium(items);
  if (step.customer === undefined) {
    return base + surcharges;
  }
  const loyaltyDiscount = isLoyal(step.customer) ? LOYALTY_DISCOUNT : 0;
  const followUpDiscount = isFollowUp ? FOLLOW_UP_DISCOUNT : 0;
  const netModifierRate =
    FIRST_INSURANCE_SURCHARGE - loyaltyDiscount - followUpDiscount;
  return base + surcharges + base * netModifierRate;
}

function roundUpInFavor(amount: number): number {
  return Math.ceil(amount);
}

function roundDownInFavor(amount: number): number {
  return Math.floor(amount);
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

function insuranceSum(items: Item[]): number {
  return items.reduce(
    (total, item) => total + INSURANCE_VALUE_BY_TYPE[item.type],
    0,
  );
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function quoteResult(step: Step, isFollowUp: boolean): { premium: number } {
  assertKnownItemTypes(step.items ?? []);
  return {
    premium: roundUpInFavor(PROCESSING_FEE + policyPremium(step, isFollowUp)),
  };
}

function damagePayout(item: Item | undefined, amount: number): number {
  const coveredAmount =
    (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : amount;
  return coveredAmount - DEDUCTIBLE;
}

function assertValidDamages(damages: Damage[], policyItems: Item[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
  const insuredCounts = countByType(policyItems);
  const damageCounts = countByType(
    damages.map((damage) => ({ type: damage.itemType })),
  );
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (insuredCounts[type] ?? 0)) {
      throw new Error(`Too many damage entries for ${type}`);
    }
  }
}

function claimResult(
  step: Step,
  steps: Step[],
  consumedByPolicy: Map<number, number>,
): { payout: number; remainingCap: number } {
  const policyIndex = step.policy ?? 0;
  const policyStep = steps[policyIndex];
  const policyItems = policyStep.items ?? [];
  const cap = CAP_MULTIPLIER * insuranceSum(policyItems);
  const damages = step.incident?.damages ?? [];
  assertValidDamages(damages, policyItems);
  const desiredPayout = damages.reduce((total, damage) => {
    const item = policyItems.find((i) => i.type === damage.itemType);
    return total + damagePayout(item, damage.amount);
  }, 0);
  const consumed = consumedByPolicy.get(policyIndex) ?? 0;
  const availableCap = cap - consumed;
  const payout = roundDownInFavor(Math.min(desiredPayout, availableCap));
  consumedByPolicy.set(policyIndex, consumed + payout);
  return { payout, remainingCap: availableCap - payout };
}

function hasPriorQuote(steps: Step[], index: number): boolean {
  return steps.slice(0, index).some((prior) => prior.type === "quote");
}

export function runScenario(steps: Step[]): unknown[] {
  const consumedByPolicy = new Map<number, number>();
  return steps.map((step, index) => {
    if (step.type === "claim") {
      return claimResult(step, steps, consumedByPolicy);
    }
    return quoteResult(step, hasPriorQuote(steps, index));
  });
}
