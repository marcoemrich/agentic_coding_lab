export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const DAMAGE_HIGH_ENCHANT_THRESHOLD = 8;
const DAMAGE_HIGH_ENCHANT_RATE = 0.5;

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  rune: 25,
  moonstone: 25,
};

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const groupCountsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
};

const basePremiumForGroup = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * ITEM_BASE_PREMIUM[type];
};

const sumBasePremium = (counts: Map<string, number>): number =>
  [...counts].reduce((total, [type, count]) => total + basePremiumForGroup(type, count), 0);

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeRateForItem = (item: Item): number =>
  (item.cursed ? CURSED_SURCHARGE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0);

const surchargeForItem = (item: Item): number =>
  ITEM_BASE_PREMIUM[item.type] * surchargeRateForItem(item);

const itemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + surchargeForItem(item), 0);

const calculatePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number => {
  const base = sumBasePremium(groupCountsByType(items));
  const surcharges = itemSurcharges(items);
  const firstInsuranceSurcharge = base * FIRST_INSURANCE_SURCHARGE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followUpDiscount = isFollowUpContract ? base * FOLLOWUP_CONTRACT_DISCOUNT : 0;
  return Math.ceil(
    base + surcharges + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount + PROCESSING_FEE,
  );
};

type Policy = {
  items: Item[];
  remainingCap: number;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_INSURANCE_VALUE[item.type], 0);

const reimbursableAmount = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= DAMAGE_HIGH_ENCHANT_THRESHOLD
    ? damage.amount * DAMAGE_HIGH_ENCHANT_RATE
    : damage.amount;

const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE_PER_DAMAGE);

const findInsuredItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((item) => item.type === itemType)!;

const grossPayoutForIncident = (policy: Policy, incident: Incident): number =>
  incident.damages.reduce(
    (sum, damage) => sum + payoutForDamage(damage, findInsuredItem(policy, damage.itemType)),
    0,
  );

const claimPayout = (policy: Policy, incident: Incident): number =>
  Math.floor(Math.min(grossPayoutForIncident(policy, incident), policy.remainingCap));

const handleQuote = (
  step: QuoteStep,
  policies: Policy[],
  yearsWithMHPCO: number,
): QuoteResult => {
  const isFollowUpContract = policies.length >= 1;
  policies.push({ items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
  return { premium: calculatePremium(step.items, yearsWithMHPCO, isFollowUpContract) };
};

const handleClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  const payout = claimPayout(policy, step.incident);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) =>
    step.op === "quote"
      ? handleQuote(step, policies, scenario.customer.yearsWithMHPCO)
      : handleClaim(step, policies),
  );
  return { results };
};
