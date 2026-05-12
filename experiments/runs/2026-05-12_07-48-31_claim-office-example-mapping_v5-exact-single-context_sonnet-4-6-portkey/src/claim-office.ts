type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Step = { op: string; items?: Item[]; policy?: number; incident?: { damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.10;
const LOYALTY_DISCOUNT_RATE = 0.20;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const INSURANCE_MULTIPLIER = 10;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const blockAdjustment = (type: string, items: Item[]): number =>
  items.filter((i) => i.type === type).length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM - COMPONENT_BLOCK_SIZE * COMPONENT_BASE
    : 0;

const ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE,
  moonstone: COMPONENT_BASE,
};

const itemSurcharge = (item: Item): number => {
  const base = ITEM_BASE[item.type];
  return (item.cursed ? base * CURSED_SURCHARGE_RATE : 0)
    + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);
};

export const processScenario = (scenario: Scenario): { results: object[] } => {
  const remainingCaps: Record<number, number> = {};
  return {
    results: scenario.steps.map((step, stepIndex) => {
      if (step.op === "claim") {
        const policyIndex = step.policy!;
        const policyItems = scenario.steps[policyIndex].items ?? [];
        const insuranceSum = policyItems.reduce((sum, item) => sum + ITEM_BASE[item.type] * INSURANCE_MULTIPLIER, 0);
        const cap = CAP_MULTIPLIER * insuranceSum;
        const availableCap = remainingCaps[policyIndex] ?? cap;
        const rawPayout = step.incident!.damages.reduce((sum, d) => {
          const policyItem = policyItems.find((i) => i.type === d.itemType);
          const reimbursement = (policyItem?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
            ? d.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
            : d.amount;
          return sum + reimbursement - DEDUCTIBLE;
        }, 0);
        const payout = Math.min(rawPayout, availableCap);
        const remainingCap = availableCap - payout;
        remainingCaps[policyIndex] = remainingCap;
        return { payout, remainingCap };
      }
      const items = step.items ?? [];
      const policyBase = items.reduce((sum, item) => sum + ITEM_BASE[item.type], 0)
        + blockAdjustment("rune", items)
        + blockAdjustment("moonstone", items);
      const itemSurcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
      const loyaltyDiscount = scenario.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? -policyBase * LOYALTY_DISCOUNT_RATE : 0;
      const followUpDiscount = stepIndex > 0 ? -policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
      const policyModifiers = policyBase * FIRST_INSURANCE_RATE + loyaltyDiscount + followUpDiscount;
      const premium = Math.ceil(policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE);
      return { premium };
    }),
  };
};
