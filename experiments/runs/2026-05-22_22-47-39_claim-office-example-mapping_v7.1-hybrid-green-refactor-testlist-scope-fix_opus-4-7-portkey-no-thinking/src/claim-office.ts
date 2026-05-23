// === Domain types ===
type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

// === Item catalogue ===
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUMS));

// === Premium-side constants ===
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const BLOCK_OF_THREE_BASE_PREMIUM = 60;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_DISCOUNT_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

// === Claim-side constants ===
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

// === Shared utilities ===
const sum = (numbers: number[]): number =>
  numbers.reduce((total, n) => total + n, 0);

// Gold pieces are whole units. Premiums round up (customer pays slightly more);
// payouts round down (insurer pays slightly less) — the asymmetry favors the office.
const roundUpToWholeGold = (amount: number): number => Math.ceil(amount);
const roundDownToWholeGold = (amount: number): number => Math.floor(amount);

const countOccurrences = (keys: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const key of keys) counts[key] = (counts[key] ?? 0) + 1;
  return counts;
};

const rateIfApplies = (amount: number, applies: boolean, rate: number): number =>
  applies ? amount * rate : 0;

// === Premium-side helpers ===
const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type];

const isBlockOfThreeAlike = (items: Item[]): boolean =>
  items.length === 3 && items.every((item) => item.type === items[0].type);

const groupByType = (items: Item[]): Item[][] => {
  const groups: Record<string, Item[]> = {};
  for (const item of items) (groups[item.type] ||= []).push(item);
  return Object.values(groups);
};

const groupBasePremium = (group: Item[]): number =>
  isBlockOfThreeAlike(group)
    ? BLOCK_OF_THREE_BASE_PREMIUM
    : sum(group.map(itemBasePremium));

const itemsBasePremium = (items: Item[]): number =>
  sum(groupByType(items).map(groupBasePremium));

const cursedSurcharge = (item: Item): number =>
  rateIfApplies(itemBasePremium(item), item.cursed === true, CURSED_SURCHARGE_RATE);

const highEnchantmentSurcharge = (item: Item): number =>
  rateIfApplies(
    itemBasePremium(item),
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
    HIGH_ENCHANTMENT_SURCHARGE_RATE,
  );

const itemSurchargesTotal = (items: Item[]): number =>
  sum(items.map((item) => cursedSurcharge(item) + highEnchantmentSurcharge(item)));

const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_SURCHARGE_RATE;

const loyaltyDiscount = (basePremium: number, customer: Customer): number =>
  rateIfApplies(
    basePremium,
    customer.yearsWithMHPCO >= LOYALTY_DISCOUNT_THRESHOLD_YEARS,
    LOYALTY_DISCOUNT_RATE,
  );

const followupDiscount = (basePremium: number, quoteIndex: number): number =>
  rateIfApplies(basePremium, quoteIndex >= 1, FOLLOWUP_DISCOUNT_RATE);

const quotePremiumFor = (items: Item[], customer: Customer, quoteIndex: number): number => {
  const policyBase = itemsBasePremium(items);
  return roundUpToWholeGold(
    policyBase +
      itemSurchargesTotal(items) +
      firstInsuranceSurcharge(policyBase) -
      loyaltyDiscount(policyBase, customer) -
      followupDiscount(policyBase, quoteIndex) +
      PROCESSING_FEE,
  );
};

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !KNOWN_ITEM_TYPES.has(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

// === Claim-side helpers ===
const policyInsuranceSum = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type]));

const newPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * policyInsuranceSum(items),
});

const isHighEnchantmentForReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD;

const effectiveDamage = (item: Item, damageAmount: number): number =>
  isHighEnchantmentForReimbursement(item)
    ? damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damageAmount;

const findPolicyItem = (policyItems: Item[], itemType: string): Item => {
  const found = policyItems.find((item) => item.type === itemType);
  if (!found) throw new Error(`damage references item type '${itemType}' not in policy`);
  return found;
};

const damagePayout = (policyItems: Item[], damage: Damage): number =>
  effectiveDamage(findPolicyItem(policyItems, damage.itemType), damage.amount) - DEDUCTIBLE;

const validateClaim = (policyItems: Item[], damages: Damage[]): void => {
  const negative = damages.find((damage) => damage.amount < 0);
  if (negative) throw new Error(`damage amount must be non-negative: ${negative.amount}`);
  const policyCounts = countOccurrences(policyItems.map((item) => item.type));
  const damageCounts = countOccurrences(damages.map((damage) => damage.itemType));
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`more damages of type '${type}' than policy covers`);
    }
  }
};

const claimResult = (policy: Policy, step: ClaimStep) => {
  validateClaim(policy.items, step.incident.damages);
  const computedPayout = sum(step.incident.damages.map((damage) => damagePayout(policy.items, damage)));
  const payout = roundDownToWholeGold(Math.min(computedPayout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
};

// === Entry point ===
export const runScenario = (input: Scenario): unknown => {
  const results: unknown[] = [];
  const policies: Policy[] = [];
  for (const step of input.steps) {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const premium = quotePremiumFor(step.items, input.customer, policies.length);
      results.push({ premium });
      policies.push(newPolicy(step.items));
    } else {
      const result = claimResult(policies[step.policy], step);
      policies[step.policy].remainingCap = result.remainingCap;
      results.push(result);
    }
  }
  return { results };
};
