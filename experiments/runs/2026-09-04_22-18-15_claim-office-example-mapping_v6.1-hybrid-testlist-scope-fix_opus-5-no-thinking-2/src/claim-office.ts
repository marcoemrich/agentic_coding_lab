export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const FIRST_INSURANCE_SURCHARGE = 0.1;

/** The MHPCO's catalogue of insurable items. Base premium and insurance value are
 *  independent figures; they are listed together because they describe one item type. */
const ITEM_CATALOGUE: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

const catalogueEntry = (item: Item): { basePremium: number; insuranceValue: number } => {
  const entry = ITEM_CATALOGUE[item.type];
  if (entry === undefined) {
    throw new Error(`The MHPCO does not insure items of type: ${item.type}`);
  }
  return entry;
};

const itemBasePremium = (item: Item): number => catalogueEntry(item).basePremium;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const sumOfItemBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemBasePremium(item), 0);

const itemsGroupedByType = (items: Item[]): Item[][] => {
  const byType = new Map<string, Item[]>();
  for (const item of items) {
    byType.set(item.type, [...(byType.get(item.type) ?? []), item]);
  }
  return [...byType.values()];
};

const formsBlock = (sameTypeItems: Item[]): boolean => sameTypeItems.length === BLOCK_SIZE;

const sameTypeBasePremium = (sameTypeItems: Item[]): number =>
  formsBlock(sameTypeItems) ? BLOCK_BASE_PREMIUM : sumOfItemBasePremiums(sameTypeItems);

const policyBasePremium = (items: Item[]): number =>
  itemsGroupedByType(items).reduce(
    (sum, sameTypeItems) => sum + sameTypeBasePremium(sameTypeItems),
    0,
  );

const withFirstInsuranceSurcharge = (policyBase: number): number =>
  policyBase + policyBase * FIRST_INSURANCE_SURCHARGE;

const roundPremiumInMHPCOsFavor = Math.ceil;

const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

/** An item with no recorded enchantment is treated as wholly unenchanted. */
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

interface RiskSurcharge {
  appliesTo: (item: Item) => boolean;
  rateOfBasePremium: number;
}

const RISK_SURCHARGES: RiskSurcharge[] = [
  { appliesTo: isCursed, rateOfBasePremium: 0.5 },
  { appliesTo: isHighlyEnchanted, rateOfBasePremium: 0.3 },
];

const itemRiskSurcharge = (item: Item): number =>
  RISK_SURCHARGES.filter((surcharge) => surcharge.appliesTo(item)).reduce(
    (sum, surcharge) => sum + itemBasePremium(item) * surcharge.rateOfBasePremium,
    0,
  );

const totalRiskSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemRiskSurcharge(item), 0);

/** Who the policy is for, and where it sits in their history with the MHPCO. */
interface QuoteContext {
  customer: Customer;
  isFollowUpContract: boolean;
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;

const isLoyal = (context: QuoteContext): boolean =>
  context.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const loyaltyDiscount = (policyBase: number, context: QuoteContext): number =>
  isLoyal(context) ? policyBase * LOYALTY_DISCOUNT : 0;

const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

const followUpContractDiscount = (policyBase: number, context: QuoteContext): number =>
  context.isFollowUpContract ? policyBase * FOLLOW_UP_CONTRACT_DISCOUNT : 0;

const policyWidePremium = (policyBase: number, context: QuoteContext): number =>
  withFirstInsuranceSurcharge(policyBase) -
  loyaltyDiscount(policyBase, context) -
  followUpContractDiscount(policyBase, context);

const premiumBeforeFee = (items: Item[], context: QuoteContext): number =>
  policyWidePremium(policyBasePremium(items), context) + totalRiskSurcharges(items);

const quotePremium = (items: Item[], context: QuoteContext): number =>
  roundPremiumInMHPCOsFavor(premiumBeforeFee(items, context) + PROCESSING_FEE);

/** Payouts round down, premiums round up — both in the MHPCO's favor. */
const roundPayoutInMHPCOsFavor = Math.floor;

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const itemInsuranceValue = (item: Item): number => catalogueEntry(item).insuranceValue;

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

interface Policy {
  items: Item[];
  remainingCap: number;
}

/** The high-enchantment clause: damage to a heavily enchanted item is reimbursed at half
 *  rate, on the theory that its enchantment shares the blame. Distinct from the quote-time
 *  high-enchantment surcharge, which has its own (lower) threshold. */
const HIGH_ENCHANTMENT_CLAUSE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAUSE_RATE = 0.5;

const fallsUnderHighEnchantmentClause = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAUSE_THRESHOLD;

const damageAfterEnchantmentClause = (damage: Damage, damagedItem: Item): number =>
  fallsUnderHighEnchantmentClause(damagedItem)
    ? damage.amount * HIGH_ENCHANTMENT_CLAUSE_RATE
    : damage.amount;

/** A damage entry together with the one insured item it is claimed against. */
interface ClaimedDamage {
  damage: Damage;
  damagedItem: Item;
}

const settledAmount = ({ damage, damagedItem }: ClaimedDamage): number =>
  damageAfterEnchantmentClause(damage, damagedItem) - DEDUCTIBLE_PER_DAMAGE;

/** A loss the MHPCO could owe money for never runs backwards. */
const rejectNegativeDamageAmount = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
};

/** Each damage entry consumes its own insured item, so a policy covering two swords can
 *  suffer two separate sword damages — but never more than it covers. Pairing every damage
 *  up front keeps the consumption explicit rather than hiding it in the payout sum. */
const pairDamagesWithInsuredItems = (
  damages: Damage[],
  insuredItems: Item[],
): ClaimedDamage[] => {
  const unclaimedItems = [...insuredItems];
  return damages.map((damage) => {
    rejectNegativeDamageAmount(damage);
    const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Item not covered by policy: ${damage.itemType}`);
    }
    const [damagedItem] = unclaimedItems.splice(index, 1);
    return { damage, damagedItem };
  });
};

/** What the incident is worth before the policy's cap is taken into account. */
const grossIncidentPayout = (incident: Incident, insuredItems: Item[]): number =>
  pairDamagesWithInsuredItems(incident.damages, insuredItems).reduce(
    (sum, pairing) => sum + settledAmount(pairing),
    0,
  );

/** A claim draws down the policy's remaining cap, so settling one yields a new policy state.
 *  A policy never pays out more than the cap it has left. */
const settleClaim = (policy: Policy, incident: Incident): [ClaimResult, Policy] => {
  const grossPayout = roundPayoutInMHPCOsFavor(grossIncidentPayout(incident, policy.items));
  const payout = Math.min(grossPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  return [{ payout, remainingCap }, { items: policy.items, remainingCap }];
};

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
});

const findPolicy = (policies: Map<number, Policy>, policyRef: number): Policy => {
  const policy = policies.get(policyRef);
  if (policy === undefined) {
    throw new Error(`Unknown policy: ${policyRef}`);
  }
  return policy;
};

/** A quote is a follow-up contract when the customer has already taken out a policy
 *  earlier in the scenario. */
const isPrecededByAQuote = (steps: Step[], stepIndex: number): boolean =>
  steps.slice(0, stepIndex).some((earlier) => earlier.op === "quote");

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();

  const runStep = (step: Step, stepIndex: number): StepResult => {
    if (step.op === "quote") {
      policies.set(stepIndex, openPolicy(step.items));
      const context = {
        customer: scenario.customer,
        isFollowUpContract: isPrecededByAQuote(scenario.steps, stepIndex),
      };
      return { premium: quotePremium(step.items, context) };
    }

    const [result, settledPolicy] = settleClaim(
      findPolicy(policies, step.policy),
      step.incident,
    );
    policies.set(step.policy, settledPolicy);
    return result;
  };

  return { results: scenario.steps.map(runStep) };
};
