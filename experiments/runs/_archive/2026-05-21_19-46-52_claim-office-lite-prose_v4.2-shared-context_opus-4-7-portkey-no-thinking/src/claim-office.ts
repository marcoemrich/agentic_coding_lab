type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
};
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };

const FIRST_INSURANCE_MULTIPLIER = 1.1;
const POST_FIRST_CONTRACT_MULTIPLIER = 0.85;
const CURSED_MULTIPLIER = 1.5;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const HIGH_ENCHANTMENT_PREMIUM_MULTIPLIER = 1.3;
const LOYALTY_MULTIPLIER = 0.8;
const LOYALTY_YEARS_THRESHOLD = 2;
const ADMIN_FEE = 5;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_FRACTION = 0.5;

// Three alike pieces of a "building-block" item (rune, moonstone, …) pool
// to a single unit priced at this fixed tier, irrespective of the per-piece
// BASE_PRICE. The tier coincidentally equals amulet's base price today but
// is conceptually a separate pricing rule from the per-item ladder.
const BUILDING_BLOCK_PRICE = 60;

const BASE_PRICE: Record<string, number> = {
  sword: 100,
  staff: 80,
  amulet: 60,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const POOLED_TYPES = new Set(["rune", "moonstone"]);

function itemModifierMultiplier(item: Item): number {
  const cursed = item.cursed ? CURSED_MULTIPLIER : 1;
  const highEnchantment =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD
      ? HIGH_ENCHANTMENT_PREMIUM_MULTIPLIER
      : 1;
  return cursed * highEnchantment;
}

// MHPCO always rounds the euro value of a discounted/loaded price upward
// (in the office's favour). The toFixed(10) step strips IEEE-754 drift so
// values that are mathematically integer (e.g. 100 × 1.10 = 110) don't get
// bumped up a euro by a 110.00000000000001 representation.
function ceilInMhpcoFavor(value: number): number {
  return Math.ceil(Number(value.toFixed(10)));
}

// Sum of per-item base prices (with item-attribute multipliers applied)
// for a single quote. Building-block items (rune today, moonstone in cycle
// 13) are pooled in groups of three at BUILDING_BLOCK_PRICE; leftovers fall
// back to the per-piece BASE_PRICE.
function quoteItemsSubtotal(items: Item[]): number {
  let subtotal = 0;
  const pooledCounts = new Map<string, number>();
  for (const item of items) {
    if (POOLED_TYPES.has(item.type)) {
      pooledCounts.set(item.type, (pooledCounts.get(item.type) ?? 0) + 1);
    } else {
      subtotal += BASE_PRICE[item.type] * itemModifierMultiplier(item);
    }
  }
  for (const [type, count] of pooledCounts) {
    const buildingBlocks = Math.floor(count / 3);
    const loose = count % 3;
    subtotal += buildingBlocks * BUILDING_BLOCK_PRICE + loose * BASE_PRICE[type];
  }
  return subtotal;
}

// Reimbursement percentage by item attribute (dragon material always wins
// today; enchantment 9 and other tiers will join here in later cycles).
function itemReimbursementFraction(item: Item | undefined): number {
  if (item?.material === "dragon") return 1;
  if ((item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD)
    return HIGH_ENCHANTMENT_REIMBURSEMENT_FRACTION;
  return 0;
}

// Look up the insured item on the originating quote (referenced by
// `claimStep.policy` as an index into the step list), compute the
// reimbursement for the incident, subtract the flat deductible, and floor
// the payout at zero.
function claimPayout(claimStep: ClaimStep, allSteps: Step[]): { payout: number } {
  const policyStep = allSteps[claimStep.policy] as QuoteStep;
  const reimbursement = claimStep.incident.damages.reduce((sum, damage) => {
    const item = policyStep.items.find((quotedItem) => quotedItem.type === damage.itemType);
    return sum + damage.amount * itemReimbursementFraction(item);
  }, 0);
  return { payout: Math.max(0, reimbursement - DEDUCTIBLE) };
}

export function runScenario(scenario: unknown): unknown {
  const { customer, steps } = scenario as Scenario;
  const loyaltyMultiplier =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_MULTIPLIER : 1;
  const results = steps.map((step, quoteIndex) => {
    if (step.op === "claim") return claimPayout(step, steps);
    const itemsSubtotal = quoteItemsSubtotal(step.items);
    const contractMultiplier =
      quoteIndex === 0 ? FIRST_INSURANCE_MULTIPLIER : POST_FIRST_CONTRACT_MULTIPLIER;
    const premium =
      ceilInMhpcoFavor(itemsSubtotal * loyaltyMultiplier * contractMultiplier) +
      ADMIN_FEE;
    return { premium };
  });
  return { results };
}
