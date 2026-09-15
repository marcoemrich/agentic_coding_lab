export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

interface QuoteStep { op: "quote"; items: Item[] }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
interface Damage { itemType: string; amount: number }
interface Policy { items: Item[]; remainingCap: number }
type Result = { premium: number } | { payout: number; remainingCap: number };

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_PERCENT = 20;
const FOLLOW_UP_PERCENT = 15;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_SAVING = 15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_PERCENT = 50;
const ITEM_TERMS: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

function componentBlockSaving(items: Item[], componentType: string): number {
  const alikeCount = items.filter((item) => item.type === componentType).length;
  return alikeCount === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_SAVING : 0;
}

function cursedItemSurcharge(items: Item[]): number {
  return items
    .filter((item) => item.cursed)
    .reduce((total, item) => total + ITEM_TERMS[item.type].basePremium * CURSE_PERCENT / PERCENT, 0);
}

function enchantedItemSurcharge(items: Item[]): number {
  return items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((total, item) => total + ITEM_TERMS[item.type].basePremium * HIGH_ENCHANTMENT_PERCENT / PERCENT, 0);
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_PERCENT / PERCENT : 0;
}

function followUpContractDiscount(basePremium: number, previousContracts: number): number {
  return previousContracts > 0 ? basePremium * FOLLOW_UP_PERCENT / PERCENT : 0;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts = 0): number {
  const unknownItem = items.find((item) => ITEM_TERMS[item.type] === undefined);
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
  const itemPremiums = items.reduce((total, item) => total + ITEM_TERMS[item.type].basePremium, 0);
  const basePremium = itemPremiums
    - componentBlockSaving(items, "rune")
    - componentBlockSaving(items, "moonstone");
  return Math.ceil(basePremium + cursedItemSurcharge(items) + enchantedItemSurcharge(items)
    + basePremium * FIRST_INSURANCE_PERCENT / PERCENT
    - loyaltyDiscount(basePremium, yearsWithMHPCO)
    - followUpContractDiscount(basePremium, previousContracts) + PROCESSING_FEE);
}

function reimbursedDamage(item: Item, amount: number): number {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * HALF_REIMBURSEMENT_PERCENT / PERCENT
    : amount;
}

function coveredItemsForDamages(items: Item[], damages: Damage[]): Item[] {
  const available = [...items];
  return damages.map((damage) => {
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    return available.splice(itemIndex, 1)[0];
  });
}

function assertValidDamageAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Negative damage amount");
}

function settleClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  assertValidDamageAmounts(damages);
  const coveredItems = coveredItemsForDamages(policy.items, damages);
  const desiredPayout = damages.reduce((sum, damage, index) => {
    return sum + Math.max(reimbursedDamage(coveredItems[index], damage.amount) - DEDUCTIBLE, 0);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + ITEM_TERMS[item.type].insuranceValue, 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount);
      policies.set(index, createPolicy(step.items));
      results.push({ premium });
      quoteCount += 1;
    } else {
      const policy = policies.get(step.policy);
      if (!policy) throw new Error("Unknown policy");
      results.push(settleClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
