export type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;
export type Customer = { yearsWithMHPCO: number };
export type Scenario = { customer: Customer; steps: Step[] };
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;
export type ScenarioOutcome = { results: Result[] };

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

const FIRST_INSURANCE_SURCHARGE = 1.1;
const PROCESSING_FEE = 5;

// Guards against binary-float artifacts (e.g. 52.800000000000004) tipping an
// exact value over a whole-gold boundary and inflating the premium by 1 G.
const FLOAT_ARTIFACT_PRECISION = 6;

const roundUpToWholeGold = (amount: number): number =>
  Math.ceil(Number(amount.toFixed(FLOAT_ARTIFACT_PRECISION)));

// Multipliers on the base premium, not amounts added to it.
const CURSED_RISK_FACTOR = 1.5;
const HIGH_ENCHANTMENT_RISK_FACTOR = 1.3;
const NO_ADDED_RISK = 1;

const HIGH_ENCHANTMENT_LEVEL = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

// Risks compound: an item that is both cursed and highly enchanted carries
// both factors.
const riskFactorOf = (item: Item): number =>
  (item.cursed ? CURSED_RISK_FACTOR : NO_ADDED_RISK) *
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_RISK_FACTOR : NO_ADDED_RISK);

// The price-list value adjusted for the item's own risk — not the bare
// BASE_PREMIUMS figure.
const riskAdjustedPremiumOf = (item: Item): number =>
  BASE_PREMIUMS[item.type] * riskFactorOf(item);

const BUILDING_BLOCK_SIZE = 3;
const BUILDING_BLOCK_PREMIUM = 60;

const areAlike = (items: Item[]): boolean =>
  items.every((item) => item.type === items[0].type);

const sumOfPremiums = (items: Item[]): number =>
  items.reduce((total, item) => total + riskAdjustedPremiumOf(item), 0);

// An unalike list forms no blocks at all, however many items it holds.
const buildingBlockCountOf = (items: Item[]): number =>
  areAlike(items) ? Math.floor(items.length / BUILDING_BLOCK_SIZE) : 0;

// Alike items group into building blocks priced below the sum of their members'
// individual premiums; everything left over prices individually.
const blockPricedTotalOf = (items: Item[]): number => {
  const blocks = buildingBlockCountOf(items);
  const looseItems = items.slice(blocks * BUILDING_BLOCK_SIZE);

  return blocks * BUILDING_BLOCK_PREMIUM + sumOfPremiums(looseItems);
};

const LOYALTY_DISCOUNT_FACTOR = 0.8;
const LOYALTY_YEARS = 2;
const NO_DISCOUNT = 1;

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

const loyaltyFactorOf = (customer: Customer): number =>
  isLongStanding(customer) ? LOYALTY_DISCOUNT_FACTOR : NO_DISCOUNT;

const REPEAT_CONTRACT_DISCOUNT_FACTOR = 0.85;

// The first contract carries the initial assessment surcharge; every contract
// after it earns the repeat-contract discount instead.
const contractFactorOf = (contractIndex: number): number =>
  contractIndex === 0 ? FIRST_INSURANCE_SURCHARGE : REPEAT_CONTRACT_DISCOUNT_FACTOR;

// Risk factors attach to a single item; these attach to the policy as a whole,
// so they multiply the block-priced total once rather than per item.
const policyFactorOf = (customer: Customer, contractIndex: number): number =>
  contractFactorOf(contractIndex) * loyaltyFactorOf(customer);

// The fee is a flat charge on top of the rounded premium, so it sits outside
// the rounding rather than being rounded along with it.
const premiumFor = (items: Item[], policyFactor: number): number =>
  roundUpToWholeGold(blockPricedTotalOf(items) * policyFactor) + PROCESSING_FEE;

const DEDUCTIBLE_PER_INCIDENT = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);

// A policy is created by a quote step; claims refer back to it by that step's
// index and draw down a shared cap.
type Policy = { items: Item[]; cap: number; paidOut: number };

const policyFor = (items: Item[]): Policy => ({
  items,
  cap: insuranceSumOf(items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
  paidOut: 0,
});

const DEEP_ENCHANTMENT_LEVEL = 8;
const VOLATILE_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// A separate rule from the risk surcharge's HIGH_ENCHANTMENT_LEVEL, at its own
// threshold: that one prices a policy, this one settles a claim.
const isDeeplyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= DEEP_ENCHANTMENT_LEVEL;

const DRAGON_MATERIAL = "dragon";

const isDragonMade = (item: Item): boolean => item.material === DRAGON_MATERIAL;

// Deep enchantment makes an item volatile — except dragon material, which is
// impervious to it.
const isVolatile = (item: Item): boolean =>
  isDeeplyEnchanted(item) && !isDragonMade(item);

// The MHPCO reimburses only half the damage to a volatile item.
const reimbursementRateOf = (item: Item): number =>
  isVolatile(item) ? VOLATILE_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;

const reimbursementForDamage = (damage: Damage, insuredItems: Item[]): number => {
  const damagedItem = insuredItems.find((item) => item.type === damage.itemType);

  return (
    damage.amount *
    (damagedItem ? reimbursementRateOf(damagedItem) : FULL_REIMBURSEMENT_RATE)
  );
};

// One incident can damage several items; each is reimbursed at its own rate
// before the single per-incident deductible comes off the total.
const totalReimbursementOf = (incident: Incident, insuredItems: Item[]): number =>
  incident.damages.reduce(
    (total, damage) => total + reimbursementForDamage(damage, insuredItems),
    0,
  );

// Read fresh on each side of the draw-down below: the same expression means
// the ceiling before paying out and the reported balance after.
const remainingCapOf = (policy: Policy): number => policy.cap - policy.paidOut;

// Settling a claim draws down the policy's cap, so the policy is mutated here
// rather than returned alongside the result.
const settleClaim = (policy: Policy, incident: Incident): ClaimResult => {
  // Damage at or below the deductible pays nothing; it never refunds cap.
  const dueAfterDeductible = Math.max(
    totalReimbursementOf(incident, policy.items) - DEDUCTIBLE_PER_INCIDENT,
    0,
  );
  // A policy pays out at most its cap, however much damage is claimed.
  const payout = Math.min(dueAfterDeductible, remainingCapOf(policy));

  policy.paidOut += payout;
  return { payout, remainingCap: remainingCapOf(policy) };
};

// Only quote steps take out a contract, so the contract number advances
// independently of the step number: an intervening claim must not consume one.
export const runScenario = (scenario: Scenario): ScenarioOutcome => {
  const policies = new Map<number, Policy>();
  let contractIndex = 0;

  const quote = (step: QuoteStep, stepIndex: number): QuoteResult => {
    policies.set(stepIndex, policyFor(step.items));
    const premium = premiumFor(
      step.items,
      policyFactorOf(scenario.customer, contractIndex),
    );

    contractIndex += 1;
    return { premium };
  };

  const results = scenario.steps.map((step, stepIndex): Result =>
    step.op === "claim"
      ? settleClaim(policies.get(step.policy)!, step.incident)
      : quote(step, stepIndex),
  );

  return { results };
};
