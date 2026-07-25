const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const POLICY_CAP_MULTIPLIER = 2;
const INSURANCE_VALUE_MULTIPLIER = 10;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const DEFAULT_BASE_PREMIUM = 100;

interface Customer {
  yearsWithMHPCO: number;
}

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ScenarioStep {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

interface Scenario {
  customer: Customer;
  steps: ScenarioStep[];
}

type Policy = { items: Item[]; cap: number };
type StepResult = { premium?: number; payout?: number; remainingCap?: number };

const basePremiumForType = (type: string): number =>
  BASE_PREMIUMS[type] ?? DEFAULT_BASE_PREMIUM;

const COMPONENT_BLOCK_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const basePremiumForItemGroup = (type: string, count: number): number => {
  if (COMPONENT_BLOCK_TYPES.has(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumForType(type);
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;

const itemPremiumMultiplier = (item: Item): number =>
  1 +
  (item.cursed ? CURSED_SURCHARGE_RATE : 0) +
  ((item.enchantment ?? 0) >= 5 ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

// Tiny epsilon avoids floating-point artifacts (e.g. 197.5000000001) from pushing
// a value that should round to N up to N+1.
const ROUNDING_EPSILON = 0.0001;
const roundUp = (value: number): number => Math.ceil(value - ROUNDING_EPSILON);
const roundDown = (value: number): number => Math.floor(value + ROUNDING_EPSILON);

const countByType = (entries: readonly { type: string }[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const entry of entries) {
    counts[entry.type] = (counts[entry.type] ?? 0) + 1;
  }
  return counts;
};

const insuranceValueForType = (type: string): number =>
  (BASE_PREMIUMS[type] ?? 0) * INSURANCE_VALUE_MULTIPLIER;

const totalInsuranceValueFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueForType(item.type), 0);

const policyCapFor = (items: Item[]): number =>
  totalInsuranceValueFor(items) * POLICY_CAP_MULTIPLIER;

const totalBasePremiumFor = (itemTypeCounts: Record<string, number>): number =>
  Object.entries(itemTypeCounts).reduce(
    (sum, [type, count]) => sum + basePremiumForItemGroup(type, count),
    0
  );

const totalModifiedItemPremiumFor = (
  items: Item[],
  itemTypeCounts: Record<string, number>
): number =>
  items.reduce((sum, item) => {
    const groupBase = basePremiumForItemGroup(item.type, itemTypeCounts[item.type]);
    const share = groupBase / itemTypeCounts[item.type];
    return sum + share * itemPremiumMultiplier(item);
  }, 0);

const customerContractModifierFor = (
  policyBase: number,
  customer: Customer,
  contractIndex: number
): number => {
  const netRate =
    FIRST_INSURANCE_SURCHARGE_RATE -
    (customer.yearsWithMHPCO >= 2 ? LOYALTY_DISCOUNT_RATE : 0) -
    (contractIndex > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);
  return policyBase * netRate;
};

const VALID_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUMS));

const validateQuoteItems = (items: Item[]): void => {
  for (const item of items) {
    if (!VALID_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const calculateQuotePremium = (
  items: Item[],
  customer: Customer,
  contractIndex: number
): number => {
  validateQuoteItems(items);
  const itemTypeCounts = countByType(items);
  const policyBase = totalBasePremiumFor(itemTypeCounts);
  const totalModifiedItemPremium = totalModifiedItemPremiumFor(items, itemTypeCounts);
  const modifier = customerContractModifierFor(policyBase, customer, contractIndex);
  return roundUp(totalModifiedItemPremium + modifier + PROCESSING_FEE);
};

const enchantmentDamageMultiplier = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((i) => i.type === damage.itemType);
  return (item?.enchantment ?? 0) >= 8 ? 0.5 : 1;
};

const validateDamages = (damages: Damage[], policyItems: Item[]): void => {
  const itemTypeCounts = countByType(policyItems);
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
    if (!itemTypeCounts[damage.itemType]) {
      throw new Error(`Item type ${damage.itemType} is not insured`);
    }
  }
  const damageTypeCounts = countByType(damages.map((damage) => ({ type: damage.itemType })));
  for (const [type, count] of Object.entries(damageTypeCounts)) {
    if (count > itemTypeCounts[type]) {
      throw new Error(`More damages than insured items for type ${type}`);
    }
  }
};

const calculateClaimResult = (
  policyCap: number,
  step: ScenarioStep,
  policyItems: Item[]
): { payout: number; remainingCap: number } => {
  const damages = step.incident?.damages ?? [];
  validateDamages(damages, policyItems);
  return damages.reduce(
    ({ payout, remainingCap }, damage) => {
      const multiplier = enchantmentDamageMultiplier(damage, policyItems);
      const afterDeductible = Math.max(0, damage.amount * multiplier - DEDUCTIBLE);
      const nextPayout = roundDown(Math.min(afterDeductible, remainingCap));
      return {
        payout: payout + nextPayout,
        remainingCap: remainingCap - nextPayout,
      };
    },
    { payout: 0, remainingCap: policyCap }
  );
};

export const processScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const quoteItems = step.items ?? [];
      results.push({
        premium: calculateQuotePremium(quoteItems, scenario.customer, results.length),
      });
      policies.push({ items: quoteItems, cap: policyCapFor(quoteItems) });
    } else if (step.op === "claim") {
      const policy = policies[step.policy ?? 0];
      const claimResult = calculateClaimResult(policy.cap, step, policy.items);
      policy.cap = claimResult.remainingCap;
      results.push(claimResult);
    }
  }
  return { results };
};
