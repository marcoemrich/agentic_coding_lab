export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLIER = 2;
const SPECIAL_ENCHANTMENT_LEVEL = 8;
const SPECIAL_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;

function isComponentType(type: string): boolean {
  return type === "rune" || type === "moonstone";
}

function itemBasePremium(item: Item): number {
  if (item.type === "sword") return SWORD_BASE_PREMIUM;
  if (item.type === "staff") return STAFF_BASE_PREMIUM;
  if (item.type === "potion") return POTION_BASE_PREMIUM;
  if (item.type === "amulet") return AMULET_BASE_PREMIUM;
  if (isComponentType(item.type)) return COMPONENT_BASE_PREMIUM;
  throw new Error("Unknown item type");
}

function componentGroupPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * COMPONENT_BASE_PREMIUM;
}

function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponentType(item.type));
  const mainPremium = mainItems.reduce((total, item) => total + itemBasePremium(item), 0);
  return mainPremium
    + componentGroupPremium(items, "rune")
    + componentGroupPremium(items, "moonstone");
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const base = itemBasePremium(item);
    const curse = item.cursed === true ? base * CURSE_SURCHARGE_RATE : 0;
    const enchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
      ? base * ENCHANTMENT_SURCHARGE_RATE
      : 0;
    return total + curse + enchanted;
  }, 0);
}

function policyModifiers(base: number, yearsWithMHPCO: number, priorContracts: number): number {
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = priorContracts > 0 ? base * FOLLOW_UP_DISCOUNT_RATE : 0;
  return base * INITIAL_ASSESSMENT_RATE - loyalty - followUp;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, priorContracts: number): number {
  const base = policyBasePremium(items);
  return Math.ceil(base + itemSurcharges(items)
    + policyModifiers(base, yearsWithMHPCO, priorContracts) + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceValue(item: Item): number {
  if (item.type === "sword") return SWORD_INSURANCE_VALUE;
  if (item.type === "amulet") return AMULET_INSURANCE_VALUE;
  if (item.type === "staff") return STAFF_INSURANCE_VALUE;
  if (item.type === "potion") return POTION_INSURANCE_VALUE;
  if (isComponentType(item.type)) return COMPONENT_INSURANCE_VALUE;
  throw new Error("Unknown item type");
}

function damagePayout(item: Item, amount: number): number {
  if (amount < 0) throw new Error("Damage amount cannot be negative");
  const reimbursement = (item.enchantment ?? 0) >= SPECIAL_ENCHANTMENT_LEVEL
    ? amount * SPECIAL_REIMBURSEMENT_RATE
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  const available = [...policy.items];
  const desired = damages.reduce((total, damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error("Damage item is not insured");
    const [item] = available.splice(index, 1);
    return total + damagePayout(item, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let priorContracts = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const insuranceSum = step.items.reduce((sum, item) => sum + insuranceValue(item), 0);
      policies.set(index, { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      results.push({
        premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, priorContracts),
      });
      priorContracts += 1;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error("Policy does not exist");
      results.push(processClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
