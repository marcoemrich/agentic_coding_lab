type Item = { type: string; material?: string; cursed?: boolean; enchantment?: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
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
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

const COMPONENT_BASE_PREMIUM = 25;
const BUNDLE_BASE_PREMIUM = 60;

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemBasePremium = (item: Item): number => {
  let base = BASE_PREMIUM[item.type];
  if (item.cursed) base = base * 1.5;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) base = (base * 13) / 10;
  return base;
};

const itemsBasePremium = (items: Item[]): number => {
  const firstType = items[0].type;
  const allAlike = items.every((item) => item.type === firstType);
  const isComponentBundle =
    items.length === 3 && allAlike && BASE_PREMIUM[firstType] === COMPONENT_BASE_PREMIUM;
  if (isComponentBundle) return BUNDLE_BASE_PREMIUM;
  return items.reduce((sum, item) => sum + itemBasePremium(item), 0);
};

const LOYALTY_YEARS_THRESHOLD = 2;

const quotePremium = (items: Item[], isLoyal: boolean, isFirstContract: boolean): number => {
  const base = itemsBasePremium(items);
  let adjusted = isFirstContract ? (base * 11) / 10 : (base * 85) / 100;
  if (isLoyal) adjusted = (adjusted * 8) / 10;
  return Math.ceil(adjusted) + PROCESSING_FEE;
};

type Policy = { items: Item[]; remainingCap: number };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const reimbursableDamage = (item: Item | undefined, amount: number): number => {
  if (item?.material === "dragon") return amount;
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return amount / 2;
  return amount;
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const totalReimbursable = incident.damages.reduce((sum, d) => {
    const item = policy.items.find((i) => i.type === d.itemType);
    return sum + reimbursableDamage(item, d.amount);
  }, 0);
  const payout = Math.min(totalReimbursable - DEDUCTIBLE, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: Scenario): { results: StepResult[] } => {
  const isLoyal = input.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
  const policies: Policy[] = [];
  let priorQuotes = 0;
  const results: StepResult[] = input.steps.map((step) => {
    if (step.op === "quote") {
      const isFirstContract = priorQuotes === 0;
      priorQuotes++;
      const premium = quotePremium(step.items, isLoyal, isFirstContract);
      const insuranceSum = policyInsuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: insuranceSum * 2 });
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
};
