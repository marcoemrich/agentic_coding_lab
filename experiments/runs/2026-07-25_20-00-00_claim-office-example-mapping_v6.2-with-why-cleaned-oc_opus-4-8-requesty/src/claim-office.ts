export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

export interface Customer {
  yearsWithMHPCO: number;
}

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = 0.15;
const FIRST_QUOTE_NUMBER = 1;

const isFollowUpContract = (quoteNumber: number): boolean =>
  quoteNumber > FIRST_QUOTE_NUMBER;

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUMS || COMPONENT_TYPES.includes(type);

const itemBasePremium = (item: Item): number => {
  if (!isKnownItemType(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return BASE_PREMIUMS[item.type];
};

const countByType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const componentGroupBasePremium = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
};

const componentsBasePremium = (components: Item[]): number => {
  const countsByType = countByType(components.map((component) => component.type));
  return [...countsByType.values()].reduce(
    (total, count) => total + componentGroupBasePremium(count),
    0,
  );
};

const itemsBasePremium = (items: Item[]): number => {
  const components: Item[] = [];
  let nonComponentsBase = 0;
  for (const item of items) {
    if (isComponent(item)) {
      components.push(item);
    } else {
      nonComponentsBase += itemBasePremium(item);
    }
  }
  return nonComponentsBase + componentsBasePremium(components);
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_MIN_LEVEL = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_MIN_LEVEL;

const itemSurcharge = (item: Item): number => {
  const base = itemBasePremium(item);
  const curse = isCursed(item) ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item)
    ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + enchantment;
};

const itemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

const policyAdjustments = (
  base: number,
  customer: Customer,
  quoteNumber: number,
): number => {
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS
      ? base * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUp = isFollowUpContract(quoteNumber)
    ? base * FOLLOWUP_CONTRACT_DISCOUNT_RATE
    : 0;
  return firstInsurance - loyalty - followUp;
};

const quotePremium = (
  step: QuoteStep,
  customer: Customer,
  quoteNumber: number,
): number => {
  const base = itemsBasePremium(step.items);
  return (
    base +
    itemSurcharges(step.items) +
    policyAdjustments(base, customer, quoteNumber) +
    PROCESSING_FEE
  );
};

// Premiums round up, in MHPCO's favor.
const roundPremiumUp = (amount: number): number => Math.ceil(amount);

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_MIN_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const policyCap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

const reimbursedAmount = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_MIN_LEVEL) {
    return damageAmount * HALF_REIMBURSEMENT_RATE;
  }
  return damageAmount;
};

const damagePayout = (damage: Damage, item: Item): number =>
  reimbursedAmount(item, damage.amount) - DEDUCTIBLE;

const findInsuredItem = (items: Item[], itemType: string): Item =>
  items.find((item) => item.type === itemType)!;

const damagesPayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, damage) => {
    const item = findInsuredItem(items, damage.itemType);
    return sum + damagePayout(damage, item);
  }, 0);

// Payouts round down, in MHPCO's favor.
const roundPayoutDown = (amount: number): number => Math.floor(amount);

// A claim never pays out more than the policy's remaining cap.
const clampToCap = (desiredPayout: number, capBefore: number): ClaimResult => {
  const payout = Math.min(desiredPayout, capBefore);
  return { payout, remainingCap: capBefore - payout };
};

const rejectNegativeDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const rejectMoreDamagesThanInsured = (
  damages: Damage[],
  items: Item[],
): void => {
  const insuredCounts = countByType(items.map((item) => item.type));
  const damageCounts = countByType(damages.map((damage) => damage.itemType));
  for (const [itemType, damageCount] of damageCounts) {
    const insuredCount = insuredCounts.get(itemType) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `Claim has ${damageCount} ${itemType} damages but only ${insuredCount} insured`,
      );
    }
  }
};

const validateDamages = (damages: Damage[], items: Item[]): void => {
  rejectNegativeDamageAmounts(damages);
  rejectMoreDamagesThanInsured(damages, items);
};

const processClaim = (
  step: ClaimStep,
  quotesByStepIndex: Map<number, QuoteStep>,
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const policy = quotesByStepIndex.get(step.policy)!;
  validateDamages(step.incident.damages, policy.items);
  const capBefore = remainingCaps.get(step.policy) ?? policyCap(policy.items);
  const desiredPayout = roundPayoutDown(
    damagesPayout(step.incident.damages, policy.items),
  );
  const result = clampToCap(desiredPayout, capBefore);
  remainingCaps.set(step.policy, result.remainingCap);
  return result;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const quotesByStepIndex = new Map<number, QuoteStep>();
  const remainingCaps = new Map<number, number>();
  let quoteNumber = 0;
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return processClaim(step, quotesByStepIndex, remainingCaps);
    }
    quotesByStepIndex.set(index, step);
    quoteNumber += 1;
    return {
      premium: roundPremiumUp(
        quotePremium(step, scenario.customer, quoteNumber),
      ),
    };
  });
  return { results };
};
