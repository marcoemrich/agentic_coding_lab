type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number };
type StepResult = QuoteResult | ClaimResult;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANT_SURCHARGE = 0.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const DEDUCTIBLE = 100;
const HIGH_ENCHANT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANT_PAYOUT_FACTOR = 0.5;

const MAIN_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM: Record<string, number> = {
  rune: 25,
  moonstone: 25,
};

const isComponent = (type: string): boolean => type in COMPONENT_BASE_PREMIUM;
const isMain = (type: string): boolean => type in MAIN_BASE_PREMIUM;
const isKnownItemType = (type: string): boolean => isMain(type) || isComponent(type);

const itemSurcharges = (item: Item): number => {
  const base = MAIN_BASE_PREMIUM[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) surcharge += base * HIGH_ENCHANT_SURCHARGE;
  return surcharge;
};

const componentGroupBase = (count: number, singlePrice: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PRICE;
  return count * singlePrice;
};

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const componentsBase = (componentItems: Item[]): number => {
  let total = 0;
  for (const [type, count] of countByType(componentItems)) {
    total += componentGroupBase(count, COMPONENT_BASE_PREMIUM[type]);
  }
  return total;
};

const computeQuotePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  isFollowup: boolean
): number => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const mains = items.filter((i) => !isComponent(i.type));
  const components = items.filter((i) => isComponent(i.type));
  const mainsBase = mains.reduce((s, i) => s + MAIN_BASE_PREMIUM[i.type], 0);
  const compBase = componentsBase(components);
  const policyBase = mainsBase + compBase;
  const itemModifiers = mains.reduce((s, i) => s + itemSurcharges(i), 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const followup = isFollowup ? policyBase * FOLLOWUP_DISCOUNT : 0;
  const total =
    policyBase + itemModifiers - loyalty + firstInsurance - followup + PROCESSING_FEE;
  return Math.ceil(total);
};

const computeDamagePayout = (item: Item, amount: number): number => {
  let reimbursed = amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_PAYOUT_THRESHOLD) {
    reimbursed = amount * HIGH_ENCHANT_PAYOUT_FACTOR;
  }
  if (item.material === "dragon") {
    reimbursed = amount;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANT_PAYOUT_THRESHOLD) {
      reimbursed = amount * HIGH_ENCHANT_PAYOUT_FACTOR;
    }
  }
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const computeClaimPayout = (policyItems: Item[], damages: Damage[]): number => {
  const available = [...policyItems];
  let total = 0;
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    const idx = available.findIndex((i) => i.type === damage.itemType);
    if (idx < 0) throw new Error(`Damaged item ${damage.itemType} not in policy`);
    const item = available[idx];
    available.splice(idx, 1);
    total += computeDamagePayout(item, damage.amount);
  }
  return Math.floor(total);
};

export const runScenario = (input: Scenario): { results: StepResult[] } => {
  let quoteCount = 0;
  const policies: Item[][] = [];
  const results: StepResult[] = input.steps.map((step, idx) => {
    if (step.op === "quote") {
      const isFollowup = quoteCount > 0;
      quoteCount += 1;
      policies[idx] = step.items;
      return { premium: computeQuotePremium(step.items, input.customer.yearsWithMHPCO, isFollowup) };
    }
    const policyItems = policies[step.policy];
    return { payout: computeClaimPayout(policyItems, step.incident.damages) };
  });
  return { results };
};
