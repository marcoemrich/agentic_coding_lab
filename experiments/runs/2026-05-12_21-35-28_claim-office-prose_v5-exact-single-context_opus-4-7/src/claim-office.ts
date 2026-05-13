type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune";

interface Item {
  type: ItemType;
  material: string;
  enchantment: number;
  cursed: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: ItemType;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

type StepResult = { premium: number } | { payout: number; remainingCap: number };

const BASE_PREMIUM: Record<ItemType, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_SUM: Record<ItemType, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const DRAGON_MATERIAL = "dragon";

const PROCESSING_FEE = 5;

const BUILDING_BLOCK_BASE = 60;
const CURSE_PERCENT = 150;
const HIGH_ENCHANT_PREMIUM_PERCENT = 130;
const HIGH_ENCHANT_PREMIUM_THRESHOLD = 5;
const FIRST_INSURANCE_PERCENT = 110;
const SUBSEQUENT_CONTRACT_PERCENT = 85;
const LOYALTY_PERCENT = 80;
const LOYALTY_THRESHOLD_YEARS = 2;

const isBuildingBlock = (items: Item[]): boolean =>
  items.length === 3 &&
  items.every((item) => item.type === items[0].type) &&
  items[0].type === "rune";

const applyPercent = (value: number, percent: number): number => (value * percent) / 100;

const itemBase = (item: Item): number => {
  let base = BASE_PREMIUM[item.type];
  if (item.cursed) base = applyPercent(base, CURSE_PERCENT);
  if (item.enchantment >= HIGH_ENCHANT_PREMIUM_THRESHOLD) base = applyPercent(base, HIGH_ENCHANT_PREMIUM_PERCENT);
  return base;
};

const baseForItems = (items: Item[]): number => {
  if (isBuildingBlock(items)) return BUILDING_BLOCK_BASE;
  return items.reduce((sum, item) => sum + itemBase(item), 0);
};

const quotePremium = (items: Item[], customer: Customer, quoteIndex: number): number => {
  const contractPercent = quoteIndex === 0 ? FIRST_INSURANCE_PERCENT : SUBSEQUENT_CONTRACT_PERCENT;
  let amount = applyPercent(baseForItems(items), contractPercent);
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    amount = applyPercent(amount, LOYALTY_PERCENT);
  }
  return Math.ceil(amount) + PROCESSING_FEE;
};

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_SUM[item.type], 0);

const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_PAYOUT_PERCENT = 50;

const damagePayout = (damage: Damage, policyItems: Item[]): number => {
  const item = policyItems.find((it) => it.type === damage.itemType) as Item;
  if (item.material === DRAGON_MATERIAL) return damage.amount;
  const reimbursable =
    item.enchantment >= HIGH_ENCHANT_CLAIM_THRESHOLD
      ? applyPercent(damage.amount, HIGH_ENCHANT_PAYOUT_PERCENT)
      : damage.amount;
  return reimbursable - DEDUCTIBLE;
};

const claimResult = (
  claim: ClaimStep,
  steps: Step[],
  paidPerPolicy: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policyStep = steps[claim.policy] as QuoteStep;
  const cap = CAP_MULTIPLIER * insuranceSumForItems(policyStep.items);
  const requested = claim.incident.damages.reduce(
    (sum, d) => sum + damagePayout(d, policyStep.items),
    0,
  );
  const alreadyPaid = paidPerPolicy.get(claim.policy) ?? 0;
  const remainingBefore = cap - alreadyPaid;
  const payout = Math.min(requested, remainingBefore);
  paidPerPolicy.set(claim.policy, alreadyPaid + payout);
  return { payout, remainingCap: remainingBefore - payout };
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const paidPerPolicy = new Map<number, number>();
  const results: StepResult[] = scenario.steps.map((step, index) =>
    step.op === "quote"
      ? { premium: quotePremium(step.items, scenario.customer, index) }
      : claimResult(step, scenario.steps, paidPerPolicy),
  );
  return { results };
};
