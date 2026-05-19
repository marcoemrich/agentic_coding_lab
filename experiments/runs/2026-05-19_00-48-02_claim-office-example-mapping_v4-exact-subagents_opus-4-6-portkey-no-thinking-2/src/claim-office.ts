type Customer = {
  yearsAsCustomer: number;
  quoteCount: number;
};

type Item = {
  type: string;
  material: string;
  enchantment: number;
  cursed: boolean;
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const componentPremium = (type: string, count: number): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * BASE_PREMIUMS[type];

const itemSurcharge = (item: Item, basePremium: number): number =>
  (item.cursed ? basePremium * CURSED_SURCHARGE_RATE : 0) +
  (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const loyaltyDiscount = (customer: Customer, basePremium: number): number =>
  customer.yearsAsCustomer >= LOYALTY_YEARS_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const followUpDiscount = (customer: Customer, basePremium: number): number =>
  customer.quoteCount >= 1
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;

const componentBasePremium = (components: Item[]): number => {
  const counts: Record<string, number> = {};
  for (const item of components) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  return Object.entries(counts).reduce(
    (sum, [type, count]) => sum + componentPremium(type, count),
    0,
  );
};

const nonComponentTotals = (items: Item[]): { basePremium: number; surcharges: number } =>
  items.reduce(
    (acc, item) => {
      const base = BASE_PREMIUMS[item.type];
      return {
        basePremium: acc.basePremium + base,
        surcharges: acc.surcharges + itemSurcharge(item, base),
      };
    },
    { basePremium: 0, surcharges: 0 },
  );

export function quote(customer: Customer, items: Item[]): number {
  if (items.length === 0) return PROCESSING_FEE;

  const components = items.filter(isComponent);
  const nonComponents = items.filter((item) => !isComponent(item));

  const { basePremium: nonComponentBase, surcharges } = nonComponentTotals(nonComponents);
  const basePremium = nonComponentBase + componentBasePremium(components);

  const totalPremium =
    basePremium +
    surcharges +
    basePremium * FIRST_INSURANCE_RATE -
    loyaltyDiscount(customer, basePremium) -
    followUpDiscount(customer, basePremium);

  return Math.ceil(totalPremium + PROCESSING_FEE);
}

type DamageEntry = {
  itemType: string;
  amount: number;
};

type Incident = {
  damages: DamageEntry[];
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const isHighEnchantment = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD;

const reimbursableDamage = (item: Item | undefined, rawAmount: number): number => {
  const adjustedAmount = isHighEnchantment(item)
    ? rawAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : rawAmount;
  return adjustedAmount - DEDUCTIBLE;
};

export function claim(items: Item[], incident: Incident, previousPayouts: number = 0) {
  const insuranceSum = items.reduce(
    (sum, item) => sum + INSURANCE_VALUES[item.type],
    0,
  );
  const cap = CAP_MULTIPLIER * insuranceSum;

  const totalPayout = incident.damages.reduce(
    (sum, damage) => {
      const matchingItem = items.find((item) => item.type === damage.itemType);
      return sum + reimbursableDamage(matchingItem, damage.amount);
    },
    0,
  );

  const effectiveCap = cap - previousPayouts;
  const cappedPayout = Math.floor(Math.min(totalPayout, effectiveCap));

  return { payout: cappedPayout, remainingCap: effectiveCap - cappedPayout };
}
