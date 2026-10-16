const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const FIRST_ASSESSMENT = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT = 5;
const LOYAL_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FOLLOWUP_DISCOUNT = 0.15;
const ENCHANTMENT_SURCHARGE = 0.3;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const BASE_PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: 'quote'; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: 'claim'; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

function validateItemType(type: string) {
  if (!COMPONENT_TYPES.has(type) && !Object.hasOwn(BASE_PREMIUMS, type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

function individualBasePremium(type: string) {
  validateItemType(type);
  return COMPONENT_TYPES.has(type) ? COMPONENT_PREMIUM : BASE_PREMIUMS[type];
}

function itemBasePremium(type: string, items: Item[]) {
  const count = items.filter(other => other.type === type).length;
  return COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
    ? BLOCK_PREMIUM / BLOCK_SIZE : individualBasePremium(type);
}

function basePremiumFor(items: Item[]) {
  return items.reduce((sum, item) => sum + itemBasePremium(item.type, items), 0);
}

function curseSurcharge(item: Item, base: number) {
  return item.cursed ? base * CURSE_SURCHARGE : 0;
}

function enchantmentSurcharge(item: Item, base: number) {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * ENCHANTMENT_SURCHARGE : 0;
}

function loyaltyDiscount(base: number, years: number) {
  return years >= LOYAL_YEARS ? base * LOYALTY_DISCOUNT : 0;
}

function followupDiscount(base: number, previousContracts: number) {
  return previousContracts > 0 ? base * FOLLOWUP_DISCOUNT : 0;
}

function premiumFor(items: Item[], years: number, previousContracts: number) {
  const base = basePremiumFor(items);
  const risk = items.reduce((sum, item) => sum + curseSurcharge(item, itemBasePremium(item.type, items))
    + enchantmentSurcharge(item, itemBasePremium(item.type, items)), 0);
  const loyalty = loyaltyDiscount(base, years);
  const followup = followupDiscount(base, previousContracts);
  return Math.ceil(base + risk + base * FIRST_ASSESSMENT - loyalty - followup + PROCESSING_FEE);
}

function policyCap(items: Item[]) {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0) * CAP_MULTIPLIER;
}

function reimbursableDamage(item: Item, amount: number) {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT : amount;
}

function netDamagePayout(item: Item, amount: number) {
  return Math.max(0, reimbursableDamage(item, amount) - DEDUCTIBLE);
}

function settlePayout(policy: Policy, requested: number) {
  const payout = Math.floor(Math.min(requested, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validateDamageAmount(amount: number) {
  if (amount < 0) throw new Error('Damage amount must not be negative');
}

function takeInsuredItem(available: Item[], type: string) {
  const index = available.findIndex(item => item.type === type);
  if (index < 0) throw new Error(`No insured item available for ${type}`);
  return available.splice(index, 1)[0];
}

function claimFor(step: ClaimStep, policy: Policy) {
  const available = [...policy.items];
  const total = step.incident.damages.reduce((sum, damage) => {
    validateDamageAmount(damage.amount);
    const item = takeInsuredItem(available, damage.itemType);
    return sum + netDamagePayout(item, damage.amount);
  }, 0);
  return settlePayout(policy, total);
}

export function execute(input: unknown) {
  const scenario = input as Scenario;
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      policies.set(index, { items: step.items, remainingCap: policyCap(step.items) });
      return { premium: premiumFor(step.items, scenario.customer.yearsWithMHPCO, previousContracts++) };
    }
    return claimFor(step, policies.get(step.policy)!);
  });
  return { results };
}
