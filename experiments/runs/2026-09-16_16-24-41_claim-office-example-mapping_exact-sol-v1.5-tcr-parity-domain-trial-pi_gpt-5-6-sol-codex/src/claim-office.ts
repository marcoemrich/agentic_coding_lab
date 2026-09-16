export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
type Step = QuoteStep | ClaimStep;
export interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }
export interface ScenarioResult { results: Array<Record<string, number>> }
interface Policy { items: Item[]; remainingCap: number }

const PROCESSING_FEE = 5;
const ITEM_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const ITEM_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
const COMPONENT_PREMIUM = 25;
const COMPONENT_VALUE = 250;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const SPECIAL_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;

function isComponent(item: Item): boolean {
  return item.type === "rune" || item.type === "moonstone";
}

function assertKnownItem(item: Item): void {
  if (!isComponent(item) && !(item.type in ITEM_PREMIUM)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

function itemBasePremium(item: Item): number {
  assertKnownItem(item);
  return isComponent(item) ? COMPONENT_PREMIUM : ITEM_PREMIUM[item.type];
}

function itemInsuranceValue(item: Item): number {
  return isComponent(item) ? COMPONENT_VALUE : (ITEM_VALUE[item.type] ?? 0);
}

function policyBasePremium(items: Item[]): number {
  return items.reduce((total, item) => {
    const alikeCount = items.filter((candidate) => candidate.type === item.type).length;
    const price = isComponent(item) && alikeCount === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE
      : itemBasePremium(item);
    return total + price;
  }, 0);
}

function itemRiskSurcharge(item: Item): number {
  const base = itemBasePremium(item);
  const curse = item.cursed ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? base * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quotePremium(items: Item[], years: number, isFollowUp: boolean): number {
  const base = policyBasePremium(items);
  const risk = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + risk + base * INITIAL_ASSESSMENT_RATE - loyalty - followUp + PROCESSING_FEE);
}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function damageReimbursement(item: Item, damage: Damage): number {
  const rate = (item.enchantment ?? 0) >= SPECIAL_ENCHANTMENT_LEVEL
    ? HALF_REIMBURSEMENT_RATE
    : 1;
  return Math.max(0, damage.amount * rate - DEDUCTIBLE);
}

function assertValidDamage(damage: Damage): void {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
}

function processClaim(policy: Policy, damages: Damage[]): Record<string, number> {
  const available = [...policy.items];
  const desired = damages.reduce((sum, damage) => {
    assertValidDamage(damage);
    const itemIndex = available.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`No insured item available for damage: ${damage.itemType}`);
    const [item] = available.splice(itemIndex, 1);
    return sum + damageReimbursement(item, damage);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: Array<Record<string, number>> = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      policies.set(index, createPolicy(step.items));
      quoteCount += 1;
    } else {
      results.push(processClaim(policies.get(step.policy)!, step.incident.damages));
    }
  });
  return { results };
}
