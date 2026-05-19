const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const CURSED_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: {
    cause: string;
    damages: Damage[];
  };
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

const calculateComponentPremium = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * (BASE_PREMIUMS[type] ?? 0);

const calculateItemPremium = (item: Item): number => {
  const basePremium = BASE_PREMIUMS[item.type] ?? 0;
  const cursedSurcharge = item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= ENCHANTMENT_SURCHARGE_THRESHOLD ? basePremium * ENCHANTMENT_SURCHARGE_RATE : 0;
  return basePremium + cursedSurcharge + enchantmentSurcharge;
};

const calculatePolicyModifiers = (basePremiumTotal: number, customer: Customer, isFollowUp: boolean): number => {
  let modifier = basePremiumTotal * FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    modifier -= basePremiumTotal * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUp) {
    modifier -= basePremiumTotal * FOLLOW_UP_DISCOUNT_RATE;
  }
  return modifier;
};

const calculateQuotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const componentCounts: Record<string, number> = {};
  let itemsPremium = 0;
  let basePremiumTotal = 0;
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    basePremiumTotal += BASE_PREMIUMS[item.type];
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      itemsPremium += calculateItemPremium(item);
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    itemsPremium += calculateComponentPremium(type, count);
  }
  const policyModifier = calculatePolicyModifiers(basePremiumTotal, customer, isFollowUp);
  return Math.ceil(itemsPremium + policyModifier + PROCESSING_FEE);
};

const calculateDamageReimbursement = (item: Item, damageAmount: number): number => {
  const reimbursementRate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, damageAmount * reimbursementRate - DEDUCTIBLE);
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!policy.items.some(i => i.type === damage.itemType)) {
      throw new Error(`Item type not in policy: ${damage.itemType}`);
    }
  }
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    const policyCount = policy.items.filter(i => i.type === type).length;
    if (count > policyCount) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }
};

const processClaim = (policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } => {
  validateDamages(policy, damages);
  const totalPayout = damages.reduce((sum, damage) => {
    const item = policy.items.find(i => i.type === damage.itemType)!;
    return sum + calculateDamageReimbursement(item, damage.amount);
  }, 0);
  const cappedPayout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  policy.remainingCap -= cappedPayout;
  return { payout: cappedPayout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): { results: unknown[] } => {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
      policies[index] = { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
      return { premium: calculateQuotePremium(items, scenario.customer, isFollowUp) };
    }
    if (step.op === "claim") {
      return processClaim(policies[step.policy!], step.incident!.damages);
    }
    return {};
  });
  return { results };
};
