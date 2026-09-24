const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_BASE_PREMIUM = 60;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_BASE_PREMIUM = 80;
const STAFF_INSURANCE_VALUE = 800;
const POTION_BASE_PREMIUM = 40;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"] as const;
const INITIAL_ASSESSMENT_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_PERCENT = 50;
const DAMAGE_DEDUCTIBLE = 100;
const PERCENT_DENOMINATOR = 100;
const CAP_MULTIPLIER = 2;

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
};
type Result = { premium: number } | { payout: number; remainingCap: number };
type Policy = { items: Item[]; remainingCap: number };

type ItemTerms = { basePremium: number; insuranceValue: number };

const SWORD_TERMS: ItemTerms = {
  basePremium: SWORD_BASE_PREMIUM,
  insuranceValue: SWORD_INSURANCE_VALUE,
};
const ITEM_TERMS: Record<string, ItemTerms> = {
  sword: SWORD_TERMS,
  amulet: { basePremium: AMULET_BASE_PREMIUM, insuranceValue: AMULET_INSURANCE_VALUE },
  staff: { basePremium: STAFF_BASE_PREMIUM, insuranceValue: STAFF_INSURANCE_VALUE },
  potion: { basePremium: POTION_BASE_PREMIUM, insuranceValue: POTION_INSURANCE_VALUE },
  rune: { basePremium: COMPONENT_BASE_PREMIUM, insuranceValue: COMPONENT_INSURANCE_VALUE },
  moonstone: { basePremium: COMPONENT_BASE_PREMIUM, insuranceValue: COMPONENT_INSURANCE_VALUE },
};

function itemTerms(item: Item): ItemTerms {
  const terms = ITEM_TERMS[item.type];
  if (terms === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return terms;
}

function itemBasePremium(item: Item): number {
  return itemTerms(item).basePremium;
}

function itemInsuranceValue(item: Item): number {
  return itemTerms(item).insuranceValue;
}

function ordinaryBasePremium(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemBasePremium(item), 0);
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.some((type) => type === item.type);
}

function componentTypePremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function policyBasePremium(items: Item[]): number {
  const mainItemPremium = ordinaryBasePremium(items.filter((item) => !isComponent(item)));
  const componentPremium = COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentTypePremium(items, type),
    0,
  );
  return mainItemPremium + componentPremium;
}

function curseSurcharge(items: Item[]): number {
  const cursedBase = ordinaryBasePremium(items.filter((item) => item.cursed === true));
  return (cursedBase * CURSE_SURCHARGE_PERCENT) / PERCENT_DENOMINATOR;
}

function enchantmentSurcharge(items: Item[]): number {
  const enchantedBase = ordinaryBasePremium(
    items.filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD),
  );
  return (enchantedBase * HIGH_ENCHANTMENT_SURCHARGE_PERCENT) / PERCENT_DENOMINATOR;
}

function initialAssessment(basePremium: number): number {
  return (basePremium * INITIAL_ASSESSMENT_PERCENT) / PERCENT_DENOMINATOR;
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD
    ? (basePremium * LOYALTY_DISCOUNT_PERCENT) / PERCENT_DENOMINATOR
    : 0;
}

function followUpDiscount(basePremium: number, isFollowUp: boolean): number {
  return isFollowUp ? (basePremium * FOLLOW_UP_DISCOUNT_PERCENT) / PERCENT_DENOMINATOR : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = policyBasePremium(items);
  const policyAdjustments = initialAssessment(basePremium)
    - loyaltyDiscount(basePremium, yearsWithMHPCO)
    - followUpDiscount(basePremium, isFollowUp);
  const itemSurcharges = curseSurcharge(items) + enchantmentSurcharge(items);
  return Math.ceil(basePremium + itemSurcharges + policyAdjustments + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

function damagePayout(item: Item, damage: Damage): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? (damage.amount * HALF_REIMBURSEMENT_PERCENT) / PERCENT_DENOMINATOR
    : damage.amount;
  return Math.max(0, reimbursement - DAMAGE_DEDUCTIBLE);
}

type InsuredDamage = { item: Item; damage: Damage };

function validateDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error("Damage amount cannot be negative");
  }
}

function matchInsuredDamages(policy: Policy, damages: Damage[]): InsuredDamage[] {
  const availableItems = [...policy.items];
  return damages.map((damage) => {
    validateDamageAmount(damage);
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) {
      throw new Error("Damage entries exceed insured items");
    }
    const [item] = availableItems.splice(itemIndex, 1);
    return { item, damage };
  });
}

function desiredClaimPayout(policy: Policy, damages: Damage[]): number {
  return matchInsuredDamages(policy, damages).reduce(
    (sum, insuredDamage) => sum + damagePayout(insuredDamage.item, insuredDamage.damage),
    0,
  );
}

function claimPayout(policy: Policy, damages: Damage[]): number {
  return Math.min(Math.floor(desiredClaimPayout(policy, damages)), policy.remainingCap);
}

export function executeScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const remainingCap = insuranceSum(step.items) * CAP_MULTIPLIER;
      policies.set(index, { items: step.items, remainingCap });
      results.push({
        premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0),
      });
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy)!;
      const payout = claimPayout(policy, step.incident.damages);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  });
  return { results };
}
