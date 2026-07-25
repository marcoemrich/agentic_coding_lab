type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const basePremiumsByType: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const sumBy = <T>(values: T[], valueOf: (value: T) => number): number =>
  values.reduce((sum, value) => sum + valueOf(value), 0);

const valueForType = (table: Record<string, number>, item: Item): number => {
  const value = table[item.type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return value;
};

const basePremiumForItem = (item: Item): number =>
  valueForType(basePremiumsByType, item);

const sumOfItemBasePremiums = (items: Item[]): number =>
  sumBy(items, basePremiumForItem);

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
};

const basePremiumForGroup = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? BLOCK_PREMIUM : sumOfItemBasePremiums(group);

export const basePremium = (items: Item[]): number =>
  sumBy(groupByType(items), basePremiumForGroup);

const PROCESSING_FEE = 5;

type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOWUP_RATE = 0.15;

const surchargeOf = (item: Item, rate: number): number => basePremiumForItem(item) * rate;

const curseSurchargeForItem = (item: Item): number =>
  item.cursed ? surchargeOf(item, CURSE_SURCHARGE_RATE) : 0;

const curseSurcharge = (items: Item[]): number =>
  sumBy(items, curseSurchargeForItem);

const highEnchantmentSurchargeForItem = (item: Item): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD
    ? surchargeOf(item, HIGH_ENCHANTMENT_RATE)
    : 0;

const highEnchantmentSurcharge = (items: Item[]): number =>
  sumBy(items, highEnchantmentSurchargeForItem);

const rateOfPolicyBase = (policyBase: number, rate: number): number => policyBase * rate;

const firstInsuranceSurcharge = (policyBase: number): number =>
  rateOfPolicyBase(policyBase, FIRST_INSURANCE_RATE);

const loyaltyDiscount = (policyBase: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? rateOfPolicyBase(policyBase, LOYALTY_RATE) : 0;

const followUpDiscount = (policyBase: number, isFollowUp: boolean): number =>
  isFollowUp ? rateOfPolicyBase(policyBase, FOLLOWUP_RATE) : 0;

const itemSurcharges = (items: Item[]): number =>
  curseSurcharge(items) + highEnchantmentSurcharge(items);

// MHPCO always keeps the fraction: a premium is money owed *to* MHPCO,
// so rounding up (a higher premium) lands the fraction in its favor.
const roundPremiumInFavorOfMHPCO = (premium: number): number => Math.ceil(premium);

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number => {
  const policyBase = basePremium(step.items);
  const surcharges = itemSurcharges(step.items) + firstInsuranceSurcharge(policyBase);
  const discounts = loyaltyDiscount(policyBase, customer) + followUpDiscount(policyBase, isFollowUp);
  return roundPremiumInFavorOfMHPCO(policyBase + surcharges - discounts + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

const insuranceValuesByType: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

const insuranceValue = (item: Item): number => valueForType(insuranceValuesByType, item);

const insuranceSum = (items: Item[]): number =>
  sumBy(items, insuranceValue);

const policyCap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

const reimbursableValue = (damageAmount: number, item: Item): number =>
  enchantmentLevel(item) >= REDUCED_REIMBURSEMENT_THRESHOLD
    ? damageAmount * REDUCED_REIMBURSEMENT_RATE
    : damageAmount;

const insuredItemFor = (damage: Damage, items: Item[]): Item =>
  items.find((item) => item.type === damage.itemType) as Item;

const payoutForDamage = (damage: Damage, items: Item[]): number =>
  reimbursableValue(damage.amount, insuredItemFor(damage, items)) - DEDUCTIBLE;

// The deductible in payoutForDamage applies once per damage entry, so the
// incident payout is simply the sum across every damage in the incident.
const incidentPayout = (damages: Damage[], items: Item[]): number =>
  sumBy(damages, (damage) => payoutForDamage(damage, items));

// MHPCO always keeps the fraction: a payout is money owed *by* MHPCO,
// so rounding down (a lower payout) lands the fraction in its favor.
const roundPayoutInFavorOfMHPCO = (payout: number): number => Math.floor(payout);

const countBy = <T>(values: T[], typeOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const type = typeOf(value);
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

const validateDamagesCovered = (damages: Damage[], items: Item[]): void => {
  const insuredCounts = countBy(items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, damagedCount] of damageCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damagedCount > insuredCount) {
      throw new Error(`Claim damages more ${type} items than are insured`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
  }
};

const validateClaim = (damages: Damage[], insuredItems: Item[]): void => {
  validateDamagesCovered(damages, insuredItems);
  validateDamageAmounts(damages);
};

const claimResult = (step: ClaimStep, scenario: Scenario, alreadyPaid: number): ClaimResult => {
  const policyStep = scenario.steps[step.policy] as QuoteStep;
  validateClaim(step.incident.damages, policyStep.items);
  const capBeforeClaim = policyCap(policyStep.items) - alreadyPaid;
  const desiredPayout = roundPayoutInFavorOfMHPCO(incidentPayout(step.incident.damages, policyStep.items));
  const payout = Math.min(desiredPayout, capBeforeClaim);
  return { payout, remainingCap: capBeforeClaim - payout };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const paidByPolicy = new Map<number, number>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      return { premium: quotePremium(step, scenario.customer, index > 0) };
    }
    const alreadyPaid = paidByPolicy.get(step.policy) ?? 0;
    const result = claimResult(step, scenario, alreadyPaid);
    paidByPolicy.set(step.policy, alreadyPaid + result.payout);
    return result;
  });
  return { results };
};
