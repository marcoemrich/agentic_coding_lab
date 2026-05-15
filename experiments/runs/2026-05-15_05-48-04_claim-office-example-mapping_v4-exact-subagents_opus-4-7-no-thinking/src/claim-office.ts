type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type StepResult = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_BASE = 60;
const BLOCK_SIZE = 3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function withFirstInsurance(base: number): number {
  return base + base * FIRST_INSURANCE_SURCHARGE;
}

function itemBase(item: Item): number {
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return BASE_PREMIUMS[item.type];
}

function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const list = groups.get(item.type) ?? [];
    list.push(item);
    groups.set(item.type, list);
  }
  return groups;
}

function componentGroupBase(group: Item[]): number {
  const blocks = Math.floor(group.length / BLOCK_SIZE);
  const remainder = group.length - blocks * BLOCK_SIZE;
  return blocks * BLOCK_BASE + remainder * itemBase(group[0]);
}

function rateOf(condition: boolean, base: number, rate: number): number {
  return condition ? base * rate : 0;
}

function itemPremium(item: Item): number {
  const base = itemBase(item);
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
  const curseSurcharge = rateOf(item.cursed === true, base, CURSED_SURCHARGE);
  const enchantmentSurcharge = rateOf(isHighlyEnchanted, base, HIGH_ENCHANTMENT_SURCHARGE);
  return withFirstInsurance(base) + curseSurcharge + enchantmentSurcharge;
}

function partitionItems(items: Item[]): { components: Item[]; others: Item[] } {
  const components: Item[] = [];
  const others: Item[] = [];
  for (const item of items) {
    (COMPONENT_TYPES.has(item.type) ? components : others).push(item);
  }
  return { components, others };
}

function componentGroupBases(components: Item[]): number[] {
  const bases: number[] = [];
  for (const [, group] of groupByType(components)) {
    bases.push(componentGroupBase(group));
  }
  return bases;
}

function sumBy<T>(items: T[], fn: (item: T) => number): number {
  return items.reduce((sum, item) => sum + fn(item), 0);
}

function quotePremium(items: Item[], yearsWithMHPCO: number, isFirstContract: boolean): number {
  const { components, others } = partitionItems(items);
  const groupBases = componentGroupBases(components);
  const othersTotal = sumBy(others, itemPremium);
  const componentsTotal = sumBy(groupBases, withFirstInsurance);
  const policyBase = sumBy(others, itemBase) + sumBy(groupBases, (base) => base);
  const loyaltyDiscount = rateOf(
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD,
    policyBase,
    LOYALTY_DISCOUNT_RATE,
  );
  const followUpDiscount = rateOf(
    !isFirstContract,
    policyBase,
    FOLLOW_UP_DISCOUNT_RATE,
  );
  return Math.ceil(othersTotal + componentsTotal - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Policy = { items: Item[]; insuranceSum: number; remainingCap: number };

function policyInsuranceSum(items: Item[]): number {
  return sumBy(items, (item) => INSURANCE_VALUES[item.type]);
}

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function damagePayout(damage: Damage, policyItems: Item[]): number {
  if (damage.amount < 0) {
    throw new Error(`negative damage amount: ${damage.amount}`);
  }
  const matchedItem = policyItems.find((item) => item.type === damage.itemType);
  if (matchedItem === undefined) {
    throw new Error(`damage references unknown item: ${damage.itemType}`);
  }
  const reimbursement =
    (matchedItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damage.amount;
  return reimbursement - DEDUCTIBLE;
}

function processClaim(step: ClaimStep, policies: Policy[]): StepResult {
  const policy = policies[step.policy];
  const damageCounts = new Map<string, number>();
  for (const damage of step.incident.damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  const insuredCounts = new Map<string, number>();
  for (const item of policy.items) {
    insuredCounts.set(item.type, (insuredCounts.get(item.type) ?? 0) + 1);
  }
  for (const [itemType, count] of damageCounts) {
    const insured = insuredCounts.get(itemType) ?? 0;
    if (count > insured) {
      throw new Error(`too many damages of type ${itemType}: ${count} reported, only ${insured} insured`);
    }
  }
  const rawPayout = Math.floor(
    sumBy(step.incident.damages, (damage) => damagePayout(damage, policy.items)),
  );
  const payout = Math.min(rawPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return processClaim(step, policies);
    }
    const insuranceSum = policyInsuranceSum(step.items);
    policies.push({
      items: step.items,
      insuranceSum,
      remainingCap: CAP_MULTIPLIER * insuranceSum,
    });
    return {
      premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, index === 0),
    };
  });
  return { results };
}
