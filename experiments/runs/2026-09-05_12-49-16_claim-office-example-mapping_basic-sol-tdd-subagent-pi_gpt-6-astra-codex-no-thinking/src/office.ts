export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export type Step =
  | { op: 'quote'; items: Item[] }
  | {
      op: 'claim';
      policy: number;
      incident: {
        cause: string;
        damages: { itemType: string; amount: number }[];
      };
    };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const FIRST_INSURANCE_PERCENT = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const FOLLOW_UP_PERCENT = 15;
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_PERCENT = 30;
const PERCENT = 100;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_ITEM_PREMIUM = 20;
function basePremium(item: Item, items: Item[]): number {
  if (!Object.hasOwn(BASE_PREMIUM_BY_ITEM_TYPE, item.type)) throw new Error(`Unknown item type: ${item.type}`);
  return (item.type === 'rune' || item.type === 'moonstone') && items.filter(other => other.type === item.type).length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_ITEM_PREMIUM : BASE_PREMIUM_BY_ITEM_TYPE[item.type];
}

function quotePremium(items: Item[], years: number, previousContracts: number): number {
  const followUpDiscountPercent = previousContracts > 0 ? FOLLOW_UP_PERCENT : 0;
  const loyaltyDiscountPercent = years >= LOYALTY_YEARS ? LOYALTY_PERCENT : 0;
  const subtotal = items.reduce((sum, item) => sum + basePremium(item, items), 0);
  const itemSurchargesScaled = items.reduce((sum, item) => {
    const cursePercent = item.cursed ? CURSE_PERCENT : 0;
    const enchantmentPercent = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_PERCENT : 0;
    return sum + basePremium(item, items) * (cursePercent + enchantmentPercent);
  }, 0);
  const adjustedSubtotalScaled = subtotal * (PERCENT + FIRST_INSURANCE_PERCENT - loyaltyDiscountPercent - followUpDiscountPercent);
  return Math.ceil((adjustedSubtotalScaled + itemSurchargesScaled) / PERCENT + PROCESSING_FEE);
}

const DEDUCTIBLE = 100;
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, rune: 250, amulet: 600, staff: 800, potion: 400, moonstone: 250 };
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
interface Policy { items: Item[]; remainingCap: number }
function processClaim(step: Extract<Step, {op: 'claim'}>, policy: Policy): Result {
  const unmatchedItems = [...policy.items];
  const desiredPayout = step.incident.damages.reduce((sum, entry) => {
    if (entry.amount < 0) throw new Error('Damage amount must not be negative');
    const index = unmatchedItems.findIndex(item => item.type === entry.itemType);
    if (index < 0) throw new Error(`Damage item not insured: ${entry.itemType}`);
    const [item] = unmatchedItems.splice(index, 1);
    const rate = (item?.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
    return sum + Math.max(0, entry.amount * rate - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function run(scenario: Scenario): { results: Result[] } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === 'claim') return processClaim(step, policies.get(step.policy)!);
    const remainingCap = step.items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0) * CAP_MULTIPLIER;
    policies.set(stepIndex, { items: step.items, remainingCap });
    return { premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, previousContracts++) };
  });
  return { results };
}
