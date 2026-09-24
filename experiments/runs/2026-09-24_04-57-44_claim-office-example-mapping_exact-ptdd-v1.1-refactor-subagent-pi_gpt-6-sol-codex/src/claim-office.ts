const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const PERCENT = 100;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const POLICY_CAP_MULTIPLIER = 2;
const CURSE_PERCENT = 50;
const ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT = 5;
const LOYALTY_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_PERCENT = 15;
const DAMAGE_ENCHANTMENT = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;
const CATALOGUE: Record<string, { insuranceValue: number; basePremium: number }> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Step = { op: string; items?: Item[]; policy?: number; incident?: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

function assertInsurableItems(items: Item[]): void {
  for (const item of items) {
    if (!Object.hasOwn(CATALOGUE, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + CATALOGUE[item.type].insuranceValue, 0);
}

function policyBasePremium(items: Item[]): number {
  const base = items.reduce((sum, item) => sum + CATALOGUE[item.type].basePremium, 0);
  const blocks = ['rune', 'moonstone'].filter(type => items.filter(item => item.type === type).length === BLOCK_SIZE).length;
  const discount = blocks * (BLOCK_SIZE * CATALOGUE.rune.basePremium - BLOCK_PREMIUM);
  return base - discount;
}

function policyPremiumPercent(years: number, previousQuotes: number): number {
  return PERCENT + FIRST_INSURANCE_PERCENT -
    (years >= LOYALTY_YEARS ? LOYALTY_PERCENT : 0) -
    (previousQuotes > 0 ? FOLLOW_UP_PERCENT : 0);
}

function quotePremium(items: Item[], years: number, previousQuotes: number): number {
  const base = policyBasePremium(items);
  const risk = items.reduce((sum, item) => {
    const premium = CATALOGUE[item.type].basePremium;
    return sum + premium * ((item.cursed ? CURSE_PERCENT : 0) +
      ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_PERCENT : 0));
  }, 0);
  const policyPercent = policyPremiumPercent(years, previousQuotes);
  return Math.ceil((base * policyPercent + risk) / PERCENT + PROCESSING_FEE);
}

function matchInsuredItems(items: Item[], damages: Damage[]): Item[] {
  const used = new Set<number>();
  return damages.map(damage => {
    const position = items.findIndex((item, i) => item.type === damage.itemType && !used.has(i));
    if (position < 0) throw new Error(`Uninsured item: ${damage.itemType}`);
    used.add(position);
    return items[position];
  });
}

function assertNonnegativeDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  }
}

function reimbursableDamage(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= DAMAGE_ENCHANTMENT
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

export function processScenario(scenario: Scenario): { results: object[] } {
  const results: object[] = [];
  const policies = new Map<number, { items: Item[]; remainingCap: number }>();
  scenario.steps.forEach((step, index) => {
    if (step.op === 'quote') {
      const items = step.items ?? [];
      assertInsurableItems(items);
      policies.set(index, { items, remainingCap: POLICY_CAP_MULTIPLIER * insuranceSum(items) });
      results.push({ premium: quotePremium(items, scenario.customer.yearsWithMHPCO, policies.size - 1) });
    } else if (step.op === 'claim') {
      const policy = policies.get(step.policy ?? -1);
      if (!policy) throw new Error('Unknown policy');
      const damages = step.incident?.damages ?? [];
      assertNonnegativeDamageAmounts(damages);
      const matchedItems = matchInsuredItems(policy.items, damages);
      const desired = damages.reduce((total, damage, index) =>
        total + reimbursableDamage(matchedItems[index], damage.amount), 0);
      const payout = Math.min(policy.remainingCap, Math.floor(desired));
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  });
  return { results };
}
