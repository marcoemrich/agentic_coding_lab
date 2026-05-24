export type Customer = { yearsWithMHPCO: number };
export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;
export type Scenario = { customer: Customer; steps: Step[] };
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type ScenarioResult = { results: (QuoteResult | ClaimResult)[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

// Rounding policies — both round in MHPCO's favor
const roundPremiumInMHPCOFavor = Math.ceil;
const roundPayoutInMHPCOFavor = Math.floor;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const baseFor = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const BLOCK_OF_3_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countByType = <T>(entries: T[], key: (e: T) => string): Record<string, number> =>
  entries.reduce<Record<string, number>>((counts, entry) => {
    const k = key(entry);
    counts[k] = (counts[k] ?? 0) + 1;
    return counts;
  }, {});

const componentBlockBase = (count: number, type: string): number =>
  count === 3 ? BLOCK_OF_3_PREMIUM : count * baseFor({ type });

const componentsBase = (components: Item[]): number =>
  Object.entries(countByType(components, (item) => item.type)).reduce(
    (sum, [type, count]) => sum + componentBlockBase(count, type),
    0,
  );

const sumBasePremiums = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const standaloneBase = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + baseFor(item), 0);
  return componentsBase(components) + standaloneBase;
};

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;
const hasHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeFor = (item: Item): number => {
  const base = baseFor(item);
  const curse = isCursed(item) ? base * CURSE_RATE : 0;
  const highEnch = hasHighEnchantment(item) ? base * HIGH_ENCHANTMENT_RATE : 0;
  return curse + highEnch;
};

const itemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + surchargeFor(item), 0);

const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_CONTRACT_RATE = 0.15;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const loyaltyDiscount = (itemsBase: number, customer: Customer): number =>
  isLoyal(customer) ? itemsBase * LOYALTY_RATE : 0;

const followupDiscount = (itemsBase: number, quoteIndex: number): number =>
  quoteIndex > 0 ? itemsBase * FOLLOWUP_CONTRACT_RATE : 0;

const totalDiscounts = (itemsBase: number, customer: Customer, quoteIndex: number): number =>
  loyaltyDiscount(itemsBase, customer) + followupDiscount(itemsBase, quoteIndex);

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type "${item.type}"`);
    }
  }
};

const quotePremium = (items: Item[], customer: Customer, quoteIndex: number): number => {
  assertKnownItemTypes(items);
  const itemsBase = sumBasePremiums(items);
  const surcharges = itemSurcharges(items);
  const firstInsurance = itemsBase * FIRST_INSURANCE_RATE;
  const discounts = totalDiscounts(itemsBase, customer, quoteIndex);
  return roundPremiumInMHPCOFavor(itemsBase + surcharges + firstInsurance - discounts + PROCESSING_FEE);
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceValueFor = (item: Item): number => INSURANCE_VALUES[item.type] ?? 0;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item), 0);

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;

const qualifiesForHighEnchantmentClause = (item: Item): boolean =>
  (item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;

const reimbursableAmount = (item: Item, damageAmount: number): number =>
  qualifiesForHighEnchantmentClause(item)
    ? damageAmount * CLAIM_HIGH_ENCHANTMENT_RATE
    : damageAmount;

const payoutForDamage = (item: Item, damageAmount: number): number =>
  reimbursableAmount(item, damageAmount) - DEDUCTIBLE;

const findPolicyItem = (items: Item[], itemType: string): Item => {
  // Invariant: assertDamagesCoveredByPolicy has already verified every damage's
  // itemType is present in items. This check guards against future callers that
  // forget that contract, replacing a lying `as Item` cast with an explicit error.
  const item = items.find((i) => i.type === itemType);
  if (!item) throw new Error(`policy does not cover "${itemType}"`);
  return item;
};

const totalPayout = (damages: Damage[], policyItems: Item[]): number =>
  damages.reduce(
    (sum, damage) => sum + payoutForDamage(findPolicyItem(policyItems, damage.itemType), damage.amount),
    0,
  );

type Policy = { items: Item[]; remainingCap: number };

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLIER,
});

const assertDamagesCoveredByPolicy = (damages: Damage[], items: Item[]): void => {
  const insuredCounts = countByType(items, (i) => i.type);
  const damageCounts = countByType(damages, (d) => d.itemType);
  for (const [type, damageCount] of Object.entries(damageCounts)) {
    const insuredCount = insuredCounts[type] ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        insuredCount === 0
          ? `claim references "${type}" which is not covered by the policy`
          : `damages contain ${damageCount} entries for "${type}" but policy covers only ${insuredCount}`,
      );
    }
  }
};

const assertNonNegativeDamages = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative, got ${damage.amount} for "${damage.itemType}"`);
    }
  }
};

const claimAgainst = (policy: Policy, incident: Incident): ClaimResult => {
  assertNonNegativeDamages(incident.damages);
  assertDamagesCoveredByPolicy(incident.damages, policy.items);
  const desiredPayout = roundPayoutInMHPCOFavor(totalPayout(incident.damages, policy.items));
  const payout = Math.min(desiredPayout, policy.remainingCap);
  return { payout, remainingCap: policy.remainingCap - payout };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, policies.length);
      policies.push(openPolicy(step.items));
      return { premium };
    }
    const result = claimAgainst(policies[step.policy], step.incident);
    policies[step.policy] = { ...policies[step.policy], remainingCap: result.remainingCap };
    return result;
  });
  return { results };
};
