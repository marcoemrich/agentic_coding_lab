type Item = { type: string; material: string; enchantment: number; cursed: boolean };
type Customer = { yearsWithMHPCO: number; previousContracts?: number };
type QuoteInput = { customer: Customer; items: Item[] };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE = 25;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

export function quote(input: QuoteInput): { premium: number } {
  if (input.items.length === 0) return { premium: PROCESSING_FEE };

  let policyBase = 0;
  let itemSurcharges = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of input.items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      const base = BASE_PREMIUMS[item.type];
      policyBase += base;
      if (item.cursed) {
        itemSurcharges += base * CURSE_SURCHARGE;
      }
      if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemSurcharges += base * HIGH_ENCHANTMENT_SURCHARGE;
      }
    }
  }
  for (const count of Object.values(componentCounts)) {
    if (count === 3) {
      policyBase += 60;
    } else {
      policyBase += count * COMPONENT_BASE;
    }
  }
  let policyModifiers = 0;
  policyModifiers += policyBase * FIRST_INSURANCE_SURCHARGE;
  if ((input.customer.previousContracts ?? 0) >= 1) {
    policyModifiers -= policyBase * FOLLOW_UP_DISCOUNT;
  }
  if (input.customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    policyModifiers -= policyBase * LOYALTY_DISCOUNT;
  }
  const total = Math.ceil(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
  return { premium: total };
}

type ClaimItem = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Policy = { items: ClaimItem[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimOptions = { remainingCap?: number };

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;

export function claim(
  policy: Policy,
  incident: Incident,
  options?: ClaimOptions,
): { payout: number; remainingCap: number } {
  const insuranceSum = policy.items.reduce(
    (sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0),
    0,
  );
  const cap = options?.remainingCap ?? insuranceSum * 2;

  let totalPayout = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    if (!item) continue;
    let reimbursement = damage.amount;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      reimbursement = damage.amount * 0.5;
    } else if (item.material === "dragon") {
      reimbursement = damage.amount;
    }
    const afterDeductible = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += afterDeductible;
  }

  const payout = Math.floor(Math.min(totalPayout, cap));
  return { payout, remainingCap: cap - payout };
}
