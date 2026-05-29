interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteInput {
  customer: { yearsWithMHPCO: number };
  items: QuoteItem[];
  contractIndex?: number;
  firstInsurance?: boolean;
  followUp?: boolean;
}

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;

const HIGH_ENCHANTMENT_QUOTE_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function tallyBy<T>(items: T[], keyOf: (item: T) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = keyOf(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function countByType(items: QuoteItem[]): Map<string, number> {
  return tallyBy(items, (item) => item.type);
}

function priceGroup(type: string, count: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : BASE_PREMIUMS[type] * count;
}

function surchargeFor(
  items: QuoteItem[],
  applies: (item: QuoteItem) => boolean,
  rate: number,
): number {
  let surcharge = 0;
  for (const item of items) {
    if (applies(item)) {
      surcharge += BASE_PREMIUMS[item.type] * rate;
    }
  }
  return surcharge;
}

function curseSurchargeFor(items: QuoteItem[]): number {
  return surchargeFor(items, (item) => item.cursed === true, CURSE_SURCHARGE_RATE);
}

function highEnchantmentSurchargeFor(items: QuoteItem[]): number {
  return surchargeFor(
    items,
    (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_QUOTE_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );
}

function policyBasePremiumFor(items: QuoteItem[]): number {
  const countsByType = countByType(items);

  let basePremium = 0;
  for (const [type, count] of countsByType) {
    basePremium += priceGroup(type, count);
  }
  return basePremium;
}

function itemSurchargesFor(items: QuoteItem[]): number {
  return curseSurchargeFor(items) + highEnchantmentSurchargeFor(items);
}

const LOYALTY_YEARS_THRESHOLD = 2;

// Signed rates of the policy base premium: discounts are negative, surcharges positive.
const LOYALTY_DISCOUNT_RATE = -0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = -0.15;

function policyWideModifiersFor(input: QuoteInput, policyBasePremium: number): number {
  const activeRates = [
    { active: input.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD, rate: LOYALTY_DISCOUNT_RATE },
    { active: input.firstInsurance, rate: FIRST_INSURANCE_SURCHARGE_RATE },
    { active: input.followUp, rate: FOLLOW_UP_DISCOUNT_RATE },
  ];

  let total = 0;
  for (const { active, rate } of activeRates) {
    if (active) {
      total += policyBasePremium * rate;
    }
  }
  return total;
}

function rejectUnknownItemTypes(items: QuoteItem[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type "${item.type}"`);
    }
  }
}

export function quote(input: QuoteInput): number {
  rejectUnknownItemTypes(input.items);
  const policyBasePremium = policyBasePremiumFor(input.items);
  const premiumWithSurcharges = policyBasePremium + itemSurchargesFor(input.items);
  const policyWideModifiers = policyWideModifiersFor(input, policyBasePremium);
  return Math.ceil(premiumWithSurcharges + policyWideModifiers + PROCESSING_FEE);
}

interface ClaimPolicy {
  items: QuoteItem[];
}

interface ClaimDamage {
  itemType: string;
  amount: number;
}

interface ClaimIncident {
  cause: string;
  damages: ClaimDamage[];
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function isHighlyEnchanted(item: QuoteItem | undefined): boolean {
  return (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function insuredItemFor(damage: ClaimDamage, policy: ClaimPolicy): QuoteItem | undefined {
  return policy.items.find((item) => item.type === damage.itemType);
}

function rejectNegativeDamages(incident: ClaimIncident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount for "${damage.itemType}" cannot be negative`);
    }
  }
}

function rejectDamagesNotCoveredByPolicy(incident: ClaimIncident, policy: ClaimPolicy): void {
  const insuredCounts = countByType(policy.items);
  const damageCounts = tallyBy(incident.damages, (damage) => damage.itemType);

  for (const [itemType, damageCount] of damageCounts) {
    if (damageCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`Damage references more "${itemType}" items than the policy insures`);
    }
  }
}

function validateIncident(incident: ClaimIncident, policy: ClaimPolicy): void {
  rejectNegativeDamages(incident);
  rejectDamagesNotCoveredByPolicy(incident, policy);
}

function reimbursementFor(damage: ClaimDamage, policy: ClaimPolicy): number {
  const insuredItem = insuredItemFor(damage, policy);
  if (isHighlyEnchanted(insuredItem)) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
}

function payoutFor(incident: ClaimIncident, policy: ClaimPolicy): number {
  let payout = 0;
  for (const damage of incident.damages) {
    payout += reimbursementFor(damage, policy) - DEDUCTIBLE;
  }
  return payout;
}

function capFor(policy: ClaimPolicy): number {
  let insuranceTotal = 0;
  for (const item of policy.items) {
    insuranceTotal += INSURANCE_VALUES[item.type];
  }
  return CAP_MULTIPLIER * insuranceTotal;
}

export function claim(
  policy: ClaimPolicy,
  incident: ClaimIncident,
  remainingCap?: number,
): ClaimResult {
  validateIncident(incident, policy);
  const rawPayout = payoutFor(incident, policy);
  const availableCap = remainingCap ?? capFor(policy);
  const payout = Math.min(rawPayout, availableCap);
  return { payout, remainingCap: availableCap - payout };
}
