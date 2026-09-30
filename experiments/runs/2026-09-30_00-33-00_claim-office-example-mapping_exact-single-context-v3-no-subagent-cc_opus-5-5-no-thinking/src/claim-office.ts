export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Step = QuoteStep | ClaimStep;
export type Customer = { yearsWithMHPCO: number };
export type Scenario = { customer: Customer; steps: Step[] };
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;

type PriceEntry = { insuranceValue: number; basePremium: number; isComponent?: boolean };
const COMPONENT_PRICE: PriceEntry = { insuranceValue: 250, basePremium: 25, isComponent: true };
const PRICE_LIST: Record<string, PriceEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT_PRICE,
  moonstone: COMPONENT_PRICE,
};
const isKnownType = (type: string): boolean => Object.hasOwn(PRICE_LIST, type);
const assertKnownItems = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};
const isComponent = (type: string): boolean => PRICE_LIST[type].isComponent === true;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const groupPremium = (type: string, count: number): number =>
  isComponent(type) && count === BLOCK_SIZE ? BLOCK_PREMIUM : count * PRICE_LIST[type].basePremium;

const countByType = (items: Item[]): Map<string, number> =>
  items.reduce((counts, { type }) => counts.set(type, (counts.get(type) ?? 0) + 1), new Map<string, number>());

export const basePremium = (items: Item[]): number =>
  [...countByType(items)].reduce((total, [type, count]) => total + groupPremium(type, count), 0);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const isHighlyEnchanted = (item: Item): boolean => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

const itemSurchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemSurcharge = (item: Item): number => itemSurchargeRate(item) * PRICE_LIST[item.type].basePremium;

// Tolerance absorbs binary floating-point noise (e.g. 16.000000000000004) before rounding.
const FLOAT_TOLERANCE = 1e-9;
const roundUpForMHPCO = (amount: number): number => Math.ceil(amount - FLOAT_TOLERANCE);
const roundDownForMHPCO = (amount: number): number => Math.floor(amount + FLOAT_TOLERANCE);

const policyModifierRate = (customer: Customer, isFollowUpContract: boolean): number =>
  FIRST_INSURANCE_RATE -
  (customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowUpContract ? FOLLOW_UP_DISCOUNT_RATE : 0);

const quotePremium = (items: Item[], customer: Customer, isFollowUpContract: boolean): number => {
  assertKnownItems(items);
  const policyBase = basePremium(items);
  const itemSurcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const policyModifiers = policyModifierRate(customer, isFollowUpContract) * policyBase;
  return roundUpForMHPCO(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);

// Dragon material means full reimbursement — the same as the default — so only the
// high-enchantment clause changes the rate, and it wins when both apply.
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;

const policyCap = (policy: QuoteStep): number => CAP_MULTIPLIER * insuranceSum(policy.items);

const assertValidDamages = (damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`Damage amount must not be negative: ${negative.amount}`);
};

// Each damage entry consumes one insured item of its type; surplus entries are not covered.
const matchDamagesToItems = (damages: Damage[], items: Item[]): { damage: Damage; item: Item }[] => {
  const unclaimedItems = [...items];
  return damages.map((damage) => {
    const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    const [item] = unclaimedItems.splice(index, 1);
    return { damage, item };
  });
};

const damagePayout = (damage: Damage, item: Item): number => reimbursementRate(item) * damage.amount - DEDUCTIBLE;

const processClaim = (step: ClaimStep, policy: QuoteStep, capBefore: number): ClaimResult => {
  assertValidDamages(step.incident.damages);
  const desired = matchDamagesToItems(step.incident.damages, policy.items).reduce(
    (sum, { damage, item }) => sum + damagePayout(damage, item),
    0,
  );
  const payout = Math.min(roundDownForMHPCO(desired), capBefore);
  return { payout, remainingCap: capBefore - payout };
};

const findPolicy = (steps: Step[], policyIndex: number): QuoteStep => steps[policyIndex] as QuoteStep;

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const remainingCaps = new Map<number, number>();
  let contractsSoFar = 0;
  return {
    results: scenario.steps.map((step) => {
      if (step.op === "claim") {
        const policy = findPolicy(scenario.steps, step.policy);
        const result = processClaim(step, policy, remainingCaps.get(step.policy) ?? policyCap(policy));
        remainingCaps.set(step.policy, result.remainingCap);
        return result;
      }
      const isFollowUpContract = contractsSoFar++ > 0;
      return { premium: quotePremium(step.items, scenario.customer, isFollowUpContract) };
    }),
  };
};
