export interface Customer {
  yearsWithMHPCO: number;
}

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

export interface ClaimDamage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: ClaimDamage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
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

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const insuranceValueFor = (itemType: string): number => {
  if (COMPONENT_TYPES.has(itemType)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_ITEM_INSURANCE_VALUES[itemType];
};

const sumInsuranceValue = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;

const componentGroupPremium = (count: number): number => {
  const blocks = Math.floor(count / BUILDING_BLOCK_SIZE);
  const loose = count % BUILDING_BLOCK_SIZE;
  return blocks * BUILDING_BLOCK_PREMIUM + loose * COMPONENT_BASE_PREMIUM;
};

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemRiskMultiplier = (item: Item): number => {
  let surcharge = 0;
  if (item.cursed) surcharge += CURSED_SURCHARGE;
  if (isHighlyEnchanted(item)) surcharge += HIGH_ENCHANTMENT_SURCHARGE;
  return 1 + surcharge;
};

const sumBasePremium = (items: Item[]): number => {
  const componentCounts = new Map<string, number>();
  let mainItemTotal = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      mainItemTotal += MAIN_ITEM_BASE_PREMIUMS[item.type] * itemRiskMultiplier(item);
    }
  }
  let total = mainItemTotal;
  for (const [, count] of componentCounts) {
    total += componentGroupPremium(count);
  }
  return total;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;

const ceilG = (amount: number): number => Math.ceil(Math.round(amount * 100) / 100);

const loyaltyMultiplierFor = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? 1 - LOYALTY_DISCOUNT : 1;

const contractMultiplier = (contractIndex: number): number =>
  contractIndex === 0
    ? 1 + FIRST_INSURANCE_SURCHARGE
    : 1 - SUBSEQUENT_CONTRACT_DISCOUNT;

const computePremium = (items: Item[], customer: Customer, contractIndex: number): number => {
  const basePremium = sumBasePremium(items);
  const afterContractAdjustment = basePremium * contractMultiplier(contractIndex);
  const afterLoyalty = afterContractAdjustment * loyaltyMultiplierFor(customer);
  return ceilG(afterLoyalty + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const ENCHANTMENT_PAYOUT_RATE = 0.5;

const reimbursableDamage = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damageAmount * ENCHANTMENT_PAYOUT_RATE;
  }
  return damageAmount;
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const DRAGON_MATERIAL = "dragon";

const findInsuredItem = (damage: ClaimDamage, policy: Policy): Item | undefined =>
  policy.items.find((it) => it.type === damage.itemType);

const isDragonMaterial = (item: Item | undefined): boolean =>
  item?.material === DRAGON_MATERIAL;

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

const processClaim = (step: ClaimStep, policy: Policy): ClaimResult => {
  const dragonDamages: number[] = [];
  const normalReimbursables: number[] = [];
  for (const damage of step.incident.damages) {
    const item = findInsuredItem(damage, policy);
    if (isDragonMaterial(item)) {
      dragonDamages.push(damage.amount);
    } else {
      normalReimbursables.push(item ? reimbursableDamage(item, damage.amount) : damage.amount);
    }
  }
  const dragonPayout = sum(dragonDamages);
  const normalPayout = normalReimbursables.length > 0 ? sum(normalReimbursables) - DEDUCTIBLE : 0;
  const payout = Math.min(dragonPayout + normalPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const createPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * sumInsuranceValue(items),
});

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = computePremium(step.items, scenario.customer, quoteCount);
      quoteCount += 1;
      policies.set(stepIndex, createPolicy(step.items));
      return { premium };
    }
    return processClaim(step, policies.get(step.policy)!);
  });
  return { results };
};
