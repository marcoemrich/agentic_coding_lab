const PROCESSING_FEE = 5;

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause?: string;
  damages: Damage[];
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: Incident;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
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

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const basePremium = (item: Item): number => {
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return BASE_PREMIUMS[item.type];
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countByType = (items: Item[]): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE : count * basePremium({ type });

const componentsPremium = (components: Item[]): number => {
  const counts = countByType(components);
  return Object.entries(counts).reduce(
    (sum, [type, count]) => sum + componentGroupPremium(type, count),
    0,
  );
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const itemSurcharges = (item: Item): number => {
  const base = basePremium(item);
  let extras = 0;
  if (item.cursed) extras += base * CURSED_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    extras += base * HIGH_ENCHANTMENT_RATE;
  }
  return extras;
};

interface PremiumBreakdown {
  withSurcharges: number;
  baseOnly: number;
}

const sumBy = <T>(items: T[], f: (item: T) => number): number =>
  items.reduce((sum, item) => sum + f(item), 0);

const itemsPremiumBreakdown = (items: Item[]): PremiumBreakdown => {
  const mainItems = items.filter((i) => !isComponent(i));
  const componentsTotal = componentsPremium(items.filter(isComponent));
  const mainBase = sumBy(mainItems, basePremium);
  const mainSurcharges = sumBy(mainItems, itemSurcharges);
  return {
    withSurcharges: mainBase + mainSurcharges + componentsTotal,
    baseOnly: mainBase + componentsTotal,
  };
};

const policyModifiers = (
  customer: Customer,
  policyBase: number,
  isFollowUp: boolean,
): number => {
  let modifiers = policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    modifiers -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUp) {
    modifiers -= policyBase * FOLLOWUP_DISCOUNT_RATE;
  }
  return modifiers;
};

const computeQuotePremium = (
  customer: Customer,
  items: Item[],
  isFollowUp: boolean,
): number => {
  const { withSurcharges, baseOnly } = itemsPremiumBreakdown(items);
  const raw = withSurcharges + policyModifiers(customer, baseOnly, isFollowUp) + PROCESSING_FEE;
  return Math.ceil(raw);
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

const policyInsuranceSum = (items: Item[]): number =>
  sumBy(items, (item) => INSURANCE_VALUES[item.type]);

const buildPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: policyInsuranceSum(items) * CAP_MULTIPLIER,
});

const isHighEnchantmentForPayout = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD;

const reimbursableAmount = (item: Item, damageAmount: number): number =>
  isHighEnchantmentForPayout(item)
    ? damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE
    : damageAmount;

const damagePayout = (item: Item, damageAmount: number): number =>
  reimbursableAmount(item, damageAmount) - DEDUCTIBLE;

const consumeMatchingItem = (pool: Item[], itemType: string): Item => {
  const index = pool.findIndex((item) => item.type === itemType);
  if (index === -1) {
    throw new Error(`Damage references item not in policy: ${itemType}`);
  }
  const [matched] = pool.splice(index, 1);
  return matched;
};

const validateDamageAmounts = (damages: Damage[]): void => {
  damages.forEach((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  });
};

const rawIncidentPayout = (items: Item[], damages: Damage[]): number => {
  validateDamageAmounts(damages);
  const insuredItems = [...items];
  return damages.reduce((sum, damage) => {
    const item = consumeMatchingItem(insuredItems, damage.itemType);
    return sum + damagePayout(item, damage.amount);
  }, 0);
};

const applyCap = (policy: Policy, rawPayout: number): number => {
  const cappedPayout = Math.min(rawPayout, policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return cappedPayout;
};

const computeClaim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  const cappedPayout = applyCap(policy, rawIncidentPayout(policy.items, incident.damages));
  return {
    payout: Math.floor(cappedPayout),
    remainingCap: policy.remainingCap,
  };
};

export const runScenario = (scenario: Scenario): unknown => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "claim") {
      return computeClaim(policies[step.policy ?? 0], step.incident as Incident);
    }
    const items = step.items ?? [];
    const isFollowUp = policies.length > 0;
    policies.push(buildPolicy(items));
    return { premium: computeQuotePremium(scenario.customer, items, isFollowUp) };
  });
  return { results };
};
