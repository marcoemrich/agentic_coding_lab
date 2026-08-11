// === Types ===
type Customer = { yearsWithMHPCO: number };
type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

// === Premium constants ===
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// === Component-block constants ===
const BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

// === Policy / claim constants ===
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE_MULTIPLIER = 10;
const HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

// === Generic helpers ===
const sumBy = <T>(items: T[], selector: (item: T) => number): number =>
  items.reduce((sum, item) => sum + selector(item), 0);

const rateIfApplies = (applies: boolean, base: number, rate: number): number =>
  applies ? base * rate : 0;

const requireDefined = <T>(value: T | undefined, message: string): T => {
  if (value === undefined) throw new Error(message);
  return value;
};

// === Base premium ===
const basePremium = (item: Item): number =>
  requireDefined(BASE_PREMIUMS[item.type], `unknown item type: ${item.type}`);

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const isCursed = (item: Item): boolean => item.cursed ?? false;

const itemSurcharge = (item: Item): number => {
  const base = basePremium(item);
  return rateIfApplies(isCursed(item), base, CURSE_RATE)
       + rateIfApplies(isHighlyEnchanted(item), base, HIGH_ENCHANTMENT_RATE);
};

const isComponentBlock = (sameTypeItems: Item[]): boolean =>
  sameTypeItems.length === BLOCK_SIZE && COMPONENT_TYPES.includes(sameTypeItems[0].type);

const groupBasePremium = (sameTypeItems: Item[]): number =>
  isComponentBlock(sameTypeItems) ? COMPONENT_BLOCK_PRICE : sumBy(sameTypeItems, basePremium);

const groupBy = <T>(items: T[], key: (item: T) => string): Map<string, T[]> => {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const k = key(item);
    const bucket = groups.get(k) ?? [];
    bucket.push(item);
    groups.set(k, bucket);
  }
  return groups;
};

const totalBasePremium = (items: Item[]): number =>
  sumBy([...groupBy(items, (i) => i.type).values()], groupBasePremium);

// === Policy-wide premium modifiers ===
const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const loyaltyDiscount = (base: number, customer: Customer): number =>
  rateIfApplies(isLoyal(customer), base, LOYALTY_DISCOUNT_RATE);

const firstInsuranceSurcharge = (base: number): number => base * FIRST_INSURANCE_RATE;

const followupDiscount = (base: number, isFollowup: boolean): number =>
  rateIfApplies(isFollowup, base, FOLLOWUP_DISCOUNT_RATE);

const premiumForItems = (items: Item[], customer: Customer, isFollowup: boolean): number => {
  const base = totalBasePremium(items);
  const surcharges = sumBy(items, itemSurcharge) + firstInsuranceSurcharge(base);
  const discounts = loyaltyDiscount(base, customer) + followupDiscount(base, isFollowup);
  return Math.ceil(base + surcharges - discounts + PROCESSING_FEE);
};

// === Insurance / cap ===
const insuranceValue = (item: Item): number => basePremium(item) * INSURANCE_VALUE_MULTIPLIER;

const insuranceSum = (items: Item[]): number => sumBy(items, insuranceValue);

const policyCap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

// === Claim payout ===
const qualifiesForHalfReimbursement = (item: Item): boolean =>
  enchantmentLevel(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;

const reimbursementRate = (item: Item): number =>
  qualifiesForHalfReimbursement(item) ? HALF_REIMBURSEMENT_RATE : 1;

const applyDeductible = (amount: number): number => Math.max(0, amount - DEDUCTIBLE);

const findInsuredItem = (items: Item[], itemType: string): Item =>
  requireDefined(items.find((i) => i.type === itemType), `uninsured item type: ${itemType}`);

const damagePayout = (damage: Damage, item: Item): number =>
  applyDeductible(damage.amount * reimbursementRate(item));

const assertNonNegativeAmount = (damage: Damage): void => {
  if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
};

const countBy = <T>(items: T[], key: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const assertDamageCountsWithinInsured = (damages: Damage[], items: Item[]): void => {
  const insuredCounts = countBy(items, (i) => i.type);
  const damageCounts = countBy(damages, (d) => d.itemType);
  for (const [itemType, damageCount] of damageCounts) {
    if (damageCount > (insuredCounts.get(itemType) ?? 0)) {
      throw new Error(`more damages of type ${itemType} than insured`);
    }
  }
};

const assertValidDamages = (damages: Damage[], items: Item[]): void => {
  damages.forEach(assertNonNegativeAmount);
  assertDamageCountsWithinInsured(damages, items);
};

const claimPayout = (damages: Damage[], policy: Policy): number => {
  assertValidDamages(damages, policy.items);
  const rawPayout = sumBy(damages, (d) => damagePayout(d, findInsuredItem(policy.items, d.itemType)));
  return Math.min(Math.floor(rawPayout), policy.remainingCap);
};

// === Step handlers ===
const handleQuote = ({ items }: QuoteStep, customer: Customer, policies: Policy[]) => {
  const isFollowup = policies.length > 0;
  const premium = premiumForItems(items, customer, isFollowup);
  policies.push({ items, remainingCap: policyCap(items) });
  return { premium };
};

const handleClaim = ({ policy: policyIndex, incident }: ClaimStep, policies: Policy[]) => {
  const policy = policies[policyIndex];
  const payout = claimPayout(incident.damages, policy);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = ({ customer, steps }: Scenario): unknown => {
  const policies: Policy[] = [];
  const results = steps.map((step) =>
    step.op === "quote" ? handleQuote(step, customer, policies) : handleClaim(step, policies),
  );
  return { results };
};
