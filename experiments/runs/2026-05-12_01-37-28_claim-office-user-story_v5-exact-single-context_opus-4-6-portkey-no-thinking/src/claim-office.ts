const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  component: 25,
};

const BUILDING_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 150;
const ENCHANTMENT_SURCHARGE = 130;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 80;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 110;
const REPEAT_DISCOUNT = 85;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 50;

interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
  damage?: number;
}
interface Step { op: string; items?: Item[] }
interface Scenario { customer: { yearsWithMHPCO: number }; steps: Step[] }

function calculateQuotePremium(items: Item[], yearsWithMHPCO: number, isFirstContract: boolean): { premium: number } {
  const components = items.filter((i) => i.type === "component");
  const nonComponents = items.filter((i) => i.type !== "component");
  const buildingBlocks = Math.floor(components.length / 3);
  const looseComponents = components.length % 3;
  const basePremium =
    nonComponents.reduce((sum, i) => {
      const cursedFactor = i.cursed ? CURSED_SURCHARGE : 100;
      const enchantFactor = (i.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? ENCHANTMENT_SURCHARGE : 100;
      return sum + BASE_PREMIUMS[i.type] * cursedFactor / 100 * enchantFactor / 100;
    }, 0) +
    buildingBlocks * BUILDING_BLOCK_PREMIUM +
    looseComponents * BASE_PREMIUMS["component"];
  const loyaltyFactor = yearsWithMHPCO >= LOYALTY_THRESHOLD ? LOYALTY_DISCOUNT : 100;
  const contractFactor = isFirstContract ? FIRST_INSURANCE_SURCHARGE : REPEAT_DISCOUNT;
  return { premium: Math.ceil(basePremium * loyaltyFactor / 100 * contractFactor / 100) + PROCESSING_FEE };
}

function getReimbursementRate(item: Item): number {
  if (item.material !== "dragon" && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) return HIGH_ENCHANTMENT_REIMBURSEMENT;
  return 100;
}

function calculateClaimPayout(items: Item[], payoutCap: number): { payout: number } {
  const reimbursableAmount = items.reduce((sum, i) => sum + (i.damage ?? 0) * getReimbursementRate(i) / 100, 0);
  return { payout: Math.floor(Math.min(reimbursableAmount - DEDUCTIBLE, payoutCap)) };
}

export function processScenario(scenario: Scenario): { results: unknown[] } {
  let quoteCount = 0;
  let remainingCap = 0;
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      quoteCount++;
      const quote = calculateQuotePremium(step.items!, scenario.customer.yearsWithMHPCO, quoteCount === 1);
      remainingCap = PAYOUT_CAP_MULTIPLIER * quote.premium;
      return quote;
    }
    if (step.op === "claim") {
      const claim = calculateClaimPayout(step.items!, remainingCap);
      remainingCap -= claim.payout;
      return claim;
    }
    return {};
  });
  return { results };
}
