const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const EQUIPMENT_CONFIG: Record<string, { premium: number; insuranceValue: number }> = {
  sword: { premium: 100, insuranceValue: 1000 },
  amulet: { premium: 60, insuranceValue: 600 },
  staff: { premium: 80, insuranceValue: 800 },
  potion: { premium: 40, insuranceValue: 400 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

type Item = { type: string; cursed?: boolean; enchantment?: number };

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const getBaseEquipmentPremium = (item: Item): number =>
  EQUIPMENT_CONFIG[item.type]?.premium ?? 0;

const calculateItemPremium = (item: Item): number => {
  const base = getBaseEquipmentPremium(item);
  const curseSurcharge = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return base + curseSurcharge + enchantmentSurcharge;
};

const calculateComponentSubtotal = (componentItems: Item[]): number => {
  const counts: Record<string, number> = {};
  for (const item of componentItems) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return Object.values(counts).reduce(
    (sum, count) => sum + (count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM),
    0,
  );
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const getInsuranceValue = (itemType: string): number =>
  COMPONENT_TYPES.has(itemType) ? COMPONENT_INSURANCE_VALUE : (EQUIPMENT_CONFIG[itemType]?.insuranceValue ?? 0);

const KNOWN_TYPES = new Set([...Object.keys(EQUIPMENT_CONFIG), ...COMPONENT_TYPES]);

const processClaim = (
  policy: { items: Item[]; remainingCap: number },
  damages: Array<{ itemType: string; amount: number }>,
): { payout: number; remainingCap: number } => {
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!policy.items.some((i) => i.type === damage.itemType)) {
      throw new Error(`Item type not in policy: ${damage.itemType}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCounts)) {
    const policyCount = policy.items.filter((i) => i.type === type).length;
    if (count > policyCount) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }
  const uncappedPayout = damages.reduce((sum, damage) => {
    const item = policy.items.find((i) => i.type === damage.itemType)!;
    const reimbursement = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_CLAIM_RATE
      : damage.amount;
    return sum + (reimbursement - DEDUCTIBLE);
  }, 0);
  const totalPayout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

const calculateEquipmentTotals = (equipmentItems: Item[]): { subtotal: number; baseTotal: number } =>
  equipmentItems.reduce(
    (totals, item) => ({
      subtotal: totals.subtotal + calculateItemPremium(item),
      baseTotal: totals.baseTotal + getBaseEquipmentPremium(item),
    }),
    { subtotal: 0, baseTotal: 0 },
  );

const calculateQuotePremium = (
  items: Item[],
  customer: { yearsWithMHPCO: number },
  quoteNumber: number,
): number => {
  for (const item of items) {
    if (!KNOWN_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const equipmentItems = items.filter((item) => !isComponent(item));
  const componentItems = items.filter(isComponent);
  const { subtotal: equipmentSubtotal, baseTotal: equipmentBaseTotal } = calculateEquipmentTotals(equipmentItems);
  const componentSubtotal = calculateComponentSubtotal(componentItems);
  const itemSubtotal = equipmentSubtotal + componentSubtotal;
  const policyModifierBase = equipmentBaseTotal + componentSubtotal;
  const firstInsuranceSurcharge = policyModifierBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? policyModifierBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount =
    quoteNumber > 1 ? policyModifierBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(itemSubtotal + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount) + PROCESSING_FEE;
};

export function processScenario(scenario: unknown): unknown {
  const input = scenario as {
    customer: { yearsWithMHPCO: number };
    steps: Array<{
      op: string;
      items?: Item[];
      policy?: number;
      incident?: { cause: string; damages: Array<{ itemType: string; amount: number }> };
    }>;
  };
  const { customer } = input;
  let quoteCount = 0;
  const policies: Map<number, { items: Item[]; remainingCap: number }> = new Map();
  const results = input.steps.map((step, index) => {
    if (step.op === "quote") {
      quoteCount++;
      const items = step.items ?? [];
      const insuranceSum = items.reduce((sum, item) => sum + getInsuranceValue(item.type), 0);
      policies.set(index, { items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      return { premium: calculateQuotePremium(items, customer, quoteCount) };
    }
    if (step.op === "claim") {
      const policy = policies.get(step.policy!)!;
      return processClaim(policy, step.incident!.damages);
    }
    return {};
  });
  return { results };
}
