const PROCESSING_FEE = 5;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;
const COMPONENT_TYPES = ["rune", "moonstone"];
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const ITEM_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

function buildingBlockSaving(items: Item[]): number {
  return COMPONENT_TYPES.reduce((saving, type) => {
    const count = items.filter((item) => item.type === type).length;
    return saving + (count === BLOCK_SIZE ? BLOCK_SAVING : 0);
  }, 0);
}

export function basePremium(items: Item[]): number {
  const listedPremium = items.reduce((total, item) => total + (ITEM_PREMIUM[item.type] ?? 0), 0);
  return listedPremium - buildingBlockSaving(items);
}

function itemRiskSurcharge(item: Item): number {
  const itemBase = ITEM_PREMIUM[item.type] ?? 0;
  const curse = item.cursed ? itemBase * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? itemBase * HIGH_ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

export function riskAdjustedPremium(items: Item[]): number {
  return basePremium(items) + items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
}

function policyWideAdjustment(customer: Customer, policyBase: number, previousContracts: number): number {
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_RATE : 0;
  const followUpDiscount = previousContracts > 0 ? policyBase * FOLLOW_UP_RATE : 0;
  return policyBase * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount;
}

export function quote(customer: Customer, items: Item[], previousContracts: number): number {
  const policyBase = basePremium(items);
  return Math.ceil(riskAdjustedPremium(items) + policyWideAdjustment(customer, policyBase, previousContracts) + PROCESSING_FEE);
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

type Step = QuoteStep | ClaimStep;
interface Scenario { customer: Customer; steps: Step[] }
interface Policy { items: Item[]; remainingCap: number }

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in ITEM_PREMIUM)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursableDamage(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT : amount;
}

function validateDamageAmount(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Invalid negative damage amount: ${damage.amount}`);
}

function matchDamages(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    validateDamageAmount(damage);
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item not covered: ${damage.itemType}`);
    return available.splice(index, 1)[0] as Item;
  });
}

function desiredPayout(policy: Policy, damages: Damage[]): number {
  const matchedItems = matchDamages(policy, damages);
  return damages.reduce((sum, damage, index) => {
    const reimbursable = reimbursableDamage(matchedItems[index] as Item, damage.amount);
    return sum + Math.max(0, reimbursable - DEDUCTIBLE);
  }, 0);
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  const payout = Math.floor(Math.min(desiredPayout(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown): unknown {
  const scenario = input as Scenario;
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  let previousContracts = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error(`Unknown policy: ${step.policy}`);
      results.push(processClaim(policy, step.incident.damages));
    } else {
      validateItems(step.items);
      results.push({ premium: quote(scenario.customer, step.items, previousContracts++) });
      policies.set(index, createPolicy(step.items));
    }
  });
  return { results };
}
