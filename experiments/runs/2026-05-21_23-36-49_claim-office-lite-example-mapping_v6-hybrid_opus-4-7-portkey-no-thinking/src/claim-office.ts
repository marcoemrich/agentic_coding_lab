export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: any[];
};

export type ScenarioResult = {
  results: any[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const CLAIM_DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const roundUp = (value: number) => Math.ceil(Math.round(value * 1e6) / 1e6);

const componentBasePremium = (count: number, perUnit: number) => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * perUnit;
};

type PremiumEntry = { base: number; surchargePct: number };

const itemSurchargePct = (item: any): number =>
  FIRST_INSURANCE_SURCHARGE +
  (item.cursed ? CURSE_SURCHARGE : 0) +
  ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? HIGH_ENCHANTMENT_SURCHARGE
    : 0);

const singleItemEntry = (item: any): PremiumEntry => ({
  base: BASE_PREMIUM[item.type],
  surchargePct: itemSurchargePct(item),
});

const componentGroupEntry = (type: string, count: number): PremiumEntry => ({
  base: componentBasePremium(count, BASE_PREMIUM[type]),
  surchargePct: FIRST_INSURANCE_SURCHARGE,
});

const assertKnownItemTypes = (items: any[]): void => {
  const unknown = items.find((item) => !(item.type in BASE_PREMIUM));
  if (unknown) {
    throw new Error(`unknown item type: ${unknown.type}`);
  }
};

const countsByType = (entries: any[], typeKey: string): Record<string, number> =>
  entries.reduce<Record<string, number>>(
    (counts, entry) => ({ ...counts, [entry[typeKey]]: (counts[entry[typeKey]] ?? 0) + 1 }),
    {},
  );

const premiumEntries = (items: any[]): PremiumEntry[] => {
  assertKnownItemTypes(items);
  const singles = items
    .filter((item) => !COMPONENT_TYPES.has(item.type))
    .map(singleItemEntry);
  const componentItems = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const componentGroups = Object.entries(countsByType(componentItems, "type")).map(
    ([type, count]) => componentGroupEntry(type, count),
  );
  return [...singles, ...componentGroups];
};

const policyModifierPct = (
  customer: Scenario["customer"],
  isFollowUp: boolean,
): number => {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? FOLLOWUP_DISCOUNT : 0;
  return -(loyalty + followUp);
};

const quote = (
  step: any,
  customer: Scenario["customer"],
  isFollowUp: boolean,
) => {
  const policyPct = policyModifierPct(customer, isFollowUp);
  const total = premiumEntries(step.items).reduce(
    (sum, { base, surchargePct }) => sum + base * (1 + surchargePct + policyPct),
    PROCESSING_FEE,
  );
  return { premium: roundUp(total) };
};

const previousQuoteCount = (steps: any[], index: number): number =>
  steps.slice(0, index).filter((step) => step.op === "quote").length;

const isHighEnchantmentClaim = (item: any): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (amount: number, item: any): number =>
  isHighEnchantmentClaim(item) ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE : amount;

const damagePayout = (amount: number, item: any): number =>
  Math.max(0, reimbursableAmount(amount, item) - CLAIM_DEDUCTIBLE);

const findPolicyItem = (policyItems: any[], itemType: string): any => {
  const item = policyItems.find((it) => it.type === itemType);
  if (!item) {
    throw new Error(`damage references item not in policy: ${itemType}`);
  }
  return item;
};

const assertNonNegativeDamage = (damage: any): void => {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
};

const damageEntryPayout = (damage: any, policyItems: any[]): number => {
  assertNonNegativeDamage(damage);
  return damagePayout(damage.amount, findPolicyItem(policyItems, damage.itemType));
};

const assertDamageCountsWithinPolicy = (damages: any[], policyItems: any[]): void => {
  const insured = countsByType(policyItems, "type");
  const damaged = countsByType(damages, "itemType");
  for (const [type, count] of Object.entries(damaged)) {
    const covered = insured[type] ?? 0;
    if (covered > 0 && count > covered) {
      throw new Error(`more damage entries for ${type} than policy covers`);
    }
  }
};

const claim = (step: any, policyItems: any[]): { payout: number } => {
  assertDamageCountsWithinPolicy(step.incident.damages, policyItems);
  const total = step.incident.damages.reduce(
    (sum: number, damage: any) => sum + damageEntryPayout(damage, policyItems),
    0,
  );
  return { payout: Math.floor(total) };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = previousQuoteCount(scenario.steps, index) > 0;
      return quote(step, scenario.customer, isFollowUp);
    }
    if (step.op === "claim") {
      const policyStep = scenario.steps[step.policy];
      return claim(step, policyStep.items);
    }
    return {};
  });
  return { results };
};
