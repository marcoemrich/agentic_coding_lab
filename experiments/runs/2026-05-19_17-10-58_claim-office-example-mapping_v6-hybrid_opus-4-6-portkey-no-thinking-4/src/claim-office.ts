type PolicyItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type ComponentItem = {
  type: string;
};

type Damage = {
  type: string;
  amount: number;
};

type QuoteStep = {
  op: "quote";
  items: (PolicyItem | ComponentItem)[];
};

type ClaimStep = {
  op: "claim";
  damages: Damage[];
};

type Step = QuoteStep | ClaimStep;

type Customer = {
  yearsWithMHPCO: number;
};

type Scenario = {
  customer: Customer;
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type ScenarioResult = { results: (QuoteResult | ClaimResult)[] };

const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const basePremiumForType = (type: string): number => {
  if (!(type in BASE_PREMIUMS)) throw new Error(`Unknown item type: ${type}`);
  return BASE_PREMIUMS[type];
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const PAYOUT_CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const calculateInsuranceSum = (items: PolicyItem[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);

const calculatePayoutCap = (items: PolicyItem[]): number =>
  calculateInsuranceSum(items) * PAYOUT_CAP_MULTIPLIER;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const componentPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * basePremiumForType(type);

const itemSurcharge = (item: PolicyItem): number => {
  const base = basePremiumForType(item.type);
  return (item.cursed ? base * CURSED_SURCHARGE_RATE : 0)
    + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);
};

const countByType = (items: { type: string }[]): Record<string, number> =>
  items.reduce((counts: Record<string, number>, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});

const isComponent = (item: PolicyItem | ComponentItem): boolean => COMPONENT_TYPES.includes(item.type);

const calculateQuotePremium = (items: (PolicyItem | ComponentItem)[], customer: Customer, stepIndex: number): number => {
  const regularItems = items.filter((item): item is PolicyItem => !isComponent(item));
  const components = items.filter(isComponent);

  const regularBasePremium = regularItems.reduce(
    (sum, item) => sum + basePremiumForType(item.type), 0);
  const componentBasePremium = Object.entries(countByType(components)).reduce(
    (sum, [type, count]) => sum + componentPremium(type, count), 0);
  const policyBasePremium = regularBasePremium + componentBasePremium;

  const totalSurcharges = regularItems.reduce(
    (sum, item) => sum + itemSurcharge(item), 0);

  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = stepIndex > 0 ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
  const firstInsuranceSurcharge = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;

  const premium = policyBasePremium + totalSurcharges - loyaltyDiscount
    + firstInsuranceSurcharge - followUpDiscount;
  return Math.ceil(premium + PROCESSING_FEE);
};

const isHighEnchantment = (policyItem: PolicyItem): boolean =>
  (policyItem.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD;

const reimbursableAmount = (damage: Damage, policyItem: PolicyItem): number =>
  isHighEnchantment(policyItem)
    ? damage.amount * CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const validateDamages = (damages: Damage[], policyItems: PolicyItem[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const policyCounts = countByType(policyItems);
  const damageCounts = countByType(damages);
  for (const [type, count] of Object.entries(damageCounts)) {
    if ((policyCounts[type] ?? 0) < count) {
      throw new Error(`More damages of type ${type} than policy covers`);
    }
  }
};

const calculateClaimPayout = (damages: Damage[], policyItems: PolicyItem[], remainingCap: number): { payout: number; remainingCap: number } => {
  validateDamages(damages, policyItems);
  const uncappedPayout = damages.reduce((payout, damage) => {
    const policyItem = policyItems.find((item) => item.type === damage.type);
    if (!policyItem) throw new Error(`Damage for item type not in policy: ${damage.type}`);
    return payout + Math.max(0, reimbursableAmount(damage, policyItem) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(uncappedPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};

type ProcessingState = {
  policyItems: PolicyItem[];
  remainingCap: number;
  results: (QuoteResult | ClaimResult)[];
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const initialState: ProcessingState = { policyItems: [], remainingCap: 0, results: [] };
  const finalState = scenario.steps.reduce((state, step, index) => {
    if (step.op === "claim") {
      const claimResult = calculateClaimPayout(step.damages, state.policyItems, state.remainingCap);
      return {
        ...state,
        remainingCap: claimResult.remainingCap,
        results: [...state.results, { payout: claimResult.payout, remainingCap: claimResult.remainingCap }],
      };
    }
    const policyItems = step.items as PolicyItem[];
    return {
      policyItems,
      remainingCap: calculatePayoutCap(policyItems),
      results: [...state.results, { premium: calculateQuotePremium(step.items, scenario.customer, index) }],
    };
  }, initialState);
  return { results: finalState.results };
};
