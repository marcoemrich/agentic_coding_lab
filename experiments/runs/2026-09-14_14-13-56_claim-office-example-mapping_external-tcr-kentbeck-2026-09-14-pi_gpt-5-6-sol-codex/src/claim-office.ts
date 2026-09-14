export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteResult {
  premium: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface QuoteStep {
  op: 'quote';
  items: Item[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export interface ScenarioResult {
  results: Array<QuoteResult | ClaimResult>;
}

const BASE_PREMIUM: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const COMPONENT_TYPES = ['rune', 'moonstone'];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const INSURANCE_VALUE: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const DEDUCTIBLE = 100;

function basePremium(item: Item): number {
  const premium = BASE_PREMIUM[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

function policyBasePremium(items: Item[]): number {
  const ordinaryBase = items.reduce((total, item) => total + basePremium(item), 0);
  return COMPONENT_TYPES.reduce((total, type) => {
    const count = items.filter(item => item.type === type).length;
    return count === BLOCK_SIZE ? total - count * BASE_PREMIUM[type] + BLOCK_PREMIUM : total;
  }, ordinaryBase);
}

function itemSurcharge(item: Item): number {
  const base = basePremium(item);
  const curse = item.cursed === true ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD
    ? base * HIGH_ENCHANTMENT_RATE
    : 0;
  return curse + enchantment;
}

export function quote(items: Item[], yearsWithMHPCO: number, followUp: boolean): QuoteResult {
  const base = policyBasePremium(items);
  const surcharges = items.reduce((total, item) => total + itemSurcharge(item), 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const contractDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  const premium = base + surcharges + base * INITIAL_ASSESSMENT_RATE - loyalty - contractDiscount;
  return { premium: Math.ceil(premium + PROCESSING_FEE) };
}

export function insuranceCap(items: Item[]): number {
  const sum = items.reduce((total, item) => {
    const value = INSURANCE_VALUE[item.type];
    if (value === undefined) throw new Error(`Unknown item type: ${item.type}`);
    return total + value;
  }, 0);
  return sum * CAP_MULTIPLIER;
}

function coveredItems(items: Item[], damages: Damage[]): Item[] {
  const available = items.map((item, index) => ({ item, index, used: false }));
  return damages.map(damage => {
    const match = available.find(entry => !entry.used && entry.item.type === damage.itemType);
    if (match === undefined) throw new Error(`Damaged item is not covered: ${damage.itemType}`);
    match.used = true;
    return match.item;
  });
}

function reimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT
    : 1;
  return Math.max(amount * rate - DEDUCTIBLE, 0);
}

export function settleClaim(items: Item[], damages: Damage[], remainingCap: number): ClaimResult {
  if (damages.some(damage => damage.amount < 0)) throw new Error('Damage amount cannot be negative');
  const covered = coveredItems(items, damages);
  const desired = damages.reduce(
    (total, damage, index) => total + reimbursement(covered[index], damage.amount),
    0,
  );
  const payout = Math.floor(Math.min(desired, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
}

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, PolicyState>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === 'quote') {
      const result = quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
      policies.set(index, { items: step.items, remainingCap: insuranceCap(step.items) });
      quoteCount += 1;
      return result;
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error(`Claim policy does not refer to an earlier quote: ${step.policy}`);
    const result = settleClaim(policy.items, step.incident.damages, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    return result;
  });
  return { results };
}
