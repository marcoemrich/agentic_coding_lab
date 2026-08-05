export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

interface ItemCatalogEntry {
  basePremium: number;
  insuranceValue: number;
}

const ITEM_CATALOG: Record<string, ItemCatalogEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const basePremiumOfItem = (item: Item): number => ITEM_CATALOG[item.type]?.basePremium ?? 0;

const ensureItemTypesAreKnown = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in ITEM_CATALOG)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const BLOCK_DISCOUNT_TYPES = ["rune", "moonstone"];

const blockAdjustment = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length === BLOCK_SIZE
    ? BLOCK_PREMIUM - BLOCK_SIZE * ITEM_CATALOG[type].basePremium
    : 0;

const totalBasePremium = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOfItem(item), 0) +
  BLOCK_DISCOUNT_TYPES.reduce((sum, type) => sum + blockAdjustment(items, type), 0);

const basePremiumSurcharge = (items: Item[], rate: number, appliesTo: (item: Item) => boolean): number =>
  items.reduce((sum, item) => sum + (appliesTo(item) ? basePremiumOfItem(item) * rate : 0), 0);

const CURSE_RATE = 0.5;

const curseSurcharge = (items: Item[]): number =>
  basePremiumSurcharge(items, CURSE_RATE, (item) => item.cursed === true);

const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;

const hasEnchantmentAtLeast = (item: Item, level: number): boolean =>
  (item.enchantment ?? 0) >= level;

const highEnchantmentSurcharge = (items: Item[]): number =>
  basePremiumSurcharge(items, HIGH_ENCHANTMENT_RATE, (item) =>
    hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_LEVEL),
  );

const firstInsuranceSurcharge = (basePremium: number): number => basePremium * FIRST_INSURANCE_RATE;

const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;

const loyaltyDiscount = (basePremium: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;

const FOLLOW_UP_RATE = 0.15;

const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  isFollowUp ? basePremium * FOLLOW_UP_RATE : 0;

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const basePremium = totalBasePremium(items);
  const totalSurcharges =
    curseSurcharge(items) + highEnchantmentSurcharge(items) + firstInsuranceSurcharge(basePremium);
  const totalDiscounts =
    loyaltyDiscount(basePremium, yearsWithMHPCO) + followUpDiscount(basePremium, isFollowUp);
  return Math.ceil(basePremium + totalSurcharges - totalDiscounts + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;

const totalInsuranceValue = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (ITEM_CATALOG[item.type]?.insuranceValue ?? 0), 0);

const CAP_MULTIPLIER = 2;

const HIGH_ENCHANTMENT_CLAUSE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

const ensureDamageAmountsAreValid = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Invalid damage amount: ${damage.amount}`);
    }
  }
};

const ensureDamageCountsCoveredByPolicy = (damages: Damage[], policyItems: Item[]): void => {
  const damagedTypes = new Set(damages.map((damage) => damage.itemType));
  for (const type of damagedTypes) {
    const damagedCount = damages.filter((damage) => damage.itemType === type).length;
    const insuredCount = policyItems.filter((item) => item.type === type).length;
    if (damagedCount > insuredCount) {
      throw new Error(`More damages of type ${type} than the policy covers`);
    }
  }
};

const claimSettlement = (
  damages: Damage[],
  policyItems: Item[],
  availableCap: number,
): { payout: number; remainingCap: number } => {
  ensureDamageAmountsAreValid(damages);
  ensureDamageCountsCoveredByPolicy(damages, policyItems);

  const reimbursementOf = (damage: Damage): number => {
    const item = policyItems.find((candidate) => candidate.type === damage.itemType);
    if (!item) {
      throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    }
    const clauseAdjustedDamage = hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_CLAUSE_LEVEL)
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : damage.amount;
    return Math.max(0, clauseAdjustedDamage - DEDUCTIBLE);
  };

  const rawPayout = damages.reduce((sum, damage) => sum + reimbursementOf(damage), 0);
  const payout = Math.min(Math.floor(rawPayout), availableCap);
  return { payout, remainingCap: availableCap - payout };
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const policies: Item[][] = [];
  const remainingCaps: number[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      ensureItemTypesAreKnown(step.items);
      policies[index] = step.items;
      remainingCaps[index] = CAP_MULTIPLIER * totalInsuranceValue(step.items);
      return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, index > 0) };
    }
    const policyIndex = step.policy;
    const settlement = claimSettlement(step.incident.damages, policies[policyIndex], remainingCaps[policyIndex]);
    remainingCaps[policyIndex] = settlement.remainingCap;
    return settlement;
  });
  return { results };
};
