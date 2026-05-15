type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_INSURANCE = 250;
const DEDUCTIBLE = 100;

const VALID_COMPONENTS = new Set(["rune", "moonstone"]);

const isMainItem = (type: string): boolean => type in BASE_PREMIUMS;
const isComponent = (type: string): boolean => VALID_COMPONENTS.has(type);
const isValidItemType = (type: string): boolean => isMainItem(type) || isComponent(type);

const itemInsuranceValue = (type: string): number =>
  isMainItem(type) ? INSURANCE_VALUES[type] : COMPONENT_INSURANCE;

const computeItemBaseAndSurcharges = (items: Item[]): { base: number; surcharges: number } => {
  let base = 0;
  let surcharges = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (!isValidItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
    if (isMainItem(item.type)) {
      const itemBase = BASE_PREMIUMS[item.type];
      base += itemBase;
      if (item.cursed) surcharges += itemBase * 0.5;
      if ((item.enchantment ?? 0) >= 5) surcharges += itemBase * 0.3;
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }
  for (const type in componentCounts) {
    const count = componentCounts[type];
    base += count === 3 ? COMPONENT_BLOCK_BASE : count * COMPONENT_BASE;
  }
  return { base, surcharges };
};

type Policy = { items: Item[]; insuranceSum: number; cap: number; remainingCap: number };

const buildPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item.type), 0);
  return { items, insuranceSum, cap: insuranceSum * 2, remainingCap: insuranceSum * 2 };
};

const findItemInPolicy = (policy: Policy, itemType: string): Item | undefined =>
  policy.items.find((i) => i.type === itemType);

const computeRawPayout = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= 8) return damageAmount * 0.5;
  if (item.material === "dragon") return damageAmount;
  return damageAmount;
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results: Result[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const { base, surcharges } = computeItemBaseAndSurcharges(step.items);
      const firstInsurance = base * 0.1;
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= 2 ? base * 0.2 : 0;
      const followUpDiscount = quoteCount >= 1 ? base * 0.15 : 0;
      quoteCount += 1;
      policies[index] = buildPolicy(step.items);
      return {
        premium: Math.ceil(base + surcharges + firstInsurance - loyaltyDiscount - followUpDiscount + 5),
      };
    }
    // claim
    const policy = policies[step.policy];
    const damageCountByType: Record<string, number> = {};
    for (const damage of step.incident.damages) {
      damageCountByType[damage.itemType] = (damageCountByType[damage.itemType] ?? 0) + 1;
    }
    for (const type in damageCountByType) {
      const insuredCount = policy.items.filter((i) => i.type === type).length;
      if (damageCountByType[type] > insuredCount) {
        throw new Error(`Too many damages for type ${type}`);
      }
    }
    let totalPayout = 0;
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
      const item = findItemInPolicy(policy, damage.itemType);
      if (!item) throw new Error(`Damaged item ${damage.itemType} not in policy`);
      const raw = computeRawPayout(item, damage.amount);
      const afterDeductible = Math.max(0, raw - DEDUCTIBLE);
      totalPayout += afterDeductible;
    }
    const capped = Math.min(totalPayout, policy.remainingCap);
    const finalPayout = Math.floor(capped);
    policy.remainingCap -= finalPayout;
    return { payout: finalPayout, remainingCap: policy.remainingCap };
  });
  return { results };
};
