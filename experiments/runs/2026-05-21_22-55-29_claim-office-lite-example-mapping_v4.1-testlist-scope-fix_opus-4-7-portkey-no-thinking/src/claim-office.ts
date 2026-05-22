const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const COMPONENT_BLOCK_OF_3_PRICE = 60;
const COMPONENT_BLOCK_SIZE = 3;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CLAIM_DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type QuoteStep = { type: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { type: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer?: Customer; steps: Step[] };

function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemBasePrice(item: Item): number {
  const price = BASE_PREMIUMS[item.type];
  if (price === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return price;
}

function itemPriceWithSurcharges(item: Item): number {
  const base = itemBasePrice(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return base + curseSurcharge + highEnchantmentSurcharge;
}

function sumGroup(type: string, group: Item[], itemPrice: (item: Item) => number): number {
  if (COMPONENT_TYPES.has(type) && group.length === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_OF_3_PRICE;
  }
  return group.reduce((sum, item) => sum + itemPrice(item), 0);
}

function sumItems(items: Item[], itemPrice: (item: Item) => number): number {
  return Array.from(groupByType(items)).reduce(
    (total, [type, group]) => total + sumGroup(type, group, itemPrice),
    0,
  );
}

function calculatePremium(items: Item[], isLoyalCustomer: boolean, isFollowUp: boolean): number {
  const policyBase = sumItems(items, itemPriceWithSurcharges);
  const unmodifiedBase = sumItems(items, itemBasePrice);
  const firstInsuranceSurcharge = unmodifiedBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = isLoyalCustomer ? unmodifiedBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? unmodifiedBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return policyBase - loyaltyDiscount - followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE;
}

function findPolicyItemFor(damage: Damage, policyItems: Item[]): Item {
  const item = policyItems.find((i) => i.type === damage.itemType);
  if (!item) {
    throw new Error(`Damage references item type not in policy: ${damage.itemType}`);
  }
  return item;
}

function reimbursableAmount(damage: Damage, policyItems: Item[]): number {
  const item = findPolicyItemFor(damage, policyItems);
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE;
  }
  return damage.amount;
}

function damagePayout(damage: Damage, policyItems: Item[]): number {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
  return Math.max(0, reimbursableAmount(damage, policyItems) - CLAIM_DEDUCTIBLE);
}

function countBy<T>(items: T[], keyOf: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function calculatePayout(incident: Incident, policyItems: Item[]): number {
  const damageCounts = countBy(incident.damages, (d) => d.itemType);
  const policyCounts = countBy(policyItems, (i) => i.type);
  for (const [type, count] of damageCounts) {
    const policyCount = policyCounts.get(type) ?? 0;
    if (count > policyCount) {
      throw new Error(
        `Claim has more damages of type ${type} (${count}) than policy items (${policyCount})`,
      );
    }
  }
  return incident.damages.reduce((sum, damage) => sum + damagePayout(damage, policyItems), 0);
}

export function runScenario(
  scenario: unknown,
): { results: ({ premium: number } | { payout: number })[] } {
  const { customer, steps } = scenario as Scenario;
  const isLoyalCustomer = (customer?.yearsWithMHPCO ?? 0) >= LOYALTY_THRESHOLD_YEARS;
  let quoteCount = 0;
  const results = steps.map((step) => {
    if (step.type === "claim") {
      const policyStep = steps[step.policy] as QuoteStep;
      return { payout: Math.floor(calculatePayout(step.incident, policyStep.items)) };
    }
    const isFollowUp = quoteCount > 0;
    quoteCount++;
    return {
      premium: Math.ceil(calculatePremium(step.items, isLoyalCustomer, isFollowUp)),
    };
  });
  return { results };
}
