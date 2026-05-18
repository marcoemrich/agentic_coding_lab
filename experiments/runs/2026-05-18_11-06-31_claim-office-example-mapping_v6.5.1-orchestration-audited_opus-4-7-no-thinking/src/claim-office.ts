const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const PERCENT_BASE = 100;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATIO = 0.5;

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

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_PERCENT = 15;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / PERCENT_BASE;

const percentIf = (condition: boolean, base: number, percent: number): number =>
  condition ? percentOf(base, percent) : 0;

const itemBasePremium = (item: Item): number => BASE_PREMIUM[item.type];

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  const curse = percentIf(item.cursed === true, base, CURSE_SURCHARGE_PERCENT);
  const highEnchantment = percentIf(
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD,
    base,
    HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  );
  return curse + highEnchantment;
};

const sumItemBases = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemBasePremium(item), 0);

const sumSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const partitionByType = (items: Item[]): Item[][] => {
  const groups: Record<string, Item[]> = {};
  items.forEach((item) => (groups[item.type] ??= []).push(item));
  return Object.values(groups);
};

const isComponentBlock = (group: Item[]): boolean =>
  group.length === BLOCK_SIZE && isComponent(group[0]);

const priceGroup = (group: Item[]): number =>
  isComponentBlock(group) ? BLOCK_PREMIUM : sumItemBases(group);

const sumBasePremiums = (items: Item[]): number =>
  partitionByType(items).reduce((sum, group) => sum + priceGroup(group), 0);

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const applyPolicyModifiers = (
  base: number,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const firstInsurance = percentOf(base, FIRST_INSURANCE_PERCENT);
  const loyalty = percentIf(isLoyalCustomer(customer), base, LOYALTY_DISCOUNT_PERCENT);
  const followUp = percentIf(isFollowUp, base, FOLLOWUP_DISCOUNT_PERCENT);
  return base + firstInsurance - loyalty - followUp;
};

const isKnownItemType = (item: Item): boolean => item.type in BASE_PREMIUM;

const validateItems = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  validateItems(items);
  const policyBase = sumBasePremiums(items);
  const surcharges = sumSurcharges(items);
  return Math.ceil(applyPolicyModifiers(policyBase, customer, isFollowUp) + surcharges) + PROCESSING_FEE;
};

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const isHighEnchantmentClaim = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  isHighEnchantmentClaim(item)
    ? damage.amount * HIGH_ENCHANTMENT_PAYOUT_RATIO
    : damage.amount;

const tallyBy = <T>(items: T[], keyOf: (item: T) => string): Record<string, number> =>
  items.reduce<Record<string, number>>((acc, item) => {
    const k = keyOf(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

const validateNoNegativeDamages = (damages: Damage[]): void => {
  const negative = damages.find((d) => d.amount < 0);
  if (negative) {
    throw new Error(`Negative damage amount: ${negative.amount}`);
  }
};

const validateDamageCountsAgainstPolicy = (
  damages: Damage[],
  policyItems: Item[],
): void => {
  const damageCounts = tallyBy(damages, (d) => d.itemType);
  const policyCounts = tallyBy(policyItems, (i) => i.type);
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[itemType] ?? 0)) {
      throw new Error(`Too many damages for ${itemType}`);
    }
  }
};

const validateDamages = (damages: Damage[], policyItems: Item[]): void => {
  validateNoNegativeDamages(damages);
  validateDamageCountsAgainstPolicy(damages, policyItems);
};

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);

const findPolicyItem = (policyItems: Item[], itemType: string): Item => {
  const item = policyItems.find((i) => i.type === itemType);
  if (!item) {
    throw new Error(`Item type ${itemType} not in policy`);
  }
  return item;
};

const totalClaimCap = (policyItems: Item[]): number =>
  policyInsuranceSum(policyItems) * CAP_MULTIPLIER;

const sumDamagePayouts = (damages: Damage[], policyItems: Item[]): number =>
  damages.reduce(
    (sum, d) => sum + damagePayout(d, findPolicyItem(policyItems, d.itemType)),
    0,
  );

const cappedPayout = (
  damages: Damage[],
  policyItems: Item[],
  remainingCap: number,
): { payout: number; remainingCap: number } => {
  const payout = Math.min(sumDamagePayouts(damages, policyItems), remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};

const isQuote = (step: Step): boolean => step.op === "quote";

const isClaim = (step: Step): boolean => step.op === "claim";

const hasPriorQuote = (steps: Step[], index: number): boolean =>
  steps.slice(0, index).some(isQuote);

const policyItemsAt = (steps: Step[], policyIndex: number): Item[] =>
  steps[policyIndex].items ?? [];

export const runScenario = (input: unknown): { results: unknown[] } => {
  const scenario = input as Scenario;
  const remainingCaps: Record<number, number> = {};
  const results = scenario.steps.map((step, index) => {
    if (isClaim(step)) {
      const policyIndex = step.policy ?? 0;
      const policyItems = policyItemsAt(scenario.steps, policyIndex);
      const damages = step.incident?.damages ?? [];
      validateDamages(damages, policyItems);
      remainingCaps[policyIndex] ??= totalClaimCap(policyItems);
      const result = cappedPayout(
        damages,
        policyItems,
        remainingCaps[policyIndex],
      );
      remainingCaps[policyIndex] = result.remainingCap;
      return result;
    }
    return {
      premium: quotePremium(
        step.items ?? [],
        scenario.customer,
        hasPriorQuote(scenario.steps, index),
      ),
    };
  });
  return { results };
};
