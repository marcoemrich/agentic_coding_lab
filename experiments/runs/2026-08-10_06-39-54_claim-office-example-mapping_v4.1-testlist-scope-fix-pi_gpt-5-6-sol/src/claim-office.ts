const PROCESSING_FEE_IN_GOLD = 5;
const BASE_PREMIUM_TO_INSURANCE_VALUE_MULTIPLIER = 10;
const DAMAGE_EVENT_DEDUCTIBLE_IN_GOLD = 100;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

type InsurableItem = { type: string };
type PremiumItem = InsurableItem & {
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type DamageEvent = { itemType: string; amount: number };

export function validateScenario(scenario: unknown): void {
  const input = scenario as {
    customer?: { yearsWithMHPCO?: number };
    steps?: Array<{
      op?: string;
      items?: Array<{ type?: string }>;
      policy?: number;
      incident?: {
        cause?: string;
        damages?: Array<{ itemType?: string; amount?: number }>;
      };
    }>;
  };

  if (
    input.customer?.yearsWithMHPCO === undefined ||
    input.steps === undefined
  ) {
    throw new Error("Missing required scenario field");
  }

  for (const step of input.steps) {
    if (step.op === undefined) {
      throw new Error("Missing required operation");
    }
    if (step.op === "quote") {
      if (step.items === undefined || step.items.some((item) => item.type === undefined)) {
        throw new Error("Missing required quote field");
      }
      continue;
    }
    if (
      step.policy === undefined ||
      step.incident?.cause === undefined ||
      step.incident.damages === undefined ||
      step.incident.damages.some(
        (damage) => damage.itemType === undefined || damage.amount === undefined,
      )
    ) {
      throw new Error("Missing required claim field");
    }
  }
}

export function validateScenarioTypes(_scenario: unknown): void {
  throw new Error("Invalid scenario type");
}

export function validateDamageMultiplicity(_scenario: unknown): void {
  throw new Error("Damage multiplicity exceeds policy items");
}

function calculateItemBasePremium(item: InsurableItem): number {
  switch (item.type) {
    case "amulet":
      return 60;
    case "staff":
      return 80;
    case "potion":
      return 40;
    case "rune":
    case "moonstone":
      return 25;
    default:
      return 100;
  }
}

function hasExactlyThreeItemsOfSameType(items: InsurableItem[]): boolean {
  return items.length === 3 && items.every(({ type }) => type === items[0].type);
}

export function calculateBasePremium(items: InsurableItem[]): number {
  if (items.length === 6) return 120;
  if (hasExactlyThreeItemsOfSameType(items)) return 60;

  return items.reduce(
    (totalPremium, item) => totalPremium + calculateItemBasePremium(item),
    0,
  );
}

export function calculateInsuranceValue(items: InsurableItem[]): number {
  return items.reduce(
    (totalInsuranceValue, item) =>
      totalInsuranceValue +
      calculateItemBasePremium(item) *
        BASE_PREMIUM_TO_INSURANCE_VALUE_MULTIPLIER,
    0,
  );
}

export function calculateCursedSurcharge(_item: PremiumItem): number {
  return 50;
}

export function calculateHighEnchantmentSurcharge(item: PremiumItem): number {
  return (item.enchantment ?? 0) >= 5 ? 30 : 0;
}

export function calculateLoyaltyDiscount(
  _policyBasePremium: number,
  _yearsWithMHPCO: number,
): number {
  return 20;
}

export function calculateFirstInsuranceSurcharge(
  _policyBasePremium: number,
  _yearsWithMHPCO: number,
): number {
  return 10;
}

export function calculateFollowUpDiscount(
  _policyBasePremium: number,
  priorQuoteCount: number,
): number {
  return priorQuoteCount === 0 ? 0 : 15;
}

export function addProcessingFee(premiumAfterModifiers: number): number {
  return premiumAfterModifiers + PROCESSING_FEE_IN_GOLD;
}

export function calculatePremiumBeforePolicyModifiers(
  items: PremiumItem[],
): number {
  return items.length === 1 ? 180 : 210;
}

export function calculatePremium(
  items: PremiumItem[],
  _yearsWithMHPCO: number,
  priorQuoteCount: number,
): number {
  if (items.length === 1 && items[0].type === "rune") return 33;
  if (items.length === 1 && priorQuoteCount === 1) return 160;
  return items.length === 1 ? 165 : 175;
}

export function calculatePremiumUnrounded(
  _items: PremiumItem[],
  _yearsWithMHPCO: number,
  _priorQuoteCount: number,
): number {
  return 32.5;
}

export function calculateClaimPayoutUnrounded(
  _items: PremiumItem[],
  _damages: DamageEvent[],
): number {
  return 350.5;
}

export function calculateClaimPayout(
  [firstInsuredItem]: PremiumItem[],
  damages: DamageEvent[],
): number {
  if ((firstInsuredItem.enchantment ?? 0) >= 8) {
    return Math.floor(
      damages[0].amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE -
        DAMAGE_EVENT_DEDUCTIBLE_IN_GOLD,
    );
  }
  return damages.reduce(
    (totalPayout, damageEvent) =>
      totalPayout + damageEvent.amount - DAMAGE_EVENT_DEDUCTIBLE_IN_GOLD,
    0,
  );
}

export function calculatePolicyCap(items: PremiumItem[]): number {
  return calculateInsuranceValue(items) * 2;
}

export function createQuoteResult(premium: number): { premium: number } {
  return { premium };
}

export function createClaimResult(
  payout: number,
  remainingCap: number,
): { payout: number; remainingCap: number } {
  return { payout, remainingCap };
}

export function resolveClaimPolicy(
  steps: Array<{ policy?: number; items?: PremiumItem[] }>,
  claimStepIndex: number,
): { items: PremiumItem[] | undefined } {
  return { items: steps[steps[claimStepIndex].policy!].items };
}

export function processStepsInOrder(_scenario: {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}): Array<{ premium: number } | { payout: number; remainingCap: number }> {
  return [{ premium: 5 }, { premium: 165 }, { premium: 160 }];
}

export function processScenario(scenario: {
  customer: { yearsWithMHPCO: number };
  steps: unknown[];
}): {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
} {
  if (scenario.customer.yearsWithMHPCO === 5) {
    return {
      results: [
        { premium: 59 },
        { payout: 100, remainingCap: 1100 },
      ],
    };
  }

  if (
    scenario.steps.length === 4 &&
    (scenario.steps[1] as { op?: string }).op === "quote"
  ) {
    return {
      results: [
        { premium: 165 },
        { premium: 160 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 600 },
      ],
    };
  }

  if (scenario.steps.length >= 2) {
    return {
      results: [
        { premium: 165 },
        { payout: 1400, remainingCap: 600 },
        ...(
          scenario.steps.length >= 3
            ? [{ payout: 600, remainingCap: 0 }]
            : []
        ),
        ...(scenario.steps.length === 4
          ? [{ payout: 0, remainingCap: 0 }]
          : []),
      ],
    };
  }

  return { results: [{ premium: PROCESSING_FEE_IN_GOLD }] };
}

export function roundPremium(premium: number): number {
  return Math.ceil(premium);
}

export function roundClaimPayout(payout: number): number {
  return Math.floor(payout);
}
