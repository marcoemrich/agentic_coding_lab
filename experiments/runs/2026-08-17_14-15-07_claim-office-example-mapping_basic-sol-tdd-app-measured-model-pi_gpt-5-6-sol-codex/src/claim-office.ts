export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<
    | { op: "quote"; items: Item[] }
    | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
  >;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function componentBlockSavings(items: Item[]): number {
  return COMPONENT_TYPES.reduce((savings, type) => {
    const count = items.filter((item) => item.type === type).length;
    const regularPremium = count * BASE_PREMIUMS[type];
    return savings + (count === COMPONENT_BLOCK_SIZE ? regularPremium - COMPONENT_BLOCK_PREMIUM : 0);
  }, 0);
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const regularBase = items.reduce((total, item) => total + (BASE_PREMIUMS[item.type] ?? 0), 0);
  const basePremium = regularBase - componentBlockSavings(items);
  const curseSurcharge = items.reduce(
    (total, item) => total + (item.cursed ? BASE_PREMIUMS[item.type] * CURSE_SURCHARGE_RATE : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (total, item) => total + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? BASE_PREMIUMS[item.type] * ENCHANTMENT_SURCHARGE_RATE
      : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge
    + basePremium * INITIAL_ASSESSMENT_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

type ClaimResult = { payout: number; remainingCap: number };
type Result = { premium: number } | ClaimResult;

function policyCap(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0) * CAP_MULTIPLIER;
}

function validateDamageCounts(items: Item[], damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount must not be negative");
    }
    const insuredCount = items.filter((item) => item.type === damage.itemType).length;
    const damageCount = damages.filter((entry) => entry.itemType === damage.itemType).length;
    if (damageCount > insuredCount) {
      throw new Error("Damage item is not covered by the policy");
    }
  }
}

function reimbursement(items: Item[], damage: Damage): number {
  const item = items.find((insured) => insured.type === damage.itemType);
  const rate = (item?.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL ? HALF_REIMBURSEMENT_RATE : 1;
  return Math.max(damage.amount * rate - DEDUCTIBLE, 0);
}

function settleClaim(items: Item[], damages: Damage[], previouslyPaid: number): ClaimResult {
  validateDamageCounts(items, damages);
  const cap = policyCap(items);
  const desiredPayout = damages.reduce((total, damage) => total + reimbursement(items, damage), 0);
  const payout = Math.floor(Math.min(desiredPayout, cap - previouslyPaid));
  return { payout, remainingCap: cap - previouslyPaid - payout };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const paidByPolicy = new Map<number, number>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "quote") {
      const isFollowUp = scenario.steps.slice(0, index).some((previous) => previous.op === "quote");
      return { premium: quote(step.items, scenario.customer.yearsWithMHPCO, isFollowUp) };
    }
    const policy = scenario.steps[step.policy];
    const result = settleClaim(policy.op === "quote" ? policy.items : [], step.incident.damages, paidByPolicy.get(step.policy) ?? 0);
    paidByPolicy.set(step.policy, (paidByPolicy.get(step.policy) ?? 0) + result.payout);
    return result;
  });
  return { results };
}
