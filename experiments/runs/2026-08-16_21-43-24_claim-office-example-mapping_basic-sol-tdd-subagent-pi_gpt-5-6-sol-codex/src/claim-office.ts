export type Item = Record<string, unknown>;

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; [key: string]: unknown }>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  damages: Damage[];
}

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_MINIMUM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const POLICY_CAP_MULTIPLIER = 2;
const INITIAL_ASSESSMENT_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const ENCHANTMENT_SURCHARGE_MINIMUM_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const LOYALTY_DISCOUNT_MINIMUM_YEARS = 2;
const PERCENT = 100;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const ITEMIZED_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function percentageOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function basePremiumFor(item: Item): number {
  const premium = ITEMIZED_BASE_PREMIUMS[String(item.type)];
  if (premium === undefined) {
    throw new Error(`Unknown item type: ${String(item.type)}`);
  }
  return premium;
}

function blockAdjustedBasePremiumFor(items: Item[]): number {
  const itemizedBasePremium = items.reduce((total, current) => total + basePremiumFor(current), 0);
  const blockDiscount = COMPONENT_TYPES.reduce((discount, componentType) => {
    const count = items.filter(({ type }) => type === componentType).length;
    return discount + (count === COMPONENT_BLOCK_SIZE
      ? count * ITEMIZED_BASE_PREMIUMS[componentType] - COMPONENT_BLOCK_PREMIUM
      : 0);
  }, 0);
  return itemizedBasePremium - blockDiscount;
}

function quote(
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUp: boolean,
): Record<string, number> {
  const basePremium = blockAdjustedBasePremiumFor(items);
  const curseSurcharge = items.reduce((total, current) => current.cursed === true
    ? total + percentageOf(basePremiumFor(current), CURSE_SURCHARGE_PERCENT)
    : total, 0);
  const enchantmentSurcharge = items.reduce((total, current) => Number(current.enchantment) >= ENCHANTMENT_SURCHARGE_MINIMUM_LEVEL
    ? total + percentageOf(basePremiumFor(current), ENCHANTMENT_SURCHARGE_PERCENT)
    : total, 0);
  const assessedPremium = basePremium + percentageOf(basePremium, INITIAL_ASSESSMENT_PERCENT);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_DISCOUNT_MINIMUM_YEARS
    ? percentageOf(basePremium, LOYALTY_DISCOUNT_PERCENT)
    : 0;
  const followUpDiscount = isFollowUp
    ? percentageOf(basePremium, FOLLOW_UP_DISCOUNT_PERCENT)
    : 0;
  return {
    premium: Math.ceil(
      assessedPremium + curseSurcharge + enchantmentSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
    ),
  };
}

function reimbursementForDamage(insuredItem: Item, damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error("Damage amount cannot be negative");
  }
  const reimbursementPercent = Number(insuredItem.enchantment) >= HIGH_ENCHANTMENT_REIMBURSEMENT_MINIMUM_LEVEL
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT
    : PERCENT;
  return Math.max(0, percentageOf(damage.amount, reimbursementPercent) - DEDUCTIBLE);
}

function processClaim(policy: Policy, incident: Incident): Record<string, number> {
  const unmatchedInsuredItems = [...policy.items];
  const uncappedPayout = incident.damages.reduce((total, damage) => {
    const itemIndex = unmatchedInsuredItems.findIndex(({ type }) => type === damage.itemType);
    if (itemIndex < 0) {
      throw new Error(`Damage item is not insured: ${damage.itemType}`);
    }
    const insuredItem = unmatchedInsuredItems.splice(itemIndex, 1)[0];
    return total + reimbursementForDamage(insuredItem, damage);
  }, 0);
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let isFollowUp = false;
  const policies = new Map<number, Policy>();
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "claim") {
        return processClaim(
          policies.get(Number(step.policy)) as Policy,
          step.incident as Incident,
        );
      }
      const items = step.items ?? [];
      const result = quote(items, scenario.customer.yearsWithMHPCO, isFollowUp);
      const totalInsuranceValue = items.reduce(
        (sum, insuredItem) => sum + (INSURANCE_VALUES[String(insuredItem.type)] ?? 0),
        0,
      );
      policies.set(stepIndex, { items, remainingCap: totalInsuranceValue * POLICY_CAP_MULTIPLIER });
      isFollowUp = true;
      return result;
    }),
  };
}
