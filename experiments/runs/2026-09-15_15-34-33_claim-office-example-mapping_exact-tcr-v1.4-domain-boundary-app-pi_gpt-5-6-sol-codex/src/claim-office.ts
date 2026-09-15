export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

interface Item { type: string; material?: string; enchantment?: number; cursed?: boolean }
interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Result = { premium: number } | { payout: number; remainingCap: number };
interface Policy { items: Item[]; remainingCap: number }

const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};

function itemBasePremium(item: Item): number {
  const premium = BASE_PREMIUM[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}
function itemSurcharge(item: Item): number {
  const base = itemBasePremium(item);
  const curse = item.cursed === true ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}
function customerAdjustment(base: number, years: number, followUp: boolean): number {
  const loyalty = years >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const followUpDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  return base * INITIAL_ASSESSMENT_RATE - loyalty - followUpDiscount;
}
function policyBasePremium(items: Item[]): number {
  const counts = items.reduce<Record<string, number>>((result, item) => {
    if (item.type === "rune" || item.type === "moonstone") result[item.type] = (result[item.type] ?? 0) + 1;
    return result;
  }, {});
  const unitTotal = items.reduce((sum, item) => sum + itemBasePremium(item), 0);
  const blocks = Object.values(counts).filter((count) => count === COMPONENT_BLOCK_SIZE).length;
  return unitTotal - blocks * (COMPONENT_BLOCK_SIZE * BASE_PREMIUM.rune - COMPONENT_BLOCK_PREMIUM);
}
function quotePremium(step: QuoteStep, scenario: Scenario, stepIndex: number): number {
  const base = policyBasePremium(step.items);
  const risks = step.items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const followUp = scenario.steps.slice(0, stepIndex).some((prior) => prior.op === "quote");
  return Math.ceil(base + risks + customerAdjustment(base, scenario.customer.yearsWithMHPCO, followUp) + PROCESSING_FEE);
}
function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}
function insuredItemForDamage(policy: Policy, damages: Damage[], index: number): Item {
  const damage = damages[index];
  const occurrence = damages.slice(0, index).filter((prior) => prior.itemType === damage.itemType).length;
  const item = policy.items.filter((candidate) => candidate.type === damage.itemType)[occurrence];
  if (item === undefined) throw new Error("Damage item is not insured by policy");
  return item;
}
function damageReimbursement(item: Item, amount: number): number {
  if (amount < 0) throw new Error("Negative damage amount is invalid");
  const eligible = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? amount * HALF_REIMBURSEMENT : amount;
  return Math.max(0, eligible - DEDUCTIBLE);
}
function settleClaim(step: ClaimStep, policy: Policy): Result {
  const damages = step.incident.damages;
  const desired = damages.reduce((sum, damage, index) =>
    sum + damageReimbursement(insuredItemForDamage(policy, damages, index), damage.amount), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") return settleClaim(step, policies.get(step.policy)!);
    policies.set(index, createPolicy(step.items));
    return { premium: quotePremium(step, scenario, index) };
  });
  return { results };
}
