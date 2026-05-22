type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause?: string; damages: Damage[] };
type QuoteStep = { op?: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer?: { yearsWithMHPCO?: number }; steps: Step[] };

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PER_ITEM = 25;
const COMPONENT_BLOCK_OF_THREE_BASE = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_MARKUP_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_YEARS_THRESHOLD = 2;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const CLAIM_DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

type PolicyState = { items: Item[]; remainingCap: number };

const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

export function runScenario(input: unknown): unknown {
  const { customer, steps } = input as Scenario;
  const years = customer?.yearsWithMHPCO ?? 0;
  const policies: Record<number, PolicyState> = {};
  const results = steps.map((step, index) => {
    if (step.op === "claim") return computeClaim(step, policies);
    return processQuote(step, index, years, policies);
  });
  return { results };
}

function processQuote(
  step: QuoteStep,
  index: number,
  years: number,
  policies: Record<number, PolicyState>,
): { premium: number } {
  validateItemTypes(step.items);
  const isFollowUp = index >= 1;
  policies[index] = { items: step.items, remainingCap: CAP_MULTIPLIER * insuranceSumFor(step.items) };
  return { premium: computePremium(step.items, years, isFollowUp) };
}

function validateItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function insuranceSumFor(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUE_BY_TYPE[item.type], 0);
}

function computeClaim(step: ClaimStep, policies: Record<number, PolicyState>): { payout: number; remainingCap: number } {
  const policy = policies[step.policy];
  rejectIfAnyNegativeDamageAmount(step.incident.damages);
  rejectIfMoreDamagesThanInsured(step.incident.damages, policy.items);
  const uncappedPayout = Math.floor(totalReimbursement(step.incident.damages, policy.items));
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function rejectIfAnyNegativeDamageAmount(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
}

function rejectIfMoreDamagesThanInsured(damages: Damage[], items: Item[]): void {
  const damageCounts = countByKey(damages, (d) => d.itemType);
  const itemCounts = countByKey(items, (i) => i.type);
  for (const [type, count] of damageCounts) {
    if (count > (itemCounts.get(type) ?? 0)) {
      throw new Error(`More ${type} damages than insured`);
    }
  }
}

function countByKey<T>(values: T[], keyOf: (value: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function totalReimbursement(damages: Damage[], items: Item[]): number {
  return damages.reduce((sum, damage) => sum + reimbursementFor(damage, items), 0);
}

function reimbursementFor(damage: Damage, items: Item[]): number {
  const item = items.find((i) => i.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`Damage refers to item type not in policy: ${damage.itemType}`);
  }
  const rate = isHighlyEnchantedForClaim(item) ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE : 1;
  return Math.max(0, damage.amount * rate - CLAIM_DEDUCTIBLE);
}

function isHighlyEnchantedForClaim(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function computePremium(items: Item[], years: number, isFollowUp: boolean): number {
  if (items.length === 0) return PROCESSING_FEE;
  if (items.every(isComponent)) return componentsPremium(items);
  return mainItemsPremium(items, years, isFollowUp);
}

function mainItemsPremium(items: Item[], years: number, isFollowUp: boolean): number {
  const policyBase = items.reduce((sum, item) => sum + BASE_PREMIUM_BY_TYPE[item.type], 0);
  const itemSubtotalSum = items.reduce((sum, item) => sum + itemSubtotal(item), 0);
  const policyMod = (cond: boolean, rate: number) => (cond ? policyBase * rate : 0);
  const loyaltyDiscount = policyMod(years >= LOYALTY_YEARS_THRESHOLD, LOYALTY_DISCOUNT_RATE);
  const followUpDiscount = policyMod(isFollowUp, FOLLOW_UP_DISCOUNT_RATE);
  return Math.ceil(itemSubtotalSum - loyaltyDiscount - followUpDiscount) + PROCESSING_FEE;
}

function itemSubtotal(item: Item): number {
  const base = BASE_PREMIUM_BY_TYPE[item.type];
  const surchargeIf = (cond: boolean, rate: number) => (cond ? base * rate : 0);
  const cursedSurcharge = surchargeIf(item.cursed === true, CURSED_SURCHARGE_RATE);
  const highEnchSurcharge = surchargeIf(isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE_RATE);
  const firstInsuranceMarkup = base * FIRST_INSURANCE_MARKUP_RATE;
  return base + cursedSurcharge + highEnchSurcharge + firstInsuranceMarkup;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function componentsPremium(items: Item[]): number {
  const runes = items.filter((i) => i.type === "rune").length;
  const moonstones = items.filter((i) => i.type === "moonstone").length;
  return premiumFromBase(componentTypeBase(runes) + componentTypeBase(moonstones));
}

function componentTypeBase(count: number): number {
  return count === 3 ? COMPONENT_BLOCK_OF_THREE_BASE : count * COMPONENT_BASE_PER_ITEM;
}

function isComponent(item: Item): boolean {
  return item.type === "rune" || item.type === "moonstone";
}

function premiumFromBase(base: number): number {
  return Math.ceil((base * 11) / 10) + PROCESSING_FEE;
}
