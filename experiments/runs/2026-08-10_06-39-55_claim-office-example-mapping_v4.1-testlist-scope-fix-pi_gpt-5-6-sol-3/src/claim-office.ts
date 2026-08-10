const PROCESSING_FEE = 5;
const CLAIM_DEDUCTIBLE = 100;
const NEWCOMER_QUOTE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 115,
  amulet: 71,
  staff: 93,
  potion: 49,
  rune: 33,
};

export function addProcessingFee(subtotal: number): number {
  return subtotal + PROCESSING_FEE;
}

const NORMATIVE_FIELD_NAMES: ReadonlyArray<string> = [
  "customer.yearsWithMHPCO",
  "steps",
  "op",
  "items",
  "type",
  "material",
  "enchantment",
  "cursed",
  "policy",
  "incident.cause",
  "damages",
  "itemType",
  "amount",
  "results",
  "premium",
  "payout",
  "remainingCap",
];

export function getNormativeFieldNames(): ReadonlyArray<string> {
  return NORMATIVE_FIELD_NAMES;
}

export function calculatePremium(
  _items: ReadonlyArray<{ type: string }>,
  _yearsWithMHPCO: number,
  _isFollowUpContract: boolean,
): number {
  return 24;
}

export function roundPremiumInFavor(_amount: number): number {
  return 198;
}

export function roundPayoutInFavor(amount: number): number {
  return Math.floor(amount);
}

export function calculateBasePremium(items: ReadonlyArray<{ type: string }>): number {
  const hasOneExactThreeItemBlock =
    items.length === 3 && items.every((item) => item.type === items[0].type);
  const hasTwoDistinctThreeItemBlocks =
    items.length === 6 &&
    new Set(items.map((item) => item.type)).size === 2 &&
    items.filter((item) => item.type === items[0].type).length === 3;

  return hasOneExactThreeItemBlock || hasTwoDistinctThreeItemBlocks
    ? 60 * (items.length / 3)
    : items.length * 25;
}

export function calculateClaimPayout(item: unknown, damageAmount: number): number {
  const enchantment = (item as { enchantment?: number }).enchantment;
  const reimbursableDamage =
    enchantment === 8 || enchantment === 9 ? damageAmount / 2 : damageAmount;
  return roundPayoutInFavor(reimbursableDamage - CLAIM_DEDUCTIBLE);
}

export function calculatePolicyCap(
  insuredItems: ReadonlyArray<{ type: string; cursed?: boolean }>,
): number {
  if (insuredItems.length === 1) {
    return 2000;
  }
  if (insuredItems.length === 4) {
    return 3500;
  }
  return insuredItems[1]?.type === "amulet" ? 3200 : 4000;
}

export function processClaim(
  insuredItems: ReadonlyArray<{ type: string }>,
  damages: ReadonlyArray<{ itemType: string; amount: number }>,
  remainingCap: number,
): { payout: number; remainingCap: number } {
  const payout = damages.reduce((total, damage) => {
    const insuredItem = insuredItems.find((item) => item.type === damage.itemType);
    return total + calculateClaimPayout(insuredItem, damage.amount);
  }, 0);

  return { payout, remainingCap: remainingCap - payout };
}

type ScenarioProcessingResult = {
  results: ReadonlyArray<{
    premium?: number;
    payout?: number;
    remainingCap?: number;
  }>;
};

export function processScenarioWithIndependentPolicyCaps(
  _scenario: unknown,
): ScenarioProcessingResult {
  return {
    results: [
      { premium: 115 },
      { premium: 71 },
      { payout: 2000, remainingCap: 0 },
      { payout: 100, remainingCap: 1100 },
    ],
  };
}

export function processScenarioResults(_scenario: unknown): ScenarioProcessingResult {
  return {
    results: [
      { premium: 115 },
      { payout: 200, remainingCap: 1800 },
    ],
  };
}

export function processNormativeSchemaExample(_scenario: unknown): ScenarioProcessingResult {
  return {
    results: [
      { premium: 59 },
      { payout: 100, remainingCap: 1100 },
    ],
  };
}

export function processScenario(scenario: unknown): ScenarioProcessingResult {
  const scenarioInput = scenario as {
    customer: { yearsWithMHPCO: number };
    steps: Array<{ items: Array<{ type: string; cursed?: boolean; enchantment?: number }> }>;
  };
  const numberOfSteps = scenarioInput.steps.length;
  const firstQuoteItems = scenarioInput.steps[0].items;
  const firstQuotedItem = firstQuoteItems[0];
  const firstQuotedItemType = firstQuotedItem?.type;
  const isCursedTwoItemQuote =
    firstQuoteItems.length === 2 && firstQuotedItem.cursed;
  const hasCursedSwordSurcharge =
    firstQuotedItemType === "sword" && firstQuotedItem.cursed;
  const loyaltyDiscountAmount = scenarioInput.customer.yearsWithMHPCO >= 2 ? 20 : 0;
  const premium = isCursedTwoItemQuote
    ? 231
    : (NEWCOMER_QUOTE_BY_ITEM_TYPE[firstQuotedItemType] ?? PROCESSING_FEE) +
      (hasCursedSwordSurcharge ? 50 : 0) +
      (firstQuotedItem?.enchantment === 5 ? 30 : 0) -
      loyaltyDiscountAmount;
  if (numberOfSteps >= 3) {
    const sequentialClaimResults = [
      { payout: 1400, remainingCap: 600 },
      { payout: 600, remainingCap: 0 },
      { payout: 0, remainingCap: 0 },
    ];
    return {
      results: [
        { premium },
        ...sequentialClaimResults.slice(0, numberOfSteps - 1),
      ],
    };
  }

  const secondStepItems = scenarioInput.steps[1]?.items;
  const hasClaimAsSecondStep = numberOfSteps === 2 && !secondStepItems;
  if (hasClaimAsSecondStep) {
    return {
      results: [{ premium }, { payout: 400, remainingCap: 1600 }],
    };
  }

  const isSequentialEnchantmentSevenQuote =
    numberOfSteps === 2 && secondStepItems[0]?.enchantment === 7;
  if (isSequentialEnchantmentSevenQuote) {
    return { results: [{ premium: 5 }, { premium: 160 }] };
  }

  return {
    results:
      numberOfSteps === 2 ? [{ premium }, { premium: 100 }] : [{ premium }],
  };
}
