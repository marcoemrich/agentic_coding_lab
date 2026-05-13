type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

type Damage = { itemType: string; amount: number };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const COMPONENT_BLOCK_DISCOUNT = 15; // 3×25 = 75 → 60
const COMPONENT_TYPES = new Set(["rune"]);
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const FULL_REIMBURSEMENT_MATERIAL = "dragon";
const HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const basePremium = (type: string): number => ITEM_BASE_PREMIUM[type] ?? 0;
const insuranceValue = (type: string): number => ITEM_INSURANCE_VALUE[type] ?? 0;

const applyPercent = (value: number, percent: number): number => {
  return Math.ceil((value * (100 + percent)) / 100);
};

const componentBlockDiscount = (items: Item[]): number => {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let discount = 0;
  for (const count of counts.values()) {
    discount += Math.floor(count / 3) * COMPONENT_BLOCK_DISCOUNT;
  }
  return discount;
};

const quotePremium = (
  step: QuoteStep,
  customer: Scenario["customer"],
  priorContracts: number,
): number => {
  const itemTotal = step.items.reduce((sum, item) => {
    let p = basePremium(item.type);
    if (item.cursed) p = applyPercent(p, 50);
    if (item.enchantment >= 5) p = applyPercent(p, 30);
    return sum + p;
  }, 0);
  let total = itemTotal - componentBlockDiscount(step.items);
  if (customer.yearsWithMHPCO >= 2) total = applyPercent(total, -20);
  const isFirstContract = priorContracts === 0;
  total = applyPercent(total, isFirstContract ? 10 : -15);
  return total + PROCESSING_FEE;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValue(item.type), 0);

type Policy = { items: Item[]; insuranceSum: number; remainingCap: number };

const reimbursementForDamage = (policy: Policy, damage: Damage): number => {
  const item = policy.items.find((it) => it.type === damage.itemType);
  if (!item) return 0;
  if (item.material === FULL_REIMBURSEMENT_MATERIAL) return damage.amount;
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
    return Math.ceil((damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT) / 100);
  }
  return 0;
};

const processClaim = (
  policy: Policy,
  damages: Damage[],
): { payout: number; remainingCap: number } => {
  const gross = damages.reduce(
    (sum, d) => sum + reimbursementForDamage(policy, d),
    0,
  );
  const afterDeductible = Math.max(0, gross - DEDUCTIBLE);
  const payout = Math.min(afterDeductible, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  policy.remainingCap = remainingCap;
  return { payout, remainingCap };
};

export const runScenario = (input: unknown): { results: unknown[] } => {
  const scenario = input as Scenario;
  let priorContracts = 0;
  const policies = new Map<number, Policy>();
  const results: unknown[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const quote = step as QuoteStep;
      const premium = quotePremium(quote, scenario.customer, priorContracts);
      priorContracts += 1;
      const sum = insuranceSum(quote.items);
      policies.set(index, {
        items: quote.items,
        insuranceSum: sum,
        remainingCap: 2 * sum,
      });
      return { premium };
    }
    const claim = step as ClaimStep;
    const policy = policies.get(claim.policy)!;
    return processClaim(policy, claim.incident.damages);
  });
  return { results };
};
