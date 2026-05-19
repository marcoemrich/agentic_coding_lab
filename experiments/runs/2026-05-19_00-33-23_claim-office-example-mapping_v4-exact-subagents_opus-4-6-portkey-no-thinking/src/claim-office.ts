interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Step {
  type: string;
  items?: Item[];
  policy?: number;
  incident?: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

interface Scenario {
  customer: { years: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

type Result = QuoteResult | ClaimResult;

interface ScenarioOutput {
  results: Result[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const BUILDING_BLOCK_PREMIUM = 60;
const BUILDING_BLOCK_SIZE = 3;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const groupItemsByType = (items: Item[]): Record<string, Item[]> =>
  items.reduce<Record<string, Item[]>>((groups, item) => {
    const key = item.type;
    return { ...groups, [key]: [...(groups[key] ?? []), item] };
  }, {});

const calculateSingleItemPremium = (item: Item): number => {
  const basePremium = BASE_PREMIUMS[item.type];
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
      ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return basePremium + cursedSurcharge + enchantmentSurcharge;
};

const calculateGroupPremium = (typeItems: Item[]): { total: number; base: number } => {
  if (typeItems.length === BUILDING_BLOCK_SIZE) {
    return { total: BUILDING_BLOCK_PREMIUM, base: BUILDING_BLOCK_PREMIUM };
  }
  return typeItems.reduce(
    (acc, item) => ({
      total: acc.total + calculateSingleItemPremium(item),
      base: acc.base + BASE_PREMIUMS[item.type],
    }),
    { total: 0, base: 0 },
  );
};

const calculateItemsPremium = (items: Item[]): { total: number; base: number } => {
  const groups = Object.values(groupItemsByType(items));
  return groups.reduce(
    (acc, group) => {
      const groupResult = calculateGroupPremium(group);
      return { total: acc.total + groupResult.total, base: acc.base + groupResult.base };
    },
    { total: 0, base: 0 },
  );
};

const calculateStepPremium = (
  step: Step,
  customerYears: number,
  isFollowUp: boolean,
): number => {
  const { total: itemsPremium, base: policyBasePremium } = calculateItemsPremium(step.items ?? []);
  const surcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customerYears >= LOYALTY_YEARS_THRESHOLD
      ? policyBasePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(itemsPremium + surcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

const calculateDamagePayout = (
  damage: { itemType: string; amount: number },
  policyItems: Item[],
): number => {
  const matchingItem = policyItems.find((item) => item.type === damage.itemType);
  const enchantment = matchingItem?.enchantment ?? 0;
  const reimbursement = enchantment >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursement - DEDUCTIBLE;
};

const calculateInsuranceCap = (policyStep: Step): number => {
  const policyItems = policyStep.items ?? [];
  const insuranceSum = policyItems.reduce(
    (sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0),
    0,
  );
  return insuranceSum * CAP_MULTIPLIER;
};

const calculateClaimResult = (step: Step, policyStep: Step, remainingCap: number): ClaimResult => {
  const policyItems = policyStep.items ?? [];
  const uncappedPayout = (step.incident?.damages ?? []).reduce(
    (sum, damage) => sum + calculateDamagePayout(damage, policyItems),
    0,
  );
  const payout = Math.floor(Math.min(uncappedPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};

export function processScenario(scenario: Scenario): ScenarioOutput {
  const remainingCaps: Record<number, number> = {};
  const results: Result[] = [];
  for (let index = 0; index < scenario.steps.length; index++) {
    const step = scenario.steps[index];
    if (step.type === "claim") {
      const policyIndex = step.policy!;
      const policyStep = scenario.steps[policyIndex];
      if (remainingCaps[policyIndex] === undefined) {
        remainingCaps[policyIndex] = calculateInsuranceCap(policyStep);
      }
      const claimResult = calculateClaimResult(step, policyStep, remainingCaps[policyIndex]);
      remainingCaps[policyIndex] = claimResult.remainingCap;
      results.push(claimResult);
    } else {
      const premium = calculateStepPremium(step, scenario.customer.years, index > 0);
      results.push({ premium });
    }
  }
  return { results };
}
