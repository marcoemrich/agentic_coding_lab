const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_UNIT_PREMIUM = 25;

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;
type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Policy = { items: Item[]; remainingCap: number };

const basePremiumForItemType = (type: string): number => (type === "amulet" ? 60 : 100);

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const KNOWN_ITEM_TYPES = Object.keys(INSURANCE_VALUES);

const insuranceValueForItemType = (type: string): number =>
  INSURANCE_VALUES[type] ?? 0;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const surchargeForItem = (item: Item): number => {
  const basePremium = basePremiumForItemType(item.type);
  const curseSurcharge = item.cursed ? basePremium * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const componentPremiumFor = (count: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_UNIT_PREMIUM;

const policyMultiplierFor = (
  yearsWithMHPCO: number,
  isFirstQuote: boolean,
): number => {
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = isFirstQuote ? 0 : FOLLOW_UP_DISCOUNT_RATE;
  return 1 + FIRST_INSURANCE_SURCHARGE_RATE - loyaltyDiscount - followUpDiscount;
};

const calculateFinalPremium = (
  policyBase: number,
  itemSurcharges: number,
  yearsWithMHPCO: number,
  isFirstQuote: boolean,
): number => {
  const beforeFee =
    policyBase * policyMultiplierFor(yearsWithMHPCO, isFirstQuote) + itemSurcharges;
  return Math.ceil(Math.round(beforeFee * 100) / 100 + PROCESSING_FEE);
};

const standardItemBaseAndSurcharges = (items: Item[]): { base: number; surcharges: number } =>
  items.reduce(
    (totals, item) =>
      COMPONENT_TYPES.includes(item.type)
        ? totals
        : {
            base: totals.base + basePremiumForItemType(item.type),
            surcharges: totals.surcharges + surchargeForItem(item),
          },
    { base: 0, surcharges: 0 },
  );

const countByType = <T>(items: T[], getType: (item: T) => string): Record<string, number> =>
  items.reduce((counts, item) => {
    const type = getType(item);
    counts[type] = (counts[type] ?? 0) + 1;
    return counts;
  }, {} as Record<string, number>);

const componentPremiumForItems = (items: Item[]): number => {
  const counts = countByType(items, (item) => item.type);
  return COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentPremiumFor(counts[type] ?? 0),
    0,
  );
};

const policyCapForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueForItemType(item.type), 0) * CLAIM_CAP_MULTIPLIER;

const createPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: policyCapForItems(items),
});

const isQuoteStep = (step: unknown): step is QuoteStep => {
  const s = step as { op?: unknown };
  return s.op === "quote";
};

const isClaimStep = (step: unknown): step is ClaimStep => {
  const s = step as { op?: unknown };
  return s.op === "claim";
};

const validateQuoteItems = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.includes(item.type)) throw new Error("Unknown item type");
  }
};

const calculateQuotePremium = (
  items: Item[],
  customer: Customer,
  isFirstQuote: boolean,
): number => {
  validateQuoteItems(items);
  const { base: standardBase, surcharges: itemSurcharges } = standardItemBaseAndSurcharges(items);
  const policyBase = standardBase + componentPremiumForItems(items);
  return calculateFinalPremium(policyBase, itemSurcharges, customer.yearsWithMHPCO, isFirstQuote);
};

type ScenarioInput = { customer: Customer; steps: unknown[] };

const DEDUCTIBLE = 100;
const CLAIM_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

const reimbursementRateFor = (item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD)
    return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  if (item.material === DRAGON_MATERIAL) return 1;
  return 1;
};

const damagePayoutFor = (damage: Damage, policy: Policy): number => {
  const item = policy.items.find((i) => i.type === damage.itemType);
  const rate = item ? reimbursementRateFor(item) : 1;
  return damage.amount * rate - DEDUCTIBLE;
};

const validateClaim = (policy: Policy, incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error("Negative damage amount");
  }
  const damageCounts = countByType(incident.damages, (damage) => damage.itemType);
  const policyCounts = countByType(policy.items, (item) => item.type);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0))
      throw new Error("Too many damage entries for item type");
  }
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  validateClaim(policy, incident);
  const grossPayout = incident.damages.reduce(
    (sum, damage) => sum + damagePayoutFor(damage, policy),
    0,
  );
  const payout = Math.floor(Math.min(grossPayout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
};

export const processScenario = (input: ScenarioInput): { results: StepResult[] } => {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  for (const step of input.steps) {
    if (isQuoteStep(step)) {
      const isFirstQuote = policies.length === 0;
      results.push({
        premium: calculateQuotePremium(step.items, input.customer, isFirstQuote),
      });
      policies.push(createPolicy(step.items));
    } else if (isClaimStep(step)) {
      const policy = policies[step.policy];
      const claimResult = processClaim(policy, step.incident);
      policy.remainingCap = claimResult.remainingCap;
      results.push(claimResult);
    }
  }
  return { results };
};
