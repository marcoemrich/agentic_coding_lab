type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Array<Item> };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<Damage> };
};
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = {
  customer: Customer;
  steps: Array<Step>;
};
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const MAIN_TYPES = new Set(Object.keys(MAIN_ITEM_BASE_PREMIUM));

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);
const isKnownType = (type: string): boolean =>
  MAIN_TYPES.has(type) || COMPONENT_TYPES.has(type);

const itemInsuranceValue = (item: Item): number =>
  isComponent(item) ? COMPONENT_INSURANCE_VALUE : MAIN_ITEM_INSURANCE_VALUE[item.type];

const componentsBasePremium = (components: Array<Item>): number => {
  const counts: Record<string, number> = {};
  for (const c of components) counts[c.type] = (counts[c.type] ?? 0) + 1;
  let total = 0;
  for (const type of Object.keys(counts)) {
    const n = counts[type];
    total += n === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : n * COMPONENT_BASE_PREMIUM;
  }
  return total;
};

const itemBasePremium = (item: Item): number =>
  isComponent(item) ? COMPONENT_BASE_PREMIUM : MAIN_ITEM_BASE_PREMIUM[item.type];

const itemModifierAmount = (item: Item): number => {
  let amount = 0;
  if (item.cursed) amount += itemBasePremium(item) * CURSE_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD)
    amount += itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return amount;
};

const policyBasePremium = (items: Array<Item>): number => {
  const components = items.filter(isComponent);
  const mains = items.filter((i) => !isComponent(i));
  const mainsTotal = mains.reduce((sum, i) => sum + MAIN_ITEM_BASE_PREMIUM[i.type], 0);
  return mainsTotal + componentsBasePremium(components);
};

const policyInsuranceSum = (items: Array<Item>): number =>
  items.reduce((sum, i) => sum + itemInsuranceValue(i), 0);

const quoteStep = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): QuoteResult => {
  for (const i of step.items) {
    if (!isKnownType(i.type)) throw new Error(`Unknown item type: ${i.type}`);
  }
  const base = policyBasePremium(step.items);
  const itemModifiers = step.items.reduce((sum, i) => sum + itemModifierAmount(i), 0);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOWUP_DISCOUNT_RATE : 0;
  const total = base + itemModifiers + firstInsurance - loyalty - followUp + PROCESSING_FEE;
  return { premium: Math.ceil(total) };
};

type Policy = {
  items: Array<Item>;
  cap: number;
  remainingCap: number;
};

const computePayoutForDamage = (item: Item, damageAmount: number): number => {
  let payable = damageAmount;
  if (item.material === DRAGON_MATERIAL) {
    // full reimbursement (no reduction)
  } else if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    payable = damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  // dragon + high ench: per spec, 50% rule wins
  if (item.material === DRAGON_MATERIAL && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    payable = damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  payable = payable - DEDUCTIBLE;
  return Math.max(0, payable);
};

const claimStep = (step: ClaimStep, policy: Policy): ClaimResult => {
  // Match each damage to an item in the policy; consume items so duplicates work.
  const remainingItems = [...policy.items];
  let total = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error("Negative damage amount");
    const idx = remainingItems.findIndex((it) => it.type === damage.itemType);
    if (idx === -1) throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    const item = remainingItems[idx];
    remainingItems.splice(idx, 1);
    total += computePayoutForDamage(item, damage.amount);
  }
  const rounded = Math.floor(total);
  const payout = Math.min(rounded, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Array<StepResult> } => {
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;
  const results: Array<StepResult> = [];
  scenario.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const result = quoteStep(step, scenario.customer, isFollowUp);
      const insSum = policyInsuranceSum(step.items);
      policies[idx] = {
        items: step.items,
        cap: insSum * CAP_MULTIPLIER,
        remainingCap: insSum * CAP_MULTIPLIER,
      };
      results.push(result);
    } else {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`Unknown policy index: ${step.policy}`);
      results.push(claimStep(step, policy));
    }
  });
  return { results };
};
