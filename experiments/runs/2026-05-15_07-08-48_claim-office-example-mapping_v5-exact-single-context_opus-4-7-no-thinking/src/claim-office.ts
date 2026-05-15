type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const MAIN_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BLOCK_BASE = 60;
const DEDUCTIBLE = 100;
const FEE = 5;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);
const isMainItem = (item: Item): boolean => item.type in MAIN_BASE_PREMIUM;
const isKnownType = (type: string): boolean =>
  type in MAIN_BASE_PREMIUM || COMPONENT_TYPES.has(type);

const mainItemBase = (item: Item): number => MAIN_BASE_PREMIUM[item.type] ?? 0;

const mainItemSurcharges = (item: Item): number => {
  const base = mainItemBase(item);
  let s = 0;
  if (item.cursed) s += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) s += base * 0.3;
  return s;
};

const componentsBase = (components: Item[]): number => {
  const counts = new Map<string, number>();
  for (const c of components) {
    counts.set(c.type, (counts.get(c.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    if (count === 3) total += COMPONENT_BLOCK_BASE;
    else total += count * COMPONENT_BASE;
  }
  return total;
};

const itemInsuranceValue = (item: Item): number => {
  if (isMainItem(item)) return MAIN_INSURANCE_VALUE[item.type];
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return 0;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((s, it) => s + itemInsuranceValue(it), 0);

const quotePremium = (
  items: Item[],
  customer: { yearsWithMHPCO: number },
  contractIndex: number,
): number => {
  const mainItems = items.filter(isMainItem);
  const components = items.filter(isComponent);
  const mainBase = mainItems.reduce((s, it) => s + mainItemBase(it), 0);
  const compBase = componentsBase(components);
  const policyBase = mainBase + compBase;
  const itemSurcharges = mainItems.reduce((s, it) => s + mainItemSurcharges(it), 0);

  let total = policyBase + itemSurcharges;
  total += policyBase * 0.1; // first insurance (per spec, each item is first insurance)
  if (customer.yearsWithMHPCO >= 2) total -= policyBase * 0.2;
  if (contractIndex > 0) total -= policyBase * 0.15;

  return Math.ceil(total + FEE);
};

type Policy = {
  items: Item[];
  remainingCap: number;
};

const findItemForDamage = (policy: Policy, itemType: string, usedIndices: Set<number>): Item | null => {
  for (let i = 0; i < policy.items.length; i++) {
    if (usedIndices.has(i)) continue;
    if (policy.items[i].type === itemType) {
      usedIndices.add(i);
      return policy.items[i];
    }
  }
  return null;
};

const reimbursementFor = (item: Item, amount: number): number => {
  const isDragon = item.material === "dragon";
  const isHighlyEnchanted = (item.enchantment ?? 0) >= 8;
  // Both clauses: 50% wins (then deductible separately handled)
  if (isHighlyEnchanted) return amount * 0.5;
  if (isDragon) return amount;
  return amount;
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  // Validate damages: known items, no negatives, enough items in policy
  const usedIndices = new Set<number>();
  let totalPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!isKnownType(damage.itemType)) {
      throw new Error(`Unknown damage item type: ${damage.itemType}`);
    }
    const item = findItemForDamage(policy, damage.itemType, usedIndices);
    if (!item) {
      throw new Error(`Damage references item not in policy: ${damage.itemType}`);
    }
    const reimbursed = reimbursementFor(item, damage.amount);
    const afterDeductible = Math.max(0, reimbursed - DEDUCTIBLE);
    const capped = Math.min(afterDeductible, policy.remainingCap - totalPayout);
    totalPayout += Math.max(0, capped);
  }
  const payout = Math.floor(totalPayout);
  policy.remainingCap = Math.max(0, policy.remainingCap - payout);
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (
  scenario: Scenario,
): { results: StepResult[] } => {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results: StepResult[] = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      // Validate item types
      for (const item of step.items) {
        if (!isKnownType(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      const premium = quotePremium(step.items, scenario.customer, quoteCount);
      quoteCount++;
      const sum = insuranceSum(step.items);
      policies[idx] = { items: step.items, remainingCap: sum * 2 };
      return { premium };
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`No policy at index ${step.policy}`);
      return processClaim(policy, step.incident);
    }
    throw new Error("Unknown op");
  });
  return { results };
};
