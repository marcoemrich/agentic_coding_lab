export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] } | { op: "claim"; policy: number; incident: Incident }>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const SWORD_PREMIUM = 100;
const AMULET_PREMIUM = 60;
const STAFF_PREMIUM = 80;
const POTION_PREMIUM = 40;
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const SWORD_INSURANCE_VALUE = 1000;
const AMULET_INSURANCE_VALUE = 600;
const STAFF_INSURANCE_VALUE = 800;
const POTION_INSURANCE_VALUE = 400;
const COMPONENT_INSURANCE_VALUE = 250;
const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function itemBasePremium(item: Item): number {
  if (item.type === "sword") return SWORD_PREMIUM;
  if (item.type === "amulet") return AMULET_PREMIUM;
  if (item.type === "staff") return STAFF_PREMIUM;
  if (item.type === "potion") return POTION_PREMIUM;
  if (item.type === "rune" || item.type === "moonstone") return COMPONENT_PREMIUM;
  return 0;
}

function quote(items: Item[], yearsWithMHPCO: number, isFollowup: boolean): { premium: number } {
  if (items.some((item) => itemBasePremium(item) === 0)) throw new Error("Unknown item type in quote");
  const listedPremium = items.reduce((total, item) => total + itemBasePremium(item), 0);
  const runeCount = items.filter((item) => item.type === "rune").length;
  const moonstoneCount = items.filter((item) => item.type === "moonstone").length;
  const blockCount = Number(runeCount === COMPONENT_BLOCK_SIZE) + Number(moonstoneCount === COMPONENT_BLOCK_SIZE);
  const basePremium = listedPremium - blockCount * COMPONENT_BLOCK_DISCOUNT;
  const curseSurcharge = items.reduce(
    (total, item) => total + (item.cursed === true ? itemBasePremium(item) * CURSE_SURCHARGE_RATE : 0),
    0,
  );
  const enchantmentSurcharge = items.reduce(
    (total, item) => total + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? itemBasePremium(item) * ENCHANTMENT_SURCHARGE_RATE : 0),
    0,
  );
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followupDiscount = isFollowup ? basePremium * FOLLOWUP_DISCOUNT_RATE : 0;
  return { premium: Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge - loyaltyDiscount + basePremium * INITIAL_ASSESSMENT_RATE - followupDiscount + PROCESSING_FEE) };
}

function itemInsuranceValue(item: Item): number {
  if (item.type === "sword") return SWORD_INSURANCE_VALUE;
  if (item.type === "amulet") return AMULET_INSURANCE_VALUE;
  if (item.type === "staff") return STAFF_INSURANCE_VALUE;
  if (item.type === "potion") return POTION_INSURANCE_VALUE;
  if (item.type === "rune" || item.type === "moonstone") return COMPONENT_INSURANCE_VALUE;
  return 0;
}

function damagePayout(damage: Incident["damages"][number], availableItems: Item[]): number {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
  const coveredIndex = availableItems.findIndex((item) => item.type === damage.itemType);
  if (coveredIndex < 0) throw new Error("Damage item is not covered by policy");
  const [item] = availableItems.splice(coveredIndex, 1);
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function claim(policy: Policy, incident: Incident): { payout: number; remainingCap: number } {
  const availableItems = [...policy.items];
  const desiredPayout = incident.damages.reduce(
    (total, damage) => total + damagePayout(damage, availableItems),
    0,
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies: Array<Policy | undefined> = [];
  const results = scenario.steps.map((step, index): Result => {
    if (step.op === "claim") {
      const policy = policies[step.policy];
      if (policy === undefined) throw new Error("Claim references an unknown policy");
      return claim(policy, step.incident);
    }
    policies[index] = { items: step.items, remainingCap: step.items.reduce((total, item) => total + itemInsuranceValue(item), 0) * POLICY_CAP_MULTIPLIER };
    const result = quote(step.items, scenario.customer.yearsWithMHPCO, quoteCount > 0);
    quoteCount += 1;
    return result;
  });
  return { results };
}
