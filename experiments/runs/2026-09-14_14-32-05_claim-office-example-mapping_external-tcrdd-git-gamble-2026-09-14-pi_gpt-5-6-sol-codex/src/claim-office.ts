export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: 'quote'; items: Item[] } | ClaimStep>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const basePremiums: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const insuranceValues: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const COMPONENT_TYPES = ['rune', 'moonstone'];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_SAVING = 15;
const INITIAL_ASSESSMENT_PERCENT = 10;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CURSE_SURCHARGE_PERCENT = 50;
const ENCHANTMENT_SURCHARGE_PERCENT = 30;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const PREMIUM_ENCHANTMENT_LEVEL = 5;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const PERCENT = 100;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function percent(amount: number, rate: number): number {
  return amount * rate / PERCENT;
}

function policyBase(items: Item[]): number {
  for (const item of items) {
    if (!(item.type in basePremiums)) throw new Error(`Unknown item type: ${item.type}`);
  }
  const listedBase = items.reduce((sum, item) => sum + basePremiums[item.type], 0);
  return COMPONENT_TYPES.reduce((base, type) => {
    const count = items.filter((item) => item.type === type).length;
    return base - (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_SAVING : 0);
  }, listedBase);
}

function itemModifier(items: Item[], predicate: (item: Item) => boolean, rate: number): number {
  return items.filter(predicate)
    .reduce((sum, item) => sum + percent(basePremiums[item.type], rate), 0);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValues[item.type], 0);
  return { items, remainingCap: CAP_MULTIPLIER * insuranceSum };
}

function quote(items: Item[], years: number, followUp: boolean): { premium: number; policy: Policy } {
  const base = policyBase(items);
  const policyRate = PERCENT + INITIAL_ASSESSMENT_PERCENT
    - (followUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0)
    - (years >= LOYALTY_YEARS ? LOYALTY_DISCOUNT_PERCENT : 0);
  const curse = itemModifier(items, (item) => item.cursed === true, CURSE_SURCHARGE_PERCENT);
  const enchantment = itemModifier(
    items, (item) => (item.enchantment ?? 0) >= PREMIUM_ENCHANTMENT_LEVEL,
    ENCHANTMENT_SURCHARGE_PERCENT,
  );
  return {
    premium: Math.ceil(percent(base, policyRate) + curse + enchantment + PROCESSING_FEE),
    policy: createPolicy(items),
  };
}

function desiredPayout(policy: Policy, damages: ClaimStep['incident']['damages']): number {
  const usedByType: Record<string, number> = {};
  return damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    const matching = policy.items.filter((item) => item.type === damage.itemType);
    const item = matching[usedByType[damage.itemType] ?? 0];
    if (!item) throw new Error(`Damaged item is not insured: ${damage.itemType}`);
    usedByType[damage.itemType] = (usedByType[damage.itemType] ?? 0) + 1;
    const highEnchantment = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL;
    const rate = highEnchantment ? REDUCED_REIMBURSEMENT_PERCENT : PERCENT;
    return sum + Math.max(0, percent(damage.amount, rate) - DEDUCTIBLE);
  }, 0);
}

function claim(policy: Policy, damages: ClaimStep['incident']['damages']): object {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: object[] } {
  let quoteCount = 0;
  const policies: Array<Policy | undefined> = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'claim') {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      return claim(policy, step.incident.damages);
    }
    const quoted = quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount++ > 0);
    policies[index] = quoted.policy;
    return { premium: quoted.premium };
  });
  return { results };
}
