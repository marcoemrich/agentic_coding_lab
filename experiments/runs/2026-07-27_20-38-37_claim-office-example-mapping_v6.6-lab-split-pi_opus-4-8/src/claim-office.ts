export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface MainItemPricing {
  basePrice: number;
  insuranceValue: number;
}

const MAIN_ITEMS: Record<string, MainItemPricing> = {
  sword: { basePrice: 100, insuranceValue: 1000 },
  amulet: { basePrice: 60, insuranceValue: 600 },
  staff: { basePrice: 80, insuranceValue: 800 },
  potion: { basePrice: 40, insuranceValue: 400 },
};

const COMPONENT_BASE_PRICE = 25;
const BLOCK_BASE_PRICE = 60;
const BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isMainItem = (item: Item): boolean => item.type in MAIN_ITEMS;

const isKnownItemType = (type: string): boolean =>
  type in MAIN_ITEMS || COMPONENT_TYPES.has(type);

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const countByType = (items: { type: string }[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const priceComponentGroup = (count: number): number =>
  count === BLOCK_SIZE
    ? BLOCK_BASE_PRICE
    : count * COMPONENT_BASE_PRICE;

const countComponentsByType = (items: Item[]): Map<string, number> =>
  countByType(items.filter((item) => !isMainItem(item)));

export const basePremium = (items: Item[]): number => {
  const mainTotal = items
    .filter(isMainItem)
    .reduce((sum, item) => sum + MAIN_ITEMS[item.type].basePrice, 0);

  const componentTotal = [...countComponentsByType(items).values()].reduce(
    (sum, count) => sum + priceComponentGroup(count),
    0
  );

  return mainTotal + componentTotal;
};

const COMPONENT_INSURANCE_VALUE = 250;

const itemInsuranceValue = (item: Item): number =>
  MAIN_ITEMS[item.type]?.insuranceValue ?? COMPONENT_INSURANCE_VALUE;

export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemBasePrice = (item: Item): number =>
  isMainItem(item) ? MAIN_ITEMS[item.type].basePrice : COMPONENT_BASE_PRICE;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharges = (item: Item): number => {
  const base = itemBasePrice(item);
  const cursedSurcharge = isCursed(item) ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_RATE
    : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const totalItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const qualifiesForLoyalty = (yearsWithMHPCO: number): boolean =>
  yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const loyaltyDiscount = (policyBase: number, yearsWithMHPCO: number): number =>
  qualifiesForLoyalty(yearsWithMHPCO) ? policyBase * LOYALTY_RATE : 0;

const followupDiscount = (policyBase: number, contractIndex: number): number =>
  contractIndex > 0 ? policyBase * FOLLOWUP_RATE : 0;

export const quotePremium = (
  items: Item[],
  opts?: { yearsWithMHPCO?: number; contractIndex?: number }
): number => {
  const policyBase = basePremium(items);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_RATE;
  return roundPremium(
    policyBase +
      totalItemSurcharges(items) +
      firstInsuranceSurcharge -
      loyaltyDiscount(policyBase, opts?.yearsWithMHPCO ?? 0) -
      followupDiscount(policyBase, opts?.contractIndex ?? 0) +
      PROCESSING_FEE
  );
};

// Rounding always resolves in MHPCO's favor: premiums round up (customer
// pays more), payouts round down (MHPCO pays less).
export const roundPremium = (amount: number): number => Math.ceil(amount);

export const roundPayout = (amount: number): number => Math.floor(amount);

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

const reimbursementFraction = (item: Item | undefined): number =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : 1;

const damagePayout = (damageAmount: number, item: Item | undefined): number =>
  roundPayout(damageAmount * reimbursementFraction(item) - DEDUCTIBLE);

const claimTotalPayout = (
  damages: Damage[],
  policyItems: Item[]
): number =>
  damages.reduce((sum, damage) => {
    const item = policyItems.find((i) => i.type === damage.itemType);
    return sum + damagePayout(damage.amount, item);
  }, 0);

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

const rejectNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Claim rejected: negative damage amount ${damage.amount}`);
    }
  }
};

const rejectUncoveredDamages = (damages: Damage[], policyItems: Item[]): void => {
  const insuredCounts = countByType(policyItems);
  const damageCounts = countByType(
    damages.map((damage) => ({ type: damage.itemType }))
  );
  const overCovered = [...damageCounts].find(
    ([type, count]) => count > (insuredCounts.get(type) ?? 0)
  );
  if (overCovered) {
    const [type, count] = overCovered;
    throw new Error(
      `Claim rejected: ${count} ${type} damages exceed insured coverage`
    );
  }
};

const validateDamages = (damages: Damage[], policyItems: Item[]): void => {
  rejectNegativeDamages(damages);
  rejectUncoveredDamages(damages, policyItems);
};

// Settles a claim against a policy: payout is capped at the remaining cap,
// which is then reduced by the amount actually paid.
const settleClaim = (
  policy: Policy,
  incident: Incident
): { payout: number; remainingCap: number } => {
  validateDamages(incident.damages, policy.items);
  const rawPayout = claimTotalPayout(incident.damages, policy.items);
  const payout = Math.min(rawPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export const runScenario = (scenario: unknown): unknown => {
  const { customer, steps } = scenario as Scenario;

  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  const results = steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      validateItemTypes(items);
      const premium = quotePremium(items, {
        yearsWithMHPCO: customer.yearsWithMHPCO,
        contractIndex,
      });
      contractIndex += 1;
      policies.set(stepIndex, {
        items,
        remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
      });
      return { premium };
    }

    return settleClaim(policies.get(step.policy!)!, step.incident!);
  });

  return { results };
};
