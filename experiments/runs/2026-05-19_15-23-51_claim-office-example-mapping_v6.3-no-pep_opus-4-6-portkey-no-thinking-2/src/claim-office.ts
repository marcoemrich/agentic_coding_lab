interface Item {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const validateItemType = (type: string): void => {
  if (!(type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${type}`);
  }
};

const calculateItemSurcharges = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type];
  let surcharge = 0;
  if (item.cursed) {
    surcharge += base * CURSED_SURCHARGE_RATE;
  }
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
};

const calculateComponentPremium = (componentCounts: Record<string, number>): number => {
  let total = 0;
  for (const [type, count] of Object.entries(componentCounts)) {
    total += count === BLOCK_SIZE ? BLOCK_PRICE : count * BASE_PREMIUMS[type];
  }
  return total;
};

const calculatePolicyModifiers = (basePremium: number, customer: { yearsWithMHPCO: number }, quoteIndex: number): number => {
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteIndex > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  return firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const calculateQuotePremium = (items: Item[], customer: { yearsWithMHPCO: number }, quoteIndex: number): number => {
  let basePremium = 0;
  let itemSurcharges = 0;
  const componentCounts: Record<string, number> = {};

  for (const item of items) {
    validateItemType(item.type);
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      basePremium += BASE_PREMIUMS[item.type];
      itemSurcharges += calculateItemSurcharges(item);
    }
  }

  basePremium += calculateComponentPremium(componentCounts);
  const policyModifiers = calculatePolicyModifiers(basePremium, customer, quoteIndex);
  return Math.ceil(basePremium + itemSurcharges + policyModifiers) + PROCESSING_FEE;
};

const CAP_MULTIPLIER = 2;

const calculateInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const validateClaimDamages = (damages: Damage[], policy: Policy): void => {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const policyItem = policy.items.find((i) => i.type === damage.itemType);
    if (!policyItem) {
      throw new Error(`Claim references item type not in policy: ${damage.itemType}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] || 0) + 1;
  }
  for (const [itemType, count] of Object.entries(damageCounts)) {
    const policyCount = policy.items.filter((i) => i.type === itemType).length;
    if (count > policyCount) {
      throw new Error(`More damage entries for ${itemType} than policy covers`);
    }
  }
};

const calculateDamageReimbursement = (damage: Damage, policyItem: Item): number => {
  const reimbursement = policyItem.enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
    ? damage.amount * CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
};

const calculateClaimPayout = (step: ClaimStep, policy: Policy): ClaimResult => {
  validateClaimDamages(step.incident.damages, policy);

  let totalPayout = 0;
  for (const damage of step.incident.damages) {
    const policyItem = policy.items.find((i) => i.type === damage.itemType)!;
    totalPayout += calculateDamageReimbursement(damage, policyItem);
  }

  totalPayout = Math.min(Math.floor(totalPayout), policy.remainingCap);
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const premium = calculateQuotePremium(step.items, scenario.customer, quoteCount);
      const insuranceSum = calculateInsuranceSum(step.items);
      policies[index] = { items: step.items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
      quoteCount++;
      return { premium };
    }
    return calculateClaimPayout(step, policies[step.policy]);
  });
  return { results };
};
