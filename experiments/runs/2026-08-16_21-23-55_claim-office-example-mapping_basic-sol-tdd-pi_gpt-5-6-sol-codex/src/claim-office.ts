const PROCESSING_FEE = 5;
const SWORD_PREMIUM = 100;
const AMULET_PREMIUM = 60;
const STAFF_PREMIUM = 80;
const POTION_PREMIUM = 40;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const CURSE_RATE = 0.5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const FIRST_CONTRACT_INDEX = 0;
const CAP_MULTIPLIER = 2;
const SWORD_VALUE = 1000;
const AMULET_VALUE = 600;
const STAFF_VALUE = 800;
const POTION_VALUE = 400;
const COMPONENT_VALUE = 250;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const ENCHANTED_REIMBURSEMENT_RATE = 0.5;

const MAIN_ITEM_PREMIUMS: Readonly<Record<string, number>> = {
  sword: SWORD_PREMIUM, amulet: AMULET_PREMIUM, staff: STAFF_PREMIUM, potion: POTION_PREMIUM,
};
const ITEM_VALUES: Readonly<Record<string, number>> = {
  sword: SWORD_VALUE, amulet: AMULET_VALUE, staff: STAFF_VALUE, potion: POTION_VALUE,
  rune: COMPONENT_VALUE, moonstone: COMPONENT_VALUE,
};

export interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

export function calculateBasePremium(items: Array<{ type: string }>): number {
  const componentCounts: Record<string, number> = {};
  const regularTotal = items.reduce((total, item) => {
    const isComponent = item.type === "rune" || item.type === "moonstone";
    if (isComponent) componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    return total + (isComponent ? COMPONENT_PREMIUM : (MAIN_ITEM_PREMIUMS[item.type] ?? 0));
  }, 0);
  const blocks = Object.values(componentCounts).filter((count) => count === COMPONENT_BLOCK_SIZE).length;
  return regularTotal - blocks * COMPONENT_BLOCK_DISCOUNT;
}

function quote(items: Item[], years: number, contractIndex: number): number {
  const policyBase = calculateBasePremium(items);
  const itemSurcharges = items.reduce((total, item) => {
    const itemBase = calculateBasePremium([item]);
    const curse = item.cursed === true ? itemBase * CURSE_RATE : 0;
    const enchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? itemBase * HIGH_ENCHANTMENT_RATE : 0;
    return total + curse + enchanted;
  }, 0);
  const loyalty = years >= LOYALTY_YEARS ? policyBase * LOYALTY_RATE : 0;
  const followUp = contractIndex > FIRST_CONTRACT_INDEX ? policyBase * FOLLOW_UP_RATE : 0;
  return Math.ceil(policyBase + itemSurcharges + policyBase * INITIAL_ASSESSMENT_RATE
    - loyalty - followUp + PROCESSING_FEE);
}

function assertKnownItems(items: Item[]): void {
  items.forEach((item) => {
    if (!(item.type in ITEM_VALUES)) throw new Error(`Unknown item type: ${item.type}`);
  });
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (ITEM_VALUES[item.type] ?? 0), 0);
}

function matchDamages(items: Item[], damages: Damage[]): Item[] {
  const available = [...items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item ${damage.itemType} is not covered by the policy`);
    return available.splice(index, 1)[0] as Item;
  });
}

function claim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  damages.forEach((damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
  });
  const matchedItems = matchDamages(policy.items, damages);
  const desired = damages.reduce((sum, damage, index) => {
    const item = matchedItems[index] as Item;
    const reimbursementRate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
      ? ENCHANTED_REIMBURSEMENT_RATE : 1;
    return sum + Math.max(0, damage.amount * reimbursementRate - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = FIRST_CONTRACT_INDEX;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      assertKnownItems(step.items);
      results.push({ premium: quote(step.items, scenario.customer.yearsWithMHPCO, contractIndex) });
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
      contractIndex += 1;
      return;
    }
    const policy = policies.get(step.policy) as Policy;
    results.push(claim(policy, step.incident.damages));
  });
  return { results };
}
