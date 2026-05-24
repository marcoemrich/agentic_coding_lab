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

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

const PROCESSING_FEE = 5;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;

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

const isKnownType = (type: string): boolean =>
  COMPONENT_TYPES.has(type) || type in MAIN_INSURANCE_VALUE;

const itemInsuranceValue = (item: Item): number =>
  COMPONENT_TYPES.has(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_INSURANCE_VALUE[item.type];

const itemBasePremium = (item: Item): number =>
  COMPONENT_TYPES.has(item.type) ? COMPONENT_BASE : MAIN_BASE_PREMIUM[item.type];

const itemsBase = (items: Item[]): number => {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += MAIN_BASE_PREMIUM[item.type];
    }
  }
  for (const count of Object.values(componentCounts)) {
    total += count === 3 ? COMPONENT_BLOCK_PRICE : count * COMPONENT_BASE;
  }
  return total;
};

const itemSurcharges = (items: Item[]): number => {
  let surcharge = 0;
  for (const item of items) {
    const base = itemBasePremium(item);
    if (item.cursed) surcharge += base * 0.5;
    if ((item.enchantment ?? 0) >= 5) surcharge += base * 0.3;
  }
  return surcharge;
};

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const computeRawPayout = (item: Item, damage: number): number => {
  const highEnch = (item.enchantment ?? 0) >= 8;
  const dragon = item.material === "dragon";
  let amount = damage;
  if (highEnch) amount = damage * 0.5;
  else if (dragon) amount = damage;
  return amount - DEDUCTIBLE;
};

export const processScenario = (scenario: Scenario): unknown => {
  const years = scenario.customer.yearsWithMHPCO;
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};

  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!isKnownType(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      const isFirstContract = quoteCount === 0;
      quoteCount += 1;
      const policyBase = itemsBase(step.items);
      const itemMods = itemSurcharges(step.items);
      const firstInsurance = policyBase * 0.1;
      const loyalty = years >= 2 ? policyBase * 0.2 : 0;
      const followUp = isFirstContract ? 0 : policyBase * 0.15;
      const insuranceSum = step.items.reduce(
        (sum, item) => sum + itemInsuranceValue(item),
        0,
      );
      policies[stepIndex] = {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * 2,
      };
      return {
        premium: Math.ceil(
          policyBase + itemMods + firstInsurance - loyalty - followUp + PROCESSING_FEE,
        ),
      };
    }
    const policy = policies[step.policy];
    const typeCounts: Record<string, number> = {};
    for (const i of policy.items) {
      typeCounts[i.type] = (typeCounts[i.type] ?? 0) + 1;
    }
    let totalPayout = 0;
    const used: Record<string, number> = {};
    for (const dmg of step.incident.damages) {
      if (dmg.amount < 0) {
        throw new Error(`Negative damage amount: ${dmg.amount}`);
      }
      used[dmg.itemType] = (used[dmg.itemType] ?? 0) + 1;
      if (used[dmg.itemType] > (typeCounts[dmg.itemType] ?? 0)) {
        throw new Error(`More ${dmg.itemType} damages than items in policy`);
      }
      const item = policy.items.find((i) => i.type === dmg.itemType);
      if (!item) throw new Error(`Item ${dmg.itemType} not in policy`);
      const raw = computeRawPayout(item, dmg.amount);
      totalPayout += Math.max(0, raw);
    }
    const payout = Math.floor(Math.min(totalPayout, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  });
  return { results };
};
