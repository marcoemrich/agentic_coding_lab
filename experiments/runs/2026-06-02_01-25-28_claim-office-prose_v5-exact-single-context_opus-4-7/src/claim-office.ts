type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimDamage = { itemType: string; amount: number };
type ClaimIncident = { cause: string; damages: ClaimDamage[] };
type ClaimStep = { op: "claim"; policy: number; incident: ClaimIncident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

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

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const roundUp = (value: number): number => Math.ceil(value - 1e-9);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const itemBasePremium = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  const cursedFactor = item.cursed ? 1 + CURSED_SURCHARGE : 1;
  const enchantedFactor =
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD
      ? 1 + HIGH_ENCHANTMENT_SURCHARGE
      : 1;
  return base * cursedFactor * enchantedFactor;
};

const componentBaseTotal = (components: Item[]): number => {
  const count = components.length;
  const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
  const remainder = count % COMPONENT_BLOCK_SIZE;
  return blocks * COMPONENT_BLOCK_PRICE + remainder * BASE_PREMIUM.rune;
};

const mainsBaseTotal = (mains: Item[]): number =>
  mains.reduce((sum, item) => sum + itemBasePremium(item), 0);

const itemsBaseTotal = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mains = items.filter((item) => !isComponent(item));
  return mainsBaseTotal(mains) + componentBaseTotal(components);
};

const computePremium = (
  items: Item[],
  customer: Customer,
  isFirstQuote: boolean,
): number => {
  const loyaltyFactor =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? 1 - LOYALTY_DISCOUNT
      : 1;
  const contractFactor = isFirstQuote
    ? 1 + FIRST_INSURANCE_SURCHARGE
    : 1 - SUBSEQUENT_CONTRACT_DISCOUNT;
  return (
    roundUp(itemsBaseTotal(items) * loyaltyFactor * contractFactor) +
    PROCESSING_FEE
  );
};

type Policy = { remainingCap: number; items: Item[] };

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const reimbursementRate = (item: Item): number => {
  const isDragon = item.material === "dragon";
  const isHighlyEnchanted =
    enchantmentLevel(item) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;
  return isHighlyEnchanted && !isDragon
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
};

const coveredDamage = (damages: ClaimDamage[], items: Item[]): number =>
  damages.reduce((sum, d) => {
    const item = items.find((i) => i.type === d.itemType)!;
    return sum + d.amount * reimbursementRate(item);
  }, 0);

const processQuote = (
  step: QuoteStep,
  customer: Customer,
  isFirstQuote: boolean,
): { result: QuoteResult; policy: Policy } => ({
  result: { premium: computePremium(step.items, customer, isFirstQuote) },
  policy: {
    remainingCap: CAP_MULTIPLIER * insuranceSum(step.items),
    items: step.items,
  },
});

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  const uncapped =
    coveredDamage(step.incident.damages, policy.items) - DEDUCTIBLE;
  const payout = Math.min(uncapped, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const evaluate = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const { result, policy } = processQuote(
        step,
        scenario.customer,
        index === 0,
      );
      policies[index] = policy;
      return result;
    }
    return processClaim(step, policies);
  });
  return { results };
};
