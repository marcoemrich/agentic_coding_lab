export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Incident = {
  cause?: string;
  damages: { itemType: string; amount: number }[];
};

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;

const itemInsuranceValue = (item: Item): number => {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUES[item.type] ?? 0;
};

const componentsBasePremium = (components: Item[]): number => {
  // Group by type, then for each group: count blocks of 3 + remainder.
  const counts = new Map<string, number>();
  for (const c of components) {
    counts.set(c.type, (counts.get(c.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
};

const mainItemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const itemsBasePremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mainItems = items.filter((i) => !isComponent(i));
  const mainSum = mainItems.reduce((sum, item) => sum + mainItemBasePremium(item), 0);
  return mainSum + componentsBasePremium(components);
};

const computeQuotePremium = (
  items: Item[],
  customerYears: number,
  isFollowUp: boolean,
): number => {
  const policyBase = itemsBasePremium(items);
  const mainItems = items.filter((i) => !isComponent(i));
  // Item-level surcharges (cursed, high-ench) apply to main items;
  // policy-wide modifiers apply to the policy base premium.
  const cursedAndEnchSurcharges = mainItems.reduce((sum, item) => {
    const base = mainItemBasePremium(item);
    let s = 0;
    if (item.cursed) s += base * CURSE_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      s += base * HIGH_ENCHANTMENT_RATE;
    }
    return sum + s;
  }, 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyalty = customerYears >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = isFollowUp ? policyBase * FOLLOWUP_DISCOUNT_RATE : 0;
  return Math.ceil(
    policyBase + cursedAndEnchSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE,
  );
};

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const KNOWN_TYPES = new Set([
  ...Object.keys(BASE_PREMIUMS),
  ...COMPONENT_TYPES,
]);

const validateItem = (item: Item): void => {
  if (!KNOWN_TYPES.has(item.type)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
};

const findPolicyItem = (policy: Policy, itemType: string): Item | undefined => {
  return policy.items.find((i) => i.type === itemType);
};

const computeDamagePayoutBeforeCap = (item: Item, damageAmount: number): number => {
  const ench = item.enchantment ?? 0;
  const isHighEnchanted = ench >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  // High-enchantment clause wins over dragon-material when both apply.
  const reimbursable = isHighEnchanted
    ? damageAmount * HIGH_ENCHANTMENT_CLAIM_RATE
    : damageAmount;
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

const validateIncident = (policy: Policy, incident: Incident): void => {
  // Count items by type in policy.
  const policyCounts = new Map<string, number>();
  for (const item of policy.items) {
    policyCounts.set(item.type, (policyCounts.get(item.type) ?? 0) + 1);
  }
  const damageCounts = new Map<string, number>();
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!KNOWN_TYPES.has(damage.itemType)) {
      throw new Error(`Unknown item type in damage: ${damage.itemType}`);
    }
    if (!policyCounts.has(damage.itemType)) {
      throw new Error(`Damaged item not in policy: ${damage.itemType}`);
    }
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
    if (damageCounts.get(damage.itemType)! > policyCounts.get(damage.itemType)!) {
      throw new Error(`More ${damage.itemType} damages than policy covers`);
    }
  }
};

const processClaim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  validateIncident(policy, incident);
  let totalPayout = 0;
  let cap = policy.remainingCap;
  for (const damage of incident.damages) {
    const item = findPolicyItem(policy, damage.itemType);
    if (!item) continue;
    const beforeCap = computeDamagePayoutBeforeCap(item, damage.amount);
    const payout = Math.min(beforeCap, cap);
    totalPayout += payout;
    cap -= payout;
  }
  policy.remainingCap = cap;
  return { payout: Math.floor(totalPayout), remainingCap: cap };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      step.items.forEach(validateItem);
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const insuranceSum = step.items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
      policies.set(index, {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * CAP_MULTIPLIER,
      });
      return {
        premium: computeQuotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp),
      };
    }
    const policy = policies.get(step.policy);
    if (!policy) return { payout: 0, remainingCap: 0 };
    return processClaim(policy, step.incident);
  });
  return { results };
};
