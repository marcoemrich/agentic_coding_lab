export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type Quote = { op: 'quote'; items: Item[] };
export type Claim = { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
export type Scenario = { customer: { yearsWithMHPCO: number }; steps: (Quote | Claim)[] };
export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

type PriceListEntry = { basePremium: number; insuranceValue: number };
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};
const INITIAL_ASSESSMENT = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOW_UP_DISCOUNT = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function hasComponentBlock(item: Item, items: Item[]): boolean {
  const component = item.type === 'rune' || item.type === 'moonstone';
  return component && items.filter(other => other.type === item.type).length === BLOCK_SIZE;
}

function priceListEntry(type: string): PriceListEntry {
  if (!Object.hasOwn(PRICE_LIST, type)) throw new Error(`Unknown item type: ${type}`);
  return PRICE_LIST[type];
}

function itemBasePremium(item: Item, items: Item[]): number {
  return hasComponentBlock(item, items) ? BLOCK_PREMIUM / BLOCK_SIZE : priceListEntry(item.type).basePremium;
}

function curseSurcharge(item: Item, base: number): number {
  return item.cursed ? base * CURSE_SURCHARGE : 0;
}

function enchantmentSurcharge(item: Item, base: number): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * ENCHANTMENT_SURCHARGE : 0;
}

function itemRiskSurcharge(item: Item, base: number): number {
  return curseSurcharge(item, base) + enchantmentSurcharge(item, base);
}

function loyaltyDiscount(base: number, years: number): number {
  return years >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
}

function followUpDiscount(base: number, previousContracts: number): number {
  return previousContracts > 0 ? base * FOLLOW_UP_DISCOUNT : 0;
}

function quotePremium(items: Item[], years: number, previousContracts: number): number {
  const base = items.reduce((sum, item) => sum + itemBasePremium(item, items), 0);
  const risk = items.reduce((sum, item) => sum + itemRiskSurcharge(item, itemBasePremium(item, items)), 0);
  const loyalty = loyaltyDiscount(base, years);
  const followUp = followUpDiscount(base, previousContracts);
  return Math.ceil(base + risk + base * INITIAL_ASSESSMENT - loyalty - followUp + PROCESSING_FEE);
}

function policyCap(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceListEntry(item.type).insuranceValue * CAP_MULTIPLIER, 0);
}

function reimbursedDamage(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
  return amount * rate;
}

function takeInsuredItem(available: Item[], type: string): Item {
  const index = available.findIndex(item => item.type === type);
  if (index < 0) throw new Error(`Damage exceeds insured items: ${type}`);
  return available.splice(index, 1)[0];
}

function validateDamageAmount(amount: number): void {
  if (amount < 0) throw new Error('Damage amount must not be negative');
}

function claimPayout(damages: Damage[], items: Item[]): number {
  const available = [...items];
  return Math.floor(damages.reduce((sum, damage) => {
    validateDamageAmount(damage.amount);
    const item = takeInsuredItem(available, damage.itemType);
    return sum + Math.max(0, reimbursedDamage(item, damage.amount) - DEDUCTIBLE);
  }, 0));
}

type Policy = { items: Item[]; remainingCap: number };

function settleClaim(policy: Policy, damages: Damage[]): Result {
  const payout = Math.min(policy.remainingCap, claimPayout(damages, policy.items));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === 'quote') {
      policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
      return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, contracts++) };
    }
    return settleClaim(policies.get(step.policy)!, step.incident.damages);
  });
  return { results };
}
