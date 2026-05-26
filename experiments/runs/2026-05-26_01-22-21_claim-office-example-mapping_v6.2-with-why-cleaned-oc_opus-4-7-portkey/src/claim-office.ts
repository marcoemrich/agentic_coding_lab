type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Array<Item> };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<Damage> };
};
type Step = QuoteStep | ClaimStep;
type Scenario = {
  customer: Customer;
  steps: Array<Step>;
};
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

type ItemTypeSpec = { basePremium: number; insuranceValue: number };

const ITEM_TYPE_SPECS: Record<string, ItemTypeSpec> = {
  sword:     { basePremium: 100, insuranceValue: 1000 },
  amulet:    { basePremium:  60, insuranceValue:  600 },
  staff:     { basePremium:  80, insuranceValue:  800 },
  potion:    { basePremium:  40, insuranceValue:  400 },
  rune:      { basePremium:  25, insuranceValue:  250 },
  moonstone: { basePremium:  25, insuranceValue:  250 },
};

const specForType = (itemType: string): ItemTypeSpec => {
  const spec = ITEM_TYPE_SPECS[itemType];
  if (spec === undefined) {
    throw new Error(`Unknown item type: ${itemType}`);
  }
  return spec;
};

const basePremiumForType = (itemType: string): number => specForType(itemType).basePremium;

const insuranceValueForType = (itemType: string): number => specForType(itemType).insuranceValue;

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;

const countOfType = (items: Array<Item>, type: string): number =>
  items.filter((item) => item.type === type).length;

const blockDiscountFor = (items: Array<Item>, componentType: string): number =>
  countOfType(items, componentType) === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

type RateRule<TSubject> = { applies: (subject: TSubject) => boolean; rate: number };

const sumApplicableAdjustments = <TSubject>(
  rules: Array<RateRule<TSubject>>,
  base: number,
  subject: TSubject,
): number =>
  rules.reduce(
    (sum, rule) => sum + (rule.applies(subject) ? base * rule.rate : 0),
    0,
  );

const ITEM_SURCHARGES: Array<RateRule<Item>> = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  {
    applies: (item) => enchantmentOf(item) >= HIGH_ENCHANTMENT_THRESHOLD,
    rate: HIGH_ENCHANTMENT_SURCHARGE_RATE,
  },
];

const itemPremium = (item: Item): number => {
  const base = basePremiumForType(item.type);
  return base + sumApplicableAdjustments(ITEM_SURCHARGES, base, item);
};

const totalBlockDiscount = (items: Array<Item>): number =>
  COMPONENT_TYPES.reduce(
    (discount, componentType) => discount + blockDiscountFor(items, componentType),
    0,
  );

const sumPerItemMinusBlockDiscounts = (
  items: Array<Item>,
  valueOf: (item: Item) => number,
): number =>
  items.reduce((sum, item) => sum + valueOf(item), 0) - totalBlockDiscount(items);

const policyBasePremium = (items: Array<Item>): number =>
  sumPerItemMinusBlockDiscounts(items, (item) => basePremiumForType(item.type));

const itemsSubtotal = (items: Array<Item>): number =>
  sumPerItemMinusBlockDiscounts(items, itemPremium);

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = -0.2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = -0.15;

type PolicyContext = { customer: Customer; quoteIndex: number };

const POLICY_MODIFIERS: Array<RateRule<PolicyContext>> = [
  {
    applies: (ctx) => ctx.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    rate: LOYALTY_DISCOUNT_RATE,
  },
  {
    applies: () => true,
    rate: FIRST_INSURANCE_SURCHARGE_RATE,
  },
  {
    applies: (ctx) => ctx.quoteIndex > 0,
    rate: FOLLOWUP_CONTRACT_DISCOUNT_RATE,
  },
];

const roundUp = (amount: number): number => Math.ceil(amount);

const quotePremium = (items: Array<Item>, ctx: PolicyContext): number => {
  const subtotal = itemsSubtotal(items);
  const policyAdjustments = sumApplicableAdjustments(POLICY_MODIFIERS, policyBasePremium(items), ctx);
  return roundUp(subtotal + policyAdjustments + PROCESSING_FEE);
};

const roundDown = (amount: number): number => Math.floor(amount);

type Policy = { items: Array<Item>; insuranceSum: number; remainingCap: number };

const buildPolicy = (items: Array<Item>): Policy => {
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValueForType(item.type),
    0,
  );
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmount = (item: Item, damage: Damage): number => {
  if (enchantmentOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD) {
    return damage.amount * HALF_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const payoutForDamage = (item: Item, damage: Damage): number =>
  Math.max(0, reimbursableAmount(item, damage) - DEDUCTIBLE);

const findItem = (policy: Policy, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (!item) {
    throw new Error(`No item of type ${itemType} in policy`);
  }
  return item;
};

const uniqueDamagedTypes = (damages: Array<Damage>): Array<string> =>
  [...new Set(damages.map((d) => d.itemType))];

const countDamagesOfType = (damages: Array<Damage>, itemType: string): number =>
  damages.filter((d) => d.itemType === itemType).length;

const assertNoNegativeAmounts = (damages: Array<Damage>): void => {
  damages.forEach((d) => {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
  });
};

const assertDamageCountsWithinInsured = (
  policy: Policy,
  damages: Array<Damage>,
): void => {
  uniqueDamagedTypes(damages).forEach((itemType) => {
    const damageCount = countDamagesOfType(damages, itemType);
    const insuredCount = countOfType(policy.items, itemType);
    if (damageCount > insuredCount) {
      throw new Error(
        `Too many damages of type ${itemType}: ${damageCount} damages but only ${insuredCount} insured`,
      );
    }
  });
};

const validateDamages = (policy: Policy, damages: Array<Damage>): void => {
  assertNoNegativeAmounts(damages);
  assertDamageCountsWithinInsured(policy, damages);
};

const applyClaim = (
  policy: Policy,
  damages: Array<Damage>,
): { result: ClaimResult; policy: Policy } => {
  validateDamages(policy, damages);
  const totalPayout = damages.reduce(
    (sum, d) => sum + payoutForDamage(findItem(policy, d.itemType), d),
    0,
  );
  const payout = roundDown(Math.min(totalPayout, policy.remainingCap));
  const updatedPolicy: Policy = { ...policy, remainingCap: policy.remainingCap - payout };
  return {
    result: { payout, remainingCap: updatedPolicy.remainingCap },
    policy: updatedPolicy,
  };
};

export const runScenario = (input: Scenario): { results: Array<StepResult> } => {
  const policies = new Map<number, Policy>();
  let quoteIndex = 0;
  const results: Array<StepResult> = input.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, { customer: input.customer, quoteIndex });
      quoteIndex += 1;
      policies.set(stepIndex, buildPolicy(step.items));
      return { premium };
    }
    const policy = policies.get(step.policy);
    if (!policy) {
      throw new Error(`No policy at step ${step.policy}`);
    }
    const { result, policy: updated } = applyClaim(policy, step.incident.damages);
    policies.set(step.policy, updated);
    return result;
  });
  return { results };
};
