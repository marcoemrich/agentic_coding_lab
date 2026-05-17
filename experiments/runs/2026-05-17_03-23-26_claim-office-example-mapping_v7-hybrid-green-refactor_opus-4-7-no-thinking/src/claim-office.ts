const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

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

const itemBasePremium = (item: any): number => {
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return BASE_PREMIUMS[item.type];
};

const sumItemPremiums = (items: any[]): number =>
  items.reduce((sum, item) => sum + itemBasePremium(item), 0);

const groupByType = (items: any[]): Record<string, any[]> =>
  items.reduce((groups, item) => {
    (groups[item.type] ||= []).push(item);
    return groups;
  }, {} as Record<string, any[]>);

const isCompleteBlock = (type: string, group: any[]): boolean =>
  COMPONENT_TYPES.has(type) && group.length === BLOCK_SIZE;

const groupPremium = (type: string, group: any[]): number =>
  isCompleteBlock(type, group) ? BLOCK_PRICE : sumItemPremiums(group);

const calculateBasePremium = (items: any[]): number =>
  Object.entries(groupByType(items)).reduce(
    (total, [type, group]) => total + groupPremium(type, group),
    0
  );

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

type Rule<T> = { applies: (target: T) => boolean; percent: number };

const ITEM_SURCHARGE_RULES: Rule<any>[] = [
  { applies: (item) => item.cursed, percent: CURSED_SURCHARGE_PERCENT },
  {
    applies: (item) => item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD,
    percent: HIGH_ENCHANTMENT_SURCHARGE_PERCENT,
  },
];

const FOLLOW_UP_DISCOUNT_PERCENT = 15;

type PolicyContext = { customer: any; isFollowUp: boolean };

const POLICY_MODIFIER_RULES: Rule<PolicyContext>[] = [
  { applies: () => true, percent: FIRST_INSURANCE_SURCHARGE_PERCENT },
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    percent: -LOYALTY_DISCOUNT_PERCENT,
  },
  {
    applies: ({ isFollowUp }) => isFollowUp,
    percent: -FOLLOW_UP_DISCOUNT_PERCENT,
  },
];

const sumRulePercentages = <T>(rules: Rule<T>[], target: T, base: number): number =>
  rules.reduce(
    (sum, rule) => sum + (rule.applies(target) ? percentOf(base, rule.percent) : 0),
    0
  );

const itemSurcharge = (item: any): number =>
  sumRulePercentages(ITEM_SURCHARGE_RULES, item, itemBasePremium(item));

const calculateItemSurcharges = (items: any[]): number =>
  items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const calculatePolicyModifiers = (context: PolicyContext, policyBase: number): number =>
  sumRulePercentages(POLICY_MODIFIER_RULES, context, policyBase);

const quotePremium = (items: any[], context: PolicyContext): number => {
  const policyBase = calculateBasePremium(items);
  const itemSurcharges = calculateItemSurcharges(items);
  const policyModifiers = calculatePolicyModifiers(context, policyBase);
  return Math.ceil(policyBase + policyModifiers + itemSurcharges + PROCESSING_FEE);
};

const itemInsuranceValue = (item: any): number => INSURANCE_VALUES[item.type];

const calculateInsuranceSum = (items: any[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_DAMAGE_MULTIPLIER = 0.5;
const DEFAULT_DAMAGE_MULTIPLIER = 1;

const isHighEnchantmentForClaim = (item: any): boolean =>
  !!item && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const damageMultiplier = (item: any): number =>
  isHighEnchantmentForClaim(item)
    ? HIGH_ENCHANTMENT_DAMAGE_MULTIPLIER
    : DEFAULT_DAMAGE_MULTIPLIER;

const calculateDamagePayout = (damage: any, items: any[]): number => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const item = items.find((i) => i.type === damage.itemType);
  if (!item) {
    throw new Error(`Claim item type not in policy: ${damage.itemType}`);
  }
  return Math.max(0, Math.floor(damage.amount * damageMultiplier(item) - DEDUCTIBLE));
};

const sumDamagePayouts = (damages: any[], items: any[]): number =>
  damages.reduce((sum, damage) => sum + calculateDamagePayout(damage, items), 0);

type Policy = { remainingCap: number; items: any[] };

const countBy = <T>(items: T[], key: (item: T) => string): Record<string, number> =>
  items.reduce((counts, item) => {
    const k = key(item);
    counts[k] = (counts[k] || 0) + 1;
    return counts;
  }, {} as Record<string, number>);

const validateDamageEntryCounts = (damages: any[], items: any[]): void => {
  const damageCounts = countBy(damages, (d: any) => d.itemType);
  const itemCounts = countBy(items, (i: any) => i.type);
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if (count > (itemCounts[itemType] || 0)) {
      throw new Error(`Too many damage entries for item type: ${itemType}`);
    }
  }
};

const processClaim = (step: any, policies: Policy[]) => {
  const policy = policies[step.policy];
  validateDamageEntryCounts(step.incident.damages, policy.items);
  const payout = Math.min(sumDamagePayouts(step.incident.damages, policy.items), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const processQuote = (step: any, index: number, customer: any, policies: Policy[]) => {
  const premium = quotePremium(step.items, { customer, isFollowUp: index > 0 });
  const insuranceSum = calculateInsuranceSum(step.items);
  policies.push({ remainingCap: CAP_MULTIPLIER * insuranceSum, items: step.items });
  return { premium };
};

const processStep = (step: any, index: number, customer: any, policies: Policy[]) =>
  step.op === "claim"
    ? processClaim(step, policies)
    : processQuote(step, index, customer, policies);

export const runScenario = (scenario: any): unknown => {
  const policies: Policy[] = [];
  return {
    results: scenario.steps.map((step: any, index: number) =>
      processStep(step, index, scenario.customer, policies)
    ),
  };
};
