const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const CLAIM_DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 20;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

const COMPONENT_TYPES = new Set(["rune"]);

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Step {
  op: string;
  items?: Item[];
  item?: Item;
  damage?: number;
}

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

function getItemBasePremium(item: Item): number {
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_PREMIUM;
  if (!(item.type in MAIN_ITEM_PREMIUMS)) throw new Error(`Unknown item type: ${item.type}`);
  return MAIN_ITEM_PREMIUMS[item.type];
}

function calculatePolicyBase(items: Item[]): number {
  let base = 0;
  const componentCounts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      base += getItemBasePremium(item);
    }
  }
  for (const [, count] of componentCounts) {
    base += count === 3 ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
  }
  return base;
}

function calculateItemSurcharges(items: Item[]): number {
  let surcharges = 0;
  for (const item of items) {
    const itemBase = getItemBasePremium(item);
    if (item.cursed) surcharges += itemBase * CURSED_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) surcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharges;
}

function calculatePolicyModifiers(policyBase: number, customer: Customer, isFollowUp: boolean): number {
  let modifiers = policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    modifiers -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUp) {
    modifiers -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }
  return modifiers;
}

function processQuote(items: Item[], customer: Customer, isFollowUp: boolean): { premium: number; cap: number } {
  const policyBase = calculatePolicyBase(items);
  const itemSurcharges = calculateItemSurcharges(items);
  const policyModifiers = calculatePolicyModifiers(policyBase, customer, isFollowUp);
  const premium = Math.ceil(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
  const cap = items.length > 0 ? getItemBasePremium(items[0]) * CAP_MULTIPLIER : 0;
  return { premium, cap };
}

function getReimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return 1;
}

function processClaim(item: Item, damage: number, remainingCap: number): { payout: number; remainingCap: number } {
  if (damage < 0) throw new Error("Damage amount cannot be negative");
  const reimbursement = damage * getReimbursementRate(item);
  const uncappedPayout = Math.floor(reimbursement - CLAIM_DEDUCTIBLE);
  const payout = Math.min(uncappedPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
}

export function processScenario(scenario: Scenario): unknown {
  let remainingCap = 0;
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const claimResult = processClaim(step.item!, step.damage!, remainingCap);
      remainingCap = claimResult.remainingCap;
      return claimResult;
    }
    const quoteResult = processQuote(step.items ?? [], scenario.customer, index > 0);
    remainingCap = quoteResult.cap;
    return { premium: quoteResult.premium };
  });
  return { results };
}
